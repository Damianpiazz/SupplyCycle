import { create } from 'zustand';

export interface OfflineMutation {
  id: string;
  type: 'CONFIRMAR_ENTREGA' | 'CANCELAR_PEDIDO';
  payload: Record<string, unknown>;
  createdAt: string;
  retryCount: number;
}

interface OfflineState {
  queue: OfflineMutation[];
  isSyncing: boolean;
  addToQueue: (mutation: Omit<OfflineMutation, 'id' | 'createdAt' | 'retryCount'>) => void;
  removeFromQueue: (id: string) => void;
  incrementRetry: (id: string) => void;
  setSyncing: (syncing: boolean) => void;
  clearQueue: () => void;
}

export const useOfflineStore = create<OfflineState>((set) => ({
  queue: [],
  isSyncing: false,
  addToQueue: (mutation) =>
    set((state) => ({
      queue: [
        ...state.queue,
        {
          ...mutation,
          id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          createdAt: new Date().toISOString(),
          retryCount: 0,
        },
      ],
    })),
  removeFromQueue: (id) =>
    set((state) => ({
      queue: state.queue.filter((m) => m.id !== id),
    })),
  incrementRetry: (id) =>
    set((state) => ({
      queue: state.queue.map((m) =>
        m.id === id ? { ...m, retryCount: m.retryCount + 1 } : m
      ),
    })),
  setSyncing: (isSyncing) => set({ isSyncing }),
  clearQueue: () => set({ queue: [] }),
}));
