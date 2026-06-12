import { Router } from 'express';
import { listarController, obtenerController } from './controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { apiKeyAuth } from '../../middleware/api-key-auth.js';

const router = Router();

router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);

export default router;
