import { addKeyword } from '@builderbot/bot'
import type { MemoryDB as Database } from '@builderbot/bot'
import type { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { clienteService } from '../services/cliente.service.js'
import { pedidoService } from '../services/pedido.service.js'
import { normalizePhone } from '../utils/normalize-phone.js'
import { noRegistradoFlow } from './pedido.flow.js'

const MOTIVOS = [
  { label: 'Ya no necesito el pedido', value: 'OTRO' },
  { label: 'La dirección es incorrecta', value: 'DIRECCION_INCORRECTA' },
  { label: 'No voy a estar para recibir', value: 'CLIENTE_AUSENTE' },
  { label: 'Otro motivo', value: 'OTRO' },
] as const

export const cancelarFlow = addKeyword<Provider, Database>('cancelar')
  .addAction(async (ctx, { flowDynamic, state, gotoFlow }) => {
    const telefono = normalizePhone(ctx.from)

    const clientes = await clienteService.listar({ telefono }).catch(() => [])
    if (clientes.length === 0) {
      return gotoFlow(noRegistradoFlow)
    }

    const clienteId = clientes[0]!.id
    await state.update({ clienteId, clienteNombre: clientes[0]!.nombre })

    const pedidos = await pedidoService.listar({ clienteId, estado: 'PENDIENTE' }).catch(() => [])
    if (pedidos.length === 0) {
      await flowDynamic('No tenés pedidos pendientes para cancelar.')
      return
    }

    await state.update({ pedidos })

    const lista = pedidos
      .map((p, i) => `${i + 1}. *${p.numeroPedido}* — ${new Date(p.fecha).toLocaleDateString('es-AR')}`)
      .join('\n')

    await flowDynamic(
      '❌ *Cancelar Pedido*\n\n' +
      'Estos son tus pedidos pendientes:\n\n' +
      `${lista}\n\n` +
      'Respondé el *número* del pedido que querés cancelar:'
    )
  })
  .addAnswer(
    'Elegí el número del pedido a cancelar:',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const idx = parseInt(ctx.body.trim(), 10)
      const st = await state.get() as { pedidos: Array<{ id: string; numeroPedido: string }> }

      if (!st.pedidos || st.pedidos.length === 0) {
        return fallBack('No hay pedidos cargados. Escribí *cancelar* para empezar de nuevo.')
      }

      if (isNaN(idx) || idx < 1 || idx > st.pedidos.length) {
        return fallBack(`Elegí un número del 1 al ${st.pedidos.length}:`)
      }

      await state.update({ pedidoId: st.pedidos[idx - 1]!.id, pedidoNumero: st.pedidos[idx - 1]!.numeroPedido })

      const menu = MOTIVOS.map((m, i) => `${i + 1}. ${m.label}`).join('\n')
      await flowDynamic(
        `Seleccionaste *${st.pedidos[idx - 1]!.numeroPedido}*.\n\n` +
        '¿Cuál es el motivo de la cancelación?\n\n' +
        `${menu}`
      )
    },
  )
  .addAnswer(
    'Elegí el motivo (1-4):',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const idx = parseInt(ctx.body.trim(), 10)

      if (isNaN(idx) || idx < 1 || idx > MOTIVOS.length) {
        const menu = MOTIVOS.map((m, i) => `${i + 1}. ${m.label}`).join('\n')
        return fallBack(`Elegí un número del 1 al ${MOTIVOS.length}:\n\n${menu}`)
      }

      const motivo = MOTIVOS[idx - 1]!
      await state.update({ motivo: motivo.value, motivoLabel: motivo.label })
    },
  )
  .addAction(async (ctx, { state, flowDynamic }) => {
    const st = await state.get() as {
      clienteNombre?: string
      pedidoNumero?: string
      motivoLabel?: string
    }

    if (!st.pedidoNumero || !st.motivoLabel) {
      await flowDynamic('Faltan datos. Escribí *cancelar* para empezar de nuevo.')
      return
    }

    await flowDynamic(
      '📋 *Resumen de cancelación:*\n\n' +
      `👤 *Cliente:* ${st.clienteNombre ?? '-'}\n` +
      `📦 *Pedido:* ${st.pedidoNumero}\n` +
      `❌ *Motivo:* ${st.motivoLabel}\n\n` +
      '✅ *SI* — para confirmar la cancelación\n' +
      '❌ *NO* — para cancelar'
    )
  })
  .addAnswer(
    '¿Confirmás la cancelación del pedido?',
    { capture: true },
    async (ctx, { state, flowDynamic, fallBack }) => {
      const respuesta = ctx.body.trim().toUpperCase()
      if (respuesta === 'SI') {
        const st = await state.get() as { pedidoId: string; pedidoNumero?: string; motivo: string; clienteNombre?: string }

        try {
          await pedidoService.cancelar(st.pedidoId, st.motivo)
          await flowDynamic(
            `✅ *Pedido cancelado con éxito!*\n\n` +
            `Pedido: *${st.pedidoNumero}*\n\n` +
            `🙌 Listo ${st.clienteNombre ?? ''}, ya cancelamos el pedido.\n\n` +
            `📦 Escribí *pedir* para hacer un nuevo pedido\n` +
            `❓ Escribí *ayuda* para ver el menú`
          )
        } catch (err) {
          const msg = pedidoService.getErrorMessage(err)
          await flowDynamic(
            `❌ *Ocurrió un error al cancelar el pedido*\n\n${msg}\n\n` +
            `Intentá de nuevo más tarde o escribí *ayuda* para asistencia.`
          )
        }
      } else if (respuesta === 'NO') {
        await flowDynamic('Cancelación abortada. Escribí *cancelar* cuando quieras cancelar un pedido.')
      } else {
        return fallBack('Respondé *SI* para confirmar o *NO* para cancelar:')
      }
    },
  )
