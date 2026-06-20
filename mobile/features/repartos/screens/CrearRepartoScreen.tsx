import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Button, LoadingSpinner, Header } from '@/components/ui';
import { useToastStore } from '@/stores/toastStore';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRepartidores, usePedidosDisponibles, useCrearReparto } from '@/features/repartos/hooks/useCrearReparto';
import { ddmmyyyyToISO } from '@/utils/date';

export default function CrearRepartoScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [fecha, setFecha] = useState('');
  const [repartidorId, setRepartidorId] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toast = useToastStore();

  const fechaValida = fecha.trim().length === 10 && /^\d{2}\/\d{2}\/\d{4}$/.test(fecha.trim());
  const fechaISO = fechaValida ? ddmmyyyyToISO(fecha.trim()) : null;
  const { data: repartidores, isLoading: loadingRepartidores } = useRepartidores();
  const { data: disponibles, isLoading: loadingPedidos } = usePedidosDisponibles(fechaISO);
  const { mutateAsync: crearReparto, isPending: creando } = useCrearReparto();

  const puedeCrear = fechaValida && repartidorId && selectedIds.size > 0 && !creando;

  function togglePedido(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function handleCrear() {
    if (!puedeCrear || !fechaISO) return;
    try {
      await crearReparto({
        repartidorId,
        fecha: fechaISO,
        pedidoIds: Array.from(selectedIds),
      });
      toast.show('Reparto creado exitosamente', 'success');
      setTimeout(() => router.back(), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear reparto';
      toast.show(msg, 'error');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Header onBack={() => router.back()} />
      <FlatList
        data={disponibles ?? []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Fecha del reparto</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={theme.muted}
              value={fecha}
              onChangeText={setFecha}
              maxLength={10}
              keyboardType="default"
            />

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Repartidor</Text>
            {loadingRepartidores ? (
              <LoadingSpinner message="Cargando repartidores..." />
            ) : (
              <View style={styles.repartidorList}>
                {repartidores?.map((r) => (
                  <TouchableOpacity
                    key={r.id}
                    style={[
                      styles.repartidorItem,
                      {
                        backgroundColor: repartidorId === r.id ? theme.buttonPrimary + '20' : theme.card,
                        borderColor: repartidorId === r.id ? theme.buttonPrimary : theme.border,
                      },
                    ]}
                    onPress={() => setRepartidorId(r.id)}
                  >
                    <Text style={[styles.repartidorName, { color: theme.text }]}>
                      {r.nombre} {r.apellido}
                    </Text>
                    <Text style={[styles.repartidorEmail, { color: theme.muted }]}>{r.email}</Text>
                  </TouchableOpacity>
                ))}
                {repartidores?.length === 0 && (
                  <Text style={[styles.emptyText, { color: theme.muted }]}>No hay repartidores activos</Text>
                )}
              </View>
            )}

            {fechaValida && (
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Pedidos disponibles para {fecha} — {disponibles?.length ?? 0} pendientes
              </Text>
            )}

            {loadingPedidos && fechaValida && <LoadingSpinner message="Buscando pedidos..." />}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.pedidoItem,
              {
                backgroundColor: selectedIds.has(item.id) ? theme.buttonPrimary + '20' : theme.card,
                borderColor: selectedIds.has(item.id) ? theme.buttonPrimary : theme.border,
              },
            ]}
            onPress={() => togglePedido(item.id)}
          >
            <View style={styles.pedidoInfo}>
              <Text style={[styles.pedidoOrden, { color: theme.text }]}>
                {item.numeroPedido} — {item.cliente.nombre} {item.cliente.apellido}
              </Text>
              <Text style={[styles.pedidoCliente, { color: theme.muted }]}>
                {item.domicilio.calle} {item.domicilio.numero}, {item.domicilio.localidad}
              </Text>
              <Text style={[styles.pedidoItems, { color: theme.muted }]}>
                {item.itemsCount} ítem{item.itemsCount !== 1 ? 's' : ''} — ${item.total?.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.checkbox, { borderColor: selectedIds.has(item.id) ? theme.buttonPrimary : theme.border, backgroundColor: selectedIds.has(item.id) ? theme.buttonPrimary : 'transparent' }]}>
              {selectedIds.has(item.id) && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <Button
              title={creando ? 'Creando...' : `Crear reparto (${selectedIds.size} pedidos)`}
              onPress={handleCrear}
              disabled={!puedeCrear}
            />
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  sectionTitle: { fontSize: FontSizes.md, fontWeight: '700', marginTop: Spacing.lg, marginBottom: Spacing.sm },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
  },
  repartidorList: { gap: Spacing.sm },
  repartidorItem: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  repartidorName: { fontSize: FontSizes.md, fontWeight: '600' },
  repartidorEmail: { fontSize: FontSizes.sm, marginTop: 2 },
  pedidoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  pedidoInfo: { flex: 1 },
  pedidoOrden: { fontSize: FontSizes.sm, fontWeight: '600' },
  pedidoCliente: { fontSize: FontSizes.xs, marginTop: 2 },
  pedidoItems: { fontSize: FontSizes.xs, marginTop: 2 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  checkmark: { color: '#fff', fontWeight: '700', fontSize: FontSizes.sm },
  emptyText: { fontSize: FontSizes.sm, textAlign: 'center', paddingVertical: Spacing.lg },
  footer: { marginTop: Spacing.xl },
});
