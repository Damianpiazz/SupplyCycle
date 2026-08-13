import type { Request, Response, NextFunction } from 'express';
import { estimarDemanda } from '../../features/estadisticas/service.js';

export async function demanda(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const periodo = Math.min(365, Math.max(1, parseInt(req.query.periodo as string) || 30));
    const incluirClientes = req.query.incluirClientes !== 'false';
    const data = await estimarDemanda(periodo, incluirClientes);
    res.render('estadisticas/demanda', {
      title: 'Demanda Estimada',
      data,
      periodo,
      incluirClientes,
      currentPath: '/admin/estadisticas/demanda',
    });
  } catch (err) {
    next(err);
  }
}
