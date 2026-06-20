---
autor: Equipo SupplyCycle
fecha: 2026-06-18
titulo: Stack WhatsApp — BuilderBot 1.4 + Provider Baileys
---

# ADR-0006: Stack WhatsApp — BuilderBot 1.4 + Provider Baileys

> **Actualización 2026-06-18**: Este ADR se actualiza para reflejar el provider real en uso. Originalmente documentaba Meta API (`@builderbot/provider-meta`), pero durante la implementación se adoptó Baileys (`@builderbot/provider-baileys`). Ver ADR-0019 para la justificación detallada del cambio.

## Contexto

El sistema necesita un bot de WhatsApp que interactúe con clientes: registrarlos, consultar pedidos, recibir notificaciones.

No se requiere una interfaz web para el bot; toda la comunicación es vía WhatsApp.

---

## Decisión

Se utiliza **BuilderBot 1.4** con **@builderbot/provider-baileys** (protocolo no oficial de WhatsApp Web) y **MemoryDB** para persistencia en memoria.

La conexión se realiza escaneando un código QR desde la app de WhatsApp, como WhatsApp Web.

---

## Opciones Consideradas

### Opción 1: BuilderBot 1.4 + Meta Provider
Framework diseñado específicamente para bots de WhatsApp. Provee manejo de webhooks, envío de mensajes, templates, medios, y persistencia. Es la meta a futuro para producción, pero requiere cuenta de negocio de Meta, número verificado y costos operativos.

### Opción 2: WhatsApp Business API directamente con Express
Máximo control pero requiere implementar webhooks, manejo de rate limits, reintentos, estado de conversación, todo manualmente. Mucho boilerplate.

### Opción 3: Twilio for WhatsApp
Twilio abstrae la API de Meta pero tiene costos adicionales por mensaje y menos control sobre features específicas (templates, medios interactivos).

### Opción 4: Baileys (seleccionada para desarrollo)
Usa el protocolo no oficial de WhatsApp Web. No requiere cuenta de Meta, es gratuito y configurable en minutos con un QR.

### Opción seleccionada
Opción 4 para desarrollo. Opción 1 como meta para producción. Ver ADR-0019 para la justificación detallada.

---

## Consecuencias

### Positivas
- Sin dependencia de Meta (no requiere cuenta de negocio, número verificado, ni costos)
- Configuración inmediata: solo escanear un QR
- Sistema de flows modulares y anidados
- Endpoints HTTP automáticos expuestos por el provider
- Sin necesidad de Express adicional
- Gratuito: sin costos por conversación

### Negativas
- Baileys usa protocolo no oficial — riesgo de bloqueo por Meta
- Sin soporte de templates ni features oficiales de WhatsApp Business
- Sesión puede expirar y requerir re-escanear QR
- MemoryDB no persiste datos entre reinicios
- No apto para producción sin plan de contingencia

---

## Impacto en el Sistema

### Backend
- Sin impacto directo. El bot es independiente del backend principal.

### WhatsApp Bot
- `src/app.ts` → entry point del bot con Provider Baileys + MemoryDB
- `src/flows/` → flows conversacionales modulares
- Autenticación por QR en lugar de configuración de Meta
- Sin variables de Meta (JWT_TOKEN, NUMBER_ID, VERIFY_TOKEN)
- Servidor HTTP en puerto 3008 para rutas internas

### Infraestructura / Compartido
- Sin necesidad de HTTPS público ni webhooks
- Sin dependencia de PostgreSQL para el bot
- Puerto 3008 dedicado

---

## Reglas Derivadas

- Cada flow en su propio archivo dentro de `src/flows/`
- Keywords siempre en inglés
- Usar `state.update()` y `state.get()` para estado de conversación
- No agregar Express aparte — el provider expone endpoints automáticos
- Baileys es para desarrollo — migrar a Meta API antes de producción (ver ADR-0019)
