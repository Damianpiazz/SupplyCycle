# 📱 Mobile App — Expo + React Native (TypeScript)

Aplicación móvil construida con **Expo** y **React Native**, utilizando **TypeScript** y **Expo Router** (file-based routing). La arquitectura está pensada para escalar mediante un enfoque **feature-based (vertical slicing)**, alineado con el backend.

---

## 🚀 Stack

* Expo
* React Native
* TypeScript
* Expo Router (file-based routing)
* React Navigation
* Expo APIs (Haptics, Image, WebBrowser, etc.)
* ESLint + Prettier

---

## 📦 Instalación

```bash
npm install
```

---

## 🧪 Desarrollo

### Iniciar entorno de desarrollo

```bash
npm run dev
```

> ⚠️ Si no existe, podés mapearlo a:
>
> ```json
> "dev": "expo start"
> ```

---

### Ejecutar en navegador (web)

Una vez iniciado:

```bash
npm run web
```

o presioná:

```
w
```

en la terminal.

---

### Otras opciones

```bash
npm run android
npm run ios
```

---

## 🌐 Acceso desde navegador

Expo levanta un servidor local, típicamente:

```
http://localhost:8081
```

---

## 📁 Estructura del proyecto

```
.
├── app/
│   ├── (tabs)/
│   ├── _layout.tsx
│   ├── modal.tsx
│
├── components/
│   ├── ui/
│
├── hooks/
├── constants/
├── assets/
├── scripts/
│
├── app.json
├── package.json
├── tsconfig.json
```

---

## 🧠 Arquitectura (Feature-based)

Aunque Expo Router organiza por rutas, la lógica debe escalar hacia:

```
features/
  auth/
    screens/
    components/
    services/
    hooks/
```

👉 La idea es **agrupar por funcionalidad**, no por tipo técnico.

---

## 🧩 Explicación de carpetas

### `/app`

Sistema de rutas basado en archivos.

Ejemplo:

```
app/
  index.tsx        → "/"
  modal.tsx        → "/modal"
  (tabs)/
    index.tsx      → tab Home
    explore.tsx    → tab Explore
```

#### `_layout.tsx`

Define navegación global (Stack, Tabs, etc.).

---

### `/components`

Componentes reutilizables:

* UI genérica (`ui/`)
* componentes de layout
* elementos visuales compartidos

Ejemplo:

* `ThemedText`
* `ParallaxScrollView`
* `IconSymbol`

---

### `/hooks`

Custom hooks:

* manejo de tema (`useColorScheme`)
* lógica reutilizable
* abstracciones de estado

---

### `/constants`

Configuraciones estáticas:

* colores (`theme.ts`)
* tipografías
* valores globales

---

### `/assets`

Recursos estáticos:

* imágenes
* íconos
* splash screens

---

### `/scripts`

Scripts auxiliares:

* reset del proyecto
* automatizaciones

---

## 🎨 Theming

El proyecto soporta:

* modo claro / oscuro
* sistema basado en `useThemeColor`
* configuración centralizada en `constants/theme.ts`

---

## 🔗 Navegación

Basada en:

* **Expo Router**
* **React Navigation**

Tipos:

* Stack (global)
* Tabs (`(tabs)`)

---

## 🧠 Convenciones

### Imports

```ts
import { ThemedText } from '@/components/themed-text';
```

---

### Evitar

* lógica de negocio en componentes UI
* duplicación de llamadas API
* estado global innecesario

---

## ⚙️ Configuración técnica

### TypeScript

* modo estricto
* alias `@/*` configurado
* tipado fuerte

---

### ESLint

* reglas de Expo
* auto-fix en guardado

---

## 🔄 Flujo de desarrollo

1. crear feature (o ruta en `/app`)
2. definir UI
3. extraer lógica a hooks
4. conectar con servicios (API)
5. testear en web/emulador

---

## 🧹 Reset del proyecto

```bash
npm run reset-project
```

Esto:

* mueve código actual a `app-example/`
* crea una base limpia

---

## 📌 Notas importantes

* `android/` e `ios/` están ignorados → proyecto en modo managed
* soporte web habilitado
* alias `@/` activo (definido en `tsconfig.json`)
* animaciones con `react-native-reanimated`

---

## 🔗 Recursos

* https://docs.expo.dev/
* https://docs.expo.dev/router/introduction/
* https://reactnative.dev/

## 📌 Boilerplate basado en:

* https://github.com/obytes/react-native-template-obytes/tree/master