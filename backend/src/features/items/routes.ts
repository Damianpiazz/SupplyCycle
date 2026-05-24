import { Router } from 'express';
import { listarController, obtenerController } from './controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, listarController);
router.get('/:id', authenticate, obtenerController);

export default router;
