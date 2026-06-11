import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../lib/logger.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join('.');
      if (!details[path]) details[path] = [];
      details[path]!.push(issue.message);
    }
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error de validación',
        timestamp: new Date().toISOString(),
        details,
      },
    });
    return;
  }

  // Known API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        timestamp: new Date().toISOString(),
        details: err.details,
      },
    });
    return;
  }

  // Unexpected errors
  logger.error({ err, path: _req.path }, 'Unhandled error');
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
      timestamp: new Date().toISOString(),
    },
  });
}
