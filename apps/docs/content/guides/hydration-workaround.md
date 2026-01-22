---
title: Hydration Workaround
description: Understanding and maintaining the React Router v7 + React 19 SSG hydration fix
---

This document explains a **critical workaround** for a known bug in React Router v7 + React 19 SSG environments.

:::caution[Do Not Remove]
The orphan DOM cleanup code in `entry.client.tsx` is essential. Removing it will break all button clicks.
:::

## The Problem

When React Router v7 SSG (`ssr: false`) hydration fails:

1. React 19 creates a new DOM tree
2. The original server-rendered HTML is **not removed**
3. DOM duplication occurs → Users see buttons without React handlers → **Clicks don't work**

```
┌─────────────────────────────────────────┐
│  Before Hydration (SSG HTML)            │
│  ┌─────────────────────────────────┐    │
│  │  <div> (server-rendered)        │    │
│  │    <button>Click me</button>    │ ← Users see this
│  │  </div>                         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  After Hydration (Bug)                  │
│  ┌─────────────────────────────────┐    │
│  │  <div> (orphan - no handlers)   │ ← Still visible!
│  │    <button>Click me</button>    │    │
│  │  </div>                         │    │
│  │  <div> (React - has handlers)   │ ← Hidden behind
│  │    <button>Click me</button>    │    │
│  │  </div>                         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## The Solution

Each app's `entry.client.tsx` removes orphan DOM after hydration:

```typescript
// apps/*/app/entry.client.tsx
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

startTransition(() => {
  hydrateRoot(document, <StrictMode><App /></StrictMode>);

  // Orphan DOM cleanup (React Router v7 SSG bug workaround)
  setTimeout(() => {
    const divs = [...document.body.children].filter(el => el.tagName === 'DIV');
    if (divs.length >= 2) {
      const firstDiv = divs[0] as HTMLElement;
      // Check if the div has React internal properties
      if (!Object.keys(firstDiv).some(k => k.startsWith('__react'))) {
        firstDiv.remove();
      }
    }
  }, 100);
});
```

### How It Works

1. Wait 100ms for React hydration to complete
2. Find all top-level `<div>` elements
3. If there are 2+ divs, check the first one
4. If it lacks React internal properties (`__react*`), it's orphan → remove it

## Protected Files

| File | Purpose | Why Protected |
|------|---------|---------------|
| `apps/*/app/entry.client.tsx` | Hydration + orphan cleanup | Deletion breaks all clicks |
| `apps/*/app/entry.server.tsx` | SSG HTML generation | `prerender` function required |

## Related Issues

- [React Router #12893](https://github.com/remix-run/react-router/issues/12893)
- [React Router #12360](https://github.com/remix-run/react-router/discussions/12360)
- [React Router #13368](https://github.com/remix-run/react-router/issues/13368)

## Testing the Fix

To verify the workaround is working:

```bash
# 1. Build the app
pnpm build:context

# 2. Preview the build
pnpm preview:context

# 3. Open browser, check:
#    - Buttons are clickable
#    - No duplicate content visible
#    - Console has no hydration errors
```

## Troubleshooting

### Buttons Still Not Clickable

1. Check `entry.client.tsx` exists and has the cleanup code
2. Verify the timeout (100ms) is not too short
3. Look for console errors during hydration

### Content Flickers

1. The 100ms delay might be visible on slow connections
2. Consider increasing timeout if needed, but keep it minimal

## Related

- [SSG Deep Dive](/public-monorepo/guides/ssg-deep-dive/) — Understanding SSG architecture
- [Troubleshooting](/public-monorepo/guides/troubleshooting/) — Common issues and fixes
