/**
 * @fileoverview D1 데이터베이스에서 사이트맵 XML 파일 생성
 *
 * 이 스크립트는 wrangler CLI를 통해 D1 데이터베이스를 쿼리하고
 * 정적 사이트맵 XML 파일을 생성합니다.
 *
 * 사용법: pnpm sitemap
 */

import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist', 'client');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const BASE_URL = 'https://context.soundbluemusic.com';
const DATABASE_NAME = 'context-db';

// Static pages for sitemap-pages.xml
const STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/browse', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/bookmarks', changefreq: 'weekly', priority: '0.5' },
  { path: '/my-learning', changefreq: 'weekly', priority: '0.5' },
];

interface Category {
  id: string;
  name_ko: string;
  name_en: string;
}

interface EntryId {
  id: string;
}

/**
 * wrangler를 통해 D1 SQL 쿼리 실행
 */
function executeD1Query<T>(sql: string): T[] {
  try {
    // --json 플래그로 JSON 출력
    const command = `wrangler d1 execute ${DATABASE_NAME} --json --command "${sql.replace(/"/g, '\\"')}"`;
    const result = execSync(command, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // wrangler output은 배열 형태: [{ results: [...] }]
    const parsed = JSON.parse(result);
    if (Array.isArray(parsed) && parsed[0]?.results) {
      return parsed[0].results as T[];
    }
    return [];
  } catch (error) {
    console.error(`D1 쿼리 실행 실패: ${sql}`);
    console.error(error);
    return [];
  }
}

/**
 * XML 헤더 생성
 */
function xmlHeader(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>`;
}

/**
 * URL 항목 생성 (hreflang 포함)
 */
function urlEntry(path: string, changefreq = 'weekly', priority = '0.8'): string {
  const enUrl = `${BASE_URL}${path}`;
  const koUrl = `${BASE_URL}/ko${path}`;

  return `  <url>
    <loc>${enUrl}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${koUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>`;
}

/**
 * 사이트맵 인덱스 생성
 */
function generateSitemapIndex(categories: Category[]): string {
  const today = new Date().toISOString().split('T')[0];

  const sitemaps = [
    `  <sitemap>
    <loc>${BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`,
    `  <sitemap>
    <loc>${BASE_URL}/sitemap-categories.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`,
    ...categories.map(
      (cat) => `  <sitemap>
    <loc>${BASE_URL}/sitemap-entry-${cat.id}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`,
    ),
  ];

  return `${xmlHeader()}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join('\n')}
</sitemapindex>`;
}

/**
 * 정적 페이지 사이트맵 생성
 */
function generatePagesSitemap(): string {
  const urls = STATIC_PAGES.map((page) => urlEntry(page.path, page.changefreq, page.priority));

  return `${xmlHeader()}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
}

/**
 * 카테고리 사이트맵 생성
 */
function generateCategoriesSitemap(categories: Category[]): string {
  const urls = categories.map((cat) => urlEntry(`/category/${cat.id}`, 'weekly', '0.8'));

  return `${xmlHeader()}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
}

/**
 * 엔트리 사이트맵 생성 (카테고리별)
 */
function generateEntrySitemap(_categoryId: string, entryIds: string[]): string {
  const urls = entryIds.map((id) => urlEntry(`/entry/${id}`, 'monthly', '0.7'));

  return `${xmlHeader()}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
}

async function main() {
  console.log('🗺️  사이트맵 생성 시작...\n');

  // dist/client 디렉토리 확인/생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log('⚠️  dist/client 디렉토리가 없습니다. 빌드 후 실행하거나 public/에 저장합니다.\n');
    // public/ 디렉토리에 저장
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }
  }

  const targetDir = fs.existsSync(OUTPUT_DIR) ? OUTPUT_DIR : PUBLIC_DIR;
  console.log(`📁 출력 디렉토리: ${targetDir}\n`);

  // D1에서 카테고리 조회
  console.log('📊 D1에서 카테고리 조회 중...');
  const categories = executeD1Query<Category>(
    'SELECT id, name_ko, name_en FROM categories ORDER BY sort_order',
  );
  console.log(`   ${categories.length}개 카테고리 발견\n`);

  if (categories.length === 0) {
    console.error('❌ 카테고리를 찾을 수 없습니다. D1 연결을 확인하세요.');
    process.exit(1);
  }

  // 사이트맵 인덱스 생성
  console.log('📝 사이트맵 파일 생성 중...');
  const sitemapIndex = generateSitemapIndex(categories);
  fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), sitemapIndex, 'utf8');
  console.log(`  ✓ sitemap.xml (인덱스, ${categories.length + 2}개 사이트맵 참조)`);

  // 정적 페이지 사이트맵
  const pagesSitemap = generatePagesSitemap();
  fs.writeFileSync(path.join(targetDir, 'sitemap-pages.xml'), pagesSitemap, 'utf8');
  console.log(`  ✓ sitemap-pages.xml (${STATIC_PAGES.length}개 정적 페이지)`);

  // 카테고리 사이트맵
  const categoriesSitemap = generateCategoriesSitemap(categories);
  fs.writeFileSync(path.join(targetDir, 'sitemap-categories.xml'), categoriesSitemap, 'utf8');
  console.log(`  ✓ sitemap-categories.xml (${categories.length}개 카테고리)`);

  // 카테고리별 엔트리 사이트맵
  console.log('\n📝 카테고리별 엔트리 사이트맵 생성 중...');
  let totalEntries = 0;

  for (const category of categories) {
    const entryIds = executeD1Query<EntryId>(
      `SELECT id FROM entries WHERE category_id = '${category.id}'`,
    );
    const ids = entryIds.map((e) => e.id);

    if (ids.length > 0) {
      const entrySitemap = generateEntrySitemap(category.id, ids);
      fs.writeFileSync(
        path.join(targetDir, `sitemap-entry-${category.id}.xml`),
        entrySitemap,
        'utf8',
      );
      console.log(`  ✓ sitemap-entry-${category.id}.xml (${ids.length}개 엔트리)`);
      totalEntries += ids.length;
    }
  }

  console.log(`\n✅ 사이트맵 생성 완료!`);
  console.log(`   - 총 ${totalEntries}개 엔트리`);
  console.log(`   - ${categories.length + 2}개 사이트맵 파일`);
  console.log(`   - 출력 위치: ${targetDir}`);
}

main().catch(console.error);
