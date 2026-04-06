/**
 * TanStack Start Custom Server Entry
 *
 * 이 파일은 서버 요청을 처리하는 진입점입니다.
 * API 라우트(sitemap, offline-db)를 먼저 처리하고 나머지는 TanStack Start로 전달합니다.
 */

import tanstackHandler from '@tanstack/react-start/server-entry';

// ============================================================================
// Helpers
// ============================================================================

const SITE_URL = 'https://context.soundbluemusic.com';

/** 콘텐츠 최종 수정일 (빌드 타임스탬프에서 자동 생성) */
declare const __BUILD_DATE__: string;
const CONTENT_LAST_MODIFIED =
  typeof __BUILD_DATE__ !== 'undefined'
    ? __BUILD_DATE__
    : new Date().toISOString().split('T')[0];

/**
 * URL 경로의 각 세그먼트를 퍼센트 인코딩합니다.
 * 한글 등 비ASCII 문자가 포함된 entry ID를 올바르게 인코딩합니다.
 *
 * @example encodePathForSitemap('/entry/d-foo-된jang') → '/entry/d-foo-%EB%90%9Cjang'
 */
function encodePathForSitemap(path: string): string {
  return path
    .split('/')
    .map((segment) => (segment ? encodeURIComponent(segment) : ''))
    .join('/');
}

function generateBilingualUrl(
  path: string,
  priority: string,
  changefreq: string,
  lastmod: string,
): string {
  const encodedPath = encodePathForSitemap(path);
  const enUrl = `${SITE_URL}${encodedPath}`;
  const koUrl = `${SITE_URL}/ko${encodedPath === '/' ? '' : encodedPath}`;

  return `  <url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${koUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
  <url>
    <loc>${koUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${koUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>`;
}

interface CloudflareEnv {
  DB?: D1Database;
}

function getD1Database(env: CloudflareEnv): D1Database | null {
  return env?.DB ?? null;
}

const xmlHeaders = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
};

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=3600',
};

// ============================================================================
// API Route Handlers
// ============================================================================

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/browse', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/conversations', priority: '0.8', changefreq: 'weekly' },
  { path: '/tags', priority: '0.7', changefreq: 'weekly' },
  { path: '/download', priority: '0.5', changefreq: 'monthly' },
  { path: '/sitemap', priority: '0.3', changefreq: 'monthly' },
  { path: '/built-with', priority: '0.3', changefreq: 'monthly' },
  { path: '/license', priority: '0.1', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.1', changefreq: 'yearly' },
  { path: '/terms', priority: '0.1', changefreq: 'yearly' },
];

async function handleSitemapIndex(env: CloudflareEnv): Promise<Response> {
  const db = getD1Database(env);

  if (!db) {
    return new Response('Database not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  try {
    const { results: categories } = await db
      .prepare('SELECT id FROM categories ORDER BY sort_order')
      .all<{ id: string }>();

    const sitemaps = [
      { loc: `${SITE_URL}/sitemap-pages.xml`, lastmod: CONTENT_LAST_MODIFIED },
      { loc: `${SITE_URL}/sitemap-categories.xml`, lastmod: CONTENT_LAST_MODIFIED },
      { loc: `${SITE_URL}/sitemap-conversations.xml`, lastmod: CONTENT_LAST_MODIFIED },
      { loc: `${SITE_URL}/sitemap-tags.xml`, lastmod: CONTENT_LAST_MODIFIED },
      ...categories.map((cat) => ({
        loc: `${SITE_URL}/sitemaps/entries/${cat.id}.xml`,
        lastmod: CONTENT_LAST_MODIFIED,
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`,
  )
  .join('\n')}
</sitemapindex>`;

    return new Response(xml, { headers: xmlHeaders });
  } catch (error) {
    console.error('Failed to generate sitemap index:', error);
    return new Response('Failed to generate sitemap', { status: 500 });
  }
}

function handleSitemapPages(): Response {
  const urls = STATIC_PAGES.map((page) =>
    generateBilingualUrl(page.path, page.priority, page.changefreq, CONTENT_LAST_MODIFIED),
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(xml, { headers: xmlHeaders });
}

async function handleSitemapCategories(env: CloudflareEnv): Promise<Response> {
  const db = getD1Database(env);

  if (!db) {
    return new Response('Database not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  try {
    const { results: categories } = await db
      .prepare('SELECT id FROM categories ORDER BY sort_order')
      .all<{ id: string }>();

    const urls = categories
      .map((cat) =>
        generateBilingualUrl(`/category/${cat.id}`, '0.8', 'weekly', CONTENT_LAST_MODIFIED),
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

    return new Response(xml, { headers: xmlHeaders });
  } catch (error) {
    console.error('Failed to generate categories sitemap:', error);
    return new Response('Failed to generate sitemap', { status: 500 });
  }
}

async function handleSitemapEntries(env: CloudflareEnv, categoryId: string): Promise<Response> {
  const db = getD1Database(env);

  if (!db) {
    return new Response('Database not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  try {
    const { results: entries } = await db
      .prepare('SELECT id FROM entries WHERE category_id = ?')
      .bind(categoryId)
      .all<{ id: string }>();

    if (entries.length === 0) {
      return new Response('Category not found or empty', { status: 404 });
    }

    const urls = entries
      .map((entry) =>
        generateBilingualUrl(`/entry/${entry.id}`, '0.8', 'monthly', CONTENT_LAST_MODIFIED),
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

    return new Response(xml, { headers: xmlHeaders });
  } catch (error) {
    console.error(`Failed to generate entry sitemap for ${categoryId}:`, error);
    return new Response('Failed to generate sitemap', { status: 500 });
  }
}

async function handleSitemapConversations(env: CloudflareEnv): Promise<Response> {
  const db = getD1Database(env);

  if (!db) {
    return new Response('Database not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  try {
    const { results: categories } = await db
      .prepare('SELECT DISTINCT category_id FROM conversations ORDER BY category_id')
      .all<{ category_id: string }>();

    const urls = categories
      .map((cat) =>
        generateBilingualUrl(
          `/conversations/${cat.category_id}`,
          '0.7',
          'monthly',
          CONTENT_LAST_MODIFIED,
        ),
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

    return new Response(xml, { headers: xmlHeaders });
  } catch (error) {
    console.error('Failed to generate conversations sitemap:', error);
    return new Response('Failed to generate sitemap', { status: 500 });
  }
}

async function handleSitemapTags(env: CloudflareEnv): Promise<Response> {
  const db = getD1Database(env);

  if (!db) {
    return new Response('Database not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  try {
    const { results } = await db
      .prepare("SELECT tags FROM entries WHERE tags IS NOT NULL AND tags != '[]'")
      .all<{ tags: string }>();

    const uniqueTags = new Set<string>();
    for (const row of results) {
      try {
        const tags = JSON.parse(row.tags) as string[];
        for (const tag of tags) {
          uniqueTags.add(tag);
        }
      } catch (error) {
        console.warn(`[Sitemap] Invalid JSON in tags: ${String(row.tags).slice(0, 100)}`, error);
      }
    }

    const sortedTags = Array.from(uniqueTags).sort();

    const urls = sortedTags
      .map((tag) => generateBilingualUrl(`/tag/${tag}`, '0.5', 'monthly', CONTENT_LAST_MODIFIED))
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

    return new Response(xml, { headers: xmlHeaders });
  } catch (error) {
    console.error('Failed to generate tags sitemap:', error);
    return new Response('Failed to generate sitemap', { status: 500 });
  }
}

async function handleOfflineDb(env: CloudflareEnv): Promise<Response> {
  const db = getD1Database(env);

  if (!db) {
    return new Response(JSON.stringify({ error: 'Database not available' }), {
      status: 503,
      headers: jsonHeaders,
    });
  }

  try {
    const [entries, categories, conversations] = await Promise.all([
      db
        .prepare(
          `SELECT id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations
           FROM entries`,
        )
        .all(),
      db
        .prepare(
          `SELECT id, name_ko, name_en, description_ko, description_en, icon, color, sort_order
           FROM categories`,
        )
        .all(),
      db.prepare(`SELECT id, category_id, title_ko, title_en, dialogue FROM conversations`).all(),
    ]);

    const data = {
      version: Date.now(),
      tables: {
        entries: entries.results,
        categories: categories.results,
        conversations: conversations.results,
      },
      meta: {
        entriesCount: entries.results.length,
        categoriesCount: categories.results.length,
        conversationsCount: conversations.results.length,
      },
    };

    return new Response(JSON.stringify(data), {
      headers: {
        ...jsonHeaders,
        'X-Data-Version': String(data.version),
      },
    });
  } catch (error) {
    console.error('Failed to dump D1 database:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to export database',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: jsonHeaders,
      },
    );
  }
}

// ============================================================================
// API Router
// ============================================================================

async function handleApiRoute(request: Request, env: CloudflareEnv): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Sitemap routes
  if (pathname === '/sitemap.xml') {
    return handleSitemapIndex(env);
  }

  if (pathname === '/sitemap-pages.xml') {
    return handleSitemapPages();
  }

  if (pathname === '/sitemap-categories.xml') {
    return handleSitemapCategories(env);
  }

  if (pathname === '/sitemap-conversations.xml') {
    return handleSitemapConversations(env);
  }

  if (pathname === '/sitemap-tags.xml') {
    return handleSitemapTags(env);
  }

  // /sitemaps/entries/:categoryId.xml
  const entrySitemapMatch = pathname.match(/^\/sitemaps\/entries\/([^/]+)\.xml$/);
  if (entrySitemapMatch?.[1]) {
    return handleSitemapEntries(env, entrySitemapMatch[1]);
  }

  // Legacy sitemap URL redirect: /sitemap-entry-{categoryId}.xml → /sitemaps/entries/{categoryId}.xml
  const legacySitemapMatch = pathname.match(/^\/sitemap-entry-([^/]+)\.xml$/);
  if (legacySitemapMatch?.[1]) {
    const newUrl = `${SITE_URL}/sitemaps/entries/${legacySitemapMatch[1]}.xml`;
    return new Response(null, {
      status: 301,
      headers: { Location: newUrl },
    });
  }

  // API routes
  if (pathname === '/api/offline-db') {
    return handleOfflineDb(env);
  }

  // Not an API route - pass to TanStack Start
  return null;
}

// ============================================================================
// Security Headers (Workers에서는 _headers 파일이 적용되지 않으므로 직접 설정)
// ============================================================================

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

/**
 * Last-Modified 날짜를 HTTP 형식으로 변환
 * @example "2026-01-25" → "Sat, 25 Jan 2026 00:00:00 GMT"
 */
function getLastModifiedHeader(): string {
  const date = new Date(CONTENT_LAST_MODIFIED);
  return date.toUTCString();
}

/**
 * ETag 생성 (콘텐츠 버전 기반)
 * FNV-1a 32-bit hash로 pathname을 해싱하여 경로별 고유 ETag 생성
 */
function generateETag(pathname: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < pathname.length; i++) {
    hash ^= pathname.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hashHex = (hash >>> 0).toString(16);
  return `"${CONTENT_LAST_MODIFIED}-${hashHex}"`;
}

/**
 * If-Modified-Since 헤더 확인
 * 클라이언트 캐시가 유효하면 304 응답 반환
 */
function shouldReturn304(request: Request): boolean {
  const ifModifiedSince = request.headers.get('If-Modified-Since');
  if (!ifModifiedSince) return false;

  const clientDate = new Date(ifModifiedSince);
  const lastModified = new Date(CONTENT_LAST_MODIFIED);

  // 클라이언트 캐시가 최신이면 304
  return clientDate >= lastModified;
}

/**
 * If-None-Match 헤더 확인
 */
function etagMatches(request: Request, etag: string): boolean {
  const ifNoneMatch = request.headers.get('If-None-Match');
  if (!ifNoneMatch) return false;

  return ifNoneMatch === etag || ifNoneMatch === `W/${etag}`;
}

// ============================================================================
// Server Handler
// ============================================================================

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check for API routes first
    const apiResponse = await handleApiRoute(request, env);
    if (apiResponse) {
      return apiResponse;
    }

    // HTML 요청에 대해 304 응답 가능 여부 확인
    const etag = generateETag(pathname);
    if (request.method === 'GET') {
      // If-None-Match 또는 If-Modified-Since 확인
      if (etagMatches(request, etag) || shouldReturn304(request)) {
        return new Response(null, {
          status: 304,
          headers: {
            ETag: etag,
            'Last-Modified': getLastModifiedHeader(),
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        });
      }
    }

    // Pass to TanStack Start for page routes
    // @ts-expect-error - TanStack Start internal handler
    const response = await tanstackHandler.fetch(request, env, ctx);

    // HTML 응답에 Cache-Control + 보안 헤더 + ETag + Last-Modified 추가
    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('text/html')) {
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      newResponse.headers.set('Last-Modified', getLastModifiedHeader());
      newResponse.headers.set('ETag', etag);
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        newResponse.headers.set(key, value);
      }
      return newResponse;
    }

    return response;
  },
};
