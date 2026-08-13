# Agregar icono clientes barra inferior

**Session ID:** ses_19a3bf4daffed0gSLSJpYJXTh5
**Created:** 26/5/2026, 16:30:07
**Updated:** 26/5/2026, 16:34:08

---

## User

agregame el icono para la barra inferior de clientes o sea agregale como al de repartos un caminio, el de pedidos una lista 

---

## Assistant (Plan · Big Pickle · 46.0s)

_Thinking:_

The user is asking me to add an icon for a "clientes" (clients/customers) tab in the bottom navigation bar of the mobile app. They mention:

- "repartos" has a "camioncito" (little truck icon)
- "pedidos" has a "lista" (list icon)
- They want to add a tab for "clientes" with an appropriate icon

Let me first explore the current navigation structure to understand the existing tabs and their icons.

**Tool: task**

**Input:**
```json
{
  "description": "Explore mobile navigation structure",
  "prompt": "Explore the mobile app navigation structure in this monorepo. Specifically:\n\n1. Read `mobile/app/(tabs)/_layout.tsx` to see the current tab configuration, icons, and how each tab is defined\n2. Read `mobile/constants/theme.ts` to understand theme/color patterns\n3. Read `mobile/components/ui/icon-symbol.tsx` to see how icons are rendered\n4. List all files in `mobile/app/(tabs)/` to see what tabs currently exist\n5. Check `mobile/app/(tabs)/repartos/` and `mobile/app/(tabs)/pedidos/` structure\n6. Search for any existing \"clientes\" related files or references in the mobile directory (`grep -ri \"clientes\" mobile/app/` or similar)\n\nReturn ALL file contents you find and the directory listings so I can understand the full tab navigation setup.",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_19a3be225fferuHcVimKS5Wi09 (for resuming to continue this task if needed)

<task_result>
Here is the complete breakdown of the mobile app navigation structure.

---

## 1. ROOT LAYOUT (`mobile/app/_layout.tsx`)

**File:** `C:\Users\Lucia\SupplyCycle\mobile\app\_layout.tsx` (81 lines)

- **Auth Gate** (lines 27-55): On mount, tries to load a JWT token from SecureStore via `getToken()`. If found, it calls `GET /auth/me` to validate it and set the auth state. If valid, the user sees `(tabs)`. If no token or invalid, `isLoading` is set to `false`.
- **Loading state** (lines 57-63): While `isLoading` is true, a `LoadingSpinner` with "Iniciando sesion..." is shown.
- **Stack navigator** (lines 68-75):
  - `login` (fade animation)
  - `(tabs)` (fade animation) -- the main authenticated section
  - `modal` (modal presentation)
- Wrapped in `ThemeProvider` (dark/light) and `QueryClientProvider` (TanStack Query).
- Includes `useOfflineSync()` hook and `Toast` component globally.

---

## 2. TAB LAYOUT (`mobile/app/(tabs)/_layout.tsx`)

**File:** `C:\Users\Lucia\SupplyCycle\mobile\app\(tabs)\_layout.tsx` (100 lines)

This is the **bottom tab navigator** with 7 tab screens defined (though only 6 are shown conditionally in the tab bar):

| # | Tab Name    | Title        | Icon (SF Symbol)            | Icon (Material)       | Visible When       | Has Own Stack |
|---|-------------|--------------|-----------------------------|-----------------------|--------------------|---------------|
| 1 | `index`     | _(hidden)_   | none (`href: null`)          | none                  | **Never** (redirect) | No            |
| 2 | `clientes`  | Clientes     | `person.crop.rectangle.stack.fill` | `people`        | Only ADMIN         | Yes (3 screens) |
| 3 | `repartos`  | Repartos     | `shippingbox.fill`          | `local-shipping`      | All authenticated  | Yes (4 screens) |
| 4 | `pedidos`   | Pedidos      | `clipboard.fill`            | `list-alt`            | All authenticated  | Yes (3 screens) |
| 5 | `mapa`      | Mapa         | `map.fill`                  | `map`                 | All authenticated  | Yes (2 screens) |
| 6 | `usuarios`  | Usuarios     | `person.2.fill`             | `people`              | Only ADMIN         | Yes (3 screens) |
| 7 | `perfil`    | Perfil       | `person.fill`               | `person`              | All authenticated  | No (single screen) |

**Key logic:**
- Lines 42-50: `clientes` tab -- `href: isAdmin ? undefined : null` (hidden for non-admins)
- Lines 79-87: `usuarios` tab -- same admin-only logic
- Line 38: `index` has `href: null` so it never appears in the tab bar (it's the default home redirect)
- Uses `HapticTab` as `tabBarButton` for haptic feedback
- Uses `ConnectivityBanner` at the top (currently hardcoded `isConnected={true}`)

---

## 3. THEME CONSTANTS (`mobile/constants/theme.ts`)

**File:** `C:\Users\Lucia\SupplyCycle\mobile\constants\theme.ts` (117 lines)

**Exports:**
- **`Colors`** -- light & dark mode color objects with properties:
  - `text`, `background`, `tint`, `icon`, `tabIconDefault`, `tabIconSelected`
  - Status colors: `pendiente`, `entregado`, `noEntregado`, `enCurso`, `completado`
  - UI colors: `card`, `cardBorder`, `error`, `success`, `warning`, `info`, `surface`, `border`, `muted`, `inputBackground`, `headerBackground`, `headerText`, `buttonPrimary`
- **`Spacing`** -- `xs:4`, `sm:8`, `md:12`, `lg:16`, `xl:20`, `xxl:24`, `xxxl:32`
- **`FontSizes`** -- `xs:12`, `sm:14`, `md:16`, `lg:18`, `xl:20`, `xxl:24`, `title:28`
- **`BorderRadius`** -- `sm:6`, `md:10`, `lg:14`, `xl:20`
- **`Fonts`** -- platform-specific font families for `sans`, `serif`, `rounded`, `mono`

---

## 4. ICON SYMBOL COMPONENT (`mobile/components/ui/icon-symbol.tsx`)

**File:** `C:\Users\Lucia\SupplyCycle\mobile\components\ui\icon-symbol.tsx` (43 lines)

- Uses `expo-symbols` SF Symbol names as input (e.g. `house.fill`, `shippingbox.fill`)
- Maps them to `@expo/vector-icons/MaterialIcons` names via a `MAPPING` object
- Renders the corresponding MaterialIcons component
- **Mapping table:**

| SF Symbol Name                       | Material Icon Name    |
|--------------------------------------|-----------------------|
| `house.fill`                         | `home`                |
| `paperplane.fill`                    | `send`                |
| `chevron.left.forwardslash.chevron.right` | `code`           |
| `chevron.right`                      | `chevron-right`       |
| `shippingbox.fill`                   | `local-shipping`      |
| `clipboard.fill`                     | `list-alt`            |
| `map.fill`                           | `map`                 |
| `person.fill`                        | `person`              |
| `person.2.fill`                      | `people`              |
| `phone.fill`                         | `phone`               |
| `location.fill`                      | `location-on`         |
| `xmark`                              | `close`               |
| `checkmark`                          | `check`               |
| `arrow.clockwise`                    | `refresh`             |
| `magnifyingglass`                    | `search`              |
| `plus`                               | `add`                 |
| `trash`                              | `delete`              |
| `ellipsis`                           | `more-horiz`          |

---

## 5. DIRECTORY STRUCTURE: `mobile/app/(tabs)/`

```
app/(tabs)/
├── _layout.tsx              ← Tab navigator (7 screen slots, 6 visible tabs)
├── index.tsx                ← Inicio (home) screen — hidden from tab bar
├── clientes/                ← ADMIN-only tab
│   ├── _layout.tsx          ← Stack: index | alta | [id]  (admin guard)
│   ├── index.tsx            ← ClientesListScreen
│   ├── alta.tsx             ← ClienteAltaScreen
│   └── [id].tsx             ← ClienteEditarScreen
├── repartos/                ← Repartos tab
│   ├── _layout.tsx          ← Stack: index | [id] | crear | detalle-admin/[id]
│   ├── index.tsx            ← RepartosListScreen or AdminRepartosListScreen (based on role)
│   ├── [id].tsx             ← PedidoDetalleScreen (shared, with back to /repartos)
│   ├── crear.tsx            ← CrearRepartoScreen
│   └── detalle-admin/
│       └── [id].tsx         ← AdminRepartoDetalleScreen
├── pedidos/                 ← Pedidos tab
│   ├── _layout.tsx          ← Stack: index | [id] | alta
│   ├── index.tsx            ← PedidosListScreen
│   ├── [id].tsx             ← PedidoDetalleScreen (shared, with back to /pedidos)
│   └── alta.tsx             ← PedidoAltaScreen
├── mapa/                    ← Mapa tab
│   ├── _layout.tsx          ← Stack: index | [id]
│   ├── index.tsx            ← MapaScreen
│   └── [id].tsx             ← PedidoDetalleScreen (shared, with back to /mapa)
├── usuarios/                ← ADMIN-only tab
│   ├── _layout.tsx          ← Stack: index | alta | [id]  (admin guard)
│   ├── index.tsx            ← UsuariosListScreen
│   ├── alta.tsx             ← UsuarioAltaScreen
│   └── [id].tsx             ← UsuarioEditarScreen
└── perfil.tsx               ← PerfilScreen (no stack, single screen)
```

---

## 6. "CLIENTES" REFERENCES IN THE MOBILE APP

The search for `clientes` found **29 matches in `.tsx` files** and **12 matches in `.ts` files**, spread across these locations:

### Route files (`app/(tabs)/clientes/`):
- **`index.tsx`** -- imports `ClientesListScreen`
- **`alta.tsx`** -- imports `ClienteAltaScreen`
- **`[id].tsx`** -- imports `ClienteEditarScreen`
- **`_layout.tsx`** -- Stack layout with admin guard (redirect to `/` if not ADMIN)

### Feature files (`features/clientes/`):
- **`features/clientes/screens/ClientesListScreen.tsx`** -- Full list screen with search, filter, deactivate, navigation to alta and [id]
- **`features/clientes/screens/ClienteEditarScreen.tsx`** -- Edit/desactivate screen
- **`features/clientes/screens/ClienteAltaScreen.tsx`** -- Create screen
- **`features/clientes/hooks/useClientes.ts`** -- TanStack Query hooks: `useClientes`, `useCliente`, `useCrearCliente`, `useActualizarCliente`, `useDesactivarCliente`
- **`features/clientes/services/clienteService.ts`** -- Axios HTTP methods: `listClientesRequest`, `getClienteRequest`, `crearClienteRequest`, `actualizarClienteRequest`, `desactivarClienteRequest`

### Referenced from other features:
- **`features/pedidos/screens/PedidoAltaScreen.tsx`** -- Uses `listClientesRequest` to fetch clientes for a picker
- **`features/repartos/hooks/useRepartoAdminDetalleData.ts`** -- Counts unique clientes per reparto

---

## 7. NAVIGATION PATTERN SUMMARY

| Aspect | Implementation |
|--------|---------------|
| **Auth Gate** | `app/_layout.tsx` -- checks token on mount, shows login or tabs |
| **Bottom Tabs** | `app/(tabs)/_layout.tsx` -- 6 visible tabs (Inicio hidden), role-based visibility for clientes/usuarios |
| **Per-tab Stacks** | Each tab folder has its own `_layout.tsx` with `Stack` navigator |
| **Shared Detail Screen** | `PedidoDetalleScreen` (from `features/pedidos/screens/`) is reused in `pedidos/[id]`, `mapa/[id]`, and `repartos/[id]` with different `onBack` callbacks |
| **Admin Guards** | `clientes/_layout.tsx` and `usuarios/_layout.tsx` redirect to `/` if `rol !== 'ADMIN'`. The tab itself is also hidden via `href: isAdmin ? undefined : null` in the tab layout |
| **Home Tab** | `index.tsx` renders `InicioScreen` but has `href: null` so it never appears in the tab bar (acts as the default/landing route) |
</task_result>
```

---

## Assistant (Plan · Big Pickle · 7.4s)

_Thinking:_

Let me analyze what the user is asking for:

Looking at the current tab layout (`mobile/app/(tabs)/_layout.tsx`), the tab **"clientes" (Clientes)** already exists with:
- SF Symbol: `person.crop.rectangle.stack.fill`
- Material Icon: `people`

The user is saying:
- "repartos" has a "camioncito" (little truck) → currently uses `shippingbox.fill` / `local-shipping`
- "pedidos" has a "lista" (list) → currently uses `clipboard.fill` / `list-alt`
- They want to **add an icon for "clientes"** in the bottom bar, or change the existing one

Wait, re-reading: "agregame el icono para la barra inferior de clientes o sea agregale como al de repartos un caminio, el de pedidos una lista"

The user is saying: "add the icon for the clientes tab in the bottom bar, like repartos has a truck, pedidos has a list"

So it seems the clientes tab might currently not have a proper icon, or they want to change the existing icon. Let me check the current `_layout.tsx` to see what icon is set for clientes.

From the exploration results, the tab layout shows clientes has:
- SF Symbol: `person.crop.rectangle.stack.fill`
- Material Icon: `people`

But maybe the user is asking to add the icon-symbol mapping for the clientes icon? Let me check the icon-symbol mapping more carefully.

Looking at the icon-symbol mapping:
- `person.2.fill` → `people` (already exists)
- `person.crop.rectangle.stack.fill` → NOT in the mapping!

So if the clientes tab uses `person.crop.rectangle.stack.fill`, but this SF Symbol isn't mapped in the icon-symbol component, it would fail to render properly! That's likely the issue.

But wait, let me re-read what the user said more carefully:

"agregame el icono para la barra inferior de clientes o sea agregale como al de repartos un caminio, el de pedidos una lista"

Translation: "add the icon for the bottom bar of clientes, I mean add it like repartos has a truck, pedidos has a list"

I think they want the clientes tab to have a proper icon in the bottom navigation bar. The current setup already has an icon defined in the tab navigator (`person.crop.rectangle.stack.fill`), but maybe they want something more representative like a "people" or "contacts" icon... or maybe the icon isn't rendering because the SF Symbol isn't in the mapping.

Let me check the exact current icon mapping and the tab layout to understand what's happening.

Actually, I should read the actual files to be sure of the current state.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\Lucia\\SupplyCycle\\mobile\\app\\(tabs)\\_layout.tsx"
}
```

**Output:**
```
<path>C:\Users\Lucia\SupplyCycle\mobile\app\(tabs)\_layout.tsx</path>
<type>file</type>
<content>
1: import { Redirect, Tabs } from 'expo-router';
2: import React from 'react';
3: import { Platform } from 'react-native';
4: 
5: import { HapticTab } from '@/components/haptic-tab';
6: import { IconSymbol } from '@/components/ui/icon-symbol';
7: import { ConnectivityBanner } from '@/components/ui';
8: import { Colors } from '@/constants/theme';
9: import { useColorScheme } from '@/hooks/use-color-scheme';
10: import { useAuthStore } from '@/stores/authStore';
11: 
12: export default function TabLayout() {
13:   const colorScheme = useColorScheme() ?? 'light';
14:   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
15:   const isAdmin = useAuthStore((state) => state.usuario?.rol === 'ADMIN');
16: 
17:   if (!isAuthenticated) {
18:     return <Redirect href="/login" />;
19:   }
20: 
21:   return (
22:     <>
23:       <ConnectivityBanner isConnected={true} />
24:       <Tabs
25:       screenOptions={{
26:         tabBarActiveTintColor: Colors[colorScheme].tint,
27:         headerShown: false,
28:         tabBarButton: HapticTab,
29:         tabBarStyle: {
30:           backgroundColor: Colors[colorScheme].background,
31:           borderTopColor: Colors[colorScheme].border,
32:         },
33:       }}
34:     >
35:       <Tabs.Screen
36:         name="index"
37:         options={{
38:           href: null,
39:         }}
40:       />
41:       <Tabs.Screen
42:         name="clientes"
43:         options={{
44:           title: 'Clientes',
45:           href: isAdmin ? undefined : null,
46:           tabBarIcon: ({ color }) => (
47:             <IconSymbol size={28} name="person.crop.rectangle.stack.fill" color={color} />
48:           ),
49:         }}
50:       />
51:       <Tabs.Screen
52:         name="repartos"
53:         options={{
54:           title: 'Repartos',
55:           tabBarIcon: ({ color }) => (
56:             <IconSymbol size={28} name="shippingbox.fill" color={color} />
57:           ),
58:         }}
59:       />
60:       <Tabs.Screen
61:         name="pedidos"
62:         options={{
63:           title: 'Pedidos',
64:           tabBarIcon: ({ color }) => (
65:             <IconSymbol size={28} name="clipboard.fill" color={color} />
66:           ),
67:         }}
68:       />
69:       <Tabs.Screen
70:         name="mapa"
71:         options={{
72:           title: 'Mapa',
73:           tabBarIcon: ({ color }) => (
74:             <IconSymbol size={28} name="map.fill" color={color} />
75:           ),
76:         }}
77:       />
78:       <Tabs.Screen
79:         name="usuarios"
80:         options={{
81:           title: 'Usuarios',
82:           href: isAdmin ? undefined : null,
83:           tabBarIcon: ({ color }) => (
84:             <IconSymbol size={28} name="person.2.fill" color={color} />
85:           ),
86:         }}
87:       />
88:       <Tabs.Screen
89:         name="perfil"
90:         options={{
91:           title: 'Perfil',
92:           tabBarIcon: ({ color }) => (
93:             <IconSymbol size={28} name="person.fill" color={color} />
94:           ),
95:         }}
96:       />
97:     </Tabs>
98:     </>
99:   );
100: }

(End of file - total 100 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\Lucia\\SupplyCycle\\mobile\\components\\ui\\icon-symbol.tsx"
}
```

**Output:**
```
<path>C:\Users\Lucia\SupplyCycle\mobile\components\ui\icon-symbol.tsx</path>
<type>file</type>
<content>
1: import MaterialIcons from '@expo/vector-icons/MaterialIcons';
2: import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
3: import { ComponentProps } from 'react';
4: import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';
5: 
6: type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
7: type IconSymbolName = keyof typeof MAPPING;
8: 
9: const MAPPING = {
10:   'house.fill': 'home',
11:   'paperplane.fill': 'send',
12:   'chevron.left.forwardslash.chevron.right': 'code',
13:   'chevron.right': 'chevron-right',
14:   'shippingbox.fill': 'local-shipping',
15:   'clipboard.fill': 'list-alt',
16:   'map.fill': 'map',
17:   'person.fill': 'person',
18:   'person.2.fill': 'people',
19:   'phone.fill': 'phone',
20:   'location.fill': 'location-on',
21:   'xmark': 'close',
22:   'checkmark': 'check',
23:   'arrow.clockwise': 'refresh',
24:   'magnifyingglass': 'search',
25:   'plus': 'add',
26:   'trash': 'delete',
27:   'ellipsis': 'more-horiz',
28: } as IconMapping;
29: 
30: export function IconSymbol({
31:   name,
32:   size = 24,
33:   color,
34:   style,
35: }: {
36:   name: IconSymbolName;
37:   size?: number;
38:   color: string | OpaqueColorValue;
39:   style?: StyleProp<TextStyle>;
40:   weight?: SymbolWeight;
41: }) {
42:   return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
43: }

(End of file - total 43 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 70.2s)

_Thinking:_

Now I understand the issue clearly.

The `clientes` tab in `mobile/app/(tabs)/_layout.tsx` line 47 uses:
```
name="person.crop.rectangle.stack.fill"
```

But looking at the `MAPPING` in `icon-symbol.tsx`, **there is NO entry for `person.crop.rectangle.stack.fill`!**

This means the `IconSymbol` component will receive `MAPPING['person.crop.rectangle.stack.fill']` which is `undefined`, and MaterialIcons will fail to render it. So the icon is likely showing nothing or broken.

The user is asking to "add the icon for clientes" - they want a proper icon in the bottom bar. The existing icon `person.crop.rectangle.stack.fill` is not mapped.

I need to figure out:
1. What SF Symbol name they want (the icon they chose in the tab layout) 
2. What MaterialIcons name to map it to

Since the user said "agregale como al de repartos un caminio, el de pedidos una lista" - "add it like repartos has a truck, pedidos has a list" - they want a representative icon. The current one `person.crop.rectangle.stack.fill` is a person with a rectangle stack which could represent clients/contacts.

But the user might be asking for a different icon. Let me ask for clarification.

Wait, actually let me re-read the user's message again:

"agregame el icono para la barra inferior de clientes o sea agregale como al de repartos un caminio, el de pedidos una lista"

Translation: "Add me the icon for the bottom bar of clientes, I mean add it like repartos has a truck, pedidos has a list"

So they want:
- The clientes tab to have an icon in the bottom bar
- Just like repartos has a truck icon and pedidos has a list icon

The icon is already defined in the tab layout (`person.crop.rectangle.stack.fill`), but it's not in the MAPPING, so it doesn't render. The fix would be to add `person.crop.rectangle.stack.fill` to the MAPPING with an appropriate MaterialIcons name.

But maybe the user wants a DIFFERENT icon entirely? Let me ask what icon they'd like for clientes.

Actually, looking more carefully, I think the user might just be asking me to add the missing mapping. The icon `person.crop.rectangle.stack.fill` is already being referenced but not mapped. Let me ask what icon they want.

But wait - maybe the user just wants the icon to work. Let me ask them what they'd like to use as the icon for clientes.

Let me think about good MaterialIcons options for "clientes":
- `people` (already used for `usuarios`)
- `person` (already used for `perfil`)
- `contacts` - a contacts/address book icon
- `supervisor-account` - supervisor/people icon
- `groups` - groups icon (MaterialIcons has this)
- `group` / `group-add`
- `perm-contact-cal` - contact calendar
- `badge` - ID badge

`supervisor-account` or `contacts` or `group` would be good options.

Actually let me ask the user what they want.

¡Hola! Ya revisé el código actual y encontré el problema.

## Diagnóstico

En `mobile/app/(tabs)/_layout.tsx` (línea 47), el tab **Clientes** ya tiene definido este icono:

```tsx
<IconSymbol size={28} name="person.crop.rectangle.stack.fill" color={color} />
```

El problema es que **`person.crop.rectangle.stack.fill` NO está en el mapping** de `mobile/components/ui/icon-symbol.tsx`. El componente `IconSymbol` busca ese nombre en su `MAPPING`, no lo encuentra, y le pasa `undefined` a `MaterialIcons`, por lo que **el icono no se renderiza** (se ve vacío).

Solo hay que agregar la entrada en el mapping y listo.

---

Pero antes, ¿qué icono te gustaría para **Clientes**? Actualmente el código usa `person.crop.rectangle.stack.fill` (una persona con una pila de rectángulos — como una ficha de contacto). Te propongo algunas opciones de MaterialIcons que podrían funcionar:

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "question": "¿Qué icono querés para el tab de Clientes en la barra inferior?",
      "header": "Icono para Clientes",
      "options": [
        {
          "label": "contacts (libreta)",
          "description": "Icono de libreta/contactos → MaterialIcons 'contacts'"
        },
        {
          "label": "badge (credencial)",
          "description": "Icono de credencial/chapita → MaterialIcons 'badge'"
        },
        {
          "label": "supervisor-account",
          "description": "Icono de persona con estrella → MaterialIcons 'supervisor-account'"
        },
        {
          "label": "group (grupo)",
          "description": "Icono de grupo de personas → MaterialIcons 'group'"
        },
        {
          "label": "person.crop.rectangle.stack.fill",
          "description": "Dejar el SF Symbol actual 'person.crop.rectangle.stack.fill' y mapearlo al MaterialIcon que recomiendes"
        }
      ]
    }
  ]
}
```

**Output:**
```
User has answered your questions: "¿Qué icono querés para el tab de Clientes en la barra inferior?"="contacts (libreta)". You can now continue with the user's answers in mind.
```

---

## Assistant (Plan · Big Pickle · 8.8s)

_Thinking:_

The user chose "contacts (libreta)" — MaterialIcons `contacts`.

So the plan is:

1. In `mobile/components/ui/icon-symbol.tsx`:
   - Change the mapping key from `person.crop.rectangle.stack.fill` to use a different SF Symbol name OR keep the same name but map it to `contacts`.
   
   Actually, I need to think about this. The current code uses `person.crop.rectangle.stack.fill` as the SF Symbol name. If I want to use the MaterialIcon `contacts`, I have two options:

   **Option A**: Keep the SF Symbol name `person.crop.rectangle.stack.fill` in the tab layout, but map it to `contacts` in the MAPPING.
   
   **Option B**: Change the SF Symbol name in the tab layout to something more representative (like `person.text.rectangle.fill` or `rectangle.stack.person.crop.fill`) and map it to `contacts`.
   
   **Option C**: Just change the tab layout to directly use whatever name and map whatever to `contacts`.

The simplest approach: Add the mapping for `person.crop.rectangle.stack.fill` → `contacts` in the MAPPING.

Wait, but actually `contacts` in MaterialIcons - does it exist? Let me think... MaterialIcons has:
- `contacts` - yes, it's an icon of a contact book/address book
- `perm-contact-cal` - contact calendar
- `contact-mail` - contact mail
- `contact-phone` - contact phone

`contacts` should work and is appropriate for "Clientes".

So the plan is straightforward:

1. **`mobile/components/ui/icon-symbol.tsx`**: Add `'person.crop.rectangle.stack.fill': 'contacts'` to the MAPPING object.

That's literally one line change. The tab layout already references `person.crop.rectangle.stack.fill` so no changes needed there.

But wait - I'm in PLAN mode. I should present the plan and not make any edits.

Let me also consider if the SF Symbol name should perhaps be changed to make it more intuitive. But since the user just asked for adding the icon and chose "contacts", the simplest fix is to just add the mapping. The SF Symbol name in the tab layout can stay as-is.

Let me present a clean plan.

Perfecto, elegiste **contacts** (libreta de contactos). La solución es muy simple.

## Plan de implementación

Solo hay que **agregar una línea** en el mapping de `mobile/components/ui/icon-symbol.tsx`:

### Cambio único

**Archivo:** `mobile/components/ui/icon-symbol.tsx`

Insertar esta entrada en el objeto `MAPPING` (después de `person.2.fill` por orden alfabético, línea 19):

```tsx
'person.crop.rectangle.stack.fill': 'contacts',
```

El archivo ya referencia este SF Symbol en `mobile/app/(tabs)/_layout.tsx` (línea 47), así que una vez mapeado, el icono se renderizará correctamente con el ícono de libreta de MaterialIcons.

### Resumen

| Archivo | Cambio |
|---------|--------|
| `mobile/components/ui/icon-symbol.tsx` | `+` `'person.crop.rectangle.stack.fill': 'contacts'` |

**No se toca** el layout de tabs ni ningún otro archivo. El icono ya está referenciado, solo faltaba el mapping.

¿Te parece bien? Cuando me confirmes procedo con el cambio.

---

## User

implementalo

---

## Assistant (Mobile · Big Pickle · 4.5s)

_Thinking:_

The user confirmed, so I'll implement the change. I need to add the mapping entry for `person.crop.rectangle.stack.fill` to `contacts` in the `MAPPING` object in `mobile/components/ui/icon-symbol.tsx`.

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\Lucia\\SupplyCycle\\mobile\\components\\ui\\icon-symbol.tsx",
  "oldString": "  'person.2.fill': 'people',",
  "newString": "  'person.2.fill': 'people',\n  'person.crop.rectangle.stack.fill': 'contacts',"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Mobile · Big Pickle · 2.8s)

_Thinking:_

The edit was applied successfully. Let me verify the final state of the file to make sure it looks correct.

Listo. Verifico que quede bien:

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\Lucia\\SupplyCycle\\mobile\\components\\ui\\icon-symbol.tsx"
}
```

**Output:**
```
<path>C:\Users\Lucia\SupplyCycle\mobile\components\ui\icon-symbol.tsx</path>
<type>file</type>
<content>
1: import MaterialIcons from '@expo/vector-icons/MaterialIcons';
2: import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
3: import { ComponentProps } from 'react';
4: import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';
5: 
6: type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
7: type IconSymbolName = keyof typeof MAPPING;
8: 
9: const MAPPING = {
10:   'house.fill': 'home',
11:   'paperplane.fill': 'send',
12:   'chevron.left.forwardslash.chevron.right': 'code',
13:   'chevron.right': 'chevron-right',
14:   'shippingbox.fill': 'local-shipping',
15:   'clipboard.fill': 'list-alt',
16:   'map.fill': 'map',
17:   'person.fill': 'person',
18:   'person.2.fill': 'people',
19:   'person.crop.rectangle.stack.fill': 'contacts',
20:   'phone.fill': 'phone',
21:   'location.fill': 'location-on',
22:   'xmark': 'close',
23:   'checkmark': 'check',
24:   'arrow.clockwise': 'refresh',
25:   'magnifyingglass': 'search',
26:   'plus': 'add',
27:   'trash': 'delete',
28:   'ellipsis': 'more-horiz',
29: } as IconMapping;
30: 
31: export function IconSymbol({
32:   name,
33:   size = 24,
34:   color,
35:   style,
36: }: {
37:   name: IconSymbolName;
38:   size?: number;
39:   color: string | OpaqueColorValue;
40:   style?: StyleProp<TextStyle>;
41:   weight?: SymbolWeight;
42: }) {
43:   return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
44: }

(End of file - total 44 lines)
</content>
```

---

## Assistant (Mobile · Big Pickle · 4.4s)

_Thinking:_

Everything looks good. The mapping is now in place. The `clientes` tab in `app/(tabs)/_layout.tsx` already uses `person.crop.rectangle.stack.fill` as the icon name, and now it will correctly map to the MaterialIcons `contacts` icon.

✅ **Implementado.** El cambio se aplicó en `mobile/components/ui/icon-symbol.tsx` (línea 19):

```tsx
'person.crop.rectangle.stack.fill': 'contacts',
```

Ahora el tab **Clientes** en la barra inferior va a mostrar el ícono de libreta de contactos (`contacts` de MaterialIcons), de la misma forma que **Repartos** muestra el camioncito (`local-shipping`) y **Pedidos** muestra la lista (`list-alt`). No se necesitaron más cambios porque el tab layout ya referenciaba ese SF Symbol.

---

