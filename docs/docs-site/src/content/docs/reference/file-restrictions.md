---
title: File Restrictions
description: Files that must not be modified and why
---

Certain files in this codebase are protected and must not be modified without understanding their critical role.

## Protected Files

### `entry.client.tsx`

**Location:** `apps/*/app/entry.client.tsx`

**Purpose:** Client-side hydration + orphan DOM cleanup

:::danger[Do Not Remove Cleanup Code]
The orphan DOM cleanup code is a workaround for a React Router v7 + React 19 SSR bug. Removing it will break all button clicks.
:::

```typescript
// This code MUST remain
setTimeout(() => {
  const divs = [...document.body.children].filter(el => el.tagName === 'DIV');
  if (divs.length >= 2) {
    const firstDiv = divs[0] as HTMLElement;
    if (!Object.keys(firstDiv).some(k => k.startsWith('__react'))) {
      firstDiv.remove();
    }
  }
}, 100);
```

See [Hydration Workaround](/public-monorepo/guides/hydration-workaround/) for details.

### `entry.server.tsx`

**Location:** `apps/*/app/entry.server.tsx`

**Purpose:** SSR HTML generation

:::caution[Do Not Remove prerender]
The `prerender` export is required for SSR prerendering to work. Removing it breaks the build.
:::

### `react-router.config.ts`

**Location:** `apps/*/react-router.config.ts`

**Purpose:** React Router configuration

:::danger[Respect Each App's Rendering Mode]
Each app has a specific rendering mode. Do not change it without understanding the architecture.
:::

```typescript
// Context app - SSR + D1 (DO NOT change to ssr: false)
export default { ssr: true, ... }

// Roots app - SSR (DO NOT change to ssr: false)
export default { ssr: true, async prerender() { ... } }

// Permissive app - SSR (DO NOT change to ssr: false)
export default { ssr: true, async prerender() { ... } }
```

## File Naming Conventions

### `*.browser.ts`

Files ending with `.browser.ts` run **only in the browser**. They should:
- Use browser APIs (localStorage, IndexedDB, etc.)
- Not be imported in SSR build-time code
- Have a corresponding `.noop.ts` for SSR if needed

### `*.noop.ts`

Files ending with `.noop.ts` are **no-operation stubs** for SSR compatibility:
- Provide empty/default implementations
- Used when browser code needs a build-time fallback
- Must not contain actual logic

```typescript
// storage.noop.ts - SSR fallback
export const storage = {
  get: () => null,
  set: () => {},
  clear: () => {},
};
```

### `*.server.ts`

Files ending with `.server.ts` run **only during build**:
- Generate static content
- Process data
- Not included in client bundle

## Directory Restrictions

### `packages/core/`

**Allowed:** Pure functions, types, constants
**Forbidden:** Browser APIs, React components, side effects

### `packages/data/schemas/`

**Allowed:** Zod schemas only
**Forbidden:** Data fetching, transformations

### `data/**/*.json`

**Allowed:** JSON files matching Zod schemas
**Forbidden:** Non-schema-compliant data

## Modification Checklist

Before modifying any protected file:

1. ✅ Do I understand WHY this code exists?
2. ✅ Have I read the related documentation?
3. ✅ Will my change break the rendering mode (SSR/SSG)?
4. ✅ Will my change break hydration?
5. ✅ Have I tested in production build?

## Related

- [Hydration Workaround](/public-monorepo/guides/hydration-workaround/) — Why entry.client.tsx is protected
- [SSG Deep Dive](/public-monorepo/guides/ssg-deep-dive/) — Understanding SSG architecture
- [Environment Tags](/public-monorepo/reference/environment-tags/) — File environment annotations
