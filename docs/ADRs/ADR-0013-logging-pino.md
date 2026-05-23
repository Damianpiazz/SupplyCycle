---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Logging con Pino + Morgan
---

# ADR-0013: Logging con Pino + Morgan

## Contexto

El backend necesita un sistema de logging que permita rastrear requests, errores y eventos del sistema. En desarrollo se requiere logs legibles para humanos; en producción, logs estructurados en JSON para ingestión en herramientas de monitoreo (Datadog, Grafana, ELK).

Además, se necesita un registro de todas las requests HTTP entrantes (method, status, duración) para auditoría y debugging.

---

## Decisión

Se utiliza **Pino** como logger principal y **Morgan** como middleware de logging HTTP, configurado para usar Pino como transporte:

- **Pino**: logging estructurado en JSON, async, de baja sobrecarga
- **Morgan**: middleware HTTP request logging, integrado con Pino
- En desarrollo: pretty print con `pino-pretty`
- En producción: JSON puro para ingestión en sistemas de monitoreo

---

## Opciones Consideradas

### Opción 1: Pino + Morgan (seleccionada)
Pino es el logger más rápido para Node.js (~3x más rápido que Winston). Morgan es el estándar para HTTP logging en Express.

### Opción 2: Winston
Más popular pero más lento y verboso de configurar. Para el alcance del proyecto, Pino es suficiente y más performante.

### Opción 3: Solo Pino (sin Morgan)
Requiere implementar manualmente el logging HTTP. Morgan ya resuelve esto con formato configurable.

### Opción 4: Console.log
Sin niveles, sin estructura, sin rotación. Inviable para producción.

### Opción seleccionada
Opción 1. Pino es rápido, liviano, y produce JSON estructurado. Morgan se integra en una línea como middleware Express.

---

## Consecuencias

### Positivas
- Logs estructurados en JSON (parseables por máquinas)
- Pino es el logger más rápido de Node.js (~3x más rápido que Winston)
- Morgan da logging HTTP automático (method, url, status, duration)
- En desarrollo: pretty print legible con colores
- Niveles de log: trace, debug, info, warn, error, fatal
- Baja sobrecarga en producción

### Negativas
- Dos dependencias (pino + morgan) vs. una sola (winston lo incluye todo)
- Pino-pretty es una dependencia adicional solo para desarrollo
- Morgan+Pino requiere configuración de stream personalizado
- Winston tiene más middleware y plugins en su ecosistema

---

## Impacto en el Sistema

### Backend
- `src/config/logger.ts` → configuración de Pino con pretty print en dev
- Morgan configurado como middleware en `app.ts`
- Reemplazar `console.log` por `logger.info()` y `logger.error()` en todo el código
- Errores no controlados se loguean con `logger.error()` en el middleware global

### Frontend (Mobile)
- Sin impacto.

### Infraestructura / Compartido
- Dependencias: `pino`, `pino-pretty` (dev), `morgan`
- Logs en stdout (no archivos) — el entorno orquestador captura stdout
- En producción, logs JSON para ingestión (Datadog, Grafana Loki, ELK)

---

## Reglas Derivadas

- Usar `logger.info()`, `logger.error()`, `logger.warn()` reemplazando `console.log`
- Morgan se registra como primer middleware para capturar todas las requests
- En producción no usar pretty print (solo JSON plano)
- Errores se loguean con `logger.error({ err, ...context }, mensaje)`
- No loguear información sensible (passwords, tokens)
- Logs a stdout, no a archivos (12factor app)
