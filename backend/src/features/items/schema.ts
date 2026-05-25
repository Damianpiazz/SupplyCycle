import { z } from 'zod';

export const itemSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  descripcion: z.string().optional(),
  unidad: z.string().min(1, 'La unidad es requerida'),
  activo: z.boolean().default(true),
});

export const pedidoItemSchema = z.object({
  itemId: z.string().uuid('El ID del ítem debe ser un UUID válido'),
  cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
});
