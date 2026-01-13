---
title: Changelog
description: Version history and notable changes
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
- 100% SSG architecture
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
