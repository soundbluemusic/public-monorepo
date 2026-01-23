import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/public-monorepo/',
  server: { port: 3006 },
  preview: { port: 3006 },
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
      providerImportSource: '@mdx-js/react',
    }),
    tanstackStart({
      srcDirectory: 'app',
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/app',
      '@/content': '/content',
    },
  },
});
