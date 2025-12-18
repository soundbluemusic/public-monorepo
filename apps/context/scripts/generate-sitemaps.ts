/**
 * Sitemap Generator for Context App
 * Generates sitemap.xml with hreflang support for en, ko
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Import data
import { categories } from "../src/data/categories";
import { meaningEntries } from "../src/data/entries";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "../public");

const SITE_URL = "https://context.soundbluemusic.com";
const LANGUAGES = ["en", "ko"] as const;
const TODAY = new Date().toISOString().split("T")[0];

// Static pages
const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/browse", priority: "0.9", changefreq: "weekly" },
  { path: "/built-with", priority: "0.5", changefreq: "monthly" },
  { path: "/license", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

// Get URL with language prefix (en = no prefix)
function getLocalizedUrl(path: string, lang: string): string {
  if (lang === "en") {
    return `${SITE_URL}${path}`;
  }
  return `${SITE_URL}/${lang}${path === "/" ? "" : path}`;
}

// Generate hreflang links
function generateHreflangLinks(path: string): string {
  const links = LANGUAGES.map(
    (lang) =>
      `    <xhtml:link rel="alternate" hreflang="${lang}" href="${getLocalizedUrl(path, lang)}" />`
  ).join("\n");

  return `${links}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${getLocalizedUrl(path, "en")}" />`;
}

// Generate URL entry
function generateUrlEntry(
  path: string,
  priority: string,
  changefreq: string
): string {
  return `  <url>
    <loc>${getLocalizedUrl(path, "en")}</loc>
    <lastmod>${TODAY}</lastmod>
${generateHreflangLinks(path)}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Generate sitemap XML
function generateSitemap(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;
}

// Generate sitemap index
function generateSitemapIndex(sitemaps: string[]): string {
  const entries = sitemaps
    .map(
      (name) => `  <sitemap>
    <loc>${SITE_URL}/${name}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

// Generate XSL stylesheet
function generateXslStylesheet(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap - Context</title>
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
          <p class="subtitle">Context - Korean Meaning Dictionary</p>
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
                            <span class="badge badge-{@hreflang}"><xsl:value-of select="translate(@hreflang, 'enkoj', 'ENKOJ')"/></span>
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

// Main function
async function main() {
  console.log("🗺️  Generating sitemaps for Context...\n");

  // Generate static pages sitemap
  const staticUrls = STATIC_PAGES.map((page) =>
    generateUrlEntry(page.path, page.priority, page.changefreq)
  );
  const staticSitemap = generateSitemap(staticUrls);
  writeFileSync(join(PUBLIC_DIR, "sitemap-pages.xml"), staticSitemap);
  console.log(`✅ sitemap-pages.xml (${STATIC_PAGES.length} pages × 2 languages)`);

  // Generate categories sitemap
  const categoryUrls = categories.map((cat) =>
    generateUrlEntry(`/category/${cat.id}`, "0.8", "weekly")
  );
  const categorySitemap = generateSitemap(categoryUrls);
  writeFileSync(join(PUBLIC_DIR, "sitemap-categories.xml"), categorySitemap);
  console.log(`✅ sitemap-categories.xml (${categories.length} categories × 2 languages)`);

  // Generate entries sitemap
  const entryUrls = meaningEntries.map((entry) =>
    generateUrlEntry(`/entry/${entry.id}`, "0.6", "monthly")
  );
  const entriesSitemap = generateSitemap(entryUrls);
  writeFileSync(join(PUBLIC_DIR, "sitemap-entries.xml"), entriesSitemap);
  console.log(`✅ sitemap-entries.xml (${meaningEntries.length} entries × 2 languages)`);

  // Generate sitemap index
  const sitemapIndex = generateSitemapIndex([
    "sitemap-pages.xml",
    "sitemap-categories.xml",
    "sitemap-entries.xml",
  ]);
  writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), sitemapIndex);
  console.log("✅ sitemap.xml (index)");

  // Generate XSL stylesheet
  const xslStylesheet = generateXslStylesheet();
  writeFileSync(join(PUBLIC_DIR, "sitemap.xsl"), xslStylesheet);
  console.log("✅ sitemap.xsl (stylesheet)");

  // Summary
  const totalUrls =
    STATIC_PAGES.length + categories.length + meaningEntries.length;
  console.log(`\n📊 Total: ${totalUrls} URLs × 2 languages = ${totalUrls * 2} hreflang entries`);
}

main().catch(console.error);
