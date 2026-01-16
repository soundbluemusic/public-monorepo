import { paraglideVitePlugin as paraglide } from '@inlang/paraglide-js';
import { reactRouter } from '@react-router/dev/vite';
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Context 앱 Vite 설정
 *
 * SSR 모드: Cloudflare Pages Functions + D1
 * SSG 모드: 정적 HTML 생성 (레거시)
 *
 * BUILD_MODE 환경변수로 모드 선택:
 * - ssr: Cloudflare Pages Functions (D1 사용)
 * - ssg: 정적 빌드 (기존 방식)
 */

const isSSR = process.env.BUILD_MODE === 'ssr';

export default defineConfig({
  server: { port: 3003 },
  preview: { port: 3003 },
  resolve: {
    alias: {
      '@': '/app',
      '~': '/app',
      '@soundblue/platform/sqlite/types': '../../packages/platform/src/sqlite/types.ts',
      '@soundblue/platform/sqlite': '../../packages/platform/src/sqlite/index.browser.ts',
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
  },
  // Cloudflare Workers 환경에서 process.env를 대체
  ssr: {
    target: 'webworker',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  plugins: [
    tailwindcss(),
    paraglide({
      project: './project.inlang',
      outdir: './app/paraglide',
      outputStructure: 'message-modules',
    }),
    // SSR 모드에서만 Cloudflare dev proxy 사용
    ...(isSSR ? [cloudflareDevProxy()] : []),
    reactRouter(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.svg'],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 35 * 1024 * 1024, // 35MB
        runtimeCaching: [
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
