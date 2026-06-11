import type { Request, Response, NextFunction } from 'express';
import * as usuariosService from '../../features/usuarios/service.js';

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const usuarios = await usuariosService.listarUsuarios();
    res.render('usuarios/index', {
      title: 'Usuarios',
      usuarios,
    });
  } catch (err) {
    next(err);
  }
}

export async function createForm(_req: Request, res: Response): Promise<void> {
  res.render('usuarios/create', {
    title: 'Nuevo Usuario',
    errors: {},
  });
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    const email = b.email;
    const password = b.password;
    const nombre = b.nombre;
    const apellido = b.apellido;
    const rol = b.rol as 'REPARTIDOR' | 'ADMIN' | undefined;

    if (!email || !password || !nombre || !apellido) {
      res.render('usuarios/create', {
        title: 'Nuevo Usuario',
        errors: { general: 'Completá todos los campos requeridos' },
      });
      return;
    }

    await usuariosService.crearUsuario({
      email,
      password,
      nombre,
      apellido,
      rol: rol || 'REPARTIDOR',
    });

    req.session.success = 'Usuario creado exitosamente';
    res.redirect('/admin/usuarios');
  } catch (err: any) {
    res.render('usuarios/create', {
      title: 'Nuevo Usuario',
      errors: { general: err.message || 'Error al crear el usuario' },
    });
  }
}

export async function desactivar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminUserId = req.session.userId!;
    await usuariosService.desactivarUsuario(req.params.id as string, adminUserId);
    req.session.success = 'Usuario desactivado exitosamente';
    res.redirect('/admin/usuarios');
  } catch (err: any) {
    req.session.error = err.message || 'Error al desactivar el usuario';
    res.redirect('/admin/usuarios');
  }
}
