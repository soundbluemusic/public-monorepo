/**
 * Sitemap Generator for Context App
 *
 * lightEntries를 카테고리별로 분리하여 sitemap 생성
 * - sitemap-entries.xml (단일 파일) → sitemap-entry-{categoryId}.xml (카테고리별 분리)
 * - 확장성: 100만 개 이상 엔트리 대비 (Google 제한: 사이트맵당 50,000 URL)
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

// ============================================================================
// 카테고리별 엔트리 그룹화
// ============================================================================

/** 카테고리 ID → 엔트리 ID 배열 맵 */
const entriesByCategory = new Map<string, string[]>();

for (const entry of lightEntries) {
  const ids = entriesByCategory.get(entry.categoryId) ?? [];
  ids.push(entry.id);
  entriesByCategory.set(entry.categoryId, ids);
}

// 카테고리별 사이트맵 생성
const entrySitemaps = categories.map((category) => {
  const entryIds = entriesByCategory.get(category.id) ?? [];
  return {
    name: `entry-${category.id}`,
    urls: createDynamicUrls(CONFIG.siteUrl, '/entry', entryIds, '0.6', 'monthly', CONFIG.languages),
  };
});

// 엔트리가 있는 카테고리만 필터링
const nonEmptySitemaps = entrySitemaps.filter((s) => s.urls.length > 0);

console.log(`📊 카테고리별 엔트리 분포:`);
for (const sitemap of nonEmptySitemaps) {
  const categoryId = sitemap.name.replace('entry-', '');
  const entryCount = (entriesByCategory.get(categoryId) ?? []).length;
  console.log(`   ${categoryId}: ${entryCount}개 엔트리`);
}
console.log('');

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
  ...nonEmptySitemaps,
]);
