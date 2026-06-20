import { apiClient, unwrapResponse } from '@/services/api';
import type { ApiResponse } from '@/types/api';
import type { EstadisticasDiarias, EstadisticasMensuales } from '@/types';

export async function getEstadisticasDiariasRequest(
  fecha: string
): Promise<EstadisticasDiarias> {
  const response = await apiClient.get<ApiResponse<EstadisticasDiarias>>(
    '/estadisticas/diarias',
    { params: { fecha } }
  );
  return unwrapResponse(response);
}

export async function getEstadisticasMensualesRequest(
  anio: number,
  mes: number
): Promise<EstadisticasMensuales> {
  const response = await apiClient.get<ApiResponse<EstadisticasMensuales>>(
    '/estadisticas/mensuales',
    { params: { anio: String(anio), mes: String(mes) } }
  );
  return unwrapResponse(response);
}
