import { Router } from 'express';
import { diariasController, mensualesController } from './controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const router = Router();

// ─── Estadísticas diarias: GET /diarias?fecha=YYYY-MM-DD ──────────────────────
router.get('/diarias', authenticate, requireRole('ADMIN'), diariasController);

// ─── Estadísticas mensuales: GET /mensuales?anio=YYYY&mes=MM ─────────────────
router.get('/mensuales', authenticate, requireRole('ADMIN'), mensualesController);

export default router;
