/**
 * Helpers compartidos para color y label de estados de pedido y reparto.
 * Centraliza las funciones duplicadas en 6 archivos.
 */
import type { EstadoPedido, EstadoReparto } from '@/types';
import type { Colors as ColorsType } from '@/constants/theme';

type Theme = (typeof ColorsType)['light'];

// ─── EstadoPedido ──────────────────────────────────────────────────────────────

export function getEstadoColor(estado: EstadoPedido | string, theme: Theme): string {
  switch (estado) {
    case 'PENDIENTE':
      return theme.pendiente;
    case 'EN_RUTA':
      return theme.tint;
    case 'ENTREGADO':
      return theme.entregado;
    case 'NO_ENTREGADO':
      return theme.noEntregado;
    case 'CANCELADO':
      return theme.muted;
    default:
      return theme.text;
  }
}

export function getEstadoLabel(estado: EstadoPedido | string): string {
  switch (estado) {
    case 'PENDIENTE':
      return 'Pendiente';
    case 'EN_RUTA':
      return 'En ruta';
    case 'ENTREGADO':
      return 'Entregado';
    case 'NO_ENTREGADO':
      return 'No entregado';
    case 'CANCELADO':
      return 'Cancelado';
    default:
      return estado;
  }
}

// ─── EstadoReparto ─────────────────────────────────────────────────────────────

export function getEstadoColorReparto(estado: EstadoReparto | string, theme: Theme): string {
  switch (estado) {
    case 'PENDIENTE':
      return theme.pendiente;
    case 'EN_CURSO':
      return theme.enCurso;
    case 'COMPLETADO':
      return theme.completado;
    default:
      return theme.text;
  }
}

export function getEstadoLabelReparto(estado: EstadoReparto | string): string {
  switch (estado) {
    case 'PENDIENTE':
      return 'Pendiente';
    case 'EN_CURSO':
      return 'En curso';
    case 'COMPLETADO':
      return 'Completado';
    default:
      return estado;
  }
}
