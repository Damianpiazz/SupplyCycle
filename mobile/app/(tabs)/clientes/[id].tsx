import { useLocalSearchParams } from 'expo-router';
import ClienteVerScreen from '@/features/clientes/screens/ClienteVerScreen';

export default function ClienteVerRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ClienteVerScreen key={id} />;
}
