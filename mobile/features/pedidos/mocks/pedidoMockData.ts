import type { Pedido } from '@/types';

const hoy = new Date().toISOString();

function mockItem(base: { id: string; nombre: string; unidad: string; precio?: number }): Item {
  return { id: base.id, nombre: base.nombre, descripcion: undefined, unidad: base.unidad, precio: base.precio, activo: true };
}

let piCounter = 0;
function mockPedidoItem(item: Item, cantidad: number): PedidoItem {
  piCounter++;
  return { id: `mock-pi-${String(piCounter).padStart(3, '0')}`, item, cantidad, precioUnitario: item.precio };
}

export const MOCK_PEDIDOS_HOY: Pedido[] = [
  {
    id: 'pedido-001',
    orden: 1,
    estado: 'PENDIENTE',
    fecha: hoy,
    cliente: {
      id: 'cli-001',
      nombre: 'María',
      apellido: 'González',
      telefono: '1155550101',
      domicilio: {
        calle: 'Av. Corrientes',
        numero: '1234',
        localidad: 'CABA',
        latitud: -34.6037,
        longitud: -58.3816,
      },
      diaEntrega: 'LUNES',
      horarioDesde: '09:00',
      horarioHasta: '12:00',
      observaciones: 'Timbre: 3A',
    },
    items: [
      mockPedidoItem(mockItem({ id: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', precio: 1500 }), 2),
    ],
  },
  {
    id: 'pedido-002',
    orden: 2,
    estado: 'EN_RUTA',
    fecha: hoy,
    cliente: {
      id: 'cli-002',
      nombre: 'Carlos',
      apellido: 'López',
      telefono: '1155550102',
      domicilio: {
        calle: 'Callao',
        numero: '567',
        localidad: 'CABA',
        latitud: -34.6050,
        longitud: -58.3830,
      },
      diaEntrega: 'LUNES',
      horarioDesde: '10:00',
      horarioHasta: '13:00',
    },
    items: [
      mockPedidoItem(mockItem({ id: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', precio: 1500 }), 1),
      mockPedidoItem(mockItem({ id: 'item-002', nombre: 'Bidón 12L', unidad: 'unidad', precio: 900 }), 1),
    ],
  },
  {
    id: 'pedido-003',
    orden: 3,
    estado: 'ENTREGADO',
    fecha: hoy,
    cliente: {
      id: 'cli-003',
      nombre: 'Ana',
      apellido: 'Martínez',
      telefono: '1155550103',
      domicilio: {
        calle: 'Santa Fe',
        numero: '890',
        localidad: 'CABA',
        latitud: -34.6060,
        longitud: -58.3840,
      },
      diaEntrega: 'LUNES',
      horarioDesde: '11:00',
      horarioHasta: '14:00',
    },
    items: [
      mockPedidoItem(mockItem({ id: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', precio: 1500 }), 3),
    ],
  },
  {
    id: 'pedido-004',
    orden: 4,
    estado: 'PENDIENTE',
    fecha: hoy,
    cliente: {
      id: 'cli-004',
      nombre: 'Pedro',
      apellido: 'Ramírez',
      telefono: '1155550104',
      domicilio: {
        calle: 'Belgrano',
        numero: '345',
        localidad: 'CABA',
        latitud: -34.6070,
        longitud: -58.3850,
      },
      diaEntrega: 'LUNES',
      horarioDesde: '12:00',
      horarioHasta: '15:00',
    },
    items: [
      mockPedidoItem(mockItem({ id: 'item-002', nombre: 'Bidón 12L', unidad: 'unidad', precio: 900 }), 2),
    ],
  },
  {
    id: 'pedido-005',
    orden: 5,
    estado: 'NO_ENTREGADO',
    fecha: hoy,
    cliente: {
      id: 'cli-005',
      nombre: 'Laura',
      apellido: 'Fernández',
      telefono: '1155550105',
      domicilio: {
        calle: 'Rivadavia',
        numero: '1234',
        localidad: 'CABA',
        latitud: -34.6080,
        longitud: -58.3860,
      },
      diaEntrega: 'LUNES',
      horarioDesde: '13:00',
      horarioHasta: '16:00',
      observaciones: 'Dejar en recepción',
    },
    items: [
      mockPedidoItem(mockItem({ id: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', precio: 1500 }), 1),
    ],
    motivoFalla: 'CLIENTE_AUSENTE',
  },
  {
    id: 'pedido-006',
    orden: 6,
    estado: 'PENDIENTE',
    fecha: hoy,
    cliente: {
      id: 'cli-006',
      nombre: 'Roberto',
      apellido: 'Díaz',
      telefono: '1155550106',
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
    items: [
      mockPedidoItem(mockItem({ id: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', precio: 1500 }), 2),
      mockPedidoItem(mockItem({ id: 'item-003', nombre: 'Bidón 6L', unidad: 'unidad', precio: 600 }), 1),
    ],
  },
];

// Simular delay de red
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockGetPedidosDelDiaRequest(): Promise<Pedido[]> {
  await delay(500);
  return MOCK_PEDIDOS_HOY;
}

export async function mockGetPedidoByIdRequest(id: string): Promise<Pedido> {
  await delay(300);
  const pedido = MOCK_PEDIDOS_HOY.find((p) => p.id === id);
  if (!pedido) throw new Error(`Pedido ${id} no encontrado`);
  return pedido;
}

export async function mockGetPedidosRequest(params?: {
  clienteNombre?: string;
  estado?: string;
}): Promise<{ data: Pedido[]; total: number }> {
  await delay(400);
  let filtered = [...MOCK_PEDIDOS_HOY];
  if (params?.clienteNombre) {
    const q = params.clienteNombre.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.cliente.nombre.toLowerCase().includes(q) ||
        p.cliente.apellido.toLowerCase().includes(q)
    );
  }
  if (params?.estado) {
    filtered = filtered.filter((p) => p.estado === params.estado);
  }
  return { data: filtered, total: filtered.length };
}
