/**
 * 동적 사이트맵 인덱스 라우트 (SSR 모드 전용)
 *
 * SSR 모드에서 D1 데이터베이스를 조회하여 사이트맵 인덱스를 동적 생성합니다.
 * SSG 모드에서는 빌드 스크립트(generate-sitemaps.ts)로 정적 파일이 생성됩니다.
 *
 * @see https://www.sitemaps.org/protocol.html
 */

import { getCategoriesFromD1 } from '@/services/d1';

const SITE_URL = 'https://context.soundbluemusic.com';

interface LoaderContext {
  cloudflare?: { env?: { DB?: D1Database } };
}

export async function loader({ context }: { context: LoaderContext }) {
  // SSR 모드에서만 D1 사용
  const db = context?.cloudflare?.env?.DB;

  if (!db) {
    // SSG 모드: 정적 파일로 리다이렉트
    throw new Response(null, {
      status: 302,
      headers: { Location: '/sitemap.xml' },
    });
  }

  const categories = await getCategoriesFromD1(db);
  const now = new Date().toISOString().split('T')[0];

  const sitemaps = [
    { loc: `${SITE_URL}/sitemap-pages.xml`, lastmod: now },
    { loc: `${SITE_URL}/sitemap-categories.xml`, lastmod: now },
    ...categories.map((cat) => ({
      loc: `${SITE_URL}/sitemap-entry-${cat.id}.xml`,
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
