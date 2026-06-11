import { apiClient, unwrapResponse } from '@/services/api';
import type { Reparto, RepartoAdminListItem, RepartoAdminDetalle, ResumenCarga } from '@/types/reparto';
import type { Pedido } from '@/types/pedido';
import type { ApiResponse, ApiListResponse } from '@/types/api';

export async function getRepartosAdminRequest(fecha?: string): Promise<RepartoAdminListItem[]> {
  const params: Record<string, string> = {};
  if (fecha) params.fecha = fecha;
  return unwrapResponse(
    await apiClient.get<ApiResponse<RepartoAdminListItem[]>>('/repartos/admin', { params }),
  );
}

export async function getRepartoAdminByIdRequest(id: string): Promise<RepartoAdminDetalle> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<RepartoAdminDetalle>>(`/repartos/admin/${id}`),
  );
}

export async function getRepartoHoyRequest(): Promise<Reparto | null> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Reparto | null>>('/repartos/hoy'),
  );
}

export async function getRepartosRequest(
  repartidorId: string,
  fecha?: string,
  estado?: string
): Promise<Reparto[]> {
  const params: Record<string, string> = { repartidorId };
  if (fecha) params.fecha = fecha;
  if (estado) params.estado = estado;
  return unwrapResponse(
    await apiClient.get<ApiResponse<Reparto[]>>('/repartos', { params }),
  );
}

export async function getRepartoByIdRequest(id: string): Promise<Reparto> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Reparto>>(`/repartos/${id}`),
  );
}

export async function getResumenCargaRequest(
  repartoId: string
): Promise<{ repartoId: string; items: ResumenCarga[] }> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<{ repartoId: string; items: ResumenCarga[] }>>(
      `/repartos/${repartoId}/carga`,
    ),
  );
}

export async function crearRepartoRequest(data: {
  repartidorId: string;
  fecha: string;
  pedidoIds: string[];
}): Promise<Reparto> {
  return unwrapResponse(
    await apiClient.post<ApiResponse<Reparto>>('/repartos', data),
  );
}

export async function getPedidosDisponiblesRequest(fecha: string): Promise<Pedido[]> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Pedido[]>>('/pedidos/disponibles', {
      params: { fecha },
    }),
  );
}

export async function updateRepartoEstadoRequest(
  id: string,
  estado: 'EN_CURSO' | 'COMPLETADO'
): Promise<{ id: string; estado: string; actualizadoEn: string }> {
  return unwrapResponse(
    await apiClient.patch<ApiResponse<{ id: string; estado: string; actualizadoEn: string }>>(
      `/repartos/${id}/estado`,
      { estado },
    ),
  );
}

export async function agregarPedidoARepartoRequest(
  repartoId: string,
  pedidoId: string
): Promise<{ repartoId: string; pedidoId: string; accion: string }> {
  return unwrapResponse(
    await apiClient.post<ApiResponse<{ repartoId: string; pedidoId: string; accion: string }>>(
      `/repartos/admin/${repartoId}/pedidos`,
      { pedidoId },
    ),
  );
}

export async function quitarPedidoDeRepartoRequest(
  repartoId: string,
  pedidoId: string
): Promise<{ repartoId: string; pedidoId: string; accion: string }> {
  return unwrapResponse(
    await apiClient.delete<ApiResponse<{ repartoId: string; pedidoId: string; accion: string }>>(
      `/repartos/admin/${repartoId}/pedidos/${pedidoId}`,
    ),
  );
}
