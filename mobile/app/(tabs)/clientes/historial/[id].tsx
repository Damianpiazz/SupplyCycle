import { useLocalSearchParams } from 'expo-router';
import ClienteHistorialScreen from '@/features/clientes/screens/ClienteHistorialScreen';

export default function ClienteHistorialRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ClienteHistorialScreen key={id} />;
}
