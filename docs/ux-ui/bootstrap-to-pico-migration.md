# Migración: Bootstrap 5 → Pico.css en el Admin

## Objetivo

Reemplazar Bootstrap 5.3.3 (CDN) por Pico.css v2 como framework CSS del panel admin de SupplyCycle, alineando la interfaz con el sistema de diseño de la marca (colores, tipografía, estados de pedido).

## Stack target

- **Pico.css v2** desde CDN: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">`
- **Tema personalizado** en `public/css/supplycycle-theme.css` con las variables de la marca SupplyCycle
- **Sin JavaScript de framework** — Pico no necesita JS; el `admin.js` actual (solo `data-confirm`) sigue funcionando igual

## Archivos afectados

| Tipo | Cant. | Archivos |
|---|---|---|
| Layouts | 3 | `layouts/header.ejs`, `layouts/footer.ejs`, `layouts/pagination.ejs` |
| Login | 1 | `auth/login.ejs` |
| Index views | 14 | clientes, pedidos, repartos, items, usuarios, ciudades, domicilios, dias, horarios, empleados, visitas, retenidos, reclamos |
| Form views | 11 | clientes, pedidos, items, usuarios, ciudades, domicilios, dias, horarios, empleados, visitas, retenidos, reclamos |
| Show views | 3 | clientes, pedidos, repartos |
| Otros | 2 | retenidos/demorados, historial/reparto (no vistos) |
| CSS | 1 crear + 1 mod | `supplycycle-theme.css` (nuevo), `admin.css` (actualizar colores) |
| **Total** | **36** | |

## Mapeo Bootstrap → Pico

| Bootstrap | Pico / Alternativa |
|---|---|
| `container-fluid`, `row`, `col-*` | Contenedor `<main class="container">` + CSS Grid con `.grid` o CSS custom |
| `d-flex`, `justify-content-*`, `align-items-*` | Flexbox nativo (inline styles o clases utilitarias propias) |
| `btn btn-primary` | `<button class="primary">` o `<a href="..." role="button">` |
| `btn btn-outline-secondary` | `<button class="secondary outline">` |
| `btn btn-sm` | CSS custom: `--pico-button-font-size: 0.875rem; padding: 0.25rem 0.75rem` |
| `form-control`, `form-select` | `<input>`, `<select>` nativos (Pico los estiliza) |
| `form-label` | `<label>` nativo |
| `form-check`, `form-check-input` | `<label><input type="checkbox">...</label>` anidado |
| `form-text` | `<small>` |
| `table`, `table-hover`, `table-striped` | `<table>` nativo (Pico estiliza) + CSS hover |
| `badge bg-*` | `<mark>` o `<span>` con clases `.badge-{estado}` (CSS custom con paleta SupplyCycle) |
| `card`, `card-header`, `card-body` | `<article>`, `<header>`, contenido directo |
| `alert alert-success / alert-danger` | `<article role="alert">` con clases `.alert-success` / `.alert-danger` |
| `pagination`, `page-item`, `page-link` | `<nav aria-label="pagination"><ul><li><a>` con CSS custom |
| `text-muted` | CSS variable `color: var(--pico-muted-color)` |
| `shadow` | CSS variable `box-shadow: var(--pico-card-box-shadow)` |
| `dropdown`, `data-bs-toggle` | No hay dropdown nativo en Pico → menú inline o enlace directo |
| `border-bottom`, `py-*`, `p-*`, `mb-*` | CSS inline o clases propias |

## Plan de migración

### Fase 1: Setup (1 crear + 2 modificar)

**1.1** — Crear `public/css/supplycycle-theme.css` con:

```css
/* ══════════════════════════════════════════════
   SupplyCycle Admin — Tema Pico.css
   Basado en constants/theme.ts de la app mobile
   ══════════════════════════════════════════════ */

/* ── Override de variables Pico ── */
:root {
  /* Primario */
  --pico-primary: #3B6D11;
  --pico-primary-hover: #2E5A0E;
  --pico-primary-background: #3B6D11;
  --pico-primary-underline: rgba(59, 109, 17, 0.5);
  --pico-primary-border: var(--pico-primary-hover);

  /* Tipografía */
  --pico-font-family: 'Inter', system-ui, sans-serif;
  --pico-font-size: 15px;
  --pico-line-height: 1.5;

  /* Colores base */
  --pico-color: #1A2E18;
  --pico-background-color: #F5F7F4;
  --pico-card-background-color: #FFFFFF;
  --pico-card-border-color: #C8D4C0;
  --pico-card-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  --pico-border-color: #C8D4C0;
  --pico-muted-color: #4A6045;
  --pico-table-row-stripped-background: #EAF3DE;

  /* Formularios */
  --pico-border-radius: 8px;
  --pico-form-element-spacing-vertical: 8px;
  --pico-form-element-spacing-horizontal: 14px;
  --pico-group-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  /* Botones */
  --pico-button-font-weight: 600;
}

[data-theme='dark'] {
  --pico-primary: #A8D878;
  --pico-primary-hover: #8FCB5C;
  --pico-primary-background: #3B6D11;
  --pico-primary-underline: rgba(168, 216, 120, 0.5);
  --pico-primary-border: #7DC44A;

  --pico-color: #D8ECC8;
  --pico-background-color: #0F1A12;
  --pico-card-background-color: #162018;
  --pico-card-border-color: #1C3020;
  --pico-border-color: #284830;
  --pico-muted-color: #6A9060;
  --pico-table-row-stripped-background: #1A3010;
}

/* ── Layout: Sidebar + contenido ── */
body {
  display: flex;
  min-height: 100vh;
  margin: 0;
}

.sidebar {
  width: 220px;
  min-width: 220px;
  background: #1A2E18;
  color: #D8ECC8;
  padding: var(--pico-spacing);
  display: flex;
  flex-direction: column;
}

.sidebar a {
  color: #8AAA80;
  text-decoration: none;
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: var(--pico-border-radius);
  font-weight: 500;
  font-size: 0.9rem;
}

.sidebar a:hover,
.sidebar a.active {
  color: #FFFFFF;
  background: rgba(168, 216, 120, 0.15);
}

.sidebar a.active {
  color: #A8D878;
}

.sidebar .brand {
  font-weight: 700;
  font-size: 1.1rem;
  color: #FFFFFF;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.main-content {
  flex: 1;
  padding: var(--pico-spacing);
  overflow-y: auto;
}

/* ── Badges de estado ── */
[class^='badge-'] {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-pendiente {
  background: #FDF4E7;
  color: #7A5A1A;
}
.badge-entregado {
  background: #EAF5EE;
  color: #2E6B42;
}
.badge-no-entregado {
  background: #FCEEED;
  color: #7A3535;
}
.badge-en-curso {
  background: #EAF2FA;
  color: #2A4F70;
}
.badge-cancelado {
  background: #F0F0EE;
  color: #4A6045;
}

[data-theme='dark'] .badge-pendiente {
  background: #251C08;
  color: #D4A84A;
}
[data-theme='dark'] .badge-entregado {
  background: #102A18;
  color: #80C898;
}
[data-theme='dark'] .badge-no-entregado {
  background: #250E0E;
  color: #D48080;
}
[data-theme='dark'] .badge-en-curso {
  background: #0E1A25;
  color: #80B8D8;
}
[data-theme='dark'] .badge-cancelado {
  background: #1A2018;
  color: #6A9060;
}

/* ── Alertas / Banners ── */
.alert {
  padding: 0.75rem 1rem;
  border-radius: var(--pico-border-radius);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}

.alert-success {
  background: #EAF5EE;
  color: #2E6B42;
  border-color: #C2DFCB;
}
.alert-danger {
  background: #FCEEED;
  color: #7A3535;
  border-color: #EAC8C8;
}

[data-theme='dark'] .alert-success {
  background: #102A18;
  color: #80C898;
  border-color: #1E4828;
}
[data-theme='dark'] .alert-danger {
  background: #250E0E;
  color: #D48080;
  border-color: #401818;
}

/* ── Paginación ── */
.pagination {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  margin-top: 1rem;
}

.pagination a,
.pagination span {
  padding: 0.35rem 0.7rem;
  border-radius: var(--pico-border-radius);
  font-size: 0.85rem;
  text-decoration: none;
  color: var(--pico-color);
  border: 1px solid var(--pico-border-color);
}

.pagination a:hover {
  background: var(--pico-table-row-stripped-background);
}

.pagination .active {
  background: var(--pico-primary);
  color: #FFFFFF;
  border-color: var(--pico-primary);
}

.pagination .disabled {
  opacity: 0.4;
  pointer-events: none;
}

/* ── Utilidades ── */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-end { justify-content: flex-end; }
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.text-sm { font-size: 0.85rem; }
.text-muted { color: var(--pico-muted-color); }
.w-full { width: 100%; }
.small-btn {
  font-size: 0.85rem;
  padding: 0.25rem 0.65rem;
}

/* ── Sidebar: user menu sin dropdown ── */
.sidebar .user-section {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar .user-name {
  color: #FFFFFF;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
}

.sidebar .logout-link {
  color: #8AAA80;
  font-size: 0.8rem;
}
```

**1.2** — Modificar `layouts/header.ejs`:
- Reemplazar `<link href="bootstrap.min.css">` → Pico CDN + `supplycycle-theme.css`
- Mantener la sidebar con `<nav>` semántico + clase `.active` inline desde EJS
- Reemplazar alertas Bootstrap por `<article role="alert" class="alert-*">`
- Eliminar `btn`, `btn-primary`, `btn-outline-*`, `nav-pills`, `d-flex`, clases Bootstrap
- Mantener la misma estructura de navegación: logo, links, usuario

**1.3** — Modificar `layouts/footer.ejs`:
- Eliminar `<script src="bootstrap.bundle.min.js">`
- Mantener solo `<script src="/js/admin.js">`

### Fase 2: Login (1 archivo)

**2.1** — Modificar `auth/login.ejs`:
- Eliminar layout Bootstrap (login es standalone)
- Agregar Pico CDN + theme CSS
- Centrar vertical y horizontalmente con flexbox
- Reemplazar `card shadow` → `<article>`
- Formulario: `<input>` nativos, `<button class="primary">`
- Indicador de error: `<article role="alert" class="alert-danger">`

### Fase 3: Index views (14 archivos — patrón común)

Cada `index.ejs` tiene esta estructura que se migra igual:

```ejs
<%# ANTES (Bootstrap) %>
<div class="d-flex justify-content-between align-items-center mb-3">
  <span class="text-muted"><%= total %> registros</span>
  <a href="/admin/X/nuevo" class="btn btn-primary btn-sm">Nuevo</a>
</div>
<form class="row g-2 mb-3">
  <div class="col-auto">
    <input type="text" class="form-control form-control-sm" name="q">
  </div>
  <div class="col-auto">
    <select class="form-select form-select-sm" name="filtro">
      <option value="">Todos</option>
    </select>
  </div>
  <div class="col-auto">
    <button class="btn btn-outline-secondary btn-sm">Filtrar</button>
  </div>
</form>
<table class="table table-hover">
  <thead><tr><th>Nombre</th><th>Acciones</th></tr></thead>
  <tbody>
    <% items.forEach(i => { %>
    <tr>
      <td><%= i.nombre %></td>
      <td>
        <a href="/admin/X/<%= i.id %>" class="btn btn-outline-secondary btn-sm">Ver</a>
        <a href="/admin/X/<%= i.id %>/editar" class="btn btn-outline-secondary btn-sm">Editar</a>
      </td>
    </tr>
    <% }) %>
  </tbody>
</table>
<%- include('../layouts/pagination', { pagination }) %>
```

```ejs
<%# DESPUÉS (Pico) %>
<header class="flex justify-between items-center mb-3">
  <small class="text-muted"><%= total %> registros</small>
  <a href="/admin/X/nuevo" role="button" class="primary small-btn">Nuevo</a>
</header>
<form class="flex gap-2 mb-3 items-center">
  <input type="text" name="q" placeholder="Buscar...">
  <select name="filtro" style="width:auto">
    <option value="">Todos</option>
  </select>
  <button class="secondary outline small-btn">Filtrar</button>
</form>
<table>
  <thead><tr><th>Nombre</th><th>Acciones</th></tr></thead>
  <tbody>
    <% items.forEach(i => { %>
    <tr>
      <td><%= i.nombre %></td>
      <td class="flex gap-1">
        <a href="/admin/X/<%= i.id %>" role="button" class="secondary outline small-btn">Ver</a>
        <a href="/admin/X/<%= i.id %>/editar" role="button" class="secondary outline small-btn">Editar</a>
      </td>
    </tr>
    <% }) %>
  </tbody>
</table>
<%- include('../layouts/pagination', { pagination }) %>
```

Lista de index a migrar:
- clientes, pedidos, repartos, items, usuarios, ciudades, domicilios, dias, horarios, empleados, visitas, retenidos, reclamos

Nota: `retenidos/demorados.ejs` no tiene index, es una vista aparte con tabla. Sigue el mismo patrón.

### Fase 4: Form views (11 archivos — patrón común)

```ejs
<%# ANTES (Bootstrap) %>
<a href="/admin/X" class="btn btn-outline-secondary btn-sm mb-3">&larr; Volver</a>
<div class="card">
  <div class="card-header"><h5><%= titulo %></h5></div>
  <div class="card-body">
    <form action="/admin/X<%= id ? '/'+id : '/nuevo' %>" method="POST">
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Campo</label>
          <input class="form-control" name="campo">
        </div>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-primary">Guardar</button>
        <a href="/admin/X" class="btn btn-outline-secondary">Cancelar</a>
      </div>
    </form>
  </div>
</div>
```

```ejs
<%# DESPUÉS (Pico) %>
<a href="/admin/X" class="secondary outline small-btn mb-2">&larr; Volver</a>
<article>
  <header><h5><%= titulo %></h5></header>
  <form action="/admin/X<%= id ? '/'+id : '/nuevo' %>" method="POST">
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 1rem;">
      <label>Campo
        <input name="campo" required>
      </label>
    </div>
    <footer class="flex gap-2">
      <button class="primary">Guardar</button>
      <a href="/admin/X" role="button" class="secondary outline">Cancelar</a>
    </footer>
  </form>
</article>
```

Lista de forms a migrar:
- clientes, pedidos, items, usuarios, ciudades, domicilios, dias, horarios, empleados, visitas, retenidos, reclamos

### Fase 5: Show/detalle views (3 archivos)

```ejs
<%# DESPUÉS (Pico) %>
<a href="/admin/X" class="secondary outline small-btn mb-2">&larr; Volver</a>
<article>
  <header><h5><%= entidad.nombre %></h5></header>
  <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 0.5rem;">
    <div><strong>Campo:</strong> <%= entidad.campo %></div>
    <div><strong>Estado:</strong> <span class="badge-<%= entidad.estado %>"><%= entidad.estado %></span></div>
  </div>
</article>
```

Lista de shows a migrar:
- clientes, pedidos, repartos

### Fase 6: Paginación (1 archivo)

```ejs
<%# DESPUÉS (Pico) - layouts/pagination.ejs %>
<% if (totalPages > 1) { %>
<nav aria-label="Paginación">
  <ul class="pagination">
    <% if (currentPage > 1) { %>
      <li><a href="?page=<%= currentPage - 1 %>&<%= qs %>">&laquo;</a></li>
    <% } else { %>
      <li><span class="disabled">&laquo;</span></li>
    <% } %>
    <% for (let i = 1; i <= totalPages; i++) { %>
      <li>
        <% if (i === currentPage) { %>
          <span class="active"><%= i %></span>
        <% } else { %>
          <a href="?page=<%= i %>&<%= qs %>"><%= i %></a>
        <% } %>
      </li>
    <% } %>
    <% if (currentPage < totalPages) { %>
      <li><a href="?page=<%= currentPage + 1 %>&<%= qs %>">&raquo;</a></li>
    <% } else { %>
      <li><span class="disabled">&raquo;</span></li>
    <% } %>
  </ul>
</nav>
<% } %>
```

### Fase 7: Limpieza final

- Verificar que no queden referencias a Bootstrap en ningún EJS
- Actualizar `public/css/admin.css` si tiene colores `#212529` o `#0d6efd` que ya no aplican
- Eliminar archivos Bootstrap del proyecto si se descargaron localmente

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Pico no tiene grid flexible como Bootstrap | Usar clases utilitarias propias (`.flex`, `.grid`) definidas en el theme |
| Pico no tiene `btn-sm` | Definir `.small-btn` en el theme |
| Pico no tiene badges semánticos | Definir `.badge-*` con colores de SupplyCycle en el theme |
| Sidebar con dropdown de usuario | Reemplazar por enlace directo + sección de usuario en el theme |
| Formularios complejos (pedidos con items dinámicos) | Usar CSS Grid con `grid-template-columns` para layouts de varias columnas |
| La paginación se ve distinta | El theme ya incluye estilos de paginación para que sea visualmente similar |
| Dark mode del admin | Pico soporta `data-theme="dark"` nativamente; los colores personalizados ya están definidos |

## Orden recomendado de implementación

| Paso | Archivos | Esfuerzo |
|---|---|---|
| 1 | `supplycycle-theme.css` | ⭐ |
| 2 | `layouts/header.ejs`, `layouts/footer.ejs` | ⭐⭐ |
| 3 | `auth/login.ejs` | ⭐ |
| 4 | `layouts/pagination.ejs` | ⭐ |
| 5 | `clientes/index.ejs`, `clientes/form.ejs`, `clientes/show.ejs` | ⭐⭐ |
| 6 | `pedidos/index.ejs`, `pedidos/form.ejs`, `pedidos/show.ejs` | ⭐⭐⭐ |
| 7 | `repartos/index.ejs`, `repartos/form.ejs`, `repartos/show.ejs` | ⭐⭐ |
| 8 | Resto de CRUDs (items, usuarios, ciudades, etc.) | ⭐⭐ |
| 9 | Limpieza final + verificar | ⭐ |

## Verificación post-migración

- Cargar cada ruta del admin y verificar que se renderice correctamente
- Verificar que los formularios envíen datos correctamente
- Verificar que la paginación funcione
- Verificar que los filtros funcionen
- Verificar dark mode si aplica
- Verificar responsive (sidebar colapsada en mobile)
- Verificar que `data-confirm` del admin.js siga funcionando
