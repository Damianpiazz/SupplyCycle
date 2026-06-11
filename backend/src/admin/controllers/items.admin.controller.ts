import type { Request, Response, NextFunction } from 'express';
import * as itemsService from '../../features/items/service.js';

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filterActivo = req.query.activo as string | undefined;
    const activo = filterActivo === 'true' ? true : filterActivo === 'false' ? false : undefined;
    const items = await itemsService.listarItems(activo);

    res.render('items/index', {
      title: 'Items',
      items,
      filterActivo: filterActivo || '',
    });
  } catch (err) {
    next(err);
  }
}

export async function createForm(_req: Request, res: Response): Promise<void> {
  res.render('items/form', {
    title: 'Nuevo Item',
    item: null,
    errors: {},
  });
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await itemsService.crearItem({
      nombre: b.nombre!,
      descripcion: b.descripcion || undefined,
      unidad: b.unidad!,
      precio: b.precio ? parseFloat(b.precio) : undefined,
    });

    req.session.success = 'Item creado exitosamente';
    res.redirect('/admin/items');
  } catch (err: any) {
    res.render('items/form', {
      title: 'Nuevo Item',
      item: null,
      errors: { general: err.message || 'Error al crear el item' },
    });
  }
}

export async function editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await itemsService.obtenerItem(req.params.id as string);
    res.render('items/form', {
      title: `Editar ${item.nombre}`,
      item,
      errors: {},
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const b = req.body as Record<string, string>;
    await itemsService.actualizarItem(req.params.id as string, {
      nombre: b.nombre || undefined,
      descripcion: b.descripcion !== undefined ? (b.descripcion || null) : undefined,
      unidad: b.unidad || undefined,
      precio: b.precio !== undefined ? (b.precio ? parseFloat(b.precio) : null) : undefined,
      activo: b.activo === 'true',
    });

    req.session.success = 'Item actualizado exitosamente';
    res.redirect('/admin/items');
  } catch (err: any) {
    req.session.error = err.message || 'Error al actualizar el item';
    res.redirect(`/admin/items/${req.params.id as string}/editar`);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await itemsService.eliminarItem(req.params.id as string);
    req.session.success = 'Item eliminado exitosamente';
    res.redirect('/admin/items');
  } catch (err: any) {
    req.session.error = err.message || 'Error al eliminar el item';
    res.redirect('/admin/items');
  }
}
