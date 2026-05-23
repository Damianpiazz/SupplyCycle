---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Navegación Mobile con Expo Router (File-based)
---

# ADR-0010: Navegación Mobile con Expo Router (File-based)

## Contexto

La app mobile necesita un sistema de navegación que maneje tabs, stacks y modales. El equipo está familiarizado con file-based routing de Next.js y se busca una experiencia similar para React Native.

La navegación debe ser nativa (no JS-based) para rendimiento y comportamiento de plataforma.

---

## Decisión

Se utiliza **Expo Router 6** con file-based routing, que internamente usa `@react-navigation/native-stack` para stacks nativos y `@react-navigation/bottom-tabs` para tabs.

Estructura:
```
app/
├── _layout.tsx        → layout raíz (Stack)
├── (tabs)/
│   ├── _layout.tsx    → layout de tabs
│   ├── index.tsx      → home
│   └── explore.tsx    → explorar
├── modal.tsx          → modal global
└── login.tsx          → login (fuera de tabs)
```

---

## Opciones Consideradas

### Opción 1: Expo Router 6 file-based (seleccionada)
Navegación declarativa con archivos y carpetas. Layouts anidados, links tipados, deep linking automático.

### Opción 2: @react-navigation puro
Configuración programática de navigators. Más flexible pero más verboso. Sin file-based routing.

### Opción 3: react-native-navigation (Wix)
Navegación 100% nativa sin bridge JS. Configuración muy compleja, mala DX. Sobredimensionado.

### Opción seleccionada
Opción 1. Expo Router es el estándar recomendado por Expo para proyectos nuevos. File-based reduce fricción y hace la navegación auto-documentada.

---

## Consecuencias

### Positivas
- File-based: crear una pantalla = crear un archivo
- Layouts anidados con `_layout.tsx` (stack dentro de tabs, etc.)
- Deep linking automático sin configuración
- Links tipados con `href` tipo-safe
- Navegación nativa por debajo (native-stack)
- Soportado oficialmente por Expo

### Negativas
- Estructura de archivos rígida (los archivos definen la URL)
- Layouts complejos pueden requerir `_layout.tsx` anidados difíciles de seguir
- Expo Router 6 aún tiene menos comunidad que @react-navigation puro
- Migrar desde @react-navigation requiere reestructurar archivos

---

## Impacto en el Sistema

### Backend
- Sin impacto.

### Frontend (Mobile)
- `app/_layout.tsx` → configuración global de navegación
- `app/(tabs)/_layout.tsx` → tabs layout
- `app/(tabs)/index.tsx` → pantalla principal
- `app/login.tsx` → pantalla de login (stack modal)
- `app/modal.tsx` → modal global

### Infraestructura / Compartido
- Sin cambios. Expo Router viene incluido en Expo SDK 54.

---

## Reglas Derivadas

- Cada archivo en `app/` es una ruta
- `_layout.tsx` define layouts y navigators
- `(tabs)/` es un grupo de rutas sin afectar la URL
- `(tabs)/index.tsx` es la pantalla de inicio
- Pantallas fuera de `(tabs)/` son stacks/modales
- Usar `<Link href="...">` en lugar de `navigation.navigate()`
- Deep linking funciona automáticamente para todas las rutas
