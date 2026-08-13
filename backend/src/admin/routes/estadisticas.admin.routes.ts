import { Router } from 'express';
import * as ctrl from '../controllers/estadisticas.admin.controller.js';

const router = Router();

router.get('/demanda', ctrl.demanda);

export default router;
