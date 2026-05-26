import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '../../../utils/api-error.js';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPrisma = {
  usuario: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock('../../../lib/prisma.js', () => ({ prisma: mockPrisma }));
vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));
vi.mock('../../../config/env.js', () => ({
  env: { jwtSecret: 'test-secret' },
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

const { updateMe } = await import('../service.js');

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const activeUser = {
  id: 'user-1',
  email: 'test@test.com',
  nombre: 'Juan',
  apellido: 'Pérez',
  rol: 'REPARTIDOR',
  activo: true,
  password: 'hashed',
};

const inactiveUser = {
  ...activeUser,
  activo: false,
};

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('AuthService — updateMe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('actualiza solo el nombre', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(activeUser);
    mockPrisma.usuario.update.mockResolvedValue({ ...activeUser, nombre: 'Pedro' });

    const result = await updateMe('user-1', { nombre: 'Pedro' });

    expect(mockPrisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { nombre: 'Pedro' },
    });
    expect(result.nombre).toBe('Pedro');
    expect(result.apellido).toBe('Pérez');
  });

  it('actualiza solo el apellido', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(activeUser);
    mockPrisma.usuario.update.mockResolvedValue({ ...activeUser, apellido: 'García' });

    const result = await updateMe('user-1', { apellido: 'García' });

    expect(mockPrisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { apellido: 'García' },
    });
    expect(result.apellido).toBe('García');
  });

  it('actualiza solo el email', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(activeUser);
    mockPrisma.usuario.update.mockResolvedValue({ ...activeUser, email: 'nuevo@test.com' });

    const result = await updateMe('user-1', { email: 'nuevo@test.com' });

    expect(mockPrisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { email: 'nuevo@test.com' },
    });
    expect(result.email).toBe('nuevo@test.com');
  });

  it('actualiza todos los campos a la vez', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(activeUser);
    const updatedUser = {
      ...activeUser,
      nombre: 'Pedro',
      apellido: 'García',
      email: 'pedro@test.com',
    };
    mockPrisma.usuario.update.mockResolvedValue(updatedUser);

    const result = await updateMe('user-1', {
      nombre: 'Pedro',
      apellido: 'García',
      email: 'pedro@test.com',
    });

    expect(mockPrisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { nombre: 'Pedro', apellido: 'García', email: 'pedro@test.com' },
    });
    expect(result).toEqual({
      id: 'user-1',
      email: 'pedro@test.com',
      nombre: 'Pedro',
      apellido: 'García',
      rol: 'REPARTIDOR',
      activo: true,
    });
  });

  it('lanza NOT_FOUND si el usuario no existe', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(null);

    await expect(updateMe('user-inexistente', { nombre: 'X' })).rejects.toThrow(ApiError);
    await expect(updateMe('user-inexistente', { nombre: 'X' })).rejects.toMatchObject({
      statusCode: 404,
      message: 'Usuario no encontrado',
    });
  });

  it('lanza FORBIDDEN si el usuario está inactivo', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(inactiveUser);

    await expect(updateMe('user-1', { nombre: 'X' })).rejects.toThrow(ApiError);
    await expect(updateMe('user-1', { nombre: 'X' })).rejects.toMatchObject({
      statusCode: 403,
      message: 'Usuario inactivo',
    });
  });

  it('lanza BAD_REQUEST si el email ya está en uso (P2002)', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(activeUser);
    const prismaError = new Error('Unique constraint');
    (prismaError as any).code = 'P2002';
    mockPrisma.usuario.update.mockRejectedValue(prismaError);

    await expect(updateMe('user-1', { email: 'duplicado@test.com' })).rejects.toThrow(ApiError);
    await expect(updateMe('user-1', { email: 'duplicado@test.com' })).rejects.toMatchObject({
      statusCode: 400,
      message: 'El email ya está en uso',
    });
  });
});
