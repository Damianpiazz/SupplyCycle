# WhatsApp Bot — BuilderBot + Meta API
## Stack
BuilderBot 1.4.1 (@builderbot/bot, @builderbot/provider-meta, @builderbot/database-postgres), TypeScript 5.4, Rollup, nodemon + tsx
## Comandos
- Dev: `npm run dev` (lint + nodemon + tsx)
- Build: `npm run build` (rollup -c → dist/app.js)
- Start: `npm run start` (node dist/app.js)
- Lint: `npm run lint` (eslint + typescript-eslint)
## Convenciones
- ESLint con plugin builderbot + typescript-eslint
- Path alias `~/` → `src/`
- Provider Meta: jwtToken, numberId, verifyToken, v18.0
- DB: POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_NAME, POSTGRES_DB_PASSWORD, POSTGRES_DB_PORT