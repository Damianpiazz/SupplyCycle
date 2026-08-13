import { useQuery } from '@tanstack/react-query';
import { getPedidosClienteRequest } from '@/features/clientes/services/clienteService';

export function usePedidosCliente(clienteId: string) {
  return useQuery({
    queryKey: ['cliente', clienteId, 'pedidos'],
    queryFn: () => getPedidosClienteRequest(clienteId),
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000,
  });
}
