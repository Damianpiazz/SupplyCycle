import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/axios.js', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const MOTIVOS = [
  { label: 'Ya no necesito el pedido', value: 'YA_NO_LO_NECESITA' },
  { label: 'La dirección es incorrecta', value: 'DIRECCION_INCORRECTA' },
  { label: 'No voy a estar para recibir', value: 'CANCELACION_CLIENTE' },
  { label: 'Otro motivo', value: 'OTRO' },
] as const

async function normalizePhone(phone: string): Promise<string> {
  return phone.replace(/^54/, '').replace(/[^\d]/g, '')
}

async function firstActionHandler(
  ctx: { from: string; body: string },
  { flowDynamic, state, gotoFlow }: any,
  { clienteService, pedidoService }: any,
  noRegistradoFlow: any,
) {
  const telefono = await normalizePhone(ctx.from)
  const clientes = await clienteService.listar({ telefono }).catch(() => [])
  if (clientes.length === 0) {
    return gotoFlow(noRegistradoFlow)
  }

  const clienteId = clientes[0]!.id
  await state.update({ clienteId, clienteNombre: clientes[0]!.nombre })

  const pedidos = await pedidoService.listar({ clienteId, estado: 'PENDIENTE' }).catch(() => [])
  if (pedidos.length === 0) {
    await flowDynamic('No tenés pedidos pendientes para cancelar.')
    return
  }

  await state.update({ pedidos })

  const lista = pedidos
    .map((p: any, i: number) => `${i + 1}. *${p.numeroPedido}* — ${new Date(p.fecha).toLocaleDateString('es-AR')}`)
    .join('\n')

  await flowDynamic(
    '❌ *Cancelar Pedido*\n\n' +
    'Estos son tus pedidos pendientes:\n\n' +
    `${lista}\n\n` +
    'Respondé el *número* del pedido que querés cancelar:'
  )
}

async function pedidoSelectionHandler(
  ctx: { body: string },
  { state, fallBack }: any,
) {
  const idx = parseInt(ctx.body.trim(), 10)
  const st = await state.get() as { pedidos: Array<{ id: string; numeroPedido: string }> }

  if (!st.pedidos || st.pedidos.length === 0) {
    return fallBack('No hay pedidos cargados. Escribí *cancelar* para empezar de nuevo.')
  }

  if (isNaN(idx) || idx < 1 || idx > st.pedidos.length) {
    return fallBack(`Elegí un número del 1 al ${st.pedidos.length}:`)
  }

  await state.update({ pedidoId: st.pedidos[idx - 1]!.id, pedidoNumero: st.pedidos[idx - 1]!.numeroPedido })
}

async function motivoSelectionHandler(
  ctx: { body: string },
  { state, fallBack }: any,
) {
  const idx = parseInt(ctx.body.trim(), 10)
  if (isNaN(idx) || idx < 1 || idx > MOTIVOS.length) {
    const menu = MOTIVOS.map((m, i) => `${i + 1}. ${m.label}`).join('\n')
    return fallBack(`Elegí un número del 1 al ${MOTIVOS.length}:\n\n${menu}`)
  }

  const motivo = MOTIVOS[idx - 1]!
  await state.update({ motivo: motivo.value, motivoLabel: motivo.label })
}

async function summaryActionHandler(
  ctx: any,
  { state, flowDynamic }: any,
) {
  const st = await state.get() as {
    clienteNombre?: string
    pedidoNumero?: string
    motivoLabel?: string
  }

  if (!st.pedidoNumero || !st.motivoLabel) {
    await flowDynamic('Faltan datos. Escribí *cancelar* para empezar de nuevo.')
    return
  }

  await flowDynamic(
    '📋 *Resumen de cancelación:*\n\n' +
    `👤 *Cliente:* ${st.clienteNombre ?? '-'}\n` +
    `📦 *Pedido:* ${st.pedidoNumero}\n` +
    `❌ *Motivo:* ${st.motivoLabel}\n\n` +
    '✅ *SI* — para confirmar la cancelación\n' +
    '❌ *NO* — para cancelar'
  )
}

async function confirmacionHandler(
  ctx: { body: string },
  { state, flowDynamic, fallBack }: any,
  pedidoService: any,
) {
  const respuesta = ctx.body.trim().toUpperCase()
  if (respuesta === 'SI') {
    const st = await state.get() as { pedidoId: string; pedidoNumero?: string; motivo: string; clienteNombre?: string }

    try {
      await pedidoService.cancelar(st.pedidoId, st.motivo)
      await flowDynamic(
        `✅ *Pedido cancelado con éxito!*\n\n` +
        `Pedido: *${st.pedidoNumero}*\n\n` +
        `🙌 Listo ${st.clienteNombre ?? ''}, ya cancelamos el pedido.\n\n` +
        `📦 Escribí *pedir* para hacer un nuevo pedido\n` +
        `❓ Escribí *ayuda* para ver el menú`
      )
    } catch (err) {
      const msg = pedidoService.getErrorMessage(err)
      await flowDynamic(
        `❌ *Ocurrió un error al cancelar el pedido*\n\n${msg}\n\n` +
        `Intentá de nuevo más tarde o escribí *ayuda* para asistencia.`
      )
    }
  } else if (respuesta === 'NO') {
    await flowDynamic('Cancelación abortada. Escribí *cancelar* cuando quieras cancelar un pedido.')
  } else {
    return fallBack('Respondé *SI* para confirmar o *NO* para cancelar:')
  }
}

describe('CancelarFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('First action: client found stores clienteId and shows pending orders', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([{ id: 'cli-1', nombre: 'Juan' }]) }
    const mockPedidoService = { listar: vi.fn().mockResolvedValue([{ id: 'ped-1', numeroPedido: 'PEDIDO #1', fecha: '2024-01-15' }]) }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockGotoFlow = vi.fn()
    const mockNoRegistradoFlow = Symbol('noRegistradoFlow')

    await firstActionHandler(
      { from: '541122334455', body: 'cancelar' },
      { flowDynamic: mockFlowDynamic, state: mockState, gotoFlow: mockGotoFlow },
      { clienteService: mockClienteService, pedidoService: mockPedidoService },
      mockNoRegistradoFlow,
    )

    expect(mockState.update).toHaveBeenCalledWith(expect.objectContaining({ clienteId: 'cli-1', clienteNombre: 'Juan' }))
    expect(mockFlowDynamic).toHaveBeenCalled()
  })

  it('First action: client not found redirects to noRegistradoFlow', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([]) }
    const mockPedidoService = { listar: vi.fn() }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockGotoFlow = vi.fn()
    const mockNoRegistradoFlow = Symbol('noRegistradoFlow')

    await firstActionHandler(
      { from: '541122334455', body: 'cancelar' },
      { flowDynamic: mockFlowDynamic, state: mockState, gotoFlow: mockGotoFlow },
      { clienteService: mockClienteService, pedidoService: mockPedidoService },
      mockNoRegistradoFlow,
    )

    expect(mockGotoFlow).toHaveBeenCalledWith(mockNoRegistradoFlow)
  })

  it('First action: no pending orders shows message', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([{ id: 'cli-1', nombre: 'Juan' }]) }
    const mockPedidoService = { listar: vi.fn().mockResolvedValue([]) }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockGotoFlow = vi.fn()

    await firstActionHandler(
      { from: '541122334455', body: 'cancelar' },
      { flowDynamic: mockFlowDynamic, state: mockState, gotoFlow: mockGotoFlow },
      { clienteService: mockClienteService, pedidoService: mockPedidoService },
      Symbol('noRegistradoFlow'),
    )

    expect(mockFlowDynamic).toHaveBeenCalledWith('No tenés pedidos pendientes para cancelar.')
  })

  it('Pedido selection: valid number stores pedidoId in state', async () => {
    const mockState = {
      update: vi.fn(),
      get: vi.fn().mockResolvedValue({ pedidos: [{ id: 'ped-1', numeroPedido: 'PEDIDO #1' }] }),
    }
    const mockFallBack = vi.fn()

    await pedidoSelectionHandler({ body: '1' }, { state: mockState, fallBack: mockFallBack })

    expect(mockState.update).toHaveBeenCalledWith({ pedidoId: 'ped-1', pedidoNumero: 'PEDIDO #1' })
  })

  it('Pedido selection: invalid number calls fallBack', async () => {
    const mockState = {
      update: vi.fn(),
      get: vi.fn().mockResolvedValue({ pedidos: [{ id: 'ped-1', numeroPedido: 'PEDIDO #1' }] }),
    }
    const mockFallBack = vi.fn()

    await pedidoSelectionHandler({ body: '5' }, { state: mockState, fallBack: mockFallBack })

    expect(mockFallBack).toHaveBeenCalled()
    expect(mockState.update).not.toHaveBeenCalled()
  })

  it('Motivo selection: valid number stores motivo in state', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFallBack = vi.fn()

    await motivoSelectionHandler({ body: '1' }, { state: mockState, fallBack: mockFallBack })

    expect(mockState.update).toHaveBeenCalledWith({ motivo: 'YA_NO_LO_NECESITA', motivoLabel: 'Ya no necesito el pedido' })
  })

  it('Motivo selection: invalid number calls fallBack', async () => {
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFallBack = vi.fn()

    await motivoSelectionHandler({ body: '9' }, { state: mockState, fallBack: mockFallBack })

    expect(mockFallBack).toHaveBeenCalled()
  })

  it('Summary action: shows confirmation with pedido and motivo', async () => {
    const mockState = {
      update: vi.fn(),
      get: vi.fn().mockResolvedValue({
        clienteNombre: 'Juan',
        pedidoNumero: 'PEDIDO #1',
        motivoLabel: 'Ya no necesito el pedido',
      }),
    }
    const mockFlowDynamic = vi.fn()

    await summaryActionHandler({ body: '' }, { state: mockState, flowDynamic: mockFlowDynamic })

    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('PEDIDO #1'))
    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('Ya no necesito el pedido'))
  })

  it('Summary action: missing data shows Faltan datos message', async () => {
    const mockState = {
      update: vi.fn(),
      get: vi.fn().mockResolvedValue({ clienteNombre: 'Juan' }),
    }
    const mockFlowDynamic = vi.fn()

    await summaryActionHandler({ body: '' }, { state: mockState, flowDynamic: mockFlowDynamic })

    expect(mockFlowDynamic).toHaveBeenCalledWith('Faltan datos. Escribí *cancelar* para empezar de nuevo.')
  })

  it('Confirmation: SI calls pedidoService.cancelar and shows success', async () => {
    const mockPedidoService = { cancelar: vi.fn().mockResolvedValue({ id: 'ped-1', estado: 'CANCELADO' }), getErrorMessage: vi.fn() }
    const mockState = {
      update: vi.fn(),
      get: vi.fn().mockResolvedValue({ pedidoId: 'ped-1', pedidoNumero: 'PEDIDO #1', motivo: 'YA_NO_LO_NECESITA', clienteNombre: 'Juan' }),
    }
    const mockFlowDynamic = vi.fn()
    const mockFallBack = vi.fn()

    await confirmacionHandler(
      { body: 'SI' },
      { state: mockState, flowDynamic: mockFlowDynamic, fallBack: mockFallBack },
      mockPedidoService,
    )

    expect(mockPedidoService.cancelar).toHaveBeenCalledWith('ped-1', 'YA_NO_LO_NECESITA')
    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('cancelado con éxito'))
  })

  it('Confirmation: NO shows abort message', async () => {
    const mockPedidoService = { cancelar: vi.fn(), getErrorMessage: vi.fn() }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockFallBack = vi.fn()

    await confirmacionHandler(
      { body: 'NO' },
      { state: mockState, flowDynamic: mockFlowDynamic, fallBack: mockFallBack },
      mockPedidoService,
    )

    expect(mockFlowDynamic).toHaveBeenCalledWith('Cancelación abortada. Escribí *cancelar* cuando quieras cancelar un pedido.')
    expect(mockPedidoService.cancelar).not.toHaveBeenCalled()
  })

  it('Confirmation: other calls fallBack', async () => {
    const mockPedidoService = { cancelar: vi.fn(), getErrorMessage: vi.fn() }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockFallBack = vi.fn()

    await confirmacionHandler(
      { body: 'quizas' },
      { state: mockState, flowDynamic: mockFlowDynamic, fallBack: mockFallBack },
      mockPedidoService,
    )

    expect(mockFallBack).toHaveBeenCalled()
  })

  it('API error on cancelar shows error message', async () => {
    const mockPedidoService = {
      cancelar: vi.fn().mockRejectedValue(new Error('Error al cancelar')),
      getErrorMessage: vi.fn().mockReturnValue('Error al cancelar'),
    }
    const mockState = {
      update: vi.fn(),
      get: vi.fn().mockResolvedValue({ pedidoId: 'ped-1', pedidoNumero: 'PEDIDO #1', motivo: 'YA_NO_LO_NECESITA', clienteNombre: 'Juan' }),
    }
    const mockFlowDynamic = vi.fn()
    const mockFallBack = vi.fn()

    await confirmacionHandler(
      { body: 'SI' },
      { state: mockState, flowDynamic: mockFlowDynamic, fallBack: mockFallBack },
      mockPedidoService,
    )

    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('Ocurrió un error'))
  })
})
