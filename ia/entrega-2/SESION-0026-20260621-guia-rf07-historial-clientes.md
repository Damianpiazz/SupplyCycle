# Guía de Continuación — RF-07 (Ver Historial de Clientes)

**Fecha:** 21/6/2026
**Contexto:** Esta guía está dirigida al agente o desarrollador que tome el relevo
para implementar RF-07. RF-06 está completamente implementado. Lo que sigue es
conectar las secciones 3 y 4 de `ClienteHistorialScreen` con datos reales.

---

## Estado actual del proyecto

### Lo que ya existe y no hay que tocar

| Archivo | Descripción |
|---|---|
| `mobile/features/clientes/screens/ClienteHistorialScreen.tsx` | Pantalla de historial con 4 secciones. Secciones 1 y 2 conectadas al backend. Secciones 3 y 4 mockeadas. |
| `mobile/features/clientes/hooks/useHistorialEnvases.ts` | Hook que consume `GET /api/v1/clientes/:id/historial`. Patrón de referencia para los hooks nuevos. |
| `mobile/types/historial.ts` | Tipos `MovimientoEnvase`, `SaldoEnvase`, `ResumenConsumo`, `PedidoHistorialResumen`. Ya definidos. |
| `mobile/mocks/historialMock.ts` | `MOCK_PEDIDOS` y `MOCK_RESUMEN_CONSUMO`. Actualmente en uso en secciones 3 y 4. |
| `backend/src/features/clientes/service.ts` | `obtenerHistorialEnvases()` — función de referencia para los servicios nuevos. |
| `backend/src/lib/retenidos-utils.ts` | Helper compartido de lógica de demora. |

### Convenciones críticas a respetar

**Backend:**
- Toda respuesta exitosa se envuelve en `{ data: T }` (ADR-0000).
- Respetar `verbatimModuleSyntax` (`import type` donde corresponda).
- No modificar rutas `/admin/`.
- Nuevos endpoints van en `backend/src/features/clientes/` siguiendo el patrón
  controller → service → routes existente.
- Ubicar rutas con path fijo (ej: `/pedidos`, `/consumo`) **antes** de `/:id`
  en el archivo de rutas para evitar conflictos de matching.

**Mobile:**
- Usar `apiClient` (Axios singleton de `services/api.ts`), nunca `fetch` nativo.
- Usar `unwrapResponse<T>(res)` para extraer el objeto interno del envelope `{ data: T }`.
- Path alias `@/` para todos los imports internos.
- Tokens de color desde `constants/theme.ts` via `useColorScheme()`.
- Máximo 250 líneas por componente. Extraer subcomponentes si se supera.
- Código fuente en inglés, UI en español.

---

## Lo que falta implementar

### Sección 3 — Historial de Pedidos (RF-07.1 / RF-07.2)

**Qué muestra:** lista cronológica de pedidos del cliente con fecha, estado y
total de bidones.

**Backend — crear `GET /api/v1/clientes/:id/pedidos`:**

Response esperado (envelope incluido):
```typescript
{
  data: Array<{
    id: string;
    fecha: string;       // ISO date
    estado: string;      // ej: 'ENTREGADO' | 'PENDIENTE' | 'CANCELADO'
    totalBidones: number;
  }>
}
```

Ordenado por fecha descendente. Si el cliente no tiene pedidos, devolver `{ data: [] }`.
El tipo `PedidoHistorialResumen` ya está definido en `mobile/types/historial.ts`.

**Mobile — crear hook `usePedidosCliente(clienteId: string)`** en
`mobile/features/clientes/hooks/usePedidosCliente.ts`, siguiendo exactamente
el mismo patrón de `useHistorialEnvases`:

```typescript
// Patrón a replicar:
const res = await apiClient.get(`/clientes/${clienteId}/pedidos`);
const data = unwrapResponse<PedidoHistorialResumen[]>(res);
```

En `ClienteHistorialScreen`, reemplazar `MOCK_PEDIDOS` por los datos del hook
y eliminar el import correspondiente de `historialMock.ts`.

Actualizar el comentario TODO de la sección 3:
```typescript
// CONECTADO: GET /api/v1/clientes/:id/pedidos
// TODO RF-07.2: agregar detalle de entregas por pedido si se requiere
```

---

### Sección 4 — Resumen de Consumo (RF-07.5)

**Qué muestra:** tarjeta con total de pedidos, total de bidones consumidos y
promedio de bidones por pedido.

**Backend — crear `GET /api/v1/clientes/:id/consumo`:**

Response esperado:
```typescript
{
  data: {
    totalPedidos: number;
    totalBidones: number;
    promedioBidonesPorPedido: number;
  }
}
```

Calcular desde los `Pedido` del cliente. Si no tiene pedidos:
`{ totalPedidos: 0, totalBidones: 0, promedioBidonesPorPedido: 0 }`.
El tipo `ResumenConsumo` ya está definido en `mobile/types/historial.ts`.

**Mobile — crear hook `useConsumoCliente(clienteId: string)`** en
`mobile/features/clientes/hooks/useConsumoCliente.ts`:

```typescript
const res = await apiClient.get(`/clientes/${clienteId}/consumo`);
const data = unwrapResponse<ResumenConsumo>(res);
```

En `ClienteHistorialScreen`, reemplazar `MOCK_RESUMEN_CONSUMO` por los datos
del hook y eliminar el import correspondiente.

Actualizar el comentario TODO:
```typescript
// CONECTADO: GET /api/v1/clientes/:id/consumo
```

---

## Orden de ejecución recomendado

1. **Backend primero:** crear los dos endpoints (`/pedidos` y `/consumo`) y
   verificar con `npx tsc --noEmit` + tests.
2. **Mobile segundo:** crear los dos hooks y conectar las secciones 3 y 4 en
   `ClienteHistorialScreen`.
3. Correr `vitest run` en mobile y confirmar 221+ tests sin regresión.

---

## Checklist de cierre de RF-07

- [ ] `GET /api/v1/clientes/:id/pedidos` implementado y testeado
- [ ] `GET /api/v1/clientes/:id/consumo` implementado y testeado
- [ ] Hook `usePedidosCliente` creado y conectado en sección 3
- [ ] Hook `useConsumoCliente` creado y conectado en sección 4
- [ ] `MOCK_PEDIDOS` y `MOCK_RESUMEN_CONSUMO` eliminados de `ClienteHistorialScreen`
- [ ] Comentarios TODO actualizados a CONECTADO
- [ ] `npx tsc --noEmit` sin errores nuevos en backend y mobile
- [ ] `vitest run` sin regresión en mobile