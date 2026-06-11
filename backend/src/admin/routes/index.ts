import { Router } from 'express';
import { requireAdminSession } from '../middleware/require-admin-session.js';
import { showLogin, login, logout } from '../controllers/auth.admin.controller.js';
import pedidosRouter from './pedidos.admin.routes.js';
import clientesRouter from './clientes.admin.routes.js';
import repartosRouter from './repartos.admin.routes.js';
import usuariosRouter from './usuarios.admin.routes.js';
import itemsRouter from './items.admin.routes.js';

const router = Router();

// Auth — no requieren sesión
router.get('/login', showLogin);
router.post('/login', login);
router.post('/logout', logout);

// Dashboard
router.get('/', (_req, res) => {
  res.redirect('/admin/pedidos');
});

// Features — requieren sesión admin
router.use('/pedidos', requireAdminSession, pedidosRouter);
router.use('/clientes', requireAdminSession, clientesRouter);
router.use('/repartos', requireAdminSession, repartosRouter);
router.use('/usuarios', requireAdminSession, usuariosRouter);
router.use('/items', requireAdminSession, itemsRouter);

export default router;
