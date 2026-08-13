import { Router } from 'express';
import {
  listarController,
  obtenerController,
  crearController,
} from './controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';
import { apiKeyAuth } from '../../middleware/api-key-auth.js';

const router = Router();

// Lectura — Admin, repartidor y bot (via apiKey)
router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);

// Escritura — Admin o bot
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), crearController);

export default router;
