import type { FC, PropsWithChildren } from 'react';
import { createElement } from 'react';

const host = (name: string): FC<PropsWithChildren<any>> =>
  ({ children, ...props }: any) => createElement(name, props, children);

export const View = host('View');
export const Text = host('Text');
export const TouchableOpacity = host('TouchableOpacity');
export const TouchableHighlight = host('TouchableHighlight');
export const TextInput = host('TextInput');
export const ActivityIndicator = host('ActivityIndicator');
export const ScrollView = host('ScrollView');
export const FlatList = host('FlatList');
export const Image = host('Image');
export const Pressable = host('Pressable');
export const Modal = host('Modal');
export const KeyboardAvoidingView = host('KeyboardAvoidingView');
export const RefreshControl = host('RefreshControl');
export const Switch = host('Switch');
export const StatusBar = host('StatusBar');

export const StyleSheet = {
  create: <T extends Record<string, any>>(styles: T): T => styles,
};

export const useColorScheme = () => 'light' as const;

export const Platform = {
  OS: 'ios' as const,
  Version: 0,
  select: (obj: Record<string, any>) => obj.ios ?? obj.default,
};

export const Dimensions = {
  get: () => ({ width: 390, height: 844 }),
  addEventListener: () => ({ remove: () => {} }),
};

export const PixelRatio = {
  get: () => 2,
  getFontScale: () => 1,
};

export const Animated = {
  View: host('AnimatedView'),
  Text: host('AnimatedText'),
  Image: host('AnimatedImage'),
  ScrollView: host('AnimatedScrollView'),
  timing: () => ({ start: (cb?: () => void) => cb?.() }),
  spring: () => ({ start: (cb?: () => void) => cb?.() }),
  Value: (v: any) => ({ _value: v, setValue: () => {} }),
  createAnimatedComponent: (c: any) => c,
};

export const AccessibilityInfo = {
  isScreenReaderEnabled: () => Promise.resolve(false),
};

export const Appearance = {
  getColorScheme: () => 'light',
};

export const I18nManager = {
  isRTL: false,
  allowRTL: () => {},
  forceRTL: () => {},
};

export const Keyboard = {
  addListener: () => ({ remove: () => {} }),
  removeListener: () => {},
};

export const LayoutAnimation = {
  configureNext: () => {},
};

export const Linking = {
  openURL: () => Promise.resolve(true),
};

export const Vibration = {
  vibrate: () => {},
};

export const YellowBox = {
  ignoreWarnings: () => {},
};

export const LogBox = {
  ignoreLogs: () => {},
};

export const NativeModules = {};
export const NativeEventEmitter = class {
  addListener() {}
  remove() {}
};
