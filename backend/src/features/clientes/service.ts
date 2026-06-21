import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';
import { timeStringToDate, dateToTimeString } from '../../lib/date-utils.js';
import { calcularDatosDemora } from '../../lib/retenidos-utils.js';
import type { z } from 'zod';
import type { clienteSchema, actualizarClienteSchema } from './schema.js';

type ClienteInput = z.infer<typeof clienteSchema>;
type ActualizarClienteInput = z.infer<typeof actualizarClienteSchema>;

type ListarClientesParams = {
  nombre?: string;
  telefono?: string;
  dia?: string;
};

type ClienteWithRelations = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  observaciones: string | null;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
  domicilios: Array<{
    id: string;
    calle: string;
    numero: string;
    localidad: string;
    latitud: number | null;
    longitud: number | null;
    principal: boolean;
    dias: Array<{
      id: string;
      nombre: string;
      horarios: Array<{
        id: string;
        inicio: Date;
        fin: Date;
      }>;
    }>;
  }>;
  retenidos: Array<{
    estado: string;
    inicio: Date;
  }>;
};

const clienteInclude = {
  domicilios: {
    include: {
      dias: {
        include: {
          horarios: true,
        },
      },
    },
  },
  retenidos: {
    where: { estado: 'RETENIDO' as const },
    select: { estado: true, inicio: true },
    orderBy: { inicio: 'desc' as const },
  },
} as const;

function toClienteResponse(cliente: ClienteWithRelations) {
  const { tieneDemora, cantidadEnvasesPendientes, fechaUltimaEntrega } =
    calcularDatosDemora(cliente.retenidos);

  return {
    id: cliente.id,
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    telefono: cliente.telefono,
    observaciones: cliente.observaciones ?? undefined,
    activo: cliente.activo,
    tieneDemora,
    cantidadEnvasesPendientes,
    fechaUltimaEntrega,
    domicilios: cliente.domicilios.map((dom) => ({
      id: dom.id,
      calle: dom.calle,
      numero: dom.numero,
      localidad: dom.localidad,
      latitud: dom.latitud ?? undefined,
      longitud: dom.longitud ?? undefined,
      principal: dom.principal,
      dias: dom.dias.map((dia) => ({
        id: dia.id,
        nombre: dia.nombre as 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO',
        horarios: dia.horarios.map((h) => ({
          id: h.id,
          inicio: dateToTimeString(h.inicio),
          fin: dateToTimeString(h.fin),
        })),
      })),
    })),
  };
}

async function getOrCreateCiudad(localidad: string) {
  let ciudad = await prisma.ciudad.findFirst({
    where: { nombre: { equals: localidad, mode: 'insensitive' } },
  });
  if (!ciudad) {
    ciudad = await prisma.ciudad.create({ data: { nombre: localidad } });
  }
  return ciudad;
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
    where['domicilios'] = {
      some: {
        dias: {
          some: { nombre: params.dia },
        },
      },
    };
  }
  const clientes = await prisma.cliente.findMany({
    where,
    include: clienteInclude,
    orderBy: { apellido: 'asc' },
  });
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
    where['domicilios'] = {
      some: {
        dias: {
          some: { nombre: params.dia },
        },
      },
    };
  }
  const clientes = await prisma.cliente.findMany({
    where,
    include: clienteInclude,
    orderBy: { apellido: 'asc' },
  });
  return clientes.map(toClienteResponse);
}

export async function obtenerCliente(id: string) {
  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: clienteInclude,
  });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }
  return toClienteResponse(cliente as unknown as ClienteWithRelations);
}

export async function crearCliente(input: ClienteInput) {
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
      observaciones: input.observaciones ?? null,
      activo: true,
      domicilios: {
        create: await Promise.all(input.domicilios.map(async (dom) => {
          const ciudad = await getOrCreateCiudad(dom.localidad);
          return {
            calle: dom.calle,
            numero: dom.numero,
            localidad: dom.localidad,
            latitud: dom.latitud ?? null,
            longitud: dom.longitud ?? null,
            principal: dom.principal ?? true,
            ciudadId: ciudad.id,
            dias: {
              create: dom.dias.map((dia) => ({
                nombre: dia.nombre,
                horarios: {
                  create: dia.horarios.map((h) => ({
                    inicio: timeStringToDate(h.inicio),
                    fin: timeStringToDate(h.fin),
                  })),
                },
              })),
            },
          };
        })),
      },
    },
    include: clienteInclude,
  });

  return toClienteResponse(cliente as unknown as ClienteWithRelations);
}

export async function actualizarCliente(id: string, input: ActualizarClienteInput) {
  const cliente = await prisma.cliente.findFirst({
    where: { id, activo: true },
    include: { domicilios: { select: { id: true } } },
  });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  if (input.telefono && input.telefono !== cliente.telefono) {
    const existente = await prisma.cliente.findFirst({
      where: { telefono: input.telefono, activo: true, id: { not: id } },
    });
    if (existente) {
      throw ApiError.conflict('Ya existe otro cliente activo con ese teléfono');
    }
  }

  const flatData: Record<string, unknown> = {};
  if (input.nombre !== undefined) flatData['nombre'] = input.nombre;
  if (input.apellido !== undefined) flatData['apellido'] = input.apellido;
  if (input.telefono !== undefined) flatData['telefono'] = input.telefono;
  if (input.observaciones !== undefined) flatData['observaciones'] = input.observaciones ?? null;

  await prisma.$transaction(async (tx) => {
    if (Object.keys(flatData).length > 0) {
      await tx.cliente.update({ where: { id }, data: flatData });
    }

    if (input.domicilios) {
      await tx.domicilio.deleteMany({ where: { clienteId: id } });

      for (const dom of input.domicilios) {
        const ciudad = await getOrCreateCiudad(dom.localidad);
        await tx.domicilio.create({
          data: {
            calle: dom.calle,
            numero: dom.numero,
            localidad: dom.localidad,
            latitud: dom.latitud ?? null,
            longitud: dom.longitud ?? null,
            principal: dom.principal ?? true,
            clienteId: id,
            ciudadId: ciudad.id,
            dias: {
              create: dom.dias.map((dia) => ({
                nombre: dia.nombre,
                horarios: {
                  create: dia.horarios.map((h) => ({
                    inicio: timeStringToDate(h.inicio),
                    fin: timeStringToDate(h.fin),
                  })),
                },
              })),
            },
          },
        });
      }
    }
  });

  const updated = await prisma.cliente.findUnique({
    where: { id },
    include: clienteInclude,
  });
  return toClienteResponse(updated as unknown as ClienteWithRelations);
}

export async function eliminarCliente(id: string) {
  const cliente = await prisma.cliente.findUnique({ where: { id } });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  if (!cliente.activo) {
    return { message: 'El cliente ya estaba desactivado' };
  }

  const pedidosActivos = await prisma.pedido.count({
    where: {
      domicilio: { clienteId: id },
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
