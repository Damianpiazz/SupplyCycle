import { Stack } from 'expo-router';

export default function RepartosLayout() {
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
    </Stack>
  );
}
