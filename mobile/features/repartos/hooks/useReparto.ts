import { useQuery } from '@tanstack/react-query';
import { MOCK_REPARTO } from '@/mocks/mockData';
import type { Reparto } from '@/types';

const USE_MOCK = true;

async function fetchReparto(): Promise<Reparto> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));
    return MOCK_REPARTO;
  }
  const { getRepartosRequest } = await import('@/features/repartos/services/repartoService');
  const repartos = await getRepartosRequest('mock-user-001');
  return repartos[0];
}

export function useReparto() {
  return useQuery<Reparto>({
    queryKey: ['reparto', 'hoy'],
    queryFn: fetchReparto,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRepartoDetalle(id: string) {
  return useQuery<Reparto>({
    queryKey: ['reparto', id],
    queryFn: async () => {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300));
        return MOCK_REPARTO;
      }
      const { getRepartoByIdRequest } = await import(
        '@/features/repartos/services/repartoService'
      );
      return getRepartoByIdRequest(id);
    },
    enabled: !!id,
  });
}
