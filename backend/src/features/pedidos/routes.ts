import { Router } from 'express';
import {
  obtenerHoyController,
  obtenerController,
  listarController,
  confirmarController,
  cancelarController,
  crearController,
} from './controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/hoy', authenticate, obtenerHoyController);
router.get('/', authenticate, listarController);
router.post('/', authenticate, crearController);
router.get('/:id', authenticate, obtenerController);
router.patch('/:id/confirmar', authenticate, confirmarController);
router.patch('/:id/cancelar', authenticate, cancelarController);

export default router;
