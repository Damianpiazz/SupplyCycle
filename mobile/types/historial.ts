// Tipes para RF-06.3 / RF-07 — Historial de envases y consumo

export type EstadoRetenido = 'RETENIDO' | 'DEVUELTO' | 'PERDIDO';

export interface RetenidoResponse {
  id: string;
  inicio: string;    // ISO date
  fin: string | null; // ISO date | null
  estado: EstadoRetenido;
  item: { id: string; nombre: string };
  pedido: { id: string; numeroPedido: string };
}

export interface SaldoEnvase {
  itemId: string;
  nombre: string;
  cantidad: number;
}

// RF-10 — Frecuencia de pedidos
export interface FrecuenciaCliente {
  intervaloPromedioDias: number | null;
  diaSemanaFrecuente: string | null;
  totalPedidosAnalizados: number;
  primerPedido: string | null;
  ultimoPedido: string | null;
  distribucionDias: Record<string, number>;
}

// RF-07.5 — Resumen de consumo (con frecuencia RF-10)
export interface ResumenConsumo {
  totalPedidos: number;
  totalBidones: number;
  promedioBidonesPorPedido: number;
  frecuencia?: FrecuenciaCliente;
}

export interface ItemResumen {
  nombre: string;
  cantidad: number;
}

// RF-07.1 — Resumen ligero de pedido para historial
export interface PedidoHistorialResumen {
  id: string;
  numeroPedido: string;
  fecha: string; // ISO date
  estado: string;
  totalBidones: number;
  items: ItemResumen[];
}
