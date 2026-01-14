/**
 * @fileoverview Tests for sitemap generator
 */

import {
  generateHreflangLinks,
  generateSitemap,
  generateSitemapIndex,
  generateUrlEntries,
  generateUrlEntry,
  generateXslStylesheet,
  getLocalizedUrl,
} from '@soundblue/seo/sitemap';
import { describe, expect, it } from 'vitest';

describe('getLocalizedUrl', () => {
  const siteUrl = 'https://example.com';

  it('should return URL without prefix for default language', () => {
    expect(getLocalizedUrl(siteUrl, '/about', 'en', 'en')).toBe('https://example.com/about');
  });

  it('should return URL with language prefix for non-default language', () => {
    expect(getLocalizedUrl(siteUrl, '/about', 'ko', 'en')).toBe('https://example.com/ko/about');
  });

  it('should handle root path for non-default language', () => {
    expect(getLocalizedUrl(siteUrl, '/', 'ko', 'en')).toBe('https://example.com/ko');
  });

  it('should handle root path for default language', () => {
    expect(getLocalizedUrl(siteUrl, '/', 'en', 'en')).toBe('https://example.com/');
  });
});

describe('generateHreflangLinks', () => {
  const siteUrl = 'https://example.com';
  const languages = ['en', 'ko'] as const;

  it('should generate hreflang links for all languages', () => {
    const links = generateHreflangLinks(siteUrl, '/about', languages);

    expect(links).toContain('hreflang="en"');
    expect(links).toContain('hreflang="ko"');
    expect(links).toContain('hreflang="x-default"');
  });

  it('should include correct URLs', () => {
    const links = generateHreflangLinks(siteUrl, '/about', languages);

    expect(links).toContain('href="https://example.com/about"');
    expect(links).toContain('href="https://example.com/ko/about"');
  });

  it('should set x-default to default language URL', () => {
    const links = generateHreflangLinks(siteUrl, '/about', languages, 'en');

    expect(links).toContain('hreflang="x-default" href="https://example.com/about"');
  });
});

describe('generateUrlEntry', () => {
  const siteUrl = 'https://example.com';
  const languages = ['en', 'ko'] as const;

  it('should generate complete URL entry', () => {
    const entry = generateUrlEntry(siteUrl, '/about', '0.8', 'weekly', languages, '2024-01-01');

    expect(entry).toContain('<url>');
    expect(entry).toContain('</url>');
    expect(entry).toContain('<loc>https://example.com/about</loc>');
    expect(entry).toContain('<lastmod>2024-01-01</lastmod>');
    expect(entry).toContain('<changefreq>weekly</changefreq>');
    expect(entry).toContain('<priority>0.8</priority>');
  });

  it('should include hreflang links', () => {
    const entry = generateUrlEntry(siteUrl, '/about', '0.8', 'weekly', languages, '2024-01-01');

    expect(entry).toContain('hreflang="en"');
    expect(entry).toContain('hreflang="ko"');
    expect(entry).toContain('hreflang="x-default"');
  });
});

describe('generateSitemap', () => {
  it('should generate complete sitemap XML', () => {
    const urls = ['<url><loc>https://example.com/</loc></url>'];
    const sitemap = generateSitemap(urls);

    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>');
    expect(sitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(sitemap).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain('</urlset>');
    expect(sitemap).toContain('<url><loc>https://example.com/</loc></url>');
  });

  it('should include all URLs', () => {
    const urls = [
      '<url><loc>https://example.com/page1</loc></url>',
      '<url><loc>https://example.com/page2</loc></url>',
    ];
    const sitemap = generateSitemap(urls);

    expect(sitemap).toContain('page1');
    expect(sitemap).toContain('page2');
  });

  it('should handle empty URLs', () => {
    const sitemap = generateSitemap([]);

    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain('</urlset>');
  });
});

describe('generateSitemapIndex', () => {
  const siteUrl = 'https://example.com';

  it('should generate sitemap index XML', () => {
    const sitemaps = ['sitemap-pages.xml', 'sitemap-entries.xml'];
    const index = generateSitemapIndex(siteUrl, sitemaps, '2024-01-01');

    expect(index).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(index).toContain('<sitemapindex');
    expect(index).toContain('</sitemapindex>');
  });

  it('should include all sitemap references', () => {
    const sitemaps = ['sitemap-pages.xml', 'sitemap-entries.xml'];
    const index = generateSitemapIndex(siteUrl, sitemaps, '2024-01-01');

    expect(index).toContain('<loc>https://example.com/sitemap-pages.xml</loc>');
    expect(index).toContain('<loc>https://example.com/sitemap-entries.xml</loc>');
    expect(index).toContain('<lastmod>2024-01-01</lastmod>');
  });

  it('should handle empty sitemaps', () => {
    const index = generateSitemapIndex(siteUrl, [], '2024-01-01');

    expect(index).toContain('<sitemapindex');
    expect(index).toContain('</sitemapindex>');
  });
});

describe('generateXslStylesheet', () => {
  it('should generate XSL stylesheet', () => {
    const xsl = generateXslStylesheet('My App', 'All pages');

    expect(xsl).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xsl).toContain('<xsl:stylesheet');
    expect(xsl).toContain('My App');
    expect(xsl).toContain('All pages');
  });

  it('should include responsive styles', () => {
    const xsl = generateXslStylesheet('App', 'Subtitle');

    expect(xsl).toContain('@media');
    expect(xsl).toContain('prefers-color-scheme: dark');
  });

  it('should include table structure', () => {
    const xsl = generateXslStylesheet('App', 'Subtitle');

    expect(xsl).toContain('<table>');
    expect(xsl).toContain('<thead>');
    expect(xsl).toContain('<tbody>');
  });
});

describe('generateUrlEntries', () => {
  const siteUrl = 'https://example.com';
  const languages = ['en', 'ko'] as const;

  it('should generate URL entries for each language', () => {
    const entries = generateUrlEntries(siteUrl, '/about', '0.8', 'weekly', languages, '2024-01-01');

    expect(entries).toHaveLength(2);
    expect(entries[0]).toContain('<loc>https://example.com/about</loc>');
    expect(entries[1]).toContain('<loc>https://example.com/ko/about</loc>');
  });

  it('should include hreflang links in each entry', () => {
    const entries = generateUrlEntries(siteUrl, '/about', '0.8', 'weekly', languages, '2024-01-01');

    // Each entry should have hreflang for both languages
    for (const entry of entries) {
      expect(entry).toContain('hreflang="en"');
      expect(entry).toContain('hreflang="ko"');
      expect(entry).toContain('hreflang="x-default"');
    }
  });

  it('should include correct metadata in each entry', () => {
    const entries = generateUrlEntries(siteUrl, '/about', '0.8', 'weekly', languages, '2024-01-01');

    for (const entry of entries) {
      expect(entry).toContain('<lastmod>2024-01-01</lastmod>');
      expect(entry).toContain('<changefreq>weekly</changefreq>');
      expect(entry).toContain('<priority>0.8</priority>');
    }
  });

  it('should handle root path correctly', () => {
    const entries = generateUrlEntries(siteUrl, '/', '1.0', 'daily', languages, '2024-01-01');

    expect(entries[0]).toContain('<loc>https://example.com/</loc>');
    expect(entries[1]).toContain('<loc>https://example.com/ko</loc>');
  });

  it('should work with custom default language', () => {
    const entries = generateUrlEntries(
      siteUrl,
      '/about',
      '0.8',
      'weekly',
      languages,
      '2024-01-01',
      'ko',
    );

    // With 'ko' as default, Korean URL has no prefix
    expect(entries[0]).toContain('<loc>https://example.com/en/about</loc>');
    expect(entries[1]).toContain('<loc>https://example.com/about</loc>');
  });
});
