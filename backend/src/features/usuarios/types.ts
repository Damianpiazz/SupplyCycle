export interface UsuarioResponse {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'REPARTIDOR' | 'ADMIN';
  activo: boolean;
}

export interface CrearUsuarioInput {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol?: 'REPARTIDOR' | 'ADMIN';
}

export interface ActualizarUsuarioInput {
  email?: string;
  nombre?: string;
  apellido?: string;
  rol?: 'REPARTIDOR' | 'ADMIN';
  activo?: true;
}
