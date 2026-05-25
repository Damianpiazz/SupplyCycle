import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useAuthStore } from '@/stores/authStore';
import { router } from 'expo-router';
import PerfilScreen from '@/features/perfil/screens/PerfilScreen';

// Mock clearToken
vi.mock('@/features/auth/services/authStorage', () => ({
  clearToken: vi.fn(() => Promise.resolve()),
}));

const mockUsuario = {
  id: 'user-1',
  email: 'repartidor@supplycycle.com',
  nombre: 'Carlos',
  apellido: 'López',
  rol: 'REPARTIDOR' as const,
  activo: true,
};

describe('PerfilScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      token: 'token',
      usuario: mockUsuario,
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('should render user information', () => {
    render(<PerfilScreen />);
    expect(screen.getByText('SupplyCycle')).toBeTruthy();
    expect(screen.getByText('Carlos López')).toBeTruthy();
    expect(screen.getByText('repartidor@supplycycle.com')).toBeTruthy();
    expect(screen.getByText('Repartidor')).toBeTruthy();
  });

  it('should show initials in avatar', () => {
    render(<PerfilScreen />);
    expect(screen.getByText('CL')).toBeTruthy();
  });

  it('should show empty state when no usuario', () => {
    useAuthStore.setState({ usuario: null, isAuthenticated: false });
    render(<PerfilScreen />);
    expect(screen.getByText('No hay datos de usuario disponibles')).toBeTruthy();
  });

  it('should call logout and redirect on cerrar sesion', async () => {
    render(<PerfilScreen />);
    fireEvent.press(screen.getByText('Cerrar sesión'));

    await waitFor(() => {
      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(router.replace).toHaveBeenCalledWith('/login');
    });
  });
});
