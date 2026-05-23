---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Autenticación con JWT y Roles de Usuario
---

# ADR-0001: Autenticación con JWT y Roles de Usuario

## Contexto

El sistema necesita autenticar usuarios (repartidores y administradores) que acceden tanto al backend como al mobile. Se requiere un mecanismo seguro, stateless y escalable que permita controlar el acceso a recursos según el rol.

No se implementa registro público; los usuarios son creados por un administrador del sistema.

---

## Decisión

Se utiliza autenticación mediante JSON Web Tokens (JWT) con bcrypt para hashing de contraseñas y dos roles: `REPARTIDOR` y `ADMIN`.

El flujo es:
1. Login con email + contraseña → backend valida y devuelve un JWT
2. El token se envía en cada request vía header `Authorization: Bearer <token>`
3. Un middleware `authenticate` verifica el token y otro middleware `authorize` valida el rol

---

## Opciones Consideradas

### Opción 1: JWT + bcrypt + roles simples (seleccionada)
Stateless, sin sesiones en servidor, fácil de escalar. Roles fijos sin jerarquía.

### Opción 2: Sesiones con cookies + Passport.js
Requiere almacenamiento de sesión (redis o DB), más complejo en mobile y no ideal para APIs REST.

### Opción 3: Tokens opacos (random string)
Requiere lookup en DB en cada request. Más seguro contra robo de tokens pero con latencia adicional.

### Opción 4: OAuth2 / SSO
Sobredimensionado para el alcance actual. Agrega complejidad innecesaria sin beneficios inmediatos.

### Opción seleccionada
Opción 1. JWT es el estándar actual para APIs REST, no requiere almacenamiento en servidor, y mobile lo maneja naturalmente.

---

## Consecuencias

### Positivas
- Autenticación stateless: el backend no necesita almacenar sesiones
- Fácil de consumir desde mobile con Axios interceptor
- bcrypt protege las contraseñas contra ataques de fuerza bruta
- Middleware `authorize` reusable en cualquier ruta

### Negativas
- JWT no es revocable inmediatamente (expira por tiempo)
- Si se filtra un JWT, el atacante tiene acceso hasta la expiración
- Requiere manejo de renovación de tokens (refresh token a futuro)

---

## Impacto en el Sistema

### Backend
- Nuevo archivo: `src/features/auth/` con controller, service, routes, schema
- Middleware `authenticate` y `authorize` en `src/middleware/auth.middleware.ts`
- Modelo `Usuario` con campos `email`, `passwordHash`, `rol`
- Endpoints: `POST /api/v1/auth/login`, `GET /api/v1/auth/me`

### Frontend (Mobile)
- Pantalla de login en `app/login.tsx`
- Almacenamiento de token en SecureStore
- Interceptor Axios que agrega `Authorization: Bearer <token>`

### Infraestructura / Compartido
- Variable de entorno `JWT_SECRET` en backend
- Sin dependencias externas nuevas (jsonwebtoken + bcrypt ya en el stack)

---

## Reglas Derivadas

- Las contraseñas deben tener al menos 8 caracteres, una mayúscula y un número
- El JWT tiene expiración de 24 horas
- Middleware `authorize('ADMIN')` para rutas administrativas
- El endpoint `GET /auth/me` devuelve el usuario autenticado sin la contraseña
- No existe registro público; los usuarios los crea un ADMIN
