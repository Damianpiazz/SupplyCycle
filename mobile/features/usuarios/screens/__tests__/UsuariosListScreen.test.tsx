import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useAuthStore } from '@/stores/authStore';
import UsuariosListScreen from '@/features/usuarios/screens/UsuariosListScreen';

const mockUsuarios = [
  {
    id: 'user-1',
    email: 'repartidor@supplycycle.com',
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'REPARTIDOR' as const,
    activo: true,
  },
  {
    id: 'user-3',
    email: 'inactivo@supplycycle.com',
    nombre: 'Ana',
    apellido: 'Admin',
    rol: 'REPARTIDOR' as const,
    activo: false,
  },
];

vi.mock('@/features/usuarios/hooks/useUsuarios', () => ({
  useUsuarios: vi.fn(() => ({
    data: { data: mockUsuarios, total: 2 },
    isLoading: false,
    isError: false,
    error: null,
  })),
  useDesactivarUsuario: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useReactivarUsuario: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

describe('UsuariosListScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      token: 'token',
      usuario: {
        id: 'admin-1',
        email: 'admin@supplycycle.com',
        nombre: 'Ana',
        apellido: 'Admin',
        rol: 'ADMIN',
        activo: true,
      },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('renderiza lista de usuarios sin el usuario autenticado', () => {
    render(<UsuariosListScreen />);
    expect(screen.getByText('Juan Pérez')).toBeTruthy();
    expect(screen.queryByText('Ana Admin')).toBeNull();
    expect(screen.getByText('Activo')).toBeTruthy();
    expect(screen.getByText('Inactivo')).toBeTruthy();
  });

  it('muestra Reactivar para usuario inactivo', () => {
    render(<UsuariosListScreen />);
    expect(screen.getByText('Reactivar')).toBeTruthy();
  });

  it('filtra por búsqueda', async () => {
    render(<UsuariosListScreen />);
    fireEvent.changeText(
      screen.getByPlaceholderText('Buscar por nombre o email...'),
      'Ana'
    );

    await waitFor(() => {
      expect(screen.getByText('Ana Admin')).toBeTruthy();
      expect(screen.queryByText('Juan Pérez')).toBeNull();
    });
  });
});
