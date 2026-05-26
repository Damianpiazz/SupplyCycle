import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function formatPrecio(valor: number): string {
  return `$${valor.toLocaleString('es-AR')}`;
}

interface TotalCardProps {
  total: number;
}

export default function TotalCard({ total }: TotalCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Card>
      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, { color: theme.text }]}>Total del pedido</Text>
        <Text style={[styles.totalValue, { color: theme.tint }]}>
          {formatPrecio(total)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
  },
});
