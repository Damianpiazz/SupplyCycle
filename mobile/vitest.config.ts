import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'app-example'],
    setupFiles: ['./test-setup.ts'],
    execArgv: ['--require', './scripts/rn-mock-hook.js'],
  },
  server: {
    deps: {
      inline: ['@testing-library/react-native'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
