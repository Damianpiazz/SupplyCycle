# Feature Architecture (basado en ADR-0008)

## Estructura de una feature
```
features/<feature>/
├── screens/        → Pantallas (componentes que se renderizan en rutas app/)
├── components/     → Subcomponentes específicos de la feature
├── hooks/          → Hooks específicos (queries TanStack Query, mutaciones, lógica)
├── services/       → Llamadas HTTP específicas (opcional, solo si hooks lo necesita)
└── types.ts        → Tipos específicos (mínimos; re-exportar de types/global si aplica)
```

## Responsabilidades por capa

| Carpeta | Qué va | Qué NO va |
|---|---|---|
| `app/` | Layouts + wrappers que importan screens | Lógica de negocio, llamadas HTTP |
| `features/*/screens/` | Pantallas completas | Llamadas HTTP directas, SecureStore |
| `features/*/components/` | Subcomponentes visuales específicos | Estado global, lógica HTTP |
| `features/*/hooks/` | useQuery, useMutation, lógica reutilizable | JSX, navegación directa |
| `features/*/services/` | Funciones de llamada HTTP específicas | Estado, UI |
| `services/` (global) | api.ts, handleApiError.ts | Lógica de negocio |
| `store/` (global) | authStore (sesión), uiStore (preferencias) | Datos de servidor (van a TanStack Query) |
| `types/` (global) | Tipos compartidos entre features | Lógica, UI |
| `mocks/` | Datos mock para desarrollo | Tests, lógica |

## Reglas estrictas

1. **Una feature NO importa de otra feature directamente**.
   - Si necesita un tipo, lo toma de `types/` global
   - Si necesita lógica compartida, va a `hooks/` global o `services/` global

2. **El código HTTP nunca va dentro de screens o components**.
   - Va en hooks (useQuery/useMutation) o services
   - Los screens llaman hooks, no llaman Axios directamente

3. **No duplicar tipos TypeScript**.
   - Los tipos se definen una sola vez en `types/` global
   - Las features pueden re-exportar desde allí si es necesario

4. **No crear stores globales por entidad**.
   - `authStore` es el único store global permitido
   - Datos de pedidos, repartos, etc. van en TanStack Query (caché), no en Zustand

5. **Código en inglés, UI en español**.
   - Variables, funciones, hooks, types, archivos → inglés
   - Texto visible al usuario (labels, títulos, mensajes) → español

6. **Componentes UI atómicos van en `components/ui/`**.
   - Button, Card, Input, Header, LoadingSpinner, ErrorMessage
   - No tienen lógica de negocio, solo reciben props y renderizan
