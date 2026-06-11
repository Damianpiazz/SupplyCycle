import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import InicioScreen from '@/features/repartos/screens/InicioScreen';

export default function HomeRoute() {
  const usuario = useAuthStore((state) => state.usuario);

  if (usuario?.rol === 'ADMIN') {
    return <Redirect href="/pedidos" />;
  }

  return <InicioScreen />;
}
