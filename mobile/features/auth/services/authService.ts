import { apiClient } from '@/services/api';
import type { AuthResponse, LoginCredentials, Usuario } from '@/types';

export async function loginRequest(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
}

export async function getMeRequest(): Promise<Usuario> {
  const response = await apiClient.get<Usuario>('/auth/me');
  return response.data;
}
