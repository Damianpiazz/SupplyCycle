// Gate-review Fix B (S8): the RF-10 demand rule — a CANCELADO order never
// counts toward demand frequency, anchor, or item quantities — was duplicated
// as a raw string literal in the clientes and estadisticas services. This is
// the single source of truth for both call sites.

/** True when an order may be counted toward RF-10 demand (CANCELADO excluded). */
export function esPedidoValidoParaDemanda(p: { estado: string }): boolean {
  return p.estado !== 'CANCELADO';
}

/** Filters orders to those that count toward RF-10 demand. */
export function pedidosValidosParaDemanda<T extends { estado: string }>(
  pedidos: T[]
): T[] {
  return pedidos.filter(esPedidoValidoParaDemanda);
}
