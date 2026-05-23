---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Manejo de Estado Mobile con Zustand
---

# ADR-0009: Manejo de Estado Mobile con Zustand

## Contexto

La app mobile necesita manejar estado global compartido entre pantallas: sesión del usuario, preferencias, configuración offline, UI state (modales, carga, etc.). El estado del servidor se maneja con TanStack Query, pero el estado local/cliente requiere una herramienta liviana.

React Context + useReducer es viable pero genera re-renders en todo el árbol y requiere providers anidados.

---

## Decisión

Se utiliza **Zustand** para todo el estado local del cliente. Zustand es una librería de estado minimalista (1KB) que no requiere providers, permite selectores finos para evitar re-renders, y se integra naturalmente con TypeScript.

Stores definidos:
- `authStore` → token, usuario autenticado, rol
- `uiStore` → modales, loading, preferencias de UI
- `offlineStore` → datos en cola para sincronizar

---

## Opciones Consideradas

### Opción 1: Zustand (seleccionada)
1KB, sin providers, selectores finos, middleware persist, integración TypeScript perfecta.

### Opción 2: React Context + useReducer
Solución nativa de React pero causa re-renders en todo el árbol. Los contextos anidados son difíciles de mantener.

### Opción 3: Redux Toolkit
Sobredimensionado. Requiere stores, slices, actions, reducers. Mucho boilerplate para el alcance del proyecto.

### Opción 4: Jotai / Recoil
Modelo atómico interesante pero menos adopción y ecosistema que Zustand.

### Opción seleccionada
Opción 1. Zustand es el estándar actual para estado local en React Native, con la mejor relación simplicidad/potencia.

---

## Consecuencias

### Positivas
- Sin providers: se usa el store directamente desde cualquier componente
- Selectores finos: solo el componente que usa un dato se re-renderiza
- Middleware `persist` para guardar estado en AsyncStorage
- TypeScript first: stores tipados sin configuración extra
- API simple: `create()`, `set()`, `get()`

### Negativas
- No maneja estado del servidor (para eso está TanStack Query)
- Si se abusa, puede centralizar demasiado estado en un solo store
- Middleware de persistencia requiere configuración de serialización

---

## Impacto en el Sistema

### Backend
- Sin impacto.

### Frontend (Mobile)
- `stores/authStore.ts` → sesión, token, usuario
- `stores/uiStore.ts` → modales, loading global
- `stores/offlineStore.ts` → cola de sincronización offline
- Cada store es un archivo independiente

### Infraestructura / Compartido
- Dependencia: `zustand` + `zustand/middleware` (persist)
- AsyncStorage para persistencia de stores

---

## Reglas Derivadas

- Zustand se usa exclusivamente para estado local del cliente
- El estado del servidor va en TanStack Query (useQuery, useMutation)
- Los stores se organizan por dominio (auth, ui, offline)
- Store names con sufijo `Store`: `authStore`, `uiStore`
- No almacenar datos del servidor en Zustand
- Usar persist middleware para datos que deben sobrevivir al cierre de la app
