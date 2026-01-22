import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Config } from '@react-router/dev/config';

function getContentRoutes(dir: string, basePath: string = ''): string[] {
  const routes: string[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      routes.push(...getContentRoutes(fullPath, join(basePath, entry)));
    } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      let routePath = join(basePath, entry.replace(/\.(md|mdx)$/, ''));

      // Handle index files
      if (routePath.endsWith('/index')) {
        routePath = routePath.slice(0, -6);
      }
      if (entry === 'index.md' || entry === 'index.mdx') {
        routePath = basePath;
      }

      // Add trailing slash
      routes.push(`/${routePath}/`.replace(/\/+/g, '/'));
    }
  }

  return routes;
}

export default {
  ssr: false, // GitHub Pages는 정적 호스팅만 지원
  basename: '/public-monorepo',
  async prerender() {
    const contentDir = join(import.meta.dirname, 'content');
    const routes = ['/', ...getContentRoutes(contentDir)];

    // Remove duplicates and sort
    return [...new Set(routes)].sort();
  },
} satisfies Config;
