import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import * as estadisticasService from './service.js';
import { sendSuccess } from '../../utils/response.js';

// ─── Schemas de validación ───────────────────────────────────────────────────

const diariasSchema = z.object({
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
});

const mensualesSchema = z.object({
  anio: z
    .string()
    .regex(/^\d{4}$/, 'Formato de año inválido')
    .transform(Number),
  mes: z
    .string()
    .regex(/^\d{1,2}$/, 'Formato de mes inválido')
    .transform(Number),
});

// ─── Controller: estadísticas diarias ────────────────────────────────────────

export async function diariasController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { fecha } = diariasSchema.parse(req.query);
    const result = await estadisticasService.obtenerEstadisticasDiarias(fecha);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

// ─── Controller: estadísticas mensuales ───────────────────────────────────────

export async function mensualesController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { anio, mes } = mensualesSchema.parse(req.query);
    const result = await estadisticasService.obtenerEstadisticasMensuales(anio, mes);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
