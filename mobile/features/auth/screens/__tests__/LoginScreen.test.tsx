import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

// Mock the useLogin hook
const mockMutate = vi.fn();
const mockUseLogin = vi.fn(() => ({
  mutate: mockMutate,
  isPending: false,
  error: null,
}));

vi.mock('@/features/auth/hooks/useLogin', () => ({
  useLogin: () => mockUseLogin(),
}));

import LoginScreen from '@/features/auth/screens/LoginScreen';

describe('LoginScreen', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should render header, email input, password input and login button', () => {
    render(<LoginScreen />);
    expect(screen.getByText('SupplyCycle')).toBeTruthy();
    expect(screen.getByText('Iniciar sesión')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Contraseña')).toBeTruthy();
    expect(screen.getByText('Ingresar')).toBeTruthy();
  });

  it('should show validation error when email is empty', () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText('Ingresar'));
    expect(screen.getByText('El email es requerido')).toBeTruthy();
  });

  it('should show validation error when email format is invalid', () => {
    render(<LoginScreen />);
    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com');
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(screen.getByText('Ingresar'));
    expect(screen.getByText('El email no tiene un formato válido')).toBeTruthy();
  });

  it('should show validation error when password is empty', () => {
    render(<LoginScreen />);
    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com');
    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.press(screen.getByText('Ingresar'));
    expect(screen.getByText('La contraseña es requerida')).toBeTruthy();
  });

  it('should call login mutation with valid credentials', () => {
    render(<LoginScreen />);
    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(passwordInput, '123456');
    fireEvent.press(screen.getByText('Ingresar'));
    expect(mockMutate).toHaveBeenCalledWith({ email: 'test@test.com', password: '123456' });
  });

  it('should show loading state when mutation is pending', () => {
    mockUseLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
    });
    render(<LoginScreen />);
    expect(screen.getByText('Cargando...')).toBeTruthy();
  });

  it('should show server error when login fails', () => {
    mockUseLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: {
        response: {
          data: {
            error: { message: 'Credenciales inválidas' },
          },
        },
      },
    });
    render(<LoginScreen />);
    expect(screen.getByText('Credenciales inválidas')).toBeTruthy();
  });
});
