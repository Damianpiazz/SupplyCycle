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

const MENU_CLIENTE = [
  '*SupplyCycle* — Menú Principal',
  '',
  '✅ *Bienvenido! Sos cliente registrado*',
  '',
  'Elegí una opción:',
  '',
  '📦 *pedir* — Hacer un nuevo pedido',
  '🔍 *estado* — Consultar el estado de tu pedido',
  '❌ *cancelar* — Cancelar un pedido',
  '📝 *reclamo* — Hacer un reclamo',
  '🚫 *baja* — Darme de baja como cliente',
  '❓ *ayuda* — Ver este menú de nuevo',
].join('\n')

const MENU_NO_CLIENTE = [
  '*SupplyCycle* — Menú Principal',
  '',
  '👋 *Hola! Soy el asistente virtual de SupplyCycle*',
  '',
  'Todavía no estás registrado como cliente.',
  'Elegí una opción:',
  '',
  '📋 *alta* — Darme de alta como cliente',
  '❓ *ayuda* — Ver este menú de nuevo',
].join('\n')

async function welcomeActionHandler(
  ctx: { from: string; body: string },
  { flowDynamic, state }: any,
  { clienteService }: any,
) {
  try {
    const clientes = await clienteService.listar({ telefono: await normalizePhone(ctx.from) })

    if (clientes.length > 0) {
      await state.update({ esCliente: true, clienteId: clientes[0]!.id, clienteNombre: clientes[0]!.nombre })
      await flowDynamic(MENU_CLIENTE)
    } else {
      await state.update({ esCliente: false })
      await flowDynamic(MENU_NO_CLIENTE)
    }
  } catch {
    await state.update({ esCliente: false })
    await flowDynamic('⚠️ No pudimos verificar tu información. Intentá de nuevo en unos minutos.')
  }
}

describe('WelcomeFlow smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Registered client shows menu with options', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([{ id: 'cli-1', nombre: 'Juan' }]) }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()

    await welcomeActionHandler(
      { from: '541122334455', body: '' },
      { flowDynamic: mockFlowDynamic, state: mockState },
      { clienteService: mockClienteService },
    )

    expect(mockClienteService.listar).toHaveBeenCalledWith({ telefono: '1122334455' })
    expect(mockState.update).toHaveBeenCalledWith(expect.objectContaining({ esCliente: true }))
    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('Bienvenido'))
  })

  it('Unregistered client shows registration prompt', async () => {
    const mockClienteService = { listar: vi.fn().mockResolvedValue([]) }
    const mockState = { update: vi.fn(), get: vi.fn() }
    const mockFlowDynamic = vi.fn()

    await welcomeActionHandler(
      { from: '541122334455', body: '' },
      { flowDynamic: mockFlowDynamic, state: mockState },
      { clienteService: mockClienteService },
    )

    expect(mockState.update).toHaveBeenCalledWith(expect.objectContaining({ esCliente: false }))
    expect(mockFlowDynamic).toHaveBeenCalledWith(expect.stringContaining('Todavía no estás registrado'))
  })
})
