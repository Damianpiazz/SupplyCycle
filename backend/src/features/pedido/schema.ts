import { z } from 'zod';

/**
 * Schema base para validar UUID en parámetros de ruta.
 */
export const uuidParamSchema = z.object({
  id: z.string().uuid('El ID del pedido debe ser un UUID válido'),
});

/**
 * Schema para validar el body de cancelar pedido.
 */
export const cancelarPedidoSchema = z.object({
  motivo: z.enum([
    'CLIENTE_AUSENTE',
    'DIRECCION_INCORRECTA',
    'ACCESO_DENEGADO',
    'OTRO',
  ] as const),
});

/** Tipo inferido del schema de cancelación */
export type CancelarPedidoInput = z.infer<typeof cancelarPedidoSchema>;
