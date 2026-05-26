import { useMemo } from 'react';
import { useRepartoAdminDetalle } from '@/features/repartos/hooks/useRepartoAdmin';
import type { Pedido, EstadoPedido } from '@/types';

const ORDER_PRIORITY: Record<EstadoPedido, number> = {
  EN_RUTA: 0,
  PENDIENTE: 1,
  ENTREGADO: 2,
  NO_ENTREGADO: 3,
  CANCELADO: 4,
};

const ESTADO_LABELS: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendientes',
  EN_RUTA: 'En ruta',
  ENTREGADO: 'Entregados',
  NO_ENTREGADO: 'No entregados',
  CANCELADO: 'Cancelados',
};

const GROUP_ORDER: EstadoPedido[] = ['EN_RUTA', 'PENDIENTE', 'ENTREGADO', 'NO_ENTREGADO', 'CANCELADO'];

export interface GrupoPedidos {
  estado: EstadoPedido;
  label: string;
  pedidos: Pedido[];
  count: number;
}

export interface RepartoDetalleProcesado {
  id: string;
  fecha: string;
  estado: string;
  horaInicio?: string;
  horaFin?: string;
  repartidor: { id: string; nombre: string; apellido: string; email: string };
  metricas: {
    totalPedidos: number;
    entregados: number;
    enRuta: number;
    pendientes: number;
    fallidos: number;
  };
  progreso: {
    entregados: number;
    total: number;
    porcentaje: number;
  };
  resumenOperativo: {
    totalClientes: number;
    totalItems: number;
  };
  grupos: GrupoPedidos[];
  esFechaPasada: boolean;
}

/** Check if a YYYY-MM-DD date is before today (timezone-safe) */
function esFechaPasada(iso: string): boolean {
  const { year, month, day } = parseDateParts(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const fecha = new Date(Number(year), Number(month) - 1, Number(day));
  return fecha < today;
}

function parseDateParts(iso: string): { year: string; month: string; day: string } {
  const [datePart] = iso.split('T');
  const [year, month, day] = datePart.split('-');
  return { year, month, day };
}

export function useRepartoAdminDetalleData(id: string) {
  const query = useRepartoAdminDetalle(id);

  const data = useMemo<RepartoDetalleProcesado | null>(() => {
    const reparto = query.data;
    if (!reparto) return null;

    const pedidos = reparto.pedidos ?? [];

    // Metrics
    const entregados = pedidos.filter((p) => p.estado === 'ENTREGADO').length;
    const enRuta = pedidos.filter((p) => p.estado === 'EN_RUTA').length;
    const pendientes = pedidos.filter((p) => p.estado === 'PENDIENTE').length;
    const fallidos = pedidos.filter(
      (p) => p.estado === 'NO_ENTREGADO' || p.estado === 'CANCELADO'
    ).length;
    const totalPedidos = pedidos.length;

    // Progress (only ENTREGADO counts)
    const porcentaje = totalPedidos > 0 ? Math.round((entregados / totalPedidos) * 100) : 0;

    // Operational summary
    const clientesUnicos = new Set(pedidos.map((p) => p.cliente.id));
    const totalItems = pedidos.reduce(
      (sum, p) => sum + p.items.reduce((s, i) => s + i.cantidad, 0),
      0
    );

    // Group and sort pedidos
    const grupos: GrupoPedidos[] = GROUP_ORDER.map((estado) => ({
      estado,
      label: ESTADO_LABELS[estado],
      pedidos: pedidos
        .filter((p) => p.estado === estado)
        .sort((a, b) => a.orden - b.orden),
      count: 0,
    })).filter((g) => g.pedidos.length > 0);
    grupos.forEach((g) => {
      g.count = g.pedidos.length;
    });

    return {
      id: reparto.id,
      fecha: reparto.fecha,
      estado: reparto.estado,
      horaInicio: reparto.horaInicio,
      horaFin: reparto.horaFin,
      repartidor: reparto.repartidor,
      metricas: { totalPedidos, entregados, enRuta, pendientes, fallidos },
      progreso: { entregados, total: totalPedidos, porcentaje },
      resumenOperativo: { totalClientes: clientesUnicos.size, totalItems },
      grupos,
      esFechaPasada: esFechaPasada(reparto.fecha),
    };
  }, [query.data]);

  return { ...query, data };
}
