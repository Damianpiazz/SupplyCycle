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

async function reclamoFirstActionHandler(
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

  await state.update({ clienteId: clientes[0]!.id, clienteNombre: clientes[0]!.nombre })

  await flowDynamic(
    '📝 *Nuevo Reclamo*\n\n' +
    'Contanos brevemente cuál es el problema o qué reclamo querés hacer.\n\n' +
    'Ej: *el producto llegó en mal estado* o *no recibí mi pedido completo*'
  )
}

describe('ReclamoFlow smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('First action triggers and shows reclamo prompt', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([{ id: 'cli-1', nombre: 'Juan' }]) }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockGotoFlow = vi.fn()
    const mockNoRegistradoFlow = Symbol('noRegistradoFlow')

    await reclamoFirstActionHandler(
      { from: '541122334455', body: 'reclamo' },
      { flowDynamic: mockFlowDynamic, state: mockState, gotoFlow: mockGotoFlow },
      { clienteService: mockClienteService },
      mockNoRegistradoFlow,
    )

    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('Nuevo Reclamo'))
    expect(mockGotoFlow).not.toHaveBeenCalled()
  })

  it('First action: client not found redirects to noRegistradoFlow', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([]) }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockGotoFlow = vi.fn()
    const mockNoRegistradoFlow = Symbol('noRegistradoFlow')

    await reclamoFirstActionHandler(
      { from: '541122334455', body: 'reclamo' },
      { flowDynamic: mockFlowDynamic, state: mockState, gotoFlow: mockGotoFlow },
      { clienteService: mockClienteService },
      mockNoRegistradoFlow,
    )

    expect(mockGotoFlow).toHaveBeenCalledWith(mockNoRegistradoFlow)
  })
})
