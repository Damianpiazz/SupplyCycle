import { apiClient } from './api';
import type { Reparto } from '@/types';

export async function getRepartosDisponiblesRequest(repartidorId: string): Promise<Reparto[]> {
  const response = await apiClient.get<{ data: Reparto[] }>('/repartos', {
    params: { repartidorId },
  });
  return response.data.data;
}
