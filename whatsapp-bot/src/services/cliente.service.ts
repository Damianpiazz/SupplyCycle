import { type AxiosError, isAxiosError } from 'axios'
import { api } from '../lib/axios.js'

type ApiResponse<T> = { data: T }
type ApiListResponse<T> = { data: T[]; total: number }
type ApiErrorBody = {
  error: { code: string; message: string; timestamp: string; details?: Record<string, string[]> }
}

export interface Cliente {
  id: string
  nombre: string
  apellido: string
  telefono: string
  calle: string
  numero: string
  localidad: string
  latitud: number
  longitud: number
  diaEntrega: string
  horarioDesde: string
  horarioHasta: string
  observaciones?: string | null
  activo: boolean
}

export interface CrearClienteInput {
  nombre: string
  apellido: string
  telefono: string
  calle: string
  numero: string
  localidad: string
  latitud: number
  longitud: number
  diaEntrega: string
  horarioDesde: string
  horarioHasta: string
  observaciones?: string
}

class ClienteService {
  async listar(params?: { nombre?: string; telefono?: string; dia?: string }): Promise<Cliente[]> {
    const res = await api.get<ApiListResponse<Cliente>>('/clientes', { params })
    return res.data.data
  }

  async obtener(id: string): Promise<Cliente> {
    const res = await api.get<ApiResponse<Cliente>>(`/clientes/${id}`)
    return res.data.data
  }

  async crear(input: CrearClienteInput): Promise<Cliente> {
    const res = await api.post<ApiResponse<Cliente>>('/clientes', input)
    return res.data.data
  }

  async actualizar(id: string, data: Partial<CrearClienteInput & { activo: boolean }>): Promise<Cliente> {
    const res = await api.patch<ApiResponse<Cliente>>(`/clientes/${id}`, data)
    return res.data.data
  }

  getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
      const axiosErr = error as AxiosError<ApiErrorBody>
      if (axiosErr.response?.data?.error?.message) return axiosErr.response.data.error.message
      if (axiosErr.code === 'ECONNREFUSED') return 'El sistema no está disponible. Intentá de nuevo en unos minutos.'
      if (axiosErr.code === 'ECONNABORTED') return 'El servicio está tardando demasiado. Intentá de nuevo.'
    }
    if (error instanceof Error) return error.message
    return 'Ocurrió un error inesperado.'
  }
}

export const clienteService = new ClienteService()
