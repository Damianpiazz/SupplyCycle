import { apiClient, unwrapResponse } from '@/services/api';
import type { AuthResponse, LoginCredentials, Usuario } from '@/types';
import type { ApiResponse } from '@/types/api';

export async function loginRequest(credentials: LoginCredentials): Promise<AuthResponse> {
  return unwrapResponse(
    await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials),
  );
}

export async function getMeRequest(): Promise<Usuario> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Usuario>>('/auth/me'),
  );
}

export type UpdateMeInput = Partial<Pick<Usuario, 'nombre' | 'apellido' | 'email'>>;

export async function updateMeRequest(input: UpdateMeInput): Promise<Usuario> {
  return unwrapResponse(
    await apiClient.patch<ApiResponse<Usuario>>('/auth/me', input),
  );
}
