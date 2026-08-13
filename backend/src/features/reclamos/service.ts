import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';
import type { CrearReclamoInput } from './types.js';

/** POST /reclamos — Create a new reclamo */
export async function crearReclamo(data: CrearReclamoInput) {
  // Validate cliente exists before creating
  const cliente = await prisma.cliente.findUnique({
    where: { id: data.clienteId },
    select: { id: true },
  });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  const reclamo = await prisma.reclamo.create({
    data: {
      clienteId: data.clienteId,
      descripcion: data.descripcion,
    },
    include: {
      cliente: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          telefono: true,
        },
      },
    },
  });

  return reclamo;
}

/** GET /reclamos — List reclamos with optional clienteId filter */
export async function listarReclamos(params?: {
  clienteId?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (params?.clienteId) {
    where['clienteId'] = params.clienteId;
  }

  const [reclamos, total] = await Promise.all([
    prisma.reclamo.findMany({
      where,
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
          },
        },
      },
      orderBy: { creadoEn: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.reclamo.count({ where }),
  ]);

  return {
    data: reclamos,
    total,
    page,
    pageSize,
  };
}

/** GET /reclamos/:id — Single reclamo */
export async function obtenerReclamo(id: string) {
  const reclamo = await prisma.reclamo.findUnique({
    where: { id },
    include: {
      cliente: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          telefono: true,
        },
      },
    },
  });

  if (!reclamo) {
    throw ApiError.notFound('Reclamo no encontrado');
  }

  return reclamo;
}
