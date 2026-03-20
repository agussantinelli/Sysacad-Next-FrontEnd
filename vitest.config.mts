import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [angular()],
  test: {
    globals: true,
    setupFiles: ['tests/test-setup.ts'],
    environment: 'happy-dom',
    include: ['tests/integration/**/*.test.ts'],
    alias: {
        '@core': resolve(__dirname, './src/app/core'),
        '@features': resolve(__dirname, './src/app/features'),
        '@shared': resolve(__dirname, './src/app/shared'),
        '@layout': resolve(__dirname, './src/app/layout'),
        '@env': resolve(__dirname, './src/environments'),
        '@assets': resolve(__dirname, './src/assets'),
        '@': resolve(__dirname, './src'),
    }
  },
}));
