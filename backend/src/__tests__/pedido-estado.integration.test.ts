/**
 * Tests de integración para los endpoints de mutación de estado de Pedido.
 *
 * PATCH /api/v1/pedidos/:id/confirmar
 * PATCH /api/v1/pedidos/:id/cancelar
 *
 * Requiere:
 *  - Base de datos PostgreSQL accesible via TEST_DATABASE_URL
 *  - Migraciones de Prisma aplicadas en la DB de test
 *  - JWT_SECRET configurado (el setup lo define automáticamente)
 *
 * Uso:
 *   cd backend
 *   TEST_DATABASE_URL=postgresql://... npm run test:integration
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import request from 'supertest';

import type { MotivoFalla } from '../generated/prisma/enums.js';

import app from '../app.js';
import { getTestDb, disconnectTestDb } from './setup.integration.js';

// ============================================================
// Constantes
// ============================================================

/** Prefijo usado en los IDs de los pedidos creados en estos tests */
const TEST_ID_PREFIX = '550e8400-e29b-41d4-a716-44665544';

/** IDs concretos para cada escenario */
const PEDIDO_ID_ACTIVO = `${TEST_ID_PREFIX}0001`;
const PEDIDO_ID_ENTREGADO = `${TEST_ID_PREFIX}0002`;
const PEDIDO_ID_NO_ENTREGADO = `${TEST_ID_PREFIX}0003`;
const PEDIDO_ID_NO_EXISTE = `${TEST_ID_PREFIX}9999`;
const PEDIDO_ID_ENUM_A = `${TEST_ID_PREFIX}0101`;
const PEDIDO_ID_ENUM_B = `${TEST_ID_PREFIX}0102`;
const PEDIDO_ID_ENUM_C = `${TEST_ID_PREFIX}0103`;
const PEDIDO_ID_ENUM_D = `${TEST_ID_PREFIX}0104`;
const PEDIDO_ID_CANCEL_OK = `${TEST_ID_PREFIX}0105`;

const INVALID_ID = 'esto-no-es-un-uuid';

const MOTIVOS = ['CLIENTE_AUSENTE', 'DIRECCION_INCORRECTA', 'ACCESO_DENEGADO', 'OTRO'] as const;

// ============================================================
// Helpers
// ============================================================

/** IDs de todos los pedidos que pueden haber sido creados en la suite */
const ALL_TEST_IDS = [
  PEDIDO_ID_ACTIVO,
  PEDIDO_ID_ENTREGADO,
  PEDIDO_ID_NO_ENTREGADO,
  PEDIDO_ID_NO_EXISTE,
  PEDIDO_ID_ENUM_A,
  PEDIDO_ID_ENUM_B,
  PEDIDO_ID_ENUM_C,
  PEDIDO_ID_ENUM_D,
  PEDIDO_ID_CANCEL_OK,
];

/** Elimina todos los pedidos creados por los tests */
async function limpiarPedidos(): Promise<void> {
  const db = getTestDb();
  await db.pedido.deleteMany({
    where: { id: { in: ALL_TEST_IDS } },
  });
}

/** Crea un pedido en el estado indicado */
async function crearPedido(
  id: string,
  estado: 'PENDIENTE' | 'ENTREGADO' | 'NO_ENTREGADO' = 'PENDIENTE',
  motivoFalla?: MotivoFalla,
) {
  const db = getTestDb();
  await db.pedido.create({
    data: {
      id,
      estado,
      motivoFalla: motivoFalla ?? null,
    },
  });
}

// ============================================================
// Setup / Teardown
// ============================================================

let authToken: string;

beforeAll(async () => {
  // Verificar que la DB de test es accesible
  const db = getTestDb();
  await db.$connect();

  // Generar token JWT para autenticación
  const secret = process.env['JWT_SECRET']!;
  authToken = jwt.sign({ sub: 'test-repartidor' }, secret, { expiresIn: '1h' });
});

afterAll(async () => {
  await limpiarPedidos();
  await disconnectTestDb();
});

beforeEach(async () => {
  await limpiarPedidos();
});

// ============================================================
// Tests — confirmarEntrega
// ============================================================

describe('PATCH /api/v1/pedidos/:id/confirmar', () => {
  it('✅ 200 — Pedido PENDIENTE → ENTREGADO', async () => {
    await crearPedido(PEDIDO_ID_ACTIVO, 'PENDIENTE');

    const res = await request(app)
      .patch(`/api/v1/pedidos/${PEDIDO_ID_ACTIVO}/confirmar`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: PEDIDO_ID_ACTIVO,
      estado: 'ENTREGADO',
      motivoFalla: null,
    });
  });

  it('❌ 409 — Pedido ya ENTREGADO', async () => {
    await crearPedido(PEDIDO_ID_ENTREGADO, 'ENTREGADO');

    const res = await request(app)
      .patch(`/api/v1/pedidos/${PEDIDO_ID_ENTREGADO}/confirmar`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(409);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('code');
    expect(res.body.error).toHaveProperty('message');
  });

  it('❌ 409 — Pedido ya NO_ENTREGADO', async () => {
    await crearPedido(PEDIDO_ID_NO_ENTREGADO, 'NO_ENTREGADO', 'CLIENTE_AUSENTE');

    const res = await request(app)
      .patch(`/api/v1/pedidos/${PEDIDO_ID_NO_ENTREGADO}/confirmar`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(409);

    expect(res.body).toHaveProperty('error');
  });

  it('❌ 404 — Pedido inexistente', async () => {
    const res = await request(app)
      .patch(`/api/v1/pedidos/${PEDIDO_ID_NO_EXISTE}/confirmar`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);

    expect(res.body).toHaveProperty('error');
  });

  it('❌ 400 — ID con formato inválido (no UUID)', async () => {
    const res = await request(app)
      .patch(`/api/v1/pedidos/${INVALID_ID}/confirmar`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });
});

// ============================================================
// Tests — registrarFalla
// ============================================================

describe('PATCH /api/v1/pedidos/:id/cancelar', () => {
  it('✅ 200 — Pedido PENDIENTE + motivo válido → NO_ENTREGADO', async () => {
    await crearPedido(PEDIDO_ID_CANCEL_OK, 'PENDIENTE');

    const res = await request(app)
      .patch(`/api/v1/pedidos/${PEDIDO_ID_CANCEL_OK}/cancelar`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ motivo: 'CLIENTE_AUSENTE' })
      .expect(200);

    expect(res.body).toMatchObject({
      id: PEDIDO_ID_CANCEL_OK,
      estado: 'NO_ENTREGADO',
      motivoFalla: 'CLIENTE_AUSENTE',
    });
  });

  it.each([
    { label: 'CLIENTE_AUSENTE', motivo: 'CLIENTE_AUSENTE' as const },
    { label: 'DIRECCION_INCORRECTA', motivo: 'DIRECCION_INCORRECTA' as const },
    { label: 'ACCESO_DENEGADO', motivo: 'ACCESO_DENEGADO' as const },
    { label: 'OTRO', motivo: 'OTRO' as const },
  ])(
    '✅ 200 — Enum aceptado: $label',
    async ({ motivo }) => {
      const testId = `550e8400-e29b-41d4-a716-44665544${String(MOTIVOS.indexOf(motivo) + 1).padStart(4, '0')}`;

      await crearPedido(testId, 'PENDIENTE');

      const res = await request(app)
        .patch(`/api/v1/pedidos/${testId}/cancelar`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ motivo })
        .expect(200);

      expect(res.body).toMatchObject({
        estado: 'NO_ENTREGADO',
        motivoFalla: motivo,
      });
    },
  );

  it('❌ 409 — Pedido ENTREGADO + motivo válido', async () => {
    await crearPedido(PEDIDO_ID_ENTREGADO, 'ENTREGADO');

    const res = await request(app)
      .patch(`/api/v1/pedidos/${PEDIDO_ID_ENTREGADO}/cancelar`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ motivo: 'CLIENTE_AUSENTE' })
      .expect(409);

    expect(res.body).toHaveProperty('error');
  });

  it('❌ 400 — Body sin campo motivo', async () => {
    await crearPedido(PEDIDO_ID_ACTIVO, 'PENDIENTE');

    const res = await request(app)
      .patch(`/api/v1/pedidos/${PEDIDO_ID_ACTIVO}/cancelar`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({})
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });

  it('❌ 400 — Body con motivo fuera del enum', async () => {
    await crearPedido(PEDIDO_ID_ACTIVO, 'PENDIENTE');

    const res = await request(app)
      .patch(`/api/v1/pedidos/${PEDIDO_ID_ACTIVO}/cancelar`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ motivo: 'CUALQUIER_COSA' })
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });

  it('❌ 404 — Pedido inexistente', async () => {
    const res = await request(app)
      .patch(`/api/v1/pedidos/${PEDIDO_ID_NO_EXISTE}/cancelar`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ motivo: 'CLIENTE_AUSENTE' })
      .expect(404);

    expect(res.body).toHaveProperty('error');
  });
});
