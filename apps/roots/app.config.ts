import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@solidjs/start/config';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// 빌드 시점에 search-index.json에서 concept ID 목록 로드
function getConceptRoutes(): string[] {
  try {
    const indexPath = fileURLToPath(new URL('./public/search-index.json', import.meta.url));
    const data = JSON.parse(readFileSync(indexPath, 'utf-8')) as { id: string }[];
    const routes: string[] = [];
    for (const item of data) {
      routes.push(`/concept/${item.id}`);
      routes.push(`/ko/concept/${item.id}`);
    }
    return routes;
  } catch {
    console.warn('search-index.json not found, skipping concept routes');
    return [];
  }
}

export default defineConfig({
  ssr: true,
  server: {
    preset: 'static',
    logLevel: 0, // 0=silent, 1=error, 2=warn, 3=info (default)
    prerender: {
      crawlLinks: true,
      routes: ['/', '/ko', ...getConceptRoutes()],
    },
  },
  vite: {
    server: {
      port: 3005,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'icons/*.svg'],
        manifest: false,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: {
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'katex-cdn',
                expiration: {
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
          ],
        },
      }),
    ],
  },
});
