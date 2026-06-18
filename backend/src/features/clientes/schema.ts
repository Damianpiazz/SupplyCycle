import { z } from 'zod';

const horarioFields = {
  inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  fin: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
};

const horarioSchema = z.object(horarioFields).refine(
  (h) => h.inicio < h.fin,
  { message: 'inicio debe ser anterior a fin', path: ['inicio'] }
);

const diaSchema = z.object({
  nombre: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']),
  horarios: z.array(horarioSchema).min(1, 'Cada día debe tener al menos un horario'),
});

const domicilioFields = {
  calle: z.string().min(1, 'La calle es requerida'),
  numero: z.string().min(1, 'El número es requerido'),
  localidad: z.string().min(1, 'La localidad es requerida'),
  latitud: z.number().min(-90).max(90).optional(),
  longitud: z.number().min(-180).max(180).optional(),
  principal: z.boolean().optional().default(true),
  dias: z.array(diaSchema).min(1, 'Cada domicilio debe tener al menos un día'),
};

const domicilioSchema = z.object(domicilioFields);

export const clienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100),
  telefono: z.string().regex(/^\d{7,15}$/, 'El teléfono debe tener entre 7 y 15 dígitos'),
  observaciones: z.string().optional(),
  domicilios: z.array(domicilioSchema).min(1, 'Debe tener al menos un domicilio'),
});

export const actualizarClienteSchema = z.object({
  nombre: z.string().min(2).max(100).optional(),
  apellido: z.string().min(2).max(100).optional(),
  telefono: z.string().regex(/^\d{7,15}$/).optional(),
  observaciones: z.string().optional(),
  domicilios: z.array(domicilioSchema).min(1).optional(),
});

export const crearDomicilioSchema = domicilioSchema;

export const actualizarDomicilioSchema = z.object({
  calle: z.string().min(1).optional(),
  numero: z.string().min(1).optional(),
  localidad: z.string().min(1).optional(),
  latitud: z.number().min(-90).max(90).optional(),
  longitud: z.number().min(-180).max(180).optional(),
  principal: z.boolean().optional(),
  dias: z.array(diaSchema).min(1).optional(),
});

export const crearDiaSchema = diaSchema;

export const actualizarDiaSchema = z.object({
  nombre: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']).optional(),
  horarios: z.array(horarioSchema).min(1).optional(),
});

export const crearHorarioSchema = horarioSchema;

export const actualizarHorarioSchema = z.object(horarioFields).partial();
