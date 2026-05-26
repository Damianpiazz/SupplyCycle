import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Button, Header, Input } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useToast } from '@/hooks/useToast';
import { handleApiError } from '@/services/handleApiError';
import { useCrearCliente } from '@/features/clientes/hooks/useClientes';
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

export default function ClienteAltaScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { showToast } = useToast();
  const crear = useCrearCliente();

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
  const [error, setError] = useState<string | null>(null);

  const validarForm = (): boolean => {
    if (!nombre.trim() || !apellido.trim()) {
      setError('Nombre y apellido son requeridos');
      return false;
    }
    if (!telefono.trim() || !/^\d{7,15}$/.test(telefono.trim())) {
      setError('El teléfono debe tener entre 7 y 15 dígitos');
      return false;
    }
    if (!calle.trim() || !numero.trim() || !localidad.trim()) {
      setError('Calle, número y localidad son requeridos');
      return false;
    }
    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Latitud inválida (debe ser un número entre -90 y 90)');
      return false;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Longitud inválida (debe ser un número entre -180 y 180)');
      return false;
    }
    if (!/^\d{2}:\d{2}$/.test(horarioDesde) || !/^\d{2}:\d{2}$/.test(horarioHasta)) {
      setError('Los horarios deben tener formato HH:MM');
      return false;
    }
    if (horarioDesde >= horarioHasta) {
      setError('El horario de inicio debe ser anterior al de fin');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validarForm()) return;

    try {
      await crear.mutateAsync({
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
      });
      showToast('Cliente creado correctamente', 'success');
      router.back();
    } catch (e) {
      const parsed = handleApiError(e);
      setError(parsed.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Nuevo cliente" onBack={() => router.back()} />
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
        <Input
          label="Número"
          value={numero}
          onChangeText={setNumero}
        />
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

        {error ? (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        ) : null}

        <Button
          title={crear.isPending ? 'Guardando...' : 'Crear cliente'}
          onPress={handleSubmit}
          disabled={crear.isPending}
          style={styles.submit}
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
});
