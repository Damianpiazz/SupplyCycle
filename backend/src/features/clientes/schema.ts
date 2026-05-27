import { z } from 'zod';

const clienteBaseSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100),
  telefono: z.string().regex(/^\d{7,15}$/, 'El teléfono debe tener entre 7 y 15 dígitos'),
  calle: z.string().min(1, 'La calle es requerida'),
  numero: z.string().min(1, 'El número es requerido'),
  localidad: z.string().min(1, 'La localidad es requerida'),
  latitud: z.number().min(-90).max(90),
  longitud: z.number().min(-180).max(180),
  diaEntrega: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']),
  horarioDesde: z.string().regex(/^\d{2}:\d{2}$/),
  horarioHasta: z.string().regex(/^\d{2}:\d{2}$/),
  observaciones: z.string().optional(),
});

export const clienteSchema = clienteBaseSchema.refine(
  (data) => data.horarioDesde < data.horarioHasta,
  { message: 'horarioDesde debe ser anterior a horarioHasta', path: ['horarioDesde'] }
);

export const actualizarClienteSchema = clienteBaseSchema.partial().refine(
  (data) => {
    if (data.horarioDesde !== undefined && data.horarioHasta !== undefined) {
      return data.horarioDesde < data.horarioHasta;
    }
    return true;
  },
  { message: 'horarioDesde debe ser anterior a horarioHasta', path: ['horarioDesde'] }
);
