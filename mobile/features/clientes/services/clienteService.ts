import { apiClient } from '@/services/api';
import type { Cliente, CrearClienteInput, ActualizarClienteInput } from '@/types';

export async function listClientesRequest(): Promise<Cliente[]> {
  const response = await apiClient.get<{ data: Cliente[] }>('/clientes');
  return response.data.data;
}

export async function getClienteRequest(id: string): Promise<Cliente> {
  const response = await apiClient.get<{ data: Cliente }>(`/clientes/${id}`);
  return response.data.data;
}

export async function createClienteRequest(input: CrearClienteInput): Promise<Cliente> {
  const response = await apiClient.post<{ data: Cliente }>('/clientes', input);
  return response.data.data;
}

export async function updateClienteRequest(
  id: string,
  input: ActualizarClienteInput
): Promise<Cliente> {
  const response = await apiClient.patch<{ data: Cliente }>(`/clientes/${id}`, input);
  return response.data.data;
}

export async function deleteClienteRequest(id: string): Promise<void> {
  await apiClient.delete(`/clientes/${id}`);
}
