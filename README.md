# SupplyCycle

Proyecto monorepo que contiene:

* `backend/` → API (Express + TypeScript + Prisma)
* `mobile/` → App mobile (React Native + Expo)

---

## 👥 Integrantes

* Manuela Chanquía
* Lucia Meza
* Martina García Améndola
* Tiago Solis
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

## 🐳 Ejecución con Docker

### 📦 Levantar el entorno completo

```bash
docker compose -f docker-compose.dev.yml up --build
```

---

### ⛔ Detener contenedores

```bash
docker compose down
```

---

### 🔄 Reiniciar entorno

```bash
docker compose down -v
docker compose -f docker-compose.dev.yml up --build
```

> ⚠️ `-v` elimina volúmenes (borra datos de la base)

---

## 🌐 Puertos del sistema

| Servicio   | Contenedor              | Puerto Host | Puerto Contenedor | URL                   |
| ---------- | ----------------------- | ----------- | ----------------- | --------------------- |
| Backend    | supplycycle_backend_dev | 3000        | 3000              | http://localhost:3000 |
| PostgreSQL | supplycycle_db_dev      | 5432        | 5432              | localhost:5432        |
| pgAdmin    | supplycycle_pgadmin_dev | 5050        | 80                | http://localhost:5050 |

---

## 📌 Notas sobre Docker

* El backend se conecta a la DB usando el host `db`
* No usar `localhost` dentro de contenedores
* Los datos de PostgreSQL se persisten en volúmenes

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
