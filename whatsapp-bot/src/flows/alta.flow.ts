import { addKeyword } from '@builderbot/bot'
import type { MemoryDB as Database } from '@builderbot/bot'
import type { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { clienteService } from '../services/cliente.service.js'
import { normalizePhone } from '../utils/normalize-phone.js'

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'] as const

export const yaRegistradoFlow = addKeyword<Provider, Database>('__ya_registrado__')
  .addAnswer('Ya estás registrado como cliente. Escribí *pedir* para hacer un pedido.')

export const altaFlow = addKeyword<Provider, Database>('alta')
  .addAction(async (ctx, { flowDynamic, state, gotoFlow }) => {
    const telefono = normalizePhone(ctx.from)
    try {
      const clientes = await clienteService.listar({ telefono })
      if (clientes.length > 0) {
        return gotoFlow(yaRegistradoFlow)
      }
    } catch {
      // Si la API falla, continuamos igual
    }
    await state.update({ telefono })
    await flowDynamic(
      '¡Genial! Vamos a registrarte como cliente 🙌\n\n' +
      'Respondé las siguientes preguntas para completar el registro:'
    )
  })
  .addAnswer(
    '¿Cuál es tu *nombre*?',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const nombre = ctx.body.trim()
      if (nombre.length < 2) {
        return fallBack('El nombre debe tener al menos 2 caracteres. Decime tu nombre:')
      }
      await state.update({ nombre })
    },
  )
  .addAnswer(
    '¿Cuál es tu *apellido*?',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const apellido = ctx.body.trim()
      if (apellido.length < 2) {
        return fallBack('El apellido debe tener al menos 2 caracteres. Decime tu apellido:')
      }
      await state.update({ apellido })
    },
  )
  .addAnswer(
    '¿Cuál es tu *calle*?',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const calle = ctx.body.trim()
      if (!calle) {
        return fallBack('La calle no puede estar vacía. Decime tu calle:')
      }
      await state.update({ calle })
    },
  )
  .addAnswer(
    '¿Cuál es el *número* de tu casa o local?',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const numero = ctx.body.trim()
      if (!numero) {
        return fallBack('El número no puede estar vacío. Decime el número:')
      }
      await state.update({ numero })
    },
  )
  .addAnswer(
    '¿Cuál es tu *localidad*?\n\n(Si no respondés, usamos "La Plata")',
    { capture: true },
    async (ctx, { state }) => {
      const localidad = ctx.body.trim() || 'La Plata'
      await state.update({ localidad })
    },
  )
  .addAnswer(
    '¿Qué *día* preferís para la entrega?\n\n' +
    '1️⃣ LUNES\n2️⃣ MARTES\n3️⃣ MIERCOLES\n4️⃣ JUEVES\n5️⃣ VIERNES\n6️⃣ SÁBADO\n\n' +
    'Respondé con el *número* del día:',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const idx = parseInt(ctx.body.trim(), 10)
      if (isNaN(idx) || idx < 1 || idx > 6) {
        return fallBack(
          'Elegí un número del 1 al 6:\n\n' +
          '1️⃣ LUNES\n2️⃣ MARTES\n3️⃣ MIERCOLES\n4️⃣ JUEVES\n5️⃣ VIERNES\n6️⃣ SÁBADO'
        )
      }
      await state.update({ diaEntrega: DIAS[idx - 1] })
    },
  )
  .addAnswer(
    '¿Desde qué *hora* preferís recibir?\n\nFormato: *HH:MM* (ej: 09:00)',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const hora = ctx.body.trim()
      if (!/^\d{2}:\d{2}$/.test(hora)) {
        return fallBack('Formato inválido. Usá *HH:MM* (ej: 09:00)')
      }
      await state.update({ horarioDesde: hora })
    },
  )
  .addAnswer(
    '¿Hasta qué *hora* preferís recibir?\n\nFormato: *HH:MM* (ej: 13:00)',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const hora = ctx.body.trim()
      if (!/^\d{2}:\d{2}$/.test(hora)) {
        return fallBack('Formato inválido. Usá *HH:MM* (ej: 13:00)')
      }
      const st = (await state.get()) as { horarioDesde?: string }
      if (!st.horarioDesde || hora <= st.horarioDesde) {
        return fallBack(`El horario debe ser posterior a las *${st.horarioDesde}*. Decime la hora de fin:`)
      }
      await state.update({ horarioHasta: hora })
    },
  )
  .addAnswer(
    '¿Alguna *observación*? (ej: timbre, piso, referencia)\n\nSi no tenés, respondé *no*',
    { capture: true },
    async (ctx, { state }) => {
      const obs = ctx.body.trim()
      const ignorar = ['0', 'no', 'ninguna', 'ninguno', 'n', '-']
      const observaciones = ignorar.includes(obs.toLowerCase()) ? undefined : obs
      await state.update({ observaciones })
    },
  )
  .addAction(async (ctx, { state, flowDynamic }) => {
    const st = await state.get() as Record<string, unknown>
    const lineas = [
      '📋 *Confirmá tus datos:*',
      '',
      `👤 *Nombre:* ${st.nombre}`,
      `👤 *Apellido:* ${st.apellido}`,
      `📍 *Dirección:* ${st.calle} ${st.numero}, ${st.localidad}`,
      `📅 *Día de entrega:* ${st.diaEntrega}`,
      `🕐 *Horario:* ${st.horarioDesde} → ${st.horarioHasta}`,
    ]
    if (st.observaciones) {
      lineas.push(`📝 *Obs:* ${st.observaciones}`)
    }
    lineas.push('', '✅ *SI* — para confirmar', '❌ *NO* — para cancelar')
    await flowDynamic(lineas.join('\n'))
  })
  .addAnswer(
    '¿Confirmás el registro?',
    { capture: true },
    async (ctx, { state, flowDynamic, fallBack }) => {
      const respuesta = ctx.body.trim().toUpperCase()
      if (respuesta === 'SI') {
        const st = await state.get() as Record<string, unknown>
        try {
          const cliente = await clienteService.crear({
            nombre: st.nombre as string,
            apellido: st.apellido as string,
            telefono: st.telefono as string,
            domicilios: [{
              calle: st.calle as string,
              numero: st.numero as string,
              localidad: st.localidad as string,
              latitud: 0,
              longitud: 0,
              principal: true,
              dias: [{
                nombre: st.diaEntrega as string,
                horarios: [
                  { inicio: st.horarioDesde as string, fin: st.horarioHasta as string },
                ],
              }],
            }],
            observaciones: (st.observaciones as string) || undefined,
          })
          await flowDynamic(
            `✅ *Registro completado con éxito!*\n\n` +
            `Bienvenido ${cliente.nombre}! Ya sos parte de SupplyCycle.\n\n` +
            `📦 Escribí *pedir* para hacer tu primer pedido\n` +
            `❓ Escribí *ayuda* para ver el menú`
          )
        } catch (err) {
          const msg = clienteService.getErrorMessage(err)
          await flowDynamic(
            `❌ *Ocurrió un error al registrarte*\n\n${msg}\n\n` +
            `Intentá de nuevo más tarde o escribí *ayuda* si necesitas asistencia.`
          )
        }
      } else if (respuesta === 'NO') {
        await flowDynamic('No hay problema. Escribí *alta* cuando quieras registrarte.')
      } else {
        return fallBack('Respondé *SI* para confirmar o *NO* para cancelar:')
      }
    },
  )
