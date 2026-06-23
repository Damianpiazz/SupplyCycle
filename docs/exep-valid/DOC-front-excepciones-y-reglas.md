# Gestión de excepciones y validaciones — Entrega 2 (Mobile)

## 1. Casos de error nuevos introducidos en E2

A continuación se listan los casos de error que no existían en la Entrega 1 y fueron incorporados durante la Entrega 2 en la aplicación mobile. Se incluye también el conjunto de errores de la Entrega 1 como línea de base.

---

### 1.1 Error de red / servidor no disponible

- **Descripción**: Se dispara cuando el dispositivo no puede establecer conexión con el servidor backend (ECONNREFUSED, Network Error, timeout). Es el error más frecuente cuando el repartidor trabaja en zonas sin cobertura.
- **Dónde se muestra**: En toda pantalla que consume datos de la API:
  - Pantalla de inicio (InicioScreen)
  - Lista de pedidos (PedidosListScreen)
  - Detalle de pedido (PedidoDetalleScreen)
  - Lista de clientes (ClientesListScreen)
  - Pantalla de perfil (PerfilScreen)
- **Cómo se muestra**: Dos mecanismos según el contexto:
  - **Pantalla completa**: El componente `ErrorMessage` muestra un ícono de advertencia, el mensaje del error y un botón "Reintentar" que ejecuta `refetch()` de TanStack Query.
  - **Toast flotante superior**: Cuando la acción es una mutación (confirmar entrega, cancelar pedido, crear cliente, etc.), se muestra un `Toast` de tipo `error` con el mensaje correspondiente durante 3 segundos.
- **Origen**: Del lado del cliente. Es detectado por `handleApiError.ts` que distingue entre errores de red (sin respuesta del servidor) y errores de aplicación (con respuesta 4xx/5xx). El mensaje mostrado es _"No hay conexión con el servidor"_ o _"Error de conexión con el servidor"_.

### 1.2 Error de validación del lado del servidor (400 Bad Request)

- **Descripción**: Cuando el backend rechaza una operación porque los datos enviados no cumplen las reglas de negocio (ej: ítem inactivo, cliente inexistente, transición de estado inválida). El backend responde con un objeto `ApiError` que contiene un código y mensaje descriptivo.
- **Dónde se muestra**: En las pantallas que realizan mutaciones:
  - LoginScreen (credenciales inválidas)
  - PedidoAltaScreen (cliente no encontrado, ítem inactivo)
  - PedidoDetalleScreen (transición de estado inválida)
  - ClienteAltaScreen / ClienteEditarScreen (datos duplicados, validaciones del servidor)
  - UsuarioAltaScreen / UsuarioEditarScreen (email duplicado, rol inválido)
- **Cómo se muestra**: 
  - **Toast de tipo `error`** con el mensaje extraído del campo `error.message` de la respuesta del backend.
  - En LoginScreen además se muestra un **card con fondo semitransparente** debajo del título con el mensaje de error del servidor.
- **Origen**: Viene del backend (código `VALIDATION_ERROR`, `BAD_REQUEST`).

### 1.3 Error de autenticación (401 Unauthorized)

- **Descripción**: Se dispara cuando el token JWT expiró, es inválido o no fue provisto. El interceptor de Axios en `services/api.ts` captura cualquier respuesta 401 y ejecuta el logout automático.
- **Dónde se muestra**: Global, en cualquier llamada a la API.
- **Cómo se muestra**: 
  - Se limpia el token de SecureStore.
  - Se resetea el estado de autenticación en `authStore` (Zustand).
  - Se redirige automáticamente a la pantalla de login mediante `router.replace('/login')`.
  - El usuario ve la pantalla de login sin mensaje adicional (el error se maneja silenciosamente).
- **Origen**: Viene del backend (token expirado, token inválido, token no provisto). Se combina con el interceptor del lado del cliente.

### 1.4 Error de permiso (403 Forbidden)

- **Descripción**: El usuario autenticado no tiene el rol necesario para ejecutar la acción solicitada (ej: un repartidor intenta crear un usuario).
- **Dónde se muestra**: En pantallas de administración protegidas (Clientes, Usuarios, Estadísticas) cuando un repartidor accede.
- **Cómo se muestra**: 
  - **Navegación**: Las rutas protegidas se ocultan de la barra de tabs según el rol del usuario (ver sección 2.6). Si el usuario accede directamente por URL, la pantalla muestra un `ErrorMessage` con mensaje _"No tienes permisos para realizar esta acción"_.
- **Origen**: Viene del backend (`requireRole` middleware). Se maneja también del lado del cliente mediante ocultamiento de UI.

### 1.5 Error de validación del lado del cliente (formularios)

- **Descripción**: Validaciones locales que se ejecutan antes de enviar datos al backend. No existían en E1 para los formularios de alta de clientes (nuevo en E2).
- **Dónde se muestra**: 
  - ClienteAltaScreen / ClienteEditarScreen
  - LoginScreen
  - PedidoAltaScreen
- **Cómo se muestra**: **Inline**, debajo del campo correspondiente. Cada `Input` tiene una prop `error` que muestra un texto en color rojo debajo del campo. Los errores se limpian automáticamente cuando el usuario comienza a escribir de nuevo.
- **Origen**: Validación local del lado del cliente, sin llamar al servidor.

**Validaciones específicas por pantalla:**

| Pantalla | Validación | Mensaje |
|---|---|---|
| LoginScreen | Email vacío | "El email es requerido" |
| LoginScreen | Formato email | "El email no tiene un formato válido" |
| LoginScreen | Contraseña vacía | "La contraseña es requerida" |
| ClienteAlta / Editar | Nombre o apellido vacío | "Nombre y apellido son requeridos" |
| ClienteAlta / Editar | Teléfono formato | "El teléfono debe tener entre 7 y 15 dígitos" |
| ClienteAlta / Editar | Domicilio incompleto | "Domicilio N: calle, número y localidad son requeridos" |
| ClienteAlta / Editar | Horario formato | "horario inválido (HH:MM)" |
| ClienteAlta / Editar | Inicio >= Fin | "inicio debe ser anterior a fin" |
| PedidoAltaScreen | Sin cliente | "Debes seleccionar un cliente para el pedido" |
| PedidoAltaScreen | Sin domicilio | "Debes seleccionar un domicilio de entrega" |
| PedidoAltaScreen | Sin ítems | "Agrega al menos un ítem al pedido" |
| PedidoAltaScreen | Fecha inválida | "Formato de fecha inválido. Usa DD/MM/YYYY" |
| PedidoAltaScreen | Fecha anterior a hoy | "La fecha no puede ser anterior a hoy" |
| PedidoDetalleScreen | Ítem duplicado | "El ítem ya está en el pedido" |

### 1.6 Error de sincronización offline

- **Descripción**: Cuando una mutación se encola para ejecutarse offline pero excede el límite de reintentos (3). La cola offline descarta el ítem y muestra el error.
- **Dónde se muestra**: En cualquier pantalla que realice mutaciones (confirmar entrega, cancelar pedido, agregar/quitar ítems).
- **Cómo se muestra**: No hay feedback visual directo al usuario cuando un ítem de la cola falla permanentemente. El ítem se elimina silenciosamente de la cola offline. En el código existe la estructura para mostrar el estado de sincronización (`offlineStore.isSyncing`) pero no hay un indicador visual implementado.
- **Origen**: Del lado del cliente (colas offline en `offlineStore.ts` + `useOfflineSync.ts`).

### 1.7 Error de permiso de GPS

- **Descripción**: Al confirmar una entrega, la app intenta obtener la ubicación GPS del repartidor para georreferenciar la dirección. Si el permiso de ubicación no está concedido, la confirmación continúa sin coordenadas.
- **Dónde se muestra**: `PedidoDetalleScreen`, en el hook `useConfirmarEntrega()` dentro de `usePedidos.ts`.
- **Cómo se muestra**: No hay mensaje de error visible. Si el permiso es denegado, simplemente se omite el envío de coordenadas. Es un error silencioso.
- **Origen**: Del lado del cliente (permiso de hardware no concedido). Es un error manejado sin feedback al usuario.

### 1.8 Errores existentes en E1 que continúan en E2

Se mantienen sin cambios los siguientes casos de error de la Entrega 1:

| Error | Cómo se muestra | Componente |
|---|---|---|
| Pantalla de carga infinita | `LoadingSpinner` con mensaje opcional | `components/ui/loading-spinner.tsx` |
| Datos vacíos (sin pedidos, sin reparto) | Card con mensaje informativo centrado | `InicioScreen`, `PedidosListScreen` |
| Error en query de TanStack Query | `ErrorMessage` con botón "Reintentar" | `components/ui/error-message.tsx` |
| Sin conexión a internet | Banner rojo superior "Sin conexión — los datos pueden no estar actualizados" | `components/ui/connectivity-banner.tsx` |

---

## 2. Reglas de negocio comunicadas al usuario

### Reglas que ya existían en E1 y se mantienen en E2

**RN-01: "Un pedido solo puede avanzar en la máquina de estados: PENDIENTE → EN_RUTA → ENTREGADO; excepcionalmente PENDIENTE → CANCELADO (admin) o EN_RUTA → NO_ENTREGADO (repartidor)."**

- **Cómo se implementa en el cliente**: Los botones de acción se muestran condicionalmente según el estado del pedido:
  - `PENDIENTE`: botón "Iniciar entreza" → llama a `PATCH /:id/estado` con estado `EN_RUTA`.
  - `EN_RUTA`: botones "Confirmar entrega" (verde, `variant="success"`) y "Cancelar entrega" (rojo, `variant="danger"`).
  - `ENTREGADO` / `NO_ENTREGADO` / `CANCELADO`: solo se muestra información, sin botones de acción.
  - Los ítems solo se pueden editar (agregar/quitar/cambiar cantidad) cuando el pedido está `PENDIENTE` o `EN_RUTA`.
- **Archivos involucrados**: `features/pedidos/components/ConfirmarAccionButtons.tsx`, `features/pedidos/components/CancelModal.tsx`, `features/pedidos/screens/PedidoDetalleScreen.tsx`, `features/pedidos/hooks/usePedidos.ts`

**RN-02: "Solo el administrador puede cancelar un pedido (CANCELADO); el repartidor solo puede marcar NO_ENTREGADO con un motivo."**

- **Cómo se implementa en el cliente**: El botón "Cancelar entrega" del repartidor abre un `CancelModal` que lista los motivos de no entrega (`CLIENTE_AUSENTE`, `DIRECCION_INCORRECTA`, `ACCESO_DENEGADO`, `OTRO`). Al seleccionar un motivo, se llama a `PATCH /:id/cancelar` con el motivo. La UI no tiene un botón para cambiar a estado `CANCELADO` para el repartidor.
- **Archivos involucrados**: `features/pedidos/components/CancelModal.tsx`, `features/pedidos/hooks/usePedidos.ts`, `features/pedidos/screens/PedidoDetalleScreen.tsx`

**RN-03: "Al crear un pedido se debe verificar que el cliente exista, que cada ítem exista y esté activo."**

- **Cómo se implementa en el cliente**: Antes de enviar, el formulario `PedidoAltaScreen` valida que se haya seleccionado un cliente, un domicilio y al menos un ítem. Si el servidor rechaza la creación (cliente no existe, ítem inactivo), se muestra el error vía `Toast` con el mensaje del servidor.
- **Archivos involucrados**: `features/pedidos/screens/PedidoAltaScreen.tsx`

**RN-04: "No se puede eliminar el último ítem de un pedido."**

- **Cómo se implementa en el cliente**: El botón de eliminar ítem está siempre presente. Si el servidor rechaza la operación (porque es el último ítem), se muestra un `Toast` de error con el mensaje del backend. El cliente no valida esta regla localmente antes de enviar.
- **Archivos involucrados**: `features/pedidos/screens/PedidoDetalleScreen.tsx`, `features/pedidos/hooks/usePedidos.ts`

**RN-05: "Los pedidos eliminados no se muestran en listados ni búsquedas (soft delete)."**

- **Cómo se implementa en el cliente**: No hay acción de "eliminar pedido" visible en la UI del repartidor. La funcionalidad de soft delete existe solo del lado del backend. El cliente simplemente no muestra pedidos con `deletedAt` porque el backend los filtra.
- **Archivos involucrados**: `features/pedidos/screens/PedidosListScreen.tsx` (no tiene botón de eliminar)

**RN-06: "Solo ADMIN puede crear, modificar y eliminar usuarios del sistema."**

- **Cómo se implementa en el cliente**: La pestaña "Usuarios" en la barra inferior solo es visible cuando el usuario logueado tiene rol `ADMIN`. Si un repartidor accede directamente a la URL, la pantalla de usuarios muestra un mensaje de "No tienes permisos".
- **Archivos involucrados**: `app/(tabs)/_layout.tsx`, `app/(tabs)/usuarios/_layout.tsx`

**RN-07: "Solo ADMIN puede crear, modificar y eliminar clientes."**

- **Cómo se implementa en el cliente**: La pestaña "Clientes" en la barra inferior solo es visible para usuarios con rol `ADMIN`. Las rutas de clientes (alta, edición, eliminación) están protegidas en el layout con un guard condicional que redirige si no es admin.
- **Archivos involucrados**: `app/(tabs)/_layout.tsx`, `app/(tabs)/clientes/_layout.tsx`

---

### Reglas nuevas introducidas en E2

**RN-08 (E2): "El campo numero_pedido se genera automáticamente al crear un pedido, es único, no nulo y no editable después de la creación."**

- **Descripción**: Cada pedido tiene un identificador visible con formato `PED-XXXXXX` (ej: `PED-000001`). El usuario ve este número en la pantalla de detalle del pedido y en la lista.
- **Cómo se implementa en el cliente**: 
  - En `PedidoDetalleScreen` se muestra el `numeroPedido` en un card de información del pedido.
  - En `PedidosListScreen` se muestra como identificador principal de cada pedido en la lista.
  - El campo no es editable en ningún formulario.
- **Archivos involucrados**: `features/pedidos/screens/PedidoDetalleScreen.tsx`, `features/pedidos/screens/PedidosListScreen.tsx`, `types/pedido.ts` (incluye `numeroPedido: string`)

**RN-09 (E2): "Un envase retenido se considera en demora si han pasado 15 o más días desde su fecha de inicio."**

- **Descripción**: El sistema calcula automáticamente si un cliente tiene envases retenidos en demora (más de 15 días desde la fecha de inicio del retenido). La información de demora se muestra en la ficha del cliente y en el listado de clientes.
- **Cómo se implementa en el cliente**: 
  - En `ClientesListScreen`: cada ítem de cliente puede mostrar un badge "N envase(s) pendiente(s)" si `cantidadEnvasesPendientes > 0`.
  - En `ClienteVerScreen`: se muestra un badge "Envases al día" si `tieneDemora === false`, o la cantidad de envases pendientes si `tieneDemora === true`. También se muestra la `fechaUltimaEntreza`.
  - En `ClienteHistorialScreen` (nueva en E2): la sección "Saldo de Envases" lista cada tipo de envase con su cantidad; los que tienen pendiente > 0 se muestran en color de advertencia (ámbar).
  - El componente visual `DemoraBadge` se encarga de mostrar la información de demora con formato y color apropiados.
- **Archivos involucrados**: `features/clientes/components/DemoraBadge.tsx`, `features/clientes/screens/ClientesListScreen.tsx`, `features/clientes/screens/ClienteVerScreen.tsx`, `features/clientes/screens/ClienteHistorialScreen.tsx`, `types/cliente.ts` (campos `tieneDemora`, `cantidadEnvasesPendientes`, `fechaUltimaEntrega`)

**RN-10 (E2): "Los endpoints de lectura (GET) están disponibles para el bot de WhatsApp mediante API Key sin requerir autenticación JWT completa."**

- **Descripción**: Esta regla es puramente del backend. No tiene impacto visible en la aplicación mobile. Los usuarios de la app mobile siguen autenticándose con JWT.
- **Cómo se implementa en el cliente**: Sin cambios. El cliente mobile no usa API Key.
- **Archivos involucrados**: Ninguno.

**RN-11 (E2): "Las rutas con segmento fijo (como /historial, /consumo, /pedidos) deben declararse antes que /:id para evitar conflictos de matching en Express."**

- **Descripción**: Regla de backend sin impacto visible en el cliente mobile. La app mobile simplemente llama a los endpoints correctos.
- **Cómo se implementa en el cliente**: Sin cambios.
- **Archivos involucrados**: Ninguno.

**RN-12 (E2): "El listado de pedidos de un cliente (GET /clientes/:id/pedidos) se ordena por fecha descendente y excluye pedidos eliminados (soft delete)."**

- **Descripción**: Cuando el usuario administrador consulta el historial de pedidos de un cliente específico, los pedidos aparecen ordenados del más reciente al más antiguo. Los pedidos eliminados (soft delete) no aparecen.
- **Cómo se implementa en el cliente**: 
  - En `ClienteHistorialScreen` sección "Historial de Pedidos": se muestran los pedidos del cliente obtenidos desde `usePedidosCliente(id)`. Cada pedido se muestra con su estado (color-coded según el tipo de estado) y la cantidad total de bidones.
  - Si el cliente no tiene pedidos, se muestra una lista vacía (0 pedidos).
- **Archivos involucrados**: `features/clientes/screens/ClienteHistorialScreen.tsx`, `features/clientes/hooks/usePedidosCliente.ts`, `features/clientes/services/clienteService.ts`

**RN-13 (E2): "Los endpoints de consumo y pedidos de cliente devuelven 404 si el cliente no existe, y valores cero si existe pero no tiene pedidos."**

- **Descripción**: 
  - Si el cliente no existe (ID inválido): el backend responde 404 y el cliente mobile muestra un `Toast` de error con el mensaje del servidor.
  - Si el cliente existe pero no tiene pedidos: la respuesta del backend incluye `{ totalPedidos: 0, totalBidones: 0, promedioBidonesPorPedido: 0 }`. El cliente mobile muestra estos valores en cero.
- **Cómo se implementa en el cliente**: 
  - En `ClienteHistorialScreen` sección "Resumen de Consumo": se muestran tres tarjetas con `totalPedidos`, `totalBidones` y `promedioBidonesPorPedido` (que pueden ser 0).
  - Si el cliente no existe (error 404), se muestra un `Toast` de error y se redirige a la lista de clientes.
- **Archivos involucrados**: `features/clientes/screens/ClienteHistorialScreen.tsx`, `features/clientes/hooks/useConsumoCliente.ts`, `features/clientes/hooks/usePedidosCliente.ts`, `types/historial.ts`

---

## 3. Nuevos patrones de feedback visual en E2

### 3.1 Sistema de Toast

En E2 se introdujo un sistema de notificaciones toast unificado:

- **Store**: `stores/toastStore.ts` (Zustand)
- **Tipos**: `'success' | 'error' | 'info' | 'warning'`
- **Duración**: 3000ms por defecto
- **Componente**: `components/ui/Toast.tsx` — barra superior animada con react-native-reanimated
- **Hook**: `hooks/useToast.ts` — retorna `{ showToast(message, type?, duration?) }`
- **Uso**: Montado en `app/_layout.tsx` en la raíz de la aplicación

### 3.2 Componente de confirmación

- **ConfirmModal**: `components/ui/confirm-modal.tsx` — modal reutilizable con botones de confirmación/cancelación y estado de carga.
- **CancelModal**: `features/pedidos/components/CancelModal.tsx` — modal específico para seleccionar motivo de cancelación de entrega.

### 3.3 Banner de conectividad

- **ConnectivityBanner**: `components/ui/connectivity-banner.tsx` — banner rojo en la parte superior de la aplicación que se muestra cuando `!isConnected`. Mensaje: _"Sin conexión — los datos pueden no estar actualizados"_.

### 3.4 Badge de demora de envases

- **DemoraBadge**: `features/clientes/components/DemoraBadge.tsx` — badge visual que indica si un cliente tiene envases pendientes. Usa color de advertencia (ámbar) para llamar la atención.

---

## 4. Resumen de cambios de E1 a E2

| Aspecto | Entrega 1 | Entrega 2 |
|---|---|---|
| **Manejo de errores** | ErrorMessage + LoadingSpinner | Se agrega Toast (4 tipos), ConfirmModal, ApiStatusBanner |
| **Validación de formularios** | Solo email en login | Validación completa en ClienteAlta (teléfono, horarios, domicilios), PedidoAlta (fecha, ítems) |
| **Feedback offline** | Estructura offlineStore creada pero sin UI | ConnectivityBanner funcional, cola offline con reintentos, caché en AsyncStorage |
| **Clientes** | CRUD básico + listado | Se agregan 3 pantallas: historial/envases, consumo, pedidos del cliente + DemoraBadge |
| **Envases retenidos** | No existía | DemoraBadge, sección "Saldo de Envases" en ClienteHistorialScreen |
| **Navegación** | 5 tabs (Inicio, Repartos, Pedidos, Mapa, Perfil) | 9 tabs (se agregan Clientes, Estadísticas, Usuarios, Inicio separado) + protección por rol |
| **Mutaciones offline** | No implementado | 5 tipos de mutaciones encolables (confirmar, cancelar, agregar/quitar/cambiar cantidad de ítems) |
| **GPS en entregas** | No existía | Captura automática de coordenadas al confirmar entrega |
| **Roles** | Sin distinción en UI | Tabs visibles/ocultos según rol (ADMIN/REPARTIDOR), rutas protegidas |

---

## 5. Archivos nuevos o modificados en E2 (inventario)

### Nuevos archivos de feature (E2)

| Archivo | Propósito |
|---|---|
| `features/clientes/hooks/useHistorialEnvases.ts` | Hook para obtener historial de envases de un cliente |
| `features/clientes/hooks/useConsumoCliente.ts` | Hook para obtener consumo (total pedidos, bidones, promedio) |
| `features/clientes/hooks/usePedidosCliente.ts` | Hook para obtener pedidos de un cliente |
| `features/clientes/screens/ClienteHistorialScreen.tsx` | Pantalla de historial de envases + consumo + pedidos |
| `features/clientes/screens/ClienteVerScreen.tsx` | Pantalla de detalle de cliente con badge de demora |
| `features/clientes/screens/ClienteAltaScreen.tsx` | Formulario de alta de cliente con validaciones |
| `features/clientes/screens/ClienteEditarScreen.tsx` | Formulario de edición de cliente |
| `features/clientes/components/DemoraBadge.tsx` | Componente visual de badge de demora |
| `features/pedidos/components/ConfirmarAccionButtons.tsx` | Botones de acción según estado del pedido |
| `features/pedidos/components/CancelModal.tsx` | Modal de selección de motivo de cancelación |
| `features/pedidos/components/AddItemModal.tsx` | Modal para agregar ítems a un pedido existente |
| `features/pedidos/screens/PedidoAltaScreen.tsx` | Formulario de alta de pedido |
| `features/repartos/hooks/useEditarReparto.ts` | Hook para editar reparto |
| `features/repartos/hooks/useCrearReparto.ts` | Hook para crear reparto |
| `features/repartos/hooks/useRepartoAdmin.ts` | Hook para administración de repartos |
| `features/usuarios/` (directorio completo) | Feature completa de gestión de usuarios (solo ADMIN) |
| `features/estadisticas/` (directorio completo) | Feature completa de estadísticas diarias y mensuales |
| `components/ui/Toast.tsx` | Componente de notificación toast |
| `components/ui/connectivity-banner.tsx` | Banner de conectividad |
| `components/ui/confirm-modal.tsx` | Modal de confirmación reutilizable |
| `components/ui/ApiStatusBanner.tsx` | Banner de depuración de llamadas API |
| `components/ui/CalendarModal.tsx` | Modal de selección de fecha |
| `components/ui/DatePickerField.tsx` | Campo de entrada de fecha |
| `stores/toastStore.ts` | Estado global del sistema de toast |
| `stores/apiStatusStore.ts` | Estado global de seguimiento de llamadas API |
| `hooks/useNetworkStatus.ts` | Hook de detección de conectividad (NetInfo) |
| `hooks/useOfflineSync.ts` | Hook de procesamiento de cola offline |
| `hooks/useToast.ts` | Hook de acceso al sistema de toast |
| `types/historial.ts` | Tipos para movimientos de envases, consumo e historial |
| `types/estadisticas.ts` | Tipos para estadísticas diarias y mensuales |

### Archivos modificados significativamente (E2)

| Archivo | Cambio |
|---|---|
| `app/_layout.tsx` | Se agregó inicialización de Mapbox, sincronización offline, sistema de toast |
| `app/(tabs)/_layout.tsx` | De 5 a 9 tabs, protección por rol, connectivity banner |
| `app/(tabs)/index.tsx` | Redirección por rol (admin a /pedidos, repartidor a InicioScreen) |
| `types/cliente.ts` | Se agregaron `tieneDemora`, `cantidadEnvasesPendientes`, `fechaUltimaEntrega`, `domicilios[]`, `horarios` |
| `types/pedido.ts` | Se agregó `numeroPedido` |
| `services/api.ts` | Se agregaron interceptores JWT + 401, `unwrapResponse`, `unwrapList` |
| `services/handleApiError.ts` | Se agregó `isNetworkError()`, parseo estructurado de errores |
| `features/pedidos/hooks/usePedidos.ts` | Se agregaron hooks de mutaciones offline, GPS, manejo de errores de red |
| `features/pedidos/screens/PedidoDetalleScreen.tsx` | Se agregaron acciones de confirmar/cancelar, modal de motivos, edición de ítems |
| `stores/offlineStore.ts` | Se implementó persistencia en AsyncStorage, lógica de reintentos |
