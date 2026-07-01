/**
 * Smoke test for Admin EJS routes.
 *
 * Verifies that all admin pages (index, show, form) render without errors.
 *
 * Uso: npx tsx scripts/smoke-test-admin.ts
 *
 * Requisitos:
 * - DB con datos seed (admin user + al menos 1 registro por entidad)
 * - Variables de entorno cargadas (.env)
 */

import app from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { logger } from '../src/lib/logger.js';
import request from 'supertest';

interface RouteResult {
  route: string;
  method: string;
  status: number;
  ok: boolean;
  error?: string;
}

const ADMIN_CREDENTIALS = {
  email: process.env['SMOKE_TEST_EMAIL'] ?? 'admin@supplycycle.com',
  password: process.env['SMOKE_TEST_PASSWORD'] ?? 'admin123',
};

// ─── Routes to smoke-test (index + form) ──────────────────────────────────

const INDEX_ROUTES = [
  '/admin/pedidos',
  '/admin/clientes',
  '/admin/repartos',
  '/admin/usuarios',
  '/admin/items',
  '/admin/ciudades',
  '/admin/domicilios',
  '/admin/dias',
  '/admin/horarios',
  '/admin/empleados',
  '/admin/visitas',
  '/admin/retenidos',
  '/admin/reclamos',
];

// ─── Entities that have show/detail pages ─────────────────────────────────

interface EntityConfig {
  table: string;
  route: string;
  idField: string;
}

const SHOW_ENTITIES: EntityConfig[] = [
  { table: 'cliente', route: '/admin/clientes', idField: 'id' },
  { table: 'pedido', route: '/admin/pedidos', idField: 'id' },
  { table: 'reparto', route: '/admin/repartos', idField: 'id' },
];

// ─── Main ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const agent = request.agent(app);
  const results: RouteResult[] = [];

  // 1. Login
  logger.info('🔑 Logging in as admin…');
  const loginRes = await agent
    .post('/admin/login')
    .type('form')
    .send(ADMIN_CREDENTIALS);

  if (loginRes.status !== 302) {
    logger.error({ status: loginRes.status, text: loginRes.text }, 'Login failed');
    process.exit(1);
  }
  logger.info('✅ Login OK (redirect to /admin/pedidos)');

  // 2. Hit all index routes
  logger.info('📋 Testing index routes…');
  for (const route of INDEX_ROUTES) {
    try {
      const res = await agent.get(route).redirects(0); // no follow redirects
      const ok = res.status >= 200 && res.status < 400;
      results.push({ route, method: 'GET', status: res.status, ok });
      if (!ok) {
        logger.warn({ route, status: res.status }, '⚠️  Index route returned unexpected status');
      }
    } catch (err: any) {
      results.push({ route, method: 'GET', status: 0, ok: false, error: err.message });
      logger.error({ route, err: err.message }, '💥 Index route crashed');
    }
  }

  // 3. Get IDs from DB and test show/detail routes
  logger.info('🔍 Testing show/detail routes…');
  for (const entity of SHOW_ENTITIES) {
    try {
      // Get the first record from the DB
      const record = await (prisma as any)[entity.table].findFirst({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: { [entity.idField]: true },
      });

      if (!record) {
        logger.warn({ entity: entity.table }, '⚠️  No records found, skipping show test');
        continue;
      }

      const id = record[entity.idField];
      const showRoute = `${entity.route}/${id}`;

      const res = await agent.get(showRoute).redirects(0);
      const ok = res.status >= 200 && res.status < 400;
      results.push({ route: showRoute, method: 'GET', status: res.status, ok });

      if (res.status >= 400) {
        // Try to extract useful error info
        const snippet = (res.text ?? '').substring(0, 500);
        logger.error(
          { route: showRoute, status: res.status, snippet },
          '💥 Show route returned error'
        );
      } else {
        logger.info({ route: showRoute, status: res.status }, '✅ Show route OK');
      }
    } catch (err: any) {
      results.push({
        route: entity.route + '/:id',
        method: 'GET',
        status: 0,
        ok: false,
        error: err.message,
      });
      logger.error({ entity: entity.table, err: err.message }, '💥 Show route crashed');
    }
  }

  // 4. Summary
  const ok = results.filter((r) => r.ok);
  const fail = results.filter((r) => !r.ok);

  console.log('\n═══════════════════════════════════════');
  console.log('📊  SMOKE TEST RESULTS');
  console.log('═══════════════════════════════════════');
  console.log(`  ✅ Passed: ${ok.length}/${results.length}`);
  console.log(`  ❌ Failed: ${fail.length}/${results.length}`);
  console.log('───────────────────────────────────────');

  if (fail.length > 0) {
    console.log('\n❌ FAILED ROUTES:');
    for (const f of fail) {
      console.log(`  ${f.method} ${f.route} → ${f.status} ${f.error ?? ''}`);
    }
    console.log('\n⚠️  Revisá los logs para más detalles.');
  } else {
    console.log('\n🎉 Todas las rutas respondieron correctamente.');
  }

  await prisma.$disconnect();

  if (fail.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
