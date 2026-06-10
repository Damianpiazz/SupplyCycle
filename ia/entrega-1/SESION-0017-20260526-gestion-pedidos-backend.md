# New session - 2026-05-26T20:51:37.876Z

**Session ID:** ses_199f154ecffeA2CEfdgjqxfJmM
**Created:** 26/5/2026, 17:51:37
**Updated:** 26/5/2026, 18:11:14

---

## User

Implementar únicamente la pantalla Inicio para el rol REPARTIDOR.

Leer previamente:
- todos los TDD
- todos los ADR

Respetar:
- arquitectura actual
- DTOs existentes
- lógica actual de pedidos
- lógica actual de repartos
- tipado TypeScript estricto
- navegación existente

No modificar:
- pantallas ADMIN
- lógica de creación de repartos
- lógica de edición de repartos
- flujo offline
- arquitectura existente

---

# Objetivo

La pantalla Inicio del repartidor debe funcionar como el flujo operativo principal del reparto del día.

Debe:
- mostrar el reparto activo del día
- permitir iniciar reparto
- mostrar próxima entrega
- permitir iniciar entrega
- permitir completar entrega
- mostrar próximas entregas

Todo esto únicamente para usuarios con rol `REPARTIDOR`.

---

# Flujo esperado

## Estado inicial

Cuando el repartidor entra a Inicio:

buscar:
- reparto del día correspondiente al repartidor autenticado
- fecha actual

---

# Caso 1 — No existe reparto

Mostrar estado vacío:

```txt
No hay repartos asignados para hoy
```

---

# Caso 2 — Reparto PENDIENTE

Si el reparto está:

```ts
EstadoReparto.PENDIENTE
```

mostrar:
- resumen del reparto
- cantidad de pedidos
- botón `Iniciar reparto`

---

# Acción iniciar reparto

Cuando el repartidor presiona:

`Iniciar reparto`

hacer:

- cambiar estado del reparto → `EN_CURSO`
- guardar `horaInicio`
- refrescar datos automáticamente
- mostrar toast de éxito

NO modificar:
- estados de pedidos todavía

---

# Caso 3 — Reparto EN_CURSO

Si el reparto está:

```ts
EstadoReparto.EN_CURSO
```

mostrar:

- próxima entrega destacada
- próximas entregas
- acciones operativas

---

# Próxima entrega

La próxima entrega debe ser:
- el primer pedido pendiente/no completado del recorrido

Mostrar:
- nombre del cliente
- domicilio
- teléfono
- franja horaria si existe
- estado actual

---

# Acciones de la próxima entrega

## Botón iniciar entrega

Cuando se presiona:

`Iniciar entrega`

hacer:

```ts
EstadoPedido.EN_RUTA
```

Actualizar:
- backend
- UI
- estadísticas
- listado

Mostrar toast de éxito.

---

## Botón completar entrega

Debe reutilizar la lógica ya existente del detalle de pedidos.

Permitir:
- marcar ENTREGADO
- marcar NO_ENTREGADO
- seleccionar motivo
- reutilizar modal ya existente

NO duplicar lógica.

---

# Detalle del pedido

La próxima entrega debe permitir:
- abrir detalle del pedido

Reutilizar:
- pantalla existente
- componentes existentes
- modal existente
- lógica existente de pedidos

Mostrar:
- items solicitados
- cantidades
- estado
- acciones actuales

---

# Próximas entregas

Debajo de la entrega principal mostrar:

`Próximas entregas`

Listado compacto con:
- cliente
- domicilio
- estado
- horario

Visualmente más pequeñas que la entrega principal.

---

# Restricciones importantes

NO mostrar:
- pedidos CANCELADOS
- pedidos ENTREGADOS
- pedidos NO_ENTREGADOS

La próxima entrega debe salir únicamente de:
- PENDIENTE
- EN_RUTA

---

# Finalización automática del reparto

Cuando todos los pedidos del reparto estén:
- ENTREGADOS
- NO_ENTREGADOS
- CANCELADOS

Entonces:
- cambiar reparto → `COMPLETADO`
- guardar `horaFin`

Implementar esta lógica en backend.

No hacerlo desde frontend.

---

# Backend

Implementar únicamente lo necesario para:

- obtener reparto actual del repartidor
- iniciar reparto
- iniciar entrega
- completar reparto automáticamente

Mantener:
- controller/use-case/repository
- AppError
- DTOs existentes
- validaciones actuales

No colocar lógica de negocio en controllers.

---

# Mobile

Mantener:
- feature-based architecture
- hooks reutilizables
- services HTTP
- React Query/TanStack Query
- separación de responsabilidades

No:
- duplicar lógica de pedidos
- duplicar modales
- colocar lógica HTTP en screens

---

# Estados visuales

Implementar correctamente:
- loading
- empty state
- error state
- refresh automático

---

# Importante

Antes de implementar:

1. analizar estructura existente
2. indicar archivos a crear/modificar
3. explicar brevemente el enfoque
4. luego implementar

No avanzar si existen errores TypeScript. 

---

## Assistant (Plan · Big Pickle · 7.4s)

_Thinking:_

The user wants me to plan the implementation of the "Inicio" (Home) screen for the REPARTIDOR (delivery person) role. They've given very detailed requirements. Let me first explore the existing codebase to understand:

1. Current architecture
2. Existing DTOs, types, and schemas
3. Existing pedidos/repartos logic
4. Navigation structure
5. Backend structure

Let me start by exploring the codebase systematically.

I'm in plan mode - I can only read and analyze. Let me explore the codebase thoroughly.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Explorar estructura del backend (prisma schema, rutas, controladores, servicios)",
      "status": "in_progress",
      "priority": "high"
    },
    {
      "content": "Explorar estructura del mobile (features, hooks, servicios, tipos, navegación)",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Analizar DTOs, tipos y schemas existentes para pedidos y repartos",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Analizar lógica existente de pedidos y repartos (backend y mobile)",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Revisar ADR y TDD documentación",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Elaborar plan detallado de implementación",
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
    "content": "Explorar estructura del backend (prisma schema, rutas, controladores, servicios)",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Explorar estructura del mobile (features, hooks, servicios, tipos, navegación)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Analizar DTOs, tipos y schemas existentes para pedidos y repartos",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Analizar lógica existente de pedidos y repartos (backend y mobile)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Revisar ADR y TDD documentación",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Elaborar plan detallado de implementación",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Plan · Big Pickle · 123.6s)

_Thinking:_

Let me start by exploring both backend and mobile structures in parallel.

**Tool: task**

**Input:**
```json
{
  "description": "Explorar backend estructura",
  "prompt": "Explora exhaustivamente la estructura del backend en C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend. Necesito entender:\n\n1. El schema de Prisma completo (prisma/schema.prisma) - especialmente las tablas relacionadas con usuarios, repartos, pedidos\n2. La estructura de carpetas en src/features/ - qué features existen, cómo están organizadas\n3. Los archivos de rutas, controladores, servicios de las features existentes (especialmente auth, pedidos, repartos si existen)\n4. El archivo app.ts o main para ver cómo se montan las rutas\n5. Los tipos/DTOs existentes\n6. Los middlewares (especialmente auth middleware)\n7. El archivo error-handler.ts\n\nDevuelve:\n- El schema de Prisma completo\n- La estructura de carpetas de features\n- El contenido de los archivos clave (rutas, controladores, servicios) de cada feature existente\n- Cómo se montan las rutas en app.ts\n- Los tipos y DTOs existentes\n- El middleware de autenticación y manejo de errores",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_199f1277dffePGLjPQGLQiLlfL (for resuming to continue this task if needed)

<task_result>
A continuación, el reporte exhaustivo del backend:

---

# Backend SupplyCycle — Exploración Exhaustiva

## 1. Schema de Prisma Completo (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

### Enums

| Enum | Valores |
|---|---|
| `Rol` | `REPARTIDOR`, `ADMIN` |
| `DiaSemana` | `LUNES`, `MARTES`, `MIERCOLES`, `JUEVES`, `VIERNES`, `SABADO` |
| `EstadoPedido` | `PENDIENTE`, `EN_RUTA`, `ENTREGADO`, `NO_ENTREGADO`, `CANCELADO` |
| `EstadoReparto` | `PENDIENTE`, `EN_CURSO`, `COMPLETADO` |

### Models

**Usuario**
| Campo | Tipo | Notas |
|---|---|---|
| id | String (UUID) | PK |
| email | String | Unique |
| password | String | Hash bcrypt |
| nombre | String(100) | |
| apellido | String(100) | |
| rol | Rol | Default REPARTIDOR |
| activo | Boolean | Default true |
| creadoEn | DateTime | auto now() |
| actualizadoEn | DateTime | @updatedAt |
| repartos | Reparto[] | relacion 1:N |

**Cliente**
| Campo | Tipo | Notas |
|---|---|---|
| id | String (UUID) | PK |
| nombre, apellido | String(100) | |
| telefono | String(20) | |
| calle, numero, localidad | String | |
| latitud, longitud | Float | |
| diaEntrega | DiaSemana | |
| horarioDesde, horarioHasta | String | HH:MM |
| observaciones | String? | |
| activo | Boolean | Default true (soft delete) |
| pedidos | Pedido[] | relacion 1:N |

**Item**
| Campo | Tipo | Notas |
|---|---|---|
| id | String (UUID) | PK |
| nombre | String(100) | |
| descripcion | String? | |
| unidad | String | ej: "unidad" |
| precio | Float? | |
| activo | Boolean | Default true |
| pedidoItems | PedidoItem[] | relacion 1:N |

**Pedido**
| Campo | Tipo | Notas |
|---|---|---|
| id | String (UUID) | PK |
| clienteId | String | FK → Cliente |
| repartoId | String? | FK → Reparto |
| fecha | DateTime | |
| estado | EstadoPedido | Default PENDIENTE |
| motivoFalla | String? | |
| orden | Int | orden de entrega en la ruta |
| deletedAt | DateTime? | soft delete |
| cliente | Cliente | relacion |
| reparto | Reparto? | relacion |
| items | PedidoItem[] | relacion 1:N |

**PedidoItem** (tabla pivot)
| Campo | Tipo | Notas |
|---|---|---|
| id | String (UUID) | PK |
| pedidoId | String | FK → Pedido |
| itemId | String | FK → Item |
| cantidad | Int | |
| precioUnitario | Float? | |

**Reparto**
| Campo | Tipo | Notas |
|---|---|---|
| id | String (UUID) | PK |
| repartidorId | String | FK → Usuario |
| fecha | DateTime (Date) | solo fecha sin hora |
| estado | EstadoReparto | Default PENDIENTE |
| horaInicio, horaFin | String? | HH:MM |
| repartidor | Usuario | relacion |
| pedidos | Pedido[] | relacion 1:N |
| Unique | [repartidorId, fecha] | solo un reparto por repartidor/dia |

---

## 2. Estructura de Carpetas `src/`

```
src/
├── app.ts                  # Configura Express y monta rutas
├── server.ts               # Entry point: importa dotenv, inicia el server
├── config/
│   ├── .gitkeep
│   └── env.ts              # Variables de entorno tipadas
├── constants/
│   └── .gitkeep
├── lib/
│   ├── .gitkeep
│   └── prisma.ts           # Prisma cliente singleton con PrismaPg adapter
├── middleware/
│   ├── .gitkeep
│   ├── auth.middleware.ts   # authenticate + requireRole
│   ├── error-handler.ts     # Manejador global de errores
│   └── __tests__/
│       └── auth.middleware.test.ts
├── utils/
│   ├── .gitkeep
│   ├── api-error.ts         # Clase ApiError con métodos estáticos
│   └── response.ts          # sendSuccess, sendList helpers
├── features/
│   ├── .gitkeep
│   ├── auth/
│   │   ├── routes.ts
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── schema.ts
│   │   ├── types.ts
│   │   └── __tests__/
│   │       ├── auth.service.test.ts
│   │       └── auth.controller.test.ts
│   ├── clientes/
│   │   ├── routes.ts
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── schema.ts
│   │   └── __tests__/
│   │       ├── clientes.service.test.ts
│   │       └── clientes.controller.test.ts
│   ├── items/
│   │   ├── routes.ts
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   └── schema.ts
│   ├── pedidos/
│   │   ├── routes.ts
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── schema.ts
│   │   └── __tests__/
│   │       └── pedidos.service.test.ts
│   ├── repartos/
│   │   ├── routes.ts
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   └── schema.ts
│   └── usuarios/
│       ├── routes.ts
│       ├── controller.ts
│       ├── service.ts
│       ├── schema.ts
│       ├── types.ts
│       └── __tests__/
│           └── usuarios.service.test.ts
```

---

## 3. Montaje de Rutas (app.ts)

Archivo: `src/app.ts`

```typescript
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clientes', clientesRoutes);
app.use('/api/v1/items', itemsRoutes);
app.use('/api/v1/pedidos', pedidosRoutes);
app.use('/api/v1/repartos', repartosRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
```

Orden: helmet → cors → json → morgan → health check `/health` → rutas API → errorHandler.

El server escucha en `0.0.0.0:3000` (puerto configurable via `PORT` env).

---

## 4. Features y sus Endpoints

### 4.1 Feature `auth` (ruta: `/api/v1/auth`)

| Método | Endpoint | Auth | Rol | Descripción |
|---|---|---|---|---|
| POST | `/login` | No | - | Login: email+password → `{ token, usuario }` |
| GET | `/me` | Sí | cualquiera | Obtener usuario autenticado |
| PATCH | `/me` | Sí | cualquiera | Actualizar nombre/apellido/email propio |

**Schemas (Zod):**
- `loginSchema`: `{ email, password }`
- `actualizarMeSchema`: `{ nombre?, apellido?, email? }` (al menos uno)

**Tipos:**
- `UsuarioResponse`: `{ id, email, nombre, apellido, rol, activo }`
- `AuthResponse`: `{ token, usuario }`
- `LoginInput`: `{ email, password }`
- `UpdateMeInput`: `{ nombre?, apellido?, email? }`

**Lógica del service:**
- `login()`: busca usuario por email, verifica bcrypt, genera JWT con payload `{ userId, email, rol }`, expira en 24h.
- `getMe()`: busca usuario por ID.
- `updateMe()`: actualiza campos parciales, maneja unique constraint de email.

---

### 4.2 Feature `clientes` (ruta: `/api/v1/clientes`)

| Método | Endpoint | Auth | Rol | Descripción |
|---|---|---|---|---|
| GET | `/` | Sí | cualquiera | Listar clientes activos (filtro: `?nombre=&dia=`) |
| GET | `/:id` | Sí | cualquiera | Obtener cliente |
| POST | `/` | Sí | ADMIN | Crear cliente |
| PATCH | `/:id` | Sí | ADMIN | Actualizar cliente |
| DELETE | `/:id` | Sí | ADMIN | Soft-delete (activo=false) |

**Schemas (Zod):** Validación completa con `clienteSchema` y `actualizarClienteSchema`. Valida formato de teléfono (7-15 digitos), coordenadas, horarios (formato HH:MM, que desde < hasta), diaEntrega enum.

**Service features:**
- `listarClientes()`: solo activos
- `listarTodosLosClientes()`: incluye inactivos
- `crearCliente()`: valida telefono unico
- `actualizarCliente()`: valida telefono unico si cambia
- `eliminarCliente()`: soft-delete, verifica pedidos activos

---

### 4.3 Feature `items` (ruta: `/api/v1/items`)

| Método | Endpoint | Auth | Rol | Descripción |
|---|---|---|---|---|
| GET | `/` | Sí | cualquiera | Listar items (`?activo=true/false`) |
| GET | `/:id` | Sí | cualquiera | Obtener item |

**Nota:** Solo lectura. No hay POST/PATCH/DELETE (los schemas existen pero no se usan en rutas).

---

### 4.4 Feature `pedidos` (ruta: `/api/v1/pedidos`)

| Método | Endpoint | Auth | Rol | Descripción |
|---|---|---|---|---|
| GET | `/hoy` | Sí | cualquiera | Pedidos del día (`?repartidorId=`) |
| GET | `/disponibles` | Sí | ADMIN | Pedidos PENDIENTE sin reparto (`?fecha=`) |
| GET | `/` | Sí | cualquiera | Listar con filtros (`?clienteNombre=&estado=&fecha=&page=&pageSize=`) |
| GET | `/:id` | Sí | cualquiera | Obtener pedido detalle |
| POST | `/` | Sí | ADMIN/REPARTIDOR | Crear pedido con items |
| PATCH | `/:id/estado` | Sí | ADMIN/REPARTIDOR | Cambiar estado (maquina de estados) |
| DELETE | `/:id` | Sí | ADMIN/REPARTIDOR | Soft delete |
| POST | `/:pedidoId/items` | Sí | ADMIN/REPARTIDOR | Agregar item a pedido |
| PATCH | `/:pedidoId/items/:itemId` | Sí | ADMIN/REPARTIDOR | Actualizar cantidad de item |
| DELETE | `/:pedidoId/items/:itemId` | Sí | ADMIN/REPARTIDOR | Quitar item de pedido |
| PATCH | `/:id/confirmar` | Sí | REPARTIDOR | PENDIENTE/EN_RUTA → ENTREGADO |
| PATCH | `/:id/cancelar` | Sí | REPARTIDOR | PENDIENTE/EN_RUTA → NO_ENTREGADO (+ motivo) |

**Schemas (Zod):**
- `crearPedidoSchema`: `{ clienteId, fecha?, orden?, items: [{itemId, cantidad}] }`
- `actualizarEstadoSchema`: `{ estado: EN_RUTA|ENTREGADO|NO_ENTREGADO|CANCELADO }`
- `agregarItemSchema`: `{ itemId, cantidad }`
- `actualizarCantidadSchema`: `{ cantidad }`
- `cancelarPedidoSchema`: `{ motivo: CLIENTE_AUSENTE|DIRECCION_INCORRECTA|ACCESO_DENEGADO|OTRO }`

**Maquina de estados (transiciones validas):**
```
PENDIENTE → EN_RUTA | NO_ENTREGADO | CANCELADO
EN_RUTA   → ENTREGADO | NO_ENTREGADO
ENTREGADO → (ninguna)
NO_ENTREGADO → (ninguna)
CANCELADO → (ninguna)
```

---

### 4.5 Feature `repartos` (ruta: `/api/v1/repartos`)

| Método | Endpoint | Auth | Rol | Descripción |
|---|---|---|---|---|
| GET | `/` | Sí | cualquiera | Listar repartos (`?repartidorId=&fecha=&estado=`) |
| GET | `/hoy` | Sí | REPARTIDOR | Reparto del dia del repartidor autenticado |
| GET | `/:id` | Sí | cualquiera | Obtener reparto con pedidos |
| GET | `/:id/carga` | Sí | cualquiera | Resumen de carga (items agregados) |
| PATCH | `/:id/estado` | Sí | cualquiera | Cambiar estado (EN_CURSO/COMPLETADO) |
| POST | `/` | Sí | ADMIN | Crear reparto |
| GET | `/admin` | Sí | ADMIN | Listar todos los repartos (admin) |
| GET | `/admin/:id` | Sí | ADMIN | Detalle de reparto (admin) |
| POST | `/admin/:repartoId/pedidos` | Sí | ADMIN | Agregar pedido a reparto |
| DELETE | `/admin/:repartoId/pedidos/:pedidoId` | Sí | ADMIN | Quitar pedido de reparto |

**Schemas (Zod):**
- `crearRepartoSchema`: `{ repartidorId, fecha (YYYY-MM-DD), pedidoIds: string[] }`
- `actualizarEstadoSchema`: `{ estado: EN_CURSO|COMPLETADO }`
- `agregarPedidoRepartoSchema`: `{ pedidoId }`

**Service features destacadas:**
- `crearReparto()`: valida repartidor existe y es REPARTIDOR, que no tenga ya reparto en esa fecha, que todos los pedidos existan, esten PENDIENTE, sin reparto asignado, misma fecha.
- `actualizarEstado()`: validaciones de transicion (no retroceder, no duplicar EN_CURSO, requiere todos pedidos procesados para COMPLETADO), registra horaInicio/horaFin.
- `agregarPedidoAReparto()`: solo en reparto PENDIENTE, valida pedido existente, pendiente, sin reparto, misma fecha.
- `quitarPedidoDeReparto()`: solo en reparto PENDIENTE, valida que el pedido pertenezca al reparto.
- `obtenerResumenCarga()`: agrupa items de todos los pedidos del reparto.

---

### 4.6 Feature `usuarios` (ruta: `/api/v1/usuarios`)

**Todas las rutas requieren `authenticate` + `requireRole('ADMIN')`** (definido a nivel de router con `router.use()`).

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Listar usuarios (excluye al admin autenticado) |
| GET | `/:id` | Obtener usuario |
| POST | `/` | Crear usuario (con hash bcrypt) |
| PATCH | `/:id` | Actualizar usuario (campos parciales) |
| DELETE | `/:id` | Desactivar usuario (soft delete lógico) |

**Tipos:**
- `UsuarioResponse`: `{ id, email, nombre, apellido, rol, activo }`
- `CrearUsuarioInput`: `{ email, password, nombre, apellido, rol? }`
- `ActualizarUsuarioInput`: `{ email?, nombre?, apellido?, rol?, activo? }`

**Service features:**
- `listarUsuarios()`: opcionalmente excluye al admin que hace la consulta
- `crearUsuario()`: hash de password, maneja email duplicado
- `desactivarUsuario()`: no permite autodesactivarse, no permite dejar 0 admins activos

---

## 5. Middleware de Autenticación (`src/middleware/auth.middleware.ts`)

**`authenticate`** (middleware):
1. Extrae header `Authorization: Bearer <token>`
2. Verifica JWT con `env.jwtSecret`
3. Decodifica payload: `{ userId, email, rol }`
4. Asigna `req.user` con el payload
5. Si no hay token: `ApiError.unauthorized('Token no proporcionado')`
6. Si token expirado: `ApiError.unauthorized('Token expirado')`
7. Si token inválido: `ApiError.unauthorized('Token inválido')`

**`requireRole(...roles)`** (middleware factory):
- Verifica que `req.user.rol` esté incluido en los roles permitidos
- Si no autenticado: `ApiError.unauthorized('No autenticado')`
- Si rol no permitido: `ApiError.forbidden('No tiene permisos para esta acción')`

**Tipos:**
```typescript
interface JwtPayload {
  userId: string;
  email: string;
  rol: 'REPARTIDOR' | 'ADMIN';
}
```
Extensión global de Express: `req.user?: JwtPayload`

---

## 6. Error Handler (`src/middleware/error-handler.ts`)

Manejador global de errores Express (4 parámetros).

**Flujo:**
1. Si error es `ZodError` → 400 con código `VALIDATION_ERROR`, detalles por campo
2. Si error es `ApiError` → statusCode del error con su código y mensaje
3. Cualquier otro error → 500 `INTERNAL_ERROR` (con log en consola)

**Formato de respuesta de error:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | BAD_REQUEST | INTERNAL_ERROR",
    "message": "...",
    "timestamp": "ISO string",
    "details": { "campo": ["mensaje1", "mensaje2"] }
  }
}
```

---

## 7. ApiError (`src/utils/api-error.ts`)

Clase que extiende `Error` con métodos estáticos:

| Método | HTTP Status | Código |
|---|---|---|
| `badRequest(msg, details?)` | 400 | `BAD_REQUEST` |
| `unauthorized(msg)` | 401 | `UNAUTHORIZED` |
| `forbidden(msg)` | 403 | `FORBIDDEN` |
| `notFound(msg)` | 404 | `NOT_FOUND` |
| `conflict(msg)` | 409 | `CONFLICT` |
| `internal(msg)` | 500 | `INTERNAL_ERROR` |

---

## 8. Response Helpers (`src/utils/response.ts`)

```typescript
sendSuccess<T>(res, data, statusCode=200)  → { data: T }
sendList<T>(res, data[], total?)            → { data: T[], total: number }
```

---

## 9. Config (`src/config/env.ts`)

Variables de entorno tipadas:
| Variable | Default |
|---|---|
| `NODE_ENV` | `development` |
| `PORT` | `3000` |
| `DATABASE_URL` | `''` |
| `JWT_SECRET` | `supplycycle-dev-secret` |
| `JWT_EXPIRES_IN` | `24h` |
| `BCRYPT_SALT_ROUNDS` | `10` |
| `CORS_ORIGIN` | `*` |
| `LOG_LEVEL` | `debug` |

---

## 10. Prisma Client Singleton (`src/lib/prisma.ts`)

```typescript
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

const connectionString = `${process.env['DATABASE_URL']}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

Usa `@prisma/adapter-pg` con connection string de DATABASE_URL. El cliente generado está en `generated/prisma/`.

---

## 11. Seed (`prisma/seed.ts`)

Crea datos de prueba:
- **Usuarios:** `repartidor@supplycycle.com` / `Repartidor123` (rol REPARTIDOR), `admin@supplycycle.com` / `Admin1234` (rol ADMIN)
- **Items:** Bidón 20L ($1500), Bidón 12L ($900), Bidón 6L ($600)
- **Clientes:** 6 clientes en CABA, todos con diaEntrega LUNES
- **Reparto:** 1 reparto EN_CURSO para hoy, asignado al repartidor
- **Pedidos:** 6 pedidos asociados al reparto (varios estados: PENDIENTE, ENTREGADO, NO_ENTREGADO)

---

## 12. Resumen de Tecnologías

| Componente | Tecnología |
|---|---|
| Runtime | Node.js (TypeScript 6, ESModules) |
| Framework | Express 5 |
| ORM | Prisma 7 + PostgreSQL (via `@prisma/adapter-pg`) |
| Validación | Zod 4 |
| Autenticación | JWT (jsonwebtoken) + bcrypt |
| Middleware | helmet, cors, morgan (morgan reemplazable por pino) |
| Testing | Vitest + supertest |
| Build | tsc (TypeScript compiler) |
| Dev | tsx watch |

**Archivos totales en features:** 6 features con estructura completa (routes, controller, service, schema, types donde aplica, y tests). Cada feature sigue el estándar definido en `rules/coding-standards.md`.
</task_result>
```

**Tool: task**

**Input:**
```json
{
  "description": "Explorar mobile estructura",
  "prompt": "Explora exhaustivamente la estructura del mobile en C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile. Necesito entender:\n\n1. La estructura de carpetas completa (app/, features/, components/, services/, store/, types/, hooks/)\n2. La navegación actual en app/ (layouts, tabs, rutas)\n3. Las features existentes en features/ - especialmente auth, pedidos, repartos\n4. Los tipos globales en types/\n5. Los servicios HTTP en services/\n6. El store de autenticación\n7. Los hooks existentes (especialmente useNetworkStatus)\n8. Los componentes UI en components/ui/\n\nDevuelve:\n- La estructura completa del árbol de directorios (especialmente app/ y features/)\n- El contenido de los archivos de layout (_layout.tsx) \n- Los tipos globales\n- Los servicios API\n- El authStore\n- Los hooks y servicios de la feature pedidos (si existe)\n- Cualquier hook o servicio de repartos\n- Los componentes UI disponibles",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_199f11ebfffeHsCp5S37NHl5uS (for resuming to continue this task if needed)

<task_result>
Con toda la información recolectada, aquí está el reporte completo de la estructura del proyecto mobile.

---

## 1. ÁRBOL DE DIRECTORIOS COMPLETO

```
mobile/
├── app/                              # Expo Router (file-based routing)
│   ├── _layout.tsx                   # Auth Gate (Stack raíz)
│   ├── login.tsx                     # Pantalla de login
│   ├── modal.tsx                     # Modal genérico
│   └── (tabs)/                       # Bottom Tab Navigator (autenticado)
│       ├── _layout.tsx               # Tabs layout (5-7 tabs según rol)
│       ├── index.tsx                 # Inicio (Home route)
│       ├── perfil.tsx                # Perfil (tab directo, sin stack)
│       ├── pedidos/
│       │   ├── _layout.tsx           # Stack: index → [id] → alta
│       │   ├── index.tsx             # Lista general de pedidos
│       │   ├── [id].tsx              # Detalle pedido (reutiliza PedidoDetalleScreen)
│       │   └── alta.tsx              # Alta de pedido (admin)
│       ├── repartos/
│       │   ├── _layout.tsx           # Stack: index → [id] → crear → detalle-admin/[id]
│       │   ├── index.tsx             # Lista de entregas del día (repartidor)
│       │   ├── [id].tsx              # Detalle pedido desde repartos
│       │   ├── crear.tsx             # Crear reparto (admin)
│       │   └── detalle-admin/
│       │       └── [id].tsx          # Detalle admin de reparto
│       ├── clientes/
│       │   ├── _layout.tsx           # Stack (protegido: solo ADMIN)
│       │   ├── index.tsx
│       │   ├── [id].tsx
│       │   └── alta.tsx
│       ├── usuarios/
│       │   ├── _layout.tsx           # Stack (protegido: solo ADMIN)
│       │   ├── index.tsx
│       │   ├── [id].tsx
│       │   └── alta.tsx
│       └── mapa/
│           ├── _layout.tsx           # Stack: index → [id]
│           ├── index.tsx             # Mapa con marcadores
│           └── [id].tsx              # Detalle pedido desde mapa
│
├── features/
│   ├── auth/                         # Autenticación
│   │   ├── services/
│   │   │   ├── authStorage.ts        # SecureStore (token)
│   │   │   ├── authService.ts        # loginRequest, getMeRequest, updateMeRequest
│   │   │   └── __tests__/
│   │   ├── hooks/
│   │   │   ├── useLogin.ts           # useMutation para login
│   │   │   └── __tests__/
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── __tests__/
│   │   └── __tests__/
│   │
│   ├── pedidos/                      # Pedidos / Entregas
│   │   ├── services/
│   │   │   ├── pedidoService.ts      # CRUD pedidos + items
│   │   │   └── __tests__/
│   │   ├── hooks/
│   │   │   ├── usePedidos.ts         # 8 hooks (usePedidosDelDia, usePedidoDetalle, useBuscarPedidos, useCrearPedido, useConfirmarEntrega, useCancelarPedido, useAgregarItem, useActualizarCantidadItem, useQuitarItem)
│   │   │   └── __tests__/
│   │   ├── screens/
│   │   │   ├── PedidosListScreen.tsx
│   │   │   ├── PedidoDetalleScreen.tsx
│   │   │   ├── PedidoAltaScreen.tsx
│   │   │   └── __tests__/
│   │   └── components/
│   │       ├── EstadoBadge.tsx
│   │       ├── InfoCliente.tsx
│   │       ├── ItemsList.tsx
│   │       ├── TotalCard.tsx
│   │       ├── MotivoFallaCard.tsx
│   │       ├── ConfirmarAccionButtons.tsx
│   │       ├── CancelModal.tsx
│   │       └── AddItemModal.tsx
│   │
│   ├── repartos/                     # Repartos (entregas del día)
│   │   ├── services/
│   │   │   ├── repartoService.ts     # CRUD repartos + gestión pedidos
│   │   │   └── __tests__/
│   │   ├── hooks/
│   │   │   ├── useReparto.ts         # useReparto (hoy), useRepartoDetalle
│   │   │   ├── useRepartoAdmin.ts    # useRepartosAdmin, useRepartoAdminDetalle
│   │   │   ├── useRepartoAdminDetalleData.ts  # Procesa datos agrupados
│   │   │   ├── useCrearReparto.ts    # useRepartidores, usePedidosDisponibles, useCrearReparto
│   │   │   ├── useEditarReparto.ts   # Editar reparto (agregar/quitar pedidos)
│   │   │   └── __tests__/
│   │   └── screens/
│   │       ├── InicioScreen.tsx      # Próxima entrega + progreso
│   │       ├── RepartosListScreen.tsx # Lista de entregas del día
│   │       ├── CrearRepartoScreen.tsx # Crear reparto (admin)
│   │       ├── AdminRepartosListScreen.tsx # Lista admin de repartos
│   │       ├── AdminRepartoDetalleScreen.tsx # Detalle admin de reparto
│   │       └── __tests__/
│   │
│   ├── clientes/                     # CRUD Clientes (admin)
│   │   ├── services/clienteService.ts
│   │   ├── hooks/useClientes.ts
│   │   └── screens/
│   │       ├── ClientesListScreen.tsx
│   │       ├── ClienteAltaScreen.tsx
│   │       └── ClienteEditarScreen.tsx
│   │
│   ├── usuarios/                     # CRUD Usuarios (admin)
│   │   ├── services/usuarioService.ts
│   │   ├── hooks/useUsuarios.ts
│   │   └── screens/
│   │       ├── UsuariosListScreen.tsx
│   │       ├── UsuarioAltaScreen.tsx
│   │       └── UsuarioEditarScreen.tsx
│   │
│   ├── perfil/                       # Perfil del usuario
│   │   └── screens/
│   │       └── PerfilScreen.tsx
│   │
│   └── mapa/                         # Mapa
│       └── screens/
│           ├── MapaScreen.tsx
│           └── __tests__/
│
├── components/
│   ├── ui/                           # Componentes UI atómicos
│   │   ├── index.ts                  # Barrel exports
│   │   ├── button.tsx                # Botón con variantes
│   │   ├── card.tsx                  # Tarjeta presionable
│   │   ├── input.tsx                 # Input con label y error
│   │   ├── header.tsx                # Header "SupplyCycle" con back
│   │   ├── loading-spinner.tsx       # ActivityIndicator + mensaje
│   │   ├── error-message.tsx         # Mensaje error + reintento
│   │   ├── connectivity-banner.tsx   # Banner "sin conexión"
│   │   ├── confirm-modal.tsx         # Modal de confirmación
│   │   ├── Toast.tsx                 # Toast animado (reanimated)
│   │   ├── ApiStatusBanner.tsx       # Banner status de API calls
│   │   ├── collapsible.tsx           # Acordeón colapsable
│   │   ├── icon-symbol.tsx           # Icono cross-platform (SF Symbols / MaterialIcons)
│   │   ├── icon-symbol.ios.tsx       # Versión iOS específica
│   │   ├── DatePickerField.tsx       # Campo de fecha
│   │   ├── CalendarModal.tsx         # Modal calendario
│   │   └── __tests__/                # Tests unitarios de cada componente
│   │
│   ├── themed-view.tsx               # View con theme
│   ├── themed-text.tsx               # Text con theme
│   ├── parallax-scroll-view.tsx      # Scroll parallax
│   ├── hello-wave.tsx                # Componente decorativo
│   ├── haptic-tab.tsx                # Tab con feedback háptico
│   └── external-link.tsx             # Link externo
│
├── services/                         # Servicios globales HTTP
│   ├── api.ts                        # Singleton Axios + interceptors
│   ├── handleApiError.ts             # Transforma errores a formato legible
│   ├── repartos.ts                   # getRepartosDisponiblesRequest
│   ├── items.ts                      # getItemsRequest
│   └── index.ts
│
├── stores/                           # Zustand stores
│   ├── index.ts                      # Barrel: authStore, uiStore, offlineStore
│   ├── authStore.ts                  # Token, usuario, isAuthenticated, isLoading
│   ├── uiStore.ts                    # Modo offline
│   ├── offlineStore.ts               # Cola de mutaciones offline
│   ├── apiStatusStore.ts             # Historial de llamadas API
│   ├── toastStore.ts                 # Estado del toast
│   └── __tests__/
│
├── hooks/                            # Hooks globales
│   ├── useNetworkStatus.ts           # NetInfo: isConnected, connectionType
│   ├── useOfflineSync.ts             # Sincroniza cola offline al recovery
│   ├── useToast.ts                   # Hook helper para mostrar toast
│   ├── use-theme-color.ts            # Color del theme actual
│   ├── use-color-scheme.ts           # Esquema de color (light/dark)
│   └── use-color-scheme.web.ts       # Versión web
│
├── types/                            # Tipos TypeScript globales
│   ├── index.ts                      # Barrel: re-exporta todos
│   ├── api.ts                        # ApiResponse<T>, ApiListResponse<T>, ApiError
│   ├── usuario.ts                    # Usuario, AuthResponse, LoginCredentials
│   ├── cliente.ts                    # Cliente, Domicilio, CrearClienteInput
│   ├── item.ts                       # Item, PedidoItem
│   ├── pedido.ts                     # Pedido, EstadoPedido, MotivoCancelacion
│   └── reparto.ts                    # Reparto, RepartoAdminListItem, RepartoAdminDetalle, ResumenCarga
│
├── constants/
│   ├── theme.ts                      # Colores, Spacing, FontSizes, BorderRadius, Fonts
│   └── motivosCancelacion.ts         # Motivos de cancelación
│
├── lib/
│   └── queryClient.ts                # TanStack Query Client singleton
│
├── utils/
│   ├── date.ts                       # parseISODate, formatFechaDisplay, ddmmyyyyToISO, etc.
│   ├── withFallback.ts               # Helper para fallback a mock
│   └── confirmAction.ts              # Confirmación de acción
│
├── mocks/                            # Datos mock para desarrollo
├── __mocks__/                        # Mocks para tests
├── assets/                           # Imágenes (iconos, splash)
├── rules/                            # Reglas/documentación del proyecto
└── [config files]                    # package.json, tsconfig.json, vitest.config.ts, etc.
```

---

## 2. NAVEGACIÓN (app/)

### `app/_layout.tsx` — Auth Gate (Stack raíz)

```
Stack (headerShown: false)
├── login          (animation: fade) → LoginScreen
├── (tabs)         (animation: fade) → TabNavigator
└── modal          (presentation: modal)
```

**Lógica de bootstrap:**
1. Al montar, intenta leer token de SecureStore via `getToken()`
2. Si hay token, llama a `GET /auth/me` para validar y obtener usuario
3. Si es válido → `setAuth(token, usuario)` → se renderizan los tabs
4. Si no hay token o falla → `setLoading(false)` → se muestra login
5. Mientras carga → muestra `LoadingSpinner("Iniciando sesión...")`
6. Incluye `<QueryClientProvider>`, `<Toast />`, y `useOfflineSync()`

### `app/(tabs)/_layout.tsx` — Bottom Tab Navigator

```
Tabs (headerShown: false)
├── index          (href: null)                  → InicioScreen (repartidor) / Redirect /pedidos (admin)
├── clientes       (href: null si !ADMIN)        → Clientes (admin only)
├── repartos       (shippingbox.fill)            → Repartos
├── pedidos        (clipboard.fill)              → Pedidos
├── mapa           (map.fill)                    → Mapa
├── usuarios       (href: null si !ADMIN)        → Usuarios (admin only)
└── perfil         (person.fill)                 → Perfil
```

- Íconos: SF Symbols (iOS) / MaterialIcons (Android) via `IconSymbol`
- `ConnectivityBanner` se muestra al inicio (hardcodeado `isConnected={true}`)
- Si no autenticado → `<Redirect href="/login" />`

### Layouts internos por tab

**`pedidos/_layout.tsx`**: Stack { index → [id] → alta }
**`repartos/_layout.tsx`**: Stack { index → [id] → crear → detalle-admin/[id] }
**`mapa/_layout.tsx`**: Stack { index → [id] }
**`clientes/_layout.tsx`**: Stack { index → [id] → alta } — protegido: solo ADMIN
**`usuarios/_layout.tsx`**: Stack { index → [id] → alta } — protegido: solo ADMIN

### Pantallas de detalle compartidas

Las rutas `pedidos/[id]`, `repartos/[id]`, y `mapa/[id]` **todas renderizan el mismo componente** `PedidoDetalleScreen` desde `features/pedidos/screens/`, cada una con su propio `onBack`:
- `/pedidos/[id]` → `router.replace('/pedidos')`
- `/repartos/[id]` → `router.replace('/repartos')`
- `/mapa/[id]` → `router.replace('/mapa')`

---

## 3. FEATURES EXISTENTES

### 3a. `features/auth/` — Autenticación

| Archivo | Descripción |
|---|---|
| `services/authStorage.ts` | `saveToken`, `getToken`, `clearToken` sobre SecureStore con fallback a AsyncStorage |
| `services/authService.ts` | `loginRequest(credentials)`, `getMeRequest()`, `updateMeRequest(input)` |
| `hooks/useLogin.ts` | `useMutation` → llama `loginRequest`, guarda token en SecureStore, actualiza authStore |
| `screens/LoginScreen.tsx` | Formulario login con validación, muestra errores del server |

### 3b. `features/pedidos/` — Pedidos

**Services** (`pedidoService.ts`):
- `getPedidosDelDiaRequest(repartidorId)` → `GET /pedidos/hoy`
- `getPedidoByIdRequest(id)` → `GET /pedidos/{id}`
- `getPedidosRequest(params)` → `GET /pedidos?clienteNombre&fecha&estado`
- `confirmarEntregaRequest(id)` → `PATCH /pedidos/{id}/confirmar`
- `cancelarPedidoRequest(id, motivo)` → `PATCH /pedidos/{id}/cancelar`
- `crearPedidoRequest(data)` → `POST /pedidos`
- `agregarItemRequest(pedidoId, data)` → `POST /pedidos/{pedidoId}/items`
- `actualizarCantidadItemRequest(pedidoId, itemId, cantidad)` → `PATCH /pedidos/{pedidoId}/items/{itemId}`
- `quitarItemRequest(pedidoId, itemId)` → `DELETE /pedidos/{pedidoId}/items/{itemId}`

**Hooks** (`usePedidos.ts`):
| Hook | Función |
|---|---|
| `usePedidosDelDia()` | Query pedidos del día con caché offline en AsyncStorage |
| `usePedidoDetalle(id)` | Query pedido por ID |
| `useBuscarPedidos(params)` | Query búsqueda con filtros |
| `useCrearPedido()` | Mutation crear pedido, invalida queries |
| `useConfirmarEntrega()` | Mutation con soporte offline (encola si falla) |
| `useCancelarPedido()` | Mutation con soporte offline |
| `useAgregarItem(pedidoId)` | Mutation con soporte offline |
| `useActualizarCantidadItem(pedidoId)` | Mutation con soporte offline |
| `useQuitarItem(pedidoId)` | Mutation con soporte offline |

**Subcomponentes** (`features/pedidos/components/`):
- `EstadoBadge` — Badge de estado del pedido
- `InfoCliente` — Info del cliente
- `ItemsList` — Lista de items con modo edición
- `TotalCard` — Total del pedido
- `MotivoFallaCard` — Motivo de falla
- `ConfirmarAccionButtons` — Botones confirmar/cancelar entrega
- `CancelModal` — Modal selección motivo cancelación
- `AddItemModal` — Modal agregar item

### 3c. `features/repartos/` — Repartos

**Services** (`repartoService.ts`):
- `getRepartosAdminRequest(fecha?)` → `GET /repartos/admin`
- `getRepartoAdminByIdRequest(id)` → `GET /repartos/admin/{id}`
- `getRepartoHoyRequest()` → `GET /repartos/hoy`
- `getRepartosRequest(repartidorId, fecha?, estado?)` → `GET /repartos`
- `getRepartoByIdRequest(id)` → `GET /repartos/{id}`
- `getResumenCargaRequest(repartoId)` → `GET /repartos/{repartoId}/carga`
- `crearRepartoRequest(data)` → `POST /repartos`
- `getPedidosDisponiblesRequest(fecha)` → `GET /pedidos/disponibles`
- `updateRepartoEstadoRequest(id, estado)` → `PATCH /repartos/{id}/estado`
- `agregarPedidoARepartoRequest(repartoId, pedidoId)` → `POST /repartos/admin/{repartoId}/pedidos`
- `quitarPedidoDeRepartoRequest(repartoId, pedidoId)` → `DELETE /repartos/admin/{repartoId}/pedidos/{pedidoId}`

**Hooks**:
- `useReparto.ts` → `useReparto()` (reparto de hoy), `useRepartoDetalle(id)`
- `useRepartoAdmin.ts` → `useRepartosAdmin()`, `useRepartoAdminDetalle(id)`
- `useRepartoAdminDetalleData.ts` → Procesa datos: agrupa pedidos por estado, calcula métricas, progreso, resumen operativo
- `useCrearReparto.ts` → `useRepartidores()`, `usePedidosDisponibles(fecha)`, `useCrearReparto()`
- `useEditarReparto.ts` → Edición de reparto con `agregarMutation` y `quitarMutation`

**Screens**:
- `InicioScreen` — Tab "Inicio": barra de progreso + próxima entrega con botones llamar/mapa
- `RepartosListScreen` — Tab "Repartos": lista de entregas del día filtrable
- `AdminRepartosListScreen` — Admin: lista de repartos con filtro por fecha
- `AdminRepartoDetalleScreen` — Admin: detalle completo con métricas, progreso, grupos de pedidos, edición (agregar/quitar pedidos)
- `CrearRepartoScreen` — Admin: formulario crear reparto (fecha, repartidor, selección pedidos)

---

## 4. TIPOS GLOBALES (`types/`)

### `api.ts`
```ts
ApiResponse<T>       → { data: T }
ApiListResponse<T>   → { data: T[]; total: number }
ApiError             → { error: { code, message, timestamp, details? } }
```

### `usuario.ts`
```ts
Rol                  → 'REPARTIDOR' | 'ADMIN'
Usuario              → { id, email, nombre, apellido, rol, activo }
AuthResponse         → { token, usuario }
LoginCredentials     → { email, password }
CrearUsuarioInput    → { email, password, nombre, apellido, rol? }
ActualizarUsuarioInput → { email?, nombre?, apellido?, rol?, activo? }
```

### `cliente.ts`
```ts
DiaSemana            → 'LUNES' | 'MARTES' | ... | 'SABADO'
Domicilio            → { calle, numero, localidad, latitud, longitud }
Cliente              → { id, nombre, apellido, telefono, domicilio, diaEntrega, horarioDesde, horarioHasta, observaciones?, activo? }
CrearClienteInput    → { nombre, apellido, telefono, calle, numero, localidad, latitud, longitud, diaEntrega, horarioDesde, horarioHasta, observaciones? }
ActualizarClienteInput → Partial<CrearClienteInput>
```

### `item.ts`
```ts
Item                 → { id, nombre, descripcion?, unidad, precio?, activo }
PedidoItem           → { id, item: Item, cantidad, precioUnitario? }
```

### `pedido.ts`
```ts
EstadoPedido         → 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'NO_ENTREGADO' | 'CANCELADO'
MotivoCancelacion    → 'CLIENTE_AUSENTE' | 'DIRECCION_INCORRECTA' | 'ACCESO_DENEGADO' | 'OTRO'
Pedido               → { id, orden, estado, fecha, motivoFalla?, total?, itemsCount?, cliente: Cliente, items: PedidoItem[] }
```

### `reparto.ts`
```ts
EstadoReparto        → 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO'
ResumenCarga         → { producto, cantidadTotal, unidad }
RepartoAdminListItem → { id, fecha, estado, horaInicio?, horaFin?, repartidor: {id, nombre, apellido}, pedidosCount, resumen: {totalPedidos, completados, pendientes} }
RepartoAdminDetalle  → { id, repartidorId, fecha, estado, horaInicio?, horaFin?, repartidor: {id, nombre, apellido, email}, resumen: {...}, pedidos: Pedido[] }
Reparto              → { id, repartidorId, fecha, estado, horaInicio?, horaFin?, pedidos?: Pedido[], resumen?: {...} }
```

---

## 5. SERVICIOS HTTP (`services/`)

### `services/api.ts` — Cliente Axios singleton
```ts
apiClient = axios.create({
  baseURL: EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: EXPO_PUBLIC_API_TIMEOUT || 15000,
})
```

**Interceptors:**
- **Request**: Adjunta `Authorization: Bearer <token>` (primero desde store en memoria, luego SecureStore)
- **Response**: Si 401 → `clearToken()`, `logout()`, `router.replace('/login')`

### `services/handleApiError.ts`
Toma un error desconocido y devuelve `{ message, code, status, details? }` con mensajes en español.

### `services/repartos.ts`
- `getRepartosDisponiblesRequest(repartidorId)` → `GET /repartos?repartidorId=`

### `services/items.ts`
- `getItemsRequest()` → `GET /items`

---

## 6. STORES (Zustand)

### `stores/authStore.ts`
```ts
interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;  // ← true por defecto (bootstrapping)
  setAuth: (token, usuario) => void;
  setUser: (usuario) => void;
  setLoading: (loading) => void;
  logout: () => void;  // limpia todo
}
```

### `stores/uiStore.ts`
```ts
interface UiState {
  isOffline: boolean;
  setOffline: (offline) => void;
}
```

### `stores/offlineStore.ts`
```ts
OfflineMutation → { id, type: 'CONFIRMAR_ENTREGA'|'CANCELAR_PEDIDO'|'AGREGAR_ITEM'|'QUITAR_ITEM'|'ACTUALIZAR_CANTIDAD_ITEM', payload, createdAt, retryCount }

interface OfflineState {
  queue: OfflineMutation[];
  isSyncing: boolean;
  addToQueue, removeFromQueue, incrementRetry, setSyncing, clearQueue
}
```

### `stores/apiStatusStore.ts`
Historial de las últimas 20 llamadas API (`lastCall` + `history`).

### `stores/toastStore.ts`
```ts
interface ToastState {
  visible, message, type: 'success'|'error'|'info'|'warning', duration
  show, hide
}
```

---

## 7. HOOKS EXISTENTES

### Globales (`hooks/`)

| Hook | Descripción |
|---|---|
| `useNetworkStatus()` | Retorna `{ isConnected: boolean, connectionType: string \| null }` usando `NetInfo.addEventListener` |
| `useOfflineSync()` | Procesa cola de mutaciones offline cada 30s. Si `retryCount >= 3`, descarta. Al sincronizar, invalida queries de pedidos y reparto. |
| `useToast()` | Helper que expone `showToast(message, type?, duration?)` |
| `useColorScheme()` | Detecta light/dark mode |
| `useThemeColor()` | Retorna color del theme actual |

---

## 8. COMPONENTES UI DISPONIBLES (`components/ui/`)

| Componente | Props | Descripción |
|---|---|---|
| **Button** | `title`, `variant: primary/secondary/danger/ghost/success/warning`, `loading`, `disabled` | Botón con variantes de color |
| **Card** | `onPress?`, children | Tarjeta con borde y sombra, opcionalmente presionable |
| **Input** | `label?`, `error?`, + todas las TextInputProps | Input con label, foco y mensaje de error |
| **Header** | `title?` (default "SupplyCycle"), `onBack?` | Barra superior con título y botón de retroceso |
| **LoadingSpinner** | `message?`, `size?` | ActivityIndicator centrado con texto |
| **ErrorMessage** | `message`, `onRetry?` | Mensaje de error con icono y botón de reintento |
| **ConnectivityBanner** | `isConnected` | Banner "Sin conexión" que solo se muestra si `!isConnected` |
| **ConfirmModal** | `visible`, `title`, `message`, `confirmText?`, `cancelText?`, `onConfirm`, `onCancel`, `loading?`, `variant?` | Modal de confirmación |
| **Toast** | (usa toastStore) | Toast animado con reanimated, se posiciona arriba |
| **ApiStatusBanner** | (usa apiStatusStore) | Banner que muestra estado de última llamada API |
| **Collapsible** | children | Acordeón colapsable |
| **IconSymbol** | `name`, `size`, `color` | Icono cross-platform (SF Symbols en iOS, MaterialIcons en Android) |
| **DatePickerField** | `value`, `onChange`, `minimumDate?`, `placeholder?`, `error?` | Campo de fecha con selector |
| **CalendarModal** | — | Modal de calendario |

---

**Resumen de datos clave:**

- **Rutas de API**: versionadas bajo `/api/v1` (configurable via `EXPO_PUBLIC_API_URL`)
- **Autenticación**: JWT en SecureStore + Zustand store + TanStack Query mutations
- **Offline-first**: Las mutaciones críticas (confirmar/cancelar entrega, modificar items) tienen fallback offline con cola FIFO y hasta 3 reintentos
- **Roles**: `REPARTIDOR` y `ADMIN` — los tabs Clientes y Usuarios son exclusivos para admin
- **Tema**: light/dark mode completo via `useColorScheme()` + `Colors[colorScheme]`
- **Idioma UI**: Español; código en inglés
</task_result>
```

---

## Assistant (Plan · Big Pickle · 6.8s)

_Thinking:_

Excellent! I now have a comprehensive understanding of both the backend and mobile structures. Let me analyze the existing components more carefully, especially:

1. The existing `InicioScreen` in `features/repartos/screens/` - the user wants to replace/rework this
2. The `app/(tabs)/index.tsx` - this is the home tab
3. The existing `repartoService.ts` - to understand available endpoints
4. The existing hooks `useReparto.ts`

Let me read the key files to understand what already exists and what needs to be modified.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Explorar estructura del backend (prisma schema, rutas, controladores, servicios)",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Explorar estructura del mobile (features, hooks, servicios, tipos, navegación)",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Analizar archivos clave existentes (InicioScreen, useReparto, repartoService, etc.)",
      "status": "in_progress"
    },
    {
      "priority": "high",
      "content": "Analizar lógica existente de pedidos y repartos (backend y mobile)",
      "status": "pending"
    },
    {
      "priority": "medium",
      "content": "Revisar ADR y TDD documentación",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "Elaborar plan detallado de implementación",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Explorar estructura del backend (prisma schema, rutas, controladores, servicios)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Explorar estructura del mobile (features, hooks, servicios, tipos, navegación)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Analizar archivos clave existentes (InicioScreen, useReparto, repartoService, etc.)",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Analizar lógica existente de pedidos y repartos (backend y mobile)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Revisar ADR y TDD documentación",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Elaborar plan detallado de implementación",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Plan · Big Pickle · 6.4s)

_Thinking:_

Let me now read the key existing files I need to understand to create a proper plan.

Let me read the key existing files in detail.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\repartos\\screens\\InicioScreen.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\repartos\screens\InicioScreen.tsx</path>
<type>file</type>
<content>
1: import { StyleSheet, Text, View, Linking, Platform } from 'react-native';
2: import { ThemedView } from '@/components/themed-view';
3: import { Card, Button, LoadingSpinner, ErrorMessage, Header } from '@/components/ui';
4: import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
5: import { useColorScheme } from '@/hooks/use-color-scheme';
6: import { useReparto } from '@/features/repartos/hooks/useReparto';
7: import type { Pedido } from '@/types';
8: 
9: function getEstadoColor(estado: string, theme: typeof Colors.light): string {
10:   switch (estado) {
11:     case 'PENDIENTE':
12:       return theme.pendiente;
13:     case 'EN_RUTA':
14:       return theme.tint;
15:     case 'ENTREGADO':
16:       return theme.entregado;
17:     case 'NO_ENTREGADO':
18:       return theme.noEntregado;
19:     case 'CANCELADO':
20:       return theme.muted;
21:     default:
22:       return theme.text;
23:   }
24: }
25: 
26: function getEstadoLabel(estado: string): string {
27:   switch (estado) {
28:     case 'PENDIENTE':
29:       return 'Pendiente';
30:     case 'EN_RUTA':
31:       return 'En ruta';
32:     case 'ENTREGADO':
33:       return 'Entregado';
34:     case 'NO_ENTREGADO':
35:       return 'No entregado';
36:     case 'CANCELADO':
37:       return 'Cancelado';
38:     default:
39:       return estado;
40:   }
41: }
42: 
43: function ProximaEntregaCard({
44:   pedido,
45:   theme,
46: }: {
47:   pedido: Pedido;
48:   theme: typeof Colors.light;
49: }) {
50:   const handleCall = (phone: string) => {
51:     const url = Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`;
52:     Linking.openURL(url);
53:   };
54: 
55:   const handleOpenMaps = (lat: number, lng: number) => {
56:     const url = Platform.select({
57:       ios: `maps:0,0?q=${lat},${lng}`,
58:       android: `geo:0,0?q=${lat},${lng}`,
59:       default: `https://www.google.com/maps?q=${lat},${lng}`,
60:     });
61:     if (url) Linking.openURL(url);
62:   };
63: 
64:   return (
65:     <Card>
66:       <View style={styles.entregaHeader}>
67:         <View
68:           style={[
69:             styles.estadoBadge,
70:             { backgroundColor: getEstadoColor(pedido.estado, theme) + '20' },
71:           ]}
72:         >
73:           <Text
74:             style={[
75:               styles.estadoText,
76:               { color: getEstadoColor(pedido.estado, theme) },
77:             ]}
78:           >
79:             {getEstadoLabel(pedido.estado)}
80:           </Text>
81:         </View>
82:         <Text style={[styles.ordenText, { color: theme.muted }]}>
83:           #{pedido.orden}
84:         </Text>
85:       </View>
86: 
87:       <Text style={[styles.clienteNombre, { color: theme.text }]}>
88:         {pedido.cliente.nombre} {pedido.cliente.apellido}
89:       </Text>
90: 
91:       <Text style={[styles.direccion, { color: theme.muted }]}>
92:         {pedido.cliente.domicilio.calle} {pedido.cliente.domicilio.numero},{' '}
93:         {pedido.cliente.domicilio.localidad}
94:       </Text>
95: 
96:       <Text style={[styles.horario, { color: theme.info }]}>
97:         {pedido.cliente.horarioDesde} - {pedido.cliente.horarioHasta}
98:       </Text>
99: 
100:       <View style={styles.itemsList}>
101:         {pedido.items.map((item, idx) => (
102:           <Text key={idx} style={[styles.itemText, { color: theme.text }]}>
103:             • {item.cantidad}x {item.item.nombre}
104:           </Text>
105:         ))}
106:       </View>
107: 
108:       <View style={styles.actionButtons}>
109:         <Button
110:           title="Llamar"
111:           variant="secondary"
112:           onPress={() => handleCall(pedido.cliente.telefono)}
113:           style={styles.actionButton}
114:         />
115:         <Button
116:           title="Abrir mapa"
117:           variant="ghost"
118:           onPress={() =>
119:             handleOpenMaps(
120:               pedido.cliente.domicilio.latitud,
121:               pedido.cliente.domicilio.longitud
122:             )
123:           }
124:           style={styles.actionButton}
125:         />
126:       </View>
127:     </Card>
128:   );
129: }
130: 
131: function BarraProgreso({
132:   completados,
133:   total,
134:   theme,
135: }: {
136:   completados: number;
137:   total: number;
138:   theme: typeof Colors.light;
139: }) {
140:   const porcentaje = total > 0 ? (completados / total) * 100 : 0;
141: 
142:   return (
143:     <View style={styles.progressContainer}>
144:       <View style={styles.progressHeader}>
145:         <Text style={[styles.progressLabel, { color: theme.text }]}>
146:           Progreso del día
147:         </Text>
148:         <Text style={[styles.progressCount, { color: theme.muted }]}>
149:           {completados} de {total} entregas
150:         </Text>
151:       </View>
152:       <View style={[styles.progressBar, { backgroundColor: theme.surface }]}>
153:         <View
154:           style={[
155:             styles.progressFill,
156:             {
157:               width: `${Math.min(porcentaje, 100)}%`,
158:               backgroundColor: theme.entregado,
159:             },
160:           ]}
161:         />
162:       </View>
163:     </View>
164:   );
165: }
166: 
167: export default function InicioScreen() {
168:   const colorScheme = useColorScheme() ?? 'light';
169:   const theme = Colors[colorScheme];
170:   const { data: reparto, isLoading, isError, error } = useReparto();
171: 
172:   if (isLoading) {
173:     return <LoadingSpinner message="Cargando reparto..." />;
174:   }
175: 
176:   if (isError) {
177:     return (
178:       <ErrorMessage
179:         message={error?.message || 'Error al cargar el reparto'}
180:         onRetry={() => {}}
181:       />
182:     );
183:   }
184: 
185:   if (!reparto || !reparto.pedidos || reparto.pedidos.length === 0) {
186:     return (
187:       <ThemedView style={styles.container}>
188:         <Header />
189:         <View style={styles.emptyContainer}>
190:           <Text style={[styles.emptyTitle, { color: theme.text }]}>
191:             No hay ningún reparto activo en este momento
192:           </Text>
193:           <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
194:             Tus entregas del día aparecerán aquí cuando tengas un reparto
195:             asignado.
196:           </Text>
197:         </View>
198:       </ThemedView>
199:     );
200:   }
201: 
202:   const pendientes = reparto.pedidos.filter(
203:     (p) => p.estado === 'PENDIENTE' || p.estado === 'EN_RUTA'
204:   );
205:   const completados = reparto.pedidos.filter(
206:     (p) => p.estado === 'ENTREGADO' || p.estado === 'NO_ENTREGADO'
207:   );
208:   const proximaEntrega = pendientes[0];
209: 
210:   return (
211:     <ThemedView style={styles.container}>
212:       <Header />
213:       <View style={styles.content}>
214:         <BarraProgreso
215:           completados={completados.length}
216:           total={reparto.pedidos.length}
217:           theme={theme}
218:         />
219: 
220:         <Text style={[styles.sectionTitle, { color: theme.text }]}>
221:           Próxima entrega
222:         </Text>
223: 
224:         {proximaEntrega ? (
225:           <ProximaEntregaCard pedido={proximaEntrega} theme={theme} />
226:         ) : (
227:           <Card>
228:             <Text style={[styles.noPendingText, { color: theme.success }]}>
229:               ¡Todas las entregas están completadas!
230:             </Text>
231:           </Card>
232:         )}
233:       </View>
234:     </ThemedView>
235:   );
236: }
237: 
238: const styles = StyleSheet.create({
239:   container: {
240:     flex: 1,
241:   },
242:   content: {
243:     flex: 1,
244:     padding: Spacing.lg,
245:   },
246:   sectionTitle: {
247:     fontSize: FontSizes.lg,
248:     fontWeight: 'bold',
249:     marginBottom: Spacing.md,
250:     marginTop: Spacing.lg,
251:   },
252:   entregaHeader: {
253:     flexDirection: 'row',
254:     justifyContent: 'space-between',
255:     alignItems: 'center',
256:     marginBottom: Spacing.sm,
257:   },
258:   estadoBadge: {
259:     paddingHorizontal: Spacing.sm,
260:     paddingVertical: Spacing.xs,
261:     borderRadius: BorderRadius.sm,
262:   },
263:   estadoText: {
264:     fontSize: FontSizes.xs,
265:     fontWeight: '600',
266:   },
267:   ordenText: {
268:     fontSize: FontSizes.xs,
269:   },
270:   clienteNombre: {
271:     fontSize: FontSizes.lg,
272:     fontWeight: 'bold',
273:     marginBottom: Spacing.xs,
274:   },
275:   direccion: {
276:     fontSize: FontSizes.sm,
277:     marginBottom: Spacing.xs,
278:   },
279:   horario: {
280:     fontSize: FontSizes.sm,
281:     fontWeight: '500',
282:     marginBottom: Spacing.md,
283:   },
284:   itemsList: {
285:     marginBottom: Spacing.md,
286:   },
287:   itemText: {
288:     fontSize: FontSizes.sm,
289:     marginBottom: 2,
290:   },
291:   actionButtons: {
292:     flexDirection: 'row',
293:     gap: Spacing.sm,
294:   },
295:   actionButton: {
296:     flex: 1,
297:   },
298:   progressContainer: {
299:     marginBottom: Spacing.md,
300:   },
301:   progressHeader: {
302:     flexDirection: 'row',
303:     justifyContent: 'space-between',
304:     alignItems: 'center',
305:     marginBottom: Spacing.sm,
306:   },
307:   progressLabel: {
308:     fontSize: FontSizes.sm,
309:     fontWeight: '600',
310:   },
311:   progressCount: {
312:     fontSize: FontSizes.sm,
313:   },
314:   progressBar: {
315:     height: 10,
316:     borderRadius: 5,
317:     overflow: 'hidden',
318:   },
319:   progressFill: {
320:     height: '100%',
321:     borderRadius: 5,
322:   },
323:   emptyContainer: {
324:     flex: 1,
325:     justifyContent: 'center',
326:     alignItems: 'center',
327:     padding: Spacing.xl,
328:   },
329:   emptyTitle: {
330:     fontSize: FontSizes.lg,
331:     fontWeight: 'bold',
332:     textAlign: 'center',
333:     marginBottom: Spacing.md,
334:   },
335:   emptySubtitle: {
336:     fontSize: FontSizes.md,
337:     textAlign: 'center',
338:   },
339:   noPendingText: {
340:     fontSize: FontSizes.md,
341:     fontWeight: '600',
342:     textAlign: 'center',
343:   },
344: });

(End of file - total 344 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\repartos\\hooks\\useReparto.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\repartos\hooks\useReparto.ts</path>
<type>file</type>
<content>
1: import { useQuery } from '@tanstack/react-query';
2: import { getRepartoHoyRequest, getRepartoByIdRequest } from '@/features/repartos/services/repartoService';
3: import type { Reparto } from '@/types';
4: 
5: export function useReparto() {
6:   return useQuery<Reparto | null>({
7:     queryKey: ['reparto', 'hoy'],
8:     queryFn: getRepartoHoyRequest,
9:     staleTime: 5 * 60 * 1000,
10:   });
11: }
12: 
13: export function useRepartoDetalle(id: string) {
14:   return useQuery<Reparto>({
15:     queryKey: ['reparto', id],
16:     queryFn: () => getRepartoByIdRequest(id),
17:     enabled: !!id,
18:   });
19: }

(End of file - total 19 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\repartos\\services\\repartoService.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\repartos\services\repartoService.ts</path>
<type>file</type>
<content>
1: import { apiClient } from '@/services/api';
2: import type { Reparto, RepartoAdminListItem, RepartoAdminDetalle, ResumenCarga } from '@/types/reparto';
3: import type { Pedido } from '@/types/pedido';
4: 
5: export async function getRepartosAdminRequest(fecha?: string): Promise<RepartoAdminListItem[]> {
6:   const params: Record<string, string> = {};
7:   if (fecha) params.fecha = fecha;
8:   const response = await apiClient.get<{ data: RepartoAdminListItem[]; total: number }>('/repartos/admin', { params });
9:   return response.data.data;
10: }
11: 
12: export async function getRepartoAdminByIdRequest(id: string): Promise<RepartoAdminDetalle> {
13:   const response = await apiClient.get<{ data: RepartoAdminDetalle }>(`/repartos/admin/${id}`);
14:   return response.data.data;
15: }
16: 
17: export async function getRepartoHoyRequest(): Promise<Reparto | null> {
18:   const response = await apiClient.get<{ data: Reparto | null; message?: string }>('/repartos/hoy');
19:   return response.data.data;
20: }
21: 
22: export async function getRepartosRequest(
23:   repartidorId: string,
24:   fecha?: string,
25:   estado?: string
26: ): Promise<Reparto[]> {
27:   const params: Record<string, string> = { repartidorId };
28:   if (fecha) params.fecha = fecha;
29:   if (estado) params.estado = estado;
30:   const response = await apiClient.get<{ data: Reparto[] }>('/repartos', { params });
31:   return response.data.data;
32: }
33: 
34: export async function getRepartoByIdRequest(id: string): Promise<Reparto> {
35:   const response = await apiClient.get<{ data: Reparto }>(`/repartos/${id}`);
36:   return response.data.data;
37: }
38: 
39: export async function getResumenCargaRequest(
40:   repartoId: string
41: ): Promise<{ repartoId: string; items: ResumenCarga[] }> {
42:   const response = await apiClient.get<{ repartoId: string; items: ResumenCarga[] }>(
43:     `/repartos/${repartoId}/carga`
44:   );
45:   return response.data;
46: }
47: 
48: export async function crearRepartoRequest(data: {
49:   repartidorId: string;
50:   fecha: string;
51:   pedidoIds: string[];
52: }): Promise<Reparto> {
53:   const response = await apiClient.post<{ data: Reparto }>('/repartos', data);
54:   return response.data.data;
55: }
56: 
57: export async function getPedidosDisponiblesRequest(fecha: string): Promise<Pedido[]> {
58:   const response = await apiClient.get<{ data: Pedido[]; total: number }>('/pedidos/disponibles', {
59:     params: { fecha },
60:   });
61:   return response.data.data;
62: }
63: 
64: export async function updateRepartoEstadoRequest(
65:   id: string,
66:   estado: 'EN_CURSO' | 'COMPLETADO'
67: ): Promise<{ id: string; estado: string; actualizadoEn: string }> {
68:   const response = await apiClient.patch<{ id: string; estado: string; actualizadoEn: string }>(
69:     `/repartos/${id}/estado`,
70:     { estado }
71:   );
72:   return response.data;
73: }
74: 
75: export async function agregarPedidoARepartoRequest(
76:   repartoId: string,
77:   pedidoId: string
78: ): Promise<{ repartoId: string; pedidoId: string; accion: string }> {
79:   const response = await apiClient.post<{ data: { repartoId: string; pedidoId: string; accion: string } }>(
80:     `/repartos/admin/${repartoId}/pedidos`,
81:     { pedidoId }
82:   );
83:   return response.data.data;
84: }
85: 
86: export async function quitarPedidoDeRepartoRequest(
87:   repartoId: string,
88:   pedidoId: string
89: ): Promise<{ repartoId: string; pedidoId: string; accion: string }> {
90:   const response = await apiClient.delete<{ data: { repartoId: string; pedidoId: string; accion: string } }>(
91:     `/repartos/admin/${repartoId}/pedidos/${pedidoId}`
92:   );
93:   return response.data.data;
94: }

(End of file - total 94 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\app\\(tabs)\\index.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\app\(tabs)\index.tsx</path>
<type>file</type>
<content>
1: import { Redirect } from 'expo-router';
2: import { useAuthStore } from '@/stores/authStore';
3: import InicioScreen from '@/features/repartos/screens/InicioScreen';
4: 
5: export default function HomeRoute() {
6:   const usuario = useAuthStore((state) => state.usuario);
7: 
8:   if (usuario?.rol === 'ADMIN') {
9:     return <Redirect href="/pedidos" />;
10:   }
11: 
12:   return <InicioScreen />;
13: }

(End of file - total 13 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\app\\(tabs)\\_layout.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\app\(tabs)\_layout.tsx</path>
<type>file</type>
<content>
1: import { Redirect, Tabs } from 'expo-router';
2: import React from 'react';
3: import { Platform } from 'react-native';
4: 
5: import { HapticTab } from '@/components/haptic-tab';
6: import { IconSymbol } from '@/components/ui/icon-symbol';
7: import { ConnectivityBanner } from '@/components/ui';
8: import { Colors } from '@/constants/theme';
9: import { useColorScheme } from '@/hooks/use-color-scheme';
10: import { useAuthStore } from '@/stores/authStore';
11: 
12: export default function TabLayout() {
13:   const colorScheme = useColorScheme() ?? 'light';
14:   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
15:   const isAdmin = useAuthStore((state) => state.usuario?.rol === 'ADMIN');
16: 
17:   if (!isAuthenticated) {
18:     return <Redirect href="/login" />;
19:   }
20: 
21:   return (
22:     <>
23:       <ConnectivityBanner isConnected={true} />
24:       <Tabs
25:       screenOptions={{
26:         tabBarActiveTintColor: Colors[colorScheme].tint,
27:         headerShown: false,
28:         tabBarButton: HapticTab,
29:         tabBarStyle: {
30:           backgroundColor: Colors[colorScheme].background,
31:           borderTopColor: Colors[colorScheme].border,
32:         },
33:       }}
34:     >
35:       <Tabs.Screen
36:         name="index"
37:         options={{
38:           href: null,
39:         }}
40:       />
41:       <Tabs.Screen
42:         name="clientes"
43:         options={{
44:           title: 'Clientes',
45:           href: isAdmin ? undefined : null,
46:           tabBarIcon: ({ color }) => (
47:             <IconSymbol size={28} name="person.crop.rectangle.stack.fill" color={color} />
48:           ),
49:         }}
50:       />
51:       <Tabs.Screen
52:         name="repartos"
53:         options={{
54:           title: 'Repartos',
55:           tabBarIcon: ({ color }) => (
56:             <IconSymbol size={28} name="shippingbox.fill" color={color} />
57:           ),
58:         }}
59:       />
60:       <Tabs.Screen
61:         name="pedidos"
62:         options={{
63:           title: 'Pedidos',
64:           tabBarIcon: ({ color }) => (
65:             <IconSymbol size={28} name="clipboard.fill" color={color} />
66:           ),
67:         }}
68:       />
69:       <Tabs.Screen
70:         name="mapa"
71:         options={{
72:           title: 'Mapa',
73:           tabBarIcon: ({ color }) => (
74:             <IconSymbol size={28} name="map.fill" color={color} />
75:           ),
76:         }}
77:       />
78:       <Tabs.Screen
79:         name="usuarios"
80:         options={{
81:           title: 'Usuarios',
82:           href: isAdmin ? undefined : null,
83:           tabBarIcon: ({ color }) => (
84:             <IconSymbol size={28} name="person.2.fill" color={color} />
85:           ),
86:         }}
87:       />
88:       <Tabs.Screen
89:         name="perfil"
90:         options={{
91:           title: 'Perfil',
92:           tabBarIcon: ({ color }) => (
93:             <IconSymbol size={28} name="person.fill" color={color} />
94:           ),
95:         }}
96:       />
97:     </Tabs>
98:     </>
99:   );
100: }

(End of file - total 100 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 7.4s)

_Thinking:_

Now let me read more key files - the backend reparto controller, service, and schema, the pedido hooks and components, and the types.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\repartos\\controller.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\repartos\controller.ts</path>
<type>file</type>
<content>
1: import type { Request, Response, NextFunction } from 'express';
2: import { crearRepartoSchema, actualizarEstadoSchema, agregarPedidoRepartoSchema } from './schema.js';
3: import * as repartosService from './service.js';
4: import { sendSuccess, sendList } from '../../utils/response.js';
5: 
6: export async function crearController(
7:   req: Request,
8:   res: Response,
9:   next: NextFunction
10: ): Promise<void> {
11:   try {
12:     const data = crearRepartoSchema.parse(req.body);
13:     const result = await repartosService.crearReparto(data);
14:     sendSuccess(res, result, 201);
15:   } catch (err) {
16:     next(err);
17:   }
18: }
19: 
20: export async function listarAdminController(
21:   req: Request,
22:   res: Response,
23:   next: NextFunction
24: ): Promise<void> {
25:   try {
26:     const fecha = typeof req.query.fecha === 'string' ? req.query.fecha : undefined;
27:     const result = await repartosService.listarRepartosAdmin({ fecha });
28:     sendList(res, result);
29:   } catch (err) {
30:     next(err);
31:   }
32: }
33: 
34: export async function obtenerAdminController(
35:   req: Request,
36:   res: Response,
37:   next: NextFunction
38: ): Promise<void> {
39:   try {
40:     const id = req.params['id'] as string;
41:     const result = await repartosService.obtenerRepartoAdmin(id);
42:     sendSuccess(res, result);
43:   } catch (err) {
44:     next(err);
45:   }
46: }
47: 
48: export async function obtenerHoyController(
49:   req: Request,
50:   res: Response,
51:   next: NextFunction
52: ): Promise<void> {
53:   try {
54:     const repartidorId = req.user!.userId;
55:     const result = await repartosService.obtenerRepartoDelDia(repartidorId);
56:     if (!result) {
57:       res.status(200).json({ data: null, message: 'No hay repartos para hoy' });
58:       return;
59:     }
60:     sendSuccess(res, result);
61:   } catch (err) {
62:     next(err);
63:   }
64: }
65: 
66: export async function listarController(
67:   req: Request,
68:   res: Response,
69:   next: NextFunction
70: ): Promise<void> {
71:   try {
72:     const repartidorId = typeof req.query.repartidorId === 'string' ? req.query.repartidorId : undefined;
73:     const fecha = typeof req.query.fecha === 'string' ? req.query.fecha : undefined;
74:     const estado = typeof req.query.estado === 'string' ? req.query.estado : undefined;
75:     if (!repartidorId) {
76:       res.status(400).json({
77:         error: {
78:           code: 'VALIDATION_ERROR',
79:           message: 'repartidorId es requerido',
80:           timestamp: new Date().toISOString(),
81:         },
82:       });
83:       return;
84:     }
85:     const result = await repartosService.listarRepartos({ repartidorId, fecha, estado });
86:     sendList(res, result);
87:   } catch (err) {
88:     next(err);
89:   }
90: }
91: 
92: export async function obtenerController(
93:   req: Request,
94:   res: Response,
95:   next: NextFunction
96: ): Promise<void> {
97:   try {
98:     const id = req.params['id'] as string;
99:     const result = await repartosService.obtenerReparto(id);
100:     sendSuccess(res, result);
101:   } catch (err) {
102:     next(err);
103:   }
104: }
105: 
106: export async function cargaController(
107:   req: Request,
108:   res: Response,
109:   next: NextFunction
110: ): Promise<void> {
111:   try {
112:     const id = req.params['id'] as string;
113:     const result = await repartosService.obtenerResumenCarga(id);
114:     res.status(200).json(result);
115:   } catch (err) {
116:     next(err);
117:   }
118: }
119: 
120: export async function estadoController(
121:   req: Request,
122:   res: Response,
123:   next: NextFunction
124: ): Promise<void> {
125:   try {
126:     const id = req.params['id'] as string;
127:     const { estado } = actualizarEstadoSchema.parse(req.body);
128:     const result = await repartosService.actualizarEstado(id, estado);
129:     res.status(200).json(result);
130:   } catch (err) {
131:     next(err);
132:   }
133: }
134: 
135: export async function agregarPedidoController(
136:   req: Request,
137:   res: Response,
138:   next: NextFunction
139: ): Promise<void> {
140:   try {
141:     const repartoId = req.params['repartoId'] as string;
142:     const { pedidoId } = agregarPedidoRepartoSchema.parse(req.body);
143:     const result = await repartosService.agregarPedidoAReparto(repartoId, pedidoId);
144:     sendSuccess(res, result, 201);
145:   } catch (err) {
146:     next(err);
147:   }
148: }
149: 
150: export async function quitarPedidoController(
151:   req: Request,
152:   res: Response,
153:   next: NextFunction
154: ): Promise<void> {
155:   try {
156:     const repartoId = req.params['repartoId'] as string;
157:     const pedidoId = req.params['pedidoId'] as string;
158:     const result = await repartosService.quitarPedidoDeReparto(repartoId, pedidoId);
159:     sendSuccess(res, result);
160:   } catch (err) {
161:     next(err);
162:   }
163: }

(End of file - total 163 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\repartos\\service.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\repartos\service.ts</path>
<type>file</type>
<content>
1: import { prisma } from '../../lib/prisma.js';
2: import { ApiError } from '../../utils/api-error.js';
3: 
4: /** Create a Date from YYYY-MM-DD string without timezone conversion */
5: function dateFromISODate(dateStr: string): Date {
6:   const [y, m, d] = dateStr.slice(0, 10).split('-');
7:   return new Date(Number(y), Number(m) - 1, Number(d));
8: }
9: 
10: /** Format a calendar-date Date to YYYY-MM-DD without timezone shift */
11: function fmtDate(d: Date): string {
12:   const y = String(d.getFullYear());
13:   const m = String(d.getMonth() + 1).padStart(2, '0');
14:   const day = String(d.getDate()).padStart(2, '0');
15:   return `${y}-${m}-${day}`;
16: }
17: 
18: function formatReparto(reparto: {
19:   id: string;
20:   fecha: Date;
21:   estado: string;
22:   horaInicio: string | null;
23:   horaFin: string | null;
24:   pedidos: Array<{ estado: string }>;
25: }) {
26:   const totalPedidos = reparto.pedidos.length;
27:   const completados = reparto.pedidos.filter(
28:     (p) => p.estado !== 'PENDIENTE'
29:   ).length;
30:   const pendientes = totalPedidos - completados;
31: 
32:   return {
33:     id: reparto.id,
34:     fecha: fmtDate(reparto.fecha),
35:     estado: reparto.estado,
36:     horaInicio: reparto.horaInicio ?? undefined,
37:     horaFin: reparto.horaFin ?? undefined,
38:     resumen: {
39:       totalPedidos,
40:       completados,
41:       pendientes,
42:     },
43:   };
44: }
45: 
46: /** GET /repartos?repartidorId=&fecha=&estado= */
47: export async function listarRepartos(params: {
48:   repartidorId: string;
49:   fecha?: string;
50:   estado?: string;
51: }) {
52:   const where: Record<string, unknown> = {
53:     repartidorId: params.repartidorId,
54:   };
55: 
56:   if (params.fecha) {
57:     const date = new Date(params.fecha);
58:     where['fecha'] = date;
59:   }
60: 
61:   if (params.estado) {
62:     where['estado'] = params.estado;
63:   }
64: 
65:   const repartos = await prisma.reparto.findMany({
66:     where,
67:     include: {
68:       pedidos: { select: { estado: true } },
69:     },
70:     orderBy: { fecha: 'desc' },
71:   });
72: 
73:   return repartos.map(formatReparto);
74: }
75: 
76: /** GET /repartos/:id — con pedidos completos */
77: export async function obtenerReparto(id: string) {
78:   const reparto = await prisma.reparto.findUnique({
79:     where: { id },
80:     include: {
81:       pedidos: {
82:         include: {
83:           cliente: true,
84:           items: { include: { item: true } },
85:         },
86:         orderBy: { orden: 'asc' },
87:       },
88:     },
89:   });
90: 
91:   if (!reparto) {
92:     throw ApiError.notFound('Reparto no encontrado');
93:   }
94: 
95:   const totalPedidos = reparto.pedidos.length;
96:   const pedidosList = reparto.pedidos as Array<{
97:     id: string;
98:     orden: number;
99:     estado: string;
100:     fecha: Date;
101:     motivoFalla: string | null;
102:     cliente: {
103:       id: string;
104:       nombre: string;
105:       apellido: string;
106:       telefono: string;
107:       calle: string;
108:       numero: string;
109:       localidad: string;
110:       latitud: number;
111:       longitud: number;
112:       horarioDesde: string;
113:       horarioHasta: string;
114:     };
115:     items: Array<{
116:       cantidad: number;
117:       item: { id: string; nombre: string; descripcion: string | null; unidad: string; activo: boolean };
118:     }>;
119:   }>;
120: 
121:   const completados = pedidosList.filter((p) => p.estado !== 'PENDIENTE').length;
122:   const pendientes = totalPedidos - completados;
123: 
124:   return {
125:     id: reparto.id,
126:     repartidorId: reparto.repartidorId,
127:     fecha: fmtDate(reparto.fecha),
128:     estado: reparto.estado,
129:     horaInicio: reparto.horaInicio ?? undefined,
130:     horaFin: reparto.horaFin ?? undefined,
131:     resumen: { totalPedidos, completados, pendientes },
132:     pedidos: pedidosList.map((p) => ({
133:       id: p.id,
134:       orden: p.orden,
135:       estado: p.estado,
136:       fecha: p.fecha.toISOString(),
137:       motivoFalla: p.motivoFalla ?? undefined,
138:       cliente: {
139:         id: p.cliente.id,
140:         nombre: p.cliente.nombre,
141:         apellido: p.cliente.apellido,
142:         telefono: p.cliente.telefono,
143:         domicilio: {
144:           calle: p.cliente.calle,
145:           numero: p.cliente.numero,
146:           localidad: p.cliente.localidad,
147:           latitud: p.cliente.latitud,
148:           longitud: p.cliente.longitud,
149:         },
150:         horarioDesde: p.cliente.horarioDesde,
151:         horarioHasta: p.cliente.horarioHasta,
152:       },
153:       items: p.items.map((pi) => ({
154:         item: {
155:           id: pi.item.id,
156:           nombre: pi.item.nombre,
157:           descripcion: pi.item.descripcion ?? undefined,
158:           unidad: pi.item.unidad,
159:           activo: pi.item.activo,
160:         },
161:         cantidad: pi.cantidad,
162:       })),
163:     })),
164:   };
165: }
166: 
167: /** GET /repartos/:id/carga */
168: export async function obtenerResumenCarga(repartoId: string) {
169:   const reparto = await prisma.reparto.findUnique({
170:     where: { id: repartoId },
171:     include: {
172:       pedidos: {
173:         include: {
174:           items: { include: { item: true } },
175:         },
176:       },
177:     },
178:   });
179: 
180:   if (!reparto) {
181:     throw ApiError.notFound('Reparto no encontrado');
182:   }
183: 
184:   // Agrupar items por producto
185:   const itemMap = new Map<string, { producto: string; cantidadTotal: number; unidad: string }>();
186: 
187:   for (const pedido of reparto.pedidos) {
188:     for (const pi of pedido.items) {
189:       const existing = itemMap.get(pi.item.id);
190:       if (existing) {
191:         existing.cantidadTotal += pi.cantidad;
192:       } else {
193:         itemMap.set(pi.item.id, {
194:           producto: pi.item.nombre,
195:           cantidadTotal: pi.cantidad,
196:           unidad: pi.item.unidad,
197:         });
198:       }
199:     }
200:   }
201: 
202:   return {
203:     repartoId: reparto.id,
204:     items: Array.from(itemMap.values()),
205:   };
206: }
207: 
208: /** GET /repartos/admin — Lista todos los repartos (admin) */
209: export async function listarRepartosAdmin(params?: { fecha?: string }) {
210:   const where: Record<string, unknown> = {};
211: 
212:   if (params?.fecha) {
213:     where['fecha'] = dateFromISODate(params.fecha);
214:   }
215: 
216:   const repartos = await prisma.reparto.findMany({
217:     where,
218:     include: {
219:       repartidor: { select: { id: true, nombre: true, apellido: true } },
220:       pedidos: { select: { estado: true } },
221:     },
222:     orderBy: { fecha: 'desc' },
223:   });
224: 
225:   return repartos.map((r) => ({
226:     id: r.id,
227:     fecha: fmtDate(r.fecha),
228:     estado: r.estado,
229:     horaInicio: r.horaInicio ?? undefined,
230:     horaFin: r.horaFin ?? undefined,
231:     repartidor: {
232:       id: r.repartidor.id,
233:       nombre: r.repartidor.nombre,
234:       apellido: r.repartidor.apellido,
235:     },
236:     pedidosCount: r.pedidos.length,
237:     resumen: {
238:       totalPedidos: r.pedidos.length,
239:       completados: r.pedidos.filter((p) => p.estado !== 'PENDIENTE').length,
240:       pendientes: r.pedidos.filter((p) => p.estado === 'PENDIENTE').length,
241:     },
242:   }));
243: }
244: 
245: /** GET /repartos/admin/:id — Detalle de reparto con repartidor y pedidos (admin) */
246: export async function obtenerRepartoAdmin(id: string) {
247:   const reparto = await prisma.reparto.findUnique({
248:     where: { id },
249:     include: {
250:       repartidor: { select: { id: true, nombre: true, apellido: true, email: true } },
251:       pedidos: {
252:         include: {
253:           cliente: true,
254:           items: { include: { item: true } },
255:         },
256:         orderBy: { orden: 'asc' },
257:       },
258:     },
259:   });
260: 
261:   if (!reparto) {
262:     throw ApiError.notFound('Reparto no encontrado');
263:   }
264: 
265:   const totalPedidos = reparto.pedidos.length;
266:   const completados = reparto.pedidos.filter((p) => p.estado !== 'PENDIENTE').length;
267:   const pendientes = totalPedidos - completados;
268: 
269:   return {
270:     id: reparto.id,
271:     repartidorId: reparto.repartidorId,
272:     fecha: fmtDate(reparto.fecha),
273:     estado: reparto.estado,
274:     horaInicio: reparto.horaInicio ?? undefined,
275:     horaFin: reparto.horaFin ?? undefined,
276:     repartidor: {
277:       id: reparto.repartidor.id,
278:       nombre: reparto.repartidor.nombre,
279:       apellido: reparto.repartidor.apellido,
280:       email: reparto.repartidor.email,
281:     },
282:     resumen: { totalPedidos, completados, pendientes },
283:     pedidos: reparto.pedidos.map((p) => ({
284:       id: p.id,
285:       orden: p.orden,
286:       estado: p.estado,
287:       fecha: p.fecha.toISOString(),
288:       motivoFalla: p.motivoFalla ?? undefined,
289:       cliente: {
290:         id: p.cliente.id,
291:         nombre: p.cliente.nombre,
292:         apellido: p.cliente.apellido,
293:         telefono: p.cliente.telefono,
294:         domicilio: {
295:           calle: p.cliente.calle,
296:           numero: p.cliente.numero,
297:           localidad: p.cliente.localidad,
298:           latitud: p.cliente.latitud,
299:           longitud: p.cliente.longitud,
300:         },
301:         horarioDesde: p.cliente.horarioDesde,
302:         horarioHasta: p.cliente.horarioHasta,
303:       },
304:       items: p.items.map((pi) => ({
305:         item: {
306:           id: pi.item.id,
307:           nombre: pi.item.nombre,
308:           descripcion: pi.item.descripcion ?? undefined,
309:           unidad: pi.item.unidad,
310:           activo: pi.item.activo,
311:         },
312:         cantidad: pi.cantidad,
313:       })),
314:     })),
315:   };
316: }
317: 
318: /** GET /repartos/hoy — Reparto del día actual del repartidor autenticado */
319: export async function obtenerRepartoDelDia(repartidorId: string) {
320:   const today = new Date();
321:   today.setHours(0, 0, 0, 0);
322: 
323:   const reparto = await prisma.reparto.findFirst({
324:     where: { repartidorId, fecha: today },
325:     include: {
326:       pedidos: {
327:         include: {
328:           cliente: true,
329:           items: { include: { item: true } },
330:         },
331:         orderBy: { orden: 'asc' },
332:       },
333:     },
334:   });
335: 
336:   if (!reparto) {
337:     return null;
338:   }
339: 
340:   const totalPedidos = reparto.pedidos.length;
341:   const completados = reparto.pedidos.filter(
342:     (p) => p.estado !== 'PENDIENTE'
343:   ).length;
344:   const pendientes = totalPedidos - completados;
345: 
346:   return {
347:     id: reparto.id,
348:     repartidorId: reparto.repartidorId,
349:     fecha: fmtDate(reparto.fecha),
350:     estado: reparto.estado,
351:     horaInicio: reparto.horaInicio ?? undefined,
352:     horaFin: reparto.horaFin ?? undefined,
353:     resumen: { totalPedidos, completados, pendientes },
354:     pedidos: reparto.pedidos.map((p) => ({
355:       id: p.id,
356:       orden: p.orden,
357:       estado: p.estado,
358:       fecha: p.fecha.toISOString(),
359:       motivoFalla: p.motivoFalla ?? undefined,
360:       cliente: {
361:         id: p.cliente.id,
362:         nombre: p.cliente.nombre,
363:         apellido: p.cliente.apellido,
364:         telefono: p.cliente.telefono,
365:         domicilio: {
366:           calle: p.cliente.calle,
367:           numero: p.cliente.numero,
368:           localidad: p.cliente.localidad,
369:           latitud: p.cliente.latitud,
370:           longitud: p.cliente.longitud,
371:         },
372:         horarioDesde: p.cliente.horarioDesde,
373:         horarioHasta: p.cliente.horarioHasta,
374:       },
375:       items: p.items.map((pi) => ({
376:         item: {
377:           id: pi.item.id,
378:           nombre: pi.item.nombre,
379:           descripcion: pi.item.descripcion ?? undefined,
380:           unidad: pi.item.unidad,
381:           activo: pi.item.activo,
382:         },
383:         cantidad: pi.cantidad,
384:       })),
385:     })),
386:   };
387: }
388: 
389: /** POST /repartos — Crear reparto (admin) */
390: export async function crearReparto(data: {
391:   repartidorId: string;
392:   fecha: string;
393:   pedidoIds: string[];
394: }) {
395:   const fechaDate = dateFromISODate(data.fecha);
396: 
397:   // 1. Validar repartidor existe y es REPARTIDOR
398:   const repartidor = await prisma.usuario.findUnique({ where: { id: data.repartidorId } });
399:   if (!repartidor) {
400:     throw ApiError.notFound('Repartidor no encontrado');
401:   }
402:   if (repartidor.rol !== 'REPARTIDOR') {
403:     throw ApiError.badRequest('El usuario seleccionado no es un repartidor');
404:   }
405: 
406:   // 2. Validar que el repartidor no tenga ya un reparto para esta fecha
407:   const repartoExistente = await prisma.reparto.findFirst({
408:     where: { repartidorId: data.repartidorId, fecha: fechaDate },
409:   });
410:   if (repartoExistente) {
411:     throw ApiError.conflict('El repartidor ya tiene un reparto asignado para esta fecha');
412:   }
413: 
414:   // 3. Validar pedidos
415:   const pedidos = await prisma.pedido.findMany({
416:     where: { id: { in: data.pedidoIds } },
417:     select: { id: true, estado: true, repartoId: true, fecha: true },
418:   });
419: 
420:   // Verificar que todos los IDs existen
421:   if (pedidos.length !== data.pedidoIds.length) {
422:     const existentes = new Set(pedidos.map((p) => p.id));
423:     const faltantes = data.pedidoIds.filter((id) => !existentes.has(id));
424:     throw ApiError.notFound(`Pedidos no encontrados: ${faltantes.join(', ')}`);
425:   }
426: 
427:   for (const pedido of pedidos) {
428:     if (pedido.estado !== 'PENDIENTE') {
429:       throw ApiError.conflict(`El pedido ${pedido.id} no está pendiente`);
430:     }
431:     if (pedido.repartoId) {
432:       throw ApiError.conflict(`El pedido ${pedido.id} ya está asignado a otro reparto`);
433:     }
434:     if (fmtDate(pedido.fecha) !== data.fecha.slice(0, 10)) {
435:       throw ApiError.badRequest(`El pedido ${pedido.id} tiene una fecha diferente al reparto`);
436:     }
437:   }
438: 
439:   // 4. Crear reparto
440:   const reparto = await prisma.reparto.create({
441:     data: {
442:       repartidorId: data.repartidorId,
443:       fecha: fechaDate,
444:       estado: 'PENDIENTE',
445:       pedidos: {
446:         connect: data.pedidoIds.map((id) => ({ id })),
447:       },
448:     },
449:     include: {
450:       pedidos: {
451:         include: {
452:           cliente: true,
453:           items: { include: { item: true } },
454:         },
455:         orderBy: { orden: 'asc' },
456:       },
457:     },
458:   });
459: 
460:   const totalPedidos = reparto.pedidos.length;
461: 
462:   return {
463:     id: reparto.id,
464:     repartidorId: reparto.repartidorId,
465:     fecha: fmtDate(reparto.fecha),
466:     estado: reparto.estado,
467:     resumen: { totalPedidos, completados: 0, pendientes: totalPedidos },
468:     pedidos: reparto.pedidos.map((p) => ({
469:       id: p.id,
470:       orden: p.orden,
471:       estado: p.estado,
472:       fecha: p.fecha.toISOString(),
473:       cliente: {
474:         id: p.cliente.id,
475:         nombre: p.cliente.nombre,
476:         apellido: p.cliente.apellido,
477:         telefono: p.cliente.telefono,
478:         domicilio: {
479:           calle: p.cliente.calle,
480:           numero: p.cliente.numero,
481:           localidad: p.cliente.localidad,
482:           latitud: p.cliente.latitud,
483:           longitud: p.cliente.longitud,
484:         },
485:         horarioDesde: p.cliente.horarioDesde,
486:         horarioHasta: p.cliente.horarioHasta,
487:       },
488:       items: p.items.map((pi) => ({
489:         item: {
490:           id: pi.item.id,
491:           nombre: pi.item.nombre,
492:           descripcion: pi.item.descripcion ?? undefined,
493:           unidad: pi.item.unidad,
494:           activo: pi.item.activo,
495:         },
496:         cantidad: pi.cantidad,
497:       })),
498:     })),
499:   };
500: }
501: 
502: /** PATCH /repartos/:id/estado */
503: export async function actualizarEstado(repartoId: string, nuevoEstado: 'EN_CURSO' | 'COMPLETADO') {
504:   const reparto = await prisma.reparto.findUnique({
505:     where: { id: repartoId },
506:     include: { pedidos: { select: { estado: true } } },
507:   });
508: 
509:   if (!reparto) {
510:     throw ApiError.notFound('Reparto no encontrado');
511:   }
512: 
513:   // Validar transición de estados (no retroceder)
514:   if (reparto.estado === 'COMPLETADO') {
515:     throw ApiError.badRequest('Transición de estado inválida');
516:   }
517: 
518:   if (reparto.estado === 'EN_CURSO' && nuevoEstado === 'EN_CURSO') {
519:     throw ApiError.badRequest('El reparto ya está en curso');
520:   }
521: 
522:   // No se puede iniciar si ya hay otro EN_CURSO
523:   if (nuevoEstado === 'EN_CURSO') {
524:     const activo = await prisma.reparto.findFirst({
525:       where: {
526:         repartidorId: reparto.repartidorId,
527:         estado: 'EN_CURSO',
528:         id: { not: repartoId },
529:       },
530:     });
531:     if (activo) {
532:       throw ApiError.conflict('Ya existe un reparto en curso para hoy');
533:     }
534:   }
535: 
536:   // No se puede completar si hay pedidos pendientes
537:   if (nuevoEstado === 'COMPLETADO') {
538:     const pendientes = reparto.pedidos.some((p) => p.estado === 'PENDIENTE');
539:     if (pendientes) {
540:       throw ApiError.badRequest('Existen entregas sin procesar en la ruta');
541:     }
542:   }
543: 
544:   const data: Record<string, string> = { estado: nuevoEstado };
545:   if (nuevoEstado === 'EN_CURSO') {
546:     data['horaInicio'] = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
547:   }
548:   if (nuevoEstado === 'COMPLETADO') {
549:     data['horaFin'] = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
550:   }
551: 
552:   const updated = await prisma.reparto.update({
553:     where: { id: repartoId },
554:     data,
555:   });
556: 
557:   return {
558:     id: updated.id,
559:     estado: updated.estado,
560:     actualizadoEn: updated.actualizadoEn.toISOString(),
561:   };
562: }
563: 
564: // =============================================================================
565: // ADMIN — Modificación de reparto (agregar/quitar pedidos)
566: // =============================================================================
567: 
568: /**
569:  * Valida que un reparto sea editable:
570:  * - Existe
571:  * - Está PENDIENTE (no iniciado, no finalizado)
572:  */
573: async function validarRepartoEditable(id: string) {
574:   const reparto = await prisma.reparto.findUnique({
575:     where: { id },
576:     include: { pedidos: { select: { id: true } } },
577:   });
578: 
579:   if (!reparto) {
580:     throw ApiError.notFound('Reparto no encontrado');
581:   }
582: 
583:   if (reparto.estado !== 'PENDIENTE') {
584:     if (reparto.estado === 'COMPLETADO') {
585:       throw ApiError.conflict('No se puede modificar un reparto finalizado');
586:     }
587:     throw ApiError.conflict('No se puede modificar un reparto en curso');
588:   }
589: 
590:   return reparto;
591: }
592: 
593: /** POST /repartos/admin/:repartoId/pedidos — Agregar pedido a reparto */
594: export async function agregarPedidoAReparto(repartoId: string, pedidoId: string) {
595:   const reparto = await validarRepartoEditable(repartoId);
596:   const fechaReparto = fmtDate(reparto.fecha);
597: 
598:   // Validar pedido existe
599:   const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
600:   if (!pedido) {
601:     throw ApiError.notFound('Pedido no encontrado');
602:   }
603: 
604:   // Validar pedido está pendiente
605:   if (pedido.estado !== 'PENDIENTE') {
606:     throw ApiError.conflict('Solo se pueden agregar pedidos en estado pendiente');
607:   }
608: 
609:   // Validar pedido no esté ya en otro reparto
610:   if (pedido.repartoId) {
611:     throw ApiError.conflict('El pedido ya está asignado a un reparto');
612:   }
613: 
614:   // Validar que la fecha del pedido coincida con la del reparto
615:   if (fmtDate(pedido.fecha) !== fechaReparto) {
616:     throw ApiError.badRequest('El pedido tiene una fecha diferente a la del reparto');
617:   }
618: 
619:   // Validar que el pedido no esté ya en este reparto
620:   const yaAsignado = reparto.pedidos.some((p) => p.id === pedidoId);
621:   if (yaAsignado) {
622:     throw ApiError.conflict('El pedido ya está asignado a este reparto');
623:   }
624: 
625:   // Asignar pedido al reparto
626:   await prisma.pedido.update({
627:     where: { id: pedidoId },
628:     data: { repartoId },
629:   });
630: 
631:   // Actualizar orden del pedido al final de la lista
632:   const maxOrden = reparto.pedidos.length > 0
633:     ? reparto.pedidos.length + 1
634:     : 1;
635: 
636:   await prisma.pedido.update({
637:     where: { id: pedidoId },
638:     data: { orden: maxOrden },
639:   });
640: 
641:   return {
642:     repartoId,
643:     pedidoId,
644:     accion: 'agregado',
645:   };
646: }
647: 
648: /** DELETE /repartos/admin/:repartoId/pedidos/:pedidoId — Quitar pedido de reparto */
649: export async function quitarPedidoDeReparto(repartoId: string, pedidoId: string) {
650:   await validarRepartoEditable(repartoId);
651: 
652:   // Validar pedido existe
653:   const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
654:   if (!pedido) {
655:     throw ApiError.notFound('Pedido no encontrado');
656:   }
657: 
658:   // Validar pedido pertenece a este reparto
659:   if (pedido.repartoId !== repartoId) {
660:     throw ApiError.conflict('El pedido no pertenece a este reparto');
661:   }
662: 
663:   // Validar pedido no esté en estado avanzado
664:   if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
665:     throw ApiError.conflict('Solo se pueden quitar pedidos pendientes o en ruta');
666:   }
667: 
668:   // Desvincular pedido del reparto
669:   await prisma.pedido.update({
670:     where: { id: pedidoId },
671:     data: { repartoId: null },
672:   });
673: 
674:   return {
675:     repartoId,
676:     pedidoId,
677:     accion: 'quitado',
678:   };
679: }

(End of file - total 679 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\repartos\\schema.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\repartos\schema.ts</path>
<type>file</type>
<content>
1: import { z } from 'zod';
2: 
3: export const crearRepartoSchema = z.object({
4:   repartidorId: z.string().uuid(),
5:   fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)'),
6:   pedidoIds: z
7:     .array(z.string().uuid())
8:     .min(1, 'El reparto debe tener al menos un pedido'),
9: });
10: 
11: export const actualizarEstadoSchema = z.object({
12:   estado: z.enum(['EN_CURSO', 'COMPLETADO']),
13: });
14: 
15: export const agregarPedidoRepartoSchema = z.object({
16:   pedidoId: z.string().uuid(),
17: });

(End of file - total 17 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\repartos\\routes.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\repartos\routes.ts</path>
<type>file</type>
<content>
1: import { Router } from 'express';
2: import {
3:   crearController,
4:   listarController,
5:   obtenerController,
6:   obtenerHoyController,
7:   listarAdminController,
8:   obtenerAdminController,
9:   cargaController,
10:   estadoController,
11:   agregarPedidoController,
12:   quitarPedidoController,
13: } from './controller.js';
14: import { authenticate, requireRole } from '../../middleware/auth.middleware.js';
15: 
16: const router = Router();
17: 
18: router.get('/', authenticate, listarController);
19: router.get('/hoy', authenticate, requireRole('REPARTIDOR'), obtenerHoyController);
20: router.post('/', authenticate, requireRole('ADMIN'), crearController);
21: router.get('/admin', authenticate, requireRole('ADMIN'), listarAdminController);
22: router.get('/admin/:id', authenticate, requireRole('ADMIN'), obtenerAdminController);
23: router.post('/admin/:repartoId/pedidos', authenticate, requireRole('ADMIN'), agregarPedidoController);
24: router.delete('/admin/:repartoId/pedidos/:pedidoId', authenticate, requireRole('ADMIN'), quitarPedidoController);
25: router.get('/:id', authenticate, obtenerController);
26: router.get('/:id/carga', authenticate, cargaController);
27: router.patch('/:id/estado', authenticate, estadoController);
28: 
29: export default router;

(End of file - total 29 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\types\\reparto.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\types\reparto.ts</path>
<type>file</type>
<content>
1: // TDD-0004: Reparto types
2: 
3: import type { Pedido } from './pedido';
4: 
5: export type EstadoReparto = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';
6: 
7: export interface ResumenCarga {
8:   producto: string;
9:   cantidadTotal: number;
10:   unidad: string;
11: }
12: 
13: export interface RepartoAdminListItem {
14:   id: string;
15:   fecha: string;
16:   estado: EstadoReparto;
17:   horaInicio?: string;
18:   horaFin?: string;
19:   repartidor: {
20:     id: string;
21:     nombre: string;
22:     apellido: string;
23:   };
24:   pedidosCount: number;
25:   resumen: {
26:     totalPedidos: number;
27:     completados: number;
28:     pendientes: number;
29:   };
30: }
31: 
32: export interface RepartoAdminDetalle {
33:   id: string;
34:   repartidorId: string;
35:   fecha: string;
36:   estado: EstadoReparto;
37:   horaInicio?: string;
38:   horaFin?: string;
39:   repartidor: {
40:     id: string;
41:     nombre: string;
42:     apellido: string;
43:     email: string;
44:   };
45:   resumen: {
46:     totalPedidos: number;
47:     completados: number;
48:     pendientes: number;
49:   };
50:   pedidos: Pedido[];
51: }
52: 
53: export interface Reparto {
54:   id: string;
55:   repartidorId: string;
56:   fecha: string;
57:   estado: EstadoReparto;
58:   horaInicio?: string;
59:   horaFin?: string;
60:   pedidos?: Pedido[];
61:   resumen?: {
62:     totalPedidos: number;
63:     completados: number;
64:     pendientes: number;
65:   };
66: }

(End of file - total 66 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\types\\pedido.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\types\pedido.ts</path>
<type>file</type>
<content>
1: // TDD-0003: Pedido types
2: 
3: import type { Cliente } from './cliente';
4: import type { PedidoItem } from './item';
5: 
6: export type EstadoPedido = 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'NO_ENTREGADO' | 'CANCELADO';
7: 
8: export type MotivoCancelacion =
9:   | 'CLIENTE_AUSENTE'
10:   | 'DIRECCION_INCORRECTA'
11:   | 'ACCESO_DENEGADO'
12:   | 'OTRO';
13: 
14: export interface Pedido {
15:   id: string;
16:   orden: number;
17:   estado: EstadoPedido;
18:   fecha: string;
19:   motivoFalla: string | null;
20:   total?: number;
21:   itemsCount?: number;
22:   cliente: Cliente;
23:   items: PedidoItem[];
24: }

(End of file - total 24 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 6.8s)

_Thinking:_

Now let me read the key frontend components - the pedido hooks, components like ConfirmarAccionButtons, CancelModal, PedidoDetalleScreen, and the pedido service.

Now let me check the existing pedido hooks, components, and the backend pedido service to understand the existing state update logic.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\hooks\\usePedidos.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\pedidos\hooks\usePedidos.ts</path>
<type>file</type>
<content>
1: import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
2: import AsyncStorage from '@react-native-async-storage/async-storage';
3: import { useAuthStore } from '@/stores/authStore';
4: import { useOfflineStore } from '@/stores/offlineStore';
5: import {
6:   getPedidosDelDiaRequest,
7:   getPedidoByIdRequest,
8:   getPedidosRequest,
9:   confirmarEntregaRequest,
10:   cancelarPedidoRequest,
11:   crearPedidoRequest,
12:   agregarItemRequest,
13:   actualizarCantidadItemRequest,
14:   quitarItemRequest,
15: } from '@/features/pedidos/services/pedidoService';
16: 
17: import type { Pedido, EstadoPedido, MotivoCancelacion } from '@/types';
18: 
19: const PEDIDOS_CACHE_KEY = '@supplycycle/pedidos_hoy';
20: 
21: function getRepartidorId(): string {
22:   return useAuthStore.getState().usuario?.id ?? '';
23: }
24: 
25: // Fetch pedidos del día (con caché offline en AsyncStorage)
26: export function usePedidosDelDia() {
27:   return useQuery<Pedido[]>({
28:     queryKey: ['pedidos', 'hoy'],
29:     queryFn: async () => {
30:       try {
31:         const data = await getPedidosDelDiaRequest(getRepartidorId());
32:         // Cachear en AsyncStorage para uso offline
33:         await AsyncStorage.setItem(PEDIDOS_CACHE_KEY, JSON.stringify(data));
34:         return data;
35:       } catch {
36:         // Fallback: cache local si el backend no responde
37:         const cached = await AsyncStorage.getItem(PEDIDOS_CACHE_KEY);
38:         if (cached) {
39:           try {
40:             return JSON.parse(cached) as Pedido[];
41:           } catch {
42:             // Error de parsing del cache — ignorar
43:           }
44:         }
45:         throw new Error('No se pudieron cargar los pedidos');
46:       }
47:     },
48:     staleTime: 5 * 60 * 1000,
49:   });
50: }
51: 
52: // Fetch un pedido por ID
53: export function usePedidoDetalle(id: string) {
54:   return useQuery<Pedido>({
55:     queryKey: ['pedido', id],
56:     queryFn: () => getPedidoByIdRequest(id),
57:     enabled: !!id,
58:   });
59: }
60: 
61: // Buscar pedidos
62: export function useBuscarPedidos(params?: {
63:   clienteNombre?: string;
64:   fecha?: string;
65:   estado?: EstadoPedido;
66: }) {
67:   return useQuery<{ data: Pedido[]; total: number }>({
68:     queryKey: ['pedidos', 'buscar', params],
69:     queryFn: () => getPedidosRequest(params),
70:     staleTime: 5 * 60 * 1000,
71:   });
72: }
73: 
74: // Crear pedido (admin)
75: export function useCrearPedido() {
76:   const queryClient = useQueryClient();
77: 
78:   return useMutation({
79:     mutationFn: (data: {
80:       clienteId: string;
81:       fecha?: string;
82:       items: Array<{ itemId: string; cantidad: number }>;
83:     }) => crearPedidoRequest(data),
84:     onSuccess: () => {
85:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
86:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
87:     },
88:   });
89: }
90: 
91: // Confirmar entrega exitosa (con soporte offline)
92: export function useConfirmarEntrega() {
93:   const queryClient = useQueryClient();
94:   const addToQueue = useOfflineStore((s) => s.addToQueue);
95: 
96:   return useMutation({
97:     mutationFn: async (pedidoId: string) => {
98:       try {
99:         return await confirmarEntregaRequest(pedidoId);
100:       } catch {
101:         // Modo offline: encolar y devolver respuesta optimista
102:         addToQueue({ type: 'CONFIRMAR_ENTREGA', payload: { pedidoId } });
103:         return {
104:           id: pedidoId,
105:           estado: 'ENTREGADO' as const,
106:           actualizadoEn: new Date().toISOString(),
107:         };
108:       }
109:     },
110:     onSuccess: (data) => {
111:       queryClient.setQueryData<Pedido>(['pedido', data.id], (old) => {
112:         if (old) return { ...old, estado: 'ENTREGADO' as const };
113:         return old;
114:       });
115:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
116:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
117:     },
118:   });
119: }
120: 
121: // Cancelar pedido (entrega fallida, con soporte offline)
122: export function useCancelarPedido() {
123:   const queryClient = useQueryClient();
124:   const addToQueue = useOfflineStore((s) => s.addToQueue);
125: 
126:   return useMutation({
127:     mutationFn: async ({
128:       pedidoId,
129:       motivo,
130:     }: {
131:       pedidoId: string;
132:       motivo: MotivoCancelacion;
133:     }) => {
134:       try {
135:         return await cancelarPedidoRequest(pedidoId, motivo);
136:       } catch {
137:         // Modo offline: encolar y devolver respuesta optimista
138:         addToQueue({ type: 'CANCELAR_PEDIDO', payload: { pedidoId, motivo } });
139:         return {
140:           id: pedidoId,
141:           estado: 'NO_ENTREGADO' as const,
142:           motivoFalla: motivo,
143:           actualizadoEn: new Date().toISOString(),
144:         };
145:       }
146:     },
147:     onSuccess: (data) => {
148:       queryClient.setQueryData<Pedido>(['pedido', data.id], (old) => {
149:         if (old)
150:           return { ...old, estado: 'NO_ENTREGADO' as const, motivoFalla: data.motivoFalla };
151:         return old;
152:       });
153:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
154:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
155:     },
156:   });
157: }
158: 
159: // Agregar item a un pedido (con soporte offline)
160: export function useAgregarItem(pedidoId: string) {
161:   const queryClient = useQueryClient();
162:   const addToQueue = useOfflineStore((s) => s.addToQueue);
163: 
164:   return useMutation({
165:     mutationFn: async (data: { itemId: string; cantidad: number }) => {
166:       try {
167:         return await agregarItemRequest(pedidoId, data);
168:       } catch {
169:         addToQueue({ type: 'AGREGAR_ITEM', payload: { pedidoId, ...data } });
170:         return data;
171:       }
172:     },
173:     onSuccess: () => {
174:       // No invalidar ['pedido', pedidoId] para no sobrescribir el cache
175:       // que el screen ya actualizó con setQueryData (guardarCambios)
176:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
177:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
178:     },
179:   });
180: }
181: 
182: // Actualizar cantidad de un item en un pedido (con soporte offline)
183: export function useActualizarCantidadItem(pedidoId: string) {
184:   const queryClient = useQueryClient();
185:   const addToQueue = useOfflineStore((s) => s.addToQueue);
186: 
187:   return useMutation({
188:     mutationFn: async ({
189:       itemId,
190:       cantidad,
191:     }: {
192:       itemId: string;
193:       cantidad: number;
194:     }) => {
195:       try {
196:         return await actualizarCantidadItemRequest(pedidoId, itemId, cantidad);
197:       } catch {
198:         addToQueue({
199:           type: 'ACTUALIZAR_CANTIDAD_ITEM',
200:           payload: { pedidoId, itemId, cantidad },
201:         });
202:         return { itemId, cantidad };
203:       }
204:     },
205:     onSuccess: () => {
206:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
207:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
208:     },
209:   });
210: }
211: 
212: // Quitar item de un pedido (con soporte offline)
213: export function useQuitarItem(pedidoId: string) {
214:   const queryClient = useQueryClient();
215:   const addToQueue = useOfflineStore((s) => s.addToQueue);
216: 
217:   return useMutation({
218:     mutationFn: async (itemId: string) => {
219:       try {
220:         return await quitarItemRequest(pedidoId, itemId);
221:       } catch {
222:         addToQueue({
223:           type: 'QUITAR_ITEM',
224:           payload: { pedidoId, itemId },
225:         });
226:         return { itemId };
227:       }
228:     },
229:     onSuccess: () => {
230:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
231:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
232:     },
233:   });
234: }

(End of file - total 234 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\services\\pedidoService.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\pedidos\services\pedidoService.ts</path>
<type>file</type>
<content>
1: import { apiClient } from '@/services/api';
2: import type { Pedido, EstadoPedido, MotivoCancelacion } from '@/types/pedido';
3: 
4: export async function getPedidosDelDiaRequest(
5:   repartidorId: string
6: ): Promise<Pedido[]> {
7:   const response = await apiClient.get<{ data: Pedido[] }>('/pedidos/hoy', {
8:     params: { repartidorId },
9:   });
10:   return response.data.data;
11: }
12: 
13: export async function getPedidoByIdRequest(id: string): Promise<Pedido> {
14:   const response = await apiClient.get<{ data: Pedido }>(`/pedidos/${id}`);
15:   return response.data.data;
16: }
17: 
18: export async function getPedidosRequest(params?: {
19:   clienteNombre?: string;
20:   fecha?: string;
21:   estado?: EstadoPedido;
22: }): Promise<{ data: Pedido[]; total: number }> {
23:   const response = await apiClient.get<{ data: Pedido[]; total: number }>('/pedidos', {
24:     params,
25:   });
26:   return response.data;
27: }
28: 
29: export async function confirmarEntregaRequest(
30:   id: string
31: ): Promise<{ id: string; estado: 'ENTREGADO'; actualizadoEn: string }> {
32:   const response = await apiClient.patch<{
33:     id: string;
34:     estado: 'ENTREGADO';
35:     actualizadoEn: string;
36:   }>(`/pedidos/${id}/confirmar`);
37:   return response.data;
38: }
39: 
40: export async function crearPedidoRequest(data: {
41:   clienteId: string;
42:   fecha?: string;
43:   items: Array<{ itemId: string; cantidad: number }>;
44: }): Promise<Pedido> {
45:   const response = await apiClient.post<{ data: Pedido }>('/pedidos', data);
46:   return response.data.data;
47: }
48: 
49: export async function cancelarPedidoRequest(
50:   id: string,
51:   motivo: MotivoCancelacion
52: ): Promise<{ id: string; estado: 'NO_ENTREGADO'; motivoFalla: string; actualizadoEn: string }> {
53:   const response = await apiClient.patch<{
54:     id: string;
55:     estado: 'NO_ENTREGADO';
56:     motivoFalla: string;
57:     actualizadoEn: string;
58:   }>(`/pedidos/${id}/cancelar`, { motivo });
59:   return response.data;
60: }
61: 
62: export async function agregarItemRequest(
63:   pedidoId: string,
64:   data: { itemId: string; cantidad: number }
65: ): Promise<Pedido> {
66:   const response = await apiClient.post<Pedido>(`/pedidos/${pedidoId}/items`, data);
67:   return response.data;
68: }
69: 
70: export async function actualizarCantidadItemRequest(
71:   pedidoId: string,
72:   itemId: string,
73:   cantidad: number
74: ): Promise<Pedido> {
75:   const response = await apiClient.patch<Pedido>(
76:     `/pedidos/${pedidoId}/items/${itemId}`,
77:     { cantidad }
78:   );
79:   return response.data;
80: }
81: 
82: export async function quitarItemRequest(
83:   pedidoId: string,
84:   itemId: string
85: ): Promise<Pedido> {
86:   const response = await apiClient.delete<Pedido>(`/pedidos/${pedidoId}/items/${itemId}`);
87:   return response.data;
88: }

(End of file - total 88 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\screens\\PedidoDetalleScreen.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\pedidos\screens\PedidoDetalleScreen.tsx</path>
<type>file</type>
<content>
1: import { useState, useCallback } from 'react';
2: import { ScrollView, StyleSheet, View } from 'react-native';
3: import { router } from 'expo-router';
4: import { useQueryClient } from '@tanstack/react-query';
5: import { ThemedView } from '@/components/themed-view';
6: import { LoadingSpinner, ErrorMessage, Header, Button, ConfirmModal } from '@/components/ui';
7: import { Colors, Spacing } from '@/constants/theme';
8: import { useColorScheme } from '@/hooks/use-color-scheme';
9: import {
10:   usePedidoDetalle,
11:   useConfirmarEntrega,
12:   useCancelarPedido,
13:   useQuitarItem,
14:   useAgregarItem,
15:   useActualizarCantidadItem,
16: } from '@/features/pedidos/hooks/usePedidos';
17: import { useToast } from '@/hooks/useToast';
18: import { handleApiError } from '@/services/handleApiError';
19: import type { MotivoCancelacion, Pedido } from '@/types';
20: import type { Item } from '@/types/item';
21: import type { PedidoItem } from '@/types/item';
22: import EstadoBadge from '@/features/pedidos/components/EstadoBadge';
23: import InfoCliente from '@/features/pedidos/components/InfoCliente';
24: import ItemsList from '@/features/pedidos/components/ItemsList';
25: import CancelModal from '@/features/pedidos/components/CancelModal';
26: import AddItemModal from '@/features/pedidos/components/AddItemModal';
27: import TotalCard from '@/features/pedidos/components/TotalCard';
28: import MotivoFallaCard from '@/features/pedidos/components/MotivoFallaCard';
29: import ConfirmarAccionButtons from '@/features/pedidos/components/ConfirmarAccionButtons';
30: 
31: interface PedidoDetalleScreenProps {
32:   id: string;
33:   onBack?: () => void;
34: }
35: 
36: export default function PedidoDetalleScreen({ id, onBack }: PedidoDetalleScreenProps) {
37:   const colorScheme = useColorScheme() ?? 'light';
38:   const theme = Colors[colorScheme];
39:   const { showToast } = useToast();
40:   const queryClient = useQueryClient();
41: 
42:   const { data: pedido, isLoading, isError, error } = usePedidoDetalle(id);
43:   const confirmarMutation = useConfirmarEntrega();
44:   const cancelarMutation = useCancelarPedido();
45:   const quitarItemMutation = useQuitarItem(id);
46:   const agregarItemMutation = useAgregarItem(id);
47:   const actualizarCantidadMutation = useActualizarCantidadItem(id);
48: 
49:   const [modoEdicion, setModoEdicion] = useState(false);
50:   const [itemsEdit, setItemsEdit] = useState<PedidoItem[]>([]);
51:   const [guardando, setGuardando] = useState(false);
52:   const [showAddModal, setShowAddModal] = useState(false);
53:   const [showCancelModal, setShowCancelModal] = useState(false);
54:   const [showConfirmModal, setShowConfirmModal] = useState(false);
55: 
56:   const handleConfirmar = () => {
57:     confirmarMutation.mutate(id, {
58:       onSuccess: () => { showToast('Entrega confirmada', 'success'); router.back(); },
59:       onError: (err) => { showToast(handleApiError(err).message, 'error'); },
60:     });
61:   };
62: 
63:   const handleCancelar = (motivo: MotivoCancelacion) => {
64:     cancelarMutation.mutate(
65:       { pedidoId: id, motivo },
66:       {
67:         onSuccess: () => { setShowCancelModal(false); showToast('Entrega cancelada', 'success'); router.back(); },
68:         onError: (err) => { showToast(handleApiError(err).message, 'error'); },
69:       }
70:     );
71:   };
72: 
73:   const entrarEdicion = useCallback(() => {
74:     if (!pedido) return;
75:     setItemsEdit(pedido.items.map((i) => ({ ...i })));
76:     setModoEdicion(true);
77:   }, [pedido]);
78: 
79:   const cancelarEdicion = useCallback(() => {
80:     setModoEdicion(false);
81:     setItemsEdit([]);
82:   }, []);
83: 
84:   const handleCambiarCantidad = useCallback((itemId: string, delta: number) => {
85:     setItemsEdit((prev) =>
86:       prev.map((item) => {
87:         if (item.id !== itemId) return item;
88:         return { ...item, cantidad: Math.max(1, item.cantidad + delta) };
89:       })
90:     );
91:   }, []);
92: 
93:   const handleEliminarItem = useCallback((itemId: string) => {
94:     setItemsEdit((prev) => prev.filter((item) => item.id !== itemId));
95:   }, []);
96: 
97:   const abrirModalAgregar = useCallback(() => {
98:     setShowAddModal(true);
99:   }, []);
100: 
101:   const handleAgregarItem = useCallback((item: Item, cantidad: number) => {
102:     if (itemsEdit.some((i) => i.item.id === item.id)) {
103:       showToast('El ítem ya está en el pedido', 'warning');
104:       return;
105:     }
106:     const nuevoPedidoItem: PedidoItem = {
107:       id: `temp-${Date.now()}`,
108:       item,
109:       cantidad,
110:       precioUnitario: item.precio,
111:     };
112:     setItemsEdit((prev) => [...prev, nuevoPedidoItem]);
113:     setShowAddModal(false);
114:   }, [itemsEdit, showToast]);
115: 
116:   const guardarCambios = () => setShowConfirmModal(true);
117: 
118:   const handleConfirmGuardar = async () => {
119:     if (!pedido) return;
120:     setGuardando(true);
121:     setShowConfirmModal(false);
122:     try {
123:       const itemsOriginal = pedido.items;
124:       const deletedIds = itemsOriginal.filter((oi) => !itemsEdit.find((ni) => ni.id === oi.id)).map((oi) => oi.id);
125:       const addedItems = itemsEdit.filter((ni) => ni.id.startsWith('temp-'));
126:       const changedItems = itemsEdit.filter((ni) => {
127:         const original = itemsOriginal.find((oi) => oi.id === ni.id);
128:         return original && original.cantidad !== ni.cantidad;
129:       });
130: 
131:       for (const itemId of deletedIds) await quitarItemMutation.mutateAsync(itemId);
132:       for (const item of addedItems) await agregarItemMutation.mutateAsync({ itemId: item.item.id, cantidad: item.cantidad });
133:       for (const item of changedItems) await actualizarCantidadMutation.mutateAsync({ itemId: item.id, cantidad: item.cantidad });
134: 
135:       queryClient.setQueryData<Pedido>(['pedido', id], (old) => {
136:         if (!old) return old;
137:         const newTotal = itemsEdit.reduce((sum, item) => sum + (item.precioUnitario ?? 0) * item.cantidad, 0);
138:         return { ...old, items: itemsEdit, total: newTotal };
139:       });
140: 
141:       showToast('Items actualizados correctamente', 'success');
142:       setModoEdicion(false);
143:       setItemsEdit([]);
144:     } catch (err) {
145:       showToast(handleApiError(err).message, 'error');
146:     } finally {
147:       setGuardando(false);
148:     }
149:   };
150: 
151:   if (isLoading) {
152:     return (
153:       <ThemedView style={styles.container}>
154:         <Header onBack={onBack ?? (() => router.back())} />
155:         <LoadingSpinner message="Cargando detalle del pedido..." />
156:       </ThemedView>
157:     );
158:   }
159: 
160:   if (isError || !pedido) {
161:     return (
162:       <ThemedView style={styles.container}>
163:         <Header onBack={onBack ?? (() => router.back())} />
164:         <ErrorMessage message={error?.message || 'Error al cargar el pedido'} onRetry={() => router.back()} />
165:       </ThemedView>
166:     );
167:   }
168: 
169:   const mostrarAcciones = (pedido.estado === 'PENDIENTE' || pedido.estado === 'EN_RUTA') && !modoEdicion;
170:   const mostrarBotonEditar = (pedido.estado === 'PENDIENTE' || pedido.estado === 'EN_RUTA') && !modoEdicion;
171:   const totalEdit = itemsEdit.reduce((sum, item) => sum + (item.precioUnitario ?? 0) * item.cantidad, 0);
172: 
173:   return (
174:     <ThemedView style={styles.container}>
175:       <Header onBack={onBack ?? (() => router.back())} />
176:       <ScrollView contentContainerStyle={styles.scrollContent}>
177:         <EstadoBadge estado={pedido.estado} orden={pedido.orden} />
178:         <InfoCliente cliente={pedido.cliente} fecha={pedido.fecha} />
179: 
180:         <ItemsList
181:           items={modoEdicion ? itemsEdit : pedido.items}
182:           modoEdicion={modoEdicion}
183:           onCambiarCantidad={handleCambiarCantidad}
184:           onEliminarItem={handleEliminarItem}
185:           onAgregarItem={abrirModalAgregar}
186:           mostrarBotonEditar={mostrarBotonEditar}
187:           onEntrarEdicion={entrarEdicion}
188:         />
189: 
190:         {pedido.motivoFalla && <MotivoFallaCard motivo={pedido.motivoFalla} />}
191: 
192:         <TotalCard total={modoEdicion ? totalEdit : (pedido.total ?? 0)} />
193: 
194:         {mostrarAcciones && (
195:           <ConfirmarAccionButtons
196:             onConfirmar={handleConfirmar}
197:             onCancelar={() => setShowCancelModal(true)}
198:             confirmarLoading={confirmarMutation.isPending}
199:             cancelarLoading={cancelarMutation.isPending}
200:           />
201:         )}
202: 
203:         {modoEdicion && (
204:           <View style={styles.actionContainer}>
205:             <Button title={guardando ? 'Guardando...' : 'Guardar cambios'} variant="primary" onPress={guardarCambios} disabled={guardando} />
206:             <Button title="Cancelar" variant="ghost" onPress={cancelarEdicion} disabled={guardando} style={styles.cancelButton} />
207:           </View>
208:         )}
209:       </ScrollView>
210: 
211:       <CancelModal visible={showCancelModal} onClose={() => setShowCancelModal(false)} onConfirmar={handleCancelar} />
212:       <AddItemModal visible={showAddModal} onClose={() => setShowAddModal(false)} onAgregar={handleAgregarItem} />
213:       <ConfirmModal visible={showConfirmModal} title="Confirmar cambios" message="¿Estás seguro de que querés modificar los items del pedido?" confirmText="Confirmar" cancelText="Cancelar" onConfirm={handleConfirmGuardar} onCancel={() => setShowConfirmModal(false)} loading={guardando} />
214:     </ThemedView>
215:   );
216: }
217: 
218: const styles = StyleSheet.create({
219:   container: { flex: 1 },
220:   scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
221:   actionContainer: { marginTop: Spacing.lg },
222:   cancelButton: { marginTop: Spacing.md },
223: });

(End of file - total 223 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 6.8s)

_Thinking:_

Now let me also check the existing pedido components like ConfirmarAccionButtons, CancelModal, InfoCliente, etc, and the backend pedido service to understand the existing state update logic.

Let me now check the pedido components and backend pedido service.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\components\\ConfirmarAccionButtons.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\pedidos\components\ConfirmarAccionButtons.tsx</path>
<type>file</type>
<content>
1: import { StyleSheet, View } from 'react-native';
2: import { Button } from '@/components/ui';
3: import { Spacing } from '@/constants/theme';
4: 
5: interface ConfirmarAccionButtonsProps {
6:   onConfirmar: () => void;
7:   onCancelar: () => void;
8:   confirmarLoading: boolean;
9:   cancelarLoading: boolean;
10: }
11: 
12: export default function ConfirmarAccionButtons({
13:   onConfirmar,
14:   onCancelar,
15:   confirmarLoading,
16:   cancelarLoading,
17: }: ConfirmarAccionButtonsProps) {
18:   return (
19:     <View style={styles.container}>
20:       <Button
21:         title="Confirmar entrega"
22:         variant="success"
23:         onPress={onConfirmar}
24:         loading={confirmarLoading}
25:         disabled={confirmarLoading}
26:       />
27:       <Button
28:         title="Cancelar entrega"
29:         variant="danger"
30:         onPress={onCancelar}
31:         loading={cancelarLoading}
32:         disabled={cancelarLoading}
33:         style={styles.cancelButton}
34:       />
35:     </View>
36:   );
37: }
38: 
39: const styles = StyleSheet.create({
40:   container: {
41:     marginTop: Spacing.lg,
42:   },
43:   cancelButton: {
44:     marginTop: Spacing.md,
45:   },
46: });

(End of file - total 46 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\components\\CancelModal.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\pedidos\components\CancelModal.tsx</path>
<type>file</type>
<content>
1: import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
2: import { Button } from '@/components/ui';
3: import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
4: import { useColorScheme } from '@/hooks/use-color-scheme';
5: import { MOTIVOS_CANCELACION } from '@/constants/motivosCancelacion';
6: import type { MotivoCancelacion } from '@/types';
7: 
8: interface CancelModalProps {
9:   visible: boolean;
10:   onClose: () => void;
11:   onConfirmar: (motivo: MotivoCancelacion) => void;
12: }
13: 
14: export default function CancelModal({ visible, onClose, onConfirmar }: CancelModalProps) {
15:   const colorScheme = useColorScheme() ?? 'light';
16:   const theme = Colors[colorScheme];
17: 
18:   return (
19:     <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
20:       <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
21:         <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
22:           <Text style={[styles.modalTitle, { color: theme.text }]}>Seleccionar motivo</Text>
23:           <Text style={[styles.modalSubtitle, { color: theme.muted }]}>
24:             ¿Por qué no se pudo realizar la entrega?
25:           </Text>
26: 
27:           {MOTIVOS_CANCELACION.map((motivo) => (
28:             <TouchableOpacity
29:               key={motivo.value}
30:               style={[styles.motivoOption, { borderColor: theme.border }]}
31:               onPress={() => onConfirmar(motivo.value)}
32:             >
33:               <Text style={[styles.motivoOptionText, { color: theme.text }]}>
34:                 {motivo.label}
35:               </Text>
36:             </TouchableOpacity>
37:           ))}
38: 
39:           <Button title="Volver" variant="ghost" onPress={onClose} />
40:         </View>
41:       </View>
42:     </Modal>
43:   );
44: }
45: 
46: const styles = StyleSheet.create({
47:   modalOverlay: {
48:     flex: 1,
49:     justifyContent: 'flex-end',
50:   },
51:   modalContent: {
52:     borderTopLeftRadius: BorderRadius.xl,
53:     borderTopRightRadius: BorderRadius.xl,
54:     padding: Spacing.xl,
55:     paddingBottom: Spacing.xxxl,
56:     maxHeight: '80%',
57:   },
58:   modalTitle: {
59:     fontSize: FontSizes.lg,
60:     fontWeight: 'bold',
61:     marginBottom: Spacing.xs,
62:   },
63:   modalSubtitle: {
64:     fontSize: FontSizes.sm,
65:     marginBottom: Spacing.xl,
66:   },
67:   motivoOption: {
68:     paddingVertical: Spacing.lg,
69:     paddingHorizontal: Spacing.lg,
70:     borderWidth: 1,
71:     borderRadius: BorderRadius.md,
72:     marginBottom: Spacing.sm,
73:   },
74:   motivoOptionText: {
75:     fontSize: FontSizes.md,
76:     fontWeight: '500',
77:   },
78: });

(End of file - total 78 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\components\\InfoCliente.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\pedidos\components\InfoCliente.tsx</path>
<type>file</type>
<content>
1: import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
2: import { Card } from '@/components/ui';
3: import { Colors, Spacing, FontSizes } from '@/constants/theme';
4: import { useColorScheme } from '@/hooks/use-color-scheme';
5: import type { Cliente } from '@/types';
6: 
7: function formatFecha(iso: string): string {
8:   const date = new Date(iso);
9:   return date.toLocaleDateString('es-AR', {
10:     day: 'numeric',
11:     month: 'long',
12:     year: 'numeric',
13:   });
14: }
15: 
16: interface InfoClienteProps {
17:   cliente: Cliente;
18:   fecha: string;
19: }
20: 
21: export default function InfoCliente({ cliente, fecha }: InfoClienteProps) {
22:   const colorScheme = useColorScheme() ?? 'light';
23:   const theme = Colors[colorScheme];
24: 
25:   const handleCall = (phone: string) => {
26:     const url = Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`;
27:     Linking.openURL(url);
28:   };
29: 
30:   const handleOpenMaps = (lat: number, lng: number) => {
31:     const url = Platform.select({
32:       ios: `maps:0,0?q=${lat},${lng}`,
33:       android: `geo:0,0?q=${lat},${lng}`,
34:       default: `https://www.google.com/maps?q=${lat},${lng}`,
35:     });
36:     if (url) Linking.openURL(url);
37:   };
38: 
39:   return (
40:     <Card>
41:       <Text style={[styles.nombre, { color: theme.text }]}>
42:         {cliente.nombre} {cliente.apellido}
43:       </Text>
44: 
45:       <TouchableOpacity
46:         style={styles.infoRow}
47:         onPress={() => handleOpenMaps(cliente.domicilio.latitud, cliente.domicilio.longitud)}
48:       >
49:         <Text style={[styles.infoLabel, { color: theme.muted }]}>Dirección</Text>
50:         <Text style={[styles.infoValue, { color: theme.info }]}>
51:           {cliente.domicilio.calle} {cliente.domicilio.numero}, {cliente.domicilio.localidad}
52:           {'\n'}Tocar para abrir en mapas
53:         </Text>
54:       </TouchableOpacity>
55: 
56:       <TouchableOpacity
57:         style={styles.infoRow}
58:         onPress={() => handleCall(cliente.telefono)}
59:       >
60:         <Text style={[styles.infoLabel, { color: theme.muted }]}>Contacto</Text>
61:         <Text style={[styles.infoValue, { color: theme.info }]}>
62:           {cliente.telefono}
63:           {'\n'}Tocar para llamar
64:         </Text>
65:       </TouchableOpacity>
66: 
67:       <View style={styles.infoRow}>
68:         <Text style={[styles.infoLabel, { color: theme.muted }]}>Horario</Text>
69:         <Text style={[styles.infoValue, { color: theme.text }]}>
70:           {cliente.horarioDesde} - {cliente.horarioHasta}
71:         </Text>
72:       </View>
73: 
74:       <View style={styles.infoRow}>
75:         <Text style={[styles.infoLabel, { color: theme.muted }]}>Fecha</Text>
76:         <Text style={[styles.infoValue, { color: theme.text }]}>{formatFecha(fecha)}</Text>
77:       </View>
78:     </Card>
79:   );
80: }
81: 
82: const styles = StyleSheet.create({
83:   nombre: {
84:     fontSize: FontSizes.xl,
85:     fontWeight: 'bold',
86:     marginBottom: Spacing.lg,
87:   },
88:   infoRow: {
89:     marginBottom: Spacing.md,
90:   },
91:   infoLabel: {
92:     fontSize: FontSizes.xs,
93:     fontWeight: '600',
94:     marginBottom: 2,
95:   },
96:   infoValue: {
97:     fontSize: FontSizes.md,
98:   },
99: });

(End of file - total 99 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\components\\EstadoBadge.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\pedidos\components\EstadoBadge.tsx</path>
<type>file</type>
<content>
1: import { StyleSheet, Text, View } from 'react-native';
2: import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
3: import { useColorScheme } from '@/hooks/use-color-scheme';
4: import type { EstadoPedido } from '@/types';
5: 
6: function getEstadoColor(estado: EstadoPedido, theme: typeof Colors.light): string {
7:   switch (estado) {
8:     case 'PENDIENTE': return theme.pendiente;
9:     case 'EN_RUTA': return theme.tint;
10:     case 'ENTREGADO': return theme.entregado;
11:     case 'NO_ENTREGADO': return theme.noEntregado;
12:     case 'CANCELADO': return theme.muted;
13:   }
14: }
15: 
16: function getEstadoLabel(estado: EstadoPedido): string {
17:   switch (estado) {
18:     case 'PENDIENTE': return 'Pendiente';
19:     case 'EN_RUTA': return 'En ruta';
20:     case 'ENTREGADO': return 'Entregado';
21:     case 'NO_ENTREGADO': return 'No entregado';
22:     case 'CANCELADO': return 'Cancelado';
23:   }
24: }
25: 
26: interface EstadoBadgeProps {
27:   estado: EstadoPedido;
28:   orden: number;
29: }
30: 
31: export default function EstadoBadge({ estado, orden }: EstadoBadgeProps) {
32:   const colorScheme = useColorScheme() ?? 'light';
33:   const theme = Colors[colorScheme];
34:   const color = getEstadoColor(estado, theme);
35: 
36:   return (
37:     <View style={styles.container}>
38:       <View style={[styles.badge, { backgroundColor: color + '20' }]}>
39:         <Text style={[styles.estadoText, { color }]}>
40:           {getEstadoLabel(estado)}
41:         </Text>
42:       </View>
43:       <Text style={[styles.ordenText, { color: theme.muted }]}>
44:         Pedido #{orden}
45:       </Text>
46:     </View>
47:   );
48: }
49: 
50: const styles = StyleSheet.create({
51:   container: {
52:     flexDirection: 'row',
53:     justifyContent: 'space-between',
54:     alignItems: 'center',
55:     marginBottom: Spacing.lg,
56:   },
57:   badge: {
58:     paddingHorizontal: Spacing.lg,
59:     paddingVertical: Spacing.sm,
60:     borderRadius: BorderRadius.sm,
61:   },
62:   estadoText: {
63:     fontSize: FontSizes.md,
64:     fontWeight: '700',
65:   },
66:   ordenText: {
67:     fontSize: FontSizes.sm,
68:   },
69: });

(End of file - total 69 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\service.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\pedidos\service.ts</path>
<type>file</type>
<content>
1: import { prisma } from '../../lib/prisma.js';
2: import { ApiError } from '../../utils/api-error.js';
3: import type { Prisma } from '../../../generated/prisma/client.js';
4: 
5: /** Create a Date from YYYY-MM-DD string without timezone conversion */
6: function dateFromISODate(dateStr: string): Date {
7:   const [y, m, d] = dateStr.slice(0, 10).split('-');
8:   return new Date(Number(y), Number(m) - 1, Number(d));
9: }
10: 
11: /** Format a calendar-date Date to YYYY-MM-DD without timezone shift */
12: function fmtDate(d: Date): string {
13:   const y = String(d.getFullYear());
14:   const m = String(d.getMonth() + 1).padStart(2, '0');
15:   const day = String(d.getDate()).padStart(2, '0');
16:   return `${y}-${m}-${day}`;
17: }
18: 
19: // ─── Tipos ──────────────────────────────────────────────────────────────────
20: 
21: type PedidoConRelaciones = Prisma.PedidoGetPayload<{
22:   include: {
23:     cliente: true;
24:     items: { include: { item: true } };
25:   };
26: }>;
27: 
28: type EstadoPedido = 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'NO_ENTREGADO' | 'CANCELADO';
29: 
30: // ─── Mapa de transiciones válidas ────────────────────────────────────────────
31: 
32: const TRANSICIONES: Record<EstadoPedido, EstadoPedido[]> = {
33:   PENDIENTE: ['EN_RUTA', 'NO_ENTREGADO', 'CANCELADO'],
34:   EN_RUTA: ['ENTREGADO', 'NO_ENTREGADO'],
35:   ENTREGADO: [],
36:   NO_ENTREGADO: [],
37:   CANCELADO: [],
38: };
39: 
40: function validarTransicion(actual: string, nuevo: string): void {
41:   const permitidos = TRANSICIONES[actual as EstadoPedido];
42:   if (!permitidos || !permitidos.includes(nuevo as EstadoPedido)) {
43:     throw ApiError.conflict(
44:       `No se puede cambiar el estado de "${actual}" a "${nuevo}"`
45:     );
46:   }
47: }
48: 
49: // ─── Format ──────────────────────────────────────────────────────────────────
50: 
51: function formatPedido(pedido: PedidoConRelaciones) {
52:   const total = pedido.items.reduce(
53:     (sum, pi) => sum + (pi.precioUnitario ?? 0) * pi.cantidad,
54:     0
55:   );
56: 
57:   return {
58:     id: pedido.id,
59:     orden: pedido.orden,
60:     estado: pedido.estado,
61:     fecha: fmtDate(pedido.fecha),
62:     motivoFalla: pedido.motivoFalla ?? undefined,
63:     total,
64:     itemsCount: pedido.items.length,
65:     cliente: {
66:       id: pedido.cliente.id,
67:       nombre: pedido.cliente.nombre,
68:       apellido: pedido.cliente.apellido,
69:       telefono: pedido.cliente.telefono,
70:       domicilio: {
71:         calle: pedido.cliente.calle,
72:         numero: pedido.cliente.numero,
73:         localidad: pedido.cliente.localidad,
74:         latitud: pedido.cliente.latitud,
75:         longitud: pedido.cliente.longitud,
76:       },
77:       horarioDesde: pedido.cliente.horarioDesde,
78:       horarioHasta: pedido.cliente.horarioHasta,
79:     },
80:     items: pedido.items.map((pi) => ({
81:       id: pi.id,
82:       item: {
83:         id: pi.item.id,
84:         nombre: pi.item.nombre,
85:         descripcion: pi.item.descripcion ?? undefined,
86:         unidad: pi.item.unidad,
87:         activo: pi.item.activo,
88:       },
89:       cantidad: pi.cantidad,
90:       precioUnitario: pi.precioUnitario,
91:     })),
92:   };
93: }
94: 
95: // ─── Helpers ─────────────────────────────────────────────────────────────────
96: 
97: /** GET /pedidos/disponibles?fecha= — Pedidos PENDIENTE sin reparto asignado */
98: export async function obtenerPedidosDisponiblesParaReparto(fechaParam: string) {
99:   const fecha = dateFromISODate(fechaParam);
100: 
101:   const pedidos = await prisma.pedido.findMany({
102:     where: {
103:       fecha,
104:       estado: 'PENDIENTE',
105:       repartoId: null,
106:       deletedAt: null,
107:     },
108:     include: {
109:       cliente: true,
110:       items: { include: { item: true } },
111:     },
112:     orderBy: { orden: 'asc' },
113:   });
114: 
115:   return pedidos.map(formatPedido);
116: }
117: 
118: async function findPedidoActivo(
119:   id: string
120: ): Promise<PedidoConRelaciones> {
121:   const pedido = await prisma.pedido.findUnique({
122:     where: { id },
123:     include: {
124:       cliente: true,
125:       items: { include: { item: true } },
126:     },
127:   });
128: 
129:   if (!pedido) {
130:     throw ApiError.notFound('Pedido no encontrado');
131:   }
132: 
133:   if (pedido.deletedAt) {
134:     throw ApiError.notFound('Pedido no encontrado');
135:   }
136: 
137:   return pedido;
138: }
139: 
140: // =============================================================================
141: // ENDPOINTS PÚBLICOS
142: // =============================================================================
143: 
144: /** GET /pedidos/hoy?repartidorId= */
145: export async function obtenerPedidosDelDia(repartidorId: string) {
146:   const startOfDay = new Date();
147:   startOfDay.setHours(0, 0, 0, 0);
148:   const endOfDay = new Date(startOfDay);
149:   endOfDay.setDate(endOfDay.getDate() + 1);
150: 
151:   const pedidos = await prisma.pedido.findMany({
152:     where: {
153:       reparto: { repartidorId },
154:       fecha: { gte: startOfDay, lt: endOfDay },
155:       deletedAt: null,
156:     },
157:     include: {
158:       cliente: true,
159:       items: { include: { item: true } },
160:     },
161:     orderBy: { orden: 'asc' },
162:   });
163: 
164:   return pedidos.map(formatPedido);
165: }
166: 
167: /** GET /pedidos/:id */
168: export async function obtenerPedido(id: string) {
169:   const pedido = await findPedidoActivo(id);
170:   return formatPedido(pedido);
171: }
172: 
173: /** GET /pedidos?clienteNombre=&estado=&page=&pageSize= */
174: export async function listarPedidos(params?: {
175:   clienteNombre?: string;
176:   fecha?: string;
177:   estado?: string;
178:   page?: number;
179:   pageSize?: number;
180: }) {
181:   const page = params?.page ?? 1;
182:   const pageSize = params?.pageSize ?? 20;
183:   const skip = (page - 1) * pageSize;
184: 
185:   const where: Record<string, unknown> = {
186:     deletedAt: null,
187:   };
188: 
189:   if (params?.estado) {
190:     where['estado'] = params.estado;
191:   }
192: 
193:   if (params?.clienteNombre) {
194:     where['OR'] = [
195:       { cliente: { nombre: { contains: params.clienteNombre, mode: 'insensitive' as const } } },
196:       { cliente: { apellido: { contains: params.clienteNombre, mode: 'insensitive' as const } } },
197:     ];
198:   }
199: 
200:   if (params?.fecha) {
201:     const date = new Date(params.fecha);
202:     where['fecha'] = date;
203:   }
204: 
205:   const [pedidos, total] = await Promise.all([
206:     prisma.pedido.findMany({
207:       where,
208:       include: {
209:         cliente: true,
210:         items: { include: { item: true } },
211:       },
212:       orderBy: { orden: 'asc' },
213:       skip,
214:       take: pageSize,
215:     }),
216:     prisma.pedido.count({ where }),
217:   ]);
218: 
219:   return {
220:     data: pedidos.map(formatPedido),
221:     total,
222:     page,
223:     pageSize,
224:   };
225: }
226: 
227: // =============================================================================
228: // MUTACIONES — Repartidor
229: // =============================================================================
230: 
231: /** PATCH /pedidos/:id/confirmar — PENDIENTE/EN_RUTA → ENTREGADO */
232: export async function confirmarEntrega(id: string) {
233:   const pedido = await prisma.pedido.findUnique({ where: { id } });
234: 
235:   if (!pedido) {
236:     throw ApiError.notFound('Pedido no encontrado');
237:   }
238: 
239:   if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
240:     throw ApiError.conflict('El pedido no puede ser entregado desde su estado actual');
241:   }
242: 
243:   const updated = await prisma.pedido.update({
244:     where: { id },
245:     data: { estado: 'ENTREGADO' },
246:   });
247: 
248:   return {
249:     id: updated.id,
250:     estado: 'ENTREGADO' as const,
251:     actualizadoEn: updated.actualizadoEn.toISOString(),
252:   };
253: }
254: 
255: /** PATCH /pedidos/:id/cancelar — PENDIENTE/EN_RUTA → NO_ENTREGADO (repartidor) */
256: export async function cancelarPedidoRepartidor(id: string, motivo: string) {
257:   const pedido = await prisma.pedido.findUnique({ where: { id } });
258: 
259:   if (!pedido) {
260:     throw ApiError.notFound('Pedido no encontrado');
261:   }
262: 
263:   if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
264:     throw ApiError.conflict('El pedido no puede marcarse como no entregado desde su estado actual');
265:   }
266: 
267:   const updated = await prisma.pedido.update({
268:     where: { id },
269:     data: { estado: 'NO_ENTREGADO', motivoFalla: motivo },
270:   });
271: 
272:   return {
273:     id: updated.id,
274:     estado: 'NO_ENTREGADO' as const,
275:     motivoFalla: updated.motivoFalla!,
276:     actualizadoEn: updated.actualizadoEn.toISOString(),
277:   };
278: }
279: 
280: // =============================================================================
281: // MUTACIONES — Admin
282: // =============================================================================
283: 
284: /** POST /pedidos */
285: export async function crearPedido(data: {
286:   clienteId: string;
287:   fecha?: string;
288:   orden?: number;
289:   items: Array<{ itemId: string; cantidad: number }>;
290: }) {
291:   // Verificar cliente
292:   const cliente = await prisma.cliente.findUnique({ where: { id: data.clienteId } });
293:   if (!cliente) {
294:     throw ApiError.notFound('Cliente no encontrado');
295:   }
296: 
297:   // Verificar items
298:   const itemsValidos: Array<{ id: string; nombre: string; precio: number | null }> = [];
299:   for (const item of data.items) {
300:     const dbItem = await prisma.item.findUnique({ where: { id: item.itemId } });
301:     if (!dbItem) {
302:       throw ApiError.badRequest(`El ítem ${item.itemId} no existe`);
303:     }
304:     if (!dbItem.activo) {
305:       throw ApiError.badRequest(`El ítem "${dbItem.nombre}" no está disponible`);
306:     }
307:     itemsValidos.push({ id: dbItem.id, nombre: dbItem.nombre, precio: dbItem.precio });
308:   }
309: 
310:   // Resolver fecha
311:   const hoy = new Date();
312:   hoy.setHours(0, 0, 0, 0);
313:   const fechaDate = data.fecha ? dateFromISODate(data.fecha) : hoy;
314: 
315:   // Validar que la fecha no sea anterior a hoy
316:   if (fechaDate < hoy) {
317:     throw ApiError.badRequest('La fecha no puede ser anterior a hoy');
318:   }
319: 
320:   // Auto-asignar orden si no se provee
321:   let orden = data.orden;
322:   if (!orden) {
323:     const maxOrden = await prisma.pedido.aggregate({
324:       _max: { orden: true },
325:       where: { fecha: fechaDate },
326:     });
327:     orden = (maxOrden._max.orden ?? 0) + 1;
328:   }
329: 
330:   const pedido = await prisma.pedido.create({
331:     data: {
332:       clienteId: data.clienteId,
333:       fecha: fechaDate,
334:       orden,
335:       items: {
336:         create: data.items.map((i) => {
337:           const itemInfo = itemsValidos.find((iv) => iv.id === i.itemId)!;
338:           return {
339:             itemId: i.itemId,
340:             cantidad: i.cantidad,
341:             precioUnitario: itemInfo.precio,
342:           };
343:         }),
344:       },
345:     },
346:     include: {
347:       cliente: true,
348:       items: { include: { item: true } },
349:     },
350:   });
351: 
352:   return formatPedido(pedido);
353: }
354: 
355: /** DELETE /pedidos/:id — Soft delete (admin) */
356: export async function eliminarPedido(id: string) {
357:   const pedido = await prisma.pedido.findUnique({ where: { id } });
358: 
359:   if (!pedido) {
360:     throw ApiError.notFound('Pedido no encontrado');
361:   }
362: 
363:   if (pedido.estado === 'EN_RUTA' || pedido.estado === 'ENTREGADO') {
364:     throw ApiError.conflict('No se puede eliminar un pedido en reparto');
365:   }
366: 
367:   const updated = await prisma.pedido.update({
368:     where: { id },
369:     data: { deletedAt: new Date() },
370:   });
371: 
372:   return {
373:     id: updated.id,
374:     deletedAt: updated.deletedAt!.toISOString(),
375:   };
376: }
377: 
378: /** PATCH /pedidos/:id/estado — Máquina de estados */
379: export async function actualizarEstado(id: string, nuevoEstado: string) {
380:   const pedido = await prisma.pedido.findUnique({ where: { id } });
381: 
382:   if (!pedido) {
383:     throw ApiError.notFound('Pedido no encontrado');
384:   }
385: 
386:   validarTransicion(pedido.estado, nuevoEstado);
387: 
388:   const updated = await prisma.pedido.update({
389:     where: { id },
390:     data: { estado: nuevoEstado as EstadoPedido },
391:   });
392: 
393:   return {
394:     id: updated.id,
395:     estado: updated.estado,
396:     actualizadoEn: updated.actualizadoEn.toISOString(),
397:   };
398: }
399: 
400: /** POST /pedidos/:id/cancelar — Admin: PENDIENTE → CANCELADO */
401: export async function cancelarPedido(id: string) {
402:   const pedido = await prisma.pedido.findUnique({ where: { id } });
403: 
404:   if (!pedido) {
405:     throw ApiError.notFound('Pedido no encontrado');
406:   }
407: 
408:   if (pedido.estado !== 'PENDIENTE') {
409:     throw ApiError.conflict('Solo se pueden cancelar pedidos en estado pendiente');
410:   }
411: 
412:   const updated = await prisma.pedido.update({
413:     where: { id },
414:     data: { estado: 'CANCELADO' },
415:   });
416: 
417:   return {
418:     id: updated.id,
419:     estado: 'CANCELADO' as const,
420:     actualizadoEn: updated.actualizadoEn.toISOString(),
421:   };
422: }
423: 
424: // =============================================================================
425: // MUTACIONES — Items del pedido (admin)
426: // =============================================================================
427: 
428: /** POST /pedidos/:pedidoId/items */
429: export async function agregarItem(
430:   pedidoId: string,
431:   data: { itemId: string; cantidad: number }
432: ) {
433:   const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
434: 
435:   if (!pedido) {
436:     throw ApiError.notFound('Pedido no encontrado');
437:   }
438: 
439:   if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
440:     throw ApiError.conflict('Solo se pueden modificar pedidos en estado pendiente o en ruta');
441:   }
442: 
443:   const dbItem = await prisma.item.findUnique({ where: { id: data.itemId } });
444:   if (!dbItem) {
445:     throw ApiError.badRequest('El ítem no existe');
446:   }
447:   if (!dbItem.activo) {
448:     throw ApiError.badRequest(`El ítem "${dbItem.nombre}" no está disponible`);
449:   }
450: 
451:   const existente = await prisma.pedidoItem.findFirst({
452:     where: { pedidoId, itemId: data.itemId },
453:   });
454:   if (existente) {
455:     throw ApiError.conflict('El ítem ya existe en el pedido');
456:   }
457: 
458:   await prisma.pedidoItem.create({
459:     data: {
460:       pedidoId,
461:       itemId: data.itemId,
462:       cantidad: data.cantidad,
463:       precioUnitario: dbItem.precio,
464:     },
465:   });
466: 
467:   // Re-fetch con relaciones
468:   const updated = await findPedidoActivo(pedidoId);
469:   return formatPedido(updated);
470: }
471: 
472: /** PATCH /pedidos/:pedidoId/items/:itemId */
473: export async function actualizarCantidadItem(
474:   pedidoId: string,
475:   itemId: string,
476:   cantidad: number
477: ) {
478:   const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
479: 
480:   if (!pedido) {
481:     throw ApiError.notFound('Pedido no encontrado');
482:   }
483: 
484:   if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
485:     throw ApiError.conflict('Solo se pueden modificar pedidos en estado pendiente o en ruta');
486:   }
487: 
488:   const pedidoItem = await prisma.pedidoItem.findFirst({
489:     where: { id: itemId, pedidoId },
490:   });
491:   if (!pedidoItem) {
492:     throw ApiError.notFound('El ítem no existe en el pedido');
493:   }
494: 
495:   await prisma.pedidoItem.update({
496:     where: { id: itemId },
497:     data: { cantidad },
498:   });
499: 
500:   const updated = await findPedidoActivo(pedidoId);
501:   return formatPedido(updated);
502: }
503: 
504: /** DELETE /pedidos/:pedidoId/items/:itemId */
505: export async function quitarItem(pedidoId: string, itemId: string) {
506:   const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
507: 
508:   if (!pedido) {
509:     throw ApiError.notFound('Pedido no encontrado');
510:   }
511: 
512:   if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
513:     throw ApiError.conflict('Solo se pueden modificar pedidos en estado pendiente o en ruta');
514:   }
515: 
516:   const pedidoItem = await prisma.pedidoItem.findFirst({
517:     where: { id: itemId, pedidoId },
518:   });
519:   if (!pedidoItem) {
520:     throw ApiError.notFound('El ítem no existe en el pedido');
521:   }
522: 
523:   const itemsCount = await prisma.pedidoItem.count({ where: { pedidoId } });
524:   if (itemsCount <= 1) {
525:     throw ApiError.conflict('El pedido debe tener al menos un item');
526:   }
527: 
528:   await prisma.pedidoItem.delete({ where: { id: itemId } });
529: 
530:   const updated = await findPedidoActivo(pedidoId);
531:   return formatPedido(updated);
532: }

(End of file - total 532 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 6.8s)

_Thinking:_

Now let me check the existing backend pedido controller and routes to see how the state change endpoints are currently exposed, and also check if there's an "iniciar entrega" (start delivery) endpoint that sets a pedido to EN_RUTA.

Let me check the backend pedido controller and routes for existing endpoints, plus the cliente type and motivos cancelacion constant.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\controller.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\pedidos\controller.ts</path>
<type>file</type>
<content>
1: import type { Request, Response, NextFunction } from 'express';
2: import {
3:   crearPedidoSchema,
4:   cancelarPedidoSchema,
5:   actualizarEstadoSchema,
6:   agregarItemSchema,
7:   actualizarCantidadSchema,
8: } from './schema.js';
9: import * as pedidosService from './service.js';
10: import { sendSuccess, sendList } from '../../utils/response.js';
11: 
12: export async function obtenerHoyController(
13:   req: Request,
14:   res: Response,
15:   next: NextFunction
16: ): Promise<void> {
17:   try {
18:     const repartidorId = req.query.repartidorId;
19:     if (typeof repartidorId !== 'string' || !repartidorId) {
20:       res.status(400).json({
21:         error: {
22:           code: 'VALIDATION_ERROR',
23:           message: 'repartidorId es requerido',
24:           timestamp: new Date().toISOString(),
25:         },
26:       });
27:       return;
28:     }
29:     const result = await pedidosService.obtenerPedidosDelDia(repartidorId);
30:     sendList(res, result);
31:   } catch (err) {
32:     next(err);
33:   }
34: }
35: 
36: export async function obtenerController(
37:   req: Request,
38:   res: Response,
39:   next: NextFunction
40: ): Promise<void> {
41:   try {
42:     const id = req.params['id'] as string;
43:     const result = await pedidosService.obtenerPedido(id);
44:     sendSuccess(res, result);
45:   } catch (err) {
46:     next(err);
47:   }
48: }
49: 
50: export async function listarController(
51:   req: Request,
52:   res: Response,
53:   next: NextFunction
54: ): Promise<void> {
55:   try {
56:     const clienteNombre = typeof req.query.clienteNombre === 'string' ? req.query.clienteNombre : undefined;
57:     const fecha = typeof req.query.fecha === 'string' ? req.query.fecha : undefined;
58:     const estado = typeof req.query.estado === 'string' ? req.query.estado : undefined;
59:     const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
60:     const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined;
61:     const result = await pedidosService.listarPedidos({
62:       clienteNombre,
63:       fecha,
64:       estado,
65:       page,
66:       pageSize,
67:     });
68:     res.status(200).json(result);
69:   } catch (err) {
70:     next(err);
71:   }
72: }
73: 
74: export async function confirmarController(
75:   req: Request,
76:   res: Response,
77:   next: NextFunction
78: ): Promise<void> {
79:   try {
80:     const id = req.params['id'] as string;
81:     const result = await pedidosService.confirmarEntrega(id);
82:     res.status(200).json(result);
83:   } catch (err) {
84:     next(err);
85:   }
86: }
87: 
88: /** Repartidor: PENDIENTE/EN_RUTA → NO_ENTREGADO (con motivo) */
89: export async function cancelarRepartidorController(
90:   req: Request,
91:   res: Response,
92:   next: NextFunction
93: ): Promise<void> {
94:   try {
95:     const id = req.params['id'] as string;
96:     const { motivo } = cancelarPedidoSchema.parse(req.body);
97:     const result = await pedidosService.cancelarPedidoRepartidor(id, motivo);
98:     res.status(200).json(result);
99:   } catch (err) {
100:     next(err);
101:   }
102: }
103: 
104: /** Admin: cambia el estado según máquina de estados */
105: export async function actualizarEstadoController(
106:   req: Request,
107:   res: Response,
108:   next: NextFunction
109: ): Promise<void> {
110:   try {
111:     const id = req.params['id'] as string;
112:     const { estado } = actualizarEstadoSchema.parse(req.body);
113:     const result = await pedidosService.actualizarEstado(id, estado);
114:     res.status(200).json(result);
115:   } catch (err) {
116:     next(err);
117:   }
118: }
119: 
120: /** POST /pedidos/:pedidoId/items */
121: export async function agregarItemController(
122:   req: Request,
123:   res: Response,
124:   next: NextFunction
125: ): Promise<void> {
126:   try {
127:     const pedidoId = req.params['pedidoId'] as string;
128:     const data = agregarItemSchema.parse(req.body);
129:     const result = await pedidosService.agregarItem(pedidoId, data);
130:     res.status(201).json(result);
131:   } catch (err) {
132:     next(err);
133:   }
134: }
135: 
136: /** PATCH /pedidos/:pedidoId/items/:itemId */
137: export async function actualizarCantidadItemController(
138:   req: Request,
139:   res: Response,
140:   next: NextFunction
141: ): Promise<void> {
142:   try {
143:     const pedidoId = req.params['pedidoId'] as string;
144:     const itemId = req.params['itemId'] as string;
145:     const { cantidad } = actualizarCantidadSchema.parse(req.body);
146:     const result = await pedidosService.actualizarCantidadItem(pedidoId, itemId, cantidad);
147:     res.status(200).json(result);
148:   } catch (err) {
149:     next(err);
150:   }
151: }
152: 
153: /** DELETE /pedidos/:pedidoId/items/:itemId */
154: export async function quitarItemController(
155:   req: Request,
156:   res: Response,
157:   next: NextFunction
158: ): Promise<void> {
159:   try {
160:     const pedidoId = req.params['pedidoId'] as string;
161:     const itemId = req.params['itemId'] as string;
162:     const result = await pedidosService.quitarItem(pedidoId, itemId);
163:     res.status(200).json(result);
164:   } catch (err) {
165:     next(err);
166:   }
167: }
168: 
169: /** DELETE /pedidos/:id — Soft delete (admin) */
170: export async function eliminarPedidoController(
171:   req: Request,
172:   res: Response,
173:   next: NextFunction
174: ): Promise<void> {
175:   try {
176:     const id = req.params['id'] as string;
177:     const result = await pedidosService.eliminarPedido(id);
178:     res.status(200).json(result);
179:   } catch (err) {
180:     next(err);
181:   }
182: }
183: 
184: export async function obtenerDisponiblesController(
185:   req: Request,
186:   res: Response,
187:   next: NextFunction
188: ): Promise<void> {
189:   try {
190:     const fecha = req.query.fecha as string;
191:     if (!fecha) {
192:       res.status(400).json({
193:         error: {
194:           code: 'VALIDATION_ERROR',
195:           message: 'fecha es requerida (YYYY-MM-DD)',
196:           timestamp: new Date().toISOString(),
197:         },
198:       });
199:       return;
200:     }
201:     const result = await pedidosService.obtenerPedidosDisponiblesParaReparto(fecha);
202:     sendList(res, result);
203:   } catch (err) {
204:     next(err);
205:   }
206: }
207: 
208: export async function crearController(
209:   req: Request,
210:   res: Response,
211:   next: NextFunction
212: ): Promise<void> {
213:   try {
214:     const data = crearPedidoSchema.parse(req.body);
215:     const result = await pedidosService.crearPedido(data);
216:     sendSuccess(res, result, 201);
217:   } catch (err) {
218:     next(err);
219:   }
220: }

(End of file - total 220 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\routes.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\pedidos\routes.ts</path>
<type>file</type>
<content>
1: import { Router } from 'express';
2: import {
3:   obtenerHoyController,
4:   obtenerDisponiblesController,
5:   obtenerController,
6:   listarController,
7:   confirmarController,
8:   cancelarRepartidorController,
9:   actualizarEstadoController,
10:   crearController,
11:   agregarItemController,
12:   actualizarCantidadItemController,
13:   quitarItemController,
14:   eliminarPedidoController,
15: } from './controller.js';
16: import { authenticate, requireRole } from '../../middleware/auth.middleware.js';
17: 
18: const router = Router();
19: 
20: // ─── Lectura — Admin y repartidor ─────────────────────────────────────────────
21: router.get('/hoy', authenticate, obtenerHoyController);
22: router.get('/disponibles', authenticate, requireRole('ADMIN'), obtenerDisponiblesController);
23: router.get('/', authenticate, listarController);
24: router.get('/:id', authenticate, obtenerController);
25: 
26: // ─── Escritura — Admin y repartidor ───────────────────────────────────────────
27: router.post('/', authenticate, requireRole('ADMIN', 'REPARTIDOR'), crearController);
28: router.patch('/:id/estado', authenticate, requireRole('ADMIN', 'REPARTIDOR'), actualizarEstadoController);
29: router.delete('/:id', authenticate, requireRole('ADMIN', 'REPARTIDOR'), eliminarPedidoController);
30: 
31: // ─── Items del pedido — Admin y repartidor ────────────────────────────────────
32: router.post('/:pedidoId/items', authenticate, requireRole('ADMIN', 'REPARTIDOR'), agregarItemController);
33: router.patch('/:pedidoId/items/:itemId', authenticate, requireRole('ADMIN', 'REPARTIDOR'), actualizarCantidadItemController);
34: router.delete('/:pedidoId/items/:itemId', authenticate, requireRole('ADMIN', 'REPARTIDOR'), quitarItemController);
35: 
36: // ─── Flujo de reparto — Solo repartidor ───────────────────────────────────────
37: router.patch('/:id/confirmar', authenticate, requireRole('REPARTIDOR'), confirmarController);
38: router.patch('/:id/cancelar', authenticate, requireRole('REPARTIDOR'), cancelarRepartidorController);
39: 
40: export default router;

(End of file - total 40 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\types\\cliente.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\types\cliente.ts</path>
<type>file</type>
<content>
1: // TDD-0001: Cliente types
2: 
3: export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO';
4: 
5: export interface Domicilio {
6:   calle: string;
7:   numero: string;
8:   localidad: string;
9:   latitud: number;
10:   longitud: number;
11: }
12: 
13: export interface Cliente {
14:   id: string;
15:   nombre: string;
16:   apellido: string;
17:   telefono: string;
18:   domicilio: Domicilio;
19:   diaEntrega: DiaSemana;
20:   horarioDesde: string;
21:   horarioHasta: string;
22:   observaciones?: string;
23:   activo?: boolean;
24: }
25: 
26: export interface CrearClienteInput {
27:   nombre: string;
28:   apellido: string;
29:   telefono: string;
30:   calle: string;
31:   numero: string;
32:   localidad: string;
33:   latitud: number;
34:   longitud: number;
35:   diaEntrega: DiaSemana;
36:   horarioDesde: string;
37:   horarioHasta: string;
38:   observaciones?: string;
39: }
40: 
41: export interface ActualizarClienteInput extends Partial<CrearClienteInput> {}

(End of file - total 41 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\constants\\motivosCancelacion.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\constants\motivosCancelacion.ts</path>
<type>file</type>
<content>
1: // Motivos de cancelación de entrega
2: // Estos valores coinciden con el tipo MotivoCancelacion en types/
3: export const MOTIVOS_CANCELACION = [
4:   { value: 'CLIENTE_AUSENTE', label: 'Cliente ausente' },
5:   { value: 'DIRECCION_INCORRECTA', label: 'Dirección incorrecta' },
6:   { value: 'ACCESO_DENEGADO', label: 'Acceso denegado' },
7:   { value: 'OTRO', label: 'Otro' },
8: ] as const;

(End of file - total 8 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\components\\ui\\index.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\components\ui\index.ts</path>
<type>file</type>
<content>
1: export { default as Button } from './button';
2: export { default as Card } from './card';
3: export { default as Input } from './input';
4: export { default as LoadingSpinner } from './loading-spinner';
5: export { default as ErrorMessage } from './error-message';
6: export { default as Header } from './header';
7: export { default as Toast } from './Toast';
8: export { default as ConnectivityBanner } from './connectivity-banner';
9: export { default as ConfirmModal } from './confirm-modal';

(End of file - total 9 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 52.7s)

_Thinking:_

Now I have a very comprehensive understanding of the codebase. Let me also check the ADR documentation and do a final check on the existing tests for the backend repartos feature.

Let me now look at what's missing:

1. **Backend: `PATCH /pedidos/:id/iniciar-entrega`** - Need an endpoint to set `PENDIENTE → EN_RUTA`. Currently this can be done via `PATCH /pedidos/:id/estado` with `{ estado: 'EN_RUTA' }`, but looking at the routes, this is allowed for both ADMIN and REPARTIDOR. That's already covered.

2. **Backend: Auto-complete reparto** - When all pedidos are processed (ENTREGADO, NO_ENTREGADO, CANCELADO), the reparto should auto-complete to COMPLETADO and set horaFin. This logic needs to be added to the backend after each pedido status change.

3. **Mobile: New InicioScreen** - Complete rewrite of the existing InicioScreen with proper flow for PENDIENTE/EN_CURSO states.

Let me now also look at the existing ADR and TDD docs to make sure I respect all the decisions.

**Tool: task**

**Input:**
```json
{
  "description": "Encontrar ADR y TDD docs",
  "subagent_type": "explore",
  "prompt": "Busca archivos de documentación ADR (Architecture Decision Records) y TDD (Technical Design Documents) en el proyecto C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle. Busca en cualquier ubicación - podrían estar en /docs, /documentation, /adr, /tdd, o en la raíz de cada proyecto (backend, mobile, whatsapp-bot). \n\nBusca archivos con patrones como \"ADR*\", \"*adr*\", \"*TDD*\", \"*tdd*\", \"*.md\" en carpetas de documentación.\n\nDevuelve las rutas de los archivos encontrados y un resumen de su contenido."
}
```

**Output:**
```
task_id: ses_199ee9f64ffet6BB8K7MqteHmW (for resuming to continue this task if needed)

<task_result>
A continuacion presento el resumen completo de todos los archivos de documentacion ADR y TDD encontrados en el proyecto.

---

## Resumen de Archivos de Documentacion Encontrados

Se encontraron **3 categorias** de documentos en `C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\`:

---

### 1. ADR (Architecture Decision Records) -- 17 archivos

**Ubicacion:** `docs/ADRs/`

| Archivo | Resumen |
|---|---|
| **Template.md** | Plantilla para crear nuevos ADRs. Incluye secciones: Contexto, Decision, Opciones Consideradas, Consecuencias. |
| **ADR-0000-estandarizacion-respuestas-api.md** | Estandariza el formato JSON de respuestas API: `{ data: T }` para exitosa individual, `{ data: T[]; total }` para listas, y `{ error: { code, message, timestamp, details? } }` para errores. Define la clase `AppError` y middleware global. |
| **ADR-0001-autenticacion-jwt-roles.md** | Define autenticacion con JWT + bcrypt y dos roles: `REPARTIDOR` y `ADMIN`. Flujo login -> JWT -> middleware `authenticate` + `authorize`. No hay registro publico. |
| **ADR-0002-arquitectura-mobile.md** | Arquitectura de estado mobile en dos capas: Zustand para estado local (sesion, UI) y TanStack Query para estado del servidor (datos API, cache, mutaciones). Axios como cliente HTTP. |
| **ADR-0003-monorepo-tres-proyectos.md** | Decide la separacion en 3 proyectos independientes dentro de un monorepo: `backend/`, `mobile/`, `whatsapp-bot/`. Cada uno con su propio package.json, TypeScript config y scripts. |
| **ADR-0004-stack-backend.md** | Stack del backend: Node.js + TypeScript 6 (ESModules), Express 5, Prisma 7 + PostgreSQL, Zod 4, bcrypt + jsonwebtoken, pino + morgan, helmet + cors. |
| **ADR-0005-stack-mobile.md** | Stack mobile: Expo SDK 54, React Native 0.81, Expo Router 6, @react-navigation (bottom-tabs + native-stack), react-native-reanimated, react-native-gesture-handler. |
| **ADR-0006-stack-whatsapp.md** | Stack del bot WhatsApp: BuilderBot 1.4 con @builderbot/provider-meta y @builderbot/database-postgres. Abstrae la complejidad de la API de WhatsApp Business. |
| **ADR-0007-arquitectura-backend-capas.md** | Arquitectura backend en capas por feature: cada feature tiene `controller.ts`, `service.ts`, `routes.ts`, `schema.ts`, `types.ts`. Capas transversales en `src/middleware`, `src/lib`, `src/utils`. |
| **ADR-0008-arquitectura-mobile-features.md** | Arquitectura mobile feature-based: `features/*/screens/`, `features/*/components/`, `features/*/hooks/`, `features/*/services/`. Carpetas tecnicas para lo generico (`services/`, `stores/`, `types/`). |
| **ADR-0009-estado-mobile-zustand.md** | Zustand como unico store global. Stores definidos: `authStore` (token, usuario, rol), `uiStore` (modales, loading, preferencias), `offlineStore` (cola de sincronizacion). |
| **ADR-0010-navegacion-expo-router.md** | Navegacion con Expo Router 6 file-based. Estructura: `_layout.tsx` raiz (auth gate), `(tabs)/` con bottom tabs, stacks anidados por tab. Deep linking automatico. |
| **ADR-0011-validacion-zod.md** | Validacion de todos los inputs de la API con Zod 4. Schemas por feature en `schema.ts`. Errores Zod capturados por middleware global y transformados a formato `VALIDATION_ERROR`. |
| **ADR-0012-versionado-api.md** | Versionado de API con prefijo `/api/v1/`. Futuros cambios breaking usaran `/api/v2/` mientras `/api/v1/` sigue funcionando con soporte por tiempo definido. |
| **ADR-0013-logging-pino.md** | Logging con Pino (estructurado JSON, async) + Morgan (middleware HTTP request logging). En desarrollo usa `pino-pretty`, en produccion JSON puro. |
| **ADR-0014-testing-vitest.md** | Testing con Vitest, supertest para integracion HTTP, vitest-mock-prisma para mockear Prisma en tests unitarios. Cobertura minima: 80%. |
| **ADR-0015-soft-delete-audit.md** | Soft delete en todas las entidades (`deletedAt`) mas campos de auditoria (`createdAt`, `updatedAt`, `createdBy`, `updatedBy`). Permite recuperacion de registros y trazabilidad. |

---

### 2. TDD (Technical Design Documents) -- 67 archivos

**Ubicacion:** `docs/tdds/`

| Archivo | Resumen |
|---|---|
| **Template.md** | Plantilla para TDDs con secciones: Contexto de Negocio (PRD), Diseno Tecnico (RFC), Casos de Borde y Errores. |
| **TDD_0001_Clientes.md** | Entidad Cliente: datos personales, domicilio, dia fijo de entrega, franja horaria, contacto telefonico, coordenadas geograficas. |
| **TDD_0002_Items.md** | Entidad ItemPedido: relacion N:M entre Pedido y Producto con cantidad y precioUnitario. |
| **TDD_0003_Pedidos.md** | Entidad Pedido: ciclo de vida completo con estados (pendiente, en_ruta, entregado, cancelado). |
| **TDD_0004_Reparto.md** | Entidad Reparto: hoja de ruta que agrupa pedidos por fecha y repartidor. |
| **TDD_0005_Usuarios.md** | Entidad Usuario: autenticacion con email, password hasheado, rol (ADMIN/REPARTIDOR). |
| **TDD-0007 a TDD-0011** | CRUD de Cliente: crear (0007), obtener (0008), listar (0009), actualizar (0010), eliminar (0011). |
| **TDD-0012 a TDD-0016** | CRUD de Domicilio: crear, obtener, listar, actualizar, eliminar. |
| **TDD-0017 a TDD-0021** | CRUD de Ciudad: crear, obtener, listar, actualizar, eliminar. |
| **TDD-0022, TDD-0023** | Asignar/quitar dia a domicilio. |
| **TDD-0024, TDD-0025** | Asignar/quitar horario a dia. |
| **TDD-0026 a TDD-0030** | CRUD de Producto: crear, obtener, listar, actualizar, eliminar. |
| **TDD-0031 a TDD-0036** | CRUD de Pedido: crear, obtener, listar, actualizar estado, cancelar, eliminar. |
| **TDD-0037 a TDD-0039** | Items de pedido: agregar item, actualizar cantidad, quitar item. |
| **TDD-0040 a TDD-0043** | Visitas: registrar, obtener, listar, marcar como falta. |
| **TDD-0044 a TDD-0048** | CRUD de Empleado: crear, obtener, listar, actualizar, eliminar. |
| **TDD-0049 a TDD-0055** | CRUD de Reparto: crear, obtener, listar, iniciar, finalizar, asignar pedido, eliminar. |
| **TDD-0056 a TDD-0060** | Retenidos: registrar, obtener, listar, actualizar estado, eliminar. |
| **TDD-0061 a TDD-0064** | Reclamos: crear, obtener, listar, eliminar. |

Cada TDD sigue la misma estructura:
- **Contexto de Negocio (PRD)**: Objetivo, User Persona, Criterios de Aceptacion
- **Diseno Tecnico (RFC)**: Modelo de Datos (tabla Prisma), Contrato de API (endpoint, request/response), Estructura del Codigo (capas)
- **Casos de Borde y Errores**: tabla con escenarios, resultados esperados y codigos HTTP

---

### 3. Otros documentos de especificacion -- 2 archivos

| Archivo | Resumen |
|---|---|
| **`docs/especificacion/Modelo-Dominio.md`** | Especificacion completa del modelo de dominio. Define 10 entidades (Producto, Cliente, Domicilio, Ciudad, Dia, Horario, Pedido, ItemPedido, Retenido, Visita, Empleado, Reparto, Reclamo) con sus columnas, tipos, PKs, FKs, restricciones y relaciones. Tambien define 4 enumeraciones (EstadoCliente, EstadoPedido, EstadoRetenido, DiaSemana). |
| **`docs/agent-configuration.md`** | Documento de configuracion de agentes OpenCode. Describe la arquitectura general del monorepo, los 6 agentes definidos (backend, mobile, whatsapp-bot, plan, build, explore), la estructura de carpetas `.opencode/`, el sistema de reglas modulares (`rules/`), los skills reutilizables y el flujo de trabajo diario con comandos de verificacion. |

---

### Resumen cuantitativo

- **Total ADRs:** 16 activos + 1 template = **17 archivos**
- **Total TDDs:** 66 activos + 1 template = **67 archivos**
- **Total otros docs:** **2 archivos** (Modelo de Dominio + agent-configuration)
- **Gran total:** **86 archivos** de documentacion en `C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\`
</task_result>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\types\\index.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\types\index.ts</path>
<type>file</type>
<content>
1: export * from './api';
2: export * from './usuario';
3: export * from './cliente';
4: export * from './item';
5: export * from './pedido';
6: export * from './reparto';

(End of file - total 6 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\stores\\authStore.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\stores\authStore.ts</path>
<type>file</type>
<content>
1: import { create } from 'zustand';
2: import type { Usuario } from '@/types';
3: 
4: interface AuthState {
5:   token: string | null;
6:   usuario: Usuario | null;
7:   isAuthenticated: boolean;
8:   isLoading: boolean;
9:   setAuth: (token: string, usuario: Usuario) => void;
10:   setUser: (usuario: Usuario) => void;
11:   setLoading: (loading: boolean) => void;
12:   logout: () => void;
13: }
14: 
15: export const useAuthStore = create<AuthState>((set) => ({
16:   token: null,
17:   usuario: null,
18:   isAuthenticated: false,
19:   isLoading: true,
20:   setAuth: (token, usuario) =>
21:     set({ token, usuario, isAuthenticated: true, isLoading: false }),
22:   setUser: (usuario) => set({ usuario }),
23:   setLoading: (isLoading) => set({ isLoading }),
24:   logout: () =>
25:     set({ token: null, usuario: null, isAuthenticated: false, isLoading: false }),
26: }));

(End of file - total 26 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 6.4s)

_Thinking:_

Let me also check the TDD_0049 to TDD_0055 (Reparto TDDs) to ensure I understand the design decisions, and the backend pedidos schema for the existing validation schemas.

Let me read the relevant TDDs to make sure I respect the design decisions.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\docs\\tdds\\TDD_0049_Reparto_Crear.md"
}
```

**Error:**
```
File not found: C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD_0049_Reparto_Crear.md
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\docs\\tdds\\TDD_0051_Reparto_Iniciar.md"
}
```

**Error:**
```
File not found: C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD_0051_Reparto_Iniciar.md
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\docs\\tdds\\TDD_0052_Reparto_Finalizar.md"
}
```

**Error:**
```
File not found: C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD_0052_Reparto_Finalizar.md
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\schema.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\pedidos\schema.ts</path>
<type>file</type>
<content>
1: import { z } from 'zod';
2: 
3: export const crearPedidoSchema = z.object({
4:   clienteId: z.string().uuid(),
5:   fecha: z.string().optional(),
6:   orden: z.number().int().min(1).optional(),
7:   items: z
8:     .array(
9:       z.object({
10:         itemId: z.string().uuid(),
11:         cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
12:       })
13:     )
14:     .min(1, 'El pedido debe tener al menos un ítem'),
15: });
16: 
17: export const actualizarEstadoSchema = z.object({
18:   estado: z.enum(['EN_RUTA', 'ENTREGADO', 'NO_ENTREGADO', 'CANCELADO']),
19: });
20: 
21: export const agregarItemSchema = z.object({
22:   itemId: z.string().uuid(),
23:   cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
24: });
25: 
26: export const actualizarCantidadSchema = z.object({
27:   cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
28: });
29: 
30: export const cancelarPedidoSchema = z.object({
31:   motivo: z.enum([
32:     'CLIENTE_AUSENTE',
33:     'DIRECCION_INCORRECTA',
34:     'ACCESO_DENEGADO',
35:     'OTRO',
36:   ]),
37: });

(End of file - total 37 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 5.3s)

_Thinking:_

Now I need to find the TDDs. Let me search with a glob pattern.

**Tool: glob**

**Input:**
```json
{
  "pattern": "docs/tdds/**/*.md",
  "path": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle"
}
```

**Output:**
```
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\Template.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD_0005_Usuarios.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD_0004_Reparto.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD_0003_Pedidos.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD_0002_Items.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD_0001_Clientes.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0064-eliminar-reclamo.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0063-listar-reclamos.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0062-obtener-reclamo.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0061-crear-reclamo.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0060-eliminar-retenido.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0059-actualizar-estado-retenido.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0058-listar-retenidos.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0057-obtener-retenido.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0056-registrar-retenido.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0055-eliminar-reparto.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0054-asignar-pedido-reparto.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0053-finalizar-reparto.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0052-iniciar-reparto.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0051-listar-repartos.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0050-obtener-reparto.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0049-crear-reparto.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0048-eliminar-empleado.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0047-actualizar-empleado.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0046-listar-empleados.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0045-obtener-empleado.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0044-crear-empleado.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0043-marcar-visita-falta.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0042-listar-visitas.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0041-obtener-visita.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0040-registrar-visita.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0039-quitar-item-pedido.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0038-actualizar-cantidad-item.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0037-agregar-item-pedido.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0036-eliminar-pedido.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0035-cancelar-pedido.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0034-actualizar-estado-pedido.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0033-listar-pedidos.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0032-obtener-pedido.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0031-crear-pedido.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0030-eliminar-producto.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0029-actualizar-producto.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0028-listar-productos.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0027-obtener-producto.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0026-crear-producto.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0025-quitar-horario-dia.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0024-asignar-horario-dia.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0023-quitar-dia-domicilio.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0022-asignar-dia-domicilio.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0021-eliminar-ciudad.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0020-actualizar-ciudad.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0019-listar-ciudades.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0018-obtener-ciudad.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0017-crear-ciudad.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0016-eliminar-domicilio.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0015-actualizar-domicilio.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0014-listar-domicilios.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0013-obtener-domicilio.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0012-crear-domicilio.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0011-eliminar-cliente.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0010-actualizar-cliente.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0009-listar-clientes.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0008-obtener-cliente.md
C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0007-crear-cliente.md
```

---

## Assistant (Plan · Big Pickle · 5.7s)

_Thinking:_

Let me read the TDDs relevant to reparto and pedidos.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\docs\\tdds\\TDD_0004_Reparto.md"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD_0004_Reparto.md</path>
<type>file</type>
<content>
1: ---
2: autor: Equipo SupplyCycle
3: fecha: 2026-05-22
4: titulo: Reparto
5: ---
6: 
7: # TDD-0004: Reparto
8: 
9: ## Contexto de Negocio (PRD)
10: 
11: ### Objetivo
12: 
13: Definir la entidad Reparto como la agrupación lógica de entregas que un repartidor debe realizar en una jornada. Un reparto organiza los pedidos del día según un recorrido preestablecido y permite calcular el resumen de carga del camión antes de salir a la calle.
14: 
15: ### User Persona
16: 
17: - **Nombre**: Repartidor
18: - **Necesidad**: Iniciar su jornada conociendo qué y cuánto debe cargar en el camión, visualizar el progreso de su ruta (entregas pendientes vs. completadas), y dar por finalizado su recorrido diario una vez visitados todos los domicilios.
19: 
20: ### Criterios de Aceptación
21: 
22: - El sistema debe agrupar los pedidos asignados a un repartidor para una fecha específica bajo una única entidad de Reparto.
23: - El reparto debe reflejar un estado general: `PENDIENTE`, `EN_CURSO` o `COMPLETADO`.
24: - No se puede iniciar un reparto si el repartidor ya tiene otro en estado `EN_CURSO`.
25: - No se puede marcar un reparto como `COMPLETADO` si aún tiene pedidos en estado `PENDIENTE`.
26: - No se puede crear un reparto sin al menos un pedido asociado.
27: - La transición de estados válida es: `PENDIENTE` → `EN_CURSO` → `COMPLETADO`. No se puede retroceder.
28: - Si no existe reparto para el día, el sistema responde con lista vacía sin error.
29: - El sistema debe poder calcular y mostrar el resumen de carga del camión sumando las cantidades de todos los ítems de los pedidos del reparto.
30: - El sistema debe proveer métricas básicas por reparto: total de pedidos, pendientes y completados.
31: 
32: ---
33: 
34: ## Diseño Técnico (RFC)
35: 
36: ### Modelo de Datos (Prisma)
37: 
38: ```prisma
39: model Reparto {
40:   id            String        @id @default(uuid())
41:   repartidorId  String
42:   fecha         DateTime      @db.Date
43:   estado        EstadoReparto @default(PENDIENTE)
44:   horaInicio    String?       // ej: "10:00"
45:   horaFin       String?       // ej: "14:30"
46:   creadoEn      DateTime      @default(now())
47:   actualizadoEn DateTime      @updatedAt
48:   pedidos       Pedido[]
49: 
50:   @@unique([repartidorId, fecha]) // un repartidor no puede tener dos repartos el mismo día
51: }
52: 
53: enum EstadoReparto {
54:   PENDIENTE
55:   EN_CURSO
56:   COMPLETADO
57: }
58: ```
59: 
60: ### Validaciones (Zod)
61: 
62: ```ts
63: const crearRepartoSchema = z.object({
64:   repartidorId: z.string().uuid(),
65:   fecha: z.string().datetime(),
66:   pedidoIds: z.array(z.string().uuid()).min(1, 'El reparto debe tener al menos un pedido'),
67: });
68: 
69: const actualizarEstadoSchema = z.object({
70:   estado: z.enum(['EN_CURSO', 'COMPLETADO']),
71: });
72: ```
73: 
74: ### Contrato de API
75: 
76: #### Obtener repartos de un repartidor
77: 
78: - **Endpoint**: `GET /api/v1/repartos`
79: - **Query params**: `repartidorId` (requerido), `fecha` (opcional, por defecto hoy), `estado` (opcional)
80: - **Response Body**:
81: 
82: ```ts
83: {
84:   data: {
85:     id: string;
86:     fecha: string;
87:     estado: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';
88:     horaInicio?: string;
89:     horaFin?: string;
90:     resumen: {
91:       totalPedidos: number;
92:       completados: number;
93:       pendientes: number;
94:     };
95:   }[];
96: }
97: ```
98: 
99: #### Obtener resumen de carga del camión
100: 
101: - **Endpoint**: `GET /api/v1/repartos/:id/carga`
102: - **Response Body**:
103: 
104: ```ts
105: {
106:   repartoId: string;
107:   items: {
108:     producto: string;
109:     cantidadTotal: number;
110:     unidad: string;
111:   }[];
112: }
113: ```
114: 
115: #### Actualizar estado del reparto
116: 
117: - **Endpoint**: `PATCH /api/v1/repartos/:id/estado`
118: - **Request Body**:
119: 
120: ```ts
121: {
122:   estado: 'EN_CURSO' | 'COMPLETADO';
123: }
124: ```
125: 
126: - **Response Body**:
127: 
128: ```ts
129: {
130:   id: string;
131:   estado: string;
132:   actualizadoEn: string;
133: }
134: ```
135: 
136: ### Tipos TypeScript compartidos (mobile)
137: 
138: ```ts
139: export type EstadoReparto = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';
140: 
141: export interface ResumenCarga {
142:   producto: string;
143:   cantidadTotal: number;
144:   unidad: string;
145: }
146: 
147: export interface Reparto {
148:   id: string;
149:   repartidorId: string;
150:   fecha: string;
151:   estado: EstadoReparto;
152:   horaInicio?: string;
153:   horaFin?: string;
154:   pedidos?: Pedido[];
155:   resumen?: {
156:     totalPedidos: number;
157:     completados: number;
158:     pendientes: number;
159:   };
160: }
161: ```
162: 
163: ### Componentes de Arquitectura (Backend)
164: 
165: - **Domain**: Entidad `Reparto`, enum `EstadoReparto`. Reglas de negocio:
166:   1. No se puede iniciar un reparto si el repartidor ya tiene otro en estado `EN_CURSO`
167:   2. No se puede marcar como `COMPLETADO` si hay pedidos en estado `PENDIENTE`
168:   3. No se puede retroceder en la transición de estados (`COMPLETADO` → `EN_CURSO` inválido)
169:   4. No se puede crear un reparto sin al menos un pedido
170:   5. Un repartidor no puede tener dos repartos para la misma fecha
171: - **Application**: Casos de uso `ListarRepartosPorRepartidor`, `ObtenerResumenCarga`, `ActualizarEstadoReparto`
172: - **Infrastructure**: Controlador `repartos.controller.ts`, servicio `repartos.service.ts`, rutas `repartos.routes.ts`, schema Zod `repartos.schemas.ts`
173: 
174: ---
175: 
176: ## Casos de Borde y Errores
177: 
178: | Escenario | Resultado Esperado | Código HTTP |
179: |---|---|---|
180: | Reparto inexistente | Error "Reparto no encontrado" | 404 Not Found |
181: | Iniciar reparto teniendo otro activo | Error "Ya existe un reparto en curso para hoy" | 409 Conflict |
182: | Completar reparto con pedidos pendientes | Error "Existen entregas sin procesar en la ruta" | 400 Bad Request |
183: | `repartidorId` ausente al listar | Error de validación | 400 Bad Request |
184: | Retroceder estado (ej: `COMPLETADO` → `EN_CURSO`) | Error "Transición de estado inválida" | 400 Bad Request |
185: | Crear reparto sin pedidos | Error "El reparto debe tener al menos un pedido" | 400 Bad Request |
186: | Dos repartos para el mismo repartidor el mismo día | Error "Ya existe un reparto para esa fecha" | 409 Conflict |
187: | No hay repartos para el día | Lista vacía sin error | 200 OK |
188: 
189: ---
190: 
191: ## Plan de Implementación
192: 
193: 1. Definir el modelo `Reparto` en `prisma/schema.prisma` y actualizar la relación en `Pedido`
194: 2. Agregar constraint `@@unique([repartidorId, fecha])` en el modelo
195: 3. Ejecutar migración con `npx prisma migrate dev`
196: 4. Definir tipos TypeScript en el mobile (`types/reparto.ts`)
197: 5. Implementar schema de validación Zod en `repartos.schemas.ts`
198: 6. Implementar lógica de agrupación de carga en `repartos.service.ts`
199: 7. Implementar controlador en `repartos.controller.ts`
200: 8. Registrar rutas en `repartos.routes.ts`
201: 9. Asegurar que el seed asigne correctamente los pedidos del TDD-0003 a un reparto válido

(End of file - total 201 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\docs\\tdds\\TDD-0052-iniciar-reparto.md"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0052-iniciar-reparto.md</path>
<type>file</type>
<content>
1: ---
2: autor: Equipo SupplyCycle
3: fecha: 2026-05-22
4: titulo: Iniciar Reparto
5: ---
6: 
7: # TDD-0052: Iniciar Reparto
8: 
9: ## Contexto de Negocio (PRD)
10: 
11: ### Objetivo
12: Marcar el inicio de un reparto cuando el repartidor comienza la ruta. Los pedidos pasan a `en_ruta`.
13: 
14: ### User Persona
15: - **Nombre**: Repartidor
16: - **Necesidad**: Iniciar el recorrido del día.
17: 
18: ### Criterios de Aceptación
19: - Al iniciar el reparto se setea `inicio` con la fecha/hora actual
20: - Todos los pedidos del reparto pasan a estado `en_ruta`
21: - No se puede iniciar un reparto ya iniciado o finalizado
22: 
23: ### Contrato de API
24: 
25: - **Endpoint**: `POST /api/v1/repartos/:id/iniciar`
26: - **Auth**: JWT (rol REPARTIDOR o ADMIN)
27: - **Response** `200 OK`:
28: ```json
29: { "data": { "id": 1, "inicio": "2026-05-23T09:00:00Z", "pedidosActualizados": 5 } }
30: ```
31: 
32: ## Plan de Implementación
33: 
34: ### Backend
35: 1. Service: verificar reparto no iniciado → `inicio = new Date()` → actualizar todos los pedidos a `en_ruta` con `prisma.pedido.updateMany()`
36: 2. Tests: inicio exitoso, reparto ya iniciado, sin pedidos
37: 
38: ### Mobile
39: 3. Botón "Iniciar reparto" en el detalle
40: 4. Confirmación: "¿Iniciar reparto? Los pedidos pasarán a en_ruta"

(End of file - total 40 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\docs\\tdds\\TDD-0053-finalizar-reparto.md"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0053-finalizar-reparto.md</path>
<type>file</type>
<content>
1: ---
2: autor: Equipo SupplyCycle
3: fecha: 2026-05-22
4: titulo: Finalizar Reparto
5: ---
6: 
7: # TDD-0053: Finalizar Reparto
8: 
9: ## Contexto de Negocio (PRD)
10: 
11: ### Objetivo
12: Marcar la finalización de un reparto. Los pedidos que siguen `en_ruta` sin visita registrada quedan como `pendiente` para un próximo reparto.
13: 
14: ### User Persona
15: - **Nombre**: Repartidor
16: - **Necesidad**: Finalizar la jornada de reparto.
17: 
18: ### Criterios de Aceptación
19: - Se setea `fin` con la fecha/hora actual
20: - Los pedidos en estado `en_ruta` que no fueron visitados vuelven a `pendiente`
21: - No se puede finalizar un reparto no iniciado o ya finalizado
22: 
23: ### Contrato de API
24: 
25: - **Endpoint**: `POST /api/v1/repartos/:id/finalizar`
26: - **Auth**: JWT (rol REPARTIDOR o ADMIN)
27: - **Response** `200 OK`
28: 
29: ## Plan de Implementación
30: 
31: ### Backend
32: 1. Service: verificar reparto iniciado y no finalizado → `fin = new Date()` → `prisma.pedido.updateMany({ where: { repartoId: id, estado: 'en_ruta' }, data: { estado: 'pendiente' } })`
33: 2. Tests
34: 
35: ### Mobile
36: 3. Botón "Finalizar reparto" con confirmación
37: 4. Resumen al finalizar: entregados, pendientes, faltas

(End of file - total 37 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\docs\\tdds\\TDD-0034-actualizar-estado-pedido.md"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\docs\tdds\TDD-0034-actualizar-estado-pedido.md</path>
<type>file</type>
<content>
1: ---
2: autor: Equipo SupplyCycle
3: fecha: 2026-05-22
4: titulo: Actualizar Estado de Pedido
5: ---
6: 
7: # TDD-0034: Actualizar Estado de Pedido
8: 
9: ## Contexto de Negocio (PRD)
10: 
11: ### Objetivo
12: Cambiar el estado de un pedido a lo largo de su ciclo de vida: `pendiente` → `en_ruta` → `entregado`.
13: 
14: ### User Persona
15: - **Nombre**: Administrador / Repartidor
16: - **Necesidad**: Marcar un pedido como entregado después de la visita.
17: 
18: ### Criterios de Aceptación
19: - Solo se puede avanzar al siguiente estado (no retroceder)
20: - `pendiente` → `en_ruta` → `entregado`
21: - No se puede cambiar el estado de un pedido cancelado
22: 
23: ## Diseño Técnico (RFC)
24: 
25: ### Máquina de Estados
26: 
27: ```
28: pendiente ──→ en_ruta ──→ entregado
29:      │                     
30:      └──→ cancelado        
31: ```
32: 
33: ### Contrato de API
34: 
35: - **Endpoint**: `PATCH /api/v1/pedidos/:id/estado`
36: - **Auth**: JWT (rol ADMIN o REPARTIDOR)
37: - **Request Body**: `{ "estado": "entregado" }`
38: - **Response** `200 OK`
39: - **Response** `409 Conflict` si la transición no es válida:
40: ```json
41: {
42:   "error": { "code": "CONFLICT", "message": "No se puede cambiar de 'cancelado' a 'entregado'" }
43: }
44: ```
45: 
46: ## Plan de Implementación
47: 
48: ### Backend
49: 1. Schema Zod con estado válido
50: 2. Service: `updateEstado(id, nuevoEstado)` → obtener estado actual → validar transición permitida → `prisma.pedido.update()`
51: 3. Ruta PATCH con authMiddleware + validación de transiciones
52: 4. Tests: transiciones válidas, inválidas, pedido cancelado
53: 
54: ### Mobile
55: 5. Botones de acción según estado actual (ej: "Marcar entregado")
56: 6. Mutation, invalidar query del pedido y lista

(End of file - total 56 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 6.4s)

_Thinking:_

Now I have a thorough understanding of the entire codebase. Let me also check one more thing - the mobile `app/(tabs)/index.tsx` reference and see if there's a `router.back()` issue in `PedidoDetalleScreen` that I should be aware of.

Let me now also look at what the existing InicioScreen already exports and how `app/(tabs)/index.tsx` already delegates to it.

Now let me also check the `HandleApiError` and `Toast` hook to understand how to use them.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\services\\handleApiError.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\services\handleApiError.ts</path>
<type>file</type>
<content>
1: import type { ApiError } from '@/types';
2: 
3: interface ParsedError {
4:   message: string;
5:   code: string;
6:   status: number;
7:   details?: Record<string, string[]>;
8: }
9: 
10: export function handleApiError(error: unknown): ParsedError {
11:   if (error && typeof error === 'object' && 'response' in error) {
12:     const axiosError = error as {
13:       response?: { status: number; data?: ApiError };
14:     };
15:     if (axiosError.response?.data?.error) {
16:       const apiError = axiosError.response.data.error;
17:       return {
18:         message: apiError.message || 'Error del servidor',
19:         code: apiError.code || 'UNKNOWN_ERROR',
20:         status: axiosError.response.status,
21:         details: apiError.details,
22:       };
23:     }
24:     return {
25:       message: 'Error de conexión con el servidor',
26:       code: 'CONNECTION_ERROR',
27:       status: axiosError.response?.status || 0,
28:     };
29:   }
30: 
31:   if (error instanceof Error) {
32:     if (error.message === 'Network Error') {
33:       return {
34:         message: 'No hay conexión con el servidor',
35:         code: 'NETWORK_ERROR',
36:         status: 0,
37:       };
38:     }
39:     return {
40:       message: error.message,
41:       code: 'UNKNOWN_ERROR',
42:       status: 0,
43:     };
44:   }
45: 
46:   return {
47:     message: 'Error inesperado',
48:     code: 'UNKNOWN_ERROR',
49:     status: 0,
50:   };
51: }

(End of file - total 51 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\hooks\\useToast.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\hooks\useToast.ts</path>
<type>file</type>
<content>
1: import { useToastStore, type ToastType } from '@/stores/toastStore';
2: 
3: export function useToast() {
4:   const show = useToastStore((state) => state.show);
5: 
6:   return {
7:     showToast: (message: string, type: ToastType = 'info', duration?: number) => {
8:       show(message, type, duration);
9:     },
10:   };
11: }

(End of file - total 11 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\app\\_layout.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\app\_layout.tsx</path>
<type>file</type>
<content>
1: import { useEffect } from 'react';
2: import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
3: import { Stack } from 'expo-router';
4: import { StatusBar } from 'expo-status-bar';
5: import 'react-native-reanimated';
6: import { QueryClientProvider } from '@tanstack/react-query';
7: 
8: import { useColorScheme } from '@/hooks/use-color-scheme';
9: import { useAuthStore } from '@/stores/authStore';
10: import { getToken } from '@/features/auth/services/authStorage';
11: import { LoadingSpinner, Toast } from '@/components/ui';
12: import { queryClient } from '@/lib/queryClient';
13: import useOfflineSync from '@/hooks/useOfflineSync';
14: 
15: export const unstable_settings = {
16:   anchor: '(tabs)',
17: };
18: 
19: export default function RootLayout() {
20:   const colorScheme = useColorScheme();
21:   const { isLoading, setAuth, setLoading } = useAuthStore();
22: 
23:   // Inicializar sincronización offline
24:   useOfflineSync();
25: 
26:   // Bootstrap: check if we have a stored token
27:   useEffect(() => {
28:     async function bootstrap() {
29:       try {
30:         const token = await getToken();
31:         if (token) {
32:           try {
33:             const response = await fetch(
34:               `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/auth/me`,
35:               { headers: { Authorization: `Bearer ${token}` } },
36:             );
37:             if (response.ok) {
38:               const usuario = await response.json();
39:               setAuth(token, usuario);
40:               return;
41:             }
42:           } catch {
43:             // Error de red o backend caído -> ir a login
44:           }
45:           // Token inválido, expirado o backend no disponible
46:           setLoading(false);
47:         } else {
48:           setLoading(false);
49:         }
50:       } catch {
51:         setLoading(false);
52:       }
53:     }
54:     bootstrap();
55:   }, [setAuth, setLoading]);
56: 
57:   if (isLoading) {
58:     return (
59:       <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
60:         <LoadingSpinner message="Iniciando sesión..." />
61:       </ThemeProvider>
62:     );
63:   }
64: 
65:   return (
66:     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
67:       <QueryClientProvider client={queryClient}>
68:         <Stack screenOptions={{ headerShown: false }}>
69:           <Stack.Screen name="login" options={{ animation: 'fade' }} />
70:           <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
71:           <Stack.Screen
72:             name="modal"
73:             options={{ presentation: 'modal', title: 'Modal' }}
74:           />
75:         </Stack>
76:         <StatusBar style="auto" />
77:         <Toast />
78:       </QueryClientProvider>
79:     </ThemeProvider>
80:   );
81: }

(End of file - total 81 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 6.4s)

_Thinking:_

Now I have a comprehensive understanding of the codebase. Let me now also check the mobile services index to see what's being exported from there.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\services\\index.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\services\index.ts</path>
<type>file</type>
<content>
1: export { apiClient } from './api';
2: export { handleApiError } from './handleApiError';

(End of file - total 2 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\lib\\queryClient.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\lib\queryClient.ts</path>
<type>file</type>
<content>
1: import { QueryClient } from '@tanstack/react-query';
2: 
3: export const queryClient = new QueryClient({
4:   defaultOptions: {
5:     queries: {
6:       staleTime: 5 * 60 * 1000,
7:       retry: 2,
8:     },
9:   },
10: });

(End of file - total 10 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 38.7s)

_Thinking:_

Now I have a very comprehensive understanding of the entire codebase. Let me now synthesize everything and create a detailed plan.

Let me organize my findings:

## What already exists

### Backend
1. `GET /repartos/hoy` - Returns today's reparto for the authenticated repartidor (with pedidos). This already includes `pedidos` with full details (cliente, items, estados, orden).
2. `PATCH /repartos/:id/estado` - Can change reparto state to `EN_CURSO` or `COMPLETADO`. Sets `horaInicio` when `EN_CURSO`, `horaFin` when `COMPLETADO`.
3. `PATCH /pedidos/:id/estado` - Can change pedido state with body `{ estado: 'EN_RUTA' | 'ENTREGADO' | ... }`. Validates transitions.
4. `PATCH /pedidos/:id/confirmar` - Can set pedido to `ENTREGADO` (from PENDIENTE/EN_RUTA).
5. `PATCH /pedidos/:id/cancelar` - Can set pedido to `NO_ENTREGADO` with motivo.
6. The existing `actualizarEstado` for repartos already validates:
   - Can't go COMPLETADO -> anything
   - Can't set EN_CURSO if already EN_CURSO
   - Can't complete if there are PENDIENTE pedidos
   - Sets horaInicio when starting, horaFin when completing

### Mobile
1. `InicioScreen.tsx` - Already exists in `features/repartos/screens/` but is very basic (just shows next delivery and progress bar, has no flow for PENDIENTE/EN_CURSO states).
2. `app/(tabs)/index.tsx` - Already delegates to InicioScreen for REPARTIDOR, redirects ADMIN to /pedidos.
3. `useReparto.ts` - Hook for getting today's reparto.
4. `usePedidos.ts` - Hooks for pedido operations (confirmar, cancelar, etc.)
5. `PedidoDetalleScreen.tsx` - Full pedido detail with ConfirmarAccionButtons and CancelModal.
6. `ConfirmarAccionButtons` and `CancelModal` components - ready to reuse.
7. `useToast()` - For showing toast messages.
8. `handleApiError()` - For error handling.
9. `repartoService.ts` - Already has `updateRepartoEstadoRequest(id, estado)`.
10. `pedidoService.ts` - Already has `confirmarEntregaRequest(id)` and `cancelarPedidoRequest(id, motivo)`.

## What needs to be done

### Backend changes

1. **Add `PATCH /pedidos/:id/iniciar-entrega` endpoint** - Set PENDIENTE → EN_RUTA
   - Actually, looking at the routes, we already have `PATCH /pedidos/:id/estado` which accepts `{ estado: 'EN_RUTA' }`. So this already exists! The mobile can use this endpoint.
   - But wait, looking at the schema: `actualizarEstadoSchema` in pedidos schema allows `EN_RUTA`, `ENTREGADO`, `NO_ENTREGADO`, `CANCELADO`. So yes, it already supports `EN_RUTA`.
   - Looking at the routes: `PATCH /pedidos/:id/estado` is available to ADMIN and REPARTIDOR, and uses `actualizarEstadoController` which calls `pedidosService.actualizarEstado`.
   - The `actualizarEstado` function in pedidos service already validates transitions and allows PENDIENTE → EN_RUTA.
   - So we DON'T need a new backend endpoint for iniciar-entrega. Just use the existing one.

2. **Auto-complete reparto** - When all pedidos are processed, auto-set the reparto to COMPLETADO.
   - However, this should happen in the backend. The existing `actualizarEstado` for pedidos (confirmar entrega or cancelar) doesn't auto-complete the reparto.
   - I need to add logic that after changing a pedido's status, checks if all pedidos in the reparto are in a final state (ENTREGADO, NO_ENTREGADO, CANCELADO), and if so, auto-completes the reparto.
   - This should be in the pedidos service, since it's triggered by pedido status changes.

3. **Add endpoint to iniciar entrega for convenience** - Actually, we can also add a dedicated `PATCH /pedidos/:id/iniciar-entrega` endpoint that sets PENDIENTE → EN_RUTA, following the pattern of `confirmar` and `cancelar`. But since `PATCH /pedidos/:id/estado` already works, maybe it's cleaner to use what exists. The user's spec says "Iniciar entrega" should set `EstadoPedido.EN_RUTA`. The existing `PATCH /pedidos/:id/estado` with `{ estado: 'EN_RUTA' }` does exactly this.

Let me think about what backend changes are actually needed:

1. **Auto-complete reparto**: In the pedidos service, after `confirmarEntrega`, `cancelarPedidoRepartidor`, and `actualizarEstado`, check if the pedido's reparto has all pedidos in final states (ENTREGADO, NO_ENTREGADO, CANCELADO), and if so, auto-complete the reparto.

2. **Maybe add a dedicated `iniciarEntrega` endpoint** for the mobile convenience. But since `PATCH /pedidos/:id/estado` exists and works, it's unnecessary. The mobile can just call this endpoint.

### Mobile changes

1. **Rewrite `InicioScreen.tsx`** - Complete overhaul to support the three cases:
   - **No reparto** → empty state message "No hay repartos asignados para hoy"
   - **Reparto PENDIENTE** → summary + "Iniciar reparto" button
   - **Reparto EN_CURSO** → next delivery + upcoming deliveries + action buttons
   
2. **Add hooks for new operations**:
   - `useIniciarReparto()` - mutation to start the reparto (update reparto estado to EN_CURSO)
   - `useIniciarEntrega()` - mutation to set pedido to EN_RUTA (via `PATCH /pedidos/:id/estado`)
   - These could go in `useReparto.ts` or in a new hooks file

3. **Reuse existing components**:
   - `ConfirmarAccionButtons` - for the confirmar/cancelar actions on the next delivery
   - `CancelModal` - for selecting motivo when canceling
   - `InfoCliente` - for client info display (already exists)
   - `EstadoBadge` - for estado display
   - `PedidoDetalleScreen` - for the detail screen (navigate to it)
   - `useConfirmarEntrega()` and `useCancelarPedido()` - already exist

Let me now think about the exact structure:

### Archivos a crear/modificar:

#### Backend:
1. **`backend/src/features/pedidos/service.ts`** - MODIFY: Add auto-complete logic after `confirmarEntrega`, `cancelarPedidoRepartidor`, and `actualizarEstado`.

#### Mobile:
1. **`mobile/features/repartos/hooks/useReparto.ts`** - MODIFY: Add `useIniciarReparto()` mutation
2. **`mobile/features/repartos/hooks/useIniciarEntrega.ts`** - CREATE: Hook for `useIniciarEntrega()` mutation (set pedido to EN_RUTA)
3. **`mobile/features/repartos/services/repartoService.ts`** - MODIFY: Add `iniciarEntregaRequest()` if needed, or just use existing pedidoService
4. **`mobile/features/repartos/screens/InicioScreen.tsx`** - REWRITE: Complete overhaul

Wait, let me reconsider. The existing `InicioScreen` is already quite involved. Let me think about what new components are needed vs modifying the existing one.

The existing `InicioScreen` has:
- `ProximaEntregaCard` - Shows next delivery with items, call/maps buttons
- `BarraProgreso` - Progress bar
- Main `InicioScreen` - Shows progress + next delivery

But the new requirements are significantly different:
- Case 1: No reparto → empty state
- Case 2: Reparto PENDIENTE → summary + "Iniciar reparto" button (NO show progress, NO next delivery)
- Case 3: Reparto EN_CURSO → next delivery + upcoming deliveries + actions

Let me restructure:

The `InicioScreen` needs to be completely rewritten to handle the 3 cases. The existing components (`ProximaEntregaCard`, `BarraProgreso`) can be reused/extracted.

For the "iniciar entrega" action (set pedido to EN_RUTA), I can either:
1. Create a new dedicated endpoint (like a convenience endpoint), OR
2. Use the existing `PATCH /pedidos/:id/estado` with `{ estado: 'EN_RUTA' }`

I think option 2 is cleaner - reuse what exists. The mobile can call `updateEstadoPedidoRequest(id, 'EN_RUTA')`.

But wait, looking at the pedido service, `actualizarEstadoRequest` doesn't exist as a function in `pedidoService.ts`. Only:
- `confirmarEntregaRequest(id)` → PATCH /pedidos/:id/confirmar
- `cancelarPedidoRequest(id, motivo)` → PATCH /pedidos/:id/cancelar

There's no `actualizarEstadoRequest` for using `PATCH /pedidos/:id/estado`. I should add one, or I can just use `PATCH /pedidos/:id/estado` directly.

Actually, looking at the routes, the `PATCH /pedidos/:id/estado` endpoint accepts `{ estado: 'EN_RUTA' | 'ENTREGADO' | 'NO_ENTREGADO' | 'CANCELADO' }`. So I need to add a service function for this in the mobile.

Let me plan the mobile additions:

1. **Add `actualizarEstadoPedidoRequest` to `pedidoService.ts`** - A function to call `PATCH /pedidos/:id/estado`
2. **Add `useIniciarEntrega` to pedidos hooks** - A mutation that calls `actualizarEstadoPedidoRequest(id, 'EN_RUTA')`
3. **Rewrite `InicioScreen.tsx`** - Complete overhaul

Now, for the auto-complete reparto on the backend, I need to be careful. The user said:
> Implementar esta lógica en backend. No hacerlo desde frontend.

So after a pedido status change (confirmar, cancelar, actualizarEstado), I need to:
1. Check if the pedido belongs to a reparto
2. Check if ALL pedidos in that reparto are in final states (ENTREGADO, NO_ENTREGADO, CANCELADO)
3. If yes, auto-complete the reparto (set estado to COMPLETADO, set horaFin)

I should add this logic in three places in `pedidos/service.ts`:
- `confirmarEntrega`
- `cancelarPedidoRepartidor`
- `actualizarEstado`

Or better, extract a helper function `checkAndCompleteReparto(pedidoId)`.

Let me also check: the `actualizarEstado` in pedidos service is used for general state changes. The `confirmarEntrega` and `cancelarPedidoRepartidor` are dedicated endpoints for the repartidor flow. The auto-complete should trigger after any of these.

Let me also verify: does the `actualizarEstado` in pedidos service also handle `EN_RUTA`? Yes, it does. The `TRANSICIONES` map says `PENDIENTE: ['EN_RUTA', 'NO_ENTREGADO', 'CANCELADO']`, so PENDIENTE → EN_RUTA is valid.

Now, let me think about the actual implementation detail for the InicioScreen:

### InicioScreen structure:

```
InicioScreen
├── Loading state: LoadingSpinner
├── Error state: ErrorMessage with retry
├── Case 1: No reparto → EmptyState
├── Case 2: Reparto PENDIENTE → RepartoPendienteView
│   ├── Resumen del reparto (fecha, hora, # pedidos)
│   └── Botón "Iniciar reparto"
└── Case 3: Reparto EN_CURSO → RepartoEnCursoView
    ├── BarraProgreso
    ├── ProximaEntrega section
    │   ├── Card con: cliente, domicilio, teléfono, horario, estado
    │   ├── Acciones: Iniciar entrega (if PENDIENTE), Confirmar/Cancelar (if EN_RUTA)
    │   └── Link "Ver detalle"
    └── ProximasEntregas section
        └── Lista compacta de entregas restantes
```

Components I need:

1. **EmptyState** - Simple view with message "No hay repartos asignados para hoy"
2. **RepartoPendienteCard** - Shows summary + "Iniciar reparto" button
3. **ProximaEntregaCard** - Enhanced version of existing one with action buttons
4. **ProximasEntregasList** - Compact list of upcoming deliveries
5. **BarraProgreso** - Already exists

Actions needed:
1. **Iniciar reparto** → mutation to update reparto estado (PENDIENTE → EN_CURSO)
2. **Iniciar entrega** → mutation to update pedido estado (PENDIENTE → EN_RUTA)
3. **Confirmar entrega** → reuse existing `useConfirmarEntrega()`
4. **Cancelar entrega** → reuse existing `useCancelarPedido()` + `CancelModal`

For the "Ver detalle" action: navigate to `/pedidos/{id}` which already shows the full PedidoDetalleScreen.

Now let me think about the hooks:

1. `useIniciarReparto()` - in `useReparto.ts` - mutation to call `PATCH /repartos/:id/estado { estado: 'EN_CURSO' }`
2. `useIniciarEntrega()` - new hook in `usePedidos.ts` or `useReparto.ts` - mutation to call `PATCH /pedidos/:id/estado { estado: 'EN_RUTA' }`

Actually, for the `useIniciarEntrega`, I can just add it to `usePedidos.ts` alongside the other pedido mutations. But semantically it's a reparto operation... The user requirement says "No duplicar lógica de pedidos". So I'll add it to `usePedidos.ts` since it's a pedido state change.

Let me now look at what I need for `useIniciarEntrega`:
- It needs to call `PATCH /pedidos/:id/estado` with `{ estado: 'EN_RUTA' }`
- On success, invalidate the reparto and pedidos queries
- Show a toast

I also need to add the API function `actualizarEstadoPedidoRequest` to `pedidoService.ts`.

Wait, actually I realize there's already the concept of setting EN_RUTA via `PATCH /pedidos/:id/estado`. Let me look at if there's a more elegant way.

Actually, I can create a service function `iniciarEntregaRequest(id)` in `pedidoService.ts` that calls `PATCH /pedidos/:id/estado` with `{ estado: 'EN_RUTA' }`. Then create a `useIniciarEntrega()` hook that uses this mutation.

But actually, looking at the existing pattern, there are already specialized endpoints:
- `confirmarController` → `PATCH /pedidos/:id/confirmar`
- `cancelarRepartidorController` → `PATCH /pedidos/:id/cancelar`
- `actualizarEstadoController` → `PATCH /pedidos/:id/estado`

The `confirmar` and `cancelar` are specialized for the repartidor flow, while `actualizarEstado` is more generic. I could either:
1. Use `actualizarEstadoController` with `{ estado: 'EN_RUTA' }` - already exists, no backend changes needed
2. Add a new dedicated `iniciarEntregaController` → `PATCH /pedidos/:id/iniciar-entrega` - cleaner but more code

I'll go with option 1 since it's simpler and doesn't require backend changes for the endpoint itself. Just need to add the mobile service and hook.

Now let me create the comprehensive plan.

Actually, I realize I need to also think about the backend auto-complete reparto more carefully. Let me look at the flow:

When a pedido is confirmed (ENTREGADO) or cancelled (NO_ENTREGADO):
1. The service changes the pedido's estado
2. Then it should check if the pedido's reparto is now fully completed
3. If so, update the reparto to COMPLETADO with horaFin

This logic should be in the pedidos service, not the repartos service, since it's triggered by pedido status changes.

Let me also think about edge cases:
- What if the pedido has no reparto? Then skip the auto-complete check.
- What if the pedido's reparto is already COMPLETADO? Skip.
- What if all pedidos in the reparto are in final states? Complete it.

For the "completados" check, the previous logic counts completados as `pedidos.filter(p => p.estado !== 'PENDIENTE')`. But EN_RUTA is also not PENDIENTE, and it shouldn't count as completed. Let me look at the existing formatReparto function:

```typescript
const completados = reparto.pedidos.filter(
  (p) => p.estado !== 'PENDIENTE'
).length;
```

Hmm, this counts EN_RUTA as completados too. That seems like a bug in the existing code, but I won't fix it per the requirements ("No modificar lógica existente de repartos").

For the auto-complete, I need to check if ALL pedidos are in terminal states: ENTREGADO, NO_ENTREGADO, or CANCELADO. If any pedido is PENDIENTE or EN_RUTA, the reparto should not be auto-completed.

Let me now finalize my plan.

Actually, wait. Reading the requirement more carefully:

> # Finalización automática del reparto
> Cuando todos los pedidos del reparto estén:
> - ENTREGADOS
> - NO_ENTREGADOS
> - CANCELADOS
> 
> Entonces:
> - cambiar reparto → `COMPLETADO`
> - guardar `horaFin`
> 
> Implementar esta lógica en backend.
> No hacerlo desde frontend.

So the auto-complete should happen when ALL pedidos are in final states. The final states are ENTREGADO, NO_ENTREGADO, CANCELADO.

But what about PENDIENTE → CANCELADO? The pedido schema allows PENDIENTE → CANCELADO via the actualizarEstado endpoint. But the repartidor can only do PENDIENTE → EN_RUTA, EN_RUTA → ENTREGADO/NO_ENTREGADO via the repartidor-specific endpoints. The PENDIENTE → CANCELADO is for admin use.

Let me verify: in the routes, `PATCH /pedidos/:id/confirmar` (repartidor only) does PENDIENTE/EN_RUTA → ENTREGADO, and `PATCH /pedidos/:id/cancelar` (repartidor only) does PENDIENTE/EN_RUTA → NO_ENTREGADO. The `PATCH /pedidos/:id/estado` is for both ADMIN and REPARTIDOR, and can set any valid transition.

So the auto-complete should trigger after:
1. `confirmarEntrega` - PENDIENTE/EN_RUTA → ENTREGADO
2. `cancelarPedidoRepartidor` - PENDIENTE/EN_RUTA → NO_ENTREGADO
3. `actualizarEstado` - any valid transition (but this endpoint is used by both admin and repartidor)

Since the auto-complete only applies when the pedido belongs to a reparto (has `repartoId`), I should also skip if there's no reparto.

Now, let me think about the "iniciar entrega" flow more. Looking at the user's requirement:

> ## Botón iniciar entrega
> Cuando se presiona:
> `Iniciar entrega`
> hacer:
> `EstadoPedido.EN_RUTA`
> Actualizar:
> - backend
> - UI
> - estadísticas
> - listado
> Mostrar toast de éxito.

So the "Iniciar entrega" button changes the pedido from PENDIENTE to EN_RUTA. This is the first step before the repartidor can confirm or cancel the delivery.

And the "completar entrega" button reuses the existing ConfirmarAccionButtons + CancelModal from the pedido detail screen.

Now let me think about the layout. The "próxima entrega" is the first pending pedido (PENDIENTE or EN_RUTA) by orden. It becomes the next delivery:

- If the next pedido is PENDIENTE → show "Iniciar entrega" button
- If the next pedido is EN_RUTA → show "Confirmar entrega" / "Cancelar entrega" buttons

After the current delivery is completed (ENTREGADO or NO_ENTREGADO), the next pending pedido becomes the new next delivery. The screen should refresh automatically (TanStack Query does this via refetch/invalidation).

OK, let me now create the final comprehensive plan.

### Summary of Changes

#### Backend Changes:

1. **`backend/src/features/pedidos/service.ts`**
   - Add helper function `autoCompletarReparto(pedidoId)` that:
     - Gets the pedido's reparto
     - If reparto exists, checks if all pedidos are in final states
     - If yes, updates reparto to COMPLETADO with horaFin
   - Call `autoCompletarReparto` after:
     - `confirmarEntrega()` 
     - `cancelarPedidoRepartidor()`
     - `actualizarEstado()`

#### Mobile Changes:

1. **`mobile/features/pedidos/services/pedidoService.ts`**
   - Add `iniciarEntregaRequest(id)` function → calls `PATCH /pedidos/:id/estado { estado: 'EN_RUTA' }`

2. **`mobile/features/pedidos/hooks/usePedidos.ts`**
   - Add `useIniciarEntrega()` mutation → wraps `iniciarEntregaRequest`, invalidates reparto and pedidos queries

3. **`mobile/features/repartos/hooks/useReparto.ts`**
   - Add `useIniciarReparto()` mutation → wraps `updateRepartoEstadoRequest(id, 'EN_CURSO')`, invalidates reparto query

4. **`mobile/features/repartos/screens/InicioScreen.tsx`** (REWRITE)
   - Complete rewrite with 3-case flow:
     - Loading state
     - Error state
     - No reparto (empty)
     - Reparto PENDIENTE (summary + iniciar)
     - Reparto EN_CURSO (progress + next delivery + upcoming)

Let me now present this plan to the user.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Explorar estructura del backend (prisma schema, rutas, controladores, servicios)",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Explorar estructura del mobile (features, hooks, servicios, tipos, navegación)",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Analizar archivos clave existentes (InicioScreen, useReparto, repartoService, etc.)",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Analizar lógica existente de pedidos y repartos (backend y mobile)",
      "status": "completed"
    },
    {
      "priority": "medium",
      "content": "Revisar ADR y TDD documentación",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Elaborar plan detallado de implementación",
      "status": "in_progress"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Explorar estructura del backend (prisma schema, rutas, controladores, servicios)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Explorar estructura del mobile (features, hooks, servicios, tipos, navegación)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Analizar archivos clave existentes (InicioScreen, useReparto, repartoService, etc.)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Analizar lógica existente de pedidos y repartos (backend y mobile)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Revisar ADR y TDD documentación",
    "status": "completed",
    "priority": "medium"
  },
  {
    "content": "Elaborar plan detallado de implementación",
    "status": "in_progress",
    "priority": "high"
  }
]
```

---

## Assistant (Plan · Big Pickle · 27.1s)

_Thinking:_

I now have all the information needed to create a comprehensive plan. Let me present it clearly.

He completado el análisis exhaustivo del código. A continuación presento el plan detallado.

---

# Plan de Implementación — Pantalla Inicio (REPARTIDOR)

## Resumen del Análisis

Tras revisar toda la base de código existente, confirmo que:

- **Backend** ya tiene todos los endpoints necesarios: `GET /repartos/hoy`, `PATCH /repartos/:id/estado`, `PATCH /pedidos/:id/estado`, `PATCH /pedidos/:id/confirmar`, `PATCH /pedidos/:id/cancelar`
- **Mobile** ya tiene `InicioScreen.tsx` (básico), hooks `useReparto`, `useConfirmarEntrega`, `useCancelarPedido`, y componentes `ConfirmarAccionButtons`, `CancelModal`, `PedidoDetalleScreen`, etc.
- **Auto-complete** de reparto NO está implementado — el backend actual permite completar reparto manualmente pero no lo hace automáticamente cuando todos los pedidos están procesados.

---

## Archivos a MODIFICAR (4 archivos)

### 🔧 Backend — 1 archivo

#### 1. `backend/src/features/pedidos/service.ts`

**Qué hacer:** Agregar función `autoCompletarRepartoSiCorresponde(pedidoId)` que se invoque después de cada cambio de estado que pueda finalizar un pedido.

**Detalle:**
- Crear helper `async function autoCompletarRepartoSiCorresponde(pedidoId: string): Promise<void>`:
  1. Obtener el pedido con su `repartoId`
  2. Si no tiene `repartoId` → return (no aplica)
  3. Obtener todos los pedidos del reparto con `prisma.reparto.findUnique({ include: { pedidos: { select: { estado: true } } } })`
  4. Si algún pedido está `PENDIENTE` o `EN_RUTA` → return (aún quedan pendientes)
  5. Si todos están `ENTREGADO | NO_ENTREGADO | CANCELADO` → hacer `prisma.reparto.update({ where: { id }, data: { estado: 'COMPLETADO', horaFin } })`
- Llamar al helper al final de:
  - `confirmarEntrega()`
  - `cancelarPedidoRepartidor()`
  - `actualizarEstado()` (solo si el nuevo estado es terminal: ENTREGADO, NO_ENTREGADO, CANCELADO)

---

### 📱 Mobile — 3 archivos

#### 2. `mobile/features/pedidos/services/pedidoService.ts`

**Qué hacer:** Agregar función `iniciarEntregaRequest(id)` que reutiliza el endpoint `PATCH /pedidos/:id/estado` con `{ estado: 'EN_RUTA' }`.

```typescript
export async function iniciarEntregaRequest(
  id: string
): Promise<{ id: string; estado: 'EN_RUTA'; actualizadoEn: string }> {
  const response = await apiClient.patch<{
    id: string;
    estado: 'EN_RUTA';
    actualizadoEn: string;
  }>(`/pedidos/${id}/estado`, { estado: 'EN_RUTA' });
  return response.data;
}
```

#### 3. `mobile/features/pedidos/hooks/usePedidos.ts`

**Qué hacer:** Agregar hook `useIniciarEntrega()` que:
- Usa `useMutation` con `iniciarEntregaRequest`
- En `onSuccess`: invalida queries `['pedidos']` y `['reparto']`
- Sigue el mismo patrón que `useConfirmarEntrega` y `useCancelarPedido`

#### 4. `mobile/features/repartos/hooks/useReparto.ts`

**Qué hacer:** Agregar hook `useIniciarReparto()` que:
- Usa `useMutation` llamando `updateRepartoEstadoRequest(id, 'EN_CURSO')`
- En `onSuccess`: invalida query `['reparto', 'hoy']`
- Usa el servicio existente `updateRepartoEstadoRequest`

#### 5. `mobile/features/repartos/screens/InicioScreen.tsx` (REWRITE)

Este es el cambio principal. El archivo se reescribe completamente para manejar los 3 casos del flujo.

**Estructura propuesta:**

```
InicioScreen (export default function)
├── Obtener: useReparto(), useIniciarReparto(), useIniciarEntrega(), useConfirmarEntrega(), useCancelarPedido(), useToast()
├── Estados globales: showCancelModal (para CancelModal), etc.
│
├── CASO isLoading → <LoadingSpinner message="Cargando reparto..." />
│
├── CASO isError → <ErrorMessage message={...} onRetry={refetch} />
│
├── CASO !reparto → <EmptyState message="No hay repartos asignados para hoy" />
│
├── CASO reparto.estado === 'PENDIENTE' →
│   └── <RepartoPendiente>
│       ├── Header "SupplyCycle"
│       ├── Card con resumen: "Reparto del día", fecha, cantidad de pedidos
│       └── Button "Iniciar reparto" (llama useIniciarReparto)
│
└── CASO reparto.estado === 'EN_CURSO' →
    └── <RepartoEnCurso>
        ├── Header "SupplyCycle"
        ├── <BarraProgreso completados={n} total={n} />
        ├── <ProximaEntregaSection> (ver detalle abajo)
        └── <ProximasEntregasSection> (ver detalle abajo)
```

**Componentes internos (dentro del mismo archivo, máximo 250 líneas):**

| Componente | Props | Descripción |
|---|---|---|
| `EmptyState` | `message: string` | Texto centrado "No hay repartos asignados para hoy" |
| `RepartoPendiente` | `reparto, onIniciar, loading` | Card con resumen + botón "Iniciar reparto" |
| `ProximaEntrega` | `pedido, onIniciarEntrega, onConfirmar, onCancelar, onVerDetalle, loadingStates` | Card grande con datos del cliente + acciones |
| `ProximasEntregas` | `pedidos: Pedido[]` | Lista compacta de próximas entregas |

**Lógica de próxima entrega:**
- Filtrar pedidos activos: `PENDIENTE` o `EN_RUTA` (excluir ENTREGADO, NO_ENTREGADO, CANCELADO)
- Ordenar por `orden` ascendente
- Primer elemento = próxima entrega
- Resto = próximas entregas

**Acciones según estado de la próxima entrega:**

| Estado del pedido | Botones a mostrar |
|---|---|
| `PENDIENTE` | "Iniciar entrega" (EN_RUTA), "Ver detalle" |
| `EN_RUTA` | Reutilizar `<ConfirmarAccionButtons>` (confirmar/cancelar), "Ver detalle" |

**Para el botón "Ver detalle":** navegar a `router.push(\`/pedidos/${pedido.id}\`)` — esto reutiliza `PedidoDetalleScreen` existente.

**Integración del modal de cancelación:**
- Reutilizar `<CancelModal>` de `features/pedidos/components/CancelModal`
- Reutilizar `useCancelarPedido()` para la lógica de cancelación

**Refresco automático:**
- `useReparto()` ya tiene `staleTime: 5min`
- Al completar una acción (iniciar reparto, iniciar entrega, confirmar, cancelar), las mutaciones invalidarán `['reparto', 'hoy']` causando refetch automático

---

## Diagrama de flujo de la pantalla

```
┌─────────────────────────────────┐
│       InicioScreen              │
├─────────────────────────────────┤
│                                 │
│  useReparto() → {data, loading} │
│                                 │
├─────────────────────────────────┤
│                                 │
│  loading? → <LoadingSpinner>    │
│                                 │
│  error? → <ErrorMessage retry>  │
│                                 │
│  !data? → <EmptyState>          │
│     "No hay repartos            │
│      asignados para hoy"        │
│                                 │
│  estado=PENDIENTE? →            │
│   ┌───────────────────────┐     │
│   │ Resumen del reparto   │     │
│   │ 📦 6 pedidos          │     │
│   │ [Iniciar reparto]     │     │
│   └───────────────────────┘     │
│                                 │
│  estado=EN_CURSO? →             │
│   ┌───────────────────────┐     │
│   │ ████████░░ 3/6         │     │
│   │ Próxima entrega        │     │
│   │ ┌─────────────────┐   │     │
│   │ │ Cliente: Juan   │   │     │
│   │ │ Dirección: ...  │   │     │
│   │ │ Tel: 11-...     │   │     │
│   │ │ Horario: 10-12  │   │     │
│   │ │ [Iniciar entrega]│   │     │
│   │ │ [Ver detalle]    │   │     │
│   │ └─────────────────┘   │     │
│   │                        │     │
│   │ Próximas entregas       │     │
│   │ ┌─────────────────┐   │     │
│   │ │ María - Calle...│   │     │
│   │ │ Pedro - Av....  │   │     │
│   │ └─────────────────┘   │     │
│   └───────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

---

## Tabla de riesgos

| Riesgo | Mitigación |
|---|---|
| El auto-complete del reparto podría ejecutar horaFin incluso si hay pedidos EN_RUTA | Validar explícitamente que todos los estados sean terminales (ENTREGADO, NO_ENTREGADO, CANCELADO) |
| La invalidación de queries podría causar parpadeo en UI | TanStack Query ya maneja esto; staleTime mantiene la UI fluida |
| Conflictos si admin completa un pedido mientras repartidor está en la pantalla Inicio | El auto-complete solo cambia reparto, no los pedidos; la UI se refresca con la invalidación |
| `ProximaEntrega` podría exceder 250 líneas | Extraer subcomponentes: `ClienteInfo`, `ActionButtons`, `ProximasEntregasList` |

---

## Pregunta para vos

Antes de proceder a implementar, quiero confirmar una decisión de diseño:

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "question": "Para la acción \"Iniciar entrega\" (PENDIENTE → EN_RUTA), hay dos opciones:\n\n1. **Crear un endpoint dedicado** `PATCH /pedidos/:id/iniciar-entrega` (más explícito, sigue el patrón de `/confirmar` y `/cancelar`)\n\n2. **Reutilizar el endpoint existente** `PATCH /pedidos/:id/estado` con body `{ estado: 'EN_RUTA' }` (menos cambios, ya existe y funciona)\n\n¿Cuál preferís?",
      "header": "Endpoint iniciar entrega",
      "options": [
        {
          "label": "Opción 2 (Recommended)",
          "description": "Reutilizar PATCH /pedidos/:id/estado existente. Solo necesita agregar mobile service + hook. Sin cambios en backend."
        },
        {
          "label": "Opción 1",
          "description": "Crear endpoint dedicado PATCH /pedidos/:id/iniciar-entrega. Más explícito pero requiere cambios en controller, service, routes y schema del backend."
        }
      ]
    }
  ]
}
```

**Output:**
```
User has answered your questions: "Para la acción "Iniciar entrega" (PENDIENTE → EN_RUTA), hay dos opciones:

1. **Crear un endpoint dedicado** `PATCH /pedidos/:id/iniciar-entrega` (más explícito, sigue el patrón de `/confirmar` y `/cancelar`)

2. **Reutilizar el endpoint existente** `PATCH /pedidos/:id/estado` con body `{ estado: 'EN_RUTA' }` (menos cambios, ya existe y funciona)

¿Cuál preferís?"="Opción 2 (Recommended)". You can now continue with the user's answers in mind.
```

---

## Assistant (Plan · Big Pickle · 18.2s)

_Thinking:_

Good, the user chose option 2 - reusing the existing `PATCH /pedidos/:id/estado` endpoint. This confirms my plan. Now let me finalize the todo list and present the complete plan.

Let me update the todo list to reflect the final plan.

Perfecto. Usaremos la opción 2 — el endpoint `PATCH /pedidos/:id/estado` ya existente.

---

## Plan final de implementación

### Resumen de cambios

| # | Archivo | Acción |
|---|---|---|
| 1 | `backend/src/features/pedidos/service.ts` | **Modificar**: agregar `autoCompletarRepartoSiCorresponde()` |
| 2 | `mobile/features/pedidos/services/pedidoService.ts` | **Modificar**: agregar `iniciarEntregaRequest()` |
| 3 | `mobile/features/pedidos/hooks/usePedidos.ts` | **Modificar**: agregar `useIniciarEntrega()` |
| 4 | `mobile/features/repartos/hooks/useReparto.ts` | **Modificar**: agregar `useIniciarReparto()` |
| 5 | `mobile/features/repartos/screens/InicioScreen.tsx` | **Reescribir**: implementar flujo completo |

### No se crean archivos nuevos — todo dentro de la estructura existente.

---

### 🔧 1. Backend — Auto-complete reparto

**Archivo:** `backend/src/features/pedidos/service.ts`

**Cambio:** Agregar función helper y llamarla en 3 puntos:

```typescript
// Nueva función helper
async function autoCompletarRepartoSiCorresponde(pedidoId: string): Promise<void> {
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    select: { repartoId: true },
  });

  if (!pedido?.repartoId) return; // no pertenece a un reparto

  const reparto = await prisma.reparto.findUnique({
    where: { id: pedido.repartoId },
    include: { pedidos: { select: { estado: true } } },
  });

  if (!reparto || reparto.estado === 'COMPLETADO') return;

  const estadosFinales = new Set(['ENTREGADO', 'NO_ENTREGADO', 'CANCELADO']);
  const todosFinales = reparto.pedidos.every((p) => estadosFinales.has(p.estado));

  if (todosFinales) {
    const horaFin = new Date().toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    await prisma.reparto.update({
      where: { id: pedido.repartoId },
      data: { estado: 'COMPLETADO', horaFin },
    });
  }
}
```

**Llamar al final de:**
- `confirmarEntrega()` (línea 253, antes del return)
- `cancelarPedidoRepartidor()` (línea 278, antes del return)
- `actualizarEstado()` (línea 398, antes del return, solo si nuevoEstado es terminal)

---

### 📱 2. Mobile — Service `iniciarEntregaRequest`

**Archivo:** `mobile/features/pedidos/services/pedidoService.ts`

**Agregar:**

```typescript
export async function iniciarEntregaRequest(
  id: string
): Promise<{ id: string; estado: 'EN_RUTA'; actualizadoEn: string }> {
  const response = await apiClient.patch<
    { id: string; estado: 'EN_RUTA'; actualizadoEn: string }
  >(`/pedidos/${id}/estado`, { estado: 'EN_RUTA' });
  return response.data;
}
```

---

### 📱 3. Mobile — Hook `useIniciarEntrega`

**Archivo:** `mobile/features/pedidos/hooks/usePedidos.ts`

**Agregar** después del bloque de `useCancelarPedido`:

```typescript
export function useIniciarEntrega() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pedidoId: string) => iniciarEntregaRequest(pedidoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['reparto'] });
    },
  });
}
```

**Nota:** Sin soporte offline para esta operación (siguiendo el criterio de que solo confirmar/cancelar tienen soporte offline en el código existente).

---

### 📱 4. Mobile — Hook `useIniciarReparto`

**Archivo:** `mobile/features/repartos/hooks/useReparto.ts`

**Agregar:**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRepartoEstadoRequest } from '@/features/repartos/services/repartoService';

export function useIniciarReparto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repartoId: string) =>
      updateRepartoEstadoRequest(repartoId, 'EN_CURSO'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reparto', 'hoy'] });
    },
  });
}
```

---

### 📱 5. Mobile — `InicioScreen.tsx` (reescritura completa)

**Archivo:** `mobile/features/repartos/screens/InicioScreen.tsx`

**Componentes a implementar (todos en el mismo archivo, <250 líneas cada uno):**

| Componente | Líneas estimadas | Descripción |
|---|---|---|
| `EmptyState` | ~30 | Texto "No hay repartos asignados para hoy" |
| `RepartoPendienteView` | ~60 | Resumen + botón "Iniciar reparto" |
| `ProximaEntregaCard` | ~120 | Cliente, domicilio, teléfono, horario, items, acciones |
| `ProximasEntregasList` | ~80 | Lista compacta de entregas restantes |
| `InicioScreen` (principal) | ~100 | Orquestador con useReparto + estados |

**Flujo del componente principal:**

```typescript
export default function InicioScreen() {
  // Hooks
  const { data: reparto, isLoading, isError, error, refetch } = useReparto();
  const iniciarReparto = useIniciarReparto();
  const iniciarEntrega = useIniciarEntrega();
  const confirmarEntrega = useConfirmarEntrega();
  const cancelarPedido = useCancelarPedido();
  const { showToast } = useToast();

  // Estado local
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pedidoACancelar, setPedidoACancelar] = useState<string | null>(null);

  // Handlers
  const handleIniciarReparto = () => { ... }
  const handleIniciarEntrega = (pedidoId) => { ... }
  const handleConfirmarEntrega = (pedidoId) => { ... }
  const handleCancelarEntrega = (pedidoId) => { ... }

  // Renderizado condicional según estado
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;
  if (!reparto) return <EmptyState />;
  if (reparto.estado === 'PENDIENTE') return <RepartoPendienteView />;
  if (reparto.estado === 'EN_CURSO') return <RepartoEnCursoView />;
}
```

**Lógica de "próxima entrega":**
```typescript
const pedidosActivos = (reparto.pedidos ?? [])
  .filter((p) => p.estado === 'PENDIENTE' || p.estado === 'EN_RUTA')
  .sort((a, b) => a.orden - b.orden);

const proximaEntrega = pedidosActivos[0];
const proximasEntregas = pedidosActivos.slice(1);
```

**Acciones condicionales para `ProximaEntregaCard`:**
- Si `pedido.estado === 'PENDIENTE'`: botón "Iniciar entrega" + botón "Ver detalle"
- Si `pedido.estado === 'EN_RUTA'`: reutilizar `<ConfirmarAccionButtons>` + botón "Ver detalle"
- Si no hay próxima entrega: mostrar "¡Todas las entregas están completadas!"

**Navegación a detalle:**
```typescript
import { router } from 'expo-router';
// En el handler:
router.push(`/pedidos/${pedido.id}`);
```

**CancelModal:** reutilizar directamente:
```typescript
import CancelModal from '@/features/pedidos/components/CancelModal';
```

---

### Consideraciones adicionales

- **No duplicar lógica:** los modales, componentes de pedido y hooks de confirmación/cancelación se importan de `features/pedidos/`
- **Toasts:** usar `useToast()` para feedback visual
- **Errores:** usar `handleApiError()` para transformar errores HTTP
- **Header:** todas las vistas incluyen `<Header />` con título "SupplyCycle"
- **Límite 250 líneas:** si algún componente supera el límite, se extrae a un archivo separado dentro de `features/repartos/components/`

---

### Verificación post-implementación

1. `npm run build` en backend — sin errores TypeScript
2. `npx tsc --noEmit` en mobile — sin errores TypeScript
3. Prueba de flujo completo:
   - Login como repartidor → Inicio muestra reparto PENDIENTE
   - Click "Iniciar reparto" → cambia a EN_CURSO, muestra próxima entrega
   - "Iniciar entrega" → pedido pasa a EN_RUTA, botones cambian a confirmar/cancelar
   - "Confirmar entrega" → pedido ENTREGADO, próxima entrega se actualiza
   - Último pedido → reparto se completa automáticamente

---

**¿Estás de acuerdo con este plan?** Si confirmás, procedo a implementar archivo por archivo.

---

## User

implementa la parte del backend del plan

---

## Assistant (Backend · Big Pickle · 9.2s)

_Thinking:_

The user wants me to implement the backend part of the plan. Let me start with the auto-complete reparto logic in the pedidos service.

Let me re-read the current backend pedidos service to understand exactly where to add the code.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Explorar estructura del backend (prisma schema, rutas, controladores, servicios)",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Explorar estructura del mobile (features, hooks, servicios, tipos, navegación)",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Analizar archivos clave existentes (InicioScreen, useReparto, repartoService, etc.)",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Analizar lógica existente de pedidos y repartos (backend y mobile)",
      "status": "completed"
    },
    {
      "priority": "medium",
      "content": "Revisar ADR y TDD documentación",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Elaborar plan detallado de implementación",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Backend: agregar autoCompletarRepartoSiCorresponde() en pedidos/service.ts",
      "status": "in_progress"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Explorar estructura del backend (prisma schema, rutas, controladores, servicios)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Explorar estructura del mobile (features, hooks, servicios, tipos, navegación)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Analizar archivos clave existentes (InicioScreen, useReparto, repartoService, etc.)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Analizar lógica existente de pedidos y repartos (backend y mobile)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Revisar ADR y TDD documentación",
    "status": "completed",
    "priority": "medium"
  },
  {
    "content": "Elaborar plan detallado de implementación",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Backend: agregar autoCompletarRepartoSiCorresponde() en pedidos/service.ts",
    "status": "in_progress",
    "priority": "high"
  }
]
```

---

## Assistant (Backend · Big Pickle · 12.8s)

_Thinking:_

Let me re-read the backend pedidos service to know exactly where to add the auto-complete logic. I already read it earlier. Let me trace through the three functions I need to modify:

1. `confirmarEntrega()` - line 232-253
2. `cancelarPedidoRepartidor()` - line 255-278
3. `actualizarEstado()` - line 379-398

I need to add a helper function and call it at the end of each.

The functions look like this currently:

### confirmarEntrega (line 232-253):
```typescript
export async function confirmarEntrega(id: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });
  if (!pedido) { throw ApiError.notFound('Pedido no encontrado'); }
  if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
    throw ApiError.conflict('El pedido no puede ser entregado desde su estado actual');
  }
  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'ENTREGADO' },
  });
  return {
    id: updated.id,
    estado: 'ENTREGADO' as const,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}
```

### cancelarPedidoRepartidor (line 255-278):
```typescript
export async function cancelarPedidoRepartidor(id: string, motivo: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });
  if (!pedido) { throw ApiError.notFound('Pedido no encontrado'); }
  if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
    throw ApiError.conflict('El pedido no puede marcarse como no entregado desde su estado actual');
  }
  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'NO_ENTREGADO', motivoFalla: motivo },
  });
  return {
    id: updated.id,
    estado: 'NO_ENTREGADO' as const,
    motivoFalla: updated.motivoFalla!,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}
```

### actualizarEstado (line 379-398):
```typescript
export async function actualizarEstado(id: string, nuevoEstado: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });
  if (!pedido) { throw ApiError.notFound('Pedido no encontrado'); }
  validarTransicion(pedido.estado, nuevoEstado);
  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: nuevoEstado as EstadoPedido },
  });
  return {
    id: updated.id,
    estado: updated.estado,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}
```

Now I need to add:
1. A helper function `autoCompletarRepartoSiCorresponde(pedidoId)`
2. Call it after each successful update in all three functions

But I need to be careful: the helper function is async and I don't want to block the return. However, the requirement says "Implementar esta lógica en backend" which suggests it should be synchronous (the caller waits for it). Let me make it sequential - await the auto-complete, then return. This is the safest approach.

Actually, looking at it more carefully, I should also consider: what if the auto-complete fails (e.g., DB error) while the pedido update succeeded? In that case, the pedido was updated but reparto wasn't completed. That's actually fine - the user would see the correct pedido state and the next time any pedido in that reparto is updated, it would try again. So making it sequential is fine.

Let me implement it now.

For the `actualizarEstado` function, I should only call the auto-complete when the new state is a terminal state (ENTREGADO, NO_ENTREGADO, CANCELADO), since those are the states that could trigger reparto completion. If it's EN_RUTA, there are still active pedidos.

Wait, but what about PENDIENTE → CANCELADO via actualizarEstado? The admin could cancel a pedido that's in a reparto. In that case, the reparto should also be auto-completed if all pedidos are now in terminal states. So I should call autoCompletarRepartoSiCorresponde for CANCELADO too.

Let me add the logic: if nuevoEstado is 'ENTREGADO', 'NO_ENTREGADO', or 'CANCELADO', call autoCompletarRepartoSiCorresponde.

Actually, I think it's simpler to always call it after any state change in these three functions. The helper already checks if the pedido belongs to a reparto and if the reparto should be completed. The overhead is minimal (one extra query).

Let me implement it now.

Now I'll implement the backend changes. Let me read the file first to ensure I have the exact content for precise editing.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\service.ts",
  "offset": 227,
  "limit": 175
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\pedidos\service.ts</path>
<type>file</type>
<content>
227: // =============================================================================
228: // MUTACIONES — Repartidor
229: // =============================================================================
230: 
231: /** PATCH /pedidos/:id/confirmar — PENDIENTE/EN_RUTA → ENTREGADO */
232: export async function confirmarEntrega(id: string) {
233:   const pedido = await prisma.pedido.findUnique({ where: { id } });
234: 
235:   if (!pedido) {
236:     throw ApiError.notFound('Pedido no encontrado');
237:   }
238: 
239:   if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
240:     throw ApiError.conflict('El pedido no puede ser entregado desde su estado actual');
241:   }
242: 
243:   const updated = await prisma.pedido.update({
244:     where: { id },
245:     data: { estado: 'ENTREGADO' },
246:   });
247: 
248:   return {
249:     id: updated.id,
250:     estado: 'ENTREGADO' as const,
251:     actualizadoEn: updated.actualizadoEn.toISOString(),
252:   };
253: }
254: 
255: /** PATCH /pedidos/:id/cancelar — PENDIENTE/EN_RUTA → NO_ENTREGADO (repartidor) */
256: export async function cancelarPedidoRepartidor(id: string, motivo: string) {
257:   const pedido = await prisma.pedido.findUnique({ where: { id } });
258: 
259:   if (!pedido) {
260:     throw ApiError.notFound('Pedido no encontrado');
261:   }
262: 
263:   if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
264:     throw ApiError.conflict('El pedido no puede marcarse como no entregado desde su estado actual');
265:   }
266: 
267:   const updated = await prisma.pedido.update({
268:     where: { id },
269:     data: { estado: 'NO_ENTREGADO', motivoFalla: motivo },
270:   });
271: 
272:   return {
273:     id: updated.id,
274:     estado: 'NO_ENTREGADO' as const,
275:     motivoFalla: updated.motivoFalla!,
276:     actualizadoEn: updated.actualizadoEn.toISOString(),
277:   };
278: }
279: 
280: // =============================================================================
281: // MUTACIONES — Admin
282: // =============================================================================
283: 
284: /** POST /pedidos */
285: export async function crearPedido(data: {
286:   clienteId: string;
287:   fecha?: string;
288:   orden?: number;
289:   items: Array<{ itemId: string; cantidad: number }>;
290: }) {
291:   // Verificar cliente
292:   const cliente = await prisma.cliente.findUnique({ where: { id: data.clienteId } });
293:   if (!cliente) {
294:     throw ApiError.notFound('Cliente no encontrado');
295:   }
296: 
297:   // Verificar items
298:   const itemsValidos: Array<{ id: string; nombre: string; precio: number | null }> = [];
299:   for (const item of data.items) {
300:     const dbItem = await prisma.item.findUnique({ where: { id: item.itemId } });
301:     if (!dbItem) {
302:       throw ApiError.badRequest(`El ítem ${item.itemId} no existe`);
303:     }
304:     if (!dbItem.activo) {
305:       throw ApiError.badRequest(`El ítem "${dbItem.nombre}" no está disponible`);
306:     }
307:     itemsValidos.push({ id: dbItem.id, nombre: dbItem.nombre, precio: dbItem.precio });
308:   }
309: 
310:   // Resolver fecha
311:   const hoy = new Date();
312:   hoy.setHours(0, 0, 0, 0);
313:   const fechaDate = data.fecha ? dateFromISODate(data.fecha) : hoy;
314: 
315:   // Validar que la fecha no sea anterior a hoy
316:   if (fechaDate < hoy) {
317:     throw ApiError.badRequest('La fecha no puede ser anterior a hoy');
318:   }
319: 
320:   // Auto-asignar orden si no se provee
321:   let orden = data.orden;
322:   if (!orden) {
323:     const maxOrden = await prisma.pedido.aggregate({
324:       _max: { orden: true },
325:       where: { fecha: fechaDate },
326:     });
327:     orden = (maxOrden._max.orden ?? 0) + 1;
328:   }
329: 
330:   const pedido = await prisma.pedido.create({
331:     data: {
332:       clienteId: data.clienteId,
333:       fecha: fechaDate,
334:       orden,
335:       items: {
336:         create: data.items.map((i) => {
337:           const itemInfo = itemsValidos.find((iv) => iv.id === i.itemId)!;
338:           return {
339:             itemId: i.itemId,
340:             cantidad: i.cantidad,
341:             precioUnitario: itemInfo.precio,
342:           };
343:         }),
344:       },
345:     },
346:     include: {
347:       cliente: true,
348:       items: { include: { item: true } },
349:     },
350:   });
351: 
352:   return formatPedido(pedido);
353: }
354: 
355: /** DELETE /pedidos/:id — Soft delete (admin) */
356: export async function eliminarPedido(id: string) {
357:   const pedido = await prisma.pedido.findUnique({ where: { id } });
358: 
359:   if (!pedido) {
360:     throw ApiError.notFound('Pedido no encontrado');
361:   }
362: 
363:   if (pedido.estado === 'EN_RUTA' || pedido.estado === 'ENTREGADO') {
364:     throw ApiError.conflict('No se puede eliminar un pedido en reparto');
365:   }
366: 
367:   const updated = await prisma.pedido.update({
368:     where: { id },
369:     data: { deletedAt: new Date() },
370:   });
371: 
372:   return {
373:     id: updated.id,
374:     deletedAt: updated.deletedAt!.toISOString(),
375:   };
376: }
377: 
378: /** PATCH /pedidos/:id/estado — Máquina de estados */
379: export async function actualizarEstado(id: string, nuevoEstado: string) {
380:   const pedido = await prisma.pedido.findUnique({ where: { id } });
381: 
382:   if (!pedido) {
383:     throw ApiError.notFound('Pedido no encontrado');
384:   }
385: 
386:   validarTransicion(pedido.estado, nuevoEstado);
387: 
388:   const updated = await prisma.pedido.update({
389:     where: { id },
390:     data: { estado: nuevoEstado as EstadoPedido },
391:   });
392: 
393:   return {
394:     id: updated.id,
395:     estado: updated.estado,
396:     actualizadoEn: updated.actualizadoEn.toISOString(),
397:   };
398: }
399: 
400: /** POST /pedidos/:id/cancelar — Admin: PENDIENTE → CANCELADO */
401: export async function cancelarPedido(id: string) {

(Showing lines 227-401 of 532. Use offset=402 to continue.)
</content>
```

---

## Assistant (Backend · Big Pickle · 11.3s)

_Thinking:_

Now I have the exact content. Let me make the changes:

1. Add the helper function `autoCompletarRepartoSiCorresponde` right before the "MUTACIONES — Repartidor" section (after line 229)
2. Call it at the end of `confirmarEntrega` (after line 252, before the return)
3. Call it at the end of `cancelarPedidoRepartidor` (after line 276, before the return)
4. Call it at the end of `actualizarEstado` (after line 396, before the return)

Let me be precise about the edits.

For `confirmarEntrega`, I'll add `await autoCompletarRepartoSiCorresponde(id);` before the return.

For `cancelarPedidoRepartidor`, same thing.

For `actualizarEstado`, I'll add it before the return. Since this function handles ALL state transitions (including EN_RUTA), I should only auto-complete if the nuevoEstado is terminal. But actually, `autoCompletarRepartoSiCorresponde` already checks if all pedidos are in terminal states. If the nuevoEstado is EN_RUTA, not all pedidos will be terminal, so the function will be a no-op. So it's safe to always call it. The only overhead is a couple of extra queries.

Wait, but actually... if nuevoEstado is EN_RUTA, we'd be changing a pedido from PENDIENTE to EN_RUTA. The reparto now has one more non-terminal pedido (EN_RUTA instead of PENDIENTE). This definitely won't trigger the auto-complete. So it's safe.

Let me implement it now.

Now I'll implement the three edits to the backend `pedidos/service.ts`. First, add the helper function:

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\service.ts",
  "oldString": "// =============================================================================\n// MUTACIONES — Repartidor\n// =============================================================================\n\n/** PATCH /pedidos/:id/confirmar — PENDIENTE/EN_RUTA → ENTREGADO */",
  "newString": "// =============================================================================\n// AUTO-COMPLETAR REPARTO\n// =============================================================================\n\n/**\n * Si el pedido pertenece a un reparto y todos los pedidos del mismo están en\n * estados terminales (ENTREGADO, NO_ENTREGADO, CANCELADO), se completa\n * automáticamente el reparto con estado COMPLETADO y horaFin.\n */\nasync function autoCompletarRepartoSiCorresponde(pedidoId: string): Promise<void> {\n  const pedido = await prisma.pedido.findUnique({\n    where: { id: pedidoId },\n    select: { repartoId: true },\n  });\n\n  if (!pedido?.repartoId) return;\n\n  const reparto = await prisma.reparto.findUnique({\n    where: { id: pedido.repartoId },\n    include: { pedidos: { select: { estado: true } } },\n  });\n\n  if (!reparto || reparto.estado === 'COMPLETADO') return;\n\n  const estadosFinales = new Set(['ENTREGADO', 'NO_ENTREGADO', 'CANCELADO']);\n  const todosFinales = reparto.pedidos.every((p) => estadosFinales.has(p.estado));\n\n  if (todosFinales) {\n    const horaFin = new Date().toLocaleTimeString('es-AR', {\n      hour: '2-digit',\n      minute: '2-digit',\n      hour12: false,\n    });\n    await prisma.reparto.update({\n      where: { id: pedido.repartoId },\n      data: { estado: 'COMPLETADO', horaFin },\n    });\n  }\n}\n\n// =============================================================================\n// MUTACIONES — Repartidor\n// =============================================================================\n\n/** PATCH /pedidos/:id/confirmar — PENDIENTE/EN_RUTA → ENTREGADO */"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Backend · Big Pickle · 8.2s)

_Thinking:_

Now I need to add the call to `autoCompletarRepartoSiCorresponde` in the three functions:

1. `confirmarEntrega` - after the `prisma.pedido.update` and before the return
2. `cancelarPedidoRepartidor` - same
3. `actualizarEstado` - same

Let me do all three edits.

Now add the call in `confirmarEntrega`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\service.ts",
  "oldString": "  const updated = await prisma.pedido.update({\n    where: { id },\n    data: { estado: 'ENTREGADO' },\n  });\n\n  return {\n    id: updated.id,\n    estado: 'ENTREGADO' as const,\n    actualizadoEn: updated.actualizadoEn.toISOString(),\n  };\n}\n\n/** PATCH /pedidos/:id/cancelar — PENDIENTE/EN_RUTA → NO_ENTREGADO (repartidor) */",
  "newString": "  const updated = await prisma.pedido.update({\n    where: { id },\n    data: { estado: 'ENTREGADO' },\n  });\n\n  await autoCompletarRepartoSiCorresponde(id);\n\n  return {\n    id: updated.id,\n    estado: 'ENTREGADO' as const,\n    actualizadoEn: updated.actualizadoEn.toISOString(),\n  };\n}\n\n/** PATCH /pedidos/:id/cancelar — PENDIENTE/EN_RUTA → NO_ENTREGADO (repartidor) */"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Backend · Big Pickle · 8.1s)

_Thinking:_

Now add the call in `cancelarPedidoRepartidor`:

Now add the call in `cancelarPedidoRepartidor`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\service.ts",
  "oldString": "  const updated = await prisma.pedido.update({\n    where: { id },\n    data: { estado: 'NO_ENTREGADO', motivoFalla: motivo },\n  });\n\n  return {\n    id: updated.id,\n    estado: 'NO_ENTREGADO' as const,\n    motivoFalla: updated.motivoFalla!,\n    actualizadoEn: updated.actualizadoEn.toISOString(),\n  };\n}\n\n// =============================================================================\n// MUTACIONES — Admin\n// =============================================================================",
  "newString": "  const updated = await prisma.pedido.update({\n    where: { id },\n    data: { estado: 'NO_ENTREGADO', motivoFalla: motivo },\n  });\n\n  await autoCompletarRepartoSiCorresponde(id);\n\n  return {\n    id: updated.id,\n    estado: 'NO_ENTREGADO' as const,\n    motivoFalla: updated.motivoFalla!,\n    actualizadoEn: updated.actualizadoEn.toISOString(),\n  };\n}\n\n// =============================================================================\n// MUTACIONES — Admin\n// ============================================================================="
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Backend · Big Pickle · 7.4s)

_Thinking:_

Now add the call in `actualizarEstado`:

Now add the call in `actualizarEstado`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\service.ts",
  "oldString": "  const updated = await prisma.pedido.update({\n    where: { id },\n    data: { estado: nuevoEstado as EstadoPedido },\n  });\n\n  return {\n    id: updated.id,\n    estado: updated.estado,\n    actualizadoEn: updated.actualizadoEn.toISOString(),\n  };\n}\n\n/** POST /pedidos/:id/cancelar — Admin: PENDIENTE → CANCELADO */",
  "newString": "  const updated = await prisma.pedido.update({\n    where: { id },\n    data: { estado: nuevoEstado as EstadoPedido },\n  });\n\n  await autoCompletarRepartoSiCorresponde(id);\n\n  return {\n    id: updated.id,\n    estado: updated.estado,\n    actualizadoEn: updated.actualizadoEn.toISOString(),\n  };\n}\n\n/** POST /pedidos/:id/cancelar — Admin: PENDIENTE → CANCELADO */"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Backend · Big Pickle · 28.6s)

_Thinking:_

Now let me verify the backend compiles correctly.

Let me verify the backend compiles without errors:

**Tool: bash**

**Input:**
```json
{
  "command": "Set-Location -LiteralPath \"C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\"; npm run build 2>&1",
  "description": "Build backend to check TypeScript errors",
  "timeout": 60000
}
```

**Output:**
```

> backend@1.0.0 build
> tsc -p tsconfig.build.json


```

---

## Assistant (Backend · Big Pickle · 6.3s)

_Thinking:_

The build succeeded with no errors. Let me also verify the exact changes by reading the modified file.

Build exitoso sin errores. Verifiquemos las modificaciones:

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\service.ts",
  "offset": 227,
  "limit": 75
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\pedidos\service.ts</path>
<type>file</type>
<content>
227: // =============================================================================
228: // AUTO-COMPLETAR REPARTO
229: // =============================================================================
230: 
231: /**
232:  * Si el pedido pertenece a un reparto y todos los pedidos del mismo están en
233:  * estados terminales (ENTREGADO, NO_ENTREGADO, CANCELADO), se completa
234:  * automáticamente el reparto con estado COMPLETADO y horaFin.
235:  */
236: async function autoCompletarRepartoSiCorresponde(pedidoId: string): Promise<void> {
237:   const pedido = await prisma.pedido.findUnique({
238:     where: { id: pedidoId },
239:     select: { repartoId: true },
240:   });
241: 
242:   if (!pedido?.repartoId) return;
243: 
244:   const reparto = await prisma.reparto.findUnique({
245:     where: { id: pedido.repartoId },
246:     include: { pedidos: { select: { estado: true } } },
247:   });
248: 
249:   if (!reparto || reparto.estado === 'COMPLETADO') return;
250: 
251:   const estadosFinales = new Set(['ENTREGADO', 'NO_ENTREGADO', 'CANCELADO']);
252:   const todosFinales = reparto.pedidos.every((p) => estadosFinales.has(p.estado));
253: 
254:   if (todosFinales) {
255:     const horaFin = new Date().toLocaleTimeString('es-AR', {
256:       hour: '2-digit',
257:       minute: '2-digit',
258:       hour12: false,
259:     });
260:     await prisma.reparto.update({
261:       where: { id: pedido.repartoId },
262:       data: { estado: 'COMPLETADO', horaFin },
263:     });
264:   }
265: }
266: 
267: // =============================================================================
268: // MUTACIONES — Repartidor
269: // =============================================================================
270: 
271: /** PATCH /pedidos/:id/confirmar — PENDIENTE/EN_RUTA → ENTREGADO */
272: export async function confirmarEntrega(id: string) {
273:   const pedido = await prisma.pedido.findUnique({ where: { id } });
274: 
275:   if (!pedido) {
276:     throw ApiError.notFound('Pedido no encontrado');
277:   }
278: 
279:   if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
280:     throw ApiError.conflict('El pedido no puede ser entregado desde su estado actual');
281:   }
282: 
283:   const updated = await prisma.pedido.update({
284:     where: { id },
285:     data: { estado: 'ENTREGADO' },
286:   });
287: 
288:   await autoCompletarRepartoSiCorresponde(id);
289: 
290:   return {
291:     id: updated.id,
292:     estado: 'ENTREGADO' as const,
293:     actualizadoEn: updated.actualizadoEn.toISOString(),
294:   };
295: }
296: 
297: /** PATCH /pedidos/:id/cancelar — PENDIENTE/EN_RUTA → NO_ENTREGADO (repartidor) */
298: export async function cancelarPedidoRepartidor(id: string, motivo: string) {
299:   const pedido = await prisma.pedido.findUnique({ where: { id } });
300: 
301:   if (!pedido) {

(Showing lines 227-301 of 578. Use offset=302 to continue.)
</content>
```

---

## Assistant (Backend · Big Pickle · 7.0s)

_Thinking:_

Let me also verify the other two functions have the call.

**Tool: read**

**Input:**
```json
{
  "offset": 302,
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\service.ts",
  "limit": 60
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\pedidos\service.ts</path>
<type>file</type>
<content>
302:     throw ApiError.notFound('Pedido no encontrado');
303:   }
304: 
305:   if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'EN_RUTA') {
306:     throw ApiError.conflict('El pedido no puede marcarse como no entregado desde su estado actual');
307:   }
308: 
309:   const updated = await prisma.pedido.update({
310:     where: { id },
311:     data: { estado: 'NO_ENTREGADO', motivoFalla: motivo },
312:   });
313: 
314:   await autoCompletarRepartoSiCorresponde(id);
315: 
316:   return {
317:     id: updated.id,
318:     estado: 'NO_ENTREGADO' as const,
319:     motivoFalla: updated.motivoFalla!,
320:     actualizadoEn: updated.actualizadoEn.toISOString(),
321:   };
322: }
323: 
324: // =============================================================================
325: // MUTACIONES — Admin
326: // =============================================================================
327: 
328: /** POST /pedidos */
329: export async function crearPedido(data: {
330:   clienteId: string;
331:   fecha?: string;
332:   orden?: number;
333:   items: Array<{ itemId: string; cantidad: number }>;
334: }) {
335:   // Verificar cliente
336:   const cliente = await prisma.cliente.findUnique({ where: { id: data.clienteId } });
337:   if (!cliente) {
338:     throw ApiError.notFound('Cliente no encontrado');
339:   }
340: 
341:   // Verificar items
342:   const itemsValidos: Array<{ id: string; nombre: string; precio: number | null }> = [];
343:   for (const item of data.items) {
344:     const dbItem = await prisma.item.findUnique({ where: { id: item.itemId } });
345:     if (!dbItem) {
346:       throw ApiError.badRequest(`El ítem ${item.itemId} no existe`);
347:     }
348:     if (!dbItem.activo) {
349:       throw ApiError.badRequest(`El ítem "${dbItem.nombre}" no está disponible`);
350:     }
351:     itemsValidos.push({ id: dbItem.id, nombre: dbItem.nombre, precio: dbItem.precio });
352:   }
353: 
354:   // Resolver fecha
355:   const hoy = new Date();
356:   hoy.setHours(0, 0, 0, 0);
357:   const fechaDate = data.fecha ? dateFromISODate(data.fecha) : hoy;
358: 
359:   // Validar que la fecha no sea anterior a hoy
360:   if (fechaDate < hoy) {
361:     throw ApiError.badRequest('La fecha no puede ser anterior a hoy');

(Showing lines 302-361 of 578. Use offset=362 to continue.)
</content>
```

**Tool: read**

**Input:**
```json
{
  "offset": 420,
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\backend\\src\\features\\pedidos\\service.ts",
  "limit": 30
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\backend\src\features\pedidos\service.ts</path>
<type>file</type>
<content>
420: }
421: 
422: /** PATCH /pedidos/:id/estado — Máquina de estados */
423: export async function actualizarEstado(id: string, nuevoEstado: string) {
424:   const pedido = await prisma.pedido.findUnique({ where: { id } });
425: 
426:   if (!pedido) {
427:     throw ApiError.notFound('Pedido no encontrado');
428:   }
429: 
430:   validarTransicion(pedido.estado, nuevoEstado);
431: 
432:   const updated = await prisma.pedido.update({
433:     where: { id },
434:     data: { estado: nuevoEstado as EstadoPedido },
435:   });
436: 
437:   await autoCompletarRepartoSiCorresponde(id);
438: 
439:   return {
440:     id: updated.id,
441:     estado: updated.estado,
442:     actualizadoEn: updated.actualizadoEn.toISOString(),
443:   };
444: }
445: 
446: /** POST /pedidos/:id/cancelar — Admin: PENDIENTE → CANCELADO */
447: export async function cancelarPedido(id: string) {
448:   const pedido = await prisma.pedido.findUnique({ where: { id } });
449: 

(Showing lines 420-449 of 578. Use offset=450 to continue.)
</content>
```

---

## Assistant (Backend · Big Pickle · 7.7s)

_Thinking:_

All three call sites are correctly added:
1. `confirmarEntrega` (line 288) - ✅
2. `cancelarPedidoRepartidor` (line 314) - ✅
3. `actualizarEstado` (line 437) - ✅

And the helper function is defined at lines 236-265. ✅

The backend build succeeded. Let me update the todo list.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Explorar estructura del backend (prisma schema, rutas, controladores, servicios)",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Explorar estructura del mobile (features, hooks, servicios, tipos, navegación)",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Analizar archivos clave existentes (InicioScreen, useReparto, repartoService, etc.)",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Analizar lógica existente de pedidos y repartos (backend y mobile)",
      "status": "completed"
    },
    {
      "priority": "medium",
      "content": "Revisar ADR y TDD documentación",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Elaborar plan detallado de implementación",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Backend: agregar autoCompletarRepartoSiCorresponde() en pedidos/service.ts",
      "status": "completed"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Explorar estructura del backend (prisma schema, rutas, controladores, servicios)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Explorar estructura del mobile (features, hooks, servicios, tipos, navegación)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Analizar archivos clave existentes (InicioScreen, useReparto, repartoService, etc.)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Analizar lógica existente de pedidos y repartos (backend y mobile)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Revisar ADR y TDD documentación",
    "status": "completed",
    "priority": "medium"
  },
  {
    "content": "Elaborar plan detallado de implementación",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Backend: agregar autoCompletarRepartoSiCorresponde() en pedidos/service.ts",
    "status": "completed",
    "priority": "high"
  }
]
```

---

## Assistant (Backend · Big Pickle · 7.1s)

_Thinking:_

The backend implementation is complete. Let me summarize what was done.

Backend implementado correctamente. Resumen del cambio:

### Modificación: `backend/src/features/pedidos/service.ts`

**Nueva función helper** `autoCompletarRepartoSiCorresponde(pedidoId)`:

1. Obtiene el pedido y verifica si tiene `repartoId` asociado
2. Si no pertenece a ningún reparto → retorna (no-op)
3. Obtiene el reparto con todos sus pedidos
4. Si el reparto ya está `COMPLETADO` → retorna (no-op)
5. Verifica si **todos** los pedidos están en estados terminales (`ENTREGADO`, `NO_ENTREGADO`, `CANCELADO`)
6. Si es así → actualiza el reparto a `COMPLETADO` y registra `horaFin`

**Invocada en 3 puntos:**

| Función | Línea | ¿Cuándo se activa? |
|---|---|---|
| `confirmarEntrega()` | 288 | Repartidor marca pedido como entregado |
| `cancelarPedidoRepartidor()` | 314 | Repartidor marca pedido como no entregado |
| `actualizarEstado()` | 437 | Admin/repartidor cambia estado genéricamente (EN_RUTA, ENTREGADO, NO_ENTREGADO, CANCELADO) |

**Build:** `npm run build` exitoso — sin errores TypeScript.

¿Procedemos con la parte mobile?

---

## User

procede con la parte mobile

---

## Assistant (Mobile · Big Pickle · 7.5s)

_Thinking:_

The user wants me to proceed with the mobile implementation. Let me implement the changes in order:

1. `mobile/features/pedidos/services/pedidoService.ts` - Add `iniciarEntregaRequest()`
2. `mobile/features/pedidos/hooks/usePedidos.ts` - Add `useIniciarEntrega()`
3. `mobile/features/repartos/hooks/useReparto.ts` - Add `useIniciarReparto()`
4. `mobile/features/repartos/screens/InicioScreen.tsx` - Rewrite completely

Let me start by reading the files again to make precise edits.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Mobile: agregar iniciarEntregaRequest() en pedidoService.ts",
      "status": "in_progress"
    },
    {
      "priority": "high",
      "content": "Mobile: agregar useIniciarEntrega() en usePedidos.ts",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "Mobile: agregar useIniciarReparto() en useReparto.ts",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "Mobile: reescribir InicioScreen.tsx con flujo completo",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Mobile: agregar iniciarEntregaRequest() en pedidoService.ts",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Mobile: agregar useIniciarEntrega() en usePedidos.ts",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Mobile: agregar useIniciarReparto() en useReparto.ts",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Mobile: reescribir InicioScreen.tsx con flujo completo",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Mobile · Big Pickle · 7.0s)

_Thinking:_

Let me read the files I need to modify to make precise edits.

Let me leer los archivos exactos que voy a modificar:

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\services\\pedidoService.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\pedidos\services\pedidoService.ts</path>
<type>file</type>
<content>
1: import { apiClient } from '@/services/api';
2: import type { Pedido, EstadoPedido, MotivoCancelacion } from '@/types/pedido';
3: 
4: export async function getPedidosDelDiaRequest(
5:   repartidorId: string
6: ): Promise<Pedido[]> {
7:   const response = await apiClient.get<{ data: Pedido[] }>('/pedidos/hoy', {
8:     params: { repartidorId },
9:   });
10:   return response.data.data;
11: }
12: 
13: export async function getPedidoByIdRequest(id: string): Promise<Pedido> {
14:   const response = await apiClient.get<{ data: Pedido }>(`/pedidos/${id}`);
15:   return response.data.data;
16: }
17: 
18: export async function getPedidosRequest(params?: {
19:   clienteNombre?: string;
20:   fecha?: string;
21:   estado?: EstadoPedido;
22: }): Promise<{ data: Pedido[]; total: number }> {
23:   const response = await apiClient.get<{ data: Pedido[]; total: number }>('/pedidos', {
24:     params,
25:   });
26:   return response.data;
27: }
28: 
29: export async function confirmarEntregaRequest(
30:   id: string
31: ): Promise<{ id: string; estado: 'ENTREGADO'; actualizadoEn: string }> {
32:   const response = await apiClient.patch<{
33:     id: string;
34:     estado: 'ENTREGADO';
35:     actualizadoEn: string;
36:   }>(`/pedidos/${id}/confirmar`);
37:   return response.data;
38: }
39: 
40: export async function crearPedidoRequest(data: {
41:   clienteId: string;
42:   fecha?: string;
43:   items: Array<{ itemId: string; cantidad: number }>;
44: }): Promise<Pedido> {
45:   const response = await apiClient.post<{ data: Pedido }>('/pedidos', data);
46:   return response.data.data;
47: }
48: 
49: export async function cancelarPedidoRequest(
50:   id: string,
51:   motivo: MotivoCancelacion
52: ): Promise<{ id: string; estado: 'NO_ENTREGADO'; motivoFalla: string; actualizadoEn: string }> {
53:   const response = await apiClient.patch<{
54:     id: string;
55:     estado: 'NO_ENTREGADO';
56:     motivoFalla: string;
57:     actualizadoEn: string;
58:   }>(`/pedidos/${id}/cancelar`, { motivo });
59:   return response.data;
60: }
61: 
62: export async function agregarItemRequest(
63:   pedidoId: string,
64:   data: { itemId: string; cantidad: number }
65: ): Promise<Pedido> {
66:   const response = await apiClient.post<Pedido>(`/pedidos/${pedidoId}/items`, data);
67:   return response.data;
68: }
69: 
70: export async function actualizarCantidadItemRequest(
71:   pedidoId: string,
72:   itemId: string,
73:   cantidad: number
74: ): Promise<Pedido> {
75:   const response = await apiClient.patch<Pedido>(
76:     `/pedidos/${pedidoId}/items/${itemId}`,
77:     { cantidad }
78:   );
79:   return response.data;
80: }
81: 
82: export async function quitarItemRequest(
83:   pedidoId: string,
84:   itemId: string
85: ): Promise<Pedido> {
86:   const response = await apiClient.delete<Pedido>(`/pedidos/${pedidoId}/items/${itemId}`);
87:   return response.data;
88: }

(End of file - total 88 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\hooks\\usePedidos.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\pedidos\hooks\usePedidos.ts</path>
<type>file</type>
<content>
1: import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
2: import AsyncStorage from '@react-native-async-storage/async-storage';
3: import { useAuthStore } from '@/stores/authStore';
4: import { useOfflineStore } from '@/stores/offlineStore';
5: import {
6:   getPedidosDelDiaRequest,
7:   getPedidoByIdRequest,
8:   getPedidosRequest,
9:   confirmarEntregaRequest,
10:   cancelarPedidoRequest,
11:   crearPedidoRequest,
12:   agregarItemRequest,
13:   actualizarCantidadItemRequest,
14:   quitarItemRequest,
15: } from '@/features/pedidos/services/pedidoService';
16: 
17: import type { Pedido, EstadoPedido, MotivoCancelacion } from '@/types';
18: 
19: const PEDIDOS_CACHE_KEY = '@supplycycle/pedidos_hoy';
20: 
21: function getRepartidorId(): string {
22:   return useAuthStore.getState().usuario?.id ?? '';
23: }
24: 
25: // Fetch pedidos del día (con caché offline en AsyncStorage)
26: export function usePedidosDelDia() {
27:   return useQuery<Pedido[]>({
28:     queryKey: ['pedidos', 'hoy'],
29:     queryFn: async () => {
30:       try {
31:         const data = await getPedidosDelDiaRequest(getRepartidorId());
32:         // Cachear en AsyncStorage para uso offline
33:         await AsyncStorage.setItem(PEDIDOS_CACHE_KEY, JSON.stringify(data));
34:         return data;
35:       } catch {
36:         // Fallback: cache local si el backend no responde
37:         const cached = await AsyncStorage.getItem(PEDIDOS_CACHE_KEY);
38:         if (cached) {
39:           try {
40:             return JSON.parse(cached) as Pedido[];
41:           } catch {
42:             // Error de parsing del cache — ignorar
43:           }
44:         }
45:         throw new Error('No se pudieron cargar los pedidos');
46:       }
47:     },
48:     staleTime: 5 * 60 * 1000,
49:   });
50: }
51: 
52: // Fetch un pedido por ID
53: export function usePedidoDetalle(id: string) {
54:   return useQuery<Pedido>({
55:     queryKey: ['pedido', id],
56:     queryFn: () => getPedidoByIdRequest(id),
57:     enabled: !!id,
58:   });
59: }
60: 
61: // Buscar pedidos
62: export function useBuscarPedidos(params?: {
63:   clienteNombre?: string;
64:   fecha?: string;
65:   estado?: EstadoPedido;
66: }) {
67:   return useQuery<{ data: Pedido[]; total: number }>({
68:     queryKey: ['pedidos', 'buscar', params],
69:     queryFn: () => getPedidosRequest(params),
70:     staleTime: 5 * 60 * 1000,
71:   });
72: }
73: 
74: // Crear pedido (admin)
75: export function useCrearPedido() {
76:   const queryClient = useQueryClient();
77: 
78:   return useMutation({
79:     mutationFn: (data: {
80:       clienteId: string;
81:       fecha?: string;
82:       items: Array<{ itemId: string; cantidad: number }>;
83:     }) => crearPedidoRequest(data),
84:     onSuccess: () => {
85:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
86:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
87:     },
88:   });
89: }
90: 
91: // Confirmar entrega exitosa (con soporte offline)
92: export function useConfirmarEntrega() {
93:   const queryClient = useQueryClient();
94:   const addToQueue = useOfflineStore((s) => s.addToQueue);
95: 
96:   return useMutation({
97:     mutationFn: async (pedidoId: string) => {
98:       try {
99:         return await confirmarEntregaRequest(pedidoId);
100:       } catch {
101:         // Modo offline: encolar y devolver respuesta optimista
102:         addToQueue({ type: 'CONFIRMAR_ENTREGA', payload: { pedidoId } });
103:         return {
104:           id: pedidoId,
105:           estado: 'ENTREGADO' as const,
106:           actualizadoEn: new Date().toISOString(),
107:         };
108:       }
109:     },
110:     onSuccess: (data) => {
111:       queryClient.setQueryData<Pedido>(['pedido', data.id], (old) => {
112:         if (old) return { ...old, estado: 'ENTREGADO' as const };
113:         return old;
114:       });
115:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
116:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
117:     },
118:   });
119: }
120: 
121: // Cancelar pedido (entrega fallida, con soporte offline)
122: export function useCancelarPedido() {
123:   const queryClient = useQueryClient();
124:   const addToQueue = useOfflineStore((s) => s.addToQueue);
125: 
126:   return useMutation({
127:     mutationFn: async ({
128:       pedidoId,
129:       motivo,
130:     }: {
131:       pedidoId: string;
132:       motivo: MotivoCancelacion;
133:     }) => {
134:       try {
135:         return await cancelarPedidoRequest(pedidoId, motivo);
136:       } catch {
137:         // Modo offline: encolar y devolver respuesta optimista
138:         addToQueue({ type: 'CANCELAR_PEDIDO', payload: { pedidoId, motivo } });
139:         return {
140:           id: pedidoId,
141:           estado: 'NO_ENTREGADO' as const,
142:           motivoFalla: motivo,
143:           actualizadoEn: new Date().toISOString(),
144:         };
145:       }
146:     },
147:     onSuccess: (data) => {
148:       queryClient.setQueryData<Pedido>(['pedido', data.id], (old) => {
149:         if (old)
150:           return { ...old, estado: 'NO_ENTREGADO' as const, motivoFalla: data.motivoFalla };
151:         return old;
152:       });
153:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
154:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
155:     },
156:   });
157: }
158: 
159: // Agregar item a un pedido (con soporte offline)
160: export function useAgregarItem(pedidoId: string) {
161:   const queryClient = useQueryClient();
162:   const addToQueue = useOfflineStore((s) => s.addToQueue);
163: 
164:   return useMutation({
165:     mutationFn: async (data: { itemId: string; cantidad: number }) => {
166:       try {
167:         return await agregarItemRequest(pedidoId, data);
168:       } catch {
169:         addToQueue({ type: 'AGREGAR_ITEM', payload: { pedidoId, ...data } });
170:         return data;
171:       }
172:     },
173:     onSuccess: () => {
174:       // No invalidar ['pedido', pedidoId] para no sobrescribir el cache
175:       // que el screen ya actualizó con setQueryData (guardarCambios)
176:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
177:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
178:     },
179:   });
180: }
181: 
182: // Actualizar cantidad de un item en un pedido (con soporte offline)
183: export function useActualizarCantidadItem(pedidoId: string) {
184:   const queryClient = useQueryClient();
185:   const addToQueue = useOfflineStore((s) => s.addToQueue);
186: 
187:   return useMutation({
188:     mutationFn: async ({
189:       itemId,
190:       cantidad,
191:     }: {
192:       itemId: string;
193:       cantidad: number;
194:     }) => {
195:       try {
196:         return await actualizarCantidadItemRequest(pedidoId, itemId, cantidad);
197:       } catch {
198:         addToQueue({
199:           type: 'ACTUALIZAR_CANTIDAD_ITEM',
200:           payload: { pedidoId, itemId, cantidad },
201:         });
202:         return { itemId, cantidad };
203:       }
204:     },
205:     onSuccess: () => {
206:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
207:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
208:     },
209:   });
210: }
211: 
212: // Quitar item de un pedido (con soporte offline)
213: export function useQuitarItem(pedidoId: string) {
214:   const queryClient = useQueryClient();
215:   const addToQueue = useOfflineStore((s) => s.addToQueue);
216: 
217:   return useMutation({
218:     mutationFn: async (itemId: string) => {
219:       try {
220:         return await quitarItemRequest(pedidoId, itemId);
221:       } catch {
222:         addToQueue({
223:           type: 'QUITAR_ITEM',
224:           payload: { pedidoId, itemId },
225:         });
226:         return { itemId };
227:       }
228:     },
229:     onSuccess: () => {
230:       queryClient.invalidateQueries({ queryKey: ['pedidos'] });
231:       queryClient.invalidateQueries({ queryKey: ['reparto'] });
232:     },
233:   });
234: }

(End of file - total 234 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\repartos\\hooks\\useReparto.ts"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\repartos\hooks\useReparto.ts</path>
<type>file</type>
<content>
1: import { useQuery } from '@tanstack/react-query';
2: import { getRepartoHoyRequest, getRepartoByIdRequest } from '@/features/repartos/services/repartoService';
3: import type { Reparto } from '@/types';
4: 
5: export function useReparto() {
6:   return useQuery<Reparto | null>({
7:     queryKey: ['reparto', 'hoy'],
8:     queryFn: getRepartoHoyRequest,
9:     staleTime: 5 * 60 * 1000,
10:   });
11: }
12: 
13: export function useRepartoDetalle(id: string) {
14:   return useQuery<Reparto>({
15:     queryKey: ['reparto', id],
16:     queryFn: () => getRepartoByIdRequest(id),
17:     enabled: !!id,
18:   });
19: }

(End of file - total 19 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\repartos\\screens\\InicioScreen.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\repartos\screens\InicioScreen.tsx</path>
<type>file</type>
<content>
1: import { StyleSheet, Text, View, Linking, Platform } from 'react-native';
2: import { ThemedView } from '@/components/themed-view';
3: import { Card, Button, LoadingSpinner, ErrorMessage, Header } from '@/components/ui';
4: import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
5: import { useColorScheme } from '@/hooks/use-color-scheme';
6: import { useReparto } from '@/features/repartos/hooks/useReparto';
7: import type { Pedido } from '@/types';
8: 
9: function getEstadoColor(estado: string, theme: typeof Colors.light): string {
10:   switch (estado) {
11:     case 'PENDIENTE':
12:       return theme.pendiente;
13:     case 'EN_RUTA':
14:       return theme.tint;
15:     case 'ENTREGADO':
16:       return theme.entregado;
17:     case 'NO_ENTREGADO':
18:       return theme.noEntregado;
19:     case 'CANCELADO':
20:       return theme.muted;
21:     default:
22:       return theme.text;
23:   }
24: }
25: 
26: function getEstadoLabel(estado: string): string {
27:   switch (estado) {
28:     case 'PENDIENTE':
29:       return 'Pendiente';
30:     case 'EN_RUTA':
31:       return 'En ruta';
32:     case 'ENTREGADO':
33:       return 'Entregado';
34:     case 'NO_ENTREGADO':
35:       return 'No entregado';
36:     case 'CANCELADO':
37:       return 'Cancelado';
38:     default:
39:       return estado;
40:   }
41: }
42: 
43: function ProximaEntregaCard({
44:   pedido,
45:   theme,
46: }: {
47:   pedido: Pedido;
48:   theme: typeof Colors.light;
49: }) {
50:   const handleCall = (phone: string) => {
51:     const url = Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`;
52:     Linking.openURL(url);
53:   };
54: 
55:   const handleOpenMaps = (lat: number, lng: number) => {
56:     const url = Platform.select({
57:       ios: `maps:0,0?q=${lat},${lng}`,
58:       android: `geo:0,0?q=${lat},${lng}`,
59:       default: `https://www.google.com/maps?q=${lat},${lng}`,
60:     });
61:     if (url) Linking.openURL(url);
62:   };
63: 
64:   return (
65:     <Card>
66:       <View style={styles.entregaHeader}>
67:         <View
68:           style={[
69:             styles.estadoBadge,
70:             { backgroundColor: getEstadoColor(pedido.estado, theme) + '20' },
71:           ]}
72:         >
73:           <Text
74:             style={[
75:               styles.estadoText,
76:               { color: getEstadoColor(pedido.estado, theme) },
77:             ]}
78:           >
79:             {getEstadoLabel(pedido.estado)}
80:           </Text>
81:         </View>
82:         <Text style={[styles.ordenText, { color: theme.muted }]}>
83:           #{pedido.orden}
84:         </Text>
85:       </View>
86: 
87:       <Text style={[styles.clienteNombre, { color: theme.text }]}>
88:         {pedido.cliente.nombre} {pedido.cliente.apellido}
89:       </Text>
90: 
91:       <Text style={[styles.direccion, { color: theme.muted }]}>
92:         {pedido.cliente.domicilio.calle} {pedido.cliente.domicilio.numero},{' '}
93:         {pedido.cliente.domicilio.localidad}
94:       </Text>
95: 
96:       <Text style={[styles.horario, { color: theme.info }]}>
97:         {pedido.cliente.horarioDesde} - {pedido.cliente.horarioHasta}
98:       </Text>
99: 
100:       <View style={styles.itemsList}>
101:         {pedido.items.map((item, idx) => (
102:           <Text key={idx} style={[styles.itemText, { color: theme.text }]}>
103:             • {item.cantidad}x {item.item.nombre}
104:           </Text>
105:         ))}
106:       </View>
107: 
108:       <View style={styles.actionButtons}>
109:         <Button
110:           title="Llamar"
111:           variant="secondary"
112:           onPress={() => handleCall(pedido.cliente.telefono)}
113:           style={styles.actionButton}
114:         />
115:         <Button
116:           title="Abrir mapa"
117:           variant="ghost"
118:           onPress={() =>
119:             handleOpenMaps(
120:               pedido.cliente.domicilio.latitud,
121:               pedido.cliente.domicilio.longitud
122:             )
123:           }
124:           style={styles.actionButton}
125:         />
126:       </View>
127:     </Card>
128:   );
129: }
130: 
131: function BarraProgreso({
132:   completados,
133:   total,
134:   theme,
135: }: {
136:   completados: number;
137:   total: number;
138:   theme: typeof Colors.light;
139: }) {
140:   const porcentaje = total > 0 ? (completados / total) * 100 : 0;
141: 
142:   return (
143:     <View style={styles.progressContainer}>
144:       <View style={styles.progressHeader}>
145:         <Text style={[styles.progressLabel, { color: theme.text }]}>
146:           Progreso del día
147:         </Text>
148:         <Text style={[styles.progressCount, { color: theme.muted }]}>
149:           {completados} de {total} entregas
150:         </Text>
151:       </View>
152:       <View style={[styles.progressBar, { backgroundColor: theme.surface }]}>
153:         <View
154:           style={[
155:             styles.progressFill,
156:             {
157:               width: `${Math.min(porcentaje, 100)}%`,
158:               backgroundColor: theme.entregado,
159:             },
160:           ]}
161:         />
162:       </View>
163:     </View>
164:   );
165: }
166: 
167: export default function InicioScreen() {
168:   const colorScheme = useColorScheme() ?? 'light';
169:   const theme = Colors[colorScheme];
170:   const { data: reparto, isLoading, isError, error } = useReparto();
171: 
172:   if (isLoading) {
173:     return <LoadingSpinner message="Cargando reparto..." />;
174:   }
175: 
176:   if (isError) {
177:     return (
178:       <ErrorMessage
179:         message={error?.message || 'Error al cargar el reparto'}
180:         onRetry={() => {}}
181:       />
182:     );
183:   }
184: 
185:   if (!reparto || !reparto.pedidos || reparto.pedidos.length === 0) {
186:     return (
187:       <ThemedView style={styles.container}>
188:         <Header />
189:         <View style={styles.emptyContainer}>
190:           <Text style={[styles.emptyTitle, { color: theme.text }]}>
191:             No hay ningún reparto activo en este momento
192:           </Text>
193:           <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
194:             Tus entregas del día aparecerán aquí cuando tengas un reparto
195:             asignado.
196:           </Text>
197:         </View>
198:       </ThemedView>
199:     );
200:   }
201: 
202:   const pendientes = reparto.pedidos.filter(
203:     (p) => p.estado === 'PENDIENTE' || p.estado === 'EN_RUTA'
204:   );
205:   const completados = reparto.pedidos.filter(
206:     (p) => p.estado === 'ENTREGADO' || p.estado === 'NO_ENTREGADO'
207:   );
208:   const proximaEntrega = pendientes[0];
209: 
210:   return (
211:     <ThemedView style={styles.container}>
212:       <Header />
213:       <View style={styles.content}>
214:         <BarraProgreso
215:           completados={completados.length}
216:           total={reparto.pedidos.length}
217:           theme={theme}
218:         />
219: 
220:         <Text style={[styles.sectionTitle, { color: theme.text }]}>
221:           Próxima entrega
222:         </Text>
223: 
224:         {proximaEntrega ? (
225:           <ProximaEntregaCard pedido={proximaEntrega} theme={theme} />
226:         ) : (
227:           <Card>
228:             <Text style={[styles.noPendingText, { color: theme.success }]}>
229:               ¡Todas las entregas están completadas!
230:             </Text>
231:           </Card>
232:         )}
233:       </View>
234:     </ThemedView>
235:   );
236: }
237: 
238: const styles = StyleSheet.create({
239:   container: {
240:     flex: 1,
241:   },
242:   content: {
243:     flex: 1,
244:     padding: Spacing.lg,
245:   },
246:   sectionTitle: {
247:     fontSize: FontSizes.lg,
248:     fontWeight: 'bold',
249:     marginBottom: Spacing.md,
250:     marginTop: Spacing.lg,
251:   },
252:   entregaHeader: {
253:     flexDirection: 'row',
254:     justifyContent: 'space-between',
255:     alignItems: 'center',
256:     marginBottom: Spacing.sm,
257:   },
258:   estadoBadge: {
259:     paddingHorizontal: Spacing.sm,
260:     paddingVertical: Spacing.xs,
261:     borderRadius: BorderRadius.sm,
262:   },
263:   estadoText: {
264:     fontSize: FontSizes.xs,
265:     fontWeight: '600',
266:   },
267:   ordenText: {
268:     fontSize: FontSizes.xs,
269:   },
270:   clienteNombre: {
271:     fontSize: FontSizes.lg,
272:     fontWeight: 'bold',
273:     marginBottom: Spacing.xs,
274:   },
275:   direccion: {
276:     fontSize: FontSizes.sm,
277:     marginBottom: Spacing.xs,
278:   },
279:   horario: {
280:     fontSize: FontSizes.sm,
281:     fontWeight: '500',
282:     marginBottom: Spacing.md,
283:   },
284:   itemsList: {
285:     marginBottom: Spacing.md,
286:   },
287:   itemText: {
288:     fontSize: FontSizes.sm,
289:     marginBottom: 2,
290:   },
291:   actionButtons: {
292:     flexDirection: 'row',
293:     gap: Spacing.sm,
294:   },
295:   actionButton: {
296:     flex: 1,
297:   },
298:   progressContainer: {
299:     marginBottom: Spacing.md,
300:   },
301:   progressHeader: {
302:     flexDirection: 'row',
303:     justifyContent: 'space-between',
304:     alignItems: 'center',
305:     marginBottom: Spacing.sm,
306:   },
307:   progressLabel: {
308:     fontSize: FontSizes.sm,
309:     fontWeight: '600',
310:   },
311:   progressCount: {
312:     fontSize: FontSizes.sm,
313:   },
314:   progressBar: {
315:     height: 10,
316:     borderRadius: 5,
317:     overflow: 'hidden',
318:   },
319:   progressFill: {
320:     height: '100%',
321:     borderRadius: 5,
322:   },
323:   emptyContainer: {
324:     flex: 1,
325:     justifyContent: 'center',
326:     alignItems: 'center',
327:     padding: Spacing.xl,
328:   },
329:   emptyTitle: {
330:     fontSize: FontSizes.lg,
331:     fontWeight: 'bold',
332:     textAlign: 'center',
333:     marginBottom: Spacing.md,
334:   },
335:   emptySubtitle: {
336:     fontSize: FontSizes.md,
337:     textAlign: 'center',
338:   },
339:   noPendingText: {
340:     fontSize: FontSizes.md,
341:     fontWeight: '600',
342:     textAlign: 'center',
343:   },
344: });

(End of file - total 344 lines)
</content>
```

---

## Assistant (Mobile · Big Pickle · 12.0s)

_Thinking:_

Now I have all the files read. Let me make the changes step by step:

1. First, add `iniciarEntregaRequest` to `pedidoService.ts`
2. Then add `useIniciarEntrega` to `usePedidos.ts`
3. Then add `useIniciarReparto` to `useReparto.ts`
4. Finally, rewrite `InicioScreen.tsx`

Let me do all three small changes first, then the big rewrite.

For the InicioScreen rewrite, I need to think carefully about what it should look like:

The screen needs 3 main states:
1. **No reparto**: "No hay repartos asignados para hoy"
2. **Reparto PENDIENTE**: Summary + "Iniciar reparto" button
3. **Reparto EN_CURSO**: Progress bar + next delivery with actions + upcoming deliveries

For the "EN_CURSO" state, the next delivery's actions depend on its estado:
- If `PENDIENTE` → show "Iniciar entrega" button
- If `EN_RUTA` → show ConfirmarAccionButtons (Confirmar entrega / Cancelar entrega)

Components I need (all in one file, keeping under 250 lines each):
- `EmptyState` - Simple "no hay repartos" view
- `RepartoPendienteView` - Summary card + iniciar reparto button
- `BarraProgreso` - Already exists, reuse
- `ProximaEntregaCard` - Main delivery with actions
- `ProximasEntregasList` - Compact list of upcoming deliveries

For the InicioScreen, I need to be mindful of the 250-line limit per component. The `InicioScreen` function itself with all the handlers and conditional rendering will be around 100 lines. The subcomponents should each be under 250 lines.

Let me plan the styles too. I'll keep them organized.

Let me also check what imports I need:
- `router` from `expo-router` for navigation
- `useState` from `react` for the cancel modal state
- `useReparto`, `useIniciarReparto` from hooks
- `useConfirmarEntrega`, `useCancelarPedido`, `useIniciarEntrega` from pedido hooks
- `ConfirmarAccionButtons`, `CancelModal` from pedido components
- `useToast` for toast feedback
- `handleApiError` for error handling

Let me now implement all four files.

Now I'll implement all 4 mobile files. Let me start with the service and hooks:

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\services\\pedidoService.ts",
  "oldString": "export async function quitarItemRequest(",
  "newString": "export async function iniciarEntregaRequest(\n  id: string\n): Promise<{ id: string; estado: 'EN_RUTA'; actualizadoEn: string }> {\n  const response = await apiClient.patch<{\n    id: string;\n    estado: 'EN_RUTA';\n    actualizadoEn: string;\n  }>(`/pedidos/${id}/estado`, { estado: 'EN_RUTA' });\n  return response.data;\n}\n\nexport async function quitarItemRequest("
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Mobile · Big Pickle · 7.2s)

_Thinking:_

Now add the hook `useIniciarEntrega` to `usePedidos.ts`.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Mobile: agregar iniciarEntregaRequest() en pedidoService.ts",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Mobile: agregar useIniciarEntrega() en usePedidos.ts",
      "status": "in_progress"
    },
    {
      "priority": "high",
      "content": "Mobile: agregar useIniciarReparto() en useReparto.ts",
      "status": "pending"
    },
    {
      "priority": "high",
      "content": "Mobile: reescribir InicioScreen.tsx con flujo completo",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Mobile: agregar iniciarEntregaRequest() en pedidoService.ts",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Mobile: agregar useIniciarEntrega() en usePedidos.ts",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Mobile: agregar useIniciarReparto() en useReparto.ts",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Mobile: reescribir InicioScreen.tsx con flujo completo",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Mobile · Big Pickle · 7.1s)

_Thinking:_

Now add `useIniciarEntrega` hook to `usePedidos.ts`. I need to:
1. Add `iniciarEntregaRequest` to the import
2. Add the `useIniciarEntrega` function after `useCancelarPedido`

Add `useIniciarEntrega` hook to `usePedidos.ts`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\hooks\\usePedidos.ts",
  "oldString": "  cancelarPedidoRequest,\n  crearPedidoRequest,",
  "newString": "  cancelarPedidoRequest,\n  iniciarEntregaRequest,\n  crearPedidoRequest,"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Mobile · Big Pickle · 7.3s)

_Thinking:_

Now add the `useIniciarEntrega` function after `useCancelarPedido`.

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\pedidos\\hooks\\usePedidos.ts",
  "oldString": "// Agregar item a un pedido (con soporte offline)\nexport function useAgregarItem(pedidoId: string) {",
  "newString": "// Iniciar entrega: PENDIENTE → EN_RUTA\nexport function useIniciarEntrega() {\n  const queryClient = useQueryClient();\n\n  return useMutation({\n    mutationFn: (pedidoId: string) => iniciarEntregaRequest(pedidoId),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['pedidos'] });\n      queryClient.invalidateQueries({ queryKey: ['reparto'] });\n    },\n  });\n}\n\n// Agregar item a un pedido (con soporte offline)\nexport function useAgregarItem(pedidoId: string) {"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Mobile · Big Pickle · 9.1s)

_Thinking:_

Now add `useIniciarReparto` to `useReparto.ts`:

Now add `useIniciarReparto` to `useReparto.ts`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\repartos\\hooks\\useReparto.ts",
  "oldString": "import { useQuery } from '@tanstack/react-query';\nimport { getRepartoHoyRequest, getRepartoByIdRequest } from '@/features/repartos/services/repartoService';\nimport type { Reparto } from '@/types';\n\nexport function useReparto() {\n  return useQuery<Reparto | null>({\n    queryKey: ['reparto', 'hoy'],\n    queryFn: getRepartoHoyRequest,\n    staleTime: 5 * 60 * 1000,\n  });\n}\n\nexport function useRepartoDetalle(id: string) {\n  return useQuery<Reparto>({\n    queryKey: ['reparto', id],\n    queryFn: () => getRepartoByIdRequest(id),\n    enabled: !!id,\n  });\n}",
  "newString": "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { getRepartoHoyRequest, getRepartoByIdRequest, updateRepartoEstadoRequest } from '@/features/repartos/services/repartoService';\nimport type { Reparto } from '@/types';\n\nexport function useReparto() {\n  return useQuery<Reparto | null>({\n    queryKey: ['reparto', 'hoy'],\n    queryFn: getRepartoHoyRequest,\n    staleTime: 5 * 60 * 1000,\n  });\n}\n\nexport function useRepartoDetalle(id: string) {\n  return useQuery<Reparto>({\n    queryKey: ['reparto', id],\n    queryFn: () => getRepartoByIdRequest(id),\n    enabled: !!id,\n  });\n}\n\nexport function useIniciarReparto() {\n  const queryClient = useQueryClient();\n\n  return useMutation({\n    mutationFn: (repartoId: string) =>\n      updateRepartoEstadoRequest(repartoId, 'EN_CURSO'),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['reparto', 'hoy'] });\n    },\n  });\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Mobile · Big Pickle · 29.7s)

_Thinking:_

Now let me check TypeScript compiles for the mobile before the big rewrite:

Verifiquemos que los cambios hasta ahora compilan correctamente:

**Tool: bash**

**Input:**
```json
{
  "description": "Check TypeScript in mobile",
  "command": "Set-Location -LiteralPath \"C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\"; npx tsc --noEmit 2>&1",
  "timeout": 120000
}
```

**Output:**
```
features/auth/hooks/__tests__/useLogin.test.ts(49,26): error TS2722: Cannot invoke an object which is possibly 'undefined'.
features/auth/hooks/__tests__/useLogin.test.ts(49,26): error TS18048: 'config.mutationFn' is possibly 'undefined'.
features/auth/hooks/__tests__/useLogin.test.ts(49,33): error TS2554: Expected 2 arguments, but got 1.
features/auth/hooks/__tests__/useLogin.test.ts(57,11): error TS2722: Cannot invoke an object which is possibly 'undefined'.
features/auth/hooks/__tests__/useLogin.test.ts(57,18): error TS2554: Expected 4 arguments, but got 3.
features/auth/screens/__tests__/LoginScreen.test.tsx(76,7): error TS2322: Type '{ response: { data: { error: { message: string; }; }; }; }' is not assignable to type 'null'.
features/mapa/screens/MapaScreen.tsx(11,76): error TS2366: Function lacks ending return statement and return type does not include 'undefined'.
features/mapa/screens/MapaScreen.tsx(22,48): error TS2366: Function lacks ending return statement and return type does not include 'undefined'.
test-setup.ts(10,21): error TS7006: Parameter 'name' implicitly has an 'any' type.
test-setup.ts(11,22): error TS7006: Parameter 'p' implicitly has an 'any' type.
test-setup.ts(14,48): error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
  No index signature with a parameter of type 'string' was found on type '{}'.
test-setup.ts(19,21): error TS7006: Parameter 'n' implicitly has an 'any' type.
test-setup.ts(20,22): error TS7006: Parameter 'p' implicitly has an 'any' type.
test-setup.ts(25,87): error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
  No index signature with a parameter of type 'string' was found on type '{}'.
test-setup.ts(26,18): error TS2339: Property 'disabled' does not exist on type '{}'.
test-setup.ts(27,19): error TS2339: Property 'onPress' does not exist on type '{}'.
test-setup.ts(40,25): error TS7006: Parameter 'p' implicitly has an 'any' type.
test-setup.ts(46,43): error TS7006: Parameter 'item' implicitly has an 'any' type.
test-setup.ts(46,49): error TS7006: Parameter 'index' implicitly has an 'any' type.
test-setup.ts(61,37): error TS7006: Parameter 's' implicitly has an 'any' type.
test-setup.ts(61,74): error TS7006: Parameter 's' implicitly has an 'any' type.
test-setup.ts(61,131): error TS2345: Argument of type '{}[]' is not assignable to parameter of type '[target: object, ...sources: any[]]'.
  Source provides no match for required element at position 0 in target.
test-setup.ts(63,58): error TS7006: Parameter 'o' implicitly has an 'any' type.
test-setup.ts(68,55): error TS7006: Parameter 'cb' implicitly has an 'any' type.
test-setup.ts(69,55): error TS7006: Parameter 'cb' implicitly has an 'any' type.
test-setup.ts(70,24): error TS7006: Parameter 'v' implicitly has an 'any' type.
test-setup.ts(71,42): error TS7006: Parameter 'c' implicitly has an 'any' type.
vitest.config.ts(14,5): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Object literal may only specify known properties, and 'deps' does not exist in type 'ServerOptions$1'.

```

---

## Assistant (Mobile · Big Pickle · 9.2s)

_Thinking:_

All the errors are pre-existing (in test files, test-setup.ts, vitest.config.ts, and MapaScreen.tsx). None are from my changes. The pre-existing errors are in:
- `features/auth/hooks/__tests__/useLogin.test.ts` - test files
- `features/auth/screens/__tests__/LoginScreen.test.tsx` - test files
- `features/mapa/screens/MapaScreen.tsx` - pre-existing issue
- `test-setup.ts` - pre-existing issue
- `vitest.config.ts` - pre-existing issue

My changes didn't introduce any new errors. Now I can proceed with the big rewrite of InicioScreen.tsx.

Let me carefully architect the InicioScreen now. I need to think about:

1. Structure
2. All the imports
3. Subcomponents
4. Main component
5. Styles

Let me write the full file. I'll be careful to:
- Keep each component under 250 lines
- Use proper TypeScript types
- Follow the existing patterns (useColorScheme, theme, etc.)
- Reuse existing components (ConfirmarAccionButtons, CancelModal)
- Use the correct exports

Let me plan the subcomponents:

### EmptyState
Simple centered text.

### RepartoPendienteView
- Shows reparto summary
- "Iniciar reparto" button
- Loading state on button

### ProximaEntregaCard (the big one)
- Shows client info, delivery info
- Conditional actions based on pedido.estado
- If PENDIENTE: "Iniciar entrega", "Llamar", "Abrir mapa", "Ver detalle"
- If EN_RUTA: ConfirmarAccionButtons + "Llamar", "Abrir mapa", "Ver detalle"
- Loading states for buttons

### ProximasEntregasList
- Compact list of upcoming deliveries
- Each shows: client name, address, estado badge, horario
- Tappable to navigate to detail

### RepartoCompletadoView
- "Todas las entregas están completadas" message

Let me now write the InicioScreen.tsx file.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Mobile: agregar iniciarEntregaRequest() en pedidoService.ts",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Mobile: agregar useIniciarEntrega() en usePedidos.ts",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Mobile: agregar useIniciarReparto() en useReparto.ts",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Mobile: reescribir InicioScreen.tsx con flujo completo",
      "status": "in_progress"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Mobile: agregar iniciarEntregaRequest() en pedidoService.ts",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Mobile: agregar useIniciarEntrega() en usePedidos.ts",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Mobile: agregar useIniciarReparto() en useReparto.ts",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Mobile: reescribir InicioScreen.tsx con flujo completo",
    "status": "in_progress",
    "priority": "high"
  }
]
```

---

## Assistant (Mobile · Big Pickle · 36.7s)

_Thinking:_

Now let me write the full InicioScreen.tsx. I'll carefully construct it.

I need to count the lines carefully. The main component with all the subcomponents should stay under 250 lines per component. Let me structure it:

1. EmptyState ~25 lines
2. RepartoPendienteView ~50 lines 
3. ProximaEntregaCard ~130 lines
4. ProximasEntregasList ~70 lines
5. InicioScreen (main) ~110 lines
6. Styles ~150 lines

Total will be around 535 lines but each individual component is under 250 lines.

Let me write it now.

I need to be careful with:
- The `onRetry` prop of ErrorMessage needs a callback - I'll use `refetch`
- The `useCancelarPedido` mutation needs `{ pedidoId, motivo }` as input
- The `useConfirmarEntrega` mutation takes just `pedidoId`
- The `useIniciarEntrega` mutation takes just `pedidoId`
- The `useIniciarReparto` mutation takes `repartoId`
- For `useReparto()`, the query returns `Reparto | null`

Let me double-check the types:
- `Reparto` has `pedidos?: Pedido[]` - it's optional
- `Pedido` has `estado: EstadoPedido`, `cliente: Cliente`, `items: PedidoItem[]`

For the progress bar, I need to count "completados" properly. The user's requirement says: "Próxima entrega debe salir únicamente de: PENDIENTE, EN_RUTA" and "NO mostrar pedidos CANCELADOS, ENTREGADOS, NO_ENTREGADOS". 

For counting completados in the progress bar, I'll count ENTREGADO + NO_ENTREGADO as completados (matching existing TDD).

OK let me write the file now.

Now I'll rewrite the `InicioScreen.tsx` completely with the full flow:

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\repartos\\screens\\InicioScreen.tsx",
  "content": "import { useState, useCallback } from 'react';\nimport { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';\nimport { router } from 'expo-router';\nimport { ThemedView } from '@/components/themed-view';\nimport { Card, Button, LoadingSpinner, ErrorMessage, Header } from '@/components/ui';\nimport { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';\nimport { useColorScheme } from '@/hooks/use-color-scheme';\nimport { useReparto, useIniciarReparto } from '@/features/repartos/hooks/useReparto';\nimport { useConfirmarEntrega, useCancelarPedido, useIniciarEntrega } from '@/features/pedidos/hooks/usePedidos';\nimport ConfirmarAccionButtons from '@/features/pedidos/components/ConfirmarAccionButtons';\nimport CancelModal from '@/features/pedidos/components/CancelModal';\nimport { useToast } from '@/hooks/useToast';\nimport { handleApiError } from '@/services/handleApiError';\nimport type { Pedido, MotivoCancelacion } from '@/types';\n\n// ─── Helpers ──────────────────────────────────────────────────────────────────\n\nfunction getEstadoColor(estado: string, theme: typeof Colors.light): string {\n  switch (estado) {\n    case 'PENDIENTE': return theme.pendiente;\n    case 'EN_RUTA': return theme.tint;\n    case 'ENTREGADO': return theme.entregado;\n    case 'NO_ENTREGADO': return theme.noEntregado;\n    case 'CANCELADO': return theme.muted;\n    default: return theme.text;\n  }\n}\n\nfunction getEstadoLabel(estado: string): string {\n  switch (estado) {\n    case 'PENDIENTE': return 'Pendiente';\n    case 'EN_RUTA': return 'En ruta';\n    case 'ENTREGADO': return 'Entregado';\n    case 'NO_ENTREGADO': return 'No entregado';\n    case 'CANCELADO': return 'Cancelado';\n    default: return estado;\n  }\n}\n\n// ─── EmptyState ───────────────────────────────────────────────────────────────\n\nfunction EmptyState({ theme }: { theme: typeof Colors.light }) {\n  return (\n    <ThemedView style={styles.container}>\n      <Header />\n      <View style={styles.emptyContainer}>\n        <Text style={[styles.emptyTitle, { color: theme.text }]}>\n          No hay repartos asignados para hoy\n        </Text>\n        <Text style={[styles.emptySubtitle, { color: theme.muted }]}>\n          Tus entregas del día aparecerán aquí cuando tengas un reparto asignado.\n        </Text>\n      </View>\n    </ThemedView>\n  );\n}\n\n// ─── BarraProgreso ────────────────────────────────────────────────────────────\n\nfunction BarraProgreso({\n  completados,\n  total,\n  theme,\n}: {\n  completados: number;\n  total: number;\n  theme: typeof Colors.light;\n}) {\n  const porcentaje = total > 0 ? (completados / total) * 100 : 0;\n\n  return (\n    <View style={styles.progressContainer}>\n      <View style={styles.progressHeader}>\n        <Text style={[styles.progressLabel, { color: theme.text }]}>\n          Progreso del día\n        </Text>\n        <Text style={[styles.progressCount, { color: theme.muted }]}>\n          {completados} de {total} entregas\n        </Text>\n      </View>\n      <View style={[styles.progressBar, { backgroundColor: theme.surface }]}>\n        <View\n          style={[\n            styles.progressFill,\n            {\n              width: `${Math.min(porcentaje, 100)}%`,\n              backgroundColor: theme.entregado,\n            },\n          ]}\n        />\n      </View>\n    </View>\n  );\n}\n\n// ─── RepartoPendienteView ─────────────────────────────────────────────────────\n\nfunction RepartoPendienteView({\n  repartoId,\n  totalPedidos,\n  onIniciar,\n  loading,\n  theme,\n}: {\n  repartoId: string;\n  totalPedidos: number;\n  onIniciar: () => void;\n  loading: boolean;\n  theme: typeof Colors.light;\n}) {\n  return (\n    <ThemedView style={styles.container}>\n      <Header />\n      <ScrollView contentContainerStyle={styles.content}>\n        <Card>\n          <Text style={[styles.sectionTitle, { color: theme.text }]}>\n            Reparto del día\n          </Text>\n\n          <View style={styles.resumenRow}>\n            <Text style={[styles.resumenLabel, { color: theme.muted }]}>\n              Estado\n            </Text>\n            <View style={[styles.estadoBadge, { backgroundColor: theme.pendiente + '20' }]}>\n              <Text style={[styles.estadoBadgeText, { color: theme.pendiente }]}>\n                Pendiente\n              </Text>\n            </View>\n          </View>\n\n          <View style={styles.resumenRow}>\n            <Text style={[styles.resumenLabel, { color: theme.muted }]}>\n              Pedidos\n            </Text>\n            <Text style={[styles.resumenValue, { color: theme.text }]}>\n              {totalPedidos} {totalPedidos === 1 ? 'pedido' : 'pedidos'}\n            </Text>\n          </View>\n\n          <View style={styles.resumenDivider} />\n\n          <Text style={[styles.resumenHint, { color: theme.muted }]}>\n            Al iniciar el reparto podrás ver la próxima entrega y comenzar con el recorrido.\n          </Text>\n\n          <Button\n            title=\"Iniciar reparto\"\n            variant=\"primary\"\n            onPress={onIniciar}\n            loading={loading}\n            disabled={loading}\n            style={styles.iniciarButton}\n          />\n        </Card>\n      </ScrollView>\n    </ThemedView>\n  );\n}\n\n// ─── ProximaEntregaCard ───────────────────────────────────────────────────────\n\nfunction ProximaEntregaCard({\n  pedido,\n  onIniciarEntrega,\n  onConfirmar,\n  onCancelar,\n  onVerDetalle,\n  theme,\n  iniciarLoading,\n  confirmarLoading,\n  cancelarLoading,\n}: {\n  pedido: Pedido;\n  onIniciarEntrega: () => void;\n  onConfirmar: () => void;\n  onCancelar: () => void;\n  onVerDetalle: () => void;\n  theme: typeof Colors.light;\n  iniciarLoading: boolean;\n  confirmarLoading: boolean;\n  cancelarLoading: boolean;\n}) {\n  const handleCall = useCallback((phone: string) => {\n    const url = Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`;\n    Linking.openURL(url);\n  }, []);\n\n  const handleOpenMaps = useCallback((lat: number, lng: number) => {\n    const url = Platform.select({\n      ios: `maps:0,0?q=${lat},${lng}`,\n      android: `geo:0,0?q=${lat},${lng}`,\n      default: `https://www.google.com/maps?q=${lat},${lng}`,\n    });\n    if (url) Linking.openURL(url);\n  }, []);\n\n  const estadoColor = getEstadoColor(pedido.estado, theme);\n\n  return (\n    <Card>\n      <View style={styles.entregaHeader}>\n        <View style={[styles.estadoBadge, { backgroundColor: estadoColor + '20' }]}>\n          <Text style={[styles.estadoBadgeText, { color: estadoColor }]}>\n            {getEstadoLabel(pedido.estado)}\n          </Text>\n        </View>\n        <Text style={[styles.ordenText, { color: theme.muted }]}>\n          Pedido #{pedido.orden}\n        </Text>\n      </View>\n\n      <Text style={[styles.clienteNombre, { color: theme.text }]}>\n        {pedido.cliente.nombre} {pedido.cliente.apellido}\n      </Text>\n\n      <Text style={[styles.direccion, { color: theme.muted }]}>\n        {pedido.cliente.domicilio.calle} {pedido.cliente.domicilio.numero},{' '}\n        {pedido.cliente.domicilio.localidad}\n      </Text>\n\n      <View style={styles.infoRow}>\n        <Text style={[styles.infoLabel, { color: theme.muted }]}>Teléfono</Text>\n        <TouchableOpacity onPress={() => handleCall(pedido.cliente.telefono)}>\n          <Text style={[styles.infoValue, { color: theme.info }]}>\n            {pedido.cliente.telefono}\n          </Text>\n        </TouchableOpacity>\n      </View>\n\n      <View style={styles.infoRow}>\n        <Text style={[styles.infoLabel, { color: theme.muted }]}>Horario</Text>\n        <Text style={[styles.infoValue, { color: theme.text }]}>\n          {pedido.cliente.horarioDesde} - {pedido.cliente.horarioHasta}\n        </Text>\n      </View>\n\n      {/* Items */}\n      <View style={styles.itemsList}>\n        {pedido.items.map((item, idx) => (\n          <Text key={idx} style={[styles.itemText, { color: theme.text }]}>\n            • {item.cantidad}x {item.item.nombre}\n          </Text>\n        ))}\n      </View>\n\n      {/* Acciones rápidas: llamar / mapa */}\n      <View style={styles.actionButtons}>\n        <Button\n          title=\"Llamar\"\n          variant=\"secondary\"\n          onPress={() => handleCall(pedido.cliente.telefono)}\n          style={styles.actionButton}\n        />\n        <Button\n          title=\"Abrir mapa\"\n          variant=\"ghost\"\n          onPress={() =>\n            handleOpenMaps(\n              pedido.cliente.domicilio.latitud,\n              pedido.cliente.domicilio.longitud\n            )\n          }\n          style={styles.actionButton}\n        />\n      </View>\n\n      {/* Acciones operativas según estado */}\n      {pedido.estado === 'PENDIENTE' && (\n        <View style={styles.operacionButtons}>\n          <Button\n            title=\"Iniciar entrega\"\n            variant=\"primary\"\n            onPress={onIniciarEntrega}\n            loading={iniciarLoading}\n            disabled={iniciarLoading}\n            style={styles.actionButton}\n          />\n          <Button\n            title=\"Ver detalle\"\n            variant=\"ghost\"\n            onPress={onVerDetalle}\n            style={styles.actionButton}\n          />\n        </View>\n      )}\n\n      {pedido.estado === 'EN_RUTA' && (\n        <View style={styles.operacionButtons}>\n          <ConfirmarAccionButtons\n            onConfirmar={onConfirmar}\n            onCancelar={onCancelar}\n            confirmarLoading={confirmarLoading}\n            cancelarLoading={cancelarLoading}\n          />\n          <Button\n            title=\"Ver detalle\"\n            variant=\"ghost\"\n            onPress={onVerDetalle}\n            style={styles.verDetalleButton}\n          />\n        </View>\n      )}\n    </Card>\n  );\n}\n\n// ─── ProximasEntregasList ─────────────────────────────────────────────────────\n\nfunction ProximasEntregasList({\n  pedidos,\n  theme,\n}: {\n  pedidos: Pedido[];\n  theme: typeof Colors.light;\n}) {\n  if (pedidos.length === 0) return null;\n\n  return (\n    <View style={styles.proximasContainer}>\n      <Text style={[styles.sectionTitle, { color: theme.text }]}>\n        Próximas entregas\n      </Text>\n\n      {pedidos.map((pedido) => {\n        const estadoColor = getEstadoColor(pedido.estado, theme);\n        return (\n          <TouchableOpacity\n            key={pedido.id}\n            style={[styles.proximaItem, { borderColor: theme.border }]}\n            onPress={() => router.push(`/pedidos/${pedido.id}`)}\n            activeOpacity={0.7}\n          >\n            <View style={styles.proximaItemLeft}>\n              <Text style={[styles.proximaCliente, { color: theme.text }]}>\n                {pedido.cliente.nombre} {pedido.cliente.apellido}\n              </Text>\n              <Text style={[styles.proximaDireccion, { color: theme.muted }]} numberOfLines={1}>\n                {pedido.cliente.domicilio.calle} {pedido.cliente.domicilio.numero}\n              </Text>\n              <Text style={[styles.proximaHorario, { color: theme.info }]}>\n                {pedido.cliente.horarioDesde} - {pedido.cliente.horarioHasta}\n              </Text>\n            </View>\n            <View style={[styles.proximaBadge, { backgroundColor: estadoColor + '20' }]}>\n              <Text style={[styles.proximaBadgeText, { color: estadoColor }]}>\n                {getEstadoLabel(pedido.estado)}\n              </Text>\n            </View>\n          </TouchableOpacity>\n        );\n      })}\n    </View>\n  );\n}\n\n// ─── RepartoCompletadoView ────────────────────────────────────────────────────\n\nfunction RepartoCompletadoView({ theme }: { theme: typeof Colors.light }) {\n  return (\n    <ThemedView style={styles.container}>\n      <Header />\n      <View style={styles.content}>\n        <Card>\n          <Text style={[styles.completadoText, { color: theme.success }]}>\n            ¡Todas las entregas están completadas!\n          </Text>\n        </Card>\n      </View>\n    </ThemedView>\n  );\n}\n\n// ─── RepartoEnCursoView ───────────────────────────────────────────────────────\n\nfunction RepartoEnCursoView({\n  repartoId,\n  pedidos,\n  theme,\n  onIniciarEntrega,\n  onConfirmarEntrega,\n  onCancelarEntrega,\n  iniciarLoading,\n  confirmarLoading,\n  cancelarLoading,\n}: {\n  repartoId: string;\n  pedidos: Pedido[];\n  theme: typeof Colors.light;\n  onIniciarEntrega: (pedidoId: string) => void;\n  onConfirmarEntrega: (pedidoId: string) => void;\n  onCancelarEntrega: (pedidoId: string) => void;\n  iniciarLoading: boolean;\n  confirmarLoading: boolean;\n  cancelarLoading: boolean;\n}) {\n  const completados = pedidos.filter(\n    (p) => p.estado === 'ENTREGADO' || p.estado === 'NO_ENTREGADO'\n  ).length;\n\n  const pedidosActivos = pedidos\n    .filter((p) => p.estado === 'PENDIENTE' || p.estado === 'EN_RUTA')\n    .sort((a, b) => a.orden - b.orden);\n\n  const proximaEntrega = pedidosActivos[0];\n  const proximasEntregas = pedidosActivos.slice(1);\n\n  return (\n    <ThemedView style={styles.container}>\n      <Header />\n      <ScrollView contentContainerStyle={styles.content}>\n        <BarraProgreso\n          completados={completados}\n          total={pedidos.length}\n          theme={theme}\n        />\n\n        {proximaEntrega ? (\n          <>\n            <Text style={[styles.sectionTitle, { color: theme.text }]}>\n              Próxima entrega\n            </Text>\n\n            <ProximaEntregaCard\n              pedido={proximaEntrega}\n              onIniciarEntrega={() => onIniciarEntrega(proximaEntrega.id)}\n              onConfirmar={() => onConfirmarEntrega(proximaEntrega.id)}\n              onCancelar={() => onCancelarEntrega(proximaEntrega.id)}\n              onVerDetalle={() => router.push(`/pedidos/${proximaEntrega.id}`)}\n              theme={theme}\n              iniciarLoading={iniciarLoading}\n              confirmarLoading={confirmarLoading}\n              cancelarLoading={cancelarLoading}\n            />\n\n            <ProximasEntregasList pedidos={proximasEntregas} theme={theme} />\n          </>\n        ) : (\n          <Card>\n            <Text style={[styles.completadoText, { color: theme.success }]}>\n              ¡Todas las entregas están completadas!\n            </Text>\n          </Card>\n        )}\n      </ScrollView>\n    </ThemedView>\n  );\n}\n\n// ─── Main Screen ──────────────────────────────────────────────────────────────\n\nexport default function InicioScreen() {\n  const colorScheme = useColorScheme() ?? 'light';\n  const theme = Colors[colorScheme];\n  const { showToast } = useToast();\n\n  const { data: reparto, isLoading, isError, error, refetch } = useReparto();\n  const iniciarReparto = useIniciarReparto();\n  const iniciarEntrega = useIniciarEntrega();\n  const confirmarEntrega = useConfirmarEntrega();\n  const cancelarPedido = useCancelarPedido();\n\n  const [showCancelModal, setShowCancelModal] = useState(false);\n  const [pedidoACancelar, setPedidoACancelar] = useState<string | null>(null);\n\n  // ── Handlers ──────────────────────────────────────────────────────────────\n\n  const handleIniciarReparto = useCallback(() => {\n    if (!reparto) return;\n    iniciarReparto.mutate(reparto.id, {\n      onSuccess: () => {\n        showToast('Reparto iniciado correctamente', 'success');\n      },\n      onError: (err) => {\n        showToast(handleApiError(err).message, 'error');\n      },\n    });\n  }, [reparto, iniciarReparto, showToast]);\n\n  const handleIniciarEntrega = useCallback((pedidoId: string) => {\n    iniciarEntrega.mutate(pedidoId, {\n      onSuccess: () => {\n        showToast('Entrega iniciada', 'success');\n      },\n      onError: (err) => {\n        showToast(handleApiError(err).message, 'error');\n      },\n    });\n  }, [iniciarEntrega, showToast]);\n\n  const handleConfirmarEntrega = useCallback((pedidoId: string) => {\n    confirmarEntrega.mutate(pedidoId, {\n      onSuccess: () => {\n        showToast('Entrega confirmada', 'success');\n      },\n      onError: (err) => {\n        showToast(handleApiError(err).message, 'error');\n      },\n    });\n  }, [confirmarEntrega, showToast]);\n\n  const handleCancelarEntrega = useCallback((pedidoId: string) => {\n    setPedidoACancelar(pedidoId);\n    setShowCancelModal(true);\n  }, []);\n\n  const handleConfirmarCancelacion = useCallback((motivo: MotivoCancelacion) => {\n    if (!pedidoACancelar) return;\n    cancelarPedido.mutate(\n      { pedidoId: pedidoACancelar, motivo },\n      {\n        onSuccess: () => {\n          setShowCancelModal(false);\n          setPedidoACancelar(null);\n          showToast('Entrega cancelada', 'success');\n        },\n        onError: (err) => {\n          showToast(handleApiError(err).message, 'error');\n        },\n      }\n    );\n  }, [pedidoACancelar, cancelarPedido, showToast]);\n\n  // ── Loading ───────────────────────────────────────────────────────────────\n\n  if (isLoading) {\n    return (\n      <ThemedView style={styles.container}>\n        <Header />\n        <LoadingSpinner message=\"Cargando reparto...\" />\n      </ThemedView>\n    );\n  }\n\n  // ── Error ─────────────────────────────────────────────────────────────────\n\n  if (isError) {\n    return (\n      <ThemedView style={styles.container}>\n        <Header />\n        <ErrorMessage\n          message={error?.message || 'Error al cargar el reparto'}\n          onRetry={() => refetch()}\n        />\n      </ThemedView>\n    );\n  }\n\n  // ── Sin reparto ───────────────────────────────────────────────────────────\n\n  if (!reparto || !reparto.pedidos || reparto.pedidos.length === 0) {\n    return <EmptyState theme={theme} />;\n  }\n\n  // ── Reparto PENDIENTE ─────────────────────────────────────────────────────\n\n  if (reparto.estado === 'PENDIENTE') {\n    return (\n      <RepartoPendienteView\n        repartoId={reparto.id}\n        totalPedidos={reparto.pedidos.length}\n        onIniciar={handleIniciarReparto}\n        loading={iniciarReparto.isPending}\n        theme={theme}\n      />\n    );\n  }\n\n  // ── Reparto EN_CURSO ──────────────────────────────────────────────────────\n\n  if (reparto.estado === 'EN_CURSO') {\n    return (\n      <>\n        <RepartoEnCursoView\n          repartoId={reparto.id}\n          pedidos={reparto.pedidos}\n          theme={theme}\n          onIniciarEntrega={handleIniciarEntrega}\n          onConfirmarEntrega={handleConfirmarEntrega}\n          onCancelarEntrega={handleCancelarEntrega}\n          iniciarLoading={iniciarEntrega.isPending}\n          confirmarLoading={confirmarEntrega.isPending}\n          cancelarLoading={cancelarPedido.isPending}\n        />\n        <CancelModal\n          visible={showCancelModal}\n          onClose={() => { setShowCancelModal(false); setPedidoACancelar(null); }}\n          onConfirmar={handleConfirmarCancelacion}\n        />\n      </>\n    );\n  }\n\n  // ── Reparto COMPLETADO ────────────────────────────────────────────────────\n\n  return <RepartoCompletadoView theme={theme} />;\n}\n\n// ─── Styles ───────────────────────────────────────────────────────────────────\n\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n  },\n  content: {\n    padding: Spacing.lg,\n    paddingBottom: Spacing.xxxl,\n  },\n  emptyContainer: {\n    flex: 1,\n    justifyContent: 'center',\n    alignItems: 'center',\n    padding: Spacing.xl,\n  },\n  emptyTitle: {\n    fontSize: FontSizes.lg,\n    fontWeight: 'bold',\n    textAlign: 'center',\n    marginBottom: Spacing.md,\n  },\n  emptySubtitle: {\n    fontSize: FontSizes.md,\n    textAlign: 'center',\n  },\n  sectionTitle: {\n    fontSize: FontSizes.lg,\n    fontWeight: 'bold',\n    marginBottom: Spacing.md,\n    marginTop: Spacing.lg,\n  },\n  // ── Resumen ──\n  resumenRow: {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    marginBottom: Spacing.sm,\n  },\n  resumenLabel: {\n    fontSize: FontSizes.sm,\n  },\n  resumenValue: {\n    fontSize: FontSizes.md,\n    fontWeight: '600',\n  },\n  resumenDivider: {\n    height: 1,\n    backgroundColor: 'transparent',\n    marginVertical: Spacing.md,\n  },\n  resumenHint: {\n    fontSize: FontSizes.sm,\n    marginBottom: Spacing.lg,\n    lineHeight: 20,\n  },\n  iniciarButton: {\n    marginTop: Spacing.sm,\n  },\n  // ── Próxima entrega ──\n  entregaHeader: {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    marginBottom: Spacing.sm,\n  },\n  estadoBadge: {\n    paddingHorizontal: Spacing.sm,\n    paddingVertical: Spacing.xs,\n    borderRadius: BorderRadius.sm,\n  },\n  estadoBadgeText: {\n    fontSize: FontSizes.xs,\n    fontWeight: '600',\n  },\n  ordenText: {\n    fontSize: FontSizes.xs,\n  },\n  clienteNombre: {\n    fontSize: FontSizes.lg,\n    fontWeight: 'bold',\n    marginBottom: Spacing.xs,\n  },\n  direccion: {\n    fontSize: FontSizes.sm,\n    marginBottom: Spacing.md,\n  },\n  infoRow: {\n    marginBottom: Spacing.xs,\n  },\n  infoLabel: {\n    fontSize: FontSizes.xs,\n    fontWeight: '600',\n    marginBottom: 1,\n  },\n  infoValue: {\n    fontSize: FontSizes.md,\n  },\n  itemsList: {\n    marginTop: Spacing.sm,\n    marginBottom: Spacing.md,\n  },\n  itemText: {\n    fontSize: FontSizes.sm,\n    marginBottom: 2,\n  },\n  actionButtons: {\n    flexDirection: 'row',\n    gap: Spacing.sm,\n    marginBottom: Spacing.md,\n  },\n  actionButton: {\n    flex: 1,\n  },\n  operacionButtons: {\n    marginTop: Spacing.sm,\n  },\n  verDetalleButton: {\n    marginTop: Spacing.md,\n  },\n  // ── Progreso ──\n  progressContainer: {\n    marginBottom: Spacing.md,\n  },\n  progressHeader: {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    marginBottom: Spacing.sm,\n  },\n  progressLabel: {\n    fontSize: FontSizes.sm,\n    fontWeight: '600',\n  },\n  progressCount: {\n    fontSize: FontSizes.sm,\n  },\n  progressBar: {\n    height: 10,\n    borderRadius: 5,\n    overflow: 'hidden',\n  },\n  progressFill: {\n    height: '100%',\n    borderRadius: 5,\n  },\n  // ── Próximas entregas ──\n  proximasContainer: {\n    marginTop: Spacing.lg,\n  },\n  proximaItem: {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    paddingVertical: Spacing.md,\n    paddingHorizontal: Spacing.md,\n    borderWidth: 1,\n    borderRadius: BorderRadius.md,\n    marginBottom: Spacing.sm,\n  },\n  proximaItemLeft: {\n    flex: 1,\n    marginRight: Spacing.md,\n  },\n  proximaCliente: {\n    fontSize: FontSizes.md,\n    fontWeight: '600',\n    marginBottom: 2,\n  },\n  proximaDireccion: {\n    fontSize: FontSizes.sm,\n    marginBottom: 2,\n  },\n  proximaHorario: {\n    fontSize: FontSizes.sm,\n  },\n  proximaBadge: {\n    paddingHorizontal: Spacing.sm,\n    paddingVertical: Spacing.xs,\n    borderRadius: BorderRadius.sm,\n  },\n  proximaBadgeText: {\n    fontSize: FontSizes.xs,\n    fontWeight: '600',\n  },\n  // ── Completado ──\n  completadoText: {\n    fontSize: FontSizes.md,\n    fontWeight: '600',\n    textAlign: 'center',\n  },\n});\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Mobile · Big Pickle · 22.6s)

_Thinking:_

Now let me verify the TypeScript compiles. Let me check if any new errors were introduced.

Verifiquemos que todo compile sin nuevos errores:

**Tool: bash**

**Input:**
```json
{
  "description": "TypeScript check mobile",
  "command": "Set-Location -LiteralPath \"C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\"; npx tsc --noEmit 2>&1 | Select-String -Pattern \"InicioScreen|useReparto|usePedidos|pedidoService\"",
  "timeout": 120000
}
```

**Output:**
```
(no output)
```

---

## Assistant (Mobile · Big Pickle · 24.2s)

_Thinking:_

No errors! The TypeScript check passed for all the files I modified. Let me also run the full check to confirm the total error count hasn't increased.

Sin errores en los archivos modificados. Verifiquemos el conteo total de errores (debe ser igual que antes):

**Tool: bash**

**Input:**
```json
{
  "description": "Count total TS errors in mobile",
  "command": "Set-Location -LiteralPath \"C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\"; $before = npx tsc --noEmit 2>&1 | Measure-Object -Line; $before.Lines",
  "timeout": 120000
}
```

**Output:**
```
33

```

---

## Assistant (Mobile · Big Pickle · 18.9s)

_Thinking:_

33 errors. Before my changes I had 33 errors as well (I counted from the earlier output). Let me verify by checking the earlier output count: the errors were all in test files, test-setup.ts, vitest.config.ts, and MapaScreen.tsx. No new errors from my changes. Let me verify the files I changed don't appear in the error list.

**Tool: bash**

**Input:**
```json
{
  "description": "Verify no errors from modified files",
  "command": "Set-Location -LiteralPath \"C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\"; npx tsc --noEmit 2>&1 | Select-String -Pattern \"InicioScreen|useReparto|usePedidos|pedidoService\" | Measure-Object -Line",
  "timeout": 120000
}
```

**Output:**
```

Lines Words Characters Property
----- ----- ---------- --------
    0                          



```

---

## Assistant (Mobile · Big Pickle · 7.3s)

_Thinking:_

0 errors from my changed files. The pre-existing 33 errors remain unchanged. All modifications are clean.

0 errores nuevos. Los 33 errores existentes son todos pre-existentes en `test-setup.ts`, `vitest.config.ts`, tests y `MapaScreen.tsx` — ninguno de mis archivos.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "priority": "high",
      "content": "Mobile: agregar iniciarEntregaRequest() en pedidoService.ts",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Mobile: agregar useIniciarEntrega() en usePedidos.ts",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Mobile: agregar useIniciarReparto() en useReparto.ts",
      "status": "completed"
    },
    {
      "priority": "high",
      "content": "Mobile: reescribir InicioScreen.tsx con flujo completo",
      "status": "completed"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Mobile: agregar iniciarEntregaRequest() en pedidoService.ts",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Mobile: agregar useIniciarEntrega() en usePedidos.ts",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Mobile: agregar useIniciarReparto() en useReparto.ts",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Mobile: reescribir InicioScreen.tsx con flujo completo",
    "status": "completed",
    "priority": "high"
  }
]
```

---

## Assistant (Mobile · Big Pickle · 9.9s)

Implementación completa. Resumen de todo lo realizado:

---

## Implementación finalizada

### Backend (1 archivo modificado)

**`backend/src/features/pedidos/service.ts`**
- Nueva función `autoCompletarRepartoSiCorresponde(pedidoId)` que:
  1. Verifica si el pedido pertenece a un reparto
  2. Si todos los pedidos del reparto están `ENTREGADO | NO_ENTREGADO | CANCELADO`
  3. Automáticamente completa el reparto (`COMPLETADO` + `horaFin`)
- Invocada después de: `confirmarEntrega()`, `cancelarPedidoRepartidor()`, `actualizarEstado()`

### Mobile (4 archivos)

**1. `features/pedidos/services/pedidoService.ts`**
- Nueva función `iniciarEntregaRequest(id)` → `PATCH /pedidos/{id}/estado { estado: 'EN_RUTA' }`

**2. `features/pedidos/hooks/usePedidos.ts`**
- Nuevo hook `useIniciarEntrega()` — mutation que invalida `['pedidos']` y `['reparto']`

**3. `features/repartos/hooks/useReparto.ts`**
- Nuevo hook `useIniciarReparto()` — mutation que invalida `['reparto', 'hoy']`

**4. `features/repartos/screens/InicioScreen.tsx`** (reescritura completa)

| Estado | Componente | Qué muestra |
|---|---|---|
| Loading | `LoadingSpinner` | "Cargando reparto..." |
| Error | `ErrorMessage` + `refetch()` | Mensaje + reintentar |
| Sin reparto | `EmptyState` | "No hay repartos asignados para hoy" |
| `PENDIENTE` | `RepartoPendienteView` | Resumen + "Iniciar reparto" |
| `EN_CURSO` | `RepartoEnCursoView` | Progreso + próxima entrega + próximas |
| `COMPLETADO` | `RepartoCompletadoView` | "Todas las entregas completadas" |

**Acciones en la próxima entrega:**
- `PENDIENTE` → botón "Iniciar entrega" (setea `EN_RUTA`) + "Ver detalle"
- `EN_RUTA` → `ConfirmarAccionButtons` (Confirmar/Cancelar) + "Ver detalle"
- Botones rápidos: "Llamar" y "Abrir mapa" siempre visibles
- Cancelación reutiliza `CancelModal` existente
- "Ver detalle" navega a `PedidoDetalleScreen` (`/pedidos/{id}`)

**Estadísticas:** Los 33 errores TypeScript pre-existentes no se vieron afectados. 0 errores nuevos.

---

## User

ahora agrega el home a la barra inferior de navegacion

---

## Assistant (Mobile · Big Pickle · 6.7s)

_Thinking:_

The user wants to add a "Home" (Inicio) tab to the bottom navigation bar. Looking at the current setup in `app/(tabs)/_layout.tsx`, the `index` tab already has `href: null` which means it's hidden from the tab bar. I need to change it to show the Home tab in the bottom bar with an appropriate icon.

Let me re-read the current tab layout to understand what needs to change.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\app\\(tabs)\\_layout.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\app\(tabs)\_layout.tsx</path>
<type>file</type>
<content>
1: import { Redirect, Tabs } from 'expo-router';
2: import React from 'react';
3: import { Platform } from 'react-native';
4: 
5: import { HapticTab } from '@/components/haptic-tab';
6: import { IconSymbol } from '@/components/ui/icon-symbol';
7: import { ConnectivityBanner } from '@/components/ui';
8: import { Colors } from '@/constants/theme';
9: import { useColorScheme } from '@/hooks/use-color-scheme';
10: import { useAuthStore } from '@/stores/authStore';
11: 
12: export default function TabLayout() {
13:   const colorScheme = useColorScheme() ?? 'light';
14:   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
15:   const isAdmin = useAuthStore((state) => state.usuario?.rol === 'ADMIN');
16: 
17:   if (!isAuthenticated) {
18:     return <Redirect href="/login" />;
19:   }
20: 
21:   return (
22:     <>
23:       <ConnectivityBanner isConnected={true} />
24:       <Tabs
25:       screenOptions={{
26:         tabBarActiveTintColor: Colors[colorScheme].tint,
27:         headerShown: false,
28:         tabBarButton: HapticTab,
29:         tabBarStyle: {
30:           backgroundColor: Colors[colorScheme].background,
31:           borderTopColor: Colors[colorScheme].border,
32:         },
33:       }}
34:     >
35:       <Tabs.Screen
36:         name="index"
37:         options={{
38:           href: null,
39:         }}
40:       />
41:       <Tabs.Screen
42:         name="clientes"
43:         options={{
44:           title: 'Clientes',
45:           href: isAdmin ? undefined : null,
46:           tabBarIcon: ({ color }) => (
47:             <IconSymbol size={28} name="person.crop.rectangle.stack.fill" color={color} />
48:           ),
49:         }}
50:       />
51:       <Tabs.Screen
52:         name="repartos"
53:         options={{
54:           title: 'Repartos',
55:           tabBarIcon: ({ color }) => (
56:             <IconSymbol size={28} name="shippingbox.fill" color={color} />
57:           ),
58:         }}
59:       />
60:       <Tabs.Screen
61:         name="pedidos"
62:         options={{
63:           title: 'Pedidos',
64:           tabBarIcon: ({ color }) => (
65:             <IconSymbol size={28} name="clipboard.fill" color={color} />
66:           ),
67:         }}
68:       />
69:       <Tabs.Screen
70:         name="mapa"
71:         options={{
72:           title: 'Mapa',
73:           tabBarIcon: ({ color }) => (
74:             <IconSymbol size={28} name="map.fill" color={color} />
75:           ),
76:         }}
77:       />
78:       <Tabs.Screen
79:         name="usuarios"
80:         options={{
81:           title: 'Usuarios',
82:           href: isAdmin ? undefined : null,
83:           tabBarIcon: ({ color }) => (
84:             <IconSymbol size={28} name="person.2.fill" color={color} />
85:           ),
86:         }}
87:       />
88:       <Tabs.Screen
89:         name="perfil"
90:         options={{
91:           title: 'Perfil',
92:           tabBarIcon: ({ color }) => (
93:             <IconSymbol size={28} name="person.fill" color={color} />
94:           ),
95:         }}
96:       />
97:     </Tabs>
98:     </>
99:   );
100: }

(End of file - total 100 lines)
</content>
```

---

## Assistant (Mobile · Big Pickle · 13.9s)

_Thinking:_

Looking at the navigation patterns documentation (ADR-0010/navigation-patterns.md), the existing tab structure is:

| Tab | Ruta | Ícono | Descripción |
|---|---|---|---|
| Inicio | `index` | house.fill / home | Próxima entrega + progreso |
| Repartos | `repartos/index` | shippingbox.fill / local-shipping | Entregas del día agrupadas |
| Pedidos | `pedidos/index` | clipboard.fill / list-alt | Lista general con buscador |
| Mapa | `mapa/index` | map.fill / map | Mapa con marcadores |
| Perfil | `perfil` | person.fill / person | Datos + cerrar sesión |

Currently:
- The `index` tab (Inicio) has `href: null` which hides it from the tab bar
- It should be showing with a house icon
- When the user is ADMIN, the `index` already redirects to `/pedidos` (in `app/(tabs)/index.tsx`)

So I need to:
1. Add the tab configuration for `index` similar to the other tabs
2. Give it title "Inicio" 
3. Use a house icon (`house.fill` on iOS, `home` on Android - but looking at how IconSymbol works, it uses SF Symbols on iOS)

Looking at the `icon-symbol.tsx`, it uses SF Symbols names on iOS and falls back to MaterialIcons on Android. The SF Symbol for home is `house.fill`.

The naming patterns.ts says: "Inicio | index | house.fill / home"

So the icon name should be `house.fill`.

For the `href`:
- For ADMIN: should probably still be null since ADMIN is redirected to /pedidos anyway
- For REPARTIDOR: should be visible

Actually, looking at the current `app/(tabs)/index.tsx`:
```tsx
export default function HomeRoute() {
  const usuario = useAuthStore((state) => state.usuario);
  if (usuario?.rol === 'ADMIN') {
    return <Redirect href="/pedidos" />;
  }
  return <InicioScreen />;
}
```

So even if ADMIN clicks on the Inicio tab, they get redirected to /pedidos. It would be cleaner to hide it for ADMIN and show it for REPARTIDOR.

Let me update the `_layout.tsx` to add the Inicio tab with proper configuration:
- `href: isAdmin ? null : undefined` - hidden for ADMIN, visible for REPARTIDOR
- Title: "Inicio"
- Icon: `house.fill`
- Also update the `href: null` for the perfil tab? No, perfil is already showing. Let me check.

Looking at the tabs:
- `index` - currently `href: null` (hidden). I'll add proper config.
- `repartos` - always visible (no `href` override)
- `pedidos` - always visible
- `mapa` - always visible
- `perfil` - always visible
- `clientes` - `href: isAdmin ? undefined : null` (admin only)
- `usuarios` - `href: isAdmin ? undefined : null` (admin only)

I need to update the `index` tab to:
```tsx
<Tabs.Screen
  name="index"
  options={{
    title: 'Inicio',
    href: isAdmin ? null : undefined,
    tabBarIcon: ({ color }) => (
      <IconSymbol size={28} name="house.fill" color={color} />
    ),
  }}
/>
```

This way:
- For REPARTIDOR: the Home tab shows up in the tab bar with a house icon
- For ADMIN: the Home tab is hidden (they get redirected to /pedidos via the index.tsx)

Necesito agregar la configuración del tab "Inicio" con su ícono. Actualmente tiene `href: null` que lo oculta de la barra.

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\app\\(tabs)\\_layout.tsx",
  "oldString": "      <Tabs.Screen\n        name=\"index\"\n        options={{\n          href: null,\n        }}\n      />",
  "newString": "      <Tabs.Screen\n        name=\"index\"\n        options={{\n          title: 'Inicio',\n          href: isAdmin ? null : undefined,\n          tabBarIcon: ({ color }) => (\n            <IconSymbol size={28} name=\"house.fill\" color={color} />\n          ),\n        }}\n      />"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Mobile · Big Pickle · 19.3s)

_Thinking:_

Let me verify the TypeScript compiles.

**Tool: bash**

**Input:**
```json
{
  "description": "TypeScript check tabs layout",
  "command": "Set-Location -LiteralPath \"C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\"; npx tsc --noEmit 2>&1 | Select-String -Pattern \"_layout\"",
  "timeout": 120000
}
```

**Output:**
```
(no output)
```

---

## Assistant (Mobile · Big Pickle · 7.7s)

Sin errores. El cambio es mínimo y directo.

**Modificación:** `app/(tabs)/_layout.tsx`

| Antes | Después |
|---|---|
| `href: null` (tab oculto) | `href: isAdmin ? null : undefined` |
| Sin ícono ni título | `title: 'Inicio'`, ícono `house.fill` |

**Comportamiento resultante:**

| Rol | Barra inferior |
|---|---|
| **REPARTIDOR** | 🏠 Inicio · 📦 Repartos · 📋 Pedidos · 🗺️ Mapa · 👤 Perfil |
| **ADMIN** | (sin Inicio) · 📋 Pedidos · 🗺️ Mapa · 👥 Clientes · 👥 Usuarios · 👤 Perfil |

Para ADMIN el tab sigue oculto porque `app/(tabs)/index.tsx` ya redirige a `/pedidos`. Para REPARTIDOR ahora se muestra con ícono de casa y título "Inicio", posicionado como primer tab (el de más a la izquierda).

---

## User

ahora planifica lo que me falto en mobile:
Acciones en la próxima entrega:
- PENDIENTE → botón "Iniciar entrega" (setea EN_RUTA) + "Ver detalle"
- EN_RUTA → ConfirmarAccionButtons (Confirmar/Cancelar) + "Ver detalle"
- Botones rápidos: "Llamar" y "Abrir mapa" siempre visibles
- Cancelación reutiliza CancelModal existente
- "Ver detalle" navega a PedidoDetalleScreen (/pedidos/{id})
Estadísticas: Los 33 errores TypeScript pre-existentes no se vieron afectados. 0 errores nuevos. 
y agrega boton para iniciar reparto una vez iniciado que se pueda ver los pedidos del reparto en el home (la pantalla que ya creaste)

---

## Assistant (Plan · Big Pickle · 20.5s)

_Thinking:_

The user is asking me to plan what's missing in the mobile implementation. They want me to:

1. Add actions in the "Próxima entrega" (Next Delivery):
   - PENDIENTE → "Iniciar entrega" button (sets EN_RUTA) + "Ver detalle"
   - EN_RUTA → ConfirmarAccionButtons (Confirmar/Cancelar) + "Ver detalle"
   - Quick buttons: "Llamar" and "Abrir mapa" always visible
   - Cancelación reuses existing CancelModal
   - "Ver detalle" navigates to PedidoDetalleScreen (/pedidos/{id})

2. Add a button to "Iniciar reparto" once started, and show reparto pedidos in the home screen (which they say I already created).

Wait, the user says "lo que me falto en mobile" - what I missed. Let me re-read what they're saying.

Actually, re-reading more carefully:

"ahora planifica lo que me falto en mobile:" - "now plan what I missed in mobile"

Then they list the actions for the next delivery. But wait... I already implemented all of this in the InicioScreen.tsx I wrote! Let me re-check my implementation:

In my InicioScreen.tsx:
1. ✅ PENDIENTE → "Iniciar entrega" + "Ver detalle" - I have this in ProximaEntregaCard
2. ✅ EN_RUTA → ConfirmarAccionButtons (Confirmar/Cancelar) + "Ver detalle" - I have this
3. ✅ "Llamar" and "Abrir mapa" always visible - I have this
4. ✅ Cancelación reutiliza CancelModal - I have this
5. ✅ "Ver detalle" navigates to /pedidos/{id} - I have this via router.push

Then they say: "y agrega boton para iniciar reparto una vez iniciado que se pueda ver los pedidos del reparto en el home (la pantalla que ya creaste)"

This translates to: "and add a button to start reparto once started, and show the reparto pedidos in the home (the screen you already created)"

Wait, I think they might be asking about something else. Let me re-read...

"y agrega boton para iniciar reparto una vez iniciado que se pueda ver los pedidos del reparto en el home"

Hmm, "add a button to start the reparto once started" - that doesn't make sense. Maybe they mean:
- "add a button to view the reparto's pedidos in the home, once the reparto is started"

Or maybe they want:
- When the reparto is EN_CURSO, add a way to see all the pedidos of the reparto directly on the home screen (not just the next delivery and upcoming ones)

Actually, I think they're saying:
1. Check that the actions I already implemented are correct (which they are)
2. Add functionality to see ALL pedidos of the reparto on the home screen, not just the filtered ones

Let me look at my current implementation again:

In `RepartoEnCursoView`, I already show:
- BarraProgreso (progress bar)
- Próxima entrega (next delivery card with actions)
- Próximas entregas (compact list of remaining deliveries)

And in the `ProximasEntregasList`, each item is tappable and navigates to `/pedidos/{id}`.

Maybe the user wants a button or link to see ALL pedidos (including completed ones) on the home screen? Like a "Ver todos los pedidos del reparto" button?

Or maybe they want the "ProximasEntregas" to be more prominent or include all pedidos (not just the active ones)?

Let me think... Actually, the user said "y agrega boton para iniciar reparto una vez iniciado que se pueda ver los pedidos del reparto en el home"

I think they want:
1. A button/link to view all pedidos of the reparto once it's started (EN_CURSO)
2. The ability to see the reparto's pedidos on the home screen

Currently, the home screen shows:
- Next delivery (first active pedido)
- Upcoming deliveries (rest of active pedidos)
- But NOT the full list of ALL pedidos (including completed ones)

Maybe they want a "Ver todos los pedidos" button that expands or navigates to show all pedidos of the reparto.

Wait, but actually the app already has a "Repartos" tab that shows the reparto list and individual reparto detail. So there's already navigation for that.

Let me re-read once more: "agrega boton para iniciar reparto una vez iniciado que se pueda ver los pedidos del reparto en el home"

Actually, I think there might be a translation issue. Maybe:
- "agrega botón para, una vez iniciado el reparto, poder ver los pedidos del reparto en el home"
- "add a button so that once the reparto is started, you can see the reparto's pedidos in the home"

This could mean they want a way to navigate from the home screen to the full reparto detail view (which shows all pedidos).

Currently, in the home screen when reparto is EN_CURSO, I show the next delivery and upcoming ones. But maybe the user wants a button at the bottom that says "Ver todos los pedidos del reparto" which navigates to `repartos/[id]` or similar.

Or maybe they literally want all pedidos displayed on the home screen itself (which would be a lot).

Actually, I think the simplest interpretation is:
- Add a "Ver reparto completo" or "Todos los pedidos" button/link in the EN_CURSO view that navigates to the reparto detail screen

But wait, the existing `repartos/[id]` route shows PedidoDetalleScreen for a specific pedido, not reparto detail. Let me check what `repartos/[id]` does.

Actually, from the navigation docs: `repartos/[id]` renders PedidoDetalleScreen - it's a specific pedido detail from the repartos tab. There's no dedicated "reparto detail with all pedidos" screen for the REPARTIDOR (that's admin-only).

Actually, the GET /repartos/:id endpoint returns the full reparto with all pedidos. And the mobile has `getRepartoByIdRequest` which could be used. But there's no screen that displays this full data for the repartidor.

So maybe the user wants:
1. A simple view of all pedidos in the reparto on the home screen
2. Or a navigation button to see them

Given the context, I think the most reasonable interpretation is:
- They want to add a section or button on the home screen (when EN_CURSO) that allows the repartidor to see ALL pedidos of the reparto, not just the active ones

The simplest way to implement this would be to add a button "Ver todos los pedidos" at the bottom of the EN_CURSO view that navigates to the reparto detail. But there's no reparto detail screen for repartidor.

Actually, looking at the navigation structure:
- `repartos/index` - RepartosListScreen (list of deliveries/entregas del día)
- `repartos/[id]` - PedidoDetalleScreen (detail of specific pedido)

So maybe the user wants a link to `/repartos` (the list of all deliveries for the day), which serves a similar purpose as "seeing all pedidos of the reparto".

Or maybe they want me to change the "Próximas entregas" list to show ALL pedidos (not just active ones) with some visual indicator of their status.

Let me just ask the user to clarify. Actually wait - I'm in plan mode, I can ask questions.

Let me ask for clarification while presenting the analysis of what I already have.

Estoy en modo plan — solo puedo analizar, no editar. Permitime revisar lo que ya implementé para entender qué falta.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\repartos\\screens\\InicioScreen.tsx"
}
```

**Output:**
```
<path>C:\Users\pc\Desktop\UTN\AppsMoviles\SupplyCycle\mobile\features\repartos\screens\InicioScreen.tsx</path>
<type>file</type>
<content>
1: import { useState, useCallback } from 'react';
2: import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
3: import { router } from 'expo-router';
4: import { ThemedView } from '@/components/themed-view';
5: import { Card, Button, LoadingSpinner, ErrorMessage, Header } from '@/components/ui';
6: import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
7: import { useColorScheme } from '@/hooks/use-color-scheme';
8: import { useReparto, useIniciarReparto } from '@/features/repartos/hooks/useReparto';
9: import { useConfirmarEntrega, useCancelarPedido, useIniciarEntrega } from '@/features/pedidos/hooks/usePedidos';
10: import ConfirmarAccionButtons from '@/features/pedidos/components/ConfirmarAccionButtons';
11: import CancelModal from '@/features/pedidos/components/CancelModal';
12: import { useToast } from '@/hooks/useToast';
13: import { handleApiError } from '@/services/handleApiError';
14: import type { Pedido, MotivoCancelacion } from '@/types';
15: 
16: // ─── Helpers ──────────────────────────────────────────────────────────────────
17: 
18: function getEstadoColor(estado: string, theme: typeof Colors.light): string {
19:   switch (estado) {
20:     case 'PENDIENTE': return theme.pendiente;
21:     case 'EN_RUTA': return theme.tint;
22:     case 'ENTREGADO': return theme.entregado;
23:     case 'NO_ENTREGADO': return theme.noEntregado;
24:     case 'CANCELADO': return theme.muted;
25:     default: return theme.text;
26:   }
27: }
28: 
29: function getEstadoLabel(estado: string): string {
30:   switch (estado) {
31:     case 'PENDIENTE': return 'Pendiente';
32:     case 'EN_RUTA': return 'En ruta';
33:     case 'ENTREGADO': return 'Entregado';
34:     case 'NO_ENTREGADO': return 'No entregado';
35:     case 'CANCELADO': return 'Cancelado';
36:     default: return estado;
37:   }
38: }
39: 
40: // ─── EmptyState ───────────────────────────────────────────────────────────────
41: 
42: function EmptyState({ theme }: { theme: typeof Colors.light }) {
43:   return (
44:     <ThemedView style={styles.container}>
45:       <Header />
46:       <View style={styles.emptyContainer}>
47:         <Text style={[styles.emptyTitle, { color: theme.text }]}>
48:           No hay repartos asignados para hoy
49:         </Text>
50:         <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
51:           Tus entregas del día aparecerán aquí cuando tengas un reparto asignado.
52:         </Text>
53:       </View>
54:     </ThemedView>
55:   );
56: }
57: 
58: // ─── BarraProgreso ────────────────────────────────────────────────────────────
59: 
60: function BarraProgreso({
61:   completados,
62:   total,
63:   theme,
64: }: {
65:   completados: number;
66:   total: number;
67:   theme: typeof Colors.light;
68: }) {
69:   const porcentaje = total > 0 ? (completados / total) * 100 : 0;
70: 
71:   return (
72:     <View style={styles.progressContainer}>
73:       <View style={styles.progressHeader}>
74:         <Text style={[styles.progressLabel, { color: theme.text }]}>
75:           Progreso del día
76:         </Text>
77:         <Text style={[styles.progressCount, { color: theme.muted }]}>
78:           {completados} de {total} entregas
79:         </Text>
80:       </View>
81:       <View style={[styles.progressBar, { backgroundColor: theme.surface }]}>
82:         <View
83:           style={[
84:             styles.progressFill,
85:             {
86:               width: `${Math.min(porcentaje, 100)}%`,
87:               backgroundColor: theme.entregado,
88:             },
89:           ]}
90:         />
91:       </View>
92:     </View>
93:   );
94: }
95: 
96: // ─── RepartoPendienteView ─────────────────────────────────────────────────────
97: 
98: function RepartoPendienteView({
99:   repartoId,
100:   totalPedidos,
101:   onIniciar,
102:   loading,
103:   theme,
104: }: {
105:   repartoId: string;
106:   totalPedidos: number;
107:   onIniciar: () => void;
108:   loading: boolean;
109:   theme: typeof Colors.light;
110: }) {
111:   return (
112:     <ThemedView style={styles.container}>
113:       <Header />
114:       <ScrollView contentContainerStyle={styles.content}>
115:         <Card>
116:           <Text style={[styles.sectionTitle, { color: theme.text }]}>
117:             Reparto del día
118:           </Text>
119: 
120:           <View style={styles.resumenRow}>
121:             <Text style={[styles.resumenLabel, { color: theme.muted }]}>
122:               Estado
123:             </Text>
124:             <View style={[styles.estadoBadge, { backgroundColor: theme.pendiente + '20' }]}>
125:               <Text style={[styles.estadoBadgeText, { color: theme.pendiente }]}>
126:                 Pendiente
127:               </Text>
128:             </View>
129:           </View>
130: 
131:           <View style={styles.resumenRow}>
132:             <Text style={[styles.resumenLabel, { color: theme.muted }]}>
133:               Pedidos
134:             </Text>
135:             <Text style={[styles.resumenValue, { color: theme.text }]}>
136:               {totalPedidos} {totalPedidos === 1 ? 'pedido' : 'pedidos'}
137:             </Text>
138:           </View>
139: 
140:           <View style={styles.resumenDivider} />
141: 
142:           <Text style={[styles.resumenHint, { color: theme.muted }]}>
143:             Al iniciar el reparto podrás ver la próxima entrega y comenzar con el recorrido.
144:           </Text>
145: 
146:           <Button
147:             title="Iniciar reparto"
148:             variant="primary"
149:             onPress={onIniciar}
150:             loading={loading}
151:             disabled={loading}
152:             style={styles.iniciarButton}
153:           />
154:         </Card>
155:       </ScrollView>
156:     </ThemedView>
157:   );
158: }
159: 
160: // ─── ProximaEntregaCard ───────────────────────────────────────────────────────
161: 
162: function ProximaEntregaCard({
163:   pedido,
164:   onIniciarEntrega,
165:   onConfirmar,
166:   onCancelar,
167:   onVerDetalle,
168:   theme,
169:   iniciarLoading,
170:   confirmarLoading,
171:   cancelarLoading,
172: }: {
173:   pedido: Pedido;
174:   onIniciarEntrega: () => void;
175:   onConfirmar: () => void;
176:   onCancelar: () => void;
177:   onVerDetalle: () => void;
178:   theme: typeof Colors.light;
179:   iniciarLoading: boolean;
180:   confirmarLoading: boolean;
181:   cancelarLoading: boolean;
182: }) {
183:   const handleCall = useCallback((phone: string) => {
184:     const url = Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`;
185:     Linking.openURL(url);
186:   }, []);
187: 
188:   const handleOpenMaps = useCallback((lat: number, lng: number) => {
189:     const url = Platform.select({
190:       ios: `maps:0,0?q=${lat},${lng}`,
191:       android: `geo:0,0?q=${lat},${lng}`,
192:       default: `https://www.google.com/maps?q=${lat},${lng}`,
193:     });
194:     if (url) Linking.openURL(url);
195:   }, []);
196: 
197:   const estadoColor = getEstadoColor(pedido.estado, theme);
198: 
199:   return (
200:     <Card>
201:       <View style={styles.entregaHeader}>
202:         <View style={[styles.estadoBadge, { backgroundColor: estadoColor + '20' }]}>
203:           <Text style={[styles.estadoBadgeText, { color: estadoColor }]}>
204:             {getEstadoLabel(pedido.estado)}
205:           </Text>
206:         </View>
207:         <Text style={[styles.ordenText, { color: theme.muted }]}>
208:           Pedido #{pedido.orden}
209:         </Text>
210:       </View>
211: 
212:       <Text style={[styles.clienteNombre, { color: theme.text }]}>
213:         {pedido.cliente.nombre} {pedido.cliente.apellido}
214:       </Text>
215: 
216:       <Text style={[styles.direccion, { color: theme.muted }]}>
217:         {pedido.cliente.domicilio.calle} {pedido.cliente.domicilio.numero},{' '}
218:         {pedido.cliente.domicilio.localidad}
219:       </Text>
220: 
221:       <View style={styles.infoRow}>
222:         <Text style={[styles.infoLabel, { color: theme.muted }]}>Teléfono</Text>
223:         <TouchableOpacity onPress={() => handleCall(pedido.cliente.telefono)}>
224:           <Text style={[styles.infoValue, { color: theme.info }]}>
225:             {pedido.cliente.telefono}
226:           </Text>
227:         </TouchableOpacity>
228:       </View>
229: 
230:       <View style={styles.infoRow}>
231:         <Text style={[styles.infoLabel, { color: theme.muted }]}>Horario</Text>
232:         <Text style={[styles.infoValue, { color: theme.text }]}>
233:           {pedido.cliente.horarioDesde} - {pedido.cliente.horarioHasta}
234:         </Text>
235:       </View>
236: 
237:       {/* Items */}
238:       <View style={styles.itemsList}>
239:         {pedido.items.map((item, idx) => (
240:           <Text key={idx} style={[styles.itemText, { color: theme.text }]}>
241:             • {item.cantidad}x {item.item.nombre}
242:           </Text>
243:         ))}
244:       </View>
245: 
246:       {/* Acciones rápidas: llamar / mapa */}
247:       <View style={styles.actionButtons}>
248:         <Button
249:           title="Llamar"
250:           variant="secondary"
251:           onPress={() => handleCall(pedido.cliente.telefono)}
252:           style={styles.actionButton}
253:         />
254:         <Button
255:           title="Abrir mapa"
256:           variant="ghost"
257:           onPress={() =>
258:             handleOpenMaps(
259:               pedido.cliente.domicilio.latitud,
260:               pedido.cliente.domicilio.longitud
261:             )
262:           }
263:           style={styles.actionButton}
264:         />
265:       </View>
266: 
267:       {/* Acciones operativas según estado */}
268:       {pedido.estado === 'PENDIENTE' && (
269:         <View style={styles.operacionButtons}>
270:           <Button
271:             title="Iniciar entrega"
272:             variant="primary"
273:             onPress={onIniciarEntrega}
274:             loading={iniciarLoading}
275:             disabled={iniciarLoading}
276:             style={styles.actionButton}
277:           />
278:           <Button
279:             title="Ver detalle"
280:             variant="ghost"
281:             onPress={onVerDetalle}
282:             style={styles.actionButton}
283:           />
284:         </View>
285:       )}
286: 
287:       {pedido.estado === 'EN_RUTA' && (
288:         <View style={styles.operacionButtons}>
289:           <ConfirmarAccionButtons
290:             onConfirmar={onConfirmar}
291:             onCancelar={onCancelar}
292:             confirmarLoading={confirmarLoading}
293:             cancelarLoading={cancelarLoading}
294:           />
295:           <Button
296:             title="Ver detalle"
297:             variant="ghost"
298:             onPress={onVerDetalle}
299:             style={styles.verDetalleButton}
300:           />
301:         </View>
302:       )}
303:     </Card>
304:   );
305: }
306: 
307: // ─── ProximasEntregasList ─────────────────────────────────────────────────────
308: 
309: function ProximasEntregasList({
310:   pedidos,
311:   theme,
312: }: {
313:   pedidos: Pedido[];
314:   theme: typeof Colors.light;
315: }) {
316:   if (pedidos.length === 0) return null;
317: 
318:   return (
319:     <View style={styles.proximasContainer}>
320:       <Text style={[styles.sectionTitle, { color: theme.text }]}>
321:         Próximas entregas
322:       </Text>
323: 
324:       {pedidos.map((pedido) => {
325:         const estadoColor = getEstadoColor(pedido.estado, theme);
326:         return (
327:           <TouchableOpacity
328:             key={pedido.id}
329:             style={[styles.proximaItem, { borderColor: theme.border }]}
330:             onPress={() => router.push(`/pedidos/${pedido.id}`)}
331:             activeOpacity={0.7}
332:           >
333:             <View style={styles.proximaItemLeft}>
334:               <Text style={[styles.proximaCliente, { color: theme.text }]}>
335:                 {pedido.cliente.nombre} {pedido.cliente.apellido}
336:               </Text>
337:               <Text style={[styles.proximaDireccion, { color: theme.muted }]} numberOfLines={1}>
338:                 {pedido.cliente.domicilio.calle} {pedido.cliente.domicilio.numero}
339:               </Text>
340:               <Text style={[styles.proximaHorario, { color: theme.info }]}>
341:                 {pedido.cliente.horarioDesde} - {pedido.cliente.horarioHasta}
342:               </Text>
343:             </View>
344:             <View style={[styles.proximaBadge, { backgroundColor: estadoColor + '20' }]}>
345:               <Text style={[styles.proximaBadgeText, { color: estadoColor }]}>
346:                 {getEstadoLabel(pedido.estado)}
347:               </Text>
348:             </View>
349:           </TouchableOpacity>
350:         );
351:       })}
352:     </View>
353:   );
354: }
355: 
356: // ─── RepartoCompletadoView ────────────────────────────────────────────────────
357: 
358: function RepartoCompletadoView({ theme }: { theme: typeof Colors.light }) {
359:   return (
360:     <ThemedView style={styles.container}>
361:       <Header />
362:       <View style={styles.content}>
363:         <Card>
364:           <Text style={[styles.completadoText, { color: theme.success }]}>
365:             ¡Todas las entregas están completadas!
366:           </Text>
367:         </Card>
368:       </View>
369:     </ThemedView>
370:   );
371: }
372: 
373: // ─── RepartoEnCursoView ───────────────────────────────────────────────────────
374: 
375: function RepartoEnCursoView({
376:   repartoId,
377:   pedidos,
378:   theme,
379:   onIniciarEntrega,
380:   onConfirmarEntrega,
381:   onCancelarEntrega,
382:   iniciarLoading,
383:   confirmarLoading,
384:   cancelarLoading,
385: }: {
386:   repartoId: string;
387:   pedidos: Pedido[];
388:   theme: typeof Colors.light;
389:   onIniciarEntrega: (pedidoId: string) => void;
390:   onConfirmarEntrega: (pedidoId: string) => void;
391:   onCancelarEntrega: (pedidoId: string) => void;
392:   iniciarLoading: boolean;
393:   confirmarLoading: boolean;
394:   cancelarLoading: boolean;
395: }) {
396:   const completados = pedidos.filter(
397:     (p) => p.estado === 'ENTREGADO' || p.estado === 'NO_ENTREGADO'
398:   ).length;
399: 
400:   const pedidosActivos = pedidos
401:     .filter((p) => p.estado === 'PENDIENTE' || p.estado === 'EN_RUTA')
402:     .sort((a, b) => a.orden - b.orden);
403: 
404:   const proximaEntrega = pedidosActivos[0];
405:   const proximasEntregas = pedidosActivos.slice(1);
406: 
407:   return (
408:     <ThemedView style={styles.container}>
409:       <Header />
410:       <ScrollView contentContainerStyle={styles.content}>
411:         <BarraProgreso
412:           completados={completados}
413:           total={pedidos.length}
414:           theme={theme}
415:         />
416: 
417:         {proximaEntrega ? (
418:           <>
419:             <Text style={[styles.sectionTitle, { color: theme.text }]}>
420:               Próxima entrega
421:             </Text>
422: 
423:             <ProximaEntregaCard
424:               pedido={proximaEntrega}
425:               onIniciarEntrega={() => onIniciarEntrega(proximaEntrega.id)}
426:               onConfirmar={() => onConfirmarEntrega(proximaEntrega.id)}
427:               onCancelar={() => onCancelarEntrega(proximaEntrega.id)}
428:               onVerDetalle={() => router.push(`/pedidos/${proximaEntrega.id}`)}
429:               theme={theme}
430:               iniciarLoading={iniciarLoading}
431:               confirmarLoading={confirmarLoading}
432:               cancelarLoading={cancelarLoading}
433:             />
434: 
435:             <ProximasEntregasList pedidos={proximasEntregas} theme={theme} />
436:           </>
437:         ) : (
438:           <Card>
439:             <Text style={[styles.completadoText, { color: theme.success }]}>
440:               ¡Todas las entregas están completadas!
441:             </Text>
442:           </Card>
443:         )}
444:       </ScrollView>
445:     </ThemedView>
446:   );
447: }
448: 
449: // ─── Main Screen ──────────────────────────────────────────────────────────────
450: 
451: export default function InicioScreen() {
452:   const colorScheme = useColorScheme() ?? 'light';
453:   const theme = Colors[colorScheme];
454:   const { showToast } = useToast();
455: 
456:   const { data: reparto, isLoading, isError, error, refetch } = useReparto();
457:   const iniciarReparto = useIniciarReparto();
458:   const iniciarEntrega = useIniciarEntrega();
459:   const confirmarEntrega = useConfirmarEntrega();
460:   const cancelarPedido = useCancelarPedido();
461: 
462:   const [showCancelModal, setShowCancelModal] = useState(false);
463:   const [pedidoACancelar, setPedidoACancelar] = useState<string | null>(null);
464: 
465:   // ── Handlers ──────────────────────────────────────────────────────────────
466: 
467:   const handleIniciarReparto = useCallback(() => {
468:     if (!reparto) return;
469:     iniciarReparto.mutate(reparto.id, {
470:       onSuccess: () => {
471:         showToast('Reparto iniciado correctamente', 'success');
472:       },
473:       onError: (err) => {
474:         showToast(handleApiError(err).message, 'error');
475:       },
476:     });
477:   }, [reparto, iniciarReparto, showToast]);
478: 
479:   const handleIniciarEntrega = useCallback((pedidoId: string) => {
480:     iniciarEntrega.mutate(pedidoId, {
481:       onSuccess: () => {
482:         showToast('Entrega iniciada', 'success');
483:       },
484:       onError: (err) => {
485:         showToast(handleApiError(err).message, 'error');
486:       },
487:     });
488:   }, [iniciarEntrega, showToast]);
489: 
490:   const handleConfirmarEntrega = useCallback((pedidoId: string) => {
491:     confirmarEntrega.mutate(pedidoId, {
492:       onSuccess: () => {
493:         showToast('Entrega confirmada', 'success');
494:       },
495:       onError: (err) => {
496:         showToast(handleApiError(err).message, 'error');
497:       },
498:     });
499:   }, [confirmarEntrega, showToast]);
500: 
501:   const handleCancelarEntrega = useCallback((pedidoId: string) => {
502:     setPedidoACancelar(pedidoId);
503:     setShowCancelModal(true);
504:   }, []);
505: 
506:   const handleConfirmarCancelacion = useCallback((motivo: MotivoCancelacion) => {
507:     if (!pedidoACancelar) return;
508:     cancelarPedido.mutate(
509:       { pedidoId: pedidoACancelar, motivo },
510:       {
511:         onSuccess: () => {
512:           setShowCancelModal(false);
513:           setPedidoACancelar(null);
514:           showToast('Entrega cancelada', 'success');
515:         },
516:         onError: (err) => {
517:           showToast(handleApiError(err).message, 'error');
518:         },
519:       }
520:     );
521:   }, [pedidoACancelar, cancelarPedido, showToast]);
522: 
523:   // ── Loading ───────────────────────────────────────────────────────────────
524: 
525:   if (isLoading) {
526:     return (
527:       <ThemedView style={styles.container}>
528:         <Header />
529:         <LoadingSpinner message="Cargando reparto..." />
530:       </ThemedView>
531:     );
532:   }
533: 
534:   // ── Error ─────────────────────────────────────────────────────────────────
535: 
536:   if (isError) {
537:     return (
538:       <ThemedView style={styles.container}>
539:         <Header />
540:         <ErrorMessage
541:           message={error?.message || 'Error al cargar el reparto'}
542:           onRetry={() => refetch()}
543:         />
544:       </ThemedView>
545:     );
546:   }
547: 
548:   // ── Sin reparto ───────────────────────────────────────────────────────────
549: 
550:   if (!reparto || !reparto.pedidos || reparto.pedidos.length === 0) {
551:     return <EmptyState theme={theme} />;
552:   }
553: 
554:   // ── Reparto PENDIENTE ─────────────────────────────────────────────────────
555: 
556:   if (reparto.estado === 'PENDIENTE') {
557:     return (
558:       <RepartoPendienteView
559:         repartoId={reparto.id}
560:         totalPedidos={reparto.pedidos.length}
561:         onIniciar={handleIniciarReparto}
562:         loading={iniciarReparto.isPending}
563:         theme={theme}
564:       />
565:     );
566:   }
567: 
568:   // ── Reparto EN_CURSO ──────────────────────────────────────────────────────
569: 
570:   if (reparto.estado === 'EN_CURSO') {
571:     return (
572:       <>
573:         <RepartoEnCursoView
574:           repartoId={reparto.id}
575:           pedidos={reparto.pedidos}
576:           theme={theme}
577:           onIniciarEntrega={handleIniciarEntrega}
578:           onConfirmarEntrega={handleConfirmarEntrega}
579:           onCancelarEntrega={handleCancelarEntrega}
580:           iniciarLoading={iniciarEntrega.isPending}
581:           confirmarLoading={confirmarEntrega.isPending}
582:           cancelarLoading={cancelarPedido.isPending}
583:         />
584:         <CancelModal
585:           visible={showCancelModal}
586:           onClose={() => { setShowCancelModal(false); setPedidoACancelar(null); }}
587:           onConfirmar={handleConfirmarCancelacion}
588:         />
589:       </>
590:     );
591:   }
592: 
593:   // ── Reparto COMPLETADO ────────────────────────────────────────────────────
594: 
595:   return <RepartoCompletadoView theme={theme} />;
596: }
597: 
598: // ─── Styles ───────────────────────────────────────────────────────────────────
599: 
600: const styles = StyleSheet.create({
601:   container: {
602:     flex: 1,
603:   },
604:   content: {
605:     padding: Spacing.lg,
606:     paddingBottom: Spacing.xxxl,
607:   },
608:   emptyContainer: {
609:     flex: 1,
610:     justifyContent: 'center',
611:     alignItems: 'center',
612:     padding: Spacing.xl,
613:   },
614:   emptyTitle: {
615:     fontSize: FontSizes.lg,
616:     fontWeight: 'bold',
617:     textAlign: 'center',
618:     marginBottom: Spacing.md,
619:   },
620:   emptySubtitle: {
621:     fontSize: FontSizes.md,
622:     textAlign: 'center',
623:   },
624:   sectionTitle: {
625:     fontSize: FontSizes.lg,
626:     fontWeight: 'bold',
627:     marginBottom: Spacing.md,
628:     marginTop: Spacing.lg,
629:   },
630:   // ── Resumen ──
631:   resumenRow: {
632:     flexDirection: 'row',
633:     justifyContent: 'space-between',
634:     alignItems: 'center',
635:     marginBottom: Spacing.sm,
636:   },
637:   resumenLabel: {
638:     fontSize: FontSizes.sm,
639:   },
640:   resumenValue: {
641:     fontSize: FontSizes.md,
642:     fontWeight: '600',
643:   },
644:   resumenDivider: {
645:     height: 1,
646:     backgroundColor: 'transparent',
647:     marginVertical: Spacing.md,
648:   },
649:   resumenHint: {
650:     fontSize: FontSizes.sm,
651:     marginBottom: Spacing.lg,
652:     lineHeight: 20,
653:   },
654:   iniciarButton: {
655:     marginTop: Spacing.sm,
656:   },
657:   // ── Próxima entrega ──
658:   entregaHeader: {
659:     flexDirection: 'row',
660:     justifyContent: 'space-between',
661:     alignItems: 'center',
662:     marginBottom: Spacing.sm,
663:   },
664:   estadoBadge: {
665:     paddingHorizontal: Spacing.sm,
666:     paddingVertical: Spacing.xs,
667:     borderRadius: BorderRadius.sm,
668:   },
669:   estadoBadgeText: {
670:     fontSize: FontSizes.xs,
671:     fontWeight: '600',
672:   },
673:   ordenText: {
674:     fontSize: FontSizes.xs,
675:   },
676:   clienteNombre: {
677:     fontSize: FontSizes.lg,
678:     fontWeight: 'bold',
679:     marginBottom: Spacing.xs,
680:   },
681:   direccion: {
682:     fontSize: FontSizes.sm,
683:     marginBottom: Spacing.md,
684:   },
685:   infoRow: {
686:     marginBottom: Spacing.xs,
687:   },
688:   infoLabel: {
689:     fontSize: FontSizes.xs,
690:     fontWeight: '600',
691:     marginBottom: 1,
692:   },
693:   infoValue: {
694:     fontSize: FontSizes.md,
695:   },
696:   itemsList: {
697:     marginTop: Spacing.sm,
698:     marginBottom: Spacing.md,
699:   },
700:   itemText: {
701:     fontSize: FontSizes.sm,
702:     marginBottom: 2,
703:   },
704:   actionButtons: {
705:     flexDirection: 'row',
706:     gap: Spacing.sm,
707:     marginBottom: Spacing.md,
708:   },
709:   actionButton: {
710:     flex: 1,
711:   },
712:   operacionButtons: {
713:     marginTop: Spacing.sm,
714:   },
715:   verDetalleButton: {
716:     marginTop: Spacing.md,
717:   },
718:   // ── Progreso ──
719:   progressContainer: {
720:     marginBottom: Spacing.md,
721:   },
722:   progressHeader: {
723:     flexDirection: 'row',
724:     justifyContent: 'space-between',
725:     alignItems: 'center',
726:     marginBottom: Spacing.sm,
727:   },
728:   progressLabel: {
729:     fontSize: FontSizes.sm,
730:     fontWeight: '600',
731:   },
732:   progressCount: {
733:     fontSize: FontSizes.sm,
734:   },
735:   progressBar: {
736:     height: 10,
737:     borderRadius: 5,
738:     overflow: 'hidden',
739:   },
740:   progressFill: {
741:     height: '100%',
742:     borderRadius: 5,
743:   },
744:   // ── Próximas entregas ──
745:   proximasContainer: {
746:     marginTop: Spacing.lg,
747:   },
748:   proximaItem: {
749:     flexDirection: 'row',
750:     justifyContent: 'space-between',
751:     alignItems: 'center',
752:     paddingVertical: Spacing.md,
753:     paddingHorizontal: Spacing.md,
754:     borderWidth: 1,
755:     borderRadius: BorderRadius.md,
756:     marginBottom: Spacing.sm,
757:   },
758:   proximaItemLeft: {
759:     flex: 1,
760:     marginRight: Spacing.md,
761:   },
762:   proximaCliente: {
763:     fontSize: FontSizes.md,
764:     fontWeight: '600',
765:     marginBottom: 2,
766:   },
767:   proximaDireccion: {
768:     fontSize: FontSizes.sm,
769:     marginBottom: 2,
770:   },
771:   proximaHorario: {
772:     fontSize: FontSizes.sm,
773:   },
774:   proximaBadge: {
775:     paddingHorizontal: Spacing.sm,
776:     paddingVertical: Spacing.xs,
777:     borderRadius: BorderRadius.sm,
778:   },
779:   proximaBadgeText: {
780:     fontSize: FontSizes.xs,
781:     fontWeight: '600',
782:   },
783:   // ── Completado ──
784:   completadoText: {
785:     fontSize: FontSizes.md,
786:     fontWeight: '600',
787:     textAlign: 'center',
788:   },
789: });

(End of file - total 789 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 53.7s)

_Thinking:_

I've read the InicioScreen. Let me analyze what the user is asking.

They said:
1. "planifica lo que me falto en mobile" - They think there's something missing
2. "Acciones en la próxima entrega: ..." - They're listing what should happen (which I already implemented)
3. "y agrega boton para iniciar reparto una vez iniciado que se pueda ver los pedidos del reparto en el home (la pantalla que ya creaste)"

This last part is key: "add a button so that once the reparto is started, you can see the reparto's pedidos in the home (the screen you already created)"

Looking at my current implementation:
- When reparto is PENDIENTE, I show RepartoPendienteView with info + "Iniciar reparto" button ✅
- When reparto is EN_CURSO, I show:
  - BarraProgreso (progress)
  - Próxima entrega (first active pedido)
  - Próximas entregas (rest of active pedidos)
  - When ALL are complete, it shows "Todas las entregas completadas"

What's missing according to the user's request? I think they want a way to see ALL pedidos of the reparto (not just active ones) on the home screen when in EN_CURSO state. Currently:
- "Próximas entregas" only shows PENDIENTE and EN_RUTA pedidos
- Completed/cancelled deliveries are not shown in the list
- Only visible through the progress bar count

So the user wants to see ALL pedidos (including completed ones) or have a way to navigate to see the full reparto.

I think the most practical approach would be to add a button at the bottom of the EN_CURSO view that says "Ver todos los pedidos del reparto" which navigates to the repartos list screen where the repartidor can see all deliveries.

But actually, looking at the existing navigation:
- `repartos/index` shows the repartos list for the day
- This already shows all pedidos/entregas

So a button that navigates to `/repartos` would let the repartidor see all pedidos.

Wait, let me think about this differently. Maybe the user wants the home screen to show ALL deliveries in a list, similar to the Repartos tab, but as the primary view. Or maybe they want a way to navigate from home to see the reparto details.

Let me also check: is there a "Ver todos los pedidos" type of navigation missing?

Currently in my implementation:
1. The "Próximas entregas" list items are tappable → navigate to `/pedidos/{id}`
2. The "Próxima entrega" card has "Ver detalle" → navigate to `/pedidos/{id}`

But there's no way to see ALL pedidos in the reparto from the home screen. The user might want a way to see:
- The completed deliveries (not just active ones)
- The full picture of the reparto

I think the user wants me to add a button/link in the EN_CURSO view that shows all pedidos of the reparto. Something like:

```
[Ver todos los pedidos del reparto]
```

That navigates to the reparto detail or shows an expanded list.

But there's no "reparto detail" screen for repartidor. The admin has `AdminRepartoDetalleScreen` at `repartos/detalle-admin/[id]`, but for repartidor there's only the list.

Actually, I think the most practical approach is to navigate to `repartos/index` which already shows all deliveries for the day. That's the existing "Repartos" tab.

OR, since we already have all the pedidos data in the home screen (via useReparto hook), we could show a quick summary + a CTA button.

Let me think about what makes sense:

1. **Option A**: Add a "Ver todos los pedidos" button at the bottom of EN_CURSO view that navigates to `/repartos`
2. **Option B**: Add a collapsible list of ALL pedidos (including completed) on the home screen
3. **Option C**: Navigate to the reparto ID screen - but there's no repartidor reparto detail screen

I think Option A is the simplest and most aligned with the user's request. Let me check the existing routes...

Actually, looking at `app/(tabs)/repartos/index.tsx`, it shows the RepartosListScreen which is the deliveries list for the day. That's essentially "ver los pedidos del reparto".

Let me ask the user to clarify, since they might have a specific vision.

Wait, I'm in plan mode. Let me present the analysis and ask.

Buen análisis. Revisando el código que ya implementé, esto es lo que **ya funciona**:

### ✅ Ya implementado

| Feature | Estado |
|---|---|
| `PENDIENTE` → "Iniciar entrega" + "Ver detalle" | ✅ líneas 268-284 |
| `EN_RUTA` → `ConfirmarAccionButtons` (Confirmar/Cancelar) + "Ver detalle" | ✅ líneas 287-302 |
| "Llamar" y "Abrir mapa" siempre visibles | ✅ líneas 247-265 |
| Cancelación con `CancelModal` existente | ✅ líneas 584-589 |
| "Ver detalle" navega a `/pedidos/{id}` | ✅ líneas 428, 330 |
| Reparto PENDIENTE con botón "Iniciar reparto" | ✅ líneas 98-158 |
| Barra de progreso | ✅ líneas 60-93 |
| Próximas entregas (solo activos: PENDIENTE/EN_RUTA) | ✅ líneas 309-353 |

### ❌ Lo que falta (según entiendo tu pedido)

Dijiste: *"agrega boton para iniciar reparto una vez iniciado que se pueda ver los pedidos del reparto en el home"*

Actualmente cuando el reparto está `EN_CURSO`, la pantalla muestra solo los **pedidos activos** (`PENDIENTE` y `EN_RUTA`). Los completados (`ENTREGADO`, `NO_ENTREGADO`) solo se ven en la barra de progreso numérica, no en la lista. No hay forma de ver **todos los pedidos del reparto** desde el Home.

La solución más natural es agregar un botón al final del `RepartoEnCursoView` que navegue a la lista completa de entregas del día:

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "question": "¿Cómo querés que se vean todos los pedidos del reparto desde el Home?",
      "header": "Ver pedidos del reparto",
      "options": [
        {
          "label": "Botón \"Ver todos\" → /repartos (Recommended)",
          "description": "Agrega un botón al final del RepartoEnCursoView que navega a la pestaña Repartos, donde ya existe la lista completa de entregas del día. Simple, sin duplicar lógica."
        },
        {
          "label": "Expandir lista en Home",
          "description": "Agrega una sección expandible con todos los pedidos del reparto (incluyendo completados) directamente en la pantalla Home, con indicador visual de estado."
        }
      ]
    }
  ]
}
```

**Output:**
```
User has answered your questions: "¿Cómo querés que se vean todos los pedidos del reparto desde el Home?"="Botón "Ver todos" → /repartos (Recommended)". You can now continue with the user's answers in mind.
```

---

## Assistant (Plan · Big Pickle · 9.0s)

_Thinking:_

The user chose the option to add a "Ver todos" button that navigates to `/repartos`. This is the simplest approach.

Now I need to plan the exact change. I need to modify `RepartoEnCursoView` component in `InicioScreen.tsx` to add a button at the bottom that navigates to `/repartos`.

The change is straightforward:
1. Add a button at the end of the `RepartoEnCursoView` render, after the `ProximasEntregasList` and before closing the `ScrollView`
2. The button says "Ver todos los pedidos del reparto" 
3. When pressed, it navigates to `repartos/index` using `router.push('/repartos')`

This is a small, localized change to `InicioScreen.tsx`. No new files needed.

I'm in plan mode so I should present the plan and wait for the user to say "implementa" or similar.

Perfecto. El cambio es mínimo y localizado.

## Plan — Botón "Ver todos" desde el Home

### Archivo a modificar

**`mobile/features/repartos/screens/InicioScreen.tsx`**

### Cambio específico

Agregar un botón al final del componente `RepartoEnCursoView`, después del `ProximasEntregasList` y del cierre del `ScrollView` (`</ScrollView>`), pero antes de cerrar `</ThemedView>`:

```tsx
// Después de ProximasEntregasList y antes de cerrar ScrollView:
<View style={styles.verTodosContainer}>
  <Button
    title="Ver todos los pedidos"
    variant="ghost"
    onPress={() => router.push('/repartos')}
    style={styles.verTodosButton}
  />
</View>
```

### Nuevos estilos a agregar en `StyleSheet.create`

```tsx
verTodosContainer: {
  marginTop: Spacing.lg,
  alignItems: 'center',
},
verTodosButton: {
  // sin styles extra, usa el variant ghost por defecto
},
```

### Comportamiento

- El botón aparece siempre en la vista `EN_CURSO`, debajo de la lista de próximas entregas
- Navega a `/(tabs)/repartos/index` (la pestaña Repartos), que ya muestra todas las entregas del día agrupadas
- Al volver desde Repartos, el Home se refresca automáticamente (TanStack Query mantiene `staleTime`)

### Sin cambios en otras capas

- No se modifican hooks, ni services, ni backend
- No se duplica lógica
- Se respeta el límite de 250 líneas por componente (cada subcomponente sigue dentro del límite)

---

¿Procedo con la implementación?

---

## User

procede con la implementacion

---

## Assistant (Mobile · Big Pickle · 7.7s)

_Thinking:_

The user wants me to implement the change. I need to modify the `RepartoEnCursoView` component in `InicioScreen.tsx` to add a "Ver todos los pedidos" button at the bottom that navigates to `/repartos`.

Let me make the edit.

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\repartos\\screens\\InicioScreen.tsx",
  "oldString": "            <ProximasEntregasList pedidos={proximasEntregas} theme={theme} />\n          </>\n        ) : (\n          <Card>\n            <Text style={[styles.completadoText, { color: theme.success }]}>\n              ¡Todas las entregas están completadas!\n            </Text>\n          </Card>\n        )}\n      </ScrollView>\n    </ThemedView>",
  "newString": "            <ProximasEntregasList pedidos={proximasEntregas} theme={theme} />\n\n            <View style={styles.verTodosContainer}>\n              <Button\n                title=\"Ver todos los pedidos\"\n                variant=\"ghost\"\n                onPress={() => router.push('/repartos')}\n              />\n            </View>\n          </>\n        ) : (\n          <Card>\n            <Text style={[styles.completadoText, { color: theme.success }]}>\n              ¡Todas las entregas están completadas!\n            </Text>\n          </Card>\n        )}\n      </ScrollView>\n    </ThemedView>"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Mobile · Big Pickle · 6.3s)

_Thinking:_

Now I need to add the `verTodosContainer` style. Let me find the right place in the StyleSheet.

Ahora agrego el estilo:

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\\features\\repartos\\screens\\InicioScreen.tsx",
  "oldString": "  // ── Completado ──\n  completadoText: {",
  "newString": "  // ── Ver todos ──\n  verTodosContainer: {\n    marginTop: Spacing.lg,\n    alignItems: 'center',\n  },\n  // ── Completado ──\n  completadoText: {"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Mobile · Big Pickle · 16.8s)

_Thinking:_

Let me verify TypeScript compiles correctly.

**Tool: bash**

**Input:**
```json
{
  "description": "TypeScript check after button addition",
  "command": "Set-Location -LiteralPath \"C:\\Users\\pc\\Desktop\\UTN\\AppsMoviles\\SupplyCycle\\mobile\"; npx tsc --noEmit 2>&1 | Select-String -Pattern \"InicioScreen\"",
  "timeout": 120000
}
```

**Output:**
```
(no output)
```

---

## Assistant (Mobile · Big Pickle · 5.4s)

Sin errores. Implementación completa.

### Cambio realizado

**`InicioScreen.tsx`** — Se agregó un botón "Ver todos los pedidos" al final del `RepartoEnCursoView`, debajo de la lista de próximas entregas.

**Comportamiento:**
- Cuando el reparto está `EN_CURSO`, el botón aparece al final del scroll
- Al presionarlo navega a `/(tabs)/repartos` donde el repartidor ve la lista completa de entregas del día
- Al volver al Home, TanStack Query refresca automáticamente los datos

---

