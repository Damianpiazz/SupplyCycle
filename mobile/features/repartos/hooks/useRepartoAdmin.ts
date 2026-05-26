import { useQuery } from '@tanstack/react-query';
import { getRepartosAdminRequest, getRepartoAdminByIdRequest } from '@/features/repartos/services/repartoService';
import type { RepartoAdminListItem, RepartoAdminDetalle } from '@/types';

export function useRepartosAdmin() {
  return useQuery<RepartoAdminListItem[]>({
    queryKey: ['repartos', 'admin', 'listado'],
    queryFn: () => getRepartosAdminRequest(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRepartoAdminDetalle(id: string) {
  return useQuery<RepartoAdminDetalle>({
    queryKey: ['repartos', 'admin', 'detalle', id],
    queryFn: () => getRepartoAdminByIdRequest(id),
    enabled: !!id,
  });
}
