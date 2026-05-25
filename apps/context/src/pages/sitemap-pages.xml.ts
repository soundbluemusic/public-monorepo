import type { APIRoute } from 'astro';
import staticPages from '../../app/data/sitemap-static-pages.json';

const SITE_URL = 'https://context.soundbluemusic.com';

function bilingualUrl(path: string, priority: string, changefreq: string, lastmod: string): string {
  const encPath = path
    .split('/')
    .map((s) => (s ? encodeURIComponent(s) : ''))
    .join('/');
  const en = `${SITE_URL}${encPath}`;
  const ko = `${SITE_URL}/ko${encPath === '/' ? '' : encPath}`;
  return `  <url>
    <loc>${en}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${ko}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
  </url>
  <url>
    <loc>${ko}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${ko}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
  </url>`;
}

export const GET: APIRoute = () => {
  const now = new Date().toISOString().slice(0, 10);

  const urls = staticPages
    .map((page) => bilingualUrl(page.path, page.priority, page.changefreq, now))
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
