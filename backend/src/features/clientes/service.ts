import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';
import { timeStringToDate, dateToTimeString } from '../../lib/date-utils.js';
import { calcularDatosDemora } from '../../lib/retenidos-utils.js';
import { calcularIntervaloPromedioDias, DEFAULT_FRECUENCIA_DIAS } from '../../lib/frecuencia.js';
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

export async function obtenerHistorialEnvases(clienteId: string) {
  const retenidos = await prisma.retenido.findMany({
    where: { clienteId },
    include: {
      item: { select: { id: true, nombre: true } },
      pedido: { select: { id: true, numeroPedido: true } },
    },
    orderBy: { inicio: 'desc' },
  });

  // Consolidar saldo pendiente por tipo de item
  const saldoMap = new Map<string, { itemId: string; nombre: string; cantidad: number }>();
  for (const r of retenidos) {
    if (r.estado === 'RETENIDO') {
      const key = r.itemId;
      const existing = saldoMap.get(key);
      if (existing) {
        existing.cantidad++;
      } else {
        saldoMap.set(key, { itemId: r.item.id, nombre: r.item.nombre, cantidad: 1 });
      }
    }
  }
  const saldoEnvases = Array.from(saldoMap.values());

  // Retenidos en bruto: cada registro con fecha, devolución, item y pedido
  const retenidosList = retenidos.map((r) => ({
    id: r.id,
    inicio: r.inicio.toISOString(),
    fin: r.fin?.toISOString() ?? null,
    estado: r.estado,
    item: { id: r.item.id, nombre: r.item.nombre },
    pedido: { id: r.pedido.id, numeroPedido: r.pedido.numeroPedido },
  }));

  return { saldoEnvases, retenidos: retenidosList };
}

export type FrecuenciaCliente = {
  intervaloPromedioDias: number | null;
  diaSemanaFrecuente: string | null;
  totalPedidosAnalizados: number;
  primerPedido: string | null;
  ultimoPedido: string | null;
  distribucionDias: Record<string, number>;
};

export async function calcularFrecuencia(clienteId: string): Promise<FrecuenciaCliente> {
  const pedidos = await prisma.pedido.findMany({
    where: {
      domicilio: { clienteId },
      estado: { not: 'CANCELADO' },
      deletedAt: null,
    },
    select: { fecha: true },
    orderBy: { fecha: 'asc' },
  });

  if (pedidos.length === 0) {
    return {
      intervaloPromedioDias: null,
      diaSemanaFrecuente: null,
      totalPedidosAnalizados: 0,
      primerPedido: null,
      ultimoPedido: null,
      distribucionDias: {},
    };
  }

  // Calcular intervalos entre pedidos consecutivos (en días)
  const DIAS_SEMANA = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
  const distribucionDias: Record<string, number> = {
    LUNES: 0, MARTES: 0, MIERCOLES: 0, JUEVES: 0, VIERNES: 0, SABADO: 0, DOMINGO: 0,
  };

  let sumaIntervalos = 0;
  for (let i = 0; i < pedidos.length; i++) {
    const diaIdx = pedidos[i]!.fecha.getDay();
    const diaNombre = DIAS_SEMANA[diaIdx]!;
    if (distribucionDias[diaNombre] !== undefined) {
      distribucionDias[diaNombre]++;
    }

    if (i > 0) {
      const diffMs = pedidos[i]!.fecha.getTime() - pedidos[i - 1]!.fecha.getTime();
      sumaIntervalos += Math.round(diffMs / (1000 * 60 * 60 * 24));
    }
  }

  // Limpiar días sin pedidos
  const distribucionFiltrada: Record<string, number> = {};
  for (const [dia, count] of Object.entries(distribucionDias)) {
    if (count > 0) {
      distribucionFiltrada[dia] = count;
    }
  }

  const cantidadIntervalos = pedidos.length - 1;
  const intervaloPromedioDias = cantidadIntervalos > 0
    ? Math.round(sumaIntervalos / cantidadIntervalos)
    : null;

  // Día más frecuente
  let diaSemanaFrecuente: string | null = null;
  let maxCount = 0;
  for (const [dia, count] of Object.entries(distribucionFiltrada)) {
    if (count > maxCount) {
      maxCount = count;
      diaSemanaFrecuente = dia;
    }
  }

  return {
    intervaloPromedioDias,
    diaSemanaFrecuente,
    totalPedidosAnalizados: pedidos.length,
    primerPedido: pedidos[0]!.fecha.toISOString(),
    ultimoPedido: pedidos[pedidos.length - 1]!.fecha.toISOString(),
    distribucionDias: distribucionFiltrada,
  };
}

export async function obtenerConsumoCliente(clienteId: string) {
  const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  const pedidos = await prisma.pedido.findMany({
    where: {
      domicilio: { clienteId },
      deletedAt: null,
    },
    include: {
      items: { select: { cantidad: true } },
    },
  });

  const totalPedidos = pedidos.length;
  const totalBidones = pedidos.reduce(
    (sum, p) => sum + p.items.reduce((s, i) => s + i.cantidad, 0),
    0,
  );
  const promedioBidonesPorPedido = totalPedidos > 0 ? totalBidones / totalPedidos : 0;

  const frecuencia = await calcularFrecuencia(clienteId);

  return { totalPedidos, totalBidones, promedioBidonesPorPedido, frecuencia };
}

export async function obtenerPedidosCliente(clienteId: string) {
  const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  const pedidos = await prisma.pedido.findMany({
    where: {
      domicilio: { clienteId },
      deletedAt: null,
    },
    include: {
      items: {
        select: {
          cantidad: true,
          item: { select: { nombre: true } },
        },
      },
    },
    orderBy: { fecha: 'desc' },
  });

  return pedidos.map((p) => ({
    id: p.id,
    numeroPedido: p.numeroPedido,
    fecha: p.fecha.toISOString(),
    estado: p.estado,
    totalBidones: p.items.reduce((s, i) => s + i.cantidad, 0),
    items: p.items.map((i) => ({
      nombre: i.item.nombre,
      cantidad: i.cantidad,
    })),
  }));
}

export async function obtenerDemandaCliente(clienteId: string, periodo: number = 30) {
  const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  const pedidos = await prisma.pedido.findMany({
    where: {
      domicilio: { clienteId },
      deletedAt: null,
    },
    orderBy: { fecha: 'asc' },
    select: {
      fecha: true,
      estado: true,
      items: {
        select: {
          itemId: true,
          cantidad: true,
          item: { select: { nombre: true, unidad: true } },
        },
      },
    },
  });

  if (pedidos.length === 0) {
    return {
      clienteId,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      frecuenciaPromedioDias: 0,
      proximoPedidoEstimado: null,
      demandaPorProducto: [],
      totalUnidadesEstimadas: 0,
      historicoPedidos: 0,
    };
  }

  // RF-10 + F2 gate-review: CANCELADO se excluye ANTES de estimar, igual que
  // en /estadisticas/demanda — no ancla el próximo pedido (lastDate), no
  // participa del intervalo de frecuencia ni aporta items a la demanda.
  const pedidosValidos = pedidos.filter((p) => p.estado !== 'CANCELADO');

  if (pedidosValidos.length === 0) {
    return {
      clienteId,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      frecuenciaPromedioDias: 0,
      proximoPedidoEstimado: null,
      demandaPorProducto: [],
      totalUnidadesEstimadas: 0,
      historicoPedidos: pedidos.length,
    };
  }

  const lastDate = pedidosValidos[pedidosValidos.length - 1]!.fecha;

  // RF-10: frecuencia real sobre pedidos completados (CANCELADO excluido);
  // fallback a 7 días cuando no hay intervalo (0-1 pedido completado)
  const frecuencia =
    calcularIntervaloPromedioDias(pedidosValidos.map((p) => p.fecha)) ??
    DEFAULT_FRECUENCIA_DIAS;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + frecuencia);

  let proximoPedidoEstimado: string | null;
  if (nextDate <= today) {
    const estimado = new Date(today);
    estimado.setDate(estimado.getDate() + frecuencia);
    proximoPedidoEstimado = estimado.toISOString();
  } else {
    proximoPedidoEstimado = nextDate.toISOString();
  }

  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + periodo);

  const itemQtyMap = new Map<string, { nombre: string; unidad: string; cantidades: number[] }>();
  for (const pedido of pedidosValidos) {
    for (const item of pedido.items) {
      const existing = itemQtyMap.get(item.itemId);
      if (existing) {
        existing.cantidades.push(item.cantidad);
      } else {
        itemQtyMap.set(item.itemId, {
          nombre: item.item.nombre,
          unidad: item.item.unidad,
          cantidades: [item.cantidad],
        });
      }
    }
  }

  const demandaPorProducto = Array.from(itemQtyMap.entries()).map(([itemId, data]) => {
    const avg = data.cantidades.reduce((a, b) => a + b, 0) / data.cantidades.length;
    return {
      itemId,
      nombre: data.nombre,
      unidad: data.unidad,
      cantidadEstimada: Math.round(avg),
      pedidosHistoricos: data.cantidades.length,
    };
  });

  const totalUnidadesEstimadas = demandaPorProducto.reduce((s, p) => s + p.cantidadEstimada, 0);

  return {
    clienteId,
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    frecuenciaPromedioDias: Math.round(frecuencia * 10) / 10,
    proximoPedidoEstimado,
    demandaPorProducto,
    totalUnidadesEstimadas,
    historicoPedidos: pedidos.length,
  };
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
