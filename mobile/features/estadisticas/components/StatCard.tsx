import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui';
import { Colors, FontFamily, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
  color?: string;
  loading?: boolean;
}

export default function StatCard({
  icon,
  label,
  value,
  color,
  loading = false,
}: StatCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const valueColor = color ?? theme.text;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
          {loading ? (
            <Text style={[styles.value, { color: theme.muted }]}>—</Text>
          ) : (
            <Text style={[styles.value, { color: valueColor }]}>
              {typeof value === 'number' ? value.toLocaleString('es-AR') : value}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.interMedium,
    fontWeight: '500',
    marginBottom: 2,
  },
  value: {
    fontSize: FontSizes.xxl,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
  },
});
