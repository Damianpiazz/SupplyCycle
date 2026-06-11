import { Router } from 'express';
import * as ctrl from '../controllers/usuarios.admin.controller.js';

const router = Router();

router.get('/', ctrl.index);
router.get('/nuevo', ctrl.createForm);
router.post('/', ctrl.create);
router.post('/:id/desactivar', ctrl.desactivar);

export default router;
