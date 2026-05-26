import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useQuery: vi.fn(),
  };
});

const mockGetRepartos = vi.fn();
const mockGetRepartoById = vi.fn();

vi.mock('@/features/repartos/services/repartoService', () => ({
  getRepartosRequest: (...args: unknown[]) => mockGetRepartos(...args),
  getRepartoByIdRequest: (...args: unknown[]) => mockGetRepartoById(...args),
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: () => ({ usuario: { id: 'user-1' } }),
  },
}));

import { useReparto, useRepartoDetalle } from '@/features/repartos/hooks/useReparto';

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

    it('queryFn should call getRepartosRequest with repartidorId and return first item', async () => {
      mockGetRepartos.mockResolvedValueOnce([{ id: 'r1' }]);

      useReparto();
      const opts = getQueryOptions();
      const result = await opts.queryFn();

      expect(mockGetRepartos).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ id: 'r1' });
    });

    it('queryFn should return undefined when result array is empty', async () => {
      mockGetRepartos.mockResolvedValueOnce([]);

      useReparto();
      const opts = getQueryOptions();
      const result = await opts.queryFn();

      expect(result).toBeUndefined();
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
});
