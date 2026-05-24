import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';

function formatReparto(reparto: {
  id: string;
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
    fecha: reparto.fecha.toISOString(),
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
          cliente: true,
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
  const pedidosList = reparto.pedidos as Array<{
    id: string;
    orden: number;
    estado: string;
    fecha: Date;
    motivoFalla: string | null;
    cliente: {
      id: string;
      nombre: string;
      apellido: string;
      telefono: string;
      calle: string;
      numero: string;
      localidad: string;
      latitud: number;
      longitud: number;
      horarioDesde: string;
      horarioHasta: string;
    };
    items: Array<{
      cantidad: number;
      item: { id: string; nombre: string; descripcion: string | null; unidad: string; activo: boolean };
    }>;
  }>;

  const completados = pedidosList.filter((p) => p.estado !== 'PENDIENTE').length;
  const pendientes = totalPedidos - completados;

  return {
    id: reparto.id,
    repartidorId: reparto.repartidorId,
    fecha: reparto.fecha.toISOString(),
    estado: reparto.estado,
    horaInicio: reparto.horaInicio ?? undefined,
    horaFin: reparto.horaFin ?? undefined,
    resumen: { totalPedidos, completados, pendientes },
    pedidos: pedidosList.map((p) => ({
      id: p.id,
      orden: p.orden,
      estado: p.estado,
      fecha: p.fecha.toISOString(),
      motivoFalla: p.motivoFalla ?? undefined,
      cliente: {
        id: p.cliente.id,
        nombre: p.cliente.nombre,
        apellido: p.cliente.apellido,
        telefono: p.cliente.telefono,
        domicilio: {
          calle: p.cliente.calle,
          numero: p.cliente.numero,
          localidad: p.cliente.localidad,
          latitud: p.cliente.latitud,
          longitud: p.cliente.longitud,
        },
        horarioDesde: p.cliente.horarioDesde,
        horarioHasta: p.cliente.horarioHasta,
      },
      items: p.items.map((pi) => ({
        item: {
          id: pi.item.id,
          nombre: pi.item.nombre,
          descripcion: pi.item.descripcion ?? undefined,
          unidad: pi.item.unidad,
          activo: pi.item.activo,
        },
        cantidad: pi.cantidad,
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

  // No se puede iniciar si ya hay otro EN_CURSO
  if (nuevoEstado === 'EN_CURSO') {
    const activo = await prisma.reparto.findFirst({
      where: {
        repartidorId: reparto.repartidorId,
        estado: 'EN_CURSO',
        id: { not: repartoId },
      },
    });
    if (activo) {
      throw ApiError.conflict('Ya existe un reparto en curso para hoy');
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
