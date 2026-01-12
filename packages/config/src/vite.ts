/**
 * @fileoverview Shared Vite Configuration
 * @environment build-only
 *
 * Common Vite configuration options shared across apps.
 */

import { paraglideVitePlugin as paraglide } from '@inlang/paraglide-js';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

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
 * Production build settings (terser minification)
 * Removes console.log and debugger statements in production
 */
export const productionBuildSettings = {
  minify: 'terser' as const,
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
};

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

import type { RuntimeCaching } from 'workbox-build';

/**
 * PWA 런타임 캐싱 프리셋
 */
export const pwaPresets: Record<string, RuntimeCaching[]> = {
  /** Google Fonts 캐싱 (context, permissive 앱용) */
  googleFonts: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
  ],
  /** 캐싱 없음 (roots 앱용) */
  none: [],
};

export interface AppViteConfigOptions {
  /** 개발 서버 포트 */
  port: number;
  /** PWA includeAssets (기본: ['favicon.ico', 'icons/*.svg']) */
  pwaAssets?: string[];
  /** Workbox maximumFileSizeToCacheInBytes (기본: 없음) */
  pwaMaxFileSize?: number;
  /** PWA runtimeCaching 프리셋 (기본: 'googleFonts') */
  pwaCaching?: string;
}

/**
 * 앱별 Vite 설정 생성 팩토리
 *
 * @example
 * ```ts
 * // apps/context/vite.config.ts
 * import { createAppViteConfig } from '@soundblue/config/vite';
 * export default createAppViteConfig({
 *   port: 3003,
 *   pwaMaxFileSize: 35 * 1024 * 1024,
 * });
 * ```
 */
export function createAppViteConfig(options: AppViteConfigOptions) {
  const {
    port,
    pwaAssets = ['favicon.ico', 'icons/*.svg'],
    pwaMaxFileSize,
    pwaCaching = 'googleFonts',
  } = options;

  return defineConfig({
    server: { port },
    preview: { port },
    resolve: {
      alias: { '@': '/app', '~': '/app' },
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
      },
    },
    plugins: [
      tailwindcss(),
      paraglide({
        project: './project.inlang',
        outdir: './app/paraglide',
        outputStructure: 'message-modules',
      }),
      reactRouter(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: pwaAssets,
        manifest: false,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          ...(pwaMaxFileSize && { maximumFileSizeToCacheInBytes: pwaMaxFileSize }),
          runtimeCaching: pwaPresets[pwaCaching],
        },
      }),
      visualizer({
        filename: './build/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption,
    ],
  });
}
