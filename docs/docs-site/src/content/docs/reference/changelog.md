---
title: Changelog
description: Version history and notable changes
---

## v3.0.0 (2026-01-16)

### Breaking Changes
- **Context app: SSR + D1 only** — SSG build mode removed
- `BUILD_TARGET` environment variable deprecated
- Entry pages now served dynamically from D1

### Changed
- Context rendering: SSG → **SSR + Cloudflare D1**
- Sitemap generation: Static → **Dynamic from D1**
- Build output: 16,836 HTML files → **149 static pages only**

### Removed
- `apps/context/app/routes/($locale).entry.$entryId.ssg.tsx`
- `apps/context/app/routes/($locale).entry.$entryId.tsx` (SPA fallback)
- SSG-related environment variables and scripts

### SSG vs SSR + D1 Comparison

| Category | SSG (Legacy) | SSR + D1 (Current) |
|:---------|:-------------|:-------------------|
| **SEO** | | |
| HTML Content | ✅ Full HTML (build time) | ✅ Full HTML (runtime) |
| Meta Tags | ✅ Static | ✅ Dynamic (latest data) |
| Sitemap | Static at build | **Real-time from D1** |
| Crawler Response | Build-time snapshot | **Always fresh** |
| **Build** | | |
| Build Time | ~15min (16,836 HTML) | **~10sec** (149 pages) |
| Build Output | 16,836 HTML + .data | 149 HTML + _worker.js |
| Memory Usage | High (OOM risk) | **Low** |
| CI/CD Time | Long | **Short** |
| **Deployment** | | |
| Deploy Target | R2 + Pages | **Pages Functions only** |
| Deploy Size | ~1.7GB (34,000+ files) | **~50MB** |
| Deploy Speed | Slow (rclone sync) | **Fast** |
| R2 Cost | Class A requests | **None** |
| **Data** | | |
| Data Source | TypeScript (frozen) | **D1 (real-time)** |
| Data Update | Rebuild + redeploy | **D1 update only** |
| Data Consistency | Build-time snapshot | **Always current** |
| Data Size Limit | Build memory limit | **D1 capacity** |
| **Scalability** | | |
| 1M+ Entries | Chunked build required | **Just add queries** |
| OOM Risk | Yes | **None** |
| Workflow Complexity | Matrix build, rclone | **Simple deploy** |
| **Operations** | | |
| Hotfix | Rebuild (~15min) | **D1 instant** |
| A/B Testing | Difficult | **D1 flags** |
| Rollback | Redeploy old build | **D1 data restore** |
| **Cost** | | |
| R2 Storage | 1.7GB used | **None** |
| R2 Requests | Many Class A | **None** |
| D1 Requests | None | Per-request (free tier sufficient) |
| Pages Functions | None | Per-request (free tier sufficient) |
| **Developer Experience** | | |
| Local Testing | Full build needed | **`pnpm dev` instant** |
| Add Data | Build + deploy | **D1 INSERT** |
| Debugging | Build logs | **Runtime logs** |

### Files Modified
- `.github/workflows/deploy-context.yml` — SSR build command
- `apps/context/package.json` — SSR as default
- `apps/context/app/routes.ts` — SSR-only routing
- `apps/context/react-router.config.ts` — `ssr: true` fixed
- `CLAUDE.md`, `ARCHITECTURE.md`, `apps/context/README.md`

---

## v2.1.0 (2026-01-02)

### Added
- SSG Hydration Workaround documentation
- React Router v7 + React 19 hydration bug fix
- `entry.client.tsx` orphan DOM cleanup logic

### Documentation
- Added Hydration Workaround guide
- Updated Architecture docs with protected files

---

## v2.0.0 (2025-12-31)

### Breaking Changes
- Removed `@soundblue/shared` package
- Removed `@soundblue/shared-react` package
- New layer system (L0-L3) replaces flat structure

### Added
- `@soundblue/config` — Vite, Tailwind configs
- `@soundblue/platform` — IndexedDB storage
- `@soundblue/seo` — Meta tags, sitemap
- `@soundblue/pwa` — Service worker, offline
- `@soundblue/features` — Settings, toast, media
- `@soundblue/ui` — React components

### Changed
- Package count: 6 → 10 (modularized)
- Introduced 4-layer dependency system
- Strict import rules between layers

### Migration Guide

```typescript
// Before (v1.x)
import { cn, validateId } from '@soundblue/shared';
import { useToast, Button } from '@soundblue/shared-react';

// After (v2.x)
import { validateId } from '@soundblue/core/validation';
import { cn } from '@soundblue/core/utils';
import { useToast } from '@soundblue/features/toast';
import { Button } from '@soundblue/ui/components';
```

---

## v1.0.0 (Initial Release)

### Features
- 3 apps: Context, Permissive, Roots
- 6 packages: core, data, search, i18n, shared, shared-react
- SSG architecture (later migrated to SSR + D1 for Context)
- Multilingual support (en, ko)

### Packages (v1.0)
| Package | Description |
|---------|-------------|
| `@soundblue/core` | Pure functions, types |
| `@soundblue/data` | Zod schemas, loaders |
| `@soundblue/search` | MiniSearch wrapper |
| `@soundblue/i18n` | Multilingual routing |
| `@soundblue/shared` | Shared utilities |
| `@soundblue/shared-react` | React components |

---

## Upgrade Guide

### v1.x → v2.x

1. **Update imports** — Follow the migration guide above
2. **Check layer rules** — Run `/layer-check`
3. **Rebuild all** — `pnpm build`
4. **Test hydration** — Verify buttons work after build

### Key Changes to Watch

| v1.x | v2.x | Notes |
|------|------|-------|
| `shared/` | `core/`, `ui/` | Split by purpose |
| `shared-react/` | `ui/`, `features/` | Split by purpose |
| Flat structure | Layer system | L0-L3 rules |
| — | `entry.client.tsx` | Hydration fix required |

## Related

- [SSG Deep Dive](/public-monorepo/guides/ssg-deep-dive/) — SSG architecture
- [Layer System](/public-monorepo/ai-guidelines/layer-system/) — Import rules
- [Hydration Workaround](/public-monorepo/guides/hydration-workaround/) — v2.1 fix
