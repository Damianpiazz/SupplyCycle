import { z } from 'zod';

export const itemSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  descripcion: z.string().optional(),
  unidad: z.string().min(1, 'La unidad es requerida'),
  precio: z.number().optional(),
  activo: z.boolean().default(true),
  retornable: z.boolean().default(false),
});

/**
 * Schemas de creación/actualización (SPEC-03). actualizarItemSchema se define
 * como objeto explícito con campos opcionales (NO itemSchema.partial()): en
 * Zod 4, .partial() conserva los .default() de los campos ausentes, lo que
 * forzaría activo/retornable en cada PATCH (semántica rota). Misma convención
 * que actualizarClienteSchema.
 */
export const crearItemSchema = itemSchema;

export const actualizarItemSchema = z
  .object({
    nombre: z.string().min(2).max(100).optional(),
    descripcion: z.string().optional(),
    unidad: z.string().min(1).optional(),
    precio: z.number().optional(),
    activo: z.boolean().optional(),
    retornable: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    // Gate fix C: an all-optional schema would let PATCH {} through and run
    // prisma.item.update with data:{} (undefined behavior). Reject empty.
    message: 'El cuerpo del PATCH no puede estar vacío',
  });

export const pedidoItemSchema = z.object({
  itemId: z.string().uuid('El ID del ítem debe ser un UUID válido'),
  cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
});
