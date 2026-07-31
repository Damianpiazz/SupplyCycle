import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  pedido: {
    findMany: vi.fn(),
  },
};

vi.mock('../../../lib/prisma.js', () => ({ prisma: mockPrisma }));

const { calcularFrecuencia } = await import('../service.js');

// Días de la semana conocidos para las fechas fijas usadas en los tests:
// 2026-07-30 = JUEVES, 2026-07-29 = MIÉRCOLES, 2026-07-28 = MARTES
function makeFecha(daysAgo: number): Date {
  const d = new Date('2026-07-30T12:00:00Z');
  d.setDate(d.getDate() - daysAgo);
  return d;
}

describe('calcularFrecuencia', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve nulls cuando el cliente no tiene pedidos', async () => {
    mockPrisma.pedido.findMany.mockResolvedValue([]);

    const result = await calcularFrecuencia('cliente-1');

    expect(result).toEqual({
      intervaloPromedioDias: null,
      diaSemanaFrecuente: null,
      totalPedidosAnalizados: 0,
      primerPedido: null,
      ultimoPedido: null,
      distribucionDias: {},
    });
    expect(mockPrisma.pedido.findMany).toHaveBeenCalledWith({
      where: {
        domicilio: { clienteId: 'cliente-1' },
        estado: { not: 'CANCELADO' },
        deletedAt: null,
      },
      select: { fecha: true },
      orderBy: { fecha: 'asc' },
    });
  });

  it('devuelve nulls cuando el cliente tiene 1 solo pedido', async () => {
    // 2026-07-30 = JUEVES
    mockPrisma.pedido.findMany.mockResolvedValue([
      { fecha: new Date('2026-07-30T12:00:00Z') },
    ]);

    const result = await calcularFrecuencia('cliente-1');

    expect(result.intervaloPromedioDias).toBeNull();
    expect(result.diaSemanaFrecuente).toBe('JUEVES');
    expect(result.totalPedidosAnalizados).toBe(1);
    expect(result.primerPedido).toBe(result.ultimoPedido);
  });

  it('calcula intervalo promedio con multiples pedidos', async () => {
    // Pedidos cada ~10 días
    mockPrisma.pedido.findMany.mockResolvedValue([
      { fecha: makeFecha(50) }, // día JUEVES
      { fecha: makeFecha(40) }, // día DOMINGO
      { fecha: makeFecha(30) }, // día MARTES
      { fecha: makeFecha(20) }, // día SÁBADO
      { fecha: makeFecha(10) }, // día MIÉRCOLES
    ]);

    const result = await calcularFrecuencia('cliente-1');

    expect(result.totalPedidosAnalizados).toBe(5);
    expect(result.intervaloPromedioDias).toBe(10); // (10+10+10+10)/4
    expect(typeof result.diaSemanaFrecuente).toBe('string');
    expect(result.primerPedido).toBeTruthy();
    expect(result.ultimoPedido).toBeTruthy();
  });

  it('identifica el dia mas frecuente correctamente', async () => {
    // 4 pedidos en MARTES, 1 en cada otro día
    const unMiercoles = new Date('2026-07-29T12:00:00Z'); // MIÉRCOLES
    const unMartes1 = new Date('2026-07-28T12:00:00Z'); // MARTES
    const unMartes2 = new Date('2026-07-21T12:00:00Z'); // MARTES
    const unMartes3 = new Date('2026-07-14T12:00:00Z'); // MARTES
    const unMartes4 = new Date('2026-07-07T12:00:00Z'); // MARTES

    mockPrisma.pedido.findMany.mockResolvedValue([
      { fecha: unMartes4 },
      { fecha: unMartes3 },
      { fecha: unMartes2 },
      { fecha: unMartes1 },
      { fecha: unMiercoles },
    ]);

    const result = await calcularFrecuencia('cliente-1');

    expect(result.diaSemanaFrecuente).toBe('MARTES');
    expect(result.distribucionDias).toEqual({
      MARTES: 4,
      MIERCOLES: 1,
    });
  });

  it('excluye pedidos CANCELADO del calculo', async () => {
    mockPrisma.pedido.findMany.mockResolvedValue([
      { fecha: makeFecha(20) },
      { fecha: makeFecha(10) },
    ]);

    const result = await calcularFrecuencia('cliente-1');

    expect(result.totalPedidosAnalizados).toBe(2);
    expect(mockPrisma.pedido.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          estado: { not: 'CANCELADO' },
        }),
      }),
    );
  });

  it('usa clienteId en la busqueda', async () => {
    mockPrisma.pedido.findMany.mockResolvedValue([]);

    await calcularFrecuencia('cliente-xyz');

    expect(mockPrisma.pedido.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          domicilio: { clienteId: 'cliente-xyz' },
        }),
      }),
    );
  });
});
