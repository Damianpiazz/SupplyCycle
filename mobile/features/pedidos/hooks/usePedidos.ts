import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/stores/authStore';
import { useOfflineStore } from '@/stores/offlineStore';
import {
  getPedidosDelDiaRequest,
  getPedidoByIdRequest,
  getPedidosRequest,
  confirmarEntregaRequest,
  cancelarPedidoRequest,
  iniciarEntregaRequest,
  crearPedidoRequest,
  agregarItemRequest,
  actualizarCantidadItemRequest,
  quitarItemRequest,
} from '@/features/pedidos/services/pedidoService';

import type { Pedido, EstadoPedido, MotivoCancelacion } from '@/types';

const PEDIDOS_CACHE_KEY = '@supplycycle/pedidos_hoy';

function getRepartidorId(): string {
  return useAuthStore.getState().usuario?.id ?? '';
}

// Fetch pedidos del día (con caché offline en AsyncStorage)
export function usePedidosDelDia() {
  return useQuery<Pedido[]>({
    queryKey: ['pedidos', 'hoy'],
    queryFn: async () => {
      try {
        const data = await getPedidosDelDiaRequest(getRepartidorId());
        // Cachear en AsyncStorage para uso offline
        await AsyncStorage.setItem(PEDIDOS_CACHE_KEY, JSON.stringify(data));
        return data;
      } catch {
        // Fallback: cache local si el backend no responde
        const cached = await AsyncStorage.getItem(PEDIDOS_CACHE_KEY);
        if (cached) {
          try {
            return JSON.parse(cached) as Pedido[];
          } catch {
            // Error de parsing del cache — ignorar
          }
        }
        throw new Error('No se pudieron cargar los pedidos');
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch un pedido por ID
export function usePedidoDetalle(id: string) {
  return useQuery<Pedido>({
    queryKey: ['pedido', id],
    queryFn: () => getPedidoByIdRequest(id),
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
    queryFn: () => getPedidosRequest(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Crear pedido (admin)
export function useCrearPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      clienteId: string;
      fecha?: string;
      items: Array<{ itemId: string; cantidad: number }>;
    }) => crearPedidoRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['reparto'] });
    },
  });
}

// Confirmar entrega exitosa (con soporte offline)
export function useConfirmarEntrega() {
  const queryClient = useQueryClient();
  const addToQueue = useOfflineStore((s) => s.addToQueue);

  return useMutation({
    mutationFn: async (pedidoId: string) => {
      try {
        return await confirmarEntregaRequest(pedidoId);
      } catch {
        // Modo offline: encolar y devolver respuesta optimista
        addToQueue({ type: 'CONFIRMAR_ENTREGA', payload: { pedidoId } });
        return {
          id: pedidoId,
          estado: 'ENTREGADO' as const,
          actualizadoEn: new Date().toISOString(),
        };
      }
    },
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

// Cancelar pedido (entrega fallida, con soporte offline)
export function useCancelarPedido() {
  const queryClient = useQueryClient();
  const addToQueue = useOfflineStore((s) => s.addToQueue);

  return useMutation({
    mutationFn: async ({
      pedidoId,
      motivo,
    }: {
      pedidoId: string;
      motivo: MotivoCancelacion;
    }) => {
      try {
        return await cancelarPedidoRequest(pedidoId, motivo);
      } catch {
        // Modo offline: encolar y devolver respuesta optimista
        addToQueue({ type: 'CANCELAR_PEDIDO', payload: { pedidoId, motivo } });
        return {
          id: pedidoId,
          estado: 'NO_ENTREGADO' as const,
          motivoFalla: motivo,
          actualizadoEn: new Date().toISOString(),
        };
      }
    },
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

// Iniciar entrega: PENDIENTE → EN_RUTA
export function useIniciarEntrega() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pedidoId: string) => iniciarEntregaRequest(pedidoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['reparto'] });
    },
  });
}

// Agregar item a un pedido (con soporte offline)
export function useAgregarItem(pedidoId: string) {
  const queryClient = useQueryClient();
  const addToQueue = useOfflineStore((s) => s.addToQueue);

  return useMutation({
    mutationFn: async (data: { itemId: string; cantidad: number }) => {
      try {
        return await agregarItemRequest(pedidoId, data);
      } catch {
        addToQueue({ type: 'AGREGAR_ITEM', payload: { pedidoId, ...data } });
        return data;
      }
    },
    onSuccess: () => {
      // No invalidar ['pedido', pedidoId] para no sobrescribir el cache
      // que el screen ya actualizó con setQueryData (guardarCambios)
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['reparto'] });
    },
  });
}

// Actualizar cantidad de un item en un pedido (con soporte offline)
export function useActualizarCantidadItem(pedidoId: string) {
  const queryClient = useQueryClient();
  const addToQueue = useOfflineStore((s) => s.addToQueue);

  return useMutation({
    mutationFn: async ({
      itemId,
      cantidad,
    }: {
      itemId: string;
      cantidad: number;
    }) => {
      try {
        return await actualizarCantidadItemRequest(pedidoId, itemId, cantidad);
      } catch {
        addToQueue({
          type: 'ACTUALIZAR_CANTIDAD_ITEM',
          payload: { pedidoId, itemId, cantidad },
        });
        return { itemId, cantidad };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['reparto'] });
    },
  });
}

// Quitar item de un pedido (con soporte offline)
export function useQuitarItem(pedidoId: string) {
  const queryClient = useQueryClient();
  const addToQueue = useOfflineStore((s) => s.addToQueue);

  return useMutation({
    mutationFn: async (itemId: string) => {
      try {
        return await quitarItemRequest(pedidoId, itemId);
      } catch {
        addToQueue({
          type: 'QUITAR_ITEM',
          payload: { pedidoId, itemId },
        });
        return { itemId };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['reparto'] });
    },
  });
}
