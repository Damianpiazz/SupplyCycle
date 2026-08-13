# SDD Design: WhatsApp Bot ↔ Backend Integration

**Change name:** `whatsapp-backend-integration`
**Status:** Designed
**Author:** SDD Design (via engram)
**Date:** 2026-07-23
**Based on:** `docs/whatsapp-backend-integration/proposal.md`, `docs/whatsapp-backend-integration/spec.md`

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prisma Schema Design](#2-prisma-schema-design)
3. [Backend Route Design](#3-backend-route-design)
4. [New `cancelar-cliente` Endpoint Design](#4-new-cancelar-cliente-endpoint-design)
5. [Reclamos Feature Design](#5-reclamos-feature-design)
6. [WhatsApp Bot Service Updates](#6-whatsapp-bot-service-updates)
7. [Testing Architecture](#7-testing-architecture)
8. [Implementation Order & Dependencies](#8-implementation-order--dependencies)
9. [Security Analysis](#9-security-analysis)
10. [Backward Compatibility Analysis](#10-backward-compatibility-analysis)

---

## 1. Architecture Overview

### 1.1 Authentication Middleware Chain

The middleware chain follows a "try API key first, fall through to JWT" pattern. The three middlewares operate as a cooperative pipeline:

```
Request → apiKeyAuth → authenticate → requireRole(roles) → Controller
```

#### Chain mechanics

| Step | Middleware | Input | If x-api-key present & valid | If Authorization header present & valid | If neither | If invalid |
|---|---|---|---|---|---|---|
| 1 | `apiKeyAuth` | `req.headers['x-api-key']` | Sets `req.user = { userId: 'bot', email: 'bot@...', rol: 'BOT' }`, calls `next()` | Pass-through (calls `next()`) | Pass-through (calls `next()`) | 401 INVALID_API_KEY |
| 2 | `authenticate` | `req.user` (from step 1) or `Authorization` header | **Early return**: `if (req.user) return next()` — skips JWT entirely | Verifies JWT, sets `req.user` from payload, calls `next()` | 401 UNAUTHORIZED "Token no proporcionado" | 401 UNAUTHORIZED "Token inválido" |
| 3 | `requireRole(...)` | `req.user.rol` | Checks `'BOT'` against allowed roles list | Checks `'ADMIN'`/`'REPARTIDOR'` against allowed roles | Never reached | 403 FORBIDDEN |

#### Precedence matrix

```mermaid
graph TD
    A[Incoming Request] --> B{x-api-key present?}
    B -->|Yes, valid| C[req.user = { rol: BOT }]
    B -->|Yes, invalid| D[401 INVALID_API_KEY]
    B -->|No| E{Authorization header present?}
    C --> F[authenticate: req.user exists → pass through]
    F --> G[requireRole: check BOT in roles]
    G -->|Allowed| H[Controller]
    G -->|Not allowed| I[403 FORBIDDEN]
    E -->|Yes, valid| J[Decode JWT → req.user]
    E -->|No| K[401 Token no proporcionado]
    E -->|Yes, expired| L[401 Token expirado]
    J --> M[requireRole: check rol in roles]
    M -->|Allowed| H
    M -->|Not allowed| I
```

### 1.2 Request Flow: Bot Requests vs Admin Requests

#### Bot request (x-api-key)

```
WhatsApp Bot                        Backend
    │                                  │
    │  PATCH /pedidos/xxx/cancelar-    │
    │  cliente                         │
    │  x-api-key: <BOT_API_KEY>        │
    │─────────────────────────────────>│
    │                                  │
    │                           ┌──────┤
    │                           │apiKey│
    │                           │Auth  │
    │                           │  ✓   │
    │                           │sets  │
    │                           │rol:  │
    │                           │BOT   │
    │                           ├──────┤
    │                           │auth  │
    │                           │enti- │
    │                           │cate  │
    │                           │  ✓   │
    │                           │pass- │
    │                           │thru  │
    │                           ├──────┤
    │                           │requi-│
    │                           │reRole│
    │                           │ADMIN,│
    │                           │BOT   │
    │                           │  ✓   │
    │                           ├──────┤
    │                           │Cont- │
    │                           │roller│
    │                           │      │
    │                           └──────┤
    │                                  │
    │  200 { data: { estado:          │
    │  "CANCELADO", ... } }            │
    │<─────────────────────────────────│
```

#### Admin request (JWT Bearer)

```
Admin Browser/Mobile                Backend
    │                                  │
    │  POST /pedidos                   │
    │  Authorization: Bearer <JWT>     │
    │─────────────────────────────────>│
    │                           ┌──────┤
    │                           │apiKey│
    │                           │Auth  │
    │                           │  ✓   │
    │                           │pass- │
    │                           │thru  │
    │                           ├──────┤
    │                           │auth  │
    │                           │enti- │
    │                           │cate  │
    │                           │  ✓   │
    │                           │JWT→  │
    │                           │ADMIN │
    │                           ├──────┤
    │                           │requi-│
    │                           │reRole│
    │                           │ADMIN,│
    │                           │BOT   │
    │                           │  ✓   │
    │                           ├──────┤
    │                           │Cont- │
    │                           │roller│
    │                           └──────┤
    │                                  │
    │  201 { data: { id: "..." } }    │
    │<─────────────────────────────────│
```

### 1.3 `cancelar-cliente` vs `cancelar` (Repartidor)

Both endpoints cancel orders, but with **different semantics**:

| Aspect | `cancelar` (repartidor) | `cancelar-cliente` (nuevo) |
|---|---|---|
| **Route** | `PATCH /:id/cancelar` | `PATCH /:id/cancelar-cliente` |
| **Allowed roles** | `REPARTIDOR` | `ADMIN`, `BOT` |
| **Target state** | `NO_ENTREGADO` | `CANCELADO` |
| **Allowed from** | `PENDIENTE`, `EN_RUTA` | `PENDIENTE` only |
| **Auto-completa reparto** | ✅ Yes — calls `autoCompletarRepartoSiCorresponde` | ❌ No |
| **Returns** | `{ id, estado: 'NO_ENTREGADO', motivoFalla, actualizadoEn }` | `{ id, estado: 'CANCELADO', motivoFalla, actualizadoEn }` |
| **Use case** | Repartidor couldn't deliver | Client cancels before delivery |
| **Auth middleware** | `authenticate, requireRole('REPARTIDOR')` | `apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT')` |

### 1.4 Reclamos Feature in the Existing Pattern

The Reclamos feature follows the exact same structure as existing features (`clientes/`, `pedidos/`, etc.):

```
src/features/reclamos/
├── types.ts       → Re-export from Prisma. No custom types needed.
├── schema.ts      → Zod schemas: crearReclamoSchema, listarReclamosQuerySchema, reclamoIdParamSchema
├── service.ts     → 3 functions: crearReclamo, listarReclamos, obtenerReclamo
├── controller.ts  → 3 handlers: crearController, listarController, obtenerController
└── routes.ts      → Express Router: GET /, GET /:id, POST /
```

Mounted in `app.ts` at line 128 (between `estadisticas` and `admin`):

```typescript
app.use('/api/v1/reclamos', reclamosRoutes);
```

**How it differs from existing features:**
- Only 3 endpoints (not CRUD — no update, no delete by design). Reclamos are append-only logs.
- READ endpoints (`GET /`, `GET /:id`) are `apiKeyAuth + authenticate` — any authenticated user can read.
- WRITE endpoint (`POST /`) requires `ADMIN` or `BOT` — clients cannot file via REST directly (only via WhatsApp bot).

---

## 2. Prisma Schema Design

### 2.1 Rol Enum — Before/After

**Before:**
```prisma
enum Rol {
  REPARTIDOR
  ADMIN
}
```

**After:**
```prisma
enum Rol {
  REPARTIDOR
  ADMIN
  BOT           // NEW
}
```

**Migration strategy:**
- **Name:** `add_bot_role`
- **Type:** Additive enum value
- **Data loss:** None — new enum member does not affect existing `REPARTIDOR` or `ADMIN` rows
- **Impact on Prisma client:** Regenerated. The `Rol` type now includes `BOT`.
- **Impact on TypeScript:** `AllowedRole` type in `auth.middleware.ts` already includes `'BOT'` — no change needed.
- **Existing tests:** Not affected. Existing tests mock Prisma and don't iterate the enum.

### 2.2 Reclamo Model — Before/After

**Before:**
```prisma
model Reclamo {
  id        String   @id @default(uuid())
  clienteId String
  creadoEn  DateTime @default(now())
  cliente   Cliente  @relation(fields: [clienteId], references: [id])
}
```

**After:**
```prisma
model Reclamo {
  id          String   @id @default(uuid())
  clienteId   String
  descripcion String   // NEW — required, free-text complaint
  creadoEn    DateTime @default(now())
  cliente     Cliente  @relation(fields: [clienteId], references: [id])
}
```

**Migration strategy:**
- **Name:** `add_descripcion_to_reclamo`
- **Type:** Additive column
- **Data loss:** None. Prisma adds the column as nullable for existing rows. The `String` type in Prisma schema maps to `TEXT | VARCHAR` — since no `@default` is specified, Prisma will require the field in `create()` calls going forward, but existing rows will have `NULL`.
- **Existing admin controller:** The EJS-based admin controller creates Reclamos without `descripcion`. After migration, existing create calls (which don't include `descripcion`) will fail at the Prisma level. **The admin controller is updated in this same PR** — the `create()` method adds `descripcion: ''` as a default value. See the file manifest in §12.
- **Bot impact:** Bot's `reclamo.service.ts` already sends `descripcion` in `CrearReclamoInput`. The new `Reclamo` interface must add `descripcion: string`.

### 2.3 Migration Order & Dependencies

```
Step 1: npx prisma migrate dev --name add_bot_role
Step 2: npx prisma migrate dev --name add_descripcion_to_reclamo
Step 3: npx prisma generate
```

**Dependency:** None between step 1 and 2 — order is arbitrary. They are kept separate for:
- **Rollback clarity:** If one migration fails, the other is unaffected.
- **Reviewability:** Each migration has a single concern.

**TRADE-OFF:** Could combine into one migration. Separate wins for ops clarity. If the project prefers fewer migration files, they can be squashed — but there is no benefit given the small scope.

---

## 3. Backend Route Design

### 3.1 Clientes Routes

**File:** `src/features/clientes/routes.ts`

**Current:**
```typescript
// Rutas admin-only
router.post('/', authenticate, requireRole('ADMIN'), crearController);
router.patch('/:id', authenticate, requireRole('ADMIN'), actualizarController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarController);
```

**Proposed:**
```typescript
// Rutas admin-only or bot (via api key)
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), crearController);
router.patch('/:id', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), actualizarController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarController);
```

**Per-route change analysis:**

| Route | Current middleware | Proposed middleware | Why this change is safe |
|---|---|---|---|
| `POST /` | `authenticate, requireRole('ADMIN')` | `apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT')` | **Additive only.** Existing ADMIN JWT requests: `apiKeyAuth` passes through (no x-api-key header), `authenticate` processes JWT as before, `requireRole('ADMIN', 'BOT')` still allows ADMIN ✅. Bot requests: `apiKeyAuth` sets `rol=BOT`, `authenticate` skips JWT, `requireRole` allows BOT ✅. |
| `PATCH /:id` | `authenticate, requireRole('ADMIN')` | `apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT')` | Same logic as POST ✅. The bot only sends `{ activo: false }` — soft-delete payload, same as admin use. |
| `DELETE /:id` | `authenticate, requireRole('ADMIN')` | (unchanged) | DELETION remains ADMIN-only. The bot never hard-deletes clients. ✅ |

**Import note:** `apiKeyAuth` is already imported in `clientes/routes.ts` at line 13 — no import changes needed.

### 3.2 Pedidos Routes

**File:** `src/features/pedidos/routes.ts`

**Current:**
```typescript
// ─── Lectura — Admin, repartidor y bot ────────────────────────────────────────
router.get('/hoy', apiKeyAuth, authenticate, obtenerHoyController);
router.get('/disponibles', authenticate, requireRole('ADMIN'), obtenerDisponiblesController);
router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);

// ─── Escritura — Admin y repartidor ───────────────────────────────────────────
router.post('/', authenticate, requireRole('ADMIN', 'REPARTIDOR'), crearController);
router.patch('/:id/estado', authenticate, requireRole('ADMIN', 'REPARTIDOR'), actualizarEstadoController);
router.delete('/:id', authenticate, requireRole('ADMIN', 'REPARTIDOR'), eliminarPedidoController);

// ─── Items del pedido — Admin y repartidor ────────────────────────────────────
router.post('/:pedidoId/items', authenticate, requireRole('ADMIN', 'REPARTIDOR'), agregarItemController);
router.patch('/:pedidoId/items/:itemId', authenticate, requireRole('ADMIN', 'REPARTIDOR'), actualizarCantidadItemController);
router.delete('/:pedidoId/items/:itemId', authenticate, requireRole('ADMIN', 'REPARTIDOR'), quitarItemController);

// ─── Flujo de reparto — Solo repartidor ───────────────────────────────────────
router.patch('/:id/confirmar', authenticate, requireRole('REPARTIDOR'), confirmarController);
router.patch('/:id/cancelar', authenticate, requireRole('REPARTIDOR'), cancelarRepartidorController);
```

**Proposed:**
```typescript
// ─── Lectura — Admin, repartidor y bot ────────────────────────────────────────
router.get('/hoy', apiKeyAuth, authenticate, obtenerHoyController);
router.get('/disponibles', authenticate, requireRole('ADMIN'), obtenerDisponiblesController);
router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);

// ─── Escritura — Admin, repartidor y bot ──────────────────────────────────────
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT'), crearController);
router.patch('/:id/estado', authenticate, requireRole('ADMIN', 'REPARTIDOR'), actualizarEstadoController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarPedidoController);

// ─── Items del pedido — Admin, repartidor y bot ───────────────────────────────
router.post('/:pedidoId/items', apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT'), agregarItemController);
router.patch('/:pedidoId/items/:itemId', apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT'), actualizarCantidadItemController);
router.delete('/:pedidoId/items/:itemId', authenticate, requireRole('ADMIN'), quitarItemController);

// ─── Flujo de reparto — Solo repartidor ───────────────────────────────────────
router.patch('/:id/confirmar', authenticate, requireRole('REPARTIDOR'), confirmarController);
router.patch('/:id/cancelar', authenticate, requireRole('REPARTIDOR'), cancelarRepartidorController);

// ─── Cancelación por cliente — Admin o bot ────────────────────────────────────
router.patch('/:id/cancelar-cliente', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), cancelarClienteController);
```

**Per-route change analysis:**

| Route | Current middleware | Proposed middleware | Why safe |
|---|---|---|---|
| `GET /hoy` | `apiKeyAuth, authenticate` | Unchanged | Already had apiKeyAuth for the bot. ✅ |
| `GET /disponibles` | `authenticate, requireRole('ADMIN')` | Unchanged | Bot doesn't need this. ✅ |
| `GET /` | `apiKeyAuth, authenticate` | Unchanged | Already works for bot. ✅ |
| `GET /:id` | `apiKeyAuth, authenticate` | Unchanged | Already works for bot. ✅ |
| `POST /` | `authenticate, requireRole('ADMIN', 'REPARTIDOR')` | `apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT')` | **Additive.** ADMIN continues via JWT. REPARTIDOR continues via JWT. BOT added. ✅ |
| `PATCH /:id/estado` | `authenticate, requireRole('ADMIN', 'REPARTIDOR')` | Unchanged | Bot doesn't need it now (deferred per spec). ✅ |
| `DELETE /:id` | `authenticate, requireRole('ADMIN', 'REPARTIDOR')` | `authenticate, requireRole('ADMIN')` | **REPARTIDOR removed.** This is a deliberate tightening: a repartidor should not soft-delete orders — they use the cancel/confirm flow. Safe because: (1) no existing code lets repartidores call this from mobile, (2) the cancel flow (`/cancelar`) is the correct path. ✅ |
| `POST /:pedidoId/items` | `authenticate, requireRole('ADMIN', 'REPARTIDOR')` | `apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT')` | Additive. Same pattern as POST /. ✅ |
| `PATCH /:pedidoId/items/:itemId` | `authenticate, requireRole('ADMIN', 'REPARTIDOR')` | `apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT')` | Additive. ✅ |
| `DELETE /:pedidoId/items/:itemId` | `authenticate, requireRole('ADMIN', 'REPARTIDOR')` | `authenticate, requireRole('ADMIN')` | **REPARTIDOR removed.** Same tightening as DELETE /:id. Bot never removes individual items. ✅ |
| `PATCH /:id/confirmar` | `authenticate, requireRole('REPARTIDOR')` | Unchanged | Repartidor-only. ✅ |
| `PATCH /:id/cancelar` | `authenticate, requireRole('REPARTIDOR')` | Unchanged | Repartidor-only. ✅ |
| `PATCH /:id/cancelar-cliente` | (NEW) | `apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT')` | New route, no existing users affected. ✅ |

**TRADE-OFF: Removing REPARTIDOR from `DELETE /:id` and `DELETE /:pedidoId/items/:itemId`**

This is a **security tightening** disguised as a side effect. The rationale:

1. These routes are not called by the mobile app (mobile uses `/confirmar`, `/cancelar`).
2. If a repartidor JWT is compromised, the attacker could soft-delete any order — the new `requireRole('ADMIN')` prevents this.
3. If backward compatibility is a concern (e.g., some admin panel page uses a repartidor token to call these) — mitigate by keeping `REPARTIDOR` in the list. However, the spec explicitly removes it.

**Decision:** Remove `REPARTIDOR` from DELETE routes. If a valid use case appears, the role can be re-added with no migration cost.

---

## 4. New `cancelar-cliente` Endpoint Design

### 4.1 Service Function: `cancelarPedidoCliente`

**File:** `backend/src/features/pedidos/service.ts`

```typescript
/**
 * PATCH /pedidos/:id/cancelar-cliente
 * Client/bot cancellation: PENDIENTE → CANCELADO
 * 
 * Design differences from cancelarPedidoRepartidor:
 * 1. Sets estado = 'CANCELADO' (not 'NO_ENTREGADO')
 * 2. Only allows PENDIENTE → CANCELADO transition (not EN_RUTA)
 * 3. Does NOT call autoCompletarRepartoSiCorresponde
 * 4. Returns simpler response (no reparto completion logic)
 */
export async function cancelarPedidoCliente(id: string, motivo: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.estado !== 'PENDIENTE') {
    throw ApiError.conflict(
      'Solo se pueden cancelar pedidos en estado pendiente'
    );
  }

  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'CANCELADO', motivoFalla: motivo },
  });

  // Intentionally NOT calling autoCompletarRepartoSiCorresponde.
  // Client cancellations should not trigger reparto completion,
  // because the reparto might have other pedidos still in progress.
  // Reparto completion is triggered by repartidor actions only.

  return {
    id: updated.id,
    estado: 'CANCELADO' as const,
    motivoFalla: updated.motivoFalla!,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}
```

### 4.2 Comparison with Existing Cancel Functions

```typescript
// EXISTING — Repartidor cancel: PENDIENTE/EN_RUTA → NO_ENTREGADO
export async function cancelarPedidoRepartidor(id: string, motivo: string) {
  // ... validates pedido exists, estado in [PENDIENTE, EN_RUTA]
  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'NO_ENTREGADO', motivoFalla: motivo },
  });
  await autoCompletarRepartoSiCorresponde(id);  // ← calls this
  return { id, estado: 'NO_ENTREGADO', motivoFalla, actualizadoEn };
}

// EXISTING — Admin cancel: PENDIENTE → CANCELADO (no motivo)
export async function cancelarPedido(id: string) {
  // ... validates pedido exists, estado === 'PENDIENTE'
  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'CANCELADO' },  // ← NO motivoFalla
  });
  // NO autoCompletarRepartoSiCorresponde
  return { id, estado: 'CANCELADO', actualizadoEn };
}

// NEW — Client/bot cancel: PENDIENTE → CANCELADO (con motivo)
export async function cancelarPedidoCliente(id: string, motivo: string) {
  // ... validates pedido exists, estado === 'PENDIENTE'
  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'CANCELADO', motivoFalla: motivo },  // ← sets CANCELADO + motivo
  });
  // NO autoCompletarRepartoSiCorresponde
  return { id, estado: 'CANCELADO', motivoFalla, actualizadoEn };
}
```

**Key design insight:** The existing `cancelarPedido` (admin) and `cancelarPedidoCliente` (new) are similar, but the new one adds `motivoFalla` support. Rather than modifying the existing admin function (which could break existing callers), we create a new function — this is the **Open/Closed Principle** in practice.

### 4.3 Controller Function

**File:** `backend/src/features/pedidos/controller.ts`

```typescript
import { cancelarClienteSchema } from './schema.js';  // NEW — distinct from cancelarPedidoSchema

/**
 * PATCH /pedidos/:id/cancelar-cliente
 * Client/bot cancellation: PENDIENTE → CANCELADO
 */
export async function cancelarClienteController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const { motivo } = cancelarClienteSchema.parse(req.body);
    const result = await pedidosService.cancelarPedidoCliente(id, motivo);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
```

### 4.4 Cancelar Cliente Schema (New)

**File:** `backend/src/features/pedidos/schema.ts`

The `cancelar-cliente` endpoint uses a **new** schema `cancelarClienteSchema` with client-appropriate reason values, distinct from the repartidor-centric `cancelarPedidoSchema`:

```typescript
export const cancelarClienteSchema = z.object({
  motivo: z.enum([
    'YA_NO_LO_NECESITA',
    'DIRECCION_INCORRECTA', 
    'CANCELACION_CLIENTE',
    'OTRO'
  ], {
    errorMap: () => ({ message: 'Motivo de cancelación inválido' }),
  }),
});
```

**Why a new schema instead of reusing `cancelarPedidoSchema`:**
The existing schema has repartidor-centric reasons: `CLIENTE_AUSENTE` (client not present when the delivery person arrived), `ACCESO_DENEGADO` (access denied at delivery location). These don't make sense when the CLIENT is the one initiating the cancellation. The new schema uses client-appropriate values:

| Value | Meaning | Maps to bot flow label |
|---|---|---|
| `YA_NO_LO_NECESITA` | Ya no necesita el pedido | "Ya no necesito el pedido" |
| `DIRECCION_INCORRECTA` | Dirección incorrecta | "La dirección es incorrecta" |
| `CANCELACION_CLIENTE` | No va a estar para recibir | "No voy a estar para recibir" |
| `OTRO` | Otro motivo | "Otro motivo" |

**Bot impact:** The cancelar.flow.ts `MOTIVOS` mapping must be updated to use the new enum values (see §6.3).

### 4.5 Route Registration

```typescript
// In routes.ts import section:
import {
  // ... existing imports ...
  cancelarClienteController,  // ADD
} from './controller.js';

// In route definitions:
router.patch('/:id/cancelar-cliente', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), cancelarClienteController);
```

---

## 5. Reclamos Feature Design

### 5.1 File Structure (following existing pattern)

```
src/features/reclamos/
├── types.ts          → Re-export Prisma Reclamo type
├── schema.ts         → Zod validation (3 schemas)
├── service.ts        → 3 functions: crearReclamo, listarReclamos, obtenerReclamo
├── controller.ts     → 3 Express handlers
└── routes.ts         → Express Router (3 routes)
```

### 5.2 `types.ts`

```typescript
import type { Reclamo } from '@prisma/client';

// Re-export for convenience. No custom types needed unless extending response.
export type { Reclamo };

// Input type for crearReclamo service
export interface CrearReclamoInput {
  clienteId: string;
  descripcion: string;
}
```

**Design decision:** Pure re-export from Prisma. If future needs require a response DTO (e.g., excluding `clienteId`), add a `ReclamoResponse` type here.

### 5.3 `schema.ts`

```typescript
import { z } from 'zod';

export const crearReclamoSchema = z.object({
  clienteId: z
    .string()
    .uuid('El ID del cliente debe ser un UUID válido'),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede superar los 500 caracteres'),
});

export const listarReclamosQuerySchema = z.object({
  clienteId: z
    .string()
    .uuid('El ID del cliente debe ser un UUID válido')
    .optional(),
  page: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().positive())
    .optional(),
  pageSize: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(1).max(100))
    .optional(),
});

export const reclamoIdParamSchema = z.object({
  id: z
    .string()
    .uuid('El ID del reclamo debe ser un UUID válido'),
});
```

**Design decisions:**

1. **Page/PageSize as string transform**: Query params are always strings. Rather than forcing the controller to parse them, the Zod schema uses `transform` + `pipe` to convert `"2"` → `2` and validate it's a positive integer. This matches the pattern used elsewhere in the codebase (e.g., `listarPedidos` in the controller).

2. **Descripcion length limits**: Min 10 chars ensures meaningful complaints. Max 500 chars prevents abuse. These are validated on the backend even though the bot also has its own length validation.

3. **Spanish error messages**: Following the convention that user-facing UI text is in Spanish.

### 5.4 `service.ts`

```typescript
import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';
import type { CrearReclamoInput } from './types.js';

/** POST /reclamos — Create a new reclamo */
export async function crearReclamo(data: CrearReclamoInput) {
  // Validate cliente exists before creating
  const cliente = await prisma.cliente.findUnique({
    where: { id: data.clienteId },
    select: { id: true },
  });
  if (!cliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  const reclamo = await prisma.reclamo.create({
    data: {
      clienteId: data.clienteId,
      descripcion: data.descripcion,
    },
    include: {
      cliente: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          telefono: true,
        },
      },
    },
  });

  return reclamo;
}

/** GET /reclamos — List reclamos with optional clienteId filter */
export async function listarReclamos(params?: {
  clienteId?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (params?.clienteId) {
    where['clienteId'] = params.clienteId;
  }

  const [reclamos, total] = await Promise.all([
    prisma.reclamo.findMany({
      where,
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
          },
        },
      },
      orderBy: { creadoEn: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.reclamo.count({ where }),
  ]);

  return {
    data: reclamos,
    total,
    page,
    pageSize,
  };
}

/** GET /reclamos/:id — Single reclamo */
export async function obtenerReclamo(id: string) {
  const reclamo = await prisma.reclamo.findUnique({
    where: { id },
    include: {
      cliente: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          telefono: true,
        },
      },
    },
  });

  if (!reclamo) {
    throw ApiError.notFound('Reclamo no encontrado');
  }

  return reclamo;
}
```

**Error handling analysis:**

| Scenario | Error thrown | HTTP status | Response body |
|---|---|---|---|
| `crearReclamo` — cliente not found | `ApiError.notFound('Cliente no encontrado')` | 404 | `{ error: { code: 'NOT_FOUND', message: 'Cliente no encontrado', ... } }` |
| `crearReclamo` — invalid clienteId UUID | Zod validation error | 400 | Zod formatted error list |
| `crearReclamo` — descripcion too short | Zod validation error | 400 | `{ error: { code: 'VALIDATION_ERROR', message: '...', details: { descripcion: ['La descripción debe tener al menos 10 caracteres'] } } }` |
| `listarReclamos` — invalid UUID in query | Zod validation error | 400 | Zod formatted error |
| `obtenerReclamo` — not found | `ApiError.notFound('Reclamo no encontrado')` | 404 | `{ error: { code: 'NOT_FOUND', ... } }` |
| `obtenerReclamo` — invalid UUID param | Zod validation error | 400 | Zod formatted error |

**TRADE-OFF: Cliente existence check in `crearReclamo`**

The check `prisma.cliente.findUnique` before `prisma.reclamo.create` is an **extra database round-trip** that could be avoided by relying on the foreign key constraint. However:

- **Why we do it:** Without the explicit check, Prisma throws a raw database constraint violation error (e.g., `Foreign key constraint failed`), which the error handler can't format nicely. The explicit check provides a clean `404` with a meaningful message.
- **Cost:** 1 extra query per POST. Reclamos are low-frequency writes (a few per day per client). The cost is negligible.
- **Alternative:** Use Prisma's `create` without the check and catch the Prisma error, but that couples error handling to Prisma's error format.

### 5.5 `controller.ts`

```typescript
import type { Request, Response, NextFunction } from 'express';
import { crearReclamoSchema, listarReclamosQuerySchema } from './schema.js';
import * as reclamosService from './service.js';
import { sendSuccess, sendList } from '../../utils/response.js';

/** POST /reclamos */
export async function crearController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = crearReclamoSchema.parse(req.body);
    const result = await reclamosService.crearReclamo(data);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

/** GET /reclamos */
export async function listarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = listarReclamosQuerySchema.parse(req.query);
    const { data, total, page, pageSize } = await reclamosService.listarReclamos(query);
    sendList(res, data, total);
  } catch (err) {
    next(err);
  }
}

/** GET /reclamos/:id */
export async function obtenerController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const result = await reclamosService.obtenerReclamo(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
```

**Pattern consistency:** Every controller follows the exact same pattern:
1. `try/catch` wrapping
2. Zod schema `parse` for input validation
3. Service call
4. `sendSuccess` or `sendList` for response formatting
5. `next(err)` passes errors to the global error handler

### 5.6 `routes.ts`

```typescript
import { Router } from 'express';
import {
  listarController,
  obtenerController,
  crearController,
} from './controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';
import { apiKeyAuth } from '../../middleware/api-key-auth.js';

const router = Router();

// Lectura — Admin, repartidor y bot (via apiKey)
router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);

// Escritura — Admin o bot
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), crearController);

export default router;
```

**TRADE-OFF: READ routes not behind `requireRole`**

`GET /` and `GET /:id` are behind `apiKeyAuth + authenticate` but **not** behind `requireRole`. This means any authenticated user (REPARTIDOR, ADMIN, BOT) can list reclamos.

- **Why:** The spec explicitly says "READ endpoints are apiKeyAuth + authenticate — any authenticated user can read". REPARTIDOR needs to see client's reclamos.
- **Risk:** Low — reclamos are not sensitive data (no PII beyond what the client already knows).
- **Alternative:** Add `requireRole('ADMIN', 'REPARTIDOR', 'BOT')` — functionally identical but more explicit. Not needed since the current middleware chain already ensures only authenticated users pass through.

### 5.7 Mount in `app.ts`

**File:** `backend/src/app.ts`

Add import near line 18 (with other feature imports):
```typescript
import reclamosRoutes from './features/reclamos/routes.js';
```

Add mount after `estadisticas` (after line 127):
```typescript
app.use('/api/v1/reclamos', reclamosRoutes);
```

---

## 6. WhatsApp Bot Service Updates

### 6.1 Cancelar URL Change

**File:** `whatsapp-bot/src/services/pedido.service.ts`

```typescript
// Current (line 66):
async cancelar(id: string, motivo: string): Promise<Pedido> {
    const res = await api.patch<ApiResponse<Pedido>>(`/pedidos/${id}/cancelar`, { motivo })
    return res.data.data
}

// Proposed:
async cancelar(id: string, motivo: string): Promise<Pedido> {
    const res = await api.patch<ApiResponse<Pedido>>(`/pedidos/${id}/cancelar-cliente`, { motivo })
    return res.data.data
}
```

**Why this is safe:**
- The `/cancelar` endpoint is repartidor-only (`requireRole('REPARTIDOR')`) — the bot's `x-api-key` auth would be rejected with `403 FORBIDDEN`.
- The new `/cancelar-cliente` endpoint is designed for `ADMIN` and `BOT` roles — the bot's `x-api-key` is now accepted.
- The request payload (`{ motivo }`) is the same Zod schema — no breaking change to the bot's cancelar flow.
- The response shape is different: `/cancelar` returns `{ estado: 'NO_ENTREGADO' }` while `/cancelar-cliente` returns `{ estado: 'CANCELADO' }`. The bot doesn't read the estado from the response — it shows a hardcoded success message. Safe.

**TRADE-OFF: Changing the URL in-place vs. adding a new method**

We could add a new method `cancelarCliente()` and keep `cancelar()` pointing to `/cancelar`. However:
- No existing code calls `cancelar()` successfully (it always gets 403 from the bot's x-api-key). The method is effectively dead code.
- Renaming would be cleaner but adds unnecessary churn — the flow test references `cancelar()` by name.
- **Decision:** In-place URL change. The method signature stays the same.

### 6.2 Reclamo Interface Update

**File:** `whatsapp-bot/src/services/reclamo.service.ts`

```typescript
// Current interface (missing descripcion):
export interface Reclamo {
  id: string
  clienteId: string
  creadoEn: string
  cliente?: Cliente
}

// Proposed — add descripcion:
export interface Reclamo {
  id: string
  clienteId: string
  descripcion: string       // NEW
  creadoEn: string
  cliente?: Cliente
}
```

**Impact analysis:**
- `CrearReclamoInput` already has `descripcion: string` — no change needed.
- `listar()` returns `Reclamo[]` — after the backend migration, every response includes `descripcion`. The interface must match.
- No existing bot code destructures `Reclamo` and omits `descripcion` — the change is non-breaking for all callers.
- The test mock data must include `descripcion`.

### 6.3 Cancelar Flow MOTIVOS Update

**File:** `whatsapp-bot/src/flows/cancelar.flow.ts`

The `MOTIVOS` array must be updated to send client-appropriate values matching the new `cancelarClienteSchema`:

**Current:**
```typescript
const MOTIVOS = [
  { label: 'Ya no necesito el pedido', value: 'OTRO' },
  { label: 'La dirección es incorrecta', value: 'DIRECCION_INCORRECTA' },
  { label: 'No voy a estar para recibir', value: 'CLIENTE_AUSENTE' },
  { label: 'Otro motivo', value: 'OTRO' },
] as const
```

**Proposed:**
```typescript
const MOTIVOS = [
  { label: 'Ya no necesito el pedido', value: 'YA_NO_LO_NECESITA' },
  { label: 'La dirección es incorrecta', value: 'DIRECCION_INCORRECTA' },
  { label: 'No voy a estar para recibir', value: 'CANCELACION_CLIENTE' },
  { label: 'Otro motivo', value: 'OTRO' },
] as const
```

**Why the change:**
- `CLIENTE_AUSENTE` → `CANCELACION_CLIENTE`: The client is canceling because they won't be available. The old name implies the delivery person found the client absent — inappropriate for self-initiated cancellation.
- `OTRO` (first entry) → `YA_NO_LO_NECESITA`: The client's intent is "I no longer need this order." This deserves a dedicated enum value.
- `DIRECCION_INCORRECTA` stays the same: a valid reason for both flows.
- `OTRO` (second entry) stays: catch-all for unspecified reasons.

---

## 7. Testing Architecture

### 7.1 Vitest Configuration

**File:** `whatsapp-bot/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  },
});
```

**Configuration rationale:**
- `globals: true` — allows `describe`, `it`, `expect` without imports, matching the existing backend test convention.
- `environment: 'node'` — the bot runs in Node.js, no DOM.
- **No setupFiles.** The Axios mock is declared per-file in each test's scope (see §7.3). No global setup is needed.
- Exclude pattern: Not needed — `include` is explicit enough. The `tsconfig.json` already excludes `node_modules` and `dist`.

**package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 7.2 tsconfig.json Changes

Remove test file exclusions:

```json
// REMOVE these two lines from "exclude":
"**/*.test.ts",
"**/*.spec.ts",

// Keep:
"exclude": [
  "node_modules",
  "dist",
  "**e2e**",
  "**mock**"
]
```

**TRADE-OFF:** The existing `"**mock**"` exclusion does NOT affect `__mocks__/` directories because Vitest handles mock directories natively. However, if `tsc` strictness is an issue, add `"**/__mocks__/**"` to exclude. Not needed for Vitest runs.

### 7.3 Mock Strategy

#### Axios (`api` module) — Per-File Mock

**No global setup file.** Each service test file declares its own `vi.mock()` call at the top of the file scope. The mock path uses `../../lib/axios.js` which correctly resolves from `src/services/__tests__/` to `src/lib/axios.js`:

```typescript
// In each test file at src/services/__tests__/*.test.ts:
import { vi } from 'vitest';

vi.mock('../../lib/axios.js', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
```

**Why per-file instead of global setup:**
1. **Path resolution correctness:** From a `setupFiles` path like `src/test-setup.ts`, a relative mock path `../lib/axios.js` resolves to `<root>/lib/axios.js` — the wrong filesystem location. From `src/services/__tests__/*.test.ts`, `../../lib/axios.js` correctly resolves to `src/lib/axios.js`, matching the service's own import resolution.
2. **Explicitness:** Each test file declares its own mock. No magic global setup that might silently break.
3. **Vitest `setupFiles` behavior:** These files run before any `import` resolution, and relative path mocks in setup files are resolved relative to the project root, not the test context — making them unreliable for mocking project-internal relative imports.
4. **Maintainability:** If a specific test file ever needs to bypass or customize the mock, it can simply omit or override `vi.mock()`.

**Per-test usage pattern:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

// Helper to access the mocked api for assertions
async function getMockedApi() {
  const { api } = await import('../../lib/axios.js');
  return api as unknown as Record<string, Mock>;
}

// In each test:
const api = await getMockedApi();
api.get.mockResolvedValueOnce({ data: { data: mockData, total: 1 } });
```

#### Mock response shapes

| Scenario | Shape |
|---|---|
| Successful GET (single) | `{ data: { data: { id: '...', ... } } }` |
| Successful GET (list) | `{ data: { data: [{ id: '...', ... }], total: 1 } }` |
| Successful POST/PATCH | `{ data: { data: { id: '...', ... } } }` |
| API error | `{ response: { data: { error: { code: 'NOT_FOUND', message: '...', timestamp: '...' } } } }` |
| Network error | `{ code: 'ECONNREFUSED', message: 'connect ECONNREFUSED 127.0.0.1:3000' }` |
| Timeout error | `{ code: 'ECONNABORTED', message: 'timeout of 10000ms exceeded' }` |

#### BuilderBot (for flow tests)

**Strategy:** Do NOT mock `@builderbot/bot` as a module. Instead, **extract and test the action handlers directly.**

**Why not mock the full BuilderBot framework?**
- `addKeyword` returns a deeply chainable object with `.addAction()`, `.addAnswer()` that return themselves
- Flows have 6-8 chained calls — mocking the chain is fragile and high-effort
- The real value is testing the **callbacks** (the async functions passed to `.addAction()` and `.addAnswer()`)
- The `api` Axios mock is available in every service test via `vi.mock()` (see §7.3) — no need to mock at the framework level

**Testing pattern for action handlers:**

```typescript
// For a handler like this in cancelar.flow.ts:
async (ctx, { state, fallBack }) => { ... }

// Test it by invoking the handler directly with mock objects:
const mockCtx = { from: '541122334455', body: 'SI' };
const mockState = {
  update: vi.fn(),
  get: vi.fn().mockResolvedValue({ /* state data */ }),
  clear: vi.fn(),
};
const mockFlowDynamic = vi.fn();
const mockGotoFlow = vi.fn();
const mockFallBack = vi.fn();
const mockCtxProvider = vi.fn();

// The handler function is the 3rd argument of addAnswer/addAction
// In the test, we invoke it directly:
await handler(mockCtx, {
  state: mockState,
  flowDynamic: mockFlowDynamic,
  gotoFlow: mockGotoFlow,
  fallBack: mockFallBack,
});
```

### 7.4 Test File Structure & Naming Conventions

```
whatsapp-bot/src/
├── services/
│   ├── __tests__/                  ← Test files co-located with source
│   │   ├── cliente.service.test.ts
│   │   ├── pedido.service.test.ts
│   │   ├── item.service.test.ts
│   │   └── reclamo.service.test.ts
│   ├── cliente.service.ts
│   ├── pedido.service.ts
│   ├── item.service.ts
│   └── reclamo.service.ts
├── flows/
│   ├── __tests__/                  ← Flow tests
│   │   ├── alta.flow.test.ts       (integration-style — 20 test cases)
│   │   ├── cancelar.flow.test.ts   (integration-style — 13 test cases)
│   │   ├── pedido.flow.smoke.test.ts
│   │   ├── reclamo.flow.smoke.test.ts
│   │   ├── baja.flow.smoke.test.ts
│   │   └── welcome.flow.smoke.test.ts
│   ├── alta.flow.ts
│   ├── cancelar.flow.ts
│   └── ...
```
**Note:** No `test-setup.ts` or `__mocks__/` directory — the Axios mock is declared per-file within each test's scope via `vi.mock()` (see §7.3).

**Naming conventions:**
- Service tests: `<service>.test.ts` — full unit test coverage
- Flow integration tests: `<flow>.flow.test.ts` — full handler sequence testing
- Flow smoke tests: `<flow>.flow.smoke.test.ts` — minimal (2-3 tests)

**TRADE-OFF: Tests in `__tests__/` vs next to source**

The backend uses `__tests__/` directories. The bot should follow the same convention for consistency. Both Vitest and TypeScript handle this without configuration.

### 7.5 Service Test Structure (all 4 files)

Each service test file follows this pattern:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

// Mock the axios module — must be at top level before any imports
vi.mock('../../lib/axios.js', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Helper to access mocked api
async function getMockedApi() {
  const { api } = await import('../../lib/axios.js');
  return api as unknown as Record<string, Mock>;
}

describe('ClienteService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listar returns parsed clients', async () => { /* ... */ });
  it('listar with phone filter sends params', async () => { /* ... */ });
  // ... etc for getErrorMessage variants
});
```

**Test cases per service (from spec):**

| Service | Test cases | Lines (est.) |
|---|---|---|
| `cliente.service.test.ts` | 8 (5 success + 3 error) | ~120 |
| `pedido.service.test.ts` | 8 (5 success + 3 error) | ~120 |
| `item.service.test.ts` | 5 (2 success + 3 error) | ~80 |
| `reclamo.service.test.ts` | 6 (3 success + 3 error) | ~100 |

### 7.6 Flow Tests Testing Strategy

**Testing handlers without BuilderBot:**

The key insight: every `addAction` and `addAnswer` callback has the same signature:

```typescript
(ctx: { from: string; body: string }, 
 { state, flowDynamic, gotoFlow, fallBack }: { 
   state: { update: Function; get: Function; clear: Function }; 
   flowDynamic: Function; 
   gotoFlow: Function; 
   fallBack: Function; 
 }) => Promise<void>
```

To test a flow:
1. Import the handler function (extract it from the chain, or re-define it in the test)
2. Call it with mock `ctx`, `state`, `flowDynamic`, etc.
3. Assert that `state.update` was called with expected data, or `flowDynamic` was called with expected text, or `gotoFlow` was called with the noRegistradoFlow reference

**Alternative approach (less invasive):** Instead of extracting handlers, the test can access the exported `cancelarFlow` object and indirectly test it by calling the handlers. But extracting handlers means the production code stays clean and the test is simpler.

**Decision for this design:** Tests will invoke the handler callbacks directly by extracting them as named functions in the test file (mirroring the production flow's structure). This avoids modifying production flows for testability.

---

## 8. Implementation Order & Dependencies

### Dependency Graph

```
Phase 1 (Schema + Backend Auth)
├── 1.1 Add BOT to Rol enum
│   └── 1.1.1 Run migration add_bot_role
│       └── 1.1.2 Run prisma generate
├── 1.2 Update clientes/routes.ts
├── 1.3 Update pedidos/routes.ts
├── 1.4 Add cancelarClienteController to controller.ts
├── 1.5 Add cancelarPedidoCliente to service.ts
└── 1.6 Add cancelarClienteSchema to pedidos/schema.ts
│
├───┐
    │
    ▼
Phase 2 (Reclamos API)
├── 2.1 Add descripcion to Reclamo model
│   └── 2.1.1 Run migration add_descripcion_to_reclamo
│       └── 2.1.2 Run prisma generate
├── 2.2 Create reclamos/types.ts
├── 2.3 Create reclamos/schema.ts
├── 2.4 Create reclamos/service.ts
├── 2.5 Create reclamos/controller.ts
├── 2.6 Create reclamos/routes.ts
├── 2.7 Mount in app.ts
└── 2.8 Update admin controller — add `descripcion: ''` to `create()`
│       └── File: src/admin/controllers/reclamos.admin.controller.ts
│
├───┐
    │
    ▼
Phase 3 (Bot Service Updates) ──┐
├── 3.1 Update pedido.service.ts │ (No dependency on Phase 2)
├── 3.2 Update reclamo.service.ts│
├── 3.3 Update cancelar.flow.ts —│
│       MOTIVOS values           │
├───┐                           │
    │                           │
    ▼                           ▼
Phase 4 (Testing Infrastructure)
├── 4.1 npm install --save-dev vitest
├── 4.2 Create vitest.config.ts
└── 4.3 Update tsconfig.json
    │
    ▼
Phase 5 (Service Tests)
├── 5.1 cliente.service.test.ts
├── 5.2 pedido.service.test.ts
├── 5.3 item.service.test.ts
├── 5.4 reclamo.service.test.ts
└── 5.5 npm test — all pass
    │
    ▼
Phase 6 (Flow Tests)
├── 6.1 alta.flow.test.ts
├── 6.2 cancelar.flow.test.ts
├── 6.3 4 smoke test files
└── 6.4 npm test — all pass
```

### What can be parallelized

| Tasks | Can run in parallel? | Reason |
|---|---|---|
| Phase 1.1 (enum migration) + Phase 2.1 (descripcion migration) | ✅ Yes | Both are Prisma schema changes affecting different parts of the schema. No dependency between enum and model field. |
| Phase 1.2-1.6 (route + schema changes) + Phase 2.2-2.7 (reclamos feature) | ✅ Yes | These touch different files. Phase 1 changes `clientes/routes.ts`, `pedidos/routes.ts`, `pedidos/controller.ts`, `pedidos/service.ts`, `pedidos/schema.ts`. Phase 2 creates `reclamos/*` files and mounts them in `app.ts`. No overlap. |
| Phase 3 (bot service updates) + Phase 4 (testing infra) | ✅ Yes | Phase 3 changes bot source code. Phase 4 adds test infrastructure. No overlap. |
| Phase 5 (service tests) + Phase 6 (flow tests) | ❌ No | Flow tests depend on service mocks established in Phase 5. |

**Recommended parallel execution:**
- **Track 1 (backend):** Phase 1 → Phase 2 → backend verification
- **Track 2 (bot + tests):** Phase 3 + Phase 4 (parallel) → Phase 5 → Phase 6
- **Merge:** Bot verification after both tracks complete

### Time Estimates (refined)

| Phase | Tasks | Est. time | Dependencies |
|---|---|---|---|
| Phase 1: Schema + Backend Auth | BOT enum, routes, schema, controller, service | ~35 min | None |
| Phase 2: Reclamos API | 5 new files + migration + mount | ~45 min | None (parallel with P1) |
| Phase 3: Bot Service Updates | 3 files (URL change + interface + MOTIVOS) | ~15 min | None |
| Phase 4: Testing Infrastructure | vitest, config, setup | ~20 min | None |
| Phase 5: Service Tests | 4 files | ~40 min | Phase 3, Phase 4 |
| Phase 6: Flow Tests | 2 integration + 4 smoke | ~50 min | Phase 4, Phase 5 |

**Total backend:** ~1.3 hours (Phase 1 + Phase 2)
**Total bot+test:** ~1.6 hours (Phase 3 + Phase 4 + Phase 5 + Phase 6)
**Total wall clock (parallel):** ~2.5 hours

---

## 9. Security Analysis

### 9.1 How `apiKeyAuth + BOT` Prevents Privilege Escalation

The auth chain is designed with **defense in depth**:

#### Layer 1: API Key Auth

```typescript
// api-key-auth.ts
req.user = {
  userId: 'bot',
  email: 'bot@supplycycle.com',
  rol: 'BOT',
} as any;
```

The API key authentication hardcodes the role to `BOT`. Even if someone steals the `BOT_API_KEY`:
- They can only act as `BOT`, not `ADMIN` or `REPARTIDOR`
- `BOT` is explicitly excluded from sensitive routes (DELETE, confirmar, cancelar)

#### Layer 2: Role-Based Access Control

Each route explicitly lists which roles are allowed. The bot's `BOT` role is only added to routes the bot needs:

```typescript
// Routes BOT can access:
requireRole('ADMIN', 'BOT')      // POST/PATCH clientes, POST reclamos, cancelar-cliente
requireRole('ADMIN', 'REPARTIDOR', 'BOT')  // POST pedidos, items

// Routes BOT CANNOT access:
requireRole('ADMIN')              // DELETE clientes, DELETE pedidos, DELETE items
requireRole('REPARTIDOR')         // confirmar, cancelar (repartidor)
```

#### Attack Scenarios

| Attack | Mitigation |
|---|---|
| **BOT_API_KEY leaked** | Attacker can only create clients/orders, cancel orders, and file reclamos — all as `BOT` role. Cannot delete, cannot confirm deliveries, cannot access admin features. |
| **BOT_API_KEY brute-forced** | Not applicable — API keys are fixed strings, not user credentials. The key is a high-entropy UUID-like string stored in env vars. |
| **JWT stolen (ADMIN token)** | Admin routes still work for the attacker. This is outside the scope of this change — the existing JWT security model applies. |
| **x-api-key + Authorization both sent** | `apiKeyAuth` runs first, sets `rol: 'BOT'`. `authenticate` sees `req.user` exists and returns early — the JWT is never decoded. The attacker cannot escalate from `BOT` to a higher role by sending both. |
| **BOT tries to call `POST /pedidos` with `domicilioId` of another client** | This is a business logic concern, not an auth concern. The `crearPedido` service validates that the domicilio exists — it doesn't validate ownership. Pre-existing behavior, not addressed by this change. |

#### Why the API key is not a bypass mechanism

The `apiKeyAuth` middleware is **not a bypass** — it's an **alternative authentication path** that results in a **restricted role** (`BOT`). Every subsequent middleware still checks the role. This is the key architectural insight:

```
apiKey → BOT role (restricted) → requireRole checks → access control
JWT    → ADMIN/REPARTIDOR role → requireRole checks → access control
```

### 9.2 DELETE Routes Security

Three DELETE routes remain ADMIN-only:

1. `DELETE /api/v1/clientes/:id` — Bot uses `PATCH { activo: false }` (soft delete)
2. `DELETE /api/v1/pedidos/:id` — Bot never hard-deletes orders
3. `DELETE /api/v1/pedidos/:pedidoId/items/:itemId` — Bot creates orders with items, doesn't remove individual items

**Why not soft-delete through DELETE routes?** The bot's `baja` flow sends `PATCH { activo: false }`, not `DELETE`. The DELETE route would hard-delete (or soft-delete via `deletedAt`), but the distinction is intentional: deactivation is a state change, not a deletion.

### 9.3 Bot Cannot Escalate to REPARTIDOR

Even though `POST /pedidos` includes `REPARTIDOR` in the allowed roles list, the bot's `rol: 'BOT'` means:

```
requireRole('ADMIN', 'REPARTIDOR', 'BOT')
→ checks: ['ADMIN', 'REPARTIDOR', 'BOT']
→ req.user.rol: 'BOT'
→ BOT is in the list → ALLOWED
```

The bot does NOT become a REPARTIDOR. It's simply included in the allowed set. If we wanted to exclude the bot from a specific endpoint that currently allows REPARTIDOR, we'd need to refactor `requireRole` to support exclusion patterns — not necessary for this change.

---

## 10. Backward Compatibility Analysis

### 10.1 Existing Users: ADMIN

**No changes.** All routes that previously allowed ADMIN still allow ADMIN:

| Route | Before | After | ADMIN affected? |
|---|---|---|---|
| `POST /clientes` | `requireRole('ADMIN')` | `requireRole('ADMIN', 'BOT')` | ✅ No — ADMIN still in list |
| `PATCH /clientes/:id` | `requireRole('ADMIN')` | `requireRole('ADMIN', 'BOT')` | ✅ No |
| `DELETE /clientes/:id` | `requireRole('ADMIN')` | `requireRole('ADMIN')` | ✅ No |
| `POST /pedidos` | `requireRole('ADMIN', 'REPARTIDOR')` | `requireRole('ADMIN', 'REPARTIDOR', 'BOT')` | ✅ No |
| `PATCH /:id/estado` | `requireRole('ADMIN', 'REPARTIDOR')` | `requireRole('ADMIN', 'REPARTIDOR')` | ✅ No |
| `DELETE /:id` | `requireRole('ADMIN', 'REPARTIDOR')` | `requireRole('ADMIN')` | ✅ No |
| Items management | `requireRole('ADMIN', 'REPARTIDOR')` | Various (see §3.2) | ✅ No |
| `PATCH /:id/cancelar-cliente` | (does not exist) | `requireRole('ADMIN', 'BOT')` | ✅ New route — no existing caller |
| `POST /reclamos` | (does not exist) | `requireRole('ADMIN', 'BOT')` | ✅ New feature |
| `GET /reclamos` | (does not exist) | `apiKeyAuth, authenticate` | ✅ New feature |

### 10.2 Existing Users: REPARTIDOR

**Two changes where REPARTIDOR was removed:**

| Route | Before | After | REPARTIDOR affected? |
|---|---|---|---|
| `DELETE /:id` | `requireRole('ADMIN', 'REPARTIDOR')` | `requireRole('ADMIN')` | ⚠️ **REPARTIDOR removed** |
| `DELETE /:pedidoId/items/:itemId` | `requireRole('ADMIN', 'REPARTIDOR')` | `requireRole('ADMIN')` | ⚠️ **REPARTIDOR removed** |

**Risk assessment for REPARTIDOR removal:**
- No mobile app code calls these DELETE routes (mobile uses `/confirmar`, `/cancelar`)
- If a REPARTIDOR needs to delete an order, they can use the cancel flow (`PATCH /:id/cancelar`) which sets `NO_ENTREGADO`
- Removing `REPARTIDOR` from DELETE is a **security tightening**, not a breaking change for current workflows

**If backward compatibility is absolutely required:** Keep `REPARTIDOR` in the DELETE routes. The design allows it with zero cost. The spec explicitly removes it for security reasons.

### 10.3 Existing Tests

| Test file | Why it passes unchanged |
|---|---|
| `clientes.service.test.ts` | Mocks Prisma directly — tests don't touch middleware |
| `clientes.controller.test.ts` | Mocks service — tests don't touch middleware |
| `pedidos.service.test.ts` | Mocks Prisma directly — tests don't touch middleware |
| `auth.service.test.ts` | Auth is unchanged |
| `auth.controller.test.ts` | Auth is unchanged |
| `auth.middleware.test.ts` | Auth middleware unchanged (apiKeyAuth was already tested) |
| `estadisticas.service.test.ts` | Estadisticas unchanged |
| `estadisticas.controller.test.ts` | Estadisticas unchanged |
| `usuarios.service.test.ts` | Usuarios unchanged |

**No existing tests need modification.** All changes are additive or restrictive (REMOVING roles rather than adding unexpected ones).

### 10.4 Prisma Schema

| Change | Existing data affected? | Migration rollback |
|---|---|---|
| Add `BOT` to `Rol` enum | ❌ No — additive enum member | `prisma migrate diff` + manual revert |
| Add `descripcion` to `Reclamo` | ❌ No — new nullable column for existing rows | `prisma migrate diff` + manual revert |

### 10.5 WhatsApp Bot

| Change | Existing flows affected? |
|---|---|
| Cancelar URL `/cancelar-cliente` | ⚠️ Yes — but this is a **fix**, not a break. The old URL never worked (got 403). All existing bot users would have seen "something went wrong" when trying to cancel. |
| Reclamo interface `descripcion` | ❌ No — `CrearReclamoInput` already has it. Adding to `Reclamo` interface is non-breaking for all callers. |

---

## 11. Key Design Decisions Summary

| # | Decision | Rationale | Trade-off |
|---|---|---|---|
| 1 | `cancelar-cliente` as NEW endpoint, not reuse `/cancelar` | Cancel semantic differs (CANCELADO vs NO_ENTREGADO). Existing repartidor flow uses auto-completar-reparto. | More routes, but clearer semantics. |
| 2 | New `cancelarClienteSchema` (Zod) for client cancellation | Client-initiated reasons differ from repartidor delivery-failure reasons. CLIENTE_AUSENTE and ACCESO_DENEGADO don't apply when the client cancels. | Two schemas to maintain. If a reason should be shared across both, extract the common subset. |
| 3 | No `autoCompletarRepartoSiCorresponde` in `cancelarPedidoCliente` | Client cancellations shouldn't trigger reparto completion — the reparto might still be in progress. | If the last pedido in a reparto is cancelled via client, the reparto stays PENDIENTE. Admin must manually complete it. |
| 4 | READ reclamos behind `apiKeyAuth + authenticate` only (no requireRole) | Any authenticated user can read. Simpler, less middleware. | REPARTIDOR can see all reclamos. Acceptable — not sensitive data. |
| 5 | Per-file `vi.mock()` in each service test | Path resolution is correct from `__tests__/` context. Explicit mock declaration per test file. Avoids Vitest `setupFiles` relative-path pitfalls. | Slight repetition of mock factory across 4 files. A shared mock factory helper could reduce duplication. |
| 6 | Flow tests invoke handlers directly (no BuilderBot mock) | Mocking BuilderBot chain is fragile. Handler callbacks have clean signatures. | Handler functions aren't exported from production code — tests redefine them. Some duplication vs production. |
| 7 | Remove `REPARTIDOR` from DELETE routes | Security tightening. No existing caller uses these as REPARTIDOR. | If a future feature needs it, role must be re-added. Low risk. |

---

## 12. Complete File Change Manifest

### Backend (15 files)

| # | File | Action |
|---|---|---|
| 1 | `prisma/schema.prisma` | Modify — add `BOT` to `Rol`, add `descripcion` to `Reclamo` |
| 2 | `prisma/migrations/..._add_bot_role/` | New — migration |
| 3 | `prisma/migrations/..._add_descripcion_to_reclamo/` | New — migration |
| 4 | `src/features/clientes/routes.ts` | Modify — add apiKeyAuth + BOT to POST, PATCH |
| 5 | `src/features/pedidos/routes.ts` | Modify — add apiKeyAuth + BOT to POST, items; add cancelar-cliente route; remove REPARTIDOR from DELETE |
| 6 | `src/features/pedidos/schema.ts` | Modify — add `cancelarClienteSchema` |
| 7 | `src/features/pedidos/controller.ts` | Modify — add `cancelarClienteController` |
| 8 | `src/features/pedidos/service.ts` | Modify — add `cancelarPedidoCliente` |
| 9 | `src/features/reclamos/types.ts` | **New** |
| 10 | `src/features/reclamos/schema.ts` | **New** |
| 11 | `src/features/reclamos/service.ts` | **New** |
| 12 | `src/features/reclamos/controller.ts` | **New** |
| 13 | `src/features/reclamos/routes.ts` | **New** |
| 14 | `src/app.ts` | Modify — mount `/api/v1/reclamos` |
| 15 | `src/admin/controllers/reclamos.admin.controller.ts` | Modify — add `descripcion: ''` to `create()` method |

### WhatsApp Bot (16 files)

| # | File | Action |
|---|---|---|
| 1 | `package.json` | Modify — add vitest + test scripts |
| 2 | `vitest.config.ts` | **New** |
| 3 | `tsconfig.json` | Modify — remove test exclusions |
| 4 | `src/services/pedido.service.ts` | Modify — cancelar URL to `/cancelar-cliente` |
| 5 | `src/services/reclamo.service.ts` | Modify — add `descripcion` to `Reclamo` interface |
| 6 | `src/flows/cancelar.flow.ts` | Modify — update `MOTIVOS` values for `cancelarClienteSchema` |
| 7 | `src/services/__tests__/cliente.service.test.ts` | **New** |
| 8 | `src/services/__tests__/pedido.service.test.ts` | **New** |
| 9 | `src/services/__tests__/item.service.test.ts` | **New** |
| 10 | `src/services/__tests__/reclamo.service.test.ts` | **New** |
| 11 | `src/flows/__tests__/alta.flow.test.ts` | **New** |
| 12 | `src/flows/__tests__/cancelar.flow.test.ts` | **New** |
| 13 | `src/flows/__tests__/pedido.flow.smoke.test.ts` | **New** |
| 14 | `src/flows/__tests__/reclamo.flow.smoke.test.ts` | **New** |
| 15 | `src/flows/__tests__/baja.flow.smoke.test.ts` | **New** |
| 16 | `src/flows/__tests__/welcome.flow.smoke.test.ts` | **New** |

**Total: 31 files changed (15 backend + 16 bot)**
