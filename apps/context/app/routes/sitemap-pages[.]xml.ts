/**
 * /sitemap-pages.xml - 정적 페이지 사이트맵
 *
 * 정적 페이지 목록을 반환합니다.
 * TanStack Start 공식 API 라우트 패턴 사용.
 */
import { createFileRoute } from '@tanstack/react-router';

const SITE_URL = 'https://context.soundbluemusic.com';

/** 정적 페이지 목록 */
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/browse', priority: '0.9', changefreq: 'weekly' },
  { path: '/download', priority: '0.7', changefreq: 'monthly' },
  { path: '/built-with', priority: '0.5', changefreq: 'monthly' },
  { path: '/license', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
];

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

export const Route = createFileRoute('/sitemap-pages.xml')({
  server: {
    handlers: {
      GET: async () => {
        const now = getCurrentDateString();
        const urls = STATIC_PAGES.map((page) =>
          generateBilingualUrl(page.path, page.priority, page.changefreq, now),
        ).join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

        return new Response(xml, { headers: xmlHeaders });
      },
    },
  },
});
