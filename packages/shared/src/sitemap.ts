/**
 * Shared Sitemap Generator Utilities
 *
 * Common functions for generating sitemaps with hreflang support.
 * Used by all apps (context, roots, permissive).
 *
 * @module @soundblue/shared/sitemap
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// ============================================================================
// Types
// ============================================================================

export interface SitemapConfig {
  /** Site URL without trailing slash (e.g., 'https://example.com') */
  siteUrl: string;
  /** Supported languages */
  languages: readonly string[];
  /** App name for XSL stylesheet title */
  appName: string;
  /** App subtitle for XSL stylesheet */
  appSubtitle: string;
  /** Output directory for generated files */
  outputDir: string;
}

export interface StaticPage {
  path: string;
  priority: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export interface SitemapEntry {
  name: string;
  urls: string[];
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Get URL with language prefix (default language = no prefix)
 */
export function getLocalizedUrl(siteUrl: string, path: string, lang: string, defaultLang = 'en'): string {
  if (lang === defaultLang) {
    return `${siteUrl}${path}`;
  }
  return `${siteUrl}/${lang}${path === '/' ? '' : path}`;
}

/**
 * Generate hreflang links for a path
 */
export function generateHreflangLinks(
  siteUrl: string,
  path: string,
  languages: readonly string[],
  defaultLang = 'en',
): string {
  const links = languages
    .map(
      (lang) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${getLocalizedUrl(siteUrl, path, lang, defaultLang)}" />`,
    )
    .join('\n');

  return `${links}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${getLocalizedUrl(siteUrl, path, defaultLang, defaultLang)}" />`;
}

/**
 * Generate a single URL entry for sitemap
 */
export function generateUrlEntry(
  siteUrl: string,
  path: string,
  priority: string,
  changefreq: string,
  languages: readonly string[],
  today: string,
): string {
  return `  <url>
    <loc>${getLocalizedUrl(siteUrl, path, 'en')}</loc>
    <lastmod>${today}</lastmod>
${generateHreflangLinks(siteUrl, path, languages)}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate complete sitemap XML from URL entries
 */
export function generateSitemap(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
}

/**
 * Generate sitemap index XML
 */
export function generateSitemapIndex(siteUrl: string, sitemaps: string[], today: string): string {
  const entries = sitemaps
    .map(
      (name) => `  <sitemap>
    <loc>${siteUrl}/${name}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

/**
 * Generate XSL stylesheet for human-readable sitemap display
 */
export function generateXslStylesheet(appName: string, appSubtitle: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap - ${appName}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          :root { --bg: #ffffff; --text: #1f2937; --text-secondary: #6b7280; --border: #e5e7eb; --accent: #3b82f6; }
          @media (prefers-color-scheme: dark) {
            :root { --bg: #111827; --text: #f9fafb; --text-secondary: #9ca3af; --border: #374151; --accent: #60a5fa; }
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; padding: 2rem; }
          .container { max-width: 1200px; margin: 0 auto; }
          h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
          .subtitle { color: var(--text-secondary); margin-bottom: 2rem; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border); }
          th { font-weight: 600; color: var(--text-secondary); font-size: 0.875rem; text-transform: uppercase; }
          a { color: var(--accent); text-decoration: none; }
          a:hover { text-decoration: underline; }
          .badge { display: inline-block; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; margin-right: 0.25rem; }
          .badge-en { background: #dbeafe; color: #1d4ed8; }
          .badge-ko { background: #fce7f3; color: #be185d; }
          @media (prefers-color-scheme: dark) {
            .badge-en { background: #1e3a5f; color: #93c5fd; }
            .badge-ko { background: #4a1942; color: #f9a8d4; }
          }
          @media (max-width: 768px) {
            body { padding: 1rem; }
            th, td { padding: 0.5rem; font-size: 0.875rem; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Sitemap</h1>
          <p class="subtitle">${appSubtitle}</p>
          <xsl:choose>
            <xsl:when test="sitemap:sitemapindex">
              <table>
                <thead><tr><th>Sitemap</th><th>Last Modified</th></tr></thead>
                <tbody>
                  <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                    <tr>
                      <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                      <td><xsl:value-of select="sitemap:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:when>
            <xsl:otherwise>
              <table>
                <thead><tr><th>URL</th><th>Languages</th><th>Priority</th></tr></thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <tr>
                      <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                      <td>
                        <xsl:for-each select="xhtml:link[@rel='alternate']">
                          <xsl:if test="@hreflang != 'x-default'">
                            <span class="badge badge-{@hreflang}"><xsl:value-of select="translate(@hreflang, 'enko', 'ENKO')"/></span>
                          </xsl:if>
                        </xsl:for-each>
                      </td>
                      <td><xsl:value-of select="sitemap:priority"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
}

// ============================================================================
// High-Level Generator
// ============================================================================

/**
 * Generate all sitemap files for an app
 */
export function generateSitemaps(
  config: SitemapConfig,
  staticPages: StaticPage[],
  dynamicSitemaps: SitemapEntry[],
): void {
  const { siteUrl, languages, appName, appSubtitle, outputDir } = config;
  const today = new Date().toISOString().split('T')[0];

  console.log(`🗺️  Generating sitemaps for ${appName}...\n`);

  const sitemapFiles: string[] = [];

  // Generate static pages sitemap
  const staticUrls = staticPages.map((page) =>
    generateUrlEntry(siteUrl, page.path, page.priority, page.changefreq, languages, today),
  );
  const staticSitemap = generateSitemap(staticUrls);
  writeFileSync(join(outputDir, 'sitemap-pages.xml'), staticSitemap);
  sitemapFiles.push('sitemap-pages.xml');
  console.log(`✅ sitemap-pages.xml (${staticPages.length} pages × ${languages.length} languages)`);

  // Generate dynamic sitemaps
  for (const entry of dynamicSitemaps) {
    const sitemap = generateSitemap(entry.urls);
    const filename = `sitemap-${entry.name}.xml`;
    writeFileSync(join(outputDir, filename), sitemap);
    sitemapFiles.push(filename);
    console.log(`✅ ${filename} (${entry.urls.length} URLs × ${languages.length} languages)`);
  }

  // Generate sitemap index
  const sitemapIndex = generateSitemapIndex(siteUrl, sitemapFiles, today);
  writeFileSync(join(outputDir, 'sitemap.xml'), sitemapIndex);
  console.log('✅ sitemap.xml (index)');

  // Generate XSL stylesheet
  const xslStylesheet = generateXslStylesheet(appName, appSubtitle);
  writeFileSync(join(outputDir, 'sitemap.xsl'), xslStylesheet);
  console.log('✅ sitemap.xsl (stylesheet)');

  // Summary
  const totalUrls = staticPages.length + dynamicSitemaps.reduce((sum, s) => sum + s.urls.length, 0);
  console.log(`\n📊 Total: ${totalUrls} URLs × ${languages.length} languages = ${totalUrls * languages.length} hreflang entries`);
}

/**
 * Helper to create URL entries for dynamic routes
 */
export function createDynamicUrls(
  siteUrl: string,
  pathPrefix: string,
  ids: string[],
  priority: string,
  changefreq: string,
  languages: readonly string[],
): string[] {
  const today = new Date().toISOString().split('T')[0];
  return ids.map((id) =>
    generateUrlEntry(siteUrl, `${pathPrefix}/${id}`, priority, changefreq, languages, today),
  );
}
