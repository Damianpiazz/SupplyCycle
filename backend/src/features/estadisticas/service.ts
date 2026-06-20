import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';
import { dateFromISODate } from '../../utils/dates.js';
import type { EstadisticasDiarias, EstadisticasMensuales } from './types.js';

// ─── Constantes ──────────────────────────────────────────────────────────────

const ESTADOS_NO_ENTREGADOS = new Set(['NO_ENTREGADO', 'CANCELADO']);
const ESTADOS_REPARTO_INICIADO = new Set(['EN_CURSO', 'COMPLETADO']);

// ─── Estadísticas diarias ────────────────────────────────────────────────────

export async function obtenerEstadisticasDiarias(
  fecha: string
): Promise<EstadisticasDiarias> {
  const fechaDate = dateFromISODate(fecha);

  const [pedidos, itemsData, repartos] = await Promise.all([
    // 1. Pedidos del día (sin soft-delete)
    prisma.pedido.findMany({
      where: { fecha: fechaDate, deletedAt: null },
      select: { estado: true },
    }),

    // 2. Items de pedidos del día (volumen de productos)
    prisma.pedidoItem.findMany({
      where: { pedido: { fecha: fechaDate, deletedAt: null } },
      select: {
        cantidad: true,
        item: { select: { id: true, nombre: true, unidad: true } },
      },
    }),

    // 3. Repartos del día
    prisma.reparto.findMany({
      where: { fecha: fechaDate },
      select: { estado: true },
    }),
  ]);

  // ── Procesar pedidos ─────────────────────────────────────────────────
  const totalPedidos = pedidos.length;
  const entregasRealizadas = pedidos.filter(
    (p) => p.estado === 'ENTREGADO'
  ).length;
  const entregasNoRealizadas = pedidos.filter((p) =>
    ESTADOS_NO_ENTREGADOS.has(p.estado)
  ).length;

  // ── Procesar volumen de productos ────────────────────────────────────
  const itemMap = new Map<
    string,
    { itemId: string; nombre: string; unidad: string; cantidadTotal: number }
  >();

  for (const pi of itemsData) {
    const existing = itemMap.get(pi.item.id);
    if (existing) {
      existing.cantidadTotal += pi.cantidad;
    } else {
      itemMap.set(pi.item.id, {
        itemId: pi.item.id,
        nombre: pi.item.nombre,
        unidad: pi.item.unidad,
        cantidadTotal: pi.cantidad,
      });
    }
  }

  // ── Procesar repartos ────────────────────────────────────────────────
  const totalRepartos = repartos.length;
  const iniciados = repartos.filter((r) =>
    ESTADOS_REPARTO_INICIADO.has(r.estado)
  ).length;
  const finalizados = repartos.filter((r) => r.estado === 'COMPLETADO').length;

  return {
    fecha,
    totalPedidos,
    entregasRealizadas,
    entregasNoRealizadas,
    volumenProductos: Array.from(itemMap.values()),
    desempenioRepartos: {
      total: totalRepartos,
      iniciados,
      finalizados,
    },
  };
}

// ─── Estadísticas mensuales ───────────────────────────────────────────────────

export async function obtenerEstadisticasMensuales(
  anio: number,
  mes: number
): Promise<EstadisticasMensuales> {
  if (mes < 1 || mes > 12) {
    throw ApiError.badRequest('El mes debe estar entre 1 y 12');
  }

  // Rango del mes (usamos mediodía UTC para evitar problemas de zona horaria)
  const primerDia = new Date(anio, mes - 1, 1, 12, 0, 0);
  const ultimoDia = new Date(anio, mes, 0, 12, 0, 0); // día 0 del mes siguiente = último día

  const [pedidos, repartos] = await Promise.all([
    prisma.pedido.findMany({
      where: {
        fecha: { gte: primerDia, lte: ultimoDia },
        deletedAt: null,
      },
      select: { fecha: true, estado: true },
    }),

    prisma.reparto.findMany({
      where: { fecha: { gte: primerDia, lte: ultimoDia } },
      select: { fecha: true, estado: true },
    }),
  ]);

  // ── Inicializar mapa por día ──────────────────────────────────────────
  const daysInMonth = ultimoDia.getDate();
  const dayMap = new Map<
    number,
    { totalPedidos: number; entregas: number; noEntregadas: number }
  >();

  for (let d = 1; d <= daysInMonth; d++) {
    dayMap.set(d, { totalPedidos: 0, entregas: 0, noEntregadas: 0 });
  }

  // ── Agregar pedidos por día ──────────────────────────────────────────
  for (const p of pedidos) {
    const day = p.fecha.getDate();
    const entry = dayMap.get(day);
    if (entry) {
      entry.totalPedidos++;
      if (p.estado === 'ENTREGADO') entry.entregas++;
      if (ESTADOS_NO_ENTREGADOS.has(p.estado)) entry.noEntregadas++;
    }
  }

  // ── Agregar repartos ──────────────────────────────────────────────────
  const totalRepartosIniciados = repartos.filter((r) =>
    ESTADOS_REPARTO_INICIADO.has(r.estado)
  ).length;
  const totalRepartosFinalizados = repartos.filter(
    (r) => r.estado === 'COMPLETADO'
  ).length;

  // ── Armar respuesta ──────────────────────────────────────────────────
  let totalPedidosGlobal = 0;
  let totalEntregas = 0;
  let totalNoEntregadas = 0;

  const dias = Array.from(dayMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([dia, stats]) => {
      totalPedidosGlobal += stats.totalPedidos;
      totalEntregas += stats.entregas;
      totalNoEntregadas += stats.noEntregadas;

      return {
        dia,
        totalPedidos: stats.totalPedidos,
        entregasRealizadas: stats.entregas,
        entregasNoRealizadas: stats.noEntregadas,
      };
    });

  return {
    anio,
    mes,
    totalPedidos: totalPedidosGlobal,
    entregasRealizadas: totalEntregas,
    entregasNoRealizadas: totalNoEntregadas,
    totalRepartosIniciados,
    totalRepartosFinalizados,
    dias,
  };
}
