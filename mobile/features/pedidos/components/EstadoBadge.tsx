import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { EstadoPedido } from '@/types';

function getEstadoColor(estado: EstadoPedido, theme: typeof Colors.light): string {
  switch (estado) {
    case 'PENDIENTE': return theme.pendiente;
    case 'EN_RUTA': return theme.tint;
    case 'ENTREGADO': return theme.entregado;
    case 'NO_ENTREGADO': return theme.noEntregado;
    case 'CANCELADO': return theme.muted;
  }
}

function getEstadoLabel(estado: EstadoPedido): string {
  switch (estado) {
    case 'PENDIENTE': return 'Pendiente';
    case 'EN_RUTA': return 'En ruta';
    case 'ENTREGADO': return 'Entregado';
    case 'NO_ENTREGADO': return 'No entregado';
    case 'CANCELADO': return 'Cancelado';
  }
}

interface EstadoBadgeProps {
  estado: EstadoPedido;
  numeroPedido: string;
}

export default function EstadoBadge({ estado, numeroPedido }: EstadoBadgeProps) {
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
        {numeroPedido}
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
