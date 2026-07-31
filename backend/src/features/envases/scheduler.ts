import { schedule, validate, type ScheduledTask } from 'node-cron';
import { env } from '../../config/env.js';
import { logger } from '../../lib/logger.js';
import { ejecutarDeteccionYNotificacion } from './service.js';

let tarea: ScheduledTask | null = null;

/**
 * Inicia el scheduler de detección de envases demorados.
 * Se ejecuta según la expresión cron configurada en CRON_ENVASES_DEMORADOS
 * (default: "0 8 * * *" → todos los días a las 8:00).
 */
export function iniciarScheduler(): void {
  if (tarea) {
    logger.warn('El scheduler de envases ya está iniciado');
    return;
  }

  const expresion = env.cronEnvasesDemorados;

  // Validar expresión cron
  if (!validate(expresion)) {
    logger.error(
      { expresion },
      'Expresión CRON_ENVASES_DEMORADOS inválida. No se iniciará el scheduler.',
    );
    return;
  }

  logger.info(
    { expresion },
    'Iniciando scheduler de detección de envases demorados',
  );

  tarea = schedule(expresion, async () => {
    logger.info('Ejecutando job programado: detección de envases demorados');
    try {
      const enviadas = await ejecutarDeteccionYNotificacion();
      logger.info(
        { notificacionesEnviadas: enviadas },
        'Job de detección de envases demorados completado',
      );
    } catch (err) {
      logger.error(
        { error: err instanceof Error ? err.message : err },
        'Error en job de detección de envases demorados',
      );
    }
  });

  logger.info('Scheduler de envases demorados iniciado correctamente');
}

/**
 * Detiene el scheduler. Útil para tests o graceful shutdown.
 */
export function detenerScheduler(): void {
  if (tarea) {
    tarea.stop();
    tarea = null;
    logger.info('Scheduler de envases demorados detenido');
  }
}
