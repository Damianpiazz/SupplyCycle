import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { PedidoItem } from '@/types/item';

function formatPrecio(valor: number): string {
  return `$${valor.toLocaleString('es-AR')}`;
}

interface ItemsListProps {
  items: PedidoItem[];
  modoEdicion: boolean;
  onCambiarCantidad?: (itemId: string, delta: number) => void;
  onEliminarItem?: (itemId: string) => void;
  onAgregarItem?: () => void;
  mostrarBotonEditar?: boolean;
  onEntrarEdicion?: () => void;
}

export default function ItemsList({
  items,
  modoEdicion,
  onCambiarCantidad,
  onEliminarItem,
  onAgregarItem,
  mostrarBotonEditar,
  onEntrarEdicion,
}: ItemsListProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Card>
      <View style={styles.itemsHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Items del pedido</Text>
        {mostrarBotonEditar && onEntrarEdicion && (
          <TouchableOpacity onPress={onEntrarEdicion}>
            <Text style={[styles.editarBtn, { color: theme.info }]}>Editar items</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.muted }]}>No hay items en el pedido</Text>
      ) : (
        items.map((item, idx) => (
          <View
            key={item.id ?? idx}
            style={[
              styles.itemRow,
              modoEdicion && styles.itemRowEditing,
              { borderBottomColor: theme.border },
              modoEdicion && { backgroundColor: theme.info + '15' },
            ]}
          >
            <View style={styles.itemInfo}>
              <Text style={[styles.itemNombre, { color: theme.text }]}>
                {item.item.nombre}
              </Text>
              {item.precioUnitario != null && (
                <Text style={[styles.itemPrecio, { color: theme.muted }]}>
                  {formatPrecio(item.precioUnitario)} c/u
                </Text>
              )}
            </View>

            {modoEdicion ? (
              <View style={styles.editControls}>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepperBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    onPress={() => onCambiarCantidad?.(item.id, -1)}
                  >
                    <Text style={[styles.stepperBtnText, { color: theme.text }]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.stepperValue, { color: theme.text }]}>{item.cantidad}</Text>
                  <TouchableOpacity
                    style={[styles.stepperBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    onPress={() => onCambiarCantidad?.(item.id, 1)}
                  >
                    <Text style={[styles.stepperBtnText, { color: theme.text }]}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => onEliminarItem?.(item.id)}>
                  <Text style={[styles.deleteBtnText, { color: theme.error }]}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={[styles.itemCantidad, { color: theme.text }]}>
                {item.cantidad} {item.item.unidad}
              </Text>
            )}
          </View>
        ))
      )}

      {modoEdicion && onAgregarItem && (
        <TouchableOpacity style={[styles.agregarBtn, { borderColor: theme.info }]} onPress={onAgregarItem}>
          <Text style={[styles.agregarBtnText, { color: theme.info }]}>+ Agregar item</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  editarBtn: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  itemRowEditing: {
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemNombre: {
    fontSize: FontSizes.md,
  },
  itemPrecio: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  itemCantidad: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  editControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  stepperValue: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  deleteBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  agregarBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  agregarBtnText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
});
