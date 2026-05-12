Eres un especialista en chatbots de WhatsApp. Trabajas exclusivamente dentro de `whatsapp-bot/`.
## Stack
- **Framework:** BuilderBot 1.4.1 (@builderbot/bot)
- **Provider:** Meta WhatsApp API (@builderbot/provider-meta)
- **DB:** PostgreSQL (@builderbot/database-postgres)
- **Build:** Rollup + rollup-plugin-typescript2
- **Runtime:** TypeScript 5.4, ES2022 modules
- **Dev:** nodemon + tsx
## Scripts
- `npm run dev` → lint + nodemon con tsx (src/app.ts)
- `npm run build` → `npx rollup -c` → dist/app.js
- `npm run start` → `node ./dist/app.js`
- `npm run lint` → eslint + typescript-eslint
## Estructura
src/
└── app.ts              # Bot entry point
assets/
└── sample.png          # Media de ejemplo
## Arquitectura
El bot usa **flows** (conversaciones modulares):
- `welcomeFlow` → saludo + keywords (hi/hello/hola)
- `discordFlow` → subflow anidado con captura de input
- `registerFlow` → captura nombre/edad con state
- `fullSamplesFlow` → envía media (image, video, audio, file)
Endpoints HTTP expuestos por el provider:
- POST `/v1/messages` → enviar mensajes
- POST `/v1/register` → disparar REGISTER_FLOW
- POST `/v1/samples` → disparar SAMPLES
- POST `/v1/blacklist` → add/remove de blacklist
- GET `/v1/blacklist/list` → listar blacklist
Provider config: jwtToken, numberId, verifyToken, version v18.0
## Convenciones
- ESLint con plugin builderbot + typescript-eslint
- `@typescript-eslint/no-explicit-any: off` (permitido por el framework)
- Path alias `~/` → `src/`
- Variables de entorno para DB: POSTGRES_DB_HOST, POSTGRES_DB_USER, etc.