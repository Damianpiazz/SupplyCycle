import { useQuery } from '@tanstack/react-query';
import {
  getEstadisticasDiariasRequest,
  getEstadisticasMensualesRequest,
} from '@/features/estadisticas/services/estadisticasService';
import type { EstadisticasDiarias, EstadisticasMensuales } from '@/types';

export function useEstadisticasDiarias(fecha: string) {
  return useQuery<EstadisticasDiarias>({
    queryKey: ['estadisticas', 'diarias', fecha],
    queryFn: () => getEstadisticasDiariasRequest(fecha),
    enabled: !!fecha,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEstadisticasMensuales(anio: number, mes: number) {
  return useQuery<EstadisticasMensuales>({
    queryKey: ['estadisticas', 'mensuales', anio, mes],
    queryFn: () => getEstadisticasMensualesRequest(anio, mes),
    enabled: !!anio && !!mes,
    staleTime: 5 * 60 * 1000,
  });
}
