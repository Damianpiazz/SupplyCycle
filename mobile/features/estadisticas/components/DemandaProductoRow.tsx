import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { DemandaProducto } from '@/types';

interface DemandaProductoRowProps {
  producto: DemandaProducto;
  index: number;
}

export default function DemandaProductoRow({ producto, index }: DemandaProductoRowProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.borderSubtle }]}>
      <View style={styles.posicion}>
        <Text style={[styles.posicionTexto, { color: theme.muted }]}>#{index + 1}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.nombre, { color: theme.text }]} numberOfLines={1}>
          {producto.nombre}
        </Text>
        <Text style={[styles.detalle, { color: theme.muted }]}>
          {producto.clientesEstimados} cliente{producto.clientesEstimados !== 1 ? 's' : ''} · {producto.unidad}
        </Text>
      </View>
      <View style={styles.cantidad}>
        <Text style={[styles.numero, { color: theme.tint }]}>
          {producto.cantidadEstimada.toLocaleString('es-AR')}
        </Text>
        <Text style={[styles.unidad, { color: theme.muted }]}>{producto.unidad}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
    borderWidth: 1,
  },
  posicion: {
    width: 28,
    alignItems: 'center',
  },
  posicionTexto: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  nombre: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
  },
  detalle: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.inter,
    marginTop: 2,
  },
  cantidad: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  numero: {
    fontSize: FontSizes.lg,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
  },
  unidad: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.inter,
    marginTop: 1,
  },
});
