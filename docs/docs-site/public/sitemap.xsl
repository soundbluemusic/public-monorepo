<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap - SoundBlue Docs</title>
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
            --lang-ja: #ec4899;
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
              --lang-ja: #f472b6;
            }
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; padding: 2rem; }
          .container { max-width: 1200px; margin: 0 auto; }
          h1 { font-size: 1.5rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
          h1::before { content: ""; display: inline-block; width: 8px; height: 24px; background: var(--accent); border-radius: 2px; }
          .subtitle { color: var(--text-secondary); margin-bottom: 1.5rem; }
          .stats { display: flex; gap: 2rem; margin-bottom: 2rem; padding: 1rem; background: var(--card-bg); border-radius: 0.5rem; border: 1px solid var(--border); }
          .stat { text-align: center; }
          .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--accent); }
          .stat-label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; }
          a { color: var(--accent); text-decoration: none; }
          a:hover { text-decoration: underline; }
          /* Sitemap index table */
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border); }
          th { font-weight: 600; color: var(--text-secondary); font-size: 0.875rem; text-transform: uppercase; background: var(--card-bg); }
          tr:hover { background: var(--card-bg); }
          /* URL group cards */
          .url-group { background: var(--card-bg); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem; }
          .url-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0; }
          .url-item a { flex: 1; word-break: break-all; font-size: 0.875rem; }
          .lang-tag { font-weight: 600; font-size: 0.75rem; min-width: 1.5rem; padding: 0.125rem 0.375rem; border-radius: 0.25rem; }
          .lang-en { background: rgba(34, 197, 94, 0.1); color: var(--lang-en); }
          .lang-ko { background: rgba(245, 158, 11, 0.1); color: var(--lang-ko); }
          .lang-ja { background: rgba(236, 72, 153, 0.1); color: var(--lang-ja); }
          .section-title { font-size: 1rem; font-weight: 600; margin: 1.5rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); }
          @media (max-width: 768px) {
            body { padding: 1rem; }
            .stats { flex-direction: column; gap: 1rem; }
            .url-group { padding: 0.75rem; }
            .url-item { font-size: 0.875rem; flex-wrap: wrap; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Sitemap</h1>
          <p class="subtitle">SoundBlue Public Monorepo Documentation</p>
          <xsl:choose>
            <!-- Sitemap Index -->
            <xsl:when test="sitemap:sitemapindex">
              <div class="stats">
                <div class="stat">
                  <div class="stat-value"><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></div>
                  <div class="stat-label">Sitemaps</div>
                </div>
              </div>
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
            <!-- URL Set -->
            <xsl:otherwise>
              <div class="stats">
                <div class="stat">
                  <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url[not(contains(sitemap:loc, '/ko/')) and not(contains(sitemap:loc, '/ja/'))])"/></div>
                  <div class="stat-label">Pages</div>
                </div>
                <div class="stat">
                  <div class="stat-value">3</div>
                  <div class="stat-label">Languages</div>
                </div>
                <div class="stat">
                  <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                  <div class="stat-label">Total URLs</div>
                </div>
              </div>
              <div class="section-title">Pages by Language</div>
              <xsl:for-each select="sitemap:urlset/sitemap:url[not(contains(sitemap:loc, '/ko/')) and not(contains(sitemap:loc, '/ja/'))]">
                <div class="url-group">
                  <!-- English (default) -->
                  <div class="url-item">
                    <span class="lang-tag lang-en">EN</span>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </div>
                  <!-- Korean -->
                  <xsl:for-each select="xhtml:link[@hreflang='ko']">
                    <div class="url-item">
                      <span class="lang-tag lang-ko">KO</span>
                      <a href="{@href}"><xsl:value-of select="@href"/></a>
                    </div>
                  </xsl:for-each>
                  <!-- Japanese -->
                  <xsl:for-each select="xhtml:link[@hreflang='ja']">
                    <div class="url-item">
                      <span class="lang-tag lang-ja">JA</span>
                      <a href="{@href}"><xsl:value-of select="@href"/></a>
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
