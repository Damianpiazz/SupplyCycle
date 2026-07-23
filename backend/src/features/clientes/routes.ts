import { Router } from 'express';
import {
  listarController,
  obtenerController,
  crearController,
  actualizarController,
  eliminarController,
  historialController,
  consumoController,
  pedidosClienteController,
} from './controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';
import { apiKeyAuth } from '../../middleware/api-key-auth.js';

const router = Router();

// Rutas públicas (cualquier rol autenticado)
router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id/historial', apiKeyAuth, authenticate, historialController);
router.get('/:id/consumo', apiKeyAuth, authenticate, consumoController);
router.get('/:id/pedidos', apiKeyAuth, authenticate, pedidosClienteController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);

// Rutas admin-only or bot (via api key)
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), crearController);
router.patch('/:id', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), actualizarController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarController);

export default router;
