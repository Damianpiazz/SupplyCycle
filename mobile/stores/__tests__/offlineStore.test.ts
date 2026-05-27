import { describe, it, expect, beforeEach } from 'vitest';
import { useOfflineStore } from '../offlineStore';

describe('offlineStore', () => {
  beforeEach(() => {
    useOfflineStore.setState({ queue: [], isSyncing: false });
  });

  it('addToQueue agrega una mutación a la cola con valores por defecto', () => {
    useOfflineStore.getState().addToQueue({
      type: 'CONFIRMAR_ENTREGA',
      payload: { pedidoId: 'p1' },
    });
    const { queue } = useOfflineStore.getState();
    expect(queue).toHaveLength(1);
    expect(queue[0].type).toBe('CONFIRMAR_ENTREGA');
    expect(queue[0].retryCount).toBe(0);
    expect(queue[0].payload).toEqual({ pedidoId: 'p1' });
  });

  it('removeFromQueue elimina la mutación por id', () => {
    useOfflineStore.getState().addToQueue({
      type: 'CANCELAR_PEDIDO',
      payload: { pedidoId: 'p1', motivo: 'CLIENTE_AUSENTE' },
    });
    const id = useOfflineStore.getState().queue[0].id;
    useOfflineStore.getState().removeFromQueue(id);
    expect(useOfflineStore.getState().queue).toHaveLength(0);
  });

  it('incrementRetry aumenta el contador de reintentos', () => {
    useOfflineStore.getState().addToQueue({
      type: 'CONFIRMAR_ENTREGA',
      payload: { pedidoId: 'p1' },
    });
    const id = useOfflineStore.getState().queue[0].id;
    useOfflineStore.getState().incrementRetry(id);
    expect(useOfflineStore.getState().queue[0].retryCount).toBe(1);
  });

  it('clearQueue vacía toda la cola', () => {
    useOfflineStore.getState().addToQueue({
      type: 'CONFIRMAR_ENTREGA',
      payload: { pedidoId: 'p1' },
    });
    useOfflineStore.getState().addToQueue({
      type: 'CANCELAR_PEDIDO',
      payload: { pedidoId: 'p2' },
    });
    expect(useOfflineStore.getState().queue).toHaveLength(2);
    useOfflineStore.getState().clearQueue();
    expect(useOfflineStore.getState().queue).toHaveLength(0);
  });
});
