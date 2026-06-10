import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/authStore';
import { getToken, clearToken } from '@/features/auth/services/authStorage';
import { LoadingSpinner, Toast } from '@/components/ui';
import { queryClient } from '@/lib/queryClient';
import useOfflineSync from '@/hooks/useOfflineSync';
import { apiClient } from '@/services/api';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isLoading, setAuth, setLoading } = useAuthStore();

  // Inicializar sincronización offline
  useOfflineSync();

  // Bootstrap: check if we have a stored token
  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await getToken();
        if (token) {
          try {
            const response = await apiClient.get('/auth/me', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setAuth(token, response.data.data);
            return;
          } catch {
            // Token inválido, expirado o backend no disponible
          }
          // Limpiar token inválido
          await clearToken();
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    }
    bootstrap();
  }, [setAuth, setLoading]);

  if (isLoading) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <LoadingSpinner message="Iniciando sesión..." />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
        <StatusBar style="auto" />
        <Toast />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
