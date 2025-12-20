import type { Config } from '@react-router/dev/config';

export default {
  ssr: false,
  async prerender() {
    const routes = [
      '/',
      '/ko',
      '/browse',
      '/ko/browse',
      '/search',
      '/ko/search',
      '/favorites',
      '/ko/favorites',
      '/constants',
      '/ko/constants',
      '/about',
      '/ko/about',
    ];

    // Dynamic concept routes will be generated from search-index.json
    return routes;
  },
  buildDirectory: '.output',
} satisfies Config;
