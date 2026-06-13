import { addKeyword } from '@builderbot/bot'
import type { MemoryDB as Database } from '@builderbot/bot'
import type { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { clienteService } from '../services/cliente.service.js'
import { itemService } from '../services/item.service.js'
import { pedidoService } from '../services/pedido.service.js'
import { normalizePhone } from '../utils/normalize-phone.js'

export const noRegistradoFlow = addKeyword<Provider, Database>('__no_registrado__')
  .addAnswer('No estás registrado como cliente. Escribí *alta* para darte de alta.')

export const pedidoFlow = addKeyword<Provider, Database>('pedir')
  .addAction(async (ctx, { flowDynamic, state, gotoFlow }) => {
    const telefono = normalizePhone(ctx.from)

    const clientes = await clienteService.listar({ telefono }).catch(() => [])
    if (clientes.length === 0) {
      return gotoFlow(noRegistradoFlow)
    }

    await state.update({ clienteId: clientes[0]!.id, clienteNombre: clientes[0]!.nombre })

    const items = await itemService.listar().catch(() => null)
    if (!items || items.length === 0) {
      await flowDynamic('No hay productos disponibles en este momento. Escribí *ayuda* para volver al menú.')
      return
    }

    await state.update({ items })

    const menu = items
      .map((item, i) => `${i + 1}. ${item.nombre} — $${item.precio ?? '-'} c/u`)
      .join('\n')

    await flowDynamic(
      '📦 *Nuevo Pedido*\n\n' +
      'Estos son los productos disponibles:\n\n' +
      `${menu}\n\n` +
      'Escribí los items que querés en formato *número x cantidad*.\n' +
      'Ej: *1x2, 3x4* (item 1 × 2 unidades, item 3 × 4 unidades)'
    )
  })
  .addAnswer(
    'Decime los items que querés (ej: *1x2, 3x4*):',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const parts = ctx.body.trim().split(/[,;\s]+/).filter(Boolean)
      const st = await state.get() as { items: Array<{ id: string; nombre: string }> }

      if (!st.items || st.items.length === 0) {
        return fallBack('No hay productos cargados. Escribí *pedir* para empezar de nuevo.')
      }

      const seleccion: Array<{ itemId: string; cantidad: number; nombre: string }> = []

      for (const part of parts) {
        const match = part.match(/^(\d+)\s*[xX×]\s*(\d+)$/)
        if (!match) {
          return fallBack(
            `No entendí "*${part}*". Usá el formato *número x cantidad*.\n` +
            'Ej: *1x2, 3x4*'
          )
        }

        const itemIdx = parseInt(match[1]!, 10) - 1
        const cantidad = parseInt(match[2]!, 10)
        const item = st.items[itemIdx]

        if (!item) {
          return fallBack(`El item número *${match[1]}* no existe. Revisá la lista e intentá de nuevo.`)
        }
        if (cantidad < 1) {
          return fallBack(`La cantidad para *${item.nombre}* debe ser al menos 1.`)
        }

        seleccion.push({ itemId: item.id, cantidad, nombre: item.nombre })
      }

      if (seleccion.length === 0) {
        return fallBack('No seleccionaste ningún item. Usá el formato *1x2, 3x4*')
      }

      await state.update({ seleccion })
    },
  )
  .addAction(async (ctx, { state, flowDynamic }) => {
    const st = await state.get() as {
      clienteNombre?: string
      seleccion?: Array<{ nombre: string; cantidad: number }>
    }

    if (!st.seleccion || st.seleccion.length === 0) {
      await flowDynamic('No hay items seleccionados. Escribí *pedir* para empezar de nuevo.')
      return
    }

    const lineas = [
      '📋 *Resumen del pedido:*',
      '',
      `👤 *Cliente:* ${st.clienteNombre ?? '-'}`,
      '',
      '🛒 *Items:*',
    ]
    for (const s of st.seleccion) {
      lineas.push(`  • ${s.nombre} × ${s.cantidad}`)
    }
    lineas.push('', '✅ *SI* — para confirmar', '❌ *NO* — para cancelar')
    await flowDynamic(lineas.join('\n'))
  })
  .addAnswer(
    '¿Confirmás el pedido?',
    { capture: true },
    async (ctx, { state, flowDynamic, fallBack }) => {
      const respuesta = ctx.body.trim().toUpperCase()
      if (respuesta === 'SI') {
        const st = await state.get() as {
          clienteId: string
          clienteNombre?: string
          seleccion: Array<{ itemId: string; cantidad: number }>
        }

        const hoy = new Date().toISOString().split('T')[0]!

        try {
          const pedido = await pedidoService.crear({
            clienteId: st.clienteId,
            fecha: hoy,
            items: st.seleccion.map((s) => ({ itemId: s.itemId, cantidad: s.cantidad })),
          })
          await flowDynamic(
            `✅ *Pedido confirmado con éxito!*\n\n` +
            `Número: *${pedido.numeroPedido}*\n` +
            `Estado: *${pedido.estado}*\n\n` +
            `🙌 Gracias ${st.clienteNombre ?? ''} por tu pedido!\n\n` +
            `📦 Escribí *estado* para consultar el estado\n` +
            `❓ Escribí *ayuda* para ver el menú`
          )
        } catch (err) {
          const msg = pedidoService.getErrorMessage(err)
          await flowDynamic(
            `❌ *Ocurrió un error al crear el pedido*\n\n${msg}\n\n` +
            `Intentá de nuevo más tarde o escribí *ayuda* para asistencia.`
          )
        }
      } else if (respuesta === 'NO') {
        await flowDynamic('Pedido cancelado. Escribí *pedir* cuando quieras hacer otro.')
      } else {
        return fallBack('Respondé *SI* para confirmar o *NO* para cancelar:')
      }
    },
  )
