import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';

// ─── Mock TanStack Query ──────────────────────────────────────────────────────

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useQuery: vi.fn(),
    useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
  };
});

// ─── Mock service ─────────────────────────────────────────────────────────────

const mockGetDiarias = vi.fn();
const mockGetMensuales = vi.fn();

vi.mock('@/features/estadisticas/services/estadisticasService', () => ({
  getEstadisticasDiariasRequest: (...args: unknown[]) => mockGetDiarias(...args),
  getEstadisticasMensualesRequest: (...args: unknown[]) => mockGetMensuales(...args),
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

import { useEstadisticasDiarias, useEstadisticasMensuales } from '../useEstadisticas';

// ─── Helper ───────────────────────────────────────────────────────────────────

function getQueryOptions(callIndex = 0) {
  return vi.mocked(useQuery).mock.calls[callIndex][0] as {
    queryKey: unknown[];
    queryFn: () => unknown;
    enabled?: boolean;
    staleTime?: number;
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useEstadisticasDiarias', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isFetching: false,
      isSuccess: false,
      isFetched: false,
    } as never);
  });

  it('usa queryKey con prefijo estadisticas y la fecha', () => {
    useEstadisticasDiarias('2026-06-15');
    const opts = getQueryOptions();
    expect(opts.queryKey).toEqual(['estadisticas', 'diarias', '2026-06-15']);
  });

  it('usa staleTime de 5 minutos', () => {
    useEstadisticasDiarias('2026-06-15');
    const opts = getQueryOptions();
    expect(opts.staleTime).toBe(5 * 60 * 1000);
  });

  it('está enabled solo si hay fecha', () => {
    useEstadisticasDiarias('2026-06-15');
    const opts = getQueryOptions();
    expect(opts.enabled).toBe(true);
  });

  it('no está enabled si la fecha es vacía', () => {
    useEstadisticasDiarias('');
    const opts = getQueryOptions();
    expect(opts.enabled).toBe(false);
  });

  it('queryFn llama a getEstadisticasDiariasRequest con la fecha', async () => {
    const mockData = { fecha: '2026-06-15', totalPedidos: 42 };
    mockGetDiarias.mockResolvedValue(mockData);

    useEstadisticasDiarias('2026-06-15');
    const opts = getQueryOptions();
    const result = await opts.queryFn();

    expect(mockGetDiarias).toHaveBeenCalledWith('2026-06-15');
    expect(result).toEqual(mockData);
  });
});

describe('useEstadisticasMensuales', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isFetching: false,
      isSuccess: false,
      isFetched: false,
    } as never);
  });

  it('usa queryKey con anio y mes', () => {
    useEstadisticasMensuales(2026, 6);
    const opts = getQueryOptions();
    expect(opts.queryKey).toEqual(['estadisticas', 'mensuales', 2026, 6]);
  });

  it('está enabled solo si anio y mes son válidos', () => {
    useEstadisticasMensuales(2026, 6);
    expect(getQueryOptions().enabled).toBe(true);
  });

  it('no está enabled si anio es 0', () => {
    useEstadisticasMensuales(0, 6);
    expect(getQueryOptions().enabled).toBe(false);
  });

  it('queryFn llama a getEstadisticasMensualesRequest', async () => {
    const mockData = { anio: 2026, mes: 6, totalPedidos: 100 };
    mockGetMensuales.mockResolvedValue(mockData);

    useEstadisticasMensuales(2026, 6);
    const opts = getQueryOptions();
    const result = await opts.queryFn();

    expect(mockGetMensuales).toHaveBeenCalledWith(2026, 6);
    expect(result).toEqual(mockData);
  });
});
