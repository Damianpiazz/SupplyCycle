import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getEstadoColor, getEstadoLabel } from '@/features/pedidos/utils/estadoPedido';
import type { EstadoPedido } from '@/types';

interface EstadoBadgeProps {
  estado: EstadoPedido;
  orden: number;
}

export default function EstadoBadge({ estado, orden }: EstadoBadgeProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const color = getEstadoColor(estado, theme);

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.estadoText, { color }]}>
          {getEstadoLabel(estado)}
        </Text>
      </View>
      <Text style={[styles.ordenText, { color: theme.muted }]}>
        Pedido #{orden}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  badge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  estadoText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  ordenText: {
    fontSize: FontSizes.sm,
  },
});
