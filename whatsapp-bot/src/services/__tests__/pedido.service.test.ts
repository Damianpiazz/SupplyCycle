import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'

vi.mock('../../lib/axios.js', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

async function getMockedApi() {
  const { api } = await import('../../lib/axios.js')
  return api as unknown as Record<string, Mock>
}

const mockPedido = {
  id: 'ped-1',
  numeroPedido: 'PEDIDO #1',
  orden: 1,
  estado: 'PENDIENTE',
  fecha: '2024-01-15',
  motivoFalla: null,
  total: 100,
  itemsCount: 2,
  items: [],
  cliente: { id: 'cli-1', nombre: 'Juan', apellido: 'Pérez', telefono: '112233', activo: true },
  domicilio: { calle: 'Av. Corrientes', numero: '1234', localidad: 'La Plata', dias: [] },
}

describe('PedidoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listar returns parsed pedidos', async () => {
    const api = await getMockedApi()
    api.get.mockResolvedValueOnce({ data: { data: [mockPedido], total: 1 } })

    const { pedidoService } = await import('../pedido.service.js')
    const result = await pedidoService.listar()

    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('ped-1')
    expect(result[0]!.estado).toBe('PENDIENTE')
  })

  it('listar with clienteId filter sends params', async () => {
    const api = await getMockedApi()
    api.get.mockResolvedValueOnce({ data: { data: [], total: 0 } })

    const { pedidoService } = await import('../pedido.service.js')
    await pedidoService.listar({ clienteId: 'cli-1', estado: 'PENDIENTE' })

    expect(api.get).toHaveBeenCalledWith('/pedidos', { params: { clienteId: 'cli-1', estado: 'PENDIENTE' } })
  })

  it('obtener by id returns parsed pedido', async () => {
    const api = await getMockedApi()
    api.get.mockResolvedValueOnce({ data: { data: mockPedido } })

    const { pedidoService } = await import('../pedido.service.js')
    const result = await pedidoService.obtener('ped-1')

    expect(result.id).toBe('ped-1')
    expect(result.numeroPedido).toBe('PEDIDO #1')
  })

  it('crear pedido calls api.post with input', async () => {
    const api = await getMockedApi()
    api.post.mockResolvedValueOnce({ data: { data: mockPedido } })

    const { pedidoService } = await import('../pedido.service.js')
    const input = { clienteId: 'cli-1', fecha: '2024-01-15', items: [{ itemId: 'item-1', cantidad: 2 }] }
    const result = await pedidoService.crear(input)

    expect(api.post).toHaveBeenCalledWith('/pedidos', input)
    expect(result.id).toBe('ped-1')
  })

  it('cancelar calls api.patch with /cancelar-cliente URL', async () => {
    const api = await getMockedApi()
    api.patch.mockResolvedValueOnce({ data: { data: { ...mockPedido, estado: 'CANCELADO', motivoFalla: 'YA_NO_LO_NECESITA' } } })

    const { pedidoService } = await import('../pedido.service.js')
    const result = await pedidoService.cancelar('ped-1', 'YA_NO_LO_NECESITA')

    expect(api.patch).toHaveBeenCalledWith('/pedidos/ped-1/cancelar-cliente', { motivo: 'YA_NO_LO_NECESITA' })
    expect(result.estado).toBe('CANCELADO')
  })

  it('getErrorMessage returns API error message', async () => {
    const { pedidoService } = await import('../pedido.service.js')
    const error = { isAxiosError: true, response: { data: { error: { code: 'NOT_FOUND', message: 'Pedido no encontrado', timestamp: '2024-01-01T00:00:00Z' } } } }

    const msg = pedidoService.getErrorMessage(error)

    expect(msg).toBe('Pedido no encontrado')
  })

  it('getErrorMessage returns system unavailable for ECONNREFUSED', async () => {
    const { pedidoService } = await import('../pedido.service.js')
    const error = { isAxiosError: true, code: 'ECONNREFUSED', message: 'connect ECONNREFUSED 127.0.0.1:3000' }

    const msg = pedidoService.getErrorMessage(error)

    expect(msg).toBe('El sistema no está disponible. Intentá de nuevo en unos minutos.')
  })

  it('getErrorMessage returns timeout message for ECONNABORTED', async () => {
    const { pedidoService } = await import('../pedido.service.js')
    const error = { isAxiosError: true, code: 'ECONNABORTED', message: 'timeout of 10000ms exceeded' }

    const msg = pedidoService.getErrorMessage(error)

    expect(msg).toBe('El servicio está tardando demasiado. Intentá de nuevo.')
  })
})
