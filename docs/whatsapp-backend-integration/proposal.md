# SDD Proposal: WhatsApp Bot ↔ Backend Integration

**Change name:** `whatsapp-backend-integration`
**Status:** Proposed
**Author:** SDD Propose (via engram)
**Date:** 2026-07-23

---

## 1. Executive Summary

The WhatsApp bot already has 6 fully implemented flows (alta, pedido, cancelar, reclamo, baja, welcome) that communicate with the backend API. However, **all write operations will fail** because: (a) the backend write routes only accept JWT Bearer tokens and require `ADMIN` or `REPARTIDOR` roles — they ignore the `x-api-key` header the bot sends; (b) the `/api/v1/reclamos` endpoint does not exist; and (c) the `Reclamo` Prisma model lacks a `descripcion` field. This proposal covers the backend changes needed to unblock all bot flows, plus the introduction of a testing infrastructure for the WhatsApp bot.

---

## 2. Problem Statement

Three concrete blockers prevent the WhatsApp bot from functioning:

### Blocker A — Auth barrier on write routes (critical)
All write routes for `clientes` (POST, PATCH) and `pedidos` (POST, PATCH, DELETE) use:
```ts
authenticate, requireRole('ADMIN')
// or
authenticate, requireRole('ADMIN', 'REPARTIDOR')
```
The middleware chain does **not** include `apiKeyAuth`. Since `authenticate` only checks JWT Bearer tokens, requests with `x-api-key` header (but no `Authorization` header) are rejected as "Token no proporcionado". Even if `apiKeyAuth` were present, `requireRole(...)` would reject the bot because it sets `rol: 'BOT'`, which is not in the allowed roles for any write route — and `BOT` is not even a member of the Prisma `Rol` enum.

### Blocker B — Missing Reclamos API endpoint
The backend has EJS-based admin pages for reclamos (`/admin/reclamos`) but **no REST API routes**. The bot calls `POST /reclamos` and `GET /reclamos` — both will 404. Additionally, the admin controller for reclamos only stores `clienteId` — there is no `descripcion` field in the Prisma model.

### Blocker C — No testing infrastructure in WhatsApp bot
The WhatsApp bot has zero tests. The `tsconfig.json` **excludes** `*.test.ts` and `*.spec.ts`. There is no test framework installed, no vitest/jest config, and no mocks for Axios or BuilderBot.

---

## 3. Goals

1. **Unblock all 6 bot flows** — alta, pedido, cancelar, reclamo, baja, and welcome work end-to-end
2. **Add API key authentication** to write routes so the bot can create/update resources
3. **Create the `/api/v1/reclamos` endpoint** with CRUD operations accessible to the bot
4. **Add `descripcion` to `Reclamo` model** and generate migration
5. **Add `BOT` to Prisma `Rol` enum** and generate migration
6. **Install and configure Vitest** for the WhatsApp bot
7. **Write unit tests** for all 4 services and at least 3 flows
8. **Document architecture** and integration pattern

---

## 4. Non-Goals

- ❌ No changes to the WhatsApp bot's existing flow logic or UI text
- ❌ No changes to the mobile app
- ❌ No data migration scripts (only schema migrations)
- ❌ No end-to-end tests (unit + integration only)
- ❌ No CI/CD pipeline changes
- ❌ No changes to the `Domicilio`, `Item`, `Pedido`, or `Reparto` models beyond what's needed for bot auth
- ❌ No rate limiting or bot-specific throttling
- ❌ No audit logging for bot actions (deferred)

---

## 5. Use Cases — Bot Flow to Endpoint Mapping

| # | Bot Flow | Backend Endpoint | Method | Bot Action | Status |
|---|---|---|---|---|---|
| 1 | **alta** — Register client | `/api/v1/clientes` | POST | Create client + domicilio + dias + horarios | ❌ Auth blocked |
| 2 | **pedido** — Create order | `/api/v1/pedidos` | POST | Create pedido with items | ❌ Auth blocked |
| 3 | **cancelar** — Cancel order | `/api/v1/pedidos/:id/cancelar` | PATCH | Set estado=NO_ENTREGADO with motivo | ❌ Auth blocked |
| 4 | **reclamo** — Submit complaint | `/api/v1/reclamos` | POST | Create reclamo with descripcion | ❌ Endpoint missing + model incomplete |
| 5 | **baja** — Deactivate client | `/api/v1/clientes/:id` | PATCH | Set activo=false | ❌ Auth blocked |
| 6 | **welcome** — Identify client | `/api/v1/clientes?telefono=...` | GET | List clientes by phone | ✅ Works |
| 7 | **pedido** — List items | `/api/v1/items?activo=true` | GET | Get available items | ✅ Works |
| 8 | **cancelar** — List pending | `/api/v1/pedidos?clienteId=...&estado=PENDIENTE` | GET | Get pending orders | ✅ Works |

---

## 6. Proposed Solution

### 6.1 Backend — Prisma Schema Changes

#### 6.1.1 Add `BOT` to `Rol` enum
```prisma
enum Rol {
  REPARTIDOR
  ADMIN
  BOT           // NEW
}
```
Migration name: `add_bot_role`

#### 6.1.2 Add `descripcion` field to `Reclamo` model
```prisma
model Reclamo {
  id          String   @id @default(uuid())
  clienteId   String
  descripcion String   // NEW — required, free-text complaint description
  creadoEn    DateTime @default(now())
  cliente     Cliente  @relation(fields: [clienteId], references: [id])
}
```
Migration name: `add_descripcion_to_reclamo`

### 6.2 Backend — Route Changes

#### 6.2.1 Clientes routes (`src/features/clientes/routes.ts`)

**Change:** Add `apiKeyAuth` + `BOT` role to POST and PATCH routes.

```ts
// Current (write routes — ADMIN only):
router.post('/', authenticate, requireRole('ADMIN'), crearController);
router.patch('/:id', authenticate, requireRole('ADMIN'), actualizarController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarController);

// Proposed (write routes — ADMIN or BOT via apiKey):
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), crearController);
router.patch('/:id', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), actualizarController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarController);
```

**Key design decision:** DELETE route stays ADMIN-only — the bot should not hard-delete clients. It uses PATCH `{ activo: false }` for deactivation.

#### 6.2.2 Pedidos routes (`src/features/pedidos/routes.ts`)

**Change:** Add `apiKeyAuth` + `BOT` role to POST, PATCH, and relevant DELETE routes.

```ts
// Write routes — ADMIN, REPARTIDOR, or BOT:
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT'), crearController);
router.patch('/:id/estado', apyKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT'), actualizarEstadoController);
router.delete('/:id', authenticate, requireRole('ADMIN'), eliminarPedidoController);

// Items management — ADMIN, REPARTIDOR, or BOT:
router.post('/:pedidoId/items', apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT'), agregarItemController);
router.patch('/:pedidoId/items/:itemId', apiKeyAuth, authenticate, requireRole('ADMIN', 'REPARTIDOR', 'BOT'), actualizarCantidadItemController);
router.delete('/:pedidoId/items/:itemId', authenticate, requireRole('ADMIN'), quitarItemController);

// Reparto flow — REPARTIDOR or BOT (bot needs cancelar for clients):
router.patch('/:id/confirmar', apiKeyAuth, authenticate, requireRole('REPARTIDOR', 'BOT'), confirmarController);
router.patch('/:id/cancelar', apiKeyAuth, authenticate, requireRole('REPARTIDOR', 'BOT'), cancelarRepartidorController);
```

**Note on `cancelarRepartidorController`:** This endpoint sets `estado = NO_ENTREGADO` (not `CANCELADO`). The bot's cancel flow sends a motivo and expects the state to change. This is semantically correct — the bot cancels a pending order, the backend marks it as no-entregado with the provided motivo. If the `PENDIENTE → CANCELADO` transition is preferred for bot cancellations, a new controller/service method should be created instead. **This is a TBD — see Risks.**

#### 6.2.3 How `apiKeyAuth + authenticate + requireRole` works together

The middleware chain:
1. **`apiKeyAuth`**: If `x-api-key` is present and valid, sets `req.user` with `rol: 'BOT'` and calls `next()` immediately (the bot never reaches JWT auth). If no `x-api-key` header, silently continues to step 2.
2. **`authenticate`**: If `req.user` is already set (from apiKeyAuth), passes through via `if (req.user) return next()`. Otherwise, checks JWT Bearer token.
3. **`requireRole(...)`**: Verifies `req.user.rol` against allowed roles.

This pattern already works for read routes — we're extending it to write routes.

### 6.3 Backend — Create Reclamos Feature

New feature folder: `src/features/reclamos/`

#### 6.3.1 Types (`src/features/reclamos/types.ts`)
```ts
import type { Reclamo } from '@prisma/client';
// Re-export or extend if needed
```

#### 6.3.2 Schema (`src/features/reclamos/schema.ts`)
```ts
import { z } from 'zod';

export const crearReclamaSchema = z.object({
  clienteId: z.string().uuid(),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
});

export const listarReclamosQuerySchema = z.object({
  clienteId: z.string().uuid().optional(),
});
```

#### 6.3.3 Service (`src/features/reclamos/service.ts`)
- `crearReclamo(data)` — creates a Reclamo with clienteId and descripcion
- `listarReclamos(params)` — lists reclamos with optional clienteId filter
- `obtenerReclamo(id)` — single reclamo by ID

#### 6.3.4 Controller (`src/features/reclamos/controller.ts`)
- `crearController` — POST handler
- `listarController` — GET handler  
- `obtenerController` — GET /:id handler

#### 6.3.5 Routes (`src/features/reclamos/routes.ts`)
```ts
router.get('/', apiKeyAuth, authenticate, listarController);
router.get('/:id', apiKeyAuth, authenticate, obtenerController);
router.post('/', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), crearController);
```

#### 6.3.6 Mount in `app.ts`
```ts
import reclamosRoutes from './features/reclamos/routes.js';
app.use('/api/v1/reclamos', reclamosRoutes);
```

### 6.4 WhatsApp Bot — Testing Infrastructure

#### 6.4.1 Install Vitest
```bash
npm install --save-dev vitest
```

#### 6.4.2 Create `vitest.config.ts`
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  },
});
```

#### 6.4.3 Update `tsconfig.json`
Remove `"**/*.test.ts"` and `"**/*.spec.ts"` from the `exclude` array.

#### 6.4.4 Create test setup with mocks

**Mock Axios** (`src/__mocks__/axios.ts` or inline with `vi.mock`):
```ts
vi.mock('../lib/axios.js', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
```

**Mock BuilderBot** (`src/__mocks__/@builderbot/bot.ts`):
```ts
// Minimal mock for addKeyword, addAnswer, addAction, EVENTS
```

#### 6.4.5 Test targets

| Layer | File | Test Cases |
|---|---|---|
| Service | `cliente.service.ts` | listar, obtener, crear, actualizar, getErrorMessage (network error, API error, success) |
| Service | `pedido.service.ts` | listar, obtener, crear, cancelar, getErrorMessage |
| Service | `item.service.ts` | listar |
| Service | `reclamo.service.ts` | listar, crear |
| Flow | `alta.flow.ts` | Full registration flow (requires BuilderBot mock) |
| Flow | `pedido.flow.ts` | Order creation with item selection |
| Flow | `cancelar.flow.ts` | Cancel with motivo selection |
| Flow | `baja.flow.ts` | Deactivation |
| Flow | `reclamo.flow.ts` | Complaint submission |
| Flow | `welcome.flow.ts` | Client identification (registered vs unregistered) |

---

## 7. Scope — Files to Touch

### Backend (9 files + 7 new)

| File | Change Type | What |
|---|---|---|
| `prisma/schema.prisma` | Modify | Add `BOT` to `Rol` enum, add `descripcion` to `Reclamo` |
| `prisma/migrations/...` | New (x2) | `add_bot_role`, `add_descripcion_to_reclamo` |
| `src/features/clientes/routes.ts` | Modify | Add `apiKeyAuth` and `BOT` to POST + PATCH routes |
| `src/features/pedidos/routes.ts` | Modify | Add `apiKeyAuth` and `BOT` to POST, PATCH, and cancel/confirm routes |
| `src/features/reclamos/types.ts` | **New** | Reclamo types |
| `src/features/reclamos/schema.ts` | **New** | Zod validation schemas |
| `src/features/reclamos/service.ts` | **New** | Business logic for reclamos |
| `src/features/reclamos/controller.ts` | **New** | Express request handlers |
| `src/features/reclamos/routes.ts` | **New** | Express router with apiKeyAuth + requireRole |
| `src/app.ts` | Modify | Mount `/api/v1/reclamos` |
| Backend tests (existing) | Modify | Update tests if role checks break — unlikely since BOT role is additive only |

### WhatsApp Bot (5 files + several new tests)

| File | Change Type | What |
|---|---|---|
| `package.json` | Modify | Add `vitest` devDependency, add test scripts |
| `vitest.config.ts` | **New** | Vitest configuration |
| `tsconfig.json` | Modify | Remove test file exclusions |
| `src/__mocks__/axios.ts` | **New** (or inline) | Axios mock for services |
| `src/__mocks__/@builderbot/bot.ts` | **New** (or inline) | BuilderBot mock for flows |
| `src/services/cliente.service.test.ts` | **New** | ClienteService unit tests |
| `src/services/pedido.service.test.ts` | **New** | PedidoService unit tests |
| `src/services/item.service.test.ts` | **New** | ItemService unit tests |
| `src/services/reclamo.service.test.ts` | **New** | ReclamoService unit tests |
| `src/flows/alta.flow.test.ts` | **New** | Alta flow tests |
| `src/flows/pedido.flow.test.ts` | **New** | Pedido flow tests |
| `src/flows/cancelar.flow.test.ts` | **New** | Cancelar flow tests |
| `src/flows/reclamo.flow.test.ts` | **New** | Reclamo flow tests |

### Documentation (1 new)

| File | Change Type | What |
|---|---|---|
| `docs/whatsapp-backend-integration/architecture.md` | **New** | Bot architecture + integration pattern docs |

---

## 8. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| **`cancelarPedidoRepartidor` sets `NO_ENTREGADO` not `CANCELADO`** | The bot's cancel flow sends a motivo, the backend sets `estado: NO_ENTREGADO`. This might be semantically wrong for "client cancelled before delivery" vs "delivery failed". | **TBD**: Either accept the current behavior (cancel = no-entregado) or create a new `cancelarPedidoCliente` flow that sets `CANCELADO`. The decision affects route naming and a new service function. |
| **Bot creates pedido with only `clienteId`** | The bot sends `{ clienteId, fecha, items }` to `POST /pedidos`. The backend's `crearPedido` accepts `clienteId` and resolves to the principal domicilio — this works. No risk. | ✅ No action needed |
| **`crearPedido` generates `numeroPedido` with `count + 1` inside a transaction** | Race condition possible under high load. Pre-existing behavior, not specific to this change. | Deferred. |
| **Adding `BOT` to existing routes could accidentally allow BOT access in unintended scenarios** | Routes are explicitly scoped — we only add BOT to routes the bot needs. DELETE routes remain ADMIN-only. | Low risk. |
| **Mocking BuilderBot for flow tests is complex** | BuilderBot's `addKeyword` returns a complex chainable object. Flows have deeply nested callbacks. | Start with service tests (high value, low complexity). Add flow tests after mock infrastructure is stable. |

---

## 9. Timeline Estimate

### Phase 1: Schema & Backend Auth (High priority — unblocks everything)
- **Estimated:** 1-2 hours
- Add `BOT` to `Rol` enum → migration
- Add `descripcion` to `Reclamo` model → migration
- Update clientes routes with `apiKeyAuth` + `BOT`
- Update pedidos routes with `apiKeyAuth` + `BOT`

### Phase 2: Reclamos API (High priority — missing endpoint)
- **Estimated:** 1-2 hours
- Create `src/features/reclamos/*` (types, schema, service, controller, routes)
- Mount in `app.ts`
- Verify with curl or bot test

### Phase 3: WhatsApp Bot Testing Infrastructure (Medium priority)
- **Estimated:** 1-1.5 hours
- Install Vitest, create config
- Create mock infrastructure
- Write service tests (4 files)

### Phase 4: WhatsApp Bot Flow Tests (Medium priority — depends on Phase 3)
- **Estimated:** 1.5-2.5 hours
- Write flow tests for alta, pedido, cancelar, reclamo, baja, welcome
- May require iterative refinement of mocks

### Phase 5: Documentation (Lower priority)
- **Estimated:** 0.5-1 hour
- Document bot architecture
- Document auth integration pattern

### Total: ~5-9 hours

---

## 10. Open Questions for SDD Spec Phase

1. **Cancel semantics**: Should the bot's cancel flow set `PENDIENTE → NO_ENTREGADO` (current) or `PENDIENTE → CANCELADO`? If the latter, a new `cancelarPedidoCliente` service method is needed since `cancelarPedidoRepartidor` is explicitly for repartidor use (includes `autoCompletarRepartoSiCorresponde`).

2. **BOT role on `actualizarEstadoController`**: The bot currently doesn't call `PATCH /:id/estado`, but should it be allowed in the future for status queries from WhatsApp?

3. **Flow test depth**: Should flow tests test the full conversation (multiple addAnswer callbacks) or focus on individual action handlers?
