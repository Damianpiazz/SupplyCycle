import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
// Cargar fuentes Inter directamente desde los archivos .ttf individuales
// para evitar que el index.js del paquete intente cargar todos los pesos
import Inter_400Regular from '@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf';
import Inter_500Medium from '@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf';
import Inter_600SemiBold from '@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf';
import Inter_700Bold from '@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf';
import 'react-native-reanimated';
import { QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/authStore';
import { getToken } from '@/features/auth/services/authStorage';
import { LoadingSpinner, Toast } from '@/components/ui';
import ErrorBoundary from '@/components/error-boundary';
import { queryClient } from '@/lib/queryClient';
import useOfflineSync from '@/hooks/useOfflineSync';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isLoading, setAuth, setLoading } = useAuthStore();

  // Cargar tipografía Inter
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Timeout de seguridad: si las fonts no cargan en 4s, renderiza igual
  const [fontsTimeout, setFontsTimeout] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setFontsTimeout(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Inicializar sincronización offline
  useOfflineSync();

  // Bootstrap: check if we have a stored token
  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await getToken();
        if (token) {
          try {
            const response = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/auth/me`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            if (response.ok) {
              const usuario = await response.json();
              setAuth(token, usuario);
              return;
            }
          } catch {
            // Error de red o backend caído -> ir a login
          }
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

  // Esperar fonts (o timeout 4s) + auth listo
  const ready = (fontsLoaded || fontsTimeout) && !isLoading;

  if (!ready) {
    return (
      <ErrorBoundary>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <LoadingSpinner message="Iniciando sesión..." />
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
