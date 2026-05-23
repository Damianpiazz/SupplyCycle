---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Stack WhatsApp — BuilderBot 1.4 + Meta API
---

# ADR-0006: Stack WhatsApp — BuilderBot 1.4 + Meta API

## Contexto

El sistema necesita un bot de WhatsApp que interactúe con clientes: registrarlos, consultar pedidos, recibir notificaciones. La integración debe usar la API oficial de WhatsApp Business (Meta).

No se requiere una interfaz web para el bot; toda la comunicación es vía WhatsApp.

---

## Decisión

Se utiliza **BuilderBot 1.4** con **@builderbot/provider-meta** y **@builderbot/database-postgres** para persistencia.

BuilderBot es un framework Node.js que abstrae la complejidad de la API de WhatsApp Business (webhooks, mensajes, templates) y provee un sistema de flows conversacionales modulares.

---

## Opciones Consideradas

### Opción 1: BuilderBot 1.4 + Meta Provider (seleccionada)
Framework diseñado específicamente para bots de WhatsApp. Provee manejo de webhooks, envío de mensajes, templates, medios, y persistencia.

### Opción 2: WhatsApp Business API directamente con Express
Máximo control pero requiere implementar webhooks, manejo de rate limits, reintentos, estado de conversación, todo manualmente. Mucho boilerplate.

### Opción 3: Twilio for WhatsApp
Twilio abstrae la API de Meta pero tiene costos adicionales por mensaje y menos control sobre features específicas (templates, medios interactivos).

### Opción 4: Baileys (whatsapp-web.js)
Usa el protocolo no oficial de WhatsApp Web. Viola términos de servicio y puede dejar de funcionar sin previo aviso.

### Opción seleccionada
Opción 1. BuilderBot está construido específicamente para la Meta API oficial, maneja webhooks, estado, y flows conversacionales de forma declarativa.

---

## Consecuencias

### Positivas
- Abstracción completa de la API de Meta (webhooks, tokens, versionado)
- Sistema de flows modulares y anidados
- Persistencia automática de estado en PostgreSQL
- Manejo de medios (imágenes, video, audio, documentos)
- Endpoints HTTP automáticos expuestos por el provider
- Sin necesidad de Express adicional

### Negativas
- Framework menos conocido que alternativas más genéricas (menos comunidad)
- Atado a la versión del provider compatibilidad con API de Meta
- Dependencia de BuilderBot para actualizaciones de la API de WhatsApp
- La abstracción puede limitar features muy específicas de Meta API

---

## Impacto en el Sistema

### Backend
- Sin impacto directo. El bot es independiente del backend principal.

### WhatsApp Bot
- `src/app.ts` → entry point del bot
- `src/flows/` → flows conversacionales modulares
- Provider Meta configurado con `jwtToken`, `numberId`, `verifyToken`
- DB PostgreSQL para persistencia de estado

### Infraestructura / Compartido
- Variables de entorno: `POSTGRES_DB_HOST`, `POSTGRES_DB_USER`, `POSTGRES_DB_NAME`, `POSTGRES_DB_PASSWORD`, `POSTGRES_DB_PORT`
- Puerto dedicado para el bot
- Webhook expuesto para Meta API

---

## Reglas Derivadas

- Cada flow en su propio archivo dentro de `src/flows/`
- Keywords siempre en inglés
- Usar `state.update()` y `state.get()` para estado de conversación
- No agregar Express aparte — el provider expone endpoints automáticos
- Provider configurado con versión v18.0 de Meta API
