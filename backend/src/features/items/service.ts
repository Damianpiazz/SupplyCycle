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
