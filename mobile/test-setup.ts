/**
 * Global test setup for mobile Vitest tests.
 * Provides mocks for React Native, Expo Router, and other native dependencies.
 */

import { vi } from 'vitest';

// ─── Mock react-native (prevents Rolldown Flow parse error) ──────────────────
vi.mock('react-native', () => {
  var h = function (name) {
    return function (p) {
      var c = p && p.children;
      var r = {};
      for (var k in p) { if (k !== 'children') r[k] = p[k]; }
      var R = require('react');
      return R.createElement(name, r, c);
    };
  };
  var t = function (n) {
    return function (p) {
      var c = p && p.children;
      var d = p && p.disabled;
      var o = p && p.onPress;
      var r = {};
      for (var k in p) { if (k !== 'children' && k !== 'onPress' && k !== 'disabled') r[k] = p[k]; }
      if (d) { r.disabled = true; }
      if (!d) { r.onPress = o; }
      var R = require('react');
      return R.createElement(n, r, c);
    };
  };
  return {
    View: h('View'),
    Text: h('Text'),
    TouchableOpacity: t('TouchableOpacity'),
    TouchableHighlight: t('TouchableHighlight'),
    TextInput: h('TextInput'),
    ActivityIndicator: h('ActivityIndicator'),
    ScrollView: h('ScrollView'),
    FlatList: function (p) {
      var data = p && p.data;
      var renderItem = p && p.renderItem;
      var ListEmptyComponent = p && p.ListEmptyComponent;
      var R = require('react');
      if (data && data.length > 0 && renderItem) {
        var children = data.map(function (item, index) {
          return renderItem({ item: item, index: index, separators: {} });
        });
        return R.createElement('FlatList', p, children);
      }
      if (ListEmptyComponent) {
        var emptyEl = typeof ListEmptyComponent === 'function' ? R.createElement(ListEmptyComponent) : ListEmptyComponent;
        return R.createElement('FlatList', p, emptyEl);
      }
      return R.createElement('FlatList', p, p && p.children);
    },
    Image: h('Image'),
    Pressable: h('Pressable'),
    Modal: h('Modal'),
    KeyboardAvoidingView: h('KeyboardAvoidingView'),
    StyleSheet: { create: function (s) { return s; }, flatten: function (s) { return Array.isArray(s) ? Object.assign.apply(null, [{}].concat(s.filter(Boolean))) : s; } },
    useColorScheme: function () { return 'light'; },
    Platform: { OS: 'ios', Version: 0, select: function (o) { return o.ios || o.default; } },
    Dimensions: { get: function () { return { width: 390, height: 844 }; }, addEventListener: function () { return { remove: function () {} }; } },
    PixelRatio: { get: function () { return 2; }, getFontScale: function () { return 1; } },
    Animated: {
      View: h('AnimatedView'), Text: h('AnimatedText'), Image: h('AnimatedImage'),
      timing: function () { return { start: function (cb) { cb && cb(); } }; },
      spring: function () { return { start: function (cb) { cb && cb(); } }; },
      Value: function (v) { return { _value: v, setValue: function () {} }; },
      createAnimatedComponent: function (c) { return c; },
    },
    Keyboard: { addListener: function () { return { remove: function () {} }; }, removeListener: function () {} },
    NativeModules: {},
  };
});

// ─── Mock expo-router ────────────────────────────────────────────────────────
vi.mock('expo-router', () => ({
  router: {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    canGoBack: vi.fn(() => true),
  },
  Link: vi.fn(({ children, ...rest }: any) => children || null),
  Stack: {
    Screen: vi.fn(() => null),
    Navigator: vi.fn(({ children }: any) => children || null),
  },
  Redirect: vi.fn(() => null),
  useLocalSearchParams: vi.fn(() => ({})),
  useGlobalSearchParams: vi.fn(() => ({})),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  useSegments: vi.fn(() => []),
  useRootNavigationState: vi.fn(() => ({})),
  Tabs: vi.fn(({ children }: any) => children || null),
}));

// ─── Mock expo-secure-store ──────────────────────────────────────────────────
vi.mock('expo-secure-store', () => ({
  default: {
    setItemAsync: vi.fn(),
    getItemAsync: vi.fn(),
    deleteItemAsync: vi.fn(),
  },
  setItemAsync: vi.fn(),
  getItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

// ─── Mock expo-status-bar ────────────────────────────────────────────────────
vi.mock('expo-status-bar', () => ({
  StatusBar: vi.fn(() => null),
  setStatusBarStyle: vi.fn(),
}));

// ─── Mock expo-constants ─────────────────────────────────────────────────────
vi.mock('expo-constants', () => ({
  default: {
    expoConfig: { extra: {} },
    manifest: {},
  },
  Constants: {
    expoConfig: { extra: {} },
    manifest: {},
  },
}));

// ─── Mock expo-linking ────────────────────────────────────────────────────────
vi.mock('expo-linking', () => ({
  openURL: vi.fn(() => Promise.resolve(true)),
  canOpenURL: vi.fn(() => Promise.resolve(true)),
}));

// ─── Mock react-native-reanimated ─────────────────────────────────────────────
vi.mock('react-native-reanimated', () => {
  const mockView = vi.fn(({ children }: any) => children || null);
  return {
    default: {
      View: mockView,
      Text: vi.fn(({ children }: any) => children || null),
      Image: vi.fn(({ children }: any) => children || null),
      ScrollView: vi.fn(({ children }: any) => children || null),
      FlatList: vi.fn(({ children }: any) => children || null),
    },
    View: mockView,
    Text: vi.fn(({ children }: any) => children || null),
    Image: vi.fn(({ children }: any) => children || null),
    ScrollView: vi.fn(({ children }: any) => children || null),
    FlatList: vi.fn(({ children }: any) => children || null),
    useSharedValue: vi.fn((val: any) => ({ value: val })),
    useAnimatedStyle: vi.fn(() => ({})),
    withTiming: vi.fn((val: any) => val),
    withSpring: vi.fn((val: any) => val),
    FadeIn: vi.fn(),
    FadeOut: vi.fn(),
    SlideInUp: vi.fn(),
    SlideInDown: vi.fn(),
    SlideOutUp: vi.fn(),
    SlideOutDown: vi.fn(),
    Animated: {
      View: mockView,
      Text: vi.fn(({ children }: any) => children || null),
    },
    createAnimatedComponent: vi.fn((comp: any) => comp),
  };
});

// ─── Mock react-native-safe-area-context ────────────────────────────────────
vi.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: vi.fn(({ children }: any) => children || null),
  SafeAreaView: vi.fn(({ children }: any) => children || null),
  useSafeAreaInsets: vi.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  useSafeAreaFrame: vi.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
}));

// ─── Mock react-native-gesture-handler ───────────────────────────────────────
vi.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: vi.fn(({ children }: any) => children || null),
  Gesture: {
    Pan: vi.fn(() => ({})),
    Tap: vi.fn(() => ({})),
  },
}));

// ─── Mock react-native-screens ───────────────────────────────────────────────
vi.mock('react-native-screens', () => ({
  Screen: vi.fn(({ children }: any) => children || null),
  ScreenStack: vi.fn(({ children }: any) => children || null),
  enableScreens: vi.fn(),
}));

// ─── Mock @react-navigation/native ───────────────────────────────────────────
vi.mock('@react-navigation/native', () => ({
  useNavigation: vi.fn(() => ({ navigate: vi.fn(), goBack: vi.fn() })),
  useRoute: vi.fn(() => ({ params: {} })),
  useFocusEffect: vi.fn(),
  NavigationContainer: vi.fn(({ children }: any) => children || null),
  DefaultTheme: { colors: {} },
  DarkTheme: { colors: {} },
  ThemeProvider: vi.fn(({ children }: any) => children || null),
}));

// ─── Mock @react-navigation/elements ─────────────────────────────────────────
vi.mock('@react-navigation/elements', () => ({
  Header: vi.fn(() => null),
}));

// ─── Mock @react-native-community/netinfo ────────────────────────────────────
vi.mock('@react-native-community/netinfo', () => ({
  default: {
    fetch: vi.fn(() => Promise.resolve({ isConnected: true, type: 'wifi' })),
    addEventListener: vi.fn(() => vi.fn()),
  },
  fetch: vi.fn(() => Promise.resolve({ isConnected: true, type: 'wifi' })),
  addEventListener: vi.fn(() => vi.fn()),
}));

// ─── Mock @tanstack/react-query ───────────────────────────────────────────────
const mockQueryResult = {
  data: undefined,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
  isFetching: false,
  isSuccess: false,
  isFetched: false,
};

const defaultMutationResult = {
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isPending: false,
  isError: false,
  error: null,
  isSuccess: false,
  reset: vi.fn(),
  data: undefined,
};

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => mockQueryResult),
  useMutation: vi.fn(() => defaultMutationResult),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
    refetchQueries: vi.fn(),
  })),
  QueryClient: vi.fn(),
  QueryClientProvider: vi.fn(({ children }: any) => children || null),
}));

// ─── Mock expo-splash-screen ─────────────────────────────────────────────────
vi.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: vi.fn(() => Promise.resolve()),
  hideAsync: vi.fn(() => Promise.resolve()),
}));

// ─── Mock expo-font ──────────────────────────────────────────────────────────
vi.mock('expo-font', () => ({
  loadAsync: vi.fn(() => Promise.resolve()),
  isLoaded: vi.fn(() => true),
  useFonts: vi.fn(() => [true]),
}));

// ─── Mock expo-image ─────────────────────────────────────────────────────────
vi.mock('expo-image', () => ({
  Image: vi.fn(({ children }: any) => children || null),
}));

// ─── Mock @expo/vector-icons ───────────────────────────────────────────────────
vi.mock('@expo/vector-icons', () => ({
  Ionicons: vi.fn(({ name, size, color }: any) => null),
  MaterialIcons: vi.fn(({ name, size, color }: any) => null),
  MaterialCommunityIcons: vi.fn(({ name, size, color }: any) => null),
  FontAwesome: vi.fn(({ name, size, color }: any) => null),
  Feather: vi.fn(({ name, size, color }: any) => null),
}));

// ─── Mock @react-native-async-storage/async-storage ───────────────────────────
vi.mock('@react-native-async-storage/async-storage', () => {
  const store: Record<string, string> = {};
  return {
    default: {
      getItem: vi.fn((key: string) => Promise.resolve(store[key] ?? null)),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach((k) => delete store[k]);
        return Promise.resolve();
      }),
    },
    getItem: vi.fn((key: string) => Promise.resolve(store[key] ?? null)),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
      return Promise.resolve();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((k) => delete store[k]);
      return Promise.resolve();
    }),
  };
});

// ─── Mock expo-haptics ───────────────────────────────────────────────────────
vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(() => Promise.resolve()),
  notificationAsync: vi.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
}));
