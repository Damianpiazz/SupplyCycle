import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listUsuariosRequest,
  getUsuarioRequest,
  createUsuarioRequest,
  updateUsuarioRequest,
  deactivateUsuarioRequest,
  reactivateUsuarioRequest,
} from '@/features/usuarios/services/usuarioService';
import type { CrearUsuarioInput, ActualizarUsuarioInput } from '@/types';

export function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: listUsuariosRequest,
  });
}

export function useUsuario(id: string) {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: () => getUsuarioRequest(id),
    enabled: !!id,
  });
}

export function useCrearUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CrearUsuarioInput) => createUsuarioRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}

export function useActualizarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ActualizarUsuarioInput }) =>
      updateUsuarioRequest(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuario', variables.id] });
    },
  });
}

export function useDesactivarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateUsuarioRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}

export function useReactivarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivateUsuarioRequest(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuario', id] });
    },
  });
}
