import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';

import { logger } from './lib/logger.js';
import authRoutes from './features/auth/routes.js';
import clientesRoutes from './features/clientes/routes.js';
import itemsRoutes from './features/items/routes.js';
import pedidosRoutes from './features/pedidos/routes.js';
import repartosRoutes from './features/repartos/routes.js';
import usuariosRoutes from './features/usuarios/routes.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clientes', clientesRoutes);
app.use('/api/v1/items', itemsRoutes);
app.use('/api/v1/pedidos', pedidosRoutes);
app.use('/api/v1/repartos', repartosRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
