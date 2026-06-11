import type { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userEmail?: string;
    userNombre?: string;
    userRol?: 'ADMIN';
  }
}

export function requireAdminSession(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.session.userId || req.session.userRol !== 'ADMIN') {
    res.redirect('/admin/login');
    return;
  }
  next();
}
