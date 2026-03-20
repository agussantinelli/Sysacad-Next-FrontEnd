import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => ({
  plugins: [angular()],
  test: {
    globals: true,
    setupFiles: ['tests/test-setup.ts'],
    environment: 'happy-dom',
    include: ['tests/integration/**/*.test.ts'],
    alias: {
        '@core': 'src/app/core',
        '@features': 'src/app/features',
        '@shared': 'src/app/shared',
        '@layout': 'src/app/layout',
        '@env': 'src/environments',
        '@assets': 'src/assets',
        '@': 'src',
    }
  },
}));
