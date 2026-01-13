---
title: Rules
description: Critical rules for AI assistants - what's prohibited and what's required
---

## Prohibited Actions (DO NOT)

### 1. SSG Mode Changes

:::danger[Strictly Prohibited]
- `ssr: true` setting
- SPA, SSR, ISR mode conversion
- Removing/emptying `prerender()`
- Empty `<div id="root"></div>` HTML
:::

### 2. Hardcoding

- Test-passing hardcoded values
- Magic numbers (use named constants)
- Environment-specific fixed values

```typescript
// ❌ Prohibited
const MAX_ITEMS = 100;  // Magic number
if (userId === "user123") { ... }  // Hardcoded

// ✅ Correct
const MAX_ITEMS = LIMITS.MAX_SEARCH_RESULTS;
if (userId === targetUserId) { ... }
```

### 3. Error Hiding

- Empty catch blocks
- `@ts-ignore` without explanation
- Using `any` type to bypass type checking
- Deleting/commenting code to hide errors

```typescript
// ❌ Prohibited
try { ... } catch {}  // Empty catch
// @ts-ignore
const data: any = response;  // any type bypass

// ✅ Correct
try { ... } catch (error) {
  console.error('Failed to fetch:', error);
  throw error;
}
// @ts-ignore - Third party lib missing types (issue #123)
```

### 4. Incomplete Code

```typescript
// ❌ Prohibited
function processData() {
  // ... existing code ...
  // TODO: implement validation
}

// ✅ Correct - Always provide complete implementation
function processData(data: Input): Output {
  const validated = validateInput(data);
  const processed = transform(validated);
  return processed;
}
```

### 5. Overfitting / Quick Fixes

- Conditions that only pass specific test cases
- Branching based on error message string matching
- try-catch that only hides symptoms
- Fixing without understanding root cause

### 6. Downgrades (No Downgrade Policy)

:::danger[Never Downgrade]
Package version downgrades to fix issues are **absolutely prohibited**.
:::

```typescript
// ❌ Prohibited: Downgrade
"react": "^17.0.0"  // Downgraded from 18 due to issues

// ✅ Allowed: Upgrade + code fix
"react": "^19.0.0"  // Latest version + code changes for API updates

// ✅ Allowed: Isolation
"pnpm": { "overrides": { "zod": "^3.25.0" } }  // Conflict isolation
```

**Why?** Downgrades accumulate technical debt. Like mathematical proofs, once verified (build, tests), it should remain unchanged.

---

## Required Actions (MUST DO)

### Response Rules

| Rule | Description |
|------|-------------|
| **Korean responses required** | All explanations and documents in Korean |
| **No assumptions** | Verify code before answering |
| **Complete code** | No `// ...` usage |
| **Cite sources** | Reference `file:line` format |
| **UI verification** | Verify in actual UI after code changes |

### Pre-Modification Checklist

Before making any changes:

1. ✅ Did I understand the root cause (WHY)?
2. ✅ Will existing functionality be preserved?
3. ✅ Are there any hardcoded values?
4. ✅ Will this work for all similar cases?

---

## File-Specific Rules

### Allowed

| Location | Allowed Actions |
|----------|----------------|
| `packages/core/` | Pure functions, types, constants (no browser API) |
| `packages/data/schemas/` | Zod schemas |
| `packages/ui/components/` | React components |
| `apps/*/routes/` | Route components |
| `data/**/*.json` | Schema-compliant data |

### Prohibited

| Location | Prohibited Actions |
|----------|-------------------|
| `react-router.config.ts` | `ssr: true` |
| `*.browser.ts` | Code running at SSG build time |
| `*.noop.ts` | Actual logic (empty implementation only) |
| `entry.client.tsx` | Deleting orphan DOM cleanup logic |

---

## i18n / SEO Rules

### URL Routing

```
/entry/hello     → English
/ko/entry/hello  → Korean
```

### Meta Factory Required

```typescript
// Static routes
export const meta = metaFactory({
  ko: { title: '제목', description: '설명' },
  en: { title: 'Title', description: 'Desc' },
}, 'https://app.soundbluemusic.com');

// Dynamic routes
export const meta = dynamicMetaFactory<typeof loader>({
  getTitle: (data) => data.entry.title,
  baseUrl: 'https://app.soundbluemusic.com',
});
```

## Related

- [AI Guidelines Overview](/public-monorepo/ai-guidelines/) — Quick reference
- [Layer System](/public-monorepo/ai-guidelines/layer-system/) — Import layer rules
