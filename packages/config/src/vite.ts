/**
 * @fileoverview Shared Vite Configuration
 * @environment build-only
 *
 * Common Vite configuration options shared across apps.
 */

/**
 * Common build optimization settings
 */
export const buildOptimizations = {
  // Chunk size warnings
  chunkSizeWarningLimit: 500,

  // Rollup options
  rollupOptions: {
    output: {
      // Manual chunk splitting
      manualChunks: {
        react: ['react', 'react-dom'],
        router: ['react-router'],
      },
    },
  },
} as const;

/**
 * Common dev server settings
 */
export const devServerDefaults = {
  host: true,
  strictPort: false,
} as const;

/**
 * App-specific ports
 */
export const appPorts = {
  context: 3003,
  permissive: 3004,
  roots: 3005,
} as const;

/**
 * SSG optimization settings
 */
export const ssgOptimizations = {
  // Pre-render concurrency
  prerenderConcurrency: 10,

  // Static file extensions to include
  staticExtensions: [
    '.html',
    '.css',
    '.js',
    '.json',
    '.data',
    '.xml',
    '.txt',
    '.ico',
    '.png',
    '.jpg',
    '.svg',
    '.woff2',
  ],
} as const;
