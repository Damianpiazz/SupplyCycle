import { type AxiosError, isAxiosError } from 'axios'
import { api } from '../lib/axios.js'

type ApiListResponse<T> = { data: T[]; total: number }
type ApiErrorBody = {
  error: { code: string; message: string; timestamp: string; details?: Record<string, string[]> }
}

export interface Item {
  id: string
  nombre: string
  descripcion?: string | null
  unidad: string
  precio?: number | null
  activo: boolean
}

class ItemService {
  async listar(): Promise<Item[]> {
    const res = await api.get<ApiListResponse<Item>>('/items', { params: { activo: true } })
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

export const itemService = new ItemService()
