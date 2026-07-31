import { useQuery } from '@tanstack/react-query';
import {
  getEstadisticasDiariasRequest,
  getEstadisticasMensualesRequest,
  getDemandaRequest,
} from '@/features/estadisticas/services/estadisticasService';
import type { EstadisticasDiarias, EstadisticasMensuales, DemandaEstimada } from '@/types';

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

export function useDemanda(periodo: number, incluirClientes: boolean = false) {
  return useQuery<DemandaEstimada>({
    queryKey: ['estadisticas', 'demanda', periodo, incluirClientes],
    queryFn: () => getDemandaRequest(periodo, incluirClientes),
    staleTime: 5 * 60 * 1000,
  });
}
