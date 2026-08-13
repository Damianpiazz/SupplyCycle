import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import request from 'supertest';
import { makeToken } from '../../../test-utils/auth-token.js';

// ─── Mocks (hoisted by vitest; factories run on first import of each module) ─

const mockPrisma = {
  $transaction: vi.fn((callback: (tx: typeof mockPrisma) => unknown) => callback(mockPrisma)),
  pedido: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    aggregate: vi.fn(),
  },
  domicilio: { findFirst: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
  cliente: { findUnique: vi.fn() },
  reparto: { findUnique: vi.fn(), update: vi.fn() },
  item: { findUnique: vi.fn() },
  pedidoItem: {
    findFirst: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  retenido: { createMany: vi.fn(), findMany: vi.fn(), updateMany: vi.fn() },
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

function buildMockPedido(overrides: Record<string, unknown> = {}) {
  const now = new Date('2026-05-22T10:00:00Z');
  return {
    id: 'ped-001',
    numeroPedido: 'PEDIDO #1',
    orden: 1,
    estado: 'PENDIENTE',
    fecha: now,
    creadoEn: now,
    actualizadoEn: now,
    deletedAt: null,
    motivoFalla: null,
    repartoId: 'rep-001',
    domicilioId: 'dom-001',
    domicilio: {
      id: 'dom-001',
      calle: 'Av. Corrientes',
      numero: '1234',
      localidad: 'CABA',
      latitud: -34.6037,
      longitud: -58.3816,
      principal: true,
      clienteId: 'cli-001',
      cliente: {
        id: 'cli-001',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '1145678901',
        observaciones: null,
        activo: true,
      },
      dias: [
        {
          id: 'dia-1',
          nombre: 'LUNES',
          domicilioId: 'dom-001',
          horarios: [
            {
              id: 'horario-1',
              inicio: new Date('2024-01-01T09:00:00Z'),
              fin: new Date('2024-01-01T11:00:00Z'),
              diaId: 'dia-1',
            },
          ],
        },
      ],
    },
    reparto: { id: 'rep-001', fecha: now },
    items: [
      {
        id: 'item-ped-001',
        itemId: 'prod-001',
        cantidad: 2,
        precioUnitario: 1500,
        item: {
          id: 'prod-001',
          nombre: 'Bidón 20L',
          descripcion: 'Bidón de agua de 20 litros',
          precio: 1500,
          unidad: 'unidad',
          activo: true,
          retornable: true,
        },
      },
    ],
    ...overrides,
  };
}

// ─── Tests: GET /api/v1/pedidos — BOT read isolation (SPEC-01 C3) ─────────────

describe('GET /api/v1/pedidos — BOT read isolation (SPEC-01 C3)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('must return 400 for BOT without ?clienteId', async () => {
    const res = await request(app)
      .get('/api/v1/pedidos')
      .set('x-api-key', 'test-bot-key')
      .expect(400);

    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(mockPrisma.pedido.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.pedido.count).not.toHaveBeenCalled();
  });

  it('must return 200 with only that client pedidos for BOT with ?clienteId', async () => {
    mockPrisma.pedido.findMany.mockResolvedValue([buildMockPedido()]);
    mockPrisma.pedido.count.mockResolvedValue(1);

    const res = await request(app)
      .get('/api/v1/pedidos')
      .query({ clienteId: 'cli-001' })
      .set('x-api-key', 'test-bot-key')
      .expect(200);

    expect(mockPrisma.pedido.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ domicilio: { clienteId: 'cli-001' } }),
      })
    );
    expect(mockPrisma.pedido.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ domicilio: { clienteId: 'cli-001' } }),
      })
    );
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]!.cliente.id).toBe('cli-001');
    expect(res.body.total).toBe(1);
  });

  it('must keep listing without clienteId for ADMIN (filter optional)', async () => {
    mockPrisma.pedido.findMany.mockResolvedValue([buildMockPedido()]);
    mockPrisma.pedido.count.mockResolvedValue(1);

    const res = await request(app)
      .get('/api/v1/pedidos')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(mockPrisma.pedido.findMany).toHaveBeenCalled();
  });
});
