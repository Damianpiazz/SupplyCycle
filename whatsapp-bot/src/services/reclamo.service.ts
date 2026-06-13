import { type AxiosError, isAxiosError } from 'axios'
import { api } from '../lib/axios.js'
import type { Cliente } from './cliente.service.js'

type ApiResponse<T> = { data: T }
type ApiListResponse<T> = { data: T[]; total: number }
type ApiErrorBody = {
  error: { code: string; message: string; timestamp: string; details?: Record<string, string[]> }
}

export interface Reclamo {
  id: string
  clienteId: string
  creadoEn: string
  cliente?: Cliente
}

export interface CrearReclamoInput {
  clienteId: string
  descripcion: string
}

class ReclamoService {
  async listar(params?: { clienteId?: string }): Promise<Reclamo[]> {
    const res = await api.get<ApiListResponse<Reclamo>>('/reclamos', { params })
    return res.data.data
  }

  async crear(input: CrearReclamoInput): Promise<Reclamo> {
    const res = await api.post<ApiResponse<Reclamo>>('/reclamos', input)
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

export const reclamoService = new ReclamoService()
