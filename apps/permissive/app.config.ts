import { defineConfig } from '@solidjs/start/config';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  server: {
    preset: 'static',
    prerender: {
      routes: [
        '/',
        '/web-api',
        '/libraries',
      ],
    },
  },
  vite: {
    server: {
      port: 3004,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [tailwindcss()],
  },
});
