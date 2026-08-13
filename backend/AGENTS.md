# Backend — Express + Prisma + PostgreSQL
## Stack
Node.js, TypeScript 6 (ESModules, NodeNext), Express 5, Prisma 7 + PostgreSQL (@prisma/adapter-pg), Zod 4, bcrypt, jsonwebtoken, pino, morgan, helmet, cors
## Comandos
- Dev: `npm run dev` (tsx watch src/server.ts)
- Build: `npm run build` (`tsc -p tsconfig.build.json`)
- Start: `npm run start` (node dist/server.js)
- Prisma migrate: `npm run db:migrate` / `npx prisma migrate dev --name <name>`
- Prisma generate: `npm run db:generate` / `npx prisma generate`
- Seed: `npm run db:seed`, `npm run seed:reparto` (tsx prisma/seed/index.ts), `npm run seed:clean` (tsx prisma/seed/00-clean.seed.ts)
- Studio: `npm run db:studio`
- Tests: `npm run test` (vitest run), `npm run test:watch` (vitest), `npm run test:coverage` (vitest run --coverage)
## Estructura
- `src/` — app Express (`app.ts`, `server.ts`, config, features, lib, middleware, utils)
- `src/admin/` — admin web (EJS)
- `src/public/` — assets estáticos del admin
- `prisma/` — schema + cliente singleton (`prisma/prisma.ts`)
## Convenciones
- imports ESM con extensión .js
- type imports con verbatimModuleSyntax
- Prisma client singleton en `prisma/prisma.ts`
- Schema provider: postgresql
