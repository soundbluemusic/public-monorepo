---
title: Dependency Graph
description: Visual representation of package dependencies in the monorepo
---

This page visualizes how packages and apps depend on each other in the monorepo.

## Package Dependencies

```
apps/context ─────────┬─── @soundblue/ui
apps/roots ───────────┤    @soundblue/features
apps/permissive ──────┘    @soundblue/pwa
                           │
                           ▼
                      @soundblue/i18n
                      @soundblue/search
                      @soundblue/seo
                           │
                           ▼
                      @soundblue/data
                      @soundblue/platform
                           │
                           ▼
                      @soundblue/core
                      @soundblue/config
```

## Detailed Dependencies

### Apps → Packages

| App | Direct Dependencies |
|-----|---------------------|
| `apps/context` | ui, features, pwa, i18n, search, seo, data, core |
| `apps/roots` | ui, features, pwa, i18n, seo, data, core |
| `apps/permissive` | ui, features, i18n, seo, core |

### Layer 3 → Layer 2

| Package | Dependencies |
|---------|--------------|
| `@soundblue/ui` | i18n, seo, core |
| `@soundblue/features` | i18n, data, platform, core |

### Layer 2 → Layer 1

| Package | Dependencies |
|---------|--------------|
| `@soundblue/i18n` | data, core |
| `@soundblue/search` | data, core |
| `@soundblue/seo` | core |
| `@soundblue/pwa` | platform, core |

### Layer 1 → Layer 0

| Package | Dependencies |
|---------|--------------|
| `@soundblue/data` | core |
| `@soundblue/platform` | core |

### Layer 0 (No Dependencies)

| Package | Dependencies |
|---------|--------------|
| `@soundblue/core` | None (foundation) |
| `@soundblue/config` | None (foundation) |

## External Dependencies

### Build Tools

```
Vite ────────────────────→ All apps
Turborepo ───────────────→ Monorepo orchestration
TypeScript ──────────────→ All packages
Tailwind CSS v4 ─────────→ @soundblue/config, @soundblue/ui
```

### Runtime Libraries

```
React 19 ────────────────→ All apps, @soundblue/ui
React Router v7 ─────────→ All apps
Dexie.js ────────────────→ @soundblue/platform
MiniSearch ──────────────→ @soundblue/search
Zod ─────────────────────→ @soundblue/data
Paraglide ───────────────→ @soundblue/i18n
```

## Circular Dependency Prevention

The layer system prevents circular dependencies:

```
✅ L3 → L2 → L1 → L0   (Allowed: top-down only)
❌ L0 → L1             (Forbidden: bottom-up)
❌ L2 → L2             (Forbidden: same-layer)
```

### Detection

Use the custom skill to check:

```bash
/layer-check
```

This will report any violations like:

```
ERROR: @soundblue/core imports from @soundblue/platform
       L0 cannot import from L1
```

## Related

- [Layer System](/public-monorepo/ai-guidelines/layer-system/) — Import rules
- [Architecture](/public-monorepo/guides/architecture/) — Full architecture overview
- [Packages Overview](/public-monorepo/packages/) — Package documentation
