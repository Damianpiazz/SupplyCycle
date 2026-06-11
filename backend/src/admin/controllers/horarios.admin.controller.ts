import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const diaId = req.query.diaId as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const where = diaId ? { diaId } : undefined;
    const [horarios, total, dias] = await Promise.all([
      prisma.horario.findMany({
        where,
        include: {
          dia: {
            include: { domicilio: { include: { cliente: { select: { nombre: true, apellido: true } } } } },
          },
        },
        orderBy: { inicio: 'asc' },
        skip,
        take: pageSize,
      }),
      prisma.horario.count({ where }),
      prisma.dia.findMany({
        include: { domicilio: { include: { cliente: { select: { nombre: true, apellido: true } } } } },
        orderBy: { domicilio: { cliente: { apellido: 'asc' } } },
      }),
    ]);

    const qs = diaId ? '&diaId=' + encodeURIComponent(diaId) : '';
    res.render('horarios/index', { title: 'Horarios', horarios, dias, diaId: diaId || '', page, pageSize, total, qs });
  } catch (err) { next(err); }
}

export async function createForm(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dias = await prisma.dia.findMany({
      include: { domicilio: { include: { cliente: { select: { nombre: true, apellido: true } } } } },
      orderBy: { domicilio: { cliente: { apellido: 'asc' } } },
    });
    res.render('horarios/form', { title: 'Nuevo Horario', horario: null, dias, errors: {} });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.horario.create({
      data: {
        inicio: new Date(b.inicio!),
        fin: new Date(b.fin!),
        diaId: b.diaId!,
      },
    });
    req.session.success = 'Horario creado exitosamente';
    res.redirect('/admin/horarios');
  } catch (err: any) {
    const dias = await prisma.dia.findMany({
      include: { domicilio: { include: { cliente: { select: { nombre: true, apellido: true } } } } },
      orderBy: { domicilio: { cliente: { apellido: 'asc' } } },
    });
    res.render('horarios/form', { title: 'Nuevo Horario', horario: null, dias, errors: { general: err.message } });
  }
}

export async function editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [horario, dias] = await Promise.all([
      prisma.horario.findUniqueOrThrow({ where: { id: req.params.id as string } }),
      prisma.dia.findMany({
        include: { domicilio: { include: { cliente: { select: { nombre: true, apellido: true } } } } },
        orderBy: { domicilio: { cliente: { apellido: 'asc' } } },
      }),
    ]);
    res.render('horarios/form', { title: 'Editar Horario', horario, dias, errors: {} });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.horario.update({
      where: { id: req.params.id as string },
      data: { inicio: new Date(b.inicio!), fin: new Date(b.fin!), diaId: b.diaId },
    });
    req.session.success = 'Horario actualizado exitosamente';
    res.redirect('/admin/horarios');
  } catch (err: any) {
    req.session.error = err.message || 'Error al actualizar el horario';
    res.redirect(`/admin/horarios/${req.params.id as string}/editar`);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.horario.delete({ where: { id: req.params.id as string } });
    req.session.success = 'Horario eliminado exitosamente';
    res.redirect('/admin/horarios');
  } catch (err: any) {
    req.session.error = err.message || 'Error al eliminar el horario';
    res.redirect('/admin/horarios');
  }
}
