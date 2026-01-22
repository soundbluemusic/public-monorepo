---
title: Environment Tags
description: Module execution environment annotations for SSG compatibility
---

Each module declares its execution environment using JSDoc tags. This ensures code runs in the correct context during build and runtime.

## Tag Types

### `@environment build-only`

Code that runs **only during Node.js build time**. Excluded from client bundle.

```typescript
/**
 * @environment build-only
 * Generates sitemap during build. Not available in browser.
 */
export function generateSitemap(routes: string[]): string {
  return routes.map(r => `<url><loc>${r}</loc></url>`).join('');
}
```

**Use cases:**
- Sitemap generation
- RSS feed creation
- Static data processing
- Build-time validations

### `@environment client-only`

Code that runs **only in the browser**. Returns `undefined` or noop during SSR/SSG.

```typescript
/**
 * @environment client-only
 * Returns online status. undefined during SSG.
 */
export function useOnlineStatus(): boolean | undefined {
  if (typeof window === 'undefined') return undefined;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // ... browser-only logic
  return isOnline;
}
```

**Use cases:**
- Browser API usage (localStorage, navigator, etc.)
- Event listeners (resize, scroll, etc.)
- IndexedDB operations
- Service worker registration

### `@environment universal`

Code safe for **both build and runtime**. Pure functions only.

```typescript
/**
 * @environment universal
 * Safe everywhere. No side effects.
 */
export function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

**Use cases:**
- String/array utilities
- Data transformations
- Type guards
- Constants and validation

## Environment Detection

```typescript
// Check if running in browser
const isBrowser = typeof window !== 'undefined';

// Check if running in Node.js build
const isNode = typeof process !== 'undefined' && process.versions?.node;

// Safe browser-only code
if (isBrowser) {
  localStorage.setItem('key', 'value');
}
```

## Package Environment Matrix

| Package | build-only | client-only | universal |
|---------|:----------:|:-----------:|:---------:|
| `@soundblue/core` | - | - | ✅ |
| `@soundblue/config` | ✅ | - | - |
| `@soundblue/data` | ✅ | - | ✅ |
| `@soundblue/platform` | - | ✅ | - |
| `@soundblue/i18n` | ✅ | ✅ | ✅ |
| `@soundblue/search` | - | ✅ | ✅ |
| `@soundblue/seo` | ✅ | - | ✅ |
| `@soundblue/pwa` | ✅ | ✅ | - |
| `@soundblue/features` | - | ✅ | - |
| `@soundblue/ui` | - | ✅ | ✅ |

## Common Mistakes

### Using browser API in universal code

```typescript
// ❌ Wrong - will crash during SSG build
export function getStoredTheme() {
  return localStorage.getItem('theme');  // localStorage is undefined in Node.js
}

// ✅ Correct - guard browser APIs
export function getStoredTheme(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('theme');
}
```

### Mixing environments in same file

```typescript
// ❌ Avoid - confusing environment mix
export function generateMeta() { /* build-only */ }
export function useTheme() { /* client-only */ }

// ✅ Better - separate files
// meta.server.ts (build-only)
// theme.browser.ts (client-only)
```

## Related

- [SSG Deep Dive](/public-monorepo/guides/ssg-deep-dive/) — How SSG build works
- [File Restrictions](/public-monorepo/reference/file-restrictions/) — Protected files
