import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@soundblue/core': path.resolve(__dirname, 'packages/core/src'),
      '@soundblue/config': path.resolve(__dirname, 'packages/config/src'),
      '@soundblue/data': path.resolve(__dirname, 'packages/data/src'),
      '@soundblue/platform': path.resolve(__dirname, 'packages/platform/src'),
      '@soundblue/i18n': path.resolve(__dirname, 'packages/i18n/src'),
      '@soundblue/search': path.resolve(__dirname, 'packages/search/src'),
      '@soundblue/seo': path.resolve(__dirname, 'packages/seo/src'),
      '@soundblue/pwa': path.resolve(__dirname, 'packages/pwa/src'),
      '@soundblue/features': path.resolve(__dirname, 'packages/features/src'),
      '@soundblue/ui': path.resolve(__dirname, 'packages/ui/src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'build', 'dist', '**/e2e/**'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'build/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/',
        '**/types.ts',
        'tests/**',
        '**/e2e/**',
        'apps/**/routes/**',
        'apps/**/app/root.tsx',
        'apps/**/app/entry.*.tsx',
        'apps/**/components/**',
        'apps/**/i18n/**',
        'apps/**/data/**',
        'apps/**/scripts/**',
        'scripts/**',
        '**/*.cjs',
        '**/*.mjs',
      ],
      include: [
        'packages/core/src/**/!(index).ts',
        'packages/platform/src/**/!(index).ts',
        'packages/i18n/src/**/!(index).ts',
        'packages/search/src/**/!(index).ts',
        'packages/seo/src/**/!(index).ts',
        'packages/features/src/**/!(index).ts',
        'packages/pwa/src/**/!(index).{ts,tsx}',
        'packages/ui/src/**/!(index).{ts,tsx}',
        'packages/data/src/**/!(index).ts',
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
});
