import { apiClient } from '@/services/api';
import type { Reparto, ResumenCarga } from '@/types/reparto';

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
