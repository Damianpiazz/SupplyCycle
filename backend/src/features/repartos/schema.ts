import { z } from 'zod';

export const crearRepartoSchema = z.object({
  repartidorId: z.string().uuid(),
  fecha: z.string().datetime(),
  pedidoIds: z
    .array(z.string().uuid())
    .min(1, 'El reparto debe tener al menos un pedido'),
});

export const actualizarEstadoSchema = z.object({
  estado: z.enum(['EN_CURSO', 'COMPLETADO']),
});
