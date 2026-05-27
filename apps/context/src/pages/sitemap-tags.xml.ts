import type { APIRoute } from 'astro';
import { getAllTagsFromD1 } from '../../app/services/d1';

const SITE_URL = 'https://context.soundbluemusic.com';

export const GET: APIRoute = async ({ locals }) => {
  const db = locals.runtime.env.DB;

  let tags: Array<{ tag: string }> = [];
  try {
    tags = await getAllTagsFromD1(db);
  } catch (e) {
    console.error('[sitemap-tags.xml] D1 error:', e);
    return new Response('Service Unavailable', { status: 503 });
  }

  const now = new Date().toISOString().slice(0, 10);

  const urls = tags
    .map(({ tag }) => {
      const encodedTag = encodeURIComponent(tag);
      const en = `${SITE_URL}/tag/${encodedTag}`;
      const ko = `${SITE_URL}/ko/tag/${encodedTag}`;
      return `  <url>
    <loc>${en}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${ko}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
  </url>
  <url>
    <loc>${ko}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
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
