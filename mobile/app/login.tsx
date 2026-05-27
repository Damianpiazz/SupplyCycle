import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import LoginScreen from '@/features/auth/screens/LoginScreen';

export default function LoginRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const usuario = useAuthStore((state) => state.usuario);

  if (isAuthenticated) {
    if (usuario?.rol === 'ADMIN') {
      return <Redirect href="/pedidos" />;
    }
    return <Redirect href="/" />;
  }

  return <LoginScreen />;
}
