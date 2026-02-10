/**
 * @fileoverview Shared Vite Configuration
 * @environment build-only
 *
 * Common Vite configuration options shared across apps.
 */

import { paraglideVitePlugin as paraglide } from '@inlang/paraglide-js';
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
      },
    },
  },
} as const;

/**
 * 번들 청킹 전략 함수
 *
 * vendor 라이브러리를 개별 청크로 분리하여:
 * - 캐시 효율 극대화 (변경되지 않는 vendor는 장기 캐시)
 * - 메인 번들 크기 감소
 * - 병렬 로딩 최적화
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { createManualChunks } from '@soundblue/config/vite';
 *
 * export default defineConfig({
 *   build: {
 *     rollupOptions: {
 *       output: { manualChunks: createManualChunks },
 *     },
 *   },
 * });
 * ```
 */
export function createManualChunks(id: string): string | undefined {
  if (!id.includes('node_modules')) return undefined;

  // React core (필수, 장기 캐시)
  if (id.includes('react-dom') || id.includes('/react/')) {
    return 'vendor-react';
  }

  // TanStack 라이브러리 (Router, Query, Virtual, Table)
  if (id.includes('@tanstack')) {
    return 'vendor-tanstack';
  }

  // 아이콘 라이브러리
  if (id.includes('lucide-react')) {
    return 'vendor-icons';
  }

  // 애니메이션 라이브러리
  if (id.includes('framer-motion')) {
    return 'vendor-animation';
  }

  // 상태 관리
  if (id.includes('zustand')) {
    return 'vendor-state';
  }

  // IndexedDB 라이브러리
  if (id.includes('dexie')) {
    return 'vendor-storage';
  }

  // 검색 라이브러리
  if (id.includes('minisearch')) {
    return 'vendor-search';
  }

  // Radix UI 컴포넌트
  if (id.includes('@radix-ui')) {
    return 'vendor-radix';
  }

  return undefined;
}

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
 * Static build optimization settings
 */
export const staticOptimizations = {
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

/**
 * @deprecated Use staticOptimizations instead
 */
export const ssgOptimizations = staticOptimizations;

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
      }) as PluginOption,
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
