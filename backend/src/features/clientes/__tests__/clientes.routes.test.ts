import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import request from 'supertest';
import { makeToken } from '../../../test-utils/auth-token.js';

// ─── Mocks (hoisted by vitest; factories run on first import of each module) ─

const mockPrisma = {
  cliente: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
  pedido: { count: vi.fn() },
};

vi.mock('../../../lib/prisma.js', () => ({ prisma: mockPrisma }));
// Use a real silent pino instance: pino-http requires a pino-shaped logger
// (logger.levels.values) and calls logger.child() during setup. Keep the real
// module's exports (serializeReq, serializeError, REDACT_PATHS) untouched.
vi.mock('../../../lib/logger.js', async (importOriginal) => {
  const { default: pino } = await import('pino');
  const mod = await importOriginal<typeof import('../../../lib/logger.js')>();
  return { ...mod, logger: pino({ level: 'silent' }) };
});

// ─── Env stubbed BEFORE the dynamic app import (D6) ──────────────────────────
// dotenv never overrides an already-set process.env, so these assignments win.

process.env['NODE_ENV'] = 'test';
process.env['BOT_API_KEY'] = 'test-bot-key';
process.env['SESSION_SECRET'] = 'test-session-secret';
process.env['JWT_SECRET'] = 'supplycycle-dev-secret';

// ─── App (singleton, dynamically imported after env + mocks) ─────────────────

let app: import('express').Express;

beforeAll(async () => {
  const { default: appModule } = await import('../../../app.js');
  app = appModule;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildMockCliente(overrides: Record<string, unknown> = {}) {
  return {
    id: 'cli-001',
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '1145678901',
    observaciones: null,
    activo: true,
    domicilios: [],
    retenidos: [],
    ...overrides,
  };
}

// ─── Tests: DELETE /api/v1/clientes/:id — apiKeyAuth matrix (SPEC-07 TDD-0065) ─

describe('DELETE /api/v1/clientes/:id — apiKeyAuth matrix (SPEC-07 TDD-0065)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('must return 200 for ADMIN with JWT only (no api key) — passthrough preserved (AC1)', async () => {
    mockPrisma.cliente.findUnique.mockResolvedValue(buildMockCliente());
    mockPrisma.pedido.count.mockResolvedValue(0);
    mockPrisma.cliente.update.mockResolvedValue(buildMockCliente({ activo: false }));

    const res = await request(app)
      .delete('/api/v1/clientes/cli-001')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .expect(200);

    expect(res.body.data.message).toBe('Cliente desactivado correctamente');
    expect(mockPrisma.cliente.update).toHaveBeenCalledWith({
      where: { id: 'cli-001' },
      data: { activo: false },
    });
  });

  it('must return 200 for ADMIN with key + JWT — JWT wins over the key (D3 Bearer-skip)', async () => {
    mockPrisma.cliente.findUnique.mockResolvedValue(buildMockCliente());
    mockPrisma.pedido.count.mockResolvedValue(0);
    mockPrisma.cliente.update.mockResolvedValue(buildMockCliente({ activo: false }));

    const res = await request(app)
      .delete('/api/v1/clientes/cli-001')
      .set('x-api-key', 'test-bot-key')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .expect(200);

    expect(res.body.data.message).toBe('Cliente desactivado correctamente');
    expect(mockPrisma.cliente.update).toHaveBeenCalled();
  });

  it('must return 403 for key-only (BOT role is not ADMIN) (D3)', async () => {
    const res = await request(app)
      .delete('/api/v1/clientes/cli-001')
      .set('x-api-key', 'test-bot-key')
      .expect(403);

    expect(res.body.error.code).toBe('FORBIDDEN');
    expect(mockPrisma.cliente.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.cliente.update).not.toHaveBeenCalled();
  });

  it('must return 401 when neither JWT nor api key is present (AC3)', async () => {
    const res = await request(app)
      .delete('/api/v1/clientes/cli-001')
      .expect(401);

    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(mockPrisma.cliente.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.cliente.update).not.toHaveBeenCalled();
  });

  it('must return 403 for a non-ADMIN role (REPARTIDOR) (AC4)', async () => {
    const res = await request(app)
      .delete('/api/v1/clientes/cli-001')
      .set('Authorization', `Bearer ${makeToken('REPARTIDOR')}`)
      .expect(403);

    expect(res.body.error.code).toBe('FORBIDDEN');
    expect(mockPrisma.cliente.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.cliente.update).not.toHaveBeenCalled();
  });
});

// ─── Tests: key-only still works for BOT routes (D3 Bearer-skip guard) ───────

describe('GET /api/v1/clientes — BOT key-only still works (D3 Bearer-skip guard)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('must return 200 for key-only on a BOT-allowed route (apiKeyAuth unchanged for key-only)', async () => {
    mockPrisma.cliente.findMany.mockResolvedValue([buildMockCliente()]);

    const res = await request(app)
      .get('/api/v1/clientes')
      .set('x-api-key', 'test-bot-key')
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]!.id).toBe('cli-001');
    expect(mockPrisma.cliente.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ activo: true }) })
    );
  });
});
