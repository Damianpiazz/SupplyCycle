import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui';
import { Spacing } from '@/constants/theme';

interface ConfirmarAccionButtonsProps {
  onConfirmar: () => void;
  onCancelar: () => void;
  confirmarLoading: boolean;
  cancelarLoading: boolean;
}

export default function ConfirmarAccionButtons({
  onConfirmar,
  onCancelar,
  confirmarLoading,
  cancelarLoading,
}: ConfirmarAccionButtonsProps) {
  return (
    <View style={styles.container}>
      <Button
        title="Confirmar entrega"
        variant="success"
        onPress={onConfirmar}
        loading={confirmarLoading}
        disabled={confirmarLoading}
      />
      <Button
        title="Cancelar entrega"
        variant="danger"
        onPress={onCancelar}
        loading={cancelarLoading}
        disabled={cancelarLoading}
        style={styles.cancelButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  cancelButton: {
    marginTop: Spacing.md,
  },
});
