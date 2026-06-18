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
    if (dia) {
      where['domicilios'] = {
        some: {
          dias: { some: { nombre: dia.toUpperCase() } },
        },
      };
    }

    const raw = await prisma.cliente.findMany({
      where,
      include: {
        domicilios: {
          where: { principal: true },
          take: 1,
          include: {
            dias: {
              take: 1,
              include: { horarios: { take: 1 } },
            },
          },
        },
      },
      orderBy: { apellido: 'asc' },
      skip,
      take: pageSize,
    });
    const total = await prisma.cliente.count({ where });

    const clientes = raw.map((c: any) => {
      const dom = c.domicilios?.[0];
      const dia = dom?.dias?.[0];
      const horario = dia?.horarios?.[0];
      return {
        id: c.id,
        nombre: c.nombre,
        apellido: c.apellido,
        telefono: c.telefono,
        domicilio: {
          calle: dom?.calle ?? '',
          numero: dom?.numero ?? '',
          localidad: dom?.localidad ?? '',
          latitud: dom?.latitud ?? undefined,
          longitud: dom?.longitud ?? undefined,
        },
        diaEntrega: dia?.nombre ?? 'LUNES',
        horarioDesde: horario ? horario.inicio.toISOString().slice(11, 16) : '08:00',
        horarioHasta: horario ? horario.fin.toISOString().slice(11, 16) : '17:00',
        observaciones: c.observaciones ?? undefined,
        activo: c.activo,
      };
    });

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
      observaciones: b.observaciones || '',
      domicilios: [
        {
          calle: b.calle!,
          numero: b.numero!,
          localidad: b.localidad!,
          latitud: parseFloat(b.latitud || '0') || undefined,
          longitud: parseFloat(b.longitud || '0') || undefined,
          principal: true,
          dias: [
            {
              nombre: b.diaEntrega as any,
              horarios: [{ inicio: b.horarioDesde || '08:00', fin: b.horarioHasta || '17:00' }],
            },
          ],
        },
      ],
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
    if (b.observaciones !== undefined) data.observaciones = b.observaciones;

    const hasDomFields = b.calle || b.numero || b.localidad || b.diaEntrega || b.horarioDesde || b.horarioHasta;
    if (hasDomFields) {
      data.domicilios = [
        {
          calle: b.calle || '',
          numero: b.numero || '',
          localidad: b.localidad || '',
          latitud: b.latitud ? parseFloat(b.latitud) : undefined,
          longitud: b.longitud ? parseFloat(b.longitud) : undefined,
          principal: true,
          dias: [
            {
              nombre: (b.diaEntrega || 'LUNES') as any,
              horarios: [{ inicio: b.horarioDesde || '08:00', fin: b.horarioHasta || '17:00' }],
            },
          ],
        },
      ];
    }

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
