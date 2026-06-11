import { Router } from 'express';
import { requireAdminSession } from '../middleware/require-admin-session.js';
import { showLogin, login, logout } from '../controllers/auth.admin.controller.js';
import pedidosRouter from './pedidos.admin.routes.js';
import clientesRouter from './clientes.admin.routes.js';
import repartosRouter from './repartos.admin.routes.js';
import usuariosRouter from './usuarios.admin.routes.js';
import itemsRouter from './items.admin.routes.js';
import ciudadesRouter from './ciudades.admin.routes.js';
import domiciliosRouter from './domicilios.admin.routes.js';
import diasRouter from './dias.admin.routes.js';
import horariosRouter from './horarios.admin.routes.js';
import empleadosRouter from './empleados.admin.routes.js';
import visitasRouter from './visitas.admin.routes.js';
import retenidosRouter from './retenidos.admin.routes.js';
import reclamosRouter from './reclamos.admin.routes.js';

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
router.use('/ciudades', requireAdminSession, ciudadesRouter);
router.use('/domicilios', requireAdminSession, domiciliosRouter);
router.use('/dias', requireAdminSession, diasRouter);
router.use('/horarios', requireAdminSession, horariosRouter);
router.use('/empleados', requireAdminSession, empleadosRouter);
router.use('/visitas', requireAdminSession, visitasRouter);
router.use('/retenidos', requireAdminSession, retenidosRouter);
router.use('/reclamos', requireAdminSession, reclamosRouter);

export default router;
