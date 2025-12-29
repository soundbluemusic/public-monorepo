import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],
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
        // Exclude app-specific files (routes, components) - these are tested via e2e/integration
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
        // Only include testable utility code - exclude index.ts and loader.ts files
        'packages/shared/src/**/!(index|node|loader).ts',
        'packages/shared-react/src/hooks/**/!(index).ts',
        'packages/shared-react/src/stores/**/!(index).ts',
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
  resolve: {
    alias: {
      '@soundblue/shared': '/packages/shared/src',
      '@soundblue/shared-react': '/packages/shared-react/src',
    },
  },
});
