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

const mockReclamo = {
  id: 'rec-1',
  clienteId: 'cli-1',
  descripcion: 'El producto llegó en mal estado',
  creadoEn: '2024-01-15T10:00:00.000Z',
  cliente: { id: 'cli-1', nombre: 'Juan', apellido: 'Pérez', telefono: '112233' },
}

describe('ReclamoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listar returns parsed reclamos with descripcion', async () => {
    const api = await getMockedApi()
    api.get.mockResolvedValueOnce({ data: { data: [mockReclamo], total: 1 } })

    const { reclamoService } = await import('../reclamo.service.js')
    const result = await reclamoService.listar()

    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('rec-1')
    expect(result[0]!.descripcion).toBe('El producto llegó en mal estado')
    expect(result[0]!.clienteId).toBe('cli-1')
  })

  it('listar with clienteId filter sends params', async () => {
    const api = await getMockedApi()
    api.get.mockResolvedValueOnce({ data: { data: [], total: 0 } })

    const { reclamoService } = await import('../reclamo.service.js')
    await reclamoService.listar({ clienteId: 'cli-1' })

    expect(api.get).toHaveBeenCalledWith('/reclamos', { params: { clienteId: 'cli-1' } })
  })

  it('crear sends clienteId and descripcion via api.post', async () => {
    const api = await getMockedApi()
    api.post.mockResolvedValueOnce({ data: { data: mockReclamo } })

    const { reclamoService } = await import('../reclamo.service.js')
    const input = { clienteId: 'cli-1', descripcion: 'El producto llegó en mal estado' }
    const result = await reclamoService.crear(input)

    expect(api.post).toHaveBeenCalledWith('/reclamos', input)
    expect(result.id).toBe('rec-1')
    expect(result.descripcion).toBe('El producto llegó en mal estado')
  })

  it('getErrorMessage returns API error message', async () => {
    const { reclamoService } = await import('../reclamo.service.js')
    const error = { isAxiosError: true, response: { data: { error: { code: 'NOT_FOUND', message: 'Reclamo no encontrado', timestamp: '2024-01-01T00:00:00Z' } } } }

    const msg = reclamoService.getErrorMessage(error)

    expect(msg).toBe('Reclamo no encontrado')
  })

  it('getErrorMessage returns system unavailable for ECONNREFUSED', async () => {
    const { reclamoService } = await import('../reclamo.service.js')
    const error = { isAxiosError: true, code: 'ECONNREFUSED', message: 'connect ECONNREFUSED 127.0.0.1:3000' }

    const msg = reclamoService.getErrorMessage(error)

    expect(msg).toBe('El sistema no está disponible. Intentá de nuevo en unos minutos.')
  })

  it('getErrorMessage returns timeout message for ECONNABORTED', async () => {
    const { reclamoService } = await import('../reclamo.service.js')
    const error = { isAxiosError: true, code: 'ECONNABORTED', message: 'timeout of 10000ms exceeded' }

    const msg = reclamoService.getErrorMessage(error)

    expect(msg).toBe('El servicio está tardando demasiado. Intentá de nuevo.')
  })
})
