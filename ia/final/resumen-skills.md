# Resumen de Skills — SupplyCycle

## 1. Introducción

- El proyecto tiene **24 skills** en `.opencode/skills/`, cada una con su propio `SKILL.md`.
- **21 skills** están permitidas por algún agente en `opencode.json` (campo `permission.skill`). No hay solapamientos: cada skill pertenece a un único agente.
- **4 agentes** definidos: `backend` (10 skills), `mobile` (8), `whatsapp-bot` (2) y `plan` (1).
- **3 skills de Mapbox** (`mapbox-cartography`, `mapbox-geospatial-operations`, `mapbox-style-quality`) están presentes en disco pero **no tienen agente asignado** en `opencode.json`.
- **Idiomas:** 20 skills en inglés, 4 en español (`add-flow`, `add-screen`, `prisma-migrate`, `reglas-negocio`).

---

## 2. Agentes y sus skills

### 2.1 `backend` — 10 skills
*Express 5 · Prisma 7 + PostgreSQL (adapter-pg) · Zod 4 · TypeScript 6 (ESM) · JWT*

| # | Skill | Descripción |
|---|-------|-------------|
| 1 | `api-authentication` | Autenticación segura de APIs con JWT, OAuth 2.0 y API keys |
| 2 | `api-error-handling` | Manejo de errores estandarizado: respuestas, logging, monitoring, retry y circuit breakers |
| 3 | `api-security-hardening` | Endurecimiento de APIs REST: rate limiting, CORS, validación de inputs y middleware de seguridad |
| 4 | `backend-testing` | Estrategia práctica de tests backend: unitarios, integración, fixtures y estabilidad en CI |
| 5 | `express-typescript` | Guías para construir APIs robustas con Express.js y TypeScript |
| 6 | `prisma-migrate` | Genera y ejecuta migraciones de Prisma (ESP) |
| 7 | `prisma-orm-v7-skills` | Hechos clave y breaking changes de Prisma ORM 7 |
| 8 | `reglas-negocio` | Reglas de negocio del dominio: reparto de bidones de agua (frecuencia, demanda predictiva) (ESP) |
| 9 | `rest-api-design` | Diseño de APIs RESTful: modelado de recursos, métodos, códigos, versionado |
| 10 | `typescript-strict-mode` | Prácticas TypeScript estrictas: evitar `any`, tipado correcto y patrones de type safety |

### 2.2 `mobile` — 8 skills
*React Native 0.81 · Expo SDK 54 · Expo Router 6 · Reanimated · Gesture Handler*

| # | Skill | Descripción |
|---|-------|-------------|
| 1 | `add-screen` | Crea pantalla + ruta en Expo Router (ESP) |
| 2 | `expo-architect` | Scaffold de apps Expo React Native listas para producción |
| 3 | `mobile-offline-support` | Apps offline-first: almacenamiento local, colas de sync y resolución de conflictos |
| 4 | `react-native-web-navigation` | Patrones de navegación para React Native Web: deep linking y routing web |
| 5 | `react-state-management` | Gestión de estado moderna: Redux Toolkit, Zustand, Jotai y React Query |
| 6 | `typescript-react-reviewer` | Code review experto de TypeScript + React 19: anti-patterns y type safety |
| 7 | `ui-ux-pro-max` | Inteligencia de diseño UI/UX: paletas, tipografías, UX guidelines y estilos |
| 8 | `vercel-react-native-skills` | Mejores prácticas de React Native y Expo para apps performantes |

### 2.3 `whatsapp-bot` — 2 skills
*BuilderBot 1.4.1 · Meta WhatsApp Cloud API · TypeScript 5.4 · Rollup*

| # | Skill | Descripción |
|---|-------|-------------|
| 1 | `add-flow` | Crea un flow nuevo en BuilderBot (ESP) |
| 2 | `whatsapp-cloud-api` | Referencia oficial de WhatsApp Cloud API: mensajes, webhooks y manejo de errores |

### 2.4 `plan` — 1 skill
*Arquitecto de software · analiza requerimientos y planifica antes de implementar (definido solo en `opencode.json`, sin archivo en `.opencode/agents/`)*

| # | Skill | Descripción |
|---|-------|-------------|
| 1 | `documentation-writer` | Experto en documentación técnica basado en el framework Diátaxis |

---

## 3. Listado completo de skills

Orden alfabético. Descripciones tomadas del frontmatter de cada `SKILL.md` (idioma original; truncadas si exceden ~160 caracteres).

| Skill | Descripción | Agente(s) | Idioma |
|-------|-------------|-----------|--------|
| `add-flow` | Crea un flow nuevo en BuilderBot | `whatsapp-bot` | Español |
| `add-screen` | Crea pantalla + ruta en Expo Router | `mobile` | Español |
| `api-authentication` | Secure API authentication with JWT, OAuth 2.0, API keys. Use for authentication systems, third-party integrations, service-to-service communication… | `backend` | Inglés |
| `api-error-handling` | Implement comprehensive API error handling with standardized error responses, logging, monitoring, retry logic, and validation patterns… | `backend` | Inglés |
| `api-security-hardening` | Secure REST APIs with authentication, rate limiting, CORS, input validation, and security middleware… | `backend` | Inglés |
| `backend-testing` | Turn backend test ambiguity into one practical backend test packet. Use for API/service/repository/auth-flow coverage design, fixture strategy… | `backend` | Inglés |
| `documentation-writer` | Diátaxis Documentation Expert. An expert technical writer specializing in high-quality software documentation… | `plan` | Inglés |
| `expo-architect` | Scaffold a production-ready Expo React Native app with working screens, navigation, and optional Clerk auth… | `mobile` | Inglés |
| `express-typescript` | Guidelines for building robust APIs with Express.js and TypeScript, covering middleware patterns, routing, and security best practices | `backend` | Inglés |
| `mapbox-cartography` | Expert guidance on map design principles, color theory, visual hierarchy, typography, and cartographic best practices for Mapbox… | — (sin asignar) | Inglés |
| `mapbox-geospatial-operations` | Expert guidance on choosing the right geospatial tool based on problem type, accuracy requirements, and performance needs | — (sin asignar) | Inglés |
| `mapbox-style-quality` | Expert guidance on validating, optimizing, and ensuring quality of Mapbox styles through validation, accessibility, and optimization… | — (sin asignar) | Inglés |
| `mobile-offline-support` | Offline-first mobile apps with local storage, sync queues, conflict resolution… | `mobile` | Inglés |
| `prisma-migrate` | Genera y ejecuta migraciones de Prisma | `backend` | Español |
| `prisma-orm-v7-skills` | Key facts and breaking changes for upgrading to Prisma ORM 7. Consider version 7 changes before generation or troubleshooting | `backend` | Inglés |
| `react-native-web-navigation` | Use when implementing navigation in React Native Web projects. Patterns for React Navigation, deep linking, and web-specific routing | `mobile` | Inglés |
| `react-state-management` | Master modern React state management with Redux Toolkit, Zustand, Jotai, and React Query… | `mobile` | Inglés |
| `reglas-negocio` | Reglas de negocio del dominio: gestión de reparto de bidones (frecuencia de pedidos, estimación de demanda) | `backend` | Español |
| `rest-api-design` | Design RESTful APIs following best practices for resource modeling, HTTP methods, status codes, versioning, and documentation… | `backend` | Inglés |
| `typescript-react-reviewer` | Expert code reviewer for TypeScript + React 19 applications. Use when reviewing React code, identifying anti-patterns… | `mobile` | Inglés |
| `typescript-strict-mode` | Guide for strict TypeScript practices including avoiding `any`, using proper type annotations, and leveraging TypeScript's type system… | `backend` | Inglés |
| `ui-ux-pro-max` | UI/UX design intelligence for web and mobile. Includes 50+ styles, 161 color palettes, 57 font pairings, 99 UX guidelines… | `mobile` | Inglés |
| `vercel-react-native-skills` | React Native and Expo best practices for building performant mobile apps… | `mobile` | Inglés |
| `whatsapp-cloud-api` | Official WhatsApp Cloud API reference for building messaging integrations. Covers messages, webhooks, conversation lifecycle… | `whatsapp-bot` | Inglés |

**Totales:** 24 skills · 21 asignadas · 3 sin agente · 20 EN · 4 ES

---

## 4. Notas metodológicas

- **Fuente de verdad de la asignación:** `opencode.json` → `agent.*.permission.skill`. Los archivos `.opencode/agents/*.md` describen el stack/convenciones de cada agente pero **no referencian skills**.
- **Cuatro agentes:** `backend`, `mobile` y `whatsapp-bot` tienen prompt en `.opencode/agents/`. El agente `plan` está definido íntegramente en `opencode.json` (prompt inline, sin archivo en `.opencode/agents/`) y es el único usuario de `documentation-writer`.
- **Skills Mapbox sin agente:** `mapbox-cartography`, `mapbox-geospatial-operations` y `mapbox-style-quality` existen en `.opencode/skills/` pero no aparecen en la allow-list de ningún agente. Posiblemente previstas para el tab Mapa (`mapa/`), sin habilitar aún.
- **`reglas-negocio` sin frontmatter YAML:** su `SKILL.md` empieza directamente con el H1 "Reglas de Negocio: Gestión de Reparto de Bidones" (sin `name`/`description`). El nombre se deriva de la carpeta y la descripción del H1.
- **Metadatos adicionales:** algunas skills declaran `license` (MIT), `metadata.author`, `metadata.version`, `user-invocable: false` y `allowed-tools` (p. ej. `react-native-web-navigation`, `typescript-strict-mode`). No afectan la asignación por agente.
- **Sin solapamientos:** cada skill pertenece a exactamente un agente (10 + 8 + 2 + 1 = 21 únicas).
