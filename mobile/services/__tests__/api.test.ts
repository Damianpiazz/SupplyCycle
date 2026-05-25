import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockCreate = vi.hoisted(() => vi.fn(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn(),
    },
    response: {
      use: vi.fn(),
      eject: vi.fn(),
    },
  },
})));

vi.mock('axios', () => ({
  default: {
    create: mockCreate,
  },
}));

vi.mock('@/features/auth/services/authStorage', () => ({
  getToken: vi.fn(),
  clearToken: vi.fn(),
  saveToken: vi.fn(),
}));

// ─── Imports ──────────────────────────────────────────────────────────────────

import { apiClient } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { clearToken } from '@/features/auth/services/authStorage';

const MOCK_TOKEN = 'mock-jwt-token-supplycycle-2026';
const REAL_TOKEN = 'real-jwt-token';

// Capture handlers at module level — before any beforeEach/clearAllMocks runs
const requestHandler = (apiClient.interceptors.request.use as any).mock.calls[0]?.[0];
const responseErrorHandler = (apiClient.interceptors.response.use as any).mock.calls[0]?.[1];

const mockUsuario = {
  id: '1',
  email: 'test@test.com',
  nombre: 'Test',
  apellido: 'User',
  rol: 'REPARTIDOR' as const,
  activo: true,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('apiClient interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      token: null,
      usuario: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  describe('request interceptor', () => {
    it('debe agregar header Authorization cuando hay token en el store', async () => {
      expect(requestHandler).toBeDefined();

      useAuthStore.getState().setAuth(REAL_TOKEN, mockUsuario);

      const config: any = { headers: {} };
      const result = await requestHandler(config);
      expect(result.headers.Authorization).toBe(`Bearer ${REAL_TOKEN}`);
    });
  });

  describe('response interceptor', () => {
    it('debe hacer logout automático al recibir 401 con token real', async () => {
      expect(responseErrorHandler).toBeDefined();

      useAuthStore.getState().setAuth(REAL_TOKEN, mockUsuario);

      const error = { response: { status: 401 } };
      await expect(responseErrorHandler(error)).rejects.toEqual(error);

      expect(clearToken).toHaveBeenCalled();
      expect(useAuthStore.getState().token).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('NO debe hacer logout al recibir 401 con mock token', async () => {
      expect(responseErrorHandler).toBeDefined();

      useAuthStore.getState().setAuth(MOCK_TOKEN, mockUsuario);

      const error = { response: { status: 401 } };
      await expect(responseErrorHandler(error)).rejects.toEqual(error);

      expect(clearToken).not.toHaveBeenCalled();
      expect(useAuthStore.getState().token).toBe(MOCK_TOKEN);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });
});
