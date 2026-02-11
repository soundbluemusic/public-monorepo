import { cloudflare } from '@cloudflare/vite-plugin';
import { paraglideVitePlugin as paraglide } from '@inlang/paraglide-js';
import { appPorts, getTanStackCloudflareConfig } from '@soundblue/config/vite';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const config = getTanStackCloudflareConfig({ appName: 'context', sqliteAlias: true });

export default defineConfig({
  server: { port: appPorts.context },
  preview: { port: appPorts.context },
  ...config,
  plugins: [
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({ srcDirectory: 'app' }),
    react(),
    paraglide({
      project: './project.inlang',
      outdir: './app/paraglide',
      outputStructure: 'message-modules',
    }),
    VitePWA({ disable: true }),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }) as PluginOption,
  ],
});
