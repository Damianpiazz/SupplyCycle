# Backend API — Express + TypeScript + Prisma (ESM)

Backend base moderno orientado a escalabilidad, construido con Express, TypeScript en modo ESM y Prisma 7. La arquitectura está pensada para crecer usando **feature-based structure (vertical slicing)** en lugar de capas tradicionales.

---

## 🚀 Stack

* Node.js (ES Modules)
* Express 5
* TypeScript (NodeNext)
* Prisma 7 + PostgreSQL
* Zod (validación)
* JWT + bcrypt (auth)
* Pino / Morgan (logging)
* ESLint + Prettier

---

## 📦 Instalación

```bash
npm install
```

---

## ⚙️ Variables de entorno

Crear `.env` en la raíz:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db"
JWT_SECRET=your_secret
```

---

## 🧪 Desarrollo

```bash
npm run dev
```

Usa `tsx` para ejecutar TypeScript directamente con hot reload.

---

## 🏗️ Build y producción

```bash
npm run build
npm start
```

---

## 📁 Estructura del proyecto

```
.
├── assets/
├── scripts/
├── prisma/
│   ├── schema.prisma
│   ├── prisma.ts
│
├── generated/
│   └── prisma/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── constants/
│   ├── features/
│   ├── lib/
│   ├── middleware/
│   ├── utils/
│
├── eslint.config.js
├── tsconfig.json
├── package.json
```

---

## 🧠 Explicación de carpetas

### `/src`

Contiene toda la lógica de la aplicación.

#### `app.ts`

Configuración de Express (middlewares, rutas, etc.).

#### `server.ts`

Punto de entrada. Levanta el servidor.

---

### `/src/features`

Arquitectura principal del proyecto.

Cada feature agrupa TODO lo necesario para una funcionalidad:

```
features/
  auth/
    auth.routes.ts
    auth.controller.ts
    auth.service.ts
    auth.schemas.ts
```

#### Qué incluye cada feature:

* rutas (HTTP)
* lógica de negocio
* validación (Zod)
* tipos

👉 Esto evita separar por capas globales (controllers/services) y mantiene todo cohesivo.

---

### `/src/config`

Configuraciones globales:

* env
* configuración de app
* setup de librerías

---

### `/src/constants`

Constantes globales:

* enums
* valores fijos
* config estática

---

### `/src/lib`

Lógica técnica reutilizable:

* JWT
* bcrypt
* clientes externos
* helpers con dependencias

---

### `/src/utils`

Funciones puras:

* formateo
* helpers sin estado
* lógica genérica

---

### `/src/middleware`

Middlewares de Express:

* auth
* error handling
* logging

---

### `/prisma`

Configuración de base de datos:

* `schema.prisma` → modelos
* `prisma.ts` → cliente configurado

---

### `/generated`

Código generado automáticamente por Prisma.

⚠️ No modificar manualmente.

---

### `/assets`

Archivos estáticos (si aplica).

---

### `/scripts`

Scripts auxiliares (ej: dumps, seeds, etc.).

---

## 🗄️ Prisma

### Generar cliente

```bash
npx prisma generate
```

---

### Crear migraciones

```bash
npx prisma migrate dev
```

---

### Uso

```ts
import { prisma } from '../prisma/prisma.js';

const users = await prisma.user.findMany();
```

---

## ⚙️ Configuración técnica

### TypeScript

* ESM real (`NodeNext`)
* sin alias (`paths`) para evitar problemas futuros
* imports con `.js`

---

### ESLint

Incluye:

* linting TypeScript
* orden automático de imports
* reglas de seguridad
* integración con Prettier

---

### Prettier

Configura formato consistente en todo el proyecto.

---

## 🧩 Convenciones

### Imports

```ts
import x from './file.js';
```

---

### Evitar

* require
* alias tipo `@/`
* lógica global fuera de features

---

## 🧠 Filosofía

* arquitectura por features
* bajo acoplamiento
* código explícito
* evitar magia del compilador
* preparado para escalar

---

## 🔄 Flujo de desarrollo

1. crear feature
2. definir schema (si aplica)
3. migrar base de datos
4. implementar lógica
5. exponer rutas

---

## 📌 Boilerplate basado en:

- [https://github.com/sushantrahate/express-typescript-prisma-postgresql/tree/main/src]
- [https://github.com/Damianpiazz/express-boilerplate/tree/master/src]
- [https://github.com/vincent-queimado/express-prisma-ts-boilerplate/blob/master/prisma/prisma-client.ts]
- [https://github.com/w3tecch/express-typescript-boilerplate/tree/develop/src]
- [https://github.com/Damianpiazz/dockerized-fullstack-azure-deployment/tree/main/backend]