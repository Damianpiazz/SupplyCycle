import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listClientesRequest,
  getClienteRequest,
  createClienteRequest,
  updateClienteRequest,
  deleteClienteRequest,
} from '@/features/clientes/services/clienteService';
import type { CrearClienteInput, ActualizarClienteInput } from '@/types';

export function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: listClientesRequest,
  });
}

export function useCliente(id: string) {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: () => getClienteRequest(id),
    enabled: !!id,
  });
}

export function useCrearCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CrearClienteInput) => createClienteRequest(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}

export function useActualizarCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ActualizarClienteInput }) =>
      updateClienteRequest(id, input),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['clientes'] });
      qc.invalidateQueries({ queryKey: ['cliente', vars.id] });
    },
  });
}

export function useEliminarCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClienteRequest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}
