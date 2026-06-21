# Implementación RF-06: Generar Listado de Demoras de Envases

**Session ID:** ses_rf06
**Created:** 20/6/2026
**Requerimiento:** RF-06
**Ámbito:** backend (panel admin) + app mobile (react native)

---

## Resumen de Cambios - Agente Mobile

Se implementó la visualización de los campos de demora (`tieneDemora`, `cantidadEnvasesPendientes`, `fechaUltimaEntrega`) que el backend ahora expone en `GET /api/v1/clientes`.

#### 🆕 `features/clientes/components/DemoraBadge.tsx` — Componente badge de demora
- Badge anaranjado que muestra "X envases pendientes" para clientes con demora.
- Usa el color `theme.warning` para destacar visualmente.
- Solo se renderiza si `cantidadEnvasesPendientes > 0`.

#### ✏️ `types/cliente.ts` — Tipo Cliente actualizado
- Se agregaron 3 campos opcionales al interface `Cliente`:
  ```typescript
  tieneDemora?: boolean;
  cantidadEnvasesPendientes?: number;
  fechaUltimaEntrega?: string | null;
  ```

#### ✏️ `mocks/mockData.ts` — Datos mock con demora
- Se agregó helper `daysAgo(days)` para generar fechas ISO relativas.
- `MOCK_CLIENTES[0]` (María González): `tieneDemora: true`, `cantidadEnvasesPendientes: 4`, `fechaUltimaEntrega: daysAgo(18)`.
- `MOCK_CLIENTES[1]` (Carlos López): `tieneDemora: true`, `cantidadEnvasesPendientes: 2`, `fechaUltimaEntrega: daysAgo(16)`.
- Los 4 clientes restantes: `tieneDemora: false`, `cantidadEnvasesPendientes: 0`.

#### ✏️ `features/clientes/screens/ClientesListScreen.tsx` — Lista con indicador de demora
- Cada card de cliente en la FlatList muestra un `DemoraBadge` si `tieneDemora === true`.
- Se agregó chip de filtro **"Con demora"** en la barra de filtros (junto a los filtros por día).
- Al activar el filtro, solo se muestran clientes con `tieneDemora === true`.

#### ✏️ `features/clientes/screens/ClienteEditarScreen.tsx` — Detalle con saldo de envases
- Aparece una tarjeta informativa al inicio del formulario:
  - **Con demora**: fondo anaranjado con "Envases pendientes: N" + "Última entrega: <fecha formateada en español>"
  - **Sin demora**: fondo verde con "Envases al día"

#### ✏️ `mocks/__tests__/mockData.test.ts` — Tests de demora
- 3 nuevos tests que verifican:
  - Que cada cliente tenga los 3 campos de demora con tipos correctos.
  - Que exista al menos un cliente con demora para testing.
  - Que los clientes sin demora tengan `cantidadEnvasesPendientes === 0`.

#### Validación
| Comprobación | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ Sin errores nuevos (solo preexistentes) |
| `vitest run mocks/__tests__/mockData.test.ts` | ✅ 15/15 tests pasan (3 nuevos) |
| No se modificaron archivos del backend | ✅ |
| Código fuente en inglés, UI en español | ✅ |
| Máximo 250 líneas por componente respetado (DemoraBadge: ~40 líneas) | ✅ |

---

## Resumen de Cambios - Agente Backend

### 1. Ruta GET /demorados
**Archivo:** `backend/src/admin/routes/retenidos.admin.routes.ts`
- Se agregó la ruta `router.get('/demorados', ctrl.listDemorados)` **antes** de las rutas parametrizadas (`/:id/editar`, `/:id`) para evitar conflictos de matching.

### 2. Controlador listDemorados
**Archivo:** `backend/src/admin/controllers/retenidos.admin.controller.ts`
- Se definió la constante `DIAS_LIMITE_DEMORA = 15` al inicio del archivo.
- Se implementó `listDemorados` que:
  - Captura un filtro opcional `?nombre=` desde query params.
  - Calcula la fecha límite (hoy - 15 días).
  - Consulta clientes activos que tengan al menos un `Retenido` en estado `'RETENIDO'` con `inicio <= fechaLimite`.
  - Si hay filtro de nombre, agrega búsqueda insensible por `OR` en `nombre`/`apellido`.
  - Calcula `cantidadPendientes` (total de retenidos activos del cliente) y `ultimaEntrega` (fecha del retenido más reciente).
  - Renderiza la vista `retenidos/demorados`.

### 3. Nueva Vista EJS: demorados.ejs
**Archivo creado:** `backend/src/admin/views/retenidos/demorados.ejs`
- Tabla con columnas: Cliente, Teléfono (con enlace WhatsApp), Envases Pendientes, Última Entrega, Acciones.
- Formulario GET de búsqueda por nombre/apellido.
- Botón "Ver Detalle" que redirige a `/admin/clientes/:id` (reutiliza la vista extendida del cliente).

### 4. Enlace en Sidebar
**Archivo:** `backend/src/admin/views/layouts/header.ejs`
- Se agregó el item "Envases Demorados" en la navegación lateral, apuntando a `/admin/retenidos/demorados`.

### 5. Extensión del Detalle del Cliente (RF-06.3 + RF-07)
**Archivo:** `backend/src/admin/controllers/clientes.admin.controller.ts`
- Se modificó la función `show` para consultar el historial completo de `Retenido` del cliente (con `Item` y `Pedido` asociados).
- Se consolidó en memoria el **Saldo de Envases Pendientes** (agrupando por `itemId` los registros con estado `'RETENIDO'`).
- Se pasan los objetos `retenidos` (historial completo) y `saldoEnvases` (saldo agrupado) a la vista.

**Archivo:** `backend/src/admin/views/clientes/show.ejs`
- Se agregaron dos nuevas secciones debajo de los datos de contacto:
  - **Saldo de Envases Pendientes**: tabla con tipo de envase y cantidad pendiente.
  - **Historial de Envases**: tabla cronológica con tipo de envase, fecha de entrega, fecha de devolución, estado y pedido de origen.

### Validación
- `npx tsc --noEmit` → Sin errores de tipo.
- Todos los imports respetan `verbatimModuleSyntax` (uso de `import type`).
- Los patrones de código son consistentes con el resto del admin (mismo manejo de errores, mismo formato de vistas EJS).

---

### 📡 Extensión REST API — Clientes con datos de demora (20/6/2026)

Se extendió el **endpoint REST** `GET /api/v1/clientes` (consumido por la app mobile) para que cada cliente incluya los campos `tieneDemora`, `cantidadEnvasesPendientes` y `fechaUltimaEntrega`.

#### 🆕 `src/lib/retenidos-utils.ts` — Helper compartido
- Se extrajo la lógica de demora a un archivo común para evitar duplicación entre admin y REST API.
- Exporta:
  - `DIAS_LIMITE_DEMORA = 15`
  - `calcularFechaDemora()` → hoy - 15 días
  - `calcularDatosDemora(retenidos)` → `{ tieneDemora, cantidadEnvasesPendientes, fechaUltimaEntrega }`

#### ✏️ `src/features/clientes/service.ts` — REST API service
- **Import**: se agregó `calcularDatosDemora` desde el nuevo helper.
- **`ClienteWithRelations`**: se agregó `retenidos: Array<{ estado: string; inicio: Date }>`.
- **`clienteInclude`**: se agregó `retenidos` al `include` con filtro `{ where: { estado: 'RETENIDO' } }` — se trae en la misma query, sin roundtrips extra.
- **`toClienteResponse`**: ahora computa y retorna los 3 campos nuevos:
  ```typescript
  tieneDemora: boolean
  cantidadEnvasesPendientes: number
  fechaUltimaEntrega: string | null  // ISO date
  ```

#### ✏️ `src/features/clientes/__tests__/clientes.service.test.ts` — Tests actualizados
- `clienteInclude` mock: se agregó `retenidos` con el mismo shape.
- `baseClienteRow`: se agregó `retenidos: []`.
- `expectedResponse`: incluye `tieneDemora: false`, `cantidadEnvasesPendientes: 0`, `fechaUltimaEntrega: null`.

#### Validación
| Comprobación | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ Sin errores |
| `vitest run clientes.service.test.ts` | ✅ 17/17 tests pasan |
| `vitest run clientes.controller.test.ts` | ✅ 10/10 tests pasan |
| No se modificaron rutas `/admin/` | ✅ |
| `verbatimModuleSyntax` respetado | ✅ |
| Lógica de demora extraída a helper compartido | ✅ |