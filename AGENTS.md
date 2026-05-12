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