import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';
import { calcularIntervaloPromedioDias, DEFAULT_FRECUENCIA_DIAS } from '../../lib/frecuencia.js';
import { esPedidoValidoParaDemanda } from '../../lib/pedido-utils.js';
import type {
  EstadisticasDiarias,
  EstadisticasMensuales,
  DemandaEstimada,
  DemandaProducto,
  ClienteDemandaResumen,
} from './types.js';

// ─── Constantes ──────────────────────────────────────────────────────────────

const ESTADOS_NO_ENTREGADOS = new Set(['NO_ENTREGADO', 'CANCELADO']);
const ESTADOS_REPARTO_INICIADO = new Set(['EN_CURSO', 'COMPLETADO']);

// ─── Estadísticas diarias ────────────────────────────────────────────────────

export async function obtenerEstadisticasDiarias(
  fecha: string
): Promise<EstadisticasDiarias> {
  // Usamos rango [00:00 — 23:59] del día en timezone local para coincidir
  // con cómo se almacenan las fechas en Pedido (DateTime) y Reparto (@db.Date).
  const [y, m, d] = fecha.split('-').map(Number);
  const startOfDay = new Date(y!, m! - 1, d!, 0, 0, 0, 0);
  const endOfDay = new Date(y!, m! - 1, d!, 23, 59, 59, 999);

  const [pedidos, itemsData, repartos] = await Promise.all([
    // 1. Pedidos del día (sin soft-delete)
    prisma.pedido.findMany({
      where: { fecha: { gte: startOfDay, lte: endOfDay }, deletedAt: null },
      select: { estado: true },
    }),

    // 2. Items de pedidos del día (volumen de productos)
    prisma.pedidoItem.findMany({
      where: { pedido: { fecha: { gte: startOfDay, lte: endOfDay }, deletedAt: null } },
      select: {
        cantidad: true,
        item: { select: { id: true, nombre: true, unidad: true } },
      },
    }),

    // 3. Repartos del día
    prisma.reparto.findMany({
      where: { fecha: { gte: startOfDay, lte: endOfDay } },
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

  // Rango del mes [00:00 día 1 — 23:59 último día]
  const primerDia = new Date(anio, mes - 1, 1, 0, 0, 0, 0);
  const ultimoDia = new Date(anio, mes, 0, 23, 59, 59, 999); // día 0 del mes siguiente = último día

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

// ─── RF-11: Estimar demanda ───────────────────────────────────────────────

type ClienteHistory = {
  id: string;
  nombre: string;
  apellido: string;
  pedidos: Array<{
    fecha: Date;
    estado: string;
    items: Array<{ itemId: string; cantidad: number }>;
  }>;
};

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export async function estimarDemanda(
  periodo: number,
  incluirClientes: boolean = false
): Promise<DemandaEstimada> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endDate = addDays(today, periodo);

  // 1. Obtener todos los clientes con al menos un pedido
  const clientes = await prisma.cliente.findMany({
    where: {
      activo: true,
      domicilios: {
        some: {
          pedidos: {
            some: { deletedAt: null },
          },
        },
      },
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      domicilios: {
        select: {
          pedidos: {
            where: { deletedAt: null },
            orderBy: { fecha: 'asc' },
            select: {
              fecha: true,
              estado: true,
              items: {
                select: {
                  itemId: true,
                  cantidad: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const clientesHistory: ClienteHistory[] = clientes.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    apellido: c.apellido,
    // Pedidos ya cargados: sin N+1. CANCELADO no cuenta para la frecuencia
    // ni para la demanda estimada (Fix B: helper compartido en lib/pedido-utils).
    pedidos: c.domicilios
      .flatMap((d) => d.pedidos)
      .filter(esPedidoValidoParaDemanda),
  }));

  // 2. Calcular demanda estimada por cliente
  const productoMap = new Map<
    string,
    { nombre: string; unidad: string; cantidades: number[]; clientCount: Set<string> }
  >();

  // Obtener nombres de items
  const items = await prisma.item.findMany({
    where: { activo: true },
    select: { id: true, nombre: true, unidad: true },
  });
  const itemInfo = new Map(items.map((i) => [i.id, { nombre: i.nombre, unidad: i.unidad }]));

  const clientesConEstimacion: ClienteDemandaResumen[] = [];
  // Frecuencias resueltas por cliente (real o fallback) para el promedio global
  const frecuencias: number[] = [];

  for (const cliente of clientesHistory) {
    if (cliente.pedidos.length === 0) continue;

    const pedidos = cliente.pedidos;
    const lastDate = pedidos[pedidos.length - 1]!.fecha;

    // RF-10: frecuencia real por cliente (sobre pedidos ya cargados);
    // fallback a 7 días cuando no hay intervalo (0-1 pedido completado)
    const frecuencia =
      calcularIntervaloPromedioDias(pedidos.map((p) => p.fecha)) ??
      DEFAULT_FRECUENCIA_DIAS;
    frecuencias.push(frecuencia);

    const nextDate = addDays(lastDate, frecuencia);

    if (nextDate > endDate) continue;

    const itemQtyMap = new Map<string, number[]>();
    for (const pedido of pedidos) {
      for (const item of pedido.items) {
        const arr = itemQtyMap.get(item.itemId);
        if (arr) {
          arr.push(item.cantidad);
        } else {
          itemQtyMap.set(item.itemId, [item.cantidad]);
        }
      }
    }

    let unidadesEstimadas = 0;
    for (const [itemId, cantidades] of itemQtyMap) {
      const avg = cantidades.reduce((a, b) => a + b, 0) / cantidades.length;
      const estimado = Math.round(avg);
      unidadesEstimadas += estimado;

      const info = itemInfo.get(itemId);
      if (info) {
        const existing = productoMap.get(itemId);
        if (existing) {
          existing.cantidades.push(estimado);
          existing.clientCount.add(cliente.id);
        } else {
          productoMap.set(itemId, {
            nombre: info.nombre,
            unidad: info.unidad,
            cantidades: [estimado],
            clientCount: new Set([cliente.id]),
          });
        }
      }
    }

    const proximoPedidoEstimado = nextDate > today
      ? toDateString(nextDate)
      : toDateString(addDays(today, frecuencia));

    clientesConEstimacion.push({
      clienteId: cliente.id,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      frecuenciaPromedioDias: frecuencia,
      proximoPedidoEstimado,
      unidadesEstimadas,
    });
  }

  // 3. Armar demanda por producto
  const demandaPorProducto: DemandaProducto[] = [];
  let demandaTotalUnidades = 0;

  for (const [itemId, data] of productoMap) {
    const totalEstimado = data.cantidades.reduce((a, b) => a + b, 0);
    demandaTotalUnidades += totalEstimado;
    demandaPorProducto.push({
      itemId,
      nombre: data.nombre,
      unidad: data.unidad,
      cantidadEstimada: totalEstimado,
      clientesEstimados: data.clientCount.size,
    });
  }

  demandaPorProducto.sort((a, b) => b.cantidadEstimada - a.cantidadEstimada);

  // 4. Armar respuesta
  return {
    periodo,
    fechaDesde: toDateString(today),
    fechaHasta: toDateString(endDate),
    totalClientes: clientesHistory.length,
    clientesConEstimacion: clientesConEstimacion.length,
    demandaPorProducto,
    demandaTotalUnidades,
    // Promedio global = media de las frecuencias por cliente (1 decimal);
    // sin clientes con historial → default
    frecuenciaPromedioGlobal:
      frecuencias.length > 0
        ? Math.round((frecuencias.reduce((a, b) => a + b, 0) / frecuencias.length) * 10) / 10
        : DEFAULT_FRECUENCIA_DIAS,
    ...(incluirClientes ? { clientes: clientesConEstimacion.sort((a, b) => b.unidadesEstimadas - a.unidadesEstimadas) } : {}),
  };
}
