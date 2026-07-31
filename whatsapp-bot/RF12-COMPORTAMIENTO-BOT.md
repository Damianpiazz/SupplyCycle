# RF-12 — Comportamiento esperado del bot de WhatsApp

> Este documento describe lo que **debería** hacer el bot para RF-12 (detección y
> notificación automática de demoras en devolución de envases). No es un reporte
> de lo implementado hoy, sino la especificación de comportamiento objetivo.

## Contexto

RF-12 consiste en: el **backend** detecta clientes con envases retenidos más allá
de un umbral de días (`DIAS_LIMITE_DEMORA`, configurable) y le pide al **bot** que
les envíe un recordatorio por WhatsApp. La frecuencia de los recordatorios también
es configurable (`DIAS_ENTRE_NOTIFICACIONES`).

## Rol del bot

El bot es el **canal de comunicación con el cliente**. Su responsabilidad es
ejecutar envíos y conversar con el cliente. **No** decide cuándo ni a quién
notificar: esa decisión es del backend.

## Comportamiento esperado

### 1. Canal de envío saliente (backend → bot → cliente)

- El backend llama a un endpoint del bot con `{ numero, mensaje }` autenticado con
  una API key (`x-bot-api-key`).
- El bot valida el payload y el número, autentica la llamada y envía el mensaje por
  WhatsApp al número indicado.
- La respuesta al backend debe permitir distinguir claramente:
  - **4xx** → problema del payload (número inválido, falta campo, key inválida).
  - **5xx** → el envío falló (bot desconectado, WhatsApp rechaza).
  Con eso el backend registra `Notificacion.envioExitoso` / `Notificacion.error`.

### 2. Mensajes que debe poder enviar

- Recordatorio de envases retenidos con texto armado por el backend (ej. "Te
  escribimos porque tenés envases sin devolver...").
- Texto plano es el mínimo. A futuro: plantillas o medios si el RF lo requiere.
- El mensaje debe indicar al cliente cómo responder (ej. "Respondé `devolví` si ya
  los devolviste"), para que la respuesta sea interpretable.

### 3. Interacción entrante del cliente (deseado)

- Cuando el cliente responde a un recordatorio, el bot debería:
  - Reconocer la respuesta y avisarle al backend (webhook) para que registre la
    acción del cliente.
  - Seguir funcionando igual para los flujos existentes (pedido, reclamo, alta,
    baja, etc.) sin romperlos.
- La respuesta del cliente debe poder llegar al backend aunque el cliente no esté
  registrado en el bot (ej. número que solo recibió el recordatorio).

### 4. Frecuencia y límites

- No enviar más de un recordatorio por cliente cada `DIAS_ENTRE_NOTIFICACIONES` (7).
- No volver a notificar a un cliente que ya regularizó sus envases.
- Dejar de notificar cuando el backend lo indique (cliente regularizado).
- No duplicar envíos: el backend debe poder reutilizar el endpoint de forma
  idempotente (si el envío ya se registró, no reenviar).

### 5. Robustez

- Si el bot está desconectado, devolver error claro (5xx) para que el backend lo
  registre y reintente en el próximo ciclo.
- Reintentos con límite; nunca encolar indefinidamente.
- El bot no pierde mensajes entrantes mientras se reconecta (sesión persistida).

### 6. Lo que el bot NO debe hacer

- No decidir cuándo notificar (umbral de días, frecuencia) — eso es del backend.
- No guardar estado de negocio (retenidos, clientes, regularización) — solo su
  sesión de WhatsApp y blacklist.
- No enviar mensajes sin que el backend lo pida (sin detección propia).

## Criterios de éxito

- [ ] El backend puede pedir un envío y el cliente lo recibe en su WhatsApp.
- [ ] Cada envío queda registrado en `Notificacion` (éxito o error con motivo).
- [ ] La frecuencia configurada se respeta y los recordatorios se detienen al
      regularizar el cliente.
- [ ] El cliente puede responder y su respuesta llega al backend.
- [ ] Los flujos existentes del bot siguen funcionando sin cambios visibles.
