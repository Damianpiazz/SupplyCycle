import { useEffect, useRef } from 'react';
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
  const queue = useOfflineStore((s) => s.queue);
  const removeFromQueue = useOfflineStore((s) => s.removeFromQueue);
  const incrementRetry = useOfflineStore((s) => s.incrementRetry);
  const setSyncing = useOfflineStore((s) => s.setSyncing);
  const processingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (queue.length > 0) {
      processQueue();
      // Reintentar periódicamente mientras haya cola
      intervalRef.current = setInterval(processQueue, RETRY_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length]);

  async function processQueue() {
    if (processingRef.current) return;
    processingRef.current = true;
    setSyncing(true);

    const items = [...queue];

    for (const mutation of items) {
      if (mutation.retryCount >= MAX_RETRIES) {
        removeFromQueue(mutation.id);
        continue;
      }

      try {
        if (mutation.type === 'CONFIRMAR_ENTREGA') {
          await confirmarEntregaRequest(mutation.payload.pedidoId as string);
        } else if (mutation.type === 'CANCELAR_PEDIDO') {
          await cancelarPedidoRequest(
            mutation.payload.pedidoId as string,
            mutation.payload.motivo as MotivoCancelacion,
          );
        } else if (mutation.type === 'AGREGAR_ITEM') {
          await agregarItemRequest(
            mutation.payload.pedidoId as string,
            {
              itemId: mutation.payload.itemId as string,
              cantidad: mutation.payload.cantidad as number,
            },
          );
        } else if (mutation.type === 'QUITAR_ITEM') {
          await quitarItemRequest(
            mutation.payload.pedidoId as string,
            mutation.payload.itemId as string,
          );
        } else if (mutation.type === 'ACTUALIZAR_CANTIDAD_ITEM') {
          await actualizarCantidadItemRequest(
            mutation.payload.pedidoId as string,
            mutation.payload.itemId as string,
            mutation.payload.cantidad as number,
          );
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
  }
}
