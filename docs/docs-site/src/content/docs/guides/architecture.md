---
title: Architecture
description: Understanding the SSG architecture and package layer system of the monorepo
---

# Architecture Overview

This document explains the architectural decisions and patterns used in the SoundBlue Public Monorepo.

## SSG Architecture

All applications use **Static Site Generation (SSG)** with React Router v7's `prerender()` pattern.

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        Build Time                                │
│                                                                  │
│   prerender()  →  loader()  →  HTML Files  →  CDN              │
│                                                                  │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│   │ Generate │ → │ Fetch    │ → │ Render   │ → │ Deploy   │   │
│   │ Routes   │   │ Data     │   │ HTML     │   │ Static   │   │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

                              ↓

┌─────────────────────────────────────────────────────────────────┐
│                       Runtime (CDN)                              │
│                                                                  │
│   Static HTML  →  Hydration  →  Interactive React App           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### SSG Configuration Pattern

```typescript
// react-router.config.ts
export default {
  ssr: false,  // ← SSG mode (NEVER change to true)
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const dynamicRoutes = generateI18nRoutes(entries, `/entry/`);
    return [...staticRoutes, ...dynamicRoutes];
  },
} satisfies Config;
```

### Pages Generated

| App | SSG Pages | Description |
|-----|-----------|-------------|
| Context | 33,748 | All dictionary entries × 2 languages |
| Permissive | 8 | Libraries + Web APIs pages |
| Roots | 920 | Math topics × 2 languages |

## Package Layer System

The monorepo follows a strict layered architecture:

```
Layer 3 (Apps + UI)
┌─────────────────────────────────────┐
│  apps/*  +  packages/shared-react   │
└────────────────┬────────────────────┘
                 │
Layer 2 (Domain)
┌────────────────┴────────────────────┐
│  packages/i18n, packages/seo        │
│  packages/platform                   │
└────────────────┬────────────────────┘
                 │
Layer 1 (Foundation)
┌────────────────┴────────────────────┐
│  packages/config, packages/types    │
└─────────────────────────────────────┘
```

### Layer Rules

- **Layer N can only import from Layer N-1 or below**
- - Apps (Layer 3) can import from any package
  - - `packages/i18n` (Layer 2) cannot import from `packages/shared-react` (Layer 3)
    - - `packages/config` (Layer 1) cannot import from any other package
     
      - ## Directory Structure
     
      - ```
        public-monorepo/
        ├── apps/                    # Applications (Layer 3)
        │   ├── context/            # Korean Dictionary
        │   ├── permissive/         # Web Dev Resources
        │   └── roots/              # Math Documentation
        │
        ├── packages/               # Shared packages
        │   ├── config/            # Layer 1: Build configs
        │   ├── types/             # Layer 1: Shared types
        │   ├── i18n/              # Layer 2: Internationalization
        │   ├── seo/               # Layer 2: SEO utilities
        │   ├── platform/          # Layer 2: Platform utilities
        │   └── shared-react/      # Layer 3: React components
        │
        ├── data/                   # Shared data files
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

        ### 1. SSG Mode Only

        ```typescript
        // ✅ Correct
        export default { ssr: false, ... }

        // ❌ NEVER do this
        export default { ssr: true, ... }
        ```

        ### 2. No Hardcoding

        ```typescript
        // ✅ Use data files
        const entries = await loadEntries();

        // ❌ Don't hardcode
        const entries = [{ id: 'hello', ... }];
        ```

        ### 3. Hydration Workaround

        Due to React Router v7 + React 19 SSG hydration bug, a workaround is required:

        ```typescript
        // apps/*/app/entry.client.tsx - DO NOT DELETE!
        setTimeout(() => {
          const divs = [...document.body.children].filter(el => el.tagName === 'DIV');
          if (divs.length > 1 && Object.keys(divs[0]).some(k => k.startsWith('__react'))) {
            divs[0].remove();
          }
        }, 100);
        ```
