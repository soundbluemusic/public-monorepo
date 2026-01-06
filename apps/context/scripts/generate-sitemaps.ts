/**
 * Sitemap Generator for Context App
 *
 * lightEntries를 사용하여 sitemap 생성 (번들 최적화)
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDynamicUrls, generateSitemaps, type StaticPage } from '@soundblue/seo/sitemap';
import { categories } from '../app/data/categories';
import { lightEntries } from '../app/data/entries';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONFIG = {
  siteUrl: 'https://context.soundbluemusic.com',
  languages: ['en', 'ko'] as const,
  appName: 'Context',
  appSubtitle: 'Context - Korean Meaning Dictionary',
  outputDir: join(__dirname, '../public'),
  buildOutputDir: join(__dirname, '../build/client'),
};

const STATIC_PAGES: StaticPage[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/browse', priority: '0.9', changefreq: 'weekly' },
  { path: '/sitemap', priority: '0.5', changefreq: 'monthly' },
  { path: '/built-with', priority: '0.5', changefreq: 'monthly' },
  { path: '/license', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
];

generateSitemaps(CONFIG, STATIC_PAGES, [
  {
    name: 'categories',
    urls: createDynamicUrls(
      CONFIG.siteUrl,
      '/category',
      categories.map((c) => c.id),
      '0.8',
      'weekly',
      CONFIG.languages,
    ),
  },
  {
    name: 'entries',
    urls: createDynamicUrls(
      CONFIG.siteUrl,
      '/entry',
      lightEntries.map((e) => e.id),
      '0.6',
      'monthly',
      CONFIG.languages,
    ),
  },
]);
