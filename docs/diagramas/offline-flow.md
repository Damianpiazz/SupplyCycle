# Flujo Offline

```mermaid
flowchart TB
    START[Usuario acciona\nconfirmar / cancelar entrega] --> CHECK{¿Hay conexión?\nuseNetworkStatus}
    CHECK -->|Sí| API[PATCH /pedidos/:id/confirmar\nvia TanStack Query mutation]
    API -->|Éxito| OK[Invalidar queries\nActualizar caché]
    API -->|isNetworkError\nerror de red| QUEUE
    API -->|Error HTTP\n(4xx/5xx)| SHOW_ERROR[Mostrar error\nvia ErrorMessage]

    CHECK -->|No| QUEUE[Encolar en\nofflineStore.queue\ncon persist AsyncStorage]

    QUEUE --> SHOW_BADGE[Mostrar badge\n"Pendiente de sincronizar"\nen el item]
    SHOW_BADGE --> WAIT[Esperar reconexión]

    WAIT -->|NetInfo.addEventListener\nonReconnect| SYNC[useOfflineSync\nejecuta cola FIFO]
    SYNC --> SYNC_ITEM[Tomar primer item\nde la cola]
    SYNC_ITEM --> SYNC_API[Ejecutar mutation\ncontra backend]

    SYNC_API -->|Éxito| SYNC_OK[Remover de cola\nActualizar caché]
    SYNC_API -->|Fallo| RETRY{Reintentos < 3?}

    RETRY -->|Sí| WAIT
    RETRY -->|No| FAIL[Marcar como\n"Fallo permanente"\nNotificar al usuario]
    SYNC_OK --> SYNC_NEXT{¿Más items\nen cola?}
    SYNC_NEXT -->|Sí| SYNC_ITEM
    SYNC_NEXT -->|No| CLEAR_BADGE[Quitar badge\nSincronización completa]
```

## Componentes involucrados

| Componente | Archivo | Responsabilidad |
|---|---|---|
| `useNetworkStatus` | `hooks/useNetworkStatus.ts` | Expone `isConnected`, escucha cambios |
| `offlineStore` | `stores/offlineStore.ts` | Cola de mutations pendientes (Zustand + persist) |
| `useOfflineSync` | `hooks/useOfflineSync.ts` | Ejecuta cola FIFO al reconectar |
| `ConnectivityBanner` | `components/ui/ConnectivityBanner.tsx` | Banner "Sin conexión" |
| `usePedidos` | `features/pedidos/hooks/usePedidos.ts` | Mutations offline-aware |
| `handleApiError` | `services/handleApiError.ts` | `isNetworkError()` detection |
| `async-storage` | AsyncStorage | Persistencia de la cola offline |

## Estados visuales

| Estado | Indicador |
|---|---|
| Sin conexión | Banner rojo "Sin conexión — los datos pueden no estar actualizados" |
| Pendiente de sincronizar | Badge amarillo en el item |
| Sincronizando | Spinner pequeño + "Sincronizando..." |
| Fallo permanente | Badge rojo "Error al sincronizar" |
| Todo sincronizado | Sin indicadores |
