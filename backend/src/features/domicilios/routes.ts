import { Router } from 'express';
import {
  listarController,
  obtenerController,
  crearController,
  actualizarController,
  eliminarController,
  agregarDiaController,
  actualizarDiaController,
  eliminarDiaController,
  agregarHorarioController,
  actualizarHorarioController,
  eliminarHorarioController,
} from './controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const router = Router();

// ─── Domicilios ──────────────────────────────────────────────────────────────
router.get('/', authenticate, listarController);
router.get('/:id', authenticate, obtenerController);
router.post('/', authenticate, requireRole('ADMIN'), crearController);
router.patch('/:id', authenticate, requireRole('ADMIN'), actualizarController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarController);

// ─── Días ────────────────────────────────────────────────────────────────────
router.post('/:domicilioId/dias', authenticate, requireRole('ADMIN'), agregarDiaController);
router.patch('/:domicilioId/dias/:diaId', authenticate, requireRole('ADMIN'), actualizarDiaController);
router.delete('/:domicilioId/dias/:diaId', authenticate, requireRole('ADMIN'), eliminarDiaController);

// ─── Horarios ────────────────────────────────────────────────────────────────
router.post('/:domicilioId/dias/:diaId/horarios', authenticate, requireRole('ADMIN'), agregarHorarioController);
router.patch('/:domicilioId/dias/:diaId/horarios/:horarioId', authenticate, requireRole('ADMIN'), actualizarHorarioController);
router.delete('/:domicilioId/dias/:diaId/horarios/:horarioId', authenticate, requireRole('ADMIN'), eliminarHorarioController);

export default router;
