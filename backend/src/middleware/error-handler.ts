import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../errors/AppError.js';

/**
 * Middleware global de manejo de errores.
 * Se encarga de formatear todos los errores a una respuesta JSON uniforme.
 *
 * - AppError → código y mensaje definidos por la aplicación
 * - ZodError → 422 con los detalles de validación
 * - Otros    → 500 genérico (en producción no se expone el stack)
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Errores de negocio tipados
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
      },
    });
    return;
  }

  // Errores de validación Zod
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error de validación en los datos enviados',
        statusCode: 422,
        details,
      },
    });
    return;
  }

  // Error desconocido
  const statusCode = 500;
  const message =
    process.env['NODE_ENV'] === 'production'
      ? 'Error interno del servidor'
      : err.message ?? 'Error interno del servidor';

  console.error('[ErrorHandler]', err);

  res.status(statusCode).json({
    error: {
      code: 'INTERNAL_ERROR',
      message,
      statusCode,
    },
  });
};
