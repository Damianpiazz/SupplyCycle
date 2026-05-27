import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/services/api';
import {
  listUsuariosRequest,
  createUsuarioRequest,
  deactivateUsuarioRequest,
  reactivateUsuarioRequest,
} from '@/features/usuarios/services/usuarioService';

vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockUsuario = {
  id: 'user-1',
  email: 'admin@test.com',
  nombre: 'Ana',
  apellido: 'Admin',
  rol: 'ADMIN' as const,
  activo: true,
};

describe('usuarioService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listUsuariosRequest devuelve lista', async () => {
    (apiClient.get as any).mockResolvedValue({
      data: { data: [mockUsuario], total: 1 },
    });

    const result = await listUsuariosRequest();

    expect(apiClient.get).toHaveBeenCalledWith('/usuarios');
    expect(result.data).toHaveLength(1);
  });

  it('createUsuarioRequest crea usuario', async () => {
    (apiClient.post as any).mockResolvedValue({ data: { data: mockUsuario } });

    const result = await createUsuarioRequest({
      email: 'admin@test.com',
      password: 'Password1',
      nombre: 'Ana',
      apellido: 'Admin',
      rol: 'ADMIN',
    });

    expect(result).toEqual(mockUsuario);
  });

  it('deactivateUsuarioRequest desactiva usuario', async () => {
    (apiClient.delete as any).mockResolvedValue({
      data: { data: { ...mockUsuario, activo: false } },
    });

    const result = await deactivateUsuarioRequest('user-1');

    expect(result.activo).toBe(false);
  });

  it('reactivateUsuarioRequest reactiva usuario', async () => {
    (apiClient.patch as any).mockResolvedValue({
      data: { data: { ...mockUsuario, activo: true } },
    });

    const result = await reactivateUsuarioRequest('user-1');

    expect(apiClient.patch).toHaveBeenCalledWith('/usuarios/user-1', { activo: true });
    expect(result.activo).toBe(true);
  });
});
