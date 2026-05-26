import { useQuery } from '@tanstack/react-query';
import { getRepartoHoyRequest, getRepartoByIdRequest } from '@/features/repartos/services/repartoService';
import type { Reparto } from '@/types';

export function useReparto() {
  return useQuery<Reparto | null>({
    queryKey: ['reparto', 'hoy'],
    queryFn: getRepartoHoyRequest,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRepartoDetalle(id: string) {
  return useQuery<Reparto>({
    queryKey: ['reparto', id],
    queryFn: () => getRepartoByIdRequest(id),
    enabled: !!id,
  });
}
