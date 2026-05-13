/**
 * Sitemap Generator for Permissive App
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDynamicUrls, generateSitemaps, type StaticPage } from '@soundblue/seo/sitemap';
import { getLibrarySlug, libraries } from '../app/data/libraries.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Single source of truth: read base URL from app/data/site.json so this script,
// app/config.ts, and scripts/inject-polyfill.mjs all pull from the same file.
const SITE_JSON_PATH = join(__dirname, '../app/data/site.json');
const siteConfig = JSON.parse(readFileSync(SITE_JSON_PATH, 'utf8')) as { baseUrl?: unknown };
if (typeof siteConfig.baseUrl !== 'string' || !/^https?:\/\//.test(siteConfig.baseUrl)) {
  throw new Error(
    `[generate-sitemaps] Invalid baseUrl in ${SITE_JSON_PATH}: ${JSON.stringify(siteConfig.baseUrl)}`,
  );
}

const CONFIG = {
  siteUrl: siteConfig.baseUrl.replace(/\/$/, ''),
  languages: ['en', 'ko'] as const,
  appName: 'Permissive',
  appSubtitle: 'Permissive - Free Web Dev Tools',
  outputDir: join(__dirname, '../public'),
  buildOutputDir: join(__dirname, '../dist/client'),
};

const STATIC_PAGES: StaticPage[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/libraries', priority: '0.9', changefreq: 'weekly' },
  { path: '/web-api', priority: '0.9', changefreq: 'weekly' },
  { path: '/sitemap', priority: '0.3', changefreq: 'monthly' },
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

// Trailing slash required for Cloudflare Workers Assets
// Workers Assets serves folder/index.html with 307 redirect to folder/
// Sitemap URLs must match the final canonical URL with trailing slash
const TRAILING_SLASH = true;

generateSitemaps(CONFIG, STATIC_PAGES, [
  {
    name: 'libraries',
    urls: createDynamicUrls(
      CONFIG.siteUrl,
      '/library',
      LIBRARY_SLUGS,
      '0.8',
      'monthly',
      CONFIG.languages,
      TRAILING_SLASH,
    ),
  },
  {
    name: 'webapi',
    urls: createDynamicUrls(
      CONFIG.siteUrl,
      '/web-api',
      WEB_APIS,
      '0.8',
      'monthly',
      CONFIG.languages,
      TRAILING_SLASH,
    ),
  },
]);
