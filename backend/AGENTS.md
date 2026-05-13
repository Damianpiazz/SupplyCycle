# Backend — Express + Prisma + PostgreSQL
## Stack
Node.js, TypeScript 6 (ESModules, NodeNext), Express 5, Prisma 7 + PostgreSQL (@prisma/adapter-pg), Zod 4, bcrypt, jsonwebtoken, pino, morgan, helmet, cors
## Comandos
- Dev: `npm run dev` (tsx watch)
- Build: `npm run build` (tsc)
- Prisma migrate: `npx prisma migrate dev --name <name>`
- Prisma generate: `npx prisma generate`
## Convenciones
- imports ESM con extensión .js
- type imports con verbatimModuleSyntax
- Prisma client singleton en `prisma/prisma.ts`
- Schema provider: postgresql