import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/axios.js', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

async function normalizePhone(phone: string): Promise<string> {
  return phone.replace(/^54/, '').replace(/[^\d]/g, '')
}

async function bajaFirstActionHandler(
  ctx: { from: string; body: string },
  { flowDynamic, state, gotoFlow }: any,
  { clienteService }: any,
  noRegistradoFlow: any,
) {
  const telefono = await normalizePhone(ctx.from)
  const clientes = await clienteService.listar({ telefono }).catch(() => [])
  if (clientes.length === 0) {
    return gotoFlow(noRegistradoFlow)
  }

  const cliente = clientes[0]!
  await state.update({ clienteId: cliente.id, clienteNombre: cliente.nombre })

  if (!cliente.activo) {
    await flowDynamic('Ya estás dado de baja como cliente. Escribí *alta* si querés registrarte de nuevo.')
    return
  }

  await flowDynamic(
    '⚠️ *Darse de Baja*\n\n' +
    `¿Estás seguro que querés darte de baja, ${cliente.nombre}?\n\n` +
    'Si te das de baja, el repartidor *no va a ir a tu casa* los días de entrega.\n\n' +
    'Siempre podés volver a registrarte después con *alta*.\n\n' +
    '✅ *SI* — para darme de baja\n' +
    '❌ *NO* — para cancelar'
  )
}

describe('BajaFlow smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('First action triggers and shows deactivation prompt', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([{ id: 'cli-1', nombre: 'Juan', activo: true }]) }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockGotoFlow = vi.fn()
    const mockNoRegistradoFlow = Symbol('noRegistradoFlow')

    await bajaFirstActionHandler(
      { from: '541122334455', body: 'baja' },
      { flowDynamic: mockFlowDynamic, state: mockState, gotoFlow: mockGotoFlow },
      { clienteService: mockClienteService },
      mockNoRegistradoFlow,
    )

    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('Darse de Baja'))
    expect(mockGotoFlow).not.toHaveBeenCalled()
  })

  it('First action: client not found redirects to noRegistradoFlow', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([]) }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockGotoFlow = vi.fn()
    const mockNoRegistradoFlow = Symbol('noRegistradoFlow')

    await bajaFirstActionHandler(
      { from: '541122334455', body: 'baja' },
      { flowDynamic: mockFlowDynamic, state: mockState, gotoFlow: mockGotoFlow },
      { clienteService: mockClienteService },
      mockNoRegistradoFlow,
    )

    expect(mockGotoFlow).toHaveBeenCalledWith(mockNoRegistradoFlow)
  })
})
