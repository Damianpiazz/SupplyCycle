import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';

const ESTADOS = ['RETENIDO', 'DEVUELTO', 'PERDIDO'] as const;

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const estado = req.query.estado as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const where = estado ? { estado: estado as any } : undefined;
    const [retenidos, total] = await Promise.all([
      prisma.retenido.findMany({
        where,
        include: {
          item: { select: { id: true, nombre: true } },
          cliente: { select: { id: true, nombre: true, apellido: true } },
          pedido: { select: { id: true, numeroPedido: true } },
        },
        orderBy: { inicio: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.retenido.count({ where }),
    ]);

    const qs = estado ? '&estado=' + encodeURIComponent(estado) : '';
    res.render('retenidos/index', { title: 'Retenidos', retenidos, ESTADOS, filtroEstado: estado || '', page, pageSize, total, qs });
  } catch (err) { next(err); }
}

export async function createForm(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [items, clientes, pedidos] = await Promise.all([
      prisma.item.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } }),
      prisma.cliente.findMany({ where: { activo: true }, orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
      prisma.pedido.findMany({ where: { deletedAt: null }, orderBy: { fecha: 'desc' }, take: 500, select: { id: true, numeroPedido: true, domicilio: { select: { cliente: { select: { nombre: true, apellido: true } } } } } }),
    ]);
    res.render('retenidos/form', { title: 'Nuevo Retenido', retenido: null, items, clientes, pedidos, ESTADOS, errors: {} });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.retenido.create({
      data: {
        estado: (b.estado || 'RETENIDO') as any,
        inicio: new Date(b.inicio!),
        fin: b.fin ? new Date(b.fin) : null,
        itemId: b.itemId!,
        clienteId: b.clienteId!,
        pedidoId: b.pedidoId!,
      },
    });
    req.session.success = 'Retenido registrado exitosamente';
    res.redirect('/admin/retenidos');
  } catch (err: any) {
    const [items, clientes, pedidos] = await Promise.all([
      prisma.item.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } }),
      prisma.cliente.findMany({ where: { activo: true }, orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
      prisma.pedido.findMany({ where: { deletedAt: null }, orderBy: { fecha: 'desc' }, take: 500, select: { id: true, numeroPedido: true, domicilio: { select: { cliente: { select: { nombre: true, apellido: true } } } } } }),
    ]);
    res.render('retenidos/form', { title: 'Nuevo Retenido', retenido: null, items, clientes, pedidos, ESTADOS, errors: { general: err.message } });
  }
}

export async function editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [retenido, items, clientes, pedidos] = await Promise.all([
      prisma.retenido.findUniqueOrThrow({ where: { id: req.params.id as string } }),
      prisma.item.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } }),
      prisma.cliente.findMany({ where: { activo: true }, orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
      prisma.pedido.findMany({ where: { deletedAt: null }, orderBy: { fecha: 'desc' }, take: 500, select: { id: true, numeroPedido: true, domicilio: { select: { cliente: { select: { nombre: true, apellido: true } } } } } }),
    ]);
    res.render('retenidos/form', { title: 'Editar Retenido', retenido, items, clientes, pedidos, ESTADOS, errors: {} });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await prisma.retenido.update({
      where: { id: req.params.id as string },
      data: {
        estado: b.estado as any,
        inicio: new Date(b.inicio!),
        fin: b.fin ? new Date(b.fin) : null,
        itemId: b.itemId,
        clienteId: b.clienteId,
        pedidoId: b.pedidoId,
      },
    });
    req.session.success = 'Retenido actualizado exitosamente';
    res.redirect('/admin/retenidos');
  } catch (err: any) {
    req.session.error = err.message || 'Error al actualizar el retenido';
    res.redirect(`/admin/retenidos/${req.params.id as string}/editar`);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.retenido.delete({ where: { id: req.params.id as string } });
    req.session.success = 'Retenido eliminado exitosamente';
    res.redirect('/admin/retenidos');
  } catch (err: any) {
    req.session.error = err.message || 'Error al eliminar el retenido';
    res.redirect('/admin/retenidos');
  }
}
