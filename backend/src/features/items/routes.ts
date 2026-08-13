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

router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);

// CRUD (SPEC-03): solo ADMIN (apiKeyAuth pasa con/sin key; authenticate valida
// JWT; requireRole cierra para REPARTIDOR/BOT).
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN'), crearController);
router.patch('/:id', apiKeyAuth, authenticate, requireRole('ADMIN'), actualizarController);
router.delete('/:id', apiKeyAuth, authenticate, requireRole('ADMIN'), eliminarController);

export default router;
