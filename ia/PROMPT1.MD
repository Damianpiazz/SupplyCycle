# Prompt — @backend: Fundación de datos para RF-12

## Contexto
Estamos implementando RF-12 (detección y notificación automática de demoras en devolución de envases). Esta tarea es la Fase 1.1 y 1.3: solo modelado de datos y configuración, sin lógica de negocio todavía.

## Tarea

### 1. Modelo `Notificacion`
Agregar a `schema.prisma` un nuevo modelo para registrar el historial de notificaciones enviadas:

- `id`
- `clienteId` (relación con `Cliente`)
- `tipo` (enum `TipoNotificacion`, arrancar con un solo valor: `RECORDATORIO_ENVASES`, pensado para ser extensible a futuro)
- `contenido` (texto del mensaje enviado)
- `creadoEn` (timestamp, default now)
- `envioExitoso` (boolean)
- `error` (string, opcional — para guardar el motivo si falló el envío)

Agregar la relación inversa correspondiente en el modelo `Cliente`.

### 2. Tabla `Configuracion`
Actualmente `DIAS_LIMITE_DEMORA = 15` está hardcodeado en:
- `backend/src/lib/retenidos-utils.ts:5`
- `backend/src/admin/controllers/retenidos.admin.controller.ts:5`

Crear un modelo `Configuracion` clave-valor simple:
- `id`
- `clave` (string, único)
- `valor` (string)
- `descripcion` (string, opcional)

Sembrar (seed o migración de datos) dos claves iniciales:
- `DIAS_LIMITE_DEMORA` = `"15"`
- `DIAS_ENTRE_NOTIFICACIONES` = `"7"` (para RF-12.3, frecuencia de recordatorios)

Reemplazar las dos referencias hardcodeadas de `DIAS_LIMITE_DEMORA` por una lectura desde esta tabla (con un helper simple tipo `getConfiguracion(clave: string): Promise<string>`, con manejo de caso "no encontrado" — no asumir que siempre existe).

### 3. Migración
Generar la migración de Prisma correspondiente (`npx prisma migrate dev`). No la apliques en producción, solo dev local.

## Restricciones
- Regla global del proyecto: `edit: ask`. Preguntá antes de tocar archivos existentes (los dos controllers que hardcodean el umbral).
- No implementes todavía el scheduler ni la lógica de detección — eso es la Fase 2, en otra tarea.
- Seguí la organización por features existente (`src/features/`) si el helper de configuración necesita vivir en algún lugar específico; si no está claro dónde, preguntá antes de decidir la ubicación.
- Rama: `feature/backend/rf12-modelo-notificacion-configuracion`
- Commits: `feat(backend): ...` según convención `<tipo>(<scope>): <descripcion>`

## Salida esperada
- Cambios en `schema.prisma`
- Migración generada
- Helper de lectura de configuración
- Los dos usos hardcodeados reemplazados
- Resumen de los archivos tocados, listo para review antes de commitear