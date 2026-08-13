/**
 * Dedupe script for PedidoItem (SPEC-06 / TDD-0064, D7).
 *
 * Counts (pedidoId, itemId) groups with more than one row and deletes the
 * duplicates keeping the smallest id per group. Must run BEFORE
 * `npx prisma migrate dev --name add_pedido_item_unique`.
 *
 * Destructive by nature — writes require an explicit --apply flag (gate fix E,
 * mirrors scripts/limpiar-repartos-colgados.ts). Without it the script only
 * prints the plan and the count of rows it WOULD delete.
 *
 * Usage:
 *   npx tsx scripts/dedupe-pedido-item.ts           # dry-run: plan only, no writes
 *   npx tsx scripts/dedupe-pedido-item.ts --apply   # execute the deletes
 */

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import {
  DEDUPE_PEDIDO_ITEM_SQL,
  planDedupePedidoItem,
} from '../src/features/pedidos/dedupe.js';

const args = process.argv.slice(2);
const isApply = args.includes('--apply');

// Fail loudly instead of silently turning `undefined` into the string "undefined".
const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) {
  console.error(
    'Error: DATABASE_URL no está definida. Configúrala en .env o expórtala antes de ejecutar el script.'
  );
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== Dedupe de PedidoItem (pre add_pedido_item_unique) ===\n');

  const rows = await prisma.$queryRaw<Array<{ id: string; pedidoId: string; itemId: string }>>`
    SELECT id, "pedidoId", "itemId" FROM "PedidoItem"
  `;

  const plan = planDedupePedidoItem(rows);

  if (plan.duplicateGroups === 0) {
    console.log('✅ No hay duplicados de (pedidoId, itemId). No se borra nada.');
    console.log(`📊 PedidoItem totales: ${rows.length}.`);
    await prisma.$disconnect();
    return;
  }

  console.log(`⚠️  ${plan.duplicateGroups} grupo(s) duplicado(s) con ${plan.deleteIds.length} fila(s) a borrar (keep-min-id).`);

  if (!isApply) {
    console.log(
      `ℹ️  Modo dry-run: no se borra nada. Vuelve a ejecutar con --apply para borrar ${plan.deleteIds.length} fila(s).`
    );
    await prisma.$disconnect();
    return;
  }

  // Single transaction: delete then count the affected rows
  const deleted = await prisma.$transaction(async (tx) => {
    const affected = await tx.$executeRawUnsafe(DEDUPE_PEDIDO_ITEM_SQL);
    const remaining = await tx.pedidoItem.count();
    return { affected, remaining };
  });

  console.log(`🗑️  Borradas: ${deleted.affected} fila(s) (keep-min-id).`);
  console.log(`📊 PedidoItem restantes: ${deleted.remaining}.`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
