/**
 * @fileoverview Sitemap Generator Utilities
 * @environment build-only
 *
 * Common functions for generating sitemaps with hreflang support.
 * Uses Node.js fs - only runs at build time, never in browser.
 */

import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * Safe accessor for noUncheckedIndexedAccess
 */
function getTodayISODate(): string {
  const isoString = new Date().toISOString();
  const dateOnly = isoString.slice(0, 10); // "YYYY-MM-DD" is always first 10 chars
  return dateOnly;
}

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
  /** Output directory for generated files (public/) */
  outputDir: string;
  /** Build output directory (build/client/) - if exists, files are written here too */
  buildOutputDir?: string;
  /**
   * Whether to add trailing slash to dynamic URLs
   * - true: /concept/addition/ (for Workers Assets with folder structure)
   * - false: /concept/addition (for Workers SSR or direct HTML files)
   * @default false
   */
  trailingSlash?: boolean;
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
export function getLocalizedUrl(
  siteUrl: string,
  path: string,
  lang: string,
  defaultLang = 'en',
): string {
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
 * Generate URL entries for all languages (each language gets its own <url> entry)
 */
export function generateUrlEntries(
  siteUrl: string,
  path: string,
  priority: string,
  changefreq: string,
  languages: readonly string[],
  today: string,
  defaultLang = 'en',
): string[] {
  return languages.map((lang) => {
    const locUrl = getLocalizedUrl(siteUrl, path, lang, defaultLang);
    return `  <url>
    <loc>${locUrl}</loc>
    <lastmod>${today}</lastmod>
${generateHreflangLinks(siteUrl, path, languages, defaultLang)}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });
}

/**
 * @deprecated Use generateUrlEntries instead
 * Generate a single URL entry for sitemap (only default language)
 */
export function generateUrlEntry(
  siteUrl: string,
  path: string,
  priority: string,
  changefreq: string,
  languages: readonly string[],
  today: string,
): string {
  // For backward compatibility, return joined entries
  return generateUrlEntries(siteUrl, path, priority, changefreq, languages, today).join('\n');
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
 * Displays URLs grouped by path with language variants shown together
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
          :root {
            --bg: #ffffff;
            --text: #1f2937;
            --text-secondary: #6b7280;
            --border: #e5e7eb;
            --accent: #3b82f6;
            --card-bg: #f9fafb;
            --lang-en: #22c55e;
            --lang-ko: #f59e0b;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #111827;
              --text: #f9fafb;
              --text-secondary: #9ca3af;
              --border: #374151;
              --accent: #60a5fa;
              --card-bg: #1f2937;
              --lang-en: #4ade80;
              --lang-ko: #fbbf24;
            }
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; padding: 2rem; }
          .container { max-width: 1200px; margin: 0 auto; }
          h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
          .subtitle { color: var(--text-secondary); margin-bottom: 2rem; }
          a { color: var(--accent); text-decoration: none; }
          a:hover { text-decoration: underline; }
          /* Sitemap index table */
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border); }
          th { font-weight: 600; color: var(--text-secondary); font-size: 0.875rem; text-transform: uppercase; }
          /* URL group cards */
          .url-group { background: var(--card-bg); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem; }
          .url-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0; }
          .url-item a { flex: 1; word-break: break-all; }
          .lang-arrow { color: var(--text-secondary); }
          .lang-tag { font-weight: 600; font-size: 0.875rem; min-width: 1.5rem; }
          .lang-en { color: var(--lang-en); }
          .lang-ko { color: var(--lang-ko); }
          @media (max-width: 768px) {
            body { padding: 1rem; }
            .url-group { padding: 0.75rem; }
            .url-item { font-size: 0.875rem; }
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
              <xsl:for-each select="sitemap:urlset/sitemap:url[not(contains(sitemap:loc, '/ko/'))]">
                <div class="url-group">
                  <div class="url-item">
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                    <span class="lang-arrow">→</span>
                    <span class="lang-tag lang-en">en</span>
                  </div>
                  <xsl:for-each select="xhtml:link[@hreflang='ko']">
                    <div class="url-item">
                      <a href="{@href}"><xsl:value-of select="@href"/></a>
                      <span class="lang-arrow">→</span>
                      <span class="lang-tag lang-ko">ko</span>
                    </div>
                  </xsl:for-each>
                </div>
              </xsl:for-each>
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
 * Write file to output directory and optionally to build directory
 */
function writeToDirectories(
  filename: string,
  content: string,
  outputDir: string,
  buildOutputDir?: string,
): void {
  // Always write to public/
  writeFileSync(join(outputDir, filename), content, 'utf-8');

  // Also write to build/client/ if it exists
  if (buildOutputDir && existsSync(buildOutputDir)) {
    writeFileSync(join(buildOutputDir, filename), content, 'utf-8');
  }
}

/**
 * Generate all sitemap files for an app
 */
export function generateSitemaps(
  config: SitemapConfig,
  staticPages: StaticPage[],
  dynamicSitemaps: SitemapEntry[],
): void {
  const { siteUrl, languages, appName, appSubtitle, outputDir, buildOutputDir } = config;
  const today = getTodayISODate();

  console.log(`🗺️  Generating sitemaps for ${appName}...\n`);

  const sitemapFiles: string[] = [];

  // Generate static pages sitemap (each page × each language = separate URL entry)
  const staticUrls = staticPages.flatMap((page) =>
    generateUrlEntries(siteUrl, page.path, page.priority, page.changefreq, languages, today),
  );
  const staticSitemap = generateSitemap(staticUrls);
  writeToDirectories('sitemap-pages.xml', staticSitemap, outputDir, buildOutputDir);
  sitemapFiles.push('sitemap-pages.xml');
  console.log(
    `✅ sitemap-pages.xml (${staticPages.length} pages × ${languages.length} languages = ${staticUrls.length} URLs)`,
  );

  // Generate dynamic sitemaps
  for (const entry of dynamicSitemaps) {
    const sitemap = generateSitemap(entry.urls);
    const filename = `sitemap-${entry.name}.xml`;
    writeToDirectories(filename, sitemap, outputDir, buildOutputDir);
    sitemapFiles.push(filename);
    console.log(`✅ ${filename} (${entry.urls.length} URLs × ${languages.length} languages)`);
  }

  // Generate sitemap index
  const sitemapIndex = generateSitemapIndex(siteUrl, sitemapFiles, today);
  writeToDirectories('sitemap.xml', sitemapIndex, outputDir, buildOutputDir);
  console.log('✅ sitemap.xml (index)');

  // Generate XSL stylesheet
  const xslStylesheet = generateXslStylesheet(appName, appSubtitle);
  writeToDirectories('sitemap.xsl', xslStylesheet, outputDir, buildOutputDir);
  console.log('✅ sitemap.xsl (stylesheet)');

  // Summary
  const totalUrls = staticPages.length + dynamicSitemaps.reduce((sum, s) => sum + s.urls.length, 0);
  console.log(
    `\n📊 Total: ${totalUrls} URLs × ${languages.length} languages = ${totalUrls * languages.length} hreflang entries`,
  );
}

/**
 * Helper to create URL entries for dynamic routes (each ID × each language = separate URL)
 *
 * @param siteUrl - Base URL without trailing slash
 * @param pathPrefix - Path prefix (e.g., '/concept')
 * @param ids - Array of IDs to generate URLs for
 * @param priority - Sitemap priority (0.0 - 1.0)
 * @param changefreq - Change frequency
 * @param languages - Supported languages
 * @param trailingSlash - Whether to add trailing slash (for Workers Assets compatibility)
 */
export function createDynamicUrls(
  siteUrl: string,
  pathPrefix: string,
  ids: string[],
  priority: string,
  changefreq: string,
  languages: readonly string[],
  trailingSlash = false,
): string[] {
  const today = getTodayISODate();
  const suffix = trailingSlash ? '/' : '';
  return ids.flatMap((id) =>
    generateUrlEntries(
      siteUrl,
      `${pathPrefix}/${id}${suffix}`,
      priority,
      changefreq,
      languages,
      today,
    ),
  );
}
