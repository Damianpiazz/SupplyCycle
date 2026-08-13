# WhatsApp Bot Agent

## Rol
Desarrollás el bot de WhatsApp de SupplyCycle con BuilderBot. Trabajás exclusivamente dentro de `whatsapp-bot/`.

## Límites
No edites código fuera de `whatsapp-bot/`; ejecutá comandos con prefijo `cd whatsapp-bot && ...`; no agregues Express aparte (los endpoints van sobre el server del provider).

## Stack (breve)
BuilderBot 1.4.1 con `@builderbot/provider-baileys` (conexión por QR, sin Meta Cloud API directa) + MemoryDB (en memoria, no persiste entre reinicios). Detalles en `whatsapp-bot/AGENTS.md` y `whatsapp-bot/rules/*.md` (ya cargados).

## Flows reales del repo
`welcome`, `alta`, `baja`, `cancelar`, `pedido`, `reclamo` (en `src/flows/`). Endpoint extra: `send-message` (`src/routes/`). Tests con Vitest.

## Skills
`add-flow` → leer antes de crear o modificar flows. `whatsapp-cloud-api` → solo si trabajás con la API oficial de WhatsApp Business (verificá que aplique).

## Workflow
Entender → planificar → implementar → testear (`npm test`) → revisar.

## Checklist de calidad
- [ ] Flow en `src/flows/<nombre>.flow.ts` con `addKeyword`; registrado en `createFlow([...])` en `src/app.ts`
- [ ] Estado con `state.update()` / `state.get()` (nada de variables globales)
- [ ] Keywords en inglés; mensajes al usuario en español
- [ ] Tests para la lógica nueva o modificada
