import { env } from '../../config/env.js';
import { logger } from '../../lib/logger.js';

export interface EnviarMensajePayload {
  numero: string;
  mensaje: string;
}

export interface EnviarMensajeRespuesta {
  status: 'ok' | 'error';
  error?: string;
}

/**
 * Envía un mensaje de WhatsApp a través del bot.
 * Usa x-bot-api-key para autenticarse (canal backend→bot).
 */
export async function enviarMensaje(payload: EnviarMensajePayload): Promise<EnviarMensajeRespuesta> {
  const url = `${env.botApiUrl}/v1/send-message`;

  logger.info({ url, numero: payload.numero }, 'Enviando mensaje al bot');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bot-api-key': env.botApiKeyOutgoing,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.error(
        { status: response.status, body },
        'Error al enviar mensaje al bot',
      );
      return {
        status: 'error',
        error: `HTTP ${response.status}: ${body}`,
      };
    }

    const data = (await response.json()) as EnviarMensajeRespuesta;
    return data;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    logger.error({ error: message }, 'Error de red al contactar al bot');
    return { status: 'error', error: message };
  }
}
