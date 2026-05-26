import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { crearRepartoRequest, getPedidosDisponiblesRequest } from '@/features/repartos/services/repartoService';
import { listUsuariosRequest } from '@/features/usuarios/services/usuarioService';
import type { Usuario } from '@/types';
import type { Pedido } from '@/types/pedido';

export function useRepartidores() {
  return useQuery<Usuario[]>({
    queryKey: ['usuarios', 'repartidores'],
    queryFn: async () => {
      const res = await listUsuariosRequest();
      return res.data.filter((u) => u.rol === 'REPARTIDOR' && u.activo);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function usePedidosDisponibles(fecha: string | null) {
  return useQuery<Pedido[]>({
    queryKey: ['pedidos', 'disponibles', fecha],
    queryFn: () => getPedidosDisponiblesRequest(fecha!),
    enabled: !!fecha,
    staleTime: 30 * 1000,
  });
}

export function useCrearReparto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearRepartoRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repartos', 'admin'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos', 'disponibles'] });
    },
  });
}
