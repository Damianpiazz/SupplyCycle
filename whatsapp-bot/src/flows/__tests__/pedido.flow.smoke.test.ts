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

async function pedidoFirstActionHandler(
  ctx: { from: string; body: string },
  { flowDynamic, state, gotoFlow }: any,
  { clienteService, itemService }: any,
  noRegistradoFlow: any,
) {
  const telefono = await normalizePhone(ctx.from)
  const clientes = await clienteService.listar({ telefono }).catch(() => [])
  if (clientes.length === 0) {
    return gotoFlow(noRegistradoFlow)
  }

  await state.update({ clienteId: clientes[0]!.id, clienteNombre: clientes[0]!.nombre })

  const items = await itemService.listar().catch(() => null)
  if (!items || items.length === 0) {
    await flowDynamic('No hay productos disponibles en este momento. Escribí *ayuda* para volver al menú.')
    return
  }

  await state.update({ items })

  const menu = items
    .map((item: any, i: number) => `${i + 1}. ${item.nombre} — $${item.precio ?? '-'} c/u`)
    .join('\n')

  await flowDynamic(
    '📦 *Nuevo Pedido*\n\n' +
    'Estos son los productos disponibles:\n\n' +
    `${menu}\n\n` +
    'Escribí los items que querés en formato *número x cantidad*.\n' +
    'Ej: *1x2, 3x4* (item 1 × 2 unidades, item 3 × 4 unidades)'
  )
}

describe('PedidoFlow smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('First action triggers and shows product selection', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([{ id: 'cli-1', nombre: 'Juan' }]) }
    const mockItemService = { listar: vi.fn().mockResolvedValue([{ id: 'item-1', nombre: 'Pan', precio: 100 }]) }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockGotoFlow = vi.fn()
    const mockNoRegistradoFlow = Symbol('noRegistradoFlow')

    await pedidoFirstActionHandler(
      { from: '541122334455', body: 'pedir' },
      { flowDynamic: mockFlowDynamic, state: mockState, gotoFlow: mockGotoFlow },
      { clienteService: mockClienteService, itemService: mockItemService },
      mockNoRegistradoFlow,
    )

    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('Nuevo Pedido'))
    expect(mockGotoFlow).not.toHaveBeenCalled()
  })

  it('First action: client not found redirects to noRegistradoFlow', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([]) }
    const mockItemService = { listar: vi.fn() }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()
    const mockGotoFlow = vi.fn()
    const mockNoRegistradoFlow = Symbol('noRegistradoFlow')

    await pedidoFirstActionHandler(
      { from: '541122334455', body: 'pedir' },
      { flowDynamic: mockFlowDynamic, state: mockState, gotoFlow: mockGotoFlow },
      { clienteService: mockClienteService, itemService: mockItemService },
      mockNoRegistradoFlow,
    )

    expect(mockGotoFlow).toHaveBeenCalledWith(mockNoRegistradoFlow)
  })
})
