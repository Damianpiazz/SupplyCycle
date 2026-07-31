# Prompt — @whatsapp-bot: Endpoint de envío saliente para RF-12

## Contexto
El backend necesita poder pedirle al bot que envíe un mensaje de WhatsApp saliente a un cliente (para RF-12.2, notificaciones de envases retenidos). Hoy el bot solo expone endpoints de blacklist (`whatsapp-bot/src/routes/blacklist.route.ts`); no existe forma de disparar un envío desde afuera.

## Tarea

### 1. Nuevo endpoint `POST /v1/send-message`
Crear una ruta nueva (seguir el mismo patrón de organización que `blacklist.route.ts`) que reciba:

```json
{
  "numero": "5492211234567",
  "mensaje": "Texto del mensaje a enviar"
}
```

Y use `bot.provider.sendMessage(numero, mensaje)` (o el método equivalente que ya use el proyecto para blacklist/envíos internos) para enviar el mensaje.

### 2. Autenticación
Proteger el endpoint con un header `x-bot-api-key`, siguiendo el mismo patrón que ya usa el backend para autenticar al bot (`x-api-key`), pero en sentido inverso. Definir el valor esperado vía variable de entorno (ej. `BOT_API_KEY`), no hardcodeado.

### 3. Manejo de errores
- Validar el payload con Zod (si el proyecto ya usa Zod para esto en otras rutas del bot; si no, revisar qué validación usan y ser consistente).
- Si el número no es válido o el envío falla, devolver un código de error claro (4xx si es problema del payload, 5xx si falla el envío) con un mensaje descriptivo — el backend necesita poder distinguir esto para registrarlo en `Notificacion.error`.

## Restricciones
- Regla global: `edit: ask`. Preguntá antes de modificar archivos existentes.
- No implementes lógica de negocio de detección de demoras acá — esta tarea es solo el endpoint de envío, agnóstico de para qué se usa.
- Rama: `feature/whatsapp-bot/rf12-send-message-endpoint`
- Commits: `feat(whatsapp-bot): ...`

## Salida esperada
- Nueva ruta y su registro en el servidor Express del bot (puerto 3008)
- Middleware de autenticación por API key
- Validación de payload
- Resumen de archivos tocados para review