import { Router } from 'express';
import {
  obtenerHoyController,
  obtenerDisponiblesController,
  obtenerController,
  listarController,
  confirmarController,
  cancelarRepartidorController,
  cancelarClienteController,
  cancelarController,
  actualizarEstadoController,
  crearController,
  agregarItemController,
  actualizarCantidadItemController,
  quitarItemController,
  eliminarPedidoController,
} from './controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';
import { apiKeyAuth } from '../../middleware/api-key-auth.js';

const router = Router();

// ─── Lectura — Admin, repartidor y bot ────────────────────────────────────────
router.get('/hoy', apiKeyAuth, authenticate, obtenerHoyController);
router.get('/disponibles', authenticate, requireRole('ADMIN'), obtenerDisponiblesController);
router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);

// ─── Escritura — Admin, repartidor y bot ──────────────────────────────────────
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT'), crearController);
router.patch('/:id/estado', authenticate, requireRole('ADMIN', 'REPARTIDOR'), actualizarEstadoController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarPedidoController);

// ─── Items del pedido — Admin, repartidor y bot ───────────────────────────────
router.post('/:pedidoId/items', apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT'), agregarItemController);
router.patch('/:pedidoId/items/:itemId', apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT'), actualizarCantidadItemController);
router.delete('/:pedidoId/items/:itemId', authenticate, requireRole('ADMIN'), quitarItemController);

// ─── Flujo de reparto — Solo repartidor ───────────────────────────────────────
router.patch('/:id/confirmar', authenticate, requireRole('REPARTIDOR'), confirmarController);
router.patch('/:id/cancelar', authenticate, requireRole('REPARTIDOR'), cancelarRepartidorController);

// ─── Cancelación por cliente — Admin o bot ────────────────────────────────────
router.patch('/:id/cancelar-cliente', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), cancelarClienteController);

// ─── Cancelación por admin — Admin (SPEC-05) ──────────────────────────────────
router.post('/:id/cancelar', authenticate, requireRole('ADMIN'), cancelarController);

export default router;
