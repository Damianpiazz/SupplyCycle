import { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore, type ToastType } from '@/stores/toastStore';
import { IconSymbol } from './icon-symbol';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TOAST_HEIGHT = 64;

function getIconName(type: ToastType): 'checkmark' | 'xmark' | 'ellipsis' {
  if (type === 'success') return 'checkmark';
  if (type === 'error') return 'xmark';
  return 'ellipsis';
}

export default function Toast() {
  const { visible, message, type, hide } = useToastStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const translateY = useSharedValue(-TOAST_HEIGHT - insets.top - 8);

  useEffect(() => {
    translateY.value = withTiming(
      visible ? 0 : -TOAST_HEIGHT - insets.top - 8,
      { duration: 300 }
    );
  }, [visible, insets.top, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const bgColorMap: Record<ToastType, string> = {
    success: theme.success,
    error: theme.error,
    warning: theme.warning,
    info: theme.info,
  };

  const backgroundColor = bgColorMap[type] || theme.info;
  const iconName = getIconName(type);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor,
          top: insets.top + 8,
          left: Spacing.lg,
          width: width - Spacing.lg * 2,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={hide}
        activeOpacity={0.8}
      >
        <IconSymbol name={iconName} size={22} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
    borderRadius: BorderRadius.md,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    minHeight: TOAST_HEIGHT,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: TOAST_HEIGHT,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
    lineHeight: 20,
  },
});
