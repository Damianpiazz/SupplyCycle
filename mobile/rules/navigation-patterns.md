# Navigation Patterns (basado en ADR-0010)

## Estructura Expo Router
```
app/
├── _layout.tsx         # Stack raíz: login | (tabs) — auth gate
├── login.tsx           # Fuera de tabs (sin bottom bar)
└── (tabs)/
    ├── _layout.tsx     # Bottom Tab Navigator (5 tabs)
    ├── index.tsx       # Inicio (tab 1)
    ├── repartos/
    │   └── index.tsx   # Lista de entregas (tab 2)
    ├── pedidos/
    │   ├── _layout.tsx # Stack: lista → detalle
    │   ├── index.tsx   # Lista general de pedidos
    │   └── [id].tsx    # Detalle del pedido
    ├── mapa/
    │   ├── _layout.tsx # Stack: mapa → detalle
    │   ├── index.tsx   # Mapa con marcadores
    │   └── [id].tsx    # Detalle del pedido (desde mapa)
    └── perfil.tsx      # Perfil (tab 5, sin stack propio)
```

## Reglas de navegación

1. **Auth Gate en `app/_layout.tsx`**:
   ```
   isAuthenticated === false → Stack { login }
   isAuthenticated === true  → Stack { (tabs) }
   Mientras carga            → LoadingSpinner
   ```

2. **Cada tab mantiene su propio stack de navegación**:
   - `pedidos/[id]` y `mapa/[id]` al volver regresan a su tab original
   - Logrado via `_layout.tsx` con `Stack` dentro de cada carpeta de tab

3. **Reutilización de componentes**:
   - `pedidos/[id].tsx` y `mapa/[id].tsx` renderizan el mismo componente: `PedidoDetalleScreen` (importado desde `features/pedidos/screens/`)
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

## Bottom Navigation Bar (5 tabs)

| Tab | Ruta | Ícono | Descripción |
|---|---|---|---|
| Inicio | `index` | house.fill / home | Próxima entrega + progreso |
| Repartos | `repartos/index` | shippingbox.fill / local-shipping | Entregas del día agrupadas |
| Pedidos | `pedidos/index` | clipboard.fill / list-alt | Lista general con buscador |
| Mapa | `mapa/index` | map.fill / map | Mapa con marcadores |
| Perfil | `perfil` | person.fill / person | Datos + cerrar sesión |

- La barra inferior SOLO es visible si el usuario está autenticado
- Los íconos usan SF Symbols en iOS y MaterialIcons en Android/web (via `components/ui/icon-symbol.tsx`)
