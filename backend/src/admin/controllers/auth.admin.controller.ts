import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcrypt';

export function showLogin(_req: Request, res: Response): void {
  res.render('auth/login', { title: 'Iniciar Sesión' });
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.render('auth/login', {
        title: 'Iniciar Sesión',
        error: 'Completá todos los campos',
      });
      return;
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      res.render('auth/login', {
        title: 'Iniciar Sesión',
        error: 'Credenciales inválidas',
      });
      return;
    }

    if (!usuario.activo) {
      res.render('auth/login', {
        title: 'Iniciar Sesión',
        error: 'Usuario inactivo',
      });
      return;
    }

    if (usuario.rol !== 'ADMIN') {
      res.render('auth/login', {
        title: 'Iniciar Sesión',
        error: 'No tenés permisos de administrador',
      });
      return;
    }

    const passwordValid = await bcrypt.compare(password, usuario.password);
    if (!passwordValid) {
      res.render('auth/login', {
        title: 'Iniciar Sesión',
        error: 'Credenciales inválidas',
      });
      return;
    }

    req.session.userId = usuario.id;
    req.session.userEmail = usuario.email;
    req.session.userNombre = `${usuario.nombre} ${usuario.apellido}`;
    req.session.userRol = 'ADMIN';

    res.redirect('/admin/pedidos');
  } catch (err) {
    next(err);
  }
}

export function logout(req: Request, res: Response): void {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
}
