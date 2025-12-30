/**
 * Sitemap Generator for Permissive App
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDynamicUrls, generateSitemaps, type StaticPage } from '@soundblue/seo/sitemap';
import { getLibrarySlug, libraries } from '../app/data/libraries.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONFIG = {
  siteUrl: 'https://permissive.soundbluemusic.com',
  languages: ['en', 'ko'] as const,
  appName: 'Permissive',
  appSubtitle: 'Permissive - Free Web Dev Tools',
  outputDir: join(__dirname, '../public'),
};

const STATIC_PAGES: StaticPage[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/libraries', priority: '0.9', changefreq: 'weekly' },
  { path: '/web-api', priority: '0.9', changefreq: 'weekly' },
  { path: '/sitemap', priority: '0.5', changefreq: 'monthly' },
];

// Generate library slugs from actual data (Single Source of Truth)
const LIBRARY_SLUGS = libraries.map((lib) => getLibrarySlug(lib.name));

const WEB_APIS = [
  'document',
  'element',
  'event',
  'mutation-observer',
  'intersection-observer',
  'resize-observer',
  'fetch',
  'xmlhttprequest',
  'websocket',
  'server-sent-events',
  'beacon',
  'localstorage',
  'sessionstorage',
  'indexeddb',
  'cache-api',
  'canvas',
  'webgl',
  'webgpu',
  'svg',
  'web-audio',
  'media-recorder',
  'media-stream',
  'speech-synthesis',
  'speech-recognition',
  'web-workers',
  'service-workers',
  'shared-workers',
  'geolocation',
  'clipboard',
  'notifications',
  'vibration',
  'battery-status',
  'history',
  'url',
  'formdata',
  'crypto',
  'performance',
];

generateSitemaps(CONFIG, STATIC_PAGES, [
  {
    name: 'libraries',
    urls: createDynamicUrls(
      CONFIG.siteUrl,
      '/library',
      LIBRARY_SLUGS,
      '0.7',
      'monthly',
      CONFIG.languages,
    ),
  },
  {
    name: 'webapi',
    urls: createDynamicUrls(
      CONFIG.siteUrl,
      '/web-api',
      WEB_APIS,
      '0.7',
      'monthly',
      CONFIG.languages,
    ),
  },
]);
