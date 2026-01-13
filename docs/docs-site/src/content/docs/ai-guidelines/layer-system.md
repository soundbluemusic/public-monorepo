---
title: Layer System
description: Package import layer rules and dependency management
---

The monorepo uses a 4-layer system to manage dependencies and prevent circular imports.

## Layer Diagram

```
Layer 3 (Apps + UI)     ┌─────────────────────────────────────────────┐
                        │  apps/context, apps/roots, apps/permissive  │
                        │  @soundblue/ui, @soundblue/features         │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 2 (Domain)        ┌─────────────────────────────────────────────┐
                        │  @soundblue/i18n     @soundblue/search      │
                        │  @soundblue/seo      @soundblue/pwa         │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 1 (Data)          ┌─────────────────────────────────────────────┐
                        │  @soundblue/data     @soundblue/platform    │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 0 (Foundation)    ┌─────────────────────────────────────────────┐
                        │  @soundblue/core     @soundblue/config      │
                        └─────────────────────────────────────────────┘
```

## Import Rules

```
L3 (apps, ui, features) → L2 (i18n, search, seo, pwa) → L1 (data, platform) → L0 (core, config)
```

### Rule 1: Only Import Lower Layers

Layer N can only import from Layer N-1 and below.

```typescript
// ✅ Correct
// From L3 component
import { validateId } from '@soundblue/core/validation';  // L0
import { storage } from '@soundblue/platform/storage';    // L1
import { useSearch } from '@soundblue/search/react';      // L2

// ❌ Prohibited
// From L0 (core)
import { storage } from '@soundblue/platform';  // L0 → L1 forbidden!

// From L2 (i18n)
import { Button } from '@soundblue/ui';  // L2 → L3 forbidden!
```

### Rule 2: No Circular Dependencies

Same-layer packages cannot import from each other.

```typescript
// ❌ Prohibited - Both are L2
// In @soundblue/i18n
import { SearchEngine } from '@soundblue/search';

// In @soundblue/search
import { getLocale } from '@soundblue/i18n';
```

### Rule 3: App-Specific Code Stays in Apps

Code specific to one app should not be in shared packages.

```typescript
// ❌ Prohibited
// In packages/ui/components/ContextEntryCard.tsx
// This is Context-app specific!

// ✅ Correct
// In apps/context/app/components/EntryCard.tsx
// App-specific components stay in the app
```

## Package Details by Layer

### Layer 0: Foundation

| Package | Description | Exports |
|---------|-------------|---------|
| `@soundblue/core` | Pure functions, types, validation | `/validation`, `/utils`, `/types` |
| `@soundblue/config` | Vite, Tailwind, TS configs | `/vite`, `/tailwind` |

**No browser APIs allowed in L0.**

### Layer 1: Data

| Package | Description | Exports |
|---------|-------------|---------|
| `@soundblue/data` | Zod schemas, data loaders | `/schemas`, `/loaders` |
| `@soundblue/platform` | IndexedDB storage (Dexie) | `/storage` |

### Layer 2: Domain

| Package | Description | Exports |
|---------|-------------|---------|
| `@soundblue/i18n` | Multilingual routing, Paraglide | `/`, `/react` |
| `@soundblue/search` | MiniSearch wrapper | `/`, `/react`, `/worker` |
| `@soundblue/seo` | Meta tags, sitemap | `/meta`, `/sitemap` |
| `@soundblue/pwa` | Service worker, offline | `/react`, `/manifest` |

### Layer 3: UI & Features

| Package | Description | Exports |
|---------|-------------|---------|
| `@soundblue/features` | Settings, toast, media hooks | `/settings`, `/toast`, `/media` |
| `@soundblue/ui` | React components | `/components`, `/patterns`, `/feedback`, `/primitives` |

## Checking Layer Violations

Use the custom skill to check for violations:

```bash
/layer-check
```

This will scan the codebase and report any imports that violate the layer rules.

## Related

- [AI Guidelines Overview](/public-monorepo/ai-guidelines/) — Quick reference
- [Rules](/public-monorepo/ai-guidelines/rules/) — Prohibited/required actions
- [Architecture](/public-monorepo/guides/architecture/) — Full architecture overview
