import { Stack } from 'expo-router';

export default function RepartosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="crear" />
      <Stack.Screen name="detalle-admin/[id]" />
    </Stack>
  );
}
