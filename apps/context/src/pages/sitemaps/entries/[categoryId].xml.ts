import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { getEntryIdsByCategoryFromD1 } from '../../../../app/services/d1';

const SITE_URL = 'https://context.soundbluemusic.com';

export const GET: APIRoute = async ({ params }) => {
  const { categoryId } = params;
  if (!categoryId) return new Response('Not Found', { status: 404 });

  const db = env.DB;
  const entryIds = await getEntryIdsByCategoryFromD1(db, categoryId).catch(() => []);

  if (entryIds.length === 0) return new Response('Not Found', { status: 404 });

  const now = new Date().toISOString().slice(0, 10);

  const urls = entryIds
    .map((id) => {
      const en = `${SITE_URL}/entry/${id}`;
      const ko = `${SITE_URL}/ko/entry/${id}`;
      return `  <url>
    <loc>${en}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${ko}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
  </url>
  <url>
    <loc>${ko}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${ko}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
