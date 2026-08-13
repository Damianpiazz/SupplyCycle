import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import request from 'supertest';
import { makeToken } from '../../../test-utils/auth-token.js';

// ─── Mocks (hoisted by vitest; factories run on first import of each module) ─

const mockPrisma = {
  item: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  pedidoItem: { count: vi.fn() },
};

vi.mock('../../../lib/prisma.js', () => ({ prisma: mockPrisma }));
// Use a real silent pino instance (see pedidos.routes.test.ts D6 pattern).
vi.mock('../../../lib/logger.js', async (importOriginal) => {
  const { default: pino } = await import('pino');
  const mod = await importOriginal<typeof import('../../../lib/logger.js')>();
  return { ...mod, logger: pino({ level: 'silent' }) };
});

// ─── Env stubbed BEFORE the dynamic app import (D6) ──────────────────────────

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

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const baseItem = {
  id: 'item-1',
  nombre: 'Bidón 20L',
  descripcion: null,
  unidad: 'unidad',
  precio: null,
  activo: true,
  retornable: false,
};

// ─── Tests: POST /api/v1/items ────────────────────────────────────────────────

describe('POST /api/v1/items — create (SPEC-03 AC1/AC5/AC6)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('must return 201 with retornable true when ADMIN creates an item', async () => {
    mockPrisma.item.findFirst.mockResolvedValue(null);
    mockPrisma.item.create.mockResolvedValue({ ...baseItem, precio: 1500, retornable: true });

    const res = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .send({ nombre: 'Bidón 20L', unidad: 'unidad', precio: 1500, retornable: true })
      .expect(201);

    expect(mockPrisma.item.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ retornable: true, precio: 1500 }),
    });
    expect(res.body.data.retornable).toBe(true);
    expect(res.body.data.precio).toBe(1500);
  });

  it('must return 403 when a non-ADMIN (REPARTIDOR) tries to create', async () => {
    const res = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${makeToken('REPARTIDOR')}`)
      .send({ nombre: 'Bidón 20L', unidad: 'unidad' })
      .expect(403);

    expect(res.body.error.code).toBe('FORBIDDEN');
    expect(mockPrisma.item.create).not.toHaveBeenCalled();
  });

  it('must return 401 when unauthenticated', async () => {
    const res = await request(app)
      .post('/api/v1/items')
      .send({ nombre: 'Bidón 20L', unidad: 'unidad' })
      .expect(401);

    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(mockPrisma.item.create).not.toHaveBeenCalled();
  });

  it('must return 400 VALIDATION_ERROR for invalid zod body', async () => {
    const res = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .send({ nombre: 'Bidón 20L', unidad: 'unidad', retornable: 'si' })
      .expect(400);

    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(mockPrisma.item.create).not.toHaveBeenCalled();
  });
});

// ─── Tests: PATCH /api/v1/items/:id ───────────────────────────────────────────

describe('PATCH /api/v1/items/:id — update (SPEC-03 AC3/AC6)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('must return 200 and toggle retornable/precio when ADMIN updates', async () => {
    mockPrisma.item.findUnique.mockResolvedValue(baseItem);
    mockPrisma.item.update.mockResolvedValue({ ...baseItem, precio: 2000, retornable: false });

    const res = await request(app)
      .patch('/api/v1/items/item-1')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .send({ retornable: false, precio: 2000 })
      .expect(200);

    expect(mockPrisma.item.update).toHaveBeenCalledWith({
      where: { id: 'item-1' },
      data: expect.objectContaining({ retornable: false, precio: 2000 }),
    });
    expect(res.body.data.precio).toBe(2000);
  });

  it('must return 403 when a non-ADMIN tries to update', async () => {
    const res = await request(app)
      .patch('/api/v1/items/item-1')
      .set('Authorization', `Bearer ${makeToken('REPARTIDOR')}`)
      .send({ retornable: true })
      .expect(403);

    expect(res.body.error.code).toBe('FORBIDDEN');
    expect(mockPrisma.item.update).not.toHaveBeenCalled();
  });
});

// ─── Tests: DELETE /api/v1/items/:id ──────────────────────────────────────────

describe('DELETE /api/v1/items/:id — delete (SPEC-03 AC4/AC6)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('must return 200 and delete the item when ADMIN deletes an unused item', async () => {
    mockPrisma.item.findUnique.mockResolvedValue(baseItem);
    mockPrisma.pedidoItem.count.mockResolvedValue(0);
    mockPrisma.item.delete.mockResolvedValue(baseItem);

    const res = await request(app)
      .delete('/api/v1/items/item-1')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .expect(200);

    expect(mockPrisma.item.delete).toHaveBeenCalledWith({ where: { id: 'item-1' } });
    expect(res.body.data).toEqual({ message: 'Ítem eliminado correctamente' });
  });

  it('must return 401 when unauthenticated', async () => {
    await request(app)
      .delete('/api/v1/items/item-1')
      .expect(401);

    expect(mockPrisma.item.delete).not.toHaveBeenCalled();
  });
});
