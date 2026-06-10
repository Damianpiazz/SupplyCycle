import type { Request, Response, NextFunction } from 'express';
import { loginSchema, actualizarMeSchema } from './schema.js';
import { sendSuccess } from '../../utils/response.js';
import * as authService from './service.js';

/** POST /api/v1/auth/login — devuelve { token, usuario } */
export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

/** GET /api/v1/auth/me — devuelve el usuario directamente */
export async function meController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user!;
    const result = await authService.getMe(user.userId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/v1/auth/me — actualiza { nombre, apellido, email } */
export async function updateMeController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user!;
    const input = actualizarMeSchema.parse(req.body);
    const result = await authService.updateMe(user.userId, input);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
