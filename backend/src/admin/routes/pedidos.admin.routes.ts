import { Router } from 'express';
import * as ctrl from '../controllers/pedidos.admin.controller.js';

const router = Router();

router.get('/', ctrl.index);
router.get('/nuevo', ctrl.createForm);
router.post('/', ctrl.create);
router.get('/:id', ctrl.show);
router.get('/:id/editar', ctrl.editForm);
router.post('/:id', ctrl.update);
router.post('/:id/cancelar', ctrl.cancelar);
router.post('/:id/eliminar', ctrl.eliminar);
router.post('/:id/items/:itemId/quitar', ctrl.quitarItem);

export default router;
