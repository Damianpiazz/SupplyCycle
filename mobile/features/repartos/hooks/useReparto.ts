import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import {
  getRepartosRequest,
  getRepartoByIdRequest,
} from '@/features/repartos/services/repartoService';
import {
  mockGetRepartosRequest,
  mockGetRepartoByIdRequest,
} from '@/features/repartos/mocks/repartoMockData';
import type { Reparto } from '@/types';

function getRepartidorId(): string {
  return useAuthStore.getState().usuario?.id ?? '';
}

export function useReparto() {
  return useQuery<Reparto>({
    queryKey: ['reparto', 'hoy'],
    queryFn: async () => {
      try {
        const repartos = await getRepartosRequest(getRepartidorId());
        return repartos[0];
      } catch {
        const repartos = await mockGetRepartosRequest();
        return repartos[0];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useRepartoDetalle(id: string) {
  return useQuery<Reparto>({
    queryKey: ['reparto', id],
    queryFn: async () => {
      try {
        return await getRepartoByIdRequest(id);
      } catch {
        return await mockGetRepartoByIdRequest(id);
      }
    },
    enabled: !!id,
  });
}
