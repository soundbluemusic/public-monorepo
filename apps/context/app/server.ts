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

function getCurrentDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function generateBilingualUrl(
  path: string,
  priority: string,
  changefreq: string,
  now: string,
): string {
  const enUrl = `${SITE_URL}${path}`;
  const koUrl = `${SITE_URL}/ko${path === '/' ? '' : path}`;

  return `  <url>
    <loc>${enUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${koUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
  <url>
    <loc>${koUrl}</loc>
    <lastmod>${now}</lastmod>
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
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/browse', priority: '0.9', changefreq: 'weekly' },
  { path: '/download', priority: '0.7', changefreq: 'monthly' },
  { path: '/built-with', priority: '0.5', changefreq: 'monthly' },
  { path: '/license', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
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

    const now = getCurrentDateString();
    const sitemaps = [
      { loc: `${SITE_URL}/sitemap-pages.xml`, lastmod: now },
      { loc: `${SITE_URL}/sitemap-categories.xml`, lastmod: now },
      ...categories.map((cat) => ({
        loc: `${SITE_URL}/sitemaps/entries/${cat.id}.xml`,
        lastmod: now,
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
  const now = getCurrentDateString();
  const urls = STATIC_PAGES.map((page) =>
    generateBilingualUrl(page.path, page.priority, page.changefreq, now),
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

    const now = getCurrentDateString();
    const urls = categories
      .map((cat) => generateBilingualUrl(`/category/${cat.id}`, '0.8', 'weekly', now))
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

    const now = getCurrentDateString();
    const urls = entries
      .map((entry) => generateBilingualUrl(`/entry/${entry.id}`, '0.6', 'monthly', now))
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
// Server Handler
// ============================================================================

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    // Check for API routes first
    const apiResponse = await handleApiRoute(request, env);
    if (apiResponse) {
      return apiResponse;
    }

    // Pass to TanStack Start for page routes
    // @ts-expect-error - TanStack Start internal handler
    return tanstackHandler.fetch(request, env, ctx);
  },
};
