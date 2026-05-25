import { create } from 'zustand';

export interface ApiCallRecord {
  method: string;
  url: string;
  status: number;
  statusText: string;
  timestamp: number;
  success: boolean;
}

interface ApiStatusState {
  /** Última respuesta registrada (útil para mostrar en UI) */
  lastCall: ApiCallRecord | null;
  /** Historial de las últimas N llamadas */
  history: ApiCallRecord[];
  /** Registrar una nueva respuesta */
  recordCall: (call: ApiCallRecord) => void;
  /** Limpiar el historial */
  clearHistory: () => void;
}

const MAX_HISTORY = 20;

export const useApiStatusStore = create<ApiStatusState>((set) => ({
  lastCall: null,
  history: [],
  recordCall: (call) =>
    set((state) => ({
      lastCall: call,
      history: [call, ...state.history].slice(0, MAX_HISTORY),
    })),
  clearHistory: () => set({ lastCall: null, history: [] }),
}));
