# Gestión de excepciones y validaciones — Entrega 2 (Backend)

## 1. Casos de error nuevos introducidos en E2

A continuación se listan los casos de error que no existían en la Entrega 1 y fueron incorporados durante la Entrega 2. Se incluye también el conjunto completo de errores de la Entrega 1 como línea de base, para que la lectora pueda apreciar la evolución.

---

### 1.1 INVALID_API_KEY

- **Descripción**: Se dispara cuando una solicitud incluye un header `x-api-key` cuyo valor no coincide con la clave configurada en `BOT_API_KEY` (variable de entorno). Este error es específico del nuevo middleware `apiKeyAuth`, introducido en E2 para permitir que el bot de WhatsApp (y otros clientes servidores) accedan a endpoints de lectura sin pasar por el flujo completo de JWT.
- **Dónde se lanzó**: `backend/src/middleware/api-key-auth.ts`, función `apiKeyAuth` (línea 28). El middleware valida el header; si el valor no coincide, responde con 401 sin ejecutar el controlador.
- **HTTP status**: 401 (Unauthorized)
- **Código devuelto**: `INVALID_API_KEY`

### 1.2 SERVER_ERROR (por BOT_API_KEY no configurado)

- **Descripción**: Se dispara cuando el header `x-api-key` está presente pero la variable de entorno `BOT_API_KEY` no fue configurada en el servidor. Es un error de configuración, no del cliente.
- **Dónde se lanzó**: `backend/src/middleware/api-key-auth.ts` (línea 17).
- **HTTP status**: 500 (Internal Server Error)
- **Código devuelto**: `SERVER_ERROR`
- **Detalle**: El mensaje al cliente es genérico ("Error de configuración del servidor") para no exponer información interna. En el log del servidor se imprime `BOT_API_KEY not configured`.

### 1.3 NOT_FOUND en endpoints de historial, consumo y pedidos de cliente

- **Descripción**: Los nuevos endpoints `GET /clientes/:id/historial`, `GET /clientes/:id/consumo` y `GET /clientes/:id/pedidos` lanzan 404 si el `:id` proporcionado no corresponde a ningún cliente existente. Este error no existía en E1 porque estos endpoints son nuevos.
- **Dónde se lanzó**: `backend/src/features/clientes/service.ts`, funciones `obtenerHistorialEnvases`, `obtenerConsumoCliente` y `obtenerPedidosCliente`. Cada una verifica `if (!cliente) throw ApiError.notFound(...)`.
- **HTTP status**: 404 (Not Found)
- **Código devuelto**: `NOT_FOUND`

### 1.4 Errores de validación Zod existentes en E1 que continúan en E2

Se mantienen sin cambios los siguientes errores de la Entrega 1 y se verificó su presencia en el código actual:

| Nombre | Código | Status | Dónde se produce |
|--------|--------|--------|------------------|
| Error de validación genérico | `VALIDATION_ERROR` | 400 | `error-handler.ts` captura `ZodError` de todos los schemas |
| Token no proporcionado | (dentro de ApiError) | 401 | `auth.middleware.ts` — sin header `Authorization` o sin formato `Bearer` |
| Token expirado | (dentro de ApiError) | 401 | `auth.middleware.ts` — `jwt.TokenExpiredError` |
| Token inválido | (dentro de ApiError) | 401 | `auth.middleware.ts` — cualquier otro error de `jwt.verify` |
| Credenciales inválidas | `INVALID_CREDENTIALS` | 401 | `features/auth/service.ts` — login fallido |
| Pedido no encontrado | `NOT_FOUND` | 404 | `features/pedidos/service.ts` — `obtenerPedido` |
| Cliente no existe | `NOT_FOUND` | 404 | `features/pedidos/service.ts` — `crearPedido` |
| Ítem no existe | `BAD_REQUEST` | 400 | `features/pedidos/service.ts` — `crearPedido` |
| Ítem inactivo | `BAD_REQUEST` | 400 | `features/pedidos/service.ts` — `crearPedido` |
| Transición de estado inválida | `BAD_REQUEST` | 400 | `features/pedidos/service.ts` — `actualizarEstado` |
| No autenticado | (dentro de ApiError) | 401 | `auth.middleware.ts` — `requireRole` sin `req.user` |
| Sin permisos | (dentro de ApiError) | 403 | `auth.middleware.ts` — `requireRole` con rol incorrecto |

---

## 2. Reglas de negocio explícitas

### Reglas que ya existían en E1 y se mantienen en E2

**RN-01: "Un pedido solo puede avanzar en la máquina de estados: PENDIENTE → EN_RUTA → ENTREGADO; excepcionalmente PENDIENTE → CANCELADO (admin) o EN_RUTA → NO_ENTREGADO (repartidor)."**

- **Cómo se implementa**: `backend/src/features/pedidos/service.ts`, función `actualizarEstado`. Cada transición se valida con un mapa de estados permitidos. Transiciones inválidas lanzan `ApiError.badRequest('Transición de estado inválida')`.
- **Archivos involucrados**: `service.ts`, `routes.ts`, `controller.ts`

**RN-02: "Solo el administrador puede cancelar un pedido (CANCELADO); el repartidor solo puede marcar NO_ENTREGADO con un motivo."**

- **Cómo se implementa**: `cancelarPedidoRepartidor` (service, para repartidor) cambia a `NO_ENTREGADO` requiriendo `motivo`. No existe ruta pública para que repartidor ponga `CANCELADO`. La ruta `PATCH /:id/estado` controla transiciones y `PATCH /:id/cancelar` está protegida con `requireRole('REPARTIDOR')`.
- **Archivos involucrados**: `routes.ts`, `service.ts`, `auth.middleware.ts`

**RN-03: "Al crear un pedido se debe verificar que el cliente exista, que cada ítem exista y esté activo."**

- **Cómo se implementa**: En `crearPedido` (service), se consultan `cliente` y cada `item` en la BD. Si algún ítem no existe o está inactivo, se lanza `ApiError.badRequest`.
- **Archivos involucrados**: `service.ts`

**RN-04: "No se puede eliminar el último ítem de un pedido."**

- **Cómo se implementa**: En `quitarItem` (service), se verifica que el pedido tenga al menos 2 ítems antes de permitir la eliminación. Si es el único, se lanza `ApiError.badRequest`.
- **Archivos involucrados**: `service.ts`

**RN-05: "Los pedidos eliminados no se muestran en listados ni búsquedas (soft delete)."**

- **Cómo se implementa**: El campo `deletedAt` se setea con `new Date()` al eliminar. Las consultas (`listarPedidos`, `obtenerPedido`, `obtenerPedidosDelDia`) filtran con `{ deletedAt: null }`.
- **Archivos involucrados**: `service.ts`

**RN-06: "Solo ADMIN puede crear, modificar y eliminar usuarios del sistema."**

- **Cómo se implementa**: Las rutas de `features/usuarios/routes.ts` usan `requireRole('ADMIN')` en operaciones de escritura.
- **Archivos involucrados**: `features/usuarios/routes.ts`, `auth.middleware.ts`

**RN-07: "Solo ADMIN puede crear, modificar y eliminar clientes."**

- **Cómo se implementa**: Las rutas de `features/clientes/routes.ts` tienen `requireRole('ADMIN')` en `POST /`, `PATCH /:id` y `DELETE /:id`.
- **Archivos involucrados**: `features/clientes/routes.ts`

### Reglas nuevas introducidas en E2

**RN-08: "El campo numero_pedido se genera automáticamente al crear un pedido, es único, no nulo y no editable después de la creación."**

- **Descripción**: Cada pedido recibe un identificador visible de formato `PED-XXXXXX` (ej: `PED-000001`, `PED-000002`). Este número se calcula consultando la cantidad de pedidos existentes (count) + 1, formateado con `padStart(6, '0')`. La generación ocurre dentro de una transacción de Prisma para evitar duplicados ante inserciones simultáneas.
- **Cómo se implementa**: En `backend/src/features/pedidos/service.ts`, función `crearPedido`. Se usa `prisma.$transaction` para contar y crear atómicamente. El esquema Prisma define `numeroPedido` como `@unique`.
- **Archivos involucrados**: `prisma/schema.prisma`, `features/pedidos/service.ts`, migración de base de datos

**RN-09: "Un envase retenido se considera en demora si han pasado 15 o más días desde su fecha de inicio."**

- **Descripción**: La constante `DIAS_LIMITE_DEMORA = 15` define el umbral. La función `calcularFechaDemora()` devuelve `hoy - 15 días`. La función `calcularDatosDemora()` recibe un arreglo de retenidos y computa: `tieneDemora` (true si algún retenido con estado RETENIDO tiene inicio <= fecha de demora), `cantidadEnvasesPendientes` (total de retenidos en RETENIDO), y `fechaUltimaEntrega` (fecha ISO del retenido más reciente o null).
- **Cómo se implementa**: Helper compartido `backend/src/lib/retenidos-utils.ts`. Se utiliza tanto en el listado de clientes (extendiendo la respuesta con los 3 campos de demora) como en el endpoint de historial.
- **Archivos involucrados**: `src/lib/retenidos-utils.ts`, `features/clientes/service.ts`

**RN-10: "Los endpoints de lectura (GET) están disponibles para el bot de WhatsApp mediante API Key sin requerir autenticación JWT completa."**

- **Descripción**: El middleware `apiKeyAuth` se ejecuta antes que `authenticate`. Si el header `x-api-key` es válido, inyecta un usuario `{ userId: 'bot', email: 'bot@supplycycle.com', rol: 'BOT' }` y continúa. Si no hay API Key, pasa al siguiente middleware (JWT normal). Si la API Key es inválida, responde 401 sin continuar.
- **Cómo se implementa**: `backend/src/middleware/api-key-auth.ts`. Se agregó a las rutas GET de `clientes` (listar, obtener, historial, consumo, pedidos) y `pedidos` (hoy, listar, obtener).
- **Archivos involucrados**: `src/middleware/api-key-auth.ts`, `features/clientes/routes.ts`, `features/pedidos/routes.ts`, `config/env.ts`

**RN-11: "Las rutas con segmento fijo (como /historial, /consumo, /pedidos) deben declararse antes que /:id para evitar conflictos de matching en Express."**

- **Descripción**: Express empareja rutas en orden de definición. Si `/:id` se declara antes que `/:id/historial`, Express interpretaría "historial" como un valor de `:id`. Por eso todas las rutas de subrecurso se declaran explícitamente antes que la ruta de obtención por ID.
- **Cómo se implementa**: En `features/clientes/routes.ts`, el orden es: `'/'`, `'/:id/historial'`, `'/:id/consumo'`, `'/:id/pedidos'`, `'/:id'`.
- **Archivos involucrados**: `features/clientes/routes.ts`

**RN-12: "El listado de pedidos de un cliente (GET /clientes/:id/pedidos) se ordena por fecha descendente y excluye pedidos eliminados (soft delete)."**

- **Descripción**: A diferencia del listado general de pedidos, este endpoint específico del cliente devuelve solo los pedidos activos (`deletedAt: null`) ordenados del más reciente al más antiguo. Si el cliente no tiene pedidos, devuelve arreglo vacío.
- **Cómo se implementa**: `backend/src/features/clientes/service.ts`, función `obtenerPedidosCliente`. Consulta `prisma.pedido.findMany` con `where: { domicilio: { clienteId }, deletedAt: null }` y `orderBy: { fecha: 'desc' }`.
- **Archivos involucrados**: `features/clientes/service.ts`

**RN-13: "Los endpoints de consumo y pedidos de cliente devuelven 404 si el cliente no existe, y valores cero si existe pero no tiene pedidos."**

- **Descripción**: Esta regla diferencia dos casos: (a) cliente no encontrado → 404; (b) cliente existe pero sin pedidos → respuesta exitosa con valores en 0: `{ totalPedidos: 0, totalBidones: 0, promedioBidonesPorPedido: 0 }`.
- **Cómo se implementa**: En `obtenerConsumoCliente` y `obtenerPedidosCliente`, primero se verifica existencia del cliente (`if (!cliente) throw ApiError.notFound(...)`), luego se consultan pedidos. Si no hay pedidos, se retornan los valores predeterminados.
- **Archivos involucrados**: `features/clientes/service.ts`

---

## 3. Resumen de cambios de E1 a E2

| Aspecto | Entrega 1 | Entrega 2 |
|---------|-----------|-----------|
| Autenticación | Solo JWT (Bearer token) | JWT + API Key opcional para bots |
| Modelo Pedido | Sin `numeroPedido` | Agrega `numeroPedido` único auto-generado |
| Clientes | CRUD básico + listado | Agrega 3 endpoints: historial, consumo, pedidos del cliente |
| Envases retenidos | No existía | Modelo `Retenido` con estados y demora (15 días) |
| Middleware | `authenticate`, `requireRole` | Agrega `apiKeyAuth` (antes de authenticate) |
| Validaciones | Estado de pedidos, existencia de items, soft delete | Las anteriores + validación de API Key + 404 en nuevos endpoints |
| Reglas de negocio | 7 reglas (RN-01 a RN-07) | 6 reglas nuevas (RN-08 a RN-13) |
| Tests backend | 35 tests de servicio + 11 auth + 11 integración | Se agregaron tests para nuevos endpoints (clientes historial/consumo/pedidos) alcanzando 90+ tests |
