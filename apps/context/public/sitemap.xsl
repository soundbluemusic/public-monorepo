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
</xsl:stylesheet>