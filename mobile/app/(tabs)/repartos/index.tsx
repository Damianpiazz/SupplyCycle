import { useAuthStore } from '@/stores/authStore';
import RepartosListScreen from '@/features/repartos/screens/RepartosListScreen';
import AdminRepartosListScreen from '@/features/repartos/screens/AdminRepartosListScreen';

export default function RepartosRoute() {
  const rol = useAuthStore((state) => state.usuario?.rol);
  if (rol === 'ADMIN') {
    return <AdminRepartosListScreen />;
  }
  return <RepartosListScreen />;
}
