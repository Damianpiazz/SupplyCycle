import dotenv from 'dotenv';
import app from './app.js';
import { logger } from './lib/logger.js';
import { iniciarScheduler } from './features/envases/scheduler.js';

dotenv.config();

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

app.listen(PORT, () => {
  logger.info({ port: PORT }, `Server listening on port ${PORT}`);

  // Iniciar scheduler de detección de envases demorados (RF-12)
  iniciarScheduler();
});