import { z } from 'zod';

export const crearPedidoSchema = z.object({
  clienteId: z.string().uuid(),
  repartoId: z.string().uuid().optional(),
  fecha: z.string().datetime().optional(),
  orden: z.number().int().min(1).optional(),
  items: z
    .array(
      z.object({
        itemId: z.string().uuid(),
        cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
      })
    )
    .min(1, 'El pedido debe tener al menos un ítem'),
});

export const actualizarEstadoSchema = z.object({
  estado: z.enum(['EN_RUTA', 'ENTREGADO', 'NO_ENTREGADO', 'CANCELADO']),
});

export const agregarItemSchema = z.object({
  itemId: z.string().uuid(),
  cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
});

export const actualizarCantidadSchema = z.object({
  cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
});

export const cancelarPedidoSchema = z.object({
  motivo: z.enum([
    'CLIENTE_AUSENTE',
    'DIRECCION_INCORRECTA',
    'ACCESO_DENEGADO',
    'OTRO',
  ]),
});
