import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPedidosDisponiblesRequest, agregarPedidoARepartoRequest, quitarPedidoDeRepartoRequest } from '@/features/repartos/services/repartoService';
import type { Pedido } from '@/types';

export function useEditarReparto(repartoId: string, fecha: string) {
  const [editando, setEditando] = useState(false);
  const queryClient = useQueryClient();

  const toggleEdit = useCallback(() => {
    setEditando((prev) => !prev);
  }, []);

  // Only fetch available pedidos when entering edit mode
  const pedidosDisponiblesQuery = useQuery<Pedido[]>({
    queryKey: ['pedidos', 'disponibles', fecha],
    queryFn: () => getPedidosDisponiblesRequest(fecha),
    enabled: editando,
    staleTime: 60 * 1000,
  });

  const agregarMutation = useMutation({
    mutationFn: (pedidoId: string) => agregarPedidoARepartoRequest(repartoId, pedidoId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['repartos', 'admin', 'detalle', repartoId] }),
        queryClient.invalidateQueries({ queryKey: ['pedidos', 'disponibles', fecha] }),
      ]);
    },
  });

  const quitarMutation = useMutation({
    mutationFn: (pedidoId: string) => quitarPedidoDeRepartoRequest(repartoId, pedidoId),
  });

  return {
    editando,
    setEditando,
    toggleEdit,
    pedidosDisponiblesQuery,
    agregarMutation,
    quitarMutation,
  };
}
