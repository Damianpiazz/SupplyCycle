# SDD Spec: WhatsApp Bot ↔ Backend Integration

**Change name:** `whatsapp-backend-integration`
**Status:** Specified
**Author:** SDD Spec (via engram)
**Date:** 2026-07-23
**Based on:** `docs/whatsapp-backend-integration/proposal.md`

---

## 0. Auto-Resolved Open Questions

The proposal left 3 open questions. These are resolved as follows and are FINAL:

1. **Cancel semantics** → Create NEW lightweight endpoint `PATCH /api/v1/pedidos/:id/cancelar-cliente` for client/bot cancellations. Sets `estado = CANCELADO`. Does NOT trigger `autoCompletarRepartoSiCorresponde`. Existing `PATCH /:id/cancelar` remains for repartidor use (NO_ENTREGADO).

2. **BOT role on actualizarEstadoController** → Deferred. Do NOT add BOT. The bot does not need this endpoint now.

3. **Flow test depth** → Write BOTH:
   - 4 service test files (simple unit tests)
   - 2 integration-style flow tests (alta, cancelar)
   - 4 smoke tests for remaining flows (pedido, reclamo, baja, welcome)

---

## 1. Prisma Schema Changes

### 1.1 Add `BOT` to `Rol` enum

```prisma
enum Rol {
  REPARTIDOR
  ADMIN
  BOT           // NEW
}
```

**Migration name:** `add_bot_role`
**Impact on existing code:** None — additive enum value. All existing `Rol` columns (in Usuario table) remain unchanged.

### 1.2 Add `descripcion` to `Reclamo` model

```prisma
model Reclamo {
  id          String   @id @default(uuid())
  clienteId   String
  descripcion String   // NEW — required, no default, free-text complaint description
  creadoEn    DateTime @default(now())
  cliente     Cliente  @relation(fields: [clienteId], references: [id])
}
```

**Migration name:** `add_descripcion_to_reclamo`
**Impact on existing code:** The admin EJS controller (`admin/controllers/reclamos.controller.ts`) already writes `clienteId` but not `descripcion`. After this migration, existing rows will have `NULL` descripcion. The admin create form must be updated to include a descripcion field. The admin list view should also display the new column. **Note:** The admin controller change is out of scope for this spec (separate task), but the migration handles existing rows gracefully (nullable column via `prisma migrate` — Prisma adds the column as nullable for existing data).

### 1.3 Migration order

1. Run `npx prisma migrate dev --name add_bot_role` — additive enum change
2. Run `npx prisma migrate dev --name add_descripcion_to_reclamo` — additive field change
3. Run `npx prisma generate` — regenerate Prisma client

Order is arbitrary (no dependency between the two changes), but keeping them separate makes rollback easier.

---

## 2. Auth Integration Pattern

### 2.1 How `apiKeyAuth + authenticate + requireRole` chains

The middleware chain executes left-to-right:

```
router.patch('/:id', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), controller);
```

#### Step 1: `apiKeyAuth` (src/middleware/api-key-auth.ts)
- Reads `x-api-key` header from request
- If header is ABSENT → silently calls `next()` (passes through)
- If header is PRESENT and valid → sets `req.user = { userId: 'bot', email: 'bot@supplycycle.com', rol: 'BOT' }`, calls `next()`
- If header is PRESENT and INVALID → responds 401 `{ error: { code: 'INVALID_API_KEY', message: 'API Key inválida' } }`
- If BOT_API_KEY env var is not configured → responds 500

#### Step 2: `authenticate` (src/middleware/auth.middleware.ts)
- FIRST: checks `if (req.user) return next()` — if apiKeyAuth already set the user, passes through immediately (no JWT check)
- SECOND (no apiKey): checks `Authorization: Bearer <token>` header
- Valid JWT → sets `req.user` from token payload, calls `next()`
- Invalid/missing/expired token → responds 401

#### Step 3: `requireRole(...)` (src/middleware/auth.middleware.ts)
- Checks `req.user.rol` against the allowed roles list
- If the user's role is in the list → calls `next()`
- If NOT → responds 403 `{ error: { code: 'FORBIDDEN', message: 'No tiene permisos para esta acción' } }`

#### Precedence summary

| Request type | apiKeyAuth | authenticate | requireRole | Result |
|---|---|---|---|---|
| JWT + ADMIN | Pass-through | Sets user from JWT | Checks ADMIN | ✅ Works if ADMIN |
| JWT + REPARTIDOR | Pass-through | Sets user from JWT | Checks ADMIN, BOT | ❌ 403 (REPARTIDOR not in list) |
| x-api-key + BOT | Sets req.user | Pass-through via `req.user` | Checks ADMIN, BOT | ✅ Works if BOT in list |
| No auth | Pass-through | 401 'Token no proporcionado' | Never reached | ❌ 401 |

### 2.2 Which routes get `apiKeyAuth`

**Rule:** Every route that the bot calls gets `apiKeyAuth` prepended. Routes that are ADMIN-only and NOT called by the bot (DELETE clientes, DELETE items) do NOT get `apiKeyAuth` — they remain JWT-only.

### 2.3 Why DELETE routes remain ADMIN-only

- `DELETE /api/v1/clientes/:id` — only ADMIN. The bot uses `PATCH { activo: false }` for deactivation (soft delete).
- `DELETE /api/v1/pedidos/:id` — only ADMIN. The bot never hard-deletes orders.
- `DELETE /api/v1/pedidos/:pedidoId/items/:itemId` — only ADMIN. The bot creates orders with items, it doesn't remove individual items.

---

## 3. Clientes Route Changes

**File:** `backend/src/features/clientes/routes.ts`

### Current
```typescript
// Rutas admin-only
router.post('/', authenticate, requireRole('ADMIN'), crearController);
router.patch('/:id', authenticate, requireRole('ADMIN'), actualizarController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarController);
```

### Proposed
```typescript
// Rutas admin-only or bot (via api key)
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), crearController);
router.patch('/:id', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), actualizarController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarController);
```

**Changes:**
- POST: Add `apiKeyAuth` before `authenticate`, add `'BOT'` to `requireRole`
- PATCH: Same as POST
- DELETE: No change — remains ADMIN-only (bot deactivates via PATCH with `{ activo: false }`)

**Import note:** `apiKeyAuth` is already imported at line 13. No import changes needed.

---

## 4. Pedidos Route Changes

**File:** `backend/src/features/pedidos/routes.ts`

### 4.1 Current routes (full file)
```typescript
router.get('/hoy', apiKeyAuth, authenticate, obtenerHoyController);
router.get('/disponibles', authenticate, requireRole('ADMIN'), obtenerDisponiblesController);
router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);

router.post('/', authenticate, requireRole('ADMIN', 'REPARTIDOR'), crearController);
router.patch('/:id/estado', authenticate, requireRole('ADMIN', 'REPARTIDOR'), actualizarEstadoController);
router.delete('/:id', authenticate, requireRole('ADMIN', 'REPARTIDOR'), eliminarPedidoController);

router.post('/:pedidoId/items', authenticate, requireRole('ADMIN', 'REPARTIDOR'), agregarItemController);
router.patch('/:pedidoId/items/:itemId', authenticate, requireRole('ADMIN', 'REPARTIDOR'), actualizarCantidadItemController);
router.delete('/:pedidoId/items/:itemId', authenticate, requireRole('ADMIN', 'REPARTIDOR'), quitarItemController);

router.patch('/:id/confirmar', authenticate, requireRole('REPARTIDOR'), confirmarController);
router.patch('/:id/cancelar', authenticate, requireRole('REPARTIDOR'), cancelarRepartidorController);
```

### 4.2 Proposed routes

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

### 4.3 Changes summary

| Route | apiKeyAuth added? | Roles changed? | Notes |
|---|---|---|---|
| GET /hoy | Already has it | — | No change |
| GET /disponibles | No | ADMIN only | Bot doesn't need it |
| GET / | Already has it | — | No change |
| GET /:id | Already has it | — | No change |
| POST / | **YES** | **+BOT** | Bot creates orders |
| PATCH /:id/estado | **NO** (deferred) | — | No change |
| DELETE /:id | **NO** | **-REPARTIDOR** | Bot: never; Repartidor: should not soft-delete (use cancelar flow) |
| POST /:pedidoId/items | **YES** | **+BOT** | Bot adds items to new orders |
| PATCH /:pedidoId/items/:itemId | **YES** | **+BOT** | Bot adjusts quantities |
| DELETE /:pedidoId/items/:itemId | **NO** | **ADMIN only** | Bot doesn't remove individual items |
| PATCH /:id/confirmar | No change | No change | Still REPARTIDOR-only |
| PATCH /:id/cancelar | No change | No change | Still REPARTIDOR-only |
| **NEW**: /:id/cancelar-cliente | **YES** | **ADMIN, BOT** | New endpoint |

### 4.4 New: `cancelarClienteController`

**File:** `backend/src/features/pedidos/controller.ts`

Add new controller:

```typescript
/** PATCH /pedidos/:id/cancelar-cliente — PENDIENTE → CANCELADO (cliente/bot) */
export async function cancelarClienteController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const { motivo } = cancelarPedidoSchema.parse(req.body);
    const result = await pedidosService.cancelarPedidoCliente(id, motivo);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
```

**Export this** from controller.ts alongside existing exports.

### 4.5 New: `cancelarPedidoCliente` service

**File:** `backend/src/features/pedidos/service.ts`

Add new service method:

```typescript
/** PATCH /pedidos/:id/cancelar-cliente — PENDIENTE → CANCELADO (cliente/bot, no auto-completa reparto) */
export async function cancelarPedidoCliente(id: string, motivo: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  if (pedido.estado !== 'PENDIENTE') {
    throw ApiError.conflict('Solo se pueden cancelar pedidos en estado pendiente');
  }

  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: 'CANCELADO', motivoFalla: motivo },
  });

  // NOTE: Intentionally does NOT call autoCompletarRepartoSiCorresponde.
  // Client cancellations should not auto-complete the reparto flow.
  // The reparto completion is triggered by repartidor actions only.

  return {
    id: updated.id,
    estado: 'CANCELADO' as const,
    motivoFalla: updated.motivoFalla!,
    actualizadoEn: updated.actualizadoEn.toISOString(),
  };
}
```

### 4.6 Import addition for routes.ts

The new `cancelarClienteController` must be added to the import list in `routes.ts`:
```typescript
import {
  // ... existing imports ...
  cancelarClienteController,
} from './controller.js';
```

### 4.7 Bot service URL change

**File:** `whatsapp-bot/src/services/pedido.service.ts`

The `cancelar` method must change its URL from `/pedidos/${id}/cancelar` to `/pedidos/${id}/cancelar-cliente`:

```typescript
// Current:
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

---

## 5. New Reclamos Feature

### 5.1 File structure

```
backend/src/features/reclamos/
├── types.ts
├── schema.ts
├── service.ts
├── controller.ts
└── routes.ts
```

### 5.2 `types.ts`

```typescript
import type { Reclamo } from '@prisma/client';

// Re-export for convenience. No custom types needed unless we extend.
export type { Reclamo };
```

### 5.3 `schema.ts`

```typescript
import { z } from 'zod';

export const crearReclamoSchema = z.object({
  clienteId: z.string().uuid('El ID del cliente debe ser un UUID válido'),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede superar los 500 caracteres'),
});

export const listarReclamosQuerySchema = z.object({
  clienteId: z.string().uuid('El ID del cliente debe ser un UUID válido').optional(),
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
  id: z.string().uuid('El ID del reclamo debe ser un UUID válido'),
});
```

**Naming note:** The proposal had `crearReclamaSchema` — this is a typo. The correct name is `crearReclamoSchema` (with 'o', matching the Spanish noun "reclamo").

### 5.4 `service.ts`

```typescript
import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/api-error.js';
import type { CrearReclamoInput } from './types.js';

/** POST /reclamos — Create a new reclamo */
export async function crearReclamo(data: CrearReclamoInput) {
  // Validate cliente exists
  const cliente = await prisma.cliente.findUnique({
    where: { id: data.clienteId },
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

### 5.6 `routes.ts`

```typescript
import { Router } from 'express';
import {
  listarController,
  obtenerController,
  crearController,
} from './controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/auth.middleware.js';
import { apiKeyAuth } from '../../middleware/api-key-auth.js';

const router = Router();

// Lectura — Admin, repartidor y bot (via apiKey)
router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);

// Escritura — Admin o bot
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), crearController);

export default router;
```

### 5.7 Mount in `app.ts`

**File:** `backend/src/app.ts`

Add import:
```typescript
import reclamosRoutes from './features/reclamos/routes.js';
```

Add mount after existing API v1 routes (line 127, after estadisticas):
```typescript
app.use('/api/v1/reclamos', reclamosRoutes);
```

### 5.8 Bot Reclamo type update

**File:** `whatsapp-bot/src/services/reclamo.service.ts`

The `Reclamo` interface currently does NOT include `descripcion`. It must be added:

```typescript
export interface Reclamo {
  id: string
  clienteId: string
  descripcion: string       // ADD
  creadoEn: string
  cliente?: Cliente
}
```

The `CrearReclamoInput` already has `descripcion` — no change needed there.

---

## 6. WhatsApp Bot Test Changes

### 6.1 Bot service file changes (summary)

| File | Change |
|---|---|
| `whatsapp-bot/src/services/pedido.service.ts` | Update cancelar URL: `/pedidos/${id}/cancelar-cliente` |
| `whatsapp-bot/src/services/reclamo.service.ts` | Add `descripcion: string` to `Reclamo` interface |

---

## 7. WhatsApp Bot Testing Infrastructure

### 7.1 Install Vitest

```bash
cd whatsapp-bot
npm install --save-dev vitest
```

Add test scripts to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 7.2 Create `vitest.config.ts`

**File:** `whatsapp-bot/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
  },
});
```

### 7.3 Update `tsconfig.json`

**File:** `whatsapp-bot/tsconfig.json`

Remove these lines from the `exclude` array:
```json
"**/*.test.ts",
"**/*.spec.ts",
```

Current exclude (lines 26-32):
```json
"exclude": [
  "node_modules",
  "dist",
  "**/*.test.ts",
  "**/*.spec.ts",
  "**e2e**",
  "**mock**"
]
```

Proposed exclude:
```json
"exclude": [
  "node_modules",
  "dist",
  "**e2e**",
  "**mock**"
]
```

Also add `"**/__mocks__/**"` to exclude if desired (optional — Vitest handles this automatically).

### 7.4 Create test setup with mocks

**File:** `whatsapp-bot/src/test-setup.ts`

```typescript
import { vi } from 'vitest';

// Mock the api module from lib/axios
vi.mock('../lib/axios.js', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
```

### 7.5 Mock strategy

**Axios (`api` object):**
- `vi.mock('../lib/axios.js')` in test-setup.ts — global for all tests
- Each test file accesses `const { api } = await import('../lib/axios.js')` or imports via the service
- Use `mockResolvedValueOnce` / `mockRejectedValueOnce` per test case
- The `api` object is an AxiosInstance, but for unit testing the service layer, the mock just needs `{ data: ... }` shape

**Response shape for mocking:**

Successful GET (single):
```typescript
{ data: { data: { id: '...', ... } } }
```

Successful GET (list):
```typescript
{ data: { data: [{ id: '...', ... }], total: 1 } }
```

Successful POST/PATCH:
```typescript
{ data: { data: { id: '...', ... } } }
```

API error:
```typescript
{ response: { data: { error: { code: 'NOT_FOUND', message: '...', timestamp: '...' } } } }
```

Network error:
```typescript
{ code: 'ECONNREFUSED', message: 'connect ECONNREFUSED 127.0.0.1:3000' }
```

Timeout error:
```typescript
{ code: 'ECONNABORTED', message: 'timeout of 10000ms exceeded' }
```

### 7.6 Service test files (4 files)

All service tests follow the same pattern:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

// The api mock is set up globally via test-setup.ts
// Each test file accesses api via the service import (indirectly)

// Helper to get the mocked api for assertions
async function getMockedApi() {
  const { api } = await import('../lib/axios.js');
  return api as unknown as Record<string, Mock>;
}
```

#### 7.6.1 `cliente.service.test.ts`

**File:** `whatsapp-bot/src/services/__tests__/cliente.service.test.ts`

Test cases:

| # | Test | Method | Mock setup | Expect |
|---|---|---|---|---|
| 1 | listar returns parsed clients | `clienteService.listar()` | `api.get` resolves with `{ data: { data: [mockCliente], total: 1 } }` | Returns array with 1 client, has id, nombre, telefono |
| 2 | listar with phone filter | `clienteService.listar({ telefono: '112233' })` | `api.get` resolves | Calls api.get with correct params |
| 3 | obtener by id | `clienteService.obtener('cli-1')` | `api.get` resolves with single client | Returns parsed client object |
| 4 | crear client | `clienteService.crear(input)` | `api.post` resolves with created client | Returns parsed client, calls api.post with input |
| 5 | actualizar client | `clienteService.actualizar('cli-1', { activo: false })` | `api.patch` resolves with updated client | Returns updated client, calls api.patch |
| 6 | API error returns error message | `clienteService.listar()` | `api.get` rejects with `{ response: { data: { error: { message: 'Error del servidor' } } } }` | `getErrorMessage` returns 'Error del servidor' |
| 7 | ECONNREFUSED returns system message | `clienteService.listar()` | `api.get` rejects with `{ code: 'ECONNREFUSED' }` | `getErrorMessage` returns 'El sistema no está disponible. Intentá de nuevo en unos minutos.' |
| 8 | ECONNABORTED returns timeout message | `clienteService.listar()` | `api.get` rejects with `{ code: 'ECONNABORTED' }` | `getErrorMessage` returns 'El servicio está tardando demasiado. Intentá de nuevo.' |

#### 7.6.2 `pedido.service.test.ts`

**File:** `whatsapp-bot/src/services/__tests__/pedido.service.test.ts`

Test cases:

| # | Test | Method | Expect |
|---|---|---|---|
| 1 | listar returns parsed pedidos | listar | Array with 1 pedido, has id, estado |
| 2 | listar with clienteId filter | listar with params | Calls api.get with correct params |
| 3 | obtener by id | obtener | Returns parsed pedido |
| 4 | crear pedido | crear | Calls api.post, returns parsed pedido |
| 5 | cancelar pedido | cancelar | Calls api.patch with `/pedidos/${id}/cancelar-cliente` and `{ motivo }`, returns parsed pedido |
| 6 | API error | listar then getErrorMessage | Returns server error message |
| 7 | ECONNREFUSED | getErrorMessage | Returns system unavailable message |
| 8 | ECONNABORTED | getErrorMessage | Returns timeout message |

#### 7.6.3 `item.service.test.ts`

**File:** `whatsapp-bot/src/services/__tests__/item.service.test.ts`

Test cases:

| # | Test | Method | Expect |
|---|---|---|---|
| 1 | listar returns parsed items | listar | Array with 1 item, has id, nombre, activo |
| 2 | listar sends activo=true param | listar | Calls api.get with `{ params: { activo: true } }` |
| 3 | API error | getErrorMessage | Returns server error message |
| 4 | ECONNREFUSED | getErrorMessage | Returns system unavailable message |
| 5 | ECONNABORTED | getErrorMessage | Returns timeout message |

#### 7.6.4 `reclamo.service.test.ts`

**File:** `whatsapp-bot/src/services/__tests__/reclamo.service.test.ts`

Test cases:

| # | Test | Method | Expect |
|---|---|---|---|
| 1 | listar returns parsed reclamos | listar | Array with 1 reclamo, has id, descripcion, clienteId |
| 2 | listar with clienteId filter | listar with params | Calls api.get with correct params |
| 3 | crear reclamo | crear | Calls api.post with `{ clienteId, descripcion }`, returns parsed reclamo |
| 4 | API error | getErrorMessage | Returns server error message |
| 5 | ECONNREFUSED | getErrorMessage | Returns system unavailable message |
| 6 | ECONNABORTED | getErrorMessage | Returns timeout message |

### 7.7 Flow test mock infrastructure

**File:** `whatsapp-bot/src/__mocks__/@builderbot/bot.ts`

For flow tests, mock the BuilderBot API at the service layer, not the bot framework layer. The flow tests test the ACTION HANDLERS (the callbacks passed to `addAction` and `addAnswer`), not the full BuilderBot chain.

**Strategy:** Extract the action handler callbacks into named functions that can be tested directly, OR mock `addKeyword` to return a chainable object that captures the callbacks.

**Recommended approach (simpler):** Test each flow's action handlers as standalone async functions by calling them with a mock `ctx` and mock callback object `{ flowDynamic, state, gotoFlow, fallBack }`.

Mock objects shape:

```typescript
// For alta.flow.ts handlers:
const mockCtx = { from: '541122334455', body: 'SI' };
const mockState = {
  update: vi.fn(),
  get: vi.fn().mockResolvedValue({ /* state data */ }),
  clear: vi.fn(),
};
const mockFlowDynamic = vi.fn();
const mockGotoFlow = vi.fn();
const mockFallBack = vi.fn();
```

### 7.8 Flow tests (2 integration-style + 4 smoke)

#### 7.8.1 `alta.flow.test.ts` (integration-style)

**File:** `whatsapp-bot/src/flows/__tests__/alta.flow.test.ts`

Test the complete alta flow by testing each action handler in sequence:

| # | Test step | What it tests | Mock setup |
|---|---|---|---|
| 1 | First action: client not found | Shows registration prompt | `clienteService.listar` resolves to `[]` |
| 2 | First action: client already exists | Redirects to `yaRegistradoFlow` | `clienteService.listar` resolves to `[mockCliente]` |
| 3 | Name capture: valid name | Stores nombre in state | Valid input `'Juan'` |
| 4 | Name capture: too short | Calls fallBack | Input `'A'` |
| 5 | Apellido capture: valid | Stores apellido | Valid input `'Pérez'` |
| 6 | Calle capture | Stores calle | Input `'Av. Corrientes'` |
| 7 | Numero capture | Stores numero | Input `'1234'` |
| 8 | Localidad capture | Stores localidad (or default) | Empty input → 'La Plata' |
| 9 | Dia capture: valid | Stores diaEntrega | Input `'1'` → LUNES |
| 10 | Dia capture: invalid | Calls fallBack | Input `'7'` |
| 11 | Horario desde: valid format | Stores horarioDesde | Input `'09:00'` |
| 12 | Horario desde: invalid | Calls fallBack | Input `'9am'` |
| 13 | Horario hasta: after from | Stores horarioHasta | Input `'13:00'` |
| 14 | Horario hasta: before from | Calls fallBack | Input `'08:00'` when desde is '09:00' |
| 15 | Observaciones: value | Stores value | Input `'Timbree 3'` |
| 16 | Observaciones: ignored value | Stores undefined | Input `'no'` |
| 17 | Confirmation: SI → success | Calls clienteService.crear, shows success | State has all fields, mock clienteService.crear resolves |
| 18 | Confirmation: NO | Shows abort message | Input `'NO'` |
| 19 | Confirmation: other | Calls fallBack | Input `'tal vez'` |
| 20 | API error on crear | Shows error message | `clienteService.crear` rejects with error |

#### 7.8.2 `cancelar.flow.test.ts` (integration-style)

**File:** `whatsapp-bot/src/flows/__tests__/cancelar.flow.test.ts`

| # | Test step | What it tests | Mock setup |
|---|---|---|---|
| 1 | First action: client found | Stores clienteId, shows pending orders | `clienteService.listar` resolves to `[mockCliente]`, `pedidoService.listar` resolves to `[mockPedido]` |
| 2 | First action: client not found | Redirects to `noRegistradoFlow` | `clienteService.listar` resolves to `[]` |
| 3 | First action: no pending orders | Shows "no pending" message | `pedidoService.listar` resolves to `[]` |
| 4 | Pedido selection: valid number | Stores pedidoId, shows motivo menu | Input `'1'`, state has pedidos array |
| 5 | Pedido selection: invalid | Calls fallBack | Input `'5'` when only 1 pedido |
| 6 | Motivo selection: valid | Stores motivo label+value | Input `'1'` |
| 7 | Motivo selection: invalid | Calls fallBack with menu | Input `'9'` |
| 8 | Summary action | Shows confirmation | State has pedidoNumero + motivoLabel |
| 9 | Summary action: missing data | Shows "Faltan datos" | State missing pedidoNumero |
| 10 | Confirmation: SI → cancel | Calls pedidoService.cancelar, shows success | Input `'SI'`, state has pedidoId + motivo |
| 11 | Confirmation: NO | Shows abort message | Input `'NO'` |
| 12 | Confirmation: other | Calls fallBack | Input `'quizas'` |
| 13 | API error on cancelar | Shows error message | `pedidoService.cancelar` rejects |

#### 7.8.3 Smoke tests (4 files)

Each smoke test file is minimal — 2-3 tests maximum covering:
1. Happy path (action triggers correctly)
2. Client not found edge case

**Files:**

| File | Tests |
|---|---|
| `whatsapp-bot/src/flows/__tests__/pedido.flow.smoke.test.ts` | 2 tests: shows order creation prompt, redirects to noRegistrado |
| `whatsapp-bot/src/flows/__tests__/reclamo.flow.smoke.test.ts` | 2 tests: shows reclamo prompt, redirects to noRegistrado |
| `whatsapp-bot/src/flows/__tests__/baja.flow.smoke.test.ts` | 2 tests: shows deactivation prompt, redirects to noRegistrado |
| `whatsapp-bot/src/flows/__tests__/welcome.flow.smoke.test.ts` | 2 tests: registered → shows menu, unregistered → shows registration prompt |

---

## 8. String References and Constants

### 8.1 Endpoint paths (backend)

| Constant | Value | Used in |
|---|---|---|
| `/api/v1/clientes` | POST, PATCH | clientes routes |
| `/api/v1/pedidos` | POST | pedidos routes |
| `/api/v1/pedidos/:id/cancelar-cliente` | PATCH | pedidos routes (NEW) |
| `/api/v1/pedidos/:pedidoId/items` | POST | pedidos routes |
| `/api/v1/pedidos/:pedidoId/items/:itemId` | PATCH | pedidos routes |
| `/api/v1/reclamos` | GET, POST | reclamos routes (NEW) |
| `/api/v1/reclamos/:id` | GET | reclamos routes (NEW) |

### 8.2 Bot service URLs

| Current URL | New URL | Service file |
|---|---|---|
| `/pedidos/${id}/cancelar` | `/pedidos/${id}/cancelar-cliente` | `pedido.service.ts` |
| `/reclamos` | (same) | `reclamo.service.ts` |

### 8.3 Zod error messages (Spanish — user-facing)

| Schema field | Message | Schema file |
|---|---|---|
| `clienteId` | `'El ID del cliente debe ser un UUID válido'` | `reclamos/schema.ts` |
| `descripcion` (min) | `'La descripción debe tener al menos 10 caracteres'` | `reclamos/schema.ts` |
| `descripcion` (max) | `'La descripción no puede superar los 500 caracteres'` | `reclamos/schema.ts` |
| `id` (param) | `'El ID del reclamo debe ser un UUID válido'` | `reclamos/schema.ts` |

### 8.4 Bot error messages (Spanish — user-facing)

| Error code | Message | Service file |
|---|---|---|
| ECONNREFUSED | `'El sistema no está disponible. Intentá de nuevo en unos minutos.'` | All 4 services (existing) |
| ECONNABORTED | `'El servicio está tardando demasiado. Intentá de nuevo.'` | All 4 services (existing) |
| Generic fallback | `'Ocurrió un error inesperado.'` | All 4 services (existing) |

### 8.5 Prisma / TypeScript type names

| Scope | Name | Notes |
|---|---|---|
| Enum variant | `Rol.BOT` | Prisma enum, new value |
| Model field | `Reclamo.descripcion` | Prisma model, new field |
| Service function | `crearReclamo` | Reclamos service |
| Service function | `listarReclamos` | Reclamos service |
| Service function | `obtenerReclamo` | Reclamos service |
| Service function | `cancelarPedidoCliente` | Pedidos service (NEW) |
| Controller function | `cancelarClienteController` | Pedidos controller (NEW) |
| Controller function | `crearController` | Reclamos controller |
| Controller function | `listarController` | Reclamos controller |
| Controller function | `obtenerController` | Reclamos controller |
| Zod schema | `crearReclamoSchema` | Reclamos schema (NOT `crearReclamaSchema` — corrected typo from proposal) |
| Zod schema | `listarReclamosQuerySchema` | Reclamos schema |
| Zod schema | `reclamoIdParamSchema` | Reclamos schema |

### 8.6 Variable names for new code

| File | Variable | Purpose |
|---|---|---|
| `pedidos/controller.ts` | `cancelarClienteController` | Exported async function |
| `pedidos/service.ts` | `cancelarPedidoCliente` | Exported async function |
| `pedidos/routes.ts` | `cancelarClienteController` | Imported from controller |
| `reclamos/service.ts` | `crearReclamo` | Exported async function |
| `reclamos/service.ts` | `listarReclamos` | Exported async function |
| `reclamos/service.ts` | `obtenerReclamo` | Exported async function |
| `app.ts` | `reclamosRoutes` | Imported default from routes.ts |
| `pedido.service.test.ts` | `createMockPedido`, `createMockApiError`, `createMockNetworkError` | Test helpers (per-file module scope) |

---

## 9. Complete File Change Manifest

### Backend (11 files)

| # | File | Action | Section reference |
|---|---|---|---|
| 1 | `prisma/schema.prisma` | Modify | §1.1, §1.2 |
| 2 | `prisma/migrations/..._add_bot_role/` | New | §1.1 |
| 3 | `prisma/migrations/..._add_descripcion_to_reclamo/` | New | §1.2 |
| 4 | `src/features/clientes/routes.ts` | Modify | §3 |
| 5 | `src/features/pedidos/routes.ts` | Modify | §4.2 |
| 6 | `src/features/pedidos/controller.ts` | Modify | §4.4 |
| 7 | `src/features/pedidos/service.ts` | Modify | §4.5 |
| 8 | `src/features/reclamos/types.ts` | **New** | §5.2 |
| 9 | `src/features/reclamos/schema.ts` | **New** | §5.3 |
| 10 | `src/features/reclamos/service.ts` | **New** | §5.4 |
| 11 | `src/features/reclamos/controller.ts` | **New** | §5.5 |
| 12 | `src/features/reclamos/routes.ts` | **New** | §5.6 |
| 13 | `src/app.ts` | Modify | §5.7 |

### WhatsApp Bot (10 files)

| # | File | Action | Section reference |
|---|---|---|---|
| 1 | `package.json` | Modify (add vitest + test scripts) | §7.1 |
| 2 | `vitest.config.ts` | **New** | §7.2 |
| 3 | `tsconfig.json` | Modify (remove test exclusions) | §7.3 |
| 4 | `src/test-setup.ts` | **New** | §7.4 |
| 5 | `src/services/pedido.service.ts` | Modify (cancelar URL) | §4.7 |
| 6 | `src/services/reclamo.service.ts` | Modify (add descripcion to interface) | §5.8 |
| 7 | `src/services/__tests__/cliente.service.test.ts` | **New** | §7.6.1 |
| 8 | `src/services/__tests__/pedido.service.test.ts` | **New** | §7.6.2 |
| 9 | `src/services/__tests__/item.service.test.ts` | **New** | §7.6.3 |
| 10 | `src/services/__tests__/reclamo.service.test.ts` | **New** | §7.6.4 |
| 11 | `src/flows/__tests__/alta.flow.test.ts` | **New** | §7.8.1 |
| 12 | `src/flows/__tests__/cancelar.flow.test.ts` | **New** | §7.8.2 |
| 13 | `src/flows/__tests__/pedido.flow.smoke.test.ts` | **New** | §7.8.3 |
| 14 | `src/flows/__tests__/reclamo.flow.smoke.test.ts` | **New** | §7.8.3 |
| 15 | `src/flows/__tests__/baja.flow.smoke.test.ts` | **New** | §7.8.3 |
| 16 | `src/flows/__tests__/welcome.flow.smoke.test.ts` | **New** | §7.8.3 |

### Documentation (1 file)

| # | File | Action |
|---|---|---|
| 1 | `docs/whatsapp-backend-integration/spec.md` | **New** (this file) |

---

## 10. Implementation Order

### Phase 1: Schema & Backend Auth (~30 min)

1. Add `BOT` to `Rol` enum in schema.prisma
2. Run `npx prisma migrate dev --name add_bot_role`
3. Run `npx prisma generate`
4. Modify `clientes/routes.ts` — add apiKeyAuth + BOT to POST and PATCH
5. Modify `pedidos/routes.ts` — add apiKeyAuth + BOT to POST, items, add new cancelar-cliente route
6. Add `cancelarClienteController` to `pedidos/controller.ts`
7. Add `cancelarPedidoCliente` to `pedidos/service.ts`

### Phase 2: Reclamos API (~1 hour)

1. Add `descripcion` to `Reclamo` model in schema.prisma
2. Run `npx prisma migrate dev --name add_descripcion_to_reclamo`
3. Run `npx prisma generate`
4. Create `reclamos/types.ts`
5. Create `reclamos/schema.ts`
6. Create `reclamos/service.ts`
7. Create `reclamos/controller.ts`
8. Create `reclamos/routes.ts`
9. Mount in `app.ts`

### Phase 3: Bot Service Updates (~15 min)

1. Update `pedido.service.ts` cancelar URL
2. Update `reclamo.service.ts` Reclamo interface (add descripcion)

### Phase 4: Testing Infrastructure (~30 min)

1. `npm install --save-dev vitest`
2. Create `vitest.config.ts`
3. Update `tsconfig.json` exclude array
4. Create `src/test-setup.ts`

### Phase 5: Service Tests (~45 min)

1. Write `cliente.service.test.ts`
2. Write `pedido.service.test.ts`
3. Write `item.service.test.ts`
4. Write `reclamo.service.test.ts`
5. Run `npm test` — all pass

### Phase 6: Flow Tests (~1 hour)

1. Write `alta.flow.test.ts` (20 test cases)
2. Write `cancelar.flow.test.ts` (13 test cases)
3. Write 4 smoke test files (2 tests each)
4. Run `npm test` — all pass

---

## 11. Verification Checklist

### Backend verification

- [ ] `Rol` enum has `BOT` member
- [ ] `Reclamo` model has `descripcion` field
- [ ] `POST /api/v1/clientes` works with x-api-key header
- [ ] `PATCH /api/v1/clientes/:id` works with x-api-key and `{ activo: false }`
- [ ] `POST /api/v1/pedidos` works with x-api-key and `{ clienteId, items }`
- [ ] `POST /api/v1/pedidos/:pedidoId/items` works with x-api-key
- [ ] `PATCH /api/v1/pedidos/:pedidoId/items/:itemId` works with x-api-key
- [ ] `PATCH /api/v1/pedidos/:id/cancelar-cliente` works with x-api-key and `{ motivo }`
- [ ] `cancelar-cliente` sets `estado: CANCELADO` (not NO_ENTREGADO)
- [ ] `cancelar-cliente` does NOT auto-complete reparto
- [ ] `DELETE /api/v1/clientes/:id` still ADMIN-only (rejects BOT)
- [ ] `DELETE /api/v1/pedidos/:id` still ADMIN-only (rejects BOT)
- [ ] `POST /api/v1/reclamos` creates reclamo with descripcion
- [ ] `GET /api/v1/reclamos` lists reclamos
- [ ] `GET /api/v1/reclamos/:id` returns single reclamo
- [ ] `GET /api/v1/reclamos?clienteId=...` filters by clienteId
- [ ] Invalid x-api-key returns 401
- [ ] Missing x-api-key falls through to JWT auth

### WhatsApp bot verification

- [ ] Vitest installed and `npm test` runs
- [ ] All service tests pass (4 files)
- [ ] All flow tests pass (2 integration + 4 smoke)
- [ ] `cancelar` flow calls `/pedidos/:id/cancelar-cliente` (not `/cancelar`)
- [ ] `Reclamo` interface includes `descripcion: string`
- [ ] tsconfig.json no longer excludes `*.test.ts` or `*.spec.ts`

---

## 12. Existing Test Impact Assessment

### Backend existing tests — expected to pass without changes

| File | Why it passes |
|---|---|
| `clientes.service.test.ts` | Tests mock Prisma directly — doesn't test middleware/roles |
| `clientes.controller.test.ts` | Tests controller with mocked service — doesn't test middleware |
| `pedidos.service.test.ts` | Tests Prisma layer — doesn't test middleware |
| `auth.service.test.ts` | Auth is unchanged |
| `auth.controller.test.ts` | Auth is unchanged |
| `estadisticas.service.test.ts` | Estadisticas is unchanged |
| `estadisticas.controller.test.ts` | Estadisticas is unchanged |

**No existing tests need modification.** The changes are additive (new roles, new routes, new endpoint) — they don't modify existing middleware behavior or existing service logic (except adding a new service function).
