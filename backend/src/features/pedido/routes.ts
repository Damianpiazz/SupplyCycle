import { Router } from 'express';

import { authenticate } from '../../middleware/auth.js';
import * as pedidoController from './controller.js';

const router = Router();

/**
 * PATCH /api/v1/pedidos/:id/confirmar
 * - Requiere autenticación
 * - Valida que :id sea UUID en el controller (Zod opcional en el futuro)
 * - Body: vacío
 */
router.patch('/:id/confirmar', authenticate, pedidoController.confirmarEntrega);

/**
 * PATCH /api/v1/pedidos/:id/cancelar
 * - Requiere autenticación
 * - Valida body con cancelarPedidoSchema en el controller
 * - Body: { motivo: MotivoFalla }
 */
router.patch('/:id/cancelar', authenticate, pedidoController.registrarFalla);

export default router;
