import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery, useMutation } from '@tanstack/react-query';

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useQuery: vi.fn(),
    useMutation: vi.fn(() => ({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
      isSuccess: false,
      reset: vi.fn(),
      data: undefined,
    })),
    useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
  };
});

const mockGetRepartoHoy = vi.fn();
const mockGetRepartoById = vi.fn();
const mockUpdateRepartoEstado = vi.fn();

vi.mock('@/features/repartos/services/repartoService', () => ({
  getRepartoHoyRequest: (...args: unknown[]) => mockGetRepartoHoy(...args),
  getRepartoByIdRequest: (...args: unknown[]) => mockGetRepartoById(...args),
  updateRepartoEstadoRequest: (...args: unknown[]) => mockUpdateRepartoEstado(...args),
}));

import { useReparto, useRepartoDetalle, useIniciarReparto } from '@/features/repartos/hooks/useReparto';

beforeEach(() => {
  vi.clearAllMocks();
});

function getQueryOptions(callIndex = 0) {
  return vi.mocked(useQuery).mock.calls[callIndex][0] as {
    queryKey: unknown[];
    queryFn: () => unknown;
    enabled?: boolean;
    staleTime?: number;
  };
}

describe('useReparto hooks', () => {
  describe('useReparto', () => {
    beforeEach(() => {
      vi.mocked(useQuery).mockReturnValue({
        data: null, isLoading: false, isError: false, error: null,
        refetch: vi.fn(), isFetching: false, isSuccess: false, isFetched: false,
      } as never);
    });

    it('should call useQuery with queryKey ["reparto", "hoy"]', () => {
      useReparto();
      const opts = getQueryOptions();
      expect(opts.queryKey).toEqual(['reparto', 'hoy']);
    });

    it('should call useQuery with staleTime 5 minutes', () => {
      useReparto();
      const opts = getQueryOptions();
      expect(opts.staleTime).toBe(5 * 60 * 1000);
    });

    it('queryFn should call getRepartoHoyRequest', async () => {
      mockGetRepartoHoy.mockResolvedValueOnce({ id: 'r1', estado: 'PENDIENTE' });

      useReparto();
      const opts = getQueryOptions();
      const result = await opts.queryFn();

      expect(mockGetRepartoHoy).toHaveBeenCalledOnce();
      expect(result).toEqual({ id: 'r1', estado: 'PENDIENTE' });
    });

    it('queryFn should return null when no reparto found', async () => {
      mockGetRepartoHoy.mockResolvedValueOnce(null);

      useReparto();
      const opts = getQueryOptions();
      const result = await opts.queryFn();

      expect(result).toBeNull();
    });
  });

  describe('useRepartoDetalle', () => {
    beforeEach(() => {
      vi.mocked(useQuery).mockReturnValue({
        data: null, isLoading: false, isError: false, error: null,
        refetch: vi.fn(), isFetching: false, isSuccess: false, isFetched: false,
      } as never);
    });

    it('should call useQuery with queryKey ["reparto", id]', () => {
      useRepartoDetalle('reparto-1');
      const opts = getQueryOptions();
      expect(opts.queryKey).toEqual(['reparto', 'reparto-1']);
    });

    it('should have enabled set to true when id is provided', () => {
      useRepartoDetalle('reparto-1');
      const opts = getQueryOptions();
      expect(opts.enabled).toBe(true);
    });

    it('should have enabled set to false when id is empty', () => {
      useRepartoDetalle('');
      const opts = getQueryOptions();
      expect(opts.enabled).toBe(false);
    });

    it('queryFn should call getRepartoByIdRequest with id', async () => {
      mockGetRepartoById.mockResolvedValueOnce({ id: 'r1' });

      useRepartoDetalle('r1');
      const opts = getQueryOptions();
      const result = await opts.queryFn();

      expect(mockGetRepartoById).toHaveBeenCalledWith('r1');
      expect(result).toEqual({ id: 'r1' });
    });
  });

  describe('useIniciarReparto', () => {
    it('should pass mutationFn that calls updateRepartoEstadoRequest with EN_CURSO', async () => {
      const useMutationCalls = vi.mocked(useMutation).mock.calls;
      // La primera llamada a useMutation registra la config
      useIniciarReparto();
      const mutationConfig = useMutationCalls[0][0] as {
        mutationFn: (id: string) => Promise<unknown>;
      };

      await mutationConfig.mutationFn('reparto-1');

      expect(mockUpdateRepartoEstado).toHaveBeenCalledWith('reparto-1', 'EN_CURSO');
    });
  });
});
