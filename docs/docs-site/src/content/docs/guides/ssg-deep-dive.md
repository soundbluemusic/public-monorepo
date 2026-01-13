---
title: SSG Deep Dive
description: Understanding Static Site Generation architecture with React Router v7
---

This project uses **100% Static Site Generation (SSG)** — all 34,676 pages are pre-rendered at build time and served directly from CDN.

:::caution[SSG Only]
This project is SSG-only. SPA, SSR, and ISR modes are prohibited.
:::

## How It Works

React Router v7's `prerender()` + `loader()` pattern generates complete HTML at build time.

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

## SSG Pages per App

| App | Dynamic Routes | SSG Pages | Data Source |
|:----|:---------------|:---------:|:------------|
| **Context** | 16,836 entries + 25 categories + 53 conversations | 33,748 | JSON |
| **Roots** | 438 concepts + 18 fields | 920 | TypeScript |
| **Permissive** | 4 static routes | 8 | Array literals |
| **Total** | — | **34,676** | — |

## Code Pattern

### Configuration (`react-router.config.ts`)

```typescript
export default {
  ssr: false,  // SSG mode - DO NOT CHANGE
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const entryRoutes = generateI18nRoutes(entries, (e) => `/entry/${e.id}`);
    return [...staticRoutes, ...entryRoutes];
  },
} satisfies Config;
```

### Route with Loader (`routes/entry.$entryId.tsx`)

```typescript
export async function loader({ params }: Route.LoaderArgs) {
  const entry = getEntryById(params.entryId);
  if (!entry) throw new Response('Not Found', { status: 404 });
  return { entry };  // → saved as .data file at build time
}

export default function EntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  return <EntryView entry={entry} />;
}
```

## Why SSG?

| Benefit | Description |
|---------|-------------|
| **Instant Load** | Pre-rendered HTML served from CDN edge locations |
| **Zero Cost** | No server infrastructure to maintain |
| **Secure** | No server means no server vulnerabilities |
| **SEO Optimized** | Full HTML content available to search engines |

## Prohibited Changes

:::danger[Do Not Modify]
- Setting `ssr: true` in config
- Removing or emptying `prerender()` function
- Converting to SPA with empty `<div id="root"></div>`
:::

## Related

- [Hydration Workaround](/public-monorepo/guides/hydration-workaround/) — React 19 SSG bug fix
- [Troubleshooting](/public-monorepo/guides/troubleshooting/) — Common build errors
