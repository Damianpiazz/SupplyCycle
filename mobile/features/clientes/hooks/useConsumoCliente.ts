import { useQuery } from '@tanstack/react-query';
import { getConsumoClienteRequest } from '@/features/clientes/services/clienteService';

export function useConsumoCliente(clienteId: string) {
  return useQuery({
    queryKey: ['cliente', clienteId, 'consumo'],
    queryFn: () => getConsumoClienteRequest(clienteId),
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000,
  });
}
