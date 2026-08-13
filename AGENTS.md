Monorepo con 3 proyectos independientes:
- `backend/` — API Express + Prisma + PostgreSQL
- `mobile/` — App React Native + Expo
- `whatsapp-bot/` — Bot WhatsApp con BuilderBot + Meta API
## Reglas generales
- Usar `@backend` para cambios en backend/
- Usar `@mobile` para cambios en mobile/
- Usar `@whatsapp-bot` para cambios en whatsapp-bot/
- NO hacer cambios de configuración git ni commits
- Preguntar antes de editar archivos (edit: ask global)

## Flujo SDD (gentle-ai)
- Los cambios grandes se pueden manejar con el flujo SDD de gentle-ai (explore → propose → spec → design → tasks → apply → verify → archive).
- El índice de skills vive en `docs/skill-registry.md` (versionado en git); el cache local de gentle-ai está en `.atl/` (NO versionado, no subir).
- Las skills de gentle-ai (`sdd-*`) se cargan desde el config del usuario (`~/.config/opencode/skills/`) antes de cada fase.
- Los subagentes deben recibir rutas exactas de `SKILL.md` en el prompt (ver Loading protocol del registry).