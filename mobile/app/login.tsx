import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import LoginScreen from '@/features/auth/screens/LoginScreen';

export default function LoginRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <LoginScreen />;
}
