import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';
import { dateFromISODate, fmtDate } from '../../utils/dates.js';
import type { Prisma } from '../../../generated/prisma/client.js';

// ─── Tipos ──────────────────────────────────────────────────────────────────

type PedidoConRelaciones = Prisma.PedidoGetPayload<{
  include: {
    domicilio: {
      include: {
        cliente: true;
        dias: { include: { horarios: true } };
      };
    };
    items: { include: { item: true } };
  };
}>;

type EstadoPedido = 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'NO_ENTREGADO' | 'CANCELADO';

// ─── Mapa de transiciones válidas ────────────────────────────────────────────

const TRANSICIONES: Record<EstadoPedido, EstadoPedido[]> = {
  PENDIENTE: ['EN_RUTA', 'NO_ENTREGADO', 'CANCELADO'],
  EN_RUTA: ['ENTREGADO', 'NO_ENTREGADO'],
  ENTREGADO: [],
  NO_ENTREGADO: [],
  CANCELADO: [],
};

function validarTransicion(actual: string, nuevo: string): void {
  const permitidos = TRANSICIONES[actual as EstadoPedido];
  if (!permitidos || !permitidos.includes(nuevo as EstadoPedido)) {
    throw ApiError.conflict(
      `No se puede cambiar el estado de "${actual}" a "${nuevo}"`
    );
  }
}

// ─── Format ──────────────────────────────────────────────────────────────────

function formatPedido(pedido: PedidoConRelaciones) {
  const total = pedido.items.reduce(
    (sum, pi) => sum + (pi.precioUnitario ?? 0) * pi.cantidad,
    0
  );

  const dom = pedido.domicilio;

  return {
    id: pedido.id,
    numeroPedido: pedido.numeroPedido,
    orden: pedido.orden,
    estado: pedido.estado,
    fecha: fmtDate(pedido.fecha),
    motivoFalla: pedido.motivoFalla ?? null,
    total,
    itemsCount: pedido.items.length,
    cliente: {
      id: dom.cliente.id,
      nombre: dom.cliente.nombre,
      apellido: dom.cliente.apellido,
      telefono: dom.cliente.telefono,
      observaciones: dom.cliente.observaciones ?? undefined,
      activo: dom.cliente.activo,
    },
    domicilio: {
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
          inicio: h.inicio.toISOString().slice(11, 16),
          fin: h.fin.toISOString().slice(11, 16),
        })),
      })),
    },
    items: pedido.items.map((pi) => ({
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
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** GET /pedidos/disponibles?fecha= — Pedidos PENDIENTE sin reparto asignado */
export async function obtenerPedidosDisponiblesParaReparto(fechaParam: string) {
  const fecha = dateFromISODate(fechaParam);

  const pedidos = await prisma.pedido.findMany({
    where: {
      fecha,
      estado: 'PENDIENTE',
      repartoId: null,
      deletedAt: null,
    },
    include: {
      domicilio: {
        include: {
          cliente: true,
          dias: { include: { horarios: true } },
        },
      },
      items: { include: { item: true } },
    },
    orderBy: { orden: 'asc' },
  });

  return pedidos.map(formatPedido);
}

async function findPedidoActivo(
  id: string
): Promise<PedidoConRelaciones> {
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: {
      domicilio: {
        include: {
          cliente: true,
          dias: { include: { horarios: true } },
        },
      },
      items: { include: { item: true } },
    },
  });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.deletedAt) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  return pedido;
}

// =============================================================================
// ENDPOINTS PÚBLICOS
// =============================================================================

/** GET /pedidos/hoy?repartidorId= */
export async function obtenerPedidosDelDia(repartidorId: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const pedidos = await prisma.pedido.findMany({
    where: {
      reparto: { repartidorId },
      fecha: { gte: startOfDay, lt: endOfDay },
      deletedAt: null,
    },
    include: {
      domicilio: {
        include: {
          cliente: true,
          dias: { include: { horarios: true } },
        },
      },
      items: { include: { item: true } },
    },
    orderBy: { orden: 'asc' },
  });

  return pedidos.map(formatPedido);
}

/** GET /pedidos/:id */
export async function obtenerPedido(id: string) {
  const pedido = await findPedidoActivo(id);
  return formatPedido(pedido);
}

/** GET /pedidos?clienteNombre=&estado=&page=&pageSize= */
export async function listarPedidos(params?: {
  clienteNombre?: string;
  fecha?: string;
  estado?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {
    deletedAt: null,
  };

  if (params?.estado) {
    where['estado'] = params.estado;
  }

  if (params?.clienteNombre) {
    where['OR'] = [
      { domicilio: { cliente: { nombre: { contains: params.clienteNombre, mode: 'insensitive' as const } } } },
      { domicilio: { cliente: { apellido: { contains: params.clienteNombre, mode: 'insensitive' as const } } } },
    ];
  }

  if (params?.fecha) {
    const date = dateFromISODate(params.fecha);
    where['fecha'] = date;
  }

  const [pedidos, total] = await Promise.all([
    prisma.pedido.findMany({
      where,
      include: {
        domicilio: {
          include: {
            cliente: true,
            dias: { include: { horarios: true } },
          },
        },
        items: { include: { item: true } },
      },
      orderBy: { fecha: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.pedido.count({ where }),
  ]);

  return {
    data: pedidos.map(formatPedido),
    total,
    page,
    pageSize,
  };
}

// =============================================================================
// AUTO-COMPLETAR REPARTO
// =============================================================================

/**
 * Si el pedido pertenece a un reparto y todos los pedidos del mismo están en
 * estados terminales (ENTREGADO, NO_ENTREGADO, CANCELADO), se completa
 * automáticamente el reparto con estado COMPLETADO y horaFin.
 */
async function autoCompletarRepartoSiCorresponde(pedidoId: string): Promise<void> {
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    select: { repartoId: true },
  });

  if (!pedido?.repartoId) return;

  const reparto = await prisma.reparto.findUnique({
    where: { id: pedido.repartoId },
    include: { pedidos: { select: { estado: true } } },
  });

  if (!reparto || reparto.estado === 'COMPLETADO') return;

  const estadosFinales = new Set(['ENTREGADO', 'NO_ENTREGADO', 'CANCELADO']);
  const todosFinales = reparto.pedidos.every((p) => estadosFinales.has(p.estado));

  if (todosFinales) {
    const horaFin = new Date().toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    await prisma.reparto.update({
      where: { id: pedido.repartoId },
      data: { estado: 'COMPLETADO', horaFin },
    });
  }
}

// =============================================================================
// MUTACIONES — Repartidor
// =============================================================================

/** PATCH /pedidos/:id/confirmar — PENDIENTE/EN_RUTA → ENTREGADO */
export async function confirmarEntrega(id: string, latitud?: number, longitud?: number) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
    throw ApiError.conflict('El pedido no puede ser entregado desde su estado actual');
  }

  // Si se recibió ubicación y el domicilio aún no tiene coordenadas, capturarlas
  if ((latitud !== undefined || longitud !== undefined) && pedido.domicilioId) {
    const domicilio = await prisma.domicilio.findUnique({
      where: { id: pedido.domicilioId },
      select: { latitud: true, longitud: true },
    });

    if (domicilio && (domicilio.latitud === null || domicilio.longitud === null)) {
      await prisma.domicilio.update({
        where: { id: pedido.domicilioId },
        data: {
          latitud: latitud ?? domicilio.latitud,
          longitud: longitud ?? domicilio.longitud,
        },
      });
    }
  }

  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'ENTREGADO' },
  });

  await autoCompletarRepartoSiCorresponde(id);

  return {
    id: updated.id,
    estado: 'ENTREGADO' as const,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}

/** PATCH /pedidos/:id/cancelar — PENDIENTE/EN_RUTA → NO_ENTREGADO (repartidor) */
export async function cancelarPedidoRepartidor(id: string, motivo: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
    throw ApiError.conflict('El pedido no puede marcarse como no entregado desde su estado actual');
  }

  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'NO_ENTREGADO', motivoFalla: motivo },
  });

  await autoCompletarRepartoSiCorresponde(id);

  return {
    id: updated.id,
    estado: 'NO_ENTREGADO' as const,
    motivoFalla: updated.motivoFalla!,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}

// =============================================================================
// MUTACIONES — Admin
// =============================================================================

/** POST /pedidos */
export async function crearPedido(data: {
  clienteId?: string;
  domicilioId?: string;
  fecha?: string;
  orden?: number;
  items: Array<{ itemId: string; cantidad: number }>;
}) {
  // Resolver domicilio: priorizar domicilioId explícito, fallback a principal del cliente
  let domicilio;
  if (data.domicilioId) {
    domicilio = await prisma.domicilio.findUnique({
      where: { id: data.domicilioId },
      include: { cliente: true },
    });
    if (!domicilio) {
      throw ApiError.notFound('Domicilio no encontrado');
    }
  } else if (data.clienteId) {
    domicilio = await prisma.domicilio.findFirst({
      where: { clienteId: data.clienteId, principal: true },
      include: { cliente: true },
    });
    if (!domicilio) {
      throw ApiError.notFound('Cliente no encontrado o sin domicilio principal');
    }
  } else {
    throw ApiError.badRequest('Debe proporcionar domicilioId o clienteId');
  }

  // Verificar items
  const itemsValidos: Array<{ id: string; nombre: string; precio: number | null }> = [];
  for (const item of data.items) {
    const dbItem = await prisma.item.findUnique({ where: { id: item.itemId } });
    if (!dbItem) {
      throw ApiError.badRequest(`El ítem ${item.itemId} no existe`);
    }
    if (!dbItem.activo) {
      throw ApiError.badRequest(`El ítem "${dbItem.nombre}" no está disponible`);
    }
    itemsValidos.push({ id: dbItem.id, nombre: dbItem.nombre, precio: dbItem.precio });
  }

  // Resolver fecha
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaDate = data.fecha ? dateFromISODate(data.fecha) : hoy;

  // Validar que la fecha no sea anterior a hoy
  if (fechaDate < hoy) {
    throw ApiError.badRequest('La fecha no puede ser anterior a hoy');
  }

  // Auto-asignar orden si no se provee
  let orden = data.orden;
  if (!orden) {
    const maxOrden = await prisma.pedido.aggregate({
      _max: { orden: true },
      where: { fecha: fechaDate },
    });
    orden = (maxOrden._max.orden ?? 0) + 1;
  }

  // Generar numeroPedido dentro de una transacción para evitar duplicados
  const pedido = await prisma.$transaction(async (tx) => {
    const count = await tx.pedido.count();
    const numeroPedido = 'PEDIDO #' + String(count + 1);

    return tx.pedido.create({
      data: {
        numeroPedido,
        domicilioId: domicilio.id,
        fecha: fechaDate,
        orden,
        items: {
          create: data.items.map((i) => {
            const itemInfo = itemsValidos.find((iv) => iv.id === i.itemId)!;
            return {
              itemId: i.itemId,
              cantidad: i.cantidad,
              precioUnitario: itemInfo.precio,
            };
          }),
        },
      },
      include: {
        domicilio: {
          include: {
            cliente: true,
            dias: { include: { horarios: true } },
          },
        },
        items: { include: { item: true } },
      },
    });
  });

  return formatPedido(pedido);
}

/** DELETE /pedidos/:id — Soft delete (admin) */
export async function eliminarPedido(id: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.estado === 'EN_RUTA' || pedido.estado === 'ENTREGADO') {
    throw ApiError.conflict('No se puede eliminar un pedido en reparto');
  }

  const updated = await prisma.pedido.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return {
    id: updated.id,
    deletedAt: updated.deletedAt!.toISOString(),
  };
}

/** PATCH /pedidos/:id/estado — Máquina de estados */
export async function actualizarEstado(id: string, nuevoEstado: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  validarTransicion(pedido.estado, nuevoEstado);

  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: nuevoEstado as EstadoPedido },
  });

  await autoCompletarRepartoSiCorresponde(id);

  return {
    id: updated.id,
    estado: updated.estado,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}

/** POST /pedidos/:id/cancelar — Admin: PENDIENTE → CANCELADO */
export async function cancelarPedido(id: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.estado !== 'PENDIENTE') {
    throw ApiError.conflict('Solo se pueden cancelar pedidos en estado pendiente');
  }

  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'CANCELADO' },
  });

  return {
    id: updated.id,
    estado: 'CANCELADO' as const,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}

// =============================================================================
// MUTACIONES — Items del pedido (admin)
// =============================================================================

/** POST /pedidos/:pedidoId/items */
export async function agregarItem(
  pedidoId: string,
  data: { itemId: string; cantidad: number }
) {
  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
    throw ApiError.conflict('Solo se pueden modificar pedidos en estado pendiente o en ruta');
  }

  const dbItem = await prisma.item.findUnique({ where: { id: data.itemId } });
  if (!dbItem) {
    throw ApiError.badRequest('El ítem no existe');
  }
  if (!dbItem.activo) {
    throw ApiError.badRequest(`El ítem "${dbItem.nombre}" no está disponible`);
  }

  const existente = await prisma.pedidoItem.findFirst({
    where: { pedidoId, itemId: data.itemId },
  });
  if (existente) {
    throw ApiError.conflict('El ítem ya existe en el pedido');
  }

  await prisma.pedidoItem.create({
    data: {
      pedidoId,
      itemId: data.itemId,
      cantidad: data.cantidad,
      precioUnitario: dbItem.precio,
    },
  });

  // Re-fetch con relaciones
  const updated = await findPedidoActivo(pedidoId);
  return formatPedido(updated);
}

/** PATCH /pedidos/:pedidoId/items/:itemId */
export async function actualizarCantidadItem(
  pedidoId: string,
  itemId: string,
  cantidad: number
) {
  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
    throw ApiError.conflict('Solo se pueden modificar pedidos en estado pendiente o en ruta');
  }

  const pedidoItem = await prisma.pedidoItem.findFirst({
    where: { id: itemId, pedidoId },
  });
  if (!pedidoItem) {
    throw ApiError.notFound('El ítem no existe en el pedido');
  }

  await prisma.pedidoItem.update({
    where: { id: itemId },
    data: { cantidad },
  });

  const updated = await findPedidoActivo(pedidoId);
  return formatPedido(updated);
}

/** DELETE /pedidos/:pedidoId/items/:itemId */
export async function quitarItem(pedidoId: string, itemId: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
    throw ApiError.conflict('Solo se pueden modificar pedidos en estado pendiente o en ruta');
  }

  const pedidoItem = await prisma.pedidoItem.findFirst({
    where: { id: itemId, pedidoId },
  });
  if (!pedidoItem) {
    throw ApiError.notFound('El ítem no existe en el pedido');
  }

  const itemsCount = await prisma.pedidoItem.count({ where: { pedidoId } });
  if (itemsCount <= 1) {
    throw ApiError.conflict('El pedido debe tener al menos un item');
  }

  await prisma.pedidoItem.delete({ where: { id: itemId } });

  const updated = await findPedidoActivo(pedidoId);
  return formatPedido(updated);
}
