import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const clienteId = req.query.clienteId as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const where = clienteId ? { clienteId } : undefined;
    const [reclamos, total, clientes] = await Promise.all([
      prisma.reclamo.findMany({
        where,
        include: { cliente: { select: { id: true, nombre: true, apellido: true } } },
        orderBy: { creadoEn: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.reclamo.count({ where }),
      prisma.cliente.findMany({ where: { activo: true }, orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
    ]);

    const qs = clienteId ? '&clienteId=' + encodeURIComponent(clienteId) : '';
    res.render('reclamos/index', { title: 'Reclamos', reclamos, clientes, filtroClienteId: clienteId || '', page, pageSize, total, qs });
  } catch (err) { next(err); }
}

export async function createForm(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const clientes = await prisma.cliente.findMany({ where: { activo: true }, orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] });
    res.render('reclamos/form', { title: 'Nuevo Reclamo', reclamo: null, clientes, errors: {} });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.reclamo.create({ data: { clienteId: b.clienteId! } });
    req.session.success = 'Reclamo registrado exitosamente';
    res.redirect('/admin/reclamos');
  } catch (err: any) {
    const clientes = await prisma.cliente.findMany({ where: { activo: true }, orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] });
    res.render('reclamos/form', { title: 'Nuevo Reclamo', reclamo: null, clientes, errors: { general: err.message } });
  }
}

export async function editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [reclamo, clientes] = await Promise.all([
      prisma.reclamo.findUniqueOrThrow({ where: { id: req.params.id as string } }),
      prisma.cliente.findMany({ where: { activo: true }, orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
    ]);
    res.render('reclamos/form', { title: 'Editar Reclamo', reclamo, clientes, errors: {} });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.reclamo.update({
      where: { id: req.params.id as string },
      data: { clienteId: b.clienteId },
    });
    req.session.success = 'Reclamo actualizado exitosamente';
    res.redirect('/admin/reclamos');
  } catch (err: any) {
    req.session.error = err.message || 'Error al actualizar el reclamo';
    res.redirect(`/admin/reclamos/${req.params.id as string}/editar`);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.reclamo.delete({ where: { id: req.params.id as string } });
    req.session.success = 'Reclamo eliminado exitosamente';
    res.redirect('/admin/reclamos');
  } catch (err: any) {
    req.session.error = err.message || 'Error al eliminar el reclamo';
    res.redirect('/admin/reclamos');
  }
}
