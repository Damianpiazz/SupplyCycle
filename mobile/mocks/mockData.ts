import type { Pedido } from '@/types/pedido';
import type { Reparto } from '@/types/reparto';
import type { Cliente } from '@/types/cliente';
import type { Item, PedidoItem } from '@/types/item';
import type { EstadisticasDiarias, EstadisticasMensuales } from '@/types/estadisticas';

// Helper: fecha ISO relativa a hoy
export function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const MOCK_CLIENTES: Cliente[] = [
  {
    id: 'cliente-001',
    nombre: 'María',
    apellido: 'González',
    telefono: '1145678901',
    observaciones: 'Timbre 3B',
    tieneDemora: true,
    cantidadEnvasesPendientes: 4,
    fechaUltimaEntrega: daysAgo(18),
    domicilios: [
      {
        id: 'dom-cliente-001',
        calle: 'Av. Corrientes',
        numero: '1234',
        localidad: 'CABA',
        latitud: -34.6037,
        longitud: -58.3816,
        principal: true,
        dias: [
          {
            id: 'dia-cliente-001',
            nombre: 'LUNES',
            horarios: [
              { id: 'hor-cliente-001', inicio: '09:00', fin: '11:00' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cliente-002',
    nombre: 'Carlos',
    apellido: 'López',
    telefono: '1156789012',
    tieneDemora: true,
    cantidadEnvasesPendientes: 2,
    fechaUltimaEntrega: daysAgo(16),
    domicilios: [
      {
        id: 'dom-cliente-002',
        calle: 'Av. Santa Fe',
        numero: '5678',
        localidad: 'CABA',
        latitud: -34.5956,
        longitud: -58.3749,
        principal: true,
        dias: [
          {
            id: 'dia-cliente-002',
            nombre: 'LUNES',
            horarios: [
              { id: 'hor-cliente-002', inicio: '10:00', fin: '12:00' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cliente-003',
    nombre: 'Ana',
    apellido: 'Martínez',
    telefono: '1167890123',
    observaciones: 'Edificio blanco, piso 5',
    tieneDemora: false,
    cantidadEnvasesPendientes: 0,
    fechaUltimaEntrega: null,
    domicilios: [
      {
        id: 'dom-cliente-003',
        calle: 'Av. Rivadavia',
        numero: '3456',
        localidad: 'CABA',
        latitud: -34.6097,
        longitud: -58.3958,
        principal: true,
        dias: [
          {
            id: 'dia-cliente-003',
            nombre: 'LUNES',
            horarios: [
              { id: 'hor-cliente-003', inicio: '11:00', fin: '13:00' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cliente-004',
    nombre: 'Pedro',
    apellido: 'Ramírez',
    telefono: '1178901234',
    tieneDemora: false,
    cantidadEnvasesPendientes: 0,
    fechaUltimaEntrega: daysAgo(5),
    domicilios: [
      {
        id: 'dom-cliente-004',
        calle: 'Callao',
        numero: '789',
        localidad: 'CABA',
        latitud: -34.6010,
        longitud: -58.3845,
        principal: true,
        dias: [
          {
            id: 'dia-cliente-004',
            nombre: 'LUNES',
            horarios: [
              { id: 'hor-cliente-004', inicio: '12:00', fin: '14:00' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cliente-005',
    nombre: 'Laura',
    apellido: 'Fernández',
    telefono: '1189012345',
    tieneDemora: false,
    cantidadEnvasesPendientes: 0,
    fechaUltimaEntrega: null,
    domicilios: [
      {
        id: 'dom-cliente-005',
        calle: 'Av. Belgrano',
        numero: '2345',
        localidad: 'CABA',
        latitud: -34.6130,
        longitud: -58.3810,
        principal: true,
        dias: [
          {
            id: 'dia-cliente-005',
            nombre: 'LUNES',
            horarios: [
              { id: 'hor-cliente-005', inicio: '14:00', fin: '16:00' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cliente-006',
    nombre: 'Roberto',
    apellido: 'Díaz',
    telefono: '1190123456',
    tieneDemora: false,
    cantidadEnvasesPendientes: 0,
    fechaUltimaEntrega: null,
    domicilios: [
      {
        id: 'dom-cliente-006',
        calle: 'Av. Pueyrredón',
        numero: '890',
        localidad: 'CABA',
        latitud: -34.5985,
        longitud: -58.3886,
        principal: true,
        dias: [
          {
            id: 'dia-cliente-006',
            nombre: 'LUNES',
            horarios: [
              { id: 'hor-cliente-006', inicio: '08:00', fin: '10:00' },
            ],
          },
        ],
      },
    ],
  },
];

export const MOCK_ITEMS: Item[] = [
  {
    id: 'item-001',
    nombre: 'Bidón 20L',
    descripcion: 'Bidón de agua de 20 litros',
    unidad: 'unidad',
    precio: 1500,
    activo: true,
  },
  {
    id: 'item-002',
    nombre: 'Bidón 12L',
    descripcion: 'Bidón de agua de 12 litros',
    unidad: 'unidad',
    precio: 900,
    activo: true,
  },
  {
    id: 'item-003',
    nombre: 'Bidón 6L',
    descripcion: 'Bidón de agua de 6 litros',
    unidad: 'unidad',
    precio: 600,
    activo: true,
  },
];

let pedidoItemCounter = 0;
function getPedidoItem(item: Item, cantidad: number): PedidoItem {
  pedidoItemCounter++;
  return {
    id: `mock-pi-${String(pedidoItemCounter).padStart(3, '0')}`,
    item,
    cantidad,
    precioUnitario: item.precio,
  };
}

const today = new Date().toISOString();

function calcularTotal(items: PedidoItem[]): number {
  return items.reduce((sum, pi) => sum + (pi.precioUnitario ?? 0) * pi.cantidad, 0);
}

export const MOCK_PEDIDOS: Pedido[] = [
  {
    id: 'pedido-001',
    numeroPedido: 'PEDIDO #1',
    orden: 1,
    estado: 'PENDIENTE',
    fecha: today,
    motivoFalla: null,
    cliente: MOCK_CLIENTES[5],
    domicilio: MOCK_CLIENTES[5].domicilios[0],
    items: [getPedidoItem(MOCK_ITEMS[0], 2)],
  },
  {
    id: 'pedido-002',
    numeroPedido: 'PEDIDO #2',
    orden: 2,
    estado: 'EN_RUTA',
    fecha: today,
    motivoFalla: null,
    cliente: MOCK_CLIENTES[1],
    domicilio: MOCK_CLIENTES[1].domicilios[0],
    items: [getPedidoItem(MOCK_ITEMS[0], 1), getPedidoItem(MOCK_ITEMS[1], 1)],
  },
  {
    id: 'pedido-003',
    numeroPedido: 'PEDIDO #3',
    orden: 3,
    estado: 'ENTREGADO',
    fecha: today,
    motivoFalla: null,
    cliente: MOCK_CLIENTES[2],
    domicilio: MOCK_CLIENTES[2].domicilios[0],
    items: [getPedidoItem(MOCK_ITEMS[0], 3)],
  },
  {
    id: 'pedido-004',
    numeroPedido: 'PEDIDO #4',
    orden: 4,
    estado: 'CANCELADO',
    fecha: today,
    motivoFalla: null,
    cliente: MOCK_CLIENTES[3],
    domicilio: MOCK_CLIENTES[3].domicilios[0],
    items: [getPedidoItem(MOCK_ITEMS[1], 2)],
  },
  {
    id: 'pedido-005',
    numeroPedido: 'PEDIDO #5',
    orden: 5,
    estado: 'NO_ENTREGADO',
    fecha: today,
    cliente: MOCK_CLIENTES[4],
    domicilio: MOCK_CLIENTES[4].domicilios[0],
    items: [getPedidoItem(MOCK_ITEMS[0], 1)],
    motivoFalla: 'CLIENTE_AUSENTE',
  },
  {
    id: 'pedido-006',
    numeroPedido: 'PEDIDO #6',
    orden: 6,
    estado: 'PENDIENTE',
    fecha: today,
    motivoFalla: null,
    cliente: MOCK_CLIENTES[0],
    domicilio: MOCK_CLIENTES[0].domicilios[0],
    items: [getPedidoItem(MOCK_ITEMS[0], 2), getPedidoItem(MOCK_ITEMS[2], 1)],
  },
];

// Calcular total después de crear items
for (const p of MOCK_PEDIDOS) {
  p.total = calcularTotal(p.items);
  p.itemsCount = p.items.length;
}

export const MOCK_REPARTO: Reparto = {
  id: 'reparto-001',
  repartidorId: 'mock-user-001',
  fecha: today,
  estado: 'EN_CURSO',
  horaInicio: '08:30',
  pedidos: MOCK_PEDIDOS,
  resumen: {
    totalPedidos: 6,
    completados: 2,
    pendientes: 3,
  },
};

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const MOCK_ESTADISTICAS_DIARIAS: EstadisticasDiarias = {
  fecha: todayISO(),
  totalPedidos: 6,
  entregasRealizadas: 3,
  entregasNoRealizadas: 2,
  volumenProductos: [
    { itemId: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', cantidadTotal: 8 },
    { itemId: 'item-002', nombre: 'Bidón 12L', unidad: 'unidad', cantidadTotal: 3 },
    { itemId: 'item-003', nombre: 'Bidón 6L', unidad: 'unidad', cantidadTotal: 5 },
  ],
  desempenioRepartos: {
    total: 3,
    iniciados: 2,
    finalizados: 1,
  },
};

export const MOCK_ESTADISTICAS_MENSUALES: EstadisticasMensuales = {
  anio: 2026,
  mes: 6,
  totalPedidos: 180,
  entregasRealizadas: 150,
  entregasNoRealizadas: 20,
  totalRepartosIniciados: 25,
  totalRepartosFinalizados: 22,
  dias: [
    { dia: 1, totalPedidos: 8, entregasRealizadas: 7, entregasNoRealizadas: 1 },
    { dia: 2, totalPedidos: 6, entregasRealizadas: 5, entregasNoRealizadas: 0 },
    { dia: 3, totalPedidos: 10, entregasRealizadas: 8, entregasNoRealizadas: 2 },
    { dia: 4, totalPedidos: 7, entregasRealizadas: 6, entregasNoRealizadas: 1 },
    { dia: 5, totalPedidos: 9, entregasRealizadas: 7, entregasNoRealizadas: 2 },
    { dia: 6, totalPedidos: 5, entregasRealizadas: 5, entregasNoRealizadas: 0 },
    { dia: 7, totalPedidos: 4, entregasRealizadas: 4, entregasNoRealizadas: 0 },
    { dia: 8, totalPedidos: 11, entregasRealizadas: 9, entregasNoRealizadas: 1 },
    { dia: 9, totalPedidos: 6, entregasRealizadas: 5, entregasNoRealizadas: 1 },
    { dia: 10, totalPedidos: 8, entregasRealizadas: 7, entregasNoRealizadas: 0 },
  ],
};


