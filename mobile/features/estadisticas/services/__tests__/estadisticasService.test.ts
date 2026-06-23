import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockGet = vi.fn();

vi.mock('@/services/api', () => ({
  apiClient: {
    get: mockGet,
  },
  unwrapResponse: (response: { data: { data: unknown } }) => response.data.data,
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

const {
  getEstadisticasDiariasRequest,
  getEstadisticasMensualesRequest,
} = await import('../estadisticasService');

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const mockDiarias = {
  fecha: '2026-06-15',
  totalPedidos: 42,
  entregasRealizadas: 35,
  entregasNoRealizadas: 5,
  volumenProductos: [
    { itemId: 'i1', nombre: 'Bidón 12L', unidad: 'unidad', cantidadTotal: 120 },
  ],
  desempenioRepartos: { total: 5, iniciados: 4, finalizados: 3 },
};

const mockMensuales = {
  anio: 2026,
  mes: 6,
  totalPedidos: 850,
  entregasRealizadas: 720,
  entregasNoRealizadas: 100,
  totalRepartosIniciados: 95,
  totalRepartosFinalizados: 88,
  dias: [
    { dia: 1, totalPedidos: 28, entregasRealizadas: 24, entregasNoRealizadas: 2 },
    { dia: 2, totalPedidos: 32, entregasRealizadas: 28, entregasNoRealizadas: 3 },
  ],
};

// ─── Tests: getEstadisticasDiariasRequest ──────────────────────────────────────

describe('getEstadisticasDiariasRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('llama al endpoint /estadisticas/diarias con la fecha correcta', async () => {
    mockGet.mockResolvedValue({ data: { data: mockDiarias } });

    const result = await getEstadisticasDiariasRequest('2026-06-15');

    expect(mockGet).toHaveBeenCalledWith('/estadisticas/diarias', {
      params: { fecha: '2026-06-15' },
    });
    expect(result).toEqual(mockDiarias);
    expect(result.totalPedidos).toBe(42);
  });

  it('retorna datos correctos con una fecha diferente', async () => {
    const otroDia = {
      ...mockDiarias,
      fecha: '2026-06-20',
      totalPedidos: 10,
    };
    mockGet.mockResolvedValue({ data: { data: otroDia } });

    const result = await getEstadisticasDiariasRequest('2026-06-20');

    expect(result.fecha).toBe('2026-06-20');
    expect(result.totalPedidos).toBe(10);
  });

  it('propaga errores del servidor', async () => {
    const error = new Error('Network Error');
    mockGet.mockRejectedValue(error);

    await expect(
      getEstadisticasDiariasRequest('2026-06-15')
    ).rejects.toThrow('Network Error');
  });
});

// ─── Tests: getEstadisticasMensualesRequest ────────────────────────────────────

describe('getEstadisticasMensualesRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('llama al endpoint /estadisticas/mensuales con anio y mes', async () => {
    mockGet.mockResolvedValue({ data: { data: mockMensuales } });

    const result = await getEstadisticasMensualesRequest(2026, 6);

    expect(mockGet).toHaveBeenCalledWith('/estadisticas/mensuales', {
      params: { anio: '2026', mes: '6' },
    });
    expect(result.totalPedidos).toBe(850);
    expect(result.dias).toHaveLength(2);
  });

  it('retorna datos correctos para otro mes', async () => {
    const otroMes = { ...mockMensuales, mes: 7, totalPedidos: 500 };
    mockGet.mockResolvedValue({ data: { data: otroMes } });

    const result = await getEstadisticasMensualesRequest(2026, 7);

    expect(result.mes).toBe(7);
    expect(result.totalPedidos).toBe(500);
  });
});
