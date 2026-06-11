import type { Request, Response, NextFunction } from 'express';
import * as repartosService from '../../features/repartos/service.js';
import * as pedidosService from '../../features/pedidos/service.js';
import { prisma } from '../../lib/prisma.js';

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const fecha = req.query.fecha as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const where = fecha ? { fecha: new Date(fecha) } : undefined;
    const [raw, total] = await Promise.all([
      prisma.reparto.findMany({
        where,
        include: { repartidor: { select: { id: true, nombre: true, apellido: true } }, pedidos: { select: { estado: true } } },
        orderBy: { fecha: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.reparto.count({ where }),
    ]);

    const repartos = raw.map((r) => ({
      id: r.id,
      fecha: r.fecha,
      estado: r.estado,
      horaInicio: r.horaInicio ?? undefined,
      horaFin: r.horaFin ?? undefined,
      repartidor: r.repartidor,
      pedidosCount: r.pedidos.length,
      resumen: {
        totalPedidos: r.pedidos.length,
        completados: r.pedidos.filter((p) => p.estado !== 'PENDIENTE').length,
        pendientes: r.pedidos.filter((p) => p.estado === 'PENDIENTE').length,
      },
    }));

    const qs = fecha ? '&fecha=' + encodeURIComponent(fecha) : '';
    res.render('repartos/index', {
      title: 'Repartos',
      repartos,
      filters: { fecha },
      page,
      pageSize,
      total,
      qs,
    });
  } catch (err) {
    next(err);
  }
}

export async function createForm(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [repartidores, pedidosDisponibles] = await Promise.all([
      prisma.usuario.findMany({
        where: { rol: 'REPARTIDOR', activo: true },
        select: { id: true, nombre: true, apellido: true },
        orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
      }),
      pedidosService.obtenerPedidosDisponiblesParaReparto(
        new Date().toISOString().slice(0, 10)
      ),
    ]);

    res.render('repartos/form', {
      title: 'Nuevo Reparto',
      repartidores,
      pedidosDisponibles,
      errors: {},
    });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const repartidorId = body.repartidorId as string;
    const fecha = body.fecha as string;
    const pedidoIdsRaw = body.pedidoIds;
    const ids = Array.isArray(pedidoIdsRaw) ? pedidoIdsRaw as string[] : (pedidoIdsRaw ? [pedidoIdsRaw as string] : []);

    await repartosService.crearReparto({ repartidorId, fecha, pedidoIds: ids });
    req.session.success = 'Reparto creado exitosamente';
    res.redirect('/admin/repartos');
  } catch (err: any) {
    req.session.error = err.message || 'Error al crear el reparto';
    res.redirect('/admin/repartos/nuevo');
  }
}

export async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const reparto = await repartosService.obtenerRepartoAdmin(req.params.id as string);

    const pedidosDisponibles = reparto.estado === 'PENDIENTE'
      ? await pedidosService.obtenerPedidosDisponiblesParaReparto(reparto.fecha)
      : [];

    res.render('repartos/show', {
      title: `Reparto del ${reparto.fecha}`,
      reparto,
      pedidosDisponibles,
    });
  } catch (err) {
    next(err);
  }
}

export async function agregarPedido(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await repartosService.agregarPedidoAReparto(req.params.id as string, (req.body as Record<string, string>).pedidoId as string);
    req.session.success = 'Pedido agregado al reparto';
    res.redirect(`/admin/repartos/${req.params.id as string}`);
  } catch (err: any) {
    req.session.error = err.message || 'Error al agregar pedido';
    res.redirect(`/admin/repartos/${req.params.id as string}`);
  }
}

export async function quitarPedido(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await repartosService.quitarPedidoDeReparto(req.params.id as string, req.params.pedidoId as string);
    req.session.success = 'Pedido quitado del reparto';
    res.redirect(`/admin/repartos/${req.params.id as string}`);
  } catch (err: any) {
    req.session.error = err.message || 'Error al quitar pedido';
    res.redirect(`/admin/repartos/${req.params.id as string}`);
  }
}
