# WhatsApp Bot — BuilderBot + Baileys
## Stack
BuilderBot 1.4.1 (@builderbot/bot, @builderbot/provider-baileys), TypeScript 5.4, Rollup, nodemon + tsx
## Comandos
- Dev: `npm run dev` (lint + nodemon + tsx)
- Build: `npm run build` (rollup -c → dist/app.js)
- Start: `npm run start` (node dist/app.js)
- Lint: `npm run lint` (eslint + typescript-eslint)
## Convenciones
- ESLint con plugin builderbot + typescript-eslint
- Path alias `~/` → `src/`
- Provider Baileys: conexión por QR code (sin configuración extra)
- DB: MemoryDB (en memoria, no requiere configuración)