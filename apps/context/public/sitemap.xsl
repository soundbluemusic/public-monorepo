<?xml version="1.0" encoding="UTF-8"?>
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
</xsl:stylesheet>