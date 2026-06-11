import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const empleadoId = req.query.empleadoId as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const where = empleadoId ? { empleadoId } : undefined;
    const [visitas, total, empleados] = await Promise.all([
      prisma.visita.findMany({
        where,
        include: {
          pedido: { select: { id: true, numeroPedido: true, estado: true } },
          empleado: { select: { id: true, nombre: true, apellido: true } },
        },
        orderBy: { fecha: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.visita.count({ where }),
      prisma.empleado.findMany({ orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
    ]);

    const qs = empleadoId ? '&empleadoId=' + encodeURIComponent(empleadoId) : '';
    res.render('visitas/index', { title: 'Visitas', visitas, empleados, filtroEmpleadoId: empleadoId || '', page, pageSize, total, qs });
  } catch (err) { next(err); }
}

export async function createForm(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [empleados, pedidos] = await Promise.all([
      prisma.empleado.findMany({ orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
      prisma.pedido.findMany({
        where: { deletedAt: null },
        orderBy: { fecha: 'desc' },
        take: 500,
        select: { id: true, numeroPedido: true, fecha: true, cliente: { select: { nombre: true, apellido: true } } },
      }),
    ]);
    res.render('visitas/form', { title: 'Nueva Visita', visita: null, empleados, pedidos, errors: {} });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.visita.create({
      data: {
        fecha: new Date(b.fecha!),
        hora: new Date(b.hora!),
        falta: b.falta === 'true',
        pedidoId: b.pedidoId!,
        empleadoId: b.empleadoId!,
      },
    });
    req.session.success = 'Visita registrada exitosamente';
    res.redirect('/admin/visitas');
  } catch (err: any) {
    const [empleados, pedidos] = await Promise.all([
      prisma.empleado.findMany({ orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
      prisma.pedido.findMany({ where: { deletedAt: null }, orderBy: { fecha: 'desc' }, take: 500, select: { id: true, numeroPedido: true, fecha: true, cliente: { select: { nombre: true, apellido: true } } } }),
    ]);
    res.render('visitas/form', { title: 'Nueva Visita', visita: null, empleados, pedidos, errors: { general: err.message } });
  }
}

export async function editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [visita, empleados, pedidos] = await Promise.all([
      prisma.visita.findUniqueOrThrow({ where: { id: req.params.id as string } }),
      prisma.empleado.findMany({ orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
      prisma.pedido.findMany({ where: { deletedAt: null }, orderBy: { fecha: 'desc' }, take: 500, select: { id: true, numeroPedido: true, fecha: true, cliente: { select: { nombre: true, apellido: true } } } }),
    ]);
    res.render('visitas/form', { title: 'Editar Visita', visita, empleados, pedidos, errors: {} });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.visita.update({
      where: { id: req.params.id as string },
      data: {
        fecha: new Date(b.fecha!),
        hora: new Date(b.hora!),
        falta: b.falta === 'true',
        pedidoId: b.pedidoId,
        empleadoId: b.empleadoId,
      },
    });
    req.session.success = 'Visita actualizada exitosamente';
    res.redirect('/admin/visitas');
  } catch (err: any) {
    req.session.error = err.message || 'Error al actualizar la visita';
    res.redirect(`/admin/visitas/${req.params.id as string}/editar`);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.visita.delete({ where: { id: req.params.id as string } });
    req.session.success = 'Visita eliminada exitosamente';
    res.redirect('/admin/visitas');
  } catch (err: any) {
    req.session.error = err.message || 'Error al eliminar la visita';
    res.redirect('/admin/visitas');
  }
}
