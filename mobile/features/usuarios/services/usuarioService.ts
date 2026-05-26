import { apiClient } from '@/services/api';
import type { Usuario, CrearUsuarioInput, ActualizarUsuarioInput } from '@/types';

export async function listUsuariosRequest(): Promise<{ data: Usuario[]; total: number }> {
  const response = await apiClient.get<{ data: Usuario[]; total: number }>('/usuarios');
  return response.data;
}

export async function getUsuarioRequest(id: string): Promise<Usuario> {
  const response = await apiClient.get<{ data: Usuario }>(`/usuarios/${id}`);
  return response.data.data;
}

export async function createUsuarioRequest(input: CrearUsuarioInput): Promise<Usuario> {
  const response = await apiClient.post<{ data: Usuario }>('/usuarios', input);
  return response.data.data;
}

export async function updateUsuarioRequest(
  id: string,
  input: ActualizarUsuarioInput
): Promise<Usuario> {
  const response = await apiClient.patch<{ data: Usuario }>(`/usuarios/${id}`, input);
  return response.data.data;
}

export async function deactivateUsuarioRequest(id: string): Promise<Usuario> {
  const response = await apiClient.delete<{ data: Usuario }>(`/usuarios/${id}`);
  return response.data.data;
}

export async function reactivateUsuarioRequest(id: string): Promise<Usuario> {
  const response = await apiClient.patch<{ data: Usuario }>(`/usuarios/${id}`, {
    activo: true,
  });
  return response.data.data;
}
