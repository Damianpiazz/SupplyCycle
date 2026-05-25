import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';

type ClienteRow = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  calle: string;
  numero: string;
  localidad: string;
  latitud: number;
  longitud: number;
  diaEntrega: string;
  horarioDesde: string;
  horarioHasta: string;
  observaciones: string | null;
};

function toClienteResponse(cliente: ClienteRow) {
  return {
    id: cliente.id,
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    telefono: cliente.telefono,
    domicilio: {
      calle: cliente.calle,
      numero: cliente.numero,
      localidad: cliente.localidad,
      latitud: cliente.latitud,
      longitud: cliente.longitud,
    },
    diaEntrega: cliente.diaEntrega,
    horarioDesde: cliente.horarioDesde,
    horarioHasta: cliente.horarioHasta,
    observaciones: cliente.observaciones ?? undefined,
  };
}

export async function listarClientes(params?: { nombre?: string; dia?: string }) {
  const where: Record<string, unknown> = {};
  if (params?.nombre) {
    where['OR'] = [
      { nombre: { contains: params.nombre, mode: 'insensitive' } },
      { apellido: { contains: params.nombre, mode: 'insensitive' } },
    ];
  }
  if (params?.dia) {
    where['diaEntrega'] = params.dia;
  }
  const clientes = await prisma.cliente.findMany({ where, orderBy: { apellido: 'asc' } });
  return clientes.map(toClienteResponse);
}

export async function obtenerCliente(id: string) {
  const cliente = await prisma.cliente.findUnique({ where: { id } });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }
  return toClienteResponse(cliente);
}
