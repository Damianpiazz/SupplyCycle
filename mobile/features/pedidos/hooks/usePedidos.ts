import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import {
  getPedidosDelDiaRequest,
  getPedidoByIdRequest,
  getPedidosRequest,
  confirmarEntregaRequest,
  cancelarPedidoRequest,
} from '@/features/pedidos/services/pedidoService';
import type { Pedido, EstadoPedido, MotivoCancelacion } from '@/types';

function getRepartidorId(): string {
  return useAuthStore.getState().usuario?.id ?? '';
}

// Fetch pedidos del día
export function usePedidosDelDia() {
  return useQuery<Pedido[]>({
    queryKey: ['pedidos', 'hoy'],
    queryFn: () => getPedidosDelDiaRequest(getRepartidorId()),
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
