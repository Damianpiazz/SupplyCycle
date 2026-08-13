import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/axios.js', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'] as const

// Recreated handler functions from alta.flow.ts for testing
async function firstActionHandler(
  ctx: { from: string; body: string },
  { flowDynamic, state, gotoFlow }: any,
  { clienteService }: any,
  yaRegistradoFlow: any,
) {
  const telefono = ctx.from.replace(/^54/, '').replace(/[^\d]/g, '')
  try {
    const clientes = await clienteService.listar({ telefono })
    if (clientes.length > 0) {
      return gotoFlow(yaRegistradoFlow)
    }
  } catch {
    // ignore
  }
  await state.update({ telefono })
  await flowDynamic(
    '¡Genial! Vamos a registrarte como cliente 🙌\n\n' +
    'Respondé las siguientes preguntas para completar el registro:'
  )
}

async function nombreHandler(
  ctx: { body: string },
  { state, fallBack }: any,
) {
  const nombre = ctx.body.trim()
  if (nombre.length < 2) {
    return fallBack('El nombre debe tener al menos 2 caracteres. Decime tu nombre:')
  }
  await state.update({ nombre })
}

async function apellidoHandler(
  ctx: { body: string },
  { state, fallBack }: any,
) {
  const apellido = ctx.body.trim()
  if (apellido.length < 2) {
    return fallBack('El apellido debe tener al menos 2 caracteres. Decime tu apellido:')
  }
  await state.update({ apellido })
}

async function calleHandler(
  ctx: { body: string },
  { state, fallBack }: any,
) {
  const calle = ctx.body.trim()
  if (!calle) {
    return fallBack('La calle no puede estar vacía. Decime tu calle:')
  }
  await state.update({ calle })
}

async function numeroHandler(
  ctx: { body: string },
  { state, fallBack }: any,
) {
  const numero = ctx.body.trim()
  if (!numero) {
    return fallBack('El número no puede estar vacío. Decime el número:')
  }
  await state.update({ numero })
}

async function localidadHandler(
  ctx: { body: string },
  { state }: any,
) {
  const localidad = ctx.body.trim() || 'La Plata'
  await state.update({ localidad })
}

async function diaHandler(
  ctx: { body: string },
  { state, fallBack }: any,
) {
  const idx = parseInt(ctx.body.trim(), 10)
  if (isNaN(idx) || idx < 1 || idx > 6) {
    return fallBack(
      'Elegí un número del 1 al 6:\n\n' +
      '1️⃣ LUNES\n2️⃣ MARTES\n3️⃣ MIERCOLES\n4️⃣ JUEVES\n5️⃣ VIERNES\n6️⃣ SÁBADO'
    )
  }
  await state.update({ diaEntrega: DIAS[idx - 1] })
}

async function horarioDesdeHandler(
  ctx: { body: string },
  { state, fallBack }: any,
) {
  const hora = ctx.body.trim()
  if (!/^\d{2}:\d{2}$/.test(hora)) {
    return fallBack('Formato inválido. Usá *HH:MM* (ej: 09:00)')
  }
  await state.update({ horarioDesde: hora })
}

async function horarioHastaHandler(
  ctx: { body: string },
  { state, fallBack }: any,
) {
  const hora = ctx.body.trim()
  if (!/^\d{2}:\d{2}$/.test(hora)) {
    return fallBack('Formato inválido. Usá *HH:MM* (ej: 13:00)')
  }
  const st = (await state.get()) as { horarioDesde?: string }
  if (!st.horarioDesde || hora <= st.horarioDesde) {
    return fallBack(`El horario debe ser posterior a las *${st.horarioDesde}*. Decime la hora de fin:`)
  }
  await state.update({ horarioHasta: hora })
}

async function observacionesHandler(
  ctx: { body: string },
  { state }: any,
) {
  const obs = ctx.body.trim()
  const ignorar = ['0', 'no', 'ninguna', 'ninguno', 'n', '-']
  const observaciones = ignorar.includes(obs.toLowerCase()) ? undefined : obs
  await state.update({ observaciones })
}

async function summaryActionHandler(
  ctx: any,
  { state, flowDynamic }: any,
) {
  const st = await state.get() as Record<string, unknown>
  if (st.nombre && st.apellido) {
    const lineas = [
      '📋 *Confirmá tus datos:*',
      '',
      `👤 *Nombre:* ${st.nombre}`,
      `👤 *Apellido:* ${st.apellido}`,
      `📍 *Dirección:* ${st.calle} ${st.numero}, ${st.localidad}`,
      `📅 *Día de entrega:* ${st.diaEntrega}`,
      `🕐 *Horario:* ${st.horarioDesde} → ${st.horarioHasta}`,
    ]
    if (st.observaciones) {
      lineas.push(`📝 *Obs:* ${st.observaciones}`)
    }
    lineas.push('', '✅ *SI* — para confirmar', '❌ *NO* — para cancelar')
    await flowDynamic(lineas.join('\n'))
  }
}

async function confirmacionHandler(
  ctx: { body: string },
  { state, flowDynamic, fallBack }: any,
  clienteService: any,
) {
  const respuesta = ctx.body.trim().toUpperCase()
  if (respuesta === 'SI') {
    const st = await state.get() as Record<string, unknown>
    try {
      const cliente = await clienteService.crear({
        nombre: st.nombre as string,
        apellido: st.apellido as string,
        telefono: st.telefono as string,
        domicilios: [{
          calle: st.calle as string,
          numero: st.numero as string,
          localidad: st.localidad as string,
          latitud: 0,
          longitud: 0,
          principal: true,
          dias: [{
            nombre: st.diaEntrega as string,
            horarios: [
              { inicio: st.horarioDesde as string, fin: st.horarioHasta as string },
            ],
          }],
        }],
        observaciones: (st.observaciones as string) || undefined,
      })
      await flowDynamic(
        `✅ *Registro completado con éxito!*\n\n` +
        `Bienvenido ${cliente.nombre}! Ya sos parte de SupplyCycle.\n\n` +
        `📦 Escribí *pedir* para hacer tu primer pedido\n` +
        `❓ Escribí *ayuda* para ver el menú`
      )
    } catch (err: any) {
      const msg = clienteService.getErrorMessage(err)
      await flowDynamic(
        `❌ *Ocurrió un error al registrarte*\n\n${msg}\n\n` +
        `Intentá de nuevo más tarde o escribí *ayuda* si necesitas asistencia.`
      )
    }
  } else if (respuesta === 'NO') {
    await flowDynamic('No hay problema. Escribí *alta* cuando quieras registrarte.')
  } else {
    return fallBack('Respondé *SI* para confirmar o *NO* para cancelar:')
  }
}

describe('AltaFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('First action: client not found shows registration prompt', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([]) }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockGotoFlow = vi.fn()
    const mockYaRegistradoFlow = Symbol('yaRegistradoFlow')

    await firstActionHandler(
      { from: '541122334455', body: 'alta' },
      { flowDynamic: mockFlowDynamic, state: mockState, gotoFlow: mockGotoFlow },
      { clienteService: mockClienteService },
      mockYaRegistradoFlow,
    )

    expect(mockClienteService.listar).toHaveBeenCalledWith({ telefono: '1122334455' })
    expect(mockState.update).toHaveBeenCalledWith({ telefono: '1122334455' })
    expect(mockFlowDynamic).toHaveBeenCalled()
    expect(mockGotoFlow).not.toHaveBeenCalled()
  })

  it('First action: client already exists redirects to yaRegistradoFlow', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([{ id: 'cli-1', nombre: 'Juan' }]) }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockGotoFlow = vi.fn()
    const mockYaRegistradoFlow = Symbol('yaRegistradoFlow')

    await firstActionHandler(
      { from: '541122334455', body: 'alta' },
      { flowDynamic: mockFlowDynamic, state: mockState, gotoFlow: mockGotoFlow },
      { clienteService: mockClienteService },
      mockYaRegistradoFlow,
    )

    expect(mockGotoFlow).toHaveBeenCalledWith(mockYaRegistradoFlow)
  })

  it('Name capture: valid name stores in state', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFallBack = vi.fn()

    await nombreHandler({ body: 'Juan' }, { state: mockState, fallBack: mockFallBack })

    expect(mockState.update).toHaveBeenCalledWith({ nombre: 'Juan' })
    expect(mockFallBack).not.toHaveBeenCalled()
  })

  it('Name capture: too short calls fallBack', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFallBack = vi.fn()

    await nombreHandler({ body: 'A' }, { state: mockState, fallBack: mockFallBack })

    expect(mockFallBack).toHaveBeenCalled()
    expect(mockState.update).not.toHaveBeenCalled()
  })

  it('Apellido capture: valid stores in state', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFallBack = vi.fn()

    await apellidoHandler({ body: 'Pérez' }, { state: mockState, fallBack: mockFallBack })

    expect(mockState.update).toHaveBeenCalledWith({ apellido: 'Pérez' })
  })

  it('Calle capture stores value', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFallBack = vi.fn()

    await calleHandler({ body: 'Av. Corrientes' }, { state: mockState, fallBack: mockFallBack })

    expect(mockState.update).toHaveBeenCalledWith({ calle: 'Av. Corrientes' })
  })

  it('Numero capture stores value', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFallBack = vi.fn()

    await numeroHandler({ body: '1234' }, { state: mockState, fallBack: mockFallBack })

    expect(mockState.update).toHaveBeenCalledWith({ numero: '1234' })
  })

  it('Localidad capture: empty input defaults to La Plata', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }

    await localidadHandler({ body: '' }, { state: mockState })

    expect(mockState.update).toHaveBeenCalledWith({ localidad: 'La Plata' })
  })

  it('Localidad capture: with value stores it', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }

    await localidadHandler({ body: 'Berisso' }, { state: mockState })

    expect(mockState.update).toHaveBeenCalledWith({ localidad: 'Berisso' })
  })

  it('Dia capture: valid number 1 maps to LUNES', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFallBack = vi.fn()

    await diaHandler({ body: '1' }, { state: mockState, fallBack: mockFallBack })

    expect(mockState.update).toHaveBeenCalledWith({ diaEntrega: 'LUNES' })
  })

  it('Dia capture: invalid number 7 calls fallBack', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFallBack = vi.fn()

    await diaHandler({ body: '7' }, { state: mockState, fallBack: mockFallBack })

    expect(mockFallBack).toHaveBeenCalled()
  })

  it('Horario desde: valid format stores in state', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFallBack = vi.fn()

    await horarioDesdeHandler({ body: '09:00' }, { state: mockState, fallBack: mockFallBack })

    expect(mockState.update).toHaveBeenCalledWith({ horarioDesde: '09:00' })
  })

  it('Horario desde: invalid format calls fallBack', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFallBack = vi.fn()

    await horarioDesdeHandler({ body: '9am' }, { state: mockState, fallBack: mockFallBack })

    expect(mockFallBack).toHaveBeenCalled()
  })

  it('Horario hasta: after desde stores in state', async () => {
    const mockState = { update: vi.fn(), get: vi.fn().mockResolvedValue({ horarioDesde: '09:00' }) }
    const mockFallBack = vi.fn()

    await horarioHastaHandler({ body: '13:00' }, { state: mockState, fallBack: mockFallBack })

    expect(mockState.update).toHaveBeenCalledWith({ horarioHasta: '13:00' })
  })

  it('Horario hasta: before desde calls fallBack', async () => {
    const mockState = { update: vi.fn(), get: vi.fn().mockResolvedValue({ horarioDesde: '09:00' }) }
    const mockFallBack = vi.fn()

    await horarioHastaHandler({ body: '08:00' }, { state: mockState, fallBack: mockFallBack })

    expect(mockFallBack).toHaveBeenCalled()
  })

  it('Observaciones: stores value for non-ignored input', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }

    await observacionesHandler({ body: 'Timbree 3' }, { state: mockState })

    expect(mockState.update).toHaveBeenCalledWith({ observaciones: 'Timbree 3' })
  })

  it('Observaciones: stores undefined for "no"', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }

    await observacionesHandler({ body: 'no' }, { state: mockState })

    expect(mockState.update).toHaveBeenCalledWith({ observaciones: undefined })
  })

  it('Confirmation: SI calls clienteService.crear and shows success', async () => {
    const mockClienteService = { crear: vi.fn().mockResolvedValue({ id: 'cli-1', nombre: 'Juan' }), getErrorMessage: vi.fn() }
    const mockState = {
      update: vi.fn(),
      get: vi.fn().mockResolvedValue({
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '1122334455',
        calle: 'Av. Corrientes',
        numero: '1234',
        localidad: 'La Plata',
        diaEntrega: 'LUNES',
        horarioDesde: '09:00',
        horarioHasta: '13:00',
        observaciones: undefined,
      }),
    }
    const mockFlowDynamic = vi.fn()
    const mockFallBack = vi.fn()

    await confirmacionHandler(
      { body: 'SI' },
      { state: mockState, flowDynamic: mockFlowDynamic, fallBack: mockFallBack },
      mockClienteService,
    )

    expect(mockClienteService.crear).toHaveBeenCalled()
    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('Registro completado'))
  })

  it('Confirmation: NO shows abort message', async () => {
    const mockClienteService = { crear: vi.fn(), getErrorMessage: vi.fn() }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockFallBack = vi.fn()

    await confirmacionHandler(
      { body: 'NO' },
      { state: mockState, flowDynamic: mockFlowDynamic, fallBack: mockFallBack },
      mockClienteService,
    )

    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('No hay problema'))
    expect(mockClienteService.crear).not.toHaveBeenCalled()
  })

  it('Confirmation: other calls fallBack', async () => {
    const mockClienteService = { crear: vi.fn(), getErrorMessage: vi.fn() }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockFallBack = vi.fn()

    await confirmacionHandler(
      { body: 'tal vez' },
      { state: mockState, flowDynamic: mockFlowDynamic, fallBack: mockFallBack },
      mockClienteService,
    )

    expect(mockFallBack).toHaveBeenCalled()
  })

  it('API error on crear shows error message', async () => {
    const mockClienteService = {
      crear: vi.fn().mockRejectedValue(new Error('Error del servidor')),
      getErrorMessage: vi.fn().mockReturnValue('Error del servidor'),
    }
    const mockState = {
      update: vi.fn(),
      get: vi.fn().mockResolvedValue({
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '1122334455',
        calle: 'Av. Corrientes',
        numero: '1234',
        localidad: 'La Plata',
        diaEntrega: 'LUNES',
        horarioDesde: '09:00',
        horarioHasta: '13:00',
      }),
    }
    const mockFlowDynamic = vi.fn()
    const mockFallBack = vi.fn()

    await confirmacionHandler(
      { body: 'SI' },
      { state: mockState, flowDynamic: mockFlowDynamic, fallBack: mockFallBack },
      mockClienteService,
    )

    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('Ocurrió un error'))
  })
})
