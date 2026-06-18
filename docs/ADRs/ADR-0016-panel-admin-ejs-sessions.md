---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Panel Administrativo con EJS + Sessions
---

# ADR-0016: Panel Administrativo con EJS + Sessions

## Contexto

El sistema necesita una interfaz administrativa para que los operadores y administradores gestionen datos maestros: clientes, pedidos, repartos, usuarios, items, ciudades, domicilios, horarios, empleados, visitas, retenidos y reclamos.

La app mobile está orientada al repartidor en ruta, no cubre funciones administrativas. Se requiere una interfaz desktop accesible desde cualquier navegador, sin necesidad de instalar software adicional.

Existen dos audiencias con necesidades distintas:
- **Repartidores**: operan desde la app mobile en ruta
- **Administradores/operadores**: gestionan datos desde escritorio, necesitan CRUD completos, navegación por tablas, búsqueda y filtros

---

## Decisión

Se implementa un **panel administrativo server-side renderizado con EJS + express-session + PostgreSQL**, montado bajo la ruta `/admin` en el mismo servidor Express del backend.

Características:
- **Templating**: EJS (Embedded JavaScript) como motor de vistas
- **Autenticación**: sesiones con `express-session` + `connect-pg-simple` (almacenamiento en PostgreSQL)
- **Layout**: sidebar + header + content area + scripts, con partials reutilizables
- **Estilos**: CSS vanilla en `public/css/admin.css`
- **JS cliente**: JS vanilla en `public/js/admin.js`
- **CRUDs**: 14 recursos con listado, creación, edición y eliminación/desactivación
- **Sin framework frontend**: no se utiliza React, Vue ni ningún SPA

---

## Opciones Consideradas

### Opción 1: EJS + Sessions server-side (seleccionada)
Renderizado en servidor con EJS, sesiones almacenadas en PostgreSQL. Cada request produce HTML completo. Los formularios se envían con POST tradicional (no AJAX).

Ventajas:
- Simple, sin complejidad de SPA
- Sin necesidad de build step para frontend
- Sesiones seguras (httpOnly, sameSite) sin exponer JWT al frontend
- Misma base de datos que el backend — sin estado compartido extra
- Rápido de implementar: ~40 templates, 14 controladores

Desventajas:
- Experiencia menos fluida que un SPA (recarga completa de página)
- Sin reactividad — filtros y búsquedas requieren recarga
- CSS/JS vanilla sin componentes reutilizables

### Opción 2: SPA con React + API REST existente
Aprovechar la API REST ya construida y agregar un frontend React independiente.

Ventajas:
- Experiencia de usuario superior (navegación sin recarga, filtros en tiempo real)
- Reutiliza la API existente
- Componentes modulares y reutilizables

Desventajas:
- Requiere otro proyecto frontend (build tool, routing, estado, despliegue)
- Duplica lógica de autenticación (JWT en frontend vs sesiones)
- Mayor complejidad inicial y de mantenimiento
- Tiempo de desarrollo significativamente mayor

### Opción 3: Panel embebido en el mismo puerto con React (micro-frontend)
Servir un SPA React desde el mismo Express en una ruta `/admin`.

Ventajas:
- Mejor UX que EJS
- Un solo servidor

Desventajas:
- Complejidad de integración (build, caché, rutas)
- Dependencia de Node.js para servir archivos estáticos del SPA
- Duplica stack frontend (React en admin, React Native en mobile)

### Opción seleccionada
Opción 1. El panel es una herramienta interna para administradores, no un producto para clientes. La simplicidad de EJS + Sessions es preferible a la sobreingeniería de un SPA para uso administrativo. El mismo servidor Express sirve tanto la API como el panel, simplificando el despliegue.

---

## Consecuencias

### Positivas
- Un solo servidor Express para API + panel admin
- Autenticación por sesión aislada del sistema JWT de la API
- Sesiones persistidas en PostgreSQL (sin pérdida al reiniciar)
- Implementación rápida: 14 CRUDs completos en aproximadamente 40 templates
- Sin dependencias frontend adicionales
- Fácil de extender con nuevos CRUDs

### Negativas
- Experiencia de usuario tipo "web 1.0" (recargas completas)
- CSS/JS vanilla sin sistema de componentes
- Cada nueva feature admin requiere controlador + ruta + vista EJS
- Dificultad para implementar funcionalidades reactivas (búsqueda en tiempo real, actualizaciones sin recarga)
- Las vistas EJS mezclan lógica y presentación

---

## Impacto en el Sistema

### Backend
- Nuevo directorio: `src/admin/` con controllers/ (14), routes/ (14), views/ (~40), middleware/
- Nuevas dependencias: `express-session`, `connect-pg-simple`, `ejs`
- Sesiones almacenadas en tabla `session` de PostgreSQL
- Layout EJS con partials: header, sidebar, footer, scripts
- Middleware `requireAdminSession` que verifica `req.session.userRol === 'ADMIN'`

### Frontend
- Sin impacto directo. El panel es independiente de la app mobile.

### Infraestructura / Compartido
- Variable de entorno: `SESSION_SECRET` para firmar cookies de sesión
- Tabla `session` en PostgreSQL (creada automáticamente por `connect-pg-simple`)
- Ruta `/admin` en el mismo puerto que la API REST

---

## Reglas Derivadas

- Todo recurso admin requiere sesión activa con rol ADMIN
- Las rutas admin se montan bajo `/admin/<recurso>` con `express.Router()`
- Los controladores admin usan `try/catch` con `next(error)` para el error handler global
- Las vistas EJS siguen el layout base con sidebar + header + content + scripts
- No usar AJAX ni fetch en el panel — usar formularios HTML tradicionales con POST
- El panel admin NO expone la ruta `/admin/api/*` — toda mutación va via formulario POST
