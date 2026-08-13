# Navigation Patterns (basado en ADR-0010)

## Estructura Expo Router
```
app/
├── _layout.tsx         # Stack raíz: login | (tabs) — auth gate
├── login.tsx           # Fuera de tabs (sin bottom bar)
├── modal.tsx           # Modal global (fuera de tabs)
└── (tabs)/
    ├── _layout.tsx     # Bottom Tab Navigator (8 tabs)
    ├── index.tsx       # Inicio (tab 1)
    ├── inicio/         # Stack interno del tab Inicio (href: null, NO es tab)
    │   ├── _layout.tsx
    │   └── [id].tsx    # Detalle del pedido (desde inicio)
    ├── repartos/       # Tab Repartos (stack propio)
    │   ├── _layout.tsx
    │   ├── index.tsx   # Lista de entregas
    │   ├── [id].tsx
    │   ├── crear.tsx
    │   └── detalle-admin/
    ├── pedidos/        # Tab Pedidos (stack propio)
    │   ├── _layout.tsx # Stack: lista → detalle → alta
    │   ├── index.tsx   # Lista general de pedidos
    │   ├── [id].tsx    # Detalle del pedido
    │   └── alta.tsx
    ├── mapa/           # Tab Mapa (stack propio)
    │   ├── _layout.tsx # Stack: mapa → detalle
    │   ├── index.tsx   # Mapa con marcadores
    │   └── [id].tsx    # Detalle del pedido (desde mapa)
    ├── clientes/       # Tab Clientes (stack propio)
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   ├── [id].tsx
    │   ├── alta.tsx
    │   ├── editar/
    │   └── historial/
    ├── estadisticas/   # Tab Estadísticas (stack propio)
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   ├── demanda.tsx
    │   └── mensual.tsx
    ├── usuarios/       # Tab Usuarios (stack propio)
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   ├── [id].tsx
    │   └── alta.tsx
    └── perfil.tsx      # Perfil (tab, sin stack propio)
```

## Reglas de navegación

1. **Auth Gate en `app/_layout.tsx`**:
   ```
   isAuthenticated === false → Stack { login }
   isAuthenticated === true  → Stack { (tabs) }
   Mientras carga            → LoadingSpinner
   ```

2. **Cada tab mantiene su propio stack de navegación**:
   - `pedidos/[id]`, `mapa/[id]` e `inicio/[id]` al volver regresan a su tab original
   - Logrado via `_layout.tsx` con `Stack` dentro de cada carpeta de tab
   - `inicio/` no es un tab: se declara en el `_layout.tsx` de tabs con `href: null` y funciona como stack interno del tab Inicio

3. **Reutilización de componentes**:
   - `pedidos/[id].tsx`, `mapa/[id].tsx` e `inicio/[id].tsx` renderizan el mismo componente: `PedidoDetalleScreen` (importado desde `features/pedidos/screens/`)
   - Las rutas `[id]` reciben el parámetro via `useLocalSearchParams()`

4. **Navegación programática**:
   ```ts
   import { router } from 'expo-router';
   router.push('/pedidos/1');     // Navegar a detalle
   router.replace('/login');      // Redirigir (sin historial)
   router.back();                 // Volver
   ```

5. **Links tipados**:
   ```tsx
   import { Link } from 'expo-router';
   <Link href="/pedidos/1">Ver detalle</Link>
   ```

6. **Deep linking**: Funciona automáticamente para todas las rutas (Expo Router lo maneja sin configuración extra).

## Bottom Navigation Bar (8 tabs)

| Tab | Ruta | Ícono (lucide) | Descripción |
|---|---|---|---|
| Inicio | `index` | house | Próxima entrega + progreso (repartidor) |
| Repartos | `repartos/index` | truck | Entregas del día agrupadas |
| Pedidos | `pedidos/index` | clipboard-list | Lista general con buscador |
| Mapa | `mapa/index` | map | Mapa con marcadores (repartidor) |
| Clientes | `clientes/index` | users | Gestión de clientes (admin) |
| Estadísticas | `estadisticas/index` | bar-chart-3 | Métricas y demanda (admin) |
| Usuarios | `usuarios/index` | user-cog | Gestión de usuarios (admin) |
| Perfil | `perfil` | circle-user | Datos + cerrar sesión |

- La barra inferior SOLO es visible si el usuario está autenticado
- Visibilidad por rol: en `app/(tabs)/_layout.tsx`, los tabs de admin (`clientes`, `estadisticas`, `usuarios`) y de repartidor (`index`, `mapa`) se ocultan con `href: null` según `usuario.rol` del authStore
- Los íconos usan `LucideIcon` (lucide-react-native) via `components/ui/lucide-icon.tsx`
