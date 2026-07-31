# RF-12: Detección automática de envases retenidos + notificación WhatsApp

**Session ID:** SESION-0028
**Date:** 31/07/2026
**Focus:** RF-12 (backend + whatsapp-bot)

---

## Resumen

Implementación de la Fase 1 de RF-12: detección automática de clientes con envases retenidos por más de un umbral configurable de días, con envío de recordatorio por WhatsApp, control de frecuencia de notificaciones, registro en historial y seed de configuración inicial.

## Decisiones tomadas

| Decisión | Opción elegida | Justificación |
|---|---|---|
| Scheduling | `node-cron` | No hay Redis, job simple de 1x/día |
| Configuración umbrales | Tabla `Configuracion` en DB | Configurable sin deploy, panel admin futuro |
| Seguridad endpoint bot | API key separada `x-bot-api-key` | Canales de confianza distintos |
| Seed config | Idempotente (upsert) | No duplica filas al re-ejecutar |

## Archivos creados

### Backend (`backend/`)

| Archivo | Líneas | Propósito |
|---|---|---|
| `prisma/schema.prisma` | +30 | Modelos `Notificacion` (con enum `TipoNotificacion`) y `Configuracion` |
| `prisma/seed/18-configuracion.seed.ts` | 49 | Seed idempotente de configuración inicial |
| `src/features/envases/configuracion.service.ts` | 55 | Servicio de lectura/escritura de `Configuracion` (claves: `DEMORA_DIAS`, `NOTIFICACION_FRECUENCIA_DIAS`) |
| `src/features/envases/bot-client.ts` | 45 | Cliente HTTP que llama al bot (`POST /v1/send-message`) con `x-bot-api-key` |
| `src/features/envases/service.ts` | 139 | Orquestación: detecta clientes con demora, verifica frecuencia, envía mensaje, registra historial |
| `src/features/envases/scheduler.ts` | 63 | Job `node-cron` configurable vía `CRON_ENVASES_DEMORADOS` (default: 8am diario) |
| `src/features/envases/__tests__/configuracion.service.test.ts` | 129 | Tests: configuracion service (7 tests) + seed idempotencia (3 tests) |

### Archivos modificados (backend)

| Archivo | Cambio |
|---|---|
| `prisma/seed/index.ts` | Agregado import y ejecución de `seedConfiguracion()` |
| `src/server.ts` | Agregado `iniciarScheduler()` al startup |
| `src/config/env.ts` | Nuevas vars: `botApiUrl`, `botApiKeyOutgoing`, `cronEnvasesDemorados` |
| `.env.example` | Nuevas vars de configuración |
| `.env` | Agregadas `BOT_API_URL`, `BOT_API_KEY_OUTGOING`, `CRON_ENVASES_DEMORADOS` |

### WhatsApp Bot (`whatsapp-bot/`)

| Archivo | Líneas | Propósito |
|---|---|---|
| `src/routes/send-message.route.ts` | 65 | Endpoint `POST /v1/send-message` con auth `x-bot-api-key` |
| `.env.example` | 14 | Documentación de vars de entorno |
| `.env` | 4 | Config local de desarrollo |

### Archivos modificados (whatsapp-bot)

| Archivo | Cambio |
|---|---|
| `src/routes/index.ts` | Exporta `registerSendMessageRoutes` |
| `src/app.ts` | Registra las rutas del nuevo endpoint |

### Dependencias agregadas

- `backend/`: `node-cron`, `@types/node-cron`

## Tests

**10 test suites, 131 tests — todos pasan (0 fallos, 0 regresiones)**

Tests nuevos (9):
- `configuracion service — obtenerConfiguracion`:
  - ✅ Retorna valor cuando clave existe
  - ✅ Retorna valorDefault cuando clave NO existe
  - ✅ obtenerDiasDemora default 15
  - ✅ obtenerDiasDemora desde DB
  - ✅ obtenerFrecuenciaNotificacion default 7
  - ✅ obtenerFrecuenciaNotificacion desde DB
- `seed 18-configuracion — idempotencia`:
  - ✅ Inserta ambas claves
  - ✅ Usa upsert (update vacío)
  - ✅ Correr dos veces no duplica registros

## Pendiente para Fase 2

- Panel admin para editar umbrales configurable (backlog)
- Tests de integración del endpoint del bot
- Tests de la lógica de detección (cuando se implemente)

---

**Cierre:** Sesión completada. RF-12 Fase 1 implementada y testeada.
