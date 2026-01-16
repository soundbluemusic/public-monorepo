---
title: Rendering Modes
description: Understanding SSG and SSR architecture with React Router v7
---

This project uses different rendering modes per app for optimal performance and scalability.

## Rendering Mode by App

| App | Mode | Data Source | Pages | Use Case |
|:----|:-----|:------------|:-----:|:---------|
| **Context** | **SSR + D1** | Cloudflare D1 | Dynamic | 16,836 entries (scalable to 1M+) |
| **Roots** | SSG | TypeScript | 920 | 438 concepts (static content) |
| **Permissive** | SSR | In-memory | 8 | Small static data |

:::note[Mode Selection Guide]
- **SSR + D1**: Large/frequently updated content (1,000+ entries)
- **SSG**: Small/rarely updated content (under 1,000 pages)
- **SPA**: ❌ Never allowed (SEO impossible)
:::

---

## SSR + D1 Architecture (Context App)

Context app uses **SSR + Cloudflare D1** for unlimited scalability.

```
┌─────────────────────────────────────────────────────────────────┐
│  Runtime (Cloudflare Pages Functions)                           │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  Client  │ → │  Pages   │ → │    D1     │                  │
│  │ Request  │    │ Function │    │ Database  │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│       ↑                               │                         │
│       └───────────────────────────────┘                         │
│              SSR HTML Response                                   │
└─────────────────────────────────────────────────────────────────┘
```

### SSR Configuration

```typescript
// apps/context/react-router.config.ts
export default {
  ssr: true,  // SSR mode - D1 queries at runtime
  async prerender() {
    // Only static pages (home, about, categories)
    // Entry pages served dynamically from D1
    return [...staticRoutes, ...categoryRoutes];
  },
} satisfies Config;
```

### SSR Loader Pattern

```typescript
// apps/context/app/routes/($locale).entry.$entryId.tsx
export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  if (!db) throw new Response('Database unavailable', { status: 503 });

  const entry = await db.prepare('SELECT * FROM entries WHERE id = ?')
    .bind(params.entryId).first();

  if (!entry) throw new Response('Not Found', { status: 404 });
  return { entry };
}
```

---

## SSG Architecture (Roots App)

Roots app uses **SSG** for static math documentation.

```
┌─────────────────────────────────────────────────────────────────┐
│  Build Time                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ prerender() │ → │  loader()   │ → │  HTML + .data │         │
│  │ (route list)│    │ (fetch data)│    │  (static)    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Runtime (CDN)                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Static HTML served instantly — No server required       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### SSG Configuration

```typescript
// apps/roots/react-router.config.ts
export default {
  ssr: false,  // SSG mode (Roots only) - all pages pre-rendered at build
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const conceptRoutes = generateI18nRoutes(concepts, (c) => `/concept/${c.id}`);
    return [...staticRoutes, ...conceptRoutes];
  },
} satisfies Config;
```

### SSG Loader Pattern

```typescript
// apps/roots/app/routes/($locale).concept.$conceptId.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const concept = getConceptById(params.conceptId);
  if (!concept) throw new Response('Not Found', { status: 404 });
  return { concept };  // → saved as .data file at build time
}
```

---

## Why Different Modes?

| Factor | SSG (Roots) | SSR + D1 (Context) |
|:-------|:------------|:-------------------|
| **Content size** | 438 concepts | 16,836 entries |
| **Update frequency** | Rarely | Frequently |
| **Build time** | ~2 min | N/A (dynamic) |
| **Scalability** | Limited by build | Unlimited |
| **Data freshness** | Build-time snapshot | Real-time |

---

## Prohibited Modes

:::danger[Never Use]
- **SPA mode** — Empty `<div id="root"></div>` breaks SEO
- **ISR mode** — Not supported by Cloudflare Pages
- **SSG for large content** — Build failures at scale
:::

---

## Related

- [SSR Migration Guide](/public-monorepo/guides/ssr-migration/) — Why we migrated Context to SSR
- [Hydration Workaround](/public-monorepo/guides/hydration-workaround/) — React 19 SSG bug fix
- [Troubleshooting](/public-monorepo/guides/troubleshooting/) — Common build errors
