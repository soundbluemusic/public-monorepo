import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'app',
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
  ],
  base: '/public-monorepo/',
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '~': '/app',
    },
  },
});
