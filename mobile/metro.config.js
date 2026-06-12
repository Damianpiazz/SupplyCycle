const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable package exports to prevent Metro from resolving ESM entries
// that use `import.meta` (e.g. Zustand v5), which Metro doesn't support.
// See: https://github.com/expo/expo/issues/36384
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
