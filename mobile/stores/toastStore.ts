import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
  show: (message: string, type?: ToastType, duration?: number) => void;
  hide: () => void;
}

let hideTimeout: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  duration: 3000,

  show: (message: string, type: ToastType = 'info', duration: number = 3000) => {
    if (hideTimeout) clearTimeout(hideTimeout);

    set({ visible: true, message, type, duration });

    hideTimeout = setTimeout(() => {
      set({ visible: false });
      hideTimeout = null;
    }, duration);
  },

  hide: () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = null;
    set({ visible: false });
  },
}));
