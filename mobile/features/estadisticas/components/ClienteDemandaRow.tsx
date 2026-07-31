import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { ClienteDemandaResumen } from '@/types';

interface ClienteDemandaRowProps {
  cliente: ClienteDemandaResumen;
}

export default function ClienteDemandaRow({ cliente }: ClienteDemandaRowProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.borderSubtle }]}>
      <View style={styles.header}>
        <Text style={[styles.nombre, { color: theme.text }]} numberOfLines={1}>
          {cliente.nombre} {cliente.apellido}
        </Text>
        <View style={[styles.badge, { backgroundColor: theme.successBg }]}>
          <Text style={[styles.badgeTexto, { color: theme.success }]}>
            {cliente.unidadesEstimadas} u.
          </Text>
        </View>
      </View>
      <View style={styles.detalles}>
        <View style={styles.detalle}>
          <Text style={[styles.etiqueta, { color: theme.muted }]}>Próximo pedido</Text>
          <Text style={[styles.valor, { color: theme.text }]}>
            {cliente.proximoPedidoEstimado}
          </Text>
        </View>
        <View style={styles.detalle}>
          <Text style={[styles.etiqueta, { color: theme.muted }]}>Frecuencia</Text>
          <Text style={[styles.valor, { color: theme.text }]}>
            c/{cliente.frecuenciaPromedioDias} días
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  nombre: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    flex: 1,
    marginRight: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeTexto: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
  },
  detalles: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  detalle: {
    flex: 1,
  },
  etiqueta: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.inter,
    marginBottom: 2,
  },
  valor: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
  },
});
