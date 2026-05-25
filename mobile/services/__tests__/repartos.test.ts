import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Reparto } from '@/types';

vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { getRepartosDisponiblesRequest } from '@/services/repartos';
import { apiClient } from '@/services/api';

const mockRepartos: Reparto[] = [
  {
    id: 'reparto-1',
    repartidorId: 'repartidor-1',
    fecha: '2026-05-25',
    estado: 'PENDIENTE',
    resumen: {
      totalPedidos: 5,
      completados: 0,
      pendientes: 5,
    },
  },
  {
    id: 'reparto-2',
    repartidorId: 'repartidor-1',
    fecha: '2026-05-25',
    estado: 'EN_CURSO',
    resumen: {
      totalPedidos: 8,
      completados: 3,
      pendientes: 5,
    },
  },
];

describe('getRepartosDisponiblesRequest', () => {
  const repartidorId = 'repartidor-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener la lista de repartos disponibles', async () => {
    (apiClient.get as any).mockResolvedValue({ data: { data: mockRepartos } });

    const result = await getRepartosDisponiblesRequest(repartidorId);

    expect(apiClient.get).toHaveBeenCalledWith('/repartos', {
      params: { repartidorId },
    });
    expect(result).toEqual(mockRepartos);
  });

  it('debe devolver lista vacía si no hay repartos', async () => {
    (apiClient.get as any).mockResolvedValue({ data: { data: [] } });

    const result = await getRepartosDisponiblesRequest(repartidorId);

    expect(result).toEqual([]);
  });
});
