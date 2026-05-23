---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Stack Mobile — React Native 0.81 + Expo SDK 54
---

# ADR-0005: Stack Mobile — React Native 0.81 + Expo SDK 54

## Contexto

La app mobile debe funcionar en iOS y Android con una sola base de código. Se necesita un framework que permita desarrollo rápido, actualizaciones OTA, y acceso a APIs nativas (cámara, GPS, notificaciones) sin configuración manual de módulos nativos.

El equipo tiene experiencia previa con React, por lo que React Native es la opción natural.

---

## Decisión

Se utiliza **Expo SDK 54** con **React Native 0.81**, **Expo Router 6** para navegación file-based, y las siguientes librerías complementarias:

- **@react-navigation** (bottom-tabs + native-stack)
- **react-native-reanimated** + **react-native-gesture-handler**
- **react-native-safe-area-context**

El proyecto se estructura con path alias `@/` apuntando a la raíz de `mobile/`.

---

## Opciones Consideradas

### Opción 1: Expo SDK 54 + React Native 0.81 (seleccionada)
Expo maneja la configuración nativa, builds en la nube (EAS), actualizaciones OTA y provee las APIs nativas más comunes sin necesidad de ejectar.

### Opción 2: React Native CLI (bare workflow)
Máximo control sobre módulos nativos pero requiere configuración manual de Xcode/Android Studio. Más lento para desarrollo y mayor fricción en onboarding.

### Opción 3: Framework alternativo (Flutter, Kotlin Multiplatform)
Curva de aprendizaje alta, ecosistema diferente. El equipo ya conoce React.

### Opción seleccionada
Opción 1. Expo es el estándar recomendado por la comunidad React Native para proyectos nuevos. SDK 54 es la versión más reciente y estable.

---

## Consecuencias

### Positivas
- Desarrollo rápido con Fast Refresh y Expo Go
- Builds en la nube con EAS sin configurar Xcode/Android Studio
- Actualizaciones OTA (expo-updates) sin pasar por App Store / Play Store
- APIs nativas listas para usar (cámara, notificaciones, GPS, etc.)
- Expo Router 6 con file-based routing (similar a Next.js)
- Reanimated 4 para animaciones en UI thread

### Negativas
- Expo Go no soporta todos los módulos nativos (a veces requiere dev build)
- Dependencia del ecosistema Expo (si Expo desaparece, migrar es complejo)
- El tamaño de la app es mayor que bare RN por las librerías incluidas
- Expo SDK 54 requiere React Native 0.81 (version atada)

---

## Impacto en el Sistema

### Backend
- Sin impacto directo.

### Frontend (Mobile)
- `app/` → rutas con Expo Router (file-based)
- `components/ui/` → componentes atómicos
- `constants/theme.ts` → colores, spacing, tipografía
- `hooks/` → hooks personalizados

### Infraestructura / Compartido
- Variables de entorno con prefijo `EXPO_PUBLIC_`
- `eas.json` para configuración de builds EAS
- Path alias `@/` configurado en `tsconfig.json`

---

## Reglas Derivadas

- Path alias `@/` → raíz de `mobile/`
- Componentes UI atómicos en `components/ui/`
- Colores y spacing desde `constants/theme.ts`
- Usar `useColorScheme()` para dark mode
- Pantallas/rutas en `app/` (Expo Router file-based)
