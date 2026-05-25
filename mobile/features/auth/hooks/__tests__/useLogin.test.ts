import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMutation } from '@tanstack/react-query';
import { useLogin } from '@/features/auth/hooks/useLogin';

const mockSaveToken = vi.hoisted(() => vi.fn(() => Promise.resolve()));
vi.mock('@/features/auth/services/authStorage', () => ({
  saveToken: mockSaveToken,
}));

const mockLoginRequest = vi.hoisted(() => vi.fn());
vi.mock('@/features/auth/services/authService', () => ({
  loginRequest: mockLoginRequest,
}));

const mockMockLoginRequest = vi.hoisted(() => vi.fn());
vi.mock('@/features/auth/services/mockAuthService', () => ({
  mockLoginRequest: mockMockLoginRequest,
}));

const mockSetAuth = vi.hoisted(() => vi.fn());
vi.mock('@/stores/authStore', () => ({
  useAuthStore: (selector: any) => selector({ setAuth: mockSetAuth }),
}));

const credentials = { email: 'test@test.com', password: '12345678' };
const authResponse = {
  token: 'mock-token',
  usuario: {
    id: 'u1',
    email: 'test@test.com',
    nombre: 'Test',
    apellido: 'User',
    rol: 'REPARTIDOR' as const,
    activo: true,
  },
};

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve un objeto mutation con mutate y mutateAsync', () => {
    const result = useLogin();
    expect(result).toBeDefined();
    expect(result.mutate).toBeDefined();
    expect(result.mutateAsync).toBeDefined();
  });

  it('llama a loginRequest con las credenciales en mutate', async () => {
    mockLoginRequest.mockResolvedValue(authResponse);
    useLogin();
    const config = vi.mocked(useMutation).mock.calls[0][0];
    const result = await config.mutationFn(credentials);
    expect(mockLoginRequest).toHaveBeenCalledWith(credentials);
    expect(result).toEqual(authResponse);
  });

  it('hace fallback a mockLoginRequest cuando loginRequest falla', async () => {
    mockLoginRequest.mockRejectedValue(new Error('Network error'));
    mockMockLoginRequest.mockResolvedValue(authResponse);
    useLogin();
    const config = vi.mocked(useMutation).mock.calls[0][0];
    const result = await config.mutationFn(credentials);
    expect(mockLoginRequest).toHaveBeenCalledWith(credentials);
    expect(mockMockLoginRequest).toHaveBeenCalledWith(credentials);
    expect(result).toEqual(authResponse);
  });

  it('guarda el token y actualiza el store en onSuccess', async () => {
    useLogin();
    const config = vi.mocked(useMutation).mock.calls[0][0];
    await config.onSuccess(authResponse, credentials, undefined);
    expect(mockSaveToken).toHaveBeenCalledWith('mock-token');
    expect(mockSetAuth).toHaveBeenCalledWith('mock-token', authResponse.usuario);
  });
});
