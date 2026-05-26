import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';
import type {
  UsuarioResponse,
  CrearUsuarioInput,
  ActualizarUsuarioInput,
} from './types.js';

function toUsuarioResponse(usuario: {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  activo: boolean;
}): UsuarioResponse {
  return {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    rol: usuario.rol as 'REPARTIDOR' | 'ADMIN',
    activo: usuario.activo,
  };
}

export async function listarUsuarios(excludeUserId?: string): Promise<UsuarioResponse[]> {
  const usuarios = await prisma.usuario.findMany({
    where: excludeUserId ? { id: { not: excludeUserId } } : undefined,
    orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
  });
  return usuarios.map(toUsuarioResponse);
}

export async function obtenerUsuario(id: string): Promise<UsuarioResponse> {
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) {
    throw ApiError.notFound('Usuario no encontrado');
  }
  return toUsuarioResponse(usuario);
}

export async function crearUsuario(input: CrearUsuarioInput): Promise<UsuarioResponse> {
  const passwordHash = await bcrypt.hash(input.password, 10);

  try {
    const usuario = await prisma.usuario.create({
      data: {
        email: input.email,
        password: passwordHash,
        nombre: input.nombre,
        apellido: input.apellido,
        rol: input.rol ?? 'REPARTIDOR',
        activo: true,
      },
    });
    return toUsuarioResponse(usuario);
  } catch (err: any) {
    if (err?.code === 'P2002') {
      throw ApiError.badRequest('El email ya está en uso');
    }
    throw err;
  }
}

export async function actualizarUsuario(
  id: string,
  input: ActualizarUsuarioInput
): Promise<UsuarioResponse> {
  const existing = await prisma.usuario.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Usuario no encontrado');
  }

  if (input.activo === true && existing.activo) {
    return toUsuarioResponse(existing);
  }

  try {
    const updated = await prisma.usuario.update({
      where: { id },
      data: {
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.nombre !== undefined ? { nombre: input.nombre } : {}),
        ...(input.apellido !== undefined ? { apellido: input.apellido } : {}),
        ...(input.rol !== undefined ? { rol: input.rol } : {}),
        ...(input.activo === true ? { activo: true } : {}),
      },
    });
    return toUsuarioResponse(updated);
  } catch (err: any) {
    if (err?.code === 'P2002') {
      throw ApiError.badRequest('El email ya está en uso');
    }
    throw err;
  }
}

export async function desactivarUsuario(
  id: string,
  adminUserId: string
): Promise<UsuarioResponse> {
  if (id === adminUserId) {
    throw ApiError.forbidden('No puede desactivar su propio usuario');
  }

  const existing = await prisma.usuario.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Usuario no encontrado');
  }

  if (!existing.activo) {
    return toUsuarioResponse(existing);
  }

  if (existing.rol === 'ADMIN') {
    const activeAdmins = await prisma.usuario.count({
      where: { rol: 'ADMIN', activo: true },
    });
    if (activeAdmins <= 1) {
      throw ApiError.forbidden('Debe quedar al menos un administrador activo');
    }
  }

  const updated = await prisma.usuario.update({
    where: { id },
    data: { activo: false },
  });

  return toUsuarioResponse(updated);
}
