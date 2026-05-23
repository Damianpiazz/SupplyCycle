import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import pedidoRouter from './features/pedido/routes.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

// ============================================================
// Middleware global
// ============================================================

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ============================================================
// Health check
// ============================================================

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'SupplyCycle backend is running',
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

// ============================================================
// Rutas de features (versionadas)
// ============================================================

app.use('/api/v1/pedidos', pedidoRouter);

// ============================================================
// Middleware de errores (debe ir al final)
// ============================================================

app.use(errorHandler);

export default app;
