'use strict';
// CJS mock for react-native — avoids Flow `import typeof` syntax error

const React = require('react');

function host(name) {
  return function (props) {
    var children = props && props.children;
    var rest = props ? Object.assign({}, props) : {};
    delete rest.children;
    return React.createElement(name, rest, children);
  };
}

function touchable(name) {
  return function (props) {
    var children = props && props.children;
    var onPress = props && props.onPress;
    var disabled = props && props.disabled;
    var rest = props ? Object.assign({}, props) : {};
    delete rest.children;
    delete rest.onPress;
    delete rest.disabled;
    if (!disabled) {
      rest.onPress = onPress;
    }
    return React.createElement(name, rest, children);
  };
}

module.exports = {
  View: host('View'),
  Text: host('Text'),
  TouchableOpacity: touchable('TouchableOpacity'),
  TouchableHighlight: touchable('TouchableHighlight'),
  TextInput: host('TextInput'),
  ActivityIndicator: host('ActivityIndicator'),
  ScrollView: host('ScrollView'),
  FlatList: host('FlatList'),
  Image: host('Image'),
  Pressable: host('Pressable'),
  Modal: host('Modal'),
  KeyboardAvoidingView: host('KeyboardAvoidingView'),
  RefreshControl: host('RefreshControl'),
  Switch: host('Switch'),
  StatusBar: host('StatusBar'),
  StyleSheet: {
    create: function (s) { return s; },
    flatten: function (style) {
      if (Array.isArray(style)) {
        return Object.assign.apply(null, [{}].concat(style.filter(Boolean)));
      }
      return style;
    },
  },
  useColorScheme: function () { return 'light'; },
  Platform: {
    OS: 'ios',
    Version: 0,
    select: function (obj) { return obj.ios || obj.default; },
  },
  Dimensions: {
    get: function () { return { width: 390, height: 844 }; },
    addEventListener: function () { return { remove: function () {} }; },
  },
  PixelRatio: {
    get: function () { return 2; },
    getFontScale: function () { return 1; },
  },
  Animated: {
    View: host('AnimatedView'),
    Text: host('AnimatedText'),
    Image: host('AnimatedImage'),
    ScrollView: host('AnimatedScrollView'),
    timing: function () { return { start: function (cb) { cb && cb(); } }; },
    spring: function () { return { start: function (cb) { cb && cb(); } }; },
    Value: function (v) { return { _value: v, setValue: function () {} }; },
    createAnimatedComponent: function (c) { return c; },
  },
  AccessibilityInfo: {
    isScreenReaderEnabled: function () { return Promise.resolve(false); },
  },
  Appearance: {
    getColorScheme: function () { return 'light'; },
  },
  I18nManager: {
    isRTL: false,
    allowRTL: function () {},
    forceRTL: function () {},
  },
  Keyboard: {
    addListener: function () { return { remove: function () {} }; },
    removeListener: function () {},
  },
  LayoutAnimation: {
    configureNext: function () {},
  },
  Linking: {
    openURL: function () { return Promise.resolve(true); },
  },
  Vibration: {
    vibrate: function () {},
  },
  YellowBox: {
    ignoreWarnings: function () {},
  },
  LogBox: {
    ignoreLogs: function () {},
  },
  NativeModules: {},
  NativeEventEmitter: function () {},
};
