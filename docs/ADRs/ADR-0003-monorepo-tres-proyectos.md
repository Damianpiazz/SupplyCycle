---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Separación en 3 Proyectos Independientes (Monorepo)
---

# ADR-0003: Separación en 3 Proyectos Independientes (Monorepo)

## Contexto

El sistema tiene tres aplicaciones con stacks, ciclos de vida y dependencias completamente distintos: una API REST, una app mobile y un bot de WhatsApp. Colocarlas en un mismo directorio compartido genera conflictos de dependencias, builds lentos y acoplamiento innecesario.

Sin embargo, mantenerlas en repositorios separados dificulta la visión global del proyecto, el onboarding y la coordinación de cambios.

---

## Decisión

Se utiliza un monorepo con tres proyectos independientes, cada uno con su propio `package.json`, TypeScript config y scripts. No hay dependencias compartidas entre proyectos.

Estructura:
```
/backend      → Express + Prisma + PostgreSQL
/mobile       → React Native + Expo
/whatsapp-bot → BuilderBot + Meta API
```

Cada proyecto es autónomo: se puede desarrollar, testear y deployar de forma independiente.

---

## Opciones Consideradas

### Opción 1: Monorepo sin workspace manager (seleccionada)
Tres carpetas independientes, cada una con su propio `package.json`. Sin dependencias compartidas. Simple, predecible.

### Opción 2: Monorepo con npm/pnpm workspaces
Requiere configuración extra, y al no haber dependencias compartidas entre los 3 proyectos, el workspace no aporta beneficio real.

### Opción 3: Repositorios separados (multirepo)
Máximo aislamiento pero más fricción: múltiples PRs, commits separados, onboarding más lento, pérdida de visión global.

### Opción seleccionada
Opción 1. El monorepo da visión global y facilita el onboarding, mientras que la independencia de cada proyecto evita conflictos y acoplamiento.

---

## Consecuencias

### Positivas
- Visión global del proyecto en un solo repositorio
- Onboarding simple: un solo `git clone`
- Cada proyecto puede evolucionar a su ritmo (dependencias, TS versiones, scripts)
- Sin conflictos entre dependencias
- CI/CD independiente por proyecto
- Facilidad para compartir documentación y configuraciones (docker-compose, etc.)

### Negativas
- El repositorio crece en tamaño con el tiempo
- No hay tipos compartidos automáticamente (se copian manualmente)
- `node_modules` separados por proyecto (más espacio en disco)
- No hay atomicidad cross-project en un mismo commit (feature que toca backend + mobile requiere 2 PRs)

---

## Impacto en el Sistema

### Backend
- Todo el código en `backend/`. Sin cambios estructurales.

### Frontend (Mobile)
- Todo el código en `mobile/`. Sin cambios estructurales.

### WhatsApp Bot
- Todo el código en `whatsapp-bot/`. Sin cambios estructurales.

### Infraestructura / Compartido
- `docker-compose.dev.yml` en la raíz para orquestar servicios comunes (PostgreSQL)
- `.husky/` y `commitlint.config.mjs` compartidos en la raíz
- `docs/` centralizada en la raíz

---

## Reglas Derivadas

- Cada proyecto tiene su propio `package.json`, `tsconfig.json`, `.eslintrc`, etc.
- No importar código entre proyectos directamente (ni con alias de path)
- Los tipos compartidos se copian manualmente entre proyectos
- Los cambios que afectan múltiples proyectos requieren PRs separados
- `docker-compose.dev.yml` maneja infraestructura común (DB, etc.)
