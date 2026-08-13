# SupplyCycle — Arquitectura UX/UI

## 1. Introducción

Este documento describe el sistema de diseño y los patrones de interacción de la aplicación móvil SupplyCycle, una herramienta de reparto y logística orientada a distribuidores que gestionan entregas diarias.

Está pensado como referencia para diseñadores, product managers y desarrolladores que necesiten entender, mantener o extender la experiencia de usuario de la aplicación. No describe implementación técnica ni tecnologías subyacentes; se centra exclusivamente en el **qué** y el **por qué** del diseño.

### Perfiles de usuario

La aplicación atiende dos perfiles con necesidades distintas:

- **Repartidor**: opera en la calle, necesita información clara y acciones rápidas con una sola mano. Su día empieza con un reparto asignado y termina cuando completa todas las entregas.
- **Administrador**: gestiona pedidos, clientes, repartos y usuarios. Trabaja con listados, filtros, mapas y estadísticas. Tiene una visión más panorámica del negocio.

---

## 2. Principios de Diseño

Cada decisión visual e interactiva en SupplyCycle responde a estos principios:

1. **Claridad ante todo**. El usuario opera en movimiento, con distracciones. Cada pantalla comunica una sola cosa principal. Sin ruido visual.
2. **Eficiencia operativa**. Las acciones frecuentes (confirmar entrega, llamar, abrir mapa) están a un toque de distancia. Los flujos críticos tienen el mínimo de pasos posible.
3. **Feedback inmediato**. Toda acción del usuario tiene una respuesta visual clara: el botón cambia de estado, aparece una notificación, el elemento se actualiza. Nunca hay duda de si algo pasó o no.
4. **Resiliencia sin conexión**. El repartidor no puede depender de tener señal. La aplicación funciona offline, encola acciones y sincroniza cuando recupera conexión, sin perder datos ni bloquear al usuario.
5. **Consistencia**. Un mismo patrón se repite en toda la aplicación: mismos estilos para estados, mismos componentes para funciones similares, misma estructura de pantalla. El usuario aprende una vez y aplica en todos lados.

---

## 3. Identidad Visual

### Paleta de colores

La paleta se organiza en dos modos (claro y oscuro) y refleja una identidad orgánica y natural, con el verde como color principal.

- **Color primario**: verde institucional. Se usa en el encabezado, botones principales y elementos interactivos destacados.
- **Color de fondo**: verde muy claro (o muy oscuro en modo noche). Proporciona una base suave y limpia.
- **Superficies y tarjetas**: blancas (o grises muy oscuras en modo noche) con bordes sutiles.
- **Texto principal**: casi negro (o verde muy claro en modo noche). Alto contraste para legibilidad.
- **Texto secundario**: tono atenuado del texto principal. Para direcciones, fechas, metadatos.

#### Valores específicos

| Token | Light | Dark |
|---|---|---|
| Primario (tint / acento) | `#639922` | `#A8D878` |
| Botón primario | `#3B6D11` | `#7DC44A` |
| Fondo general | `#F5F7F4` | `#0F1A12` |
| Superficie | `#EAF3DE` | `#1A3010` |
| Tarjeta | `#FFFFFF` | `#162018` |
| Borde de tarjeta | `#C8D4C0` | `#1C3020` |
| Texto principal | `#1A2E18` | `#D8ECC8` |
| Texto secundario | `#4A6045` | `#6A9060` |
| Icono | `#4A6045` | `#6A9060` |
| Borde sutil | `#DDE8D5` | `#284830` |

Los colores semánticos siguen una convención reconocible universalmente:

| Estado | Light | Dark | Uso |
|---|---|---|---|
| Éxito — texto | `#2E6B42` | `#80C898` | Confirmaciones |
| Éxito — fondo | `#EAF5EE` | `#102A18` | Badges, banners |
| Éxito — borde | `#C2DFCB` | `#1E4828` | Elementos con borde |
| Error — texto | `#7A3535` | `#D48080` | Cancelaciones |
| Error — fondo | `#FCEEED` | `#250E0E` | Badges, banners |
| Error — borde | `#EAC8C8` | `#401818` | Elementos con borde |
| Advertencia — texto | `#7A5A1A` | `#D4A84A` | Alertas |
| Advertencia — fondo | `#FDF4E7` | `#251C08` | Badges, banners |
| Advertencia — borde | `#E8D8B0` | `#403010` | Elementos con borde |
| Información — texto | `#2A4F70` | `#80B8D8` | Datos informativos |
| Información — fondo | `#EAF2FA` | `#0E1A25` | Badges, banners |
| Información — borde | `#C0D8EC` | `#183040` | Elementos con borde |

Cada estado tiene tres variantes: color de texto (saturado), color de fondo (muy suave) y color de borde (intermedio). Esto permite crear badges, banners y notificaciones con la semántica adecuada sin sacrificar legibilidad.

Además, existe una paleta específica para los **estados de pedido**:

| Estado | Light | Dark |
|---|---|---|
| Pendiente | `#7A5A1A` | `#D4A84A` |
| En ruta | `#2A4F70` | `#80B8D8` |
| Entregado | `#2E6B42` | `#80C898` |
| No entregado | `#7A3535` | `#D48080` |
| Cancelado | `#8AAA80` | `#3A5835` |

### Tipografía

Se utiliza una única familia tipográfica **Inter** (Google Font), con cuatro pesos disponibles. Esto garantiza consistencia vertical en toda la aplicación.

- **Regular (400)**: `Inter_400Regular` — texto de cuerpo
- **Medium (500)**: `Inter_500Medium` — etiquetas, texto secundario con énfasis suave
- **SemiBold (600)**: `Inter_600SemiBold` — botones, encabezados de tarjeta, datos destacados
- **Bold (700)**: `Inter_700Bold` — títulos de pantalla, números destacados, texto con máximo énfasis

Los roles tipográficos están predefinidos:

| Rol | Tamaño | Peso | Uso |
|---|---|---|---|---|
| Título de pantalla | `28px` — `title` | Bold (`700`) | Encabezado superior |
| Título de sección | `20px` — `xl` | Bold (`700`) | "Próxima entrega", "Progreso del día" |
| Texto de cuerpo | `16px` — `md` | Regular (`400`) | Información general |
| Texto secundario | `14px` — `sm` | Regular (`400`) | Direcciones, fechas, metadatos |
| Etiqueta de tab | `11px` — `tabLabel` | Medium (`500`) | Labels del navegador inferior |
| Dato numérico destacado | `24px` — `xxl` | Bold (`700`) | Valores en tarjetas de estadísticas |

### Iconografía

El sistema usa tres familias de iconos, una por plataforma, garantizando que cada usuario vea iconos nativos y familiares:

- **iOS**: iconos SF Symbols, con pesos ajustables (regular, medium, bold).
- **Android y web**: iconos Material Design, con la misma semántica que sus equivalentes en iOS.
- **Iconos adicionales**: un conjunto de iconos vectoriales con paths SVG embebidos para casos específicos que no cubren las librerías estándar (flecha atrás, calendario, paquete, gráficos).

Cada icono cumple una función clara y se repite consistentemente: una misma acción siempre usa el mismo icono.

### Formas

Las esquinas redondeadas siguen una escala progresiva:

| Tamaño | Radio | Uso |
|---|---|---|---|
| Pequeño | `6px` — `sm` | Badges, etiquetas, elementos pequeños |
| Mediano | `10px` — `md` | Campos de texto, inputs, contenedores compactos |
| Grande | `14px` — `lg` | Tarjetas, modales |
| Extra grande | `20px` — `xl` | Botones principales, contenedores grandes |

Esta escala aporta jerarquía visual: a mayor importancia del contenedor, mayor el radio de curvatura.

---

## 4. Componentes de Interfaz

Cada componente está diseñado para un propósito específico y tiene variantes controladas que cubren todos los casos de uso sin generar incoherencias.

### Botón

Elemento principal de acción. Seis variantes que comunican visualmente la importancia y la naturaleza de la acción:

| Variante | Cuándo usarla |
|---|---|
| Primario | Acción principal de la pantalla (iniciar reparto, confirmar entrega, guardar) |
| Secundario | Acción alternativa o complementaria (llamar, abrir mapa) |
| Peligro | Acción destructiva (cancelar entrega, eliminar) |
| Ghost | Acción secundaria de bajo énfasis (ver detalle, volver) |
| Éxito | Confirmación positiva (confirmar entrega) |
| Advertencia | Acción que requiere atención |

Estados: **normal**, **presionado** (reduce opacidad), **loading** (texto cambia a "Cargando...", se deshabilita), **disabled** (pierde saturación).

Todos los botones tienen altura mínima suficiente para uso táctil y texto en semibold para legibilidad.

### Tarjeta

Contenedor versátil para agrupar información relacionada. Puede ser presionable (navega a detalle) o estática. Se usa para:

- Listar pedidos en una lista
- Presentar la próxima entrega
- Mostrar resumen de un reparto
- Contener formularios

La tarjeta tiene fondo blanco (o gris oscuro en modo noche), borde sutil y esquinas redondeadas. El contenido interno define su altura.

### Campo de texto

Entrada de datos con etiqueta opcional y espacio para mensaje de error. Cambia visualmente según el estado:

- **Normal**: borde neutro.
- **Focus**: borde del color primario, indicando que está activo.
- **Error**: borde rojo + mensaje de error debajo.
- **Disabled**: fondo atenuado.

Soporta todos los tipos de teclado estándar (email, numérico, texto) y configuración de mayúsculas.

### Encabezado

Barra superior presente en todas las pantallas. Muestra el texto "SupplyCycle" como identificador constante de la aplicación. Puede incluir un botón de retroceso (flecha izquierda) cuando la pantalla no es la raíz de su sección.

El encabezado tiene fondo del color primario institucional y texto blanco, garantizando alto contraste y presencia de marca constante.

### Indicador de carga

Pantalla completa o inline que indica que la aplicación está obteniendo datos. Muestra un spinner animado centrado y opcionalmente un mensaje contextual ("Cargando reparto...", "Buscando pedidos...").

Se usa como estado inicial de toda pantalla que requiere datos remotos.

### Mensaje de error

Pantalla completa que reemplaza al contenido cuando algo sale mal. Muestra un icono, un texto claro del problema y opcionalmente un botón "Reintentar" para recuperarse del error sin navegar a otro lado.

### Modal de confirmación

Diálogo que aparece sobre el contenido para confirmar acciones importantes antes de ejecutarlas. Tiene título, mensaje explicativo y dos botones (Cancelar / Confirmar). Puede mostrar estado de carga mientras la acción se procesa.

Variante **primario** para acciones normales, variante **peligro** para acciones destructivas (el botón de confirmar usa el color de error).

### Modal de selección (bottom sheet)

Modal que emerge desde abajo para elegir entre opciones predefinidas. Se usa principalmente para seleccionar el motivo de cancelación de una entrega. Cada opción es presionable y ocupa todo el ancho.

### Notificación (toast)

Mensaje temporal que aparece en la parte superior de la pantalla y se oculta automáticamente después de unos segundos. Se usa para feedback post-acción: "Entrega confirmada", "Reparto iniciado correctamente", etc.

Cuatro tipos con colores semánticos:

| Tipo | Color de fondo | Color de texto |
|---|---|---|
| Éxito | Verde suave | Verde saturado |
| Error | Rojo suave | Rojo saturado |
| Advertencia | Ámbar suave | Ámbar saturado |
| Información | Azul suave | Azul saturado |

La notificación entra con una animación suave desde arriba y se puede descartar tocándola.

### Banner de conectividad

Barra horizontal que aparece cuando el dispositivo pierde conexión a internet. Muestra el mensaje "Sin conexión — los datos pueden no estar actualizados" con fondo rojo suave y texto rojo. Ocupa todo el ancho de la pantalla y persiste mientras dure la desconexión.

### Calendario

Selector de fecha modal con navegación entre meses. Muestra los días de la semana en formato abreviado (Do, Lu, Ma, Mi, Ju, Vi, Sa) y la grilla de días del mes. Permite configurar una fecha mínima (no se pueden seleccionar días anteriores).

El día actual se marca con el color primario. El día seleccionado tiene fondo del color primario con texto blanco. Los días deshabilitados aparecen atenuados.

### Mapa

Visualización geográfica que muestra:

- Marcadores por cada pedido activo, con color según su estado
- Línea de ruta entre la ubicación del usuario y los pedidos
- Ubicación del usuario en tiempo real
- Al seleccionar un marcador, permite navegar al detalle del pedido

Los colores de los marcadores siguen la misma paleta de estados de pedido, creando consistencia visual entre el mapa y el resto de la aplicación.

---

## 5. Patrones de Pantalla

Toda pantalla en SupplyCycle sigue una estructura común y pasa por los mismos estados.

### Estructura general

```
┌─────────────────────────┐
│     Encabezado          │  ← Título "SupplyCycle" + opcional botón atrás
├─────────────────────────┤
│     Contenido           │  ← ScrollView / FlatList / formulario
│                         │
│                         │
│                         │
├─────────────────────────┤
│     Acciones            │  ← Botones (opcional, según pantalla)
└─────────────────────────┘
```

### Estados de pantalla

Toda pantalla que carga datos pasa por estos estados en orden:

1. **Carga**: spinner centrado con mensaje contextual ("Cargando pedidos..."). Aparece inmediatamente al navegar.
2. **Error**: si la carga falla, se muestra el mensaje de error con botón reintentar. El usuario puede recuperarse sin volver atrás.
3. **Vacío**: si la carga fue exitosa pero no hay datos, se muestra un mensaje informativo ("No hay repartos asignados para hoy", "No se encontraron pedidos con esos filtros").
4. **Datos**: el contenido normal de la pantalla.

Este patrón se repite en **todas** las pantallas de la aplicación, creando predictibilidad: el usuario sabe qué esperar y cómo reaccionar en cada situación.

### Patrón de lista

Las pantallas que muestran colecciones (pedidos, clientes, repartos) usan una lista vertical con tarjetas presionables. Cada tarjeta muestra:

- Nombre del cliente (bold)
- Dirección (texto secundario)
- Badge de estado (color semántico)
- Dato adicional según contexto (fecha, horario, monto)

Al tocar una tarjeta, se navega al detalle del elemento.

### Patrón de detalle

Las pantallas de detalle muestran toda la información de una entidad en una vista de scroll vertical, organizada en secciones:

1. Encabezado con badge de estado identificador
2. Información del cliente (nombre, teléfono, dirección)
3. Datos operativos (horario, fecha, notas)
4. Lista de ítems (productos con cantidad y precio)
5. Total (cálculo automático)
6. Acciones disponibles según estado

---

## 6. Sistema de Navegación

### Flujo principal

```
┌──────────┐     ┌──────────────────────────────────────┐
│  Login   │ ──► │          Pantalla principal           │
└──────────┘     │  (según perfil y estado del reparto)  │
                 └──────────────────────────────────────┘
```

El acceso a la aplicación está protegido por autenticación. Sin sesión válida, el usuario solo ve la pantalla de login. Al iniciar sesión, se redirige a la pantalla principal según su perfil.

### Navegación inferior (tabs)

La aplicación usa un menú inferior con tabs que agrupan las funciones principales. El contenido del menú cambia según el perfil del usuario:

**Repartidor** (5 tabs):

| Tab | Función principal |
|---|---|
| Inicio | Próxima entrega + progreso del día |
| Repartos | Todas las entregas del día |
| Pedidos | Búsqueda y filtro de pedidos |
| Mapa | Mapa con marcadores y rutas |
| Perfil | Datos personales, cerrar sesión |

**Administrador** (6+ tabs):

| Tab | Función principal |
|---|---|
| Pedidos | Gestión de pedidos (CRUD) |
| Clientes | Gestión de clientes (CRUD) |
| Repartos | Gestión de repartos (asignar, ver detalle admin) |
| Estadísticas | Métricas diarias y mensuales |
| Usuarios | Gestión de usuarios del sistema |
| Perfil | Datos personales, cerrar sesión |

### Navegación jerárquica

Dentro de cada tab, la navegación es jerárquica: lista → detalle. Cada tab tiene su propio stack de navegación, lo que significa que al volver atrás desde un detalle se regresa a la lista del mismo tab, no a otro lugar inesperado.

### Transiciones

Las transiciones entre pantallas son animaciones suaves (fade o slide) que no distraen ni ralentizan. La pantalla de login hace una transición fade hacia el contenido principal.

---

## 7. Visualización de Estados de Pedido

Cada pedido pasa por un ciclo de vida con 5 estados. La representación visual es consistente en toda la aplicación:

### Representación visual

Cada estado se muestra como un **badge**: una etiqueta compacta con fondo semitransparente del color del estado y texto en el color sólido. Esto garantiza que el badge sea legible sin competir con el contenido circundante.

### Ciclo de vida

```
Pendiente → En ruta → Entregado
                    → No entregado
                    → Cancelado
```

- **Pendiente** (ámbar): el pedido está asignado pero no se ha comenzado la entrega.
- **En ruta** (azul): el repartidor está viajando hacia el domicilio.
- **Entregado** (verde): la entrega se completó exitosamente.
- **No entregado** (rojo): no se pudo entregar (cliente ausente, dirección incorrecta, etc.).
- **Cancelado** (gris): el pedido se canceló antes o durante la entrega.

El color asociado a cada estado es el mismo en toda la aplicación: en listas, en detalle, en el mapa, en badges, en estadísticas.

---

## 8. Feedback y Microinteracciones

### Feedback visual inmediato

Toda interación del usuario tiene una respuesta visual:

| Acción | Respuesta |
|---|---|
| Tocar un botón | Reducción de opacidad |
| Tocar una tarjeta | Reducción de opacidad |
| Tocar un tab en iOS | Vibración háptica suave |
| Enviar un formulario | Botón se deshabilita + muestra "Cargando..." |
| Acción exitosa | Notificación verde + posible navegación |
| Acción fallida | Notificación roja con mensaje del error |
| Offline | Banner persistente en toda la app |

### Notificaciones post-acción

Después de cada acción significativa (confirmar entrega, cancelar, iniciar reparto, modificar ítems), aparece una notificación temporal que confirma el resultado. La notificación se oculta sola después de 3 segundos o al tocarla.

### Validación en línea

Los formularios validan los campos mientras el usuario escribe:

- Formato de email inválido → mensaje de error debajo del campo
- Campo requerido vacío → mensaje al intentar enviar
- El envío se bloquea hasta que todos los campos sean válidos

El usuario nunca descubre errores después de enviar.

---

## 9. Experiencia Offline

El repartidor trabaja en movimiento, donde la conectividad no está garantizada. La aplicación está diseñada para funcionar sin conexión sin perder funcionalidad crítica.

### Detección de conectividad

La aplicación monitorea el estado de la red en tiempo real. Apenas se pierde la conexión, aparece un banner en la parte superior que dice "Sin conexión — los datos pueden no estar actualizados". Este banner persiste hasta que la conexión se recupera.

### Operación sin bloqueo

El usuario puede seguir trabajando sin conexión:

- Ver los datos del día que ya se cargaron previamente
- Confirmar entregas
- Cancelar entregas
- Modificar ítems de pedidos

Ninguna acción se bloquea por falta de conexión. La interfaz responde igual, dando feedback inmediato local.

### Sincronización automática

Las acciones realizadas sin conexión se encolan y sincronizan automáticamente cuando el dispositivo recupera conexión. El orden de sincronización respeta el orden en que se realizaron (FIFO).

Si una acción falla al sincronizar, se reintenta hasta 3 veces con intervalos de 30 segundos. Si falla permanentemente, se descarta para no bloquear la cola.

### Indicación visual

El usuario puede ver qué acciones están pendientes de sincronizar. Mientras la cola tiene elementos, se muestra un indicador de sincronización activa.

---

## 10. Flujos Clave del Repartidor

### Inicio del día

1. El repartidor abre la aplicación e inicia sesión
2. Ve la pantalla de inicio con el reparto asignado del día
3. Revisa la cantidad de pedidos y el estado "Pendiente"
4. Toca "Iniciar reparto"
5. La aplicación confirma con una notificación

### Ciclo de entrega

1. La pantalla muestra la **próxima entrega**: nombre del cliente, dirección, teléfono, horario e ítems
2. El repartidor puede **llamar** al cliente o **abrir el mapa** para navegar
3. Al llegar, toca "Iniciar entrega" → el pedido pasa a "En ruta"
4. Confirma o cancela la entrega:
   - **Confirma**: la entrega se marca como "Entregado", avanza a la siguiente
   - **Cancela**: selecciona motivo (cliente ausente, dirección incorrecta, acceso denegado, otro) → se marca "No entregado"
5. La barra de progreso se actualiza
6. Se repite hasta completar todas las entregas

### Modificación de pedido

Durante la entrega, el repartidor puede modificar el pedido:

1. Toca "Ver detalle" o la tarjeta del pedido
2. Toca "Editar ítems"
3. Puede: cambiar cantidades (+/−), eliminar ítems, agregar ítems nuevos
4. Toca "Guardar cambios" y confirma
5. La aplicación actualiza el pedido y muestra notificación de éxito

### Fin del día

Cuando todas las entregas están completadas (entregadas o no entregadas), la pantalla muestra "¡Todas las entregas están completadas!" con un mensaje de éxito.

---

## 11. Accesibilidad

La aplicación está diseñada pensando en el uso en condiciones reales: en la calle, con luz solar directa, con una mano, con distracciones.

- **Contraste suficiente**: el texto principal tiene alto contraste contra los fondos. Los badges y etiquetas mantienen legibilidad incluso con luz exterior intensa.
- **Touch targets**: todos los elementos interactivos (botones, tarjetas, iconos) tienen al menos 44px de altura, el mínimo recomendado para uso táctil.
- **Texto escalable**: los tamaños de fuente respetan las preferencias de accesibilidad del sistema operativo.
- **Modo oscuro**: soporte completo para modo oscuro nativo. Todas las pantallas y componentes se adaptan automáticamente.
- **Iconos con significado**: los iconos siempre están acompañados de texto (título, etiqueta) y no son el único medio de comunicación de una acción.

---

## 12. Consistencia Multi-plataforma

La aplicación funciona en iOS, Android y web con la misma experiencia de usuario. Las diferencias son mínimas y específicas de cada plataforma:

- **Iconos nativos**: iOS usa SF Symbols, Android/web usan Material Icons. Visualmente se ven diferentes pero representan exactamente la misma acción.
- **Selector de fecha**: en iOS/Android usa un calendario modal diseñado a medida. En web usa el `input date` nativo del navegador.
- **Retroalimentación háptica**: solo en iOS, donde la vibración táctil es estándar en interacciones de UI.

El diseño, los colores, la tipografía, los patrones de navegación y los flujos de usuario son **idénticos** en las tres plataformas. La aplicación se siente igual en cualquier dispositivo.

---

## 13. Arquitectura de la Información

### Repartidor

```
Login
└── Inicio (próxima entrega + progreso)
    ├── Detalle de pedido
    └── Ver todos los pedidos
├── Repartos (entregas del día)
│   └── Detalle de entrega
├── Pedidos (búsqueda + filtros)
│   ├── Detalle de pedido
│   └── Crear pedido
├── Mapa
│   └── Detalle de pedido (desde marcador)
└── Perfil
```

### Administrador

```
Login
├── Pedidos (CRUD)
│   ├── Detalle
│   ├── Crear
│   └── Editar
├── Clientes (CRUD)
│   ├── Detalle
│   │   └── Historial
│   ├── Crear
│   └── Editar
├── Repartos (gestión)
│   ├── Detalle admin
│   └── Crear reparto
├── Estadísticas
│   ├── Diarias
│   └── Mensuales
├── Usuarios
│   ├── Detalle
│   └── Crear
└── Perfil
```

---

## 14. Convenciones de UI

- **Texto visible al usuario**: siempre en español. Los mensajes, etiquetas, títulos, errores y notificaciones usan español rioplatense natural.
- **Formato de fechas**: DD/MM/YYYY. Los días de la semana se muestran abreviados (Do, Lu, Ma, Mi, Ju, Vi, Sa).
- **Formato de números**: separador de miles según locale español (punto), decimales según corresponda.
- **Mensajes de error**: específicos y accionables. Nunca "Error" genérico.
- **Estados vacíos**: informativos, no técnicos. "No hay repartos asignados para hoy", no "No data available".
- **Confirmación**: siempre pedir confirmación antes de acciones destructivas (cancelar entrega, eliminar). La confirmación debe explicar qué va a pasar.

---

*Este documento describe el sistema de diseño UX/UI de SupplyCycle. Es una referencia viva; debe actualizarse cuando se introduzcan nuevos patrones o componentes.*
