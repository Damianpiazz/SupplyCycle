import { Router } from 'express';
import { loginController, meController, updateMeController } from './controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/login', loginController);
router.get('/me', authenticate, meController);
router.patch('/me', authenticate, updateMeController);

export default router;
