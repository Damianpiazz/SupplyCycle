import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_PEDIDOS } from '@/mocks/mockData';
import type { Pedido, EstadoPedido, MotivoCancelacion } from '@/types';

const USE_MOCK = true;

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// Fetch pedidos del día
export function usePedidosDelDia() {
  return useQuery<Pedido[]>({
    queryKey: ['pedidos', 'hoy'],
    queryFn: async () => {
      if (USE_MOCK) {
        await delay(500);
        return MOCK_PEDIDOS;
      }
      const { getPedidosDelDiaRequest } = await import(
        '@/features/pedidos/services/pedidoService'
      );
      return getPedidosDelDiaRequest('mock-user-001');
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch un pedido por ID
export function usePedidoDetalle(id: string) {
  return useQuery<Pedido>({
    queryKey: ['pedido', id],
    queryFn: async () => {
      if (USE_MOCK) {
        await delay(300);
        const pedido = MOCK_PEDIDOS.find((p) => p.id === id);
        if (!pedido) throw new Error('Pedido no encontrado');
        return pedido;
      }
      const { getPedidoByIdRequest } = await import(
        '@/features/pedidos/services/pedidoService'
      );
      return getPedidoByIdRequest(id);
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
      if (USE_MOCK) {
        await delay(400);
        let filtered = [...MOCK_PEDIDOS];
        if (params?.estado) {
          filtered = filtered.filter((p) => p.estado === params.estado);
        }
        if (params?.clienteNombre) {
          const search = params.clienteNombre.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.cliente.nombre.toLowerCase().includes(search) ||
              p.cliente.apellido.toLowerCase().includes(search)
          );
        }
        return { data: filtered, total: filtered.length };
      }
      const { getPedidosRequest } = await import(
        '@/features/pedidos/services/pedidoService'
      );
      return getPedidosRequest(params);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Confirmar entrega exitosa
export function useConfirmarEntrega() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pedidoId: string) => {
      if (USE_MOCK) {
        await delay(400);
        return {
          id: pedidoId,
          estado: 'ENTREGADO' as const,
          actualizadoEn: new Date().toISOString(),
        };
      }
      const { confirmarEntregaRequest } = await import(
        '@/features/pedidos/services/pedidoService'
      );
      return confirmarEntregaRequest(pedidoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['reparto'] });
    },
  });
}

// Cancelar pedido (entrega fallida)
export function useCancelarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pedidoId,
      motivo,
    }: {
      pedidoId: string;
      motivo: MotivoCancelacion;
    }) => {
      if (USE_MOCK) {
        await delay(400);
        return {
          id: pedidoId,
          estado: 'NO_ENTREGADO' as const,
          motivoFalla: motivo,
          actualizadoEn: new Date().toISOString(),
        };
      }
      const { cancelarPedidoRequest } = await import(
        '@/features/pedidos/services/pedidoService'
      );
      return cancelarPedidoRequest(pedidoId, motivo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['reparto'] });
    },
  });
}
