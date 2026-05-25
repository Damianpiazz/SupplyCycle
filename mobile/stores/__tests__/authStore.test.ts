import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/stores/authStore';
import type { Usuario } from '@/types';

const mockUsuario: Usuario = {
  id: 'repartidor-1',
  email: 'repartidor@supplycycle.com',
  nombre: 'Carlos',
  apellido: 'López',
  rol: 'REPARTIDOR',
  activo: true,
};

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      usuario: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it('debe tener el estado inicial correcto', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.usuario).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });

  it('setAuth debe establecer token, usuario y marcar como autenticado', () => {
    useAuthStore.getState().setAuth('jwt-token', mockUsuario);

    const state = useAuthStore.getState();
    expect(state.token).toBe('jwt-token');
    expect(state.usuario).toEqual(mockUsuario);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('setUser debe actualizar solo el usuario', () => {
    useAuthStore.getState().setAuth('jwt-token', mockUsuario);

    const usuarioActualizado: Usuario = {
      ...mockUsuario,
      nombre: 'Carlos Updated',
    };
    useAuthStore.getState().setUser(usuarioActualizado);

    const state = useAuthStore.getState();
    expect(state.usuario?.nombre).toBe('Carlos Updated');
    expect(state.token).toBe('jwt-token');
  });

  it('setLoading debe actualizar isLoading', () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);

    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });

  it('logout debe limpiar todo el estado de autenticación', () => {
    useAuthStore.getState().setAuth('jwt-token', mockUsuario);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.usuario).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });
});
