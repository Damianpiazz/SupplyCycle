import { Alert, Platform } from 'react-native';

interface ConfirmActionOptions {
  cancelLabel?: string;
  destructive?: boolean;
}

/** Confirmación multiplataforma (Alert en native, window.confirm en web). */
export function confirmAction(
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => void | Promise<void>,
  options?: ConfirmActionOptions
): void {
  if (Platform.OS === 'web') {
    const ok = window.confirm(`${title}\n\n${message}`);
    if (ok) {
      void onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: options?.cancelLabel ?? 'Cancelar', style: 'cancel' },
    {
      text: confirmLabel,
      style: options?.destructive ? 'destructive' : 'default',
      onPress: () => {
        void onConfirm();
      },
    },
  ]);
}
