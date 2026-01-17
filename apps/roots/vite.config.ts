import { paraglideVitePlugin as paraglide } from '@inlang/paraglide-js';
import { reactRouter } from '@react-router/dev/vite';
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: { port: 3005 },
  preview: { port: 3005 },
  resolve: {
    alias: { '@': '/app', '~': '/app' },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
  },
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
    cloudflareDevProxy(),
    reactRouter(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.svg', 'icons/*.svg'],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [],
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
