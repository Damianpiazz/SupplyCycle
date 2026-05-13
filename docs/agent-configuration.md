# Configuración de Agentes OpenCode — SupplyCycle

## Índice

1. [Arquitectura general](#1-arquitectura-general)
2. [Estructura de carpetas](#2-estructura-de-carpetas)
3. [Archivos de reglas (AGENTS.md)](#3-archivos-de-reglas-agentsmd)
4. [Archivos de reglas modulares (rules/)](#4-archivos-de-reglas-modulares-rules)
5. [Configuración principal (opencode.json)](#5-configuración-principal-opencodejson)
6. [Definición de agentes](#6-definición-de-agentes)
   - [Agente backend](#61-agente-backend)
   - [Agente mobile](#62-agente-mobile)
   - [Agente whatsapp-bot](#63-agente-whatsapp-bot)
   - [Agente plan](#64-agente-plan)
7. [Prompts de agentes (.opencode/agents/)](#7-prompts-de-agentes-opencodeagents)
8. [Skills (.opencode/skills/)](#8-skills-opencodeskills)
9. [Permisos detallados](#9-permisos-detallados)
10. [Qué puede y no puede hacer cada agente](#10-qué-puede-y-no-puede-hacer-cada-agente)
11. [Flujo de trabajo diario](#11-flujo-de-trabajo-diario)
12. [Comandos de verificación](#12-comandos-de-verificación)

---

## 1. Arquitectura general

SupplyCycle es un monorepo con 3 proyectos independientes. Usamos **OpenCode** como agente de IA para desarrollo, con agentes especializados por proyecto, cada uno con su propio stack, reglas, skills y permisos.

Cada agente conoce solo su proyecto, tiene acceso controlado a comandos bash y edición de archivos, y carga automáticamente skills reutilizables para tareas repetitivas.

### Agentes definidos

| Agente | Proyecto | Stack principal |
|--------|----------|-----------------|
| `backend` | `backend/` | Express 5 + Prisma 7 + PostgreSQL |
| `mobile` | `mobile/` | React Native 0.81 + Expo SDK 54 |
| `whatsapp-bot` | `whatsapp-bot/` | BuilderBot 1.4.1 + Meta API |
| `plan` | — | Solo lectura (modo planificación) |
| `build` | — | Por defecto (sin restricciones) |
| `explore` | — | Solo lectura (exploración rápida) |

---

## 2. Estructura de carpetas

```
SupplyCycle/
├── opencode.json                    # Configuración principal de OpenCode
├── AGENTS.md                        # Reglas globales del monorepo
│
├── .opencode/
│   ├── agents/                      # Prompts personalizados por agente
│   │   ├── backend.md
│   │   ├── mobile.md
│   │   └── whatsapp-bot.md
│   └── skills/                      # Skills reutilizables
│       ├── prisma-migrate/SKILL.md
│       ├── add-endpoint/SKILL.md
│       ├── add-screen/SKILL.md
│       ├── expo-build/SKILL.md
│       ├── add-flow/SKILL.md
│       └── deploy-bot/SKILL.md
│
├── backend/
│   ├── AGENTS.md                    # Reglas específicas del backend
│   └── rules/                       # Reglas modulares
│       ├── coding-standards.md
│       └── testing.md
│
├── mobile/
│   ├── AGENTS.md                    # Reglas específicas de mobile
│   └── rules/
│       ├── ui-patterns.md
│       └── api-integration.md
│
└── whatsapp-bot/
    ├── AGENTS.md                    # Reglas específicas del bot
    └── rules/
        └── flows.md
```

---

## 3. Archivos de reglas (AGENTS.md)

Cada `AGENTS.md` es la puerta de entrada de reglas para OpenCode. Se cargan automáticamente cuando el agente trabaja en ese directorio.

### AGENTS.md raíz — Reglas globales del monorepo

```markdown
Monorepo con 3 proyectos independientes:
- `backend/` — API Express + Prisma + PostgreSQL
- `mobile/` — App React Native + Expo
- `whatsapp-bot/` — Bot WhatsApp con BuilderBot + Meta API

## Reglas generales
- Usar @backend para cambios en backend/
- Usar @mobile para cambios en mobile/
- Usar @whatsapp-bot para cambios en whatsapp-bot/
- NO hacer cambios de configuración git ni commits
- Preguntar antes de editar archivos (edit: ask global)
```

**Propósito:** Todo agente que arranque en la raíz lee esto primero. Le dice qué proyecto existe, cómo dirigir cambios y qué reglas aplicar globalmente.

### AGENTS.md por proyecto

Cada subproyecto tiene el suyo con información detallada de su stack:

**`backend/AGENTS.md`** — Stack exacto, comandos de dev/build/prisma, convenciones de imports ESM y tipos.

**`mobile/AGENTS.md`** — Stack Expo + React Navigation + Reanimated, comandos start/android/ios/lint, convenciones de path alias y componentes UI.

**`whatsapp-bot/AGENTS.md`** — Stack BuilderBot + Meta Provider + PostgreSQL, comandos dev/build/start/lint, variables de entorno requeridas.

> **¿Por qué separar?** OpenCode carga SOLO el `AGENTS.md` del proyecto en el que estás trabajando gracias a la configuración en `opencode.json`.

---

## 4. Archivos de reglas modulares (rules/)

Son archivos `.md` dentro de `rules/` que se cargan como reglas adicionales. Sirven para desacoplar temas específicos y mantener los `AGENTS.md` livianos.

### Cómo se cargan

```json
"instructions": [
  "AGENTS.md",
  "backend/AGENTS.md",
  "backend/rules/*.md",
  "mobile/AGENTS.md",
  "mobile/rules/*.md",
  "whatsapp-bot/AGENTS.md",
  "whatsapp-bot/rules/*.md"
]
```

El glob `*/*.md` carga **todos** los archivos markdown dentro de la carpeta `rules/` automáticamente. No hace falta registrar cada uno manualmente.

### Reglas existentes

| Archivo | Qué cubre |
|---------|-----------|
| `backend/rules/coding-standards.md` | Estructura de features, rutas Express versionadas, uso de Prisma singleton, manejo de errores con Zod |
| `backend/rules/testing.md` | Framework de tests (Vitest), mocks de Prisma, cobertura mínima 80% |
| `mobile/rules/ui-patterns.md` | Componentes atómicos en `components/ui/`, StyleSheet.create(), dark mode con hook |
| `mobile/rules/api-integration.md` | Fetch nativo con `EXPO_PUBLIC_API_URL`, manejo de errores y loading states |
| `whatsapp-bot/rules/flows.md` | Convenciones de flows (keywords, state, endpoints HTTP), estructura de archivos |

---

## 5. Configuración principal (opencode.json)

Es el archivo central que orquesta todo: permisos globales, definición de agentes, carga de instrucciones y asignación de skills.

### Secciones clave

#### `instructions`
Lista de archivos que OpenCode carga como contexto. Soporta rutas directas y globs (`*.md`). El orden importa: los primeros archivos tienen más peso.

#### `permission` (global)
Define permisos por defecto para **todos** los agentes:

```json
"permission": {
  "edit": "ask",       # Siempre preguntar antes de editar
  "bash": { "*": "ask" },  # Preguntar antes de ejecutar comandos
  "skill": { "*": "deny" } # Ningún skill se carga sin explicitarlo
}
```

#### `agent`
Define cada agente especializado con su modelo, color, prompt y permisos específicos.

---

## 6. Definición de agentes

### 6.1 Agente backend

```json
"backend": {
  "mode": "primary",
  "description": "Desarrolla en backend (Express + Prisma + PostgreSQL)",
  "model": "anthropic/claude-sonnet-4-20250514",
  "color": "#68A063",
  "prompt": "{file:.opencode/agents/backend.md}",
  "permission": {
    "edit": "allow",
    "bash": {
      "*": "ask",
      "cd backend && *": "allow",
      "npm run dev": "allow",
      "npm run build": "allow",
      "npx tsx*": "allow",
      "npx prisma*": "allow"
    },
    "skill": { "prisma-migrate": "allow", "add-endpoint": "allow" }
  }
}
```

**Permisos:**

| Acción | Comportamiento |
|--------|---------------|
| Editar archivos | ✅ Permitido (sin preguntar) — el global ya pide confirmación general |
| `cd backend && *` | ✅ Permitido directamente |
| `npm run dev` / `npm run build` | ✅ Permitido directamente |
| `npx prisma *` | ✅ Permitido (migraciones, generate, studio) |
| `npx tsx *` | ✅ Permitido (ejecución de scripts) |
| Cualquier otro comando | ❌ Pregunta antes de ejecutar |
| Skills `prisma-migrate` y `add-endpoint` | ✅ Se cargan automáticamente al iniciar el agente |
| Cualquier otro skill | ❌ Bloqueado globalmente |

### 6.2 Agente mobile

```json
"mobile": {
  "mode": "primary",
  "description": "Desarrolla en mobile (React Native / Expo)",
  "model": "anthropic/claude-sonnet-4-20250514",
  "color": "#61DAFB",
  "prompt": "{file:.opencode/agents/mobile.md}",
  "permission": {
    "edit": "allow",
    "bash": {
      "*": "ask",
      "cd mobile && *": "allow",
      "npm run lint": "allow",
      "npx expo*": "allow"
    },
    "skill": { "add-screen": "allow", "expo-build": "allow" }
  }
}
```

**Permisos:**

| Acción | Comportamiento |
|--------|---------------|
| Editar archivos | ✅ Permitido |
| `cd mobile && *` | ✅ Permitido |
| `npm run lint` | ✅ Permitido |
| `npx expo *` | ✅ Permitido (start, android, ios, web) |
| Cualquier otro comando | ❌ Pregunta |
| Skills `add-screen` y `expo-build` | ✅ Se cargan automáticamente |

### 6.3 Agente whatsapp-bot

```json
"whatsapp-bot": {
  "mode": "primary",
  "description": "Desarrolla en whatsapp-bot (BuilderBot + Meta API)",
  "model": "anthropic/claude-sonnet-4-20250514",
  "color": "#25D366",
  "prompt": "{file:.opencode/agents/whatsapp-bot.md}",
  "permission": {
    "edit": "allow",
    "bash": {
      "*": "ask",
      "cd whatsapp-bot && *": "allow",
      "npm run dev": "allow",
      "npm run build": "allow",
      "npm run lint": "allow"
    },
    "skill": { "add-flow": "allow", "deploy-bot": "allow" }
  }
}
```

**Permisos:**

| Acción | Comportamiento |
|--------|---------------|
| Editar archivos | ✅ Permitido |
| `cd whatsapp-bot && *` | ✅ Permitido |
| `npm run dev` / `build` / `lint` | ✅ Permitido |
| Cualquier otro comando | ❌ Pregunta |
| Skills `add-flow` y `deploy-bot` | ✅ Se cargan automáticamente |

### 6.4 Agente plan

```json
"plan": {
  "mode": "primary",
  "permission": { "edit": "deny", "bash": "deny" }
}
```

**Propósito:** Modo de solo lectura para analizar código, planificar features y revisar cambios sin riesgo de modificar nada.

---

## 7. Prompts de agentes (.opencode/agents/)

Cada agente tiene un archivo de prompt que se inyecta en su contexto vía `"prompt": "{file:...}"`. Estos prompts son instrucciones detalladas sobre el stack, estructura y convenciones del proyecto.

### Ejemplo: `.opencode/agents/backend.md`

Contiene:
- Stack tecnológico exacto con versiones
- Scripts de desarrollo y build
- Árbol de directorios con propósito de cada carpeta
- Convenciones de código (type imports, ESM, Prisma singleton)

### Ejemplo: `.opencode/agents/mobile.md`

Contiene:
- Versiones de Expo, React Native y librerías clave
- Comandos disponibles (start, android, ios, web)
- Estructura de rutas (Expo Router file-based)
- Convenciones de componentes y estilos

### Ejemplo: `.opencode/agents/whatsapp-bot.md`

Contiene:
- Stack BuilderBot + Meta Provider + PostgreSQL
- Flujos existentes (welcome, register, samples)
- Endpoints HTTP expuestos por el provider
- Variables de entorno requeridas para conexión

> **Nota:** El prompt del agente NO es lo mismo que `AGENTS.md`. El prompt es la identidad del agente (quién es, qué sabe), mientras que `AGENTS.md` son reglas del proyecto (cómo se hacen las cosas).

---

## 8. Skills (.opencode/skills/)

Los skills son instrucciones reutilizables para tareas específicas. Se cargan automáticamente cuando el agente los necesita, siempre y cuando estén en `"allow"` en la configuración.

### Estructura de un skill

```
.opencode/skills/<nombre>/
└── SKILL.md
```

El `SKILL.md` debe tener frontmatter YAML con `name` y `description`:

```markdown
---
name: prisma-migrate
description: Genera y ejecuta migraciones de Prisma de forma segura
---

## Pasos
1. `npx prisma migrate dev --name <descripcion>`
2. Verificar con `npx prisma migrate status`
3. Revisar schema.prisma si hay errores

## Reglas
- Nombre en inglés: add_user_roles, create_orders_table
- No borrar migraciones existentes
```

### Skills asignados por agente

| Skill | Qué hace | Disponible en |
|-------|----------|---------------|
| `prisma-migrate` | Crear/ejecutar migraciones Prisma | backend |
| `add-endpoint` | Crear endpoint Express + Zod + pruebas | backend |
| `add-screen` | Crear pantalla Expo Router + layout | mobile |
| `expo-build` | Build para Android/iOS con config | mobile |
| `add-flow` | Crear flow BuilderBot + registro | whatsapp-bot |
| `deploy-bot` | Build + Docker + deploy del bot | whatsapp-bot |

### ¿Cómo se activan?

Cuando un skill tiene `"allow"`, el agente lo ve disponible en su contexto y puede invocarlo automáticamente cuando detecta que la tarea coincide con la descripción del skill.

Si un skill tiene `"ask"`, el agente le preguntará al usuario antes de cargarlo.
Si tiene `"deny"`, el skill es invisible para el agente.

---

## 9. Permisos detallados

### Niveles de permiso

| Valor | Significado |
|-------|-------------|
| `"allow"` | Se ejecuta sin preguntar |
| `"ask"` | Pregunta al usuario antes de ejecutar |
| `"deny"` | Bloqueado, no se puede ejecutar |

### Jerarquía de resolución

1. **Permiso global** → aplica a todos los agentes por defecto
2. **Permiso del agente** → sobreescribe al global para ese agente específico
3. **Patrones específicos** → las reglas más específicas (ej: `"cd backend && *"`) tienen prioridad sobre las genéricas (ej: `"*"`)

### Permisos globales actuales

```json
{
  "edit": "ask",
  "bash": { "*": "ask" },
  "skill": { "*": "deny" }
}
```

Esto significa:
- **Ningún agente** edita archivos o ejecuta comandos sin preguntar (a menos que lo sobreescriba explícitamente en su configuración)
- **Ningún skill** se carga sin estar explicitado como `allow` en algún agente

### Permisos por tipo de acción

| Tool | Qué controla |
|------|-------------|
| `read` | Leer archivos |
| `edit` | Escribir, editar, aplicar parches |
| `bash` | Ejecutar comandos en terminal |
| `glob` | Buscar archivos por patrón |
| `grep` | Buscar contenido en archivos |
| `webfetch` | Fetch a URLs |
| `websearch` | Búsqueda web |
| `skill` | Cargar skills |
| `todowrite` | Escribir en la todo list |

---

## 10. Qué puede y no puede hacer cada agente

### backend

| ✅ Puede | ❌ No puede |
|---------|------------|
| Editar cualquier archivo en `backend/` | Editar archivos fuera de `backend/` sin preguntar |
| Ejecutar `npm run dev`, `npm run build` | Ejecutar `git` commands |
| Ejecutar `npx prisma migrate`, `npx prisma generate` | Ejecutar scripts fuera del context del backend |
| Ejecutar `npx tsx` scripts | Modificar `opencode.json` sin preguntar |
| Cargar skills `prisma-migrate` y `add-endpoint` | Borrar directorios críticos sin preguntar |
| Trabajar en la raíz del proyecto (para leer configs globales) | Hacer cambios en `mobile/` o `whatsapp-bot/` sin preguntar |

### mobile

| ✅ Puede | ❌ No puede |
|---------|------------|
| Editar cualquier archivo en `mobile/` | Editar archivos fuera de `mobile/` sin preguntar |
| Ejecutar `npm run lint` | Ejecutar `git` commands |
| Ejecutar `npx expo start`, `npx expo build:*` | Ejecutar scripts de backend o bot |
| Cargar skills `add-screen` y `expo-build` | Ejecutar Prisma commands |
| Trabajar en la raíz del proyecto (para leer configs) | Modificar `opencode.json` sin preguntar |

### whatsapp-bot

| ✅ Puede | ❌ No puede |
|---------|------------|
| Editar cualquier archivo en `whatsapp-bot/` | Editar archivos fuera de `whatsapp-bot/` sin preguntar |
| Ejecutar `npm run dev`, `npm run build`, `npm run lint` | Ejecutar `git` commands |
| Cargar skills `add-flow` y `deploy-bot` | Ejecutar comandos de Expo o Prisma |
| Trabajar en la raíz del proyecto (para leer configs) | Modificar `opencode.json` sin preguntar |

### plan (todos los agentes en modo plan)

| ✅ Puede | ❌ No puede |
|---------|------------|
| Leer cualquier archivo | Editar cualquier archivo |
| Buscar con glob y grep | Ejecutar comandos bash |
| Navegar la estructura del proyecto | Cargar skills |
| Hacer preguntas al usuario | Modificar archivos de configuración |

---

## 11. Flujo de trabajo diario

### Cómo cambiar entre agentes

```bash
# Abrir OpenCode en la raíz
opencode
```

Dentro del TUI:
- **Tab** para ciclar entre agentes: build → plan → backend → mobile → whatsapp-bot
- Escribir `@backend`, `@mobile`, `@whatsapp-bot` para invocar un subagente directamente

### Cómo pedir cambios

**"Agregar un endpoint de usuarios en el backend"** → Úsá `@backend`

**"Crear pantalla de perfil en la app"** → Úsá `@mobile`

**"Agregar flow de bienvenida al bot"** → Úsá `@whatsapp-bot`

### Cómo planificar sin riesgos

Cambiá al agente `plan` con Tab y describí lo que querés hacer. El agente analizará el código y te dará un plan sin modificar nada.

### Cómo editar fuera del proyecto asignado

Si necesitás que `@mobile` toque un archivo en `backend/`, el agente te va a preguntar antes porque no tiene permiso `allow` para editar fuera de `mobile/`. Esto es deliberado para evitar cambios accidentales.

---

## 12. Comandos de verificación

```bash
# Validar que la config es correcta
opencode check

# Ver la config final mergeada
opencode debug config

# Listar skills detectados y su estado por agente
opencode debug config --skills

# Ver qué archivos de instrucciones cargó el agente
opencode run "Listá los archivos de configuración cargados"
```

---

## Resumen visual

```
                    ┌─────────────────────────────────┐
                    │        opencode.json             │
                    │  Instrucciones + Permisos +      │
                    │  Definición de agentes + Skills  │
                    └──────────┬──────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
   ┌────────────┐      ┌────────────┐      ┌──────────────┐
   │  backend   │      │   mobile   │      │ whatsapp-bot │
   │ (primary)  │      │ (primary)  │      │  (primary)   │
   ├────────────┤      ├────────────┤      ├──────────────┤
   │ Prompt:    │      │ Prompt:    │      │ Prompt:      │
   │ backend.md │      │ mobile.md  │      │ whatsapp.md  │
   │            │      │            │      │              │
   │ Skills:    │      │ Skills:    │      │ Skills:      │
   │ • migrate  │      │ • screen   │      │ • add-flow   │
   │ • endpoint │      │ • expo-    │      │ • deploy     │
   │            │      │   build    │      │              │
   │ Rules:     │      │ Rules:     │      │ Rules:       │
   │ • coding   │      │ • ui       │      │ • flows      │
   │ • testing  │      │ • api      │      │              │
   └────────────┘      └────────────┘      └──────────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
             ┌──────────┐          ┌──────────┐
             │   plan   │          │  build   │
             │(read-only)│          │ (default)│
             └──────────┘          └──────────┘
```

---

*Documentación generada para el equipo de desarrollo SupplyCycle.*
*Última actualización: Mayo 2026*
