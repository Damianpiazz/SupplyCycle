# Implementación RF-06: Visualizar Demoras de Envases — Consolidado

**Session ID:** ses_mobile-rf06 (consolidado)
**Created:** 20/6/2026
**Updated:** 21/6/2026
**Requerimiento:** RF-06
**Ámbito:** mobile (app React Native + Expo) + backend (REST API)

---

## Contexto

RF-06 requiere que el sistema pueda listar clientes con envases retenidos en demora (> 15 días sin devolver) y mostrar el saldo de envases pendientes. Se implementó tanto en backend (endpoints REST) como en mobile (pantallas y componentes).

---

## 1. BACKEND — REST API

### 1.1 Helper compartido `retenidos-utils.ts`

**Archivo:** `backend/src/lib/retenidos-utils.ts`

| Exportación | Descripción |
|---|---|
| `DIAS_LIMITE_DEMORA = 15` | Constante de umbral (días) |
| `calcularFechaDemora()` | `new Date(now - 15 days)` |
| `calcularDatosDemora(retenidos)` | => `{ tieneDemora, cantidadEnvasesPendientes, fechaUltimaEntrega }` |

### 1.2 Extensión de `GET /api/v1/clientes` — Datos de demora en listado

**Archivo:** `backend/src/features/clientes/service.ts`

Se modificó `toClienteResponse` para incluir los campos de demora en cada cliente:

```typescript
function toClienteResponse(cliente: ClienteWithRelations) {
  const datosDemora = calcularDatosDemora(cliente.retenidos ?? []);
  return {
    // ...campos existentes...
    tieneDemora: datosDemora.tieneDemora,
    cantidadEnvasesPendientes: datosDemora.cantidadEnvasesPendientes,
    fechaUltimaEntrega: datosDemora.fechaUltimaEntrega,
    // ...domicilios...
  };
}
```

Cambios específicos:
- `ClienteWithRelations`: se agregó `retenidos?: Array<{ estado: string; inicio: Date }>`
- `clienteInclude`: se agregó `retenidos: { where: { estado: 'RETENIDO' }, select: { estado: true, inicio: true } }`
- `toClienteResponse`: ahora llama `calcularDatosDemora()` e incluye los 3 campos nuevos

### 1.3 Nuevo endpoint `GET /api/v1/clientes/:id/historial`

**Archivo:** `backend/src/features/clientes/service.ts` — Nueva función `obtenerHistorialEnvases`

```typescript
GET /api/v1/clientes/:id/historial

Response Shape:
{
  saldoEnvases: Array<{
    itemId: string;
    nombre: string;       // nombre del tipo de envase
    cantidad: number;     // pendientes de devolución
  }>;
  historial: Array<{
    id: string;           // "{retenidoId}-entrega" | "{retenidoId}-devolucion"
    fecha: string;        // ISO date
    tipo: 'ENTREGA' | 'DEVOLUCION';
    cantidad: number;     // 1 (cada Retenido = 1 envase)
    tipoEnvase: string;
    pedidoId: string | null;  // número de pedido
  }>;
}
```

**Archivo:** `backend/src/features/clientes/controller.ts` — Nuevo `historialController`

**Archivo:** `backend/src/features/clientes/routes.ts` — Nueva ruta:
```typescript
router.get('/:id/historial', apiKeyAuth, authenticate, historialController);
```

**Importante**: la ruta `/:id/historial` se ubicó **antes** de `/:id` para evitar conflictos de matching.

### 1.4 Tests actualizados

**Archivo:** `backend/src/features/clientes/__tests__/clientes.service.test.ts`
- Agregado `retenidos: []` a `baseClienteRow`
- Agregado `tieneDemora: false`, `cantidadEnvasesPendientes: 0`, `fechaUltimaEntrega: null` a `expectedResponse`
- Agregado `retenidos` al mock de `clienteInclude`

#### Validación backend

| Comprobación | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ Sin errores |
| `vitest run src/features/clientes/__tests__/` | ✅ 27/27 tests pasan |
| No se modificaron rutas `/admin/` | ✅ |
| `verbatimModuleSyntax` respetado | ✅ |