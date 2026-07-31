import { z } from 'zod/v4';

export const demandaQuerySchema = z.object({
  periodo: z
    .string()
    .regex(/^\d+$/, 'Periodo debe ser un número entero positivo')
    .default('30')
    .transform(Number)
    .refine((val) => val > 0 && val <= 365, {
      message: 'Periodo debe estar entre 1 y 365 días',
    }),
  incluirClientes: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true'),
});
