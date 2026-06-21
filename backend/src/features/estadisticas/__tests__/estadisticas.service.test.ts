import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '../../../utils/api-error.js';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPrisma = {
  pedido: { findMany: vi.fn() },
  pedidoItem: { findMany: vi.fn() },
  reparto: { findMany: vi.fn() },
};

vi.mock('../../../lib/prisma.js', () => ({ prisma: mockPrisma }));

// ─── Import after mocks ───────────────────────────────────────────────────────

const {
  obtenerEstadisticasDiarias,
  obtenerEstadisticasMensuales,
} = await import('../service.js');

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const FECHA = '2026-06-15';

function buildPedido(estado: string) {
  return { estado };
}

function buildItemAgg(
  itemId: string,
  nombre: string,
  unidad: string,
  cantidad: number
) {
  return {
    cantidad,
    item: { id: itemId, nombre, unidad },
  };
}

function buildReparto(estado: string) {
  return { estado };
}

// ─── Helpers de verificación ─────────────────────────────────────────────────

function assertDiariasWhere(where: unknown) {
  // Verifica que el where use gte/lte (rango) en vez de comparación exacta
  expect(where).toHaveProperty('fecha.gte');
  expect(where).toHaveProperty('fecha.lte');
  // Verifica que fecha NO sea un Date (descartamos el antiguo exact match)
  if (where && typeof where === 'object') {
    const w = where as Record<string, unknown>;
    expect(w.fecha).toBeInstanceOf(Object);
    expect(w.fecha).not.toBeInstanceOf(Date);
  }
}

// ─── Tests: obtenerEstadisticasDiarias ─────────────────────────────────────────

describe('obtenerEstadisticasDiarias', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna estadísticas correctas cuando hay datos de todos los tipos', async () => {
    mockPrisma.pedido.findMany.mockResolvedValue([
      buildPedido('ENTREGADO'),
      buildPedido('ENTREGADO'),
      buildPedido('ENTREGADO'),
      buildPedido('NO_ENTREGADO'),
      buildPedido('PENDIENTE'),
    ]);

    mockPrisma.pedidoItem.findMany.mockResolvedValue([
      buildItemAgg('item-1', 'Bidón 12L', 'unidad', 10),
      buildItemAgg('item-1', 'Bidón 12L', 'unidad', 5),
      buildItemAgg('item-2', 'Bidón 20L', 'unidad', 3),
    ]);

    mockPrisma.reparto.findMany.mockResolvedValue([
      buildReparto('COMPLETADO'),
      buildReparto('COMPLETADO'),
      buildReparto('EN_CURSO'),
    ]);

    const result = await obtenerEstadisticasDiarias(FECHA);

    expect(result.fecha).toBe(FECHA);
    expect(result.totalPedidos).toBe(5);
    expect(result.entregasRealizadas).toBe(3);
    expect(result.entregasNoRealizadas).toBe(1); // solo NO_ENTREGADO
    expect(result.volumenProductos).toHaveLength(2);

    const bidon12 = result.volumenProductos.find((v) => v.itemId === 'item-1');
    expect(bidon12?.cantidadTotal).toBe(15);

    const bidon20 = result.volumenProductos.find((v) => v.itemId === 'item-2');
    expect(bidon20?.cantidadTotal).toBe(3);

    expect(result.desempenioRepartos.total).toBe(3);
    expect(result.desempenioRepartos.iniciados).toBe(3); // COMPLETADO + EN_CURSO
    expect(result.desempenioRepartos.finalizados).toBe(2);

    // Verifica que las 3 queries se hicieron con rango gte/lte y no exact match
    expect(mockPrisma.pedido.findMany).toHaveBeenCalled();
    expect(mockPrisma.pedidoItem.findMany).toHaveBeenCalled();
    expect(mockPrisma.reparto.findMany).toHaveBeenCalled();

    const pedidoCall = mockPrisma.pedido.findMany.mock.calls[0]?.[0];
    assertDiariasWhere(pedidoCall?.where);

    const itemCall = mockPrisma.pedidoItem.findMany.mock.calls[0]?.[0];
    assertDiariasWhere(itemCall?.where?.pedido);

    const repartoCall = mockPrisma.reparto.findMany.mock.calls[0]?.[0];
    assertDiariasWhere(repartoCall?.where);
  });

  it('incluye CANCELADO como entrega no realizada', async () => {
    mockPrisma.pedido.findMany.mockResolvedValue([
      buildPedido('ENTREGADO'),
      buildPedido('CANCELADO'),
    ]);

    mockPrisma.pedidoItem.findMany.mockResolvedValue([]);
    mockPrisma.reparto.findMany.mockResolvedValue([]);

    const result = await obtenerEstadisticasDiarias(FECHA);

    expect(result.entregasNoRealizadas).toBe(1);
    expect(result.entregasRealizadas).toBe(1);
  });

  it('retorna todo en 0 cuando no hay pedidos ni repartos', async () => {
    mockPrisma.pedido.findMany.mockResolvedValue([]);
    mockPrisma.pedidoItem.findMany.mockResolvedValue([]);
    mockPrisma.reparto.findMany.mockResolvedValue([]);

    const result = await obtenerEstadisticasDiarias(FECHA);

    expect(result.totalPedidos).toBe(0);
    expect(result.entregasRealizadas).toBe(0);
    expect(result.entregasNoRealizadas).toBe(0);
    expect(result.volumenProductos).toEqual([]);
    expect(result.desempenioRepartos).toEqual({
      total: 0,
      iniciados: 0,
      finalizados: 0,
    });
  });

  it('agrupa correctamente múltiples items del mismo producto', async () => {
    mockPrisma.pedido.findMany.mockResolvedValue([
      buildPedido('ENTREGADO'),
    ]);

    mockPrisma.pedidoItem.findMany.mockResolvedValue([
      buildItemAgg('item-1', 'Bidón 12L', 'unidad', 2),
      buildItemAgg('item-1', 'Bidón 12L', 'unidad', 3),
      buildItemAgg('item-1', 'Bidón 12L', 'unidad', 5),
    ]);

    mockPrisma.reparto.findMany.mockResolvedValue([]);

    const result = await obtenerEstadisticasDiarias(FECHA);

    expect(result.volumenProductos).toHaveLength(1);
    expect(result.volumenProductos[0]?.cantidadTotal).toBe(10);
  });
});

// ─── Tests: obtenerEstadisticasMensuales ───────────────────────────────────────

describe('obtenerEstadisticasMensuales', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna estadísticas mensuales correctas con datos', async () => {
    // Mock pedidos para un mes (junio = 30 días)
    const mockPedidos = [
      { fecha: new Date(2026, 5, 1, 12, 0, 0), estado: 'ENTREGADO' },
      { fecha: new Date(2026, 5, 1, 12, 0, 0), estado: 'ENTREGADO' },
      { fecha: new Date(2026, 5, 1, 12, 0, 0), estado: 'NO_ENTREGADO' },
      { fecha: new Date(2026, 5, 2, 12, 0, 0), estado: 'ENTREGADO' },
      { fecha: new Date(2026, 5, 15, 12, 0, 0), estado: 'PENDIENTE' },
    ];

    const mockRepartos = [
      { fecha: new Date(2026, 5, 1, 12, 0, 0), estado: 'COMPLETADO' },
      { fecha: new Date(2026, 5, 2, 12, 0, 0), estado: 'EN_CURSO' },
    ];

    mockPrisma.pedido.findMany.mockResolvedValue(mockPedidos);
    mockPrisma.reparto.findMany.mockResolvedValue(mockRepartos);

    const result = await obtenerEstadisticasMensuales(2026, 6);

    expect(result.anio).toBe(2026);
    expect(result.mes).toBe(6);
    expect(result.totalPedidos).toBe(5);
    expect(result.entregasRealizadas).toBe(3);
    expect(result.entregasNoRealizadas).toBe(1);
    expect(result.totalRepartosIniciados).toBe(2);
    expect(result.totalRepartosFinalizados).toBe(1);
    expect(result.dias).toHaveLength(30); // junio tiene 30 días

    // Día 1: 3 pedidos (2 entregados, 1 no)
    const dia1 = result.dias.find((d) => d.dia === 1);
    expect(dia1?.totalPedidos).toBe(3);
    expect(dia1?.entregasRealizadas).toBe(2);
    expect(dia1?.entregasNoRealizadas).toBe(1);

    // Día 2: 1 pedido
    const dia2 = result.dias.find((d) => d.dia === 2);
    expect(dia2?.totalPedidos).toBe(1);
    expect(dia2?.entregasRealizadas).toBe(1);

    // Día 3: sin pedidos
    const dia3 = result.dias.find((d) => d.dia === 3);
    expect(dia3?.totalPedidos).toBe(0);
  });

  it('retorna mes con 31 días y todo en 0 cuando no hay datos', async () => {
    mockPrisma.pedido.findMany.mockResolvedValue([]);
    mockPrisma.reparto.findMany.mockResolvedValue([]);

    const result = await obtenerEstadisticasMensuales(2026, 1); // enero

    expect(result.dias).toHaveLength(31);
    expect(result.totalPedidos).toBe(0);
    expect(result.totalRepartosIniciados).toBe(0);
    expect(result.totalRepartosFinalizados).toBe(0);

    for (const dia of result.dias) {
      expect(dia.totalPedidos).toBe(0);
    }

    // Verifica que la query mensual use rango con gte/lte
    const pedidoCall = mockPrisma.pedido.findMany.mock.calls[0]?.[0];
    expect(pedidoCall?.where?.fecha?.gte).toBeInstanceOf(Date);
    expect(pedidoCall?.where?.fecha?.lte).toBeInstanceOf(Date);

    const eneroStart = new Date(2026, 0, 1, 0, 0, 0, 0);
    const eneroEnd = new Date(2026, 0, 31, 23, 59, 59, 999);
    expect(pedidoCall?.where?.fecha?.gte.getTime()).toBe(eneroStart.getTime());
    expect(pedidoCall?.where?.fecha?.lte.getTime()).toBe(eneroEnd.getTime());
  });

  it('lanza error si el mes es inválido', async () => {
    await expect(obtenerEstadisticasMensuales(2026, 13)).rejects.toThrow(
      ApiError
    );
    await expect(obtenerEstadisticasMensuales(2026, 0)).rejects.toThrow(
      ApiError
    );
  });

  it('detecta febrero con 28 días en año no bisiesto', async () => {
    mockPrisma.pedido.findMany.mockResolvedValue([]);
    mockPrisma.reparto.findMany.mockResolvedValue([]);

    const result = await obtenerEstadisticasMensuales(2025, 2); // 2025 no bisiesto

    expect(result.dias).toHaveLength(28);
  });
});
