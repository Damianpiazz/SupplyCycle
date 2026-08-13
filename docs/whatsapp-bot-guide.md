# WhatsApp Bot — Guía de Integración con Backend

> **SupplyCycle** — Bot de WhatsApp para que clientes puedan gestionar pedidos, reclamos y su registro sin salir de la aplicación de mensajería.

---

## Índice

1. [Arquitectura General](#1-arquitectura-general)
2. [Requisitos](#2-requisitos)
3. [Configuración](#3-configuración)
4. [Autenticación: Cómo se conecta el bot al backend](#4-autenticación)
5. [Flujos del Bot (Casos de Uso)](#5-flujos-del-bot)
6. [Endpoint Mapping Completo](#6-endpoint-mapping)
7. [Estructura del Proyecto](#7-estructura-del-proyecto)
8. [Desarrollo y Testing](#8-desarrollo-y-testing)
9. [Solución de Problemas](#9-solución-de-problemas)
10. [Seguridad](#10-seguridad)

---

## 1. Arquitectura General

```
┌─────────────────────┐       ┌──────────────────────┐       ┌──────────────┐
│   WhatsApp          │       │   WhatsApp Bot        │       │   Backend    │
│   (Usuario final)   │ ◄────►│   (BuilderBot +       │ ◄────►│   Express +  │
│                     │       │    Baileys)           │       │   Prisma     │
└─────────────────────┘       │   Puerto 3008         │       │   Puerto 3000│
                               └──────────────────────┘       └──────┬───────┘
                                                                      │
                                                               ┌──────▼───────┐
                                                               │  PostgreSQL   │
                                                               └──────────────┘
```

El bot corre como un proceso **independiente** del backend. Se comunican exclusivamente via HTTP REST:

- **Bot → Backend**: El bot hace requests HTTP con Axios al backend. Se autentica con una API Key compartida (`x-api-key`).
- **Backend → Bot**: El bot expone endpoints HTTP propios (puerto 3008) para que el backend pueda, por ejemplo, agregar números a la blacklist.

No hay WebSockets, no hay message brokers, no hay colas. La comunicación es síncrona y stateless.

---

## 2. Requisitos

### Backend
- Node.js 22+
- PostgreSQL corriendo
- Puerto 3000 libre (o el configurado en `PORT`)

### WhatsApp Bot
- Node.js 22+
- Puerto 3008 libre (o el configurado en `PORT`)
- Conexión a Internet (para WhatsApp Web)
- Teléfono con WhatsApp para escanear el QR

---

## 3. Configuración

### 3.1 Backend

El backend lee `BOT_API_KEY` desde las variables de entorno. En `backend/.env`:

```env
# =========================
# WHATSAPP BOT
# =========================
BOT_API_KEY=sc-bot-dev-key-change-in-production
```

**Importante:** Esta misma API Key debe estar configurada en el bot. Si no coinciden, el backend responde con `401 Invalid API Key`.

El backend expone todos los endpoints del bot bajo `/api/v1/` con el middleware `apiKeyAuth` que:

1. Lee el header `x-api-key`
2. Si es válido, setea `req.user = { userId: 'bot', email: 'bot@supplycycle.com', rol: 'BOT' }`
3. Si no hay API Key, pasa al siguiente middleware (JWT normal)
4. Si la API Key es inválida, responde 401

### 3.2 WhatsApp Bot

El bot usa dos variables de entorno en `whatsapp-bot/.env`:

```env
BACKEND_API_URL=http://localhost:3000/api/v1
BOT_API_KEY=sc-bot-dev-key-change-in-production
```

| Variable | Descripción | Default |
|---|---|---|
| `BACKEND_API_URL` | URL base del backend (sin trailing slash) | `http://localhost:3000/api/v1` |
| `BOT_API_KEY` | API Key compartida con el backend | `''` (vacío) |
| `PORT` | Puerto del servidor HTTP del bot | `3008` |

### 3.3 Scripts de inicio

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — WhatsApp Bot
cd whatsapp-bot
npm run dev
```

El bot mostrará un código QR en la terminal. Escanealo con WhatsApp (ajustes → dispositivos vinculados → vincular un dispositivo).

---

## 4. Autenticación

### 4.1 Cómo funciona la API Key

El bot incluye `x-api-key` en **todos** los requests que hace al backend:

```typescript
// whatsapp-bot/src/lib/axios.ts
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: { 'x-api-key': BOT_API_KEY },
});
```

El backend procesa la API Key con el middleware `apiKeyAuth`, que corre **antes** que `authenticate` (JWT):

```typescript
// Cadena de middlewares para rutas del bot:
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), crearController);
```

El orden de ejecución es:

1. **`apiKeyAuth`**: Si el request incluye `x-api-key` válida, setea `req.user.rol = 'BOT'` y pasa al siguiente middleware (sin verificar JWT).
2. **`authenticate`**: Si `req.user` ya está seteado (por apiKeyAuth), pasa directo. Si no, verifica el JWT Bearer.
3. **`requireRole('ADMIN', 'BOT')`**: Verifica que el rol esté en la lista permitida.

Esto significa que:

| Escenario | Cómo autentica | Resultado |
|---|---|---|
| Bot (x-api-key) | apiKeyAuth → BOT | ✅ Permite `ADMIN, BOT` |
| Admin (JWT Bearer) | authenticate → ADMIN | ✅ Permite `ADMIN, BOT` |
| Repartidor (JWT Bearer) | authenticate → REPARTIDOR | ❌ 403 (no está en `ADMIN, BOT`) |
| Sin auth | No pasa nada | ❌ 401 |

### 4.2 Rutas que aceptan API Key

| Ruta | Método | Auth | Roles |
|---|---|---|---|
| `GET /api/v1/clientes` | Lectura | apiKey | Cualquiera autenticado |
| `GET /api/v1/clientes/:id` | Lectura | apiKey | Cualquiera autenticado |
| `POST /api/v1/clientes` | Escritura | apiKey + JWT | ADMIN, BOT |
| `PATCH /api/v1/clientes/:id` | Escritura | apiKey + JWT | ADMIN, BOT |
| `GET /api/v1/items` | Lectura | apiKey | Cualquiera autenticado |
| `GET /api/v1/pedidos` | Lectura | apiKey | Cualquiera autenticado |
| `GET /api/v1/pedidos/:id` | Lectura | apiKey | Cualquiera autenticado |
| `POST /api/v1/pedidos` | Escritura | apiKey + JWT | ADMIN, REPARTIDOR, BOT |
| `POST /api/v1/pedidos/:id/items` | Escritura | apiKey + JWT | ADMIN, REPARTIDOR, BOT |
| `PATCH /api/v1/pedidos/:id/items/:itemId` | Escritura | apiKey + JWT | ADMIN, REPARTIDOR, BOT |
| `PATCH /api/v1/pedidos/:id/cancelar-cliente` | Escritura | apiKey + JWT | ADMIN, BOT |
| `GET /api/v1/reclamos` | Lectura | apiKey | Cualquiera autenticado |
| `GET /api/v1/reclamos/:id` | Lectura | apiKey | Cualquiera autenticado |
| `POST /api/v1/reclamos` | Escritura | apiKey + JWT | ADMIN, BOT |

**Rutas que el bot NO puede acceder** (protegidas):

| Ruta | Método | Solo | Motivo |
|---|---|---|---|
| `DELETE /api/v1/clientes/:id` | DELETE | ADMIN | Borrado físico de cliente |
| `DELETE /api/v1/pedidos/:id` | DELETE | ADMIN | Borrado físico de pedido |
| `PATCH /api/v1/pedidos/:id/confirmar` | PATCH | REPARTIDOR | Confirmación de entrega |
| `PATCH /api/v1/pedidos/:id/cancelar` | PATCH | REPARTIDOR | Cancelación por repartidor |

---

## 5. Flujos del Bot

El bot tiene **6 flujos principales** y **2 flujos auxiliares**. Todos se disparan por palabras clave que el usuario escribe en WhatsApp.

### 5.1 Welcome (Bienvenida)

**Palabra clave:** *ninguna* — se dispara automáticamente cuando un usuario escribe al bot por primera vez (`EVENTS.WELCOME`).

**Archivo:** `whatsapp-bot/src/flows/welcome.flow.ts`

**Qué hace:**
1. Toma el número de teléfono del remitente (`ctx.from`)
2. Lo normaliza con `normalizePhone()` (saca prefijo 54/549, caracteres no numéricos)
3. Busca el cliente en el backend: `GET /api/v1/clientes?telefono=<numero>`
4. Si existe → muestra menú de cliente registrado (pedir, cancelar, reclamo, baja, estado)
5. Si no existe → muestra menú de bienvenida con opción "alta"

**Menú cliente registrado:**
```
📦 pedir — Hacer un nuevo pedido
🔍 estado — Consultar el estado de tu pedido
❌ cancelar — Cancelar un pedido
📝 reclamo — Hacer un reclamo
🚫 baja — Darme de baja como cliente
❓ ayuda — Ver este menú de nuevo
```

**Menú no registrado:**
```
📋 alta — Darme de alta como cliente
❓ ayuda — Ver este menú de nuevo
```

### 5.2 Alta (Registro de Cliente)

**Palabra clave:** `alta`

**Archivo:** `whatsapp-bot/src/flows/alta.flow.ts`

**Qué hace:**
1. Normaliza el número de WhatsApp y verifica si ya está registrado
2. Si ya existe → redirige a flujo "ya registrado"
3. Si no existe → recolecta datos mediante preguntas secuenciales:

   | Paso | Pregunta | Validación |
   |---|---|---|
   | 1 | ¿Cuál es tu *nombre*? | ≥ 2 caracteres |
   | 2 | ¿Cuál es tu *apellido*? | ≥ 2 caracteres |
   | 3 | ¿Cuál es tu *calle*? | No vacío |
   | 4 | ¿Cuál es el *número* de tu casa? | No vacío |
   | 5 | ¿Cuál es tu *localidad*? | Default "La Plata" |
   | 6 | ¿Qué *día* preferís para la entrega? | 1-6 (LUNES a SÁBADO) |
   | 7 | ¿Desde qué *hora* preferís recibir? | Formato HH:MM |
   | 8 | ¿Hasta qué *hora* preferís recibir? | > hora desde |
   | 9 | ¿Alguna *observación*? | Opcional |

4. Muestra resumen con todos los datos para confirmar
5. Si confirma (SI) → `POST /api/v1/clientes` con `{ nombre, apellido, telefono, domicilios, observaciones }`
6. Si cancela (NO) → vuelve al menú principal

**Endpoint que llama:**
```
POST /api/v1/clientes
Body: {
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "1122334455",
  "domicilios": [{
    "calle": "Av. Corrientes",
    "numero": "1234",
    "localidad": "La Plata",
    "latitud": 0,
    "longitud": 0,
    "principal": true,
    "dias": [{
      "nombre": "LUNES",
      "horarios": [{ "inicio": "09:00", "fin": "13:00" }]
    }]
  }],
  "observaciones": "Timbre 3"
}
```

### 5.3 Pedido (Crear Pedido)

**Palabra clave:** `pedir`

**Archivo:** `whatsapp-bot/src/flows/pedido.flow.ts`

**Qué hace:**
1. Busca el cliente por teléfono. Si no existe → redirige a "no registrado"
2. Obtiene items disponibles: `GET /api/v1/items?activo=true`
3. Muestra el menú de productos con precios
4. El usuario elige items en formato `número x cantidad` (ej: `1x2, 3x4`)
5. Valida que los números de item existan y las cantidades sean ≥ 1
6. Muestra resumen del pedido
7. Si confirma (SI) → `POST /api/v1/pedidos` con `{ clienteId, fecha, items }`
8. Si cancela (NO) → vuelve al menú

**Endpoint que llama:**
```
POST /api/v1/pedidos
Body: {
  "clienteId": "uuid-del-cliente",
  "fecha": "2026-07-23",
  "items": [
    { "itemId": "uuid-item-1", "cantidad": 2 },
    { "itemId": "uuid-item-3", "cantidad": 4 }
  ]
}
```

**Respuesta exitosa:**
```json
{
  "data": {
    "id": "uuid",
    "numeroPedido": "P-20260723-042",
    "estado": "PENDIENTE",
    "total": 1250.00
  }
}
```

### 5.4 Cancelar (Cancelación por Cliente)

**Palabra clave:** `cancelar`

**Archivo:** `whatsapp-bot/src/flows/cancelar.flow.ts`

**Qué hace:**
1. Busca el cliente por teléfono. Si no existe → redirige a "no registrado"
2. Obtiene pedidos pendientes: `GET /api/v1/pedidos?clienteId=<id>&estado=PENDIENTE`
3. Muestra lista numerada de pedidos pendientes
4. El usuario elige el número del pedido a cancelar
5. Muestra motivos de cancelación (apropiados para el cliente):

   | # | Motivo | Valor enviado |
   |---|---|---|
   | 1 | Ya no necesito el pedido | `YA_NO_LO_NECESITA` |
   | 2 | La dirección es incorrecta | `DIRECCION_INCORRECTA` |
   | 3 | No voy a estar para recibir | `CANCELACION_CLIENTE` |
   | 4 | Otro motivo | `OTRO` |

6. Muestra resumen de la cancelación
7. Si confirma (SI) → `PATCH /api/v1/pedidos/:id/cancelar-cliente`

**Endpoint que llama:**
```
PATCH /api/v1/pedidos/:id/cancelar-cliente
Body: { "motivo": "YA_NO_LO_NECESITA" }
```

**Comportamiento del backend:**
- Cambia `estado` de `PENDIENTE` a `CANCELADO`
- Guarda el `motivoFalla` con el motivo seleccionado
- **NO** ejecuta `autoCompletarRepartoSiCorresponde` (a diferencia del cancel del repartidor)
- Rechaza con 409 si el pedido no está en estado `PENDIENTE`

### 5.5 Reclamo (Registrar Reclamo)

**Palabra clave:** `reclamo`

**Archivo:** `whatsapp-bot/src/flows/reclamo.flow.ts`

**Qué hace:**
1. Busca el cliente por teléfono. Si no existe → redirige a "no registrado"
2. Pide que describa el reclamo (mínimo 10 caracteres)
3. Muestra resumen del reclamo
4. Si confirma (SI) → `POST /api/v1/reclamos` con `{ clienteId, descripcion }`
5. Si cancela (NO) → vuelve al menú

**Endpoint que llama:**
```
POST /api/v1/reclamos
Body: {
  "clienteId": "uuid-del-cliente",
  "descripcion": "El producto llegó en mal estado y faltaron 2 items"
}
```

### 5.6 Baja (Darse de Baja)

**Palabra clave:** `baja`

**Archivo:** `whatsapp-bot/src/flows/baja.flow.ts`

**Qué hace:**
1. Busca el cliente por teléfono. Si no existe → redirige a "no registrado"
2. Si ya está inactivo (`activo: false`) → avisa que ya está dado de baja
3. Muestra advertencia: "el repartidor ya no va a pasar por tu casa"
4. Si confirma (SI) → `PATCH /api/v1/clientes/:id` con `{ activo: false }`
5. Si cancela (NO) → vuelve al menú

**Endpoint que llama:**
```
PATCH /api/v1/clientes/:id
Body: { "activo": false }
```

### 5.7 Flujos Auxiliares

| Flujo | Keyword | Qué hace |
|---|---|---|
| `yaRegistradoFlow` | `__ya_registrado__` (interno) | Indica que el cliente ya está registrado |
| `noRegistradoFlow` | `__no_registrado__` (interno) | Indica que debe registrarse primero |

No se disparan por palabras clave del usuario, sino por `gotoFlow()` desde otros flujos.

---

## 6. Endpoint Mapping

### 6.1 Backend → Bot estándar

| Bot Action | Método | Endpoint Backend | Cuerpo / Query | Respuesta |
|---|---|---|---|---|
| Buscar cliente por teléfono | GET | `/api/v1/clientes?telefono=...` | — | `{ data: Cliente[], total }` |
| Obtener cliente por ID | GET | `/api/v1/clientes/:id` | — | `{ data: Cliente }` |
| Crear cliente + domicilio | POST | `/api/v1/clientes` | `CrearClienteInput` | `{ data: Cliente }` |
| Actualizar cliente (baja) | PATCH | `/api/v1/clientes/:id` | `{ activo: false }` | `{ data: Cliente }` |
| Listar items activos | GET | `/api/v1/items?activo=true` | — | `{ data: Item[], total }` |
| Crear pedido | POST | `/api/v1/pedidos` | `CrearPedidoInput` | `{ data: Pedido }` |
| Listar pedidos por cliente | GET | `/api/v1/pedidos?clienteId=...&estado=...` | — | `{ data: Pedido[], total }` |
| Cancelar pedido (cliente) | PATCH | `/api/v1/pedidos/:id/cancelar-cliente` | `{ motivo }` | `{ data: { estado, motivoFalla } }` |
| Crear reclamo | POST | `/api/v1/reclamos` | `{ clienteId, descripcion }` | `{ data: Reclamo }` |
| Listar reclamos | GET | `/api/v1/reclamos?clienteId=...` | — | `{ data: Reclamo[], total }` |

### 6.2 Bot → Backend (Blacklist)

El bot expone endpoints HTTP para que el backend pueda gestionar la blacklist de WhatsApp:

| Método | Endpoint Bot | Body | Descripción |
|---|---|---|---|
| POST | `http://localhost:3008/v1/blacklist` | `{ number, intent: "add" \| "remove" }` | Agrega o quita un número de la blacklist |
| GET | `http://localhost:3008/v1/blacklist/list` | — | Obtiene la lista de números bloqueados |

---

## 7. Estructura del Proyecto

### 7.1 WhatsApp Bot

```
whatsapp-bot/
├── src/
│   ├── flows/
│   │   ├── index.ts              # Re-exporta todos los flujos
│   │   ├── alta.flow.ts          # Registro de cliente
│   │   ├── baja.flow.ts          # Darse de baja
│   │   ├── cancelar.flow.ts      # Cancelar pedido
│   │   ├── pedido.flow.ts        # Crear pedido
│   │   ├── reclamo.flow.ts       # Hacer reclamo
│   │   ├── welcome.flow.ts       # Bienvenida / menú principal
│   │   └── __tests__/            # Tests de flujos
│   │       ├── alta.flow.test.ts
│   │       ├── cancelar.flow.test.ts
│   │       ├── pedido.flow.smoke.test.ts
│   │       ├── reclamo.flow.smoke.test.ts
│   │       ├── baja.flow.smoke.test.ts
│   │       └── welcome.flow.smoke.test.ts
│   ├── services/
│   │   ├── cliente.service.ts    # Llamadas HTTP a /clientes
│   │   ├── pedido.service.ts     # Llamadas HTTP a /pedidos
│   │   ├── item.service.ts       # Llamadas HTTP a /items
│   │   ├── reclamo.service.ts    # Llamadas HTTP a /reclamos
│   │   └── __tests__/            # Tests de servicios
│   │       ├── cliente.service.test.ts
│   │       ├── pedido.service.test.ts
│   │       ├── item.service.test.ts
│   │       └── reclamo.service.test.ts
│   ├── lib/
│   │   └── axios.ts              # Cliente Axios singleton (x-api-key)
│   ├── utils/
│   │   ├── index.ts
│   │   └── normalize-phone.ts    # Normaliza números de teléfono
│   ├── types/
│   │   └── index.ts              # Re-export de tipos de servicios
│   ├── routes/
│   │   ├── index.ts              # Re-export de rutas HTTP del bot
│   │   └── blacklist.route.ts    # Endpoints de blacklist
│   └── app.ts                    # Punto de entrada
├── vitest.config.ts              # Configuración de tests
├── package.json
└── tsconfig.json
```

### 7.2 Backend (solo lo relevante para el bot)

```
backend/
├── prisma/
│   ├── schema.prisma              # Modelo Cliente (con telefono), Reclamo (con descripcion)
│   └── seed/
│       └── 13-reclamos.seed.ts    # Seed de reclamos
├── src/
│   ├── middleware/
│   │   ├── auth.middleware.ts      # authenticate + requireRole (incluye BOT)
│   │   └── api-key-auth.ts        # apiKeyAuth middleware
│   ├── features/
│   │   ├── clientes/
│   │   │   ├── routes.ts          # POST/PATCH con apiKeyAuth + BOT
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   ├── pedidos/
│   │   │   ├── routes.ts          # cancelar-cliente + apiKeyAuth
│   │   │   ├── controller.ts      # cancelarClienteController
│   │   │   ├── service.ts         # cancelarPedidoCliente
│   │   │   ├── schema.ts          # cancelarClienteSchema
│   │   │   └── types.ts
│   │   └── reclamos/              # Feature completa
│   │       ├── routes.ts
│   │       ├── controller.ts
│   │       ├── service.ts
│   │       ├── schema.ts
│   │       └── types.ts
│   ├── admin/
│   │   └── controllers/
│   │       └── reclamos.admin.controller.ts
│   └── app.ts                     # Monta /api/v1/reclamos
```

---

## 8. Desarrollo y Testing

### 8.1 Tests

El bot tiene **69 tests** divididos en:

| Capa | Archivos | Tests | Qué prueba |
|---|---|---|---|
| Services | 4 | 27 | Cada método HTTP (éxito, error API, error red, timeout) |
| Flows (integración) | 2 | 33 | Flujo completo de alta y cancelar (múltiples pasos) |
| Flows (smoke) | 4 | 9 | Cada flujo: happy path + cliente no registrado |

Para correrlos:

```bash
cd whatsapp-bot
npm test           # Modo watch
npm run test:run   # Una vez
npm run test:coverage  # Con cobertura
```

### 8.2 Mock de Axios

Los tests de servicios mockean el módulo `axios` del bot. Cada test file declara su propio mock al inicio usando `vi.mock()`:

```typescript
// En cada archivo de test dentro de src/services/__tests__/
vi.mock('../../lib/axios.js', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
```

### 8.3 Prueba manual con curl

Podés probar los endpoints del backend que usa el bot directamente:

```bash
# Probar API Key inválida
curl -H "x-api-key: wrong-key" http://localhost:3000/api/v1/clientes
# → 401 { error: { code: 'INVALID_API_KEY', message: 'API Key inválida' } }

# Probar API Key válida (lectura)
curl -H "x-api-key: sc-bot-dev-key-change-in-production" http://localhost:3000/api/v1/clientes?telefono=1122334455
# → 200 { data: [...], total: 0 }  (si no existe) o los datos del cliente

# Probar escritura con API Key
curl -X POST http://localhost:3000/api/v1/clientes \
  -H "Content-Type: application/json" \
  -H "x-api-key: sc-bot-dev-key-change-in-production" \
  -d '{"nombre":"Test","apellido":"Bot","telefono":"1122334455","domicilios":[{"calle":"Av Siempre Viva","numero":"742","localidad":"La Plata","principal":true,"dias":[{"nombre":"LUNES","horarios":[{"inicio":"09:00","fin":"13:00"}]}]}]}'
# → 201 { data: { id: "...", ... } }

# Probar cancelación de pedido
curl -X PATCH http://localhost:3000/api/v1/pedidos/<pedido-id>/cancelar-cliente \
  -H "Content-Type: application/json" \
  -H "x-api-key: sc-bot-dev-key-change-in-production" \
  -d '{"motivo":"YA_NO_LO_NECESITA"}'
# → 200 { data: { estado: "CANCELADO", motivoFalla: "YA_NO_LO_NECESITA" } }

# Probar creación de reclamo
curl -X POST http://localhost:3000/api/v1/reclamos \
  -H "Content-Type: application/json" \
  -H "x-api-key: sc-bot-dev-key-change-in-production" \
  -d '{"clienteId":"<cliente-uuid>","descripcion":"El producto llegó en mal estado"}'
# → 201 { data: { id: "...", clienteId: "...", descripcion: "...", creadoEn: "..." } }
```

### 8.4 Verificar que el bot funciona end-to-end

1. Iniciá backend y bot (ver sección 3.3)
2. Escaneá el QR con tu teléfono
3. Enviale un mensaje al bot desde WhatsApp
4. Deberías recibir el menú de bienvenida
5. Probá escribir `alta` y seguí el flujo de registro
6. Después de registrarte, escribí `pedir` y creá un pedido

---

## 9. Solución de Problemas

### 9.1 El bot no responde

| Causa posible | Qué verificar |
|---|---|
| QR no escaneado | ¿Ves el QR en la terminal al iniciar el bot? |
| Puerto ocupado | `lsof -i :3008` (Linux/Mac) o `netstat -ano \| findstr :3008` (Windows) |
| Error de conexión con WhatsApp | Revisá la terminal del bot, ¿hay errores de Baileys? |

### 9.2 El bot responde "Error del servidor"

El bot no puede comunicarse con el backend. Verificá:

```bash
# ¿El backend está corriendo?
curl http://localhost:3000/health
# → {"status":"ok"}

# ¿La API Key coincide entre backend y bot?
# En backend/.env → BOT_API_KEY
# En whatsapp-bot/.env → BOT_API_KEY
# Deben ser IGUALES.

# ¿El bot está apuntando al puerto correcto?
# En whatsapp-bot/.env → BACKEND_API_URL debe ser http://localhost:3000/api/v1
```

### 9.3 El endpoint de reclamos no funciona

Verificá que la migración de Prisma esté aplicada:

```bash
cd backend
npx prisma migrate dev --name add_descripcion_to_reclamo
npx prisma generate
```

### 9.4 Error "No tiene permisos para esta acción" (403)

El bot está llegando al backend pero el rol `BOT` no está permitido en esa ruta. Verificá que la ruta tenga:

```typescript
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), controller);
```

Si falta `apiKeyAuth`, el bot nunca se autentica (porque usa API Key, no JWT). Si falta `'BOT'` en `requireRole`, el bot se autentica pero no tiene permiso.

### 9.5 Error "Cliente no encontrado" al hacer pedido/reclamo

El número de WhatsApp no coincide con ningún `telefono` en la base de datos. Verificá:

```bash
# Buscar por teléfono exacto
curl -H "x-api-key: sc-bot-dev-key-change-in-production" \
  "http://localhost:3000/api/v1/clientes?telefono=1122334455"
```

Recordá que `normalizePhone()` saca el prefijo `54`/`549` y cualquier caracter no numérico. Si tu número es `+54 9 11 2233-4455`, en la base de datos debe estar como `1122334455`.

---

## 10. Seguridad

### 10.1 API Key

- La API Key se transmite en cada request como header `x-api-key`
- Si la key es robada, cualquiera podría actuar como el bot
- **En producción:** usá una key fuerte (64+ caracteres alfanuméricos) y transmití siempre sobre HTTPS
- El backend valida la key en el middleware `apiKeyAuth`: si no está configurada (`BOT_API_KEY` vacío), responde 500

### 10.2 Roles

El bot opera exclusivamente con el rol `BOT`. Este rol está limitado a las rutas que necesita:

| Operación | Permitida |
|---|---|
| Leer clientes | ✅ |
| Crear/actualizar clientes | ✅ (soft delete via `activo: false`) |
| Leer items | ✅ |
| Leer pedidos | ✅ |
| Crear pedidos | ✅ |
| Cancelar pedidos | ✅ (solo si están PENDIENTE) |
| Gestionar reclamos | ✅ |
| Borrar clientes físicamente | ❌ |
| Borrar pedidos físicamente | ❌ |
| Confirmar entregas | ❌ |
| Cancelar como repartidor | ❌ |
| Acceder a estadísticas | ❌ |
| Gestionar usuarios | ❌ |

### 10.3 Cancelación

El endpoint `cancelar-cliente` es **distinto** del endpoint de cancelación del repartidor:

| Aspecto | `cancelar` (repartidor) | `cancelar-cliente` (bot) |
|---|---|---|
| Estado resultante | `NO_ENTREGADO` | `CANCELADO` |
| Auto-completa reparto | ✅ Sí | ❌ No |
| Quién puede llamarlo | REPARTIDOR | ADMIN, BOT |
| Guarda motivo | ✅ Sí | ✅ Sí |

Esto asegura que las cancelaciones iniciadas por el cliente no interfieran con el flujo de reparto del repartidor.

### 10.4 Blacklist

El bot expone endpoints HTTP para bloquear números de WhatsApp. Esto permite que el backend (o un admin) impida que ciertos números usen el bot. Los endpoints no tienen autenticación propia — en producción deberían protegerse (ej: solo localhost o con API Key adicional).
