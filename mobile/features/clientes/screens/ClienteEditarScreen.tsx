import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Button, Header, Input, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useToast } from '@/hooks/useToast';
import { handleApiError } from '@/services/handleApiError';
import { confirmAction } from '@/utils/confirmAction';
import {
  useCliente,
  useActualizarCliente,
  useEliminarCliente,
} from '@/features/clientes/hooks/useClientes';
import type { DiaSemana } from '@/types';

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

export default function ClienteEditarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { showToast } = useToast();

  const { data: cliente, isLoading, isError, error } = useCliente(id ?? '');
  const actualizar = useActualizarCliente();
  const eliminar = useEliminarCliente();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [diaEntrega, setDiaEntrega] = useState<DiaSemana>('LUNES');
  const [horarioDesde, setHorarioDesde] = useState('');
  const [horarioHasta, setHorarioHasta] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (cliente) {
      setNombre(cliente.nombre);
      setApellido(cliente.apellido);
      setTelefono(cliente.telefono);
      setCalle(cliente.domicilio.calle);
      setNumero(cliente.domicilio.numero);
      setLocalidad(cliente.domicilio.localidad);
      setLatitud(String(cliente.domicilio.latitud));
      setLongitud(String(cliente.domicilio.longitud));
      setDiaEntrega(cliente.diaEntrega);
      setHorarioDesde(cliente.horarioDesde);
      setHorarioHasta(cliente.horarioHasta);
      setObservaciones(cliente.observaciones ?? '');
    }
  }, [cliente]);

  const validarForm = (): boolean => {
    if (!nombre.trim() || !apellido.trim()) {
      setFormError('Nombre y apellido son requeridos');
      return false;
    }
    if (!telefono.trim() || !/^\d{7,15}$/.test(telefono.trim())) {
      setFormError('El teléfono debe tener entre 7 y 15 dígitos');
      return false;
    }
    if (!calle.trim() || !numero.trim() || !localidad.trim()) {
      setFormError('Calle, número y localidad son requeridos');
      return false;
    }
    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setFormError('Latitud inválida (debe ser un número entre -90 y 90)');
      return false;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setFormError('Longitud inválida (debe ser un número entre -180 y 180)');
      return false;
    }
    if (!/^\d{2}:\d{2}$/.test(horarioDesde) || !/^\d{2}:\d{2}$/.test(horarioHasta)) {
      setFormError('Los horarios deben tener formato HH:MM');
      return false;
    }
    if (horarioDesde >= horarioHasta) {
      setFormError('El horario de inicio debe ser anterior al de fin');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleGuardar = async () => {
    if (!id || !validarForm()) return;

    try {
      await actualizar.mutateAsync({
        id,
        input: {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          telefono: telefono.trim(),
          calle: calle.trim(),
          numero: numero.trim(),
          localidad: localidad.trim(),
          latitud: parseFloat(latitud),
          longitud: parseFloat(longitud),
          diaEntrega,
          horarioDesde: horarioDesde.trim(),
          horarioHasta: horarioHasta.trim(),
          observaciones: observaciones.trim() || undefined,
        },
      });
      showToast('Cliente actualizado correctamente', 'success');
      router.back();
    } catch (e) {
      const parsed = handleApiError(e);
      setFormError(parsed.message);
    }
  };

  const handleEliminar = () => {
    if (!id) return;

    confirmAction(
      'Eliminar cliente',
      '¿Estás seguro de desactivar este cliente? No aparecerá en la lista de clientes activos.',
      'Eliminar',
      async () => {
        try {
          await eliminar.mutateAsync(id);
          showToast('Cliente desactivado', 'success');
          router.replace('/clientes/index');
        } catch (e) {
          const parsed = handleApiError(e);
          showToast(parsed.message, 'error');
        }
      },
      { destructive: true }
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Editar cliente" onBack={() => router.back()} />
        <LoadingSpinner message="Cargando datos del cliente..." />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Editar cliente" onBack={() => router.back()} />
        <ErrorMessage
          message={error?.message || 'Error al cargar el cliente'}
          onRetry={() => {}}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="Editar cliente" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Nombre"
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="words"
        />
        <Input
          label="Apellido"
          value={apellido}
          onChangeText={setApellido}
          autoCapitalize="words"
        />
        <Input
          label="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
        <Input
          label="Calle"
          value={calle}
          onChangeText={setCalle}
          autoCapitalize="words"
        />
        <Input label="Número" value={numero} onChangeText={setNumero} />
        <Input
          label="Localidad"
          value={localidad}
          onChangeText={setLocalidad}
          autoCapitalize="words"
        />
        <Input
          label="Latitud"
          value={latitud}
          onChangeText={setLatitud}
          keyboardType="decimal-pad"
        />
        <Input
          label="Longitud"
          value={longitud}
          onChangeText={setLongitud}
          keyboardType="decimal-pad"
        />

        <Text style={[styles.label, { color: theme.text }]}>Día de entrega</Text>
        <View style={styles.chipRow}>
          {DIAS.map((dia) => (
            <TouchableOpacity
              key={dia}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    diaEntrega === dia ? theme.buttonPrimary : theme.surface,
                },
              ]}
              onPress={() => setDiaEntrega(dia)}
            >
              <Text
                style={{
                  color: diaEntrega === dia ? '#FFFFFF' : theme.text,
                  fontWeight: '600',
                  fontSize: FontSizes.sm,
                }}
              >
                {DIAS_LABEL[dia]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Horario desde (HH:MM)"
          value={horarioDesde}
          onChangeText={setHorarioDesde}
          placeholder="09:00"
          autoCapitalize="none"
        />
        <Input
          label="Horario hasta (HH:MM)"
          value={horarioHasta}
          onChangeText={setHorarioHasta}
          placeholder="13:00"
          autoCapitalize="none"
        />

        <Input
          label="Observaciones"
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />

        {formError ? (
          <Text style={[styles.error, { color: theme.error }]}>{formError}</Text>
        ) : null}

        <Button
          title={actualizar.isPending ? 'Guardando...' : 'Guardar cambios'}
          onPress={handleGuardar}
          disabled={actualizar.isPending}
          style={styles.submit}
        />

        <Button
          title={eliminar.isPending ? 'Eliminando...' : 'Eliminar cliente'}
          onPress={handleEliminar}
          variant="danger"
          disabled={eliminar.isPending}
          style={styles.deleteButton}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  error: { fontSize: FontSizes.sm, marginBottom: Spacing.md },
  submit: { marginTop: Spacing.md },
  deleteButton: {
    marginTop: Spacing.md,
  },
});
