---
title: SSR Migration Guide
description: Why and how we migrated from SSG to SSR + D1 for large-scale content sites
---

This guide explains why Context app migrated from **SSG + R2** to **SSR + D1 + Cloudflare Workers**, and provides a comprehensive comparison for anyone considering a similar migration.

:::tip[TL;DR]
For sites with 2,000+ entries or frequently updated content, **SSR + D1 is the only viable solution**. SSG becomes a maintenance nightmare at scale.
:::

---

## Migration Summary

| Before | After |
|:-------|:------|
| SSG (Static Site Generation) | **SSR (Server-Side Rendering)** |
| R2 (Object Storage) | **D1 (SQL Database)** |
| 16,836 HTML files pre-built | **Dynamic generation on request** |
| ~15 min build time | **~10 sec build time** |
| 1.7GB deploy size | **~50MB deploy size** |

---

## Detailed Comparison Table

| Category | SSG + R2 (Legacy) | SSR + D1 + Functions (Current) | Impact |
|:---------|:------------------|:-------------------------------|:-------|
| **Rendering** | | | |
| Method | Static Site Generation | Server-Side Rendering | Build errors completely eliminated |
| HTML Generation | Build time (pre-generated) | Runtime (on-demand) | Cloudflare Pages 20K file limit bypassed |
| Physical Files | `/entry/apple.html` exists | No files, route patterns only | 99% reduction in deploy size |
| **SEO** | | | |
| URL Access | Direct file access | Pattern matching + generation | **Identical** — bookmarks/sharing work the same |
| Search Engines | Complete HTML served | Complete HTML generated | **No difference** — Google sees full HTML either way |
| Sitemaps | Static XML at build | Dynamic from D1 | **Better** — auto-updates when data changes |
| **Data Storage** | | | |
| Storage Type | R2 (Object Storage) | D1 (SQL Database) | SQL queries enable search/filter/sort |
| Query Method | File fetch API | SQL WHERE clause | Complex queries possible |
| Lookup Speed | ~50ms (file read) | ~1ms (indexed query) | 50x faster data retrieval |
| **Scalability** | | | |
| At 100K entries | Chunked builds required | Just add rows | No architectural changes needed |
| At 1M entries | Build impossible (OOM) | Works perfectly | D1 handles millions of rows |
| KV vs D1 | - | KV: 100K reads/day, D1: 5M reads/day | **D1 is 50x more generous** |
| **Build Process** | | | |
| Build Time | 1-3 hours (20K HTML) | 1-2 minutes | **50x faster CI/CD** |
| Memory Required | 8GB+ (OOM risk) | Minimal | Stable builds guaranteed |
| On Data Change | Full rebuild required | D1 UPDATE only | **Instant updates** (< 1 second) |
| **Deployment** | | | |
| Deploy Time | Build 1-3hr + Deploy 10min | Build 2min + Deploy 1min | Emergency fixes possible |
| Deploy Size | ~1.7GB (34,000+ files) | ~50MB | 97% reduction |
| Infrastructure | Pages only | **Cloudflare Workers** | Single project management |
| **Performance** | | | |
| Response Time | 50-100ms (CDN) | First: 100-300ms, Cached: 50-100ms | With Edge Cache, **identical speed** |
| Cache Strategy | Automatic (static files) | Cache-Control headers | 80-90% cache hit rate |
| **Cost** | | | |
| R2 Storage | 1.7GB used | None | **Zero storage cost** |
| R2 Requests | Class B: 10M/month free | None | No R2 charges |
| D1 Requests | None | 5M reads/day free | Free tier sufficient |
| Pro Plan | R2: 100M/month | D1: 25M reads/day | 7.5x more capacity |
| **Developer Experience** | | | |
| Local Testing | Build then preview | `wrangler dev` instant | Immediate feedback |
| Adding Data | Rebuild + redeploy | D1 INSERT | Data live in seconds |
| Debugging | Build log analysis | Runtime logs | Easier troubleshooting |
| **User Experience** | | | |
| Initial Load | Complete HTML | Complete HTML | **Identical** — fast first paint |
| Navigation | SPA after hydration | SPA after hydration | **Identical** — smooth transitions |
| JS Required | No (for content) | No (for content) | **Identical** — works without JS |

---

## What Stays the Same

These features work **identically** after migration:

- ✅ **Direct URL access** — All URLs work exactly as before
- ✅ **SEO performance** — Search engines see the same complete HTML
- ✅ **Sitemap generation** — Actually better (auto-updates)
- ✅ **User experience** — With caching, same speed
- ✅ **Bookmarks/sharing** — All functionality preserved

---

## What You Gain

New benefits from SSR + D1:

- ✅ **No build hell** — 1-3 hours → 2 minutes
- ✅ **Unlimited pages** — 20K limit → millions
- ✅ **Instant updates** — No rebuild needed
- ✅ **Lower costs** — No R2 storage/requests
- ✅ **Better operations** — Hotfixes in seconds
- ✅ **Simpler infrastructure** — Single project

---

## When to Use Each Mode

### Use SSG When:
- Content is **static** (rarely changes)
- Page count is **under 1,000**
- Build time is **under 5 minutes**
- No real-time data requirements

### Use SSR + D1 When:
- Content is **dynamic** (frequently updated)
- Page count is **over 2,000** or growing
- Need **instant updates** without rebuild
- Scaling to **100K+ pages** is possible

---

## Migration Checklist

1. **Set up D1 database**
   ```bash
   wrangler d1 create your-db
   wrangler d1 execute your-db --file=schema.sql
   ```

2. **Update react-router.config.ts**
   ```typescript
   export default {
     ssr: true,  // Changed from false
     async prerender() {
       // Only static pages, not dynamic content
       return staticRoutes;
     },
   } satisfies Config;
   ```

3. **Convert loaders to D1 queries**
   ```typescript
   export async function loader({ params, context }) {
     const db = context.cloudflare.env.DB;
     return await db.prepare('SELECT * FROM entries WHERE id = ?')
       .bind(params.id).first();
   }
   ```

4. **Configure wrangler.toml**
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "your-db"
   database_id = "your-db-id"
   ```

5. **Update _routes.json for Functions**
   ```json
   {
     "include": ["/entry/*", "/ko/entry/*"],
     "exclude": []
   }
   ```

---

## Conclusion

**D1 + SSR + Cloudflare Workers = The only answer for large-scale content sites**

If you have 2,000+ entries or frequently updated content, SSG is a maintenance nightmare. SSR + D1 provides:
- Unlimited scalability
- Instant updates
- Lower costs
- Better developer experience

All while maintaining **identical SEO and user experience**.

---

## Related

- [Rendering Modes](/public-monorepo/guides/ssg-deep-dive/) — SSG vs SSR architecture
- [Changelog v3.0.0](/public-monorepo/reference/changelog/) — Migration details
- [Context App README](https://github.com/soundbluemusic/public-monorepo/tree/main/apps/context) — Current architecture
