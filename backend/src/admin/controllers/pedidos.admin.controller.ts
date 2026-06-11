import type { Request, Response, NextFunction } from 'express';
import * as pedidosService from '../../features/pedidos/service.js';
import * as itemsService from '../../features/items/service.js';
import * as clientesService from '../../features/clientes/service.js';
import { prisma } from '../../lib/prisma.js';

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const estado = req.query.estado as string | undefined;
    const clienteNombre = req.query.clienteNombre as string | undefined;
    const fecha = req.query.fecha as string | undefined;

    const result = await pedidosService.listarPedidos({ page, estado, clienteNombre, fecha });
    const estados = ['PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'NO_ENTREGADO', 'CANCELADO'];

    res.render('pedidos/index', {
      title: 'Pedidos',
      pedidos: result.data,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      estados,
      filters: { estado, clienteNombre, fecha },
      currentPath: req.path,
    });
  } catch (err) {
    next(err);
  }
}

export async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pedido = await pedidosService.obtenerPedido(req.params.id as string);
    res.render('pedidos/show', {
      title: `Pedido #${pedido.numeroPedido}`,
      pedido,
      currentPath: req.path,
    });
  } catch (err) {
    next(err);
  }
}

export async function createForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [clientes, items] = await Promise.all([
      clientesService.listarTodosLosClientes(),
      itemsService.listarItems(true),
    ]);
    res.render('pedidos/form', {
      title: 'Nuevo Pedido',
      pedido: null,
      clientes,
      items,
      errors: {},
      currentPath: req.path,
    });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const clienteId = body.clienteId as string;
    const fecha = body.fecha as string | undefined;
    const itemsRaw = body.items;

    if (!clienteId || !itemsRaw) {
      const [clientes, allItems] = await Promise.all([
        clientesService.listarTodosLosClientes(),
        itemsService.listarItems(true),
      ]);
      res.render('pedidos/form', {
        title: 'Nuevo Pedido',
        pedido: null,
        clientes,
        items: allItems,
        errors: { general: 'Completá todos los campos requeridos' },
        currentPath: req.path,
      });
      return;
    }

    const itemsArray = Array.isArray(itemsRaw) ? itemsRaw as Array<Record<string, string>> : [itemsRaw as Record<string, string>];
    const pedido = await pedidosService.crearPedido({
      clienteId: clienteId as string,
      fecha: fecha || undefined,
      orden: body.orden ? parseInt(body.orden as string, 10) : undefined,
      items: itemsArray.map((i) => ({
        itemId: i.itemId as string,
        cantidad: parseInt(i.cantidad as string, 10),
      })),
    });

    req.session.success = `Pedido #${pedido.numeroPedido} creado exitosamente`;
    res.redirect('/admin/pedidos');
  } catch (err: any) {
    const [clientes, allItems] = await Promise.all([
      clientesService.listarTodosLosClientes(),
      itemsService.listarItems(true),
    ]);
    res.render('pedidos/form', {
      title: 'Nuevo Pedido',
      pedido: null,
      clientes,
      items: allItems,
      errors: { general: err.message || 'Error al crear el pedido' },
      currentPath: req.path,
    });
  }
}

export async function editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [pedido, clientes, items] = await Promise.all([
      pedidosService.obtenerPedido(req.params.id as string),
      clientesService.listarTodosLosClientes(),
      itemsService.listarItems(true),
    ]);
    res.render('pedidos/form', {
      title: `Editar Pedido #${pedido.numeroPedido}`,
      pedido,
      clientes,
      items,
      errors: {},
      currentPath: req.path,
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pedidoId = req.params.id as string;
    const body = req.body as Record<string, string>;

    const existing = await pedidosService.obtenerPedido(pedidoId);

    if (existing.estado !== 'PENDIENTE') {
      req.session.error = 'Solo se pueden editar pedidos en estado pendiente';
      res.redirect(`/admin/pedidos/${pedidoId}`);
      return;
    }

    if (req.body.nuevoItemId && req.body.nuevaCantidad) {
      await pedidosService.agregarItem(pedidoId, {
        itemId: req.body.nuevoItemId as string,
        cantidad: parseInt(req.body.nuevaCantidad as string, 10),
      });
    }

    req.session.success = 'Pedido actualizado exitosamente';
    res.redirect(`/admin/pedidos/${pedidoId}`);
  } catch (err: any) {
    req.session.error = err.message || 'Error al actualizar el pedido';
    res.redirect(`/admin/pedidos/${req.params.id as string}`);
  }
}

export async function cancelar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await pedidosService.cancelarPedido(req.params.id as string);
    req.session.success = 'Pedido cancelado exitosamente';
    res.redirect('/admin/pedidos');
  } catch (err: any) {
    req.session.error = err.message || 'Error al cancelar el pedido';
    res.redirect(`/admin/pedidos/${req.params.id as string}`);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await pedidosService.eliminarPedido(req.params.id as string);
    req.session.success = 'Pedido eliminado exitosamente';
    res.redirect('/admin/pedidos');
  } catch (err: any) {
    req.session.error = err.message || 'Error al eliminar el pedido';
    res.redirect(`/admin/pedidos/${req.params.id as string}`);
  }
}

export async function quitarItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await pedidosService.quitarItem(req.params.id as string, req.params.itemId as string);
    req.session.success = 'Item quitado del pedido';
    res.redirect(`/admin/pedidos/${req.params.id}`);
  } catch (err: any) {
    req.session.error = err.message || 'Error al quitar el item';
    res.redirect(`/admin/pedidos/${req.params.id}`);
  }
}
