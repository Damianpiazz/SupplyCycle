import { Router } from 'express';
import {
  obtenerHoyController,
  obtenerController,
  listarController,
  confirmarController,
  cancelarRepartidorController,
  actualizarEstadoController,
  crearController,
  agregarItemController,
  actualizarCantidadItemController,
  quitarItemController,
  eliminarPedidoController,
} from './controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const router = Router();

// ─── Lectura — Admin y repartidor ─────────────────────────────────────────────
router.get('/hoy', authenticate, obtenerHoyController);
router.get('/', authenticate, listarController);
router.get('/:id', authenticate, obtenerController);

// ─── Escritura — Admin y repartidor ───────────────────────────────────────────
router.post('/', authenticate, requireRole('ADMIN', 'REPARTIDOR'), crearController);
router.patch('/:id/estado', authenticate, requireRole('ADMIN', 'REPARTIDOR'), actualizarEstadoController);
router.delete('/:id', authenticate, requireRole('ADMIN', 'REPARTIDOR'), eliminarPedidoController);

// ─── Items del pedido — Admin y repartidor ────────────────────────────────────
router.post('/:pedidoId/items', authenticate, requireRole('ADMIN', 'REPARTIDOR'), agregarItemController);
router.patch('/:pedidoId/items/:itemId', authenticate, requireRole('ADMIN', 'REPARTIDOR'), actualizarCantidadItemController);
router.delete('/:pedidoId/items/:itemId', authenticate, requireRole('ADMIN', 'REPARTIDOR'), quitarItemController);

// ─── Flujo de reparto — Solo repartidor ───────────────────────────────────────
router.patch('/:id/confirmar', authenticate, requireRole('REPARTIDOR'), confirmarController);
router.patch('/:id/cancelar', authenticate, requireRole('REPARTIDOR'), cancelarRepartidorController);

export default router;
