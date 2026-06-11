import { useEffect, useRef, useCallback } from 'react';
import { queryClient } from '@/lib/queryClient';
import { useOfflineStore } from '@/stores/offlineStore';
import {
  confirmarEntregaRequest,
  cancelarPedidoRequest,
  agregarItemRequest,
  quitarItemRequest,
  actualizarCantidadItemRequest,
} from '@/features/pedidos/services/pedidoService';
import type { MotivoCancelacion } from '@/types';

const RETRY_INTERVAL = 30000; // 30 segundos
const MAX_RETRIES = 3;

export default function useOfflineSync() {
  const processingRef = useRef(false);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    const { queue, removeFromQueue, incrementRetry, setSyncing } = useOfflineStore.getState();
    if (queue.length === 0) {
      processingRef.current = false;
      return;
    }

    setSyncing(true);

    for (const mutation of queue) {
      if (mutation.retryCount >= MAX_RETRIES) {
        removeFromQueue(mutation.id);
        continue;
      }

      try {
        switch (mutation.type) {
          case 'CONFIRMAR_ENTREGA':
            await confirmarEntregaRequest(mutation.payload.pedidoId as string);
            break;
          case 'CANCELAR_PEDIDO':
            await cancelarPedidoRequest(
              mutation.payload.pedidoId as string,
              mutation.payload.motivo as MotivoCancelacion,
            );
            break;
          case 'AGREGAR_ITEM':
            await agregarItemRequest(mutation.payload.pedidoId as string, {
              itemId: mutation.payload.itemId as string,
              cantidad: mutation.payload.cantidad as number,
            });
            break;
          case 'QUITAR_ITEM':
            await quitarItemRequest(
              mutation.payload.pedidoId as string,
              mutation.payload.itemId as string,
            );
            break;
          case 'ACTUALIZAR_CANTIDAD_ITEM':
            await actualizarCantidadItemRequest(
              mutation.payload.pedidoId as string,
              mutation.payload.itemId as string,
              mutation.payload.cantidad as number,
            );
            break;
        }
        removeFromQueue(mutation.id);
        // Refrescar datos después de sincronizar
        queryClient.invalidateQueries({ queryKey: ['pedidos'] });
        queryClient.invalidateQueries({ queryKey: ['reparto'] });
      } catch {
        incrementRetry(mutation.id);
        if (mutation.retryCount + 1 >= MAX_RETRIES) {
          removeFromQueue(mutation.id);
        }
      }
    }

    setSyncing(false);
    processingRef.current = false;
  }, []);

  useEffect(() => {
    const queueLength = useOfflineStore.getState().queue.length;
    if (queueLength === 0) return;

    // Primera ejecución inmediata
    processQueue();

    // Reintentar periódicamente mientras haya cola
    const interval = setInterval(() => {
      // Verificar si todavía hay cola antes de procesar
      if (useOfflineStore.getState().queue.length === 0) {
        clearInterval(interval);
        return;
      }
      processQueue();
    }, RETRY_INTERVAL);

    return () => clearInterval(interval);
  }, [processQueue]);
}
