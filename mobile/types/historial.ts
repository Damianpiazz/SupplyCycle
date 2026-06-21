// Tipes para RF-06.3 / RF-07 — Historial de envases y consumo

export type TipoMovimiento = 'ENTREGA' | 'DEVOLUCION';

export interface MovimientoEnvase {
  id: string;
  fecha: string; // ISO date
  tipo: TipoMovimiento;
  cantidad: number;
  tipoEnvase: string;
  pedidoId: string | null;
}

export interface SaldoEnvase {
  itemId: string;
  nombre: string;
  cantidad: number;
}

// RF-07.5 — Resumen de consumo
export interface ResumenConsumo {
  totalPedidos: number;
  totalBidones: number;
  promedioBidonesPorPedido: number;
}

// RF-07.1 — Resumen ligero de pedido para historial
export interface PedidoHistorialResumen {
  id: string;
  fecha: string; // ISO date
  estado: string;
  totalBidones: number;
}
