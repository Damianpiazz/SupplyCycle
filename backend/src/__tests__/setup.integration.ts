/**
 * Setup global para tests de integración.
 *
 * Se ejecuta una sola vez antes de toda la suite de integración.
 * Configura las variables de entorno necesarias para que la app
 * se conecte a la base de datos de test en lugar de la de desarrollo.
 *
 * Requiere que la variable TEST_DATABASE_URL esté definida en el entorno
 * o en un archivo .env.test en la raíz del proyecto backend.
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

// ============================================================
// 1. Configurar variables de entorno ANTES de que la app las lea
// ============================================================

const testDbUrl =
  process.env['TEST_DATABASE_URL'] ??
  process.env['DATABASE_URL'];

if (!testDbUrl) {
  throw new Error(
    'TEST_DATABASE_URL no está definida.\n' +
      'Creá un archivo .env.test en backend/ con:\n' +
      '  TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/supplycycle_test\n' +
      'o exportala en tu terminal antes de correr los tests.',
  );
}

process.env['DATABASE_URL'] = testDbUrl;

// También aseguramos JWT_SECRET para el middleware de autenticación
process.env['JWT_SECRET'] = process.env['JWT_SECRET'] ?? 'test-jwt-secret';

// ============================================================
// 2. Crear cliente Prisma de test (setup/teardown)
// ============================================================

let _testDb: PrismaClient | null = null;

/**
 * Retorna (o crea) un PrismaClient conectado a la DB de test.
 * Útil para seed y cleanup en los hooks de los tests.
 */
export function getTestDb(): PrismaClient {
  if (!_testDb) {
    const adapter = new PrismaPg({ connectionString: testDbUrl });
    _testDb = new PrismaClient({ adapter });
  }
  return _testDb;
}

/**
 * Desconecta el cliente de test al finalizar la suite.
 */
export async function disconnectTestDb(): Promise<void> {
  if (_testDb) {
    await _testDb.$disconnect();
    _testDb = null;
  }
}
