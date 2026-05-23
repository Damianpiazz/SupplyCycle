---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Arquitectura Backend en Capas por Feature
---

# ADR-0007: Arquitectura Backend en Capas por Feature

## Contexto

El backend crecerá con múltiples funcionalidades (clientes, pedidos, repartos, usuarios, ítems). Sin una estructura clara, los archivos se acumulan en carpetas genéricas, las responsabilidades se mezclan y el código se vuelve difícil de mantener.

Se necesita una arquitectura que separe responsabilidades, sea predecible y escale con la cantidad de features.

---

## Decisión

Se adopta una **arquitectura en capas organizada por feature**. Cada feature tiene su propia carpeta con archivos específicos por capa:

```
src/features/<feature>/
├── controller.ts   → maneja request/response
├── service.ts      → lógica de negocio
├── routes.ts       → definición de rutas Express
├── schema.ts       → validación Zod
└── types.ts        → tipos específicos del feature
```

Las capas transversales (middleware, lib, utils) van en carpetas separadas en `src/`.

---

## Opciones Consideradas

### Opción 1: Capas por feature (seleccionada)
Cada feature es un módulo autónomo. Fácil de navegar, testear y mantener. Las capas están encapsuladas dentro del feature.

### Opción 2: Capas técnicas (controllers/, services/, models/ globales)
Todo lo que sea controller va en una carpeta, todo service en otra, etc. Funcional para proyectos pequeños, pero cuando hay muchas features las carpetas se vuelven inmanejables.

### Opción 3: Hexagonal / Clean Architecture
Máximo aislamiento con puertos y adaptadores. Sobredimensionado para un equipo pequeño con una API REST sin cambios de infraestructura frecuentes.

### Opción 4: Estilo libre (cada developer decide)
Sin convención. Lleva al caos organizacional a mediano plazo.

### Opción seleccionada
Opción 1. Es el balance óptimo entre organización y simplicidad. Cada feature es autónoma y se puede navegar sin contexto global.

---

## Consecuencias

### Positivas
- Navegación predecible: sabés exactamente dónde está cada archivo
- Features aisladas: se puede desarrollar, testear y eliminar una feature sin afectar otras
- Onboarding rápido: nuevo developer entiende la estructura en minutos
- Escala linealmente con la cantidad de features
- Las capas (controller → service) mantienen la separación de responsabilidades

### Negativas
- Código duplicado entre features (ej: validaciones similares)
- Puede llevar a archivos muy pequeños (un schema de 5 líneas)
- No hay reutilización automática entre features (hay que mover a lib/ explícitamente)

---

## Impacto en el Sistema

### Backend
- `src/features/auth/` → controller, service, routes, schema, types
- `src/features/clientes/` → ídem
- `src/features/pedidos/` → ídem
- `src/lib/` → código reutilizable (AppError, errors, utils)
- `src/middleware/` → middleware global (auth, error handler)
- `src/config/` → configuración (env, constants)

### Frontend (Mobile)
- Sin impacto directo.

### Infraestructura / Compartido
- Convención documentada para todo el equipo
- Code reviews más rápidos al saber dónde buscar

---

## Reglas Derivadas

- Cada feature tiene exactamente 5 archivos: controller, service, routes, schema, types
- Las rutas se montan en `app.ts` con `app.use('/api/v1/<recurso>', router)`
- El service nunca importa `Request`/`Response` de Express
- El controller nunca contiene lógica de negocio
- Código compartido entre features va en `src/lib/`
