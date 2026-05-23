---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Arquitectura Mobile
---

# TDD-0007: Arquitectura Mobile

## Objetivo

Definir la arquitectura base de la aplicación mobile para garantizar consistencia, escalabilidad, separación de responsabilidades, navegación predecible y correcta integración con el backend y soporte offline.

---

## Stack tecnológico

- Expo
- React Native
- TypeScript strict
- React Navigation
- Zustand (estado global)
- TanStack Query (server state y cache)
- Axios (HTTP)
- React Hook Form (formularios)
- Zod (validaciones)
- Expo Secure Store (JWT)
- React Native Maps (Google Maps)

No incorporar nuevas librerías salvo que sea estrictamente necesario y acordado con el equipo.

---

## Estructura del proyecto

```
mobile/
  src/
    features/       # lógica encapsulada por funcionalidad
    navigation/     # navegación global y por tab
    shared/         # componentes, helpers y utilidades reutilizables
    services/       # infraestructura HTTP compartida (cliente Axios, interceptores)
    store/          # estado global compartido (solo infraestructura, no lógica de negocio)
    hooks/          # hooks globales reutilizables
    mocks/          # datos mock por entidad
    types/          # tipos globales y de API
```

> `services/` y `store/` globales contienen únicamente infraestructura compartida.
> La lógica de negocio específica debe vivir dentro de cada feature.
> No crear stores globales por entidad (ej: `pedidos.store.ts`, `auth.store.ts` globales). Cada feature gestiona su propio estado interno.

---

## Arquitectura feature-based

Cada feature encapsula su propia lógica, pantallas, hooks, componentes y servicios.

```
features/
  auth/
    screens/
    components/
    hooks/
    services/
    store/
    types/
  pedidos/
  repartos/
  mapa/
  perfil/
```

---

## Separación de responsabilidades

| Capa | Responsabilidad |
|---|---|
| Screens | Composición visual y navegación únicamente |
| Components | UI reutilizable sin lógica de negocio |
| Hooks | Lógica reutilizable y side effects |
| Services | Acceso HTTP y comunicación externa |
| Store | Estado compartido dentro de la feature |
| Types | Contratos TypeScript |

Reglas obligatorias:
- No colocar lógica HTTP dentro de screens o components
- No acceder directamente a Expo Secure Store fuera de `auth/services`
- No duplicar tipos TypeScript dentro de una misma feature

---

## Shared

`shared/` contiene únicamente:
- Componentes reutilizables (botones, inputs, cards, modales)
- Helpers y utilidades sin estado
- Constantes globales
- Tema visual (colores, tipografía, espaciado)

No colocar lógica de negocio dentro de `shared/`.

---

## Navegación

- React Navigation con Bottom Tabs
- Cada tab mantiene su propio Stack Navigator independiente
- Navegación tipada con TypeScript
- Al navegar al detalle de un pedido desde cualquier tab, al volver se regresa al stack origen
- Flujo global: sin token válido → Login; con token válido → Bottom Tabs

---

## Estado

| Tipo de estado | Herramienta |
|---|---|
| Estado global compartido | Zustand (solo infraestructura en store/ global) |
| Server state y cache | TanStack Query |
| JWT y datos sensibles | Expo Secure Store (solo desde auth/services) |
| Estado local de formularios | React Hook Form |
| Estado interno de feature | Zustand dentro de la feature |

No usar Redux ni Context API para estado global complejo.

---

## Servicios HTTP

Todos los requests deben pasar por un cliente Axios centralizado en `services/api/client.ts`.

- El JWT debe enviarse automáticamente en el header `Authorization: Bearer`
- Los errores deben manejarse con `handleApiError` definido en `TDD-0006`
- No hacer requests directos con `fetch`
- No colocar lógica HTTP dentro de screens o components

---

## Offline

- Persistir los pedidos del día localmente al cargarlos
- Mantener visualización offline del listado y el mapa
- Preparar cola de sincronización para confirmar o cancelar entregas sin conexión
- Sincronizar cuando se recupere la señal

---

## Formularios y validaciones

- Formularios con React Hook Form
- Validaciones con Zod (reutilizar schemas de los TDD)
- No duplicar validaciones manuales fuera de Zod

---

## Reglas TypeScript

- `any` prohibido en todo el proyecto
- TypeScript strict obligatorio
- Reutilizar tipos definidos en los TDD, no duplicarlos
- Tipar navegación, hooks, services y responses de API
- DTOs terminan en `DTO`
- No crear múltiples tipos para la misma entidad dentro de una feature (ej: no tener `Pedido`, `PedidoDTO`, `PedidoResponse` y `PedidoData` para lo mismo)

---

## Convenciones

| Elemento | Convención |
|---|---|
| Idioma del código | Inglés |
| Idioma de la UI | Español |
| Componentes | PascalCase |
| Hooks | comienzan con `use` |
| Servicios | terminan en `.service.ts` |
| DTOs | terminan en `DTO` |
| Archivos | kebab-case |

---

## Restricciones

- No generar archivos sin implementación real
- No crear abstracciones innecesarias
- No duplicar lógica entre features
- No modificar contratos definidos en `docs/`
- No instalar librerías fuera del stack definido sin acuerdo del equipo

---

## Plan de implementación

1. Configurar navegación base (Bottom Tabs + Stack por tab)
2. Configurar flujo de autenticación (Login → Tabs)
3. Configurar cliente Axios con interceptor JWT en `services/api/client.ts`
4. Configurar Zustand para infraestructura de estado global
5. Configurar TanStack Query
6. Crear estructura base de carpetas por feature con archivos mínimos necesarios
7. Implementar persistencia segura con Expo Secure Store dentro de `auth/services`
8. Implementar cache offline inicial con TanStack Query