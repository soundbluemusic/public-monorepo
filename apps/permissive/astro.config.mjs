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
    server: { port: 3004 },
    preview: { port: 3004 },
  },
});
