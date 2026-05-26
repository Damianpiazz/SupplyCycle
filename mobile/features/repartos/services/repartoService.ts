import { apiClient } from '@/services/api';
import type { Reparto, RepartoAdminListItem, RepartoAdminDetalle, ResumenCarga } from '@/types/reparto';
import type { Pedido } from '@/types/pedido';

export async function getRepartosAdminRequest(fecha?: string): Promise<RepartoAdminListItem[]> {
  const params: Record<string, string> = {};
  if (fecha) params.fecha = fecha;
  const response = await apiClient.get<{ data: RepartoAdminListItem[]; total: number }>('/repartos/admin', { params });
  return response.data.data;
}

export async function getRepartoAdminByIdRequest(id: string): Promise<RepartoAdminDetalle> {
  const response = await apiClient.get<{ data: RepartoAdminDetalle }>(`/repartos/admin/${id}`);
  return response.data.data;
}

export async function getRepartoHoyRequest(): Promise<Reparto | null> {
  const response = await apiClient.get<{ data: Reparto | null; message?: string }>('/repartos/hoy');
  return response.data.data;
}

export async function getRepartosRequest(
  repartidorId: string,
  fecha?: string,
  estado?: string
): Promise<Reparto[]> {
  const params: Record<string, string> = { repartidorId };
  if (fecha) params.fecha = fecha;
  if (estado) params.estado = estado;
  const response = await apiClient.get<{ data: Reparto[] }>('/repartos', { params });
  return response.data.data;
}

export async function getRepartoByIdRequest(id: string): Promise<Reparto> {
  const response = await apiClient.get<{ data: Reparto }>(`/repartos/${id}`);
  return response.data.data;
}

export async function getResumenCargaRequest(
  repartoId: string
): Promise<{ repartoId: string; items: ResumenCarga[] }> {
  const response = await apiClient.get<{ repartoId: string; items: ResumenCarga[] }>(
    `/repartos/${repartoId}/carga`
  );
  return response.data;
}

export async function crearRepartoRequest(data: {
  repartidorId: string;
  fecha: string;
  pedidoIds: string[];
}): Promise<Reparto> {
  const response = await apiClient.post<{ data: Reparto }>('/repartos', data);
  return response.data.data;
}

export async function getPedidosDisponiblesRequest(fecha: string): Promise<Pedido[]> {
  const response = await apiClient.get<{ data: Pedido[]; total: number }>('/pedidos/disponibles', {
    params: { fecha },
  });
  return response.data.data;
}

export async function updateRepartoEstadoRequest(
  id: string,
  estado: 'EN_CURSO' | 'COMPLETADO'
): Promise<{ id: string; estado: string; actualizadoEn: string }> {
  const response = await apiClient.patch<{ id: string; estado: string; actualizadoEn: string }>(
    `/repartos/${id}/estado`,
    { estado }
  );
  return response.data;
}

export async function agregarPedidoARepartoRequest(
  repartoId: string,
  pedidoId: string
): Promise<{ repartoId: string; pedidoId: string; accion: string }> {
  const response = await apiClient.post<{ data: { repartoId: string; pedidoId: string; accion: string } }>(
    `/repartos/admin/${repartoId}/pedidos`,
    { pedidoId }
  );
  return response.data.data;
}

export async function quitarPedidoDeRepartoRequest(
  repartoId: string,
  pedidoId: string
): Promise<{ repartoId: string; pedidoId: string; accion: string }> {
  const response = await apiClient.delete<{ data: { repartoId: string; pedidoId: string; accion: string } }>(
    `/repartos/admin/${repartoId}/pedidos/${pedidoId}`
  );
  return response.data.data;
}
