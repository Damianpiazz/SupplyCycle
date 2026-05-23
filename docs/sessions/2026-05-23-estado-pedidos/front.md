---
fecha: 2026-05-23
titulo: UI y lógica de cambio de estado de Pedido
participantes: [mobile, backend]
tdd: [TDD-0003, TDD-0004]
---

# UI y lógica de cambio de estado de Pedido

## Objetivo de la sesión

Construir el flujo completo de cambio de estado de un `Pedido` desde la perspectiva del **repartidor**, abarcando tanto la UI mobile como la API de backend. El repartidor debe poder confirmar una entrega exitosa o registrar una falla con un motivo, respetando las reglas de negocio de estados finales inmutables.

---

## Tareas por agente

### @mobile — UI de cambio de estado

1. **`pedido.types.ts`** — Tipos compartidos `EstadoPedido`, `MotivoFalla`, `MOTIVOS_FALLA_LABELS`, interfaces de props.
2. **`PedidoStatusActions.tsx`** — Componente principal que renderiza según `estadoActual`:
   - `PENDIENTE` → botones "Confirmar entrega" y "Registrar falla"
   - `ENTREGADO` → badge verde solo lectura
   - `NO_ENTREGADO` → badge rojo solo lectura
   - Loading state que deshabilita ambos botones (doble tap prevention)
3. **`MotivoFallaModal.tsx`** — Modal con selector de 4 motivos (radio buttons), validación frontend (requiere selección), botones "Confirmar falla" y "Volver".
4. **`theme.ts`** — Se agregaron tokens semánticos: `success`, `successLight`, `danger`, `dangerLight`, `warning`, `warningLight`, `card`, `border`, `overlay`, `textSecondary`.

### @backend — API de mutación de estado

1. **`prisma/schema.prisma`** — Modelo `Pedido` con enums `EstadoPedido` y `MotivoFalla`.
2. **`src/errors/AppError.ts`** — Error tipado con `statusCode` y `code` interno.
3. **`src/middleware/error-handler.ts`** — Middleware global que formatea AppError (statusCode), ZodError (422) y errores genéricos (500).
4. **`src/middleware/auth.ts`** — Middleware JWT Bearer token.
5. **`src/features/pedido/service.ts`** — `confirmarEntrega()` y `registrarFalla()` con validaciones (404 si no existe, 409 si no está PENDIENTE, 400 si motivo inválido).
6. **`src/features/pedido/schema.ts`** — `cancelarPedidoSchema` (Zod) y `uuidParamSchema`.
7. **`src/features/pedido/controller.ts`** — Handlers Express con validación UUID + `safeParse` para errores 400.
8. **`src/features/pedido/routes.ts`** — `PATCH /:id/confirmar` y `PATCH /:id/cancelar` con autenticación.
9. **`src/features/pedido/pedido.service.test.ts`** — 10 tests unitarios (mockeando Prisma).
10. **`src/__tests__/pedido-estado.integration.test.ts`** — 14 tests de integración (DB real).
11. **`src/__tests__/setup.integration.ts`** + **`vitest.integration.config.ts`** — Infraestructura de tests de integración.

---

## Contrato de integración

### Endpoints

| Método | Ruta | Auth | Body | Respuesta 200 | Errores |
|---|---|---|---|---|---|
| `PATCH` | `/api/v1/pedidos/:id/confirmar` | JWT (Bearer) | Vacío | `{ id, estado: "ENTREGADO", motivoFalla: null }` | 400 (UUID inválido), 404 (no existe), 409 (no PENDIENTE) |
| `PATCH` | `/api/v1/pedidos/:id/cancelar` | JWT (Bearer) | `{ motivo: MotivoFalla }` | `{ id, estado: "NO_ENTREGADO", motivoFalla }` | 400 (UUID inválido / motivo inválido / faltante), 404, 409 |

### Tipos compartidos (mobile ↔ backend)

```ts
// Deben coincidir exactamente en ambos proyectos
type EstadoPedido = 'PENDIENTE' | 'ENTREGADO' | 'NO_ENTREGADO';
type MotivoFalla =
  | 'CLIENTE_AUSENTE'
  | 'DIRECCION_INCORRECTA'
  | 'ACCESO_DENEGADO'
  | 'OTRO';
```

### Reglas de negocio

| Regla | Validación |
|---|---|
| Solo se puede actuar sobre pedidos `PENDIENTE` | Backend: error 409. Frontend: badge de solo lectura si es final. |
| `motivoFalla` es obligatorio cuando `estado === NO_ENTREGADO` | Backend: error 400 si falta. Frontend: modal requiere selección. |
| Estados `ENTREGADO` y `NO_ENTREGADO` son finales e inmutables | Backend: error 409 si se intenta mutar. Frontend: no ofrece botones de acción. |
| `motivo` debe pertenecer al enum cerrado | Backend: error 400 si no coincide. Frontend: selector con valores fijos. |

---

## Decisiones técnicas

### Backend

1. **Prisma 7 con driver adapter** — Se usó `@prisma/adapter-pg` con `PrismaPg` en lugar del engine embebido, requerido por Prisma ORM 7.
2. **`rootDir: "./src"` + generated output en `src/generated/prisma/`** — Se movió el output de Prisma dentro de `src/` para respetar la restricción de `rootDir` del tsconfig y evitar el error TS6059.
3. **Error handler con status 400 para validaciones** — Se usó `safeParse` + `AppError(400)` en el controller (en vez de dejar que ZodError caiga al error handler global que responde 422), para alinear los códigos de error con la especificación TDD.
4. **Mock manual de Prisma en unit tests** — Se usó `vi.hoisted()` + `vi.mock()` en vez de `vitest-mock-prisma`, porque la librería no tiene soporte confirmado para Prisma 7.
5. **Base de test via `TEST_DATABASE_URL`** — Se creó una config separada (`vitest.integration.config.ts`) con setup que mapea `TEST_DATABASE_URL` → `DATABASE_URL` antes de que la app importe los módulos, garantizando que tanto la app como los helpers de seed usen la misma conexión.

### Mobile

1. **Componentes sin dependencias externas** — `PedidoStatusActions` y `MotivoFallaModal` usan solo `react-native` core (`Pressable`, `Modal`, `ActivityIndicator`, `StyleSheet`) más las utilidades existentes (`useThemeColor`, `Colors`). No se agregaron librerías UI.
2. **Estado local estricto** — El modal maneja su propio `selectedMotivo` y `isLoading`. `PedidoStatusActions` maneja `modalVisible` y `isLoading`. El padre provee los callbacks pero la UI gestiona su propio estado de carga y del modal.
3. **Tokens semánticos en `Colors`** — Se agregaron colores semánticos (success, danger, etc.) a `constants/theme.ts` en lugar de hardcodear valores hex en los componentes, manteniendo consistencia con dark mode.

### Pendiente para producción

- **[DB]** Ejecutar `npx prisma migrate dev --name add_pedido_model` contra una base PostgreSQL real.
- **[DB test]** Crear DB de test y aplicar migraciones antes de correr `npm run test:integration`.
- **[Mobile router]** Conectar `PedidoStatusActions` a las pantallas del app (Expo Router) y pasar los callbacks reales (fetch a la API).
