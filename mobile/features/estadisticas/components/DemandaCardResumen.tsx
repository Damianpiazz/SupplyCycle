import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui';
import { Colors, FontFamily, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface DemandaCardResumenProps {
  totalClientes: number;
  clientesConEstimacion: number;
  demandaTotalUnidades: number;
  frecuenciaPromedioGlobal: number;
  fechaDesde: string;
  fechaHasta: string;
}

export default function DemandaCardResumen({
  totalClientes,
  clientesConEstimacion,
  demandaTotalUnidades,
  frecuenciaPromedioGlobal,
  fechaDesde,
  fechaHasta,
}: DemandaCardResumenProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Card style={styles.card}>
      <Text style={[styles.titulo, { color: theme.text }]}>Resumen de demanda</Text>
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={[styles.valor, { color: theme.tint }]}>
            {demandaTotalUnidades.toLocaleString('es-AR')}
          </Text>
          <Text style={[styles.etiqueta, { color: theme.muted }]}>Unidades estimadas</Text>
        </View>
        <View style={styles.item}>
          <Text style={[styles.valor, { color: theme.text }]}>
            {clientesConEstimacion} / {totalClientes}
          </Text>
          <Text style={[styles.etiqueta, { color: theme.muted }]}>Clientes con estimación</Text>
        </View>
        <View style={styles.item}>
          <Text style={[styles.valor, { color: theme.text }]}>
            c/{frecuenciaPromedioGlobal} días
          </Text>
          <Text style={[styles.etiqueta, { color: theme.muted }]}>Frecuencia promedio</Text>
        </View>
      </View>
      <Text style={[styles.periodo, { color: theme.muted }]}>
        {fechaDesde} → {fechaHasta}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  titulo: {
    fontSize: FontSizes.lg,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  grid: {
    gap: Spacing.md,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valor: {
    fontSize: FontSizes.lg,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
  },
  etiqueta: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.interMedium,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
  },
  periodo: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.inter,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
