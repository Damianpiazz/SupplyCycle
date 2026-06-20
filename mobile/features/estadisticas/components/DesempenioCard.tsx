import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui';
import { Colors, FontFamily, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface DesempenioCardProps {
  total: number;
  iniciados: number;
  finalizados: number;
  loading?: boolean;
}

export default function DesempenioCard({
  total,
  iniciados,
  finalizados,
  loading = false,
}: DesempenioCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.icon}>🚚</Text>
        <Text style={[styles.title, { color: theme.text }]}>
          Desempeño de repartos
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <MetricItem
          label="Totales"
          value={total}
          color={theme.text}
          loading={loading}
        />
        <MetricItem
          label="Iniciados"
          value={iniciados}
          color={theme.enCurso}
          loading={loading}
        />
        <MetricItem
          label="Finalizados"
          value={finalizados}
          color={theme.completado}
          loading={loading}
        />
      </View>
    </Card>
  );
}

function MetricItem({
  label,
  value,
  color,
  loading,
}: {
  label: string;
  value: number;
  color: string;
  loading: boolean;
}) {
  return (
    <View style={styles.metricItem}>
      <Text style={[styles.metricValue, { color: loading ? undefined : color }]}>
        {loading ? '—' : value}
      </Text>
      <Text style={[styles.metricLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  metricValue: {
    fontSize: FontSizes.xl,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interMedium,
    fontWeight: '500',
    marginTop: 2,
  },
});
