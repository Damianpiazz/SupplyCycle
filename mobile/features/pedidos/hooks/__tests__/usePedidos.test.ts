import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const mockInvalidateQueries = vi.fn();
const mockSetQueryData = vi.fn();

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: vi.fn(() => ({
      invalidateQueries: mockInvalidateQueries,
      setQueryData: mockSetQueryData,
      getQueryData: vi.fn(),
      refetchQueries: vi.fn(),
    })),
  };
});

const mockGetPedidosDelDia = vi.fn();
const mockGetPedidoById = vi.fn();
const mockGetPedidos = vi.fn();
const mockConfirmarEntrega = vi.fn();
const mockCancelarPedido = vi.fn();
const mockCrearPedido = vi.fn();
const mockAgregarItem = vi.fn();
const mockQuitarItem = vi.fn();
const mockActualizarCantidad = vi.fn();

vi.mock('@/features/pedidos/services/pedidoService', () => ({
  getPedidosDelDiaRequest: (...args: unknown[]) => mockGetPedidosDelDia(...args),
  getPedidoByIdRequest: (...args: unknown[]) => mockGetPedidoById(...args),
  getPedidosRequest: (...args: unknown[]) => mockGetPedidos(...args),
  confirmarEntregaRequest: (...args: unknown[]) => mockConfirmarEntrega(...args),
  cancelarPedidoRequest: (...args: unknown[]) => mockCancelarPedido(...args),
  crearPedidoRequest: (...args: unknown[]) => mockCrearPedido(...args),
  agregarItemRequest: (...args: unknown[]) => mockAgregarItem(...args),
  quitarItemRequest: (...args: unknown[]) => mockQuitarItem(...args),
  actualizarCantidadItemRequest: (...args: unknown[]) => mockActualizarCantidad(...args),
}));

const mockAsyncStorageSet = vi.fn().mockResolvedValue(undefined);
const mockAsyncStorageGet = vi.fn().mockResolvedValue(null);

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: (...args: unknown[]) => mockAsyncStorageSet(...args),
    getItem: (...args: unknown[]) => mockAsyncStorageGet(...args),
  },
}));

const mockAddToQueue = vi.fn();

vi.mock('@/stores/offlineStore', () => ({
  useOfflineStore: vi.fn((selector) => {
    const state = { addToQueue: mockAddToQueue, queue: [] };
    return selector ? selector(state) : state;
  }),
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: () => ({ usuario: { id: 'user-1' } }),
  },
}));

import {
  usePedidosDelDia,
  usePedidoDetalle,
  useBuscarPedidos,
  useCrearPedido,
  useConfirmarEntrega,
  useCancelarPedido,
  useAgregarItem,
  useQuitarItem,
  useActualizarCantidadItem,
} from '@/features/pedidos/hooks/usePedidos';

beforeEach(() => {
  vi.clearAllMocks();
});

function getQueryOptions(callIndex = 0) {
  return vi.mocked(useQuery).mock.calls[callIndex][0] as {
    queryKey: unknown[];
    queryFn: () => unknown;
    enabled?: boolean;
    staleTime?: number;
  };
}

function getMutationOptions(callIndex = 0) {
  return vi.mocked(useMutation).mock.calls[callIndex][0] as {
    mutationFn: (...args: unknown[]) => unknown;
    onSuccess?: (...args: unknown[]) => void;
  };
}

describe('usePedidos hooks', () => {
  describe('usePedidosDelDia', () => {
    beforeEach(() => {
      vi.mocked(useQuery).mockReturnValue({
        data: [], isLoading: false, isError: false, error: null,
        refetch: vi.fn(), isFetching: false, isSuccess: true, isFetched: true,
      } as never);
    });

    it('should call useQuery with correct queryKey', () => {
      usePedidosDelDia();
      const opts = getQueryOptions();
      expect(opts.queryKey).toEqual(['pedidos', 'hoy']);
    });

    it('should call useQuery with staleTime 5 minutes', () => {
      usePedidosDelDia();
      const opts = getQueryOptions();
      expect(opts.staleTime).toBe(5 * 60 * 1000);
    });

    it('should throw when service fails and no cache available', async () => {
      mockGetPedidosDelDia.mockRejectedValueOnce(new Error('Network Error'));

      usePedidosDelDia();
      const opts = getQueryOptions();

      await expect(opts.queryFn()).rejects.toThrow('No se pudieron cargar los pedidos');
      expect(mockGetPedidosDelDia).toHaveBeenCalledWith('user-1');
    });

    it('queryFn should return service result when successful', async () => {
      mockGetPedidosDelDia.mockResolvedValueOnce(['real']);

      usePedidosDelDia();
      const opts = getQueryOptions();
      const result = await opts.queryFn();

      expect(mockGetPedidosDelDia).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(['real']);
    });
  });

  describe('usePedidoDetalle', () => {
    beforeEach(() => {
      vi.mocked(useQuery).mockReturnValue({
        data: null, isLoading: false, isError: false, error: null,
        refetch: vi.fn(), isFetching: false, isSuccess: false, isFetched: false,
      } as never);
    });

    it('should call useQuery with correct queryKey', () => {
      usePedidoDetalle('pedido-1');
      const opts = getQueryOptions();
      expect(opts.queryKey).toEqual(['pedido', 'pedido-1']);
    });

    it('should have enabled set to true when id is provided', () => {
      usePedidoDetalle('pedido-1');
      const opts = getQueryOptions();
      expect(opts.enabled).toBe(true);
    });

    it('should have enabled set to false when id is empty', () => {
      usePedidoDetalle('');
      const opts = getQueryOptions();
      expect(opts.enabled).toBe(false);
    });

    it('should throw when service fails', async () => {
      mockGetPedidoById.mockRejectedValueOnce(new Error('Not found'));

      usePedidoDetalle('p1');
      const opts = getQueryOptions();

      await expect(opts.queryFn()).rejects.toThrow('Not found');
      expect(mockGetPedidoById).toHaveBeenCalledWith('p1');
    });
  });

  describe('useBuscarPedidos', () => {
    beforeEach(() => {
      vi.mocked(useQuery).mockReturnValue({
        data: { data: [], total: 0 }, isLoading: false, isError: false, error: null,
        refetch: vi.fn(), isFetching: false, isSuccess: true, isFetched: true,
      } as never);
    });

    it('should call useQuery with correct queryKey', () => {
      useBuscarPedidos({ estado: 'PENDIENTE' });
      const opts = getQueryOptions();
      expect(opts.queryKey).toEqual(['pedidos', 'buscar', { estado: 'PENDIENTE' }]);
    });

    it('should call useQuery with staleTime 5 minutes', () => {
      useBuscarPedidos();
      const opts = getQueryOptions();
      expect(opts.staleTime).toBe(5 * 60 * 1000);
    });

    it('queryFn should throw when service fails', async () => {
      const params = { estado: 'PENDIENTE' as const };
      mockGetPedidos.mockRejectedValueOnce(new Error('fail'));

      useBuscarPedidos(params);
      const opts = getQueryOptions();

      await expect(opts.queryFn()).rejects.toThrow('fail');
      expect(mockGetPedidos).toHaveBeenCalledWith(params);
    });

    it('queryFn should return service result when successful', async () => {
      const params = { clienteNombre: 'Juan' };
      mockGetPedidos.mockResolvedValueOnce({ data: [{ id: '1' }], total: 1 });

      useBuscarPedidos(params);
      const opts = getQueryOptions();
      const result = await opts.queryFn();

      expect(mockGetPedidos).toHaveBeenCalledWith(params);
      expect(result).toEqual({ data: [{ id: '1' }], total: 1 });
    });
  });

  describe('useCrearPedido', () => {
    it('should call useMutation', () => {
      vi.mocked(useMutation).mockReturnValue({
        mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
        error: null, isSuccess: false, reset: vi.fn(), data: undefined,
      } as never);

      const hook = useCrearPedido();
      expect(hook.mutate).toBeDefined();
    });

    it('should pass mutationFn that calls crearPedidoRequest', async () => {
      vi.mocked(useMutation).mockImplementation((options: any) => ({
        mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
        error: null, isSuccess: false, reset: vi.fn(), data: undefined,
      } as never));

      const payload = { clienteId: 'c1', items: [{ itemId: 'i1', cantidad: 2 }] };
      mockCrearPedido.mockResolvedValueOnce({ id: 'new' });

      useCrearPedido();
      const opts = getMutationOptions();
      const result = await opts.mutationFn(payload);

      expect(mockCrearPedido).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ id: 'new' });
    });

    it('should invalidate pedidos and reparto queries on success', () => {
      vi.mocked(useMutation).mockImplementation((options: any) => {
        if (options.onSuccess) options.onSuccess({ id: 'new' });
        return {
          mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
          error: null, isSuccess: true, reset: vi.fn(), data: { id: 'new' },
        } as never;
      });

      useCrearPedido();
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['pedidos'] });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['reparto'] });
    });
  });

  describe('useConfirmarEntrega', () => {
    it('should call useMutation', () => {
      vi.mocked(useMutation).mockReturnValue({
        mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
        error: null, isSuccess: false, reset: vi.fn(), data: undefined,
      } as never);

      const hook = useConfirmarEntrega();
      expect(hook.mutate).toBeDefined();
    });

    it('should pass mutationFn that calls confirmarEntregaRequest', async () => {
      vi.mocked(useMutation).mockImplementation((options: any) => ({
        mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
        error: null, isSuccess: false, reset: vi.fn(), data: undefined,
      } as never));

      mockConfirmarEntrega.mockResolvedValueOnce({ id: 'p1' });

      useConfirmarEntrega();
      const opts = getMutationOptions();
      const result = await opts.mutationFn({ pedidoId: 'p1' });

      expect(mockConfirmarEntrega).toHaveBeenCalledWith('p1', { latitud: -34.9215, longitud: -57.9546 });
      expect(result).toEqual({ id: 'p1' });
    });

    it('should setQueryData and invalidate on success', () => {
      const responseData = { id: 'p1', estado: 'ENTREGADO' };

      vi.mocked(useMutation).mockImplementation((options: any) => {
        if (options.onSuccess) options.onSuccess(responseData);
        return {
          mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
          error: null, isSuccess: true, reset: vi.fn(), data: responseData,
        } as never;
      });

      useConfirmarEntrega();

      expect(mockSetQueryData).toHaveBeenCalledWith(
        ['pedido', 'p1'],
        expect.any(Function),
      );

      const updater = mockSetQueryData.mock.calls[0][1];
      const old = { id: 'p1', estado: 'PENDIENTE' };
      const updated = updater(old);
      expect(updated).toEqual({ id: 'p1', estado: 'ENTREGADO' });

      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['pedidos'] });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['reparto'] });
    });

    it('encola mutación en offlineStore cuando confirmarEntrega falla (offline)', async () => {
      mockConfirmarEntrega.mockRejectedValueOnce(new Error('Network Error'));
      vi.mocked(useMutation).mockImplementation((options: any) => ({
        mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
        error: null, isSuccess: false, reset: vi.fn(), data: undefined,
      } as never));

      useConfirmarEntrega();
      const opts = getMutationOptions();
      const result = await opts.mutationFn({ pedidoId: 'p1' });

      expect(mockAddToQueue).toHaveBeenCalledWith({
        type: 'CONFIRMAR_ENTREGA',
        payload: { pedidoId: 'p1' },
      });
      expect(result).toMatchObject({
        id: 'p1',
        estado: 'ENTREGADO',
      });
    });
  });

  describe('useCancelarPedido', () => {
    it('should call useMutation', () => {
      vi.mocked(useMutation).mockReturnValue({
        mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
        error: null, isSuccess: false, reset: vi.fn(), data: undefined,
      } as never);

      const hook = useCancelarPedido();
      expect(hook.mutate).toBeDefined();
    });

    it('should pass mutationFn that calls cancelarPedidoRequest', async () => {
      vi.mocked(useMutation).mockImplementation((options: any) => ({
        mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
        error: null, isSuccess: false, reset: vi.fn(), data: undefined,
      } as never));

      const payload = { pedidoId: 'p1', motivo: 'CLIENTE_AUSENTE' as const };
      mockCancelarPedido.mockResolvedValueOnce({ id: 'p1', motivoFalla: 'CLIENTE_AUSENTE' });

      useCancelarPedido();
      const opts = getMutationOptions();
      const result = await opts.mutationFn(payload);

      expect(mockCancelarPedido).toHaveBeenCalledWith('p1', 'CLIENTE_AUSENTE');
      expect(result).toEqual({ id: 'p1', motivoFalla: 'CLIENTE_AUSENTE' });
    });

    it('should setQueryData with NO_ENTREGADO and invalidate on success', () => {
      const responseData = { id: 'p1', estado: 'NO_ENTREGADO', motivoFalla: 'CLIENTE_AUSENTE' };

      vi.mocked(useMutation).mockImplementation((options: any) => {
        if (options.onSuccess) options.onSuccess(responseData);
        return {
          mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
          error: null, isSuccess: true, reset: vi.fn(), data: responseData,
        } as never;
      });

      useCancelarPedido();

      expect(mockSetQueryData).toHaveBeenCalledWith(
        ['pedido', 'p1'],
        expect.any(Function),
      );

      const updater = mockSetQueryData.mock.calls[0][1];
      const old = { id: 'p1', estado: 'PENDIENTE' };
      const updated = updater(old);
      expect(updated).toEqual({
        id: 'p1',
        estado: 'NO_ENTREGADO',
        motivoFalla: 'CLIENTE_AUSENTE',
      });

      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['pedidos'] });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['reparto'] });
    });

    it('encola mutación en offlineStore cuando cancelarPedido falla (offline)', async () => {
      mockCancelarPedido.mockRejectedValueOnce(new Error('Network Error'));
      vi.mocked(useMutation).mockImplementation((options: any) => ({
        mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
        error: null, isSuccess: false, reset: vi.fn(), data: undefined,
      } as never));

      useCancelarPedido();
      const opts = getMutationOptions();
      const payload = { pedidoId: 'p1', motivo: 'CLIENTE_AUSENTE' as const };
      const result = await opts.mutationFn(payload);

      expect(mockAddToQueue).toHaveBeenCalledWith({
        type: 'CANCELAR_PEDIDO',
        payload: { pedidoId: 'p1', motivo: 'CLIENTE_AUSENTE' },
      });
      expect(result).toMatchObject({
        id: 'p1',
        estado: 'NO_ENTREGADO',
        motivoFalla: 'CLIENTE_AUSENTE',
      });
    });
  });

  describe('hooks de items con soporte offline', () => {
    describe('useAgregarItem', () => {
      it('encola en offlineStore cuando agregarItem falla', async () => {
        mockAgregarItem.mockRejectedValueOnce(new Error('Network Error'));
        vi.mocked(useMutation).mockImplementation((_options: unknown) => ({
          mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
          error: null, isSuccess: false, reset: vi.fn(), data: undefined,
        } as never));

        useAgregarItem('p1');
        const opts = getMutationOptions();
        const payload = { itemId: 'item-1', cantidad: 3 };
        const result = await opts.mutationFn(payload);

        expect(mockAddToQueue).toHaveBeenCalledWith({
          type: 'AGREGAR_ITEM',
          payload: { pedidoId: 'p1', itemId: 'item-1', cantidad: 3 },
        });
        expect(result).toEqual({ itemId: 'item-1', cantidad: 3 });
      });

      it('llama a agregarItemRequest directamente cuando hay conexión', async () => {
        const responseData = { id: 'new-item', itemId: 'item-1', cantidad: 3 };
        mockAgregarItem.mockResolvedValueOnce(responseData);
        vi.mocked(useMutation).mockImplementation((_options: unknown) => ({
          mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
          error: null, isSuccess: false, reset: vi.fn(), data: undefined,
        } as never));

        useAgregarItem('p1');
        const opts = getMutationOptions();
        const payload = { itemId: 'item-1', cantidad: 3 };
        const result = await opts.mutationFn(payload);

        expect(mockAddToQueue).not.toHaveBeenCalled();
        expect(result).toEqual(responseData);
      });
    });

    describe('useQuitarItem', () => {
      it('encola en offlineStore cuando quitarItem falla', async () => {
        mockQuitarItem.mockRejectedValueOnce(new Error('Network Error'));
        vi.mocked(useMutation).mockImplementation((_options: unknown) => ({
          mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
          error: null, isSuccess: false, reset: vi.fn(), data: undefined,
        } as never));

        useQuitarItem('p1');
        const opts = getMutationOptions();
        const result = await opts.mutationFn('item-1');

        expect(mockAddToQueue).toHaveBeenCalledWith({
          type: 'QUITAR_ITEM',
          payload: { pedidoId: 'p1', itemId: 'item-1' },
        });
        expect(result).toEqual({ itemId: 'item-1' });
      });
    });

    describe('useActualizarCantidadItem', () => {
      it('encola en offlineStore cuando actualizarCantidad falla', async () => {
        mockActualizarCantidad.mockRejectedValueOnce(new Error('Network Error'));
        vi.mocked(useMutation).mockImplementation((_options: unknown) => ({
          mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false,
          error: null, isSuccess: false, reset: vi.fn(), data: undefined,
        } as never));

        useActualizarCantidadItem('p1');
        const opts = getMutationOptions();
        const result = await opts.mutationFn({ itemId: 'item-1', cantidad: 5 });

        expect(mockAddToQueue).toHaveBeenCalledWith({
          type: 'ACTUALIZAR_CANTIDAD_ITEM',
          payload: { pedidoId: 'p1', itemId: 'item-1', cantidad: 5 },
        });
        expect(result).toEqual({ itemId: 'item-1', cantidad: 5 });
      });
    });
  });
});
