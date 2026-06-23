import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface DemoraBadgeProps {
  cantidadEnvasesPendientes: number;
  fechaUltimaEntrega?: string | null;
}

export default function DemoraBadge({
  cantidadEnvasesPendientes,
}: DemoraBadgeProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  if (cantidadEnvasesPendientes <= 0) return null;

  return (
    <View style={[styles.badge, { backgroundColor: theme.warning + '20' }]}>
      <Text style={[styles.badgeText, { color: theme.warning }]}>
        {cantidadEnvasesPendientes} envase{cantidadEnvasesPendientes !== 1 ? 's' : ''} pendiente{cantidadEnvasesPendientes !== 1 ? 's' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
});
