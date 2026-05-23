---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Arquitectura Mobile Feature-Based
---

# ADR-0008: Arquitectura Mobile Feature-Based

## Contexto

La app mobile crecerá con múltiples pantallas y funcionalidades. Sin una estructura organizada, los archivos se mezclan en unas pocas carpetas, las importaciones se vuelven confusas y el código es difícil de escalar.

Se necesita una organización que agrupe el código por funcionalidad, facilitando la navegación, el testing y el mantenimiento.

---

## Decisión

Se organiza el código mobile en una estructura mixta: **carpetas técnicas para lo genérico** y **carpetas por feature para lo específico**.

```
app/              → rutas con Expo Router (file-based)
components/       → componentes reutilizables
components/ui/    → componentes atómicos (Button, Card, Input)
features/         → módulos por feature (auth, pedidos, clientes)
hooks/            → hooks genéricos
constants/        → temas, configuraciones
services/         → API client y servicios HTTP
stores/           → stores Zustand
types/            → tipos compartidos
utils/            → utilidades transversales
```

---

## Opciones Consideradas

### Opción 1: feature-based con carpetas técnicas compartidas (seleccionada)
Separa lo genérico (UI, hooks, servicios) de lo específico (features). Las features contienen sus propias pantallas, componentes y lógica.

### Opción 2: Todo por tipo técnico (screens/, components/, hooks/ globales)
Las carpetas se vuelven enormes rápido. Una feature como "pedidos" tiene archivos dispersos en 5 carpetas distintas.

### Opción 3: Feature-based estricto (cada feature con todo adentro)
Cada feature contiene sus propios hooks, componentes y servicios, incluso si son compartibles. Genera duplicación innecesaria.

### Opción seleccionada
Opción 1. Balance entre organización por feature y reutilización de código genérico.

---

## Consecuencias

### Positivas
- Navegación predecible: los archivos de una feature están cerca
- Separación clara entre código genérico (UI, hooks) y específico (features)
- Onboarding rápido: se entiende la estructura en minutos
- Escala horizontalmente con nuevas features
- Components atómicos reutilizables en `components/ui/`

### Negativas
- Una feature que crece mucho puede tener muchos archivos en su carpeta
- Límite difuso entre qué va en `components/` y qué en `features/`
- Puede requerir refactors periódicos al mover código genérico descubierto

---

## Impacto en el Sistema

### Backend
- Sin impacto.

### Frontend (Mobile)
- `app/` → solo archivos de ruta Expo Router
- `features/auth/` → pantallas, hooks, stores específicos de auth
- `features/pedidos/` → pantallas, hooks, stores de pedidos
- `components/ui/` → Button, Card, Input, etc. (atómicos, reutilizables)

### Infraestructura / Compartido
- Convención documentada. Sin cambios en tooling.

---

## Reglas Derivadas

- `components/ui/` solo contiene componentes atómicos sin lógica de negocio
- `components/` contiene componentes compuestos reutilizables entre features
- `features/<feature>/` contiene pantallas, hooks, stores y componentes específicos
- Una feature no importa archivos de otra feature directamente
- Código compartido entre features va en `hooks/`, `utils/` o `components/`
