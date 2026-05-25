import type { Reparto } from '@/types';

export const MOCK_REPARTOS: Reparto[] = [
  {
    id: 'reparto-001',
    repartidorId: 'mock-user-001',
    fecha: new Date().toISOString().split('T')[0],
    estado: 'PENDIENTE',
    resumen: {
      totalPedidos: 5,
      completados: 0,
      pendientes: 5,
    },
    pedidos: [
      {
        id: 'pedido-001',
        orden: 1,
        estado: 'PENDIENTE',
        fecha: new Date().toISOString(),
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
          { item: { id: 'item-001', nombre: 'Leche Entera', unidad: 'Litro', activo: true }, cantidad: 2 },
          { item: { id: 'item-002', nombre: 'Yogur Natural', unidad: 'Unidad', activo: true }, cantidad: 6 },
        ],
      },
      {
        id: 'pedido-002',
        orden: 2,
        estado: 'PENDIENTE',
        fecha: new Date().toISOString(),
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
          { item: { id: 'item-003', nombre: 'Queso Cremoso', unidad: 'Kg', activo: true }, cantidad: 1 },
          { item: { id: 'item-004', nombre: 'Manteca', unidad: 'Unidad', activo: true }, cantidad: 2 },
        ],
      },
      {
        id: 'pedido-003',
        orden: 3,
        estado: 'PENDIENTE',
        fecha: new Date().toISOString(),
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
          { item: { id: 'item-005', nombre: 'Huevos', unidad: 'Docena', activo: true }, cantidad: 1 },
          { item: { id: 'item-006', nombre: 'Pan Lactal', unidad: 'Unidad', activo: true }, cantidad: 2 },
        ],
      },
      {
        id: 'pedido-004',
        orden: 4,
        estado: 'PENDIENTE',
        fecha: new Date().toISOString(),
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
          { item: { id: 'item-007', nombre: 'Gaseosa Cola', unidad: 'Botella', activo: true }, cantidad: 3 },
          { item: { id: 'item-008', nombre: 'Jugo de Naranja', unidad: 'Botella', activo: true }, cantidad: 1 },
        ],
      },
      {
        id: 'pedido-005',
        orden: 5,
        estado: 'PENDIENTE',
        fecha: new Date().toISOString(),
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
          { item: { id: 'item-009', nombre: 'Agua Mineral', unidad: 'Botella', activo: true }, cantidad: 6 },
          { item: { id: 'item-010', nombre: 'Galletitas Dulces', unidad: 'Unidad', activo: true }, cantidad: 4 },
        ],
      },
    ],
  },
];

// Simular delay de red
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockGetRepartosRequest(): Promise<Reparto[]> {
  await delay(500);
  return MOCK_REPARTOS;
}

export async function mockGetRepartoByIdRequest(id: string): Promise<Reparto> {
  await delay(300);
  const reparto = MOCK_REPARTOS.find((r) => r.id === id);
  if (!reparto) throw new Error(`Reparto ${id} no encontrado`);
  return reparto;
}
