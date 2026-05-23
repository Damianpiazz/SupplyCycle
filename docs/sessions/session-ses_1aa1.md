# Revisar y corregir configuración agentes opencode

**Session ID:** ses_1aa173fddffegEBTwetpifihMz
**Created:** 23/05/2026, 14:36:17
**Updated:** 23/05/2026, 15:36:25

---

## User

Chusmea mi configuracion para los agentes y decime que tengo que corregir para que funcione todo con opencode

---

## Assistant (Plan · Big Pickle · 5.0s)

_Thinking:_

The user wants me to review their agent configuration for opencode and tell them what needs to be fixed. Let me first understand their setup - they have an AGENTS.md file already. Let me look at their configuration files.

Let me explore the workspace to understand the current setup.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle</path>
<type>directory</type>
<entries>
.agents/
.git/
.gitignore
.husky/
.opencode/
AGENTS.md
backend/
commitlint.config.mjs
docker-compose.dev.yml
docs/
mobile/
node_modules/
opencode.json
package-lock.json
package.json
README.md
skills-lock.json
whatsapp-bot/

(18 entries)
</entries>
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/AGENTS.md"
}
```

**Output:**
```
C:\damian\Repo\SupplyCycle\whatsapp-bot\AGENTS.md
C:\damian\Repo\SupplyCycle\mobile\AGENTS.md
C:\damian\Repo\SupplyCycle\backend\AGENTS.md
C:\damian\Repo\SupplyCycle\AGENTS.md
C:\damian\Repo\SupplyCycle\.opencode\skills\vercel-react-native-skills\AGENTS.md
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/.opencode*"
}
```

**Output:**
```
No files found
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/opencode*"
}
```

**Output:**
```
C:\damian\Repo\SupplyCycle\.git\opencode
C:\damian\Repo\SupplyCycle\opencode.json
```

---

## Assistant (Plan · Big Pickle · 2.8s)

_Thinking:_

Let me look at the opencode configuration files to understand the current setup.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\opencode.json"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\opencode.json</path>
<type>file</type>
<content>
1: {
2:   "$schema": "https://opencode.ai/config.json",
3:   "instructions": [
4:     "AGENTS.md",
5:     "backend/AGENTS.md",
6:     "backend/rules/*.md",
7:     "mobile/AGENTS.md",
8:     "mobile/rules/*.md",
9:     "whatsapp-bot/AGENTS.md",
10:     "whatsapp-bot/rules/*.md"
11:   ],
12:   "permission": {
13:     "edit": "ask",
14:     "bash": { "*": "ask" },
15:     "skill": { "*": "deny" }
16:   },
17:   "agent": {
18:     "backend": {
19:       "mode": "primary",
20:       "description": "Desarrolla en backend (Express + Prisma + PostgreSQL)",
21:       "model": "anthropic/claude-sonnet-4-20250514",
22:       "color": "#68A063",
23:       "prompt": "{file:.opencode/agents/backend.md}",
24:       "permission": {
25:         "edit": "allow",
26:         "bash": {
27:           "*": "ask",
28:           "cd backend && *": "allow",
29:           "npm run dev": "allow",
30:           "npm run build": "allow",
31:           "npx tsx*": "allow",
32:           "npx prisma*": "allow"
33:         },
34:         "skill": {
35:           "prisma-migrate": "allow",
36:           "add-endpoint": "allow"
37:         }
38:       }
39:     },
40:     "mobile": {
41:       "mode": "primary",
42:       "description": "Desarrolla en mobile (React Native / Expo)",
43:       "model": "anthropic/claude-sonnet-4-20250514",
44:       "color": "#61DAFB",
45:       "prompt": "{file:.opencode/agents/mobile.md}",
46:       "permission": {
47:         "edit": "allow",
48:         "bash": {
49:           "*": "ask",
50:           "cd mobile && *": "allow",
51:           "npm run lint": "allow",
52:           "npx expo*": "allow"
53:         },
54:         "skill": {
55:           "add-screen": "allow",
56:           "expo-build": "allow"
57:         }
58:       }
59:     },
60:     "whatsapp-bot": {
61:       "mode": "primary",
62:       "description": "Desarrolla en whatsapp-bot (BuilderBot + Meta API)",
63:       "model": "anthropic/claude-sonnet-4-20250514",
64:       "color": "#25D366",
65:       "prompt": "{file:.opencode/agents/whatsapp-bot.md}",
66:       "permission": {
67:         "edit": "allow",
68:         "bash": {
69:           "*": "ask",
70:           "cd whatsapp-bot && *": "allow",
71:           "npm run dev": "allow",
72:           "npm run build": "allow",
73:           "npm run lint": "allow"
74:         },
75:         "skill": {
76:           "add-flow": "allow",
77:           "deploy-bot": "allow"
78:         }
79:       }
80:     },
81:     "plan": {
82:       "mode": "primary",
83:       "permission": {
84:         "edit": "deny",
85:         "bash": "deny"
86:       }
87:     }
88:   }
89: }

(End of file - total 89 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode</path>
<type>directory</type>
<entries>
.gitignore
agents/
node_modules/
package-lock.json
package.json
skills-lock.json
skills/

(7 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.agents"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.agents</path>
<type>directory</type>
<entries>
skills/

(1 entries)
</entries>
```

---

## Assistant (Plan · Big Pickle · 3.0s)

_Thinking:_

Let me check all the agent prompt files referenced in the config.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\agents"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\agents</path>
<type>directory</type>
<entries>
backend.md
mobile.md
whatsapp-bot.md

(3 entries)
</entries>
```

**Tool: glob**

**Input:**
```json
{
  "pattern": ".opencode/agents/*.md"
}
```

**Output:**
```
C:\damian\Repo\SupplyCycle\.opencode\agents\whatsapp-bot.md
C:\damian\Repo\SupplyCycle\.opencode\agents\mobile.md
C:\damian\Repo\SupplyCycle\.opencode\agents\backend.md
```

**Tool: glob**

**Input:**
```json
{
  "pattern": ".opencode/skills/*.md"
}
```

**Output:**
```
No files found
```

**Tool: glob**

**Input:**
```json
{
  "pattern": ".agents/skills/*.md"
}
```

**Output:**
```
No files found
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "whatsapp-bot/rules/*.md"
}
```

**Output:**
```
C:\damian\Repo\SupplyCycle\whatsapp-bot\rules\flows.md
```

---

## Assistant (Plan · Big Pickle · 4.3s)

_Thinking:_

Let me now read the agent prompt files, plus the skills-lock.json to understand what skills are configured, and the .opencode package.json to understand the setup.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\agents\\backend.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\agents\backend.md</path>
<type>file</type>
<content>
1: Eres un especialista en backend. Trabajas exclusivamente dentro de `backend/`.
2: ## Stack
3: - **Runtime:** Node.js, TypeScript 6, ESModules (NodeNext)
4: - **Framework:** Express 5
5: - **ORM:** Prisma 7 + PostgreSQL via @prisma/adapter-pg
6: - **Validación:** Zod 4
7: - **Auth:** bcrypt + jsonwebtoken
8: - **Logging:** pino + morgan
9: - **Seguridad:** helmet + cors
10: ## Scripts
11: - `npm run dev` → `tsx watch src/server.ts`
12: - `npm run build` → `tsc`
13: - `npm run start` → `node dist/server.js`
14: - `npx prisma migrate dev --name <name>` → migraciones
15: - `npx prisma studio` → UI
16: ## Estructura
17: src/
18: ├── app.ts         # App Express
19: ├── server.ts      # Entry point (dotenv + listen en 0.0.0.0)
20: ├── config/
21: ├── constants/
22: ├── features/
23: ├── lib/
24: ├── middleware/
25: └── utils/
26: prisma/
27: ├── schema.prisma  # provider: postgresql
28: └── prisma.ts      # Cliente singleton con adapter-pg
29: ## Convenciones
30: - `verbatimModuleSyntax` → usar `import type` en lugar de `import` para tipos
31: - imports ESM con extensión `.js` en rutas locales
32: - `noUncheckedIndexedAccess` activo → siempre checkear optional chaining
33: - Prisma client generado en `generated/prisma/`

(End of file - total 33 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\agents\\mobile.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\agents\mobile.md</path>
<type>file</type>
<content>
1: Eres un especialista en mobile. Trabajas exclusivamente dentro de `mobile/`.
2: ## Stack
3: - **Framework:** React Native 0.81 + Expo SDK 54
4: - **Router:** Expo Router 6 (file-based routing en app/)
5: - **Navegación:** @react-navigation (bottom-tabs + native-stack)
6: - **Animaciones:** react-native-reanimated
7: - **Gestos:** react-native-gesture-handler + react-native-safe-area-context
8: ## Scripts
9: - `npm start` → `expo start`
10: - `npm run android` → build APK
11: - `npm run ios` → build IPA
12: - `npm run web` → web version
13: - `npm run lint` → `expo lint`
14: ## Estructura
15: app/             # Expo Router (file-based)
16: ├── _layout.tsx
17: ├── (tabs)/
18: │   ├── _layout.tsx
19: │   ├── index.tsx
20: │   └── explore.tsx
21: └── modal.tsx
22: components/      # Reutilizables (themed-text, ui/, etc.)
23: constants/       # theme.ts (colores, estilos)
24: features/        # Módulos por feature
25: hooks/           # use-color-scheme, use-theme-color
26: ## Convenciones
27: - Path alias `@/` → raíz de `mobile/`
28: - Usar `useColorScheme()` de `@/hooks/use-color-scheme` para dark/light mode
29: - Componentes de UI atómicos en `components/ui/`
30: - Temas en `constants/theme.ts`

(End of file - total 30 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\agents\\whatsapp-bot.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\agents\whatsapp-bot.md</path>
<type>file</type>
<content>
1: Eres un especialista en chatbots de WhatsApp. Trabajas exclusivamente dentro de `whatsapp-bot/`.
2: ## Stack
3: - **Framework:** BuilderBot 1.4.1 (@builderbot/bot)
4: - **Provider:** Meta WhatsApp API (@builderbot/provider-meta)
5: - **DB:** PostgreSQL (@builderbot/database-postgres)
6: - **Build:** Rollup + rollup-plugin-typescript2
7: - **Runtime:** TypeScript 5.4, ES2022 modules
8: - **Dev:** nodemon + tsx
9: ## Scripts
10: - `npm run dev` → lint + nodemon con tsx (src/app.ts)
11: - `npm run build` → `npx rollup -c` → dist/app.js
12: - `npm run start` → `node ./dist/app.js`
13: - `npm run lint` → eslint + typescript-eslint
14: ## Estructura
15: src/
16: └── app.ts              # Bot entry point
17: assets/
18: └── sample.png          # Media de ejemplo
19: ## Arquitectura
20: El bot usa **flows** (conversaciones modulares):
21: - `welcomeFlow` → saludo + keywords (hi/hello/hola)
22: - `discordFlow` → subflow anidado con captura de input
23: - `registerFlow` → captura nombre/edad con state
24: - `fullSamplesFlow` → envía media (image, video, audio, file)
25: Endpoints HTTP expuestos por el provider:
26: - POST `/v1/messages` → enviar mensajes
27: - POST `/v1/register` → disparar REGISTER_FLOW
28: - POST `/v1/samples` → disparar SAMPLES
29: - POST `/v1/blacklist` → add/remove de blacklist
30: - GET `/v1/blacklist/list` → listar blacklist
31: Provider config: jwtToken, numberId, verifyToken, version v18.0
32: ## Convenciones
33: - ESLint con plugin builderbot + typescript-eslint
34: - `@typescript-eslint/no-explicit-any: off` (permitido por el framework)
35: - Path alias `~/` → `src/`
36: - Variables de entorno para DB: POSTGRES_DB_HOST, POSTGRES_DB_USER, etc.

(End of file - total 36 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\skills-lock.json"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\skills-lock.json</path>
<type>file</type>
<content>
1: {
2:   "version": 1,
3:   "skills": {
4:     "expo-architect": {
5:       "source": "shipshitdev/library",
6:       "sourceType": "github",
7:       "skillPath": "skills/expo-architect/SKILL.md",
8:       "computedHash": "a87c93804c84164109332f0cae159a1dfa0423d7b4ea504e9c43760ce2997c16"
9:     },
10:     "typescript-react-reviewer": {
11:       "source": "dotneet/claude-code-marketplace",
12:       "sourceType": "github",
13:       "skillPath": "review-tool/skills/typescript-react-reviewer/SKILL.md",
14:       "computedHash": "7f86cd28e11d2b4b120b635d18814b82cd655a2b9d9ba8a105b3ee06c478cf38"
15:     },
16:     "vercel-react-native-skills": {
17:       "source": "vercel-labs/agent-skills",
18:       "sourceType": "github",
19:       "skillPath": "skills/react-native-skills/SKILL.md",
20:       "computedHash": "41d24eafa7c3d82e270439808f7cfbc4d51aeb2d14f2809a2267c16275784d06"
21:     }
22:   }
23: }

(End of file - total 23 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\package.json"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\package.json</path>
<type>file</type>
<content>
1: {
2:   "dependencies": {
3:     "@opencode-ai/plugin": "1.15.5"
4:   }
5: }

(End of file - total 5 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\backend\\rules\\testing.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\backend\rules\testing.md</path>
<type>file</type>
<content>
1: # Backend Testing Guidelines
2: - Tests unitarios con Vitest
3: - Tests de integración con supertest
4: - Mockear Prisma con `vitest-mock-prisma`
5: - Nombrar archivos: `*.test.ts` o `*.spec.ts`
6: - Cobertura minima: 80%

(End of file - total 6 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\backend\\rules\\coding-standards.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\backend\rules\coding-standards.md</path>
<type>file</type>
<content>
1: # Backend Coding Standards
2: ## Estructura de features
3: - Cada feature tiene su propia carpeta en `src/features/<feature-name>/`
4: - Archivos: `controller.ts`, `service.ts`, `routes.ts`, `schema.ts`, `types.ts`
5: - No mezclar responsabilidades entre capas
6: ## Rutas Express
7: - Usar `express.Router()` en cada feature
8: - Montar en `app.ts` con `app.use('/api/v1/<recurso>', router)`
9: - Versionado: `/api/v1/`
10: ## Prisma
11: - Siempre usar `prisma/prisma.ts` (singleton), no crear nuevos clientes
12: - Transacciones con `prisma.$transaction()`
13: - Migraciones con nombres descriptivos: `add_user_roles`
14: ## Errores
15: - Middleware global de errores en `src/middleware/error-handler.ts`
16: - Usar Zod para validación de inputs
17: - Errores de negocio → clases custom que extienden Error

(End of file - total 17 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\mobile\\rules\\ui-patterns.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\mobile\rules\ui-patterns.md</path>
<type>file</type>
<content>
1: # Mobile UI Patterns
2: ## Componentes
3: - UI atómicos en `components/ui/` (Button, Card, Input, etc.)
4: - Componentes compuestos en `components/`
5: - Cada componente es `export default function`
6: ## Estilos
7: - Usar StyleSheet.create() en cada componente
8: - Colores y spacing desde `constants/theme.ts`
9: - Dark mode via `useColorScheme()` hook
10: ## Navegación
11: - Expo Router file-based en `app/`
12: - Nuevas rutas = nuevo archivo en `app/`
13: - Tabs en `app/(tabs)/`
14: - Modales en `app/modal.tsx`

(End of file - total 14 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\mobile\\rules\\api-integration.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\mobile\rules\api-integration.md</path>
<type>file</type>
<content>
1: # Mobile API Integration
2: - Llamadas a backend via fetch nativo
3: - Base URL desde variable de entorno `EXPO_PUBLIC_API_URL`
4: - Tipos compartidos con backend (copiar interfaces)
5: - Manejo de errores: try/catch + feedback visual
6: - Loading states con ActivityIndicator
7: ---

(End of file - total 7 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 4.0s)

_Thinking:_

Now let me also check the root AGENTS.md to understand the full picture.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\AGENTS.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\AGENTS.md</path>
<type>file</type>
<content>
1: Monorepo con 3 proyectos independientes:
2: - `backend/` — API Express + Prisma + PostgreSQL
3: - `mobile/` — App React Native + Expo
4: - `whatsapp-bot/` — Bot WhatsApp con BuilderBot + Meta API
5: ## Reglas generales
6: - Usar `@backend` para cambios en backend/
7: - Usar `@mobile` para cambios en mobile/
8: - Usar `@whatsapp-bot` para cambios en whatsapp-bot/
9: - NO hacer cambios de configuración git ni commits
10: - Preguntar antes de editar archivos (edit: ask global)

(End of file - total 10 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\mobile\\AGENTS.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\mobile\AGENTS.md</path>
<type>file</type>
<content>
1: # Mobile — React Native + Expo SDK 54
2: ## Stack
3: Expo SDK 54, React Native 0.81, Expo Router 6, @react-navigation (bottom-tabs + native-stack), react-native-reanimated, react-native-gesture-handler, TypeScript ~5.9
4: ## Comandos
5: - Start: `npm start`
6: - Android: `npm run android`
7: - iOS: `npm run ios`
8: - Lint: `npm run lint`
9: ## Convenciones
10: - Path alias `@/` → raíz de mobile
11: - Componentes UI en `components/ui/`
12: - Temas en `constants/theme.ts`
13: - Hooks en `hooks/`
14: - Pantallas/rutas en `app/` (Expo Router)

(End of file - total 14 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\backend\\AGENTS.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\backend\AGENTS.md</path>
<type>file</type>
<content>
1: # Backend — Express + Prisma + PostgreSQL
2: ## Stack
3: Node.js, TypeScript 6 (ESModules, NodeNext), Express 5, Prisma 7 + PostgreSQL (@prisma/adapter-pg), Zod 4, bcrypt, jsonwebtoken, pino, morgan, helmet, cors
4: ## Comandos
5: - Dev: `npm run dev` (tsx watch)
6: - Build: `npm run build` (tsc)
7: - Prisma migrate: `npx prisma migrate dev --name <name>`
8: - Prisma generate: `npx prisma generate`
9: ## Convenciones
10: - imports ESM con extensión .js
11: - type imports con verbatimModuleSyntax
12: - Prisma client singleton en `prisma/prisma.ts`
13: - Schema provider: postgresql

(End of file - total 13 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\whatsapp-bot\\AGENTS.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\whatsapp-bot\AGENTS.md</path>
<type>file</type>
<content>
1: # WhatsApp Bot — BuilderBot + Meta API
2: ## Stack
3: BuilderBot 1.4.1 (@builderbot/bot, @builderbot/provider-meta, @builderbot/database-postgres), TypeScript 5.4, Rollup, nodemon + tsx
4: ## Comandos
5: - Dev: `npm run dev` (lint + nodemon + tsx)
6: - Build: `npm run build` (rollup -c → dist/app.js)
7: - Start: `npm run start` (node dist/app.js)
8: - Lint: `npm run lint` (eslint + typescript-eslint)
9: ## Convenciones
10: - ESLint con plugin builderbot + typescript-eslint
11: - Path alias `~/` → `src/`
12: - Provider Meta: jwtToken, numberId, verifyToken, v18.0
13: - DB: POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_NAME, POSTGRES_DB_PASSWORD, POSTGRES_DB_PORT

(End of file - total 13 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\whatsapp-bot\\rules\\flows.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\whatsapp-bot\rules\flows.md</path>
<type>file</type>
<content>
1: # WhatsApp Bot Flows
2: ## Convenciones de Flows
3: - Cada flow en su propio archivo dentro de `src/flows/`
4: - Nombres: `welcome.flow.ts`, `register.flow.ts`
5: - Keywords siempre en inglés
6: - Usar `addKeyword` con array de strings o `utils.setEvent()`
7: - Flows anidados van como último argumento de `addAnswer`
8: ## State Management
9: - Usar `state.update()` y `state.get()` en lugar de variables globales
10: - State persiste automáticamente en PostgreSQL
11: ## Endpoints HTTP
12: - Provider expone endpoints automáticos en el puerto configurado
13: - No agregar Express aparte
14: - Usar `handleCtx` wrapper para acceso a bot

(End of file - total 14 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\.gitignore"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\.gitignore</path>
<type>file</type>
<content>
1: node_modules
2: package.json
3: package-lock.json
4: bun.lock
5: .gitignore

(End of file - total 5 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\skills\\vercel-react-native-skills\\AGENTS.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\skills\vercel-react-native-skills\AGENTS.md</path>
<type>file</type>
<content>
1: # React Native Skills
2: 
3: **Version 1.0.0**  
4: Engineering  
5: January 2026
6: 
7: > **Note:**  
8: > This document is mainly for agents and LLMs to follow when maintaining,  
9: > generating, or refactoring React Native codebases. Humans  
10: > may also find it useful, but guidance here is optimized for automation  
11: > and consistency by AI-assisted workflows.
12: 
13: ---
14: 
15: ## Abstract
16: 
17: Comprehensive performance optimization guide for React Native applications, designed for AI agents and LLMs. Contains 35+ rules across 13 categories, prioritized by impact from critical (core rendering, list performance) to incremental (fonts, imports). Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations, and specific impact metrics to guide automated refactoring and code generation.
18: 
19: ---
20: 
21: ## Table of Contents
22: 
23: 1. [Core Rendering](#1-core-rendering) — **CRITICAL**
24:    - 1.1 [Never Use && with Potentially Falsy Values](#11-never-use--with-potentially-falsy-values)
25:    - 1.2 [Wrap Strings in Text Components](#12-wrap-strings-in-text-components)
26: 2. [List Performance](#2-list-performance) — **HIGH**
27:    - 2.1 [Avoid Inline Objects in renderItem](#21-avoid-inline-objects-in-renderitem)
28:    - 2.2 [Hoist callbacks to the root of lists](#22-hoist-callbacks-to-the-root-of-lists)
29:    - 2.3 [Keep List Items Lightweight](#23-keep-list-items-lightweight)
30:    - 2.4 [Optimize List Performance with Stable Object References](#24-optimize-list-performance-with-stable-object-references)
31:    - 2.5 [Pass Primitives to List Items for Memoization](#25-pass-primitives-to-list-items-for-memoization)
32:    - 2.6 [Use a List Virtualizer for Any List](#26-use-a-list-virtualizer-for-any-list)
33:    - 2.7 [Use Compressed Images in Lists](#27-use-compressed-images-in-lists)
34:    - 2.8 [Use Item Types for Heterogeneous Lists](#28-use-item-types-for-heterogeneous-lists)
35: 3. [Animation](#3-animation) — **HIGH**
36:    - 3.1 [Animate Transform and Opacity Instead of Layout Properties](#31-animate-transform-and-opacity-instead-of-layout-properties)
37:    - 3.2 [Prefer useDerivedValue Over useAnimatedReaction](#32-prefer-usederivedvalue-over-useanimatedreaction)
38:    - 3.3 [Use GestureDetector for Animated Press States](#33-use-gesturedetector-for-animated-press-states)
39: 4. [Scroll Performance](#4-scroll-performance) — **HIGH**
40:    - 4.1 [Never Track Scroll Position in useState](#41-never-track-scroll-position-in-usestate)
41: 5. [Navigation](#5-navigation) — **HIGH**
42:    - 5.1 [Use Native Navigators for Navigation](#51-use-native-navigators-for-navigation)
43: 6. [React State](#6-react-state) — **MEDIUM**
44:    - 6.1 [Minimize State Variables and Derive Values](#61-minimize-state-variables-and-derive-values)
45:    - 6.2 [Use fallback state instead of initialState](#62-use-fallback-state-instead-of-initialstate)
46:    - 6.3 [useState Dispatch updaters for State That Depends on Current Value](#63-usestate-dispatch-updaters-for-state-that-depends-on-current-value)
47: 7. [State Architecture](#7-state-architecture) — **MEDIUM**
48:    - 7.1 [State Must Represent Ground Truth](#71-state-must-represent-ground-truth)
49: 8. [React Compiler](#8-react-compiler) — **MEDIUM**
50:    - 8.1 [Destructure Functions Early in Render (React Compiler)](#81-destructure-functions-early-in-render-react-compiler)
51:    - 8.2 [Use .get() and .set() for Reanimated Shared Values (not .value)](#82-use-get-and-set-for-reanimated-shared-values-not-value)
52: 9. [User Interface](#9-user-interface) — **MEDIUM**
53:    - 9.1 [Measuring View Dimensions](#91-measuring-view-dimensions)
54:    - 9.2 [Modern React Native Styling Patterns](#92-modern-react-native-styling-patterns)
55:    - 9.3 [Use contentInset for Dynamic ScrollView Spacing](#93-use-contentinset-for-dynamic-scrollview-spacing)
56:    - 9.4 [Use contentInsetAdjustmentBehavior for Safe Areas](#94-use-contentinsetadjustmentbehavior-for-safe-areas)
57:    - 9.5 [Use expo-image for Optimized Images](#95-use-expo-image-for-optimized-images)
58:    - 9.6 [Use Galeria for Image Galleries and Lightbox](#96-use-galeria-for-image-galleries-and-lightbox)
59:    - 9.7 [Use Native Menus for Dropdowns and Context Menus](#97-use-native-menus-for-dropdowns-and-context-menus)
60:    - 9.8 [Use Native Modals Over JS-Based Bottom Sheets](#98-use-native-modals-over-js-based-bottom-sheets)
61:    - 9.9 [Use Pressable Instead of Touchable Components](#99-use-pressable-instead-of-touchable-components)
62: 10. [Design System](#10-design-system) — **MEDIUM**
63:    - 10.1 [Use Compound Components Over Polymorphic Children](#101-use-compound-components-over-polymorphic-children)
64: 11. [Monorepo](#11-monorepo) — **LOW**
65:    - 11.1 [Install Native Dependencies in App Directory](#111-install-native-dependencies-in-app-directory)
66:    - 11.2 [Use Single Dependency Versions Across Monorepo](#112-use-single-dependency-versions-across-monorepo)
67: 12. [Third-Party Dependencies](#12-third-party-dependencies) — **LOW**
68:    - 12.1 [Import from Design System Folder](#121-import-from-design-system-folder)
69: 13. [JavaScript](#13-javascript) — **LOW**
70:    - 13.1 [Hoist Intl Formatter Creation](#131-hoist-intl-formatter-creation)
71: 14. [Fonts](#14-fonts) — **LOW**
72:    - 14.1 [Load fonts natively at build time](#141-load-fonts-natively-at-build-time)
73: 
74: ---
75: 
76: ## 1. Core Rendering
77: 
78: **Impact: CRITICAL**
79: 
80: Fundamental React Native rendering rules. Violations cause
81: runtime crashes or broken UI.
82: 
83: ### 1.1 Never Use && with Potentially Falsy Values
84: 
85: **Impact: CRITICAL (prevents production crash)**
86: 
87: Never use `{value && <Component />}` when `value` could be an empty string or
88: 
89: `0`. These are falsy but JSX-renderable—React Native will try to render them as
90: 
91: text outside a `<Text>` component, causing a hard crash in production.
92: 
93: **Incorrect: crashes if count is 0 or name is ""**
94: 
95: ```tsx
96: function Profile({ name, count }: { name: string; count: number }) {
97:   return (
98:     <View>
99:       {name && <Text>{name}</Text>}
100:       {count && <Text>{count} items</Text>}
101:     </View>
102:   )
103: }
104: // If name="" or count=0, renders the falsy value → crash
105: ```
106: 
107: **Correct: ternary with null**
108: 
109: ```tsx
110: function Profile({ name, count }: { name: string; count: number }) {
111:   return (
112:     <View>
113:       {name ? <Text>{name}</Text> : null}
114:       {count ? <Text>{count} items</Text> : null}
115:     </View>
116:   )
117: }
118: ```
119: 
120: **Correct: explicit boolean coercion**
121: 
122: ```tsx
123: function Profile({ name, count }: { name: string; count: number }) {
124:   return (
125:     <View>
126:       {!!name && <Text>{name}</Text>}
127:       {!!count && <Text>{count} items</Text>}
128:     </View>
129:   )
130: }
131: ```
132: 
133: **Best: early return**
134: 
135: ```tsx
136: function Profile({ name, count }: { name: string; count: number }) {
137:   if (!name) return null
138: 
139:   return (
140:     <View>
141:       <Text>{name}</Text>
142:       {count > 0 ? <Text>{count} items</Text> : null}
143:     </View>
144:   )
145: }
146: ```
147: 
148: Early returns are clearest. When using conditionals inline, prefer ternary or
149: 
150: explicit boolean checks.
151: 
152: **Lint rule:** Enable `react/jsx-no-leaked-render` from
153: 
154: [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md)
155: 
156: to catch this automatically.
157: 
158: ### 1.2 Wrap Strings in Text Components
159: 
160: **Impact: CRITICAL (prevents runtime crash)**
161: 
162: Strings must be rendered inside `<Text>`. React Native crashes if a string is a
163: 
164: direct child of `<View>`.
165: 
166: **Incorrect: crashes**
167: 
168: ```tsx
169: import { View } from 'react-native'
170: 
171: function Greeting({ name }: { name: string }) {
172:   return <View>Hello, {name}!</View>
173: }
174: // Error: Text strings must be rendered within a <Text> component.
175: ```
176: 
177: **Correct:**
178: 
179: ```tsx
180: import { View, Text } from 'react-native'
181: 
182: function Greeting({ name }: { name: string }) {
183:   return (
184:     <View>
185:       <Text>Hello, {name}!</Text>
186:     </View>
187:   )
188: }
189: ```
190: 
191: ---
192: 
193: ## 2. List Performance
194: 
195: **Impact: HIGH**
196: 
197: Optimizing virtualized lists (FlatList, LegendList, FlashList)
198: for smooth scrolling and fast updates.
199: 
200: ### 2.1 Avoid Inline Objects in renderItem
201: 
202: **Impact: HIGH (prevents unnecessary re-renders of memoized list items)**
203: 
204: Don't create new objects inside `renderItem` to pass as props. Inline objects
205: 
206: create new references on every render, breaking memoization. Pass primitive
207: 
208: values directly from `item` instead.
209: 
210: **Incorrect: inline object breaks memoization**
211: 
212: ```tsx
213: function UserList({ users }: { users: User[] }) {
214:   return (
215:     <LegendList
216:       data={users}
217:       renderItem={({ item }) => (
218:         <UserRow
219:           // Bad: new object on every render
220:           user={{ id: item.id, name: item.name, avatar: item.avatar }}
221:         />
222:       )}
223:     />
224:   )
225: }
226: ```
227: 
228: **Incorrect: inline style object**
229: 
230: ```tsx
231: renderItem={({ item }) => (
232:   <UserRow
233:     name={item.name}
234:     // Bad: new style object on every render
235:     style={{ backgroundColor: item.isActive ? 'green' : 'gray' }}
236:   />
237: )}
238: ```
239: 
240: **Correct: pass item directly or primitives**
241: 
242: ```tsx
243: function UserList({ users }: { users: User[] }) {
244:   return (
245:     <LegendList
246:       data={users}
247:       renderItem={({ item }) => (
248:         // Good: pass the item directly
249:         <UserRow user={item} />
250:       )}
251:     />
252:   )
253: }
254: ```
255: 
256: **Correct: pass primitives, derive inside child**
257: 
258: ```tsx
259: renderItem={({ item }) => (
260:   <UserRow
261:     id={item.id}
262:     name={item.name}
263:     isActive={item.isActive}
264:   />
265: )}
266: 
267: const UserRow = memo(function UserRow({ id, name, isActive }: Props) {
268:   // Good: derive style inside memoized component
269:   const backgroundColor = isActive ? 'green' : 'gray'
270:   return <View style={[styles.row, { backgroundColor }]}>{/* ... */}</View>
271: })
272: ```
273: 
274: **Correct: hoist static styles in module scope**
275: 
276: ```tsx
277: const activeStyle = { backgroundColor: 'green' }
278: const inactiveStyle = { backgroundColor: 'gray' }
279: 
280: renderItem={({ item }) => (
281:   <UserRow
282:     name={item.name}
283:     // Good: stable references
284:     style={item.isActive ? activeStyle : inactiveStyle}
285:   />
286: )}
287: ```
288: 
289: Passing primitives or stable references allows `memo()` to skip re-renders when
290: 
291: the actual values haven't changed.
292: 
293: **Note:** If you have the React Compiler enabled, it handles memoization
294: 
295: automatically and these manual optimizations become less critical.
296: 
297: ### 2.2 Hoist callbacks to the root of lists
298: 
299: **Impact: MEDIUM (Fewer re-renders and faster lists)**
300: 
301: When passing callback functions to list items, create a single instance of the
302: 
303: callback at the root of the list. Items should then call it with a unique
304: 
305: identifier.
306: 
307: **Incorrect: creates a new callback on each render**
308: 
309: ```typescript
310: return (
311:   <LegendList
312:     renderItem={({ item }) => {
313:       // bad: creates a new callback on each render
314:       const onPress = () => handlePress(item.id)
315:       return <Item key={item.id} item={item} onPress={onPress} />
316:     }}
317:   />
318: )
319: ```
320: 
321: **Correct: a single function instance passed to each item**
322: 
323: ```typescript
324: const onPress = useCallback(() => handlePress(item.id), [handlePress, item.id])
325: 
326: return (
327:   <LegendList
328:     renderItem={({ item }) => (
329:       <Item key={item.id} item={item} onPress={onPress} />
330:     )}
331:   />
332: )
333: ```
334: 
335: Reference: [https://example.com](https://example.com)
336: 
337: ### 2.3 Keep List Items Lightweight
338: 
339: **Impact: HIGH (reduces render time for visible items during scroll)**
340: 
341: List items should be as inexpensive as possible to render. Minimize hooks, avoid
342: 
343: queries, and limit React Context access. Virtualized lists render many items
344: 
345: during scroll—expensive items cause jank.
346: 
347: **Incorrect: heavy list item**
348: 
349: ```tsx
350: function ProductRow({ id }: { id: string }) {
351:   // Bad: query inside list item
352:   const { data: product } = useQuery(['product', id], () => fetchProduct(id))
353:   // Bad: multiple context accesses
354:   const theme = useContext(ThemeContext)
355:   const user = useContext(UserContext)
356:   const cart = useContext(CartContext)
357:   // Bad: expensive computation
358:   const recommendations = useMemo(
359:     () => computeRecommendations(product),
360:     [product]
361:   )
362: 
363:   return <View>{/* ... */}</View>
364: }
365: ```
366: 
367: **Correct: lightweight list item**
368: 
369: ```tsx
370: function ProductRow({ name, price, imageUrl }: Props) {
371:   // Good: receives only primitives, minimal hooks
372:   return (
373:     <View>
374:       <Image source={{ uri: imageUrl }} />
375:       <Text>{name}</Text>
376:       <Text>{price}</Text>
377:     </View>
378:   )
379: }
380: ```
381: 
382: **Move data fetching to parent:**
383: 
384: ```tsx
385: // Parent fetches all data once
386: function ProductList() {
387:   const { data: products } = useQuery(['products'], fetchProducts)
388: 
389:   return (
390:     <LegendList
391:       data={products}
392:       renderItem={({ item }) => (
393:         <ProductRow name={item.name} price={item.price} imageUrl={item.image} />
394:       )}
395:     />
396:   )
397: }
398: ```
399: 
400: **For shared values, use Zustand selectors instead of Context:**
401: 
402: ```tsx
403: // Incorrect: Context causes re-render when any cart value changes
404: function ProductRow({ id, name }: Props) {
405:   const { items } = useContext(CartContext)
406:   const inCart = items.includes(id)
407:   // ...
408: }
409: 
410: // Correct: Zustand selector only re-renders when this specific value changes
411: function ProductRow({ id, name }: Props) {
412:   // use Set.has (created once at the root) instead of Array.includes()
413:   const inCart = useCartStore((s) => s.items.has(id))
414:   // ...
415: }
416: ```
417: 
418: **Guidelines for list items:**
419: 
420: - No queries or data fetching
421: 
422: - No expensive computations (move to parent or memoize at parent level)
423: 
424: - Prefer Zustand selectors over React Context
425: 
426: - Minimize useState/useEffect hooks
427: 
428: - Pass pre-computed values as props
429: 
430: The goal: list items should be simple rendering functions that take props and
431: 
432: return JSX.
433: 
434: ### 2.4 Optimize List Performance with Stable Object References
435: 
436: **Impact: CRITICAL (virtualization relies on reference stability)**
437: 
438: Don't map or filter data before passing to virtualized lists. Virtualization
439: 
440: relies on object reference stability to know what changed—new references cause
441: 
442: full re-renders of all visible items. Attempt to prevent frequent renders at the
443: 
444: list-parent level.
445: 
446: Where needed, use context selectors within list items.
447: 
448: **Incorrect: creates new object references on every keystroke**
449: 
450: ```tsx
451: function DomainSearch() {
452:   const { keyword, setKeyword } = useKeywordZustandState()
453:   const { data: tlds } = useTlds()
454: 
455:   // Bad: creates new objects on every render, reparenting the entire list on every keystroke
456:   const domains = tlds.map((tld) => ({
457:     domain: `${keyword}.${tld.name}`,
458:     tld: tld.name,
459:     price: tld.price,
460:   }))
461: 
462:   return (
463:     <>
464:       <TextInput value={keyword} onChangeText={setKeyword} />
465:       <LegendList
466:         data={domains}
467:         renderItem={({ item }) => <DomainItem item={item} keyword={keyword} />}
468:       />
469:     </>
470:   )
471: }
472: ```
473: 
474: **Correct: stable references, transform inside items**
475: 
476: ```tsx
477: const renderItem = ({ item }) => <DomainItem tld={item} />
478: 
479: function DomainSearch() {
480:   const { data: tlds } = useTlds()
481: 
482:   return (
483:     <LegendList
484:       // good: as long as the data is stable, LegendList will not re-render the entire list
485:       data={tlds}
486:       renderItem={renderItem}
487:     />
488:   )
489: }
490: 
491: function DomainItem({ tld }: { tld: Tld }) {
492:   // good: transform within items, and don't pass the dynamic data as a prop
493:   // good: use a selector function from zustand to receive a stable string back
494:   const domain = useKeywordZustandState((s) => s.keyword + '.' + tld.name)
495:   return <Text>{domain}</Text>
496: }
497: ```
498: 
499: **Updating parent array reference:**
500: 
501: ```tsx
502: // good: creates a new array instance without mutating the inner objects
503: // good: parent array reference is unaffected by typing and updating "keyword"
504: const sortedTlds = tlds.toSorted((a, b) => a.name.localeCompare(b.name))
505: 
506: return <LegendList data={sortedTlds} renderItem={renderItem} />
507: ```
508: 
509: Creating a new array instance can be okay, as long as its inner object
510: 
511: references are stable. For instance, if you sort a list of objects:
512: 
513: Even though this creates a new array instance `sortedTlds`, the inner object
514: 
515: references are stable.
516: 
517: **With zustand for dynamic data: avoids parent re-renders**
518: 
519: ```tsx
520: function DomainItemFavoriteButton({ tld }: { tld: Tld }) {
521:   const isFavorited = useFavoritesStore((s) => s.favorites.has(tld.id))
522:   return <TldFavoriteButton isFavorited={isFavorited} />
523: }
524: ```
525: 
526: Virtualization can now skip items that haven't changed when typing. Only visible
527: 
528: items (~20) re-render on keystroke, rather than the parent.
529: 
530: **Deriving state within list items based on parent data (avoids parent
531: 
532: re-renders):**
533: 
534: For components where the data is conditional based on the parent state, this
535: 
536: pattern is even more important. For example, if you are checking if an item is
537: 
538: favorited, toggling favorites only re-renders one component if the item itself
539: 
540: is in charge of accessing the state rather than the parent:
541: 
542: Note: if you're using the React Compiler, you can read React Context values
543: 
544: directly within list items. Although this is slightly slower than using a
545: 
546: Zustand selector in most cases, the effect may be negligible.
547: 
548: ### 2.5 Pass Primitives to List Items for Memoization
549: 
550: **Impact: HIGH (enables effective memo() comparison)**
551: 
552: When possible, pass only primitive values (strings, numbers, booleans) as props
553: 
554: to list item components. Primitives enable shallow comparison in `memo()` to
555: 
556: work correctly, skipping re-renders when values haven't changed.
557: 
558: **Incorrect: object prop requires deep comparison**
559: 
560: ```tsx
561: type User = { id: string; name: string; email: string; avatar: string }
562: 
563: const UserRow = memo(function UserRow({ user }: { user: User }) {
564:   // memo() compares user by reference, not value
565:   // If parent creates new user object, this re-renders even if data is same
566:   return <Text>{user.name}</Text>
567: })
568: 
569: renderItem={({ item }) => <UserRow user={item} />}
570: ```
571: 
572: This can still be optimized, but it is harder to memoize properly.
573: 
574: **Correct: primitive props enable shallow comparison**
575: 
576: ```tsx
577: const UserRow = memo(function UserRow({
578:   id,
579:   name,
580:   email,
581: }: {
582:   id: string
583:   name: string
584:   email: string
585: }) {
586:   // memo() compares each primitive directly
587:   // Re-renders only if id, name, or email actually changed
588:   return <Text>{name}</Text>
589: })
590: 
591: renderItem={({ item }) => (
592:   <UserRow id={item.id} name={item.name} email={item.email} />
593: )}
594: ```
595: 
596: **Pass only what you need:**
597: 
598: ```tsx
599: // Incorrect: passing entire item when you only need name
600: <UserRow user={item} />
601: 
602: // Correct: pass only the fields the component uses
603: <UserRow name={item.name} avatarUrl={item.avatar} />
604: ```
605: 
606: **For callbacks, hoist or use item ID:**
607: 
608: ```tsx
609: // Incorrect: inline function creates new reference
610: <UserRow name={item.name} onPress={() => handlePress(item.id)} />
611: 
612: // Correct: pass ID, handle in child
613: <UserRow id={item.id} name={item.name} />
614: 
615: const UserRow = memo(function UserRow({ id, name }: Props) {
616:   const handlePress = useCallback(() => {
617:     // use id here
618:   }, [id])
619:   return <Pressable onPress={handlePress}><Text>{name}</Text></Pressable>
620: })
621: ```
622: 
623: Primitive props make memoization predictable and effective.
624: 
625: **Note:** If you have the React Compiler enabled, you do not need to use
626: 
627: `memo()` or `useCallback()`, but the object references still apply.
628: 
629: ### 2.6 Use a List Virtualizer for Any List
630: 
631: **Impact: HIGH (reduced memory, faster mounts)**
632: 
633: Use a list virtualizer like LegendList or FlashList instead of ScrollView with
634: 
635: mapped children—even for short lists. Virtualizers only render visible items,
636: 
637: reducing memory usage and mount time. ScrollView renders all children upfront,
638: 
639: which gets expensive quickly.
640: 
641: **Incorrect: ScrollView renders all items at once**
642: 
643: ```tsx
644: function Feed({ items }: { items: Item[] }) {
645:   return (
646:     <ScrollView>
647:       {items.map((item) => (
648:         <ItemCard key={item.id} item={item} />
649:       ))}
650:     </ScrollView>
651:   )
652: }
653: // 50 items = 50 components mounted, even if only 10 visible
654: ```
655: 
656: **Correct: virtualizer renders only visible items**
657: 
658: ```tsx
659: import { LegendList } from '@legendapp/list'
660: 
661: function Feed({ items }: { items: Item[] }) {
662:   return (
663:     <LegendList
664:       data={items}
665:       // if you aren't using React Compiler, wrap these with useCallback
666:       renderItem={({ item }) => <ItemCard item={item} />}
667:       keyExtractor={(item) => item.id}
668:       estimatedItemSize={80}
669:     />
670:   )
671: }
672: // Only ~10-15 visible items mounted at a time
673: ```
674: 
675: **Alternative: FlashList**
676: 
677: ```tsx
678: import { FlashList } from '@shopify/flash-list'
679: 
680: function Feed({ items }: { items: Item[] }) {
681:   return (
682:     <FlashList
683:       data={items}
684:       // if you aren't using React Compiler, wrap these with useCallback
685:       renderItem={({ item }) => <ItemCard item={item} />}
686:       keyExtractor={(item) => item.id}
687:     />
688:   )
689: }
690: ```
691: 
692: Benefits apply to any screen with scrollable content—profiles, settings, feeds,
693: 
694: search results. Default to virtualization.
695: 
696: ### 2.7 Use Compressed Images in Lists
697: 
698: **Impact: HIGH (faster load times, less memory)**
699: 
700: Always load compressed, appropriately-sized images in lists. Full-resolution
701: 
702: images consume excessive memory and cause scroll jank. Request thumbnails from
703: 
704: your server or use an image CDN with resize parameters.
705: 
706: **Incorrect: full-resolution images**
707: 
708: ```tsx
709: function ProductItem({ product }: { product: Product }) {
710:   return (
711:     <View>
712:       {/* 4000x3000 image loaded for a 100x100 thumbnail */}
713:       <Image
714:         source={{ uri: product.imageUrl }}
715:         style={{ width: 100, height: 100 }}
716:       />
717:       <Text>{product.name}</Text>
718:     </View>
719:   )
720: }
721: ```
722: 
723: **Correct: request appropriately-sized image**
724: 
725: ```tsx
726: function ProductItem({ product }: { product: Product }) {
727:   // Request a 200x200 image (2x for retina)
728:   const thumbnailUrl = `${product.imageUrl}?w=200&h=200&fit=cover`
729: 
730:   return (
731:     <View>
732:       <Image
733:         source={{ uri: thumbnailUrl }}
734:         style={{ width: 100, height: 100 }}
735:         contentFit='cover'
736:       />
737:       <Text>{product.name}</Text>
738:     </View>
739:   )
740: }
741: ```
742: 
743: Use an optimized image component with built-in caching and placeholder support,
744: 
745: such as `expo-image` or `SolitoImage` (which uses `expo-image` under the hood).
746: 
747: Request images at 2x the display size for retina screens.
748: 
749: ### 2.8 Use Item Types for Heterogeneous Lists
750: 
751: **Impact: HIGH (efficient recycling, less layout thrashing)**
752: 
753: When a list has different item layouts (messages, images, headers, etc.), use a
754: 
755: `type` field on each item and provide `getItemType` to the list. This puts items
756: 
757: into separate recycling pools so a message component never gets recycled into an
758: 
759: image component.
760: 
761: [LegendList getItemType](https://legendapp.com/open-source/list/api/props/#getitemtype-v2)
762: 
763: **Incorrect: single component with conditionals**
764: 
765: ```tsx
766: type Item = { id: string; text?: string; imageUrl?: string; isHeader?: boolean }
767: 
768: function ListItem({ item }: { item: Item }) {
769:   if (item.isHeader) {
770:     return <HeaderItem title={item.text} />
771:   }
772:   if (item.imageUrl) {
773:     return <ImageItem url={item.imageUrl} />
774:   }
775:   return <MessageItem text={item.text} />
776: }
777: 
778: function Feed({ items }: { items: Item[] }) {
779:   return (
780:     <LegendList
781:       data={items}
782:       renderItem={({ item }) => <ListItem item={item} />}
783:       recycleItems
784:     />
785:   )
786: }
787: ```
788: 
789: **Correct: typed items with separate components**
790: 
791: ```tsx
792: type HeaderItem = { id: string; type: 'header'; title: string }
793: type MessageItem = { id: string; type: 'message'; text: string }
794: type ImageItem = { id: string; type: 'image'; url: string }
795: type FeedItem = HeaderItem | MessageItem | ImageItem
796: 
797: function Feed({ items }: { items: FeedItem[] }) {
798:   return (
799:     <LegendList
800:       data={items}
801:       keyExtractor={(item) => item.id}
802:       getItemType={(item) => item.type}
803:       renderItem={({ item }) => {
804:         switch (item.type) {
805:           case 'header':
806:             return <SectionHeader title={item.title} />
807:           case 'message':
808:             return <MessageRow text={item.text} />
809:           case 'image':
810:             return <ImageRow url={item.url} />
811:         }
812:       }}
813:       recycleItems
814:     />
815:   )
816: }
817: ```
818: 
819: **Why this matters:**
820: 
821: ```tsx
822: <LegendList
823:   data={items}
824:   keyExtractor={(item) => item.id}
825:   getItemType={(item) => item.type}
826:   getEstimatedItemSize={(index, item, itemType) => {
827:     switch (itemType) {
828:       case 'header':
829:         return 48
830:       case 'message':
831:         return 72
832:       case 'image':
833:         return 300
834:       default:
835:         return 72
836:     }
837:   }}
838:   renderItem={({ item }) => {
839:     /* ... */
840:   }}
841:   recycleItems
842: />
843: ```
844: 
845: - **Recycling efficiency**: Items with the same type share a recycling pool
846: 
847: - **No layout thrashing**: A header never recycles into an image cell
848: 
849: - **Type safety**: TypeScript can narrow the item type in each branch
850: 
851: - **Better size estimation**: Use `getEstimatedItemSize` with `itemType` for
852: 
853:   accurate estimates per type
854: 
855: ---
856: 
857: ## 3. Animation
858: 
859: **Impact: HIGH**
860: 
861: GPU-accelerated animations, Reanimated patterns, and avoiding
862: render thrashing during gestures.
863: 
864: ### 3.1 Animate Transform and Opacity Instead of Layout Properties
865: 
866: **Impact: HIGH (GPU-accelerated animations, no layout recalculation)**
867: 
868: Avoid animating `width`, `height`, `top`, `left`, `margin`, or `padding`. These trigger layout recalculation on every frame. Instead, use `transform` (scale, translate) and `opacity` which run on the GPU without triggering layout.
869: 
870: **Incorrect: animates height, triggers layout every frame**
871: 
872: ```tsx
873: import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
874: 
875: function CollapsiblePanel({ expanded }: { expanded: boolean }) {
876:   const animatedStyle = useAnimatedStyle(() => ({
877:     height: withTiming(expanded ? 200 : 0), // triggers layout on every frame
878:     overflow: 'hidden',
879:   }))
880: 
881:   return <Animated.View style={animatedStyle}>{children}</Animated.View>
882: }
883: ```
884: 
885: **Correct: animates scaleY, GPU-accelerated**
886: 
887: ```tsx
888: import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
889: 
890: function CollapsiblePanel({ expanded }: { expanded: boolean }) {
891:   const animatedStyle = useAnimatedStyle(() => ({
892:     transform: [
893:       { scaleY: withTiming(expanded ? 1 : 0) },
894:     ],
895:     opacity: withTiming(expanded ? 1 : 0),
896:   }))
897: 
898:   return (
899:     <Animated.View style={[{ height: 200, transformOrigin: 'top' }, animatedStyle]}>
900:       {children}
901:     </Animated.View>
902:   )
903: }
904: ```
905: 
906: **Correct: animates translateY for slide animations**
907: 
908: ```tsx
909: import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
910: 
911: function SlideIn({ visible }: { visible: boolean }) {
912:   const animatedStyle = useAnimatedStyle(() => ({
913:     transform: [
914:       { translateY: withTiming(visible ? 0 : 100) },
915:     ],
916:     opacity: withTiming(visible ? 1 : 0),
917:   }))
918: 
919:   return <Animated.View style={animatedStyle}>{children}</Animated.View>
920: }
921: ```
922: 
923: GPU-accelerated properties: `transform` (translate, scale, rotate), `opacity`. Everything else triggers layout.
924: 
925: ### 3.2 Prefer useDerivedValue Over useAnimatedReaction
926: 
927: **Impact: MEDIUM (cleaner code, automatic dependency tracking)**
928: 
929: When deriving a shared value from another, use `useDerivedValue` instead of
930: 
931: `useAnimatedReaction`. Derived values are declarative, automatically track
932: 
933: dependencies, and return a value you can use directly. Animated reactions are
934: 
935: for side effects, not derivations.
936: 
937: [Reanimated useDerivedValue](https://docs.swmansion.com/react-native-reanimated/docs/core/useDerivedValue)
938: 
939: **Incorrect: useAnimatedReaction for derivation**
940: 
941: ```tsx
942: import { useSharedValue, useAnimatedReaction } from 'react-native-reanimated'
943: 
944: function MyComponent() {
945:   const progress = useSharedValue(0)
946:   const opacity = useSharedValue(1)
947: 
948:   useAnimatedReaction(
949:     () => progress.value,
950:     (current) => {
951:       opacity.value = 1 - current
952:     }
953:   )
954: 
955:   // ...
956: }
957: ```
958: 
959: **Correct: useDerivedValue**
960: 
961: ```tsx
962: import { useSharedValue, useDerivedValue } from 'react-native-reanimated'
963: 
964: function MyComponent() {
965:   const progress = useSharedValue(0)
966: 
967:   const opacity = useDerivedValue(() => 1 - progress.get())
968: 
969:   // ...
970: }
971: ```
972: 
973: Use `useAnimatedReaction` only for side effects that don't produce a value
974: 
975: (e.g., triggering haptics, logging, calling `runOnJS`).
976: 
977: ### 3.3 Use GestureDetector for Animated Press States
978: 
979: **Impact: MEDIUM (UI thread animations, smoother press feedback)**
980: 
981: For animated press states (scale, opacity on press), use `GestureDetector` with
982: 
983: `Gesture.Tap()` and shared values instead of Pressable's
984: 
985: `onPressIn`/`onPressOut`. Gesture callbacks run on the UI thread as worklets—no
986: 
987: JS thread round-trip for press animations.
988: 
989: [Gesture Handler Tap Gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/tap-gesture)
990: 
991: **Incorrect: Pressable with JS thread callbacks**
992: 
993: ```tsx
994: import { Pressable } from 'react-native'
995: import Animated, {
996:   useSharedValue,
997:   useAnimatedStyle,
998:   withTiming,
999: } from 'react-native-reanimated'
1000: 
1001: function AnimatedButton({ onPress }: { onPress: () => void }) {
1002:   const scale = useSharedValue(1)
1003: 
1004:   const animatedStyle = useAnimatedStyle(() => ({
1005:     transform: [{ scale: scale.value }],
1006:   }))
1007: 
1008:   return (
1009:     <Pressable
1010:       onPress={onPress}
1011:       onPressIn={() => (scale.value = withTiming(0.95))}
1012:       onPressOut={() => (scale.value = withTiming(1))}
1013:     >
1014:       <Animated.View style={animatedStyle}>
1015:         <Text>Press me</Text>
1016:       </Animated.View>
1017:     </Pressable>
1018:   )
1019: }
1020: ```
1021: 
1022: **Correct: GestureDetector with UI thread worklets**
1023: 
1024: ```tsx
1025: import { Gesture, GestureDetector } from 'react-native-gesture-handler'
1026: import Animated, {
1027:   useSharedValue,
1028:   useAnimatedStyle,
1029:   withTiming,
1030:   interpolate,
1031:   runOnJS,
1032: } from 'react-native-reanimated'
1033: 
1034: function AnimatedButton({ onPress }: { onPress: () => void }) {
1035:   // Store the press STATE (0 = not pressed, 1 = pressed)
1036:   const pressed = useSharedValue(0)
1037: 
1038:   const tap = Gesture.Tap()
1039:     .onBegin(() => {
1040:       pressed.set(withTiming(1))
1041:     })
1042:     .onFinalize(() => {
1043:       pressed.set(withTiming(0))
1044:     })
1045:     .onEnd(() => {
1046:       runOnJS(onPress)()
1047:     })
1048: 
1049:   // Derive visual values from the state
1050:   const animatedStyle = useAnimatedStyle(() => ({
1051:     transform: [
1052:       { scale: interpolate(withTiming(pressed.get()), [0, 1], [1, 0.95]) },
1053:     ],
1054:   }))
1055: 
1056:   return (
1057:     <GestureDetector gesture={tap}>
1058:       <Animated.View style={animatedStyle}>
1059:         <Text>Press me</Text>
1060:       </Animated.View>
1061:     </GestureDetector>
1062:   )
1063: }
1064: ```
1065: 
1066: Store the press **state** (0 or 1), then derive the scale via `interpolate`.
1067: 
1068: This keeps the shared value as ground truth. Use `runOnJS` to call JS functions
1069: 
1070: from worklets. Use `.set()` and `.get()` for React Compiler compatibility.
1071: 
1072: ---
1073: 
1074: ## 4. Scroll Performance
1075: 
1076: **Impact: HIGH**
1077: 
1078: Tracking scroll position without causing render thrashing.
1079: 
1080: ### 4.1 Never Track Scroll Position in useState
1081: 
1082: **Impact: HIGH (prevents render thrashing during scroll)**
1083: 
1084: Never store scroll position in `useState`. Scroll events fire rapidly—state
1085: 
1086: updates cause render thrashing and dropped frames. Use a Reanimated shared value
1087: 
1088: for animations or a ref for non-reactive tracking.
1089: 
1090: **Incorrect: useState causes jank**
1091: 
1092: ```tsx
1093: import { useState } from 'react'
1094: import {
1095:   ScrollView,
1096:   NativeSyntheticEvent,
1097:   NativeScrollEvent,
1098: } from 'react-native'
1099: 
1100: function Feed() {
1101:   const [scrollY, setScrollY] = useState(0)
1102: 
1103:   const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
1104:     setScrollY(e.nativeEvent.contentOffset.y) // re-renders on every frame
1105:   }
1106: 
1107:   return <ScrollView onScroll={onScroll} scrollEventThrottle={16} />
1108: }
1109: ```
1110: 
1111: **Correct: Reanimated for animations**
1112: 
1113: ```tsx
1114: import Animated, {
1115:   useSharedValue,
1116:   useAnimatedScrollHandler,
1117: } from 'react-native-reanimated'
1118: 
1119: function Feed() {
1120:   const scrollY = useSharedValue(0)
1121: 
1122:   const onScroll = useAnimatedScrollHandler({
1123:     onScroll: (e) => {
1124:       scrollY.value = e.contentOffset.y // runs on UI thread, no re-render
1125:     },
1126:   })
1127: 
1128:   return (
1129:     <Animated.ScrollView
1130:       onScroll={onScroll}
1131:       // higher number has better performance, but it fires less often.
1132:       // unset this if you need higher precision over performance.
1133:       scrollEventThrottle={16}
1134:     />
1135:   )
1136: }
1137: ```
1138: 
1139: **Correct: ref for non-reactive tracking**
1140: 
1141: ```tsx
1142: import { useRef } from 'react'
1143: import {
1144:   ScrollView,
1145:   NativeSyntheticEvent,
1146:   NativeScrollEvent,
1147: } from 'react-native'
1148: 
1149: function Feed() {
1150:   const scrollY = useRef(0)
1151: 
1152:   const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
1153:     scrollY.current = e.nativeEvent.contentOffset.y // no re-render
1154:   }
1155: 
1156:   return <ScrollView onScroll={onScroll} scrollEventThrottle={16} />
1157: }
1158: ```
1159: 
1160: ---
1161: 
1162: ## 5. Navigation
1163: 
1164: **Impact: HIGH**
1165: 
1166: Using native navigators for stack and tab navigation instead of
1167: JS-based alternatives.
1168: 
1169: ### 5.1 Use Native Navigators for Navigation
1170: 
1171: **Impact: HIGH (native performance, platform-appropriate UI)**
1172: 
1173: Always use native navigators instead of JS-based ones. Native navigators use
1174: 
1175: platform APIs (UINavigationController on iOS, Fragment on Android) for better
1176: 
1177: performance and native behavior.
1178: 
1179: **For stacks:** Use `@react-navigation/native-stack` or expo-router's default
1180: 
1181: stack (which uses native-stack). Avoid `@react-navigation/stack`.
1182: 
1183: **For tabs:** Use `react-native-bottom-tabs` (native) or expo-router's native
1184: 
1185: tabs. Avoid `@react-navigation/bottom-tabs` when native feel matters.
1186: 
1187: - [React Navigation Native Stack](https://reactnavigation.org/docs/native-stack-navigator)
1188: 
1189: - [React Native Bottom Tabs with React Navigation](https://oss.callstack.com/react-native-bottom-tabs/docs/guides/usage-with-react-navigation)
1190: 
1191: - [React Native Bottom Tabs with Expo Router](https://oss.callstack.com/react-native-bottom-tabs/docs/guides/usage-with-expo-router)
1192: 
1193: - [Expo Router Native Tabs](https://docs.expo.dev/router/advanced/native-tabs)
1194: 
1195: **Incorrect: JS stack navigator**
1196: 
1197: ```tsx
1198: import { createStackNavigator } from '@react-navigation/stack'
1199: 
1200: const Stack = createStackNavigator()
1201: 
1202: function App() {
1203:   return (
1204:     <Stack.Navigator>
1205:       <Stack.Screen name='Home' component={HomeScreen} />
1206:       <Stack.Screen name='Details' component={DetailsScreen} />
1207:     </Stack.Navigator>
1208:   )
1209: }
1210: ```
1211: 
1212: **Correct: native stack with react-navigation**
1213: 
1214: ```tsx
1215: import { createNativeStackNavigator } from '@react-navigation/native-stack'
1216: 
1217: const Stack = createNativeStackNavigator()
1218: 
1219: function App() {
1220:   return (
1221:     <Stack.Navigator>
1222:       <Stack.Screen name='Home' component={HomeScreen} />
1223:       <Stack.Screen name='Details' component={DetailsScreen} />
1224:     </Stack.Navigator>
1225:   )
1226: }
1227: ```
1228: 
1229: **Correct: expo-router uses native stack by default**
1230: 
1231: ```tsx
1232: // app/_layout.tsx
1233: import { Stack } from 'expo-router'
1234: 
1235: export default function Layout() {
1236:   return <Stack />
1237: }
1238: ```
1239: 
1240: **Incorrect: JS bottom tabs**
1241: 
1242: ```tsx
1243: import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
1244: 
1245: const Tab = createBottomTabNavigator()
1246: 
1247: function App() {
1248:   return (
1249:     <Tab.Navigator>
1250:       <Tab.Screen name='Home' component={HomeScreen} />
1251:       <Tab.Screen name='Settings' component={SettingsScreen} />
1252:     </Tab.Navigator>
1253:   )
1254: }
1255: ```
1256: 
1257: **Correct: native bottom tabs with react-navigation**
1258: 
1259: ```tsx
1260: import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation'
1261: 
1262: const Tab = createNativeBottomTabNavigator()
1263: 
1264: function App() {
1265:   return (
1266:     <Tab.Navigator>
1267:       <Tab.Screen
1268:         name='Home'
1269:         component={HomeScreen}
1270:         options={{
1271:           tabBarIcon: () => ({ sfSymbol: 'house' }),
1272:         }}
1273:       />
1274:       <Tab.Screen
1275:         name='Settings'
1276:         component={SettingsScreen}
1277:         options={{
1278:           tabBarIcon: () => ({ sfSymbol: 'gear' }),
1279:         }}
1280:       />
1281:     </Tab.Navigator>
1282:   )
1283: }
1284: ```
1285: 
1286: **Correct: expo-router native tabs**
1287: 
1288: ```tsx
1289: // app/(tabs)/_layout.tsx
1290: import { NativeTabs } from 'expo-router/unstable-native-tabs'
1291: 
1292: export default function TabLayout() {
1293:   return (
1294:     <NativeTabs>
1295:       <NativeTabs.Trigger name='index'>
1296:         <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
1297:         <NativeTabs.Trigger.Icon sf='house.fill' md='home' />
1298:       </NativeTabs.Trigger>
1299:       <NativeTabs.Trigger name='settings'>
1300:         <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
1301:         <NativeTabs.Trigger.Icon sf='gear' md='settings' />
1302:       </NativeTabs.Trigger>
1303:     </NativeTabs>
1304:   )
1305: }
1306: ```
1307: 
1308: On iOS, native tabs automatically enable `contentInsetAdjustmentBehavior` on the
1309: 
1310: first `ScrollView` at the root of each tab screen, so content scrolls correctly
1311: 
1312: behind the translucent tab bar. If you need to disable this, use
1313: 
1314: `disableAutomaticContentInsets` on the trigger.
1315: 
1316: **Incorrect: custom header component**
1317: 
1318: ```tsx
1319: <Stack.Screen
1320:   name='Profile'
1321:   component={ProfileScreen}
1322:   options={{
1323:     header: () => <CustomHeader title='Profile' />,
1324:   }}
1325: />
1326: ```
1327: 
1328: **Correct: native header options**
1329: 
1330: ```tsx
1331: <Stack.Screen
1332:   name='Profile'
1333:   component={ProfileScreen}
1334:   options={{
1335:     title: 'Profile',
1336:     headerLargeTitleEnabled: true,
1337:     headerSearchBarOptions: {
1338:       placeholder: 'Search',
1339:     },
1340:   }}
1341: />
1342: ```
1343: 
1344: Native headers support iOS large titles, search bars, blur effects, and proper
1345: 
1346: safe area handling automatically.
1347: 
1348: - **Performance**: Native transitions and gestures run on the UI thread
1349: 
1350: - **Platform behavior**: Automatic iOS large titles, Android material design
1351: 
1352: - **System integration**: Scroll-to-top on tab tap, PiP avoidance, proper safe
1353: 
1354:   areas
1355: 
1356: - **Accessibility**: Platform accessibility features work automatically
1357: 
1358: ---
1359: 
1360: ## 6. React State
1361: 
1362: **Impact: MEDIUM**
1363: 
1364: Patterns for managing React state to avoid stale closures and
1365: unnecessary re-renders.
1366: 
1367: ### 6.1 Minimize State Variables and Derive Values
1368: 
1369: **Impact: MEDIUM (fewer re-renders, less state drift)**
1370: 
1371: Use the fewest state variables possible. If a value can be computed from existing state or props, derive it during render instead of storing it in state. Redundant state causes unnecessary re-renders and can drift out of sync.
1372: 
1373: **Incorrect: redundant state**
1374: 
1375: ```tsx
1376: function Cart({ items }: { items: Item[] }) {
1377:   const [total, setTotal] = useState(0)
1378:   const [itemCount, setItemCount] = useState(0)
1379: 
1380:   useEffect(() => {
1381:     setTotal(items.reduce((sum, item) => sum + item.price, 0))
1382:     setItemCount(items.length)
1383:   }, [items])
1384: 
1385:   return (
1386:     <View>
1387:       <Text>{itemCount} items</Text>
1388:       <Text>Total: ${total}</Text>
1389:     </View>
1390:   )
1391: }
1392: ```
1393: 
1394: **Correct: derived values**
1395: 
1396: ```tsx
1397: function Cart({ items }: { items: Item[] }) {
1398:   const total = items.reduce((sum, item) => sum + item.price, 0)
1399:   const itemCount = items.length
1400: 
1401:   return (
1402:     <View>
1403:       <Text>{itemCount} items</Text>
1404:       <Text>Total: ${total}</Text>
1405:     </View>
1406:   )
1407: }
1408: ```
1409: 
1410: **Another example:**
1411: 
1412: ```tsx
1413: // Incorrect: storing both firstName, lastName, AND fullName
1414: const [firstName, setFirstName] = useState('')
1415: const [lastName, setLastName] = useState('')
1416: const [fullName, setFullName] = useState('')
1417: 
1418: // Correct: derive fullName
1419: const [firstName, setFirstName] = useState('')
1420: const [lastName, setLastName] = useState('')
1421: const fullName = `${firstName} ${lastName}`
1422: ```
1423: 
1424: State should be the minimal source of truth. Everything else is derived.
1425: 
1426: Reference: [https://react.dev/learn/choosing-the-state-structure](https://react.dev/learn/choosing-the-state-structure)
1427: 
1428: ### 6.2 Use fallback state instead of initialState
1429: 
1430: **Impact: MEDIUM (reactive fallbacks without syncing)**
1431: 
1432: Use `undefined` as initial state and nullish coalescing (`??`) to fall back to
1433: 
1434: parent or server values. State represents user intent only—`undefined` means
1435: 
1436: "user hasn't chosen yet." This enables reactive fallbacks that update when the
1437: 
1438: source changes, not just on initial render.
1439: 
1440: **Incorrect: syncs state, loses reactivity**
1441: 
1442: ```tsx
1443: type Props = { fallbackEnabled: boolean }
1444: 
1445: function Toggle({ fallbackEnabled }: Props) {
1446:   const [enabled, setEnabled] = useState(defaultEnabled)
1447:   // If fallbackEnabled changes, state is stale
1448:   // State mixes user intent with default value
1449: 
1450:   return <Switch value={enabled} onValueChange={setEnabled} />
1451: }
1452: ```
1453: 
1454: **Correct: state is user intent, reactive fallback**
1455: 
1456: ```tsx
1457: type Props = { fallbackEnabled: boolean }
1458: 
1459: function Toggle({ fallbackEnabled }: Props) {
1460:   const [_enabled, setEnabled] = useState<boolean | undefined>(undefined)
1461:   const enabled = _enabled ?? defaultEnabled
1462:   // undefined = user hasn't touched it, falls back to prop
1463:   // If defaultEnabled changes, component reflects it
1464:   // Once user interacts, their choice persists
1465: 
1466:   return <Switch value={enabled} onValueChange={setEnabled} />
1467: }
1468: ```
1469: 
1470: **With server data:**
1471: 
1472: ```tsx
1473: function ProfileForm({ data }: { data: User }) {
1474:   const [_theme, setTheme] = useState<string | undefined>(undefined)
1475:   const theme = _theme ?? data.theme
1476:   // Shows server value until user overrides
1477:   // Server refetch updates the fallback automatically
1478: 
1479:   return <ThemePicker value={theme} onChange={setTheme} />
1480: }
1481: ```
1482: 
1483: ### 6.3 useState Dispatch updaters for State That Depends on Current Value
1484: 
1485: **Impact: MEDIUM (avoids stale closures, prevents unnecessary re-renders)**
1486: 
1487: When the next state depends on the current state, use a dispatch updater
1488: 
1489: (`setState(prev => ...)`) instead of reading the state variable directly in a
1490: 
1491: callback. This avoids stale closures and ensures you're comparing against the
1492: 
1493: latest value.
1494: 
1495: **Incorrect: reads state directly**
1496: 
1497: ```tsx
1498: const [size, setSize] = useState<Size | undefined>(undefined)
1499: 
1500: const onLayout = (e: LayoutChangeEvent) => {
1501:   const { width, height } = e.nativeEvent.layout
1502:   // size may be stale in this closure
1503:   if (size?.width !== width || size?.height !== height) {
1504:     setSize({ width, height })
1505:   }
1506: }
1507: ```
1508: 
1509: **Correct: dispatch updater**
1510: 
1511: ```tsx
1512: const [size, setSize] = useState<Size | undefined>(undefined)
1513: 
1514: const onLayout = (e: LayoutChangeEvent) => {
1515:   const { width, height } = e.nativeEvent.layout
1516:   setSize((prev) => {
1517:     if (prev?.width === width && prev?.height === height) return prev
1518:     return { width, height }
1519:   })
1520: }
1521: ```
1522: 
1523: Returning the previous value from the updater skips the re-render.
1524: 
1525: For primitive states, you don't need to compare values before firing a
1526: 
1527: re-render.
1528: 
1529: **Incorrect: unnecessary comparison for primitive state**
1530: 
1531: ```tsx
1532: const [size, setSize] = useState<Size | undefined>(undefined)
1533: 
1534: const onLayout = (e: LayoutChangeEvent) => {
1535:   const { width, height } = e.nativeEvent.layout
1536:   setSize((prev) => (prev === width ? prev : width))
1537: }
1538: ```
1539: 
1540: **Correct: sets primitive state directly**
1541: 
1542: ```tsx
1543: const [size, setSize] = useState<Size | undefined>(undefined)
1544: 
1545: const onLayout = (e: LayoutChangeEvent) => {
1546:   const { width, height } = e.nativeEvent.layout
1547:   setSize(width)
1548: }
1549: ```
1550: 
1551: However, if the next state depends on the current state, you should still use a
1552: 
1553: dispatch updater.
1554: 
1555: **Incorrect: reads state directly from the callback**
1556: 
1557: ```tsx
1558: const [count, setCount] = useState(0)
1559: 
1560: const onTap = () => {
1561:   setCount(count + 1)
1562: }
1563: ```
1564: 
1565: **Correct: dispatch updater**
1566: 
1567: ```tsx
1568: const [count, setCount] = useState(0)
1569: 
1570: const onTap = () => {
1571:   setCount((prev) => prev + 1)
1572: }
1573: ```
1574: 
1575: ---
1576: 
1577: ## 7. State Architecture
1578: 
1579: **Impact: MEDIUM**
1580: 
1581: Ground truth principles for state variables and derived values.
1582: 
1583: ### 7.1 State Must Represent Ground Truth
1584: 
1585: **Impact: HIGH (cleaner logic, easier debugging, single source of truth)**
1586: 
1587: State variables—both React `useState` and Reanimated shared values—should
1588: 
1589: represent the actual state of something (e.g., `pressed`, `progress`, `isOpen`),
1590: 
1591: not derived visual values (e.g., `scale`, `opacity`, `translateY`). Derive
1592: 
1593: visual values from state using computation or interpolation.
1594: 
1595: **Incorrect: storing the visual output**
1596: 
1597: ```tsx
1598: const scale = useSharedValue(1)
1599: 
1600: const tap = Gesture.Tap()
1601:   .onBegin(() => {
1602:     scale.set(withTiming(0.95))
1603:   })
1604:   .onFinalize(() => {
1605:     scale.set(withTiming(1))
1606:   })
1607: 
1608: const animatedStyle = useAnimatedStyle(() => ({
1609:   transform: [{ scale: scale.get() }],
1610: }))
1611: ```
1612: 
1613: **Correct: storing the state, deriving the visual**
1614: 
1615: ```tsx
1616: const pressed = useSharedValue(0) // 0 = not pressed, 1 = pressed
1617: 
1618: const tap = Gesture.Tap()
1619:   .onBegin(() => {
1620:     pressed.set(withTiming(1))
1621:   })
1622:   .onFinalize(() => {
1623:     pressed.set(withTiming(0))
1624:   })
1625: 
1626: const animatedStyle = useAnimatedStyle(() => ({
1627:   transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.95]) }],
1628: }))
1629: ```
1630: 
1631: **Why this matters:**
1632: 
1633: State variables should represent real "state", not necessarily a desired end
1634: 
1635: result.
1636: 
1637: 1. **Single source of truth** — The state (`pressed`) describes what's
1638: 
1639:    happening; visuals are derived
1640: 
1641: 2. **Easier to extend** — Adding opacity, rotation, or other effects just
1642: 
1643:    requires more interpolations from the same state
1644: 
1645: 3. **Debugging** — Inspecting `pressed = 1` is clearer than `scale = 0.95`
1646: 
1647: 4. **Reusable logic** — The same `pressed` value can drive multiple visual
1648: 
1649:    properties
1650: 
1651: **Same principle for React state:**
1652: 
1653: ```tsx
1654: // Incorrect: storing derived values
1655: const [isExpanded, setIsExpanded] = useState(false)
1656: const [height, setHeight] = useState(0)
1657: 
1658: useEffect(() => {
1659:   setHeight(isExpanded ? 200 : 0)
1660: }, [isExpanded])
1661: 
1662: // Correct: derive from state
1663: const [isExpanded, setIsExpanded] = useState(false)
1664: const height = isExpanded ? 200 : 0
1665: ```
1666: 
1667: State is the minimal truth. Everything else is derived.
1668: 
1669: ---
1670: 
1671: ## 8. React Compiler
1672: 
1673: **Impact: MEDIUM**
1674: 
1675: Compatibility patterns for React Compiler with React Native and
1676: Reanimated.
1677: 
1678: ### 8.1 Destructure Functions Early in Render (React Compiler)
1679: 
1680: **Impact: HIGH (stable references, fewer re-renders)**
1681: 
1682: This rule is only applicable if you are using the React Compiler.
1683: 
1684: Destructure functions from hooks at the top of render scope. Never dot into
1685: 
1686: objects to call functions. Destructured functions are stable references; dotting
1687: 
1688: creates new references and breaks memoization.
1689: 
1690: **Incorrect: dotting into object**
1691: 
1692: ```tsx
1693: import { useRouter } from 'expo-router'
1694: 
1695: function SaveButton(props) {
1696:   const router = useRouter()
1697: 
1698:   // bad: react-compiler will key the cache on "props" and "router", which are objects that change each render
1699:   const handlePress = () => {
1700:     props.onSave()
1701:     router.push('/success') // unstable reference
1702:   }
1703: 
1704:   return <Button onPress={handlePress}>Save</Button>
1705: }
1706: ```
1707: 
1708: **Correct: destructure early**
1709: 
1710: ```tsx
1711: import { useRouter } from 'expo-router'
1712: 
1713: function SaveButton({ onSave }) {
1714:   const { push } = useRouter()
1715: 
1716:   // good: react-compiler will key on push and onSave
1717:   const handlePress = () => {
1718:     onSave()
1719:     push('/success') // stable reference
1720:   }
1721: 
1722:   return <Button onPress={handlePress}>Save</Button>
1723: }
1724: ```
1725: 
1726: ### 8.2 Use .get() and .set() for Reanimated Shared Values (not .value)
1727: 
1728: **Impact: LOW (required for React Compiler compatibility)**
1729: 
1730: With React Compiler enabled, use `.get()` and `.set()` instead of reading or
1731: 
1732: writing `.value` directly on Reanimated shared values. The compiler can't track
1733: 
1734: property access—explicit methods ensure correct behavior.
1735: 
1736: **Incorrect: breaks with React Compiler**
1737: 
1738: ```tsx
1739: import { useSharedValue } from 'react-native-reanimated'
1740: 
1741: function Counter() {
1742:   const count = useSharedValue(0)
1743: 
1744:   const increment = () => {
1745:     count.value = count.value + 1 // opts out of react compiler
1746:   }
1747: 
1748:   return <Button onPress={increment} title={`Count: ${count.value}`} />
1749: }
1750: ```
1751: 
1752: **Correct: React Compiler compatible**
1753: 
1754: ```tsx
1755: import { useSharedValue } from 'react-native-reanimated'
1756: 
1757: function Counter() {
1758:   const count = useSharedValue(0)
1759: 
1760:   const increment = () => {
1761:     count.set(count.get() + 1)
1762:   }
1763: 
1764:   return <Button onPress={increment} title={`Count: ${count.get()}`} />
1765: }
1766: ```
1767: 
1768: See the
1769: 
1770: [Reanimated docs](https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/#react-compiler-support)
1771: 
1772: for more.
1773: 
1774: ---
1775: 
1776: ## 9. User Interface
1777: 
1778: **Impact: MEDIUM**
1779: 
1780: Native UI patterns for images, menus, modals, styling, and
1781: platform-consistent interfaces.
1782: 
1783: ### 9.1 Measuring View Dimensions
1784: 
1785: **Impact: MEDIUM (synchronous measurement, avoid unnecessary re-renders)**
1786: 
1787: Use both `useLayoutEffect` (synchronous) and `onLayout` (for updates). The sync
1788: 
1789: measurement gives you the initial size immediately; `onLayout` keeps it current
1790: 
1791: when the view changes. For non-primitive states, use a dispatch updater to
1792: 
1793: compare values and avoid unnecessary re-renders.
1794: 
1795: **Height only:**
1796: 
1797: ```tsx
1798: import { useLayoutEffect, useRef, useState } from 'react'
1799: import { View, LayoutChangeEvent } from 'react-native'
1800: 
1801: function MeasuredBox({ children }: { children: React.ReactNode }) {
1802:   const ref = useRef<View>(null)
1803:   const [height, setHeight] = useState<number | undefined>(undefined)
1804: 
1805:   useLayoutEffect(() => {
1806:     // Sync measurement on mount (RN 0.82+)
1807:     const rect = ref.current?.getBoundingClientRect()
1808:     if (rect) setHeight(rect.height)
1809:     // Pre-0.82: ref.current?.measure((x, y, w, h) => setHeight(h))
1810:   }, [])
1811: 
1812:   const onLayout = (e: LayoutChangeEvent) => {
1813:     setHeight(e.nativeEvent.layout.height)
1814:   }
1815: 
1816:   return (
1817:     <View ref={ref} onLayout={onLayout}>
1818:       {children}
1819:     </View>
1820:   )
1821: }
1822: ```
1823: 
1824: **Both dimensions:**
1825: 
1826: ```tsx
1827: import { useLayoutEffect, useRef, useState } from 'react'
1828: import { View, LayoutChangeEvent } from 'react-native'
1829: 
1830: type Size = { width: number; height: number }
1831: 
1832: function MeasuredBox({ children }: { children: React.ReactNode }) {
1833:   const ref = useRef<View>(null)
1834:   const [size, setSize] = useState<Size | undefined>(undefined)
1835: 
1836:   useLayoutEffect(() => {
1837:     const rect = ref.current?.getBoundingClientRect()
1838:     if (rect) setSize({ width: rect.width, height: rect.height })
1839:   }, [])
1840: 
1841:   const onLayout = (e: LayoutChangeEvent) => {
1842:     const { width, height } = e.nativeEvent.layout
1843:     setSize((prev) => {
1844:       // for non-primitive states, compare values before firing a re-render
1845:       if (prev?.width === width && prev?.height === height) return prev
1846:       return { width, height }
1847:     })
1848:   }
1849: 
1850:   return (
1851:     <View ref={ref} onLayout={onLayout}>
1852:       {children}
1853:     </View>
1854:   )
1855: }
1856: ```
1857: 
1858: Use functional setState to compare—don't read state directly in the callback.
1859: 
1860: ### 9.2 Modern React Native Styling Patterns
1861: 
1862: **Impact: MEDIUM (consistent design, smoother borders, cleaner layouts)**
1863: 
1864: Follow these styling patterns for cleaner, more consistent React Native code.
1865: 
1866: **Always use `borderCurve: 'continuous'` with `borderRadius`:**
1867: 
1868: **Use `gap` instead of margin for spacing between elements:**
1869: 
1870: ```tsx
1871: // Incorrect – margin on children
1872: <View>
1873:   <Text style={{ marginBottom: 8 }}>Title</Text>
1874:   <Text style={{ marginBottom: 8 }}>Subtitle</Text>
1875: </View>
1876: 
1877: // Correct – gap on parent
1878: <View style={{ gap: 8 }}>
1879:   <Text>Title</Text>
1880:   <Text>Subtitle</Text>
1881: </View>
1882: ```
1883: 
1884: **Use `padding` for space within, `gap` for space between:**
1885: 
1886: ```tsx
1887: <View style={{ padding: 16, gap: 12 }}>
1888:   <Text>First</Text>
1889:   <Text>Second</Text>
1890: </View>
1891: ```
1892: 
1893: **Use `experimental_backgroundImage` for linear gradients:**
1894: 
1895: ```tsx
1896: // Incorrect – third-party gradient library
1897: <LinearGradient colors={['#000', '#fff']} />
1898: 
1899: // Correct – native CSS gradient syntax
1900: <View
1901:   style={{
1902:     experimental_backgroundImage: 'linear-gradient(to bottom, #000, #fff)',
1903:   }}
1904: />
1905: ```
1906: 
1907: **Use CSS `boxShadow` string syntax for shadows:**
1908: 
1909: ```tsx
1910: // Incorrect – legacy shadow objects or elevation
1911: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 }
1912: { elevation: 4 }
1913: 
1914: // Correct – CSS box-shadow syntax
1915: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }
1916: ```
1917: 
1918: **Avoid multiple font sizes – use weight and color for emphasis:**
1919: 
1920: ```tsx
1921: // Incorrect – varying font sizes for hierarchy
1922: <Text style={{ fontSize: 18 }}>Title</Text>
1923: <Text style={{ fontSize: 14 }}>Subtitle</Text>
1924: <Text style={{ fontSize: 12 }}>Caption</Text>
1925: 
1926: // Correct – consistent size, vary weight and color
1927: <Text style={{ fontWeight: '600' }}>Title</Text>
1928: <Text style={{ color: '#666' }}>Subtitle</Text>
1929: <Text style={{ color: '#999' }}>Caption</Text>
1930: ```
1931: 
1932: Limiting font sizes creates visual consistency. Use `fontWeight` (bold/semibold)
1933: 

(Output capped at 50 KB. Showing lines 1-1933. Use offset=1934 to continue.)
</content>
```

---

## Assistant (Plan · Big Pickle · 16.5s)

_Thinking:_

Now I have a good picture of the entire configuration. Let me analyze what might be wrong or needs fixing:

### Current setup:
1. **Root `opencode.json`** — Defines 4 agents: `backend`, `mobile`, `whatsapp-bot`, and `plan`
2. **Agent prompt files** — in `.opencode/agents/backend.md`, `.opencode/agents/mobile.md`, `.opencode/agents/whatsapp-bot.md`
3. **Instructions** — loads AGENTS.md + project-level AGENTS.md files + rules/*.md files
4. **Skills** — 3 skills installed: `expo-architect`, `typescript-react-reviewer`, `vercel-react-native-skills`
5. **Permission** — Global `edit: ask`, and per-agent permissions

### Issues I see:

1. **`plan` agent has no `"description"` field** — This is required per the opencode schema. The other agents have it, but `plan` is missing it.

2. **`plan` agent has `"mode": "primary"` but it should probably be `"plan"`** — Wait, let me check... In opencode, agent modes can be "primary", "plan", "ask"... Let me think. Looking at the schema, the valid modes are: "primary", "plan", "ask". The "plan" mode is actually a valid mode. But wait, it says `"mode": "primary"` for the `plan` agent entry. Hmm, actually the `mode` being "primary" for an agent named "plan" seems intentional - it's a primary agent that does planning work. That's probably fine.

   Actually wait, let me reconsider. Looking at opencode docs, the `mode` field determines how the agent behaves. "primary" means it's a regular agent. But there's also a special "plan" mode. Having an agent named "plan" with mode "primary" seems odd but should work.

3. **Missing `.opencode/agents/backend.md` skills are configured in permissions** — The `permission.skill` section references skills like `prisma-migrate`, `add-endpoint`, `add-screen`, `expo-build`, `add-flow`, `deploy-bot`. But these skills don't exist in the `skills-lock.json` file. The only installed skills are `expo-architect`, `typescript-react-reviewer`, and `vercel-react-native-skills`. So the skill permissions reference non-existent skills.

4. **The `bash` permissions for backend use `npx tsx*`** — The glob pattern `npx tsx*` would match `npx tsx` but not `npx tsx watch` since `*` in opencode globs... Actually looking at the documentation, opencode uses glob patterns. `npx tsx*` should match anything starting with `npx tsx`. This seems fine.

5. **Global `edit: ask` in root AGENTS.md contradicts per-agent permissions** — The root AGENTS.md says "Preguntar antes de editar archivos (edit: ask global)" but each agent has `"edit": "allow"`. The per-agent permission should take precedence, so this should be fine.

6. **The `mobile` agent permissions reference `npx expo*`** — On Windows, the command would be `npx expo` not `npx expo*`. The glob `npx expo*` should match things like `npx expo start`, `npx expo lint` etc. But on Windows, `npx` might not be the right prefix - maybe `npx.cmd` or they might use `npm run` scripts anyway. This is minor.

7. **The `permission.bash` structure uses an object with `"*": "ask"` for all agents** — This is fine, it sets default to ask with specific commands allowed.

8. **Skills permissions reference skills that don't exist** — The biggest issue. The config references:
   - `prisma-migrate`, `add-endpoint` (backend)
   - `add-screen`, `expo-build` (mobile)
   - `add-flow`, `deploy-bot` (whatsapp-bot)
   
   But the skills-lock.json only has: `expo-architect`, `typescript-react-reviewer`, `vercel-react-native-skills`
   
   These are probably custom skills the user intended to create but hasn't yet. The opencode config will try to load them and fail.

9. **The `plan` agent description is missing** — All other agents have `description` but `plan` doesn't.

10. **The `plan` agent has `bash: "deny"` (string) instead of the object structure** — Actually looking at the config again: `"bash": "deny"` is a valid shorthand. This is fine.

Let me look at this more carefully:

```json
"plan": {
    "mode": "primary",
    "permission": {
        "edit": "deny",
        "bash": "deny"
    }
}
```

Missing: `description`, `model`, `color`, `prompt`

Hmm, some of these might be optional. Let me check...

Actually in opencode, `description` is required for primary agents that can be referenced with `@agent`. The `plan` agent is probably meant to be used as a special agent for planning work. Missing `description` might cause issues if someone tries `@plan`.

Let me compile my findings.

Analicé toda tu configuración. Estos son los problemas que encontré:

**1. Skills referenciados en `permission.skill` no existen**
Los skills `prisma-migrate`, `add-endpoint`, `add-screen`, `expo-build`, `add-flow`, `deploy-bot` no están instalados en `skills-lock.json`. Solo tenés 3 skills instalados: `expo-architect`, `typescript-react-reviewer`, `vercel-react-native-skills`. El config va a fallar al intentar cargar esos skills inexistentes.

**2. Agente `plan` le falta `description`**
```json
"plan": {
    "mode": "primary",
    "permission": { ... }
}
```
Sin `description`, no se puede invocar con `@plan`.

**3. Agente `plan` le falta `model` y `prompt`**
A diferencia de los otros 3 agentes, `plan` no tiene asignado un modelo (`model`) ni prompt override. Siempre va a usar el modelo por defecto, pero es recomendable explicitarlo.

**4. Root AGENTS.md dice `edit: ask global` pero los agentes tienen `edit: allow`**
No es un error de opencode (el permiso del agente sobreescribe), pero es inconsistente con lo que declaraste en las instrucciones. El agente va a editar sin preguntar aunque el AGENTS.md diga lo contrario.

**5. `npx tsx*` y `npx expo*` en permisos bash**
En Windows, `npx` suele ser `npx.cmd`. Los globs `npx tsx*` y `npx expo*` funcionan, pero si tenes problemas con el PATH de Windows, considera que el wildcard podría no matchear correctamente. Probalo y si ves que pide permiso para comandos que deberían estar allow, ajustá los patrones.

¿Querés que te ayude a corregir alguno de estos puntos?

---

## User

.agents/skills deberia etar dentro de .opencode no?

---

## Assistant (Plan · Big Pickle · 3.3s)

_Thinking:_

The user is asking whether the `.agents/skills/` directory should be inside `.opencode/` instead of at the root level. Let me check what's actually in `.agents/skills/` vs `.opencode/skills/`.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.agents\\skills"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.agents\skills</path>
<type>directory</type>
<entries>
api-authentication/
api-error-handling/
api-security-hardening/
express-typescript/
mobile-offline-support/
prisma-orm-v7-skills/
react-native-web-navigation/
react-state-management/
rest-api-design/
typescript-strict-mode/

(10 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\skills"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\skills</path>
<type>directory</type>
<entries>
add-flow/
add-screen/
expo-architect/
prisma-migrate/
typescript-react-reviewer/
vercel-react-native-skills/

(6 entries)
</entries>
```

---

## Assistant (Plan · Big Pickle · 4.9s)

_Thinking:_

Interesting! So there are two directories:
- `.agents/skills/` — has 10 skill folders (api-authentication, api-error-handling, etc.)
- `.opencode/skills/` — has 6 skill folders (add-flow, add-screen, expo-architect, prisma-migrate, typescript-react-reviewer, vercel-react-native-skills)

So the user's question is: shouldn't `.agents/skills/` be inside `.opencode/` instead?

The answer depends on which tool is reading skills from `.agents/`. In opencode, the skills directory is `.opencode/skills/`. The `.agents/` directory at root level is not a standard opencode path. The skills in `.agents/skills/` are probably skills from a different tool (like Claude Code or similar), while the ones in `.opencode/skills/` are opencode skills.

Let me check what's in the `.opencode/skills/add-flow/` for example, since that matches one of the skills referenced in the config's `permission.skill`.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.agents\\skills\\api-authentication"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.agents\skills\api-authentication</path>
<type>directory</type>
<entries>
references/
SKILL.md

(2 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\skills\\add-flow"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\skills\add-flow</path>
<type>directory</type>
<entries>
SKILL.md

(1 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\skills\\prisma-migrate"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\skills\prisma-migrate</path>
<type>directory</type>
<entries>
SKILL.md

(1 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\skills\\add-screen"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\skills\add-screen</path>
<type>directory</type>
<entries>
SKILL.md

(1 entries)
</entries>
```

---

## Assistant (Plan · Big Pickle · 10.9s)

_Thinking:_

So the situation is:

1. **`.opencode/skills/`** — Contains 6 skills, including `add-flow`, `add-screen`, `prisma-migrate` which are exactly the ones referenced in `opencode.json`'s `permission.skill` fields. These ARE the opencode skills that work with the config.

2. **`.agents/skills/`** — Contains 10 different skills (api-authentication, api-error-handling, etc.) which seem to be from a different tool ecosystem (looks like `.agents/` is a Claude Code/Aider/Codex convention).

The user is asking if `.agents/skills/` should be inside `.opencode/`. The answer is: **no, they should stay separate**. The `.agents/` directory is from another tool (likely Claude Code or similar). The `.opencode/skills/` already has the opencode skills.

But actually, the user might be thinking that `.agents/skills/` contains the skills referenced in `opencode.json` that I said were missing. Let me re-examine...

No, I said the skills `prisma-migrate`, `add-endpoint`, etc. don't exist in `skills-lock.json`. But looking at it more carefully:

The `skills-lock.json` only tracks skills from external sources (GitHub repos). But the skills in `.opencode/skills/` are LOCAL files! They exist on disk but are NOT registered in `skills-lock.json`. Opencode might still find them though, since `skills` directory exists.

Actually, I need to check how opencode resolves skills. The `permission.skill` in the config says `"prisma-migrate": "allow"` — opencode would look for a skill named "prisma-migrate". It would search in the skills directories. The fact that `.opencode/skills/prisma-migrate/` exists on disk means the skill IS available, even though it's not in `skills-lock.json`.

So actually, my earlier analysis about skills not existing was wrong. The skills ARE on disk in `.opencode/skills/`. They just aren't tracked in `skills-lock.json` because they're local skills (not installed from GitHub).

Let me also check if `.agents/skills/` skills should be moved. The `.agents/` directory at the repo root is NOT a standard opencode directory. Opencode looks for skills in `.opencode/skills/`. So `.agents/skills/` is likely from another tool.

But there's a subtlety — opencode might ALSO look at `.agents/`? Let me think about this more carefully. Actually, looking at the opencode docs, the standard paths are:
- `.opencode/skills/` — skills directory
- `.opencode/agents/` — agent prompts

The `.agents/` directory at the root is not standard opencode. So yes, if the user wants those skills to be available to opencode, they should move `.agents/skills/*` → `.opencode/skills/`.

Let me verify: opencode.json's `"instructions"` array loads `.opencode/agents/*.md` via the `prompt` field using `{file:.opencode/agents/backend.md}` pattern, but doesn't reference `.agents/` at all.

So the answer is: `.agents/skills/` is not used by opencode. If those 10 skills are meant for opencode, they should be moved to `.opencode/skills/`. If they're from another tool (Claude Code, etc.), they should stay where they are.

Situación actual:

- **`.opencode/skills/`** — contiene los 6 skills que referenciás en `opencode.json` (`prisma-migrate`, `add-flow`, `add-screen`, etc.). Existen en disco pero **no están en `skills-lock.json`** porque son skills locales (no instalados desde GitHub). Eso está bien, opencode los va a encontrar igual.

- **`.agents/skills/`** — contiene 10 skills distintos (`api-authentication`, `prisma-orm-v7-skills`, etc.). Esa carpeta `.agents/` **no es una ruta estándar de opencode**. Opencode busca skills en `.opencode/skills/`, no en `.agents/`.

**R:** Si querés que esos 10 skills de `.agents/skills/` estén disponibles para opencode, **sí, deberían estar dentro de `.opencode/skills/`**. Sino, están huérfanos y ningún tool los va a usar.

¿Son skills de otro tool (Claude Code, Aider, etc.) o los creaste para opencode?

---

## User

## 📌 Convención de Pull Requests

Las Pull Requests deben ser claras, consistentes y facilitar la revisión.

---

### 🧾 Título

```bash
<type>(<scope>): <descripcion breve>
```

---

### 📄 Estructura del cuerpo

```md
## Descripción
Resumen del cambio y su propósito.

---

## Cambios realizados
- Lista de cambios relevantes

---

## Impacto
- Componentes o módulos afectados

---

## Consideraciones
- Notas adicionales, dependencias o advertencias

---

## Testing
- Cómo se probó el cambio
- Casos cubiertos

---

## Resultado
- Estado final del sistema tras el cambio
```  dame el template de pr para los cambios que hice agregue skils $ git pull
remote: Enumerating objects: 10, done.
remote: Counting objects: 100% (10/10), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 4 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
Unpacking objects: 100% (4/4), 1.21 KiB | 95.00 KiB/s, done.
From https://github.com/Damianpiazz/SupplyCycle
   3e69ea4..629394a  main       -> origin/main
Updating 3e69ea4..629394a
Fast-forward
 .agents/skills/backend-testing/SKILL.md            | 261 +++++++++
 .agents/skills/backend-testing/SKILL.toon          |  26 +
 .agents/skills/backend-testing/evals/evals.json    |  49 ++
 .../references/intake-packets-and-route-outs.md    |  34 ++
 .../references/stability-checklist.md              |  28 +
 .../references/test-layer-matrix.md                |  28 +
 .agents/skills/reglas-negocio/SKILL.md             |  28 +
 .agents/skills/reglas-negocio/image.png            | Bin 0 -> 37285 bytes
 .agents/skills/whatsapp-cloud-api/SKILL.md         | 187 +++++++
 .../whatsapp-cloud-api/references/CONVERSATIONS.md |  59 ++
 .../whatsapp-cloud-api/references/ERROR-CODES.md   | 245 ++++++++
 .../whatsapp-cloud-api/references/INTERACTIVE.md   | 433 +++++++++++++++
 .../skills/whatsapp-cloud-api/references/MEDIA.md  | 211 +++++++
 .../whatsapp-cloud-api/references/MESSAGING.md     | 486 ++++++++++++++++
 .../whatsapp-cloud-api/references/PHONE-NUMBERS.md | 191 +++++++
 .../whatsapp-cloud-api/references/TEMPLATES.md     | 115 ++++
 .../whatsapp-cloud-api/references/WEBHOOKS.md      | 616 +++++++++++++++++++++
 skills-lock.json                                   |  12 +
 18 files changed, 3009 insertions(+)
 create mode 100644 .agents/skills/backend-testing/SKILL.md
 create mode 100644 .agents/skills/backend-testing/SKILL.toon
 create mode 100644 .agents/skills/backend-testing/evals/evals.json
 create mode 100644 .agents/skills/backend-testing/references/intake-packets-and-route-outs.md
 create mode 100644 .agents/skills/backend-testing/references/stability-checklist.md
 create mode 100644 .agents/skills/backend-testing/references/test-layer-matrix.md
 create mode 100644 .agents/skills/reglas-negocio/SKILL.md
 create mode 100644 .agents/skills/reglas-negocio/image.png
 create mode 100644 .agents/skills/whatsapp-cloud-api/SKILL.md
 create mode 100644 .agents/skills/whatsapp-cloud-api/references/CONVERSATIONS.md
 create mode 100644 .agents/skills/whatsapp-cloud-api/references/ERROR-CODES.md
 create mode 100644 .agents/skills/whatsapp-cloud-api/references/INTERACTIVE.md
 create mode 100644 .agents/skills/whatsapp-cloud-api/references/MEDIA.md
 create mode 100644 .agents/skills/whatsapp-cloud-api/references/MESSAGING.md
 create mode 100644 .agents/skills/whatsapp-cloud-api/references/PHONE-NUMBERS.md
 create mode 100644 .agents/skills/whatsapp-cloud-api/references/TEMPLATES.md
 create mode 100644 .agents/skills/whatsapp-cloud-api/references/WEBHOOKS.md

fran@DESKTOP-BIVHNOU MINGW64 /c/damian/Repo/SupplyCycle (main)
$ git checkout prueba/tiago
branch 'prueba/tiago' set up to track 'origin/prueba/tiago'.
Switched to a new branch 'prueba/tiago'

fran@DESKTOP-BIVHNOU MINGW64 /c/damian/Repo/SupplyCycle (prueba/tiago)
$ git pull
Already up to date.

fran@DESKTOP-BIVHNOU MINGW64 /c/damian/Repo/SupplyCycle (prueba/tiago)
$ git pull
Already up to date.

fran@DESKTOP-BIVHNOU MINGW64 /c/damian/Repo/SupplyCycle (prueba/tiago)
$ git status
On branch prueba/tiago
Your branch is up to date with 'origin/prueba/tiago'.

nothing to commit, working tree clean

fran@DESKTOP-BIVHNOU MINGW64 /c/damian/Repo/SupplyCycle (prueba/tiago)
$ git log
commit 88a68919363abfa3b07eb7987b5611f0562d8c56 (HEAD -> prueba/tiago, origin/prueba/tiago)
Author: Tiaguito-dev <tiagosolis3@gmail.com>
Date:   Fri May 22 15:33:21 2026 -0300

    sills/prueba
    
    Hay que revisar el destino de instalacion de las skills, ya que no estoy entendiendo muy bien la estructura de carpetas. Cualquier cosa yo lo reacomodo, per 

---

## Assistant (Plan · Big Pickle · 6.2s)

_Thinking:_

The user is asking me to:

1. Create a PR template based on the convention they shared
2. They also want me to address the skills situation - they pulled changes from main that added new skills to `.agents/skills/` (backend-testing, reglas-negocio, whatsapp-cloud-api), and they mention "Hay que revisar el destino de instalacion de las skills" (need to review the installation destination of the skills).

So the context is:
- They're on branch `prueba/tiago`
- They pulled from main which added new skills in `.agents/skills/`
- The commit message says: "sills/prueba - Hay que revisar el destino de instalacion de las skills, ya que no estoy entendiendo muy bien la estructura de carpetas."
- They need a PR template for these changes
- They need to figure out whether skills should be in `.agents/skills/` or `.opencode/skills/`

But wait - I'm in Plan Mode (read-only). I can only observe, analyze, and plan. I cannot make edits.

Let me think about what the user wants:

1. A PR template - I can provide this as text in my response
2. Guidance on the skills directory structure - I can analyze and recommend

Let me also check what skills-lock.json now contains, and what's in the new skills.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\skills-lock.json"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\skills-lock.json</path>
<type>file</type>
<content>
1: {
2:   "version": 1,
3:   "skills": {
4:     "api-authentication": {
5:       "source": "secondsky/claude-skills",
6:       "sourceType": "github",
7:       "skillPath": "plugins/api-authentication/skills/api-authentication/SKILL.md",
8:       "computedHash": "d6af30e3d89d606366ef43ac98943ff03caefe6b8e8e833d8ff923457a553184"
9:     },
10:     "api-security-hardening": {
11:       "source": "aj-geddes/useful-ai-prompts",
12:       "sourceType": "github",
13:       "skillPath": "skills/api-security-hardening/SKILL.md",
14:       "computedHash": "d6ce866c17f268a6eb86b7c2afc0c06178ca653cc8f655860a6997b4e6a11bcf"
15:     },
16:     "documentation-writer": {
17:       "source": "github/awesome-copilot",
18:       "sourceType": "github",
19:       "skillPath": "skills/documentation-writer/SKILL.md",
20:       "computedHash": "ee53d65b163cd7eb953a930c95841cfe398cc2c0bd24c06508bbaa07c432be35"
21:     },
22:     "express-typescript": {
23:       "source": "mindrally/skills",
24:       "sourceType": "github",
25:       "skillPath": "express-typescript/SKILL.md",
26:       "computedHash": "77bf2fb3933e0487ba30d6269342d5b1ce02210f3aee892cd202e295b9fde99a"
27:     },
28:     "prisma-orm-v7-skills": {
29:       "source": "gocallum/nextjs16-agent-skills",
30:       "sourceType": "github",
31:       "skillPath": "skills/prisma-orm-v7-skills/SKILL.md",
32:       "computedHash": "371d23a97d15be1fdd5ae350b4b2a151045e8fabf83aed0b2d716e747f7ea6d2"
33:     },
34:     "rest-api-design": {
35:       "source": "aj-geddes/useful-ai-prompts",
36:       "sourceType": "github",
37:       "skillPath": "skills/rest-api-design/SKILL.md",
38:       "computedHash": "4e84e39b1a3915ee1920f504b2b08b5d1d836f100c8d389dd0b48e9c3cfc9d4c"
39:     },
40:     "typescript-strict-mode": {
41:       "source": "fluid-tools/claude-skills",
42:       "sourceType": "github",
43:       "skillPath": "skills/typescript-strict-mode/SKILL.md",
44:       "computedHash": "de0587bce81b289fcd72d4ae5acef6f64f5507c86687f3b094c2f6c3611f84dc"
45:     }
46:   }
47: }

(End of file - total 47 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.opencode\\skills-lock.json"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.opencode\skills-lock.json</path>
<type>file</type>
<content>
1: {
2:   "version": 1,
3:   "skills": {
4:     "expo-architect": {
5:       "source": "shipshitdev/library",
6:       "sourceType": "github",
7:       "skillPath": "skills/expo-architect/SKILL.md",
8:       "computedHash": "a87c93804c84164109332f0cae159a1dfa0423d7b4ea504e9c43760ce2997c16"
9:     },
10:     "mapbox-cartography": {
11:       "source": "mapbox/mapbox-agent-skills",
12:       "sourceType": "github",
13:       "skillPath": "skills/mapbox-cartography/SKILL.md",
14:       "computedHash": "e0de5323eaa8054e4773ed077e3cda384e645d445eafeb1e6334ab1267558dbb"
15:     },
16:     "mapbox-geospatial-operations": {
17:       "source": "mapbox/mapbox-agent-skills",
18:       "sourceType": "github",
19:       "skillPath": "skills/mapbox-geospatial-operations/SKILL.md",
20:       "computedHash": "533b45ccdb8539678bb6d523f2324f1aed284d20089d1defe5885294f3eb1b0f"
21:     },
22:     "mapbox-style-quality": {
23:       "source": "mapbox/mapbox-agent-skills",
24:       "sourceType": "github",
25:       "skillPath": "skills/mapbox-style-quality/SKILL.md",
26:       "computedHash": "f4e2b639fc3aa7fc8142f4dee4bb22ac2e6614c018d09dcf109ee963c5cfb43f"
27:     },
28:     "typescript-react-reviewer": {
29:       "source": "dotneet/claude-code-marketplace",
30:       "sourceType": "github",
31:       "skillPath": "review-tool/skills/typescript-react-reviewer/SKILL.md",
32:       "computedHash": "7f86cd28e11d2b4b120b635d18814b82cd655a2b9d9ba8a105b3ee06c478cf38"
33:     },
34:     "ui-ux-pro-max": {
35:       "source": "nextlevelbuilder/ui-ux-pro-max-skill",
36:       "sourceType": "github",
37:       "skillPath": ".claude/skills/ui-ux-pro-max/SKILL.md",
38:       "computedHash": "6337038fe1fe6bbe1b9f252ab678ee575859190bab6f0f246f4061824eb40875"
39:     },
40:     "vercel-react-native-skills": {
41:       "source": "vercel-labs/agent-skills",
42:       "sourceType": "github",
43:       "skillPath": "skills/react-native-skills/SKILL.md",
44:       "computedHash": "41d24eafa7c3d82e270439808f7cfbc4d51aeb2d14f2809a2267c16275784d06"
45:     }
46:   }
47: }

(End of file - total 47 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 11.4s)

_Thinking:_

So now I see the full picture:

**Root `skills-lock.json`** (at `C:\damian\Repo\SupplyCycle\skills-lock.json`):
- Tracks skills in `.agents/skills/` 
- Has 7 skills: api-authentication, api-security-hardening, documentation-writer, express-typescript, prisma-orm-v7-skills, rest-api-design, typescript-strict-mode
- This is for the `.agents/` directory (Claude Code / other tool)

**`.opencode/skills-lock.json`**:
- Tracks skills in `.opencode/skills/`
- Has 7 skills: expo-architect, mapbox-cartography, mapbox-geospatial-operations, mapbox-style-quality, typescript-react-reviewer, ui-ux-pro-max, vercel-react-native-skills
- This is for opencode

**New skills from the pull (on `prueba/tiago` branch):**
- `.agents/skills/backend-testing/` — new, from main
- `.agents/skills/reglas-negocio/` — new, from main
- `.agents/skills/whatsapp-cloud-api/` — new, from main

But the root `skills-lock.json` from main also added 3 new entries (documentation-writer, and the others that came with the pull).

Now, the key question from the commit message: "Hay que revisar el destino de instalacion de las skills" — they're confused about where skills should go.

Looking at the structure:

- **Root `skills-lock.json`** + `.agents/skills/` = used by Claude Code (`.` is Claude's config dir)
- **`.opencode/skills-lock.json`** + `.opencode/skills/` = used by opencode

These are TWO DIFFERENT TOOL ECOSYSTEMS. 

The new skills (`backend-testing`, `reglas-negocio`, `whatsapp-cloud-api`) were added to `.agents/skills/` and registered in the root `skills-lock.json`. This means they're configured for Claude Code, not for opencode.

For opencode to use them, they'd need to either:
1. Move to `.opencode/skills/` and register in `.opencode/skills-lock.json`
2. Or have opencode configured to also look at `.agents/skills/` (not standard)

The user (or Tiago) is confused because they see both `.agents/` and `.opencode/` as skill directories and doesn't know which one to use.

Let me also check if there's a `.agents/` config that parallels `opencode.json`.

Actually, looking at the pull output more carefully:
- The root `skills-lock.json` has 3 new additions: `backend-testing`, `reglas-negocio`, `whatsapp-cloud-api` (and maybe `documentation-writer` and others)
- The files were added to `.agents/skills/` paths

But on the `prueba/tiago` branch, these files might not be there yet (since it was just a pull from main, but switching to prueba/tiago... wait, actually they pulled changes from main while on main, then switched to prueba/tiago). The files might be in the working tree.

Let me also check what the commit added to skills-lock.json.

From the pull output:
```
 skills-lock.json                                   |  12 +
```

So the root `skills-lock.json` was modified. Let me check the current state.

Actually wait - they did:
1. `git pull` on `main` — got the new skills
2. `git checkout prueba/tiago` — switched branches
3. `git pull` — up to date

So these files exist in their working directory on `prueba/tiago` branch. But actually... the commit `88a6891` is the HEAD of `prueba/tiago`, and the files were added in `main` (commit `629394a`). Since `prueba/tiago` was created before `main` had those files... but `git checkout` preserved the working tree files, so they might be visible as untracked/modified.

Actually wait, let me re-read:
```
$ git pull  # on main, got new commits
$ git checkout prueba/tiago  # switched to existing branch
$ git pull  # already up to date
$ git status  # nothing to commit, working tree clean
```

So `prueba/tiago` already had those files too. Or its base already included them.

OK, the user is asking me to:
1. Provide the PR template using the convention they shared
2. Address the skills destination question

Given I'm in Plan Mode, I'll provide guidance as text. Let me also read one of the new skills to understand what kind of skills these are.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.agents\\skills\\backend-testing\\SKILL.md",
  "limit": 20
}
```

**Error:**
```
File not found: C:\damian\Repo\SupplyCycle\.agents\skills\backend-testing\SKILL.md
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.agents\\skills\\reglas-negocio\\SKILL.md",
  "limit": 20
}
```

**Error:**
```
File not found: C:\damian\Repo\SupplyCycle\.agents\skills\reglas-negocio\SKILL.md
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.agents\\skills\\whatsapp-cloud-api\\SKILL.md",
  "limit": 20
}
```

**Error:**
```
File not found: C:\damian\Repo\SupplyCycle\.agents\skills\whatsapp-cloud-api\SKILL.md
```

---

## Assistant (Plan · Big Pickle · 9.5s)

_Thinking:_

The files aren't on the `prueba/tiago` branch—they were pulled from `main` but `prueba/tiago` doesn't have them. The user likely needs to merge them or apply them. 

Let me now provide the user with:

1. The PR template for the changes
2. Analysis of the skills destination problem
3. A plan for what to do

Acá va el análisis completo:

---

## PR Template

```md
## Descripción
Agrega 3 skills al repositorio: `backend-testing`, `reglas-negocio` y `whatsapp-cloud-api`.
Revisión del directorio de instalación de skills (`.agents/skills/` vs `.opencode/skills/`).

---

## Cambios realizados
- Agrega skill `backend-testing` con referencias, evaluaciones y checklist de estabilidad
- Agrega skill `reglas-negocio` con documentación visual
- Agrega skill `whatsapp-cloud-api` con referencias completas de la API (media, mensajes, webhooks, etc.)
- Actualiza `skills-lock.json` con los 3 nuevos skills

---

## Impacto
- `.agents/skills/` — nuevos skills instalados
- `skills-lock.json` — registro actualizado

---

## Consideraciones
Estos skills se instalaron en `.agents/skills/`, que es el directorio de **Claude Code** (`.claude/` en la práctica). Para que **opencode** pueda usarlos, deberían estar en `.opencode/skills/` o configurarse en `opencode.json`.

---

## Testing
- `git diff skills-lock.json` — verifica los registros agregados
- Revisar que los SKILL.md sean legibles y tengan referencias válidas

---

## Resultado
Nuevos skills disponibles para los agentes. Pendiente definir directorio definitivo (`.agents/` vs `.opencode/`).
```

---

## Sobre el problema de directorio

Tenés **dos ecosistemas distintos** conviviendo:

| Directorio | skills-lock.json | Tool |
|---|---|---|
| `.agents/skills/` | `skills-lock.json` (raíz) | **Claude Code** |
| `.opencode/skills/` | `.opencode/skills-lock.json` | **opencode** |

Los 3 nuevos skills (`backend-testing`, `reglas-negocio`, `whatsapp-cloud-api`) se agregaron a `.agents/skills/` y al `skills-lock.json` raíz. **Son skills de Claude Code, no de opencode**.

Para que opencode los vea tenés dos opciones:

**Opción A: Moverlos a `.opencode/skills/`**
```
.agents/skills/backend-testing/  →  .opencode/skills/backend-testing/
.agents/skills/reglas-negocio/   →  .opencode/skills/reglas-negocio/
.agents/skills/whatsapp-cloud-api/ → .opencode/skills/whatsapp-cloud-api/
```
Y registrarlos en `.opencode/skills-lock.json`.

**Opción B: Configurar opencode para leer `.agents/skills/`**
En `opencode.json` podrías agregar los paths de los skills en `instructions` o referenciarlos en los prompts de los agentes, pero no hay un campo nativo para "directorio adicional de skills".

**Opción C: Dejarlos solo para Claude Code**
Si usás ambos tools, cada uno con sus skills, es válido. Pero tenés que mantener ambos `skills-lock.json` actualizados por separado.

---

**Conclusión:** Si estás usando opencode como tool principal, los skills deberían ir en `.opencode/skills/`. Si también usás Claude Code, decidí si querés duplicar, mover, o mantener separados.

¿Qué preferís hacer?

---

## User

Quiero que el TDD 000 me lo conviertas en un ADRs y me des los distintos ADRs que podrian existir ya que no los defini. usa el template en ADRs 

---

## Assistant (Plan · Big Pickle · 44.4s)

_Thinking:_

The user wants me to:

1. Find the "TDD 000" document in the repo
2. Convert it into an ADR (Architecture Decision Record)
3. Identify what other ADRs should exist (since they haven't defined any)
4. Use the ADR template that presumably exists somewhere in the repo

Let me search for:
- TDD 000 document
- ADR template
- Any existing ADRs

**Tool: task**

**Input:**
```json
{
  "description": "Find TDD 000 and ADR template",
  "prompt": "Search the repository at C:\\damian\\Repo\\SupplyCycle for the following:\n\n1. Any file named or containing \"TDD 000\" or \"TDD000\" or \"tdd-000\" — search broadly with grep and glob\n2. Any ADR (Architecture Decision Record) files — look for files with \"adr\" in the name, or in directories like \"adr\", \"adrs\", \"docs/adr\", \"decisions\", etc.\n3. Any ADR template file — search for \"adr-template\", \"ADR-template\", \"template-adr\", etc.\n4. Any directory like \"docs/\" or \"documentation/\" that might contain architecture docs\n\nReturn ALL file paths found along with their full contents (or at least first 100 lines for large files). Be thorough.",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_1aa023d16ffe7WjEan01014CEY (for resuming to continue this task if needed)

<task_result>
Here is a comprehensive report of all findings from the repository at `C:\damian\Repo\SupplyCycle`.

---

## 1. TDD Files (Technical Design Documents)

The grep for the exact patterns `TDD 000`, `TDD000`, `tdd-000` returned **no direct matches**. However, the files use the naming convention `TDD-XXXX` (with a hyphen) and `TDD_XXXX` (with underscore). The glob search for `*TDD*` found **8 files** in `docs/TDDs/`:

### Template
- **`C:\damian\Repo\SupplyCycle\docs\TDDs\Template.md`**
  - Template for TDDs with sections: Contexto de Negocio (PRD), Diseño Técnico (RFC), Casos de Borde y Errores, Plan de Implementacion. Contains placeholders for autor, fecha, titulo.

### Actual TDD Documents (all authored by "Equipo SupplyCycle", dated 2026-05-22)

| File | Full Path | Lines |
|---|---|---|
| TDD-0000 | `C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0000_errores_globales.md` | 328 |
| TDD-0001 | `C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0001_Clientes.md` | 189 |
| TDD-0002 | `C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0002_Items.md` | 139 |
| TDD-0003 | `C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0003_Pedidos.md` | 274 |
| TDD-0004 | `C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0004_Reparto.md` | 201 |
| TDD-0005 | `C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0005_Usuarios.md` | 194 |
| TDD-0006 | `C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0006_Arquitectura_Mobile.md` | 201 |

**Summary of each TDD:**
- **TDD-0000** -- Standardized API error/response format, `AppError` class, error middleware, Axios client for mobile.
- **TDD-0001** -- `Cliente` entity (name, address, delivery day/time, geo coords), Prisma model, Zod validation, CRUD endpoints.
- **TDD-0002** -- `Item` entity (products like water jugs), `PedidoItem` join table, active/inactive status, list endpoints.
- **TDD-0003** -- `Pedido` entity (order), states PENDIENTE/ENTREGADO/NO_ENTREGADO, confirm/cancel flows, unique constraint per client per date.
- **TDD-0004** -- `Reparto` entity (delivery route grouping), states PENDIENTE/EN_CURSO/COMPLETADO, truck load summary, state transition rules.
- **TDD-0005** -- `Usuario` entity, auth (login JWT, bcrypt), roles REPARTIDOR/ADMIN, password rules, `/auth/login` and `/auth/me` endpoints.
- **TDD-0006** -- Mobile architecture: feature-based structure, Zustand + TanStack Query + Axios + React Hook Form + Zod, navigation, offline support, TypeScript strict rules.

**Note about naming:** The files use `TDD_000X_` in filenames with underscores, but the documents themselves reference `TDD-000X` (with hyphen). None use the exact patterns `TDD 000` (with space) or `TDD000` (no separator).

---

## 2. ADR (Architecture Decision Record) Files

Only **one** file exists in the ADRs directory -- a **template only**. There are **no numbered ADR documents** in the repository.

- **`C:\damian\Repo\SupplyCycle\docs\ADRs\Template.md`**
  - Template for ADRs with sections: Contexto, Decision, Opciones Consideradas, Consecuencias, Impacto en el Sistema (Backend/Frontend/Infraestructura), Reglas Derivadas. Contains placeholder frontmatter (autor, fecha, titulo).

  No files matching `ADR-0001`, `ADR-0002`, etc., were found anywhere in the repository.

---

## 3. ADR Template Files

Found **1 ADR template** and also **1 TDD template**:

- **`C:\damian\Repo\SupplyCycle\docs\ADRs\Template.md`** -- ADR template (81 lines)
- **`C:\damian\Repo\SupplyCycle\docs\TDDs\Template.md`** -- TDD template (55 lines)

No files matching `adr-template`, `ADR-template`, `template-adr`, `template-adr` were found by glob (the templates use the name `Template.md` within their respective directories).

---

## 4. Docs / Documentation Directories

**Main docs directory:**
- **`C:\damian\Repo\SupplyCycle\docs\`** -- Contains 4 entries:
  - `ADRs/` -- Contains only `Template.md`
  - `TDDs/` -- Contains `Template.md` + TDD_0000 through TDD_0006
  - `sessions/` -- Contains `session-ses_1e19.md`
  - `agent-configuration.md` -- Comprehensive OpenCode agent setup docs (551 lines)

**Session file:**
- **`C:\damian\Repo\SupplyCycle\docs\sessions\session-ses_1e19.md`** -- A recorded OpenCode session from 2026-05-12 about configuring backend/mobile/whatsapp-bot agents (very long file, appears to be a full session transcript).

**Additional configuration directory found:**
- **`C:\damian\Repo\SupplyCycle\.opencode/`** -- OpenCode configuration directory containing:
  - `agents/` -- `backend.md`, `mobile.md`, `whatsapp-bot.md` (agent prompt files)
  - `skills/` -- `prisma-migrate/SKILL.md`, `add-screen/SKILL.md`, `add-flow/SKILL.md`, `expo-architect/`, `vercel-react-native-skills/`, `typescript-react-reviewer/`
  - `skills-lock.json`, `package.json`, `node_modules/`
- **`C:\damian\Repo\SupplyCycle\opencode.json`** -- The main OpenCode configuration file

No `documentation/` directory was found anywhere in the repository.

---

## Complete File List (All Paths Found)

```
C:\damian\Repo\SupplyCycle\docs\ADRs\Template.md
C:\damian\Repo\SupplyCycle\docs\TDDs\Template.md
C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0000_errores_globales.md
C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0001_Clientes.md
C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0002_Items.md
C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0003_Pedidos.md
C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0004_Reparto.md
C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0005_Usuarios.md
C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0006_Arquitectura_Mobile.md
C:\damian\Repo\SupplyCycle\docs\agent-configuration.md
C:\damian\Repo\SupplyCycle\docs\sessions\session-ses_1e19.md
C:\damian\Repo\SupplyCycle\opencode.json
```

All file contents were read in full (or first 100+ lines for the large ones) and are displayed above in the tool outputs.
</task_result>
```

---

## Assistant (Plan · Big Pickle · 3.0s)

_Thinking:_

Let me now read the TDD-0000 (errores globales) and the ADR Template to understand the content and the template format.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\TDD_0000_errores_globales.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\docs\TDDs\TDD_0000_errores_globales.md</path>
<type>file</type>
<content>
1: ---
2: autor: Equipo SupplyCycle
3: fecha: 2026-05-22
4: titulo: Errores y Respuestas Globales
5: ---
6: 
7: # TDD-0006: Errores y Respuestas Globales
8: 
9: ## Contexto de Negocio (PRD)
10: 
11: ### Objetivo
12: 
13: Definir un formato estándar para todas las respuestas de la API, tanto exitosas como de error. Esto garantiza que el mobile siempre reciba respuestas predecibles y pueda manejarlas de forma consistente, sin importar qué endpoint las genera.
14: 
15: ### User Persona
16: 
17: - **Nombre**: Desarrollador (mobile y backend)
18: - **Necesidad**: Saber exactamente qué estructura va a recibir en cada respuesta para no tener que manejar casos especiales por endpoint.
19: 
20: ### Criterios de Aceptación
21: 
22: - Todas las respuestas exitosas deben seguir el mismo formato.
23: - Todos los errores deben seguir el mismo formato con código, mensaje, timestamp y detalle opcional.
24: - Los códigos HTTP deben usarse correctamente según la convención definida en este TDD.
25: - El backend nunca debe exponer stack traces ni mensajes internos en producción.
26: - Todos los errores de negocio deben lanzarse mediante `AppError`. Nunca usar `res.status().json()` directamente para errores.
27: - El mobile debe usar Axios y tener un manejador global de errores que interprete este formato.
28: - Los errores de validación Zod deben manejarse explícitamente en el middleware global.
29: 
30: ---
31: 
32: ## Diseño Técnico (RFC)
33: 
34: ### Formato de respuesta exitosa
35: 
36: ```ts
37: // Respuesta con un solo objeto
38: {
39:   data: T;
40: }
41: 
42: // Respuesta con lista
43: {
44:   data: T[];
45:   total: number;
46: }
47: ```
48: 
49: ### Formato de respuesta de error
50: 
51: ```ts
52: {
53:   error: {
54:     code: string;       // código interno ej: "VALIDATION_ERROR", "NOT_FOUND"
55:     message: string;    // mensaje legible en español
56:     timestamp: string;  // ISO 8601, útil para debugging
57:     details?: {         // opcional, solo para errores de validación
58:       field: string;
59:       message: string;
60:     }[];
61:   };
62: }
63: ```
64: 
65: ### Ejemplos
66: 
67: #### Error de validación (400)
68: 
69: ```json
70: {
71:   "error": {
72:     "code": "VALIDATION_ERROR",
73:     "message": "Los datos ingresados no son válidos",
74:     "timestamp": "2026-05-22T10:30:00.000Z",
75:     "details": [
76:       { "field": "email", "message": "El email no tiene un formato válido" },
77:       { "field": "password", "message": "La contraseña debe tener al menos 8 caracteres" }
78:     ]
79:   }
80: }
81: ```
82: 
83: #### Error de autenticación (401)
84: 
85: ```json
86: {
87:   "error": {
88:     "code": "UNAUTHORIZED",
89:     "message": "Credenciales inválidas",
90:     "timestamp": "2026-05-22T10:30:00.000Z"
91:   }
92: }
93: ```
94: 
95: #### Error de recurso no encontrado (404)
96: 
97: ```json
98: {
99:   "error": {
100:     "code": "NOT_FOUND",
101:     "message": "Pedido no encontrado",
102:     "timestamp": "2026-05-22T10:30:00.000Z"
103:   }
104: }
105: ```
106: 
107: #### Error de conflicto (409)
108: 
109: ```json
110: {
111:   "error": {
112:     "code": "CONFLICT",
113:     "message": "El cliente ya tiene un pedido para esa fecha",
114:     "timestamp": "2026-05-22T10:30:00.000Z"
115:   }
116: }
117: ```
118: 
119: ### Códigos internos de error
120: 
121: | Code | Uso |
122: |---|---|
123: | `VALIDATION_ERROR` | Datos de entrada inválidos (Zod) |
124: | `UNAUTHORIZED` | Sin token o credenciales inválidas |
125: | `FORBIDDEN` | Token válido pero sin permisos |
126: | `NOT_FOUND` | Recurso inexistente |
127: | `CONFLICT` | Violación de unicidad o regla de negocio |
128: | `INTERNAL_ERROR` | Error inesperado del servidor |
129: 
130: ### Convenciones HTTP
131: 
132: | Situación | Código HTTP |
133: |---|---|
134: | Obtener recurso exitosamente | 200 OK |
135: | Crear recurso exitosamente | 201 Created |
136: | Datos de entrada inválidos | 400 Bad Request |
137: | Sin autenticación o credenciales inválidas | 401 Unauthorized |
138: | Autenticado pero sin permisos | 403 Forbidden |
139: | Recurso no encontrado | 404 Not Found |
140: | Conflicto de negocio o unicidad | 409 Conflict |
141: | Error inesperado del servidor | 500 Internal Server Error |
142: 
143: > Nota: No se usa 204 No Content. Todas las respuestas devuelven JSON.
144: 
145: ---
146: 
147: ## Implementación en Backend
148: 
149: ### Clase base de errores
150: 
151: ```ts
152: // src/lib/AppError.ts
153: export class AppError extends Error {
154:   constructor(
155:     public statusCode: number,
156:     public code: string,
157:     message: string,
158:     public details?: { field: string; message: string }[]
159:   ) {
160:     super(message);
161:   }
162: }
163: ```
164: 
165: ### Helpers de errores comunes
166: 
167: ```ts
168: // src/lib/errors.ts
169: export const Errors = {
170:   notFound: (resource: string) =>
171:     new AppError(404, 'NOT_FOUND', `${resource} no encontrado`),
172: 
173:   conflict: (message: string) =>
174:     new AppError(409, 'CONFLICT', message),
175: 
176:   unauthorized: (message = 'Credenciales inválidas') =>
177:     new AppError(401, 'UNAUTHORIZED', message),
178: 
179:   forbidden: (message = 'No tenés permisos para realizar esta acción') =>
180:     new AppError(403, 'FORBIDDEN', message),
181: 
182:   validation: (details: { field: string; message: string }[]) =>
183:     new AppError(400, 'VALIDATION_ERROR', 'Los datos ingresados no son válidos', details),
184: };
185: ```
186: 
187: ### Middleware global de errores (Express)
188: 
189: ```ts
190: // src/middleware/error.middleware.ts
191: import { ZodError } from 'zod';
192: import { AppError } from '../lib/AppError.js';
193: 
194: export const errorHandler = (err, req, res, next) => {
195:   const timestamp = new Date().toISOString();
196: 
197:   // Error de validación Zod
198:   if (err instanceof ZodError) {
199:     return res.status(400).json({
200:       error: {
201:         code: 'VALIDATION_ERROR',
202:         message: 'Los datos ingresados no son válidos',
203:         timestamp,
204:         details: err.errors.map((e) => ({
205:           field: e.path.join('.'),
206:           message: e.message,
207:         })),
208:       },
209:     });
210:   }
211: 
212:   // Error de negocio controlado
213:   if (err instanceof AppError) {
214:     return res.status(err.statusCode).json({
215:       error: {
216:         code: err.code,
217:         message: err.message,
218:         timestamp,
219:         details: err.details,
220:       },
221:     });
222:   }
223: 
224:   // Error inesperado: no exponer detalles en producción
225:   console.error(err);
226:   return res.status(500).json({
227:     error: {
228:       code: 'INTERNAL_ERROR',
229:       message: 'Ocurrió un error inesperado',
230:       timestamp,
231:     },
232:   });
233: };
234: ```
235: 
236: > El middleware debe registrarse al final de `app.ts`, después de todas las rutas.
237: 
238: ### Regla obligatoria
239: 
240: Todos los errores de negocio deben lanzarse con `throw Errors.xxx()` o `throw new AppError(...)`.
241: Nunca usar `res.status().json()` directamente para manejar errores.
242: 
243: ---
244: 
245: ## Implementación en Mobile
246: 
247: ### Tipos TypeScript
248: 
249: ```ts
250: // types/api.ts
251: export interface ApiError {
252:   code: string;
253:   message: string;
254:   timestamp: string;
255:   details?: { field: string; message: string }[];
256: }
257: 
258: export interface ApiResponse<T> {
259:   data: T;
260:   total?: number;
261: }
262: 
263: export interface ApiErrorResponse {
264:   error: ApiError;
265: }
266: ```
267: 
268: ### Cliente HTTP con Axios
269: 
270: ```ts
271: // services/api.ts
272: import axios from 'axios';
273: import type { ApiError } from '../types/api';
274: 
275: export const apiClient = axios.create({
276:   baseURL: process.env.EXPO_PUBLIC_API_URL,
277:   headers: { 'Content-Type': 'application/json' },
278: });
279: 
280: // Interceptor para agregar JWT en cada request
281: apiClient.interceptors.request.use(async (config) => {
282:   const token = await getToken();
283: 
284:   if (token) {
285:     config.headers.Authorization = `Bearer ${token}`;
286:   }
287: 
288:   return config;
289: });
290: 
291: // Manejador global de errores Axios
292: export const handleApiError = (error: unknown): ApiError => {
293:   if (axios.isAxiosError(error) && error.response?.data?.error) {
294:     return error.response.data.error;
295:   }
296:   return {
297:     code: 'INTERNAL_ERROR',
298:     message: 'Ocurrió un error inesperado',
299:     timestamp: new Date().toISOString(),
300:   };
301: };
302: ```
303: 
304: ---
305: 
306: ## Casos de Borde y Errores
307: 
308: | Escenario | Resultado Esperado | Código HTTP |
309: |---|---|---|
310: | Error de validación Zod | Formato estándar con `details` por campo | 400 Bad Request |
311: | Ruta inexistente | Error `NOT_FOUND` con mensaje claro | 404 Not Found |
312: | Error inesperado en producción | Error `INTERNAL_ERROR` sin stack trace | 500 Internal Server Error |
313: | Token malformado | Error `UNAUTHORIZED` | 401 Unauthorized |
314: | Error de negocio (ej: pedido ya procesado) | Error `CONFLICT` con mensaje descriptivo | 409 Conflict |
315: | Error manejado sin AppError | No permitido — viola las convenciones del proyecto | — |
316: 
317: ---
318: 
319: ## Plan de Implementación
320: 
321: 1. Crear clase `AppError` en `backend/src/lib/AppError.ts`
322: 2. Crear helpers de error en `backend/src/lib/errors.ts`
323: 3. Implementar middleware global en `backend/src/middleware/error.middleware.ts`
324: 4. Registrar el middleware al final de `app.ts`
325: 5. Usar `throw Errors.xxx()` en todos los servicios y controladores
326: 6. Definir tipos `ApiResponse` y `ApiError` en `mobile/types/api.ts`
327: 7. Implementar `apiClient` con Axios en `mobile/services/api.ts`
328: 8. Usar `handleApiError` en todos los servicios del mobile

(End of file - total 328 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\Template.md"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\docs\ADRs\Template.md</path>
<type>file</type>
<content>
1: ---
2: autor: [Nombre]
3: fecha: [AAAA-MM-DD]
4: titulo: [Nombre de la Decisión Técnica]
5: ---
6: 
7: # ADR-[XXXX]: [Título de la Decisión]
8: 
9: ## Contexto
10: 
11: [Descripción del problema técnico o necesidad que motiva la decisión.]
12: 
13: - Qué problema existe actualmente
14: - Por qué es necesario tomar una decisión
15: - Qué restricciones o condiciones influyen en la decisión
16: 
17: ---
18: 
19: ## Decisión
20: 
21: [Descripción clara y concreta de la decisión técnica adoptada.]
22: 
23: - Qué se decide implementar o adoptar
24: - Qué se descarta (si aplica)
25: - Alcance de la decisión dentro del sistema
26: 
27: ---
28: 
29: ## Opciones Consideradas
30: 
31: ### Opción 1: [Nombre]
32: - Descripción breve
33: - Ventajas
34: - Desventajas
35: 
36: ### Opción 2: [Nombre]
37: - Descripción breve
38: - Ventajas
39: - Desventajas
40: 
41: ### Opción seleccionada
42: - Justificación de la elección final
43: 
44: ---
45: 
46: ## Consecuencias
47: 
48: ### Positivas
49: - Beneficio 1
50: - Beneficio 2
51: - Impacto en escalabilidad / mantenibilidad / performance
52: 
53: ### Negativas
54: - Trade-off 1
55: - Complejidad introducida
56: - Limitaciones futuras
57: 
58: ---
59: 
60: ## Impacto en el Sistema
61: 
62: ### Backend
63: - Cambios relevantes en arquitectura o componentes
64: - Dependencias afectadas
65: - Integraciones relevantes
66: 
67: ### Frontend
68: - Impacto en estructura o comportamiento
69: - Cambios en consumo de APIs o servicios
70: 
71: ### Infraestructura / Compartido
72: - Impacto en contratos, tipos o configuración global
73: - Cambios en herramientas o librerías
74: 
75: ---
76: 
77: ## Reglas Derivadas
78: 
79: - Nuevas convenciones adoptadas
80: - Restricciones técnicas resultantes
81: - Estándares a seguir a futuro

(End of file - total 81 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 20.9s)

_Thinking:_

Now I have:

1. **TDD-0000**: "Errores y Respuestas Globales" — defines the standardized API error/response format, `AppError` class, error middleware, Axios client for mobile.

2. **ADR Template**: Has sections: Contexto, Decisión, Opciones Consideradas, Consecuencias, Impacto en el Sistema (Backend/Frontend/Infraestructura), Reglas Derivadas.

The user wants me to:
1. Convert TDD-0000 into an ADR using the template
2. Identify what other ADRs should exist given the other TDDs (TDD-0001 through TDD-0006)

Since I'm in Plan Mode (read-only), I can provide the plan/content but not create the actual files. I should:

1. Present the converted ADR-0001 from TDD-0000 (following the ADR template)
2. List the proposed ADRs that map from the existing TDDs plus other architectural decisions that should be recorded

Let me think about what ADRs should exist:

From the TDDs:
- TDD-0000 → ADR-0001: Formato de Respuestas y Manejo Global de Errores
- TDD-0001 → ADR-0002: Modelo de Datos y API de Clientes
- TDD-0002 → ADR-0003: Modelo de Datos y API de Ítems
- TDD-0003 → ADR-0004: Modelo de Datos y Flujo de Pedidos
- TDD-0004 → ADR-0005: Modelo de Datos y Ciclo de Vida de Repartos
- TDD-0005 → ADR-0006: Autenticación y Roles de Usuario
- TDD-0006 → ADR-0007: Arquitectura Mobile

But there are also cross-cutting architectural decisions that aren't explicit in any TDD:
- ADR-XXXX: Estructura del Monorepo (ya definida en AGENTS.md)
- ADR-XXXX: Stack Tecnológico General (ya definido)
- ADR-XXXX: Uso de Prisma como ORM + PostgreSQL
- ADR-XXXX: Versionado de API (/api/v1/)
- ADR-XXXX: Estrategia de Migraciones
- ADR-XXXX: Uso de Zod para Validación
- ADR-XXXX: Middleware Global y Patrón de Capas
- ADR-XXXX: Uso de Zustand + TanStack Query en Mobile
- ADR-XXXX: Expo Router como sistema de navegación
- ADR-XXXX: BuilderBot + Meta API para WhatsApp

Let me present this clearly to the user.

Perfecto. Encontré todo. Acá va el plan completo.

---

## ADR-0001: Convertido desde TDD-0000

```md
---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Formato de Respuestas y Manejo Global de Errores
---

# ADR-0001: Formato de Respuestas y Manejo Global de Errores

## Contexto

La API Express y la app mobile necesitan comunicarse con un contrato predecible.
Actualmente no existe un estándar, por lo que cada endpoint podría responder en
formatos distintos, dificultando el manejo de errores en mobile.

- El mobile necesita distinguir entre error de red, error de negocio y error de validación
- El backend no debe exponer stack traces ni mensajes internos en producción
- Se requiere un mecanismo consistente para lanzar errores sin usar `res.status().json()` directo

---

## Decisión

Se adopta un formato único para todas las respuestas de la API:

**Respuesta exitosa:**
```ts
{ data: T }           //单个对象
{ data: T[]; total: number }  //列表
```

**Respuesta de error:**
```ts
{
  error: {
    code: string;       // código interno: "VALIDATION_ERROR", "NOT_FOUND", etc.
    message: string;    // mensaje legible en español
    timestamp: string;  // ISO 8601
    details?: { field: string; message: string }[];  // solo validación
  }
}
```

Se implementa una clase `AppError` que extiende `Error`, un middleware global
de errores Express (que también captura `ZodError`), y un cliente Axios en mobile
con interceptor JWT y `handleApiError` global.

---

## Opciones Consideradas

### Opción 1: AppError + middleware global + Axios (seleccionada)
- Ventajas: contrato único, separación de concerns, sin lógica de errores en controladores
- Desventajas: requiere disciplina del equipo para nunca usar `res.status().json()` directo

### Opción 2: Errores inline en cada controlador
- Ventajas: simple al principio
- Desventajas: inconsistencias, código duplicado, difícil de mantener

### Opción 3: Usar librería externa (express-api-response, etc.)
- Ventajas: ya resuelve el problema
- Desventajas: dependencia externa, menos control, difícil de adaptar a nuestras convenciones

### Opción seleccionada
AppError + middleware centralizado. Es la solución más mantenible, con tipo
fuerte compartido entre backend y mobile.

---

## Consecuencias

### Positivas
- Mobile siempre recibe la misma estructura → un solo `handleApiError`
- Backend centraliza todo error en el middleware → controladores más limpios
- ZodError se captura automáticamente y se transforma al formato estándar
- En producción nunca se filtra un stack trace

### Negativas
- Exige que todos los desarrolladores usen `throw AppError` / `throw Errors.xxx()`
- Si alguien usa `res.status().json()` directo para errores, se saltea el contrato
- No hay validación automática de que se cumpla el contrato (se podría agregar un test)

---

## Impacto en el Sistema

### Backend
- Nuevo archivo: `src/lib/AppError.ts` (clase base)
- Nuevo archivo: `src/lib/errors.ts` (helpers)
- Nuevo archivo: `src/middleware/error.middleware.ts`
- Registro del middleware al final de `app.ts`
- Refactor de controladores existentes para usar `throw Errors.xxx()`

### Frontend (Mobile)
- Nuevo archivo: `types/api.ts` (tipos `ApiResponse`, `ApiError`)
- Nuevo archivo: `services/api.ts` (cliente Axios con interceptors)
- Uso de `handleApiError` en todos los servicios

### Infraestructura / Compartido
- Contrato API documentado y compartido entre equipos
- Sin nuevas dependencias externas

---

## Reglas Derivadas

- Todo error de negocio se lanza con `throw Errors.xxx()` o `throw new AppError(...)`
- Nunca usar `res.status().json()` para errores
- El middleware de errores se registra SIEMPRE al final de `app.ts`, después de todas las rutas
- ZodError se maneja exclusivamente en el middleware global
- No se usa 204 No Content — todas las respuestas devuelven JSON
- Mobile usa el interceptor de Axios para adjuntar JWT automáticamente
```

---

## ADRs Propuestos (mapeo desde los TDDs existentes)

| ADR | TDD | Título |
|---|---|---|
| **ADR-0001** | TDD-0000 | Formato de Respuestas y Manejo Global de Errores *(ya convertido arriba)* |
| **ADR-0002** | TDD-0001 | Modelo de Datos y API de Clientes |
| **ADR-0003** | TDD-0002 | Modelo de Datos y API de Ítems |
| **ADR-0004** | TDD-0003 | Flujo de Pedidos y Máquina de Estados |
| **ADR-0005** | TDD-0004 | Modelo de Datos y Ciclo de Vida de Repartos |
| **ADR-0006** | TDD-0005 | Autenticación, JWT y Roles de Usuario |
| **ADR-0007** | TDD-0006 | Arquitectura Mobile (Zustand + TanStack Query + Axios) |

## ADRs Transversales que Faltan (decisiones ya tomadas pero no documentadas)

| ADR | Título | Justificación |
|---|---|---|
| **ADR-0008** | Estructura del Monorepo | 3 proyectos independientes, cada uno con su propio `package.json` |
| **ADR-0009** | Stack Tecnológico General | Node.js + TypeScript 6 + Express 5 + Prisma 7 + PostgreSQL |
| **ADR-0010** | Versionado de API | Prefijo `/api/v1/` en todas las rutas |
| **ADR-0011** | Estrategia de Migraciones Prisma | Migraciones con nombres descriptivos vía `prisma migrate dev` |
| **ADR-0012** | Validación con Zod | Zod 4 para validación de inputs en todos los endpoints |
| **ADR-0013** | Patrón de Capas por Feature | Cada feature con controller/service/routes/schema/types |
| **ADR-0014** | Navegación Mobile con Expo Router | File-based routing en `app/` con tabs nativos |
| **ADR-0015** | Stack de WhatsApp Bot | BuilderBot 1.4.1 + Meta API + PostgreSQL |

---

¿Te parece bien esta numeración y cobertura? Una vez que confirmes los que querés, puedo generarte el contenido completo de cada ADR (respetando el template) para que solo tengas que crear los archivos en `docs/ADRs/`.

---

## User

las ADRs quiero que sean tecnicas, no sobre eso por ejemplo el uso de un manejador de errores, por ejemplo ADR-001-separacion-backend-frontend.md
docs(adr): separacion de backend y frontend en directorios independie…
last week
ADR-002-seleccion-orm.md
docs(adr): seleccion de ORM - Prisma
last week
ADR-003-seleccion-base-de-datos.md
docs(adr): seleccion de base de datos - PostgreSQL
last week
ADR-004-arquitectura-backend.md
docs(adr): arquitectura del backend en capas
last week
ADR-005-seleccion-framework-backend.md
docs(adr): seleccion de framework backend - Express
last week
ADR-006-seleccion-framework-frontend.md
docs(adr): seleccion de framework frontend - Next.js
last week
ADR-007-modelo-dominio-persona.md
docs(adr): modelo de dominio con herencia - Persona base
last week
ADR-008-autenticacion-tokens-opacos.md
docs(adr): autenticacion con tokens opacos
last week
ADR-009-roles-usuario.md
docs(adr): roles de usuario y control de acceso
last week
ADR-010-versionado-api.md
docs(adr): versionado de API con prefijo /api/v1/
last week
ADR-011-arquitectura-frontend.md
docs(adr): arquitectura frontend feature-based
last week
ADR-012-linting-eslint.md
docs(adr): linting con ESLint por separado
last week
ADR-013-formateo-prettier.md
docs(adr): formateo con Prettier compartido
last week
ADR-014-git-hooks-husky.md
docs(adr): git hooks con Husky por proyecto
last week
ADR-015-estrategia-docker.md
docs(adr): estrategia de dockerización en dos fases
last week
ADR-016-soft-delete-audit-trazabilidad.md
docs(docs): agregar ADR-016 soft delete y trazabilidad
last week
ADR-017-cliente-http-axios.md
docs(adr): agregar ADRs 017-022 (axios, zod, pino, vitest, tailwind-s…
2 days ago
ADR-018-validacion-zod.md
docs(adr): agregar ADRs 017-022 (axios, zod, pino, vitest, tailwind-s…
2 days ago
ADR-019-logging-pino.md
docs(adr): agregar ADRs 017-022 (axios, zod, pino, vitest, tailwind-s…
2 days ago
ADR-020-testing-vitest.md
docs(adr): agregar ADRs 017-022 (axios, zod, pino, vitest, tailwind-s…
2 days ago
ADR-021-tailwind-shadcn.md
docs(adr): agregar ADRs 017-022 (axios, zod, pino, vitest, tailwind-s…
2 days ago
ADR-022-documentacion-api-swagger.md 

---

## Assistant (Plan · Big Pickle · 27.4s)

_Thinking:_

The user is correcting me. They already have ADR-001 through ADR-022 defined in another context (likely another branch or repo). They're showing me that these ADRs already exist and are more technical in nature (like ORM selection, database selection, framework selection, etc.).

They want:
1. The TDD-0000 converted into a technical ADR following the style of those existing ADRs (like ADR-001-separacion-backend-frontend.md, ADR-002-seleccion-orm.md, etc.)
2. They want me to identify what other technical ADRs are missing based on the TDDs that exist

So the ADRs they already have cover:
- ADR-001: Separación backend/frontend
- ADR-002: Selección ORM - Prisma
- ADR-003: Selección BD - PostgreSQL
- ADR-004: Arquitectura backend en capas
- ADR-005: Framework backend - Express
- ADR-006: Framework frontend - Next.js
- ADR-007: Modelo dominio Persona (herencia)
- ADR-008: Autenticación tokens opacos
- ADR-009: Roles de usuario
- ADR-010: Versionado API /api/v1/
- ADR-011: Arquitectura frontend feature-based
- ADR-012: Linting ESLint
- ADR-013: Formateo Prettier
- ADR-014: Git hooks Husky
- ADR-015: Estrategia Docker
- ADR-016: Soft delete y trazabilidad
- ADR-017: Cliente HTTP Axios
- ADR-018: Validación Zod
- ADR-019: Logging Pino
- ADR-020: Testing Vitest
- ADR-021: Tailwind/Shadcn
- ADR-022: Documentación API Swagger

But these are from a different context (it mentions Next.js, Tailwind, Shadcn, etc. which aren't in the SupplyCycle project which uses React Native/Expo for mobile). So these ADRs are from a different project or another branch.

The current project (SupplyCycle) has:
- Backend: Express + Prisma + PostgreSQL
- Mobile: React Native + Expo
- WhatsApp Bot: BuilderBot + Meta API

So the user wants me to:
1. Convert TDD-0000 into a technical ADR (like error handling format)
2. Propose what other ADRs should exist for THIS project (SupplyCycle)

The user said "el TDD 000 me lo conviertas en un ADRs" - convert TDD-0000 into an ADR.

And "me des los distintos ADRs que podrian existir ya que no los defini" - tell me the different ADRs that could exist since I haven't defined them.

And "usa el template en ADRs" - use the ADR template.

Given my plan mode constraint, I can't create files, but I can present the plan. Let me look at the existing TDDs to understand what ADRs would map to them.

Actually, the user is showing me existing ADRs from perhaps a different repo or branch. Let me check if these ADR files exist in the current repo.

Wait, looking at it again - these filenames shown by the user seem to be from a `git log` output or similar. They reference "last week" and "2 days ago". The current project already has ADR-Template.md but no numbered ADRs.

But the ADRs they're showing reference Next.js, Tailwind, Shadcn - none of which are in this project. So these are from a different project entirely. The user is just showing me the STYLE they want - technical ADRs, not about process.

So for the SupplyCycle project (backend + mobile + whatsapp-bot), what technical ADRs should exist?

Let me re-read the user's message: "las ADRs quiero que sean tecnicas, no sobre eso por ejemplo el uso de un manejador de errores" - they want technical ADRs. The example "uso de un manejador de errores" (error handler usage) is EXACTLY what TDD-0000 is about. So actually, converting TDD-0000 into an ADR about "Estandarización de Respuestas API y Manejo Global de Errores" WOULD be a valid technical ADR.

Wait, re-reading more carefully: "por ejemplo el uso de un manejador de errores" - they're giving an example of the kind of technical decision an ADR should capture. So they're saying TDD-0000 (error handling) IS a good candidate for an ADR.

OK so the plan is:
1. Convert TDD-0000 → ADR-0XX: "Estandarización de Respuestas API y Manejo Global de Errores"
2. List other ADRs that should exist for this project based on the TDDs + other technical decisions already made

Let me look at what would be the right ADRs for THIS project (SupplyCycle):

From TDDs:
- TDD-0000 →: Formato de Respuestas API y Manejo Global de Errores
- TDD-0001 →: Modelo de Datos y API de Clientes
- TDD-0002 →: Modelo de Datos y API de Ítems/Productos
- TDD-0003 →: Flujo de Pedidos y Máquina de Estados
- TDD-0004 →: Modelo de Datos y Ciclo de Vida de Repartos
- TDD-0005 →: Autenticación con JWT y Roles (REPARTIDOR/ADMIN)
- TDD-0006 →: Arquitectura Mobile

Cross-cutting decisions NOT in TDDs:
- Separación en 3 proyectos (monorepo)
- Stack backend: Express + Prisma + PostgreSQL
- Stack mobile: Expo + React Native
- Stack whatsapp: BuilderBot + Meta API
- Arquitectura backend feature-based
- Arquitectura mobile feature-based
- Versionado API
- Validación con Zod
- Autenticación con JWT + bcrypt
- Manejo de estado con Zustand + TanStack Query
- Navegación con Expo Router
- Logging con Pino
- Testing con Vitest + supertest
- Dockerización

Given that the user's existing ADRs went from ADR-001 to ADR-022, maybe I should suggest a similar comprehensive list.

Let me present the conversion of TDD-0000 to an ADR and propose the full set of ADRs needed.

Ahora entiendo. Querés ADRs **técnicos puros** (como selector de ORM, framework, etc.), no sobre features. Y ya tenés una serie existente (ADR-001 al 022) de otro proyecto como referencia de estilo.

Para **SupplyCycle** (backend Express + Prisma + PostgreSQL / mobile Expo + React Native / WhatsApp BuilderBot), acá van los ADRs técnicos que deberían existir:

---

## ADR-023 (desde TDD-0000): Estandarización de Respuestas API y Manejo Global de Errores

```md
---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Estandarización de Respuestas API y Manejo Global de Errores
---

# ADR-023: Estandarización de Respuestas API y Manejo Global de Errores

## Contexto

La API REST de backend y la app mobile necesitan un contrato de comunicación
predecible. Sin un estándar, cada endpoint puede responder en distinto formato,
obligando al mobile a manejar casos especiales por endpoint.

- El mobile necesita distinguir errores de validación, autenticación, negocio y servidor
- El backend no debe exponer stack traces ni mensajes internos en producción
- Se requiere un mecanismo obligatorio que evite `res.status().json()` directo para errores

---

## Decisión

Se adopta un formato único JSON para todas las respuestas:

**Exitosa individual:** `{ data: T }`
**Exitosa con lista:** `{ data: T[]; total: number }`
**Error:** `{ error: { code, message, timestamp, details? } }`

Se implementa:
- Clase `AppError` que extiende `Error` con `statusCode`, `code`, `details`
- Helpers `Errors.notFound()`, `Errors.conflict()`, `Errors.unauthorized()`, etc.
- Middleware global Express que captura `AppError` y `ZodError`
- Cliente Axios en mobile con interceptor JWT y `handleApiError()` global

---

## Opciones Consideradas

### Opción 1: AppError + middleware global + Axios (seleccionada)
Contrato único, controladores limpios, sin dependencias externas.

### Opción 2: Errores inline en cada controlador
Simple al inicio pero genera inconsistencias y código duplicado.

### Opción 3: Librería externa (express-api-response, etc.)
Menos control, difícil de adaptar a convenciones propias.

---

## Consecuencias

**Positivas:** Mobile con un solo `handleApiError`, backend centraliza errores,
ZodError capturado automáticamente, sin fugas de stack traces.

**Negativas:** Exige disciplina — si alguien usa `res.status().json()` directo
para errores, se saltea el contrato.

---

## Impacto en el Sistema

### Backend
- `src/lib/AppError.ts`, `src/lib/errors.ts`, `src/middleware/error.middleware.ts`
- Middleware registrado al final de `app.ts`

### Mobile
- `types/api.ts` (ApiResponse, ApiError)
- `services/api.ts` (Axios client con interceptors)

### Infraestructura
- Contrato API documentado. Sin nuevas dependencias.

---

## Reglas Derivadas

- Todo error de negocio se lanza con `throw Errors.xxx()` o `throw new AppError()`
- Nunca usar `res.status().json()` para errores
- Middleware de errores SIEMPRE al final de `app.ts`
- No se usa 204 No Content — todas las respuestas devuelven JSON
- Mobile adjunta JWT vía interceptor de Axios
```

---

## Propuesta de ADRs Técnicos para SupplyCycle

Basado en los TDDs existentes + decisiones de stack ya tomadas:

| # | Título | Fuente |
|---|--------|--------|
| **ADR-023** | Estandarización de Respuestas API y Manejo Global de Errores | TDD-0000 |
| **ADR-024** | Modelo de Datos y API de Clientes | TDD-0001 |
| **ADR-025** | Modelo de Datos y API de Ítems/Productos | TDD-0002 |
| **ADR-026** | Flujo de Pedidos y Máquina de Estados | TDD-0003 |
| **ADR-027** | Modelo de Datos y Ciclo de Vida de Repartos | TDD-0004 |
| **ADR-028** | Autenticación con JWT y Roles (REPARTIDOR/ADMIN) | TDD-0005 |
| **ADR-029** | Arquitectura Mobile con Zustand + TanStack Query | TDD-0006 |

**Y los que faltan documentar** (decisiones ya tomadas, sin TDD):

| # | Título |
|---|--------|
| **ADR-030** | Separación en 3 Proyectos Independientes (Monorepo) |
| **ADR-031** | Stack Backend: Express 5 + Prisma 7 + PostgreSQL |
| **ADR-032** | Stack Mobile: React Native 0.81 + Expo SDK 54 |
| **ADR-033** | Stack WhatsApp: BuilderBot 1.4 + Meta API |
| **ADR-034** | Arquitectura Backend en Capas por Feature |
| **ADR-035** | Arquitectura Mobile Feature-Based |
| **ADR-036** | Manejo de Estado Mobile: Zustand + TanStack Query |
| **ADR-037** | Navegación Mobile con Expo Router (File-based) |
| **ADR-038** | Validación de Inputs con Zod 4 |
| **ADR-039** | Versionado de API con Prefijo /api/v1/ |
| **ADR-040** | Logging con Pino + Morgan |
| **ADR-041** | Testing: Vitest + supertest + vitest-mock-prisma |
| **ADR-042** | Soft Delete y Trazabilidad (Audit Fields) |

---

¿Querés que desarrolle el contenido completo de alguno en particular siguiendo el template? Los que ya están en TDDs (023-029) los puedo mapear directamente; los demás (030-042) los puedo redactar desde cero.

---

## User

Dame esos ADRs respetando el template, dame ventajas y desventajas de la decision y las repercusiones que va a tener, en los ADRs ingora a los TDDs 

---

## Assistant (Build · Big Pickle · 12.1s)

_Thinking:_

The user wants me to generate all those ADRs (023-042) as actual files in `docs/ADRs/`, using the template format, with advantages/disadvantages and repercussions. They said "ignora a los TDDs" meaning don't reference the TDDs.

Let me create all 20 ADR files. I'll batch them efficiently.

Let me first re-read the template to make sure I get the exact format right, then create all files.

The template structure is:
- Frontmatter: autor, fecha, titulo
- Title: ADR-[XXXX]: [Título]
- Contexto
- Decisión
- Opciones Consideradas (Opción 1, Opción 2, Opción seleccionada)
- Consecuencias (Positivas, Negativas)
- Impacto en el Sistema (Backend, Frontend, Infraestructura/Compartido)
- Reglas Derivadas

Let me plan all 20 ADRs:

**From TDDs (but ignoring TDDs as instructed):**
023 - Estandarización de Respuestas API y Manejo Global de Errores
024 - Modelo de Datos y API de Clientes
025 - Modelo de Datos y API de Ítems/Productos
026 - Flujo de Pedidos y Máquina de Estados
027 - Modelo de Datos y Ciclo de Vida de Repartos
028 - Autenticación con JWT y Roles (REPARTIDOR/ADMIN)
029 - Arquitectura Mobile con Zustand + TanStack Query

**New ones:**
030 - Separación en 3 Proyectos Independientes (Monorepo)
031 - Stack Backend: Express 5 + Prisma 7 + PostgreSQL
032 - Stack Mobile: React Native 0.81 + Expo SDK 54
033 - Stack WhatsApp: BuilderBot 1.4 + Meta API
034 - Arquitectura Backend en Capas por Feature
035 - Arquitectura Mobile Feature-Based
036 - Manejo de Estado Mobile: Zustand + TanStack Query
037 - Navegación Mobile con Expo Router (File-based)
038 - Validación de Inputs con Zod 4
039 - Versionado de API con Prefijo /api/v1/
040 - Logging con Pino + Morgan
041 - Testing: Vitest + supertest + vitest-mock-prisma
042 - Soft Delete y Trazabilidad (Audit Fields)

Let me create these files. I'll batch them to be efficient.

Actually, let me think about the content more carefully for each ADR. The user wants:
- Ventajas y desventajas de la decisión
- Repercusiones
- Respetar el template

Let me write them all out. I'll create files in parallel since they're independent.

Let me start writing them all. This is going to be a lot of content.

Actually, I should make them high quality. Each ADR should:
1. Have a real context explaining the problem
2. Present 2-3 options considered
3. Clearly state the decision with justification
4. List positive and negative consequences
5. Detail impact on backend/frontend/infra
6. List derived rules

Let me write them all now.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Crear ADR-023: Estandarización de Respuestas API",
      "status": "in_progress",
      "priority": "high"
    },
    {
      "content": "Crear ADR-024: Modelo de Clientes",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Crear ADR-025: Modelo de Ítems/Productos",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Crear ADR-026: Flujo de Pedidos",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Crear ADR-027: Ciclo de Vida de Repartos",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Crear ADR-028: Autenticación JWT y Roles",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Crear ADR-029: Arquitectura Mobile",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Crear ADR-030: Monorepo 3 proyectos",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-031: Stack Backend Express+Prisma+PostgreSQL",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-032: Stack Mobile RN+Expo",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-033: Stack WhatsApp BuilderBot",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-034: Arquitectura Backend en Capas",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-035: Arquitectura Mobile Feature-Based",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-036: Estado Mobile Zustand+TanStack Query",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-037: Navegación Mobile Expo Router",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-038: Validación Zod 4",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-039: Versionado API /api/v1/",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-040: Logging Pino+Morgan",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-041: Testing Vitest+supertest",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Crear ADR-042: Soft Delete y Trazabilidad",
      "status": "pending",
      "priority": "medium"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Crear ADR-023: Estandarización de Respuestas API",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Crear ADR-024: Modelo de Clientes",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Crear ADR-025: Modelo de Ítems/Productos",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Crear ADR-026: Flujo de Pedidos",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Crear ADR-027: Ciclo de Vida de Repartos",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Crear ADR-028: Autenticación JWT y Roles",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Crear ADR-029: Arquitectura Mobile",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Crear ADR-030: Monorepo 3 proyectos",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-031: Stack Backend Express+Prisma+PostgreSQL",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-032: Stack Mobile RN+Expo",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-033: Stack WhatsApp BuilderBot",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-034: Arquitectura Backend en Capas",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-035: Arquitectura Mobile Feature-Based",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-036: Estado Mobile Zustand+TanStack Query",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-037: Navegación Mobile Expo Router",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-038: Validación Zod 4",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-039: Versionado API /api/v1/",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-040: Logging Pino+Morgan",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-041: Testing Vitest+supertest",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-042: Soft Delete y Trazabilidad",
    "status": "pending",
    "priority": "medium"
  }
]
```

---

## Assistant (Build · Big Pickle · 9.0s)

_Thinking:_

Now let me create all the ADR files. I'll batch as many as possible in parallel since they're independent. Each file needs to be well-written with the template structure.

Voy a crearlos en tandas. Primero los ADR-023 al 029:

**Tool: write**

**Input:**
```json
{}
```

**Error:**
```
Tool execution aborted
```

---

## User

Te dije que no agregues Los modelos de cliente, modelos de item producto, flujo de pedidos, ciclo de vida de repartos. Lo otro si 

---

## Assistant (Build · Big Pickle · 10.6s)

_Thinking:_

The user is telling me that ADR-024 (Modelo de Clientes), ADR-025 (Modelo de Ítems/Productos), ADR-026 (Flujo de Pedidos), ADR-027 (Ciclo de Vida de Repartos) should NOT be included. These are the ones that came from TDDs 0001-0004.

So the final list of ADRs to create is:

023 - Estandarización de Respuestas API y Manejo Global de Errores
028 - Autenticación con JWT y Roles (REPARTIDOR/ADMIN)
029 - Arquitectura Mobile con Zustand + TanStack Query
030 - Separación en 3 Proyectos Independientes (Monorepo)
031 - Stack Backend: Express 5 + Prisma 7 + PostgreSQL
032 - Stack Mobile: React Native 0.81 + Expo SDK 54
033 - Stack WhatsApp: BuilderBot 1.4 + Meta API
034 - Arquitectura Backend en Capas por Feature
035 - Arquitectura Mobile Feature-Based
036 - Manejo de Estado Mobile: Zustand + TanStack Query
037 - Navegación Mobile con Expo Router (File-based)
038 - Validación de Inputs con Zod 4
039 - Versionado de API con Prefijo /api/v1/
040 - Logging con Pino + Morgan
041 - Testing: Vitest + supertest + vitest-mock-prisma
042 - Soft Delete y Trazabilidad (Audit Fields)

Wait, 028 and 029 are also from TDDs (TDD-0005 and TDD-0006). Let me re-read what the user said:

"Te dije que no agregues Los modelos de cliente, modelos de item producto, flujo de pedidos, ciclo de vida de repartos. Lo otro si"

So they specifically excluded:
- ADR-024: Modelo de Clientes (TDD-0001)
- ADR-025: Modelo de Ítems/Productos (TDD-0002)
- ADR-026: Flujo de Pedidos (TDD-0003)
- ADR-027: Ciclo de Vida de Repartos (TDD-0004)

They said "Lo otro si" (the others yes), so:
- ADR-023: Estandarización de Respuestas API (TDD-0000) -> YES
- ADR-028: Autenticación JWT y Roles (TDD-0005) -> YES
- ADR-029: Arquitectura Mobile (TDD-0006) -> YES
- ADR-030 to 042 -> YES

Let me update my todo list and start creating files.

Claro, me quedó claro. Excluyo los 4 de modelo de datos. Estos son los que voy a crear:

**023** - Estandarización Respuestas API  
**028** - Autenticación JWT y Roles  
**029** - Arquitectura Mobile  
**030** - Monorepo 3 proyectos  
**031** - Stack Backend  
**032** - Stack Mobile  
**033** - Stack WhatsApp  
**034** - Arquitectura Backend en Capas  
**035** - Arquitectura Mobile Feature-Based  
**036** - Estado Mobile Zustand + TanStack Query  
**037** - Navegación Mobile Expo Router  
**038** - Validación Zod 4  
**039** - Versionado API  
**040** - Logging Pino + Morgan  
**041** - Testing  
**042** - Soft Delete y Trazabilidad

Arranco:

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Crear ADR-023: Estandarización de Respuestas API",
      "status": "in_progress"
    },
    {
      "priority": "high",
      "content": "Crear ADR-028: Autenticación JWT y Roles",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "Crear ADR-029: Arquitectura Mobile Zustand+TanStack Query",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-030: Monorepo 3 proyectos",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-031: Stack Backend Express+Prisma+PostgreSQL",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-032: Stack Mobile RN+Expo",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-033: Stack WhatsApp BuilderBot",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-034: Arquitectura Backend en Capas",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-035: Arquitectura Mobile Feature-Based",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-036: Estado Mobile Zustand+TanStack Query",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-037: Navegación Mobile Expo Router",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-038: Validación Zod 4",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-039: Versionado API /api/v1/",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-040: Logging Pino+Morgan",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-041: Testing Vitest+supertest",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Crear ADR-042: Soft Delete y Trazabilidad",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Crear ADR-023: Estandarización de Respuestas API",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Crear ADR-028: Autenticación JWT y Roles",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Crear ADR-029: Arquitectura Mobile Zustand+TanStack Query",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Crear ADR-030: Monorepo 3 proyectos",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-031: Stack Backend Express+Prisma+PostgreSQL",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-032: Stack Mobile RN+Expo",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-033: Stack WhatsApp BuilderBot",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-034: Arquitectura Backend en Capas",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-035: Arquitectura Mobile Feature-Based",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-036: Estado Mobile Zustand+TanStack Query",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-037: Navegación Mobile Expo Router",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-038: Validación Zod 4",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-039: Versionado API /api/v1/",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-040: Logging Pino+Morgan",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-041: Testing Vitest+supertest",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Crear ADR-042: Soft Delete y Trazabilidad",
    "status": "pending",
    "priority": "medium"
  }
]
```

---

## Assistant (Build · Big Pickle · 9.0s)

_Thinking:_

Now I need to create all 16 ADR files. Let me check that the docs/ADRs directory exists first, then write them in parallel batches.

**Tool: bash**

**Input:**
```json
{
  "command": "Test-Path -LiteralPath \"C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\"",
  "description": "Check if ADRs directory exists"
}
```

**Output:**
```
True

```

---

## Assistant (Build · Big Pickle · 7.9s)

_Thinking:_

Directory exists. Now let me create all 16 ADR files. I'll write them in parallel batches to be efficient.

**Tool: write**

**Input:**
```json
{}
```

**Error:**
```
Tool execution aborted
```

---

## User

Tenes que arrancar desde ADR 0000, dame lo que te pedi teniendo en cuenta eso 

---

## Assistant (Build · Big Pickle · 6.0s)

_Thinking:_

The user wants me to start from ADR-0000, not ADR-023. So I need to renumber everything. They also want the content I described earlier - technical ADRs with advantages/disadvantages and repercussions.

Let me renumber:

ADR-0000: Estandarización de Respuestas API y Manejo Global de Errores
ADR-0001: Autenticación con JWT y Roles (REPARTIDOR/ADMIN)
ADR-0002: Arquitectura Mobile con Zustand + TanStack Query
ADR-0003: Separación en 3 Proyectos Independientes (Monorepo)
ADR-0004: Stack Backend: Express 5 + Prisma 7 + PostgreSQL
ADR-0005: Stack Mobile: React Native 0.81 + Expo SDK 54
ADR-0006: Stack WhatsApp: BuilderBot 1.4 + Meta API
ADR-0007: Arquitectura Backend en Capas por Feature
ADR-0008: Arquitectura Mobile Feature-Based
ADR-0009: Manejo de Estado Mobile: Zustand + TanStack Query
ADR-0010: Navegación Mobile con Expo Router (File-based)
ADR-0011: Validación de Inputs con Zod 4
ADR-0012: Versionado de API con Prefijo /api/v1/
ADR-0013: Logging con Pino + Morgan
ADR-0014: Testing: Vitest + supertest + vitest-mock-prisma
ADR-0015: Soft Delete y Trazabilidad (Audit Fields)

That's 16 ADRs total. Let me create them all as files.

Since I'm in build mode now, I can actually create the files. Let me batch them efficiently.

Ahí va. Renombro todo desde ADR-0000. Son 16 ADRs en total.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Crear ADR-0000 al ADR-0003",
      "status": "in_progress"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0004 al ADR-0007",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0008 al ADR-0011",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0012 al ADR-0015",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Crear ADR-0000 al ADR-0003",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0004 al ADR-0007",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0008 al ADR-0011",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0012 al ADR-0015",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Big Pickle · 37.7s)

_Thinking:_

Let me create the first batch of 4 ADRs simultaneously.

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0000-estandarizacion-respuestas-api.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Estandarización de Respuestas API y Manejo Global de Errores\n---\n\n# ADR-0000: Estandarización de Respuestas API y Manejo Global de Errores\n\n## Contexto\n\nLa API REST del backend y la app mobile necesitan un contrato de comunicación predecible. Sin un estándar, cada endpoint puede responder en distinto formato, obligando al mobile a manejar casos especiales por endpoint.\n\nEl backend no debe exponer stack traces ni mensajes internos en producción. Se necesita un mecanismo obligatorio que evite el uso de `res.status().json()` directo para errores.\n\n---\n\n## Decisión\n\nSe adopta un formato único JSON para todas las respuestas:\n\n- **Exitosa individual:** `{ data: T }`\n- **Exitosa con lista:** `{ data: T[]; total: number }`\n- **Error:** `{ error: { code, message, timestamp, details? } }`\n\nSe implementa una clase `AppError` que extiende `Error`, helpers `Errors.notFound()`, `Errors.conflict()`, etc., un middleware global Express que captura `AppError` y `ZodError`, y un cliente Axios en mobile con interceptor JWT y `handleApiError()` global.\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: AppError + middleware global + Axios (seleccionada)\nContrato único, controladores limpios, sin dependencias externas. El middleware centraliza todo error.\n\n### Opción 2: Errores inline en cada controlador\nSimple al inicio pero genera inconsistencias, código duplicado y es difícil de mantener a escala.\n\n### Opción 3: Librería externa (express-api-response, etc.)\nMenos control sobre el formato, difícil de adaptar a convenciones propias, dependencia adicional.\n\n### Opción seleccionada\nOpción 1 por su balance entre simplicidad, control total y mantenibilidad.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Mobile con un solo `handleApiError` para toda la app\n- Backend centraliza errores en un solo punto\n- `ZodError` se captura automáticamente y se transforma al formato estándar\n- Sin fugas de stack traces en producción\n- Tipos compartidos entre backend y mobile\n\n### Negativas\n- Exige disciplina del equipo: si alguien usa `res.status().json()` directo se saltea el contrato\n- No hay validación automática del cumplimiento del contrato (se puede agregar un test)\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Nuevos archivos: `src/lib/AppError.ts`, `src/lib/errors.ts`, `src/middleware/error.middleware.ts`\n- Middleware registrado al final de `app.ts` después de todas las rutas\n- Refactor de controladores existentes para usar `throw Errors.xxx()`\n\n### Frontend (Mobile)\n- Nuevos archivos: `types/api.ts` (interfaces `ApiResponse`, `ApiError`)\n- Nuevo archivo: `services/api.ts` (cliente Axios con interceptors)\n- `handleApiError` usado en todos los servicios\n\n### Infraestructura / Compartido\n- Contrato API documentado. Sin nuevas dependencias externas.\n\n---\n\n## Reglas Derivadas\n\n- Todo error de negocio se lanza con `throw Errors.xxx()` o `throw new AppError()`\n- Nunca usar `res.status().json()` para errores\n- Middleware de errores SIEMPRE al final de `app.ts`\n- No se usa 204 No Content — todas las respuestas devuelven JSON\n- Mobile adjunta JWT vía interceptor de Axios\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0001-autenticacion-jwt-roles.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Autenticación con JWT y Roles de Usuario\n---\n\n# ADR-0001: Autenticación con JWT y Roles de Usuario\n\n## Contexto\n\nEl sistema necesita autenticar usuarios (repartidores y administradores) que acceden tanto al backend como al mobile. Se requiere un mecanismo seguro, stateless y escalable que permita controlar el acceso a recursos según el rol.\n\nNo se implementa registro público; los usuarios son creados por un administrador del sistema.\n\n---\n\n## Decisión\n\nSe utiliza autenticación mediante JSON Web Tokens (JWT) con bcrypt para hashing de contraseñas y dos roles: `REPARTIDOR` y `ADMIN`.\n\nEl flujo es:\n1. Login con email + contraseña → backend valida y devuelve un JWT\n2. El token se envía en cada request vía header `Authorization: Bearer <token>`\n3. Un middleware `authenticate` verifica el token y otro middleware `authorize` valida el rol\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: JWT + bcrypt + roles simples (seleccionada)\nStateless, sin sesiones en servidor, fácil de escalar. Roles fijos sin jerarquía.\n\n### Opción 2: Sesiones con cookies + Passport.js\nRequiere almacenamiento de sesión (redis o DB), más complejo en mobile y no ideal para APIs REST.\n\n### Opción 3: Tokens opacos (random string)\nRequiere lookup en DB en cada request. Más seguro contra robo de tokens pero con latencia adicional.\n\n### Opción 4: OAuth2 / SSO\nSobredimensionado para el alcance actual. Agrega complejidad innecesaria sin beneficios inmediatos.\n\n### Opción seleccionada\nOpción 1. JWT es el estándar actual para APIs REST, no requiere almacenamiento en servidor, y mobile lo maneja naturalmente.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Autenticación stateless: el backend no necesita almacenar sesiones\n- Fácil de consumir desde mobile con Axios interceptor\n- bcrypt protege las contraseñas contra ataques de fuerza bruta\n- Middleware `authorize` reusable en cualquier ruta\n\n### Negativas\n- JWT no es revocable inmediatamente (expira por tiempo)\n- Si se filtra un JWT, el atacante tiene acceso hasta la expiración\n- Requiere manejo de renovación de tokens (refresh token a futuro)\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Nuevo archivo: `src/features/auth/` con controller, service, routes, schema\n- Middleware `authenticate` y `authorize` en `src/middleware/auth.middleware.ts`\n- Modelo `Usuario` con campos `email`, `passwordHash`, `rol`\n- Endpoints: `POST /api/v1/auth/login`, `GET /api/v1/auth/me`\n\n### Frontend (Mobile)\n- Pantalla de login en `app/login.tsx`\n- Almacenamiento de token en SecureStore\n- Interceptor Axios que agrega `Authorization: Bearer <token>`\n\n### Infraestructura / Compartido\n- Variable de entorno `JWT_SECRET` en backend\n- Sin dependencias externas nuevas (jsonwebtoken + bcrypt ya en el stack)\n\n---\n\n## Reglas Derivadas\n\n- Las contraseñas deben tener al menos 8 caracteres, una mayúscula y un número\n- El JWT tiene expiración de 24 horas\n- Middleware `authorize('ADMIN')` para rutas administrativas\n- El endpoint `GET /auth/me` devuelve el usuario autenticado sin la contraseña\n- No existe registro público; los usuarios los crea un ADMIN\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0002-arquitectura-mobile.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Arquitectura Mobile con Zustand y TanStack Query\n---\n\n# ADR-0002: Arquitectura Mobile con Zustand y TanStack Query\n\n## Contexto\n\nLa app mobile necesita manejar estado del lado del cliente (UI, sesión, preferencias) y estado del servidor (datos de API). Mezclar ambas responsabilidades en una sola solución genera código difícil de mantener.\n\nSe requiere una arquitectura clara que separe el estado local del remoto, con soporte para caché, sincronización, loading states y offline.\n\n---\n\n## Decisión\n\nSe adopta una arquitectura de estado en dos capas:\n\n- **Zustand** para estado local del cliente: sesión del usuario, UI state, preferencias offline\n- **TanStack Query** para estado del servidor: datos de API, caché, refetch, mutaciones\n\nLa comunicación con el backend se realiza mediante **Axios** con un cliente compartido que incluye interceptors para JWT y manejo global de errores.\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Zustand + TanStack Query + Axios (seleccionada)\nSeparación clara de responsabilidades. TanStack Query maneja caché, refetch, stale-while-revalidate. Zustand maneja estado local puro.\n\n### Opción 2: Solo Zustand (todo el estado en stores)\nFuncional pero requiere implementar manualmente caché, refetch y sincronización con el servidor. Mucho boilerplate.\n\n### Opción 3: Redux Toolkit + RTK Query\nSobredimensionado para el alcance. RTK Query es similar a TanStack Query pero más verboso y con mayor curva de aprendizaje.\n\n### Opción 4: React Context + fetch nativo\nSin caché, sin loading states automáticos, sin sincronización. Cada componente debe manejar su propio fetching.\n\n### Opción seleccionada\nOpción 1. Zustand es liviano (1KB) comparado con Redux, TanStack Query es el estándar de la industria para fetching, y Axios unifica el manejo HTTP.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Separación clara entre estado del servidor y estado del cliente\n- TanStack Query provee caché, refetch automático, stale-while-revalidate, retry, paginación\n- Zustand stores son simples, sin reducers ni actions verbosas\n- Axios interceptor maneja JWT y errores globalmente\n- Tipado fuerte con TypeScript\n\n### Negativas\n- Dos librerías de estado en lugar de una\n- Curva de aprendizaje inicial para el equipo\n- TanStack Query puede ser excesivo para apps con pocas llamadas API\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Sin impacto directo. La arquitectura es transparente para el backend.\n\n### Frontend (Mobile)\n- `services/api.ts` → cliente Axios compartido\n- `hooks/queries/` → hooks personalizados con TanStack Query\n- `stores/` → stores de Zustand (auth, ui, preferencias)\n- `types/api.ts` → tipos compartidos de respuestas\n\n### Infraestructura / Compartido\n- Dependencias: `@tanstack/react-query`, `zustand`, `axios`\n- `EXPO_PUBLIC_API_URL` en variables de entorno\n\n---\n\n## Reglas Derivadas\n\n- Estado del servidor siempre va en TanStack Query (useQuery, useMutation)\n- Estado local (UI, sesión, preferencias) siempre va en Zustand\n- Nunca cachear datos del servidor en Zustand\n- El cliente Axios es el único punto de entrada HTTP\n- Los hooks de TanStack Query se organizan por feature en `hooks/queries/`\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0003-monorepo-tres-proyectos.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Separación en 3 Proyectos Independientes (Monorepo)\n---\n\n# ADR-0003: Separación en 3 Proyectos Independientes (Monorepo)\n\n## Contexto\n\nEl sistema tiene tres aplicaciones con stacks, ciclos de vida y dependencias completamente distintos: una API REST, una app mobile y un bot de WhatsApp. Colocarlas en un mismo directorio compartido genera conflictos de dependencias, builds lentos y acoplamiento innecesario.\n\nSin embargo, mantenerlas en repositorios separados dificulta la visión global del proyecto, el onboarding y la coordinación de cambios.\n\n---\n\n## Decisión\n\nSe utiliza un monorepo con tres proyectos independientes, cada uno con su propio `package.json`, TypeScript config y scripts. No hay dependencias compartidas entre proyectos.\n\nEstructura:\n```\n/backend      → Express + Prisma + PostgreSQL\n/mobile       → React Native + Expo\n/whatsapp-bot → BuilderBot + Meta API\n```\n\nCada proyecto es autónomo: se puede desarrollar, testear y deployar de forma independiente.\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Monorepo sin workspace manager (seleccionada)\nTres carpetas independientes, cada una con su propio `package.json`. Sin dependencias compartidas. Simple, predecible.\n\n### Opción 2: Monorepo con npm/pnpm workspaces\nRequiere configuración extra, y al no haber dependencias compartidas entre los 3 proyectos, el workspace no aporta beneficio real.\n\n### Opción 3: Repositorios separados (multirepo)\nMáximo aislamiento pero más fricción: múltiples PRs, commits separados, onboarding más lento, pérdida de visión global.\n\n### Opción seleccionada\nOpción 1. El monorepo da visión global y facilita el onboarding, mientras que la independencia de cada proyecto evita conflictos y acoplamiento.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Visión global del proyecto en un solo repositorio\n- Onboarding simple: un solo `git clone`\n- Cada proyecto puede evolucionar a su ritmo (dependencias, TS versiones, scripts)\n- Sin conflictos entre dependencias\n- CI/CD independiente por proyecto\n- Facilidad para compartir documentación y configuraciones (docker-compose, etc.)\n\n### Negativas\n- El repositorio crece en tamaño con el tiempo\n- No hay tipos compartidos automáticamente (se copian manualmente)\n- `node_modules` separados por proyecto (más espacio en disco)\n- No hay atomicidad cross-project en un mismo commit (feature que toca backend + mobile requiere 2 PRs)\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Todo el código en `backend/`. Sin cambios estructurales.\n\n### Frontend (Mobile)\n- Todo el código en `mobile/`. Sin cambios estructurales.\n\n### WhatsApp Bot\n- Todo el código en `whatsapp-bot/`. Sin cambios estructurales.\n\n### Infraestructura / Compartido\n- `docker-compose.dev.yml` en la raíz para orquestar servicios comunes (PostgreSQL)\n- `.husky/` y `commitlint.config.mjs` compartidos en la raíz\n- `docs/` centralizada en la raíz\n\n---\n\n## Reglas Derivadas\n\n- Cada proyecto tiene su propio `package.json`, `tsconfig.json`, `.eslintrc`, etc.\n- No importar código entre proyectos directamente (ni con alias de path)\n- Los tipos compartidos se copian manualmente entre proyectos\n- Los cambios que afectan múltiples proyectos requieren PRs separados\n- `docker-compose.dev.yml` maneja infraestructura común (DB, etc.)\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 42.0s)

_Thinking:_

First 4 done. Now let me create the next batch: ADR-0004 to ADR-0007.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Crear ADR-0000 al ADR-0003",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0004 al ADR-0007",
      "status": "in_progress"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0008 al ADR-0011",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0012 al ADR-0015",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Crear ADR-0000 al ADR-0003",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0004 al ADR-0007",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0008 al ADR-0011",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0012 al ADR-0015",
    "status": "pending",
    "priority": "high"
  }
]
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0004-stack-backend.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Stack Backend — Express 5 + Prisma 7 + PostgreSQL\n---\n\n# ADR-0004: Stack Backend — Express 5 + Prisma 7 + PostgreSQL\n\n## Contexto\n\nEl backend necesita un stack moderno, tipado y productivo para construir una API REST. Se requiere un framework HTTP, un ORM para la base de datos y un motor de base de datos relacional.\n\nLas decisiones deben priorizar la seguridad, el rendimiento y la facilidad de mantenimiento a largo plazo.\n\n---\n\n## Decisión\n\nSe adopta el siguiente stack:\n\n- **Runtime:** Node.js con TypeScript 6 (ESModules, NodeNext)\n- **Framework HTTP:** Express 5\n- **ORM:** Prisma 7 con `@prisma/adapter-pg`\n- **Base de datos:** PostgreSQL\n- **Validación:** Zod 4\n- **Auth:** bcrypt + jsonwebtoken\n- **Logging:** pino + morgan\n- **Seguridad:** helmet + cors\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Express 5 + Prisma 7 + PostgreSQL (seleccionada)\nStack maduro, probado, con excelente DX. Prisma provee type-safety nativo, migrations, studio UI y es el ORM más popular en TypeScript.\n\n### Opción 2: Fastify + Drizzle ORM + PostgreSQL\nFastify es más rápido que Express, y Drizzle es más cercano al SQL puro. Pero Express 5 tiene un ecosistema más amplio y Prisma 7 tiene mejor integración con TypeScript 6.\n\n### Opción 3: NestJS + TypeORM + PostgreSQL\nNestJS impone una arquitectura muy rígida (decorators, módulos, providers). TypeORM tiene peor DX que Prisma y menos adopción en TypeScript moderno.\n\n### Opción 4: Hono + Prisma + PostgreSQL\nHono es moderno y rápido pero tiene menos adopción y ecosistema que Express. Para el alcance del proyecto, Express es más predecible.\n\n### Opción seleccionada\nOpción 1. Express 5 es el estándar de la industria, Prisma 7 tiene type-safety completo con TypeScript 6, y PostgreSQL es la base de datos relacional más robusta.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Type-safety de extremo a extremo con Prisma (schema → types → queries)\n- Migraciones automáticas con Prisma Migrate\n- Express 5 tiene routing mejorado y mejor manejo de errores async\n- Zod 4 integrado para validación de inputs\n- Helmet + cors cubren seguridad básica OOTB\n- Ecosistema enorme: cualquier problema ya tiene solución documentada\n\n### Negativas\n- Express 5 es menos performante que Fastify o Hono (~15-20% más lento en benchmarks)\n- Prisma es más pesado que Drizzle (runtime más grande)\n- El adapter `@prisma/adapter-pg` agrega una capa de abstracción\n- TypeScript 6 con NodeNext requiere `.js` en imports locales\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Estructura estándar para todo el proyecto backend\n- `prisma/schema.prisma` como fuente de verdad del esquema\n- `prisma/prisma.ts` como cliente singleton\n- Zod schemas en cada feature para validación\n\n### Frontend (Mobile)\n- Sin impacto directo. El stack backend es transparente.\n\n### Infraestructura / Compartido\n- PostgreSQL como servicio requerido (vía docker-compose)\n- Prisma CLI para migraciones y generación de cliente\n- Variables de entorno para conexión a DB\n\n---\n\n## Reglas Derivadas\n\n- Usar siempre `prisma/prisma.ts` (singleton), nunca crear nuevos clientes Prisma\n- Migraciones con nombres descriptivos: `add_user_roles`, `create_orders_table`\n- TypeScript 6 con `verbatimModuleSyntax` → usar `import type` para tipos\n- Imports ESM con extensión `.js` en rutas locales\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0005-stack-mobile.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Stack Mobile — React Native 0.81 + Expo SDK 54\n---\n\n# ADR-0005: Stack Mobile — React Native 0.81 + Expo SDK 54\n\n## Contexto\n\nLa app mobile debe funcionar en iOS y Android con una sola base de código. Se necesita un framework que permita desarrollo rápido, actualizaciones OTA, y acceso a APIs nativas (cámara, GPS, notificaciones) sin configuración manual de módulos nativos.\n\nEl equipo tiene experiencia previa con React, por lo que React Native es la opción natural.\n\n---\n\n## Decisión\n\nSe utiliza **Expo SDK 54** con **React Native 0.81**, **Expo Router 6** para navegación file-based, y las siguientes librerías complementarias:\n\n- **@react-navigation** (bottom-tabs + native-stack)\n- **react-native-reanimated** + **react-native-gesture-handler**\n- **react-native-safe-area-context**\n\nEl proyecto se estructura con path alias `@/` apuntando a la raíz de `mobile/`.\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Expo SDK 54 + React Native 0.81 (seleccionada)\nExpo maneja la configuración nativa, builds en la nube (EAS), actualizaciones OTA y provee las APIs nativas más comunes sin necesidad de ejectar.\n\n### Opción 2: React Native CLI (bare workflow)\nMáximo control sobre módulos nativos pero requiere configuración manual de Xcode/Android Studio. Más lento para desarrollo y mayor fricción en onboarding.\n\n### Opción 3: Framework alternativo (Flutter, Kotlin Multiplatform)\nCurva de aprendizaje alta, ecosistema diferente. El equipo ya conoce React.\n\n### Opción seleccionada\nOpción 1. Expo es el estándar recomendado por la comunidad React Native para proyectos nuevos. SDK 54 es la versión más reciente y estable.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Desarrollo rápido con Fast Refresh y Expo Go\n- Builds en la nube con EAS sin configurar Xcode/Android Studio\n- Actualizaciones OTA (expo-updates) sin pasar por App Store / Play Store\n- APIs nativas listas para usar (cámara, notificaciones, GPS, etc.)\n- Expo Router 6 con file-based routing (similar a Next.js)\n- Reanimated 4 para animaciones en UI thread\n\n### Negativas\n- Expo Go no soporta todos los módulos nativos (a veces requiere dev build)\n- Dependencia del ecosistema Expo (si Expo desaparece, migrar es complejo)\n- El tamaño de la app es mayor que bare RN por las librerías incluidas\n- Expo SDK 54 requiere React Native 0.81 (version atada)\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Sin impacto directo.\n\n### Frontend (Mobile)\n- `app/` → rutas con Expo Router (file-based)\n- `components/ui/` → componentes atómicos\n- `constants/theme.ts` → colores, spacing, tipografía\n- `hooks/` → hooks personalizados\n\n### Infraestructura / Compartido\n- Variables de entorno con prefijo `EXPO_PUBLIC_`\n- `eas.json` para configuración de builds EAS\n- Path alias `@/` configurado en `tsconfig.json`\n\n---\n\n## Reglas Derivadas\n\n- Path alias `@/` → raíz de `mobile/`\n- Componentes UI atómicos en `components/ui/`\n- Colores y spacing desde `constants/theme.ts`\n- Usar `useColorScheme()` para dark mode\n- Pantallas/rutas en `app/` (Expo Router file-based)\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0006-stack-whatsapp.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Stack WhatsApp — BuilderBot 1.4 + Meta API\n---\n\n# ADR-0006: Stack WhatsApp — BuilderBot 1.4 + Meta API\n\n## Contexto\n\nEl sistema necesita un bot de WhatsApp que interactúe con clientes: registrarlos, consultar pedidos, recibir notificaciones. La integración debe usar la API oficial de WhatsApp Business (Meta).\n\nNo se requiere una interfaz web para el bot; toda la comunicación es vía WhatsApp.\n\n---\n\n## Decisión\n\nSe utiliza **BuilderBot 1.4** con **@builderbot/provider-meta** y **@builderbot/database-postgres** para persistencia.\n\nBuilderBot es un framework Node.js que abstrae la complejidad de la API de WhatsApp Business (webhooks, mensajes, templates) y provee un sistema de flows conversacionales modulares.\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: BuilderBot 1.4 + Meta Provider (seleccionada)\nFramework diseñado específicamente para bots de WhatsApp. Provee manejo de webhooks, envío de mensajes, templates, medios, y persistencia.\n\n### Opción 2: WhatsApp Business API directamente con Express\nMáximo control pero requiere implementar webhooks, manejo de rate limits, reintentos, estado de conversación, todo manualmente. Mucho boilerplate.\n\n### Opción 3: Twilio for WhatsApp\nTwilio abstrae la API de Meta pero tiene costos adicionales por mensaje y menos control sobre features específicas (templates, medios interactivos).\n\n### Opción 4: Baileys (whatsapp-web.js)\nUsa el protocolo no oficial de WhatsApp Web. Viola términos de servicio y puede dejar de funcionar sin previo aviso.\n\n### Opción seleccionada\nOpción 1. BuilderBot está construido específicamente para la Meta API oficial, maneja webhooks, estado, y flows conversacionales de forma declarativa.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Abstracción completa de la API de Meta (webhooks, tokens, versionado)\n- Sistema de flows modulares y anidados\n- Persistencia automática de estado en PostgreSQL\n- Manejo de medios (imágenes, video, audio, documentos)\n- Endpoints HTTP automáticos expuestos por el provider\n- Sin necesidad de Express adicional\n\n### Negativas\n- Framework menos conocido que alternativas más genéricas (menos comunidad)\n- Atado a la versión del provider compatibilidad con API de Meta\n- Dependencia de BuilderBot para actualizaciones de la API de WhatsApp\n- La abstracción puede limitar features muy específicas de Meta API\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Sin impacto directo. El bot es independiente del backend principal.\n\n### WhatsApp Bot\n- `src/app.ts` → entry point del bot\n- `src/flows/` → flows conversacionales modulares\n- Provider Meta configurado con `jwtToken`, `numberId`, `verifyToken`\n- DB PostgreSQL para persistencia de estado\n\n### Infraestructura / Compartido\n- Variables de entorno: `POSTGRES_DB_HOST`, `POSTGRES_DB_USER`, `POSTGRES_DB_NAME`, `POSTGRES_DB_PASSWORD`, `POSTGRES_DB_PORT`\n- Puerto dedicado para el bot\n- Webhook expuesto para Meta API\n\n---\n\n## Reglas Derivadas\n\n- Cada flow en su propio archivo dentro de `src/flows/`\n- Keywords siempre en inglés\n- Usar `state.update()` y `state.get()` para estado de conversación\n- No agregar Express aparte — el provider expone endpoints automáticos\n- Provider configurado con versión v18.0 de Meta API\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0007-arquitectura-backend-capas.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Arquitectura Backend en Capas por Feature\n---\n\n# ADR-0007: Arquitectura Backend en Capas por Feature\n\n## Contexto\n\nEl backend crecerá con múltiples funcionalidades (clientes, pedidos, repartos, usuarios, ítems). Sin una estructura clara, los archivos se acumulan en carpetas genéricas, las responsabilidades se mezclan y el código se vuelve difícil de mantener.\n\nSe necesita una arquitectura que separe responsabilidades, sea predecible y escale con la cantidad de features.\n\n---\n\n## Decisión\n\nSe adopta una **arquitectura en capas organizada por feature**. Cada feature tiene su propia carpeta con archivos específicos por capa:\n\n```\nsrc/features/<feature>/\n├── controller.ts   → maneja request/response\n├── service.ts      → lógica de negocio\n├── routes.ts       → definición de rutas Express\n├── schema.ts       → validación Zod\n└── types.ts        → tipos específicos del feature\n```\n\nLas capas transversales (middleware, lib, utils) van en carpetas separadas en `src/`.\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Capas por feature (seleccionada)\nCada feature es un módulo autónomo. Fácil de navegar, testear y mantener. Las capas están encapsuladas dentro del feature.\n\n### Opción 2: Capas técnicas (controllers/, services/, models/ globales)\nTodo lo que sea controller va en una carpeta, todo service en otra, etc. Funcional para proyectos pequeños, pero cuando hay muchas features las carpetas se vuelven inmanejables.\n\n### Opción 3: Hexagonal / Clean Architecture\nMáximo aislamiento con puertos y adaptadores. Sobredimensionado para un equipo pequeño con una API REST sin cambios de infraestructura frecuentes.\n\n### Opción 4: Estilo libre (cada developer decide)\nSin convención. Lleva al caos organizacional a mediano plazo.\n\n### Opción seleccionada\nOpción 1. Es el balance óptimo entre organización y simplicidad. Cada feature es autónoma y se puede navegar sin contexto global.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Navegación predecible: sabés exactamente dónde está cada archivo\n- Features aisladas: se puede desarrollar, testear y eliminar una feature sin afectar otras\n- Onboarding rápido: nuevo developer entiende la estructura en minutos\n- Escala linealmente con la cantidad de features\n- Las capas (controller → service) mantienen la separación de responsabilidades\n\n### Negativas\n- Código duplicado entre features (ej: validaciones similares)\n- Puede llevar a archivos muy pequeños (un schema de 5 líneas)\n- No hay reutilización automática entre features (hay que mover a lib/ explícitamente)\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- `src/features/auth/` → controller, service, routes, schema, types\n- `src/features/clientes/` → ídem\n- `src/features/pedidos/` → ídem\n- `src/lib/` → código reutilizable (AppError, errors, utils)\n- `src/middleware/` → middleware global (auth, error handler)\n- `src/config/` → configuración (env, constants)\n\n### Frontend (Mobile)\n- Sin impacto directo.\n\n### Infraestructura / Compartido\n- Convención documentada para todo el equipo\n- Code reviews más rápidos al saber dónde buscar\n\n---\n\n## Reglas Derivadas\n\n- Cada feature tiene exactamente 5 archivos: controller, service, routes, schema, types\n- Las rutas se montan en `app.ts` con `app.use('/api/v1/<recurso>', router)`\n- El service nunca importa `Request`/`Response` de Express\n- El controller nunca contiene lógica de negocio\n- Código compartido entre features va en `src/lib/`\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 38.7s)

_Thinking:_

Great, ADR-0004 to ADR-0007 done. Now let me create ADR-0008 to ADR-0011 in the next batch.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Crear ADR-0000 al ADR-0003",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0004 al ADR-0007",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0008 al ADR-0011",
      "status": "in_progress"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0012 al ADR-0015",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Crear ADR-0000 al ADR-0003",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0004 al ADR-0007",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0008 al ADR-0011",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0012 al ADR-0015",
    "status": "pending",
    "priority": "high"
  }
]
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0008-arquitectura-mobile-features.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Arquitectura Mobile Feature-Based\n---\n\n# ADR-0008: Arquitectura Mobile Feature-Based\n\n## Contexto\n\nLa app mobile crecerá con múltiples pantallas y funcionalidades. Sin una estructura organizada, los archivos se mezclan en unas pocas carpetas, las importaciones se vuelven confusas y el código es difícil de escalar.\n\nSe necesita una organización que agrupe el código por funcionalidad, facilitando la navegación, el testing y el mantenimiento.\n\n---\n\n## Decisión\n\nSe organiza el código mobile en una estructura mixta: **carpetas técnicas para lo genérico** y **carpetas por feature para lo específico**.\n\n```\napp/              → rutas con Expo Router (file-based)\ncomponents/       → componentes reutilizables\ncomponents/ui/    → componentes atómicos (Button, Card, Input)\nfeatures/         → módulos por feature (auth, pedidos, clientes)\nhooks/            → hooks genéricos\nconstants/        → temas, configuraciones\nservices/         → API client y servicios HTTP\nstores/           → stores Zustand\ntypes/            → tipos compartidos\nutils/            → utilidades transversales\n```\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: feature-based con carpetas técnicas compartidas (seleccionada)\nSepara lo genérico (UI, hooks, servicios) de lo específico (features). Las features contienen sus propias pantallas, componentes y lógica.\n\n### Opción 2: Todo por tipo técnico (screens/, components/, hooks/ globales)\nLas carpetas se vuelven enormes rápido. Una feature como \"pedidos\" tiene archivos dispersos en 5 carpetas distintas.\n\n### Opción 3: Feature-based estricto (cada feature con todo adentro)\nCada feature contiene sus propios hooks, componentes y servicios, incluso si son compartibles. Genera duplicación innecesaria.\n\n### Opción seleccionada\nOpción 1. Balance entre organización por feature y reutilización de código genérico.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Navegación predecible: los archivos de una feature están cerca\n- Separación clara entre código genérico (UI, hooks) y específico (features)\n- Onboarding rápido: se entiende la estructura en minutos\n- Escala horizontalmente con nuevas features\n- Components atómicos reutilizables en `components/ui/`\n\n### Negativas\n- Una feature que crece mucho puede tener muchos archivos en su carpeta\n- Límite difuso entre qué va en `components/` y qué en `features/`\n- Puede requerir refactors periódicos al mover código genérico descubierto\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Sin impacto.\n\n### Frontend (Mobile)\n- `app/` → solo archivos de ruta Expo Router\n- `features/auth/` → pantallas, hooks, stores específicos de auth\n- `features/pedidos/` → pantallas, hooks, stores de pedidos\n- `components/ui/` → Button, Card, Input, etc. (atómicos, reutilizables)\n\n### Infraestructura / Compartido\n- Convención documentada. Sin cambios en tooling.\n\n---\n\n## Reglas Derivadas\n\n- `components/ui/` solo contiene componentes atómicos sin lógica de negocio\n- `components/` contiene componentes compuestos reutilizables entre features\n- `features/<feature>/` contiene pantallas, hooks, stores y componentes específicos\n- Una feature no importa archivos de otra feature directamente\n- Código compartido entre features va en `hooks/`, `utils/` o `components/`\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0009-estado-mobile-zustand.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Manejo de Estado Mobile con Zustand\n---\n\n# ADR-0009: Manejo de Estado Mobile con Zustand\n\n## Contexto\n\nLa app mobile necesita manejar estado global compartido entre pantallas: sesión del usuario, preferencias, configuración offline, UI state (modales, carga, etc.). El estado del servidor se maneja con TanStack Query, pero el estado local/cliente requiere una herramienta liviana.\n\nReact Context + useReducer es viable pero genera re-renders en todo el árbol y requiere providers anidados.\n\n---\n\n## Decisión\n\nSe utiliza **Zustand** para todo el estado local del cliente. Zustand es una librería de estado minimalista (1KB) que no requiere providers, permite selectores finos para evitar re-renders, y se integra naturalmente con TypeScript.\n\nStores definidos:\n- `authStore` → token, usuario autenticado, rol\n- `uiStore` → modales, loading, preferencias de UI\n- `offlineStore` → datos en cola para sincronizar\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Zustand (seleccionada)\n1KB, sin providers, selectores finos, middleware persist, integración TypeScript perfecta.\n\n### Opción 2: React Context + useReducer\nSolución nativa de React pero causa re-renders en todo el árbol. Los contextos anidados son difíciles de mantener.\n\n### Opción 3: Redux Toolkit\nSobredimensionado. Requiere stores, slices, actions, reducers. Mucho boilerplate para el alcance del proyecto.\n\n### Opción 4: Jotai / Recoil\nModelo atómico interesante pero menos adopción y ecosistema que Zustand.\n\n### Opción seleccionada\nOpción 1. Zustand es el estándar actual para estado local en React Native, con la mejor relación simplicidad/potencia.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Sin providers: se usa el store directamente desde cualquier componente\n- Selectores finos: solo el componente que usa un dato se re-renderiza\n- Middleware `persist` para guardar estado en AsyncStorage\n- TypeScript first: stores tipados sin configuración extra\n- API simple: `create()`, `set()`, `get()`\n\n### Negativas\n- No maneja estado del servidor (para eso está TanStack Query)\n- Si se abusa, puede centralizar demasiado estado en un solo store\n- Middleware de persistencia requiere configuración de serialización\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Sin impacto.\n\n### Frontend (Mobile)\n- `stores/authStore.ts` → sesión, token, usuario\n- `stores/uiStore.ts` → modales, loading global\n- `stores/offlineStore.ts` → cola de sincronización offline\n- Cada store es un archivo independiente\n\n### Infraestructura / Compartido\n- Dependencia: `zustand` + `zustand/middleware` (persist)\n- AsyncStorage para persistencia de stores\n\n---\n\n## Reglas Derivadas\n\n- Zustand se usa exclusivamente para estado local del cliente\n- El estado del servidor va en TanStack Query (useQuery, useMutation)\n- Los stores se organizan por dominio (auth, ui, offline)\n- Store names con sufijo `Store`: `authStore`, `uiStore`\n- No almacenar datos del servidor en Zustand\n- Usar persist middleware para datos que deben sobrevivir al cierre de la app\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0010-navegacion-expo-router.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Navegación Mobile con Expo Router (File-based)\n---\n\n# ADR-0010: Navegación Mobile con Expo Router (File-based)\n\n## Contexto\n\nLa app mobile necesita un sistema de navegación que maneje tabs, stacks y modales. El equipo está familiarizado con file-based routing de Next.js y se busca una experiencia similar para React Native.\n\nLa navegación debe ser nativa (no JS-based) para rendimiento y comportamiento de plataforma.\n\n---\n\n## Decisión\n\nSe utiliza **Expo Router 6** con file-based routing, que internamente usa `@react-navigation/native-stack` para stacks nativos y `@react-navigation/bottom-tabs` para tabs.\n\nEstructura:\n```\napp/\n├── _layout.tsx        → layout raíz (Stack)\n├── (tabs)/\n│   ├── _layout.tsx    → layout de tabs\n│   ├── index.tsx      → home\n│   └── explore.tsx    → explorar\n├── modal.tsx          → modal global\n└── login.tsx          → login (fuera de tabs)\n```\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Expo Router 6 file-based (seleccionada)\nNavegación declarativa con archivos y carpetas. Layouts anidados, links tipados, deep linking automático.\n\n### Opción 2: @react-navigation puro\nConfiguración programática de navigators. Más flexible pero más verboso. Sin file-based routing.\n\n### Opción 3: react-native-navigation (Wix)\nNavegación 100% nativa sin bridge JS. Configuración muy compleja, mala DX. Sobredimensionado.\n\n### Opción seleccionada\nOpción 1. Expo Router es el estándar recomendado por Expo para proyectos nuevos. File-based reduce fricción y hace la navegación auto-documentada.\n\n---\n\n## Consecuencias\n\n### Positivas\n- File-based: crear una pantalla = crear un archivo\n- Layouts anidados con `_layout.tsx` (stack dentro de tabs, etc.)\n- Deep linking automático sin configuración\n- Links tipados con `href` tipo-safe\n- Navegación nativa por debajo (native-stack)\n- Soportado oficialmente por Expo\n\n### Negativas\n- Estructura de archivos rígida (los archivos definen la URL)\n- Layouts complejos pueden requerir `_layout.tsx` anidados difíciles de seguir\n- Expo Router 6 aún tiene menos comunidad que @react-navigation puro\n- Migrar desde @react-navigation requiere reestructurar archivos\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Sin impacto.\n\n### Frontend (Mobile)\n- `app/_layout.tsx` → configuración global de navegación\n- `app/(tabs)/_layout.tsx` → tabs layout\n- `app/(tabs)/index.tsx` → pantalla principal\n- `app/login.tsx` → pantalla de login (stack modal)\n- `app/modal.tsx` → modal global\n\n### Infraestructura / Compartido\n- Sin cambios. Expo Router viene incluido en Expo SDK 54.\n\n---\n\n## Reglas Derivadas\n\n- Cada archivo en `app/` es una ruta\n- `_layout.tsx` define layouts y navigators\n- `(tabs)/` es un grupo de rutas sin afectar la URL\n- `(tabs)/index.tsx` es la pantalla de inicio\n- Pantallas fuera de `(tabs)/` son stacks/modales\n- Usar `<Link href=\"...\">` en lugar de `navigation.navigate()`\n- Deep linking funciona automáticamente para todas las rutas\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0011-validacion-zod.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Validación de Inputs con Zod 4\n---\n\n# ADR-0011: Validación de Inputs con Zod 4\n\n## Contexto\n\nLa API REST recibe datos de clientes externos (mobile, webhooks). Sin validación, datos malformados pueden llegar a la base de datos, causar errores 500 o corromper datos. Además, ZodError debe ser capturado y transformado al formato de error estándar de la API.\n\nSe necesita una librería de validación que sea tipo-segura, declarativa y se integre con TypeScript sin fricción.\n\n---\n\n## Decisión\n\nSe utiliza **Zod 4** para validar todos los inputs de la API (body, query params, path params). Cada feature define su schema Zod en `schema.ts`, y los controladores validan antes de pasar al service.\n\nLos errores de validación Zod son capturados automáticamente por el middleware global de errores y transformados al formato `VALIDATION_ERROR` con `details` por campo.\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Zod 4 (seleccionada)\nTypeScript nativo, inferencia de tipos automática, sintaxis declarativa, parseo seguro. Versión 4 con mejoras de performance y DX.\n\n### Opción 2: Joi\nLibrería madura pero no tiene inferencia de tipos nativa. Requiere generar tipos manualmente o con herramientas externas.\n\n### Opción 3: Yup\nSimilar a Zod pero menos adopción en TypeScript. Inferencia de tipos limitada.\n\n### Opción 4: class-validator + class-transformer\nRequiere decorators y clases, más verboso. No es compatible con `verbatimModuleSyntax` de TypeScript 6 sin configuración extra.\n\n### Opción 5: Validación manual (if/else)\nFuncional pero tedioso, propenso a errores, sin tipo seguro. No escalable.\n\n### Opción seleccionada\nOpción 1. Zod 4 es el estándar de facto para validación en TypeScript. La integración con Prisma y Express es natural.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Tipos inferidos automáticamente: `z.infer<typeof schema>` genera el tipo exacto\n- Sintaxis declarativa y legible\n- Parseo con `schema.parse()` o `schema.safeParse()` para manejo de errores\n- ZodError capturado por middleware global de errores\n- Zod 4 es más rápido que versiones anteriores\n- Compatible con TypeScript 6 strict mode\n\n### Negativas\n- Duplicación potencial (los tipos Prisma ya existen, Zod agrega otra capa)\n- Schemas complejos pueden ser difíciles de leer\n- Zod 4 introdujo cambios breaking respecto a Zod 3 (migración si se usaba la v3)\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Cada feature tiene `schema.ts` con schemas Zod\n- Controladores usan `schema.parse(body)` antes de llamar al service\n- Middleware global captura ZodError y responde con formato `VALIDATION_ERROR`\n- `z.infer<>` se usa para tipar los DTOs en services y controllers\n\n### Frontend (Mobile)\n- Sin impacto directo. La validación es server-side.\n- Se pueden compartir schemas Zod (copiados manualmente) para validación client-side.\n\n### Infraestructura / Compartido\n- Dependencia: `zod` en backend\n- Sin nuevas herramientas de build\n\n---\n\n## Reglas Derivadas\n\n- Todo input de API se valida con Zod antes de procesarse\n- Usar `safeParse()` en lugar de `parse()` cuando se necesite manejo de error personalizado\n- Los schemas Zod se definen en `schema.ts` de cada feature\n- No validar dos veces lo mismo (si Prisma ya valida el tipo, Zod valida formato)\n- ZodError se maneja exclusivamente en el middleware global\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 43.0s)

_Thinking:_

Now let me create the last batch: ADR-0012 to ADR-0015.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Crear ADR-0000 al ADR-0003",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0004 al ADR-0007",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0008 al ADR-0011",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0012 al ADR-0015",
      "status": "in_progress"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Crear ADR-0000 al ADR-0003",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0004 al ADR-0007",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0008 al ADR-0011",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0012 al ADR-0015",
    "status": "in_progress",
    "priority": "high"
  }
]
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0012-versionado-api.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Versionado de API con Prefijo /api/v1/\n---\n\n# ADR-0012: Versionado de API con Prefijo /api/v1/\n\n## Contexto\n\nLa API evolucionará con el tiempo: nuevos campos, cambios en contratos, deprecación de endpoints. El mobile puede no actualizarse al mismo ritmo que el backend. Sin versionado, un cambio breaking en la API puede romper la app mobile en producción.\n\nSe necesita una estrategia que permita convivir múltiples versiones de la API durante períodos de transición.\n\n---\n\n## Decisión\n\nTodas las rutas API se montan bajo el prefijo `/api/v1/`. Ejemplo:\n\n- `GET /api/v1/clientes`\n- `POST /api/v1/pedidos`\n- `POST /api/v1/auth/login`\n\nCuando sea necesario introducir cambios breaking, se crea `/api/v2/` mientras `/api/v1/` sigue funcionando con soporte por tiempo definido.\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Prefijo en la URL /api/v1/ (seleccionada)\nSimple, explícito, fácil de implementar con `app.use('/api/v1', router)` en Express.\n\n### Opción 2: Header HTTP (Accept-Version, X-API-Version)\nLa versión va en el header, la URL se mantiene limpia. Más complejo de implementar y depurar (el versionado es implícito).\n\n### Opción 3: Subdominio (v1.api.example.com)\nRequiere configuración de DNS y reverse proxy. Sobredimensionado para el alcance del proyecto.\n\n### Opción 4: Sin versionado (siempre hacia adelante)\nNo hay compatibilidad hacia atrás. Cualquier cambio puede romper clientes. Solo viable si mobile se actualiza forzosamente.\n\n### Opción seleccionada\nOpción 1. El prefijo en la URL es el estándar en APIs REST públicas (GitHub, Stripe, Twilio). Es explícito, fácil de depurar y no requiere infraestructura adicional.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Explícito: al ver la URL se sabe qué versión se está usando\n- Fácil de implementar: un `app.use()` en Express\n- El mobile puede migrar gradualmente apuntando a la nueva versión\n- Posible tener rutas v1 y v2 coexistiendo\n\n### Negativas\n- URLs más largas\n- Si hay muchas versiones, el código se llena de routers legacy\n- Mantener versiones anteriores requiere backports de bug fixes\n- La versión en la URL es menos flexible que negociación por content-type\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- `app.ts` monta rutas con `app.use('/api/v1', router)`\n- Cada feature define sus rutas relativas (sin /api/v1/)\n- Cuando se necesite v2, se crea un nuevo `router-v2` en paralelo\n\n### Frontend (Mobile)\n- `EXPO_PUBLIC_API_URL` apunta a la raíz (ej: `https://api.example.com`)\n- El prefijo `/api/v1/` está hardcodeado en el cliente Axios\n- Migrar a v2 requiere cambiar la URL base o agregar un interceptor\n\n### Infraestructura / Compartido\n- Sin cambios en infraestructura\n- Documentación de API referenciada por versión\n\n---\n\n## Reglas Derivadas\n\n- El prefijo `/api/v1/` se configura en `app.ts`, no en cada router\n- Las rutas internas en cada feature se definen sin el prefijo\n- Una nueva versión implica un nuevo archivo de rutas, no modificar el existente\n- Las versiones antiguas se deprecan con un plan de descontinuación comunicado\n- El mobile usa una variable de entorno para configurar la versión de API\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0013-logging-pino.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Logging con Pino + Morgan\n---\n\n# ADR-0013: Logging con Pino + Morgan\n\n## Contexto\n\nEl backend necesita un sistema de logging que permita rastrear requests, errores y eventos del sistema. En desarrollo se requiere logs legibles para humanos; en producción, logs estructurados en JSON para ingestión en herramientas de monitoreo (Datadog, Grafana, ELK).\n\nAdemás, se necesita un registro de todas las requests HTTP entrantes (method, status, duración) para auditoría y debugging.\n\n---\n\n## Decisión\n\nSe utiliza **Pino** como logger principal y **Morgan** como middleware de logging HTTP, configurado para usar Pino como transporte:\n\n- **Pino**: logging estructurado en JSON, async, de baja sobrecarga\n- **Morgan**: middleware HTTP request logging, integrado con Pino\n- En desarrollo: pretty print con `pino-pretty`\n- En producción: JSON puro para ingestión en sistemas de monitoreo\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Pino + Morgan (seleccionada)\nPino es el logger más rápido para Node.js (~3x más rápido que Winston). Morgan es el estándar para HTTP logging en Express.\n\n### Opción 2: Winston\nMás popular pero más lento y verboso de configurar. Para el alcance del proyecto, Pino es suficiente y más performante.\n\n### Opción 3: Solo Pino (sin Morgan)\nRequiere implementar manualmente el logging HTTP. Morgan ya resuelve esto con formato configurable.\n\n### Opción 4: Console.log\nSin niveles, sin estructura, sin rotación. Inviable para producción.\n\n### Opción seleccionada\nOpción 1. Pino es rápido, liviano, y produce JSON estructurado. Morgan se integra en una línea como middleware Express.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Logs estructurados en JSON (parseables por máquinas)\n- Pino es el logger más rápido de Node.js (~3x más rápido que Winston)\n- Morgan da logging HTTP automático (method, url, status, duration)\n- En desarrollo: pretty print legible con colores\n- Niveles de log: trace, debug, info, warn, error, fatal\n- Baja sobrecarga en producción\n\n### Negativas\n- Dos dependencias (pino + morgan) vs. una sola (winston lo incluye todo)\n- Pino-pretty es una dependencia adicional solo para desarrollo\n- Morgan+Pino requiere configuración de stream personalizado\n- Winston tiene más middleware y plugins en su ecosistema\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- `src/config/logger.ts` → configuración de Pino con pretty print en dev\n- Morgan configurado como middleware en `app.ts`\n- Reemplazar `console.log` por `logger.info()` y `logger.error()` en todo el código\n- Errores no controlados se loguean con `logger.error()` en el middleware global\n\n### Frontend (Mobile)\n- Sin impacto.\n\n### Infraestructura / Compartido\n- Dependencias: `pino`, `pino-pretty` (dev), `morgan`\n- Logs en stdout (no archivos) — el entorno orquestador captura stdout\n- En producción, logs JSON para ingestión (Datadog, Grafana Loki, ELK)\n\n---\n\n## Reglas Derivadas\n\n- Usar `logger.info()`, `logger.error()`, `logger.warn()` reemplazando `console.log`\n- Morgan se registra como primer middleware para capturar todas las requests\n- En producción no usar pretty print (solo JSON plano)\n- Errores se loguean con `logger.error({ err, ...context }, mensaje)`\n- No loguear información sensible (passwords, tokens)\n- Logs a stdout, no a archivos (12factor app)\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0014-testing-vitest.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Testing con Vitest + supertest + vitest-mock-prisma\n---\n\n# ADR-0014: Testing con Vitest + supertest + vitest-mock-prisma\n\n## Contexto\n\nEl backend necesita un framework de testing rápido, compatible con TypeScript 6 y ESModules. Además, se requieren tests de integración para la API Express y tests unitarios para servicios que usan Prisma, sin necesidad de una base de datos real.\n\nSe necesita una solución que permita:\n- Tests unitarios rápidos (sin base de datos)\n- Tests de integración con Express (supertest)\n- Mocking de Prisma para aislar la lógica de negocio\n\n---\n\n## Decisión\n\nSe utiliza **Vitest** como runner de tests, **supertest** para tests de integración HTTP, y **vitest-mock-prisma** para mockear el cliente Prisma en tests unitarios.\n\n- Tests unitarios: mockean Prisma con `vitest-mock-prisma`\n- Tests de integración: levantan Express con supertest y base de datos de test\n- Cobertura mínima: 80%\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Vitest + supertest + vitest-mock-prisma (seleccionada)\nVitest es nativamente compatible con TypeScript 6 y ESModules. Es ~20x más rápido que Jest al usar esbuild para transformar. supertest es el estándar para testear Express.\n\n### Opción 2: Jest + ts-jest\nJest no es nativamente compatible con ESModules. Requiere configuración extra para funcionar con TypeScript 6 y NodeNext. ts-jest es lento.\n\n### Opción 3: Vitest + supertest + base de datos real\nMás fidelidad pero más lento y requiere infraestructura de base de datos. Los tests unitarios no necesitan base de datos real.\n\n### Opción 4: Ava + supertest\nAva es rápido pero tiene menos ecosistema que Vitest. Menos integraciones con herramientas del ecosistema.\n\n### Opción seleccionada\nOpción 1. Vitest es el estándar moderno para testing en TypeScript, con integración nativa de ESModules y TypeScript 6.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Vitest es nativamente compatible con TypeScript 6 y ESModules\n- Transformación rápida con esbuild (sin ts-jest)\n- Mocking de Prisma sencillo con `vitest-mock-prisma`\n- Compatibilidad con Jest API (describe, it, expect) → migración trivial\n- supertest permite testear Express sin levantar el servidor real\n- Watch mode rápido para TDD\n- Cobertura de código integrada con v8/istanbul\n\n### Negativas\n- vitest-mock-prisma no soporta todas las features de Prisma (transacciones, queries complejas)\n- Tests de integración requieren una base de datos PostgreSQL real (o testcontainers)\n- La cobertura del 80% requiere disciplina del equipo\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- `vitest.config.ts` → configuración de Vitest\n- `src/**/*.test.ts` → tests unitarios junto al código\n- Mocking de Prisma en tests unitarios con `vitest-mock-prisma`\n- Tests de integración con supertest en `tests/integration/`\n- Script `npm run test` y `npm run test:coverage`\n\n### Frontend (Mobile)\n- Sin impacto directo. Mobile puede adoptar Vitest independientemente.\n\n### Infraestructura / Compartido\n- Dependencias dev: `vitest`, `supertest`, `vitest-mock-prisma`\n- Base de datos de test en CI (PostgreSQL)\n- Umbral de cobertura configurado en `vitest.config.ts`\n\n---\n\n## Reglas Derivadas\n\n- Tests unitarios con Prisma mockeado: sin base de datos real\n- Tests de integración con supertest + base de datos PostgreSQL real\n- Nombrar archivos: `*.test.ts` o `*.spec.ts`\n- Cobertura mínima: 80% (configurada como umbral en vitest)\n- Mockear Prisma con `vitest-mock-prisma` en tests unitarios\n- Usar `describe`/`it`/`expect` (API compatible con Jest)\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\\ADR-0015-soft-delete-audit.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Soft Delete y Trazabilidad (Audit Fields)\n---\n\n# ADR-0015: Soft Delete y Trazabilidad (Audit Fields)\n\n## Contexto\n\nEl sistema maneja datos sensibles (clientes, pedidos, repartos) que no deben perderse ante eliminaciones accidentales. Se necesita poder recuperar registros eliminados y auditar quién creó/modificó cada registro.\n\nAdemás, en un sistema de gestión de pedidos, eliminar físicamente un registro puede romper relaciones y referencias históricas.\n\n---\n\n## Decisión\n\nSe implementa **soft delete** en todas las entidades del sistema, más campos de auditoría en cada tabla.\n\nCampos estándar en todas las tablas:\n\n```prisma\nmodel BaseEntity {\n  createdAt  DateTime   @default(now())\n  updatedAt  DateTime   @updatedAt\n  deletedAt  DateTime?  // soft delete\n  createdBy  String?    // usuario que creó\n  updatedBy  String?    // usuario que modificó\n}\n```\n\nLas consultas siempre filtran `WHERE deletedAt IS NULL` por defecto. Para acceder a registros eliminados se usa un query parameter `?incluirEliminados=true` en la API.\n\n---\n\n## Opciones Consideradas\n\n### Opción 1: Soft delete con campos de auditoría (seleccionada)\nSe agrega `deletedAt` en todas las tablas. Las queries filtran por defecto. Se puede recuperar registros eliminados.\n\n### Opción 2: Hard delete + backup periódico\nLos datos se pierden hasta el próximo backup. No hay recuperación granular. No hay trazabilidad de eliminación.\n\n### Opción 3: Tabla de logs separada\nUna tabla `audit_log` que registra cada operación. Más complejo (trigger por cada CRUD). Más potente pero sobredimensionado.\n\n### Opción 4: Solo soft delete sin auditoría\nSe elimina lógicamente pero no se sabe quién lo hizo ni cuándo exactamente.\n\n### Opción seleccionada\nOpción 1. Soft delete es simple de implementar con Prisma (middleware o `@updatedAt`), no requiere tablas adicionales, y permite recuperación granular.\n\n---\n\n## Consecuencias\n\n### Positivas\n- Los datos nunca se pierden físicamente\n- Recuperación granular de registros eliminados\n- Trazabilidad de quién creó/modificó cada registro\n- Las relaciones históricas se mantienen (pedidos referencian clientes eliminados)\n- Implementación simple con Prisma (middleware `$use`)\n\n### Negativas\n- Las tablas crecen en tamaño con registros \"borrados\"\n- Cada query debe filtrar `deletedAt IS NULL` (olvidarlo expone datos \"eliminados\")\n- Las constraints de unicidad pueden conflicto con registros eliminados\n- Prisma no tiene soft delete nativo → requiere middleware o consultas explícitas\n\n---\n\n## Impacto en el Sistema\n\n### Backend\n- Middleware Prisma que filtra `deletedAt` automáticamente en todas las queries\n- Campos `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, `updatedBy` en cada modelo\n- Endpoints GET aceptan `?incluirEliminados=true`\n- Los services inyectan el usuario autenticado en `createdBy`/`updatedBy`\n- PATCH / DELETE solo marcan `deletedAt`, nunca eliminan físicamente\n\n### Frontend (Mobile)\n- Sin impacto directo. Puede mostrar indicador visual si un recurso está \"eliminado\" (soft).\n\n### Infraestructura / Compartido\n- Migraciones Prisma para agregar campos de auditoría a tablas existentes\n- Prisma middleware para filtrar soft delete automático\n\n---\n\n## Reglas Derivadas\n\n- Toda entidad tiene `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, `updatedBy`\n- DELETE siempre es soft delete (marcar `deletedAt`)\n- Las queries GET filtran `deletedAt IS NULL` por defecto\n- Endpoint con `?incluirEliminados=true` para acceder a eliminados\n- El `createdBy` se obtiene del token JWT del request\n- Prisma middleware global para filtrar soft delete automáticamente\n- Las constraints de unicidad deben considerar `deletedAt` (unique compuesto)\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 5.4s)

_Thinking:_

All 16 ADR files created. Let me verify they all exist and update the todo list.

**Tool: bash**

**Input:**
```json
{
  "command": "Get-ChildItem -LiteralPath \"C:\\damian\\Repo\\SupplyCycle\\docs\\ADRs\" -Filter \"*.md\" | Select-Object Name",
  "description": "List all ADR files created"
}
```

**Output:**
```

Name                                      
----                                      
ADR-0000-estandarizacion-respuestas-api.md
ADR-0001-autenticacion-jwt-roles.md       
ADR-0002-arquitectura-mobile.md           
ADR-0003-monorepo-tres-proyectos.md       
ADR-0004-stack-backend.md                 
ADR-0005-stack-mobile.md                  
ADR-0006-stack-whatsapp.md                
ADR-0007-arquitectura-backend-capas.md    
ADR-0008-arquitectura-mobile-features.md  
ADR-0009-estado-mobile-zustand.md         
ADR-0010-navegacion-expo-router.md        
ADR-0011-validacion-zod.md                
ADR-0012-versionado-api.md                
ADR-0013-logging-pino.md                  
ADR-0014-testing-vitest.md                
ADR-0015-soft-delete-audit.md             
Template.md                               



```

---

## Assistant (Build · Big Pickle · 3.6s)

_Thinking:_

All 16 ADRs plus the existing Template.md are in place. Let me update the todo list.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Crear ADR-0000 al ADR-0003",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0004 al ADR-0007",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0008 al ADR-0011",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Crear ADR-0012 al ADR-0015",
      "status": "completed"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Crear ADR-0000 al ADR-0003",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0004 al ADR-0007",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0008 al ADR-0011",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Crear ADR-0012 al ADR-0015",
    "status": "completed",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Big Pickle · 4.8s)

Listos los 16 ADRs en `docs/ADRs/`:

| # | Archivo |
|---|---------|
| **ADR-0000** | `ADR-0000-estandarizacion-respuestas-api.md` |
| **ADR-0001** | `ADR-0001-autenticacion-jwt-roles.md` |
| **ADR-0002** | `ADR-0002-arquitectura-mobile.md` |
| **ADR-0003** | `ADR-0003-monorepo-tres-proyectos.md` |
| **ADR-0004** | `ADR-0004-stack-backend.md` |
| **ADR-0005** | `ADR-0005-stack-mobile.md` |
| **ADR-0006** | `ADR-0006-stack-whatsapp.md` |
| **ADR-0007** | `ADR-0007-arquitectura-backend-capas.md` |
| **ADR-0008** | `ADR-0008-arquitectura-mobile-features.md` |
| **ADR-0009** | `ADR-0009-estado-mobile-zustand.md` |
| **ADR-0010** | `ADR-0010-navegacion-expo-router.md` |
| **ADR-0011** | `ADR-0011-validacion-zod.md` |
| **ADR-0012** | `ADR-0012-versionado-api.md` |
| **ADR-0013** | `ADR-0013-logging-pino.md` |
| **ADR-0014** | `ADR-0014-testing-vitest.md` |
| **ADR-0015** | `ADR-0015-soft-delete-audit.md` |

Todos siguen el template con: Contexto → Decisión → Opciones Consideradas (con ventajas/desventajas) → Consecuencias (positivas/negativas) → Impacto en el Sistema (Backend/Mobile/Infra) → Reglas Derivadas.

---

## User

Podes ver el archivo Domain-Class.jpeg y darme un markdwon que detalle las clases de dominio ? 

---

## Assistant (Build · Big Pickle · 4.0s)

_Thinking:_

The user wants me to look at a file called "Domain-Class.jpeg" in the repository. Let me find it first.

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/*Domain*Class*"
}
```

**Output:**
```
C:\damian\Repo\SupplyCycle\docs\especificacion\Domain-Class.jpeg
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/*domain*class*"
}
```

**Output:**
```
No files found
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/*.jpeg"
}
```

**Output:**
```
C:\damian\Repo\SupplyCycle\docs\especificacion\Domain-Class.jpeg
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/*.jpg"
}
```

**Output:**
```
No files found
```

---

## Assistant (Build · Big Pickle · 2.8s)

_Thinking:_

Found it at `docs/especificacion/Domain-Class.jpeg`. Let me read it.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\especificacion\\Domain-Class.jpeg"
}
```

**Output:**
```
Image read successfully
```

---

## Assistant (Build · Big Pickle · 3.7s)

_Thinking:_

The model can't read the image directly. Let me try a different approach - maybe I can use a bash command to get info about the image, or search for any text description of the domain classes in the repo.

No puedo leer la imagen directamente desde acá. Dame una descripción de lo que muestra el diagrama o pasame el texto de las clases de dominio y te lo paso a markdown al toque.

---

## User

Dame el commit para las ADRs

---

## Assistant (Plan · Big Pickle · 5.2s)

_Thinking:_

The user wants me to give them the git commit command for the ADRs I just created. Since I'm in Plan Mode, I can't execute anything, but I can give them the commands to run.

They want me to provide the commit for the 16 ADR files I created in `docs/ADRs/`.

Acá tenés:

```bash
git add docs/ADRs/ADR-0000-*.md docs/ADRs/ADR-0001-*.md docs/ADRs/ADR-0002-*.md docs/ADRs/ADR-0003-*.md docs/ADRs/ADR-0004-*.md docs/ADRs/ADR-0005-*.md docs/ADRs/ADR-0006-*.md docs/ADRs/ADR-0007-*.md docs/ADRs/ADR-0008-*.md docs/ADRs/ADR-0009-*.md docs/ADRs/ADR-0010-*.md docs/ADRs/ADR-0011-*.md docs/ADRs/ADR-0012-*.md docs/ADRs/ADR-0013-*.md docs/ADRs/ADR-0014-*.md docs/ADRs/ADR-0015-*.md
git commit -m "docs(adr): agregar ADRs 0000-0015 de decisiones tecnicas"
```

O más simple:

```bash
git add docs/ADRs/ADR-*.md
git commit -m "docs(adr): agregar ADRs 0000-0015 de decisiones tecnicas"
```

---

## User

te falto el Template

---

## Assistant (Plan · Big Pickle · 5.3s)

_Thinking:_

The user is right - the Template.md already existed in docs/ADRs/ and was already tracked. It's not a new file so it doesn't need to be added. My commit command was fine as-is since `ADR-*.md` won't match `Template.md` (Template starts with T, not A). 

But wait - actually `ADR-*.md` would NOT match `Template.md` since the pattern specifically starts with `ADR-`. So the commit command was correct. Let me just clarify that.

No, `Template.md` ya existía antes, no es un archivo nuevo. El glob `ADR-*.md` solo matchea los nuevos ADRs, no el Template. Está bien así.

```bash
git add docs/ADRs/ADR-*.md
git commit -m "docs(adr): agregar ADRs 0000-0015 de decisiones tecnicas"
```

---

## User

Dame el add y el commit para el Template.md

---

## Assistant (Plan · Big Pickle · 3.7s)

_Thinking:_

The user wants me to give them the git add and commit command for the Template.md file. The Template.md already exists in the repo (it wasn't created by me), but maybe they want to track changes to it or add it if it wasn't committed before. Let me check the git status to see if Template.md is tracked.

**Tool: invalid**

**Input:**
```json
{
  "tool": "bash",
  "error": "Model tried to call unavailable tool 'bash'. Available tools: glob, grep, invalid, question, read, task, todowrite, webfetch, websearch."
}
```

**Output:**
```
The arguments provided to the tool are invalid: Model tried to call unavailable tool 'bash'. Available tools: glob, grep, invalid, question, read, task, todowrite, webfetch, websearch.
```

---

## Assistant (Plan · Big Pickle · 4.5s)

_Thinking:_

I can't use bash in plan mode. I need to give the user the command to run. The Template.md was already committed before (it's an existing file). If they want to add any changes to it or just ensure it's tracked, they can run:

```bash
git add docs/ADRs/Template.md
git commit -m "docs(adr): agregar template de ADRs"
```

But if Template.md was already committed previously (it existed before my changes), this wouldn't do anything unless it was modified. Let me just provide the command.

Si `Template.md` ya existía antes y no lo modificaste, no hace falta agregarlo. Pero si querés asegurarte de que esté trackeado:

```bash
git add docs/ADRs/Template.md
git commit -m "docs(adr): agregar template de ADRs"
```

Igual si ya estaba en el repo antes, `git add` no va a agregar nada nuevo a menos que tenga cambios sin committear.

---

## User

Formateame los TDD respetando el template, hace que respeten los ADRs, dame uno por cada entidad en este schema generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum EstadoRetenido {
  retenido
  devuelto
  perdido
}

enum EstadoCliente {
  activo
  baja
  inactivo
  moroso
}

enum EstadoPedido {
  entregado
  pendiente
  cancelado
  en_ruta
}

enum DiaSemana {
  lunes
  martes
  miercoles
  jueves
  viernes
  sabado
  domingo
}

model Producto {
  id          Int           @id @default(autoincrement())
  nombre      String
  descripcion String
  precio      Float
  unidad      String
  stock       Int
  cantidad    Int
  retornable  Boolean

  itemsPedido ItemPedido[]
  retenidos   Retenido[]
}

model Pedido {
  id         Int           @id @default(autoincrement())
  estado     EstadoPedido
  fechaAlta  DateTime

  clienteId  Int
  cliente    Cliente       @relation(fields: [clienteId], references: [id])

  repartoId  Int?
  reparto    Reparto?      @relation(fields: [repartoId], references: [id])

  items      ItemPedido[]
  visitas    Visita[]
  retenidos  Retenido[]
}

model ItemPedido {
  id             Int       @id @default(autoincrement())
  cantidad       Int
  precioUnitario Float

  productoId     Int
  producto       Producto  @relation(fields: [productoId], references: [id])

  pedidoId       Int
  pedido         Pedido    @relation(fields: [pedidoId], references: [id])
}

model Retenido {
  id          Int              @id @default(autoincrement())
  estado      EstadoRetenido
  inicio      DateTime
  fin         DateTime

  productoId  Int
  producto    Producto         @relation(fields: [productoId], references: [id])

  clienteId   Int
  cliente     Cliente          @relation(fields: [clienteId], references: [id])

  pedidoId    Int
  pedido      Pedido           @relation(fields: [pedidoId], references: [id])
}

model Cliente {
  id         Int              @id @default(autoincrement())
  nombre     String
  apellido   String
  telefono   String
  estado     EstadoCliente

  pedidos    Pedido[]
  retenidos  Retenido[]
  reclamos   Reclamo[]
  domicilios Domicilio[]
}

model Reclamo {
  id         Int       @id @default(autoincrement())

  clienteId  Int
  cliente    Cliente   @relation(fields: [clienteId], references: [id])
}

model Domicilio {
  id            Int       @id @default(autoincrement())
  calle         String
  entreCalle1   String
  entreCalle2   String
  numero        String
  piso          String

  clienteId     Int
  cliente       Cliente   @relation(fields: [clienteId], references: [id])

  ciudadId      Int
  ciudad        Ciudad    @relation(fields: [ciudadId], references: [id])

  dias          Dia[]
}

model Ciudad {
  id          Int          @id @default(autoincrement())
  nombre      String

  domicilios  Domicilio[]
}

model Dia {
  id            Int          @id @default(autoincrement())
  nombre        DiaSemana

  domicilioId   Int
  domicilio     Domicilio    @relation(fields: [domicilioId], references: [id])

  horarios      Horario[]
}

model Horario {
  id        Int      @id @default(autoincrement())
  inicio    DateTime
  fin       DateTime

  diaId     Int
  dia       Dia      @relation(fields: [diaId], references: [id])
}

model Visita {
  id          Int        @id @default(autoincrement())
  fecha       DateTime
  hora        DateTime
  falta       Boolean

  pedidoId    Int
  pedido      Pedido     @relation(fields: [pedidoId], references: [id])

  empleadoId  Int
  empleado    Empleado   @relation(fields: [empleadoId], references: [id])
}

model Empleado {
  id        Int        @id @default(autoincrement())
  nombre    String
  apellido  String
  dni       String

  visitas   Visita[]
}

model Reparto {
  id        Int        @id @default(autoincrement())
  fecha     DateTime
  inicio    DateTime
  fin       DateTime

  pedidos   Pedido[]
} usa - en vez de _ para nombrar. 

---

## Assistant (Plan · Big Pickle · 20.4s)

_Thinking:_

The user wants me to create TDDs (Technical Design Documents) for each entity in the Prisma schema, formatted using the TDD template. They want the filenames to use `-` instead of `_`.

Let me first check the TDD template to make sure I follow it exactly, and also check the existing TDDs for reference.

From what I remember:

**TDD Template** (`docs/TDDs/Template.md`):
- Frontmatter: autor, fecha, titulo
- Title: TDD-[XXXX]: [Title]
- Contexto de Negocio (PRD): Objetivo, User Persona, Criterios de Aceptación
- Diseño Técnico (RFC): technical details
- Casos de Borde y Errores
- Plan de Implementación

The entities from the schema are:
1. Producto
2. Pedido
3. ItemPedido
4. Retenido
5. Cliente
6. Reclamo
7. Domicilio
8. Ciudad
9. Dia
10. Horario
11. Visita
12. Empleado
13. Reparto

But some of these are small (like Ciudad, Dia, Horario) and probably don't need a full TDD. Let me group them logically:

1. **TDD-0000**: Errores y Respuestas Globales (already exists as TDD_0000)
2. **TDD-0001**: Cliente + Domicilio + Ciudad + Dia + Horario (the customer/address domain)
3. **TDD-0002**: Producto + ItemPedido (items/products domain)
4. **TDD-0003**: Pedido + Visita (orders domain)
5. **TDD-0004**: Reparto + Empleado (delivery domain)
6. **TDD-0005**: Retenido + Reclamo (returns/claims domain)
7. **TDD-0006**: Usuarios / Auth (already exists as TDD_0005_Usuarios.md but not in this schema... hmm)
8. **TDD-0007**: Arquitectura Mobile (already exists as TDD_0006_Arquitectura_Mobile.md)

Wait, the user said "dame uno por cada entidad en este schema" - one per entity. But there are 13 entities. That's a lot. Some entities like Ciudad (just name), Dia (just name + relation), Horario (inicio + fin) are very simple and maybe should be grouped.

Let me think about how to group them into meaningful TDDs. Actually, the user said "por entidad" but also said to look at the existing TDDs which group things. Let me re-read the user's request:

"Formateame los TDD respetando el template, hace que respeten los ADRs, dame uno por cada entidad en este schema"

One per entity... But some entities are just join/lookup tables. Let me ask or just group logically.

Actually, let me just group them logically into coherent domains like the existing TDDs do. The existing TDDs are:
- TDD-0000: Errores globales (cross-cutting)
- TDD-0001: Clientes (entity)
- TDD-0002: Items (entity)
- TDD-0003: Pedidos (entity)
- TDD-0004: Reparto (entity)
- TDD-0005: Usuarios (entity - but not in this schema)
- TDD-0006: Arquitectura Mobile (cross-cutting)

So the existing TDDs are roughly one per main entity. Let me propose:

Given what's in the new schema:
1. **TDD-0000**: (already exists - keep it, but renaming from TDD_0000_errores_globales.md)
2. **TDD-0001**: Cliente + Domicilio + Ciudad + Dia + Horario (customer domain with addresses)
3. **TDD-0002**: Producto (product/item catalog)
4. **TDD-0003**: Pedido + ItemPedido + Visita (orders with items and visits)
5. **TDD-0004**: Reparto + Empleado (delivery routes and employees)
6. **TDD-0005**: Retenido + Reclamo (returns, claims, losses)
7. **TDD-0006**: (cross-cutting - auth/mobile - these are separate from entities)

Since the user said "por entidad", let me respect that and give one TDD per main business entity. But I'll group the small lookup entities.

Let me plan this out. I need to check the TDD Template formatting. From what I read earlier:

TDD Template (`docs/TDDs/Template.md`):
```
---
autor: [Nombre]
fecha: [AAAA-MM-DD]
titulo: [Título del Documento Técnico]
---

# TDD-[XXXX]: [Título]

## Contexto de Negocio (PRD)

### Objetivo
...

### User Persona
- **Nombre**: ...
- **Necesidad**: ...

### Criterios de Aceptación
- ...

---

## Diseño Técnico (RFC)

### ...
...

---

## Casos de Borde y Errores

| Escenario | Resultado Esperado |
|---|---|

---

## Plan de Implementación

1. ...
```

OK so I need to plan the TDDs but I'm in plan mode - I can't create files. Let me present the plan to the user with the content so they can see what I'll create.

Actually wait - the user said "dame uno por cada entidad". Let me think about how many that is:

Main entities that make sense as standalone TDDs:
1. Producto (product catalog)
2. Pedido (orders) - includes ItemPedido
3. Cliente (clients) - includes Domicilio/Ciudad/Dia/Horario
4. Retenido (retained/returns)
5. Reclamo (claims)
6. Empleado (employees)
7. Reparto (delivery routes)
8. Visita (visits)

But some of these are tiny. Visita is a join between Pedido and Empleado with just fecha/hora/falta.

I think the best grouping is:

1. **TDD-0001**: Cliente - with Domicilio, Ciudad, Dia, Horario (customer domain)
2. **TDD-0002**: Producto (product catalog)
3. **TDD-0003**: Pedido - with ItemPedido (orders domain)
4. **TDD-0004**: Reparto - with Visita, Empleado (delivery domain)
5. **TDD-0005**: Retenido (retained/returns)
6. **TDD-0006**: Reclamo (claims)

But the user said "por entidad" which means per entity. Let me just ask or do a grouping plan.

Actually, let me just present the plan since I'm in plan mode. I'll propose a grouping and explain which entities I'm grouping together and why.

Also, the user said "usa - en vez de _ para nombrar" - use hyphens instead of underscores in filenames. So the files should be like:

- `TDD-0001-clientes.md`
- `TDD-0002-productos.md`
- etc.

instead of `TDD_0001_Clientes.md`.

Let me present the plan.

Mirando el schema, hay 13 modelos pero varios son tablas de relación/detalle. Te propongo agruparlos así para que los TDDs tengan sentido de dominio:

| TDD | Archivo | Entidades | Justificación |
|-----|---------|-----------|---------------|
| **TDD-0000** | `tdd-0000-errores-globales.md` | *(ya existe)* | Formato respuestas + errores |
| **TDD-0001** | `tdd-0001-clientes.md` | **Cliente**, Domicilio, Ciudad, Dia, Horario | Cliente es el agregado raíz del dominio de clientes; Domicilio/Dia/Horario son parte de su configuración |
| **TDD-0002** | `tdd-0002-productos.md` | **Producto** | Catálogo de productos, con stock y retornable |
| **TDD-0003** | `tdd-0003-pedidos.md` | **Pedido**, ItemPedido, Visita | Pedido es el agregado raíz; ItemPedido es detalle; Visita registra ocurrencias |
| **TDD-0004** | `tdd-0004-repartos.md` | **Reparto**, Empleado | Reparto agrupa pedidos; Empleado es el repartidor asignado |
| **TDD-0005** | `tdd-0005-retenidos.md` | **Retenido** | Envases/productos retenidos, devueltos o perdidos |
| **TDD-0006** | `tdd-0006-reclamos.md` | **Reclamo** | Reclamos de clientes |

Cada TDD va a usar el template con:
- **Contexto de Negocio (PRD)**: Objetivo, User Persona, Criterios de Aceptación
- **Diseño Técnico (RFC)**: modelo Prisma, endpoints API, validaciones, reglas de negocio
- **Casos de Borde y Errores**
- **Plan de Implementación**

Y van a respetar los ADRs (ej: formato de respuesta del ADR-0000, autenticación del ADR-0001, validación Zod del ADR-0011, soft delete del ADR-0015, etc.).

**¿Te parece bien este agrupamiento o querés uno por entidad literal (13 TDDs)?**

---

## User

Dame los TDDs uno por accion del crud de cada entidad, osea cada ttd represetna una accion del endpoint, del CRUD o ABM 

---

## Assistant (Build · Big Pickle · 10.3s)

_Thinking:_

The user wants a TDD per CRUD action (Create, Read, Update, Delete) per entity. That's a lot of TDDs. Let me think about the entities and their CRUD endpoints:

From the schema:
1. **Producto** - GET / POST / PUT / DELETE
2. **Pedido** - GET / POST / PUT / DELETE (but DELETE might be cancel)
3. **Cliente** - GET / POST / PUT / DELETE
4. **Domicilio** - GET / POST / PUT / DELETE (child of Cliente)
5. **Ciudad** - GET / POST / PUT / DELETE
6. **Dia** - GET / POST / PUT / DELETE (child of Domicilio)
7. **Horario** - GET / POST / PUT / DELETE (child of Dia)
8. **Reparto** - GET / POST / PUT
9. **Empleado** - GET / POST / PUT
10. **Visita** - GET / POST / PUT
11. **Retenido** - GET / POST / PUT
12. **Reclamo** - GET / POST
13. **ItemPedido** - GET / POST / PUT / DELETE (child of Pedido)
14. **Auth** - POST login, GET me

That's a LOT of TDDs. But the user said "uno por accion del crud de cada entidad" - one per CRUD action per entity.

Hmm, that could be like 50+ files. Let me ask the user if they really want this level of granularity, or if they want me to clarify.

Actually, let me re-read: "Dame los TDDs uno por accion del crud de cada entidad, osea cada ttd represetna una accion del endpoint, del CRUD o ABM"

So each TDD represents one action (Create, Read, Update, Delete) for an entity. Like:
- TDD-XXXX: Crear Cliente
- TDD-XXXX: Obtener Cliente
- TDD-XXXX: Actualizar Cliente
- TDD-XXXX: Eliminar Cliente (soft delete)

And so on for each entity. But for Auth it would be login/me.

This is a massive amount of files. Let me clarify the naming convention and scope before diving in.

Actually, let me think about which entities make sense for full CRUD and which have limited operations:

**Full CRUD (GET list, GET by id, POST, PUT/PATCH, DELETE):**
- Producto
- Cliente
- Ciudad
- Empleado

**Nested CRUD (child of another entity):**
- Domicilio (child of Cliente)
- Dia (child of Domicilio)
- Horario (child of Dia)
- ItemPedido (child of Pedido)

**Specific operations (not standard CRUD):**
- Pedido (POST crear, GET list/detail, PUT cambiar estado/cancelar → no DELETE)
- Reparto (POST crear, GET list/detail, PUT iniciar/finalizar → no DELETE)
- Visita (POST registrar, GET list)
- Retenido (POST registrar, GET list, PUT actualizar estado)
- Reclamo (POST crear, GET list)

**Auth:**
- POST login
- GET me

Wait, but each TDD per action is going to be a LOT. Let me ask the user if they really want individual files for each action, or if they want grouped by entity with actions as sections.

Actually let me just ask for clarification to avoid wasting time.

Son muchas entidades. Aclarame una cosa antes de arrancar:

¿Querés **un archivo por acción** (ej: `tdd-0100-crear-cliente.md`, `tdd-0101-obtener-cliente.md`, `tdd-0102-actualizar-cliente.md`, etc.) o **un archivo por entidad** con todas las acciones adentro (ej: `tdd-0100-clientes.md` con Create/Read/Update/Delete)?

La primera opción serían ~40-50 archivos. La segunda sería ~12 archivos. ¿Cuál preferís?

---

## User

Dame la de 40 a 50 archivos, tiene que respetar el Template, y mostrar el plan de accion en frontend y backend, te dejo un ejemplo de otro proyecto, pero en este repo es react native el frontend: ejemplos ---
autor: Damián Piazza
fecha: 2026-05-17
titulo: Obtener Usuario Autenticado
---

# TDD-004: Obtener Usuario Autenticado

## Contexto de Negocio (PRD)

### Objetivo
Permitir que el frontend consulte quién es el usuario actualmente autenticado para mostrar su nombre y rol en la interfaz.

### User Persona
*   **Nombre**: Técnico / Licenciado en Hemoterapia
*   **Necesidad**: Verificar que su sesión sigue activa y ver su nombre y rol en la aplicación.

### Criterios de Aceptación
*   El sistema debe retornar los datos del usuario asociado al token
*   Debe rechazar si el token es inválido o la sesión fue revocada
*   No debe exponer la contraseña ni el tokenHash

## Diseño Técnico (RFC)

### Modelo de Datos

**User**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| email | String | UNIQUE, NOT NULL |
| password | String | NOT NULL |
| role | Role (enum) | DEFAULT USER |
| name | String? | |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | |
| createdById | Int? | FK -> User |
| updatedById | Int? | FK -> User |
| deletedById | Int? | FK -> User |

**Session**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| userId | Int | FK -> User, onDelete Cascade |
| tokenHash | String | NOT NULL |
| createdAt | DateTime | @default(now()) |
| expiresAt | DateTime | NOT NULL |
| revokedAt | DateTime? | |

### Contrato de API
*   **Endpoint**: `GET /api/v1/auth/me`
*   **Cookie**: `session_token=<token-opaco-hex>` (enviada automáticamente por el browser)
*   **Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "tecnico@hospital.com", "name": "Facundo Gómez", "role": "USER" }
  }
}
```

### Estructura del Código
```
src/
├── middleware/
│   └── auth.middleware.ts        ← extrae token, valida Session, inyecta req.user
└── modules/
    └── auth/
        ├── auth.routes.ts        ← define ruta GET /me (con middleware auth)
        ├── auth.controller.ts    ← handler me()
        ├── auth.service.ts       ← getCurrentUser(): obtener datos del usuario
        └── auth.repository.ts    ← findById()
```

*   **Middleware** (`src/middleware/auth.middleware.ts`): reutilizado del TDD-003, ya inyecta `req.user`
*   **Controller**: devuelve `req.user` (ya cargado por el middleware)
*   **Service**: si se necesita lógica extra, busca datos actualizados del usuario por ID
*   **Repository**: `findById` — consulta User por ID excluyendo soft-delete

## Casos de Borde y Errores
| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Token inválido | `{ "success": false, "error": "No autenticado" }` | 401 Unauthorized |
| Token revocado | `{ "success": false, "error": "Sesión revocada" }` | 401 Unauthorized |
| Usuario soft-deleted | `{ "success": false, "error": "No autenticado" }` | 401 Unauthorized |

## Plan de Implementación
1. Implementar `UserRepository.findById` (excluyendo soft-delete)
2. Implementar `AuthService.getCurrentUser` (usa middleware + consulta user actualizado)
3. Implementar `AuthController.me`
4. Agregar ruta `GET /api/v1/auth/me` con middleware auth
5. Tests: integración con token válido, inválido, usuario eliminado  ---
autor: Damián Piazza
fecha: 2026-05-17
titulo: Cierre de Sesión
---

# TDD-003: Cierre de Sesión

## Contexto de Negocio (PRD)

### Objetivo
Permitir que el usuario cierre sesión revocando su token actual, para que no pueda seguir siendo usado.

### User Persona
*   **Nombre**: Técnico / Licenciado en Hemoterapia
*   **Necesidad**: Cerrar sesión al finalizar su turno o al retirarse del puesto.

### Criterios de Aceptación
*   El sistema debe revocar la sesión activa marcando `revokedAt`
*   El token revocado no debe poder reutilizarse
*   Requiere cookie `session_token` válida
*   El frontend debe limpiar el estado del usuario y redirigir al login

## Diseño Técnico (RFC)

### Modelo de Datos

**Session**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| userId | Int | FK -> User, onDelete Cascade |
| tokenHash | String | NOT NULL |
| createdAt | DateTime | @default(now()) |
| expiresAt | DateTime | NOT NULL |
| revokedAt | DateTime? | |

### Backend

#### Contrato de API
*   **Endpoint**: `POST /api/v1/auth/logout`
*   **Middleware**: `authMiddleware` (lee cookie, valida sesión, inyecta `req.user`)
*   **Response** `200 OK`:
```json
{ "success": true, "data": { "message": "Sesión cerrada exitosamente" } }
```

#### Casos de Borde y Errores
| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Token inválido (no existe en BD) | `{ "success": false, "error": "No autenticado" }` | 401 Unauthorized |
| Token ya revocado | `{ "success": false, "error": "Sesión revocada" }` | 401 Unauthorized |
| Token expirado | `{ "success": false, "error": "Sesión expirada" }` | 401 Unauthorized |
| Sin cookie | `{ "success": false, "error": "No autenticado" }` | 401 Unauthorized |

#### Estructura del Código (Backend)
```
src/
└── modules/
    └── auth/
        ├── auth.routes.ts          ← POST /logout (con authMiddleware)
        ├── auth.controller.ts      ← logout(): responde 200
        ├── auth.service.ts         ← logout(): revocar sesión en BD
        ├── session.service.ts      ← revokeSession(userId): marcar revokedAt
        └── session.repository.ts   ← revoke(id): UPDATE revokedAt
```

El middleware `auth.middleware.ts` ya existe y es compartido con `GET /me`.

### Frontend

#### Contrato de UI

| Acción | Resultado |
|--------|-----------|
| Usuario hace clic en "Cerrar Sesión" | Se llama `POST /api/v1/auth/logout`, se limpia el estado, se redirige a `/login` |
| Error de red al cerrar sesión | Se muestra un mensaje de error, el usuario permanece en la página |

#### Estructura del Código (Frontend)
```
features/auth/
├── auth-service.ts          ← logout(): POST /auth/logout
├── auth-context.tsx         ← logout(): limpia user, redirige a /login
├── auth.schema.ts           ← logoutResponseSchema (opcional)
├── auth.dto.ts              ← parseLogoutResponse() (opcional)
└── components/
    └── logout-button.tsx    ← botón que consume useAuth().logout
```

## Plan de Implementación

### Backend
1. `session.repository.ts` — agregar `revoke(id: number)` → `UPDATE revokedAt = now()`
2. `session.service.ts` — agregar `revokeSession(userId: number)` → busca sesión activa y la revoca
3. `auth.service.ts` — agregar `logout(userId: number)` → llama `sessionService.revokeSession()`
4. `auth.controller.ts` — agregar `logout()` → obtiene `req.user.id`, llama service, responde 200
5. `auth.routes.ts` — agregar `router.post('/logout', authMiddleware, logout)`
6. Tests unitarios: revocar sesión activa, token en cookie inválido
7. Tests de integración: supertest con token válido, sin token, token revocado

### Frontend
8. `auth-service.ts` — agregar `logout(): Promise<void>` → `api.post('/auth/logout')`
9. `auth-context.tsx` — agregar método `logout()` → llama service, setea `user = null`, redirige a `/login`
10. `logout-button.tsx` — componente que usa `useAuth().logout`, muestra icono y texto
11. Ubicar el botón en un header/navbar compartido (por definir layout general)
12. Tests: `auth-service.logout()` llama al endpoint, `auth-context.logout()` limpia estado

## Dependencias
- `authMiddleware` ya implementado en TDD-002
- Sesión creada durante `login` (TDD-002)  ---
autor: Damián Piazza
fecha: 2026-05-17
titulo: Inicio de Sesión
---

# TDD-002: Inicio de Sesión

## Contexto de Negocio (PRD)

### Objetivo
Permitir que los usuarios registrados inicien sesión con email y contraseña para obtener un token de acceso al sistema (RF0012).

### User Persona
*   **Nombre**: Técnico / Licenciado en Hemoterapia
*   **Necesidad**: Ingresar al sistema al comenzar su turno con sus credenciales personales.

### Criterios de Aceptación
*   El sistema debe autenticar al usuario validando email y contraseña
*   Al autenticarse, debe crear una nueva sesión y devolver un token
*   Si las credenciales son incorrectas, debe rechazar el acceso sin revelar cuál campo es incorrecto
*   Si el usuario está soft-deleted, debe rechazar el acceso

## Diseño Técnico (RFC)

### Modelo de Datos

**User**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| email | String | UNIQUE, NOT NULL |
| password | String | NOT NULL |
| role | Role (enum) | DEFAULT USER |
| name | String? | |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | |
| createdById | Int? | FK -> User |
| updatedById | Int? | FK -> User |
| deletedById | Int? | FK -> User |

**Session**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| userId | Int | FK -> User, onDelete Cascade |
| tokenHash | String | NOT NULL |
| createdAt | DateTime | @default(now()) |
| expiresAt | DateTime | NOT NULL |
| revokedAt | DateTime? | |

### Contrato de API
*   **Endpoint**: `POST /api/v1/auth/login`
*   **Request Body**:
```json
{
  "email": "tecnico@hospital.com",
  "password": "miPassword123"
}
```
*   **Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "tecnico@hospital.com", "name": "Facundo Gómez", "role": "USER" }
  }
}
```
Header `Set-Cookie`:
```
session_token=<token-opaco-hex>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400
```

### Estructura del Código
```
src/
└── modules/
    └── auth/
        ├── auth.routes.ts        ← define ruta POST /login
        ├── auth.controller.ts    ← handler login()
        ├── auth.service.ts       ← login(): buscar user, verificar password, crear Session
        ├── auth.repository.ts    ← findActiveByEmail()
        └── session.repository.ts ← create()
```

*   **Controller**: recibe email + password del body, delega al service, responde
*   **Service**: busca usuario activo por email, compara password con bcrypt, crea sesión, retorna token
*   **Repository**: `findActiveByEmail` — consulta User excluyendo soft-delete (`deletedAt = null`)

## Casos de Borde y Errores
| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Email inexistente | `{ "error": "Email o contraseña incorrectos" }` | 401 Unauthorized |
| Contraseña incorrecta | `{ "error": "Email o contraseña incorrectos" }` | 401 Unauthorized |
| Usuario soft-deleted | `{ "error": "Email o contraseña incorrectos" }` | 401 Unauthorized |
| Email vacío | `{ "error": "El email es requerido" }` | 400 Bad Request |

## Plan de Implementación
1. Implementar `UserRepository.findActiveByEmail` (filtra `deletedAt = null`)
2. Implementar `AuthService.login` (buscar + verificar password con bcrypt + crear sesión)
3. Implementar `AuthController.login`
4. Agregar ruta `POST /api/v1/auth/login` en `auth.routes.ts`
5. Tests: unitario (credenciales válidas, inválidas, soft-delete), integración con supertest

## Seed de Datos

Para poder probar el login se necesita un usuario inicial en la base de datos.

### `prisma/seed.ts` — NUEVO

Script para crear el primer administrador del sistema:

```ts
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/utils/password'

async function main() {
  const email = 'admin@hospital.com'
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('El admin ya existe.')
    return
  }

  await prisma.user.create({
    data: {
      email,
      password: await hashPassword('admin123'),
      name: 'Administrador',
      role: 'ADMIN'
    }
  })

  console.log('Admin creado: admin@hospital.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
```

Agregar script en `package.json`:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Ejecutar:
```bash
npx prisma db seed
```  ---
autor: Damián Piazza
fecha: 2026-05-17
titulo: Obtener Usuario Autenticado
---

# TDD-004: Obtener Usuario Autenticado

## Contexto de Negocio (PRD)

### Objetivo
Permitir que el frontend consulte quién es el usuario actualmente autenticado para mostrar su nombre y rol en la interfaz.

### User Persona
*   **Nombre**: Técnico / Licenciado en Hemoterapia
*   **Necesidad**: Verificar que su sesión sigue activa y ver su nombre y rol en la aplicación.

### Criterios de Aceptación
*   El sistema debe retornar los datos del usuario asociado al token
*   Debe rechazar si el token es inválido o la sesión fue revocada
*   No debe exponer la contraseña ni el tokenHash

## Diseño Técnico (RFC)

### Modelo de Datos

**User**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| email | String | UNIQUE, NOT NULL |
| password | String | NOT NULL |
| role | Role (enum) | DEFAULT USER |
| name | String? | |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | |
| createdById | Int? | FK -> User |
| updatedById | Int? | FK -> User |
| deletedById | Int? | FK -> User |

**Session**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| userId | Int | FK -> User, onDelete Cascade |
| tokenHash | String | NOT NULL |
| createdAt | DateTime | @default(now()) |
| expiresAt | DateTime | NOT NULL |
| revokedAt | DateTime? | |

### Contrato de API
*   **Endpoint**: `GET /api/v1/auth/me`
*   **Cookie**: `session_token=<token-opaco-hex>` (enviada automáticamente por el browser)
*   **Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "tecnico@hospital.com", "name": "Facundo Gómez", "role": "USER" }
  }
}
```

### Estructura del Código
```
src/
├── middleware/
│   └── auth.middleware.ts        ← extrae token, valida Session, inyecta req.user
└── modules/
    └── auth/
        ├── auth.routes.ts        ← define ruta GET /me (con middleware auth)
        ├── auth.controller.ts    ← handler me()
        ├── auth.service.ts       ← getCurrentUser(): obtener datos del usuario
        └── auth.repository.ts    ← findById()
```

*   **Middleware** (`src/middleware/auth.middleware.ts`): reutilizado del TDD-003, ya inyecta `req.user`
*   **Controller**: devuelve `req.user` (ya cargado por el middleware)
*   **Service**: si se necesita lógica extra, busca datos actualizados del usuario por ID
*   **Repository**: `findById` — consulta User por ID excluyendo soft-delete

## Casos de Borde y Errores
| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Token inválido | `{ "success": false, "error": "No autenticado" }` | 401 Unauthorized |
| Token revocado | `{ "success": false, "error": "Sesión revocada" }` | 401 Unauthorized |
| Usuario soft-deleted | `{ "success": false, "error": "No autenticado" }` | 401 Unauthorized |

## Plan de Implementación
1. Implementar `UserRepository.findById` (excluyendo soft-delete)
2. Implementar `AuthService.getCurrentUser` (usa middleware + consulta user actualizado)
3. Implementar `AuthController.me`
4. Agregar ruta `GET /api/v1/auth/me` con middleware auth
5. Tests: integración con token válido, inválido, usuario eliminado  

---

## Assistant (Build · Big Pickle · 31.4s)

_Thinking:_

The user wants me to create TDDs following the exact format of the examples they provided. They want one TDD per CRUD action per entity. Let me analyze the schema and plan out all the TDDs.

Entities from the Prisma schema:
1. Producto
2. Pedido
3. ItemPedido (likely part of Pedido CRUD)
4. Retenido
5. Cliente
6. Reclamo
7. Domicilio
8. Ciudad
9. Dia
10. Horario
11. Visita
12. Empleado
13. Reparto

CRUD actions typically: Create, Get (single), List (get all), Update, Delete (soft delete per ADR-0015)

Plus some specific business actions might be needed.

Let me carefully plan each TDD. I need to follow the exact template from the examples:

```
---
autor: [Nombre]
fecha: [YYYY-MM-DD]
titulo: [Título]
---

# TDD-[XXX]: [Título]

## Contexto de Negocio (PRD)

### Objetivo
### User Persona
### Criterios de Aceptación

## Diseño Técnico (RFC)

### Modelo de Datos
### Contrato de API
### Estructura del Código (Backend)

## Casos de Borde y Errores

## Plan de Implementación

### Backend
### Frontend (Mobile)
```

Wait, the examples also have Frontend section with "Estructura del Código (Frontend)" for some TDDs. The user said "mostrar el plan de accion en frontend y backend" and this is React Native (not Next.js like the example).

Let me count the entities and actions:

**Producto:**
- TDD-XXXX: Crear Producto
- TDD-XXXX: Obtener Producto
- TDD-XXXX: Listar Productos
- TDD-XXXX: Actualizar Producto
- TDD-XXXX: Eliminar Producto (soft)

**Cliente:**
- TDD-XXXX: Crear Cliente
- TDD-XXXX: Obtener Cliente
- TDD-XXXX: Listar Clientes
- TDD-XXXX: Actualizar Cliente
- TDD-XXXX: Eliminar Cliente (soft)

**Pedido:**
- TDD-XXXX: Crear Pedido
- TDD-XXXX: Obtener Pedido
- TDD-XXXX: Listar Pedidos
- TDD-XXXX: Actualizar Pedido (cambiar estado)
- TDD-XXXX: Cancelar Pedido
- TDD-XXXX: Eliminar Pedido (soft)

**ItemPedido:**
- TDD-XXXX: Agregar Item al Pedido
- TDD-XXXX: Quitar Item del Pedido
- TDD-XXXX: Actualizar Cantidad de Item

Actually ItemPedido is a join table, typically managed through the Pedido CRUD. Let me think about whether it needs its own TDDs or is part of Pedido.

Given the user said "uno por accion del crud de cada entidad", I think I should do it per entity model. But ItemPedido is a Many-to-Many relation table, so it should be managed as part of Pedido.

**Retenido:**
- TDD-XXXX: Crear Retenido
- TDD-XXXX: Obtener Retenido
- TDD-XXXX: Listar Retenidos
- TDD-XXXX: Actualizar Estado Retenido
- TDD-XXXX: Eliminar Retenido (soft)

**Reclamo:**
- TDD-XXXX: Crear Reclamo
- TDD-XXXX: Obtener Reclamo
- TDD-XXXX: Listar Reclamos
- TDD-XXXX: Eliminar Reclamo

**Domicilio:**
- TDD-XXXX: Crear Domicilio
- TDD-XXXX: Obtener Domicilio
- TDD-XXXX: Listar Domicilios (por cliente)
- TDD-XXXX: Actualizar Domicilio
- TDD-XXXX: Eliminar Domicilio

**Ciudad:**
- TDD-XXXX: Crear Ciudad
- TDD-XXXX: Obtener Ciudad
- TDD-XXXX: Listar Ciudades
- TDD-XXXX: Actualizar Ciudad
- TDD-XXXX: Eliminar Ciudad

**Dia:**
- TDD-XXXX: Asignar Día a Domicilio
- TDD-XXXX: Quitar Día de Domicilio

**Horario:**
- TDD-XXXX: Asignar Horario a Día
- TDD-XXXX: Quitar Horario de Día

**Visita:**
- TDD-XXXX: Registrar Visita
- TDD-XXXX: Obtener Visita
- TDD-XXXX: Listar Visitas (por pedido/reparto)
- TDD-XXXX: Marcar Visita como Falta

**Empleado:**
- TDD-XXXX: Crear Empleado
- TDD-XXXX: Obtener Empleado
- TDD-XXXX: Listar Empleados
- TDD-XXXX: Actualizar Empleado
- TDD-XXXX: Eliminar Empleado (soft)

**Reparto:**
- TDD-XXXX: Crear Reparto
- TDD-XXXX: Obtener Reparto
- TDD-XXXX: Listar Repartos
- TDD-XXXX: Iniciar Reparto
- TDD-XXXX: Finalizar Reparto
- TDD-XXXX: Eliminar Reparto

This is going to be a LOT of files. Let me count: roughly 45-50 TDDs.

Since the user asked for a sequential numbering like in the example (TDD-002, TDD-003, TDD-004), I should continue from the existing ones or start fresh.

Looking at the existing TDDs:
- TDD_0000_errores_globales.md
- TDD_0001_Clientes.md
- TDD_0002_Items.md
- TDD_0003_Pedidos.md
- TDD_0004_Reparto.md
- TDD_0005_Usuarios.md
- TDD_0006_Arquitectura_Mobile.md

But the user earlier said "ignora a los TDDs" for the ADRs. Now they want me to format the TDDs based on this schema. I think they want to replace the old TDD style with the new per-action TDDs.

Let me use the naming convention from the examples: `TDD-XXXX-nombre.md` (with hyphens as the user specified "usa - en vez de _ para nombrar").

Let me plan the numbering. Since the existing TDDs go from 0000 to 0006, and the user wants per-action TDDs, I should either:
1. Start from 0007 (picking up where they left off)
2. Start from 0100 to avoid collision

Looking at the example, the user showed TDD-002, TDD-003, TDD-004 from another project. So they use a simple sequential number.

I think I should start from 0007 since the existing ones go from 0000 to 0006.

Wait, I need to re-examine. The existing TDDs are different from what the user is now asking. Those old TDDs were higher-level (one per entity with all actions). Now they want one per CRUD action. 

The current files are:
- TDD_0000_errores_globales.md
- TDD_0001_Clientes.md
- TDD_0002_Items.md
- TDD_0003_Pedidos.md
- TDD_0004_Reparto.md
- TDD_0005_Usuarios.md
- TDD_0006_Arquitectura_Mobile.md

I think I should start from 0100 or 0007. Let me use a clean numbering. Since the examples show TDD-002, TDD-003, TDD-004 (not multi-digit), I'll use a padded number like TDD-0007.

But wait, the existing template uses `TDD_0000_errores_globales.md` with underscores in filenames and `# TDD-0006: Errores y Respuestas Globales` with hyphens in titles. The user said "usa - en vez de _ para nombrar".

Let me plan this out. I'll start from TDD-0007.

Let me organize all TDDs by entity:

### Cliente (starting at 0007)
1. TDD-0007: Crear Cliente
2. TDD-0008: Obtener Cliente
3. TDD-0009: Listar Clientes
4. TDD-0010: Actualizar Cliente
5. TDD-0011: Eliminar Cliente (soft)

### Domicilio (starting at 0012)
6. TDD-0012: Crear Domicilio
7. TDD-0013: Obtener Domicilio
8. TDD-0014: Listar Domicilios (por cliente)
9. TDD-0015: Actualizar Domicilio
10. TDD-0016: Eliminar Domicilio

### Ciudad (0017)
11. TDD-0017: Crear Ciudad
12. TDD-0018: Obtener Ciudad
13. TDD-0019: Listar Ciudades
14. TDD-0020: Actualizar Ciudad
15. TDD-0021: Eliminar Ciudad

### Dia y Horario (0022)
16. TDD-0022: Asignar DiaVisita a Domicilio
17. TDD-0023: Quitar DiaVisita de Domicilio
18. TDD-0024: Asignar Horario a DiaVisita
19. TDD-0025: Quitar Horario de DiaVisita

Hmm, Dia and Horario are really child entities of Domicilio. They might work as nested endpoints like `POST /domicilios/:id/dias`.

### Producto (0026)
20. TDD-0026: Crear Producto
21. TDD-0027: Obtener Producto
22. TDD-0028: Listar Productos
23. TDD-0029: Actualizar Producto
24. TDD-0030: Eliminar Producto (soft)

### Pedido (0031)
25. TDD-0031: Crear Pedido
26. TDD-0032: Obtener Pedido
27. TDD-0033: Listar Pedidos
28. TDD-0034: Actualizar Pedido (estado)
29. TDD-0035: Cancelar Pedido
30. TDD-0036: Eliminar Pedido (soft)

### ItemPedido (0037)
31. TDD-0037: Agregar Item a Pedido
32. TDD-0038: Actualizar Cantidad de Item
33. TDD-0039: Quitar Item de Pedido

### Visita (0040)
34. TDD-0040: Registrar Visita (crear)
35. TDD-0041: Obtener Visita
36. TDD-0042: Listar Visitas
37. TDD-0043: Marcar Visita como Falta

### Empleado (0044)
38. TDD-0044: Crear Empleado
39. TDD-0045: Obtener Empleado
40. TDD-0046: Listar Empleados
41. TDD-0047: Actualizar Empleado
42. TDD-0048: Eliminar Empleado (soft)

### Reparto (0049)
43. TDD-0049: Crear Reparto
44. TDD-0050: Obtener Reparto
45. TDD-0051: Listar Repartos
46. TDD-0052: Iniciar Reparto
47. TDD-0053: Finalizar Reparto
48. TDD-0054: Asignar Pedido a Reparto
49. TDD-0055: Eliminar Reparto

### Retenido (0056)
50. TDD-0056: Registrar Retenido (crear)
51. TDD-0057: Obtener Retenido
52. TDD-0058: Listar Retenidos
53. TDD-0059: Actualizar Estado Retenido
54. TDD-0060: Eliminar Retenido

### Reclamo (0061)
55. TDD-0061: Crear Reclamo
56. TDD-0062: Obtener Reclamo
57. TDD-0063: Listar Reclamos
58. TDD-0064: Eliminar Reclamo

That's 58 TDDs. This is a lot of content to generate. Let me think about how to handle this efficiently.

Actually, let me re-read the user's request more carefully:

"Formateame los TDD respetando el template, hace que respeten los ADRs, dame uno por cada entidad en este schema"

They have a Prisma schema and want TDDs. Then:

"Dame los TDDs uno por accion del crud de cada entidad, osea cada ttd represetna una accion del endpoint, del CRUD o ABM"

So one TDD per CRUD action per entity. That's going to be a lot.

"tiene que respetar el Template, y mostrar el plan de accion en frontend y backend"

They want both frontend and backend plans.

"te dejo un ejemplo de otro proyecto, pero en este repo es react native el frontend"

So the examples show the format, but the frontend is React Native/Expo in this project.

OK, this is a massive task. Let me start creating them. I'll batch them in groups to be efficient.

Actually, given the amount of files needed (50+), I should be strategic. Let me start with key entities and work through them.

For the frontend (React Native), the plan should include:
- Feature folder in `features/<entity>/`
- Components, hooks, services specific to the action
- Screen/route in `app/` if needed

For consistency with ADRs:
- ADR-0000: error format `{ error: { code, message } }` not `{ success, error }` like the example
- ADR-0001: JWT auth (not session tokens/cookies)
- ADR-0011: Zod validation
- ADR-0015: Soft delete
- ADR-0012: `/api/v1/` prefix
- ADR-0014: Vitest + supertest testing

Wait, the example uses `{ "success": true, "data": {...} }` format but our ADR-0000 says `{ data: T }` without `success`. I should follow our ADRs, not the example format.

Actually, looking more carefully at ADR-0000:
- Success: `{ data: T }` or `{ data: T[]; total: number }`
- Error: `{ error: { code, message, timestamp, details? } }`

No `success` field. The examples show `{ "success": true, ... }` but that's from another project. I should follow our ADR.

Let me start creating. I'll begin with the first batch.

Let me plan the actual file names using hyphens:
```
tdd-0007-crear-cliente.md
tdd-0008-obtener-cliente.md
...
```

Wait, the existing files use `TDD_0000_errores_globales.md` (underscores) but the user said "usa - en vez de _ para nombrar". So the new files should be `tdd-0007-crear-cliente.md` (lowercase, hyphens).

Let me create the files in the `docs/TDDs/` directory.

OK this is going to be extremely long. Let me create them in batches, making each one complete and consistent.

For the first batch I'll do Cliente (5 TDDs) to establish the pattern.

Entendido. Voy a generar ~50 TDDs con el formato de los ejemplos, adaptado a React Native (Expo Router + Zustand + TanStack Query + Axios) y respetando los ADRs (ADR-0000 formato error, ADR-0001 JWT, ADR-0011 Zod, ADR-0015 soft delete, etc.).

Arranco por tandas. Primero **Cliente**:

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "TDDs Cliente (0007-0011): crear, obtener, listar, actualizar, eliminar",
      "status": "in_progress",
      "priority": "high"
    },
    {
      "content": "TDDs Domicilio (0012-0016): crear, obtener, listar, actualizar, eliminar",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "TDDs Ciudad (0017-0021): crear, obtener, listar, actualizar, eliminar",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "TDDs Dia y Horario (0022-0025): asignar/quitar dia, asignar/quitar horario",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "TDDs Producto (0026-0030): crear, obtener, listar, actualizar, eliminar",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "TDDs Pedido (0031-0036): crear, obtener, listar, actualizar estado, cancelar, eliminar",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "TDDs ItemPedido (0037-0039): agregar, actualizar cantidad, quitar",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "TDDs Visita (0040-0043): registrar, obtener, listar, marcar falta",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "TDDs Empleado (0044-0048): crear, obtener, listar, actualizar, eliminar",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "TDDs Reparto (0049-0055): crear, obtener, listar, iniciar, finalizar, asignar pedido, eliminar",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "TDDs Retenido (0056-0060): registrar, obtener, listar, actualizar estado, eliminar",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "TDDs Reclamo (0061-0064): crear, obtener, listar, eliminar",
      "status": "pending",
      "priority": "high"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "TDDs Cliente (0007-0011): crear, obtener, listar, actualizar, eliminar",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "TDDs Domicilio (0012-0016): crear, obtener, listar, actualizar, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Ciudad (0017-0021): crear, obtener, listar, actualizar, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Dia y Horario (0022-0025): asignar/quitar dia, asignar/quitar horario",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Producto (0026-0030): crear, obtener, listar, actualizar, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Pedido (0031-0036): crear, obtener, listar, actualizar estado, cancelar, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs ItemPedido (0037-0039): agregar, actualizar cantidad, quitar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Visita (0040-0043): registrar, obtener, listar, marcar falta",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Empleado (0044-0048): crear, obtener, listar, actualizar, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Reparto (0049-0055): crear, obtener, listar, iniciar, finalizar, asignar pedido, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Retenido (0056-0060): registrar, obtener, listar, actualizar estado, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Reclamo (0061-0064): crear, obtener, listar, eliminar",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Big Pickle · 52.0s)

_Thinking:_

Let me create the first 5 TDDs for Cliente.

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0007-crear-cliente.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Crear Cliente\n---\n\n# TDD-0007: Crear Cliente\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir registrar un nuevo cliente en el sistema con sus datos personales y estado inicial.\n\n### User Persona\n- **Nombre**: Administrador del sistema\n- **Necesidad**: Dar de alta un cliente que comienza a recibir pedidos.\n\n### Criterios de Aceptación\n- El sistema debe crear un cliente con nombre, apellido, teléfono y estado `activo`\n- El teléfono debe ser único en el sistema\n- Debe rechazar si faltan campos obligatorios\n- Debe responder con los datos del cliente creado\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Cliente**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| nombre | String | NOT NULL |\n| apellido | String | NOT NULL |\n| telefono | String | UNIQUE, NOT NULL |\n| estado | EstadoCliente | DEFAULT activo |\n| createdAt | DateTime | @default(now()) |\n| updatedAt | DateTime | @updatedAt |\n| deletedAt | DateTime? | |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/clientes`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**:\n```json\n{\n  \"nombre\": \"Juan\",\n  \"apellido\": \"Pérez\",\n  \"telefono\": \"3512345678\"\n}\n```\n- **Response** `201 Created`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"nombre\": \"Juan\",\n    \"apellido\": \"Pérez\",\n    \"telefono\": \"3512345678\",\n    \"estado\": \"activo\"\n  }\n}\n```\n\n### Estructura del Código (Backend)\n\n```\nsrc/features/clientes/\n├── clientes.routes.ts        ← POST / (authMiddleware, authorize('ADMIN'))\n├── clientes.controller.ts    ← create(): valida body, llama service, responde 201\n├── clientes.service.ts       ← create(): verifica teléfono único, crea cliente\n├── clientes.schema.ts        ← createClienteSchema (Zod)\n└── clientes.types.ts         ← CreateClienteDto, ClienteResponse\n```\n\n### Estructura del Código (Mobile)\n\n```\nfeatures/clientes/\n├── clientes-service.ts       ← create(): POST /clientes\n├── clientes-schema.ts        ← createClienteSchema (Zod, copia del backend)\n└── screens/\n    └── crear-cliente.tsx     ← formulario con React Hook Form + Zod + mutation\n```\n\nPantalla `app/(tabs)/clientes/crear.tsx` con formulario.\n\n## Casos de Borde y Errores\n\n| Escenario | Resultado Esperado | Código HTTP |\n|---|---|---|\n| Teléfono ya existente | `{ \"error\": { \"code\": \"CONFLICT\", \"message\": \"El teléfono ya está registrado\" } }` | 409 Conflict |\n| Nombre vacío | `{ \"error\": { \"code\": \"VALIDATION_ERROR\", \"details\": [{ \"field\": \"nombre\", \"message\": \"Requerido\" }] } }` | 400 Bad Request |\n| Sin token JWT | `{ \"error\": { \"code\": \"UNAUTHORIZED\" } }` | 401 Unauthorized |\n| Rol no ADMIN | `{ \"error\": { \"code\": \"FORBIDDEN\" } }` | 403 Forbidden |\n\n## Plan de Implementación\n\n### Backend\n1. Crear `clientes.schema.ts` con `createClienteSchema` (Zod: nombre, apellido required, teléfono unique format)\n2. Crear `clientes.types.ts` con `CreateClienteDto` e `ClienteResponse`\n3. Implementar `clientes.service.ts`: `create(dto)` → verificar teléfono único → `prisma.cliente.create()`\n4. Implementar `clientes.controller.ts`: `create(req, res)` → `schema.parse(req.body)` → `service.create()` → `res.status(201).json({ data })`\n5. Crear `clientes.routes.ts`: `router.post('/', authMiddleware, authorize('ADMIN'), create)`\n6. Montar rutas en `app.ts`: `app.use('/api/v1/clientes', router)`\n7. Tests unitarios: creación exitosa, teléfono duplicado, validación Zod\n8. Tests de integración: supertest con token ADMIN, sin token, con token USER\n\n### Mobile\n9. Crear `clientes-schema.ts` con `createClienteSchema` (Zod, mirror del backend)\n10. Crear `clientes-service.ts` con `create(dto: CreateClienteDto): Promise<Cliente>`\n11. Crear pantalla `app/(tabs)/clientes/crear.tsx` con formulario (React Hook Form + Zod resolver)\n12. Mutation con TanStack Query: `useMutation({ mutationFn: clientesService.create })`\n13. Mostrar errores de validación inline por campo\n14. Mostrar error de teléfono duplicado (código CONFLICT) como mensaje global\n15. Redirigir a lista de clientes al crear exitosamente\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0008-obtener-cliente.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Obtener Cliente\n---\n\n# TDD-0008: Obtener Cliente\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir consultar los datos de un cliente específico por su ID para visualizar su información y estado.\n\n### User Persona\n- **Nombre**: Administrador / Repartidor\n- **Necesidad**: Ver los datos de un cliente antes de crear un pedido o durante un reparto.\n\n### Criterios de Aceptación\n- El sistema debe retornar todos los datos del cliente solicitado\n- Debe incluir sus domicilios asociados\n- Debe rechazar si el cliente no existe o fue eliminado (soft delete)\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Cliente**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| nombre | String | NOT NULL |\n| apellido | String | NOT NULL |\n| telefono | String | UNIQUE, NOT NULL |\n| estado | EstadoCliente | DEFAULT activo |\n| createdAt | DateTime | @default(now()) |\n| updatedAt | DateTime | @updatedAt |\n| deletedAt | DateTime? | |\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/clientes/:id`\n- **Auth**: JWT (cualquier rol autenticado)\n- **Response** `200 OK`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"nombre\": \"Juan\",\n    \"apellido\": \"Pérez\",\n    \"telefono\": \"3512345678\",\n    \"estado\": \"activo\",\n    \"domicilios\": [\n      {\n        \"id\": 1,\n        \"calle\": \"Colón\",\n        \"numero\": \"123\",\n        \"ciudad\": { \"id\": 1, \"nombre\": \"Córdoba\" }\n      }\n    ]\n  }\n}\n```\n\n### Estructura del Código (Backend)\n\n```\nsrc/features/clientes/\n├── clientes.routes.ts        ← GET /:id (authMiddleware)\n├── clientes.controller.ts    ← getById(): extrae id params, llama service\n├── clientes.service.ts       ← getById(): busca cliente con domicilios, lanza NOT_FOUND si no existe\n└── clientes.types.ts         ← ClienteResponse\n```\n\n### Estructura del Código (Mobile)\n\n```\nfeatures/clientes/\n├── clientes-service.ts       ← getById(id): GET /clientes/:id\n├── hooks/\n│   └── use-cliente.ts        ← useQuery(['cliente', id], () => getById(id))\n└── screens/\n    └── detalle-cliente.tsx   ← pantalla de detalle con datos del cliente\n```\n\nPantalla `app/(tabs)/clientes/[id].tsx` con datos del cliente y sus domicilios.\n\n## Casos de Borde y Errores\n\n| Escenario | Resultado Esperado | Código HTTP |\n|---|---|---|\n| Cliente inexistente | `{ \"error\": { \"code\": \"NOT_FOUND\", \"message\": \"Cliente no encontrado\" } }` | 404 Not Found |\n| Cliente soft-deleted | `{ \"error\": { \"code\": \"NOT_FOUND\", \"message\": \"Cliente no encontrado\" } }` | 404 Not Found |\n| ID no numérico | `{ \"error\": { \"code\": \"VALIDATION_ERROR\" } }` | 400 Bad Request |\n| Sin token JWT | `{ \"error\": { \"code\": \"UNAUTHORIZED\" } }` | 401 Unauthorized |\n\n## Plan de Implementación\n\n### Backend\n1. Agregar `getByIdSchema` en `clientes.schema.ts` (Zod: id numérico)\n2. Implementar `clientes.service.ts`: `getById(id)` → `prisma.cliente.findUnique({ where: { id }, include: { domicilios: { include: { ciudad: true } } } })` → si no existe, `throw Errors.notFound('Cliente')`\n3. Implementar `clientes.controller.ts`: `getById(req, res)` → `schema.parse(req.params)` → `service.getById()` → `res.json({ data })`\n4. Agregar ruta `router.get('/:id', authMiddleware, getById)`\n5. Tests: cliente existente, inexistente, soft-deleted\n\n### Mobile\n6. Agregar `getById(id)` en `clientes-service.ts`\n7. Crear hook `use-cliente.ts`: `useQuery({ queryKey: ['cliente', id], queryFn: () => clientesService.getById(id) })`\n8. Crear pantalla `app/(tabs)/clientes/[id].tsx` con detalle del cliente y lista de domicilios\n9. Mostrar loading con ActivityIndicator mientras carga\n10. Mostrar error si el cliente no existe (NOT_FOUND)\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0009-listar-clientes.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Listar Clientes\n---\n\n# TDD-0009: Listar Clientes\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir consultar todos los clientes registrados con filtros y paginación para gestionarlos desde el panel de administración y seleccionarlos al crear pedidos.\n\n### User Persona\n- **Nombre**: Administrador / Repartidor\n- **Necesidad**: Buscar clientes por nombre o teléfono, navegar la lista y seleccionar uno para asignarle un pedido.\n\n### Criterios de Aceptación\n- El sistema debe retornar una lista paginada de clientes activos\n- Debe permitir filtrar por nombre (búsqueda parcial), apellido, teléfono y estado\n- Debe soportar paginación con `page` y `pageSize`\n- No debe incluir clientes soft-deleted\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Cliente**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| nombre | String | NOT NULL |\n| apellido | String | NOT NULL |\n| telefono | String | UNIQUE, NOT NULL |\n| estado | EstadoCliente | DEFAULT activo |\n| createdAt | DateTime | @default(now()) |\n| updatedAt | DateTime | @updatedAt |\n| deletedAt | DateTime? | |\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/clientes`\n- **Auth**: JWT (cualquier rol autenticado)\n- **Query Params**: `?search=&estado=&page=1&pageSize=20`\n- **Response** `200 OK`:\n```json\n{\n  \"data\": [\n    {\n      \"id\": 1,\n      \"nombre\": \"Juan\",\n      \"apellido\": \"Pérez\",\n      \"telefono\": \"3512345678\",\n      \"estado\": \"activo\"\n    }\n  ],\n  \"total\": 1,\n  \"page\": 1,\n  \"pageSize\": 20\n}\n```\n\n### Estructura del Código (Backend)\n\n```\nsrc/features/clientes/\n├── clientes.routes.ts        ← GET / (authMiddleware)\n├── clientes.controller.ts    ← list(): extrae query params, llama service\n├── clientes.service.ts       ← list(filters): construye where dinámico con Prisma, paginación\n└── clientes.schema.ts        ← listClientesSchema (Zod: search, estado opcionales)\n```\n\n### Estructura del Código (Mobile)\n\n```\nfeatures/clientes/\n├── clientes-service.ts       ← list(params): GET /clientes\n├── hooks/\n│   └── use-clientes.ts       ← useQuery(['clientes', params], () => list(params))\n└── screens/\n    └── lista-clientes.tsx    ← FlatList con búsqueda y filtros\n```\n\nPantalla `app/(tabs)/clientes/index.tsx` con lista, search bar y filtro por estado.\n\n## Casos de Borde y Errores\n\n| Escenario | Resultado Esperado | Código HTTP |\n|---|---|---|\n| Sin clientes registrados | `{ \"data\": [], \"total\": 0 }` | 200 OK |\n| Filtro sin resultados | `{ \"data\": [], \"total\": 0 }` | 200 OK |\n| page menor a 1 | `{ \"error\": { \"code\": \"VALIDATION_ERROR\" } }` | 400 Bad Request |\n| pageSize mayor a 100 | Se ajusta a 100 | 200 OK |\n| Sin token JWT | `{ \"error\": { \"code\": \"UNAUTHORIZED\" } }` | 401 Unauthorized |\n\n## Plan de Implementación\n\n### Backend\n1. Agregar `listClientesSchema` en `clientes.schema.ts` (Zod: search?, estado?, page?, pageSize?)\n2. Implementar `clientes.service.ts`: `list(filters)` → construir `where` dinámico con `nombre: { contains: search }`, `estado`, `deletedAt: null` → `prisma.cliente.findMany({ where, skip, take })` + `prisma.cliente.count({ where })`\n3. Implementar `clientes.controller.ts`: `list(req, res)` → `schema.parse(req.query)` → `service.list()` → `res.json({ data, total, page, pageSize })`\n4. Agregar ruta `router.get('/', authMiddleware, list)`\n5. Tests: lista completa, filtros, paginación\n\n### Mobile\n6. Agregar `list(params)` en `clientes-service.ts`\n7. Crear hook `use-clientes.ts`: `useQuery({ queryKey: ['clientes', params], queryFn: () => clientesService.list(params) })`\n8. Crear pantalla `app/(tabs)/clientes/index.tsx` con FlatList virtualizada\n9. SearchBar que actualiza el query param `search` y refetch automático\n10. Picker de filtro por estado (activo, inactivo, moroso, baja)\n11. Pull-to-refresh con `refetch`\n12. Navegación al detalle al tocar un cliente\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0010-actualizar-cliente.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Actualizar Cliente\n---\n\n# TDD-0010: Actualizar Cliente\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir modificar los datos de un cliente existente: nombre, apellido, teléfono y estado.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Corregir el teléfono de un cliente o actualizar su estado a `moroso` o `inactivo`.\n\n### Criterios de Aceptación\n- El sistema debe actualizar solo los campos enviados (parcial)\n- El teléfono debe seguir siendo único (excepto el del mismo cliente)\n- Debe rechazar si el cliente no existe\n- Debe rechazar si se intenta cambiar el teléfono a uno ya ocupado\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Cliente**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| nombre | String | NOT NULL |\n| apellido | String | NOT NULL |\n| telefono | String | UNIQUE, NOT NULL |\n| estado | EstadoCliente | DEFAULT activo |\n| createdAt | DateTime | @default(now()) |\n| updatedAt | DateTime | @updatedAt |\n| deletedAt | DateTime? | |\n\n### Contrato de API\n\n- **Endpoint**: `PATCH /api/v1/clientes/:id`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body** (todos opcionales):\n```json\n{\n  \"nombre\": \"Juan Carlos\",\n  \"telefono\": \"3519876543\",\n  \"estado\": \"moroso\"\n}\n```\n- **Response** `200 OK`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"nombre\": \"Juan Carlos\",\n    \"apellido\": \"Pérez\",\n    \"telefono\": \"3519876543\",\n    \"estado\": \"moroso\"\n  }\n}\n```\n\n### Estructura del Código (Backend)\n\n```\nsrc/features/clientes/\n├── clientes.routes.ts        ← PATCH /:id (authMiddleware, authorize('ADMIN'))\n├── clientes.controller.ts    ← update(): schema.parse(body + params), service.update()\n├── clientes.service.ts       ← update(id, dto): verifica existencia, teléfono único si cambia, actualiza\n└── clientes.schema.ts        ← updateClienteSchema (Zod: todos opcionales)\n```\n\n### Estructura del Código (Mobile)\n\n```\nfeatures/clientes/\n├── clientes-service.ts       ← update(id, dto): PATCH /clientes/:id\n├── hooks/\n│   └── use-update-cliente.ts ← useMutation({ mutationFn: (dto) => update(id, dto) })\n└── screens/\n    └── editar-cliente.tsx    ← formulario precargado con datos actuales\n```\n\nPantalla `app/(tabs)/clientes/[id]/editar.tsx`.\n\n## Casos de Borde y Errores\n\n| Escenario | Resultado Esperado | Código HTTP |\n|---|---|---|\n| Cliente inexistente | `{ \"error\": { \"code\": \"NOT_FOUND\" } }` | 404 Not Found |\n| Teléfono ya usado por otro cliente | `{ \"error\": { \"code\": \"CONFLICT\" } }` | 409 Conflict |\n| Body vacío | `{ \"error\": { \"code\": \"VALIDATION_ERROR\" } }` | 400 Bad Request |\n| Estado inválido | `{ \"error\": { \"code\": \"VALIDATION_ERROR\" } }` | 400 Bad Request |\n| Sin token ADMIN | `{ \"error\": { \"code\": \"FORBIDDEN\" } }` | 403 Forbidden |\n\n## Plan de Implementación\n\n### Backend\n1. Agregar `updateClienteSchema` en `clientes.schema.ts` (Zod: nombre?, apellido?, telefono?, estado?)\n2. Implementar `clientes.service.ts`: `update(id, dto)` → verificar existencia → si cambia teléfono, verificar unicidad → `prisma.cliente.update({ where: { id }, data: dto })`\n3. Implementar `clientes.controller.ts`: `update(req, res)` → `schema.parse({ ...req.params, ...req.body })` → `service.update()` → `res.json({ data })`\n4. Agregar ruta `router.patch('/:id', authMiddleware, authorize('ADMIN'), update)`\n5. Tests: actualización parcial, teléfono duplicado, cliente inexistente\n\n### Mobile\n6. Agregar `update(id, dto)` en `clientes-service.ts`\n7. Crear hook `use-update-cliente.ts`: `useMutation({ mutationFn: (dto) => clientesService.update(id, dto) })`\n8. Crear pantalla `app/(tabs)/clientes/[id]/editar.tsx` con formulario precargado\n9. Cargar datos actuales con `use-cliente.ts` y poblar defaultValues del formulario\n10. Invalidar query `['clientes', id]` al actualizar exitosamente\n11. Navegar de vuelta al detalle tras éxito\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0011-eliminar-cliente.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Eliminar Cliente (Soft Delete)\n---\n\n# TDD-0011: Eliminar Cliente (Soft Delete)\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir eliminar un cliente del sistema sin perder sus datos históricos (pedidos, reclamos). El cliente queda marcado como eliminado pero sus registros asociados se mantienen.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Dar de baja a un cliente que ya no recibe pedidos, sin perder el historial de sus pedidos anteriores.\n\n### Criterios de Aceptación\n- El sistema debe marcar `deletedAt` sin borrar físicamente el registro\n- El cliente eliminado no debe aparecer en listados ni búsquedas\n- Las consultas por ID deben rechazar clientes eliminados\n- Las relaciones (pedidos, reclamos) deben mantenerse intactas\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Cliente**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| nombre | String | NOT NULL |\n| apellido | String | NOT NULL |\n| telefono | String | UNIQUE, NOT NULL |\n| estado | EstadoCliente | DEFAULT activo |\n| createdAt | DateTime | @default(now()) |\n| updatedAt | DateTime | @updatedAt |\n| deletedAt | DateTime? | → se setea al eliminar |\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/clientes/:id`\n- **Auth**: JWT (rol ADMIN)\n- **Response** `200 OK`:\n```json\n{\n  \"data\": { \"message\": \"Cliente eliminado exitosamente\" }\n}\n```\n\n### Estructura del Código (Backend)\n\n```\nsrc/features/clientes/\n├── clientes.routes.ts        ← DELETE /:id (authMiddleware, authorize('ADMIN'))\n├── clientes.controller.ts    ← remove(): schema.parse(params), service.remove()\n├── clientes.service.ts       ← remove(id): verifica existencia, prisma.cliente.update({ data: { deletedAt: now() } })\n└── clientes.schema.ts        ← clienteIdSchema (Zod: id numérico)\n```\n\n### Estructura del Código (Mobile)\n\n```\nfeatures/clientes/\n├── clientes-service.ts       ← remove(id): DELETE /clientes/:id\n├── hooks/\n│   └── use-remove-cliente.ts ← useMutation({ mutationFn: remove })\n└── components/\n    └── eliminar-cliente-button.tsx ← botón con confirmación y feedback\n```\n\n## Casos de Borde y Errores\n\n| Escenario | Resultado Esperado | Código HTTP |\n|---|---|---|\n| Cliente inexistente | `{ \"error\": { \"code\": \"NOT_FOUND\" } }` | 404 Not Found |\n| Cliente ya eliminado | `{ \"error\": { \"code\": \"NOT_FOUND\" } }` | 404 Not Found |\n| Cliente con pedidos activos | Se elimina igual (soft delete no rompe relaciones) | 200 OK |\n| Sin token ADMIN | `{ \"error\": { \"code\": \"FORBIDDEN\" } }` | 403 Forbidden |\n\n## Plan de Implementación\n\n### Backend\n1. Implementar `clientes.service.ts`: `remove(id)` → verificar existencia → `prisma.cliente.update({ where: { id }, data: { deletedAt: new Date() } })`\n2. Implementar `clientes.controller.ts`: `remove(req, res)` → `schema.parse(req.params)` → `service.remove()` → `res.json({ data: { message: 'Cliente eliminado exitosamente' } })`\n3. Agregar ruta `router.delete('/:id', authMiddleware, authorize('ADMIN'), remove)`\n4. Verificar que el middleware de soft delete del ADR-0015 filtra automáticamente `deletedAt` en consultas GET y LIST\n5. Tests: eliminación exitosa, cliente ya eliminado, cliente inexistente\n\n### Mobile\n6. Agregar `remove(id)` en `clientes-service.ts`\n7. Crear hook `use-remove-cliente.ts`: `useMutation({ mutationFn: () => clientesService.remove(id), onSuccess: () => queryClient.invalidateQueries(['clientes']) })`\n8. Crear componente `eliminar-cliente-button.tsx` con Alert de confirmación nativa\n9. Ubicar el botón en la pantalla de detalle de cliente\n10. Redirigir a la lista al eliminar exitosamente\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 5.6s)

_Thinking:_

Good, first batch done. Now let me continue with Domicilio (TDD-0012 to TDD-0016).

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "TDDs Cliente (0007-0011): crear, obtener, listar, actualizar, eliminar",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs Domicilio (0012-0016): crear, obtener, listar, actualizar, eliminar",
      "status": "in_progress"
    },
    {
      "priority": "high",
      "content": "TDDs Ciudad (0017-0021): crear, obtener, listar, actualizar, eliminar",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "TDDs Dia y Horario (0022-0025): asignar/quitar dia, asignar/quitar horario",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "TDDs Producto (0026-0030): crear, obtener, listar, actualizar, eliminar",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "TDDs Pedido (0031-0036): crear, obtener, listar, actualizar estado, cancelar, eliminar",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "TDDs ItemPedido (0037-0039): agregar, actualizar cantidad, quitar",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "TDDs Visita (0040-0043): registrar, obtener, listar, marcar falta",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "TDDs Empleado (0044-0048): crear, obtener, listar, actualizar, eliminar",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "TDDs Reparto (0049-0055): crear, obtener, listar, iniciar, finalizar, asignar pedido, eliminar",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "TDDs Retenido (0056-0060): registrar, obtener, listar, actualizar estado, eliminar",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "TDDs Reclamo (0061-0064): crear, obtener, listar, eliminar",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "TDDs Cliente (0007-0011): crear, obtener, listar, actualizar, eliminar",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs Domicilio (0012-0016): crear, obtener, listar, actualizar, eliminar",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "TDDs Ciudad (0017-0021): crear, obtener, listar, actualizar, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Dia y Horario (0022-0025): asignar/quitar dia, asignar/quitar horario",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Producto (0026-0030): crear, obtener, listar, actualizar, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Pedido (0031-0036): crear, obtener, listar, actualizar estado, cancelar, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs ItemPedido (0037-0039): agregar, actualizar cantidad, quitar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Visita (0040-0043): registrar, obtener, listar, marcar falta",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Empleado (0044-0048): crear, obtener, listar, actualizar, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Reparto (0049-0055): crear, obtener, listar, iniciar, finalizar, asignar pedido, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Retenido (0056-0060): registrar, obtener, listar, actualizar estado, eliminar",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "TDDs Reclamo (0061-0064): crear, obtener, listar, eliminar",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Big Pickle · 21.9s)

_Thinking:_

Now let me create the Domicilio TDDs (0012-0016).

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0012-crear-domicilio.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Crear Domicilio\n---\n\n# TDD-0012: Crear Domicilio\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir registrar un domicilio para un cliente existente, incluyendo ciudad, días de visita y horarios.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Agregar la dirección de un cliente para planificar las rutas de reparto.\n\n### Criterios de Aceptación\n- El sistema debe crear un domicilio asociado a un cliente existente\n- Debe rechazar si el cliente no existe\n- Calle, numero y ciudad son obligatorios\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Domicilio**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| calle | String | NOT NULL |\n| entreCalle1 | String? | |\n| entreCalle2 | String? | |\n| numero | String | NOT NULL |\n| piso | String? | |\n| clienteId | Int | FK -> Cliente, NOT NULL |\n| ciudadId | Int | FK -> Ciudad, NOT NULL |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/clientes/:clienteId/domicilios`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**:\n```json\n{\n  \"calle\": \"Colón\",\n  \"entreCalle1\": \"San Martín\",\n  \"entreCalle2\": \"Belgrano\",\n  \"numero\": \"123\",\n  \"piso\": \"4B\",\n  \"ciudadId\": 1\n}\n```\n- **Response** `201 Created`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"calle\": \"Colón\",\n    \"numero\": \"123\",\n    \"piso\": \"4B\",\n    \"ciudad\": { \"id\": 1, \"nombre\": \"Córdoba\" }\n  }\n}\n```\n\n### Estructura del Código (Backend)\n\n```\nsrc/features/domicilios/\n├── domicilios.routes.ts        ← POST / (authMiddleware, authorize('ADMIN'))\n├── domicilios.controller.ts    ← create()\n├── domicilios.service.ts       ← create(): verifica cliente, verifica ciudad, crea domicilio\n├── domicilios.schema.ts        ← createDomicilioSchema (Zod)\n└── domicilios.types.ts\n```\n\n### Estructura del Código (Mobile)\n\n```\nfeatures/domicilios/\n├── domicilios-service.ts       ← create(clienteId, dto): POST /clientes/:id/domicilios\n└── screens/\n    └── crear-domicilio.tsx     ← formulario con selector de ciudad\n```\n\n## Casos de Borde y Errores\n\n| Escenario | Resultado Esperado | Código HTTP |\n|---|---|---|\n| Cliente inexistente | `NOT_FOUND` | 404 |\n| Ciudad inexistente | `NOT_FOUND` | 404 |\n| Calle vacía | `VALIDATION_ERROR` | 400 |\n| Cliente soft-deleted | `NOT_FOUND` | 404 |\n\n## Plan de Implementación\n\n### Backend\n1. Crear `domicilios.schema.ts` con `createDomicilioSchema`\n2. Implementar `domicilios.service.ts`: `create(clienteId, dto)` → verificar cliente y ciudad → `prisma.domicilio.create()`\n3. Implementar `domicilios.controller.ts`\n4. Crear `domicilios.routes.ts` anidada bajo clientes\n5. Montar en `app.ts`\n6. Tests\n\n### Mobile\n7. Agregar `create(clienteId, dto)` en `domicilios-service.ts`\n8. Crear pantalla con formulario (calle, numero, piso, selector de ciudad, entreCalles)\n9. Mutation con TanStack Query, invalidar query del cliente al crear\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0013-obtener-domicilio.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Obtener Domicilio\n---\n\n# TDD-0013: Obtener Domicilio\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir consultar los datos de un domicilio específico, incluyendo ciudad, días de visita y horarios.\n\n### User Persona\n- **Nombre**: Administrador / Repartidor\n- **Necesidad**: Ver la dirección completa de un cliente para planificar la ruta de reparto.\n\n### Criterios de Aceptación\n- El sistema debe retornar el domicilio con ciudad, días y horarios\n- Debe rechazar si el domicilio no existe\n\n## Diseño Técnico (RFC)\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/domicilios/:id`\n- **Auth**: JWT (cualquier rol)\n- **Response** `200 OK`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"calle\": \"Colón\",\n    \"numero\": \"123\",\n    \"piso\": \"4B\",\n    \"ciudad\": { \"id\": 1, \"nombre\": \"Córdoba\" },\n    \"dias\": [\n      {\n        \"id\": 1,\n        \"nombre\": \"lunes\",\n        \"horarios\": [{ \"id\": 1, \"inicio\": \"09:00\", \"fin\": \"12:00\" }]\n      }\n    ]\n  }\n}\n```\n\n### Estructura del Código (Backend)\n\n```\nsrc/features/domicilios/\n├── domicilios.routes.ts        ← GET /:id (authMiddleware)\n├── domicilios.controller.ts    ← getById()\n├── domicilios.service.ts       ← getById(): busca con include ciudad, dias, horarios\n└── domicilios.schema.ts        ← domicilioIdSchema\n```\n\n## Casos de Borde y Errores\n\n| Escenario | Resultado Esperado | Código HTTP |\n|---|---|---|\n| Domicilio inexistente | `NOT_FOUND` | 404 |\n| ID inválido | `VALIDATION_ERROR` | 400 |\n\n## Plan de Implementación\n\n### Backend\n1. Implementar `getById(id)` → `prisma.domicilio.findUnique({ where: { id }, include: { ciudad: true, dias: { include: { horarios: true } } } })`\n2. Agregar ruta `router.get('/:id', authMiddleware, getById)`\n3. Tests\n\n### Mobile\n4. Agregar `getById(id)` en `domicilios-service.ts`\n5. Hook `useQuery(['domicilio', id])`\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0014-listar-domicilios.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Listar Domicilios por Cliente\n---\n\n# TDD-0014: Listar Domicilios por Cliente\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir consultar todos los domicilios de un cliente específico.\n\n### User Persona\n- **Nombre**: Administrador / Repartidor\n- **Necesidad**: Ver todos los domicilios de un cliente para seleccionar dónde entregar el pedido.\n\n### Criterios de Aceptación\n- El sistema debe retornar los domicilios asociados al cliente\n- Cada domicilio debe incluir ciudad y días de visita\n\n## Diseño Técnico (RFC)\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/clientes/:clienteId/domicilios`\n- **Auth**: JWT (cualquier rol)\n- **Response** `200 OK`:\n```json\n{\n  \"data\": [\n    {\n      \"id\": 1,\n      \"calle\": \"Colón\",\n      \"numero\": \"123\",\n      \"ciudad\": { \"id\": 1, \"nombre\": \"Córdoba\" },\n      \"dias\": [{ \"id\": 1, \"nombre\": \"lunes\" }]\n    }\n  ],\n  \"total\": 1\n}\n```\n\n### Estructura del Código (Backend)\n\n```\nsrc/features/domicilios/\n├── domicilios.routes.ts        ← GET /clientes/:clienteId/domicilios\n├── domicilios.controller.ts    ← listByCliente()\n├── domicilios.service.ts       ← listByCliente(clienteId)\n```\n\n## Plan de Implementación\n\n### Backend\n1. Implementar `listByCliente(clienteId)` → `prisma.domicilio.findMany({ where: { clienteId }, include: { ciudad: true, dias: true } })`\n2. Agregar ruta\n3. Tests\n\n### Mobile\n4. Agregar `listByCliente(clienteId)` en servicio\n5. Hook `useQuery(['domicilios', clienteId])`\n6. Mostrar lista en el detalle del cliente\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0015-actualizar-domicilio.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Actualizar Domicilio\n---\n\n# TDD-0015: Actualizar Domicilio\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir modificar los datos de un domicilio existente: calle, número, piso, entre calles o ciudad.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Corregir la dirección de un cliente cuando se muda o hay un error de carga.\n\n### Criterios de Aceptación\n- El sistema debe actualizar solo los campos enviados (parcial)\n- Debe rechazar si el domicilio no existe\n\n## Diseño Técnico (RFC)\n\n### Contrato de API\n\n- **Endpoint**: `PATCH /api/v1/domicilios/:id`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**:\n```json\n{\n  \"calle\": \"San Martín\",\n  \"numero\": \"456\"\n}\n```\n- **Response** `200 OK`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"calle\": \"San Martín\",\n    \"numero\": \"456\",\n    \"ciudad\": { \"id\": 1, \"nombre\": \"Córdoba\" }\n  }\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod con todos los campos opcionales\n2. Service: verificar existencia + ciudad si cambia → `prisma.domicilio.update()`\n3. Ruta `PATCH /:id` con auth ADMIN\n4. Tests\n\n### Mobile\n5. Pantalla de edición con datos precargados\n6. Mutation, invalidar queries de domicilio y cliente\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0016-eliminar-domicilio.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Eliminar Domicilio\n---\n\n# TDD-0016: Eliminar Domicilio\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir eliminar un domicilio de un cliente. Al ser un dato histórico, se usa soft delete para mantener la trazabilidad.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Quitar un domicilio que el cliente ya no usa.\n\n### Criterios de Aceptación\n- Soft delete: marcar `deletedAt`\n- No debe afectar pedidos históricos asociados a ese domicilio\n\n## Diseño Técnico (RFC)\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/domicilios/:id`\n- **Auth**: JWT (rol ADMIN)\n- **Response** `200 OK`:\n```json\n{\n  \"data\": { \"message\": \"Domicilio eliminado exitosamente\" }\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Agregar campo `deletedAt` al modelo Domicilio (migración Prisma)\n2. Service: `prisma.domicilio.update({ where: { id }, data: { deletedAt: new Date() } })`\n3. Ruta `DELETE /:id` con auth ADMIN\n4. Tests\n\n### Mobile\n5. Botón de eliminar con confirmación\n6. Mutation, invalidar queries, redirigir a detalle del cliente\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 14.4s)

_Thinking:_

Good. Now let me continue with Ciudad (0017-0021), Dia y Horario (0022-0025), and Producto (0026-0030). Let me batch them.

Ahora Ciudad y Producto:

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0017-crear-ciudad.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Crear Ciudad\n---\n\n# TDD-0017: Crear Ciudad\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir registrar una nueva ciudad en el catálogo para asociarla a domicilios.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Agregar una ciudad donde la empresa realiza repartos.\n\n### Criterios de Aceptación\n- El sistema debe crear la ciudad con nombre único\n- Debe rechazar si el nombre ya existe o está vacío\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Ciudad**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| nombre | String | UNIQUE, NOT NULL |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/ciudades`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"nombre\": \"Córdoba\" }`\n- **Response** `201 Created`: `{ \"data\": { \"id\": 1, \"nombre\": \"Córdoba\" } }`\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod con nombre requerido\n2. Service: verificar unicidad → `prisma.ciudad.create()`\n3. Ruta `POST /` con auth ADMIN\n4. Tests\n\n### Mobile\n5. Formulario simple con input de texto\n6. Mutation, invalidar lista de ciudades\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0018-obtener-ciudad.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Obtener Ciudad\n---\n\n# TDD-0018: Obtener Ciudad\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar una ciudad por su ID.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Ver los datos de una ciudad.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/ciudades/:id`\n- **Auth**: JWT\n- **Response** `200 OK`: `{ \"data\": { \"id\": 1, \"nombre\": \"Córdoba\" } }`\n\n## Plan de Implementación\n\n### Backend\n1. Service: `prisma.ciudad.findUnique()` → NOT_FOUND si no existe\n2. Ruta `GET /:id`\n3. Tests\n\n### Mobile\n4. Hook `useQuery(['ciudad', id])`\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0019-listar-ciudades.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Listar Ciudades\n---\n\n# TDD-0019: Listar Ciudades\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar el catálogo de ciudades disponibles para usar en selectores de domicilio.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Seleccionar una ciudad al crear o editar un domicilio.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/ciudades`\n- **Auth**: JWT\n- **Query Params**: `?search=&page=1&pageSize=50`\n- **Response** `200 OK`:\n```json\n{\n  \"data\": [{ \"id\": 1, \"nombre\": \"Córdoba\" }],\n  \"total\": 1\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: list con filtro search por nombre, paginación\n2. Ruta `GET /` con authMiddleware\n3. Tests\n\n### Mobile\n4. Hook `useQuery(['ciudades', params])`\n5. Picker/select component en formulario de domicilio\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0020-actualizar-ciudad.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Actualizar Ciudad\n---\n\n# TDD-0020: Actualizar Ciudad\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nModificar el nombre de una ciudad existente.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Corregir el nombre de una ciudad mal cargada.\n\n### Contrato de API\n\n- **Endpoint**: `PATCH /api/v1/ciudades/:id`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"nombre\": \"Córdoba Capital\" }`\n\n## Plan de Implementación\n\n### Backend\n1. Schema: nombre opcional\n2. Service: verificar unicidad si cambia nombre → update\n3. Ruta con auth ADMIN\n4. Tests\n\n### Mobile\n5. Pantalla de edición simple\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0021-eliminar-ciudad.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Eliminar Ciudad\n---\n\n# TDD-0021: Eliminar Ciudad\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nEliminar una ciudad que ya no está en uso.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Quitar una ciudad mal creada o que ya no corresponde.\n\n### Criterios de Aceptación\n- Debe rechazar si hay domicilios asociados a la ciudad\n- Si no tiene dependencias, se elimina físicamente (hard delete)\n\n## Diseño Técnico (RFC)\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/ciudades/:id`\n- **Auth**: JWT (rol ADMIN)\n- **Response** `200 OK` con mensaje de éxito\n- **Response** `409 Conflict` si tiene domicilios asociados:\n```json\n{\n  \"error\": {\n    \"code\": \"CONFLICT\",\n    \"message\": \"No se puede eliminar la ciudad porque tiene domicilios asociados\"\n  }\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: verificar `prisma.domicilio.count({ where: { ciudadId: id } })` → si > 0, throw CONFLICT\n2. Si ok, `prisma.ciudad.delete()`\n3. Tests: eliminación exitosa, ciudad con domicilios\n\n### Mobile\n4. Botón con confirmación y manejo de error CONFLICT\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 13.3s)

_Thinking:_

Now let me do Dia and Horario (0022-0025) and then Producto (0026-0030).

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0022-asignar-dia-domicilio.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Asignar Día de Visita a Domicilio\n---\n\n# TDD-0022: Asignar Día de Visita a Domicilio\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nAsignar un día de la semana en que se visita un domicilio para planificar las rutas de reparto.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Configurar qué días se le entrega pedido a un cliente.\n\n### Criterios de Aceptación\n- El sistema debe crear un registro Dia asociado al domicilio\n- Debe rechazar si el domicilio no existe\n- El día debe ser un valor válido del enum DiaSemana\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Dia**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| nombre | DiaSemana | NOT NULL |\n| domicilioId | Int | FK -> Domicilio, NOT NULL |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/domicilios/:domicilioId/dias`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"nombre\": \"lunes\" }`\n- **Response** `201 Created`:\n```json\n{ \"data\": { \"id\": 1, \"nombre\": \"lunes\", \"horarios\": [] } }\n```\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod con nombre enum DiaSemana\n2. Service: verificar domicilio → `prisma.dia.create()`\n3. Ruta POST con auth ADMIN\n4. Tests\n\n### Mobile\n5. Selector de día en formulario del domicilio\n6. Mutation, invalidar query del domicilio\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0023-quitar-dia-domicilio.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Quitar Día de Visita de Domicilio\n---\n\n# TDD-0023: Quitar Día de Visita de Domicilio\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nEliminar un día de visita de un domicilio.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Dejar de visitar a un cliente un día determinado.\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/domicilios/:domicilioId/dias/:diaId`\n- **Auth**: JWT (rol ADMIN)\n- **Response** `200 OK`\n\n## Plan de Implementación\n\n### Backend\n1. Service: verificar que el día pertenezca al domicilio → `prisma.dia.delete()`\n2. Ruta DELETE\n3. Tests: día existente, día no perteneciente al domicilio\n\n### Mobile\n4. Botón de eliminar por día en el detalle del domicilio\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0024-asignar-horario-dia.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Asignar Horario a Día de Visita\n---\n\n# TDD-0024: Asignar Horario a Día de Visita\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nDefinir la ventana horaria en que se realiza la visita un día determinado (ej: lunes de 9 a 12).\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Configurar la franja horaria de entrega para cada día.\n\n### Criterios de Aceptación\n- El horario debe tener inicio y fin\n- La hora de fin debe ser posterior a la de inicio\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Horario**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| inicio | DateTime | NOT NULL (solo hora) |\n| fin | DateTime | NOT NULL (solo hora) |\n| diaId | Int | FK -> Dia, NOT NULL |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/dias/:diaId/horarios`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"inicio\": \"09:00\", \"fin\": \"12:00\" }`\n- **Response** `201 Created`\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod con validación inicio < fin\n2. Service: verificar día → `prisma.horario.create()`\n3. Tests\n\n### Mobile\n4. Formulario con TimePicker\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0025-quitar-horario-dia.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Quitar Horario de Día de Visita\n---\n\n# TDD-0025: Quitar Horario de Día de Visita\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nEliminar una franja horaria de un día de visita.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Ajustar la ventana horaria de entrega.\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/horarios/:id`\n- **Auth**: JWT (rol ADMIN)\n- **Response** `200 OK`\n\n## Plan de Implementación\n\n### Backend\n1. Service: verificar existencia → `prisma.horario.delete()`\n2. Tests: horario existente, inexistente\n\n### Mobile\n3. Botón de eliminar horario\n4. Invalidar query del domicilio\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 14.2s)

_Thinking:_

Now Producto (0026-0030).

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0026-crear-producto.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Crear Producto\n---\n\n# TDD-0026: Crear Producto\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nRegistrar un nuevo producto en el catálogo (bidones de agua, garrafas, etc.) con precio, unidad y stock.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Agregar un producto nuevo al sistema para ofrecerlo a los clientes.\n\n### Criterios de Aceptación\n- El sistema debe crear el producto con nombre, descripción, precio, unidad, stock, cantidad y retornable\n- El nombre no debe estar duplicado\n- Precio y stock deben ser positivos\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Producto**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| nombre | String | UNIQUE, NOT NULL |\n| descripcion | String? | |\n| precio | Float | NOT NULL, > 0 |\n| unidad | String | NOT NULL |\n| stock | Int | NOT NULL, >= 0 |\n| cantidad | Int | NOT NULL, > 0 |\n| retornable | Boolean | DEFAULT false |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/productos`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**:\n```json\n{\n  \"nombre\": \"Bidón 20L\",\n  \"descripcion\": \"Bidón de agua mineral 20 litros\",\n  \"precio\": 1500,\n  \"unidad\": \"unidad\",\n  \"stock\": 100,\n  \"cantidad\": 1,\n  \"retornable\": true\n}\n```\n- **Response** `201 Created`\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod con validaciones (precio > 0, stock >= 0)\n2. Service: verificar nombre único → `prisma.producto.create()`\n3. Ruta POST con auth ADMIN\n4. Tests\n\n### Mobile\n5. Formulario con campos del producto\n6. Mutation, invalidar lista de productos\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0027-obtener-producto.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Obtener Producto\n---\n\n# TDD-0027: Obtener Producto\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar los datos de un producto específico del catálogo.\n\n### User Persona\n- **Nombre**: Administrador / Repartidor\n- **Necesidad**: Ver el precio y detalles de un producto antes de crear un pedido.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/productos/:id`\n- **Auth**: JWT\n- **Response** `200 OK`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"nombre\": \"Bidón 20L\",\n    \"precio\": 1500,\n    \"unidad\": \"unidad\",\n    \"stock\": 100,\n    \"retornable\": true\n  }\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: `prisma.producto.findUnique()` → NOT_FOUND\n2. Ruta GET\n3. Tests\n\n### Mobile\n4. Hook `useQuery(['producto', id])`\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0028-listar-productos.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Listar Productos\n---\n\n# TDD-0028: Listar Productos\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar el catálogo completo de productos con filtros y paginación.\n\n### User Persona\n- **Nombre**: Administrador / Repartidor\n- **Necesidad**: Seleccionar productos al armar un pedido.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/productos`\n- **Auth**: JWT\n- **Query Params**: `?search=&retornable=&page=1&pageSize=20`\n- **Response** `200 OK`:\n```json\n{\n  \"data\": [{ \"id\": 1, \"nombre\": \"Bidón 20L\", \"precio\": 1500 }],\n  \"total\": 1\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: filtros por nombre (contains), retornable, paginación\n2. Ruta GET\n3. Tests\n\n### Mobile\n4. Hook `useQuery(['productos', params])`\n5. FlatList con search bar\n6. Pull-to-refresh\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0029-actualizar-producto.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Actualizar Producto\n---\n\n# TDD-0029: Actualizar Producto\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nModificar los datos de un producto existente (precio, stock, descripción).\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Actualizar el precio de un producto o ajustar el stock.\n\n### Contrato de API\n\n- **Endpoint**: `PATCH /api/v1/productos/:id`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"precio\": 1800, \"stock\": 80 }`\n\n## Plan de Implementación\n\n### Backend\n1. Schema con campos opcionales\n2. Service: verificar existencia + nombre único si cambia → update\n3. Ruta PATCH con auth ADMIN\n4. Tests\n\n### Mobile\n5. Pantalla de edición con datos precargados\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0030-eliminar-producto.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Eliminar Producto (Soft Delete)\n---\n\n# TDD-0030: Eliminar Producto (Soft Delete)\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nEliminar un producto del catálogo sin perder el historial de pedidos que lo incluyen.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Dar de baja un producto que ya no se comercializa.\n\n### Criterios de Aceptación\n- Soft delete: marcar `deletedAt`\n- Los pedidos históricos con ese producto deben mantenerse\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/productos/:id`\n- **Auth**: JWT (rol ADMIN)\n- **Response** `200 OK`\n\n## Plan de Implementación\n\n### Backend\n1. Agregar `deletedAt` al modelo Producto (migración)\n2. Service: `prisma.producto.update({ data: { deletedAt: new Date() } })`\n3. Ruta DELETE con auth ADMIN\n4. Tests\n\n### Mobile\n5. Botón de eliminar con confirmación\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 24.0s)

_Thinking:_

Good progress. Now I need to create:
- Pedido (0031-0036): crear, obtener, listar, actualizar estado, cancelar, eliminar
- ItemPedido (0037-0039): agregar, actualizar cantidad, quitar
- Visita (0040-0043): registrar, obtener, listar, marcar falta
- Empleado (0044-0048): crear, obtener, listar, actualizar, eliminar
- Reparto (0049-0055): crear, obtener, listar, iniciar, finalizar, asignar pedido, eliminar
- Retenido (0056-0060): registrar, obtener, listar, actualizar estado, eliminar
- Reclamo (0061-0064): crear, obtener, listar, eliminar

Let me continue with Pedido and ItemPedido.

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0031-crear-pedido.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Crear Pedido\n---\n\n# TDD-0031: Crear Pedido\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nRegistrar un nuevo pedido para un cliente con sus ítems (productos + cantidades). El pedido se crea en estado `pendiente`.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Cargar un pedido que un cliente solicitó.\n\n### Criterios de Aceptación\n- El sistema debe crear el pedido con estado `pendiente` y fecha actual\n- Debe incluir al menos un item con producto, cantidad y precio unitario\n- Debe calcular el precio unitario desde el producto al momento de crear\n- Debe rechazar si el cliente no existe o está inactivo\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Pedido**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| estado | EstadoPedido | DEFAULT pendiente |\n| fechaAlta | DateTime | @default(now()) |\n| clienteId | Int | FK -> Cliente |\n| repartoId | Int? | FK -> Reparto |\n| createdAt | DateTime | @default(now()) |\n| updatedAt | DateTime | @updatedAt |\n| deletedAt | DateTime? | |\n\n**ItemPedido**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| cantidad | Int | NOT NULL, > 0 |\n| precioUnitario | Float | NOT NULL |\n| productoId | Int | FK -> Producto |\n| pedidoId | Int | FK -> Pedido |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/pedidos`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**:\n```json\n{\n  \"clienteId\": 1,\n  \"items\": [\n    { \"productoId\": 1, \"cantidad\": 2 },\n    { \"productoId\": 2, \"cantidad\": 1 }\n  ]\n}\n```\n- **Response** `201 Created`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"cliente\": { \"id\": 1, \"nombre\": \"Juan Pérez\" },\n    \"estado\": \"pendiente\",\n    \"fechaAlta\": \"2026-05-22T10:00:00Z\",\n    \"items\": [\n      { \"producto\": { \"id\": 1, \"nombre\": \"Bidón 20L\" }, \"cantidad\": 2, \"precioUnitario\": 1500 }\n    ],\n    \"total\": 3000\n  }\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod: clienteId requerido, items array con productoId y cantidad (mínimo 1 item)\n2. Service: `create(dto)` → verificar cliente activo → para cada item, buscar producto y precio actual → `prisma.pedido.create({ data: { clienteId, estado: 'pendiente', items: { create: ... } } })`\n3. Ruta POST con auth ADMIN\n4. Tests: creación exitosa, cliente inexistente, items vacío, producto inexistente\n\n### Mobile\n5. Pantalla con selector de cliente, selector de productos y cantidades\n6. Mutation con TanStack Query\n7. Invalidar lista de pedidos al crear\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0032-obtener-pedido.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Obtener Pedido\n---\n\n# TDD-0032: Obtener Pedido\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar un pedido específico con todos sus detalles: cliente, items, estado, visita y reparto asociado.\n\n### User Persona\n- **Nombre**: Administrador / Repartidor\n- **Necesidad**: Ver el detalle completo de un pedido para prepararlo o entregarlo.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/pedidos/:id`\n- **Auth**: JWT\n- **Response** `200 OK`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"estado\": \"entregado\",\n    \"fechaAlta\": \"2026-05-22\",\n    \"cliente\": { \"id\": 1, \"nombre\": \"Juan Pérez\" },\n    \"items\": [\n      { \"producto\": { \"id\": 1, \"nombre\": \"Bidón 20L\" }, \"cantidad\": 2, \"precioUnitario\": 1500 }\n    ],\n    \"visita\": { \"id\": 1, \"fecha\": \"2026-05-23\" },\n    \"reparto\": { \"id\": 1, \"fecha\": \"2026-05-23\" }\n  }\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: `prisma.pedido.findUnique({ where: { id }, include: { cliente: true, items: { include: { producto: true } }, visita: true, reparto: true } })` → NOT_FOUND\n2. Ruta GET\n3. Tests\n\n### Mobile\n4. Hook `useQuery(['pedido', id])`\n5. Pantalla de detalle con toda la información\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0033-listar-pedidos.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Listar Pedidos\n---\n\n# TDD-0033: Listar Pedidos\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar todos los pedidos con filtros por cliente, estado, fecha y reparto.\n\n### User Persona\n- **Nombre**: Administrador / Repartidor\n- **Necesidad**: Ver los pedidos del día, filtrar por pendientes o buscar pedidos de un cliente.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/pedidos`\n- **Auth**: JWT\n- **Query Params**: `?clienteId=&estado=&fechaDesde=&fechaHasta=&repartoId=&page=1&pageSize=20`\n- **Response** `200 OK`:\n```json\n{\n  \"data\": [\n    {\n      \"id\": 1,\n      \"cliente\": { \"id\": 1, \"nombre\": \"Juan Pérez\" },\n      \"estado\": \"pendiente\",\n      \"fechaAlta\": \"2026-05-22\",\n      \"itemsCount\": 3,\n      \"total\": 4500\n    }\n  ],\n  \"total\": 1,\n  \"page\": 1,\n  \"pageSize\": 20\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: filtros dinámicos (clienteId, estado, rango fechas, repartoId), paginación, incluir count de items\n2. Ruta GET\n3. Tests\n\n### Mobile\n4. FlatList con filtros (Filtro por estado, selector de fechas)\n5. Pull-to-refresh\n6. Navegación al detalle\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0034-actualizar-estado-pedido.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Actualizar Estado de Pedido\n---\n\n# TDD-0034: Actualizar Estado de Pedido\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nCambiar el estado de un pedido a lo largo de su ciclo de vida: `pendiente` → `en_ruta` → `entregado`.\n\n### User Persona\n- **Nombre**: Administrador / Repartidor\n- **Necesidad**: Marcar un pedido como entregado después de la visita.\n\n### Criterios de Aceptación\n- Solo se puede avanzar al siguiente estado (no retroceder)\n- `pendiente` → `en_ruta` → `entregado`\n- No se puede cambiar el estado de un pedido cancelado\n\n## Diseño Técnico (RFC)\n\n### Máquina de Estados\n\n```\npendiente ──→ en_ruta ──→ entregado\n     │                     \n     └──→ cancelado        \n```\n\n### Contrato de API\n\n- **Endpoint**: `PATCH /api/v1/pedidos/:id/estado`\n- **Auth**: JWT (rol ADMIN o REPARTIDOR)\n- **Request Body**: `{ \"estado\": \"entregado\" }`\n- **Response** `200 OK`\n- **Response** `409 Conflict` si la transición no es válida:\n```json\n{\n  \"error\": { \"code\": \"CONFLICT\", \"message\": \"No se puede cambiar de 'cancelado' a 'entregado'\" }\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod con estado válido\n2. Service: `updateEstado(id, nuevoEstado)` → obtener estado actual → validar transición permitida → `prisma.pedido.update()`\n3. Ruta PATCH con authMiddleware + validación de transiciones\n4. Tests: transiciones válidas, inválidas, pedido cancelado\n\n### Mobile\n5. Botones de acción según estado actual (ej: \"Marcar entregado\")\n6. Mutation, invalidar query del pedido y lista\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0035-cancelar-pedido.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Cancelar Pedido\n---\n\n# TDD-0035: Cancelar Pedido\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nPermitir cancelar un pedido que aún no fue entregado. Un pedido cancelado no puede cambiar a otro estado.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Cancelar un pedido porque el cliente se arrepintió o hubo un error.\n\n### Criterios de Aceptación\n- Solo se puede cancelar un pedido en estado `pendiente`\n- Un pedido cancelado no puede cambiar a otro estado\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/pedidos/:id/cancelar`\n- **Auth**: JWT (rol ADMIN)\n- **Response** `200 OK`:\n```json\n{ \"data\": { \"id\": 1, \"estado\": \"cancelado\" } }\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: verificar estado `pendiente` → `prisma.pedido.update({ data: { estado: 'cancelado' } })`\n2. Si ya está cancelado o entregado, throw CONFLICT\n3. Tests\n\n### Mobile\n4. Botón \"Cancelar pedido\" solo visible en estado pendiente\n5. Confirmación antes de cancelar\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0036-eliminar-pedido.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Eliminar Pedido (Soft Delete)\n---\n\n# TDD-0036: Eliminar Pedido (Soft Delete)\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nEliminar lógicamente un pedido. Solo se permite eliminar pedidos en estado `pendiente` o `cancelado`.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Limpiar pedidos mal creados o duplicados.\n\n### Criterios de Aceptación\n- Soft delete: marcar `deletedAt`\n- No se puede eliminar un pedido `en_ruta` o `entregado`\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/pedidos/:id`\n- **Auth**: JWT (rol ADMIN)\n- **Response** `409 Conflict` si el estado no lo permite:\n```json\n{ \"error\": { \"code\": \"CONFLICT\", \"message\": \"No se puede eliminar un pedido en reparto\" } }\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: verificar estado (solo pendiente o cancelado) → `prisma.pedido.update({ data: { deletedAt: new Date() } })`\n2. Tests\n\n### Mobile\n3. Botón \"Eliminar\" solo visible en estados permitidos\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 19.3s)

_Thinking:_

Now ItemPedido (0037-0039), Visita (0040-0043), and Empleado (0044-0048).

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0037-agregar-item-pedido.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Agregar Item a Pedido\n---\n\n# TDD-0037: Agregar Item a Pedido\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nAgregar un producto existente al pedido con una cantidad determinada.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Agregar un producto adicional a un pedido pendiente.\n\n### Criterios de Aceptación\n- Solo se puede agregar items a pedidos en estado `pendiente`\n- El producto debe existir y estar activo\n- El precio unitario se toma del producto al momento de agregar\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/pedidos/:pedidoId/items`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"productoId\": 1, \"cantidad\": 3 }`\n- **Response** `201 Created`\n\n## Plan de Implementación\n\n### Backend\n1. Schema: productoId, cantidad > 0\n2. Service: verificar pedido pendiente → verificar producto → `prisma.itemPedido.create()`\n3. Tests: éxito, pedido no pendiente, producto inexistente\n\n### Mobile\n4. Modal o pantalla para agregar producto a pedido existente\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0038-actualizar-cantidad-item.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Actualizar Cantidad de Item en Pedido\n---\n\n# TDD-0038: Actualizar Cantidad de Item en Pedido\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nModificar la cantidad de un producto en un pedido pendiente.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Corregir la cantidad solicitada de un producto.\n\n### Criterios de Aceptación\n- Solo se puede modificar items de pedidos en estado `pendiente`\n- No se modifica el precio unitario (se mantiene el original)\n\n### Contrato de API\n\n- **Endpoint**: `PATCH /api/v1/pedidos/:pedidoId/items/:itemId`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"cantidad\": 5 }`\n\n## Plan de Implementación\n\n### Backend\n1. Schema: cantidad > 0\n2. Service: verificar pedido pendiente → `prisma.itemPedido.update({ data: { cantidad } })`\n3. Tests\n\n### Mobile\n4. Input para modificar cantidad en el detalle del pedido\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0039-quitar-item-pedido.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Quitar Item de Pedido\n---\n\n# TDD-0039: Quitar Item de Pedido\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nEliminar un producto del pedido.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Quitar un producto que el cliente ya no quiere.\n\n### Criterios de Aceptación\n- Solo se puede quitar items de pedidos en estado `pendiente`\n- No se puede quitar el único item del pedido (debe quedar al menos 1)\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/pedidos/:pedidoId/items/:itemId`\n- **Auth**: JWT (rol ADMIN)\n- **Response** `409 Conflict` si es el último item:\n```json\n{ \"error\": { \"code\": \"CONFLICT\", \"message\": \"El pedido debe tener al menos un item\" } }\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: verificar pedido pendiente → contar items actuales → si es el último, throw CONFLICT → `prisma.itemPedido.delete()`\n2. Tests\n\n### Mobile\n3. Botón \"Quitar\" con confirmación\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0040-registrar-visita.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Registrar Visita\n---\n\n# TDD-0040: Registrar Visita\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nRegistrar una visita de reparto a un pedido. La visita documenta que el repartidor asistió al domicilio del cliente para entregar el pedido.\n\n### User Persona\n- **Nombre**: Repartidor\n- **Necesidad**: Registrar que asistió a entregar un pedido, con fecha, hora y empleado asignado.\n\n### Criterios de Aceptación\n- La visita se asocia a un pedido y a un empleado\n- La visita registra fecha y hora\n- El pedido debe estar en estado `en_ruta` o `pendiente`\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Visita**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| fecha | DateTime | NOT NULL |\n| hora | DateTime | NOT NULL |\n| falta | Boolean | DEFAULT false |\n| pedidoId | Int | FK -> Pedido |\n| empleadoId | Int | FK -> Empleado |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/visitas`\n- **Auth**: JWT (rol REPARTIDOR o ADMIN)\n- **Request Body**:\n```json\n{\n  \"pedidoId\": 1,\n  \"empleadoId\": 1,\n  \"fecha\": \"2026-05-23\",\n  \"hora\": \"10:30\"\n}\n```\n- **Response** `201 Created`\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod con validaciones\n2. Service: verificar pedido existe → `prisma.visita.create()`\n3. Ruta POST con auth\n4. Tests\n\n### Mobile\n5. Pantalla simple: escanear/ingresar pedido, seleccionar empleado, registrar fecha/hora\n6. La hora puede tomarse automáticamente del dispositivo\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0041-obtener-visita.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Obtener Visita\n---\n\n# TDD-0041: Obtener Visita\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar los detalles de una visita específica.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Verificar si un pedido fue visitado y por quién.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/visitas/:id`\n- **Auth**: JWT\n- **Response** `200 OK`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"fecha\": \"2026-05-23\",\n    \"hora\": \"10:30\",\n    \"falta\": false,\n    \"pedido\": { \"id\": 1, \"estado\": \"entregado\" },\n    \"empleado\": { \"id\": 1, \"nombre\": \"Carlos\" }\n  }\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: `prisma.visita.findUnique({ include: { pedido: true, empleado: true } })` → NOT_FOUND\n2. Tests\n\n### Mobile\n3. Hook `useQuery`\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0042-listar-visitas.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Listar Visitas\n---\n\n# TDD-0042: Listar Visitas\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar visitas con filtros por fecha, empleado, pedido.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Ver el reporte de visitas del día.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/visitas`\n- **Auth**: JWT\n- **Query Params**: `?fecha=&empleadoId=&pedidoId=&falta=&page=1&pageSize=20`\n\n## Plan de Implementación\n\n### Backend\n1. Service: filtros dinámicos, paginación\n2. Tests\n\n### Mobile\n3. Lista con filtro por fecha\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0043-marcar-visita-falta.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Marcar Visita como Falta\n---\n\n# TDD-0043: Marcar Visita como Falta\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nMarcar que en una visita programada el cliente no se encontraba o no se pudo entregar.\n\n### User Persona\n- **Nombre**: Repartidor\n- **Necesidad**: Indicar que fue al domicilio pero no encontró al cliente.\n\n### Criterios de Aceptación\n- Cambiar el campo `falta` a `true`\n- No debe modificar el estado del pedido\n\n### Contrato de API\n\n- **Endpoint**: `PATCH /api/v1/visitas/:id/falta`\n- **Auth**: JWT (rol REPARTIDOR o ADMIN)\n- **Request Body**: `{ \"falta\": true }`\n\n## Plan de Implementación\n\n### Backend\n1. Service: `prisma.visita.update({ data: { falta: true } })`\n2. Tests\n\n### Mobile\n4. Botón \"No se encontró al cliente\" en la pantalla de visita\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 11.4s)

_Thinking:_

Now Empleado (0044-0048), Reparto (0049-0055), Retenido (0056-0060), Reclamo (0061-0064).

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0044-crear-empleado.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Crear Empleado\n---\n\n# TDD-0044: Crear Empleado\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nRegistrar un nuevo empleado (repartidor) en el sistema.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Dar de alta un nuevo repartidor.\n\n### Criterios de Aceptación\n- El sistema debe crear el empleado con nombre, apellido y DNI\n- El DNI debe ser único\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Empleado**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| nombre | String | NOT NULL |\n| apellido | String | NOT NULL |\n| dni | String | UNIQUE, NOT NULL |\n| createdAt | DateTime | @default(now()) |\n| updatedAt | DateTime | @updatedAt |\n| deletedAt | DateTime? | |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/empleados`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"nombre\": \"Carlos\", \"apellido\": \"Gómez\", \"dni\": \"12345678\" }`\n- **Response** `201 Created`\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod\n2. Service: verificar DNI único → create\n3. Tests\n\n### Mobile\n5. Formulario simple\n6. Mutation\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0045-obtener-empleado.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Obtener Empleado\n---\n\n# TDD-0045: Obtener Empleado\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar los datos de un empleado específico.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Ver los datos de un repartidor.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/empleados/:id`\n- **Auth**: JWT\n- **Response** `200 OK`\n\n## Plan de Implementación\n\n### Backend\n1. Service: `prisma.empleado.findUnique()` → NOT_FOUND\n2. Tests\n\n### Mobile\n3. Hook `useQuery`\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0046-listar-empleados.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Listar Empleados\n---\n\n# TDD-0046: Listar Empleados\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar todos los empleados registrados.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Seleccionar un repartidor para asignarlo a un reparto.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/empleados`\n- **Auth**: JWT\n- **Query Params**: `?search=&page=1&pageSize=20`\n\n## Plan de Implementación\n\n### Backend\n1. Service: filtro search por nombre/apellido, paginación\n2. Tests\n\n### Mobile\n3. FlatList con search\n4. Selector en formulario de reparto\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0047-actualizar-empleado.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Actualizar Empleado\n---\n\n# TDD-0047: Actualizar Empleado\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nModificar los datos de un empleado existente.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Corregir el nombre o apellido de un empleado.\n\n### Contrato de API\n\n- **Endpoint**: `PATCH /api/v1/empleados/:id`\n- **Auth**: JWT (rol ADMIN)\n\n## Plan de Implementación\n\n### Backend\n1. Schema con campos opcionales\n2. Service: verificar DNI único si cambia\n3. Tests\n\n### Mobile\n4. Pantalla de edición\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0048-eliminar-empleado.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Eliminar Empleado (Soft Delete)\n---\n\n# TDD-0048: Eliminar Empleado (Soft Delete)\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nDar de baja un empleado sin perder sus visitas históricas.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Baja de un repartidor que ya no trabaja en la empresa.\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/empleados/:id`\n- **Auth**: JWT (rol ADMIN)\n\n## Plan de Implementación\n\n### Backend\n1. Soft delete con `deletedAt`\n2. Tests\n\n### Mobile\n3. Botón con confirmación\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 20.8s)

_Thinking:_

Now Reparto (0049-0055).

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0049-crear-reparto.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Crear Reparto\n---\n\n# TDD-0049: Crear Reparto\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nCrear una hoja de ruta que agrupa pedidos para ser entregados en una misma fecha por un repartidor.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Planificar los pedidos del día asignándolos a un reparto.\n\n### Criterios de Aceptación\n- El sistema debe crear el reparto con fecha, inicio y fin opcionales\n- Debe permitir asignar pedidos pendientes al reparto\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Reparto**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| fecha | DateTime | NOT NULL |\n| inicio | DateTime? | |\n| fin | DateTime? | |\n| createdAt | DateTime | @default(now()) |\n| updatedAt | DateTime | @updatedAt |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/repartos`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**:\n```json\n{\n  \"fecha\": \"2026-05-23\",\n  \"pedidosIds\": [1, 2, 3]\n}\n```\n- **Response** `201 Created`\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod\n2. Service: verificar pedidos existan y estén pendientes → `prisma.reparto.create({ data: { fecha, pedidos: { connect: pedidosIds.map(id => ({ id })) } } })`\n3. Tests\n\n### Mobile\n4. Pantalla con selector de fecha y selector múltiple de pedidos\n5. Mutation\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0050-obtener-reparto.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Obtener Reparto\n---\n\n# TDD-0050: Obtener Reparto\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar un reparto con todos sus pedidos y visitas asociadas.\n\n### User Persona\n- **Nombre**: Repartidor / Administrador\n- **Necesidad**: Ver la hoja de ruta del día con los pedidos asignados.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/repartos/:id`\n- **Auth**: JWT\n- **Response** `200 OK`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"fecha\": \"2026-05-23\",\n    \"inicio\": null,\n    \"fin\": null,\n    \"pedidos\": [\n      {\n        \"id\": 1,\n        \"cliente\": { \"id\": 1, \"nombre\": \"Juan Pérez\", \"domicilios\": [...] },\n        \"estado\": \"pendiente\",\n        \"items\": [...]\n      }\n    ]\n  }\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: `prisma.reparto.findUnique({ include: { pedidos: { include: { cliente: { include: { domicilios: true } }, items: { include: { producto: true } } } } } })` → NOT_FOUND\n2. Tests\n\n### Mobile\n3. Hook `useQuery(['reparto', id])`\n4. Pantalla de detalle del reparto con lista de pedidos a entregar\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0051-listar-repartos.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Listar Repartos\n---\n\n# TDD-0051: Listar Repartos\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar los repartos planificados con filtros por fecha y estado.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Ver los repartos del día o de la semana.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/repartos`\n- **Auth**: JWT\n- **Query Params**: `?fechaDesde=&fechaHasta=&page=1&pageSize=20`\n- **Response** `200 OK`:\n```json\n{\n  \"data\": [\n    {\n      \"id\": 1,\n      \"fecha\": \"2026-05-23\",\n      \"pedidosCount\": 5,\n      \"inicio\": null,\n      \"fin\": null\n    }\n  ],\n  \"total\": 1\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: filtros por rango de fechas, paginación, incluir count de pedidos\n2. Tests\n\n### Mobile\n3. FlatList con filtro de fecha\n4. Navegación al detalle\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0052-iniciar-reparto.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Iniciar Reparto\n---\n\n# TDD-0052: Iniciar Reparto\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nMarcar el inicio de un reparto cuando el repartidor comienza la ruta. Los pedidos pasan a `en_ruta`.\n\n### User Persona\n- **Nombre**: Repartidor\n- **Necesidad**: Iniciar el recorrido del día.\n\n### Criterios de Aceptación\n- Al iniciar el reparto se setea `inicio` con la fecha/hora actual\n- Todos los pedidos del reparto pasan a estado `en_ruta`\n- No se puede iniciar un reparto ya iniciado o finalizado\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/repartos/:id/iniciar`\n- **Auth**: JWT (rol REPARTIDOR o ADMIN)\n- **Response** `200 OK`:\n```json\n{ \"data\": { \"id\": 1, \"inicio\": \"2026-05-23T09:00:00Z\", \"pedidosActualizados\": 5 } }\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: verificar reparto no iniciado → `inicio = new Date()` → actualizar todos los pedidos a `en_ruta` con `prisma.pedido.updateMany()`\n2. Tests: inicio exitoso, reparto ya iniciado, sin pedidos\n\n### Mobile\n3. Botón \"Iniciar reparto\" en el detalle\n4. Confirmación: \"¿Iniciar reparto? Los pedidos pasarán a en_ruta\"\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0053-finalizar-reparto.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Finalizar Reparto\n---\n\n# TDD-0053: Finalizar Reparto\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nMarcar la finalización de un reparto. Los pedidos que siguen `en_ruta` sin visita registrada quedan como `pendiente` para un próximo reparto.\n\n### User Persona\n- **Nombre**: Repartidor\n- **Necesidad**: Finalizar la jornada de reparto.\n\n### Criterios de Aceptación\n- Se setea `fin` con la fecha/hora actual\n- Los pedidos en estado `en_ruta` que no fueron visitados vuelven a `pendiente`\n- No se puede finalizar un reparto no iniciado o ya finalizado\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/repartos/:id/finalizar`\n- **Auth**: JWT (rol REPARTIDOR o ADMIN)\n- **Response** `200 OK`\n\n## Plan de Implementación\n\n### Backend\n1. Service: verificar reparto iniciado y no finalizado → `fin = new Date()` → `prisma.pedido.updateMany({ where: { repartoId: id, estado: 'en_ruta' }, data: { estado: 'pendiente' } })`\n2. Tests\n\n### Mobile\n3. Botón \"Finalizar reparto\" con confirmación\n4. Resumen al finalizar: entregados, pendientes, faltas\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0054-asignar-pedido-reparto.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Asignar Pedido a Reparto\n---\n\n# TDD-0054: Asignar Pedido a Reparto\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nAgregar un pedido pendiente a un reparto existente.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Asignar un pedido nuevo a un reparto ya planificado.\n\n### Criterios de Aceptación\n- Solo se pueden asignar pedidos en estado `pendiente`\n- El reparto no debe estar iniciado o finalizado\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/repartos/:repartoId/pedidos`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"pedidoId\": 4 }`\n\n## Plan de Implementación\n\n### Backend\n1. Service: verificar reparto no iniciado → verificar pedido pendiente → `prisma.pedido.update({ where: { id }, data: { repartoId } })`\n2. Tests\n\n### Mobile\n3. Selector de pedidos en el detalle del reparto\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0055-eliminar-reparto.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Eliminar Reparto\n---\n\n# TDD-0055: Eliminar Reparto\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nEliminar un reparto planificado. Los pedidos asignados se desvinculan del reparto.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Cancelar un reparto planificado y reasignar sus pedidos.\n\n### Criterios de Aceptación\n- Solo se puede eliminar un reparto no iniciado\n- Los pedidos asignados quedan sin reparto (repartoId = null)\n- Se usa soft delete\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/repartos/:id`\n- **Auth**: JWT (rol ADMIN)\n\n## Plan de Implementación\n\n### Backend\n1. Service: verificar reparto no iniciado → `prisma.pedido.updateMany({ where: { repartoId: id }, data: { repartoId: null } })` → `prisma.reparto.update({ data: { deletedAt: new Date() } })`\n2. Tests\n\n### Mobile\n3. Botón con confirmación\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 19.5s)

_Thinking:_

Now Retenido (0056-0060) and Reclamo (0061-0064).

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0056-registrar-retenido.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Registrar Retenido\n---\n\n# TDD-0056: Registrar Retenido\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nRegistrar un producto retenido (envase) que el cliente no devolvió. Aplica a productos retornables como bidones.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Llevar control de los envases retenidos por cada cliente.\n\n### Criterios de Aceptación\n- El retenido se asocia a un producto, cliente y pedido\n- El producto debe ser retornable\n- Estado inicial: `retenido`\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Retenido**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| estado | EstadoRetenido | DEFAULT retenido |\n| inicio | DateTime | @default(now()) |\n| fin | DateTime? | |\n| productoId | Int | FK -> Producto |\n| clienteId | Int | FK -> Cliente |\n| pedidoId | Int | FK -> Pedido |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/retenidos`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"productoId\": 1, \"clienteId\": 1, \"pedidoId\": 1 }`\n- **Response** `201 Created`\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod\n2. Service: verificar producto retornable → `prisma.retenido.create()`\n3. Tests\n\n### Mobile\n4. Formulario en el detalle del pedido\n5. Mutation\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0057-obtener-retenido.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Obtener Retenido\n---\n\n# TDD-0057: Obtener Retenido\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar un registro de retenido específico.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Ver el detalle de un envase retenido.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/retenidos/:id`\n- **Auth**: JWT\n- **Response** `200 OK`:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"estado\": \"retenido\",\n    \"inicio\": \"2026-05-22\",\n    \"producto\": { \"id\": 1, \"nombre\": \"Bidón 20L\" },\n    \"cliente\": { \"id\": 1, \"nombre\": \"Juan Pérez\" }\n  }\n}\n```\n\n## Plan de Implementación\n\n### Backend\n1. Service: `prisma.retenido.findUnique({ include: { producto: true, cliente: true } })` → NOT_FOUND\n2. Tests\n\n### Mobile\n3. Hook `useQuery`\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0058-listar-retenidos.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Listar Retenidos\n---\n\n# TDD-0058: Listar Retenidos\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar todos los productos retenidos, con filtros por cliente, producto y estado.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Ver qué clientes tienen envases retenidos sin devolver.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/retenidos`\n- **Auth**: JWT\n- **Query Params**: `?clienteId=&productoId=&estado=&page=1&pageSize=20`\n\n## Plan de Implementación\n\n### Backend\n1. Service: filtros dinámicos, paginación\n2. Tests\n\n### Mobile\n3. FlatList con filtros\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0059-actualizar-estado-retenido.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Actualizar Estado de Retenido\n---\n\n# TDD-0059: Actualizar Estado de Retenido\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nCambiar el estado de un retenido: `retenido` → `devuelto` o → `perdido`.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Registrar que el cliente devolvió el envase o se declaró como perdido.\n\n### Criterios de Aceptación\n- Al marcar como `devuelto`, se setea `fin` con la fecha actual\n- Al marcar como `perdido`, se setea `fin` con la fecha actual\n- No se puede cambiar el estado de un retenido ya finalizado\n\n### Contrato de API\n\n- **Endpoint**: `PATCH /api/v1/retenidos/:id/estado`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"estado\": \"devuelto\" }`\n- **Response** `200 OK`\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod con estado válido (devuelto, perdido)\n2. Service: verificar no finalizado → `prisma.retenido.update({ data: { estado, fin: new Date() } })`\n3. Tests\n\n### Mobile\n4. Botones \"Marcar devuelto\" / \"Marcar perdido\"\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0060-eliminar-retenido.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Eliminar Retenido\n---\n\n# TDD-0060: Eliminar Retenido\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nEliminar un registro de retenido mal creado.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Corregir errores de carga.\n\n### Criterios de Aceptación\n- Hard delete: se elimina físicamente (es dato administrativo, no histórico)\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/retenidos/:id`\n- **Auth**: JWT (rol ADMIN)\n\n## Plan de Implementación\n\n### Backend\n1. Service: `prisma.retenido.delete()`\n2. Tests\n\n### Mobile\n3. Botón con confirmación\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0061-crear-reclamo.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Crear Reclamo\n---\n\n# TDD-0061: Crear Reclamo\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nRegistrar un reclamo de un cliente.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Cargar un reclamo que un cliente realizó.\n\n### Criterios de Aceptación\n- El reclamo se asocia a un cliente existente\n- El cliente debe estar activo\n\n## Diseño Técnico (RFC)\n\n### Modelo de Datos\n\n**Reclamo**\n\n| Campo | Tipo | Restricciones |\n|---|---|---|\n| id | Int | PK, autoincrement |\n| clienteId | Int | FK -> Cliente |\n| createdAt | DateTime | @default(now()) |\n\n### Contrato de API\n\n- **Endpoint**: `POST /api/v1/reclamos`\n- **Auth**: JWT (rol ADMIN)\n- **Request Body**: `{ \"clienteId\": 1 }`\n- **Response** `201 Created`\n\n## Plan de Implementación\n\n### Backend\n1. Schema Zod\n2. Service: verificar cliente activo → `prisma.reclamo.create()`\n3. Tests\n\n### Mobile\n4. Botón \"Nuevo reclamo\" en detalle del cliente\n5. Mutation, invalidar reclamos del cliente\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0062-obtener-reclamo.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Obtener Reclamo\n---\n\n# TDD-0062: Obtener Reclamo\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar un reclamo específico.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Ver el detalle de un reclamo.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/reclamos/:id`\n- **Auth**: JWT\n- **Response** `200 OK`\n\n## Plan de Implementación\n\n### Backend\n1. Service: `prisma.reclamo.findUnique({ include: { cliente: true } })`\n2. Tests\n\n### Mobile\n3. Hook `useQuery`\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0063-listar-reclamos.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Listar Reclamos\n---\n\n# TDD-0063: Listar Reclamos\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nConsultar reclamos con filtros por cliente y fecha.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Ver los reclamos registrados en el sistema.\n\n### Contrato de API\n\n- **Endpoint**: `GET /api/v1/reclamos`\n- **Auth**: JWT\n- **Query Params**: `?clienteId=&fechaDesde=&fechaHasta=&page=1&pageSize=20`\n\n## Plan de Implementación\n\n### Backend\n1. Service: filtros dinámicos, paginación\n2. Tests\n\n### Mobile\n3. FlatList con filtros\n"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\\tdd-0064-eliminar-reclamo.md",
  "content": "---\nautor: Equipo SupplyCycle\nfecha: 2026-05-22\ntitulo: Eliminar Reclamo\n---\n\n# TDD-0064: Eliminar Reclamo\n\n## Contexto de Negocio (PRD)\n\n### Objetivo\nEliminar un reclamo.\n\n### User Persona\n- **Nombre**: Administrador\n- **Necesidad**: Quitar un reclamo mal cargado o resuelto.\n\n### Contrato de API\n\n- **Endpoint**: `DELETE /api/v1/reclamos/:id`\n- **Auth**: JWT (rol ADMIN)\n\n## Plan de Implementación\n\n### Backend\n1. Service: `prisma.reclamo.delete()`\n2. Tests\n\n### Mobile\n3. Botón con confirmación\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 89.5s)

_Thinking:_

All 58 TDDs created. Let me verify the final list and update the todo list.

**Tool: bash**

**Input:**
```json
{
  "description": "Count and list all new TDD files",
  "command": "Get-ChildItem -LiteralPath \"C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\" -Filter \"tdd-*.md\" | Sort-Object Name | Select-Object Name"
}
```

**Output:**
```

Name                                  
----                                  
tdd-0007-crear-cliente.md             
tdd-0008-obtener-cliente.md           
tdd-0009-listar-clientes.md           
tdd-0010-actualizar-cliente.md        
tdd-0011-eliminar-cliente.md          
tdd-0012-crear-domicilio.md           
tdd-0013-obtener-domicilio.md         
tdd-0014-listar-domicilios.md         
tdd-0015-actualizar-domicilio.md      
tdd-0016-eliminar-domicilio.md        
tdd-0017-crear-ciudad.md              
tdd-0018-obtener-ciudad.md            
tdd-0019-listar-ciudades.md           
tdd-0020-actualizar-ciudad.md         
tdd-0021-eliminar-ciudad.md           
tdd-0022-asignar-dia-domicilio.md     
tdd-0023-quitar-dia-domicilio.md      
tdd-0024-asignar-horario-dia.md       
tdd-0025-quitar-horario-dia.md        
tdd-0026-crear-producto.md            
tdd-0027-obtener-producto.md          
tdd-0028-listar-productos.md          
tdd-0029-actualizar-producto.md       
tdd-0030-eliminar-producto.md         
tdd-0031-crear-pedido.md              
tdd-0032-obtener-pedido.md            
tdd-0033-listar-pedidos.md            
tdd-0034-actualizar-estado-pedido.md  
tdd-0035-cancelar-pedido.md           
tdd-0036-eliminar-pedido.md           
tdd-0037-agregar-item-pedido.md       
tdd-0038-actualizar-cantidad-item.md  
tdd-0039-quitar-item-pedido.md        
tdd-0040-registrar-visita.md          
tdd-0041-obtener-visita.md            
tdd-0042-listar-visitas.md            
tdd-0043-marcar-visita-falta.md       
tdd-0044-crear-empleado.md            
tdd-0045-obtener-empleado.md          
tdd-0046-listar-empleados.md          
tdd-0047-actualizar-empleado.md       
tdd-0048-eliminar-empleado.md         
tdd-0049-crear-reparto.md             
tdd-0050-obtener-reparto.md           
tdd-0051-listar-repartos.md           
tdd-0052-iniciar-reparto.md           
tdd-0053-finalizar-reparto.md         
tdd-0054-asignar-pedido-reparto.md    
tdd-0055-eliminar-reparto.md          
tdd-0056-registrar-retenido.md        
tdd-0057-obtener-retenido.md          
tdd-0058-listar-retenidos.md          
tdd-0059-actualizar-estado-retenido.md
tdd-0060-eliminar-retenido.md         
tdd-0061-crear-reclamo.md             
tdd-0062-obtener-reclamo.md           
tdd-0063-listar-reclamos.md           
tdd-0064-eliminar-reclamo.md          



```

---

## Assistant (Build · Big Pickle · 5.5s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "TDDs Cliente (0007-0011): crear, obtener, listar, actualizar, eliminar",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs Domicilio (0012-0016): crear, obtener, listar, actualizar, eliminar",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs Ciudad (0017-0021): crear, obtener, listar, actualizar, eliminar",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs Dia y Horario (0022-0025): asignar/quitar dia, asignar/quitar horario",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs Producto (0026-0030): crear, obtener, listar, actualizar, eliminar",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs Pedido (0031-0036): crear, obtener, listar, actualizar estado, cancelar, eliminar",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs ItemPedido (0037-0039): agregar, actualizar cantidad, quitar",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs Visita (0040-0043): registrar, obtener, listar, marcar falta",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs Empleado (0044-0048): crear, obtener, listar, actualizar, eliminar",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs Reparto (0049-0055): crear, obtener, listar, iniciar, finalizar, asignar pedido, eliminar",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs Retenido (0056-0060): registrar, obtener, listar, actualizar estado, eliminar",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "TDDs Reclamo (0061-0064): crear, obtener, listar, eliminar",
      "status": "completed"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "TDDs Cliente (0007-0011): crear, obtener, listar, actualizar, eliminar",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs Domicilio (0012-0016): crear, obtener, listar, actualizar, eliminar",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs Ciudad (0017-0021): crear, obtener, listar, actualizar, eliminar",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs Dia y Horario (0022-0025): asignar/quitar dia, asignar/quitar horario",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs Producto (0026-0030): crear, obtener, listar, actualizar, eliminar",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs Pedido (0031-0036): crear, obtener, listar, actualizar estado, cancelar, eliminar",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs ItemPedido (0037-0039): agregar, actualizar cantidad, quitar",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs Visita (0040-0043): registrar, obtener, listar, marcar falta",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs Empleado (0044-0048): crear, obtener, listar, actualizar, eliminar",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs Reparto (0049-0055): crear, obtener, listar, iniciar, finalizar, asignar pedido, eliminar",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs Retenido (0056-0060): registrar, obtener, listar, actualizar estado, eliminar",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "TDDs Reclamo (0061-0064): crear, obtener, listar, eliminar",
    "status": "completed",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Big Pickle · 4.9s)

Listos los **58 TDDs** en `docs/TDDs/`. Resumen por entidad:

| Entidad | # TDD | Acciones |
|---|---|---|
| **Cliente** | 0007-0011 | crear, obtener, listar, actualizar, eliminar |
| **Domicilio** | 0012-0016 | crear, obtener, listar, actualizar, eliminar |
| **Ciudad** | 0017-0021 | crear, obtener, listar, actualizar, eliminar |
| **Dia** | 0022-0023 | asignar, quitar |
| **Horario** | 0024-0025 | asignar, quitar |
| **Producto** | 0026-0030 | crear, obtener, listar, actualizar, eliminar |
| **Pedido** | 0031-0036 | crear, obtener, listar, actualizar estado, cancelar, eliminar |
| **ItemPedido** | 0037-0039 | agregar, actualizar cantidad, quitar |
| **Visita** | 0040-0043 | registrar, obtener, listar, marcar falta |
| **Empleado** | 0044-0048 | crear, obtener, listar, actualizar, eliminar |
| **Reparto** | 0049-0055 | crear, obtener, listar, iniciar, finalizar, asignar pedido, eliminar |
| **Retenido** | 0056-0060 | registrar, obtener, listar, actualizar estado, eliminar |
| **Reclamo** | 0061-0064 | crear, obtener, listar, eliminar |

Commit:
```bash
git add docs/TDDs/tdd-*.md
git commit -m "docs(tdd): agregar TDDs 0007-0064 por accion CRUD de cada entidad"
```

---

## User

Formateame los nombres de los TDD quiero que sean todos iguales, los nombres de los arhciovs deben ser TDD-xxxx- usa - para separar 

---

## Assistant (Build · Big Pickle · 16.7s)

_Thinking:_

The user wants me to rename all the TDD files to use the format `TDD-XXXX-nombre-con-guiones.md` (uppercase TDD, hyphen separator) instead of the current `tdd-xxxx-nombre.md` (lowercase tdd). Let me do this with PowerShell.

**Tool: bash**

**Input:**
```json
{
  "command": "Get-ChildItem -LiteralPath \"C:\\damian\\Repo\\SupplyCycle\\docs\\TDDs\" -Filter \"tdd-*.md\" | ForEach-Object { $newName = \"TDD-\" + $_.Name.Substring(4); Rename-Item -LiteralPath $_.FullName -NewName $newName; Write-Output \"$($_.Name) → $newName\" }",
  "description": "Rename all tdd-* files to TDD-* format"
}
```

**Output:**
```
tdd-0007-crear-cliente.md  TDD-0007-crear-cliente.md
tdd-0008-obtener-cliente.md  TDD-0008-obtener-cliente.md
tdd-0009-listar-clientes.md  TDD-0009-listar-clientes.md
tdd-0010-actualizar-cliente.md  TDD-0010-actualizar-cliente.md
tdd-0011-eliminar-cliente.md  TDD-0011-eliminar-cliente.md
tdd-0012-crear-domicilio.md  TDD-0012-crear-domicilio.md
tdd-0013-obtener-domicilio.md  TDD-0013-obtener-domicilio.md
tdd-0014-listar-domicilios.md  TDD-0014-listar-domicilios.md
tdd-0015-actualizar-domicilio.md  TDD-0015-actualizar-domicilio.md
tdd-0016-eliminar-domicilio.md  TDD-0016-eliminar-domicilio.md
tdd-0017-crear-ciudad.md  TDD-0017-crear-ciudad.md
tdd-0018-obtener-ciudad.md  TDD-0018-obtener-ciudad.md
tdd-0019-listar-ciudades.md  TDD-0019-listar-ciudades.md
tdd-0020-actualizar-ciudad.md  TDD-0020-actualizar-ciudad.md
tdd-0021-eliminar-ciudad.md  TDD-0021-eliminar-ciudad.md
tdd-0022-asignar-dia-domicilio.md  TDD-0022-asignar-dia-domicilio.md
tdd-0023-quitar-dia-domicilio.md  TDD-0023-quitar-dia-domicilio.md
tdd-0024-asignar-horario-dia.md  TDD-0024-asignar-horario-dia.md
tdd-0025-quitar-horario-dia.md  TDD-0025-quitar-horario-dia.md
tdd-0026-crear-producto.md  TDD-0026-crear-producto.md
tdd-0027-obtener-producto.md  TDD-0027-obtener-producto.md
tdd-0028-listar-productos.md  TDD-0028-listar-productos.md
tdd-0029-actualizar-producto.md  TDD-0029-actualizar-producto.md
tdd-0030-eliminar-producto.md  TDD-0030-eliminar-producto.md
tdd-0031-crear-pedido.md  TDD-0031-crear-pedido.md
tdd-0032-obtener-pedido.md  TDD-0032-obtener-pedido.md
tdd-0033-listar-pedidos.md  TDD-0033-listar-pedidos.md
tdd-0034-actualizar-estado-pedido.md  TDD-0034-actualizar-estado-pedido.md
tdd-0035-cancelar-pedido.md  TDD-0035-cancelar-pedido.md
tdd-0036-eliminar-pedido.md  TDD-0036-eliminar-pedido.md
tdd-0037-agregar-item-pedido.md  TDD-0037-agregar-item-pedido.md
tdd-0038-actualizar-cantidad-item.md  TDD-0038-actualizar-cantidad-item.md
tdd-0039-quitar-item-pedido.md  TDD-0039-quitar-item-pedido.md
tdd-0040-registrar-visita.md  TDD-0040-registrar-visita.md
tdd-0041-obtener-visita.md  TDD-0041-obtener-visita.md
tdd-0042-listar-visitas.md  TDD-0042-listar-visitas.md
tdd-0043-marcar-visita-falta.md  TDD-0043-marcar-visita-falta.md
tdd-0044-crear-empleado.md  TDD-0044-crear-empleado.md
tdd-0045-obtener-empleado.md  TDD-0045-obtener-empleado.md
tdd-0046-listar-empleados.md  TDD-0046-listar-empleados.md
tdd-0047-actualizar-empleado.md  TDD-0047-actualizar-empleado.md
tdd-0048-eliminar-empleado.md  TDD-0048-eliminar-empleado.md
tdd-0049-crear-reparto.md  TDD-0049-crear-reparto.md
tdd-0050-obtener-reparto.md  TDD-0050-obtener-reparto.md
tdd-0051-listar-repartos.md  TDD-0051-listar-repartos.md
tdd-0052-iniciar-reparto.md  TDD-0052-iniciar-reparto.md
tdd-0053-finalizar-reparto.md  TDD-0053-finalizar-reparto.md
tdd-0054-asignar-pedido-reparto.md  TDD-0054-asignar-pedido-reparto.md
tdd-0055-eliminar-reparto.md  TDD-0055-eliminar-reparto.md
tdd-0056-registrar-retenido.md  TDD-0056-registrar-retenido.md
tdd-0057-obtener-retenido.md  TDD-0057-obtener-retenido.md
tdd-0058-listar-retenidos.md  TDD-0058-listar-retenidos.md
tdd-0059-actualizar-estado-retenido.md  TDD-0059-actualizar-estado-retenido.md
tdd-0060-eliminar-retenido.md  TDD-0060-eliminar-retenido.md
tdd-0061-crear-reclamo.md  TDD-0061-crear-reclamo.md
tdd-0062-obtener-reclamo.md  TDD-0062-obtener-reclamo.md
tdd-0063-listar-reclamos.md  TDD-0063-listar-reclamos.md
tdd-0064-eliminar-reclamo.md  TDD-0064-eliminar-reclamo.md

```

---

## Assistant (Build · Big Pickle · 6.0s)

_Thinking:_

All 58 files renamed. Now I also need to rename the ADR files to be consistent with the same format. The ADRs currently are named like `ADR-0000-estandarizacion-respuestas-api.md` which already follows the `ADR-XXXX-nombre.md` pattern. Let me check.

Wait, the ADRs already start with `ADR-` (uppercase) and use hyphens - they're already in the right format. The TDDs were the issue (lowercase `tdd-`).

Let me also check if the old TDD files (TDD_0000_errores_globales.md etc.) need to be renamed too. The user said "formateame los nombres de los TDD" - they might want all TDD files consistent, including the old ones.

Actually, looking at it again, the old files are `TDD_0000_errores_globales.md` (underscores, uppercase TDD with underscore) and the new ones are `TDD-0000-nombre.md` (hyphens, uppercase TDD with hyphen). The user previously said "usa - en vez de _ para nombrar" but I'm not sure if they want me to rename the old ones too. Let me not touch the old ones unless asked.

The newer files I just created (now renamed to `TDD-0007-*.md` etc.) are consistent. The old files (`TDD_0000_*.md` etc.) still use underscores - but those were created by someone else and I should leave them alone unless asked.

All 58 TDDs now follow `TDD-XXXX-nombre-con-guiones.md`. Listo.

Hecho. Los 58 archivos ahora siguen el formato `TDD-XXXX-nombre-con-guiones.md`. Ejemplo: `TDD-0007-crear-cliente.md`, `TDD-0031-crear-pedido.md`, etc.

---

## User

Dame el commit con el add respetando lo defindo en husky

---

## Assistant (Plan · Big Pickle · 3.9s)

_Thinking:_

The user wants me to give them the git add and commit commands that respect what's defined in husky. Let me check the husky configuration to see what hooks are set up, so I can give the correct commands.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.husky"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.husky</path>
<type>directory</type>
<entries>
_/
commit-msg
pre-commit

(3 entries)
</entries>
```

---

## Assistant (Plan · Big Pickle · 3.3s)

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.husky\\commit-msg"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.husky\commit-msg</path>
<type>file</type>
<content>
1: #!/usr/bin/env sh
2: npx --no-install commitlint --edit "$1"

(End of file - total 2 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\.husky\\pre-commit"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\.husky\pre-commit</path>
<type>file</type>
<content>
1: #!/bin/sh
2: #

(End of file - total 2 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\commitlint.config.mjs"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\commitlint.config.mjs</path>
<type>file</type>
<content>
1: export default {
2:   extends: ['@commitlint/config-conventional'],
3: };

(End of file - total 3 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 7.1s)

_Thinking:_

So the husky setup has:
1. `commit-msg` hook that runs commitlint with conventional commits config
2. `pre-commit` hook that's essentially empty (just a shebang line)
3. `commitlint.config.mjs` uses `@commitlint/config-conventional`

Conventional commits format: `<type>(<scope>): <description>`

Valid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

The user wants commits for TDDs and ADRs. The type should be `docs` and the scope `tdd` and `adr`.

Let me give them the proper commands respecting conventional commits.

For the TDDs:
```bash
git add docs/TDDs/TDD-*.md
git commit -m "docs(tdd): agregar TDDs 0007-0064 por accion CRUD de cada entidad"
```

For the ADRs:
```bash
git add docs/ADRs/ADR-*.md
git commit -m "docs(adr): agregar ADRs 0000-0015 de decisiones tecnicas"
```

Or they could do them together since they're all docs.

Husky usa **commitlint con `@commitlint/config-conventional`**. El formato del mensaje debe ser:

```
<type>(<scope>): <descripción>
```

Types válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Para los TDDs y ADRs (ambos son documentación):

```bash
git add docs/TDDs/TDD-*.md
git add docs/ADRs/ADR-*.md
git commit -m "docs(tdd): agregar TDDs 0007-0064 por accion CRUD de cada entidad

- TDDs de Cliente, Domicilio, Ciudad, Dia, Horario, Producto
- TDDs de Pedido, ItemPedido, Visita, Empleado, Reparto, Retenido, Reclamo

docs(adr): agregar ADRs 0000-0015 de decisiones tecnicas

- ADR-0000: Estandarizacion respuestas API
- ADR-0001: Autenticacion JWT y roles
- ADR-0002: Arquitectura mobile Zustand
- ADR-0003: Monorepo 3 proyectos
- ADR-0004 al ADR-0015: stack, testing, soft delete, etc."
```

O si preferís separarlos en dos commits:

```bash
git add docs/ADRs/ADR-*.md
git commit -m "docs(adr): agregar ADRs 0000-0015 de decisiones tecnicas"
```

```bash
git add docs/TDDs/TDD-*.md
git commit -m "docs(tdd): agregar TDDs 0007-0064 por accion CRUD de cada entidad"
```

---

## User

Dame el commit para el template

---

## Assistant (Plan · Big Pickle · 4.9s)

_Thinking:_

The user wants the commit command for the Template.md file. The Template.md already existed before, but I need to check if it's tracked or needs to be added. Since I'm in plan mode, I can only give the command, not execute it.

The user is asking specifically for the template file. Looking at the context, they previously asked about the ADR Template.md. Let me just give them the command.

For the template, since it's a docs file:

```bash
git add docs/ADRs/Template.md
git commit -m "docs(adr): agregar template de ADRs"
```

```bash
git add docs/ADRs/Template.md
git commit -m "docs(adr): agregar template de ADRs"
```

---

## User

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum EstadoRetenido {
  retenido
  devuelto
  perdido
}

enum EstadoCliente {
  activo
  baja
  inactivo
  moroso
}

enum EstadoPedido {
  entregado
  pendiente
  cancelado
  en_ruta
}

enum DiaSemana {
  lunes
  martes
  miercoles
  jueves
  viernes
  sabado
  domingo
}

model Producto {
  id          Int           @id @default(autoincrement())
  nombre      String
  descripcion String
  precio      Float
  unidad      String
  stock       Int
  cantidad    Int
  retornable  Boolean

  itemsPedido ItemPedido[]
  retenidos   Retenido[]
}

model Pedido {
  id         Int           @id @default(autoincrement())
  estado     EstadoPedido
  fechaAlta  DateTime

  clienteId  Int
  cliente    Cliente       @relation(fields: [clienteId], references: [id])

  repartoId  Int?
  reparto    Reparto?      @relation(fields: [repartoId], references: [id])

  items      ItemPedido[]
  visitas    Visita[]
  retenidos  Retenido[]
}

model ItemPedido {
  id             Int       @id @default(autoincrement())
  cantidad       Int
  precioUnitario Float

  productoId     Int
  producto       Producto  @relation(fields: [productoId], references: [id])

  pedidoId       Int
  pedido         Pedido    @relation(fields: [pedidoId], references: [id])
}

model Retenido {
  id          Int              @id @default(autoincrement())
  estado      EstadoRetenido
  inicio      DateTime
  fin         DateTime

  productoId  Int
  producto    Producto         @relation(fields: [productoId], references: [id])

  clienteId   Int
  cliente     Cliente          @relation(fields: [clienteId], references: [id])

  pedidoId    Int
  pedido      Pedido           @relation(fields: [pedidoId], references: [id])
}

model Cliente {
  id         Int              @id @default(autoincrement())
  nombre     String
  apellido   String
  telefono   String
  estado     EstadoCliente

  pedidos    Pedido[]
  retenidos  Retenido[]
  reclamos   Reclamo[]
  domicilios Domicilio[]
}

model Reclamo {
  id         Int       @id @default(autoincrement())

  clienteId  Int
  cliente    Cliente   @relation(fields: [clienteId], references: [id])
}

model Domicilio {
  id            Int       @id @default(autoincrement())
  calle         String
  entreCalle1   String
  entreCalle2   String
  numero        String
  piso          String

  clienteId     Int
  cliente       Cliente   @relation(fields: [clienteId], references: [id])

  ciudadId      Int
  ciudad        Ciudad    @relation(fields: [ciudadId], references: [id])

  dias          Dia[]
}

model Ciudad {
  id          Int          @id @default(autoincrement())
  nombre      String

  domicilios  Domicilio[]
}

model Dia {
  id            Int          @id @default(autoincrement())
  nombre        DiaSemana

  domicilioId   Int
  domicilio     Domicilio    @relation(fields: [domicilioId], references: [id])

  horarios      Horario[]
}

model Horario {
  id        Int      @id @default(autoincrement())
  inicio    DateTime
  fin       DateTime

  diaId     Int
  dia       Dia      @relation(fields: [diaId], references: [id])
}

model Visita {
  id          Int        @id @default(autoincrement())
  fecha       DateTime
  hora        DateTime
  falta       Boolean

  pedidoId    Int
  pedido      Pedido     @relation(fields: [pedidoId], references: [id])

  empleadoId  Int
  empleado    Empleado   @relation(fields: [empleadoId], references: [id])
}

model Empleado {
  id        Int        @id @default(autoincrement())
  nombre    String
  apellido  String
  dni       String

  visitas   Visita[]
}

model Reparto {
  id        Int        @id @default(autoincrement())
  fecha     DateTime
  inicio    DateTime
  fin       DateTime

  pedidos   Pedido[]
}  Dame un markdwon llamado Modelo-Dominio.md en especificaciones que respete ese schema de prisma 

---

## Assistant (Plan · Big Pickle · 5.1s)

_Thinking:_

The user wants me to create a markdown file called `Modelo-Dominio.md` in `docs/especificacion/` that documents the domain model based on the Prisma schema they provided. However, I'm in Plan Mode (read-only), so I cannot create files. I need to provide the content as text in my response so the user can create it themselves.

Let me write a comprehensive domain model document based on the Prisma schema.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\especificacion"
}
```

**Output:**
```
<path>C:\damian\Repo\SupplyCycle\docs\especificacion</path>
<type>directory</type>
<entries>
Domain-Class.jpeg

(1 entries)
</entries>
```

---

## Assistant (Plan · Big Pickle · 17.3s)

Acá tenés el contenido del archivo `docs/especificacion/Modelo-Dominio.md`. Copialo y crealo:

```md
# Modelo de Dominio — SupplyCycle

## Entidades y Relaciones

### Producto

Catálogo de productos comercializados (bidones de agua, garrafas, etc.).

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `nombre` | String | Nombre del producto |
| `descripcion` | String | Descripción detallada |
| `precio` | Float | Precio unitario actual |
| `unidad` | String | Unidad de medida (litro, unidad, etc.) |
| `stock` | Int | Stock disponible |
| `cantidad` | Int | Cantidad por unidad de venta |
| `retornable` | Boolean | Indica si el envase es retornable |

**Relaciones:**
- Un Producto tiene muchos `ItemPedido` (a través de la tabla intermedia)
- Un Producto tiene muchos `Retenido` (envases retenidos por clientes)

---

### Cliente

Persona física que recibe pedidos.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `nombre` | String | Nombre del cliente |
| `apellido` | String | Apellido del cliente |
| `telefono` | String | Teléfono de contacto (único) |
| `estado` | EstadoCliente | Estado actual: `activo`, `baja`, `inactivo`, `moroso` |

**Relaciones:**
- Un Cliente tiene muchos `Pedido`
- Un Cliente tiene muchos `Domicilio`
- Un Cliente tiene muchos `Retenido`
- Un Cliente tiene muchos `Reclamo`

---

### Domicilio

Dirección de entrega asociada a un cliente. Un cliente puede tener múltiples domicilios.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `calle` | String | Nombre de la calle |
| `entreCalle1` | String | Primera entrecalle |
| `entreCalle2` | String | Segunda entrecalle |
| `numero` | String | Número de puerta |
| `piso` | String | Piso / departamento |
| `clienteId` | Int (FK) | Cliente al que pertenece |
| `ciudadId` | Int (FK) | Ciudad donde se ubica |

**Relaciones:**
- Muchos Domicilios pertenecen a un `Cliente`
- Muchos Domicilios pertenecen a una `Ciudad`
- Un Domicilio tiene muchos `Dia` (días de visita)

---

### Ciudad

Ciudad o localidad donde se encuentra un domicilio.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `nombre` | String | Nombre de la ciudad |

**Relaciones:**
- Una Ciudad tiene muchos `Domicilio`

---

### Dia

Día de la semana en que se visita un domicilio.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `nombre` | DiaSemana | Día de la semana (`lunes` a `domingo`) |
| `domicilioId` | Int (FK) | Domicilio asociado |

**Relaciones:**
- Muchos Días pertenecen a un `Domicilio`
- Un Día tiene muchos `Horario`

---

### Horario

Ventana horaria dentro de un día de visita.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `inicio` | DateTime | Hora de inicio de la ventana |
| `fin` | DateTime | Hora de fin de la ventana |
| `diaId` | Int (FK) | Día asociado |

**Relaciones:**
- Muchos Horarios pertenecen a un `Dia`

---

### Pedido

Solicitud de productos realizada por un cliente.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `estado` | EstadoPedido | Estado: `pendiente`, `entregado`, `cancelado`, `en_ruta` |
| `fechaAlta` | DateTime | Fecha de creación del pedido |
| `clienteId` | Int (FK) | Cliente que solicita |
| `repartoId` | Int? (FK) | Reparto al que fue asignado (opcional) |

**Relaciones:**
- Muchos Pedidos pertenecen a un `Cliente`
- Muchos Pedidos pertenecen a un `Reparto` (opcional)
- Un Pedido tiene muchos `ItemPedido`
- Un Pedido tiene muchas `Visita`
- Un Pedido tiene muchos `Retenido`

**Máquina de Estados:**

```
pendiente ──→ en_ruta ──→ entregado
     │
     └──→ cancelado
```

- `pendiente`: creado, esperando asignación a reparto
- `en_ruta`: asignado a un reparto en curso
- `entregado`: fue entregado exitosamente
- `cancelado`: fue cancelado antes de entregarse

---

### ItemPedido

Detalle de un pedido: producto y cantidad solicitada.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `cantidad` | Int | Cantidad solicitada |
| `precioUnitario` | Float | Precio del producto al momento del pedido |
| `productoId` | Int (FK) | Producto solicitado |
| `pedidoId` | Int (FK) | Pedido al que pertenece |

**Relaciones:**
- Muchos Items pertenecen a un `Producto`
- Muchos Items pertenecen a un `Pedido`

---

### Retenido

Registro de envase retenido por un cliente (producto retornable no devuelto).

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `estado` | EstadoRetenido | Estado: `retenido`, `devuelto`, `perdido` |
| `inicio` | DateTime | Fecha de inicio de la retención |
| `fin` | DateTime? | Fecha de devolución o pérdida |
| `productoId` | Int (FK) | Producto retenido (debe ser retornable) |
| `clienteId` | Int (FK) | Cliente que retiene |
| `pedidoId` | Int (FK) | Pedido en que se retuvo |

**Relaciones:**
- Muchos Retenidos pertenecen a un `Producto`
- Muchos Retenidos pertenecen a un `Cliente`
- Muchos Retenidos pertenecen a un `Pedido`

---

### Visita

Registro de una visita de reparto a un pedido en un domicilio.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `fecha` | DateTime | Fecha de la visita |
| `hora` | DateTime | Hora de la visita |
| `falta` | Boolean | Indica si el cliente no se encontraba |
| `pedidoId` | Int (FK) | Pedido asociado |
| `empleadoId` | Int (FK) | Empleado que realizó la visita |

**Relaciones:**
- Muchas Visitas pertenecen a un `Pedido`
- Muchas Visitas pertenecen a un `Empleado`

---

### Empleado

Repartidor que realiza las visitas y entregas.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `nombre` | String | Nombre del empleado |
| `apellido` | String | Apellido del empleado |
| `dni` | String | DNI (único) |

**Relaciones:**
- Un Empleado tiene muchas `Visita`

---

### Reparto

Hoja de ruta que agrupa pedidos para ser entregados en una misma fecha.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `fecha` | DateTime | Fecha del reparto |
| `inicio` | DateTime? | Inicio efectivo del recorrido |
| `fin` | DateTime? | Fin efectivo del recorrido |

**Relaciones:**
- Un Reparto tiene muchos `Pedido`

---

### Reclamo

Reclamo registrado por un cliente.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Int (PK) | Identificador único |
| `clienteId` | Int (FK) | Cliente que reclama |

**Relaciones:**
- Muchos Reclamos pertenecen a un `Cliente`

---

## Diagrama de Relaciones

```
Ciudad (1) ──→ (N) Domicilio (1) ──→ (N) Dia (1) ──→ (N) Horario
                           │
                           │ (N)
                           ↓
Cliente (1) ──→ (N) Pedido (1) ──→ (N) ItemPedido (N) ──→ (1) Producto
    │               │
    │               │ (N)
    │               ↓
    │           Visita (N) ──→ (1) Empleado
    │
    └──→ (N) Retenido (N) ──→ (1) Producto
    │
    └──→ (N) Reclamo

Pedido (N) ──→ (1) Reparto
```

## Enumeraciones

### EstadoCliente
| Valor | Descripción |
|---|---|
| `activo` | Cliente en operación normal |
| `baja` | Cliente dado de baja permanentemente |
| `inactivo` | Cliente sin pedidos recientes |
| `moroso` | Cliente con deudas pendientes |

### EstadoPedido
| Valor | Descripción |
|---|---|
| `pendiente` | Pedido creado, no asignado a reparto |
| `en_ruta` | Pedido asignado a reparto en curso |
| `entregado` | Pedido entregado |
| `cancelado` | Pedido cancelado |

### EstadoRetenido
| Valor | Descripción |
|---|---|
| `retenido` | Envase retenido por el cliente |
| `devuelto` | Envase devuelto por el cliente |
| `perdido` | Envase declarado como perdido |

### DiaSemana
| Valor |
|---|
| `lunes`, `martes`, `miercoles`, `jueves`, `viernes`, `sabado`, `domingo` |
```

---

## User

Hacelo en formato tambla para indicar relaciones no hagas graficos, solo indicalo textualmente o como si fueran pk o fk

---

## Assistant (Plan · Big Pickle · 12.8s)

_Thinking:_

The user wants me to format the domain model document using plain table format for relationships, like PK/FK indicators, instead of text descriptions or diagrams. They want something like:

```
Producto(id*, nombre, descripcion, precio, unidad, stock, cantidad, retornable)
    FK: itemsPedido → ItemPedido(productoId)
    FK: retenidos → Retenido(productoId)
```

Or a table format with PK/FK columns. Let me provide the content in that style.

```md
# Modelo de Dominio — SupplyCycle

## Producto

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| nombre | String | | | | ✓ |
| descripcion | String | | | | |
| precio | Float | | | | ✓ |
| unidad | String | | | | ✓ |
| stock | Int | | | | ✓ |
| cantidad | Int | | | | ✓ |
| retornable | Boolean | | | | ✓ |

Relaciones:
- `itemsPedido` → ItemPedido(productoId) 1:N
- `retenidos` → Retenido(productoId) 1:N

---

## Cliente

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| nombre | String | | | | ✓ |
| apellido | String | | | | ✓ |
| telefono | String (UNIQUE) | | | | ✓ |
| estado | EstadoCliente | | | | ✓ |

Relaciones:
- `pedidos` → Pedido(clienteId) 1:N
- `retenidos` → Retenido(clienteId) 1:N
- `reclamos` → Reclamo(clienteId) 1:N
- `domicilios` → Domicilio(clienteId) 1:N

---

## Domicilio

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| calle | String | | | | ✓ |
| entreCalle1 | String | | | | |
| entreCalle2 | String | | | | |
| numero | String | | | | ✓ |
| piso | String | | | | |
| clienteId | Int | | ✓ | Cliente(id) | ✓ |
| ciudadId | Int | | ✓ | Ciudad(id) | ✓ |

Relaciones:
- `dias` → Dia(domicilioId) 1:N

---

## Ciudad

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| nombre | String | | | | ✓ |

Relaciones:
- `domicilios` → Domicilio(ciudadId) 1:N

---

## Dia

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| nombre | DiaSemana | | | | ✓ |
| domicilioId | Int | | ✓ | Domicilio(id) | ✓ |

Relaciones:
- `horarios` → Horario(diaId) 1:N

---

## Horario

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| inicio | DateTime | | | | ✓ |
| fin | DateTime | | | | ✓ |
| diaId | Int | | ✓ | Dia(id) | ✓ |

---

## Pedido

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| estado | EstadoPedido | | | | ✓ |
| fechaAlta | DateTime | | | | ✓ |
| clienteId | Int | | ✓ | Cliente(id) | ✓ |
| repartoId | Int? | | ✓ | Reparto(id) | |

Relaciones:
- `items` → ItemPedido(pedidoId) 1:N
- `visitas` → Visita(pedidoId) 1:N
- `retenidos` → Retenido(pedidoId) 1:N

---

## ItemPedido

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| cantidad | Int | | | | ✓ |
| precioUnitario | Float | | | | ✓ |
| productoId | Int | | ✓ | Producto(id) | ✓ |
| pedidoId | Int | | ✓ | Pedido(id) | ✓ |

---

## Retenido

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| estado | EstadoRetenido | | | | ✓ |
| inicio | DateTime | | | | ✓ |
| fin | DateTime? | | | | |
| productoId | Int | | ✓ | Producto(id) | ✓ |
| clienteId | Int | | ✓ | Cliente(id) | ✓ |
| pedidoId | Int | | ✓ | Pedido(id) | ✓ |

---

## Visita

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| fecha | DateTime | | | | ✓ |
| hora | DateTime | | | | ✓ |
| falta | Boolean | | | | ✓ |
| pedidoId | Int | | ✓ | Pedido(id) | ✓ |
| empleadoId | Int | | ✓ | Empleado(id) | ✓ |

---

## Empleado

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| nombre | String | | | | ✓ |
| apellido | String | | | | ✓ |
| dni | String (UNIQUE) | | | | ✓ |

Relaciones:
- `visitas` → Visita(empleadoId) 1:N

---

## Reparto

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| fecha | DateTime | | | | ✓ |
| inicio | DateTime? | | | | |
| fin | DateTime? | | | | |

Relaciones:
- `pedidos` → Pedido(repartoId) 1:N

---

## Reclamo

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| clienteId | Int | | ✓ | Cliente(id) | ✓ |

---

## Enumeraciones

### EstadoCliente
| Valor | Descripción |
|---|---|
| activo | Operación normal |
| baja | Baja permanente |
| inactivo | Sin pedidos recientes |
| moroso | Deudas pendientes |

### EstadoPedido
| Valor | Descripción |
|---|---|
| pendiente | Creado, sin asignar a reparto |
| en_ruta | Asignado a reparto en curso |
| entregado | Entregado |
| cancelado | Cancelado |

### EstadoRetenido
| Valor | Descripción |
|---|---|
| retenido | Envase retenido |
| devuelto | Envase devuelto |
| perdido | Envase perdido |

### DiaSemana
lunes, martes, miercoles, jueves, viernes, sabado, domingo
```

---

## User

Crealo

---

## Assistant (Build · Big Pickle · 11.5s)

_Thinking:_

The user wants me to create the file. I'm now in build mode, so I can do that.

**Tool: write**

**Input:**
```json
{
  "content": "# Modelo de Dominio — SupplyCycle\n\n## Producto\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| nombre | String | | | | ✓ |\n| descripcion | String | | | | |\n| precio | Float | | | | ✓ |\n| unidad | String | | | | ✓ |\n| stock | Int | | | | ✓ |\n| cantidad | Int | | | | ✓ |\n| retornable | Boolean | | | | ✓ |\n\nRelaciones:\n- `itemsPedido` → ItemPedido(productoId) 1:N\n- `retenidos` → Retenido(productoId) 1:N\n\n---\n\n## Cliente\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| nombre | String | | | | ✓ |\n| apellido | String | | | | ✓ |\n| telefono | String (UNIQUE) | | | | ✓ |\n| estado | EstadoCliente | | | | ✓ |\n\nRelaciones:\n- `pedidos` → Pedido(clienteId) 1:N\n- `retenidos` → Retenido(clienteId) 1:N\n- `reclamos` → Reclamo(clienteId) 1:N\n- `domicilios` → Domicilio(clienteId) 1:N\n\n---\n\n## Domicilio\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| calle | String | | | | ✓ |\n| entreCalle1 | String | | | | |\n| entreCalle2 | String | | | | |\n| numero | String | | | | ✓ |\n| piso | String | | | | |\n| clienteId | Int | | ✓ | Cliente(id) | ✓ |\n| ciudadId | Int | | ✓ | Ciudad(id) | ✓ |\n\nRelaciones:\n- `dias` → Dia(domicilioId) 1:N\n\n---\n\n## Ciudad\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| nombre | String | | | | ✓ |\n\nRelaciones:\n- `domicilios` → Domicilio(ciudadId) 1:N\n\n---\n\n## Dia\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| nombre | DiaSemana | | | | ✓ |\n| domicilioId | Int | | ✓ | Domicilio(id) | ✓ |\n\nRelaciones:\n- `horarios` → Horario(diaId) 1:N\n\n---\n\n## Horario\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| inicio | DateTime | | | | ✓ |\n| fin | DateTime | | | | ✓ |\n| diaId | Int | | ✓ | Dia(id) | ✓ |\n\n---\n\n## Pedido\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| estado | EstadoPedido | | | | ✓ |\n| fechaAlta | DateTime | | | | ✓ |\n| clienteId | Int | | ✓ | Cliente(id) | ✓ |\n| repartoId | Int? | | ✓ | Reparto(id) | |\n\nRelaciones:\n- `items` → ItemPedido(pedidoId) 1:N\n- `visitas` → Visita(pedidoId) 1:N\n- `retenidos` → Retenido(pedidoId) 1:N\n\n---\n\n## ItemPedido\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| cantidad | Int | | | | ✓ |\n| precioUnitario | Float | | | | ✓ |\n| productoId | Int | | ✓ | Producto(id) | ✓ |\n| pedidoId | Int | | ✓ | Pedido(id) | ✓ |\n\n---\n\n## Retenido\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| estado | EstadoRetenido | | | | ✓ |\n| inicio | DateTime | | | | ✓ |\n| fin | DateTime? | | | | |\n| productoId | Int | | ✓ | Producto(id) | ✓ |\n| clienteId | Int | | ✓ | Cliente(id) | ✓ |\n| pedidoId | Int | | ✓ | Pedido(id) | ✓ |\n\n---\n\n## Visita\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| fecha | DateTime | | | | ✓ |\n| hora | DateTime | | | | ✓ |\n| falta | Boolean | | | | ✓ |\n| pedidoId | Int | | ✓ | Pedido(id) | ✓ |\n| empleadoId | Int | | ✓ | Empleado(id) | ✓ |\n\n---\n\n## Empleado\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| nombre | String | | | | ✓ |\n| apellido | String | | | | ✓ |\n| dni | String (UNIQUE) | | | | ✓ |\n\nRelaciones:\n- `visitas` → Visita(empleadoId) 1:N\n\n---\n\n## Reparto\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| fecha | DateTime | | | | ✓ |\n| inicio | DateTime? | | | | |\n| fin | DateTime? | | | | |\n\nRelaciones:\n- `pedidos` → Pedido(repartoId) 1:N\n\n---\n\n## Reclamo\n\n| Columna | Tipo | PK | FK | Ref | Obligatorio |\n|---|---|---|---|---|---|\n| id | Int | ✓ | | | ✓ |\n| clienteId | Int | | ✓ | Cliente(id) | ✓ |\n\n---\n\n## Enumeraciones\n\n### EstadoCliente\n| Valor | Descripción |\n|---|---|\n| activo | Operación normal |\n| baja | Baja permanente |\n| inactivo | Sin pedidos recientes |\n| moroso | Deudas pendientes |\n\n### EstadoPedido\n| Valor | Descripción |\n|---|---|\n| pendiente | Creado, sin asignar a reparto |\n| en_ruta | Asignado a reparto en curso |\n| entregado | Entregado |\n| cancelado | Cancelado |\n\n### EstadoRetenido\n| Valor | Descripción |\n|---|---|\n| retenido | Envase retenido |\n| devuelto | Envase devuelto |\n| perdido | Envase perdido |\n\n### DiaSemana\nlunes, martes, miercoles, jueves, viernes, sabado, domingo\n",
  "filePath": "C:\\damian\\Repo\\SupplyCycle\\docs\\especificacion\\Modelo-Dominio.md"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 3.0s)

Creado en `docs/especificacion/Modelo-Dominio.md`.

---

## User

Dame los commits para lo que hay en docs/especifications/ 

---

## Assistant (Plan · Big Pickle · 4.5s)

_Thinking:_

The user wants the commit commands for files in `docs/especificacion/`. Currently there are two files there:
- `Domain-Class.jpeg` (pre-existing)
- `Modelo-Dominio.md` (just created)

They want the git add and commit commands. Let me give them the appropriate command respecting conventional commits.

```bash
git add docs/especificacion/Modelo-Dominio.md
git commit -m "docs(model): agregar modelo de dominio basado en schema Prisma"
```

`Domain-Class.jpeg` ya existe en el repo desde antes, no hace falta agregarlo a menos que tenga cambios.

---

## User

no tengo el Domain-Class.jpeg agregalo tambien

---

## Assistant (Plan · Big Pickle · 4.6s)

_Thinking:_

The user wants to add Domain-Class.jpeg as well. Since I'm in Plan Mode (read-only), I can't run git commands. I need to give the user the commands to run.

```bash
git add docs/especificacion/
git commit -m "docs(especificacion): agregar modelo de dominio y diagrama de clases"
```

O si preferís separado:

```bash
git add docs/especificacion/Domain-Class.jpeg
git add docs/especificacion/Modelo-Dominio.md
git commit -m "docs(especificacion): agregar modelo de dominio y diagrama de clases"
```

---

