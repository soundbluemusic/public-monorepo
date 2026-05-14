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

  // 경로 구분자를 슬래시로 통일 (Windows 대비)
  const normalized = id.replace(/\\/g, '/');

  // TanStack 라이브러리 (Router, Query, Virtual, Table)
  // → React 매칭보다 우선 (react-router/react-query 등 react 문자열 포함)
  if (normalized.includes('/@tanstack/')) {
    return 'vendor-tanstack';
  }

  // Radix UI 컴포넌트 (react 문자열 포함 가능 → react보다 먼저)
  if (normalized.includes('/@radix-ui/')) {
    return 'vendor-radix';
  }

  // React core: 정확한 패키지 경로만 매칭
  // /node_modules/react/, /node_modules/react-dom/, scheduler, react-is
  if (
    /\/node_modules\/(\.pnpm\/[^/]+\/node_modules\/)?(react|react-dom|scheduler|react-is)\//.test(
      normalized,
    )
  ) {
    return 'vendor-react';
  }

  // 아이콘 라이브러리
  if (normalized.includes('/lucide-react/')) {
    return 'vendor-icons';
  }

  // 애니메이션 라이브러리
  if (normalized.includes('/framer-motion/') || normalized.includes('/@formkit/auto-animate/')) {
    return 'vendor-animation';
  }

  // 상태 관리 (immer 포함 - zustand/redux가 사용)
  if (normalized.includes('/zustand/') || normalized.includes('/immer/')) {
    return 'vendor-state';
  }

  // IndexedDB 라이브러리
  if (normalized.includes('/dexie/')) {
    return 'vendor-storage';
  }

  // 검색 라이브러리
  if (normalized.includes('/minisearch/')) {
    return 'vendor-search';
  }

  // Zod 스키마
  if (normalized.includes('/zod/')) {
    return 'vendor-schema';
  }

  // D3 시각화 라이브러리 (Roots ConceptGraph)
  if (/\/d3-[a-z-]+\//.test(normalized)) {
    return 'vendor-d3';
  }

  // KaTeX 수식 렌더링 (Roots)
  if (normalized.includes('/katex/')) {
    return 'vendor-katex';
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
        filename: './dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption,
    ],
  });
}

/**
 * TanStack Start + Cloudflare Workers 앱 설정 옵션
 */
export interface TanStackCloudflareConfigOptions {
  /** 앱 이름 (context, roots, permissive) */
  appName: 'context' | 'roots' | 'permissive';
  /** SQLite alias 추가 (context만 필요) */
  sqliteAlias?: boolean;
}

/**
 * TanStack Start + Cloudflare Workers 앱 공통 설정 생성
 *
 * 모든 SSR 앱에서 공통으로 사용하는 build, resolve, define 설정을 반환합니다.
 * 플러그인은 앱에서 직접 설정해야 합니다 (import 순서가 중요하기 때문).
 *
 * @example
 * ```ts
 * // apps/context/vite.config.ts
 * import { cloudflare } from '@cloudflare/vite-plugin';
 * import { getTanStackCloudflareConfig, appPorts } from '@soundblue/config/vite';
 *
 * const config = getTanStackCloudflareConfig({
 *   appName: 'context',
 *   sqliteAlias: true,
 * });
 *
 * export default defineConfig({
 *   server: { port: appPorts.context },
 *   preview: { port: appPorts.context },
 *   ...config,
 *   plugins: [
 *     cloudflare({ viteEnvironment: { name: 'ssr' } }),
 *     // ... other plugins
 *   ],
 * });
 * ```
 */
export function getTanStackCloudflareConfig(options: TanStackCloudflareConfigOptions) {
  const { sqliteAlias = false } = options;

  // Alias 설정
  const alias: Record<string, string> = {
    '@': '/app',
    '~': '/app',
  };

  // Context 앱의 SQLite alias
  if (sqliteAlias) {
    alias['@soundblue/platform/sqlite/types'] = '../../packages/platform/src/sqlite/types.ts';
    alias['@soundblue/platform/sqlite'] = '../../packages/platform/src/sqlite/index.browser.ts';
  }

  return {
    resolve: { alias },
    build: {
      minify: 'terser' as const,
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
      },
      rollupOptions: {
        output: { manualChunks: createManualChunks },
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    },
  };
}
