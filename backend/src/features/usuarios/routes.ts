import { Router } from 'express';
import {
  listarController,
  obtenerController,
  crearController,
  actualizarController,
  desactivarController,
} from './controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/', listarController);
router.get('/:id', obtenerController);
router.post('/', crearController);
router.patch('/:id', actualizarController);
router.delete('/:id', desactivarController);

export default router;
