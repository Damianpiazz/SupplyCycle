import { apiClient, unwrapResponse, unwrapList } from '@/services/api';
import type { Pedido, EstadoPedido, MotivoCancelacion } from '@/types/pedido';
import type { ApiResponse, ApiListResponse } from '@/types/api';

export async function getPedidosDelDiaRequest(
  repartidorId: string
): Promise<Pedido[]> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Pedido[]>>('/pedidos/hoy', {
      params: { repartidorId },
    }),
  );
}

export async function getPedidoByIdRequest(id: string): Promise<Pedido> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Pedido>>(`/pedidos/${id}`),
  );
}

export async function getPedidosRequest(params?: {
  clienteNombre?: string;
  fecha?: string;
  estado?: EstadoPedido;
}): Promise<{ data: Pedido[]; total: number }> {
  return unwrapList(
    await apiClient.get<ApiListResponse<Pedido>>('/pedidos', { params }),
  );
}

export async function confirmarEntregaRequest(
  id: string
): Promise<{ id: string; estado: 'ENTREGADO'; actualizadoEn: string }> {
  return unwrapResponse(
    await apiClient.patch<ApiResponse<{
      id: string;
      estado: 'ENTREGADO';
      actualizadoEn: string;
    }>>(`/pedidos/${id}/confirmar`),
  );
}

export async function crearPedidoRequest(data: {
  clienteId: string;
  fecha?: string;
  items: Array<{ itemId: string; cantidad: number }>;
}): Promise<Pedido> {
  return unwrapResponse(
    await apiClient.post<ApiResponse<Pedido>>('/pedidos', data),
  );
}

export async function cancelarPedidoRequest(
  id: string,
  motivo: MotivoCancelacion
): Promise<{ id: string; estado: 'NO_ENTREGADO'; motivoFalla: string; actualizadoEn: string }> {
  return unwrapResponse(
    await apiClient.patch<ApiResponse<{
      id: string;
      estado: 'NO_ENTREGADO';
      motivoFalla: string;
      actualizadoEn: string;
    }>>(`/pedidos/${id}/cancelar`, { motivo }),
  );
}

export async function agregarItemRequest(
  pedidoId: string,
  data: { itemId: string; cantidad: number }
): Promise<Pedido> {
  return unwrapResponse(
    await apiClient.post<ApiResponse<Pedido>>(`/pedidos/${pedidoId}/items`, data),
  );
}

export async function actualizarCantidadItemRequest(
  pedidoId: string,
  itemId: string,
  cantidad: number
): Promise<Pedido> {
  return unwrapResponse(
    await apiClient.patch<ApiResponse<Pedido>>(
      `/pedidos/${pedidoId}/items/${itemId}`,
      { cantidad },
    ),
  );
}

export async function iniciarEntregaRequest(
  id: string
): Promise<{ id: string; estado: string; actualizadoEn: string }> {
  return unwrapResponse(
    await apiClient.patch<ApiResponse<{
      id: string;
      estado: string;
      actualizadoEn: string;
    }>>(`/pedidos/${id}/estado`, { estado: 'EN_RUTA' }),
  );
}

export async function quitarItemRequest(
  pedidoId: string,
  itemId: string
): Promise<Pedido> {
  return unwrapResponse(
    await apiClient.delete<ApiResponse<Pedido>>(`/pedidos/${pedidoId}/items/${itemId}`),
  );
}
