/**
 * 카테고리별 엔트리 사이트맵 (SSR 모드 전용)
 *
 * /sitemap-entry-{categoryId}.xml 형식의 URL로 접근
 * D1에서 해당 카테고리의 모든 엔트리 ID를 조회하여 사이트맵 생성
 */

import { getEntryIdsByCategoryFromD1 } from '@/services/d1';

const SITE_URL = 'https://context.soundbluemusic.com';

interface LoaderContext {
  cloudflare?: { env?: { DB?: D1Database } };
}

interface LoaderParams {
  categoryId?: string;
}

function generateUrl(entryId: string) {
  const now = new Date().toISOString().split('T')[0];
  const enUrl = `${SITE_URL}/entry/${entryId}`;
  const koUrl = `${SITE_URL}/ko/entry/${entryId}`;

  return `  <url>
    <loc>${enUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${koUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
  <url>
    <loc>${koUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${koUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>`;
}

export async function loader({
  context,
  params,
}: {
  context: LoaderContext;
  params: LoaderParams;
}) {
  const { categoryId } = params;

  if (!categoryId) {
    throw new Response('Category ID required', { status: 400 });
  }

  const db = context?.cloudflare?.env?.DB;

  if (!db) {
    // SSG 모드: 정적 파일로 리다이렉트
    throw new Response(null, {
      status: 302,
      headers: { Location: `/sitemap-entry-${categoryId}.xml` },
    });
  }

  const entryIds = await getEntryIdsByCategoryFromD1(db, categoryId);

  if (entryIds.length === 0) {
    throw new Response('Category not found or empty', { status: 404 });
  }

  const urls = entryIds.map((id) => generateUrl(id)).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
