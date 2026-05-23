// TDD-0005: Usuario types

export type Rol = 'REPARTIDOR' | 'ADMIN';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: Rol;
  activo: boolean;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
