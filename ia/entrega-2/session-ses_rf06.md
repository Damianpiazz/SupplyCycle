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

---

## 2. MOBILE — App React Native + Expo

### 2.1 Tipo `Cliente` actualizado

**Archivo:** `mobile/types/cliente.ts`

```typescript
export interface Cliente {
  // ...campos existentes...
  tieneDemora?: boolean;
  cantidadEnvasesPendientes?: number;
  fechaUltimaEntrega?: string | null;
}
```

### 2.2 Datos mock con demora

**Archivo:** `mobile/mocks/mockData.ts`

- Helper `daysAgo(days)` para generar fechas ISO relativas.
- `MOCK_CLIENTES[0]` (María González): `tieneDemora: true`, `cantidadEnvasesPendientes: 4`, `fechaUltimaEntrega: daysAgo(18)`
- `MOCK_CLIENTES[1]` (Carlos López): `tieneDemora: true`, `cantidadEnvasesPendientes: 2`, `fechaUltimaEntrega: daysAgo(16)`
- Resto: `tieneDemora: false`, `cantidadEnvasesPendientes: 0`

### 2.3 Tests de mock data

**Archivo:** `mobile/mocks/__tests__/mockData.test.ts`

3 nuevos tests:
- Cada cliente tiene los 3 campos de demora con tipos correctos
- Existe al menos un cliente con demora para testing
- Los clientes sin demora tienen `cantidadEnvasesPendientes === 0`

### 2.4 Componente DemoraBadge

**Archivo:** `mobile/features/clientes/components/DemoraBadge.tsx`

- Badge anaranjado (color `theme.warning`) que muestra "X envases pendientes"
- Solo se renderiza si `cantidadEnvasesPendientes > 0`
- Props tipadas: `cantidadEnvasesPendientes`, `fechaUltimaEntrega`

### 2.5 Lista de clientes con indicador de demora

**Archivo:** `mobile/features/clientes/screens/ClientesListScreen.tsx`

- Cada card renderiza `DemoraBadge` si `tieneDemora === true`
- Chip de filtro **"Con demora"** en la barra de filtros (junto a los filtros por día)
- Al activar el filtro, solo se muestran clientes con `tieneDemora === true`
- Bug corregido: `c.tieneDemora !== true` en vez de `!c.tieneDemora` para tratar `undefined` correctamente
- Mensaje de empty actualizado para considerar el filtro de demora

### 2.6 Refactor de rutas — Separación de ver/editar cliente

**Contexto:** Originalmente `/clientes/[id]` renderizaba `ClienteEditarScreen`. Se separó en dos rutas:

| Ruta | Componente | Función |
|---|---|---|
| `/clientes/[id]` | `ClienteVerScreen` | Solo lectura |
| `/clientes/editar/[id]` | `ClienteEditarScreen` | Edición |

**Archivos modificados/creados:**

| Archivo | Cambio |
|---|---|
| `app/(tabs)/clientes/_layout.tsx` | Agregado `Stack.Screen name="editar/[id]"` |
| `app/(tabs)/clientes/[id].tsx` | Ahora renderiza `ClienteVerScreen` (antes `ClienteEditarScreen`) |
| `app/(tabs)/clientes/editar/[id].tsx` | **Nuevo** — entry point que renderiza `ClienteEditarScreen` |
| `features/clientes/screens/ClienteVerScreen.tsx` | **Nuevo** — pantalla solo lectura |

### 2.7 ClienteVerScreen — Pantalla de solo lectura

**Archivo:** `mobile/features/clientes/screens/ClienteVerScreen.tsx`

- Muestra datos del cliente en modo solo lectura (Text en vez de Inputs)
- Badge de demora (`DemoraBadge`) si `tieneDemora === true`
- Fecha de última entrega formateada en español
- Domicilios con días y horarios
- Botón "Editar cliente" que navega a `/clientes/editar/[id]`
- Placeholder comentado para RF-06.3:
  ```
  {/* TODO RF-06.3: Historial de entregas y devoluciones de envases */}
  ```

### 2.8 Navegación desde lista

**Archivo:** `mobile/features/clientes/screens/ClientesListScreen.tsx`

- Tap en card → `/clientes/[id]` (ClienteVerScreen — solo lectura)
- Botón "Editar" → `/clientes/editar/[id]` (ClienteEditarScreen — edición)

#### Validación mobile

| Comprobación | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ Sin errores nuevos (solo preexistentes) |
| `vitest run` | ✅ 221/221 tests pasan (34 suites) |
| Código fuente en inglés, UI en español | ✅ |
| Máximo 250 líneas por componente (DemoraBadge: ~40, ClienteVerScreen: ~190) | ✅ |

---

## 3. ARTICULACIÓN BACKEND ↔ MOBILE

El endpoint `GET /api/v1/clientes/:id/historial` fue diseñado para alimentar el placeholder en `ClienteVerScreen`. Pendiente para trabajo futuro (RF-06.3):

1. Llamar `GET /api/v1/clientes/:id/historial` con el token de autenticación
2. Renderizar `saldoEnvases` como resumen de envases pendientes
3. Renderizar `historial` como lista cronológica de eventos (ENTREGA / DEVOLUCION)