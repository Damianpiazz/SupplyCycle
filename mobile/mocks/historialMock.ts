import { daysAgo } from '@/mocks/mockData';
import type { SaldoEnvase, MovimientoEnvase, ResumenConsumo, PedidoHistorialResumen } from '@/types/historial';

/**
 * Mock data for ClienteHistorialScreen.
 * RF-06.3: saldoEnvases + movimientos
 * RF-07.1: pedidos historial
 * RF-07.5: resumen consumo
 */

export const MOCK_SALDO_ENVASES: SaldoEnvase[] = [
  { itemId: 'item-sifon', nombre: 'Sifón', cantidad: 2 },
  { itemId: 'item-cajon', nombre: 'Cajón', cantidad: 1 },
  { itemId: 'item-bidon', nombre: 'Bidón 20L', cantidad: 0 },
];

export const MOCK_MOVIMIENTOS: MovimientoEnvase[] = [
  {
    id: 'mov-006',
    fecha: daysAgo(2),
    tipo: 'ENTREGA',
    cantidad: 1,
    tipoEnvase: 'Sifón',
    pedidoId: 'PEDIDO #8',
  },
  {
    id: 'mov-005',
    fecha: daysAgo(5),
    tipo: 'DEVOLUCION',
    cantidad: 1,
    tipoEnvase: 'Cajón',
    pedidoId: 'PEDIDO #7',
  },
  {
    id: 'mov-004',
    fecha: daysAgo(8),
    tipo: 'ENTREGA',
    cantidad: 1,
    tipoEnvase: 'Cajón',
    pedidoId: 'PEDIDO #7',
  },
  {
    id: 'mov-003',
    fecha: daysAgo(12),
    tipo: 'ENTREGA',
    cantidad: 1,
    tipoEnvase: 'Sifón',
    pedidoId: 'PEDIDO #6',
  },
  {
    id: 'mov-002',
    fecha: daysAgo(16),
    tipo: 'DEVOLUCION',
    cantidad: 1,
    tipoEnvase: 'Sifón',
    pedidoId: 'PEDIDO #5',
  },
  {
    id: 'mov-001',
    fecha: daysAgo(20),
    tipo: 'ENTREGA',
    cantidad: 1,
    tipoEnvase: 'Sifón',
    pedidoId: null,
  },
];

export const MOCK_RESUMEN_CONSUMO: ResumenConsumo = {
  totalPedidos: 12,
  totalBidones: 28,
  promedioBidonesPorPedido: 2.33,
};

export const MOCK_PEDIDOS: PedidoHistorialResumen[] = [
  {
    id: 'pedido-h-003',
    fecha: daysAgo(3),
    estado: 'ENTREGADO',
    totalBidones: 2,
  },
  {
    id: 'pedido-h-002',
    fecha: daysAgo(10),
    estado: 'PENDIENTE',
    totalBidones: 3,
  },
  {
    id: 'pedido-h-001',
    fecha: daysAgo(18),
    estado: 'CANCELADO',
    totalBidones: 1,
  },
];
