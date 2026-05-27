import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '../../../utils/api-error.js';

const mockPrisma = {
  usuario: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
};

vi.mock('../../../lib/prisma.js', () => ({ prisma: mockPrisma }));
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(() => Promise.resolve('hashed-password')),
  },
}));

const {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario,
} = await import('../service.js');

const baseUsuario = {
  id: 'user-1',
  email: 'test@test.com',
  nombre: 'Juan',
  apellido: 'Pérez',
  rol: 'REPARTIDOR',
  activo: true,
};

describe('UsuariosService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listarUsuarios devuelve lista sin password', async () => {
    mockPrisma.usuario.findMany.mockResolvedValue([baseUsuario]);

    const result = await listarUsuarios();

    expect(mockPrisma.usuario.findMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'user-1',
      email: 'test@test.com',
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'REPARTIDOR',
      activo: true,
    });
  });

  it('listarUsuarios excluye al usuario autenticado', async () => {
    mockPrisma.usuario.findMany.mockResolvedValue([]);

    await listarUsuarios('admin-1');

    expect(mockPrisma.usuario.findMany).toHaveBeenCalledWith({
      where: { id: { not: 'admin-1' } },
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    });
  });

  it('crearUsuario crea usuario activo', async () => {
    mockPrisma.usuario.create.mockResolvedValue(baseUsuario);

    const result = await crearUsuario({
      email: 'test@test.com',
      password: 'Password1',
      nombre: 'Juan',
      apellido: 'Pérez',
    });

    expect(result.activo).toBe(true);
    expect(mockPrisma.usuario.create).toHaveBeenCalled();
  });

  it('actualizarUsuario actualiza campos', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(baseUsuario);
    mockPrisma.usuario.update.mockResolvedValue({
      ...baseUsuario,
      nombre: 'Pedro',
    });

    const result = await actualizarUsuario('user-1', { nombre: 'Pedro' });

    expect(result.nombre).toBe('Pedro');
  });

  it('actualizarUsuario reactiva usuario inactivo', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue({ ...baseUsuario, activo: false });
    mockPrisma.usuario.update.mockResolvedValue({ ...baseUsuario, activo: true });

    const result = await actualizarUsuario('user-1', { activo: true });

    expect(result.activo).toBe(true);
    expect(mockPrisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { activo: true },
    });
  });

  it('actualizarUsuario con activo true es idempotente si ya está activo', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(baseUsuario);

    const result = await actualizarUsuario('user-1', { activo: true });

    expect(result.activo).toBe(true);
    expect(mockPrisma.usuario.update).not.toHaveBeenCalled();
  });

  it('desactivarUsuario marca activo=false', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(baseUsuario);
    mockPrisma.usuario.update.mockResolvedValue({ ...baseUsuario, activo: false });

    const result = await desactivarUsuario('user-1', 'admin-1');

    expect(result.activo).toBe(false);
  });

  it('desactivarUsuario no permite desactivarse a sí mismo', async () => {
    await expect(desactivarUsuario('admin-1', 'admin-1')).rejects.toThrow(ApiError);
    await expect(desactivarUsuario('admin-1', 'admin-1')).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it('desactivarUsuario no permite desactivar último admin', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue({
      ...baseUsuario,
      id: 'admin-1',
      rol: 'ADMIN',
    });
    mockPrisma.usuario.count.mockResolvedValue(1);

    await expect(desactivarUsuario('admin-1', 'admin-2')).rejects.toThrow(ApiError);
    await expect(desactivarUsuario('admin-1', 'admin-2')).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});
