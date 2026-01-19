/**
 * 동적 사이트맵 인덱스 라우트 (SSR 모드 전용)
 *
 * D1 데이터베이스를 조회하여 사이트맵 인덱스를 동적 생성합니다.
 *
 * @see https://www.sitemaps.org/protocol.html
 */

import { SITE_URL } from '@/constants';
import { getCategoriesFromD1 } from '@/services/d1';

interface LoaderArgs {
  context: { cloudflare?: { env?: { DB?: D1Database } } };
}

export async function loader({ context }: LoaderArgs) {
  const db = context.cloudflare?.env?.DB;

  if (!db) {
    return new Response('Database not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const categories = await getCategoriesFromD1(db);
  const now = new Date().toISOString().split('T')[0];

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

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
