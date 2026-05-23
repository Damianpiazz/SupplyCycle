---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Usuario
---

# TDD-0005: Usuario

## Contexto de Negocio (PRD)

### Objetivo

Definir la entidad Usuario como la base del sistema de autenticación. Un usuario puede ser un Repartidor o un Administrador. En la Entrega 1 el foco es el Repartidor, que necesita autenticarse para acceder a la app y ver sus pedidos del día.

### User Persona

- **Nombre**: Repartidor
- **Necesidad**: Iniciar sesión con email y contraseña para acceder a la app de forma segura, y cerrar sesión cuando termine su jornada.

### Criterios de Aceptación

- El sistema debe permitir autenticar a un usuario con email y contraseña.
- La contraseña debe estar hasheada con bcrypt, nunca guardada en texto plano.
- El sistema debe devolver un JWT al autenticarse correctamente.
- El token JWT debe expirar en 24 horas.
- El email debe tener formato válido y ser único en el sistema.
- La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula y al menos un número.
- El nombre y apellido no pueden estar vacíos ni tener menos de 2 caracteres.
- Solo usuarios con rol REPARTIDOR pueden acceder a la app mobile en la Entrega 1.
- El sistema debe permitir obtener los datos del usuario autenticado a través del token.

---

## Diseño Técnico (RFC)

### Modelo de Datos (Prisma)

```prisma
model Usuario {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  nombre        String    @db.VarChar(100)
  apellido      String    @db.VarChar(100)
  rol           Rol       @default(REPARTIDOR)
  activo        Boolean   @default(true)
  creadoEn      DateTime  @default(now())
  actualizadoEn DateTime  @updatedAt
}

enum Rol {
  REPARTIDOR
  ADMIN
}
```

### Validaciones (Zod)

```ts
const loginSchema = z.object({
  email: z.string().email('El email no tiene un formato válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const crearUsuarioSchema = z.object({
  email: z.string().email('El email no tiene un formato válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
    .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100),
  rol: z.enum(['REPARTIDOR', 'ADMIN']).default('REPARTIDOR'),
});
```

### Contrato de API

#### Login

- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**:

```ts
{
  email: string;
  password: string;
}
```

- **Response Body**:

```ts
{
  token: string;
  usuario: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    rol: 'REPARTIDOR' | 'ADMIN';
  };
}
```

#### Obtener usuario autenticado

- **Endpoint**: `GET /api/v1/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response Body**:

```ts
{
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'REPARTIDOR' | 'ADMIN';
  activo: boolean;
}
```

### Tipos TypeScript compartidos (mobile)

```ts
export type Rol = 'REPARTIDOR' | 'ADMIN';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: Rol;
  activo: boolean;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}
```

### Seed de usuario de prueba

```ts
await prisma.usuario.create({
  data: {
    email: 'repartidor@supplycycle.com',
    password: await bcrypt.hash('Repartidor123', 10),
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'REPARTIDOR',
    activo: true,
  },
});
```

### Componentes de Arquitectura (Backend)

- **Domain**: Entidad `Usuario`, enum `Rol`, reglas: email único, contraseña hasheada, solo usuarios activos pueden autenticarse
- **Application**: Casos de uso `Login`, `ObtenerUsuarioAutenticado`
- **Infrastructure**: Controlador `auth.controller.ts`, servicio `auth.service.ts`, rutas `auth.routes.ts`, schema Zod `auth.schemas.ts`, middleware `auth.middleware.ts`

---

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Email no registrado | Error "Credenciales inválidas" | 401 Unauthorized |
| Contraseña incorrecta | Error "Credenciales inválidas" | 401 Unauthorized |
| Email con formato inválido | Error de validación | 400 Bad Request |
| Contraseña vacía | Error de validación | 400 Bad Request |
| Usuario inactivo intenta login | Error "Usuario inactivo" | 403 Forbidden |
| Token expirado en request protegido | Error "Token expirado" | 401 Unauthorized |
| Token inválido o malformado | Error "Token inválido" | 401 Unauthorized |
| Email duplicado al crear usuario | Error "El email ya está registrado" | 409 Conflict |
| Nombre o apellido menor a 2 caracteres | Error de validación | 400 Bad Request |
| Contraseña sin mayúscula o sin número | Error con requisitos detallados | 400 Bad Request |

---

## Plan de Implementación

1. Definir el modelo `Usuario` en `prisma/schema.prisma`
2. Ejecutar migración con `npx prisma migrate dev`
3. Implementar seed con usuario de prueba en `prisma/seed.ts`
4. Definir tipos TypeScript en el mobile (`types/usuario.ts`)
5. Implementar schema de validación Zod en `auth.schemas.ts`
6. Implementar servicio en `auth.service.ts` (login + hash + JWT)
7. Implementar middleware de autenticación en `auth.middleware.ts`
8. Implementar controlador en `auth.controller.ts`
9. Registrar rutas en `auth.routes.ts`