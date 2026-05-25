import { useToastStore, type ToastType } from '@/stores/toastStore';

export function useToast() {
  const show = useToastStore((state) => state.show);

  return {
    showToast: (message: string, type: ToastType = 'info', duration?: number) => {
      show(message, type, duration);
    },
  };
}
