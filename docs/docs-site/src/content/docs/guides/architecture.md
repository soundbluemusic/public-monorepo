---
title: Architecture
description: Understanding the rendering modes and package layer system of the monorepo
---

# Architecture Overview

This document explains the architectural decisions and patterns used in the SoundBlue Public Monorepo.

## Rendering Modes

Each application uses a different rendering mode optimized for its use case:

| App | Mode | Data Source | Deployment |
|:----|:-----|:------------|:-----------|
| **Context** | **SSR + D1** | Cloudflare D1 | **Cloudflare Workers** |
| **Permissive** | SSR | In-memory | Cloudflare Workers |
| **Roots** | SSR | TypeScript | Cloudflare Workers |

### SSR + D1 Architecture (Context)

```
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

### SSR Configuration Pattern (Context)

```typescript
// react-router.config.ts
export default {
  ssr: true,  // ← SSR mode - D1 queries at runtime
  async prerender() {
    // Only static pages (home, about, categories)
    return [...staticRoutes, ...categoryRoutes];
  },
} satisfies Config;
```

### SSR Architecture (Roots/Permissive)

```
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

### SSR Configuration Pattern (Roots/Permissive)

```typescript
// react-router.config.ts
export default {
  ssr: true,  // ← SSR mode - all apps use SSR
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const conceptRoutes = generateI18nRoutes(concepts, `/concept/`);
    return [...staticRoutes, ...conceptRoutes];
  },
} satisfies Config;
```

## Package Layer System

The monorepo follows a strict layered architecture:

```
Layer 3 (Apps + UI)
┌─────────────────────────────────────┐
│  apps/*  +  @soundblue/ui          │
│  @soundblue/features               │
└────────────────┬────────────────────┘
                 │
Layer 2 (Domain)
┌────────────────┴────────────────────┐
│  @soundblue/i18n   @soundblue/seo  │
│  @soundblue/search @soundblue/pwa  │
└────────────────┬────────────────────┘
                 │
Layer 1 (Data)
┌────────────────┴────────────────────┐
│  @soundblue/data  @soundblue/platform │
└────────────────┬────────────────────┘
                 │
Layer 0 (Foundation)
┌────────────────┴────────────────────┐
│  @soundblue/core  @soundblue/config │
└─────────────────────────────────────┘
```

### Layer Rules

- **Layer N can only import from Layer N-1 or below**
- Apps (Layer 3) can import from any package
- `@soundblue/i18n` (Layer 2) cannot import from `@soundblue/ui` (Layer 3)
- `@soundblue/core` (Layer 0) cannot import from any other package

## Directory Structure

```
public-monorepo/
├── apps/                    # Applications (Layer 3)
│   ├── context/            # Korean Dictionary
│   ├── permissive/         # Web Dev Resources
│   └── roots/              # Math Documentation
│
├── packages/               # Shared packages (10 packages)
│   ├── core/              # Layer 0: Validation, utils, types
│   ├── config/            # Layer 0: Vite, Tailwind configs
│   ├── data/              # Layer 1: Zod schemas, loaders
│   ├── platform/          # Layer 1: IndexedDB storage
│   ├── i18n/              # Layer 2: URL routing, Paraglide
│   ├── search/            # Layer 2: MiniSearch wrapper
│   ├── seo/               # Layer 2: Meta tags, sitemap
│   ├── pwa/               # Layer 2: Service worker
│   ├── features/          # Layer 3: Settings, toast
│   └── ui/                # Layer 3: React components
│
├── data/                   # JSON data (SSoT)
│   ├── context/           # Dictionary entries
│   └── roots/             # Math content
│
├── docs/                   # Documentation
│   └── docs-site/         # Starlight documentation site
│
└── tests/                  # E2E tests
```

## i18n Routing

URL path-based language detection (not query parameters):

| URL | Language |
|-----|----------|
| `/entry/hello` | English (default) |
| `/ko/entry/hello` | Korean |

All routes are duplicated for each language at build time.

## SEO Implementation

### Canonical & Hreflang

```html
<!-- /entry/hello (English page) -->
<link rel="canonical" href="https://context.soundbluemusic.com/entry/hello" />
<link rel="alternate" hreflang="en" href="https://context.soundbluemusic.com/entry/hello" />
<link rel="alternate" hreflang="ko" href="https://context.soundbluemusic.com/ko/entry/hello" />
<link rel="alternate" hreflang="x-default" href="https://context.soundbluemusic.com/entry/hello" />
```

### Meta Factory Pattern

```typescript
// Static routes
export const meta = metaFactory({
  ko: { title: '소개 - Context', description: '한국어 사전 소개' },
  en: { title: 'About - Context', description: 'About Korean Dictionary' },
}, 'https://context.soundbluemusic.com');

// Dynamic routes
export const meta = dynamicMetaFactory<typeof loader>({
  getTitle: (data) => `${data.entry.word} - Context`,
  getDescription: (data) => data.entry.translations.explanation,
  baseUrl: 'https://context.soundbluemusic.com',
});
```

## Critical Rules

### 1. Respect Each App's Rendering Mode

```typescript
// All apps use SSR mode
export default { ssr: true, ... }

// ❌ NEVER use SPA mode (no loader, client-only rendering)
// ❌ NEVER set ssr: false
```

### 2. No Hardcoding

```typescript
// ✅ Use data files
const entries = await loadEntries();

// ❌ Don't hardcode
const entries = [{ id: 'hello', ... }];
```

### 3. Hydration Workaround

Due to React Router v7 + React 19 SSR hydration bug, a workaround is required:

```typescript
// apps/*/app/entry.client.tsx - DO NOT DELETE!
setTimeout(() => {
  const divs = [...document.body.children].filter(el => el.tagName === 'DIV');
  if (divs.length > 1 && Object.keys(divs[0]).some(k => k.startsWith('__react'))) {
    divs[0].remove();
  }
}, 100);
```

## Next Steps

- [Package Documentation](/public-monorepo/packages/) - Learn about each shared package
- [Contributing Guide](/public-monorepo/contributing/) - How to contribute to this project
