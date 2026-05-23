import { create } from 'zustand';
import type { Usuario } from '@/types';

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, usuario: Usuario) => void;
  setUser: (usuario: Usuario) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  usuario: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: (token, usuario) =>
    set({ token, usuario, isAuthenticated: true, isLoading: false }),
  setUser: (usuario) => set({ usuario }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () =>
    set({ token: null, usuario: null, isAuthenticated: false, isLoading: false }),
}));
