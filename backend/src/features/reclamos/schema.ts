import { z } from 'zod';

export const crearReclamoSchema = z.object({
  clienteId: z
    .string()
    .uuid('El ID del cliente debe ser un UUID válido'),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede superar los 500 caracteres'),
});

export const listarReclamosQuerySchema = z.object({
  clienteId: z
    .string()
    .uuid('El ID del cliente debe ser un UUID válido')
    .optional(),
  page: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().positive())
    .optional(),
  pageSize: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(1).max(100))
    .optional(),
});

