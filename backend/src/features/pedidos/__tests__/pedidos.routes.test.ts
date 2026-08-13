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

// ─── Tests: PATCH /api/v1/pedidos/:id/cancelar-cliente — BOT write isolation (SPEC-01 D1) ─

describe('PATCH /api/v1/pedidos/:id/cancelar-cliente — BOT write isolation (SPEC-01 D1)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('must return 400 for BOT without clienteId', async () => {
    const res = await request(app)
      .patch('/api/v1/pedidos/ped-001/cancelar-cliente')
      .set('x-api-key', 'test-bot-key')
      .send({ motivo: 'CANCELACION_CLIENTE' })
      .expect(400);

    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toBe('clienteId es requerido para el rol BOT');
    expect(mockPrisma.pedido.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.pedido.update).not.toHaveBeenCalled();
  });

  it('must return 404 and leave the pedido unchanged when BOT cancels another client pedido', async () => {
    mockPrisma.pedido.findUnique.mockResolvedValue({
      id: 'ped-001',
      domicilio: { clienteId: 'cli-001' },
    });

    const res = await request(app)
      .patch('/api/v1/pedidos/ped-001/cancelar-cliente')
      .set('x-api-key', 'test-bot-key')
      .send({
        motivo: 'CANCELACION_CLIENTE',
        clienteId: '11111111-1111-4111-8111-111111111111',
      })
      .expect(404);

    expect(res.body.error.message).toBe('Pedido no encontrado');
    expect(mockPrisma.pedido.findUnique).toHaveBeenCalledWith({
      where: { id: 'ped-001' },
      include: { domicilio: { select: { clienteId: true } } },
    });
    expect(mockPrisma.pedido.update).not.toHaveBeenCalled();
  });
});

// ─── Tests: POST /api/v1/pedidos/:id/cancelar — admin cancel (SPEC-05 TDD-0063) ─

describe('POST /api/v1/pedidos/:id/cancelar — admin cancel (SPEC-05 TDD-0063)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('must return 200 with estado CANCELADO when ADMIN cancels a PENDIENTE pedido (AC1)', async () => {
    mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
    mockPrisma.pedido.update.mockResolvedValue(
      buildMockPedido({ estado: 'CANCELADO', actualizadoEn: new Date('2026-05-22T11:00:00Z') })
    );

    const res = await request(app)
      .post('/api/v1/pedidos/ped-001/cancelar')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .expect(200);

    expect(mockPrisma.pedido.findUnique).toHaveBeenCalledWith({ where: { id: 'ped-001' } });
    expect(mockPrisma.pedido.update).toHaveBeenCalledWith({
      where: { id: 'ped-001' },
      data: { estado: 'CANCELADO' },
    });
    expect(res.body.data.id).toBe('ped-001');
    expect(res.body.data.estado).toBe('CANCELADO');
    expect(res.body.data.actualizadoEn).toBeDefined();
    // AC4: mirrors cancelarPedido semantics — reparto is NOT auto-completed.
    expect(mockPrisma.reparto.update).not.toHaveBeenCalled();
  });

  it('must return 404 for an unknown pedido (AC2)', async () => {
    mockPrisma.pedido.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/pedidos/ped-999/cancelar')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .expect(404);

    expect(res.body.error.message).toBe('Pedido no encontrado');
    expect(mockPrisma.pedido.update).not.toHaveBeenCalled();
  });

  it('must return 409 when the pedido is not PENDIENTE (AC2)', async () => {
    mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'ENTREGADO' }));

    const res = await request(app)
      .post('/api/v1/pedidos/ped-001/cancelar')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .expect(409);

    expect(res.body.error.message).toBe('Solo se pueden cancelar pedidos en estado pendiente');
    expect(mockPrisma.pedido.update).not.toHaveBeenCalled();
  });

  it('must return 403 when a non-ADMIN (REPARTIDOR) tries to cancel (AC3)', async () => {
    const res = await request(app)
      .post('/api/v1/pedidos/ped-001/cancelar')
      .set('Authorization', `Bearer ${makeToken('REPARTIDOR')}`)
      .expect(403);

    expect(res.body.error.code).toBe('FORBIDDEN');
    expect(mockPrisma.pedido.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.pedido.update).not.toHaveBeenCalled();
  });

  it('must return 401 when unauthenticated (AC3)', async () => {
    const res = await request(app)
      .post('/api/v1/pedidos/ped-001/cancelar')
      .expect(401);

    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(mockPrisma.pedido.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.pedido.update).not.toHaveBeenCalled();
  });
});
