import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  integrations: [react()],
  output: 'server',
  server: { port: 3003 },
  srcDir: './src',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundle passthrough image and JSON logger modules before the Worker starts.
    optimizeDeps: { include: ['astro/assets/services/noop', 'astro/logger/json'] },
    resolve: {
      alias: {
        '@': '/app',
      },
    },
  },
});
