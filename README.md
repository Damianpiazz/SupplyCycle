# SupplyCycle

**MVP** desarrollado para la materia **Desarrollo de Aplicaciones Móviles** de la **Universidad Nacional de La Plata**.

El sistema está pensado para optimizar la logística de **distribución y reparto de envases de agua** en la región de La Plata. Permite gestionar pedidos, asignar repartos, visualizar rutas en mapa, y dar seguimiento al historial de entregas, tanto desde una app mobile para repartidores como desde un panel de administración web.

Proyecto monorepo que contiene:

* `backend/` → API REST (Express + TypeScript + Prisma + PostgreSQL)
* `mobile/` → App mobile para repartidores (React Native + Expo)
* `whatsapp-bot/` → Bot de WhatsApp para clientes (BuilderBot + Baileys)

---

## 👥 Integrantes

* Manuela Chanquía
* Lucia Meza
* Martina García Améndola
* Tiago Solis
* Damian Piazza

---

## 🌿 Estrategia de ramas

Se utiliza una convención basada en **tipo de cambio + plataforma + descripción**.

### 📌 Formato

```bash
<tipo>/<plataforma>/<descripcion>
```

---

### 🧩 Tipos permitidos

* `feature` → nueva funcionalidad
* `fix` → corrección de errores
* `refactor` → mejora interna sin cambio funcional
* `chore` → tareas de mantenimiento
* `docs` → cambios en documentación

---

### 📱 Plataformas

* `backend`
* `mobile`

---

### ✅ Ejemplos

```bash
feature/backend/auth-login
feature/mobile/login-screen

fix/backend/token-expiration
refactor/mobile/navigation-structure
```

---

### ⚠️ Reglas

* usar kebab-case
* no usar mayúsculas
* descripción breve y clara
* una sola responsabilidad por rama

---

## 🧠 Convención de commits

Se utiliza **Conventional Commits**, validado automáticamente.

### 📌 Formato

```bash
<type>(<scope>): <description>
```

---

### 🧩 Tipos

* `feat`
* `fix`
* `refactor`
* `chore`
* `docs`

---

### 🎯 Scope

* `backend`
* `mobile`

---

### ✅ Ejemplos

```bash
feat(backend): add auth module
fix(mobile): resolve login crash
refactor(backend): improve service structure
```

---

### ❌ Ejemplos inválidos

```bash
update code
fix stuff
feat: cambio
```

---

## 🔒 Validación

Los commits son validados automáticamente mediante:

* Husky
* Commitlint

---

## 🚀 Flujo de trabajo

1. crear rama desde `main`
2. desarrollar el cambio
3. realizar commits siguiendo la convención
4. abrir Pull Request
5. revisión
6. merge

---

## 🐳 Ejecución con Docker

### 📦 Levantar el entorno completo

```bash
docker compose -f docker-compose.dev.yml up --build
```

---

### ⛔ Detener contenedores

```bash
docker compose down
```

---

### 🔄 Reiniciar entorno

```bash
docker compose down -v
docker compose -f docker-compose.dev.yml up --build
```

> ⚠️ `-v` elimina volúmenes (borra datos de la base)

---

## 🌐 Puertos del sistema

| Servicio   | Contenedor              | Puerto Host | Puerto Contenedor | URL                   |
| ---------- | ----------------------- | ----------- | ----------------- | --------------------- |
| Backend    | supplycycle_backend_dev | 3000        | 3000              | http://localhost:3000 |
| PostgreSQL | supplycycle_db_dev      | 5432        | 5432              | localhost:5432        |
| pgAdmin    | supplycycle_pgadmin_dev | 5050        | 80                | http://localhost:5050 |

---

## 📌 Notas sobre Docker

* El backend se conecta a la DB usando el host `db`
* No usar `localhost` dentro de contenedores
* Los datos de PostgreSQL se persisten en volúmenes

---

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
```

---

## ⚙️ Prerrequisitos

Antes de comenzar, instalá lo siguiente:

| Herramienta | Versión | Notas |
|---|---|---|
| **Node.js** | ≥ 22.14 LTS | [nodejs.org](https://nodejs.org) |
| **npm** | ≥ 10 | Viene con Node.js |
| **Docker Desktop** | Última | [docker.com](https://docker.com) — para PostgreSQL |
| **Android Studio** | Última | Con SDK 35, AVD configurado |
| **Java JDK** | ≥ 17 | Necesario para React Native en Android |
| **Expo CLI** | Incluida | Viene con el proyecto, no instalar globalmente |
| **Git** | ≥ 2.40 | [git-scm.com](https://git-scm.com) |

> 💡 Verificá las versiones con `node -v`, `npm -v`, `java -version`.

---

## 🔐 Variables de entorno

Cada submódulo necesita su propio archivo `.env` copiado desde `.env.example`:

### backend/

```bash
cp backend/.env.example backend/.env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NODE_ENV` | Entorno | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | Conexión PostgreSQL | `postgresql://postgres:postgres@localhost:5432/supplycycle` |
| `JWT_SECRET` | Secreto para firmar tokens | `supplycycle-dev-secret-key-2026` |
| `JWT_EXPIRES_IN` | Expiración del token | `24h` |
| `BCRYPT_SALT_ROUNDS` | Rondas de sal para bcrypt | `10` |
| `CORS_ORIGIN` | Origen permitido CORS | `*` |
| `LOG_LEVEL` | Nivel de log | `debug` |
| `BOT_API_KEY` | API key del bot WhatsApp | `sc-bot-dev-key-change-in-production` |

### mobile/

```bash
cp mobile/.env.example mobile/.env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | URL del backend | `http://localhost:3000/api/v1` |
| `EXPO_PUBLIC_API_TIMEOUT` | Timeout en ms | `10000` |
| `EXPO_PUBLIC_AUTH_ENABLED` | Autenticación habilitada | `true` |
| `EXPO_PUBLIC_USE_MOCKS` | Usar datos mock | `true` |
| `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` | Token de Mapbox (requerido para mapa) | `pk.xxx...` |
| `EXPO_PUBLIC_ENABLE_LOGS` | Logs en consola | `true` |
| `EXPO_PUBLIC_FEATURE_DARK_MODE` | Modo oscuro | `true` |

> Las variables con prefijo `EXPO_PUBLIC_` se exponen al cliente. No poner secrets acá.

### whatsapp-bot/

```bash
cp whatsapp-bot/.env.example whatsapp-bot/.env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `BACKEND_API_URL` | URL del backend | `http://localhost:3000/api/v1` |
| `BOT_API_KEY` | API key compartida con backend | `sc-bot-dev-key-change-in-production` |

> No existe `.env.example` todavía; creá el archivo con esas 2 variables.

---

## 🚀 Ejecución en Android / Emulador

### 1. Levantar PostgreSQL

```bash
docker compose -f docker-compose.dev.yml up -d db
```

### 2. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

El servidor arranca en `http://localhost:3000`.

### 3. Mobile en emulador Android

```bash
cd mobile
npm install
npm run android
```

Esto ejecuta `expo run:android`, compila la app y la despliega en el emulador activo.

> Requiere tener un AVD corriendo en Android Studio o un dispositivo físico conectado con depuración USB.

### Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run start` | Inicia Expo dev server (modo desarrollo) |
| `npm run android` | Compila y corre en Android |
| `npm run ios` | Compila y corre en iOS (solo macOS) |
| `npm run web` | Corre versión web (limitado) |

### 4. WhatsApp Bot (opcional)

```bash
cd whatsapp-bot
npm install
npm run dev
```

Escanea el QR con WhatsApp para conectar.

---
