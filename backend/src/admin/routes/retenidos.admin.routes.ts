import { Router } from 'express';
import * as ctrl from '../controllers/retenidos.admin.controller.js';

const router = Router();
router.get('/', ctrl.index);
router.get('/nuevo', ctrl.createForm);
router.post('/', ctrl.create);
router.get('/:id/editar', ctrl.editForm);
router.post('/:id', ctrl.update);
router.post('/:id/eliminar', ctrl.eliminar);
export default router;
