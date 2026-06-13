import { addKeyword } from '@builderbot/bot'
import type { MemoryDB as Database } from '@builderbot/bot'
import type { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { clienteService } from '../services/cliente.service.js'
import { reclamoService } from '../services/reclamo.service.js'
import { normalizePhone } from '../utils/normalize-phone.js'
import { noRegistradoFlow } from './pedido.flow.js'

export const reclamoFlow = addKeyword<Provider, Database>('reclamo')
  .addAction(async (ctx, { flowDynamic, state, gotoFlow }) => {
    const telefono = normalizePhone(ctx.from)

    const clientes = await clienteService.listar({ telefono }).catch(() => [])
    if (clientes.length === 0) {
      return gotoFlow(noRegistradoFlow)
    }

    await state.update({ clienteId: clientes[0]!.id, clienteNombre: clientes[0]!.nombre })

    await flowDynamic(
      '📝 *Nuevo Reclamo*\n\n' +
      'Contanos brevemente cuál es el problema o qué reclamo querés hacer.\n\n' +
      'Ej: *el producto llegó en mal estado* o *no recibí mi pedido completo*'
    )
  })
  .addAnswer(
    'Describí tu reclamo:',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const descripcion = ctx.body.trim()
      if (descripcion.length < 10) {
        return fallBack('La descripción debe tener al menos 10 caracteres. Contanos un poco más sobre tu reclamo:')
      }
      await state.update({ descripcion })
    },
  )
  .addAction(async (ctx, { state, flowDynamic }) => {
    const st = await state.get() as { clienteNombre?: string; descripcion?: string }

    if (!st.descripcion) {
      await flowDynamic('No registramos tu reclamo. Escribí *reclamo* para empezar de nuevo.')
      return
    }

    await flowDynamic(
      '📋 *Resumen del reclamo:*\n\n' +
      `👤 *Cliente:* ${st.clienteNombre ?? '-'}\n` +
      `📝 *Reclamo:* ${st.descripcion}\n\n` +
      '✅ *SI* — para enviar\n' +
      '❌ *NO* — para cancelar'
    )
  })
  .addAnswer(
    '¿Confirmás el envío del reclamo?',
    { capture: true },
    async (ctx, { state, flowDynamic, fallBack }) => {
      const respuesta = ctx.body.trim().toUpperCase()
      if (respuesta === 'SI') {
        const st = await state.get() as { clienteId: string; clienteNombre?: string; descripcion?: string }

        try {
          const reclamo = await reclamoService.crear({ clienteId: st.clienteId, descripcion: st.descripcion! })
          await flowDynamic(
            `✅ *Reclamo registrado con éxito!*\n\n` +
            `Número de reclamo: *${reclamo.id.slice(0, 8)}*\n\n` +
            `📝 Tu reclamo: "${st.descripcion}"\n\n` +
            `Nos pondremos en contacto a la brevedad.\n` +
            `❓ Escribí *ayuda* para ver el menú`
          )
        } catch (err) {
          const msg = reclamoService.getErrorMessage(err)
          await flowDynamic(
            `❌ *Ocurrió un error al registrar tu reclamo*\n\n${msg}\n\n` +
            `Intentá de nuevo más tarde o escribí *ayuda* para asistencia.`
          )
        }
      } else if (respuesta === 'NO') {
        await flowDynamic('Reclamo cancelado. Escribí *reclamo* cuando quieras hacer otro.')
      } else {
        return fallBack('Respondé *SI* para enviar o *NO* para cancelar:')
      }
    },
  )
