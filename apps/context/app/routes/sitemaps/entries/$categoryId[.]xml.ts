/**
 * /sitemaps/entries/$categoryId.xml - 카테고리별 엔트리 사이트맵
 *
 * 특정 카테고리의 모든 엔트리 URL을 반환합니다.
 * TanStack Start 공식 API 라우트 패턴 사용.
 */
import { createFileRoute } from '@tanstack/react-router';

const SITE_URL = 'https://context.soundbluemusic.com';

/**
 * D1 데이터베이스에 접근하는 헬퍼 함수
 */
function getD1Database(): D1Database | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { env } = require('cloudflare:workers') as { env: { DB?: D1Database } };
    return env.DB ?? null;
  } catch (error) {
    console.error('[Sitemap] Failed to access Cloudflare env:', error);
    return null;
  }
}

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 */
function getCurrentDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 다국어 URL 생성 헬퍼
 */
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

export const Route = createFileRoute('/sitemaps/entries/$categoryId.xml')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        // params에서 categoryId.xml로 접근 (TanStack Router의 파일 기반 라우팅 규칙)
        const categoryId =
          (params as Record<string, string>)['categoryId.xml']?.replace(/\.xml$/, '') ?? '';
        const db = getD1Database();

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
      },
    },
  },
});
