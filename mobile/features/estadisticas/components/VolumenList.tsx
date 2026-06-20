import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface VolumenItem {
  itemId: string;
  nombre: string;
  unidad: string;
  cantidadTotal: number;
}

interface VolumenListProps {
  items: VolumenItem[];
  loading?: boolean;
}

export default function VolumenList({ items, loading = false }: VolumenListProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.icon}>📦</Text>
        <Text style={[styles.title, { color: theme.text }]}>
          Volumen de productos
        </Text>
      </View>

      {loading ? (
        <Text style={[styles.emptyText, { color: theme.muted }]}>
          Cargando...
        </Text>
      ) : items.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.muted }]}>
          Sin productos distribuidos
        </Text>
      ) : (
        <>
          {/* Table header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.colProducto, styles.headerText, { color: theme.muted }]}>
              Producto
            </Text>
            <Text style={[styles.colCantidad, styles.headerText, { color: theme.muted }]}>
              Cantidad
            </Text>
          </View>

          {/* Table rows */}
          {items.map((item, index) => (
            <View
              key={item.itemId}
              style={[
                styles.tableRow,
                index < items.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.borderSubtle,
                },
              ]}
            >
              <Text
                style={[styles.colProducto, styles.cellText, { color: theme.text }]}
                numberOfLines={1}
              >
                {item.nombre}
              </Text>
              <Text
                style={[styles.colCantidad, styles.cellText, { color: theme.tint, fontFamily: FontFamily.interSemiBold }]}
              >
                {item.cantidadTotal} {item.unidad}
              </Text>
            </View>
          ))}
        </>
      )}
    </Card>
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
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  tableHeader: {
    borderBottomWidth: 1,
    borderBottomColor: undefined, // set dynamically
    paddingBottom: Spacing.xs,
  },
  headerText: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  colProducto: {
    flex: 2,
  },
  colCantidad: {
    flex: 1,
    textAlign: 'right',
  },
  cellText: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.inter,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.inter,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
});
