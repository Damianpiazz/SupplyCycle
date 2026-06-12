import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

export type AllowedRole = 'REPARTIDOR' | 'ADMIN' | 'BOT';

export interface JwtPayload {
  userId: string;
  email: string;
  rol: AllowedRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (req.user) return next();

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token no proporcionado');
    }

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(ApiError.unauthorized('Token expirado'));
      return;
    }
    if (err instanceof ApiError) {
      next(err);
      return;
    }
    next(ApiError.unauthorized('Token inválido'));
  }
}

/** Middleware que verifica que el usuario tenga uno de los roles indicados.
 *  Debe usarse después de `authenticate`. */
export function requireRole(...roles: AllowedRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('No autenticado');
      }
      if (!roles.includes(req.user.rol)) {
        throw ApiError.forbidden('No tiene permisos para esta acción');
      }
      next();
    } catch (err) {
      next(err as ApiError);
    }
  };
}
