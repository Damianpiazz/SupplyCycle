/**
 * Dedupe script for PedidoItem (SPEC-06 / TDD-0064, D7).
 *
 * Counts (pedidoId, itemId) groups with more than one row, deletes the
 * duplicates keeping the smallest id per group, and reports the result.
 * Must run BEFORE `npx prisma migrate dev --name add_pedido_item_unique`.
 *
 * Usage:
 *   npx tsx scripts/dedupe-pedido-item.ts
 */

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import {
  DEDUPE_PEDIDO_ITEM_SQL,
  planDedupePedidoItem,
} from '../src/features/pedidos/dedupe.js';

const connectionString = `${process.env['DATABASE_URL']}`;
const adapter = new PrismaPg({ connectionString });
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
