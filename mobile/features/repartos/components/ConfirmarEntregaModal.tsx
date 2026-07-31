import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Spacing, FontSizes, FontFamily } from '@/constants/theme';
import Button from '@/components/ui/button';
import type { Pedido } from '@/types';

interface QuantityStepperProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
}

function QuantityStepper({ label, value, onChange, max }: QuantityStepperProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={stepperStyles.container}>
      <Text style={[stepperStyles.label, { color: theme.text }]}>{label}</Text>
      <View style={stepperStyles.controls}>
        <TouchableOpacity
          style={[stepperStyles.btn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
          activeOpacity={0.6}
        >
          <Text style={[stepperStyles.btnText, { color: value <= 0 ? theme.muted : theme.text }]}>−</Text>
        </TouchableOpacity>
        <Text style={[stepperStyles.value, { color: theme.text }]}>{value}</Text>
        <TouchableOpacity
          style={[stepperStyles.btn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          activeOpacity={0.6}
        >
          <Text style={[stepperStyles.btnText, { color: value >= max ? theme.muted : theme.text }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const stepperStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  value: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface ConfirmarEntregaModalProps {
  visible: boolean;
  pedido: Pedido;
  onConfirm: (devoluciones: Array<{ itemId: string; cantidad: number }>) => void;
  onSkip: () => void;
  onCancel: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConfirmarEntregaModal({
  visible,
  pedido,
  onConfirm,
  onSkip,
  onCancel,
}: ConfirmarEntregaModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  // Solo items retornables
  const retornables = pedido.items.filter((i) => i.item.retornable);

  // Inicializar steppers en 0
  const [devoluciones, setDevoluciones] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const r of retornables) {
      init[r.item.id] = 0;
    }
    return init;
  });

  // Reiniciar estado cada vez que se abre el modal
  const handleOnShow = () => {
    const init: Record<string, number> = {};
    for (const r of retornables) {
      init[r.item.id] = 0;
    }
    setDevoluciones(init);
  };

  const handleChange = (itemId: string, value: number) => {
    setDevoluciones((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleConfirm = () => {
    const devs = Object.entries(devoluciones)
      .filter(([, cant]) => cant > 0)
      .map(([itemId, cantidad]) => ({ itemId, cantidad }));
    onConfirm(devs);
  };

  if (retornables.length === 0) {
    // No hay items retornables, skip automático
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      onShow={handleOnShow}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.content, { backgroundColor: theme.background }]}>
          {/* Título */}
          <Text style={[styles.title, { color: theme.text }]}>
            Confirmar entrega
          </Text>

          {/* Items entregados (read-only) */}
          <Text style={[styles.sectionLabel, { color: theme.muted }]}>
            Se entregan
          </Text>
          {pedido.items.map((pi) => (
            <Text key={pi.id} style={[styles.itemLine, { color: theme.text }]}>
              • {pi.cantidad}× {pi.item.nombre}
            </Text>
          ))}

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Steppers para devolución */}
          <Text style={[styles.sectionLabel, { color: theme.muted }]}>
            ¿Devuelve envases vacíos?
          </Text>
          {retornables.map((pi) => (
            <QuantityStepper
              key={pi.item.id}
              label={pi.item.nombre}
              value={devoluciones[pi.item.id] ?? 0}
              onChange={(v) => handleChange(pi.item.id, v)}
              max={pi.cantidad} // límite = lo que se entrega en este pedido
            />
          ))}

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Acciones */}
          <View style={styles.actions}>
            <Button
              title="Saltar — No devuelve nada"
              variant="ghost"
              onPress={onSkip}
              style={styles.actionButton}
            />
            <Button
              title="Confirmar entrega"
              variant="primary"
              onPress={handleConfirm}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    fontFamily: FontFamily.interBold,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.inter,
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  itemLine: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.inter,
    marginBottom: 4,
    paddingLeft: Spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  actions: {
    gap: Spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
});
