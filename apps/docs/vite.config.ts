import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/public-monorepo/',
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
      providerImportSource: '@mdx-js/react',
    }),
    reactRouter(),
  ],
  resolve: {
    alias: {
      '@': '/app',
      '@/content': '/content',
    },
  },
});
