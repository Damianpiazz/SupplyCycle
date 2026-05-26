import { z } from 'zod';

export const crearRepartoSchema = z.object({
  repartidorId: z.string().uuid(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)'),
  pedidoIds: z
    .array(z.string().uuid())
    .min(1, 'El reparto debe tener al menos un pedido'),
});

export const actualizarEstadoSchema = z.object({
  estado: z.enum(['EN_CURSO', 'COMPLETADO']),
});

export const agregarPedidoRepartoSchema = z.object({
  pedidoId: z.string().uuid(),
});
