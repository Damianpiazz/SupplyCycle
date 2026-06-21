import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function ClientesLayout() {
  const rol = useAuthStore((state) => state.usuario?.rol);

  if (rol !== 'ADMIN') {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="alta" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="editar/[id]" />
    </Stack>
  );
}
