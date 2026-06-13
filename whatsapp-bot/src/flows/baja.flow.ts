import { addKeyword } from '@builderbot/bot'
import type { MemoryDB as Database } from '@builderbot/bot'
import type { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { clienteService } from '../services/cliente.service.js'
import { normalizePhone } from '../utils/normalize-phone.js'
import { noRegistradoFlow } from './pedido.flow.js'

export const bajaFlow = addKeyword<Provider, Database>('baja')
  .addAction(async (ctx, { flowDynamic, state, gotoFlow }) => {
    const telefono = normalizePhone(ctx.from)

    const clientes = await clienteService.listar({ telefono }).catch(() => [])
    if (clientes.length === 0) {
      return gotoFlow(noRegistradoFlow)
    }

    const cliente = clientes[0]!
    await state.update({ clienteId: cliente.id, clienteNombre: cliente.nombre })

    if (!cliente.activo) {
      await flowDynamic('Ya estás dado de baja como cliente. Escribí *alta* si querés registrarte de nuevo.')
      return
    }

    await flowDynamic(
      '⚠️ *Darse de Baja*\n\n' +
      `¿Estás seguro que querés darte de baja, ${cliente.nombre}?\n\n` +
      'Si te das de baja, el repartidor *no va a ir a tu casa* los días de entrega.\n\n' +
      'Siempre podés volver a registrarte después con *alta*.\n\n' +
      '✅ *SI* — para darme de baja\n' +
      '❌ *NO* — para cancelar'
    )
  })
  .addAnswer(
    '¿Confirmás la baja?',
    { capture: true },
    async (ctx, { state, flowDynamic, fallBack }) => {
      const respuesta = ctx.body.trim().toUpperCase()
      if (respuesta === 'SI') {
        const st = await state.get() as { clienteId: string; clienteNombre?: string }

        try {
          await clienteService.actualizar(st.clienteId, { activo: false })
          await flowDynamic(
            `✅ *Listo! Te dimos de baja exitosamente.*\n\n` +
            `${st.clienteNombre ?? ''}, el repartidor ya no va a pasar por tu casa.\n\n` +
            `Para volver a registrarte, escribí *alta* en cualquier momento.\n` +
            `❓ Escribí *ayuda* para ver el menú`
          )
        } catch (err) {
          const msg = clienteService.getErrorMessage(err)
          await flowDynamic(
            `❌ *Ocurrió un error al procesar la baja*\n\n${msg}\n\n` +
            `Intentá de nuevo más tarde o escribí *ayuda* para asistencia.`
          )
        }
      } else if (respuesta === 'NO') {
        await flowDynamic('Baja cancelada. Seguís siendo cliente de SupplyCycle.')
      } else {
        return fallBack('Respondé *SI* para confirmar la baja o *NO* para cancelar:')
      }
    },
  )
