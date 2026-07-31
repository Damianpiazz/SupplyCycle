import { daysAgo } from '@/mocks/mockData';
import type { SaldoEnvase, RetenidoResponse, ResumenConsumo, PedidoHistorialResumen } from '@/types/historial';

/**
 * Mock data for ClienteHistorialScreen.
 * RF-06.3: saldoEnvases + retenidos
 * RF-07.1: pedidos historial
 * RF-07.5: resumen consumo
 */

export const MOCK_SALDO_ENVASES: SaldoEnvase[] = [
  { itemId: 'item-sifon', nombre: 'Sifón', cantidad: 2 },
  { itemId: 'item-cajon', nombre: 'Cajón', cantidad: 1 },
  { itemId: 'item-bidon', nombre: 'Bidón 20L', cantidad: 0 },
];

export const MOCK_RETENIDOS: RetenidoResponse[] = [
  {
    id: 'ret-006',
    inicio: daysAgo(2),
    fin: null,
    estado: 'RETENIDO',
    item: { id: 'item-sifon', nombre: 'Sifón' },
    pedido: { id: 'ped-008', numeroPedido: 'PEDIDO #8' },
  },
  {
    id: 'ret-005',
    inicio: daysAgo(5),
    fin: daysAgo(5),
    estado: 'DEVUELTO',
    item: { id: 'item-cajon', nombre: 'Cajón' },
    pedido: { id: 'ped-007', numeroPedido: 'PEDIDO #7' },
  },
  {
    id: 'ret-004',
    inicio: daysAgo(8),
    fin: null,
    estado: 'RETENIDO',
    item: { id: 'item-cajon', nombre: 'Cajón' },
    pedido: { id: 'ped-007', numeroPedido: 'PEDIDO #7' },
  },
  {
    id: 'ret-003',
    inicio: daysAgo(12),
    fin: null,
    estado: 'RETENIDO',
    item: { id: 'item-sifon', nombre: 'Sifón' },
    pedido: { id: 'ped-006', numeroPedido: 'PEDIDO #6' },
  },
  {
    id: 'ret-002',
    inicio: daysAgo(16),
    fin: daysAgo(16),
    estado: 'DEVUELTO',
    item: { id: 'item-sifon', nombre: 'Sifón' },
    pedido: { id: 'ped-005', numeroPedido: 'PEDIDO #5' },
  },
  {
    id: 'ret-001',
    inicio: daysAgo(20),
    fin: null,
    estado: 'RETENIDO',
    item: { id: 'item-sifon', nombre: 'Sifón' },
    pedido: { id: 'ped-004', numeroPedido: 'PEDIDO #4' },
  },
];

export const MOCK_RESUMEN_CONSUMO: ResumenConsumo = {
  totalPedidos: 12,
  totalBidones: 28,
  promedioBidonesPorPedido: 2.33,
  frecuencia: {
    intervaloPromedioDias: 12,
    diaSemanaFrecuente: 'MARTES',
    totalPedidosAnalizados: 12,
    primerPedido: daysAgo(120),
    ultimoPedido: daysAgo(3),
    distribucionDias: {
      LUNES: 3,
      MARTES: 5,
      MIERCOLES: 2,
      JUEVES: 1,
      VIERNES: 1,
    },
  },
};

export const MOCK_PEDIDOS: PedidoHistorialResumen[] = [
  {
    id: 'pedido-h-003',
    numeroPedido: 'PEDIDO #10',
    fecha: daysAgo(3),
    estado: 'ENTREGADO',
    totalBidones: 3,
    items: [
      { nombre: 'Bidón 20L', cantidad: 2 },
      { nombre: 'Sifón', cantidad: 1 },
    ],
  },
  {
    id: 'pedido-h-002',
    numeroPedido: 'PEDIDO #9',
    fecha: daysAgo(10),
    estado: 'PENDIENTE',
    totalBidones: 2,
    items: [
      { nombre: 'Bidón 20L', cantidad: 2 },
    ],
  },
  {
    id: 'pedido-h-001',
    numeroPedido: 'PEDIDO #8',
    fecha: daysAgo(18),
    estado: 'CANCELADO',
    totalBidones: 1,
    items: [
      { nombre: 'Sifón', cantidad: 1 },
    ],
  },
];
