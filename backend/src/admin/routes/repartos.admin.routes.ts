import { Router } from 'express';
import * as ctrl from '../controllers/repartos.admin.controller.js';

const router = Router();

router.get('/', ctrl.index);
router.get('/nuevo', ctrl.createForm);
router.post('/', ctrl.create);
router.get('/:id', ctrl.show);
router.post('/:id/pedidos', ctrl.agregarPedido);
router.post('/:id/pedidos/:pedidoId/quitar', ctrl.quitarPedido);

export default router;
