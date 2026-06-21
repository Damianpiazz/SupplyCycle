import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Button, Header, LoadingSpinner, ErrorMessage, Card } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCliente } from '@/features/clientes/hooks/useClientes';
import DemoraBadge from '@/features/clientes/components/DemoraBadge';

export default function ClienteVerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const { data: cliente, isLoading, isError, error } = useCliente(id ?? '');

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Cliente" onBack={() => router.back()} />
        <LoadingSpinner message="Cargando datos del cliente..." />
      </ThemedView>
    );
  }

  if (isError || !cliente) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Cliente" onBack={() => router.back()} />
        <ErrorMessage message={error?.message || 'Error al cargar el cliente'} onRetry={() => {}} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="Cliente" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Datos personales */}
        <Card>
          <Text style={[styles.nombre, { color: theme.text }]}>
            {cliente.nombre} {cliente.apellido}
          </Text>

          {cliente.activo === false && (
            <Text style={[styles.inactivo, { color: theme.error }]}>
              Cliente inactivo
            </Text>
          )}

          <View style={styles.fieldRow}>
            <Text style={[styles.label, { color: theme.muted }]}>Teléfono</Text>
            <Text style={[styles.value, { color: theme.text }]}>{cliente.telefono}</Text>
          </View>

          {cliente.observaciones ? (
            <View style={styles.fieldRow}>
              <Text style={[styles.label, { color: theme.muted }]}>Observaciones</Text>
              <Text style={[styles.value, { color: theme.text }]}>{cliente.observaciones}</Text>
            </View>
          ) : null}

          {/* RF-06: Datos de demora */}
          {cliente.tieneDemora !== undefined && (
            <View style={styles.demoraSection}>
              <DemoraBadge
                cantidadEnvasesPendientes={cliente.cantidadEnvasesPendientes ?? 0}
                fechaUltimaEntrega={cliente.fechaUltimaEntrega}
              />
              {cliente.fechaUltimaEntrega && (
                <Text style={[styles.ultimaEntrega, { color: theme.muted }]}>
                  Última entrega:{' '}
                  {new Date(cliente.fechaUltimaEntrega).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              )}
              {!cliente.tieneDemora && (
                <Text style={[styles.alDia, { color: theme.success }]}>Envases al día</Text>
              )}
            </View>
          )}
        </Card>

        {/* Domicilios */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Domicilios</Text>
        {cliente.domicilios.map((dom, idx) => (
          <Card key={dom.id}>
            <Text style={[styles.domTitle, { color: theme.text }]}>
              Domicilio {idx + 1}{dom.principal ? ' (Principal)' : ''}
            </Text>
            <Text style={[styles.domText, { color: theme.text }]}>
              {dom.calle} {dom.numero}, {dom.localidad}
            </Text>
            {dom.dias.map((dia) => (
              <Text key={dia.id} style={[styles.domDia, { color: theme.muted }]}>
                {dia.nombre.charAt(0) + dia.nombre.slice(1).toLowerCase()}:{' '}
                {dia.horarios.map((h) => `${h.inicio} - ${h.fin}`).join(', ')}
              </Text>
            ))}
          </Card>
        ))}

        {/* TODO RF-06.3: Historial de entregas y devoluciones de envases */}
        {/*
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Historial de Envases</Text>
        <Card>
          <Text style={[styles.placeholder, { color: theme.muted }]}>
            Próximamente: historial de entregas y devoluciones de envases.
          </Text>
        </Card>
        */}

        {/* Botón Editar */}
        <Button
          title="Editar cliente"
          onPress={() =>
            router.push({
              pathname: '/clientes/editar/[id]',
              params: { id: cliente.id },
            })
          }
          style={styles.editButton}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },
  nombre: { fontSize: FontSizes.xl, fontWeight: '700', marginBottom: Spacing.xs },
  inactivo: { fontSize: FontSizes.sm, fontWeight: '600', marginBottom: Spacing.sm },
  fieldRow: { marginBottom: Spacing.sm },
  label: { fontSize: FontSizes.xs, fontWeight: '600', marginBottom: 2 },
  value: { fontSize: FontSizes.md },
  demoraSection: { marginTop: Spacing.md, gap: Spacing.xs },
  ultimaEntrega: { fontSize: FontSizes.xs },
  alDia: { fontSize: FontSizes.sm, fontWeight: '600' },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: '700', marginTop: Spacing.xl, marginBottom: Spacing.md },
  domTitle: { fontSize: FontSizes.md, fontWeight: '600', marginBottom: Spacing.xs },
  domText: { fontSize: FontSizes.sm, marginBottom: Spacing.xs },
  domDia: { fontSize: FontSizes.xs, marginBottom: 2 },
  placeholder: { fontSize: FontSizes.sm, fontStyle: 'italic' },
  editButton: { marginTop: Spacing.xl },
});
