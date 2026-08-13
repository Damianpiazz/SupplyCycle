import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const OPCIONES = [
  { label: '7 días', valor: 7 },
  { label: '15 días', valor: 15 },
  { label: '30 días', valor: 30 },
  { label: '60 días', valor: 60 },
  { label: '90 días', valor: 90 },
];

interface PeriodoSelectorProps {
  valor: number;
  onChange: (periodo: number) => void;
}

export default function PeriodoSelector({ valor, onChange }: PeriodoSelectorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.muted }]}>Período de estimación</Text>
      <View style={styles.opciones}>
        {OPCIONES.map((op) => (
          <TouchableOpacity
            key={op.valor}
            style={[
              styles.boton,
              {
                backgroundColor: op.valor === valor ? theme.tint : 'transparent',
                borderColor: op.valor === valor ? theme.tint : theme.border,
              },
            ]}
            onPress={() => onChange(op.valor)}
          >
            <Text
              style={[
                styles.textoBoton,
                { color: op.valor === valor ? '#FFFFFF' : theme.text },
              ]}
            >
              {op.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.interMedium,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  opciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  boton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  textoBoton: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
  },
});
