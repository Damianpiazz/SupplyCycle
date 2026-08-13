import { apiClient, unwrapResponse } from '@/services/api';
import type { Cliente, CrearClienteInput, ActualizarClienteInput } from '@/types';
import type { ApiResponse } from '@/types/api';
import type { ResumenConsumo, PedidoHistorialResumen } from '@/types/historial';

export async function listClientesRequest(): Promise<Cliente[]> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Cliente[]>>('/clientes'),
  );
}

export async function getClienteRequest(id: string): Promise<Cliente> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Cliente>>(`/clientes/${id}`),
  );
}

export async function createClienteRequest(input: CrearClienteInput): Promise<Cliente> {
  return unwrapResponse(
    await apiClient.post<ApiResponse<Cliente>>('/clientes', input),
  );
}

export async function updateClienteRequest(
  id: string,
  input: ActualizarClienteInput
): Promise<Cliente> {
  return unwrapResponse(
    await apiClient.patch<ApiResponse<Cliente>>(`/clientes/${id}`, input),
  );
}

export async function deleteClienteRequest(id: string): Promise<void> {
  await apiClient.delete(`/clientes/${id}`);
}

export async function getPedidosClienteRequest(id: string): Promise<PedidoHistorialResumen[]> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<PedidoHistorialResumen[]>>(`/clientes/${id}/pedidos`),
  );
}

export async function getConsumoClienteRequest(id: string): Promise<ResumenConsumo> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<ResumenConsumo>>(`/clientes/${id}/consumo`),
  );
}
