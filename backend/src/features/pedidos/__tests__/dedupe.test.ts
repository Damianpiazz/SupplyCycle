import { describe, it, expect } from 'vitest';
import {
  DEDUPE_PEDIDO_ITEM_SQL,
  planDedupePedidoItem,
} from '../dedupe.js';

// SPEC-06 / TDD-0064 AC4: pre-migration dedupe must keep one row per
// (pedidoId, itemId) — the smallest id — and preserve distinct items.

describe('planDedupePedidoItem (TDD-0064 AC4)', () => {
  it('keeps the smallest id per (pedidoId, itemId) group and deletes the rest', () => {
    const rows = [
      { id: '1', pedidoId: 'ped-1', itemId: 'item-1' },
      { id: '2', pedidoId: 'ped-1', itemId: 'item-1' },
      { id: '3', pedidoId: 'ped-1', itemId: 'item-1' },
    ];

    const plan = planDedupePedidoItem(rows);

    expect(plan.deleteIds).toEqual(['2', '3']);
    expect(plan.duplicateGroups).toBe(1);
  });

  it('preserves distinct items and distinct pedidos (no deletes)', () => {
    const rows = [
      { id: '1', pedidoId: 'ped-1', itemId: 'item-1' },
      { id: '2', pedidoId: 'ped-1', itemId: 'item-2' },
      { id: '3', pedidoId: 'ped-2', itemId: 'item-1' },
    ];

    const plan = planDedupePedidoItem(rows);

    expect(plan.deleteIds).toEqual([]);
    expect(plan.duplicateGroups).toBe(0);
  });

  it('compares ids, not array order (triangulation: min id is not first)', () => {
    const rows = [
      { id: 'b', pedidoId: 'ped-1', itemId: 'item-1' },
      { id: 'c', pedidoId: 'ped-1', itemId: 'item-1' },
      { id: 'a', pedidoId: 'ped-1', itemId: 'item-1' },
    ];

    const plan = planDedupePedidoItem(rows);

    expect(plan.deleteIds).toEqual(['b', 'c']);
    expect(plan.duplicateGroups).toBe(1);
  });

  it('handles multiple groups mixing duplicates and clean pairs', () => {
    const rows = [
      { id: '1', pedidoId: 'ped-1', itemId: 'item-1' },
      { id: '2', pedidoId: 'ped-1', itemId: 'item-1' },
      { id: '3', pedidoId: 'ped-1', itemId: 'item-2' },
      { id: '4', pedidoId: 'ped-2', itemId: 'item-1' },
      { id: '5', pedidoId: 'ped-2', itemId: 'item-1' },
      { id: '6', pedidoId: 'ped-2', itemId: 'item-1' },
    ];

    const plan = planDedupePedidoItem(rows);

    expect(plan.deleteIds).toEqual(['2', '5', '6']);
    expect(plan.duplicateGroups).toBe(2);
  });

  it('is a no-op for an empty table or a single row', () => {
    expect(planDedupePedidoItem([]).deleteIds).toEqual([]);
    expect(planDedupePedidoItem([]).duplicateGroups).toBe(0);

    const single = [{ id: '1', pedidoId: 'ped-1', itemId: 'item-1' }];
    expect(planDedupePedidoItem(single).deleteIds).toEqual([]);
    expect(planDedupePedidoItem(single).duplicateGroups).toBe(0);
  });

  it('exposes the exact DELETE SQL the script runs, implementing keep-min-id', () => {
    expect(DEDUPE_PEDIDO_ITEM_SQL).toContain('DELETE FROM "PedidoItem"');
    expect(DEDUPE_PEDIDO_ITEM_SQL).toContain('"pedidoId"');
    expect(DEDUPE_PEDIDO_ITEM_SQL).toContain('"itemId"');
    expect(DEDUPE_PEDIDO_ITEM_SQL).toContain('a.id > b.id');
  });
});
