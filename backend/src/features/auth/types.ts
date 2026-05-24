export interface UsuarioResponse {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'REPARTIDOR' | 'ADMIN';
  activo: boolean;
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioResponse;
}

export interface LoginInput {
  email: string;
  password: string;
}
