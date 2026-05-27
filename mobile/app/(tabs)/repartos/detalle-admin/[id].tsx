import { useLocalSearchParams, router } from 'expo-router';
import AdminRepartoDetalleScreen from '@/features/repartos/screens/AdminRepartoDetalleScreen';

export default function AdminRepartoDetalleRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AdminRepartoDetalleScreen id={id} onBack={() => router.replace('/repartos')} />;
}
