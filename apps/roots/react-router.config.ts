import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Config } from '@react-router/dev/config';

export default {
  ssr: false,
  async prerender() {
    // Import field data dynamically
    const { fields } = await import('./app/data/fields.js');

    // Load concept IDs from concept-names.json (generated during prebuild)
    const conceptNamesPath = join(process.cwd(), 'public', 'concept-names.json');
    const conceptNames = JSON.parse(readFileSync(conceptNamesPath, 'utf-8'));
    const conceptIds = Object.keys(conceptNames);

    // Base routes
    const baseRoutes = [
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

    // Dynamic concept routes (e.g., /concept/natural-numbers, /ko/concept/matrices)
    const conceptRoutes = conceptIds.flatMap((conceptId) => [
      `/concept/${conceptId}`,
      `/ko/concept/${conceptId}`,
    ]);

    // Dynamic field routes (e.g., /field/algebra, /ko/field/geometry)
    const fieldRoutes = fields.flatMap((field) => [`/field/${field.id}`, `/ko/field/${field.id}`]);

    return [...baseRoutes, ...conceptRoutes, ...fieldRoutes];
  },
} satisfies Config;
