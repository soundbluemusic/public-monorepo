/**
 * 카테고리 사이트맵 (SSR 모드 전용)
 */

import { getCategoriesFromD1 } from '@/services/d1';

const SITE_URL = 'https://context.soundbluemusic.com';

interface LoaderArgs {
  context: { cloudflare?: { env?: { DB?: D1Database } } };
}

function generateUrl(categoryId: string) {
  const now = new Date().toISOString().split('T')[0];
  const enUrl = `${SITE_URL}/category/${categoryId}`;
  const koUrl = `${SITE_URL}/ko/category/${categoryId}`;

  return `  <url>
    <loc>${enUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${koUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
  <url>
    <loc>${koUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${koUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>`;
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
  const urls = categories.map((cat) => generateUrl(cat.id)).join('\n');

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
