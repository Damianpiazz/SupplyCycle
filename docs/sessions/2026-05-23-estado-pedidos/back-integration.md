---
fecha: 2026-05-23
titulo: Backend, lógica de mutación de estado y tests de integración de Pedido
participantes: [backend]
tdd: [TDD-0003, TDD-0004]
---

# Backend: lógica de mutación de estado y tests de integración de Pedido

## Objetivo de la sesión

Implementar la lógica de negocio de cambio de estado de `Pedido` (confirmar entrega y registrar falla), exponerla mediante dos endpoints REST autenticados, y escribir tests de integración que golpean una base de datos real para verificar el contrato completo (HTTP, validaciones, persistencia).

---

## Funciones implementadas en `pedidoService.ts`

### `confirmarEntrega(pedidoId: string): Promise<Pedido>`

Cambia el estado de `PENDIENTE` a `ENTREGADO`.

| Condición | Resultado |
|---|---|
| Pedido existe y está `PENDIENTE` | `pedido.update({ estado: "ENTREGADO" })` → retorna el pedido actualizado |
| Pedido no existe | `AppError(404, "Pedido con id X no encontrado")` |
| Pedido no está `PENDIENTE` | `AppError(409, "Solo se puede confirmar un pedido en estado PENDIENTE")` |

### `registrarFalla(pedidoId: string, motivo: string): Promise<Pedido>`

Cambia el estado de `PENDIENTE` a `NO_ENTREGADO` y guarda `motivoFalla`.

| Condición | Resultado |
|---|---|
| Pedido existe, está `PENDIENTE` y `motivo` válido | `pedido.update({ estado: "NO_ENTREGADO", motivoFalla })` |
| `motivo` no está en el enum | `AppError(400, "Motivo de falla inválido")` (no consulta DB) |
| Pedido no existe | `AppError(404)` |
| Pedido no está `PENDIENTE` | `AppError(409)` |

Ambas funciones son **independientes de HTTP**: reciben datos primitivos y lanzan `AppError` tipados.

---

## Endpoints creados

### `PATCH /api/v1/pedidos/:id/confirmar`

| Aspecto | Detalle |
|---|---|
| Middleware | `authenticate` (JWT Bearer token) |
| Body | Vacío |
| Validación params | `uuidParamSchema` → si no es UUID válido → `AppError(400)` |
| Respuesta 200 | `{ id, estado: "ENTREGADO", motivoFalla: null, createdAt, updatedAt }` |
| Errores | `400` (UUID inválido), `404` (no existe), `409` (no PENDIENTE) |

### `PATCH /api/v1/pedidos/:id/cancelar`

| Aspecto | Detalle |
|---|---|
| Middleware | `authenticate` (JWT Bearer token) |
| Body | `{ motivo: "CLIENTE_AUSENTE" \| "DIRECCION_INCORRECTA" \| "ACCESO_DENEGADO" \| "OTRO" }` |
| Validación params | `uuidParamSchema` → si no es UUID válido → `AppError(400)` |
| Validación body | `cancelarPedidoSchema` con `safeParse` → si falla → `AppError(400)` |
| Respuesta 200 | `{ id, estado: "NO_ENTREGADO", motivoFalla, createdAt, updatedAt }` |
| Errores | `400` (UUID inválido / motivo faltante / motivo inválido), `404`, `409` |

---

## Cambios en schema Prisma

### `prisma/schema.prisma`

Se definieron dos enums y un modelo:

```prisma
enum EstadoPedido { PENDIENTE ENTREGADO NO_ENTREGADO }
enum MotivoFalla { CLIENTE_AUSENTE DIRECCION_INCORRECTA ACCESO_DENEGADO OTRO }

model Pedido {
  id          String       @id @default(uuid()) @db.Uuid
  estado      EstadoPedido @default(PENDIENTE)
  motivoFalla MotivoFalla?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  @@map("pedidos")
}
```

No se ejecutó migración por falta de base PostgreSQL en el entorno de desarrollo. El cliente Prisma se generó correctamente con `npx prisma generate` apuntando a `src/generated/prisma/`.

### Output path

El output de Prisma Client se configuró en `src/generated/prisma/` (en lugar de `generated/prisma/`) para respetar `rootDir: "./src"` del tsconfig y evitar el error TS6059.

---

## Tests de integración

### Archivo creado

**`src/__tests__/pedido-estado.integration.test.ts`** — 14 tests en total.

### Infraestructura

| Archivo | Propósito |
|---|---|
| `vitest.integration.config.ts` | Config separada que solo incluye `*.integration.test.ts` |
| `src/__tests__/setup.integration.ts` | Setup global: mapea `TEST_DATABASE_URL` → `DATABASE_URL`, define `JWT_SECRET`, exporta `getTestDb()` y `disconnectTestDb()` |

### Setup / Teardown

- `beforeAll`: verifica conexión a DB de test, genera token JWT.
- `beforeEach`: limpia todos los pedidos creados por tests previos.
- `afterEach`: limpia pedidos del test actual.
- `afterAll`: desconecta Prisma Client de test.

### Casos cubiertos

**`PATCH /pedidos/:id/confirmar` — 5 tests:**

| # | Escenario | HTTP esperado |
|---|---|---|
| 1 | PENDIENTE → ENTREGADO | `200` con `{ estado: "ENTREGADO", motivoFalla: null }` |
| 2 | Pedido ya ENTREGADO | `409` |
| 3 | Pedido ya NO_ENTREGADO | `409` |
| 4 | ID inexistente (UUID válido) | `404` |
| 5 | ID formato inválido | `400` |

**`PATCH /pedidos/:id/cancelar` — 9 tests:**

| # | Escenario | HTTP esperado |
|---|---|---|
| 6 | PENDIENTE + motivo válido → NO_ENTREGADO | `200` con `{ estado: "NO_ENTREGADO", motivoFalla }` |
| 7 | Parametrizado: cada valor del enum (4 casos) | `200` con `motivoFalla` correcto |
| 8 | Pedido ya ENTREGADO + motivo | `409` |
| 9 | Body sin campo `motivo` | `400` |
| 10 | Body con motivo fuera del enum | `400` |
| 11 | ID inexistente + motivo | `404` |

### Verificaciones en respuestas exitosas

- `id` coincide con el pedido creado en el test.
- `estado` es el valor esperado (`ENTREGADO` / `NO_ENTREGADO`).
- `motivoFalla` es `null` (confirmar) o el motivo exacto (cancelar).

### Verificaciones en respuestas de error

- Status code exacto (400, 404 o 409).
- Body con estructura `{ error: { code, message, statusCode } }`.

### Casos fallidos esperados

Los 14 tests fallan si no hay una base PostgreSQL accesible via `TEST_DATABASE_URL`. El error es `PrismaClientKnownRequestError: Authentication failed`. Este comportamiento es correcto: los tests de integración requieren una DB real.

Para ejecutarlos:

```sh
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/supplycycle_test npm run test:integration
```

La DB de test debe tener las migraciones de Prisma aplicadas previamente.

---

## Actualización de `backend/rules/testing.md`

Se actualizó `backend/rules/testing.md` con dos nuevas secciones:

### Estructura de carpetas para tests de integración

```
backend/src/__tests__/              → tests de integración (todos)
backend/src/__tests__/setup.ts      → setup global compartido (NO modificar)
backend/src/features/**/*.test.ts   → tests unitarios junto al archivo que testean
```

### Reglas de uso de `setup.ts`

- `getTestDb()` → retorna `PrismaClient` conectado a `TEST_DATABASE_URL`.
- `disconnectTestDb()` → desconecta al finalizar la suite.
- Llamar `disconnectTestDb()` en `afterAll` global de cada archivo de integración.
- Usar `getTestDb()` solo para seed y cleanup, nunca dentro del código bajo test.
- Requiere `TEST_DATABASE_URL` definida en `.env.test` en la raíz de `backend/`.

---

## Decisiones técnicas

1. **Validación UUID en controller en lugar de service** — Se agregó `assertValidUuid()` en el controller usando `uuidParamSchema` para que el servicio reciba siempre un ID con formato válido y no tenga responsabilidad de parseo. Si el UUID es inválido, se responde `400` antes de tocar la DB.
2. **Uso de `safeParse` en cancelar** — En vez de dejar que ZodError se propague al error handler (que responde `422`), se usó `cancelarPedidoSchema.safeParse()` y se lanza `AppError(400)` manualmente para que todos los errores de validación de estos endpoints sean `400` (consistente con el estándar REST de "bad request").
3. **Separación de configs de vitest** — Se creó `vitest.integration.config.ts` separada de la config de unit tests para mantener aislamiento: los unit tests no necesitan DB y corren rápido, los de integración requieren infraestructura externa.
4. **Setup via `setupFiles`** — En lugar de usar `globalSetup` (que corre en un worker separado), se usó `setupFiles` que corre en el mismo worker que los tests, garantizando que `process.env.DATABASE_URL` esté seteado antes de que el test importe la app y sus módulos.
5. **Prisma Client separado para seed/cleanup** — El test crea su propia instancia de `PrismaClient` (via `getTestDb()`) en lugar de reutilizar el singleton de la app, para tener control explícito de la conexión sin interferir con el ciclo de vida de la app bajo test.
6. **Limpieza por IDs conocidos** — En lugar de `deleteMany` con `startsWith` (no soportado por Prisma en campos UUID), se usa `deleteMany` con `id: { in: ALL_TEST_IDS }` con los IDs predefinidos de cada escenario.
