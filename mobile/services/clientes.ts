import { apiClient } from './api';
import type { Cliente } from '@/types';

export async function getClientesRequest(): Promise<Cliente[]> {
  const response = await apiClient.get<{ data: Cliente[] }>('/clientes');
  return response.data.data;
}
