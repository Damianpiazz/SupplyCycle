# Contribuir a SupplyCycle

Gracias por contribuir. Para mantener el repositorio ordenado, seguimos convenciones estrictas de ramas, commits y Pull Requests.

## 🌿 Estrategia de ramas

Se utiliza una convención basada en **tipo de cambio + plataforma + descripción**.

### Formato

```
<tipo>/<plataforma>/<descripcion>
```

### Tipos permitidos

| Tipo       | Uso                          |
| ---------- | ---------------------------- |
| `feature`  | Nueva funcionalidad          |
| `fix`      | Corrección de errores        |
| `refactor` | Mejora interna sin cambio funcional |
| `chore`    | Tareas de mantenimiento      |
| `docs`     | Cambios en documentación     |

### Plataformas

| Plataforma   | Proyecto      |
| ------------ | ------------- |
| `backend`    | `backend/`    |
| `mobile`     | `mobile/`     |
| `whatsapp-bot` | `whatsapp-bot/` |

### Ejemplos

```bash
feature/backend/auth-login
feature/mobile/login-screen
fix/backend/token-expiration
refactor/mobile/navigation-structure
```

### Reglas

- Usar `kebab-case`
- No usar mayúsculas
- Descripción breve y clara
- Una sola responsabilidad por rama

---

## 🧠 Convención de commits

Se utiliza **Conventional Commits**, validado automáticamente con Husky + Commitlint.

### Formato

```
<type>(<scope>): <description>
```

### Tipos

| Tipo    | Uso                              |
| ------- | -------------------------------- |
| `feat`  | Nueva funcionalidad              |
| `fix`   | Corrección de errores            |
| `refactor` | Mejora interna                 |
| `chore` | Mantenimiento                    |
| `docs`  | Documentación                    |

### Scope

- `backend`
- `mobile`
- `whatsapp-bot`

### Ejemplos válidos

```bash
feat(backend): add auth module
fix(mobile): resolve login crash
refactor(backend): improve service structure
```

### Ejemplos inválidos

```bash
update code
fix stuff
feat: cambio
```

---

## 🔀 Flujo de trabajo

1. Crear rama desde `main`
2. Desarrollar el cambio
3. Realizar commits siguiendo la convención
4. Abrir Pull Request
5. Revisión
6. Merge

---

## 📌 Convención de Pull Requests

Las Pull Requests deben ser claras, consistentes y facilitar la revisión.

### Título

```
<type>(<scope>): <descripcion breve>
```

### Estructura del cuerpo

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

---

## 🐳 Entorno de desarrollo con Docker

### Levantar el entorno completo

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Detener contenedores

```bash
docker compose down
```

### Reiniciar el entorno (borra datos de la base)

```bash
docker compose down -v
docker compose -f docker-compose.dev.yml up --build
```

> ⚠️ `-v` elimina los volúmenes. Cuidado con la base de datos.

### Notas sobre Docker

- El backend se conecta a la DB usando el host `db` (no `localhost` dentro de contenedores)
- Los datos de PostgreSQL se persisten en volúmenes
