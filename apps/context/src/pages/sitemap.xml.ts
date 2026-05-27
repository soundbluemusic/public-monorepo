import type { APIRoute } from 'astro';
import { getCategoriesFromD1 } from '../../app/services/d1';

const SITE_URL = 'https://context.soundbluemusic.com';

export const GET: APIRoute = async ({ locals }) => {
  const db = locals.runtime.env.DB;

  let categories: Array<{ id: string }> = [];
  try {
    categories = await getCategoriesFromD1(db);
  } catch (e) {
    console.error('[sitemap.xml] D1 error:', e);
    return new Response('Service Unavailable', { status: 503 });
  }

  const now = new Date().toISOString().slice(0, 10);
  const sitemaps = [
    { loc: `${SITE_URL}/sitemap-pages.xml`, lastmod: now },
    { loc: `${SITE_URL}/sitemap-categories.xml`, lastmod: now },
    { loc: `${SITE_URL}/sitemap-conversations.xml`, lastmod: now },
    { loc: `${SITE_URL}/sitemap-tags.xml`, lastmod: now },
    ...categories.map((c) => ({ loc: `${SITE_URL}/sitemaps/entries/${c.id}.xml`, lastmod: now })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((s) => `  <sitemap>\n    <loc>${s.loc}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`).join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
