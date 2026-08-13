import { describe, it, expect } from 'vitest';
import { esPedidoValidoParaDemanda, pedidosValidosParaDemanda } from '../pedido-utils.js';

// Gate-review Fix B (S8): the RF-10 demand rule — a CANCELADO order never
// counts toward demand — was duplicated as a raw string literal in the
// clientes and estadisticas services. Single source of truth now lives in
// lib/pedido-utils. Pure functions, no mocks needed.

describe('esPedidoValidoParaDemanda (gate-review Fix B)', () => {
  it('excludes CANCELADO orders from demand', () => {
    expect(esPedidoValidoParaDemanda({ estado: 'CANCELADO' })).toBe(false);
  });

  it('keeps any non-cancelled order state', () => {
    expect(esPedidoValidoParaDemanda({ estado: 'ENTREGADO' })).toBe(true);
    expect(esPedidoValidoParaDemanda({ estado: 'PENDIENTE' })).toBe(true);
  });
});

describe('pedidosValidosParaDemanda (gate-review Fix B)', () => {
  it('filters CANCELADO out and preserves the remaining orders in order', () => {
    const pedidos = [
      { id: 'p1', estado: 'ENTREGADO' },
      { id: 'p2', estado: 'CANCELADO' },
      { id: 'p3', estado: 'PENDIENTE' },
    ];

    expect(pedidosValidosParaDemanda(pedidos)).toEqual([
      { id: 'p1', estado: 'ENTREGADO' },
      { id: 'p3', estado: 'PENDIENTE' },
    ]);
  });

  it('returns an empty array when every order is CANCELADO', () => {
    const pedidos = [{ id: 'p1', estado: 'CANCELADO' }];

    expect(pedidosValidosParaDemanda(pedidos)).toEqual([]);
  });
});
