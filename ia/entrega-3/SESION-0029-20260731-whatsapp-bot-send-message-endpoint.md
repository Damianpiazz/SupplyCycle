# PROMPT2.MD — WhatsApp Bot: Endpoint de envío saliente para RF-12

**Session ID:** SESION-0029
**Date:** 31/07/2026
**Focus:** `whatsapp-bot` — `POST /v1/send-message`

---

## Resumen

Implementación del endpoint `POST /v1/send-message` en el WhatsApp Bot, que permite al backend enviar mensajes salientes a clientes (RF-12.2). El endpoint está autenticado con `x-bot-api-key` (canal separado del que usa el bot para llamar al backend).

## Archivos tocados

| Archivo | Cambio | Estado |
|---|---|---|
| `src/routes/send-message.route.ts` | Creado — endpoint completo con auth, validación de payload, validación de número y envío | ✅ |
| `src/routes/index.ts` | Exporta `registerSendMessageRoutes` | ✅ |
| `src/routes/__tests__/send-message.route.test.ts` | Tests: auth (3), validarNumero (5), sendMessageHandler (5) = 13 tests | ✅ |
| `src/app.ts` | Registra `registerSendMessageRoutes` en el servidor | ✅ |
| `.env.example` | Documenta `BOT_API_KEY_INCOMING` | ✅ |
| `.env` | Config local con `BOT_API_KEY_INCOMING` | ✅ |

## Decisiones

| Punto | Decisión |
|---|---|
| Zod | No se agrega — el bot no lo usa, validación manual consistente |
| Validación de número | Solo dígitos, 10-15 chars — evita typos del backend |
| Git/commits | No se hace — gana la regla global (AGENTS.md). Queda en working directory para que el usuario haga el commit manual |
| Tests | 13 tests, mock simple de `bot.provider.sendMessage` |

## Tests

**Bot: 82 tests, 11 suites — todos pasan**
**Backend: 131 tests, 10 suites — todos pasan**

Tests nuevos (13):
- `authMiddleware`:
  - ✅ Rechaza si falta header
  - ✅ Rechaza si key incorrecta
  - ✅ Acepta si key correcta
- `validarNumero`:
  - ✅ Acepta 10 dígitos
  - ✅ Acepta 15 dígitos
  - ✅ Limpia +, espacios, guiones
  - ✅ Rechaza < 10 dígitos
  - ✅ Rechaza > 15 dígitos
- `sendMessageHandler`:
  - ✅ 400 si falta numero
  - ✅ 400 si falta mensaje
  - ✅ 400 si número inválido
  - ✅ 200 + envía con JID correcto
  - ✅ 500 si sendMessage falla

## Para revisión manual (commit)

```bash
# Rama sugerida:
git checkout -b feature/whatsapp-bot/rf12-send-message-endpoint
# Commits sugeridos:
git add whatsapp-bot/src/routes/send-message.route.ts whatsapp-bot/src/routes/index.ts whatsapp-bot/src/app.ts
git commit -m "feat(whatsapp-bot): add POST /v1/send-message endpoint with x-bot-api-key auth"
git add whatsapp-bot/src/routes/__tests__/send-message.route.test.ts
git commit -m "test(whatsapp-bot): add unit tests for send-message endpoint"
git add whatsapp-bot/.env.example
git commit -m "docs(whatsapp-bot): add BOT_API_KEY_INCOMING to env example"
```
