import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { saveToken } from '@/features/auth/services/authStorage';
import { loginRequest } from '@/features/auth/services/authService';
import type { LoginCredentials } from '@/types';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginRequest(credentials),
    onSuccess: async (data) => {
      try {
        await saveToken(data.token);
      } catch {
        console.warn('saveToken failed, continuing without persistent session');
      }
      setAuth(data.token, data.usuario);
      router.replace('/');
    },
  });
}
