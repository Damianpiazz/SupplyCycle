import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Pedido } from '@/types/pedido';

vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  unwrapResponse: vi.fn((response) => response.data.data),
  unwrapList: vi.fn((response) => response.data),
}));

import {
  getPedidosDelDiaRequest,
  getPedidoByIdRequest,
  getPedidosRequest,
  confirmarEntregaRequest,
  cancelarPedidoRequest,
  crearPedidoRequest,
} from '../pedidoService';
import { apiClient } from '@/services/api';

const mockPedido: Pedido = {
  id: 'pedido-1',
  numeroPedido: 'PEDIDO #1',
  orden: 1,
  estado: 'PENDIENTE',
  fecha: '2026-05-25',
  motivoFalla: null,
  cliente: {
    id: 'cliente-1',
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '1234567890',
    activo: true,
    domicilios: [{
      id: 'dom-cliente-1',
      calle: 'Av. Siempre Viva',
      numero: '123',
      localidad: 'Springfield',
      latitud: -34.0,
      longitud: -58.0,
      principal: true,
      dias: [{
        id: 'dia-1',
        nombre: 'LUNES',
        horarios: [{ id: 'hor-1', inicio: '09:00', fin: '18:00' }],
      }],
    }],
  },
  domicilio: {
    id: 'dom-pedido-1',
    calle: 'Av. Siempre Viva',
    numero: '123',
    localidad: 'Springfield',
    latitud: -34.0,
    longitud: -58.0,
    principal: true,
    dias: [{
      id: 'dia-1',
      nombre: 'LUNES',
      horarios: [{ id: 'hor-1', inicio: '09:00', fin: '18:00' }],
    }],
  },
  items: [
    {
      id: 'item-1',
      item: { id: 'prod-1', nombre: 'Producto 1', unidad: 'kg', activo: true },
      cantidad: 2,
    },
  ],
};

describe('pedidoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPedidosDelDiaRequest', () => {
    it('debe obtener los pedidos del día para un repartidor', async () => {
      (apiClient.get as any).mockResolvedValue({ data: { data: [mockPedido] } });

      const result = await getPedidosDelDiaRequest('repartidor-1');

      expect(apiClient.get).toHaveBeenCalledWith('/pedidos/hoy', {
        params: { repartidorId: 'repartidor-1' },
      });
      expect(result).toEqual([mockPedido]);
    });
  });

  describe('getPedidoByIdRequest', () => {
    it('debe obtener un pedido por su ID', async () => {
      (apiClient.get as any).mockResolvedValue({ data: { data: mockPedido } });

      const result = await getPedidoByIdRequest('pedido-1');

      expect(apiClient.get).toHaveBeenCalledWith('/pedidos/pedido-1');
      expect(result).toEqual(mockPedido);
    });
  });

  describe('getPedidosRequest', () => {
    it('debe obtener pedidos con filtros opcionales', async () => {
      const mockLista = { data: [mockPedido], total: 1 };
      (apiClient.get as any).mockResolvedValue({ data: mockLista });

      const result = await getPedidosRequest({ clienteNombre: 'Juan' });

      expect(apiClient.get).toHaveBeenCalledWith('/pedidos', {
        params: { clienteNombre: 'Juan' },
      });
      expect(result).toEqual(mockLista);
    });
  });

  describe('confirmarEntregaRequest', () => {
    it('debe confirmar la entrega de un pedido', async () => {
      const expected = {
        id: 'pedido-1',
        estado: 'ENTREGADO' as const,
        actualizadoEn: '2026-05-25T10:00:00Z',
      };
      (apiClient.patch as any).mockResolvedValue({ data: { data: expected } });

      const result = await confirmarEntregaRequest('pedido-1');

      expect(apiClient.patch).toHaveBeenCalledWith('/pedidos/pedido-1/confirmar', {});
      expect(result).toEqual(expected);
    });
  });

  describe('cancelarPedidoRequest', () => {
    it('debe cancelar un pedido con un motivo', async () => {
      const expected = {
        id: 'pedido-1',
        estado: 'NO_ENTREGADO' as const,
        motivoFalla: 'CLIENTE_AUSENTE',
        actualizadoEn: '2026-05-25T10:00:00Z',
      };
      (apiClient.patch as any).mockResolvedValue({ data: { data: expected } });

      const result = await cancelarPedidoRequest('pedido-1', 'CLIENTE_AUSENTE');

      expect(apiClient.patch).toHaveBeenCalledWith('/pedidos/pedido-1/cancelar', {
        motivo: 'CLIENTE_AUSENTE',
      });
      expect(result).toEqual(expected);
    });
  });

  describe('crearPedidoRequest', () => {
    it('debe crear un nuevo pedido', async () => {
      const payload = {
        clienteId: 'cliente-1',
        items: [{ itemId: 'item-1', cantidad: 2 }],
      };
      (apiClient.post as any).mockResolvedValue({ data: { data: mockPedido } });

      const result = await crearPedidoRequest(payload);

      expect(apiClient.post).toHaveBeenCalledWith('/pedidos', payload);
      expect(result).toEqual(mockPedido);
    });
  });
});
