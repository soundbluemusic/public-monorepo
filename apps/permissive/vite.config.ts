import { paraglideVitePlugin as paraglide } from '@inlang/paraglide-js';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: 3004,
  },
  preview: {
    port: 3004,
  },
  resolve: {
    alias: {
      '@': '/app',
      '~': '/app',
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
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
        ],
      },
    }),
    visualizer({
      filename: './build/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
