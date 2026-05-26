import { z } from 'zod';

export const crearUsuarioSchema = z.object({
  email: z.string().email('El email no tiene un formato válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
    .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100),
  rol: z.enum(['REPARTIDOR', 'ADMIN']).default('REPARTIDOR'),
});

export const actualizarUsuarioSchema = z
  .object({
    email: z.string().email('El email no tiene un formato válido').optional(),
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100).optional(),
    apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100).optional(),
    rol: z.enum(['REPARTIDOR', 'ADMIN']).optional(),
    activo: z.literal(true).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo a actualizar',
  });
