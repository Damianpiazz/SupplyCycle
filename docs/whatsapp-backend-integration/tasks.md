# SDD Tasks: WhatsApp Bot ↔ Backend Integration

**Change name:** `whatsapp-backend-integration`
**Status:** Tasked
**Date:** 2026-07-23
**Based on:** `docs/whatsapp-backend-integration/spec.md`, `docs/whatsapp-backend-integration/design.md`
**Delivery strategy:** `single-pr-default`
**Review budget:** 800 lines max before needing approval

---

## Forecast & Sizing

### Estimated total lines changed: **~1,320 lines**

| Category | Files | Lines | Notes |
|---|---|---|---|
| Backend modified (existing) | 7 files | ~65 lines | Schema, routes, controllers, services, app.ts |
| Backend new (reclamos feature) | 5 files | ~215 lines | types, schema, service, controller, routes |
| Backend admin fix | 1 file | ~3 lines | Add descripcion to admin create |
| Bot modified (existing) | 3 files | ~8 lines | pedido.service, reclamo.service, cancelar.flow |
| Test infrastructure | 3 files | ~19 lines | package.json, vitest.config, tsconfig |
| Service test files (new) | 4 files | ~420 lines | cliente, pedido, item, reclamo service tests |
| Flow test files (new) | 6 files | ~590 lines | alta, cancelar (integration) + 4 smoke tests |
| **Total** | **~29 files** | **~1,320 lines** | |

### ⚠️ Size Exception Required

This change exceeds both:
- The **400-line threshold** (by ~3x at ~1,320 lines)
- The **800-line review budget** (by ~65%)

**Recommendation:** File a `size:exception` request. If denied, the change can be split into 2-3 chained PRs:
- **PR 1:** Phases 1–2 (backend schema + routes + reclamos feature) — ~280 lines, fits within 400-line budget
- **PR 2:** Phases 3–6 (bot updates + tests) — ~1,040 lines, but most is test code which has lower review burden
- **PR 3 (optional):** Phase 6 flow tests only — if test-only PRs are allowed to exceed budget

### Risk Assessment

| Risk | Level | Mitigation |
|---|---|---|
| **Backend route changes break existing clients** | Low | Additive changes only (apiKeyAuth before authenticate + BOT in requireRole). Existing JWT flows pass through unchanged. |
| **Admin reclamos controller breaks after migration** | Medium | The admin `create()` omits `descripcion`. Must add `descripcion: ''` before migration, or the create call will fail. Task 2.9 addresses this. |
| **Flow tests are complex to mock** | Medium | Testing BuilderBot action handlers requires extracting callbacks or calling them in context. Per design §7.3, test by invoking handlers directly with mock ctx/state/flowDynamic — no framework mocking needed. |
| **Backend existing tests may break** | Low | The `BOT` role is already in `AllowedRole` type. Route changes are additive. No existing tests test role middleware — they mock Prisma directly. Per spec §12, no existing tests need changes. |
| **Migration order issues** | Low | Two independent migrations (enum + field). No data dependencies. Can run in any order. |

---

## Phase 1: Prisma Schema + Migrations

**No dependencies.** Can be done first, independently.

### Task 1.1 — Add `BOT` to `Rol` enum

- **Files:** `backend/prisma/schema.prisma`
- **Description:** Add `BOT` line to the `Rol` enum definition (after `ADMIN`).
- **Dependencies:** None
- **Estimate:** 2 min
- **Verification:** Visual check — `Rol` enum has `REPARTIDOR`, `ADMIN`, `BOT`

### Task 1.2 — Run migration `add_bot_role`

- **Files:** Auto-generated under `backend/prisma/migrations/`
- **Description:** Run `npx prisma migrate dev --name add_bot_role` in the backend directory.
- **Dependencies:** Task 1.1
- **Estimate:** 5 min
- **Verification:** Migration file created with `Rol` enum alteration. No error output.

### Task 1.3 — Add `descripcion` to `Reclamo` model

- **Files:** `backend/prisma/schema.prisma`
- **Description:** Add `descripcion String` field to the `Reclamo` model after `clienteId`.
- **Dependencies:** None (independent of Task 1.1, but grouped here for convenience)
- **Estimate:** 2 min
- **Verification:** Visual check — `Reclamo` model has `descripcion String` field

### Task 1.4 — Run migration `add_descripcion_to_reclamo`

- **Files:** Auto-generated under `backend/prisma/migrations/`
- **Description:** Run `npx prisma migrate dev --name add_descripcion_to_reclamo` in the backend directory.
- **Dependencies:** Task 1.3
- **Estimate:** 5 min
- **Verification:** Migration file created with `Reclamo.descripcion` column addition. No error output.

### Task 1.5 — Regenerate Prisma client

- **Files:** Auto-generated under `backend/generated/prisma/`
- **Description:** Run `npx prisma generate` in the backend directory.
- **Dependencies:** Task 1.2, Task 1.4
- **Estimate:** 3 min
- **Verification:** No error output. `Reclamo` TypeScript type now includes `descripcion: string`. `Rol` enum includes `BOT`.

### Phase 1 Verification

Run these commands and check output:

```bash
cd backend
npx prisma validate                                      # Schema is valid
npx tsc --noEmit                                          # TypeScript compiles (may fail if routes not updated yet — that's Phase 2)
```

---

## Phase 2: Backend Routes, Services & New Reclamos Feature

**Depends on Phase 1** (Prisma client must have `BOT` and `descripcion`).

### Task 2.1 — Update clientes routes (add apiKeyAuth + BOT to POST/PATCH)

- **Files:** `backend/src/features/clientes/routes.ts`
- **Description:** Change `POST /` and `PATCH /:id` middleware from `authenticate, requireRole('ADMIN')` to `apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT')`. DELETE route unchanged.
- **Dependencies:** None within Phase 2 (independent of other route changes)
- **Estimate:** 5 min
- **Verification:** `apiKeyAuth` before `authenticate` on lines 25-26. `requireRole` has `'ADMIN', 'BOT'`. DELETE remains ADMIN-only.

### Task 2.2 — Update pedidos routes (add apiKeyAuth + BOT to POST, items; add cancelar-cliente)

- **Files:** `backend/src/features/pedidos/routes.ts`
- **Description:**
  - `POST /`: Add `apiKeyAuth` + `'BOT'` to `requireRole`
  - `DELETE /`: Remove `'REPARTIDOR'` from `requireRole` (tightening)
  - `POST /:pedidoId/items`: Add `apiKeyAuth` + `'BOT'`
  - `PATCH /:pedidoId/items/:itemId`: Add `apiKeyAuth` + `'BOT'`
  - `DELETE /:pedidoId/items/:itemId`: Remove `'REPARTIDOR'` (tightening)
  - Add new route: `router.patch('/:id/cancelar-cliente', apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), cancelarClienteController)`
  - Add `cancelarClienteController` to import list from `./controller.js`
- **Dependencies:** None within Phase 2
- **Estimate:** 10 min
- **Verification:** Visual inspection of routes.ts matches design §3.2. Import list includes `cancelarClienteController`.

### Task 2.3 — Add `cancelarClienteSchema` to pedidos schema

- **Files:** `backend/src/features/pedidos/schema.ts`
- **Description:** Add new Zod schema `cancelarClienteSchema` with client-appropriate motivo enum values: `YA_NO_LO_NECESITA`, `DIRECCION_INCORRECTA`, `CANCELACION_CLIENTE`, `OTRO`. Distinct from the existing `cancelarPedidoSchema`.
- **Dependencies:** None within Phase 2
- **Estimate:** 5 min
- **Verification:** Schema exports `cancelarClienteSchema` with 4 enum values. `crearReclamoSchema` is NOT here (it goes in reclamos/schema.ts).

### Task 2.4 — Add `cancelarClienteController` to pedidos controller

- **Files:** `backend/src/features/pedidos/controller.ts`
- **Description:** Add new exported async function `cancelarClienteController`. Reads `req.params.id` and `req.body.motivo` via `cancelarClienteSchema` (from schema.ts import), calls `pedidosService.cancelarPedidoCliente(id, motivo)`, returns result via `sendSuccess`.
- **Dependencies:** Task 2.3 (schema must exist)
- **Estimate:** 8 min
- **Verification:** Import line adds `cancelarClienteSchema` from `./schema.js`. Exported function follows same pattern as `cancelarRepartidorController`.

### Task 2.5 — Add `cancelarPedidoCliente` to pedidos service

- **Files:** `backend/src/features/pedidos/service.ts`
- **Description:** Add new exported async function `cancelarPedidoCliente(id, motivo)` — validates pedido exists, validates estado is `PENDIENTE`, updates to `{ estado: 'CANCELADO', motivoFalla: motivo }`, returns `{ id, estado: 'CANCELADO', motivoFalla, actualizadoEn }`. Does NOT call `autoCompletarRepartoSiCorresponde`.
- **Dependencies:** None within Phase 2
- **Estimate:** 10 min
- **Verification:** Function exported. Same validation pattern as `cancelarPedidoRepartidor` but only allows `PENDIENTE → CANCELADO`. No call to `autoCompletarRepartoSiCorresponde`.

### Task 2.6 — Create `reclamos/types.ts`

- **Files:** `backend/src/features/reclamos/types.ts` (NEW)
- **Description:** Re-export `Reclamo` from Prisma client. Define `CrearReclamoInput` interface with `clienteId: string` and `descripcion: string`.
- **Dependencies:** Task 1.5 (Prisma client generated)
- **Estimate:** 3 min
- **Verification:** File exists. Exports `Reclamo` (type) and `CrearReclamoInput` (interface).

### Task 2.7 — Create `reclamos/schema.ts`

- **Files:** `backend/src/features/reclamos/schema.ts` (NEW)
- **Description:** Create 3 Zod schemas:
  - `crearReclamoSchema`: `clienteId` (uuid), `descripcion` (string, 10-500 chars)
  - `listarReclamosQuerySchema`: `clienteId` (uuid, optional), `page`/`pageSize` (string→number transforms, optional)
  - `reclamoIdParamSchema`: `id` (uuid)
- **Dependencies:** None within Phase 2
- **Estimate:** 8 min
- **Verification:** Schemas exported. Names match spec §5.3 (not `crearReclamaSchema` — corrected typo).

### Task 2.8 — Create `reclamos/service.ts`

- **Files:** `backend/src/features/reclamos/service.ts` (NEW)
- **Description:** Create 3 service functions:
  - `crearReclamo(data)`: validates cliente exists (returns 404 if not), creates Reclamo with `clienteId` + `descripcion`, includes cliente (id, nombre, apellido, telefono)
  - `listarReclamos(params?)`: paginated list with optional `clienteId` filter, ordered by `creadoEn desc`, includes cliente
  - `obtenerReclamo(id)`: single reclamo by id, includes cliente, returns 404 if not found
- **Dependencies:** Task 1.5, Task 2.6
- **Estimate:** 15 min
- **Verification:** 3 exported async functions. Error handling for not-found cases. Cliente existence check before create.

### Task 2.9 — Create `reclamos/controller.ts`

- **Files:** `backend/src/features/reclamos/controller.ts` (NEW)
- **Description:** Create 3 Express request handlers following the existing pattern:
  - `crearController`: POST handler — parse body with `crearReclamoSchema`, call `crearReclamo`, respond 201
  - `listarController`: GET handler — parse query with `listarReclamosQuerySchema`, call `listarReclamos`, respond via `sendList`
  - `obtenerController`: GET /:id handler — read `req.params.id`, call `obtenerReclamo`, respond via `sendSuccess`
- **Dependencies:** Task 2.7, Task 2.8
- **Estimate:** 10 min
- **Verification:** 3 exported async functions. Each has `try/catch` + `next(err)`. Imports from `../../utils/response.js`.

### Task 2.10 — Create `reclamos/routes.ts`

- **Files:** `backend/src/features/reclamos/routes.ts` (NEW)
- **Description:** Create Express Router with 3 routes:
  - `GET /`: `apiKeyAuth, authenticate, listarController`
  - `GET /:id`: `apiKeyAuth, authenticate, obtenerController`
  - `POST /`: `apiKeyAuth, authenticate, requireRole('ADMIN', 'BOT'), crearController`
- **Dependencies:** Task 2.9
- **Estimate:** 5 min
- **Verification:** Default export. 3 routes match spec §5.6. READ routes not behind `requireRole` (per design §5.6 trade-off).

### Task 2.11 — Mount reclamos in `app.ts`

- **Files:** `backend/src/app.ts`
- **Description:** Add `import reclamosRoutes from './features/reclamos/routes.js'` (after estadisticas import). Add `app.use('/api/v1/reclamos', reclamosRoutes)` after the estadisticas mount line.
- **Dependencies:** Task 2.10
- **Estimate:** 3 min
- **Verification:** Import at line ~19. Mount at line ~128 (after estadisticas, before admin).

### Task 2.12 — Update admin reclamos controller for `descripcion`

- **Files:** `backend/src/admin/controllers/reclamos.admin.controller.ts`
- **Description:**
  - In `create()` (line 39): Change `{ data: { clienteId: b.clienteId! } }` to `{ data: { clienteId: b.clienteId!, descripcion: b.descripcion ?? '' } }`
  - In `update()` (line 61-63): Add optional descripcion to update data
- **Dependencies:** Task 1.4 (migration adds the column; without this fix, admin create will fail)
- **Estimate:** 5 min
- **Verification:** Admin create form adds `descripcion` from request body with empty string fallback.

### Phase 2 Verification

```bash
cd backend
npx tsc --noEmit                                          # Must compile without errors
npx prisma validate                                        # Schema valid
# Optional manual test:
# curl -s -o /dev/null -w '%{http_code}' -X POST http://localhost:3000/api/v1/reclamos \
#   -H 'Content-Type: application/json' \
#   -d '{"clienteId":"00000000-0000-0000-0000-000000000000","descripcion":"Test"}' \
#   -H 'x-api-key: test-key'
# Expect 401 (invalid API key) or 404 (cliente not found) — both prove the endpoint exists and middleware chain works.
```

---

## Phase 3: WhatsApp Bot Updates

**Depends on Phase 2** (the new `cancelar-cliente` endpoint and `descripcion` field must exist in the backend before the bot can use them).

### Task 3.1 — Update cancelar URL in pedido.service.ts

- **Files:** `whatsapp-bot/src/services/pedido.service.ts`
- **Description:** Change line 66: `/pedidos/${id}/cancelar` → `/pedidos/${id}/cancelar-cliente`.
- **Dependencies:** Task 2.2 (cancelar-cliente route exists), Task 2.5 (cancelarPedidoCliente service exists)
- **Estimate:** 2 min
- **Verification:** URL in `cancelar()` method points to `/pedidos/${id}/cancelar-cliente`.

### Task 3.2 — Add `descripcion` to Reclamo interface in reclamo.service.ts

- **Files:** `whatsapp-bot/src/services/reclamo.service.ts`
- **Description:** Add `descripcion: string` to the `Reclamo` interface (after `clienteId`).
- **Dependencies:** Task 1.5 (descripcion in Prisma model), Task 2.8 (descripcion in service)
- **Estimate:** 2 min
- **Verification:** `Reclamo` interface has `descripcion: string`. `CrearReclamoInput` already has it — no change needed.

### Task 3.3 — Update cancelar.flow.ts MOTIVOS values

- **Files:** `whatsapp-bot/src/flows/cancelar.flow.ts`
- **Description:** Update the `MOTIVOS` array to use client-appropriate enum values matching the new `cancelarClienteSchema`:
  - `{ label: 'Ya no necesito el pedido', value: 'YA_NO_LO_NECESITA' }` (was `OTRO`)
  - `{ label: 'No voy a estar para recibir', value: 'CANCELACION_CLIENTE' }` (was `CLIENTE_AUSENTE`)
  - `DIRECCION_INCORRECTA` and `OTRO` unchanged (both valid in new schema)
- **Dependencies:** Task 2.3 (cancelarClienteSchema exists)
- **Estimate:** 5 min
- **Verification:** MOTIVOS array uses `YA_NO_LO_NECESITA` and `CANCELACION_CLIENTE` values. `CLIENTE_AUSENTE` removed.

### Phase 3 Verification

```bash
cd whatsapp-bot
npm run lint                                              # Must pass with no errors
# Also verify the changed files have the correct content (visual inspection)
```

---

## Phase 4: Testing Infrastructure

**Can run in parallel with Phase 2** (independent — no route/service files needed).

### Task 4.1 — Install Vitest in WhatsApp bot

- **Files:** `whatsapp-bot/package.json` (modify), `whatsapp-bot/package-lock.json` (auto)
- **Description:** Run `npm install --save-dev vitest` in the whatsapp-bot directory. Add test scripts to `package.json`:
  - `"test": "vitest"`
  - `"test:run": "vitest run"`
  - `"test:coverage": "vitest run --coverage"`
- **Dependencies:** None
- **Estimate:** 8 min
- **Verification:** `vitest` in devDependencies. `npm test -- --version` prints vitest version.

### Task 4.2 — Create vitest.config.ts

- **Files:** `whatsapp-bot/vitest.config.ts` (NEW)
- **Description:** Create vitest configuration with `globals: true`, `environment: 'node'`, include pattern `['src/**/*.test.ts', 'src/**/*.spec.ts']`. No setupFiles per design §7.3.
- **Dependencies:** Task 4.1
- **Estimate:** 5 min
- **Verification:** File exists. `npx vitest --config vitest.config.ts` doesn't error (may show "no test files found" before tests are written).

### Task 4.3 — Update tsconfig.json exclude array

- **Files:** `whatsapp-bot/tsconfig.json`
- **Description:** Remove `"**/*.test.ts"` and `"**/*.spec.ts"` from the `exclude` array. Keep `node_modules`, `dist`, `**e2e**`, `**mock**`.
- **Dependencies:** Task 4.1
- **Estimate:** 3 min
- **Verification:** `exclude` array no longer has `*.test.ts` or `*.spec.ts`. TypeScript still compiles (`npx tsc --noEmit`).

### Phase 4 Verification

```bash
cd whatsapp-bot
npx vitest --version                                     # vitest/x.x.x
npx vitest run --config vitest.config.ts                  # Should succeed (no tests found yet)
```

---

## Phase 5: Service Unit Tests

**Depends on Phase 3** (bot source code must have the updated cancelar URL and Reclamo interface) **+ Phase 4** (vitest installed and configured).

Parallelizable sub-tasks: Tasks 5.1 (cliente) and 5.3 (item) can be written in parallel since their services don't change in this PR.

### Task 5.1 — Write `cliente.service.test.ts`

- **Files:** `whatsapp-bot/src/services/__tests__/cliente.service.test.ts` (NEW — create `__tests__/` directory)
- **Description:** 8 test cases covering:
  1. `listar` returns parsed clients
  2. `listar` with phone filter sends params
  3. `obtener` by id returns parsed client
  4. `crear` client calls api.post with input
  5. `actualizar` client calls api.patch
  6. API error → `getErrorMessage` returns server message
  7. ECONNREFUSED → returns "sistema no disponible"
  8. ECONNABORTED → returns "tardando demasiado"
- **Dependencies:** Phase 4 (vitest + config). Can run before Phase 3 since `cliente.service.ts` doesn't change.
- **Estimate:** 20 min
- **Verification:** `npx vitest run src/services/__tests__/cliente.service.test.ts` — 8 tests pass.

### Task 5.2 — Write `pedido.service.test.ts`

- **Files:** `whatsapp-bot/src/services/__tests__/pedido.service.test.ts` (NEW)
- **Description:** 8 test cases covering:
  1. `listar` returns parsed pedidos
  2. `listar` with clienteId filter sends params
  3. `obtener` by id returns parsed pedido
  4. `crear` pedido calls api.post
  5. `cancelar` calls api.patch with `/pedidos/${id}/cancelar-cliente` (THIS IS THE KEY TEST — verifies URL change)
  6. API error → getErrorMessage
  7. ECONNREFUSED → getErrorMessage
  8. ECONNABORTED → getErrorMessage
- **Dependencies:** Task 3.1 (cancelar URL change). Phase 4.
- **Estimate:** 20 min
- **Verification:** `npx vitest run src/services/__tests__/pedido.service.test.ts` — 8 tests pass. Test 5 asserts the URL contains `/cancelar-cliente`.

### Task 5.3 — Write `item.service.test.ts`

- **Files:** `whatsapp-bot/src/services/__tests__/item.service.test.ts` (NEW)
- **Description:** 5 test cases covering:
  1. `listar` returns parsed items
  2. `listar` sends `activo: true` param
  3. API error → getErrorMessage
  4. ECONNREFUSED → getErrorMessage
  5. ECONNABORTED → getErrorMessage
- **Dependencies:** Phase 4. Can run before Phase 3 since `item.service.ts` doesn't change.
- **Estimate:** 15 min
- **Verification:** `npx vitest run src/services/__tests__/item.service.test.ts` — 5 tests pass.

### Task 5.4 — Write `reclamo.service.test.ts`

- **Files:** `whatsapp-bot/src/services/__tests__/reclamo.service.test.ts` (NEW)
- **Description:** 6 test cases covering:
  1. `listar` returns parsed reclamos with `descripcion`
  2. `listar` with clienteId filter sends params
  3. `crear` sends `{ clienteId, descripcion }` via api.post
  4. API error → getErrorMessage
  5. ECONNREFUSED → getErrorMessage
  6. ECONNABORTED → getErrorMessage
- **Dependencies:** Task 3.2 (Reclamo interface includes descripcion). Phase 4.
- **Estimate:** 18 min
- **Verification:** `npx vitest run src/services/__tests__/reclamo.service.test.ts` — 6 tests pass.

### Phase 5 Verification

```bash
cd whatsapp-bot
npx vitest run src/services/__tests__/   # All 4 service test files pass (27 tests)
```

---

## Phase 6: Flow Tests

**Depends on Phase 3** (cancelar flow MOTIVOS updated, pedido service URL updated) **+ Phase 4 + Phase 5** (mock patterns established).

### Task 6.1 — Write `alta.flow.test.ts` (integration-style)

- **Files:** `whatsapp-bot/src/flows/__tests__/alta.flow.test.ts` (NEW — create `__tests__/` directory)
- **Description:** 20 test cases testing the complete alta flow handler sequence. Tests cover:
  - First action: client not found → shows registration prompt
  - First action: client exists → redirects to `yaRegistradoFlow`
  - Name capture: valid name vs too short
  - Apellido, calle, numero, localidad capture
  - Dia capture: valid (1→LUNES) vs invalid (7→fallBack)
  - Horario desde/hasta: valid format vs invalid
  - Horario hasta must be after desde
  - Observaciones: value vs ignored "no"
  - Confirmation: SI → calls clienteService.crear → success message
  - Confirmation: NO → abort message
  - Confirmation: other → fallBack
  - API error → error message
- **Dependencies:** Phase 4, Phase 5 patterns
- **Estimate:** 35 min
- **Verification:** `npx vitest run src/flows/__tests__/alta.flow.test.ts` — 20 tests pass.

### Task 6.2 — Write `cancelar.flow.test.ts` (integration-style)

- **Files:** `whatsapp-bot/src/flows/__tests__/cancelar.flow.test.ts` (NEW)
- **Description:** 13 test cases testing the complete cancelar flow handler sequence. Tests cover:
  - First action: client found → stores clienteId, shows pending orders
  - First action: client not found → redirects to noRegistradoFlow
  - First action: no pending orders → shows "no pending" message
  - Pedido selection: valid number vs invalid (range)
  - Motivo selection: valid vs invalid
  - Summary action: shows confirmation with pedido + motivo
  - Summary action: missing data → "Faltan datos"
  - Confirmation: SI → calls pedidoService.cancelar → success
  - Confirmation: NO → abort message
  - Confirmation: other → fallBack
  - API error → error message
- **Dependencies:** Task 3.1, Task 3.3, Phase 4
- **Estimate:** 30 min
- **Verification:** `npx vitest run src/flows/__tests__/cancelar.flow.test.ts` — 13 tests pass.

### Task 6.3 — Write `pedido.flow.smoke.test.ts`

- **Files:** `whatsapp-bot/src/flows/__tests__/pedido.flow.smoke.test.ts` (NEW)
- **Description:** 2 smoke tests:
  1. First action triggers → shows order creation prompt
  2. Client not found → redirects to noRegistradoFlow
- **Dependencies:** Phase 4
- **Estimate:** 10 min
- **Verification:** `npx vitest run src/flows/__tests__/pedido.flow.smoke.test.ts` — 2 tests pass.

### Task 6.4 — Write `reclamo.flow.smoke.test.ts`

- **Files:** `whatsapp-bot/src/flows/__tests__/reclamo.flow.smoke.test.ts` (NEW)
- **Description:** 2 smoke tests:
  1. First action triggers → shows reclamo prompt
  2. Client not found → redirects to noRegistradoFlow
- **Dependencies:** Phase 4
- **Estimate:** 10 min
- **Verification:** `npx vitest run src/flows/__tests__/reclamo.flow.smoke.test.ts` — 2 tests pass.

### Task 6.5 — Write `baja.flow.smoke.test.ts`

- **Files:** `whatsapp-bot/src/flows/__tests__/baja.flow.smoke.test.ts` (NEW)
- **Description:** 2 smoke tests:
  1. First action triggers → shows deactivation prompt
  2. Client not found → redirects to noRegistradoFlow
- **Dependencies:** Phase 4
- **Estimate:** 10 min
- **Verification:** `npx vitest run src/flows/__tests__/baja.flow.smoke.test.ts` — 2 tests pass.

### Task 6.6 — Write `welcome.flow.smoke.test.ts`

- **Files:** `whatsapp-bot/src/flows/__tests__/welcome.flow.smoke.test.ts` (NEW)
- **Description:** 2 smoke tests:
  1. Registered client → shows menu
  2. Unregistered client → shows registration prompt
- **Dependencies:** Phase 4
- **Estimate:** 10 min
- **Verification:** `npx vitest run src/flows/__tests__/welcome.flow.smoke.test.ts` — 2 tests pass.

### Phase 6 Verification

```bash
cd whatsapp-bot
npx vitest run                           # All 10 test files pass (46 tests total: 27 service + 19 flow)
```

---

## Complete File Change Manifest

### Backend — Modified (7 files)

| # | File | Tasks | Est. change |
|---|---|---|---|
| 1 | `prisma/schema.prisma` | 1.1, 1.3 | +2 lines |
| 2 | `prisma/migrations/..._add_bot_role/` | 1.2 | Auto-generated |
| 3 | `prisma/migrations/..._add_descripcion_to_reclamo/` | 1.4 | Auto-generated |
| 4 | `src/features/clientes/routes.ts` | 2.1 | ~3 lines changed |
| 5 | `src/features/pedidos/routes.ts` | 2.2 | ~16 lines changed |
| 6 | `src/features/pedidos/schema.ts` | 2.3 | +10 lines |
| 7 | `src/features/pedidos/controller.ts` | 2.4 | +20 lines |
| 8 | `src/features/pedidos/service.ts` | 2.5 | +30 lines |
| 9 | `src/app.ts` | 2.11 | +2 lines |
| 10 | `src/admin/controllers/reclamos.admin.controller.ts` | 2.12 | ~3 lines changed |

### Backend — New (5 files)

| # | File | Tasks | Lines |
|---|---|---|---|
| 11 | `src/features/reclamos/types.ts` | 2.6 | ~5 |
| 12 | `src/features/reclamos/schema.ts` | 2.7 | ~40 |
| 13 | `src/features/reclamos/service.ts` | 2.8 | ~80 |
| 14 | `src/features/reclamos/controller.ts` | 2.9 | ~60 |
| 15 | `src/features/reclamos/routes.ts` | 2.10 | ~30 |

### WhatsApp Bot — Modified (3 files)

| # | File | Tasks | Est. change |
|---|---|---|---|
| 16 | `src/services/pedido.service.ts` | 3.1 | 1 line changed |
| 17 | `src/services/reclamo.service.ts` | 3.2 | 1 line added |
| 18 | `src/flows/cancelar.flow.ts` | 3.3 | ~6 lines changed |

### WhatsApp Bot — Test Infrastructure (3 files)

| # | File | Tasks | Est. change |
|---|---|---|---|
| 19 | `package.json` | 4.1 | +4 lines (scripts) |
| 20 | `vitest.config.ts` | 4.2 | ~15 lines (NEW) |
| 21 | `tsconfig.json` | 4.3 | -2 lines removed + exclude reorder |

### WhatsApp Bot — Tests (10 new files)

| # | File | Tasks | Lines (est.) |
|---|---|---|---|
| 22 | `src/services/__tests__/cliente.service.test.ts` | 5.1 | ~120 |
| 23 | `src/services/__tests__/pedido.service.test.ts` | 5.2 | ~120 |
| 24 | `src/services/__tests__/item.service.test.ts` | 5.3 | ~80 |
| 25 | `src/services/__tests__/reclamo.service.test.ts` | 5.4 | ~100 |
| 26 | `src/flows/__tests__/alta.flow.test.ts` | 6.1 | ~250 |
| 27 | `src/flows/__tests__/cancelar.flow.test.ts` | 6.2 | ~180 |
| 28 | `src/flows/__tests__/pedido.flow.smoke.test.ts` | 6.3 | ~40 |
| 29 | `src/flows/__tests__/reclamo.flow.smoke.test.ts` | 6.4 | ~40 |
| 30 | `src/flows/__tests__/baja.flow.smoke.test.ts` | 6.5 | ~40 |
| 31 | `src/flows/__tests__/welcome.flow.smoke.test.ts` | 6.6 | ~40 |

---

## Existing Test Impact Assessment

| Existing test file | Impact | Reason |
|---|---|---|
| `auth/*.test.ts` | None | Auth middleware is unchanged. Tests mock Prisma directly. |
| `clientes/*.test.ts` | None | Tests mock Prisma directly, not middleware/roles. |
| `pedidos/__tests__/pedidos.service.test.ts` | None | Tests mock Prisma directly. New `cancelarPedidoCliente` function doesn't affect existing `cancelarPedido` or `cancelarPedidoRepartidor` tests. |
| `estadisticas/*.test.ts` | None | Estadisticas is completely unchanged. |
| `usuarios/*.test.ts` | None | Usuarios is completely unchanged. |

**No existing tests need modification.** All changes are additive (new enum value, new route, new schema, new service function).

---

## Verification Checklist (Complete)

Copy this to the PR description to track completion:

### Phase 1 — Schema
- [ ] `Rol` enum has `BOT` member
- [ ] `Reclamo` model has `descripcion` field
- [ ] Both migrations run successfully
- [ ] `npx prisma validate` passes
- [ ] `npx prisma generate` completes

### Phase 2 — Backend
- [ ] `POST /api/v1/clientes` works with x-api-key header
- [ ] `PATCH /api/v1/clientes/:id` works with x-api-key
- [ ] `DELETE /api/v1/clientes/:id` rejects BOT (ADMIN-only)
- [ ] `POST /api/v1/pedidos` works with x-api-key
- [ ] `DELETE /api/v1/pedidos/:id` rejects REPARTIDOR (ADMIN-only tightening)
- [ ] `POST /api/v1/pedidos/:pedidoId/items` works with x-api-key
- [ ] `PATCH /api/v1/pedidos/:pedidoId/items/:itemId` works with x-api-key
- [ ] `DELETE /api/v1/pedidos/:pedidoId/items/:itemId` rejects REPARTIDOR
- [ ] `PATCH /api/v1/pedidos/:id/cancelar-cliente` exists, requires ADMIN or BOT
- [ ] `cancelar-cliente` sets `estado: CANCELADO` (not NO_ENTREGADO)
- [ ] `cancelar-cliente` does NOT auto-complete reparto
- [ ] `POST /api/v1/reclamos` creates reclamo with descripcion
- [ ] `GET /api/v1/reclamos` lists reclamos
- [ ] `GET /api/v1/reclamos/:id` returns single reclamo
- [ ] `GET /api/v1/reclamos?clienteId=...` filters by clienteId
- [ ] Admin reclamos create includes `descripcion`
- [ ] `npx tsc --noEmit` passes
- [ ] Invalid x-api-key returns 401
- [ ] Missing x-api-key falls through to JWT auth

### Phase 3 — Bot Updates
- [ ] `cancelar` in pedido.service.ts calls `/pedidos/${id}/cancelar-cliente`
- [ ] `Reclamo` interface in reclamo.service.ts includes `descripcion: string`
- [ ] cancelar.flow.ts MOTIVOS uses `YA_NO_LO_NECESITA` and `CANCELACION_CLIENTE`
- [ ] `npm run lint` passes in whatsapp-bot

### Phase 4 — Test Infrastructure
- [ ] Vitest installed in whatsapp-bot
- [ ] `vitest.config.ts` created
- [ ] `tsconfig.json` no longer excludes `*.test.ts` or `*.spec.ts`
- [ ] `npx vitest run` succeeds (finds test files)

### Phase 5 — Service Tests
- [ ] All 4 service test files pass (27 tests)
- [ ] Pedido service test 5 asserts `/cancelar-cliente` URL

### Phase 6 — Flow Tests
- [ ] `alta.flow.test.ts` passes (20 tests)
- [ ] `cancelar.flow.test.ts` passes (13 tests)
- [ ] 4 smoke test files pass (8 tests)
- [ ] `npx vitest run` — all 46 tests pass

---

## Dependency Diagram

```
Phase 1: Schema + Migrations
├── 1.1 BOT to Rol enum
│   └── 1.2 Run migration add_bot_role
├── 1.3 descripcion to Reclamo model
│   └── 1.4 Run migration add_descripcion_to_reclamo
└── 1.5 prisma generate
    │
    ▼
Phase 2: Backend Routes & Services
├── 2.1 clientes routes (apiKeyAuth + BOT)
├── 2.2 pedidos routes (apiKeyAuth + BOT + cancelar-cliente)
├── 2.3 cancelarClienteSchema (pedidos/schema.ts)
├── 2.4 cancelarClienteController (pedidos/controller.ts)
├── 2.5 cancelarPedidoCliente (pedidos/service.ts)
├── 2.6-2.10 New reclamos feature (5 files)
├── 2.11 Mount in app.ts
└── 2.12 Admin controller fix (descripcion)
    │
    ├───┐
    │   │
    ▼   ▼
Phase 3: Bot Updates      Phase 4: Testing Infra
├── 3.1 cancelar URL      ├── 4.1 Install vitest
├── 3.2 Reclamo interface ├── 4.2 vitest.config.ts
└── 3.3 MOTIVOS values    └── 4.3 tsconfig.json
    │                         │
    └─────────┬───────────────┘
              │
              ▼
    Phase 5: Service Tests
    ├── 5.1 cliente.service.test.ts
    ├── 5.2 pedido.service.test.ts
    ├── 5.3 item.service.test.ts
    └── 5.4 reclamo.service.test.ts
              │
              ▼
    Phase 6: Flow Tests
    ├── 6.1 alta.flow.test.ts
    ├── 6.2 cancelar.flow.test.ts
    ├── 6.3-6.6 4 smoke tests
    └── ✓ ALL TESTS PASS
```
