import type { APIRoute } from 'astro';
import { allConcepts, allTags } from '../../app/data/concepts';
import { fields } from '../../app/data/fields';

const baseUrl = 'https://roots.soundbluemusic.com';

function urlEntry(loc: string, priority = '0.7', changefreq = 'monthly') {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export const GET: APIRoute = () => {
  const staticUrls = [
    urlEntry(`${baseUrl}/`, '1.0', 'weekly'),
    urlEntry(`${baseUrl}/browse`, '0.9', 'weekly'),
    urlEntry(`${baseUrl}/search`, '0.5'),
    urlEntry(`${baseUrl}/tags`, '0.8'),
    urlEntry(`${baseUrl}/built-with`, '0.3'),
    urlEntry(`${baseUrl}/ko/`, '1.0', 'weekly'),
    urlEntry(`${baseUrl}/ko/browse`, '0.9', 'weekly'),
    urlEntry(`${baseUrl}/ko/search`, '0.5'),
    urlEntry(`${baseUrl}/ko/tags`, '0.8'),
    urlEntry(`${baseUrl}/ko/built-with`, '0.3'),
  ];

  const fieldUrls = fields.flatMap((f) => [
    urlEntry(`${baseUrl}/field/${f.id}`, '0.8'),
    urlEntry(`${baseUrl}/ko/field/${f.id}`, '0.8'),
  ]);

  const conceptUrls = allConcepts.flatMap((c) => [
    urlEntry(`${baseUrl}/concept/${c.id}`, '0.7'),
    urlEntry(`${baseUrl}/ko/concept/${c.id}`, '0.7'),
  ]);

  const tagUrls = allTags.flatMap((t) => [
    urlEntry(`${baseUrl}/tag/${encodeURIComponent(t.tag)}`, '0.6'),
    urlEntry(`${baseUrl}/ko/tag/${encodeURIComponent(t.tag)}`, '0.6'),
  ]);

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...fieldUrls,
    ...conceptUrls,
    ...tagUrls,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
