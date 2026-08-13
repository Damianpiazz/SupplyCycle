---
name: add-flow
description: Crea un flow nuevo en BuilderBot (Baileys/QR + MemoryDB) siguiendo los patrones reales del repo.
metadata:
  version: "1.1.0"
  tags: whatsapp, builderbot, baileys, flows
  scope: project
---

# add-flow — Crear un flow de WhatsApp

## Contexto / Propósito

El bot de SupplyCycle usa BuilderBot 1.4.1 con `@builderbot/provider-baileys` (conexión por QR) y `MemoryDB` (en memoria). Los flows existentes viven en `whatsapp-bot/src/flows/` y son: `welcome`, `alta`, `baja`, `cancelar`, `pedido`, `reclamo`.

Un flow es una conversación modular con keywords, captura de inputs y estado. NO usar Meta Cloud API directa ni PostgreSQL para esto.

## Pasos

1. **Crear** `whatsapp-bot/src/flows/<nombre>.flow.ts`:

```ts
import { addKeyword } from '@builderbot/bot'
import type { MemoryDB as Database } from '@builderbot/bot'
import type { BaileysProvider as Provider } from '@builderbot/provider-baileys'

export const miFlow = addKeyword<Provider, Database>('mi-keyword')
  .addAction(async (ctx, { flowDynamic, state }) => {
    await state.update({ dato: ctx.from })
    await flowDynamic('Hola! Respondé a la siguiente pregunta:')
  })
  .addAnswer(
    '¿Cuál es tu nombre?',
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const nombre = ctx.body.trim()
      if (nombre.length < 2) {
        return fallBack('El nombre debe tener al menos 2 caracteres. Decime tu nombre:')
      }
      await state.update({ nombre })
    },
  )
```

2. **Registrar el flow** en `whatsapp-bot/src/app.ts`:

```ts
import { miFlow } from './flows/index.js'
// ...
const adapterFlow = createFlow([welcomeFlow, altaFlow, /* ... */ miFlow])
```

3. **Exportarlo** desde `whatsapp-bot/src/flows/index.ts` (mismo patrón que los flows existentes).

4. **Testear** con Vitest: creá/actualizá el test en `src/flows/__tests__/` y corré `cd whatsapp-bot && npm test`.

## Reglas

- Keywords siempre en inglés (`'alta'`, `'cancelar'`, `EVENTS.WELCOME`)
- Estado solo con `state.update()` / `state.get()` — nunca variables globales
- Flows anidados van como último argumento de `addAnswer` (o con `gotoFlow`)
- Usar `fallBack` para re-capturar con mensaje de error
- Servicios (API/Prisma) van en `src/services/`; el flow los importa (ej. `clienteService`)
- Imports locales con extensión `.js` (ESM)
- Flows con `<Provider, Database>` como parámetros genéricos de `addKeyword`
- UI del mensaje en español (el repo usa emojis y `*negritas*` de WhatsApp)

## Checklist

- [ ] Archivo en `src/flows/<nombre>.flow.ts`
- [ ] Exportado desde `src/flows/index.ts`
- [ ] Registrado en `createFlow([...])` en `src/app.ts`
- [ ] Estado con `state.update()` / `state.get()`
- [ ] Keywords en inglés, mensajes en español
- [ ] Test en `src/flows/__tests__/` y `npm test` en verde
