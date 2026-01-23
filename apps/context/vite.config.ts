import { cloudflare } from '@cloudflare/vite-plugin';
import { paraglideVitePlugin as paraglide } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

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
    rollupOptions: {
      external: ['cloudflare:workers'],
      output: {
        // Inject polyfill at the start of the SSR bundle
        // This runs BEFORE any imports in the bundled output
        banner: `
(function() {
  // Wrap URL to handle TanStack Router's initialization edge cases
  var OriginalURL = globalThis.URL;
  globalThis.URL = function SafeURL(url, base) {
    if (url === undefined || url === null) {
      return new OriginalURL('https://context.soundbluemusic.com/');
    }
    if (typeof url === 'object' && !(url instanceof OriginalURL)) {
      // Handle TanStack Router's internal URL-like objects
      var protocol = url.protocol || 'https:';
      var host = url.host || url.hostname || 'context.soundbluemusic.com';
      var pathname = url.pathname || '/';
      var search = url.search || '';
      return new OriginalURL(protocol + '//' + host + pathname + search);
    }
    return new OriginalURL(url, base);
  };
  globalThis.URL.prototype = OriginalURL.prototype;
  Object.setPrototypeOf(globalThis.URL, OriginalURL);

  // Provide location if missing
  if (!globalThis.location) {
    globalThis.location = {
      protocol: 'https:',
      host: 'context.soundbluemusic.com',
      hostname: 'context.soundbluemusic.com',
      port: '',
      pathname: '/',
      search: '',
      hash: '',
      href: 'https://context.soundbluemusic.com/',
      origin: 'https://context.soundbluemusic.com'
    };
  }
})();
`,
      },
    },
  },
  ssr: {
    external: ['cloudflare:workers'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    // Provide default values for URL-related globals during SSR
    'globalThis.location': JSON.stringify({
      protocol: 'https:',
      hostname: 'context.soundbluemusic.com',
      port: '',
    }),
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({
      srcDirectory: 'app',
    }),
    tailwindcss(),
    paraglide({
      project: './project.inlang',
      outdir: './app/paraglide',
      outputStructure: 'message-modules',
    }),
    VitePWA({
      disable: true, // Temporarily disabled for TanStack Start compatibility
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
