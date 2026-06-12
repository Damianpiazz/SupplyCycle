import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';

type ListarClientesParams = {
  nombre?: string;
  telefono?: string;
  dia?: string;
};

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
  activo: boolean;
};

type CrearClienteInput = {
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
  observaciones?: string;
};

type ActualizarClienteInput = Partial<CrearClienteInput>;

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
    activo: cliente.activo,
  };
}

export async function listarClientes(params?: ListarClientesParams) {
  const where: Record<string, unknown> = { activo: true };
  if (params?.nombre) {
    where['OR'] = [
      { nombre: { contains: params.nombre, mode: 'insensitive' } },
      { apellido: { contains: params.nombre, mode: 'insensitive' } },
    ];
  }
  if (params?.telefono) {
    where['telefono'] = { contains: params.telefono };
  }
  if (params?.dia) {
    where['diaEntrega'] = params.dia;
  }
  const clientes = await prisma.cliente.findMany({ where, orderBy: { apellido: 'asc' } });
  return clientes.map(toClienteResponse);
}

export async function listarTodosLosClientes(params?: ListarClientesParams) {
  const where: Record<string, unknown> = {};
  if (params?.nombre) {
    where['OR'] = [
      { nombre: { contains: params.nombre, mode: 'insensitive' } },
      { apellido: { contains: params.nombre, mode: 'insensitive' } },
    ];
  }
  if (params?.telefono) {
    where['telefono'] = { contains: params.telefono };
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

export async function crearCliente(input: CrearClienteInput) {
  // Validar que no exista cliente con el mismo teléfono
  const existente = await prisma.cliente.findFirst({
    where: { telefono: input.telefono, activo: true },
  });
  if (existente) {
    throw ApiError.conflict('Ya existe un cliente activo con ese teléfono');
  }

  const cliente = await prisma.cliente.create({
    data: {
      nombre: input.nombre,
      apellido: input.apellido,
      telefono: input.telefono,
      calle: input.calle,
      numero: input.numero,
      localidad: input.localidad,
      latitud: input.latitud,
      longitud: input.longitud,
      diaEntrega: input.diaEntrega as any,
      horarioDesde: input.horarioDesde,
      horarioHasta: input.horarioHasta,
      observaciones: input.observaciones ?? null,
      activo: true,
    },
  });

  return toClienteResponse(cliente);
}

export async function actualizarCliente(id: string, input: ActualizarClienteInput) {
  const cliente = await prisma.cliente.findFirst({
    where: { id, activo: true },
  });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  // Validar unicidad de teléfono si cambia
  if (input.telefono && input.telefono !== cliente.telefono) {
    const existente = await prisma.cliente.findFirst({
      where: { telefono: input.telefono, activo: true, id: { not: id } },
    });
    if (existente) {
      throw ApiError.conflict('Ya existe otro cliente activo con ese teléfono');
    }
  }

  const updated = await prisma.cliente.update({
    where: { id },
    data: {
      ...(input.nombre !== undefined && { nombre: input.nombre }),
      ...(input.apellido !== undefined && { apellido: input.apellido }),
      ...(input.telefono !== undefined && { telefono: input.telefono }),
      ...(input.calle !== undefined && { calle: input.calle }),
      ...(input.numero !== undefined && { numero: input.numero }),
      ...(input.localidad !== undefined && { localidad: input.localidad }),
      ...(input.latitud !== undefined && { latitud: input.latitud }),
      ...(input.longitud !== undefined && { longitud: input.longitud }),
      ...(input.diaEntrega !== undefined && { diaEntrega: input.diaEntrega as any }),
      ...(input.horarioDesde !== undefined && { horarioDesde: input.horarioDesde }),
      ...(input.horarioHasta !== undefined && { horarioHasta: input.horarioHasta }),
      ...(input.observaciones !== undefined && { observaciones: input.observaciones ?? null }),
    },
  });

  return toClienteResponse(updated);
}

export async function eliminarCliente(id: string) {
  const cliente = await prisma.cliente.findUnique({ where: { id } });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  // Si ya está inactivo, la operación es idempotente
  if (!cliente.activo) {
    return { message: 'El cliente ya estaba desactivado' };
  }

  // Verificar que no tenga pedidos activos (PENDIENTE o EN_RUTA)
  const pedidosActivos = await prisma.pedido.count({
    where: {
      clienteId: id,
      estado: { in: ['PENDIENTE', 'EN_RUTA'] },
      deletedAt: null,
    },
  });
  if (pedidosActivos > 0) {
    throw ApiError.conflict(
      'No se puede desactivar el cliente porque tiene pedidos pendientes o en ruta'
    );
  }

  await prisma.cliente.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Cliente desactivado correctamente' };
}
