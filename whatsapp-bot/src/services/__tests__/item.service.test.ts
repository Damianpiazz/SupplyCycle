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

const mockItem = {
  id: 'item-1',
  nombre: 'Pan',
  descripcion: 'Pan francés',
  unidad: 'unidad',
  precio: 100,
  activo: true,
}

describe('ItemService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listar returns parsed items', async () => {
    const api = await getMockedApi()
    api.get.mockResolvedValueOnce({ data: { data: [mockItem], total: 1 } })

    const { itemService } = await import('../item.service.js')
    const result = await itemService.listar()

    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('item-1')
    expect(result[0]!.nombre).toBe('Pan')
    expect(result[0]!.activo).toBe(true)
  })

  it('listar sends activo=true param', async () => {
    const api = await getMockedApi()
    api.get.mockResolvedValueOnce({ data: { data: [], total: 0 } })

    const { itemService } = await import('../item.service.js')
    await itemService.listar()

    expect(api.get).toHaveBeenCalledWith('/items', { params: { activo: true } })
  })

  it('getErrorMessage returns API error message', async () => {
    const { itemService } = await import('../item.service.js')
    const error = { isAxiosError: true, response: { data: { error: { code: 'NOT_FOUND', message: 'Item no encontrado', timestamp: '2024-01-01T00:00:00Z' } } } }

    const msg = itemService.getErrorMessage(error)

    expect(msg).toBe('Item no encontrado')
  })

  it('getErrorMessage returns system unavailable for ECONNREFUSED', async () => {
    const { itemService } = await import('../item.service.js')
    const error = { isAxiosError: true, code: 'ECONNREFUSED', message: 'connect ECONNREFUSED 127.0.0.1:3000' }

    const msg = itemService.getErrorMessage(error)

    expect(msg).toBe('El sistema no está disponible. Intentá de nuevo en unos minutos.')
  })

  it('getErrorMessage returns timeout message for ECONNABORTED', async () => {
    const { itemService } = await import('../item.service.js')
    const error = { isAxiosError: true, code: 'ECONNABORTED', message: 'timeout of 10000ms exceeded' }

    const msg = itemService.getErrorMessage(error)

    expect(msg).toBe('El servicio está tardando demasiado. Intentá de nuevo.')
  })
})
