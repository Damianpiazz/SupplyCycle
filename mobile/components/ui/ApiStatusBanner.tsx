import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApiStatusStore } from '@/stores/apiStatusStore';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius, FontFamily } from '@/constants/theme';

const AUTO_HIDE_MS = 4000;

export default function ApiStatusBanner() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const lastCall = useApiStatusStore((s) => s.lastCall);
  const [visible, setVisible] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!lastCall) return;

    // Cancelar ocultamiento pendiente
    if (timerRef.current) clearTimeout(timerRef.current);

    // Mostrar
    setVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Ocultar después de N segundos
    timerRef.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, AUTO_HIDE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lastCall, opacity]);

  if (!visible || !lastCall) return null;

  const isSuccess = lastCall.success;
  const bgColor = isSuccess ? theme.successBg : theme.errorBg;
  const fgColor = isSuccess ? theme.success : theme.error;

  return (
    <Animated.View
      style={[styles.container, { opacity, backgroundColor: bgColor }]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          // Tocar para ver historial completo (más adelante)
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setVisible(false));
        }}
        style={styles.inner}
      >
        <Text style={[styles.method, { color: fgColor }]}>{lastCall.method}</Text>
        <Text style={[styles.url, { color: fgColor }]} numberOfLines={1}>
          {lastCall.url}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: fgColor + '18' }]}>
          <Text style={[styles.statusText, { color: fgColor }]}>
            {lastCall.status} {lastCall.statusText}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // por encima de la tab bar
    left: Spacing.lg,
    right: Spacing.lg,
    borderRadius: BorderRadius.md,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 9999,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  method: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interBold,
    fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  url: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interBold,
    fontWeight: '700',
  },
});
