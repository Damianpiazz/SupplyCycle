import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { saveToken } from '@/features/auth/services/authStorage';
import { loginRequest } from '@/features/auth/services/authService';
import { mockLoginRequest } from '@/features/auth/services/mockAuthService';
import type { LoginCredentials, AuthResponse } from '@/types';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      // 1. Intentar con el backend real
      try {
        return await loginRequest(credentials);
      } catch {
        // 2. Si falla (red, 401, etc.), usar mock
        return await mockLoginRequest(credentials);
      }
    },
    onSuccess: async (data) => {
      try {
        await saveToken(data.token);
      } catch {
        console.warn('saveToken failed, continuing without persistent session');
      }
      setAuth(data.token, data.usuario);
      // El <Redirect> en login.tsx redirige a / automáticamente
    },
  });
}
