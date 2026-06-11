import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';

export async function listarItems(activo?: boolean) {
  const where: Record<string, unknown> = {};
  if (activo !== undefined) {
    where['activo'] = activo;
  }
  return prisma.item.findMany({ where, orderBy: { nombre: 'asc' } });
}

export async function obtenerItem(id: string) {
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) {
    throw ApiError.notFound('Ítem no encontrado');
  }
  return item;
}

export async function crearItem(data: {
  nombre: string;
  descripcion?: string;
  unidad: string;
  precio?: number;
  activo?: boolean;
}) {
  const existente = await prisma.item.findFirst({
    where: { nombre: { equals: data.nombre, mode: 'insensitive' } },
  });
  if (existente) {
    throw ApiError.conflict('Ya existe un ítem con ese nombre');
  }

  return prisma.item.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      unidad: data.unidad,
      precio: data.precio ?? null,
      activo: data.activo ?? true,
    },
  });
}

export async function actualizarItem(
  id: string,
  data: {
    nombre?: string;
    descripcion?: string | null;
    unidad?: string;
    precio?: number | null;
    activo?: boolean;
  }
) {
  const existing = await prisma.item.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Ítem no encontrado');
  }

  if (data.nombre) {
    const duplicado = await prisma.item.findFirst({
      where: { nombre: { equals: data.nombre, mode: 'insensitive' }, id: { not: id } },
    });
    if (duplicado) {
      throw ApiError.conflict('Ya existe otro ítem con ese nombre');
    }
  }

  return prisma.item.update({
    where: { id },
    data: {
      ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
      ...(data.descripcion !== undefined ? { descripcion: data.descripcion } : {}),
      ...(data.unidad !== undefined ? { unidad: data.unidad } : {}),
      ...(data.precio !== undefined ? { precio: data.precio } : {}),
      ...(data.activo !== undefined ? { activo: data.activo } : {}),
    },
  });
}

export async function eliminarItem(id: string) {
  const existing = await prisma.item.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Ítem no encontrado');
  }

  const enUso = await prisma.pedidoItem.count({ where: { itemId: id } });
  if (enUso > 0) {
    throw ApiError.conflict('No se puede eliminar un ítem que está en uso en pedidos');
  }

  await prisma.item.delete({ where: { id } });
  return { message: 'Ítem eliminado correctamente' };
}
