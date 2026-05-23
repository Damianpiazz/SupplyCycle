/**
 * Tipos compartidos del módulo de pedidos.
 * Siguen el dominio definido en el backend (Prisma enum).
 */

export type EstadoPedido = 'PENDIENTE' | 'ENTREGADO' | 'NO_ENTREGADO';

export type MotivoFalla =
  | 'CLIENTE_AUSENTE'
  | 'DIRECCION_INCORRECTA'
  | 'ACCESO_DENEGADO'
  | 'OTRO';

/** Mapping legible para mostrar en UI */
export const MOTIVOS_FALLA_LABELS: Record<MotivoFalla, string> = {
  CLIENTE_AUSENTE: 'Cliente ausente',
  DIRECCION_INCORRECTA: 'Dirección incorrecta',
  ACCESO_DENEGADO: 'Acceso denegado',
  OTRO: 'Otro',
};

/**
 * Props del componente PedidoStatusActions.
 * Los callbacks onConfirmar / onCancelar son contratos que debe proveer el padre.
 */
export interface PedidoStatusActionsProps {
  pedidoId: string;
  estadoActual: EstadoPedido;
  onConfirmar: (pedidoId: string) => Promise<void>;
  onCancelar: (pedidoId: string, motivo: MotivoFalla) => Promise<void>;
}

/**
 * Props del modal de selección de motivo de falla.
 */
export interface MotivoFallaModalProps {
  visible: boolean;
  pedidoId: string;
  onConfirmar: (pedidoId: string, motivo: MotivoFalla) => Promise<void>;
  onClose: () => void;
}
