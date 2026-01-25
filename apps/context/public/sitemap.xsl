<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap - Context</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          :root {
            --bg: #ffffff;
            --text: #1f2937;
            --text-secondary: #6b7280;
            --text-muted: #9ca3af;
            --border: #e5e7eb;
            --accent: #3b82f6;
            --card-bg: #f9fafb;
            --header-bg: #f3f4f6;
            --lang-en: #22c55e;
            --lang-ko: #f59e0b;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #111827;
              --text: #f9fafb;
              --text-secondary: #9ca3af;
              --text-muted: #6b7280;
              --border: #374151;
              --accent: #60a5fa;
              --card-bg: #1f2937;
              --header-bg: #1f2937;
              --lang-en: #4ade80;
              --lang-ko: #fbbf24;
            }
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
          .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }

          /* Header */
          .header { background: var(--header-bg); border-bottom: 1px solid var(--border); padding: 2rem 0; margin-bottom: 2rem; }
          .header-content { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
          .breadcrumb { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; }
          .breadcrumb a { color: var(--accent); text-decoration: none; }
          .breadcrumb a:hover { text-decoration: underline; }
          h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
          .subtitle { color: var(--text-secondary); font-size: 1rem; }
          .meta-info { margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted); }

          /* Stats Grid */
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
          .stat { background: var(--card-bg); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.25rem; text-align: center; }
          .stat-value { font-size: 2rem; font-weight: 700; color: var(--accent); line-height: 1.2; }
          .stat-label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.25rem; }

          /* Table */
          .table-container { background: var(--card-bg); border: 1px solid var(--border); border-radius: 0.5rem; overflow: hidden; }
          table { width: 100%; border-collapse: collapse; }
          th { background: var(--header-bg); font-weight: 600; color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; padding: 0.875rem 1rem; border-bottom: 1px solid var(--border); }
          td { padding: 0.875rem 1rem; border-bottom: 1px solid var(--border); vertical-align: top; }
          tr:last-child td { border-bottom: none; }
          tr:hover { background: rgba(59, 130, 246, 0.05); }

          /* Links */
          a { color: var(--accent); text-decoration: none; }
          a:hover { text-decoration: underline; }
          .url-cell { word-break: break-all; }
          .url-path { font-size: 0.875rem; }

          /* Language Tags */
          .lang-tags { display: flex; gap: 0.375rem; flex-wrap: wrap; margin-top: 0.5rem; }
          .lang-tag { font-weight: 600; font-size: 0.625rem; padding: 0.125rem 0.375rem; border-radius: 0.25rem; text-transform: uppercase; }
          .lang-en { background: rgba(34, 197, 94, 0.15); color: var(--lang-en); }
          .lang-ko { background: rgba(245, 158, 11, 0.15); color: var(--lang-ko); }

          /* Footer */
          .footer { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border); font-size: 0.875rem; color: var(--text-muted); }
          .footer a { color: var(--accent); }

          @media (max-width: 768px) {
            .container { padding: 1rem; }
            .header-content { padding: 0 1rem; }
            .stats { grid-template-columns: repeat(2, 1fr); }
            th, td { padding: 0.75rem 0.5rem; font-size: 0.875rem; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-content">
            <div class="breadcrumb">
              <a href="/">Home</a> › Sitemap
            </div>
            <h1>XML Sitemap</h1>
            <p class="subtitle">Context - Korean Dictionary for Learners</p>
            <p class="meta-info">
              This sitemap contains
              <xsl:choose>
                <xsl:when test="sitemap:sitemapindex">
                  <strong><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></strong> sitemap(s).
                </xsl:when>
                <xsl:otherwise>
                  <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url[not(contains(sitemap:loc, '/ko/'))])"/></strong> URL(s) with multilingual support (English &amp; Korean).
                </xsl:otherwise>
              </xsl:choose>
              Learn more at <a href="https://www.sitemaps.org/" target="_blank" rel="noopener">sitemaps.org</a>.
            </p>
          </div>
        </div>

        <div class="container">
          <xsl:choose>
            <!-- Sitemap Index -->
            <xsl:when test="sitemap:sitemapindex">
              <div class="stats">
                <div class="stat">
                  <div class="stat-value"><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></div>
                  <div class="stat-label">Total Sitemaps</div>
                </div>
              </div>

              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th style="width: 5%">#</th>
                      <th>Sitemap URL</th>
                      <th style="width: 20%">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                      <tr>
                        <td><xsl:value-of select="position()"/></td>
                        <td class="url-cell">
                          <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                        </td>
                        <td>
                          <xsl:choose>
                            <xsl:when test="sitemap:lastmod">
                              <xsl:value-of select="sitemap:lastmod"/>
                            </xsl:when>
                            <xsl:otherwise>-</xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:when>

            <!-- URL Set -->
            <xsl:otherwise>
              <div class="stats">
                <div class="stat">
                  <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url[not(contains(sitemap:loc, '/ko/'))])"/></div>
                  <div class="stat-label">Pages</div>
                </div>
                <div class="stat">
                  <div class="stat-value">2</div>
                  <div class="stat-label">Languages</div>
                </div>
                <div class="stat">
                  <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                  <div class="stat-label">Total URLs</div>
                </div>
              </div>

              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th style="width: 5%">#</th>
                      <th>URL</th>
                      <th style="width: 20%">Translations</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:urlset/sitemap:url[not(contains(sitemap:loc, '/ko/'))]">
                      <tr>
                        <td><xsl:value-of select="position()"/></td>
                        <td class="url-cell">
                          <a href="{sitemap:loc}" class="url-path"><xsl:value-of select="sitemap:loc"/></a>
                        </td>
                        <td>
                          <div class="lang-tags">
                            <span class="lang-tag lang-en">EN</span>
                            <xsl:if test="xhtml:link[@hreflang='ko']">
                              <a href="{xhtml:link[@hreflang='ko']/@href}" class="lang-tag lang-ko">KO</a>
                            </xsl:if>
                          </div>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:otherwise>
          </xsl:choose>

          <div class="footer">
            Generated by <a href="https://tanstack.com/start" target="_blank" rel="noopener">TanStack Start</a> ·
            Styled with <a href="https://www.w3.org/Style/XSL/" target="_blank" rel="noopener">XSL</a> ·
            <a href="https://github.com/soundbluemusic/public-monorepo" target="_blank" rel="noopener">View Source</a>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
