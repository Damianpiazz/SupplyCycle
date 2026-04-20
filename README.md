# SupplyCycle

Proyecto monorepo que contiene:

* `backend/` → API (Express + TypeScript + Prisma)
* `mobile/` → App mobile (React Native + Expo)

---

## 👥 Integrantes

* Nombre Apellido
* Nombre Apellido
* Nombre Apellido
* Nombre Apellido
* Damian Piazza

---

## 🌿 Estrategia de ramas

Se utiliza una convención basada en **tipo de cambio + plataforma + descripción**.

### 📌 Formato

```bash
<tipo>/<plataforma>/<descripcion>
```

---

### 🧩 Tipos permitidos

* `feature` → nueva funcionalidad
* `fix` → corrección de errores
* `refactor` → mejora interna sin cambio funcional
* `chore` → tareas de mantenimiento
* `docs` → cambios en documentación

---

### 📱 Plataformas

* `backend`
* `mobile`

---

### ✅ Ejemplos

```bash
feature/backend/auth-login
feature/mobile/login-screen

fix/backend/token-expiration
refactor/mobile/navigation-structure
```

---

### ⚠️ Reglas

* usar kebab-case
* no usar mayúsculas
* descripción breve y clara
* una sola responsabilidad por rama

---

## 🧠 Convención de commits

Se utiliza **Conventional Commits**, validado automáticamente.

### 📌 Formato

```bash
<type>(<scope>): <description>
```

---

### 🧩 Tipos

* `feat`
* `fix`
* `refactor`
* `chore`
* `docs`

---

### 🎯 Scope

* `backend`
* `mobile`

---

### ✅ Ejemplos

```bash
feat(backend): add auth module
fix(mobile): resolve login crash
refactor(backend): improve service structure
```

---

### ❌ Ejemplos inválidos

```bash
update code
fix stuff
feat: cambio
```

---

## 🔒 Validación

Los commits son validados automáticamente mediante:

* Husky
* Commitlint

---

## 🚀 Flujo de trabajo

1. crear rama desde `main`
2. desarrollar el cambio
3. realizar commits siguiendo la convención
4. abrir Pull Request
5. revisión
6. merge

---

## 📌 Convención de Pull Requests

Las Pull Requests deben ser claras, consistentes y facilitar la revisión.

---

### 🧾 Título

```bash
<type>(<scope>): <descripcion breve>
```

---

### 📄 Estructura del cuerpo

```md
## Descripción
Resumen del cambio y su propósito.

---

## Cambios realizados
- Lista de cambios relevantes

---

## Impacto
- Componentes o módulos afectados

---

## Consideraciones
- Notas adicionales, dependencias o advertencias

---

## Testing
- Cómo se probó el cambio
- Casos cubiertos

---

## Resultado
- Estado final del sistema tras el cambio
```