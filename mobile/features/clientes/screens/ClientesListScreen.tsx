import { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Card, Header, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useToast } from '@/hooks/useToast';
import { handleApiError } from '@/services/handleApiError';
import { confirmAction } from '@/utils/confirmAction';
import DemoraBadge from '@/features/clientes/components/DemoraBadge';
import {
  useClientes,
  useEliminarCliente,
} from '@/features/clientes/hooks/useClientes';
import type { Cliente, DiaSemana } from '@/types';

const DIAS: DiaSemana[] = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
];

const DIAS_LABEL: Record<DiaSemana, string> = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
};

export default function ClientesListScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [search, setSearch] = useState('');
  const [filtroDia, setFiltroDia] = useState<DiaSemana | null>(null);
  const [filtroDemora, setFiltroDemora] = useState(false);
  const { showToast } = useToast();

  const { data: clientes, isLoading, isError, error } = useClientes();
  const eliminar = useEliminarCliente();

  const filtered = useMemo(() => {
    const list = clientes ?? [];
    const term = search.trim().toLowerCase();

    return list.filter((c) => {
      // Filtro por demora
      if (filtroDemora && !c.tieneDemora) return false;
      // Filtro por día
      if (filtroDia) {
        const hasDia = c.domicilios.some((d) => d.dias.some((dia) => dia.nombre === filtroDia));
        if (!hasDia) return false;
      }
      if (!term) return true;
      const fullName = `${c.nombre} ${c.apellido}`.toLowerCase();
      return fullName.includes(term) || c.telefono.includes(term);
    });
  }, [clientes, search, filtroDia, filtroDemora]);

  const handleEliminar = (cliente: Cliente) => {
    confirmAction(
      'Eliminar cliente',
      `¿Desactivar a ${cliente.nombre} ${cliente.apellido}? No aparecerá en la lista de clientes activos.`,
      'Eliminar',
      async () => {
        try {
          await eliminar.mutateAsync(cliente.id);
          showToast('Cliente desactivado', 'success');
        } catch (e) {
          const parsed = handleApiError(e);
          showToast(parsed.message, 'error');
        }
      },
      { destructive: true }
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
              flex: 1,
            },
          ]}
          placeholder="Buscar por nombre o teléfono..."
          placeholderTextColor={theme.muted}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.buttonPrimary }]}
          onPress={() => router.push('/clientes/alta')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtrosContainer}>
        <TouchableOpacity
          style={[
            styles.filtroButton,
            {
              backgroundColor:
                filtroDia === null ? theme.buttonPrimary : theme.surface,
            },
          ]}
          onPress={() => setFiltroDia(null)}
        >
          <Text
            style={[
              styles.filtroText,
              { color: filtroDia === null ? '#FFFFFF' : theme.text },
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        {DIAS.map((dia) => (
          <TouchableOpacity
            key={dia}
            style={[
              styles.filtroButton,
              {
                backgroundColor:
                  filtroDia === dia ? theme.buttonPrimary : theme.surface,
              },
            ]}
            onPress={() => setFiltroDia(dia === filtroDia ? null : dia)}
          >
            <Text
              style={[
                styles.filtroText,
                { color: filtroDia === dia ? '#FFFFFF' : theme.text },
              ]}
            >
              {DIAS_LABEL[dia]}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.filtroButton,
            {
              backgroundColor: filtroDemora ? theme.warning : theme.surface,
            },
          ]}
          onPress={() => setFiltroDemora(!filtroDemora)}
        >
          <Text
            style={[
              styles.filtroText,
              { color: filtroDemora ? '#FFFFFF' : theme.text },
            ]}
          >
            Con demora
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingSpinner message="Cargando clientes..." />
      ) : isError ? (
        <ErrorMessage
          message={error?.message || 'Error al cargar clientes'}
          onRetry={() => {}}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/clientes/[id]',
                    params: { id: item.id },
                  })
                }
              >
                <Text style={[styles.cardNombre, { color: theme.text }]}>
                  {item.nombre} {item.apellido}
                </Text>
                <Text style={[styles.cardDireccion, { color: theme.muted }]}>
                  {item.domicilios[0]?.calle} {item.domicilios[0]?.numero},{' '}
                  {item.domicilios[0]?.localidad}
                </Text>
                <View style={styles.cardRow}>
                  <Text style={[styles.cardTel, { color: theme.muted }]}>
                    {item.telefono}
                  </Text>
                  {item.domicilios[0]?.dias[0] && (
                    <View style={[styles.diaBadge, { backgroundColor: theme.tint + '20' }]}>
                      <Text style={[styles.diaText, { color: theme.tint }]}>
                        {DIAS_LABEL[item.domicilios[0].dias[0].nombre]}
                      </Text>
                    </View>
                  )}
                </View>
                {item.tieneDemora && (
                  <DemoraBadge
                    cantidadEnvasesPendientes={item.cantidadEnvasesPendientes ?? 0}
                    fechaUltimaEntrega={item.fechaUltimaEntrega}
                  />
                )}
              </TouchableOpacity>

              <View style={[styles.cardActions, { borderTopColor: theme.border }]}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/clientes/[id]',
                      params: { id: item.id },
                    })
                  }
                  style={styles.actionLink}
                >
                  <Text style={[styles.actionText, { color: theme.tint }]}>
                    Editar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleEliminar(item)}
                  style={styles.actionLink}
                >
                  <Text style={[styles.actionText, { color: theme.error }]}>
                    Eliminar
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                {search || filtroDia
                  ? 'No se encontraron clientes'
                  : 'No hay clientes registrados'}
              </Text>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  filtrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  filtroButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  filtroText: { fontSize: FontSizes.xs, fontWeight: '600' },
  listContent: { padding: Spacing.lg, paddingTop: 0 },
  cardNombre: { fontSize: FontSizes.md, fontWeight: '600', marginBottom: 2 },
  cardDireccion: { fontSize: FontSizes.sm, marginBottom: 4 },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTel: { fontSize: FontSizes.sm },
  diaBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  diaText: { fontSize: FontSizes.xs, fontWeight: '600' },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  actionLink: { paddingVertical: Spacing.xs },
  actionText: { fontSize: FontSizes.sm, fontWeight: '600' },
  emptyContainer: { padding: Spacing.xxl, alignItems: 'center' },
  emptyText: { fontSize: FontSizes.md },
});
