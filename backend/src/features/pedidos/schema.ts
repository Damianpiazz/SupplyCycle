import { z } from 'zod';

export const crearPedidoSchema = z.object({
  clienteId: z.string().uuid(),
  repartoId: z.string().uuid(),
  fecha: z.string().datetime(),
  orden: z.number().int().min(1, 'El orden debe ser mayor a 0'),
  items: z
    .array(
      z.object({
        itemId: z.string().uuid(),
        cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
      })
    )
    .min(1, 'El pedido debe tener al menos un ítem'),
});

export const cancelarPedidoSchema = z.object({
  motivo: z.enum([
    'CLIENTE_AUSENTE',
    'DIRECCION_INCORRECTA',
    'ACCESO_DENEGADO',
    'OTRO',
  ]),
});
