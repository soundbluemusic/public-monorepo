import type { Config } from '@react-router/dev/config';

export default {
  ssr: false,
  async prerender() {
    // Base routes
    const routes = [
      '/',
      '/ko',
      '/browse',
      '/ko/browse',
      '/about',
      '/ko/about',
      '/sitemap',
      '/ko/sitemap',
      '/privacy',
      '/ko/privacy',
      '/terms',
      '/ko/terms',
      '/license',
      '/ko/license',
      '/built-with',
      '/ko/built-with',
    ];

    // Dynamic routes will be added by generate-sitemaps.ts
    return routes;
  },
} satisfies Config;
