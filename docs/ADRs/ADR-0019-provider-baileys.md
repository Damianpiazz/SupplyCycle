---
autor: Equipo SupplyCycle
fecha: 2026-06-18
titulo: Provider Baileys para WhatsApp Bot (Protocolo No Oficial)
---

# ADR-0019: Provider Baileys para WhatsApp Bot (Protocolo No Oficial)

## Contexto

El WhatsApp bot necesita conectarse a WhatsApp para interactuar con clientes. El ADR-0006 original documenta el uso de `@builderbot/provider-meta` (API oficial de Meta), pero durante la implementación se encontraron limitaciones que llevaron a adoptar un provider diferente.

La API oficial de WhatsApp Business (Meta) requiere:
- Una página de Facebook / cuenta de negocio verificada
- Un número de teléfono dedicado verificado
- Configuración de webhooks con HTTPS y certificado válido
- Aprobación de templates de mensajes
- Costos por conversación iniciada

Para un entorno de desarrollo y prototipado, estos requisitos son prohibitivos. Además, el proyecto no tiene aún una cuenta de negocio de Meta configurada.

---

## Decisión

Se utiliza **Baileys** (`@builderbot/provider-baileys`) como provider de WhatsApp, que implementa el protocolo **no oficial** de WhatsApp Web. Baileys se conecta a WhatsApp escaneando un código QR, igual que WhatsApp Web, sin necesidad de API de Meta.

La conexión se realiza a través de:
- Autenticación por QR code (escaneado desde la app de WhatsApp)
- Sesión persistente en disco (archivo de credenciales)
- Versión específica del protocolo: `[2, 3000, 1035824857]`

---

## Opciones Consideradas

### Opción 1: Baileys (WhatsApp Web no oficial) — seleccionada
Usa el protocolo interno de WhatsApp Web. Se conecta como un cliente más de WhatsApp Web.

Ventajas:
- Sin requisitos de Meta: no necesita cuenta de negocio, página de Facebook, ni número verificado
- Configuración mínima: solo escanear un QR
- Gratuito: sin costos por conversación
- Ideal para desarrollo y prototipado
- Funciona con números personales existentes

Desventajas:
- Viola los términos de servicio de WhatsApp — riesgo de bloqueo
- Sin garantía de estabilidad: Meta puede cambiar el protocolo
- Sin soporte de templates de mensaje (Meta API)
- Sin webhooks oficiales
- La sesión puede expirar y requerir re-escanear QR
- No apto para producción sin monitoreo constante

### Opción 2: Meta API oficial (@builderbot/provider-meta)
API oficial de WhatsApp Business.

Ventajas:
- Oficial y estable: no viola términos de servicio
- Soporte de templates, medios interactivos, catálogos
- Webhooks confiables
- Aptos para producción empresarial

Desventajas:
- Requiere cuenta de negocio de Meta verificada
- Requiere número de teléfono dedicado
- Costos por conversación
- Configuración compleja (webhooks HTTPS, verificación de dominio)
- No viable en desarrollo sin infraestructura adicional

### Opción 3: whatsapp-web.js
Librería similar a Baileys pero más conocida.

Ventajas:
- Similar a Baileys, sin requisitos de Meta
- Mayor comunidad y documentación

Desventajas:
- BuilderBot no tiene provider nativo para whatsapp-web.js
- Requeriría adaptador personalizado
- Mismos riesgos que Baileys (protocolo no oficial)

### Opción seleccionada
Opción 1. Para la etapa actual del proyecto (desarrollo y prototipado), Baileys es la opción más práctica. Se planea migrar a Meta API oficial cuando el producto esté listo para producción y se disponga de la infraestructura necesaria.

---

## Consecuencias

### Positivas
- Configuración inmediata: solo escanear QR
- Sin dependencia de aprobación de Meta
- Sin costos operativos
- Ideal para desarrollo local y demostraciones
- BuilderBot tiene provider nativo (`@builderbot/provider-baileys`)
- Sesión persistente: no requiere re-escanear en cada reinicio

### Negativas
- Riesgo de bloqueo por parte de Meta
- Sin soporte de features oficiales (templates, catálogos, webhooks)
- La sesión puede desconectarse sin previo aviso
- No apto para producción sin un plan de contingencia
- El ADR-0006 queda desactualizado (documenta Meta API pero se usa Baileys)

---

## Impacto en el Sistema

### WhatsApp Bot
- Dependencia: `@builderbot/provider-baileys` en lugar de `@builderbot/provider-meta`
- Autenticación por QR en lugar de JWT + número ID + verify token
- Sin variables de entorno de Meta (JWT_TOKEN, NUMBER_ID, VERIFY_TOKEN)
- Puerto 3008 para el servidor HTTP interno del bot
- Sesión persistente en archivo local (credenciales de Baileys)
- Sin webhooks expuestos

### Backend
- Sin impacto directo. La API sigue siendo la misma independientemente del provider.

### Infraestructura / Compartido
- Sin necesidad de HTTPS público (el QR se escanea localmente)
- Sin necesidad de cuenta de negocio de Meta
- Sin costos de API de WhatsApp

---

## Reglas Derivadas

- Baileys es para desarrollo y prototipado exclusivamente
- NO usar Baileys en producción sin implementar un plan de contingencia (Meta API como respaldo)
- Migrar a Meta API oficial antes del lanzamiento a producción
- Monitorear la sesión de Baileys periódicamente (reconexión automática)
- Mantener el ADR-0006 como documentación de la meta a futuro (Meta API)
