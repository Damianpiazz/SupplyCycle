import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = req.query.search as string | undefined;
    const ciudades = await prisma.ciudad.findMany({
      where: search ? { nombre: { contains: search, mode: 'insensitive' } } : undefined,
      orderBy: { nombre: 'asc' },
    });
    res.render('ciudades/index', { title: 'Ciudades', ciudades, search: search || '' });
  } catch (err) { next(err); }
}

export async function createForm(_req: Request, res: Response): Promise<void> {
  res.render('ciudades/form', { title: 'Nueva Ciudad', ciudad: null, errors: {} });
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.ciudad.create({ data: { nombre: b.nombre! } });
    req.session.success = 'Ciudad creada exitosamente';
    res.redirect('/admin/ciudades');
  } catch (err: any) {
    res.render('ciudades/form', { title: 'Nueva Ciudad', ciudad: null, errors: { general: err.message } });
  }
}

export async function editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ciudad = await prisma.ciudad.findUniqueOrThrow({ where: { id: req.params.id as string } });
    res.render('ciudades/form', { title: `Editar ${ciudad.nombre}`, ciudad, errors: {} });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.ciudad.update({ where: { id: req.params.id as string }, data: { nombre: b.nombre! } });
    req.session.success = 'Ciudad actualizada exitosamente';
    res.redirect('/admin/ciudades');
  } catch (err: any) {
    req.session.error = err.message || 'Error al actualizar la ciudad';
    res.redirect(`/admin/ciudades/${req.params.id as string}/editar`);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.ciudad.delete({ where: { id: req.params.id as string } });
    req.session.success = 'Ciudad eliminada exitosamente';
    res.redirect('/admin/ciudades');
  } catch (err: any) {
    req.session.error = err.message || 'No se puede eliminar la ciudad (tiene domicilios asociados)';
    res.redirect('/admin/ciudades');
  }
}
