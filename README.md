<div align="center">

# 🚚 SupplyCycle

**Plataforma integral para la gestión del ciclo de entregas**

Automatiza la logística de reparto de envases de agua: pedidos, rutas y comunicación con el cliente desde una sola solución.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Status](https://img.shields.io/badge/Estado-MVP-ff69b4.svg)

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp_Bot-25D366?logo=whatsapp&logoColor=white)

</div>

---

## ✨ ¿Qué es?

SupplyCycle es un **MVP** desarrollado para la materia **Desarrollo de Aplicaciones Móviles** de la **Universidad Tecnológica Nacional**. Integra tres frentes de la operación de reparto de envases de agua:

| Frente | Stack | Funcionalidades |
|---|---|---|
| 🗄️ `backend/` | Express 5, TypeScript, Prisma 7, PostgreSQL | API REST versionada (`/api/v1`) con autenticación JWT por roles (`ADMIN`, `REPARTIDOR`, `BOT`), gestión de clientes, domicilios, pedidos, repartos, ítems, usuarios, reclamos y estadísticas; panel de administración web (EJS + sesiones); scheduler de detección de envases demorados (RF-12) con recordatorios por WhatsApp |
| 📱 `mobile/` | React Native 0.81, Expo SDK 54, Expo Router | App del repartidor con 8 pestañas (Inicio, Repartos, Pedidos, Mapa, Clientes, Estadísticas, Usuarios, Perfil); login con JWT (SecureStore); flujo de confirmación y cancelación de entregas; modo offline con caché y cola de sincronización |
| 💬 `whatsapp-bot/` | BuilderBot 1.4, Baileys, TypeScript | Menú conversacional para clientes por WhatsApp: **alta**, **pedir**, **cancelar** (con motivo), **reclamo** y **baja**; se autentica contra la API con `x-api-key`; expone endpoints propios para envío de mensajes y blacklist |

---

## 🏗️ Cómo funciona

```
mobile app ──(JWT)──▶ API backend ──▶ PostgreSQL
whatsapp-bot ──(x-api-key)──▶ API backend
backend (scheduler RF-12) ──(POST /v1/send-message)──▶ whatsapp-bot ──▶ WhatsApp
admin web (EJS, servida por el backend) ──▶ PostgreSQL
```

```mermaid
flowchart LR
    subgraph usuarios["👥 Usuarios"]
        mobile["📱 App móvil (repartidor)"]
        wa["💬 WhatsApp (cliente)"]
        browser["🖥️ Navegador (administración)"]
    end

    subgraph backend["🗄️ Backend — Express + Prisma"]
        api["API REST /api/v1"]
        panel["Panel admin (EJS + sesión)"]
        scheduler["⏰ Scheduler RF-12 (envases demorados)"]
    end

    bot["🤖 WhatsApp Bot (BuilderBot + Baileys)"]
    db[("🐘 PostgreSQL")]

    mobile -- "JWT (Bearer)" --> api
    wa -- "mensajes" --> bot
    browser --> panel

    bot -- "x-api-key · clientes, items, pedidos, reclamos" --> api
    api -- "POST /v1/send-message (x-bot-api-key)" --> bot
    scheduler -- "POST /v1/send-message (x-bot-api-key)" --> bot

    api --> db
    panel --> db
    scheduler --> db
```

### Canales de integración

| Canal | Cómo se autentica | Uso |
|---|---|---|
| `mobile → backend` | JWT (`Authorization: Bearer`) | Repartidores y administradores consumen la API |
| `whatsapp-bot → backend` | Header `x-api-key` (`BOT_API_KEY`) | El bot consulta clientes, ítems y pedidos; crea pedidos, cancelaciones y reclamos |
| `backend → whatsapp-bot` | Header `x-bot-api-key` (`BOT_API_KEY_OUTGOING`) | El scheduler RF-12 envía recordatorios de envases demorados (`POST /v1/send-message`) |
| `browser → backend` | Sesión (`express-session`) | Panel de administración EJS (ruta `/admin`) |

---

## 📂 Estructura del monorepo

```
├── backend/               🗄️  API REST (Express + TypeScript + Prisma + PostgreSQL)
├── mobile/                📱  App móvil (React Native + Expo Router)
├── whatsapp-bot/          💬  Bot de WhatsApp (BuilderBot + Baileys)
├── docs/                  📚  ADRs, TDDs, diagramas, especificación y skill-registry
├── docker-compose.dev.yml 🐳  Entorno de desarrollo (PostgreSQL + backend + pgAdmin)
├── package.json           🔧  Husky + commitlint (raíz del monorepo)
├── CONTRIBUTING.md        🤝  Guía de contribución
└── LICENSE                ⚖️  Licencia MIT
```

---

## 🚀 Puesta en marcha

### Requisitos

- **Node.js 20+** (el backend se desarrolla sobre `node:20-alpine` y Expo SDK 54 requiere Node 20+)
- **npm**
- **Docker + Docker Compose** (solo para el entorno backend + base de datos + pgAdmin)
- Para la app móvil: **Expo Go** o un emulador de Android/iOS
- Para el bot: un teléfono con **WhatsApp** para escanear el código QR

### Entorno completo (backend + PostgreSQL + pgAdmin)

```bash
git clone https://github.com/Damianpiazz/SupplyCycle.git
cd SupplyCycle

docker compose -f docker-compose.dev.yml up --build
```

| Servicio   | URL / Puerto            | Credenciales (dev)             |
| ---------- | ----------------------- | ------------------------------ |
| Backend    | http://localhost:3000   | —                              |
| PostgreSQL | localhost:5433          | `postgres` / `postgres` (db: `supplycycle`) |
| pgAdmin    | http://localhost:5050   | `admin@supplycycle.com` / `admin` |

> ⚠️ `docker compose down -v` elimina los volúmenes (borra datos de la base).
>
> ⚠️ `npx prisma migrate dev` puede ser inestable dentro del contenedor; si falla, aplica las migraciones manualmente desde el host.

### Backend (sin Docker)

```bash
cd backend
npm install
cp .env.example .env
npm run db:generate      # genera el cliente Prisma
npm run db:migrate       # aplica las migraciones
npm run db:seed          # opcional: datos de ejemplo
npm run dev              # servidor en http://localhost:3000
```

### App móvil

```bash
cd mobile
npm install
cp .env.example .env
npm start                # inicia Expo (escanea el QR con Expo Go)
```

### WhatsApp Bot

```bash
cd whatsapp-bot
npm install
cp .env.example .env
npm run dev              # lint + servidor en http://localhost:3008 (escanea el QR)
```

---

## 🔐 Variables de entorno

### `backend/` — `.env.example`

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor HTTP | `3000` |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql://postgres:postgres@localhost:5432/supplycycle` |
| `JWT_SECRET` | Secreto para firmar los tokens JWT | `supplycycle-dev-secret-key-2026` |
| `JWT_EXPIRES_IN` | Vigencia del token | `24h` |
| `BCRYPT_SALT_ROUNDS` | Rondas de salt de bcrypt | `10` |
| `SESSION_SECRET` | Secreto de sesión del panel admin | `supplycycle-session-secret` |
| `CORS_ORIGIN` | Orígenes permitidos para CORS | `*` |
| `LOG_LEVEL` | Nivel de logging (pino) | `debug` |
| `BOT_API_KEY` | API key que el bot usa al llamar al backend (header `x-api-key`) | `sc-bot-dev-key-change-in-production` |
| `BOT_API_URL` | URL base del bot (canal backend → bot) | `http://localhost:3008` |
| `BOT_API_KEY_OUTGOING` | Clave del canal backend → bot (header `x-bot-api-key`) | `sc-bot-outgoing-key-change-in-production` |
| `CRON_ENVASES_DEMORADOS` | Expresión cron del job de detección de envases demorados (RF-12) | `0 8 * * *` |

### `whatsapp-bot/` — `.env.example`

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto HTTP del bot | `3008` |
| `BACKEND_API_URL` | Base de la API del backend que consume el bot | `http://localhost:3000/api/v1` |
| `BOT_API_KEY` | API key del bot hacia el backend (header `x-api-key`) | `sc-bot-dev-key-change-in-production` |
| `BOT_API_KEY_INCOMING` | Clave que el backend usa al llamar al bot (header `x-bot-api-key`) | `sc-bot-outgoing-key-change-in-production` |

### `mobile/` — `.env.example`

Variables públicas (`EXPO_PUBLIC_*`): se embeben en el bundle de la app y **no deben contener secretos**. El archivo de ejemplo las define sin valores por defecto.

| Grupo | Variables | Descripción |
|---|---|---|
| Environment | `EXPO_PUBLIC_ENV`, `EXPO_PUBLIC_APP_NAME`, `EXPO_PUBLIC_APP_VERSION` | Identificación de entorno y de la app |
| API | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_API_TIMEOUT`, `EXPO_PUBLIC_API_RETRY_COUNT`, `EXPO_PUBLIC_API_VERSION` | Configuración del cliente HTTP (URL base, timeout, reintentos, versión) |
| Auth (sin secretos) | `EXPO_PUBLIC_AUTH_ENABLED`, `EXPO_PUBLIC_AUTH_TOKEN_KEY`, `EXPO_PUBLIC_REFRESH_TOKEN_KEY` | Flag de autenticación y claves de almacenamiento de tokens |
| Network / Debug | `EXPO_PUBLIC_ENABLE_LOGS`, `EXPO_PUBLIC_ENABLE_NETWORK_LOGS`, `EXPO_PUBLIC_ENABLE_DEVTOOLS` | Logs y herramientas de depuración |
| Feature flags | `EXPO_PUBLIC_FEATURE_CHAT`, `EXPO_PUBLIC_FEATURE_NOTIFICATIONS`, `EXPO_PUBLIC_FEATURE_ANALYTICS`, `EXPO_PUBLIC_FEATURE_DARK_MODE` | Activación de funcionalidades |
| Push notifications | `EXPO_PUBLIC_PUSH_NOTIFICATIONS_ENABLED`, `EXPO_PUBLIC_PUSH_PROVIDER` | Notificaciones push |
| Location / Maps | `EXPO_PUBLIC_MAPS_PROVIDER`, `EXPO_PUBLIC_MAPS_REGION`, `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`, `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` | Proveedor de mapas y región inicial |
| Analytics | `EXPO_PUBLIC_ANALYTICS_PROVIDER`, `EXPO_PUBLIC_SEGMENT_WRITE_KEY` | Proveedor de analítica |
| Testing | `EXPO_PUBLIC_USE_MOCKS`, `EXPO_PUBLIC_MOCK_DELAY` | Uso de datos mock y delay simulado |
| Misc | `EXPO_PUBLIC_DEFAULT_LANGUAGE`, `EXPO_PUBLIC_SUPPORTED_LANGUAGES` | Idioma por defecto e idiomas soportados |

---

## 🔌 API principal

Base URL: `http://localhost:3000` (backend) · `http://localhost:3008` (bot).

### Backend — `/api/v1`

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `GET` | `/health` | Health check del servidor | público |
| `POST` | `/api/v1/auth/login` | Inicia sesión y devuelve el JWT | público |
| `GET` | `/api/v1/auth/me` | Devuelve el usuario autenticado | token |
| `PATCH` | `/api/v1/auth/me` | Actualiza el perfil del usuario autenticado | token |
| `GET` | `/api/v1/clientes` | Lista clientes | API key + token |
| `GET` | `/api/v1/clientes/:id` | Obtiene un cliente | API key + token |
| `GET` | `/api/v1/clientes/:id/historial` | Historial del cliente | API key + token |
| `GET` | `/api/v1/clientes/:id/consumo` | Consumo del cliente | API key + token |
| `GET` | `/api/v1/clientes/:id/frecuencia` | Frecuencia de compra del cliente | API key + token |
| `GET` | `/api/v1/clientes/:id/pedidos` | Pedidos del cliente | API key + token |
| `GET` | `/api/v1/clientes/:id/demanda` | Demanda estimada del cliente | API key + token |
| `POST` | `/api/v1/clientes` | Crea un cliente | `ADMIN` / `BOT` |
| `PATCH` | `/api/v1/clientes/:id` | Actualiza un cliente | `ADMIN` / `BOT` |
| `DELETE` | `/api/v1/clientes/:id` | Elimina un cliente | `ADMIN` |
| `GET` / `POST` | `/api/v1/domicilios` | Lista / crea domicilios | token / `ADMIN` |
| `GET` / `PATCH` / `DELETE` | `/api/v1/domicilios/:id` | Obtiene / actualiza / elimina un domicilio | token / `ADMIN` |
| `POST` / `PATCH` / `DELETE` | `/api/v1/domicilios/:domicilioId/dias[/:diaId]` | Administra días de entrega | `ADMIN` |
| `POST` / `PATCH` / `DELETE` | `/api/v1/domicilios/:domicilioId/dias/:diaId/horarios[/:horarioId]` | Administra horarios de entrega | `ADMIN` |
| `GET` | `/api/v1/items` | Lista ítems (productos) | API key + token |
| `GET` | `/api/v1/items/:id` | Obtiene un ítem | API key + token |
| `GET` | `/api/v1/pedidos/hoy` | Pedidos de hoy | API key + token |
| `GET` | `/api/v1/pedidos/disponibles` | Pedidos disponibles para reparto | `ADMIN` |
| `GET` | `/api/v1/pedidos` | Lista pedidos | API key + token |
| `GET` | `/api/v1/pedidos/:id` | Obtiene un pedido | API key + token |
| `POST` | `/api/v1/pedidos` | Crea un pedido | `ADMIN` / `REPARTIDOR` / `BOT` |
| `PATCH` | `/api/v1/pedidos/:id/estado` | Actualiza el estado del pedido | `ADMIN` / `REPARTIDOR` |
| `DELETE` | `/api/v1/pedidos/:id` | Elimina un pedido | `ADMIN` |
| `POST` / `PATCH` / `DELETE` | `/api/v1/pedidos/:pedidoId/items[/:itemId]` | Administra los ítems de un pedido | según acción |
| `PATCH` | `/api/v1/pedidos/:id/confirmar` | Confirma la entrega del pedido | `REPARTIDOR` |
| `PATCH` | `/api/v1/pedidos/:id/cancelar` | Cancela el pedido (repartidor) | `REPARTIDOR` |
| `PATCH` | `/api/v1/pedidos/:id/cancelar-cliente` | Cancela el pedido por pedido del cliente | `ADMIN` / `BOT` |
| `GET` | `/api/v1/repartos` | Lista repartos | token |
| `GET` | `/api/v1/repartos/hoy` | Reparto del día (repartidor) | `REPARTIDOR` |
| `POST` | `/api/v1/repartos` | Crea un reparto | `ADMIN` |
| `GET` | `/api/v1/repartos/admin` | Lista repartos (vista admin) | `ADMIN` |
| `GET` | `/api/v1/repartos/admin/:id` | Obtiene un reparto (vista admin) | `ADMIN` |
| `POST` / `DELETE` | `/api/v1/repartos/admin/:repartoId/pedidos[/:pedidoId]` | Asigna / quita pedidos del reparto | `ADMIN` |
| `GET` | `/api/v1/repartos/:id` | Obtiene un reparto | token |
| `GET` | `/api/v1/repartos/:id/carga` | Carga del reparto | token |
| `PATCH` | `/api/v1/repartos/:id/estado` | Actualiza el estado del reparto | token |
| `GET` / `POST` | `/api/v1/usuarios` | Lista / crea usuarios | `ADMIN` |
| `GET` / `PATCH` / `DELETE` | `/api/v1/usuarios/:id` | Obtiene / actualiza / desactiva un usuario | `ADMIN` |
| `GET` | `/api/v1/estadisticas/diarias?fecha=YYYY-MM-DD` | Estadísticas diarias | `ADMIN` |
| `GET` | `/api/v1/estadisticas/mensuales?anio=YYYY&mes=MM` | Estadísticas mensuales | `ADMIN` |
| `GET` | `/api/v1/estadisticas/demanda?periodo=30&incluirClientes=true` | Demanda estimada (RF-11) | `ADMIN` |
| `GET` | `/api/v1/reclamos` | Lista reclamos | API key + token |
| `GET` | `/api/v1/reclamos/:id` | Obtiene un reclamo | API key + token |
| `POST` | `/api/v1/reclamos` | Crea un reclamo | `ADMIN` / `BOT` |

### Panel admin — `/admin` (web, EJS)

`GET /admin/login`, `POST /admin/login`, `POST /admin/logout` y secciones con sesión: `/admin/pedidos`, `/admin/clientes`, `/admin/repartos`, `/admin/usuarios`, `/admin/items`, `/admin/ciudades`, `/admin/domicilios`, `/admin/dias`, `/admin/horarios`, `/admin/empleados`, `/admin/visitas`, `/admin/retenidos`, `/admin/reclamos`, `/admin/estadisticas`.

### WhatsApp Bot — `http://localhost:3008`

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/v1/send-message` | Envía un mensaje de WhatsApp (canal backend → bot) | header `x-bot-api-key` |
| `POST` | `/v1/blacklist` | Agrega o quita un número de la blacklist (`intent: add \| remove`) | — |
| `GET` | `/v1/blacklist/list` | Lista la blacklist actual | — |

---

## 🛠️ Scripts útiles

### `backend/`

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor con hot reload (`tsx watch`) |
| `npm run build` | Compila TypeScript (`tsc -p tsconfig.build.json`) |
| `npm start` | Ejecuta el build (`node dist/server.js`) |
| `npm run db:migrate` | Aplica las migraciones de Prisma |
| `npm run db:generate` | Genera el cliente Prisma |
| `npm run db:seed` | Siembra la base con datos de ejemplo |
| `npm run seed:reparto` | Siembra un reparto de ejemplo |
| `npm run seed:clean` | Limpia la base (seed de borrado) |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run scripts:limpiar-repartos` | Limpia repartos colgados |
| `npm test` / `npm run test:watch` / `npm run test:coverage` | Tests con Vitest |

### `mobile/`

| Comando | Descripción |
|---|---|
| `npm start` | Inicia Expo |
| `npm run android` / `npm run ios` / `npm run web` | Corre la app en cada plataforma |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:run` | Tests con Vitest |

### `whatsapp-bot/`

| Comando | Descripción |
|---|---|
| `npm run dev` | Lint + servidor con nodemon + tsx (escanea el QR) |
| `npm run build` | Compila con Rollup (`dist/app.js`) |
| `npm start` | Ejecuta el build (`node dist/app.js`) |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:run` / `npm run test:coverage` | Tests con Vitest |

---

## 📚 Documentación

| Documento | Contenido |
| --------- | --------- |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Convenciones de ramas, commits y Pull Requests |
| [LICENSE](./LICENSE) | Licencia del proyecto |
| [docs/ADRs/](./docs/ADRs/) | Decisiones de arquitectura (ADR-0000 … ADR-0021) |
| [docs/TDDs/](./docs/TDDs/) | Especificaciones técnicas por caso de uso (TDD-0001 … TDD-0058) |
| [docs/diagramas/](./docs/diagramas/) | Diagramas de flujos y arquitectura (auth, backend, offline, estados de pedido y reparto) |
| [docs/especificacion/](./docs/especificacion/) | Modelo de dominio y diagramas del negocio |
| [docs/UX-UI/](./docs/UX-UI/) | Decisiones de UX/UI |
| [docs/skill-registry.md](./docs/skill-registry.md) | Índice de skills del flujo SDD |
| [docs/agent-configuration.md](./docs/agent-configuration.md) | Configuración de agentes |

---

<div align="center">

**SupplyCycle** · 2026

*Hecho por Manuela, Lucia, Martina, Tiago y Damian* 🚀

</div>
