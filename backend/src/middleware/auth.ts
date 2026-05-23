import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { AppError } from '../errors/AppError.js';

/**
 * Middleware de autenticación JWT.
 * Valida el token del header Authorization: Bearer <token>
 * y adjunta el payload decodificado a `req.user`.
 */
export const authenticate: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Token de autenticación requerido');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new AppError(401, 'Token de autenticación requerido');
  }

  const secret = process.env['JWT_SECRET'];
  if (!secret) {
    throw new AppError(500, 'JWT_SECRET no configurado');
  }

  try {
    const payload = jwt.verify(token, secret);
    (req as unknown as Record<string, unknown>).user = payload;
    next();
  } catch {
    throw new AppError(401, 'Token inválido o expirado');
  }
};
