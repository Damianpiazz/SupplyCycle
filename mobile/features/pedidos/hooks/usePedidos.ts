import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import {
  getPedidosDelDiaRequest,
  getPedidoByIdRequest,
  getPedidosRequest,
  confirmarEntregaRequest,
  cancelarPedidoRequest,
  crearPedidoRequest,
  agregarItemRequest,
  actualizarCantidadItemRequest,
  quitarItemRequest,
} from '@/features/pedidos/services/pedidoService';
import {
  mockGetPedidosDelDiaRequest,
  mockGetPedidoByIdRequest,
  mockGetPedidosRequest,
} from '@/features/pedidos/mocks/pedidoMockData';
import type { Pedido, EstadoPedido, MotivoCancelacion } from '@/types';

function getRepartidorId(): string {
  return useAuthStore.getState().usuario?.id ?? '';
}

// Fetch pedidos del día
export function usePedidosDelDia() {
  return useQuery<Pedido[]>({
    queryKey: ['pedidos', 'hoy'],
    queryFn: async () => {
      try {
        return await getPedidosDelDiaRequest(getRepartidorId());
      } catch {
        return await mockGetPedidosDelDiaRequest();
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch un pedido por ID
export function usePedidoDetalle(id: string) {
  return useQuery<Pedido>({
    queryKey: ['pedido', id],
    queryFn: async () => {
      try {
        return await getPedidoByIdRequest(id);
      } catch {
        return await mockGetPedidoByIdRequest(id);
      }
    },
    enabled: !!id,
  });
}

// Buscar pedidos
export function useBuscarPedidos(params?: {
  clienteNombre?: string;
  fecha?: string;
  estado?: EstadoPedido;
}) {
  return useQuery<{ data: Pedido[]; total: number }>({
    queryKey: ['pedidos', 'buscar', params],
    queryFn: async () => {
      try {
        return await getPedidosRequest(params);
      } catch {
        return await mockGetPedidosRequest(params);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Crear pedido (admin)
export function useCrearPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      clienteId: string;
      repartoId?: string;
      items: Array<{ itemId: string; cantidad: number }>;
    }) => crearPedidoRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['reparto'] });
    },
  });
}

// Confirmar entrega exitosa
export function useConfirmarEntrega() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pedidoId: string) => confirmarEntregaRequest(pedidoId),
    onSuccess: (data) => {
      queryClient.setQueryData<Pedido>(['pedido', data.id], (old) => {
        if (old) return { ...old, estado: 'ENTREGADO' as const };
        return old;
      });
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['reparto'] });
    },
  });
}

// Cancelar pedido (entrega fallida)
export function useCancelarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pedidoId,
      motivo,
    }: {
      pedidoId: string;
      motivo: MotivoCancelacion;
    }) => cancelarPedidoRequest(pedidoId, motivo),
    onSuccess: (data) => {
      queryClient.setQueryData<Pedido>(['pedido', data.id], (old) => {
        if (old)
          return { ...old, estado: 'NO_ENTREGADO' as const, motivoFalla: data.motivoFalla };
        return old;
      });
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['reparto'] });
    },
  });
}

// Agregar item a un pedido
export function useAgregarItem(pedidoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { itemId: string; cantidad: number }) =>
      agregarItemRequest(pedidoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedido', pedidoId] });
    },
  });
}

// Actualizar cantidad de un item en un pedido
export function useActualizarCantidadItem(pedidoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, cantidad }: { itemId: string; cantidad: number }) =>
      actualizarCantidadItemRequest(pedidoId, itemId, cantidad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedido', pedidoId] });
    },
  });
}

// Quitar item de un pedido
export function useQuitarItem(pedidoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => quitarItemRequest(pedidoId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedido', pedidoId] });
    },
  });
}
