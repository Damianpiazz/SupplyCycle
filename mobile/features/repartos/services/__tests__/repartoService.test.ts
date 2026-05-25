import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Reparto } from '@/types/reparto';

vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import {
  getRepartosRequest,
  getRepartoByIdRequest,
  getResumenCargaRequest,
  updateRepartoEstadoRequest,
} from '../repartoService';
import { apiClient } from '@/services/api';

const mockReparto: Reparto = {
  id: 'reparto-1',
  repartidorId: 'repartidor-1',
  fecha: '2026-05-25',
  estado: 'PENDIENTE',
  resumen: { totalPedidos: 3, completados: 0, pendientes: 3 },
};

describe('repartoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRepartosRequest', () => {
    it('debe obtener repartos por repartidor y fecha opcional', async () => {
      (apiClient.get as any).mockResolvedValue({ data: { data: [mockReparto] } });

      const result = await getRepartosRequest('repartidor-1', '2026-05-25');

      expect(apiClient.get).toHaveBeenCalledWith('/repartos', {
        params: { repartidorId: 'repartidor-1', fecha: '2026-05-25' },
      });
      expect(result).toEqual([mockReparto]);
    });
  });

  describe('getRepartoByIdRequest', () => {
    it('debe obtener un reparto por su ID', async () => {
      (apiClient.get as any).mockResolvedValue({ data: { data: mockReparto } });

      const result = await getRepartoByIdRequest('reparto-1');

      expect(apiClient.get).toHaveBeenCalledWith('/repartos/reparto-1');
      expect(result).toEqual(mockReparto);
    });
  });

  describe('getResumenCargaRequest', () => {
    it('debe obtener el resumen de carga de un reparto', async () => {
      const expected = {
        repartoId: 'reparto-1',
        items: [{ producto: 'Producto 1', cantidadTotal: 10, unidad: 'kg' }],
      };
      (apiClient.get as any).mockResolvedValue({ data: expected });

      const result = await getResumenCargaRequest('reparto-1');

      expect(apiClient.get).toHaveBeenCalledWith('/repartos/reparto-1/carga');
      expect(result).toEqual(expected);
    });
  });

  describe('updateRepartoEstadoRequest', () => {
    it('debe actualizar el estado de un reparto', async () => {
      const expected = {
        id: 'reparto-1',
        estado: 'EN_CURSO',
        actualizadoEn: '2026-05-25T10:00:00Z',
      };
      (apiClient.patch as any).mockResolvedValue({ data: expected });

      const result = await updateRepartoEstadoRequest('reparto-1', 'EN_CURSO');

      expect(apiClient.patch).toHaveBeenCalledWith('/repartos/reparto-1/estado', {
        estado: 'EN_CURSO',
      });
      expect(result).toEqual(expected);
    });
  });
});
