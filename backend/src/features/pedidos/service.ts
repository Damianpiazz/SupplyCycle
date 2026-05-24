import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';

function formatPedido(pedido: {
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
    item: {
      id: string;
      nombre: string;
      descripcion: string | null;
      unidad: string;
      activo: boolean;
    };
  }>;
}) {
  return {
    id: pedido.id,
    orden: pedido.orden,
    estado: pedido.estado,
    fecha: pedido.fecha.toISOString(),
    motivoFalla: pedido.motivoFalla ?? undefined,
    cliente: {
      id: pedido.cliente.id,
      nombre: pedido.cliente.nombre,
      apellido: pedido.cliente.apellido,
      telefono: pedido.cliente.telefono,
      domicilio: {
        calle: pedido.cliente.calle,
        numero: pedido.cliente.numero,
        localidad: pedido.cliente.localidad,
        latitud: pedido.cliente.latitud,
        longitud: pedido.cliente.longitud,
      },
      horarioDesde: pedido.cliente.horarioDesde,
      horarioHasta: pedido.cliente.horarioHasta,
    },
    items: pedido.items.map((pi) => ({
      item: {
        id: pi.item.id,
        nombre: pi.item.nombre,
        descripcion: pi.item.descripcion ?? undefined,
        unidad: pi.item.unidad,
        activo: pi.item.activo,
      },
      cantidad: pi.cantidad,
    })),
  };
}

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
    },
    include: {
      cliente: true,
      items: { include: { item: true } },
    },
    orderBy: { orden: 'asc' },
  });

  return pedidos.map(formatPedido);
}

/** GET /pedidos/:id */
export async function obtenerPedido(id: string) {
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: {
      cliente: true,
      items: { include: { item: true } },
    },
  });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  return formatPedido(pedido);
}

/** GET /pedidos?clienteNombre=&estado= */
export async function listarPedidos(params?: {
  clienteNombre?: string;
  fecha?: string;
  estado?: string;
}) {
  const where: Record<string, unknown> = {};

  if (params?.estado) {
    where['estado'] = params.estado;
  }

  if (params?.clienteNombre) {
    where['OR'] = [
      { cliente: { nombre: { contains: params.clienteNombre, mode: 'insensitive' } } },
      { cliente: { apellido: { contains: params.clienteNombre, mode: 'insensitive' } } },
    ];
  }

  if (params?.fecha) {
    const date = new Date(params.fecha);
    where['fecha'] = date;
  }

  const [pedidos, total] = await Promise.all([
    prisma.pedido.findMany({
      where,
      include: {
        cliente: true,
        items: { include: { item: true } },
      },
      orderBy: { orden: 'asc' },
    }),
    prisma.pedido.count({ where }),
  ]);

  return {
    data: pedidos.map(formatPedido),
    total,
  };
}

/** PATCH /pedidos/:id/confirmar */
export async function confirmarEntrega(id: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.estado !== 'PENDIENTE') {
    throw ApiError.conflict('El pedido ya fue procesado');
  }

  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'ENTREGADO' },
  });

  return {
    id: updated.id,
    estado: 'ENTREGADO' as const,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}

/** PATCH /pedidos/:id/cancelar */
export async function cancelarPedido(id: string, motivo: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.estado !== 'PENDIENTE') {
    throw ApiError.conflict('El pedido ya fue procesado');
  }

  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'NO_ENTREGADO', motivoFalla: motivo },
  });

  return {
    id: updated.id,
    estado: 'NO_ENTREGADO' as const,
    motivoFalla: updated.motivoFalla!,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}

/** POST /pedidos */
export async function crearPedido(data: {
  clienteId: string;
  repartoId: string;
  fecha: string;
  orden: number;
  items: Array<{ itemId: string; cantidad: number }>;
}) {
  // Verificar que el cliente existe
  const cliente = await prisma.cliente.findUnique({ where: { id: data.clienteId } });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  // Verificar que el reparto existe
  const reparto = await prisma.reparto.findUnique({ where: { id: data.repartoId } });
  if (!reparto) {
    throw ApiError.notFound('Reparto no encontrado');
  }

  // Verificar que todos los items existen y están activos
  for (const item of data.items) {
    const dbItem = await prisma.item.findUnique({ where: { id: item.itemId } });
    if (!dbItem) {
      throw ApiError.badRequest(`El ítem ${item.itemId} no existe`);
    }
    if (!dbItem.activo) {
      throw ApiError.badRequest(`El ítem "${dbItem.nombre}" no está disponible`);
    }
  }

  // Verificar que no haya pedido duplicado para el mismo cliente en la misma fecha
  const fechaDate = new Date(data.fecha);
  const existente = await prisma.pedido.findFirst({
    where: { clienteId: data.clienteId, fecha: fechaDate },
  });
  if (existente) {
    throw ApiError.conflict('El cliente ya tiene un pedido para esa fecha');
  }

  const pedido = await prisma.pedido.create({
    data: {
      clienteId: data.clienteId,
      repartoId: data.repartoId,
      fecha: fechaDate,
      orden: data.orden,
      items: {
        create: data.items.map((i) => ({
          itemId: i.itemId,
          cantidad: i.cantidad,
        })),
      },
    },
    include: {
      cliente: true,
      items: { include: { item: true } },
    },
  });

  return {
    id: pedido.id,
    estado: 'PENDIENTE' as const,
    creadoEn: pedido.creadoEn.toISOString(),
  };
}
