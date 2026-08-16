# 🧪 TESTING — Cómo testear cada módulo

Guía de testing para los tres módulos del monorepo. Todos usan **Vitest** con el mismo stack de base, pero cada módulo tiene su propia configuración y particularidades.

---

## Tabla de contenidos

- [Requisitos comunes](#requisitos-comunes)
- [🗄️ Backend](#️-backend)
- [📱 Mobile](#-mobile)
- [💬 WhatsApp Bot](#-whatsapp-bot)
- [Buenas prácticas](#buenas-prácticas)

---

## Requisitos comunes

- **Node.js 20+**
- **npm**
- Instalar dependencias del módulo antes de testear: `npm install` dentro de cada uno

Ningún test requiere base de datos ni servicios externos: todos corren con mocks.

---

## 🗄️ Backend

**Directorio:** `backend/` · **Framework:** Vitest 4 + Supertest

### Comandos

| Comando | Descripción |
|---|---|
| `npm test` | Ejecuta todos los tests (una vez) |
| `npm run test:watch` | Ejecuta en modo watch (re-ejecuta al guardar) |
| `npm run test:coverage` | Ejecuta tests + reporte de cobertura |

### Ejecutar un subconjunto de tests

```bash
# Un solo archivo
npx vitest run src/features/auth/__tests__/auth.service.test.ts

# Una feature completa
npx vitest run src/features/pedidos

# Por patrón de nombre
npx vitest run -t "login"
```

### Estructura de los tests

Los tests viven en `__tests__/` junto al código que prueban:

```
src/
├── app.logging.test.ts                 # smoke del arranque de la app
├── config/__tests__/                   # validación de env (Zod)
├── features/<feature>/__tests__/       # por feature:
│   ├── *.controller.test.ts            #   handlers HTTP (req/res)
│   ├── *.service.test.ts               #   lógica de negocio
│   ├── *.routes.test.ts                #   rutas end-to-end con Supertest
│   └── *.test.ts                       #   utilidades específicas (dedupe, frecuencia…)
├── lib/__tests__/                      # utilidades compartidas (ciudad, logger, fechas…)
└── middleware/__tests__/               # auth middleware
```

### Patrones a respetar (importante)

1. **Mockear Prisma**: cada test de routes/controller mocks `lib/prisma.ts` con `vi.mock(...)` (ver `src/test-utils/auth-token.ts`).
2. **Silenciar el logger**: se mockea `lib/logger.ts` con una instancia pino `level: 'silent'`.
3. **Stub de env antes de importar la app**: `NODE_ENV=test`, `JWT_SECRET`, `BOT_API_KEY` y `SESSION_SECRET` se setean **antes** del import dinámico de `app.js` (patrón D6). Importar la app solo dentro de `beforeAll`/`afterEach`.
4. **Tokens**: usar `makeToken(rol)` de `src/test-utils/auth-token.ts` para autenticar requests.

### Cobertura

`npm run test:coverage` aplica umbrales configurados en `vitest.config.ts`:

- Provider: `v8`
- Incluye: `src/features/pedidos/**/*.ts`
- Umbrales: **80%** de statements, branches, functions y lines

> 💡 Para correr cobertura sobre todo el código, ajustá `coverage.include` en `vitest.config.ts`.

---

## 📱 Mobile

**Directorio:** `mobile/` · **Framework:** Vitest 4 + Testing Library para React Native

### Comandos

| Comando | Descripción |
|---|---|
| `npm test` | Ejecuta en modo watch |
| `npm run test:run` | Ejecuta todos los tests (una vez) |
| `npm run lint` | ESLint (no es testing, pero se recomienda antes de testear) |

### Configuración

- `vitest.config.ts` — incluye `**/*.test.{ts,tsx}`, alias `@/` → raíz del proyecto, y `setupFiles` con `test-setup.ts`.
- `test-setup.ts` — mockeo global de módulos nativos: `react-native`, `expo-router`, `expo-secure-store`, `expo-location`, `@tanstack/react-query`, `react-native-reanimated`, `@expo/vector-icons`, `async-storage`, etc.
- `__mocks__/` — mocks manuales adicionales (`react-native`, `@expo/vector-icons`).
- `scripts/rn-mock-hook.js` — hook de Node que se inyecta con `execArgv` en el config.

### Estructura de los tests

Se prueban las distintas capas, cada una con su `__tests__/`:

```
├── components/ui/__tests__/            # componentes de UI (button, card, input…)
├── features/<feature>/
│   ├── screens/__tests__/              # pantallas completas (render + interacción)
│   ├── hooks/__tests__/                # hooks de datos (useClientes, useReparto…)
│   └── services/__tests__/             # clientes HTTP por entidad
├── services/__tests__/                 # api client + handleApiError + genéricos
├── stores/__tests__/                   # stores Zustand (auth, offline)
├── hooks/__tests__/                    # hooks globales (use-theme-color)
├── utils/__tests__/                    # helpers (date, confirmAction…)
├── lib/__tests__/                      # utilidades (haversine…)
└── mocks/__tests__/                    # datos mock de desarrollo
```

### Ejecutar un subconjunto de tests

```bash
# Un solo archivo
npx vitest run components/ui/__tests__/button.test.tsx

# Una feature completa
npx vitest run features/pedidos

# Solo pantallas
npx vitest run features/repartos/screens
```

> 💡 Como los mocks son globales (`test-setup.ts`), la mayoría de los tests no requiere levantar la app ni un backend real.

---

## 💬 WhatsApp Bot

**Directorio:** `whatsapp-bot/` · **Framework:** Vitest 4

### Comandos

| Comando | Descripción |
|---|---|
| `npm test` | Ejecuta en modo watch |
| `npm run test:run` | Ejecuta todos los tests (una vez) |
| `npm run test:coverage` | Ejecuta tests + reporte de cobertura |
| `npm run lint` | ESLint (se recomienda antes de testear) |

### Ejecutar un subconjunto de tests

```bash
# Un solo archivo
npx vitest run src/flows/__tests__/alta.flow.test.ts

# Un directorio
npx vitest run src/services
```

### Estructura de los tests

```
src/
├── flows/__tests__/                    # flujos conversacionales
│   ├── welcome.flow.smoke.test.ts      #   smoke: el flujo arranca y responde
│   ├── alta.flow.test.ts               #   unit: flujo de alta de cliente
│   ├── pedido.flow.smoke.test.ts       #   smoke: flujo de pedido
│   ├── cancelar.flow.test.ts           #   unit: cancelación con motivo
│   ├── reclamo.flow.smoke.test.ts      #   smoke: flujo de reclamo
│   └── baja.flow.smoke.test.ts         #   smoke: flujo de baja
├── routes/__tests__/                   # endpoints HTTP propios (send-message…)
└── services/__tests__/                 # clientes hacia la API del backend
```

### Particularidades

- Los tests de **smoke** (`*.smoke.test.ts`) verifican que el flujo se construye y responde sin crashear, sin conexión real a WhatsApp.
- Los tests de **services** mockean `lib/axios.ts`, así que no requieren un backend real corriendo.
- Los tests de **routes** prueban los endpoints HTTP con Supertest.

---

## Buenas prácticas

- **Nunca** dependas de una base de datos, red o servicios externos: usá `vi.mock()` y datos fabricados.
- Los tests de rutas del backend **deben** setear las variables de entorno y mockear Prisma antes de importar la app (patrón D6) — si rompés ese orden, los tests fallan de forma intermitente.
- Para correr los tests de **todo el monorepo a la vez**, ejecutá `npm test` dentro de cada módulo por separado (no hay script raíz de tests).
- Antes de abrir un PR: corré `npm test` **y** `npm run lint` en el/los módulo(s) afectado(s).

---

## 📚 Referencias

- [README](../README.md) — estructura general del monorepo
- Configuración de Vitest: `backend/vitest.config.ts`, `mobile/vitest.config.ts`, `whatsapp-bot/vitest.config.ts`
- Patrón D6 y test-utils del backend: `backend/src/test-utils/auth-token.ts`