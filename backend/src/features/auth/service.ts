import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/api-error.js';
import type { JwtPayload } from '../../middleware/auth.middleware.js';
import type { AuthResponse, UsuarioResponse, LoginInput } from './types.js';

function toUsuarioResponse(usuario: { id: string; email: string; nombre: string; apellido: string; rol: string; activo: boolean }): UsuarioResponse {
  return {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    rol: usuario.rol as 'REPARTIDOR' | 'ADMIN',
    activo: usuario.activo,
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const usuario = await prisma.usuario.findUnique({
    where: { email: input.email },
  });

  if (!usuario) {
    throw ApiError.unauthorized('Credenciales inválidas');
  }

  if (!usuario.activo) {
    throw ApiError.forbidden('Usuario inactivo');
  }

  const passwordValid = await bcrypt.compare(input.password, usuario.password);
  if (!passwordValid) {
    throw ApiError.unauthorized('Credenciales inválidas');
  }

  const payload: JwtPayload = {
    userId: usuario.id,
    email: usuario.email,
    rol: usuario.rol as 'REPARTIDOR' | 'ADMIN',
  };

  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: 86400 }); // 24h in seconds

  return {
    token,
    usuario: toUsuarioResponse(usuario),
  };
}

export async function getMe(userId: string): Promise<UsuarioResponse> {
  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
  });

  if (!usuario) {
    throw ApiError.notFound('Usuario no encontrado');
  }

  return toUsuarioResponse(usuario);
}
