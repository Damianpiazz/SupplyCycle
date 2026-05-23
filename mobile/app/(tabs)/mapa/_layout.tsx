import { Stack } from 'expo-router';

export default function MapaLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'SupplyCycle',
        headerStyle: {
          backgroundColor: '#0a7ea4',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'SupplyCycle' }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: 'Detalle del Pedido' }}
      />
    </Stack>
  );
}
