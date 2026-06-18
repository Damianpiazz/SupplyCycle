import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';
import { timeStringToDate, dateToTimeString } from '../../lib/date-utils.js';
import type { z } from 'zod';
import type { domicilioSchema, actualizarDomicilioSchema, crearDiaSchema, actualizarDiaSchema, crearHorarioSchema, actualizarHorarioSchema } from './schema.js';

type DomicilioInput = z.infer<typeof domicilioSchema>;
type ActualizarDomicilioInput = z.infer<typeof actualizarDomicilioSchema>;
type CrearDiaInput = z.infer<typeof crearDiaSchema>;
type ActualizarDiaInput = z.infer<typeof actualizarDiaSchema>;
type CrearHorarioInput = z.infer<typeof crearHorarioSchema>;
type ActualizarHorarioInput = z.infer<typeof actualizarHorarioSchema>;

async function getOrCreateCiudad(localidad: string) {
  let ciudad = await prisma.ciudad.findFirst({
    where: { nombre: { equals: localidad, mode: 'insensitive' } },
  });
  if (!ciudad) {
    ciudad = await prisma.ciudad.create({ data: { nombre: localidad } });
  }
  return ciudad;
}

const domicilioInclude = {
  dias: {
    include: {
      horarios: true,
    },
  },
} as const;

function toDomicilioResponse(domicilio: {
  id: string;
  calle: string;
  numero: string;
  localidad: string;
  latitud: number | null;
  longitud: number | null;
  principal: boolean;
  clienteId: string;
  dias: Array<{
    id: string;
    nombre: string;
    horarios: Array<{
      id: string;
      inicio: Date;
      fin: Date;
    }>;
  }>;
}) {
  return {
    id: domicilio.id,
    calle: domicilio.calle,
    numero: domicilio.numero,
    localidad: domicilio.localidad,
    latitud: domicilio.latitud ?? undefined,
    longitud: domicilio.longitud ?? undefined,
    principal: domicilio.principal,
    clienteId: domicilio.clienteId,
    dias: domicilio.dias.map((dia) => ({
      id: dia.id,
      nombre: dia.nombre as 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO',
      horarios: dia.horarios.map((h) => ({
        id: h.id,
        inicio: dateToTimeString(h.inicio),
        fin: dateToTimeString(h.fin),
      })),
    })),
  };
}

type DomicilioWithRelations = {
  id: string;
  calle: string;
  numero: string;
  localidad: string;
  latitud: number | null;
  longitud: number | null;
  principal: boolean;
  clienteId: string;
  dias: Array<{
    id: string;
    nombre: string;
    horarios: Array<{
      id: string;
      inicio: Date;
      fin: Date;
    }>;
  }>;
};

export async function listarDomicilios(clienteId?: string) {
  const where: Record<string, unknown> = {};
  if (clienteId) {
    where['clienteId'] = clienteId;
  }
  const domicilios = await prisma.domicilio.findMany({
    where,
    include: domicilioInclude,
    orderBy: { localidad: 'asc' },
  });
  return domicilios.map(toDomicilioResponse);
}

export async function obtenerDomicilio(id: string) {
  const domicilio = await prisma.domicilio.findUnique({
    where: { id },
    include: domicilioInclude,
  });
  if (!domicilio) {
    throw ApiError.notFound('Domicilio no encontrado');
  }
  return toDomicilioResponse(domicilio as unknown as DomicilioWithRelations);
}

export async function crearDomicilio(input: DomicilioInput) {
  const cliente = await prisma.cliente.findUnique({ where: { id: input.clienteId } });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  const ciudad = await getOrCreateCiudad(input.localidad);

  const domicilio = await prisma.domicilio.create({
    data: {
      calle: input.calle,
      numero: input.numero,
      localidad: input.localidad,
      latitud: input.latitud ?? null,
      longitud: input.longitud ?? null,
      principal: input.principal ?? true,
      clienteId: input.clienteId,
      ciudadId: ciudad.id,
      dias: {
        create: input.dias.map((dia) => ({
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
    include: domicilioInclude,
  });

  return toDomicilioResponse(domicilio as unknown as DomicilioWithRelations);
}

export async function actualizarDomicilio(id: string, input: ActualizarDomicilioInput) {
  const existente = await prisma.domicilio.findUnique({ where: { id } });
  if (!existente) {
    throw ApiError.notFound('Domicilio no encontrado');
  }

  if (input.clienteId) {
    const cliente = await prisma.cliente.findUnique({ where: { id: input.clienteId } });
    if (!cliente) {
      throw ApiError.notFound('Cliente no encontrado');
    }
  }

  const flatData: Record<string, unknown> = {};
  if (input.calle !== undefined) flatData['calle'] = input.calle;
  if (input.numero !== undefined) flatData['numero'] = input.numero;
  if (input.localidad !== undefined) {
    flatData['localidad'] = input.localidad;
    const ciudad = await getOrCreateCiudad(input.localidad);
    flatData['ciudadId'] = ciudad.id;
  }
  if (input.latitud !== undefined) flatData['latitud'] = input.latitud;
  if (input.longitud !== undefined) flatData['longitud'] = input.longitud;
  if (input.principal !== undefined) flatData['principal'] = input.principal;
  if (input.clienteId !== undefined) flatData['clienteId'] = input.clienteId;

  await prisma.$transaction(async (tx) => {
    if (Object.keys(flatData).length > 0) {
      await tx.domicilio.update({ where: { id }, data: flatData });
    }

    if (input.dias) {
      await tx.dia.deleteMany({ where: { domicilioId: id } });

      for (const dia of input.dias) {
        await tx.dia.create({
          data: {
            nombre: dia.nombre,
            domicilioId: id,
            horarios: {
              create: dia.horarios.map((h) => ({
                inicio: timeStringToDate(h.inicio),
                fin: timeStringToDate(h.fin),
              })),
            },
          },
        });
      }
    }
  });

  const updated = await prisma.domicilio.findUnique({
    where: { id },
    include: domicilioInclude,
  });
  return toDomicilioResponse(updated as unknown as DomicilioWithRelations);
}

export async function eliminarDomicilio(id: string) {
  const domicilio = await prisma.domicilio.findUnique({ where: { id } });
  if (!domicilio) {
    throw ApiError.notFound('Domicilio no encontrado');
  }

  const pedidosActivos = await prisma.pedido.count({
    where: {
      domicilioId: id,
      estado: { in: ['PENDIENTE', 'EN_RUTA'] },
      deletedAt: null,
    },
  });
  if (pedidosActivos > 0) {
    throw ApiError.conflict(
      'No se puede eliminar el domicilio porque tiene pedidos pendientes o en ruta'
    );
  }

  await prisma.domicilio.delete({ where: { id } });
  return { message: 'Domicilio eliminado correctamente' };
}

// ─── Días ────────────────────────────────────────────────────────────────────

export async function agregarDia(domicilioId: string, input: CrearDiaInput) {
  const domicilio = await prisma.domicilio.findUnique({ where: { id: domicilioId } });
  if (!domicilio) {
    throw ApiError.notFound('Domicilio no encontrado');
  }

  const dia = await prisma.dia.create({
    data: {
      nombre: input.nombre,
      domicilioId,
      horarios: {
        create: input.horarios.map((h) => ({
          inicio: timeStringToDate(h.inicio),
          fin: timeStringToDate(h.fin),
        })),
      },
    },
    include: { horarios: true },
  });

  return {
    id: dia.id,
    nombre: dia.nombre as 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO',
    domicilioId: dia.domicilioId,
    horarios: dia.horarios.map((h) => ({
      id: h.id,
      inicio: dateToTimeString(h.inicio),
      fin: dateToTimeString(h.fin),
    })),
  };
}

export async function actualizarDia(id: string, input: ActualizarDiaInput) {
  const dia = await prisma.dia.findUnique({
    where: { id },
    include: { horarios: true },
  });
  if (!dia) {
    throw ApiError.notFound('Día no encontrado');
  }

  const flatData: Record<string, unknown> = {};
  if (input.nombre !== undefined) flatData['nombre'] = input.nombre;

  await prisma.$transaction(async (tx) => {
    if (Object.keys(flatData).length > 0) {
      await tx.dia.update({ where: { id }, data: flatData });
    }

    if (input.horarios) {
      await tx.horario.deleteMany({ where: { diaId: id } });

      for (const h of input.horarios) {
        await tx.horario.create({
          data: {
            inicio: timeStringToDate(h.inicio),
            fin: timeStringToDate(h.fin),
            diaId: id,
          },
        });
      }
    }
  });

  const updated = await prisma.dia.findUnique({
    where: { id },
    include: { horarios: true },
  });
  if (!updated) throw ApiError.notFound('Día no encontrado después de actualizar');

  return {
    id: updated.id,
    nombre: updated.nombre as 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO',
    domicilioId: updated.domicilioId,
    horarios: updated.horarios.map((h) => ({
      id: h.id,
      inicio: dateToTimeString(h.inicio),
      fin: dateToTimeString(h.fin),
    })),
  };
}

export async function eliminarDia(id: string) {
  const dia = await prisma.dia.findUnique({ where: { id } });
  if (!dia) {
    throw ApiError.notFound('Día no encontrado');
  }

  await prisma.dia.delete({ where: { id } });
  return { message: 'Día eliminado correctamente' };
}

// ─── Horarios ────────────────────────────────────────────────────────────────

export async function agregarHorario(diaId: string, input: CrearHorarioInput) {
  const dia = await prisma.dia.findUnique({ where: { id: diaId } });
  if (!dia) {
    throw ApiError.notFound('Día no encontrado');
  }

  const horario = await prisma.horario.create({
    data: {
      inicio: timeStringToDate(input.inicio),
      fin: timeStringToDate(input.fin),
      diaId,
    },
  });

  return {
    id: horario.id,
    inicio: dateToTimeString(horario.inicio),
    fin: dateToTimeString(horario.fin),
    diaId: horario.diaId,
  };
}

export async function actualizarHorario(id: string, input: ActualizarHorarioInput) {
  const horario = await prisma.horario.findUnique({ where: { id } });
  if (!horario) {
    throw ApiError.notFound('Horario no encontrado');
  }

  const data: Record<string, Date> = {};
  if (input.inicio !== undefined) data['inicio'] = timeStringToDate(input.inicio);
  if (input.fin !== undefined) data['fin'] = timeStringToDate(input.fin);

  const updated = await prisma.horario.update({ where: { id }, data });

  return {
    id: updated.id,
    inicio: dateToTimeString(updated.inicio),
    fin: dateToTimeString(updated.fin),
    diaId: updated.diaId,
  };
}

export async function eliminarHorario(id: string) {
  const horario = await prisma.horario.findUnique({ where: { id } });
  if (!horario) {
    throw ApiError.notFound('Horario no encontrado');
  }

  await prisma.horario.delete({ where: { id } });
  return { message: 'Horario eliminado correctamente' };
}
