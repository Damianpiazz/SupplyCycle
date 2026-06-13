import { addKeyword, EVENTS } from '@builderbot/bot'
import type { MemoryDB as Database } from '@builderbot/bot'
import type { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { clienteService } from '../services/cliente.service.js'
import { normalizePhone } from '../utils/normalize-phone.js'

const MENU_CLIENTE = [
  '┌── *SUPPLYCYCLE* ──┐',
  '',
  '✅ *Bienvenido! Sos cliente registrado*',
  '',
  'Elegí una opción:',
  '',
  '📦 *pedir* — Hacer un nuevo pedido',
  '🔍 *estado* — Consultar el estado de tu pedido',
  '❌ *cancelar* — Cancelar un pedido',
  '📝 *reclamo* — Hacer un reclamo',
  '🚫 *baja* — Darme de baja como cliente',
  '❓ *ayuda* — Ver este menú de nuevo',
  '',
  '└────────────────────┘',
].join('\n')

const MENU_NO_CLIENTE = [
  '┌── *SUPPLYCYCLE* ──┐',
  '',
  '👋 *Hola! Soy el asistente virtual de SupplyCycle*',
  '',
  'Todavía no estás registrado como cliente.',
  'Elegí una opción:',
  '',
  '📋 *alta* — Darme de alta como cliente',
  '❓ *ayuda* — Ver este menú de nuevo',
  '',
  '└────────────────────┘',
].join('\n')

export const welcomeFlow = addKeyword<Provider, Database>(EVENTS.WELCOME)
  .addAction(async (ctx, { flowDynamic, state }) => {
    try {
      const clientes = await clienteService.listar({ telefono: normalizePhone(ctx.from) })

      if (clientes.length > 0) {
        await state.update({ esCliente: true, clienteId: clientes[0]!.id, clienteNombre: clientes[0]!.nombre })
        await flowDynamic(MENU_CLIENTE)
      } else {
        await state.update({ esCliente: false })
        await flowDynamic(MENU_NO_CLIENTE)
      }
    } catch (err) {
      await state.update({ esCliente: false })
      await flowDynamic(`⚠️ No pudimos verificar tu información. Intentá de nuevo en unos minutos.`)
    }
  })
