/**
 * /sitemap.xml - 사이트맵 인덱스
 *
 * 카테고리별 사이트맵 목록을 반환합니다.
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

const xmlHeaders = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
};

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const db = getD1Database();

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
      },
    },
  },
});
