import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/authStore';
import { getToken } from '@/features/auth/services/authStorage';
import { LoadingSpinner } from '@/components/ui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isLoading, isAuthenticated, setAuth, setLoading } = useAuthStore();

  // Bootstrap: check if we have a stored token
  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await getToken();
        if (token) {
          const { mockGetMeRequest } = await import(
            '@/features/auth/services/mockAuthService'
          );
          const usuario = await mockGetMeRequest();
          setAuth(token, usuario);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    }
    bootstrap();
  }, [setAuth, setLoading]);

  // Auth gate: redirect SOLO al terminar bootstrap (isLoading pasa de true a false)
  // El redirect post-login lo maneja el hook useLogin, no este efecto
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading]);

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
      </QueryClientProvider>
    </ThemeProvider>
  );
}
