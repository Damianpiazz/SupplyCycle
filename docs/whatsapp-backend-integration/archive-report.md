# SDD Archive Report: whatsapp-backend-integration

**Status:** COMPLETED
**Date:** 2026-07-23
**Files changed:** ~22 (12 backend + 10 whatsapp-bot)
**Tests:** 177 total (108 backend existing + 69 new bot tests)

## What was done

### Problem
The WhatsApp bot had 6 fully implemented flows (alta, pedido, cancelar, reclamo, baja, welcome) but all write operations would fail due to 3 blockers:

1. **Auth barrier** — Backend write routes only accepted JWT Bearer tokens with `ADMIN` or `REPARTIDOR` roles. The bot sends `x-api-key` header (not Bearer) and `BOT` wasn't even a valid role in the Prisma `Rol` enum.
2. **Missing Reclamos endpoint** — No REST API at `/api/v1/reclamos`. Only EJS admin pages existed.
3. **Incomplete model** — The `Reclamo` Prisma model lacked a `descripcion` field.

### Backend changes
- **Prisma schema**: Added `BOT` to `Rol` enum and `descripcion` to `Reclamo` model. Two migrations generated.
- **Clientes routes**: POST and PATCH now accept `apiKeyAuth` + `BOT` role. DELETE remains ADMIN-only.
- **Pedidos routes**: POST, items POST/PATCH now accept `apiKeyAuth` + `BOT`. Added new `PATCH /:id/cancelar-cliente` endpoint with `CANCELADO` state (not `NO_ENTREGADO`), no auto-completa-reparto. DELETEs tightened to ADMIN-only.
- **New Reclamos feature**: Full feature folder (`types`, `schema`, `service`, `controller`, `routes`) with 3 endpoints: GET list, GET by ID, POST create. Mounted at `/api/v1/reclamos`.
- **Admin controller fix**: Added `descripcion` to admin reclamos create/update.
- **Seed data**: Updated reclamos seed with `descripcion`.

### WhatsApp bot changes
- **Cancelar URL**: Changed from `/pedidos/${id}/cancelar` to `/pedidos/${id}/cancelar-cliente`.
- **Reclamo interface**: Added `descripcion: string`.
- **Cancelar MOTIVOS**: Updated to client-appropriate values (`YA_NO_LO_NECESITA`, `CANCELACION_CLIENTE`) matching new backend schema.

### Testing infrastructure
- **Vitest** installed and configured with `vitest.config.ts`.
- **tsconfig.json** updated to allow test files.
- **10 test files** written: 4 service tests (27 tests), 2 integration-style flow tests (33 tests), 4 smoke tests (8 tests) = **69 tests total**.
- All **108 existing backend tests** remain green.

## Artifact index
- Proposal: `docs/whatsapp-backend-integration/proposal.md`
- Spec: `docs/whatsapp-backend-integration/spec.md`
- Design: `docs/whatsapp-backend-integration/design.md`
- Tasks: `docs/whatsapp-backend-integration/tasks.md`
- Apply progress: topic_key `sdd/whatsapp-backend-integration/apply-progress` (#141)
- Verify report: `docs/whatsapp-backend-integration/verify-report.md`
- Archive report: `docs/whatsapp-backend-integration/archive-report.md` (this file)

## Key metrics
- **Pass rate**: 100% (177/177 tests passing)
- **Deviations from spec**: 1 (minor — `test-setup.ts` not created; each test file declares `vi.mock()` inline instead of using a global setup file. This was a deliberate choice: Vitest hoists `vi.mock()` per-file, path resolution is more reliable, and there's no hidden global state. All 69 tests pass.)
- **Risks remaining**: None
- **Follow-up items**: None

## Final state
The WhatsApp bot now has:
- **Full access to all 6 use case endpoints**: alta (POST clientes), pedido (POST pedidos + items), cancelar (PATCH cancelar-cliente), reclamo (POST reclamos), baja (PATCH clientes deactivate), welcome (GET clientes by phone)
- **Proper cancellation flow**: Client-appropriate `MOTIVOS` enum values (`YA_NO_LO_NECESITA`, `DIRECCION_INCORRECTA`, `CANCELACION_CLIENTE`, `OTRO`), `CANCELADO` state transition, no auto-completa-reparto
- **Complete testing suite**: 69 tests covering all 4 services (27 tests) and all 6 flows (42 tests)
- **Documentation**: Full SDD trace from proposal through design, tasks, apply, verify, and now archive
