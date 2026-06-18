import { z } from 'zod';

const horarioFields = {
  inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  fin: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
};

export const horarioSchema = z.object(horarioFields).refine(
  (h) => h.inicio < h.fin,
  { message: 'inicio debe ser anterior a fin', path: ['inicio'] }
);

export const diaSchema = z.object({
  nombre: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']),
  horarios: z.array(horarioSchema).min(1, 'Cada día debe tener al menos un horario'),
});

export const domicilioSchema = z.object({
  clienteId: z.string().uuid(),
  calle: z.string().min(1, 'La calle es requerida'),
  numero: z.string().min(1, 'El número es requerido'),
  localidad: z.string().min(1, 'La localidad es requerida'),
  latitud: z.number().min(-90).max(90).optional(),
  longitud: z.number().min(-180).max(180).optional(),
  principal: z.boolean().optional().default(true),
  dias: z.array(diaSchema).min(1, 'Cada domicilio debe tener al menos un día'),
});

export const actualizarDomicilioSchema = z.object({
  clienteId: z.string().uuid().optional(),
  calle: z.string().min(1).optional(),
  numero: z.string().min(1).optional(),
  localidad: z.string().min(1).optional(),
  latitud: z.number().min(-90).max(90).optional(),
  longitud: z.number().min(-180).max(180).optional(),
  principal: z.boolean().optional(),
  dias: z.array(diaSchema).min(1).optional(),
});

export const crearDiaSchema = z.object({
  nombre: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']),
  horarios: z.array(horarioSchema).min(1, 'Cada día debe tener al menos un horario'),
});

export const actualizarDiaSchema = z.object({
  nombre: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']).optional(),
  horarios: z.array(horarioSchema).min(1).optional(),
});

export const crearHorarioSchema = horarioSchema;

export const actualizarHorarioSchema = z.object(horarioFields).partial();
