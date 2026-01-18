---
title: Rendering Modes
description: Understanding SSR architecture with React Router v7 and Cloudflare Workers
---

This project uses **SSR (Server-Side Rendering)** for all apps, deployed on **Cloudflare Workers**.

## Rendering Mode by App

| App | Mode | Data Source | Use Case |
|:----|:-----|:------------|:---------|
| **Context** | **SSR + D1** | Cloudflare D1 | 16,836 entries (scalable to 1M+) |
| **Roots** | SSR | TypeScript | 438 concepts |
| **Permissive** | SSR | In-memory | 88 libraries, 56 Web APIs |

:::note[Mode Selection Guide]
- **SSR + D1**: Large/frequently updated content (1,000+ entries)
- **SSR + In-memory**: Small/static content
- **SPA**: Never allowed (SEO impossible)
:::

---

## SSR + D1 Architecture (Context App)

Context app uses **SSR + Cloudflare D1** for unlimited scalability.

```text
┌─────────────────────────────────────────────────────────────────┐
│  Runtime (Cloudflare Workers)                                    │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  Client  │ → │ Workers  │ → │    D1     │                  │
│  │ Request  │    │  (SSR)   │    │ Database  │                  │
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

### SSR Loader Pattern (D1)

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

## SSR Architecture (Roots/Permissive Apps)

Roots and Permissive apps use **SSR + Cloudflare Workers** with in-memory data.

```text
┌─────────────────────────────────────────────────────────────────┐
│  Build Time                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ prerender() │ → │  loader()   │ → │  Static HTML  │         │
│  │ (정적 페이지)│    │ (정적 데이터)│    │  (CDN 캐시)   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              +
┌─────────────────────────────────────────────────────────────────┐
│  Runtime (Cloudflare Workers)                                    │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Request    │ → │  Workers    │ → │  SSR HTML     │         │
│  │ /concept/:id│    │  loader()   │    │  (dynamic)   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### SSR Configuration

```typescript
// apps/roots/react-router.config.ts
export default {
  ssr: true,  // SSR mode
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const conceptRoutes = generateI18nRoutes(concepts, (c) => `/concept/${c.id}`);
    return [...staticRoutes, ...conceptRoutes];
  },
} satisfies Config;
```

### SSR Loader Pattern (In-memory)

```typescript
// apps/roots/app/routes/($locale).concept.$conceptId.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const concept = getConceptById(params.conceptId);
  if (!concept) throw new Response('Not Found', { status: 404 });
  return { concept };
}
```

---

## Why SSR for All Apps?

| Factor | SSR + Workers |
|:-------|:--------------|
| **Deployment** | Unified Cloudflare Workers |
| **Scalability** | Unlimited |
| **Data freshness** | Real-time |
| **Build time** | Fast (~30s) |
| **SEO** | Full HTML on first request |

---

## Prohibited Modes

:::danger[Never Use]
- **SPA mode** — Empty `<div id="root"></div>` breaks SEO
- **ISR mode** — Not supported by Cloudflare Workers
:::

---

## Related

- [SSR Migration Guide](/public-monorepo/guides/ssr-migration/) — Why we migrated to SSR
- [Hydration Workaround](/public-monorepo/guides/hydration-workaround/) — React 19 hydration bug fix
- [Troubleshooting](/public-monorepo/guides/troubleshooting/) — Common build errors
