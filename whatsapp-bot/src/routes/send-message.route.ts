import type { BaileysProvider } from '@builderbot/provider-baileys'

type Handler = (bot: any, req: any, res: any) => Promise<any>
type Register = (path: string, ...handlers: any[]) => void

const BOT_API_KEY_INCOMING = process.env['BOT_API_KEY_INCOMING'] ?? ''

/**
  * Valida que el request incluya el header x-bot-api-key correcto.
  * Este es el canal backend → bot, usa una credencial separada de la
  * que el bot usa para llamar al backend (BOT_API_KEY).
  */
export function authMiddleware(req: any, res: any): boolean {
  const key = req.headers['x-bot-api-key']
  if (!BOT_API_KEY_INCOMING || key !== BOT_API_KEY_INCOMING) {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'error', error: 'Unauthorized: invalid or missing x-bot-api-key' }))
    return false
  }
  return true
}

/**
  * Valida que el número de teléfono tenga un formato básico válido:
  * - solo dígitos (sin +, espacios, guiones)
  * - entre 10 y 15 caracteres (rango típico de números WhatsApp con código de país)
  */
export function validarNumero(numero: string): { valido: true; numeroLimpio: string } | { valido: false; error: string } {
  const soloDigitos = numero.replace(/[^0-9]/g, '')

  if (soloDigitos.length < 10 || soloDigitos.length > 15) {
    return { valido: false, error: `Número inválido: debe tener entre 10 y 15 dígitos (recibidos: ${soloDigitos.length})` }
  }

  return { valido: true, numeroLimpio: soloDigitos }
}

/**
  * Handler principal del endpoint POST /v1/send-message.
  * Exportado para poder testearlo en aislamiento.
  */
export async function sendMessageHandler(bot: any, req: any, res: any): Promise<void> {
  // 1. Autenticación
  if (!authMiddleware(req, res)) return

  // 2. Validar body
  const { numero, mensaje } = req.body

  if (!numero || typeof numero !== 'string') {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ status: 'error', error: 'Campo "numero" requerido' }))
  }

  if (!mensaje || typeof mensaje !== 'string') {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ status: 'error', error: 'Campo "mensaje" requerido' }))
  }

  // 3. Validar formato del número
  const validacion = validarNumero(numero)
  if (!validacion.valido) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ status: 'error', error: validacion.error }))
  }

  try {
    // 4. Enviar mensaje vía BaileysProvider
    const jid = `${validacion.numeroLimpio}@s.whatsapp.net`

    await bot.provider.sendMessage(jid, mensaje)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ status: 'ok' }))
  } catch (err: any) {
    const errorMsg = err?.message ?? 'Error al enviar mensaje'
    console.error('[send-message] Error:', errorMsg)

    res.writeHead(500, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ status: 'error', error: errorMsg }))
  }
}

export function registerSendMessageRoutes(
  post: Register,
  handleCtx: (handler: Handler) => any,
): void {
  post(
    '/v1/send-message',
    handleCtx(sendMessageHandler),
  )
}
