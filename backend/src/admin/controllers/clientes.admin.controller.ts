import type { Request, Response, NextFunction } from 'express';
import * as clientesService from '../../features/clientes/service.js';
import { prisma } from '../../lib/prisma.js';

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const nombre = req.query.nombre as string | undefined;
    const dia = req.query.dia as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (nombre) {
      where['OR'] = [
        { nombre: { contains: nombre, mode: 'insensitive' as const } },
        { apellido: { contains: nombre, mode: 'insensitive' as const } },
      ];
    }
    if (dia) where['diaEntrega'] = dia;

    const [raw, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        orderBy: { apellido: 'asc' },
        skip,
        take: pageSize,
      }),
      prisma.cliente.count({ where }),
    ]);

    const clientes = raw.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      apellido: c.apellido,
      telefono: c.telefono,
      domicilio: { calle: c.calle, numero: c.numero, localidad: c.localidad, latitud: c.latitud, longitud: c.longitud },
      diaEntrega: c.diaEntrega,
      horarioDesde: c.horarioDesde,
      horarioHasta: c.horarioHasta,
      observaciones: c.observaciones ?? undefined,
      activo: c.activo,
    }));

    const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    let qs = '';
    if (nombre) qs += '&nombre=' + encodeURIComponent(nombre);
    if (dia) qs += '&dia=' + encodeURIComponent(dia);

    res.render('clientes/index', {
      title: 'Clientes',
      clientes,
      diasSemana,
      filters: { nombre, dia },
      page,
      pageSize,
      total,
      qs,
    });
  } catch (err) {
    next(err);
  }
}

export async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cliente = await clientesService.obtenerCliente(req.params.id as string);
    res.render('clientes/show', {
      title: `${cliente.apellido}, ${cliente.nombre}`,
      cliente,
    });
  } catch (err) {
    next(err);
  }
}

export async function createForm(_req: Request, res: Response): Promise<void> {
  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  res.render('clientes/form', {
    title: 'Nuevo Cliente',
    cliente: null,
    diasSemana,
    errors: {},
  });
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    const data = {
      nombre: b.nombre!,
      apellido: b.apellido!,
      telefono: b.telefono!,
      calle: b.calle!,
      numero: b.numero!,
      localidad: b.localidad!,
      latitud: parseFloat(b.latitud || '0'),
      longitud: parseFloat(b.longitud || '0'),
      diaEntrega: b.diaEntrega as any,
      horarioDesde: b.horarioDesde || '',
      horarioHasta: b.horarioHasta || '',
      observaciones: b.observaciones || '',
    };

    await clientesService.crearCliente(data);
    req.session.success = 'Cliente creado exitosamente';
    res.redirect('/admin/clientes');
  } catch (err: any) {
    const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    res.render('clientes/form', {
      title: 'Nuevo Cliente',
      cliente: null,
      diasSemana,
      errors: { general: err.message || 'Error al crear el cliente' },
    });
  }
}

export async function editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cliente = await clientesService.obtenerCliente(req.params.id as string);
    const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    res.render('clientes/form', {
      title: `Editar ${cliente.apellido}, ${cliente.nombre}`,
      cliente,
      diasSemana,
      errors: {},
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    const data: Record<string, unknown> = {};
    if (b.nombre) data.nombre = b.nombre;
    if (b.apellido) data.apellido = b.apellido;
    if (b.telefono) data.telefono = b.telefono;
    if (b.calle) data.calle = b.calle;
    if (b.numero) data.numero = b.numero;
    if (b.localidad) data.localidad = b.localidad;
    if (b.latitud) data.latitud = parseFloat(b.latitud);
    if (b.longitud) data.longitud = parseFloat(b.longitud);
    if (b.diaEntrega) data.diaEntrega = b.diaEntrega;
    if (b.horarioDesde) data.horarioDesde = b.horarioDesde;
    if (b.horarioHasta) data.horarioHasta = b.horarioHasta;
    if (b.observaciones !== undefined) data.observaciones = b.observaciones;

    await clientesService.actualizarCliente(req.params.id as string, data);
    req.session.success = 'Cliente actualizado exitosamente';
    res.redirect('/admin/clientes');
  } catch (err: any) {
    req.session.error = err.message || 'Error al actualizar el cliente';
    res.redirect(`/admin/clientes/${req.params.id as string}/editar`);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await clientesService.eliminarCliente(req.params.id as string);
    req.session.success = 'Cliente desactivado exitosamente';
    res.redirect('/admin/clientes');
  } catch (err: any) {
    req.session.error = err.message || 'Error al desactivar el cliente';
    res.redirect('/admin/clientes');
  }
}
