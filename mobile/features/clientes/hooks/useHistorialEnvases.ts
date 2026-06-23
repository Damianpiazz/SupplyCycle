import { useEffect, useState } from 'react';
import { apiClient, unwrapResponse } from '@/services/api';
import type { MovimientoEnvase, SaldoEnvase } from '@/types/historial';

interface HistorialEnvasesResult {
  saldoEnvases: SaldoEnvase[];
  historial: MovimientoEnvase[];
  loading: boolean;
  error: string | null;
}

interface HistorialApiResponse {
  saldoEnvases: SaldoEnvase[];
  historial: MovimientoEnvase[];
}

export function useHistorialEnvases(clienteId: string): HistorialEnvasesResult {
  const [data, setData] = useState<Omit<HistorialEnvasesResult, 'loading' | 'error'>>({
    saldoEnvases: [],
    historial: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clienteId) return;

    let cancelled = false;

    setLoading(true);
    setError(null);

    apiClient
      .get(`/clientes/${clienteId}/historial`)
      .then((res) => {
        if (cancelled) return;
        // El backend envuelve en { data: T } (ADR-0000)
        const body = unwrapResponse<HistorialApiResponse>(res);
        setData({
          saldoEnvases: body.saldoEnvases ?? [],
          historial: body.historial ?? [],
        });
      })
      .catch((e) => {
        if (cancelled) return;
        const message = e.response?.data?.error?.message || e.message || 'Error de conexión';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clienteId]);

  return { ...data, loading, error };
}
