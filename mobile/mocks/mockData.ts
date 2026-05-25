import type { Pedido } from '@/types/pedido';
import type { Reparto } from '@/types/reparto';
import type { Cliente } from '@/types/cliente';
import type { Item, PedidoItem } from '@/types/item';

export const MOCK_CLIENTES: Cliente[] = [
  {
    id: 'cliente-001',
    nombre: 'María',
    apellido: 'González',
    telefono: '1145678901',
    domicilio: {
      calle: 'Av. Corrientes',
      numero: '1234',
      localidad: 'CABA',
      latitud: -34.6037,
      longitud: -58.3816,
    },
    diaEntrega: 'LUNES',
    horarioDesde: '09:00',
    horarioHasta: '11:00',
    observaciones: 'Timbre 3B',
  },
  {
    id: 'cliente-002',
    nombre: 'Carlos',
    apellido: 'López',
    telefono: '1156789012',
    domicilio: {
      calle: 'Av. Santa Fe',
      numero: '5678',
      localidad: 'CABA',
      latitud: -34.5956,
      longitud: -58.3749,
    },
    diaEntrega: 'LUNES',
    horarioDesde: '10:00',
    horarioHasta: '12:00',
  },
  {
    id: 'cliente-003',
    nombre: 'Ana',
    apellido: 'Martínez',
    telefono: '1167890123',
    domicilio: {
      calle: 'Av. Rivadavia',
      numero: '3456',
      localidad: 'CABA',
      latitud: -34.6097,
      longitud: -58.3958,
    },
    diaEntrega: 'LUNES',
    horarioDesde: '11:00',
    horarioHasta: '13:00',
    observaciones: 'Edificio blanco, piso 5',
  },
  {
    id: 'cliente-004',
    nombre: 'Pedro',
    apellido: 'Ramírez',
    telefono: '1178901234',
    domicilio: {
      calle: 'Callao',
      numero: '789',
      localidad: 'CABA',
      latitud: -34.6010,
      longitud: -58.3845,
    },
    diaEntrega: 'LUNES',
    horarioDesde: '12:00',
    horarioHasta: '14:00',
  },
  {
    id: 'cliente-005',
    nombre: 'Laura',
    apellido: 'Fernández',
    telefono: '1189012345',
    domicilio: {
      calle: 'Av. Belgrano',
      numero: '2345',
      localidad: 'CABA',
      latitud: -34.6130,
      longitud: -58.3810,
    },
    diaEntrega: 'LUNES',
    horarioDesde: '14:00',
    horarioHasta: '16:00',
  },
  {
    id: 'cliente-006',
    nombre: 'Roberto',
    apellido: 'Díaz',
    telefono: '1190123456',
    domicilio: {
      calle: 'Av. Pueyrredón',
      numero: '890',
      localidad: 'CABA',
      latitud: -34.5985,
      longitud: -58.3886,
    },
    diaEntrega: 'LUNES',
    horarioDesde: '08:00',
    horarioHasta: '10:00',
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
    orden: 1,
    estado: 'PENDIENTE',
    fecha: today,
    cliente: MOCK_CLIENTES[5],
    items: [getPedidoItem(MOCK_ITEMS[0], 2)],
  },
  {
    id: 'pedido-002',
    orden: 2,
    estado: 'EN_RUTA',
    fecha: today,
    cliente: MOCK_CLIENTES[1],
    items: [getPedidoItem(MOCK_ITEMS[0], 1), getPedidoItem(MOCK_ITEMS[1], 1)],
  },
  {
    id: 'pedido-003',
    orden: 3,
    estado: 'ENTREGADO',
    fecha: today,
    cliente: MOCK_CLIENTES[2],
    items: [getPedidoItem(MOCK_ITEMS[0], 3)],
  },
  {
    id: 'pedido-004',
    orden: 4,
    estado: 'CANCELADO',
    fecha: today,
    cliente: MOCK_CLIENTES[3],
    items: [getPedidoItem(MOCK_ITEMS[1], 2)],
  },
  {
    id: 'pedido-005',
    orden: 5,
    estado: 'NO_ENTREGADO',
    fecha: today,
    cliente: MOCK_CLIENTES[4],
    items: [getPedidoItem(MOCK_ITEMS[0], 1)],
    motivoFalla: 'CLIENTE_AUSENTE',
  },
  {
    id: 'pedido-006',
    orden: 6,
    estado: 'PENDIENTE',
    fecha: today,
    cliente: MOCK_CLIENTES[0],
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

export const MOCK_MOTIVOS = [
  { value: 'CLIENTE_AUSENTE', label: 'Cliente ausente' },
  { value: 'DIRECCION_INCORRECTA', label: 'Dirección incorrecta' },
  { value: 'ACCESO_DENEGADO', label: 'Acceso denegado' },
  { value: 'OTRO', label: 'Otro' },
] as const;
