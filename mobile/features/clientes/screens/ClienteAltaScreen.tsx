import { useState, useCallback } from 'react';
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
import type { DomicilioInput, DiaInput, HorarioInput } from '@/types';

const DIAS: DiaSemana[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

const DIAS_LABEL: Record<DiaSemana, string> = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
};

function emptyDia(): DiaInput {
  return { nombre: 'LUNES', horarios: [{ inicio: '', fin: '' }] };
}

function emptyDomicilio(): DomicilioInput {
  return { calle: '', numero: '', localidad: '', latitud: undefined, longitud: undefined, principal: false, dias: [emptyDia()] };
}

export default function ClienteAltaScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { showToast } = useToast();
  const crear = useCrearCliente();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [domicilios, setDomicilios] = useState<DomicilioInput[]>([emptyDomicilio()]);
  const [error, setError] = useState<string | null>(null);

  const updateDom = useCallback((idx: number, patch: Partial<DomicilioInput>) => {
    setDomicilios((prev) => prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)));
  }, []);

  const updateDia = useCallback((domIdx: number, diaIdx: number, patch: Partial<DiaInput>) => {
    setDomicilios((prev) =>
      prev.map((d, i) =>
        i === domIdx
          ? { ...d, dias: d.dias.map((da, j) => (j === diaIdx ? { ...da, ...patch } : da)) }
          : d
      )
    );
  }, []);

  const updateHorario = useCallback((domIdx: number, diaIdx: number, horIdx: number, patch: Partial<HorarioInput>) => {
    setDomicilios((prev) =>
      prev.map((d, i) =>
        i === domIdx
          ? {
              ...d,
              dias: d.dias.map((da, j) =>
                j === diaIdx
                  ? { ...da, horarios: da.horarios.map((h, k) => (k === horIdx ? { ...h, ...patch } : h)) }
                  : da
              ),
            }
          : d
      )
    );
  }, []);

  const addDia = useCallback((domIdx: number) => {
    setDomicilios((prev) =>
      prev.map((d, i) => (i === domIdx ? { ...d, dias: [...d.dias, emptyDia()] } : d))
    );
  }, []);

  const removeDia = useCallback((domIdx: number, diaIdx: number) => {
    setDomicilios((prev) =>
      prev.map((d, i) =>
        i === domIdx ? { ...d, dias: d.dias.filter((_, j) => j !== diaIdx) } : d
      )
    );
  }, []);

  const addHorario = useCallback((domIdx: number, diaIdx: number) => {
    setDomicilios((prev) =>
      prev.map((d, i) =>
        i === domIdx
          ? {
              ...d,
              dias: d.dias.map((da, j) =>
                j === diaIdx ? { ...da, horarios: [...da.horarios, { inicio: '', fin: '' }] } : da
              ),
            }
          : d
      )
    );
  }, []);

  const removeHorario = useCallback((domIdx: number, diaIdx: number, horIdx: number) => {
    setDomicilios((prev) =>
      prev.map((d, i) =>
        i === domIdx
          ? {
              ...d,
              dias: d.dias.map((da, j) =>
                j === diaIdx
                  ? { ...da, horarios: da.horarios.filter((_, k) => k !== horIdx) }
                  : da
              ),
            }
          : d
      )
    );
  }, []);

  const addDomicilio = useCallback(() => {
    setDomicilios((prev) => [...prev, emptyDomicilio()]);
  }, []);

  const removeDomicilio = useCallback((idx: number) => {
    setDomicilios((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const validarForm = (): boolean => {
    if (!nombre.trim() || !apellido.trim()) {
      setError('Nombre y apellido son requeridos');
      return false;
    }
    if (!telefono.trim() || !/^\d{7,15}$/.test(telefono.trim())) {
      setError('El teléfono debe tener entre 7 y 15 dígitos');
      return false;
    }
    for (let i = 0; i < domicilios.length; i++) {
      const d = domicilios[i];
      if (!d.calle.trim() || !d.numero.trim() || !d.localidad.trim()) {
        setError(`Domicilio ${i + 1}: calle, número y localidad son requeridos`);
        return false;
      }
      for (let j = 0; j < d.dias.length; j++) {
        const dia = d.dias[j];
        for (let k = 0; k < dia.horarios.length; k++) {
          const h = dia.horarios[k];
          if (!/^\d{2}:\d{2}$/.test(h.inicio) || !/^\d{2}:\d{2}$/.test(h.fin)) {
            setError(`Domicilio ${i + 1}, día ${DIAS_LABEL[dia.nombre]}: horario inválido (HH:MM)`);
            return false;
          }
          if (h.inicio >= h.fin) {
            setError(`Domicilio ${i + 1}, día ${DIAS_LABEL[dia.nombre]}: inicio debe ser anterior a fin`);
            return false;
          }
        }
      }
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validarForm()) return;

    const payload = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      telefono: telefono.trim(),
      observaciones: observaciones.trim() || undefined,
      domicilios: domicilios.map((d, i) => ({
        ...d,
        principal: domicilios.length === 1 ? true : (d.principal ?? i === 0),
      })),
    };

    try {
      await crear.mutateAsync(payload);
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
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Nombre" value={nombre} onChangeText={setNombre} autoCapitalize="words" />
        <Input label="Apellido" value={apellido} onChangeText={setApellido} autoCapitalize="words" />
        <Input label="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
        <Input label="Observaciones" value={observaciones} onChangeText={setObservaciones} multiline numberOfLines={3} style={styles.textArea} />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Domicilios</Text>

        {domicilios.map((dom, domIdx) => (
          <View key={domIdx} style={[styles.domCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.domHeader}>
              <Text style={[styles.domTitle, { color: theme.text }]}>Domicilio {domIdx + 1}</Text>
              {domicilios.length > 1 && (
                <TouchableOpacity onPress={() => removeDomicilio(domIdx)}>
                  <Text style={{ color: theme.error, fontWeight: '600' }}>Eliminar</Text>
                </TouchableOpacity>
              )}
            </View>

            <Input label="Calle" value={dom.calle} onChangeText={(v) => updateDom(domIdx, { calle: v })} autoCapitalize="words" />
            <Input label="Número" value={dom.numero} onChangeText={(v) => updateDom(domIdx, { numero: v })} />
            <Input label="Localidad" value={dom.localidad} onChangeText={(v) => updateDom(domIdx, { localidad: v })} autoCapitalize="words" />
            <Input label="Latitud (opcional)" value={dom.latitud !== undefined ? String(dom.latitud) : ''} onChangeText={(v) => updateDom(domIdx, { latitud: v ? parseFloat(v) : undefined })} keyboardType="decimal-pad" />
            <Input label="Longitud (opcional)" value={dom.longitud !== undefined ? String(dom.longitud) : ''} onChangeText={(v) => updateDom(domIdx, { longitud: v ? parseFloat(v) : undefined })} keyboardType="decimal-pad" />

            <Text style={[styles.subSectionTitle, { color: theme.text }]}>Días y horarios</Text>

            {dom.dias.map((dia, diaIdx) => (
              <View key={diaIdx} style={[styles.diaCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.diaHeader}>
                  <View style={styles.chipRow}>
                    {DIAS.map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={[styles.chip, { backgroundColor: dia.nombre === d ? theme.buttonPrimary : theme.tint + '20' }]}
                        onPress={() => updateDia(domIdx, diaIdx, { nombre: d })}
                      >
                        <Text style={{ color: dia.nombre === d ? '#FFF' : theme.text, fontWeight: '600', fontSize: FontSizes.xs }}>
                          {DIAS_LABEL[d]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {dom.dias.length > 1 && (
                    <TouchableOpacity onPress={() => removeDia(domIdx, diaIdx)}>
                      <Text style={{ color: theme.error, fontWeight: '600', fontSize: FontSizes.sm }}>Quitar día</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {dia.horarios.map((hor, horIdx) => (
                  <View key={horIdx} style={styles.horarioRow}>
                    <View style={{ flex: 1 }}>
                      <Input
                        label="Desde"
                        value={hor.inicio}
                        onChangeText={(v) => updateHorario(domIdx, diaIdx, horIdx, { inicio: v })}
                        placeholder="08:00"
                        autoCapitalize="none"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Input
                        label="Hasta"
                        value={hor.fin}
                        onChangeText={(v) => updateHorario(domIdx, diaIdx, horIdx, { fin: v })}
                        placeholder="17:00"
                        autoCapitalize="none"
                      />
                    </View>
                    {dia.horarios.length > 1 && (
                      <TouchableOpacity style={styles.removeHorario} onPress={() => removeHorario(domIdx, diaIdx, horIdx)}>
                        <Text style={{ color: theme.error, fontSize: 20 }}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                <Button title="+ Agregar horario" variant="ghost" onPress={() => addHorario(domIdx, diaIdx)} style={styles.smallBtn} />
              </View>
            ))}

            <Button title="+ Agregar día" variant="ghost" onPress={() => addDia(domIdx)} style={styles.smallBtn} />
          </View>
        ))}

        <Button title="+ Agregar otro domicilio" variant="ghost" onPress={addDomicilio} style={styles.smallBtn} />

        {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

        <Button title={crear.isPending ? 'Guardando...' : 'Crear cliente'} onPress={handleSubmit} disabled={crear.isPending} style={styles.submit} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: '700', marginTop: Spacing.xl, marginBottom: Spacing.md },
  subSectionTitle: { fontSize: FontSizes.md, fontWeight: '600', marginTop: Spacing.md, marginBottom: Spacing.sm },
  domCard: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md },
  domHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  domTitle: { fontSize: FontSizes.md, fontWeight: '700' },
  diaCard: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.sm, marginBottom: Spacing.sm },
  diaHeader: { marginBottom: Spacing.xs },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.sm },
  chip: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.xl },
  horarioRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm, marginBottom: Spacing.xs },
  removeHorario: { paddingBottom: Spacing.sm, paddingLeft: Spacing.xs },
  smallBtn: { marginTop: Spacing.xs },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  error: { fontSize: FontSizes.sm, marginBottom: Spacing.md },
  submit: { marginTop: Spacing.md },
});
