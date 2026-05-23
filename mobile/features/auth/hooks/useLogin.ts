import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { saveToken } from '@/features/auth/services/authStorage';
import { loginRequest } from '@/features/auth/services/authService';
import { mockLoginRequest } from '@/features/auth/services/mockAuthService';
import type { LoginCredentials } from '@/types';

const USE_MOCK = true; // Set to false when backend is available

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      if (USE_MOCK) {
        return mockLoginRequest(credentials);
      }
      return loginRequest(credentials);
    },
    onSuccess: async (data) => {
      await saveToken(data.token);
      setAuth(data.token, data.usuario);
      router.replace('/');
    },
  });
}
