/**
 * API Handlers - TanStack Start 외부에서 처리되는 API 라우트
 *
 * TanStack Start는 loader에서 Response 객체 직접 반환을 지원하지 않습니다.
 * API 전용 라우트(sitemap, offline-db 등)는 server.tsx에서 인터셉트하여 처리합니다.
 */

const SITE_URL = 'https://context.soundbluemusic.com';

interface CloudflareEnv {
  DB: D1Database;
}

export interface RequestContext {
  cloudflare?: { env: unknown };
}

/** Type guard to check if env has D1 database */
function getDb(context: RequestContext): D1Database | null {
  const env = context?.cloudflare?.env as CloudflareEnv | undefined;
  return env?.DB ?? null;
}

// ============================================================================
// Helpers
// ============================================================================

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

const xmlHeaders = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
};

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=3600',
};

// ============================================================================
// /sitemap.xml - Sitemap Index
// ============================================================================

async function handleSitemapIndex(context: RequestContext): Promise<Response> {
  const db = getDb(context);

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

// ============================================================================
// /sitemap-pages.xml - Static Pages Sitemap
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

// ============================================================================
// /sitemap-categories.xml - Categories Sitemap
// ============================================================================

async function handleSitemapCategories(context: RequestContext): Promise<Response> {
  const db = getDb(context);

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

// ============================================================================
// /sitemaps/entries/:categoryId.xml - Entry Sitemap by Category
// ============================================================================

async function handleSitemapEntries(
  context: RequestContext,
  categoryId: string,
): Promise<Response> {
  const db = getDb(context);

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

// ============================================================================
// /api/offline-db - Offline Database Dump
// ============================================================================

async function handleOfflineDb(context: RequestContext): Promise<Response> {
  const db = getDb(context);

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
// Main Router
// ============================================================================

/**
 * API 라우트 매칭 및 핸들러 실행
 * @returns Response if matched, null if not an API route
 */
export async function handleApiRoute(
  request: Request,
  context: RequestContext,
): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Sitemap routes
  if (pathname === '/sitemap.xml') {
    return handleSitemapIndex(context);
  }

  if (pathname === '/sitemap-pages.xml') {
    return handleSitemapPages();
  }

  if (pathname === '/sitemap-categories.xml') {
    return handleSitemapCategories(context);
  }

  // /sitemaps/entries/:categoryId.xml
  const entrySitemapMatch = pathname.match(/^\/sitemaps\/entries\/([^/]+)\.xml$/);
  if (entrySitemapMatch?.[1]) {
    return handleSitemapEntries(context, entrySitemapMatch[1]);
  }

  // API routes
  if (pathname === '/api/offline-db') {
    return handleOfflineDb(context);
  }

  // Not an API route - pass to TanStack Start
  return null;
}
