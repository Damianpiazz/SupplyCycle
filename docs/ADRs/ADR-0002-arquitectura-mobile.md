---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Arquitectura Mobile con Zustand y TanStack Query
---

# ADR-0002: Arquitectura Mobile con Zustand y TanStack Query

## Contexto

La app mobile necesita manejar estado del lado del cliente (UI, sesión, preferencias) y estado del servidor (datos de API). Mezclar ambas responsabilidades en una sola solución genera código difícil de mantener.

Se requiere una arquitectura clara que separe el estado local del remoto, con soporte para caché, sincronización, loading states y offline.

---

## Decisión

Se adopta una arquitectura de estado en dos capas:

- **Zustand** para estado local del cliente: sesión del usuario, UI state, preferencias offline
- **TanStack Query** para estado del servidor: datos de API, caché, refetch, mutaciones

La comunicación con el backend se realiza mediante **Axios** con un cliente compartido que incluye interceptors para JWT y manejo global de errores.

---

## Opciones Consideradas

### Opción 1: Zustand + TanStack Query + Axios (seleccionada)
Separación clara de responsabilidades. TanStack Query maneja caché, refetch, stale-while-revalidate. Zustand maneja estado local puro.

### Opción 2: Solo Zustand (todo el estado en stores)
Funcional pero requiere implementar manualmente caché, refetch y sincronización con el servidor. Mucho boilerplate.

### Opción 3: Redux Toolkit + RTK Query
Sobredimensionado para el alcance. RTK Query es similar a TanStack Query pero más verboso y con mayor curva de aprendizaje.

### Opción 4: React Context + fetch nativo
Sin caché, sin loading states automáticos, sin sincronización. Cada componente debe manejar su propio fetching.

### Opción seleccionada
Opción 1. Zustand es liviano (1KB) comparado con Redux, TanStack Query es el estándar de la industria para fetching, y Axios unifica el manejo HTTP.

---

## Consecuencias

### Positivas
- Separación clara entre estado del servidor y estado del cliente
- TanStack Query provee caché, refetch automático, stale-while-revalidate, retry, paginación
- Zustand stores son simples, sin reducers ni actions verbosas
- Axios interceptor maneja JWT y errores globalmente
- Tipado fuerte con TypeScript

### Negativas
- Dos librerías de estado en lugar de una
- Curva de aprendizaje inicial para el equipo
- TanStack Query puede ser excesivo para apps con pocas llamadas API

---

## Impacto en el Sistema

### Backend
- Sin impacto directo. La arquitectura es transparente para el backend.

### Frontend (Mobile)
- `services/api.ts` → cliente Axios compartido
- `hooks/queries/` → hooks personalizados con TanStack Query
- `stores/` → stores de Zustand (auth, ui, preferencias)
- `types/api.ts` → tipos compartidos de respuestas

### Infraestructura / Compartido
- Dependencias: `@tanstack/react-query`, `zustand`, `axios`
- `EXPO_PUBLIC_API_URL` en variables de entorno

---

## Reglas Derivadas

- Estado del servidor siempre va en TanStack Query (useQuery, useMutation)
- Estado local (UI, sesión, preferencias) siempre va en Zustand
- Nunca cachear datos del servidor en Zustand
- El cliente Axios es el único punto de entrada HTTP
- Los hooks de TanStack Query se organizan por feature en `hooks/queries/`
