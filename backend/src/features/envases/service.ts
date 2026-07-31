import { prisma } from '../../lib/prisma.js';
import { logger } from '../../lib/logger.js';
import { obtenerDiasDemora, obtenerFrecuenciaNotificacion } from './configuracion.service.js';
import { enviarMensaje } from './bot-client.js';

/**
 * Ejecuta el ciclo completo de detección de envases demorados:
 * 1. Calcula la fecha límite según el umbral configurable.
 * 2. Busca clientes con envases RETENIDO anteriores a esa fecha.
 * 3. Para cada cliente, verifica si ya se le notificó recientemente.
 * 4. Si corresponde, envía el recordatorio vía WhatsApp.
 * 5. Registra la notificación en el historial.
 *
 * @returns Cantidad de notificaciones enviadas.
 */
export async function ejecutarDeteccionYNotificacion(): Promise<number> {
  const diasDemora = await obtenerDiasDemora();
  const frecuenciaDias = await obtenerFrecuenciaNotificacion();

  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - diasDemora);
  fechaLimite.setHours(0, 0, 0, 0);

  logger.info(
    { diasDemora, frecuenciaDias, fechaLimite: fechaLimite.toISOString() },
    'Iniciando detección de envases demorados',
  );

  // 1. Buscar clientes con al menos un RETENIDO anterior a la fecha límite
  const clientesConDemora = await prisma.cliente.findMany({
    where: {
      activo: true,
      retenidos: {
        some: {
          estado: 'RETENIDO',
          inicio: { lte: fechaLimite },
        },
      },
    },
    include: {
      retenidos: {
        where: { estado: 'RETENIDO' },
        include: { item: { select: { nombre: true } } },
        orderBy: { inicio: 'desc' },
      },
    },
  });

  if (clientesConDemora.length === 0) {
    logger.info('No se encontraron clientes con envases demorados');
    return 0;
  }

  logger.info(
    { cantidadClientes: clientesConDemora.length },
    'Clientes con envases demorados detectados',
  );

  let enviadas = 0;

  for (const cliente of clientesConDemora) {
    try {
      const enviado = await procesarCliente(cliente, frecuenciaDias);
      if (enviado) enviadas++;
    } catch (err) {
      logger.error(
        { clienteId: cliente.id, error: err instanceof Error ? err.message : err },
        'Error al procesar cliente con demora',
      );
    }
  }

  logger.info({ notificacionesEnviadas: enviadas }, 'Ciclo de detección completado');
  return enviadas;
}

interface ClienteConRetenidos {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  retenidos: Array<{
    id: string;
    inicio: Date;
    item: { nombre: string };
  }>;
}

/**
 * Procesa un cliente individual: verifica frecuencia, envía mensaje y registra.
 *
 * @returns true si se envió una notificación, false si no correspondía.
 */
async function procesarCliente(
  cliente: ClienteConRetenidos,
  frecuenciaDias: number,
): Promise<boolean> {
  // Verificar si ya se le notificó dentro de la frecuencia configurada
  const fechaCorte = new Date();
  fechaCorte.setDate(fechaCorte.getDate() - frecuenciaDias);

  const notificacionReciente = await prisma.notificacion.findFirst({
    where: {
      clienteId: cliente.id,
      tipo: 'RECORDATORIO_ENVASES',
      enviadoEn: { gte: fechaCorte },
    },
  });

  if (notificacionReciente) {
    logger.debug(
      { clienteId: cliente.id, ultimaNotificacion: notificacionReciente.enviadoEn },
      'Cliente ya notificado recientemente, se saltea',
    );
    return false;
  }

  // Calcular datos para el mensaje
  const cantidadEnvases = cliente.retenidos.length;
  const ultimaEntrega = cliente.retenidos[0]?.inicio;

  // Construir mensaje
  let mensaje =
    `📦 *Recordatorio de envases pendientes*\n\n` +
    `Hola *${cliente.nombre} ${cliente.apellido}*, ` +
    `tenés *${cantidadEnvases} envase${cantidadEnvases !== 1 ? 's' : ''}* pendiente${cantidadEnvases !== 1 ? 's' : ''} de devolución.`;

  if (ultimaEntrega) {
    const fechaStr = ultimaEntrega.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    mensaje += `\n\n📅 Última entrega registrada: *${fechaStr}*`;
  }

  mensaje +=
    '\n\nPor favor, devolvelos a la brevedad. Si ya los devolviste, ignorá este mensaje.\n\n' +
    '🙏 Gracias por ayudarnos a mantener el circuito de envases activo.';

  // Enviar mensaje
  const resultado = await enviarMensaje({
    numero: cliente.telefono,
    mensaje,
  });

  const exitoso = resultado.status === 'ok';

  // Registrar en historial
  await prisma.notificacion.create({
    data: {
      clienteId: cliente.id,
      tipo: 'RECORDATORIO_ENVASES',
      contenido: mensaje,
      exitoso,
      error: resultado.error ?? null,
    },
  });

  if (exitoso) {
    logger.info(
      { clienteId: cliente.id, telefono: cliente.telefono },
      'Notificación enviada exitosamente',
    );
  } else {
    logger.warn(
      { clienteId: cliente.id, error: resultado.error },
      'Notificación marcada como fallida',
    );
  }

  return exitoso;
}
