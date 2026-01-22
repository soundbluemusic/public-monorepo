---
title: Package Overview
description: Overview of the 10 shared packages in the monorepo and their layer architecture
head:
  - tag: meta
    attrs:
      name: keywords
      content: packages, monorepo, layer architecture, core, config, data, platform, i18n, search, seo, pwa, features, ui
sidebar:
  order: 1
---

# Package Overview

The monorepo contains **10 shared packages** organized in a strict layer system. Each package has a specific responsibility and can only import from packages in lower layers.

## Layer Architecture

```
Layer 3 (Apps + UI)     @soundblue/ui, @soundblue/features
        ↓
Layer 2 (Domain)        @soundblue/i18n, @soundblue/search, @soundblue/seo, @soundblue/pwa
        ↓
Layer 1 (Data)          @soundblue/data, @soundblue/platform
        ↓
Layer 0 (Foundation)    @soundblue/core, @soundblue/config
```

## Layer Rules

- **Layer N can only import from Layer N-1 or below**
- No circular dependencies between packages in the same layer
- Apps (Layer 3) can import from any package

## Package Summary

### Layer 0: Foundation

| Package | Description |
|---------|-------------|
| [@soundblue/core](/public-monorepo/packages/core/) | Pure functions, types, validation utilities |
| [@soundblue/config](/public-monorepo/packages/config/) | Vite, Tailwind, Biome configurations |

### Layer 1: Data

| Package | Description |
|---------|-------------|
| [@soundblue/data](/public-monorepo/packages/data/) | Zod schemas and data loaders |
| [@soundblue/platform](/public-monorepo/packages/platform/) | IndexedDB storage (Dexie.js) |

### Layer 2: Domain

| Package | Description |
|---------|-------------|
| [@soundblue/i18n](/public-monorepo/packages/i18n/) | URL-based i18n routing, Paraglide integration |
| [@soundblue/search](/public-monorepo/packages/search/) | MiniSearch wrapper with React hooks |
| [@soundblue/seo](/public-monorepo/packages/seo/) | Meta tags, sitemap, structured data |
| [@soundblue/pwa](/public-monorepo/packages/pwa/) | Service worker, manifest generation |

### Layer 3: UI & Features

| Package | Description |
|---------|-------------|
| [@soundblue/features](/public-monorepo/packages/features/) | Settings store, toast notifications, media queries |
| [@soundblue/ui](/public-monorepo/packages/ui/) | React components, animations, UI primitives |

## Installation

All packages are internal workspace packages. They are linked using pnpm workspaces:

```json
{
  "dependencies": {
    "@soundblue/core": "workspace:*",
    "@soundblue/ui": "workspace:*"
  }
}
```

## Environment Tags

Each module is tagged with its execution environment:

| Tag | Description |
|-----|-------------|
| `@environment build-only` | Runs only at build time (Node.js) |
| `@environment client-only` | Runs only in browser |
| `@environment universal` | Safe for both build and runtime |

```typescript
/**
 * @environment build-only
 * Generates sitemap at build time only.
 */
export function generateSitemap() {}

/**
 * @environment client-only
 * Returns undefined during SSG build.
 */
export function useOnlineStatus() {}

/**
 * @environment universal
 * Pure function, safe everywhere.
 */
export function cn(...classes: string[]) {}
```
