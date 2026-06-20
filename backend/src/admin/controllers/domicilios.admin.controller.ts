import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = req.query.search as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const where = search
      ? { OR: [{ calle: { contains: search, mode: 'insensitive' as const } }, { numero: { contains: search } }] }
      : undefined;

    const [domicilios, total] = await Promise.all([
      prisma.domicilio.findMany({
        where,
        include: { cliente: { select: { id: true, nombre: true, apellido: true } }, ciudad: { select: { id: true, nombre: true } } },
        orderBy: { calle: 'asc' },
        skip,
        take: pageSize,
      }),
      prisma.domicilio.count({ where }),
    ]);

    const qs = search ? '&search=' + encodeURIComponent(search) : '';
    res.render('domicilios/index', { title: 'Domicilios', domicilios, search: search || '', page, pageSize, total, qs });
  } catch (err) { next(err); }
}

export async function createForm(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [clientes, ciudades] = await Promise.all([
      prisma.cliente.findMany({ where: { activo: true }, orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
      prisma.ciudad.findMany({ orderBy: { nombre: 'asc' } }),
    ]);
    res.render('domicilios/form', { title: 'Nuevo Domicilio', domicilio: null, clientes, ciudades, errors: {} });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    const ciudad = await prisma.ciudad.findUniqueOrThrow({ where: { id: b.ciudadId! } });
    await prisma.domicilio.create({
      data: {
        calle: b.calle!,
        entreCalle1: b.entreCalle1 || null,
        entreCalle2: b.entreCalle2 || null,
        numero: b.numero!,
        piso: b.piso || null,
        localidad: b.localidad || ciudad.nombre,
        clienteId: b.clienteId!,
        ciudadId: b.ciudadId!,
      },
    });
    req.session.success = 'Domicilio creado exitosamente';
    res.redirect('/admin/domicilios');
  } catch (err: any) {
    const [clientes, ciudades] = await Promise.all([
      prisma.cliente.findMany({ where: { activo: true }, orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
      prisma.ciudad.findMany({ orderBy: { nombre: 'asc' } }),
    ]);
    res.render('domicilios/form', { title: 'Nuevo Domicilio', domicilio: null, clientes, ciudades, errors: { general: err.message } });
  }
}

export async function editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [domicilio, clientes, ciudades] = await Promise.all([
      prisma.domicilio.findUniqueOrThrow({
        where: { id: req.params.id as string },
        include: { cliente: true, ciudad: true },
      }),
      prisma.cliente.findMany({ where: { activo: true }, orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }] }),
      prisma.ciudad.findMany({ orderBy: { nombre: 'asc' } }),
    ]);
    res.render('domicilios/form', { title: 'Editar Domicilio', domicilio, clientes, ciudades, errors: {} });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    const data: Record<string, unknown> = {
      calle: b.calle,
      entreCalle1: b.entreCalle1 || null,
      entreCalle2: b.entreCalle2 || null,
      numero: b.numero,
      piso: b.piso || null,
      clienteId: b.clienteId,
      ciudadId: b.ciudadId,
    };
    if (b.localidad) data['localidad'] = b.localidad;
    await prisma.domicilio.update({
      where: { id: req.params.id as string },
      data,
    });
    req.session.success = 'Domicilio actualizado exitosamente';
    res.redirect('/admin/domicilios');
  } catch (err: any) {
    req.session.error = err.message || 'Error al actualizar el domicilio';
    res.redirect(`/admin/domicilios/${req.params.id as string}/editar`);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.domicilio.delete({ where: { id: req.params.id as string } });
    req.session.success = 'Domicilio eliminado exitosamente';
    res.redirect('/admin/domicilios');
  } catch (err: any) {
    req.session.error = err.message || 'No se puede eliminar el domicilio (tiene días asociados)';
    res.redirect('/admin/domicilios');
  }
}
