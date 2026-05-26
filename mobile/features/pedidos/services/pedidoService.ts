import { apiClient } from '@/services/api';
import type { Pedido, EstadoPedido, MotivoCancelacion } from '@/types/pedido';

export async function getPedidosDelDiaRequest(
  repartidorId: string
): Promise<Pedido[]> {
  const response = await apiClient.get<{ data: Pedido[] }>('/pedidos/hoy', {
    params: { repartidorId },
  });
  return response.data.data;
}

export async function getPedidoByIdRequest(id: string): Promise<Pedido> {
  const response = await apiClient.get<{ data: Pedido }>(`/pedidos/${id}`);
  return response.data.data;
}

export async function getPedidosRequest(params?: {
  clienteNombre?: string;
  fecha?: string;
  estado?: EstadoPedido;
}): Promise<{ data: Pedido[]; total: number }> {
  const response = await apiClient.get<{ data: Pedido[]; total: number }>('/pedidos', {
    params,
  });
  return response.data;
}

export async function confirmarEntregaRequest(
  id: string
): Promise<{ id: string; estado: 'ENTREGADO'; actualizadoEn: string }> {
  const response = await apiClient.patch<{
    id: string;
    estado: 'ENTREGADO';
    actualizadoEn: string;
  }>(`/pedidos/${id}/confirmar`);
  return response.data;
}

export async function crearPedidoRequest(data: {
  clienteId: string;
  fecha?: string;
  items: Array<{ itemId: string; cantidad: number }>;
}): Promise<Pedido> {
  const response = await apiClient.post<{ data: Pedido }>('/pedidos', data);
  return response.data.data;
}

export async function cancelarPedidoRequest(
  id: string,
  motivo: MotivoCancelacion
): Promise<{ id: string; estado: 'NO_ENTREGADO'; motivoFalla: string; actualizadoEn: string }> {
  const response = await apiClient.patch<{
    id: string;
    estado: 'NO_ENTREGADO';
    motivoFalla: string;
    actualizadoEn: string;
  }>(`/pedidos/${id}/cancelar`, { motivo });
  return response.data;
}

export async function agregarItemRequest(
  pedidoId: string,
  data: { itemId: string; cantidad: number }
): Promise<Pedido> {
  const response = await apiClient.post<Pedido>(`/pedidos/${pedidoId}/items`, data);
  return response.data;
}

export async function actualizarCantidadItemRequest(
  pedidoId: string,
  itemId: string,
  cantidad: number
): Promise<Pedido> {
  const response = await apiClient.patch<Pedido>(
    `/pedidos/${pedidoId}/items/${itemId}`,
    { cantidad }
  );
  return response.data;
}

export async function iniciarEntregaRequest(
  id: string
): Promise<{ id: string; estado: 'EN_RUTA'; actualizadoEn: string }> {
  const response = await apiClient.patch<{
    id: string;
    estado: 'EN_RUTA';
    actualizadoEn: string;
  }>(`/pedidos/${id}/estado`, { estado: 'EN_RUTA' });
  return response.data;
}

export async function quitarItemRequest(
  pedidoId: string,
  itemId: string
): Promise<Pedido> {
  const response = await apiClient.delete<Pedido>(`/pedidos/${pedidoId}/items/${itemId}`);
  return response.data;
}
