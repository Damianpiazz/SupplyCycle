import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '../../utils/api-error.js';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockVerify = vi.fn();

class MockTokenExpiredError extends Error {
  constructor() {
    super('jwt expired');
    this.name = 'TokenExpiredError';
  }
}

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: mockVerify,
    TokenExpiredError: MockTokenExpiredError,
    JsonWebTokenError: class JsonWebTokenError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'JsonWebTokenError';
      }
    },
  },
}));

vi.mock('../../config/env.js', () => ({
  env: { jwtSecret: 'test-secret' },
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

const { authenticate, requireRole } = await import('../auth.middleware.js');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function mockReq(headers?: Record<string, string>) {
  return {
    headers: headers ?? {},
    user: undefined,
  } as any;
}

function mockRes() {
  return {} as any;
}

// ─── Tests: authenticate ──────────────────────────────────────────────────────

describe('authenticate', () => {
  let req: ReturnType<typeof mockReq>;
  const res = mockRes();
  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    req = mockReq();
  });

  it('debe llamar next con UNAUTHORIZED si no hay header Authorization', () => {
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0]![0]).toBeInstanceOf(ApiError);
    expect((next.mock.calls[0]![0] as ApiError).message).toBe('Token no proporcionado');
    expect((next.mock.calls[0]![0] as ApiError).statusCode).toBe(401);
  });

  it('debe llamar next con UNAUTHORIZED si el header no comienza con Bearer', () => {
    req.headers.authorization = 'Basic token123';
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect((next.mock.calls[0]![0] as ApiError).message).toBe('Token no proporcionado');
  });

  it('debe llamar next con UNAUTHORIZED si el token expiró', () => {
    req.headers.authorization = 'Bearer expired.token.here';
    mockVerify.mockImplementation(() => {
      throw new MockTokenExpiredError();
    });
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect((next.mock.calls[0]![0] as ApiError).message).toBe('Token expirado');
  });

  it('debe llamar next con UNAUTHORIZED si el token es inválido', () => {
    req.headers.authorization = 'Bearer invalid.token.here';
    mockVerify.mockImplementation(() => {
      throw new Error('invalid signature');
    });
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect((next.mock.calls[0]![0] as ApiError).message).toBe('Token inválido');
  });

  it('debe setear req.user y llamar next() con token válido', () => {
    req.headers.authorization = 'Bearer valid.token.here';
    const payload = { userId: 'user-1', email: 'test@test.com', rol: 'REPARTIDOR' as const };
    mockVerify.mockReturnValue(payload);

    authenticate(req, res, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0]![0]).toBeUndefined();
  });
});

// ─── Tests: requireRole ───────────────────────────────────────────────────────

describe('requireRole', () => {
  let req: ReturnType<typeof mockReq>;
  const res = mockRes();
  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    req = mockReq();
  });

  it('debe llamar next con UNAUTHORIZED si no hay req.user', () => {
    const middleware = requireRole('ADMIN');
    middleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0]![0]).toBeInstanceOf(ApiError);
    expect((next.mock.calls[0]![0] as ApiError).message).toBe('No autenticado');
    expect((next.mock.calls[0]![0] as ApiError).statusCode).toBe(401);
  });

  it('debe llamar next con FORBIDDEN si el rol no está permitido', () => {
    req.user = { userId: 'user-1', email: 'test@test.com', rol: 'REPARTIDOR' };
    const middleware = requireRole('ADMIN');
    middleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0]![0]).toBeInstanceOf(ApiError);
    expect((next.mock.calls[0]![0] as ApiError).message).toBe('No tiene permisos para esta acción');
    expect((next.mock.calls[0]![0] as ApiError).statusCode).toBe(403);
  });

  it('debe llamar next() si el rol coincide', () => {
    req.user = { userId: 'user-1', email: 'test@test.com', rol: 'ADMIN' };
    const middleware = requireRole('ADMIN');
    middleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
  });

  it('debe aceptar cualquiera de los roles indicados', () => {
    req.user = { userId: 'user-1', email: 'test@test.com', rol: 'REPARTIDOR' };
    const middleware = requireRole('ADMIN', 'REPARTIDOR');
    middleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
  });
});
