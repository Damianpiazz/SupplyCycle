import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { saveToken } from '@/features/auth/services/authStorage';
import { loginRequest } from '@/features/auth/services/authService';
import type { LoginCredentials, AuthResponse } from '@/types';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      return await loginRequest(credentials);
    },
    onSuccess: async (data) => {
      await saveToken(data.token).catch(() => {});
      setAuth(data.token, data.usuario);
      // El <Redirect> en login.tsx redirige a / automáticamente
    },
  });
}
