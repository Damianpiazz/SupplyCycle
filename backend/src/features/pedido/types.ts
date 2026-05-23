/**
 * Tipos del módulo de pedidos.
 * Se alinean con los enums de Prisma y los tipos del frontend mobile.
 */

/** Estados posibles de un pedido */
export type EstadoPedido = 'PENDIENTE' | 'ENTREGADO' | 'NO_ENTREGADO';

/** Motivos válidos para una falla de entrega */
export type MotivoFalla =
  | 'CLIENTE_AUSENTE'
  | 'DIRECCION_INCORRECTA'
  | 'ACCESO_DENEGADO'
  | 'OTRO';

/** Lista de motivos válidos para validación en runtime */
export const MOTIVOS_FALLA_VALIDOS: MotivoFalla[] = [
  'CLIENTE_AUSENTE',
  'DIRECCION_INCORRECTA',
  'ACCESO_DENEGADO',
  'OTRO',
];
