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

const mockCliente = {
  id: 'cli-1',
  nombre: 'Juan',
  apellido: 'Pérez',
  telefono: '112233',
  domicilios: [{ calle: 'Av. Corrientes', numero: '1234', localidad: 'La Plata', dias: [] }],
  activo: true,
}

describe('ClienteService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listar returns parsed clients', async () => {
    const api = await getMockedApi()
    api.get.mockResolvedValueOnce({ data: { data: [mockCliente], total: 1 } })

    const { clienteService } = await import('../cliente.service.js')
    const result = await clienteService.listar()

    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('cli-1')
    expect(result[0]!.nombre).toBe('Juan')
    expect(result[0]!.telefono).toBe('112233')
  })

  it('listar with phone filter sends correct params', async () => {
    const api = await getMockedApi()
    api.get.mockResolvedValueOnce({ data: { data: [], total: 0 } })

    const { clienteService } = await import('../cliente.service.js')
    await clienteService.listar({ telefono: '112233' })

    expect(api.get).toHaveBeenCalledWith('/clientes', { params: { telefono: '112233' } })
  })

  it('obtener by id returns parsed client', async () => {
    const api = await getMockedApi()
    api.get.mockResolvedValueOnce({ data: { data: mockCliente } })

    const { clienteService } = await import('../cliente.service.js')
    const result = await clienteService.obtener('cli-1')

    expect(result.id).toBe('cli-1')
    expect(result.nombre).toBe('Juan')
  })

  it('crear client calls api.post with input', async () => {
    const api = await getMockedApi()
    api.post.mockResolvedValueOnce({ data: { data: mockCliente } })

    const { clienteService } = await import('../cliente.service.js')
    const input = {
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '112233',
      domicilios: [{ calle: 'Av. Corrientes', numero: '1234', localidad: 'La Plata', dias: [] }],
    }
    const result = await clienteService.crear(input)

    expect(api.post).toHaveBeenCalledWith('/clientes', input)
    expect(result.id).toBe('cli-1')
  })

  it('actualizar client calls api.patch with data', async () => {
    const api = await getMockedApi()
    api.patch.mockResolvedValueOnce({ data: { data: { ...mockCliente, activo: false } } })

    const { clienteService } = await import('../cliente.service.js')
    const result = await clienteService.actualizar('cli-1', { activo: false })

    expect(api.patch).toHaveBeenCalledWith('/clientes/cli-1', { activo: false })
    expect(result.activo).toBe(false)
  })

  it('getErrorMessage returns API error message', async () => {
    const { clienteService } = await import('../cliente.service.js')
    const error = { isAxiosError: true, response: { data: { error: { code: 'NOT_FOUND', message: 'Cliente no encontrado', timestamp: '2024-01-01T00:00:00Z' } } } }

    const msg = clienteService.getErrorMessage(error)

    expect(msg).toBe('Cliente no encontrado')
  })

  it('getErrorMessage returns system unavailable for ECONNREFUSED', async () => {
    const { clienteService } = await import('../cliente.service.js')
    const error = { isAxiosError: true, code: 'ECONNREFUSED', message: 'connect ECONNREFUSED 127.0.0.1:3000' }

    const msg = clienteService.getErrorMessage(error)

    expect(msg).toBe('El sistema no está disponible. Intentá de nuevo en unos minutos.')
  })

  it('getErrorMessage returns timeout message for ECONNABORTED', async () => {
    const { clienteService } = await import('../cliente.service.js')
    const error = { isAxiosError: true, code: 'ECONNABORTED', message: 'timeout of 10000ms exceeded' }

    const msg = clienteService.getErrorMessage(error)

    expect(msg).toBe('El servicio está tardando demasiado. Intentá de nuevo.')
  })
})
