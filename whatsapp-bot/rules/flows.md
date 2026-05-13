# WhatsApp Bot Flows
## Convenciones de Flows
- Cada flow en su propio archivo dentro de `src/flows/`
- Nombres: `welcome.flow.ts`, `register.flow.ts`
- Keywords siempre en inglés
- Usar `addKeyword` con array de strings o `utils.setEvent()`
- Flows anidados van como último argumento de `addAnswer`
## State Management
- Usar `state.update()` y `state.get()` en lugar de variables globales
- State persiste automáticamente en PostgreSQL
## Endpoints HTTP
- Provider expone endpoints automáticos en el puerto configurado
- No agregar Express aparte
- Usar `handleCtx` wrapper para acceso a bot