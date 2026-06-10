import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamily } from '@/constants/theme';
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
        { backgroundColor: theme.errorBg },
      ]}
    >
      <Text style={[styles.text, { color: theme.error }]}>
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
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    textAlign: 'center',
  },
});
