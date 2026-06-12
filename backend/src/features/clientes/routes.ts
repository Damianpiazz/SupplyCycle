import { Router } from 'express';
import {
  listarController,
  obtenerController,
  crearController,
  actualizarController,
  eliminarController,
} from './controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';
import { apiKeyAuth } from '../../middleware/api-key-auth.js';

const router = Router();

// Rutas públicas (cualquier rol autenticado)
router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);

// Rutas admin-only
router.post('/', authenticate, requireRole('ADMIN'), crearController);
router.patch('/:id', authenticate, requireRole('ADMIN'), actualizarController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarController);

export default router;
