import { Router } from 'express';
import { loginController, meController } from './controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/login', loginController);
router.get('/me', authenticate, meController);

export default router;
