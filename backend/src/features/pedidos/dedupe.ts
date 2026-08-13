/**
 * Dedupe helpers for PedidoItem (SPEC-06 / TDD-0064, D7).
 *
 * The DB uniqueness constraint @@unique([pedidoId, itemId]) cannot be added
 * while duplicate rows exist. This module implements the keep-min-id policy
 * used to clean the table right before the add_pedido_item_unique migration:
 *  - a pure planner (unit-testable without a DB), and
 *  - the exact SQL the script executes.
 */

export interface PedidoItemRow {
  id: string;
  pedidoId: string;
  itemId: string;
}

export interface DedupePlan {
  /** Row ids to delete so only the smallest id per (pedidoId, itemId) remains. */
  deleteIds: string[];
  /** Number of (pedidoId, itemId) groups that contain duplicates. */
  duplicateGroups: number;
}

/** Keep the smallest id per (pedidoId, itemId) pair; delete the rest. */
export function planDedupePedidoItem(rows: PedidoItemRow[]): DedupePlan {
  const ordered = [...rows].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const seen = new Set<string>();
  const groupCounts = new Map<string, number>();
  const deleteIds: string[] = [];

  for (const row of ordered) {
    const key = `${row.pedidoId}|${row.itemId}`;
    groupCounts.set(key, (groupCounts.get(key) ?? 0) + 1);
    if (seen.has(key)) {
      deleteIds.push(row.id);
    } else {
      seen.add(key);
    }
  }

  const duplicateGroups = [...groupCounts.values()].filter((count) => count > 1).length;

  return { deleteIds, duplicateGroups };
}

/**
 * DELETE statement that removes duplicate PedidoItem rows keeping the row
 * with the smallest id per (pedidoId, itemId) pair. Executed by
 * scripts/dedupe-pedido-item.ts before the add_pedido_item_unique migration.
 */
export const DEDUPE_PEDIDO_ITEM_SQL = `
DELETE FROM "PedidoItem" a
USING "PedidoItem" b
WHERE a."pedidoId" = b."pedidoId"
  AND a."itemId" = b."itemId"
  AND a.id > b.id
`;
