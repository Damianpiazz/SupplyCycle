---
name: add-flow
description: Crea un flow nuevo en BuilderBot
---
## Pasos
1. Crear `src/flows/<name>.flow.ts`
2. Exportar flow con `addKeyword` + `addAnswer`
3. Importar y agregar en `createFlow([...])` en `app.ts`