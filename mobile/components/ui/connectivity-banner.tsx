import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ConnectivityBannerProps {
  isConnected: boolean;
}

export default function ConnectivityBanner({
  isConnected,
}: ConnectivityBannerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  if (isConnected) return null;

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: theme.error },
      ]}
    >
      <Text style={styles.text}>
        Sin conexión — los datos pueden no estar actualizados
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
});
