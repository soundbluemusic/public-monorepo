import { paraglideVitePlugin as paraglide } from '@inlang/paraglide-js';
import { reactRouter } from '@react-router/dev/vite';
import { appPorts, productionBuildSettings } from '@soundblue/config/vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: appPorts.roots,
  },
  preview: {
    port: appPorts.roots,
  },
  resolve: {
    alias: {
      '@': '/app',
      '~': '/app',
    },
  },
  build: productionBuildSettings,
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
    }),
  ],
});
