import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '../../../utils/api-error.js';
import { ZodError } from 'zod';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockUpdateMe = vi.fn();

vi.mock('../service.js', () => ({
  updateMe: mockUpdateMe,
}));

vi.mock('../../../lib/prisma.js', () => ({
  prisma: {
    usuario: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));
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

const { updateMeController } = await import('../controller.js');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function mockReq(overrides?: Partial<ReturnType<typeof Object>>) {
  return {
    user: { userId: 'user-1', email: 'test@test.com', rol: 'REPARTIDOR' as const },
    body: {},
    ...overrides,
  } as any;
}

function mockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
}

function mockNext() {
  return vi.fn();
}

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const updatedUser = {
  id: 'user-1',
  email: 'nuevo@test.com',
  nombre: 'Pedro',
  apellido: 'Pérez',
  rol: 'REPARTIDOR' as const,
  activo: true,
};

// ─── Tests: updateMeController ─────────────────────────────────────────────────

describe('updateMeController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('responde 200 con el usuario actualizado cuando la entrada es válida', async () => {
    const req = mockReq({ body: { nombre: 'Pedro', email: 'nuevo@test.com' } });
    const res = mockRes();
    const next = mockNext();
    mockUpdateMe.mockResolvedValue(updatedUser);

    await updateMeController(req, res, next);

    expect(mockUpdateMe).toHaveBeenCalledWith('user-1', {
      nombre: 'Pedro',
      email: 'nuevo@test.com',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: updatedUser });
    expect(next).not.toHaveBeenCalled();
  });

  it('llama next con ZodError cuando el body está vacío', async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();
    const next = mockNext();

    await updateMeController(req, res, next);

    expect(mockUpdateMe).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0]![0]).toBeInstanceOf(ZodError);
  });

  it('llama next con el error cuando el servicio falla', async () => {
    const req = mockReq({ body: { nombre: 'Pedro' } });
    const res = mockRes();
    const next = mockNext();
    const serviceError = ApiError.notFound('Usuario no encontrado');
    mockUpdateMe.mockRejectedValue(serviceError);

    await updateMeController(req, res, next);

    expect(mockUpdateMe).toHaveBeenCalledWith('user-1', { nombre: 'Pedro' });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0]![0]).toBe(serviceError);
  });
});
