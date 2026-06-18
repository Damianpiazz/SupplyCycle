import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';
import { dateFromISODate, fmtDate } from '../../utils/dates.js';

function dateToTimeString(date: Date): string {
  return date.toISOString().slice(11, 16);
}

const pedidoDomicilioInclude = {
  domicilio: {
    include: {
      cliente: true,
      dias: {
        take: 1,
        include: { horarios: { take: 1 } },
      },
    },
  },
} as const;

function mapPedidoCliente(domicilio: {
  calle: string;
  numero: string;
  localidad: string;
  latitud: number | null;
  longitud: number | null;
  cliente: {
    id: string;
    nombre: string;
    apellido: string;
    telefono: string;
    observaciones: string | null;
    activo: boolean;
  };
  dias: Array<{
    nombre: string;
    horarios: Array<{
      inicio: Date;
      fin: Date;
    }>;
  }>;
}) {
  const dia = domicilio.dias?.[0];
  const horario = dia?.horarios?.[0];

  return {
    id: domicilio.cliente.id,
    nombre: domicilio.cliente.nombre,
    apellido: domicilio.cliente.apellido,
    telefono: domicilio.cliente.telefono,
    domicilio: {
      calle: domicilio.calle,
      numero: domicilio.numero,
      localidad: domicilio.localidad,
      latitud: domicilio.latitud ?? undefined,
      longitud: domicilio.longitud ?? undefined,
    },
    horarioDesde: horario ? dateToTimeString(horario.inicio) : '08:00',
    horarioHasta: horario ? dateToTimeString(horario.fin) : '17:00',
    diaEntrega: dia?.nombre ?? 'LUNES',
    observaciones: domicilio.cliente.observaciones ?? undefined,
    activo: domicilio.cliente.activo,
  };
}

function formatReparto(reparto: {
  id: string;
  repartidorId: string;
  fecha: Date;
  estado: string;
  horaInicio: string | null;
  horaFin: string | null;
  pedidos: Array<{ estado: string }>;
}) {
  const totalPedidos = reparto.pedidos.length;
  const completados = reparto.pedidos.filter(
    (p) => p.estado !== 'PENDIENTE'
  ).length;
  const pendientes = totalPedidos - completados;

  return {
    id: reparto.id,
    repartidorId: reparto.repartidorId,
    fecha: fmtDate(reparto.fecha),
    estado: reparto.estado,
    horaInicio: reparto.horaInicio ?? undefined,
    horaFin: reparto.horaFin ?? undefined,
    resumen: {
      totalPedidos,
      completados,
      pendientes,
    },
  };
}

/** GET /repartos?repartidorId=&fecha=&estado= */
export async function listarRepartos(params: {
  repartidorId: string;
  fecha?: string;
  estado?: string;
}) {
  const where: Record<string, unknown> = {
    repartidorId: params.repartidorId,
  };

  if (params.fecha) {
    const date = new Date(params.fecha);
    where['fecha'] = date;
  }

  if (params.estado) {
    where['estado'] = params.estado;
  }

  const repartos = await prisma.reparto.findMany({
    where,
    include: {
      pedidos: { select: { estado: true } },
    },
    orderBy: { fecha: 'desc' },
  });

  return repartos.map(formatReparto);
}

/** GET /repartos/:id — con pedidos completos */
export async function obtenerReparto(id: string) {
  const reparto = await prisma.reparto.findUnique({
    where: { id },
    include: {
      pedidos: {
        include: {
          ...pedidoDomicilioInclude,
          items: { include: { item: true } },
        },
        orderBy: { orden: 'asc' },
      },
    },
  });

  if (!reparto) {
    throw ApiError.notFound('Reparto no encontrado');
  }

  const totalPedidos = reparto.pedidos.length;
  const completados = reparto.pedidos.filter((p) => p.estado !== 'PENDIENTE').length;
  const pendientes = totalPedidos - completados;

  return {
    id: reparto.id,
    repartidorId: reparto.repartidorId,
    fecha: fmtDate(reparto.fecha),
    estado: reparto.estado,
    horaInicio: reparto.horaInicio ?? undefined,
    horaFin: reparto.horaFin ?? undefined,
    resumen: { totalPedidos, completados, pendientes },
    pedidos: reparto.pedidos.map((p: any) => ({
      id: p.id,
      numeroPedido: p.numeroPedido,
      orden: p.orden,
      estado: p.estado,
      fecha: p.fecha.toISOString(),
      motivoFalla: p.motivoFalla ?? null,
      cliente: mapPedidoCliente(p.domicilio),
      items: p.items.map((pi: any) => ({
        id: pi.id,
        item: {
          id: pi.item.id,
          nombre: pi.item.nombre,
          descripcion: pi.item.descripcion ?? undefined,
          unidad: pi.item.unidad,
          activo: pi.item.activo,
        },
        cantidad: pi.cantidad,
        precioUnitario: pi.precioUnitario,
      })),
    })),
  };
}

/** GET /repartos/:id/carga */
export async function obtenerResumenCarga(repartoId: string) {
  const reparto = await prisma.reparto.findUnique({
    where: { id: repartoId },
    include: {
      pedidos: {
        include: {
          items: { include: { item: true } },
        },
      },
    },
  });

  if (!reparto) {
    throw ApiError.notFound('Reparto no encontrado');
  }

  // Agrupar items por producto
  const itemMap = new Map<string, { producto: string; cantidadTotal: number; unidad: string }>();

  for (const pedido of reparto.pedidos) {
    for (const pi of pedido.items) {
      const existing = itemMap.get(pi.item.id);
      if (existing) {
        existing.cantidadTotal += pi.cantidad;
      } else {
        itemMap.set(pi.item.id, {
          producto: pi.item.nombre,
          cantidadTotal: pi.cantidad,
          unidad: pi.item.unidad,
        });
      }
    }
  }

  return {
    repartoId: reparto.id,
    items: Array.from(itemMap.values()),
  };
}

/** GET /repartos/admin — Lista todos los repartos (admin) */
export async function listarRepartosAdmin(params?: { fecha?: string }) {
  const where: Record<string, unknown> = {};

  if (params?.fecha) {
    where['fecha'] = dateFromISODate(params.fecha);
  }

  const repartos = await prisma.reparto.findMany({
    where,
    include: {
      repartidor: { select: { id: true, nombre: true, apellido: true } },
      pedidos: { select: { estado: true } },
    },
    orderBy: { fecha: 'desc' },
  });

  return repartos.map((r) => ({
    id: r.id,
    fecha: fmtDate(r.fecha),
    estado: r.estado,
    horaInicio: r.horaInicio ?? undefined,
    horaFin: r.horaFin ?? undefined,
    repartidor: {
      id: r.repartidor.id,
      nombre: r.repartidor.nombre,
      apellido: r.repartidor.apellido,
    },
    pedidosCount: r.pedidos.length,
    resumen: {
      totalPedidos: r.pedidos.length,
      completados: r.pedidos.filter((p) => p.estado !== 'PENDIENTE').length,
      pendientes: r.pedidos.filter((p) => p.estado === 'PENDIENTE').length,
    },
  }));
}

/** GET /repartos/admin/:id — Detalle de reparto con repartidor y pedidos (admin) */
export async function obtenerRepartoAdmin(id: string) {
  const reparto = await prisma.reparto.findUnique({
    where: { id },
    include: {
      repartidor: { select: { id: true, nombre: true, apellido: true, email: true } },
      pedidos: {
        include: {
          ...pedidoDomicilioInclude,
          items: { include: { item: true } },
        },
        orderBy: { orden: 'asc' },
      },
    },
  });

  if (!reparto) {
    throw ApiError.notFound('Reparto no encontrado');
  }

  const totalPedidos = reparto.pedidos.length;
  const completados = reparto.pedidos.filter((p: any) => p.estado !== 'PENDIENTE').length;
  const pendientes = totalPedidos - completados;

  return {
    id: reparto.id,
    repartidorId: reparto.repartidorId,
    fecha: fmtDate(reparto.fecha),
    estado: reparto.estado,
    horaInicio: reparto.horaInicio ?? undefined,
    horaFin: reparto.horaFin ?? undefined,
    repartidor: {
      id: reparto.repartidor.id,
      nombre: reparto.repartidor.nombre,
      apellido: reparto.repartidor.apellido,
      email: reparto.repartidor.email,
    },
    resumen: { totalPedidos, completados, pendientes },
    pedidos: reparto.pedidos.map((p: any) => ({
      id: p.id,
      numeroPedido: p.numeroPedido,
      orden: p.orden,
      estado: p.estado,
      fecha: p.fecha.toISOString(),
      motivoFalla: p.motivoFalla ?? null,
      cliente: mapPedidoCliente(p.domicilio),
      items: p.items.map((pi: any) => ({
        id: pi.id,
        item: {
          id: pi.item.id,
          nombre: pi.item.nombre,
          descripcion: pi.item.descripcion ?? undefined,
          unidad: pi.item.unidad,
          activo: pi.item.activo,
        },
        cantidad: pi.cantidad,
        precioUnitario: pi.precioUnitario,
      })),
    })),
  };
}

/** GET /repartos/hoy — Reparto del día actual del repartidor autenticado */
export async function obtenerRepartoDelDia(repartidorId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reparto = await prisma.reparto.findFirst({
    where: { repartidorId, fecha: today },
    include: {
      pedidos: {
        include: {
          ...pedidoDomicilioInclude,
          items: { include: { item: true } },
        },
        orderBy: { orden: 'asc' },
      },
    },
  });

  if (!reparto) {
    return null;
  }

  const totalPedidos = reparto.pedidos.length;
  const completados = reparto.pedidos.filter(
    (p: any) => p.estado !== 'PENDIENTE'
  ).length;
  const pendientes = totalPedidos - completados;

  return {
    id: reparto.id,
    repartidorId: reparto.repartidorId,
    fecha: fmtDate(reparto.fecha),
    estado: reparto.estado,
    horaInicio: reparto.horaInicio ?? undefined,
    horaFin: reparto.horaFin ?? undefined,
    resumen: { totalPedidos, completados, pendientes },
    pedidos: reparto.pedidos.map((p: any) => ({
      id: p.id,
      numeroPedido: p.numeroPedido,
      orden: p.orden,
      estado: p.estado,
      fecha: p.fecha.toISOString(),
      motivoFalla: p.motivoFalla ?? null,
      cliente: mapPedidoCliente(p.domicilio),
      items: p.items.map((pi: any) => ({
        id: pi.id,
        item: {
          id: pi.item.id,
          nombre: pi.item.nombre,
          descripcion: pi.item.descripcion ?? undefined,
          unidad: pi.item.unidad,
          activo: pi.item.activo,
        },
        cantidad: pi.cantidad,
        precioUnitario: pi.precioUnitario,
      })),
    })),
  };
}

/** POST /repartos — Crear reparto (admin) */
export async function crearReparto(data: {
  repartidorId: string;
  fecha: string;
  pedidoIds: string[];
}) {
  const fechaDate = dateFromISODate(data.fecha);

  // 1. Validar repartidor existe y es REPARTIDOR
  const repartidor = await prisma.usuario.findUnique({ where: { id: data.repartidorId } });
  if (!repartidor) {
    throw ApiError.notFound('Repartidor no encontrado');
  }
  if (repartidor.rol !== 'REPARTIDOR') {
    throw ApiError.badRequest('El usuario seleccionado no es un repartidor');
  }

  // 2. Validar que el repartidor no tenga ya un reparto para esta fecha
  const repartoExistente = await prisma.reparto.findFirst({
    where: { repartidorId: data.repartidorId, fecha: fechaDate },
  });
  if (repartoExistente) {
    throw ApiError.conflict('El repartidor ya tiene un reparto asignado para esta fecha');
  }

  // 3. Validar pedidos
  const pedidos = await prisma.pedido.findMany({
    where: { id: { in: data.pedidoIds } },
    select: { id: true, estado: true, repartoId: true, fecha: true },
  });

  // Verificar que todos los IDs existen
  if (pedidos.length !== data.pedidoIds.length) {
    const existentes = new Set(pedidos.map((p) => p.id));
    const faltantes = data.pedidoIds.filter((id) => !existentes.has(id));
    throw ApiError.notFound(`Pedidos no encontrados: ${faltantes.join(', ')}`);
  }

  for (const pedido of pedidos) {
    if (pedido.estado !== 'PENDIENTE') {
      throw ApiError.conflict(`El pedido ${pedido.id} no está pendiente`);
    }
    if (pedido.repartoId) {
      throw ApiError.conflict(`El pedido ${pedido.id} ya está asignado a otro reparto`);
    }
    if (fmtDate(pedido.fecha) !== data.fecha.slice(0, 10)) {
      throw ApiError.badRequest(`El pedido ${pedido.id} tiene una fecha diferente al reparto`);
    }
  }

  // 4. Crear reparto
  const reparto = await prisma.reparto.create({
    data: {
      repartidorId: data.repartidorId,
      fecha: fechaDate,
      estado: 'PENDIENTE',
      pedidos: {
        connect: data.pedidoIds.map((id) => ({ id })),
      },
    },
    include: {
      pedidos: {
        include: {
          ...pedidoDomicilioInclude,
          items: { include: { item: true } },
        },
        orderBy: { orden: 'asc' },
      },
    },
  });

  const totalPedidos = reparto.pedidos.length;

  return {
    id: reparto.id,
    repartidorId: reparto.repartidorId,
    fecha: fmtDate(reparto.fecha),
    estado: reparto.estado,
    resumen: { totalPedidos, completados: 0, pendientes: totalPedidos },
    pedidos: reparto.pedidos.map((p: any) => ({
      id: p.id,
      numeroPedido: p.numeroPedido,
      orden: p.orden,
      estado: p.estado,
      fecha: p.fecha.toISOString(),
      cliente: mapPedidoCliente(p.domicilio),
      items: p.items.map((pi: any) => ({
        id: pi.id,
        item: {
          id: pi.item.id,
          nombre: pi.item.nombre,
          descripcion: pi.item.descripcion ?? undefined,
          unidad: pi.item.unidad,
          activo: pi.item.activo,
        },
        cantidad: pi.cantidad,
        precioUnitario: pi.precioUnitario,
      })),
    })),
  };
}

/** PATCH /repartos/:id/estado */
export async function actualizarEstado(repartoId: string, nuevoEstado: 'EN_CURSO' | 'COMPLETADO') {
  const reparto = await prisma.reparto.findUnique({
    where: { id: repartoId },
    include: { pedidos: { select: { estado: true } } },
  });

  if (!reparto) {
    throw ApiError.notFound('Reparto no encontrado');
  }

  // Validar transición de estados (no retroceder)
  if (reparto.estado === 'COMPLETADO') {
    throw ApiError.badRequest('Transición de estado inválida');
  }

  if (reparto.estado === 'EN_CURSO' && nuevoEstado === 'EN_CURSO') {
    throw ApiError.badRequest('El reparto ya está en curso');
  }

  // No se puede iniciar si ya hay otro EN_CURSO en la misma fecha
  if (nuevoEstado === 'EN_CURSO') {
    const activo = await prisma.reparto.findFirst({
      where: {
        repartidorId: reparto.repartidorId,
        estado: 'EN_CURSO',
        fecha: reparto.fecha,
        id: { not: repartoId },
      },
    });
    if (activo) {
      throw ApiError.conflict('Ya existe un reparto en curso para esta fecha');
    }
  }

  // No se puede completar si hay pedidos pendientes
  if (nuevoEstado === 'COMPLETADO') {
    const pendientes = reparto.pedidos.some((p) => p.estado === 'PENDIENTE');
    if (pendientes) {
      throw ApiError.badRequest('Existen entregas sin procesar en la ruta');
    }
  }

  const data: Record<string, string> = { estado: nuevoEstado };
  if (nuevoEstado === 'EN_CURSO') {
    data['horaInicio'] = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  if (nuevoEstado === 'COMPLETADO') {
    data['horaFin'] = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  const updated = await prisma.reparto.update({
    where: { id: repartoId },
    data,
  });

  return {
    id: updated.id,
    estado: updated.estado,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}

// =============================================================================
// ADMIN — Modificación de reparto (agregar/quitar pedidos)
// =============================================================================

/**
 * Valida que un reparto sea editable:
 * - Existe
 * - Está PENDIENTE (no iniciado, no finalizado)
 */
async function validarRepartoEditable(id: string) {
  const reparto = await prisma.reparto.findUnique({
    where: { id },
    include: { pedidos: { select: { id: true } } },
  });

  if (!reparto) {
    throw ApiError.notFound('Reparto no encontrado');
  }

  if (reparto.estado !== 'PENDIENTE') {
    if (reparto.estado === 'COMPLETADO') {
      throw ApiError.conflict('No se puede modificar un reparto finalizado');
    }
    throw ApiError.conflict('No se puede modificar un reparto en curso');
  }

  return reparto;
}

/** POST /repartos/admin/:repartoId/pedidos — Agregar pedido a reparto */
export async function agregarPedidoAReparto(repartoId: string, pedidoId: string) {
  const reparto = await validarRepartoEditable(repartoId);
  const fechaReparto = fmtDate(reparto.fecha);

  // Validar pedido existe
  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  // Validar pedido está pendiente
  if (pedido.estado !== 'PENDIENTE') {
    throw ApiError.conflict('Solo se pueden agregar pedidos en estado pendiente');
  }

  // Validar pedido no esté ya en otro reparto
  if (pedido.repartoId) {
    throw ApiError.conflict('El pedido ya está asignado a un reparto');
  }

  // Validar que la fecha del pedido coincida con la del reparto
  if (fmtDate(pedido.fecha) !== fechaReparto) {
    throw ApiError.badRequest('El pedido tiene una fecha diferente a la del reparto');
  }

  // Validar que el pedido no esté ya en este reparto
  const yaAsignado = reparto.pedidos.some((p) => p.id === pedidoId);
  if (yaAsignado) {
    throw ApiError.conflict('El pedido ya está asignado a este reparto');
  }

  // Asignar pedido al reparto
  await prisma.pedido.update({
    where: { id: pedidoId },
    data: { repartoId },
  });

  // Actualizar orden del pedido al final de la lista
  const maxOrden = reparto.pedidos.length > 0
    ? reparto.pedidos.length + 1
    : 1;

  await prisma.pedido.update({
    where: { id: pedidoId },
    data: { orden: maxOrden },
  });

  return {
    repartoId,
    pedidoId,
    accion: 'agregado',
  };
}

/** DELETE /repartos/admin/:repartoId/pedidos/:pedidoId — Quitar pedido de reparto */
export async function quitarPedidoDeReparto(repartoId: string, pedidoId: string) {
  await validarRepartoEditable(repartoId);

  // Validar pedido existe
  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  // Validar pedido pertenece a este reparto
  if (pedido.repartoId !== repartoId) {
    throw ApiError.conflict('El pedido no pertenece a este reparto');
  }

  // Validar pedido no esté en estado avanzado
  if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
    throw ApiError.conflict('Solo se pueden quitar pedidos pendientes o en ruta');
  }

  // Desvincular pedido del reparto
  await prisma.pedido.update({
    where: { id: pedidoId },
    data: { repartoId: null },
  });

  return {
    repartoId,
    pedidoId,
    accion: 'quitado',
  };
}
