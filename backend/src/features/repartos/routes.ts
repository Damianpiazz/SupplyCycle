import { Router } from 'express';
import {
  crearController,
  listarController,
  obtenerController,
  obtenerHoyController,
  listarAdminController,
  obtenerAdminController,
  cargaController,
  estadoController,
  agregarPedidoController,
  quitarPedidoController,
} from './controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, listarController);
router.get('/hoy', authenticate, requireRole('REPARTIDOR'), obtenerHoyController);
router.post('/', authenticate, requireRole('ADMIN'), crearController);
router.get('/admin', authenticate, requireRole('ADMIN'), listarAdminController);
router.get('/admin/:id', authenticate, requireRole('ADMIN'), obtenerAdminController);
router.post('/admin/:repartoId/pedidos', authenticate, requireRole('ADMIN'), agregarPedidoController);
router.delete('/admin/:repartoId/pedidos/:pedidoId', authenticate, requireRole('ADMIN'), quitarPedidoController);
router.get('/:id', authenticate, obtenerController);
router.get('/:id/carga', authenticate, cargaController);
router.patch('/:id/estado', authenticate, estadoController);

export default router;
