import { StyleSheet, Text } from 'react-native';
import { Card } from '@/components/ui';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOTIVOS_CANCELACION } from '@/constants/motivosCancelacion';

const MOTIVO_LABELS: Record<string, string> = {};
for (const m of MOTIVOS_CANCELACION) {
  MOTIVO_LABELS[m.value] = m.label;
}

function getMotivoLabel(motivo: string): string {
  return MOTIVO_LABELS[motivo] ?? motivo;
}

interface MotivoFallaCardProps {
  motivo: string;
}

export default function MotivoFallaCard({ motivo }: MotivoFallaCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Card>
      <Text style={[styles.sectionTitle, { color: theme.noEntregado }]}>Motivo de no entrega</Text>
      <Text style={[styles.motivoText, { color: theme.text }]}>{getMotivoLabel(motivo)}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  motivoText: {
    fontSize: FontSizes.md,
    fontStyle: 'italic',
  },
});
