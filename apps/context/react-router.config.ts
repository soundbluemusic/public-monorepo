import type { Config } from '@react-router/dev/config';

export default {
  ssr: false,
  async prerender() {
    // Import data dynamically
    const { meaningEntries } = await import('./app/data/entries/index.js');
    const { categories } = await import('./app/data/categories.js');

    // Base routes
    const baseRoutes = [
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
      '/my-learning',
      '/ko/my-learning',
    ];

    // Dynamic entry routes (e.g., /entry/annyeong, /ko/entry/sarang)
    const entryRoutes = meaningEntries.flatMap((entry) => [
      `/entry/${entry.id}`,
      `/ko/entry/${entry.id}`,
    ]);

    // Dynamic category routes (e.g., /category/greetings, /ko/category/emotions)
    const categoryRoutes = categories.flatMap((category) => [
      `/category/${category.id}`,
      `/ko/category/${category.id}`,
    ]);

    return [...baseRoutes, ...entryRoutes, ...categoryRoutes];
  },
} satisfies Config;
