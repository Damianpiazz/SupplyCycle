import { type AxiosError, isAxiosError } from 'axios'
import { api } from '../lib/axios.js'
import type { Item } from './item.service.js'
import type { Domicilio } from './cliente.service.js'

type ApiResponse<T> = { data: T }
type ApiListResponse<T> = { data: T[]; total: number }
type ApiErrorBody = {
  error: { code: string; message: string; timestamp: string; details?: Record<string, string[]> }
}

export interface PedidoCliente {
  id: string
  nombre: string
  apellido: string
  telefono: string
  observaciones?: string | null
  activo: boolean
}

export interface PedidoItem {
  id: string
  cantidad: number
  precioUnitario?: number | null
  item: Item
}

export interface Pedido {
  id: string
  numeroPedido: string
  orden: number
  estado: string
  fecha: string
  motivoFalla: string | null
  total: number
  itemsCount: number
  items: PedidoItem[]
  cliente: PedidoCliente
  domicilio: Domicilio
}

export interface CrearPedidoInput {
  clienteId: string
  fecha: string
  estado?: string
  items: Array<{ itemId: string; cantidad: number }>
}

class PedidoService {
  async listar(params?: { clienteId?: string; fecha?: string; estado?: string }): Promise<Pedido[]> {
    const res = await api.get<ApiListResponse<Pedido>>('/pedidos', { params })
    return res.data.data
  }

  async obtener(id: string): Promise<Pedido> {
    const res = await api.get<ApiResponse<Pedido>>(`/pedidos/${id}`)
    return res.data.data
  }

  async crear(input: CrearPedidoInput): Promise<Pedido> {
    const res = await api.post<ApiResponse<Pedido>>('/pedidos', input)
    return res.data.data
  }

  async cancelar(id: string, motivo: string): Promise<Pedido> {
    const res = await api.patch<ApiResponse<Pedido>>(`/pedidos/${id}/cancelar`, { motivo })
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

export const pedidoService = new PedidoService()
