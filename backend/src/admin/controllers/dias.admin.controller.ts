import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';

const DIAS_SEMANA = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'] as const;

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filtroDia = req.query.dia as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const where = filtroDia ? { nombre: filtroDia as any } : undefined;
    const [dias, total] = await Promise.all([
      prisma.dia.findMany({
        where,
        include: { domicilio: { include: { cliente: { select: { nombre: true, apellido: true } }, ciudad: { select: { nombre: true } } } } },
        orderBy: { domicilio: { cliente: { apellido: 'asc' } } },
        skip,
        take: pageSize,
      }),
      prisma.dia.count({ where }),
    ]);

    const qs = filtroDia ? '&dia=' + encodeURIComponent(filtroDia) : '';
    res.render('dias/index', { title: 'Días de Entrega', dias, DIAS_SEMANA, filtroDia: filtroDia || '', page, pageSize, total, qs });
  } catch (err) { next(err); }
}

export async function createForm(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const domicilios = await prisma.domicilio.findMany({
      include: { cliente: { select: { nombre: true, apellido: true } }, ciudad: { select: { nombre: true } } },
      orderBy: { cliente: { apellido: 'asc' } },
    });
    res.render('dias/form', { title: 'Nuevo Día', dia: null, domicilios, DIAS_SEMANA, errors: {} });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.dia.create({ data: { nombre: b.nombre as any, domicilioId: b.domicilioId! } });
    req.session.success = 'Día asignado exitosamente';
    res.redirect('/admin/dias');
  } catch (err: any) {
    const domicilios = await prisma.domicilio.findMany({ include: { cliente: { select: { nombre: true, apellido: true } }, ciudad: { select: { nombre: true } } }, orderBy: { cliente: { apellido: 'asc' } } });
    res.render('dias/form', { title: 'Nuevo Día', dia: null, domicilios, DIAS_SEMANA, errors: { general: err.message } });
  }
}

export async function editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [dia, domicilios] = await Promise.all([
      prisma.dia.findUniqueOrThrow({
        where: { id: req.params.id as string },
        include: { domicilio: { include: { cliente: { select: { nombre: true, apellido: true } }, ciudad: { select: { nombre: true } } } } },
      }),
      prisma.domicilio.findMany({ include: { cliente: { select: { nombre: true, apellido: true } }, ciudad: { select: { nombre: true } } }, orderBy: { cliente: { apellido: 'asc' } } }),
    ]);
    res.render('dias/form', { title: 'Editar Día', dia, domicilios, DIAS_SEMANA, errors: {} });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.dia.update({
      where: { id: req.params.id as string },
      data: { nombre: b.nombre as any, domicilioId: b.domicilioId },
    });
    req.session.success = 'Día actualizado exitosamente';
    res.redirect('/admin/dias');
  } catch (err: any) {
    req.session.error = err.message || 'Error al actualizar el día';
    res.redirect(`/admin/dias/${req.params.id as string}/editar`);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.dia.delete({ where: { id: req.params.id as string } });
    req.session.success = 'Día eliminado exitosamente';
    res.redirect('/admin/dias');
  } catch (err: any) {
    req.session.error = err.message || 'No se puede eliminar el día (tiene horarios asociados)';
    res.redirect('/admin/dias');
  }
}
