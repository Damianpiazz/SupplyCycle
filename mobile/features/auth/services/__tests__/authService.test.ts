import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthResponse, LoginCredentials, Usuario } from '@/types';

vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { loginRequest, getMeRequest } from '../authService';
import { apiClient } from '@/services/api';

const mockUsuario: Usuario = {
  id: 'repartidor-1',
  email: 'repartidor@supplycycle.com',
  nombre: 'Carlos',
  apellido: 'López',
  rol: 'REPARTIDOR',
  activo: true,
};

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loginRequest', () => {
    it('debe iniciar sesión y devolver token con datos del usuario', async () => {
      const credentials: LoginCredentials = {
        email: 'repartidor@supplycycle.com',
        password: '12345678',
      };
      const authResponse: AuthResponse = { token: 'jwt-token', usuario: mockUsuario };
      (apiClient.post as any).mockResolvedValue({ data: authResponse });

      const result = await loginRequest(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(authResponse);
    });
  });

  describe('getMeRequest', () => {
    it('debe obtener el usuario autenticado desde el token actual', async () => {
      (apiClient.get as any).mockResolvedValue({ data: mockUsuario });

      const result = await getMeRequest();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUsuario);
    });
  });
});
