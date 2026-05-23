import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import type { PedidoStatusActionsProps } from '@/features/pedido/types/pedido.types';
import { MotivoFallaModal } from '@/features/pedido/components/MotivoFallaModal';

/**
 * Componente de acciones de estado de pedido para el repartidor.
 *
 * - `PENDIENTE` → botón primario "Confirmar entrega" + botón destructivo "Registrar falla"
 * - `ENTREGADO` → badge verde de solo lectura
 * - `NO_ENTREGADO` → badge rojo de solo lectura
 *
 * Mientras una acción está en curso, ambos botones se deshabilitan
 * y muestran un spinner para evitar doble tap.
 */
export function PedidoStatusActions({
  pedidoId,
  estadoActual,
  onConfirmar,
  onCancelar,
}: PedidoStatusActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const successColor = useThemeColor({}, 'success');
  const successLightColor = useThemeColor({}, 'successLight');
  const dangerColor = useThemeColor({}, 'danger');
  const dangerLightColor = useThemeColor({}, 'dangerLight');
  const borderColor = useThemeColor({}, 'border');

  const handleConfirmar = useCallback(async () => {
    setIsLoading(true);
    try {
      await onConfirmar(pedidoId);
    } finally {
      setIsLoading(false);
    }
  }, [pedidoId, onConfirmar]);

  const handleCancelar = useCallback(
    async (id: string, motivo: Parameters<typeof onCancelar>[1]) => {
      setIsLoading(true);
      try {
        await onCancelar(id, motivo);
      } finally {
        setIsLoading(false);
      }
    },
    [onCancelar],
  );

  const handleOpenModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // Caso ENTREGADO — badge de solo lectura
  if (estadoActual === 'ENTREGADO') {
    return (
      <View
        style={[styles.badgeContainer, { backgroundColor: successLightColor, borderColor: successColor }]}
        accessibilityLabel="Pedido entregado"
      >
        <Text style={[styles.badgeIcon, { color: successColor }]}>✓</Text>
        <Text style={[styles.badgeText, { color: successColor }]}>
          Entregado
        </Text>
      </View>
    );
  }

  // Caso NO_ENTREGADO — badge de solo lectura
  if (estadoActual === 'NO_ENTREGADO') {
    return (
      <View
        style={[styles.badgeContainer, { backgroundColor: dangerLightColor, borderColor: dangerColor }]}
        accessibilityLabel="Pedido no entregado"
      >
        <Text style={[styles.badgeIcon, { color: dangerColor }]}>✗</Text>
        <Text style={[styles.badgeText, { color: dangerColor }]}>
          No entregado
        </Text>
      </View>
    );
  }

  // Caso PENDIENTE — botones de acción
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: textSecondaryColor }]}>
        Acciones del pedido
      </Text>

      <View style={styles.actionsRow}>
        {/* Botón: Confirmar entrega */}
        <Pressable
          style={[
            styles.button,
            styles.buttonPrimary,
            {
              backgroundColor: successColor,
              opacity: isLoading ? 0.6 : 1,
            },
          ]}
          onPress={handleConfirmar}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityState={{ disabled: isLoading }}
          accessibilityLabel="Confirmar entrega"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
              ✓ Confirmar entrega
            </Text>
          )}
        </Pressable>

        {/* Botón: Registrar falla */}
        <Pressable
          style={[
            styles.button,
            styles.buttonDestructive,
            {
              borderColor: dangerColor,
              opacity: isLoading ? 0.6 : 1,
            },
          ]}
          onPress={handleOpenModal}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityState={{ disabled: isLoading }}
          accessibilityLabel="Registrar falla"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={dangerColor} />
          ) : (
            <Text style={[styles.buttonText, { color: dangerColor }]}>
              ✗ Registrar falla
            </Text>
          )}
        </Pressable>
      </View>

      {/* Modal de selección de motivo */}
      <MotivoFallaModal
        visible={modalVisible}
        pedidoId={pedidoId}
        onConfirmar={handleCancelar}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  // Botones
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonPrimary: {
    borderWidth: 0,
  },
  buttonDestructive: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  buttonTextPrimary: {
    color: '#fff',
  },

  // Badge (solo lectura)
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  badgeIcon: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
});
