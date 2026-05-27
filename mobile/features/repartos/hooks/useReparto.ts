import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRepartoHoyRequest, getRepartoByIdRequest, updateRepartoEstadoRequest } from '@/features/repartos/services/repartoService';
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

export function useIniciarReparto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repartoId: string) =>
      updateRepartoEstadoRequest(repartoId, 'EN_CURSO'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reparto', 'hoy'] });
    },
  });
}
