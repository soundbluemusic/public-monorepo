import type { APIRoute } from 'astro';
import { categoryMeta, getLibrarySlug, libraries } from '../../app/data/libraries';
import { getWebApiSlug, webApis } from '../../app/data/web-apis';

const BASE_URL = 'https://permissive.soundbluemusic.com';

function url(path: string, lastmod?: string): string {
  const loc = `${BASE_URL}${path}`;
  const mod = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
  return `<url><loc>${loc}</loc>${mod}</url>`;
}

export const GET: APIRoute = () => {
  const today = new Date().toISOString().split('T')[0];

  const staticPages = ['/', '/libraries', '/web-api', '/tags', '/built-with'];
  const koStaticPages = staticPages.map((p) => (p === '/' ? '/ko' : `/ko${p}`));

  const libUrls = libraries.map((lib) => {
    const slug = getLibrarySlug(lib.name);
    return [url(`/library/${slug}`), url(`/ko/library/${slug}`)].join('');
  });

  const apiUrls = webApis.map((api) => {
    const slug = getWebApiSlug(api.name);
    return [url(`/web-api/${slug}`), url(`/ko/web-api/${slug}`)].join('');
  });

  const categoryUrls = categoryMeta.map((cat) => {
    return [url(`/category/${cat.id}`), url(`/ko/category/${cat.id}`)].join('');
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${[...staticPages, ...koStaticPages].map((p) => url(p, today)).join('\n  ')}
  ${libUrls.join('\n  ')}
  ${apiUrls.join('\n  ')}
  ${categoryUrls.join('\n  ')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
