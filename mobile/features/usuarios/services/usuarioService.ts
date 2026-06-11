import { apiClient, unwrapResponse, unwrapList } from '@/services/api';
import type { Usuario, CrearUsuarioInput, ActualizarUsuarioInput } from '@/types';
import type { ApiResponse, ApiListResponse } from '@/types/api';

export async function listUsuariosRequest(): Promise<{ data: Usuario[]; total: number }> {
  return unwrapList(
    await apiClient.get<ApiListResponse<Usuario>>('/usuarios'),
  );
}

export async function getUsuarioRequest(id: string): Promise<Usuario> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Usuario>>(`/usuarios/${id}`),
  );
}

export async function createUsuarioRequest(input: CrearUsuarioInput): Promise<Usuario> {
  return unwrapResponse(
    await apiClient.post<ApiResponse<Usuario>>('/usuarios', input),
  );
}

export async function updateUsuarioRequest(
  id: string,
  input: ActualizarUsuarioInput
): Promise<Usuario> {
  return unwrapResponse(
    await apiClient.patch<ApiResponse<Usuario>>(`/usuarios/${id}`, input),
  );
}

export async function deactivateUsuarioRequest(id: string): Promise<Usuario> {
  return unwrapResponse(
    await apiClient.delete<ApiResponse<Usuario>>(`/usuarios/${id}`),
  );
}

export async function reactivateUsuarioRequest(id: string): Promise<Usuario> {
  return unwrapResponse(
    await apiClient.patch<ApiResponse<Usuario>>(`/usuarios/${id}`, { activo: true }),
  );
}
