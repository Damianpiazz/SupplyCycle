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
