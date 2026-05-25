import { Router } from 'express';
import {
  listarController,
  obtenerController,
  cargaController,
  estadoController,
} from './controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, listarController);
router.get('/:id', authenticate, obtenerController);
router.get('/:id/carga', authenticate, cargaController);
router.patch('/:id/estado', authenticate, estadoController);

export default router;
