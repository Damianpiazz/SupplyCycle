import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOTIVOS_CANCELACION } from '@/constants/motivosCancelacion';
import type { MotivoCancelacion } from '@/types';

interface CancelModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmar: (motivo: MotivoCancelacion) => void;
}

export default function CancelModal({ visible, onClose, onConfirmar }: CancelModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Seleccionar motivo</Text>
          <Text style={[styles.modalSubtitle, { color: theme.muted }]}>
            ¿Por qué no se pudo realizar la entrega?
          </Text>

          {MOTIVOS_CANCELACION.map((motivo) => (
            <TouchableOpacity
              key={motivo.value}
              style={[styles.motivoOption, { borderColor: theme.border }]}
              onPress={() => onConfirmar(motivo.value)}
            >
              <Text style={[styles.motivoOptionText, { color: theme.text }]}>
                {motivo.label}
              </Text>
            </TouchableOpacity>
          ))}

          <Button title="Volver" variant="ghost" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xl,
  },
  motivoOption: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  motivoOptionText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
});
