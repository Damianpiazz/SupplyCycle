import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = req.query.search as string | undefined;
    const empleados = await prisma.empleado.findMany({
      where: search
        ? { OR: [{ nombre: { contains: search, mode: 'insensitive' } }, { apellido: { contains: search, mode: 'insensitive' } }, { dni: { contains: search } }] }
        : undefined,
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    });
    res.render('empleados/index', { title: 'Empleados', empleados, search: search || '' });
  } catch (err) { next(err); }
}

export async function createForm(_req: Request, res: Response): Promise<void> {
  res.render('empleados/form', { title: 'Nuevo Empleado', empleado: null, errors: {} });
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.empleado.create({ data: { nombre: b.nombre!, apellido: b.apellido!, dni: b.dni! } });
    req.session.success = 'Empleado creado exitosamente';
    res.redirect('/admin/empleados');
  } catch (err: any) {
    res.render('empleados/form', { title: 'Nuevo Empleado', empleado: null, errors: { general: err.message } });
  }
}

export async function editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const empleado = await prisma.empleado.findUniqueOrThrow({ where: { id: req.params.id as string } });
    res.render('empleados/form', { title: `Editar ${empleado.apellido}, ${empleado.nombre}`, empleado, errors: {} });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.empleado.update({
      where: { id: req.params.id as string },
      data: { nombre: b.nombre, apellido: b.apellido, dni: b.dni },
    });
    req.session.success = 'Empleado actualizado exitosamente';
    res.redirect('/admin/empleados');
  } catch (err: any) {
    req.session.error = err.message || 'Error al actualizar el empleado';
    res.redirect(`/admin/empleados/${req.params.id as string}/editar`);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.empleado.delete({ where: { id: req.params.id as string } });
    req.session.success = 'Empleado eliminado exitosamente';
    res.redirect('/admin/empleados');
  } catch (err: any) {
    req.session.error = err.message || 'No se puede eliminar el empleado (tiene visitas asociadas)';
    res.redirect('/admin/empleados');
  }
}
