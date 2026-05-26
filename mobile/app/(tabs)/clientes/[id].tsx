import { useLocalSearchParams } from 'expo-router';
import ClienteEditarScreen from '@/features/clientes/screens/ClienteEditarScreen';

export default function ClienteEditarRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ClienteEditarScreen key={id} />;
}
