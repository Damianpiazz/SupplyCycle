import { Modal, StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Spacing, FontSizes } from '@/constants/theme';
import Button from './button';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: 'primary' | 'danger';
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'primary',
}: ConfirmModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View
          style={[
            styles.content,
            { backgroundColor: theme.background },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: theme.muted }]}>
            {message}
          </Text>
          <View style={styles.actions}>
            <Button
              title={cancelText}
              variant="ghost"
              onPress={onCancel}
              disabled={loading}
              style={styles.actionButton}
            />
            <Button
              title={loading ? 'Guardando...' : confirmText}
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onPress={onConfirm}
              loading={loading}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: 380,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
