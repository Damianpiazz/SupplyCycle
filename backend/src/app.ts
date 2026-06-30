import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import { pinoHttp } from 'pino-http';

import { logger } from './lib/logger.js';
import { env } from './config/env.js';
import authRoutes from './features/auth/routes.js';
import clientesRoutes from './features/clientes/routes.js';
import domiciliosRoutes from './features/domicilios/routes.js';
import itemsRoutes from './features/items/routes.js';
import pedidosRoutes from './features/pedidos/routes.js';
import repartosRoutes from './features/repartos/routes.js';
import usuariosRoutes from './features/usuarios/routes.js';
import estadisticasRoutes from './features/estadisticas/routes.js';
import adminRoutes from './admin/routes/index.js';
import { errorHandler } from './middleware/error-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & parsing
app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logger
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: req.body,
        };
      },
    },
  }),
);

// Response logger
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (body: any) => {
    logger.info({
      request: {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
      },
      response: {
        statusCode: res.statusCode,
        body,
      },
    });

    return originalJson(body);
  };

  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'admin/views'));

// Static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Make session data available to all views
app.use((req, res, next) => {
  res.locals.success = req.session?.success;
  delete req.session?.success;

  res.locals.error = req.session?.error;
  delete req.session?.error;

  res.locals.userId = req.session?.userId;
  res.locals.userNombre = req.session?.userNombre;
  res.locals.currentPath = req.path;

  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clientes', clientesRoutes);
app.use('/api/v1/domicilios', domiciliosRoutes);
app.use('/api/v1/items', itemsRoutes);
app.use('/api/v1/pedidos', pedidosRoutes);
app.use('/api/v1/repartos', repartosRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/estadisticas', estadisticasRoutes);

// Admin EJS routes
app.use('/admin', adminRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;