# Implementación RF-06: Generar Listado de Demoras de Envases

**Session ID:** ses_rf06
**Created:** 20/6/2026
**Requerimiento:** RF-06
**Ámbito:** backend (panel admin) + app mobile (react native)

---

## Resumen de Cambios

### Agente Mobile

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