import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import type { MotivoFalla } from '@/features/pedido/types/pedido.types';
import { MOTIVOS_FALLA_LABELS } from '@/features/pedido/types/pedido.types';
import type { MotivoFallaModalProps } from '@/features/pedido/types/pedido.types';

const MOTIVOS = Object.keys(MOTIVOS_FALLA_LABELS) as MotivoFalla[];

export function MotivoFallaModal({
  visible,
  pedidoId,
  onConfirmar,
  onClose,
}: MotivoFallaModalProps) {
  const [selectedMotivo, setSelectedMotivo] = useState<MotivoFalla | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const dangerColor = useThemeColor({}, 'danger');
  const tintColor = useThemeColor({}, 'tint');
  const overlayColor = useThemeColor({}, 'overlay');
  const borderColor = useThemeColor({}, 'border');

  const handleConfirmar = useCallback(async () => {
    if (!selectedMotivo) return;
    setIsLoading(true);
    try {
      await onConfirmar(pedidoId, selectedMotivo);
      setSelectedMotivo(null);
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [selectedMotivo, pedidoId, onConfirmar, onClose]);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setSelectedMotivo(null);
    onClose();
  }, [isLoading, onClose]);

  const isConfirmDisabled = !selectedMotivo || isLoading;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor,
              borderColor,
            },
          ]}
        >
          {/* Título */}
          <Text
            style={[styles.title, { color: textColor }]}
            accessibilityRole="header"
          >
            Motivo de la falla
          </Text>
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
            Seleccioná el motivo por el cual no se pudo entregar el pedido
          </Text>

          {/* Opciones */}
          <View style={styles.optionsContainer} accessibilityRole="radiogroup">
            {MOTIVOS.map((motivo) => {
              const isSelected = selectedMotivo === motivo;
              return (
                <Pressable
                  key={motivo}
                  style={[
                    styles.optionRow,
                    {
                      borderColor: isSelected ? tintColor : borderColor,
                      backgroundColor: isSelected
                        ? `${tintColor}15`
                        : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    if (!isLoading) setSelectedMotivo(motivo);
                  }}
                  disabled={isLoading}
                  accessibilityRole="radio"
                  accessibilityState={{
                    selected: isSelected,
                    disabled: isLoading,
                  }}
                  accessibilityLabel={MOTIVOS_FALLA_LABELS[motivo]}
                >
                  {/* Radio circle */}
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: isSelected ? tintColor : borderColor,
                      },
                      isSelected && { borderWidth: 6 },
                    ]}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: isSelected ? tintColor : textColor },
                    ]}
                  >
                    {MOTIVOS_FALLA_LABELS[motivo]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsRow}>
            <Pressable
              style={[
                styles.button,
                styles.buttonSecondary,
                { borderColor },
              ]}
              onPress={handleClose}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <Text style={[styles.buttonText, { color: textColor }]}>
                Volver
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.buttonPrimary,
                {
                  backgroundColor: isConfirmDisabled
                    ? `${dangerColor}50`
                    : dangerColor,
                },
              ]}
              onPress={handleConfirmar}
              disabled={isConfirmDisabled}
              accessibilityRole="button"
              accessibilityState={{ disabled: isConfirmDisabled }}
              accessibilityLabel="Confirmar falla"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    styles.buttonTextPrimary,
                    isConfirmDisabled && { opacity: 0.6 },
                  ]}
                >
                  Confirmar falla
                </Text>
              )}
            </Pressable>
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
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    paddingTop: 20,
    // Sombra en iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    // Sombra en Android
    elevation: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 10,
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonSecondary: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  buttonPrimary: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  buttonTextPrimary: {
    color: '#fff',
  },
});
