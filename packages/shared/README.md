# @soundblue/shared

> Shared utilities for Soundblue monorepo apps (공용 유틸리티)

---

## Installation (설치)

```bash
# Already included in monorepo
pnpm add @soundblue/shared
```

---

## Exports (내보내기)

| Export Path | Description |
|:------------|:------------|
| `@soundblue/shared` | Main exports (constants, validation, search, i18n, db) |
| `@soundblue/shared/node` | Node.js-only utilities (file loaders) |
| `@soundblue/shared/constants` | Constants only |
| `@soundblue/shared/validation` | Validation functions only |
| `@soundblue/shared/search` | Search utilities only |
| `@soundblue/shared/db` | Database helpers only |

---

## API Reference

### Constants

```typescript
import { LIMITS, BREAKPOINTS, RESERVED_NAMES } from '@soundblue/shared';

LIMITS.ID_LENGTH      // 100 - Maximum ID length
LIMITS.SEARCH_LENGTH  // 100 - Maximum search query length

BREAKPOINTS.MOBILE    // 768 - Mobile breakpoint (px)

RESERVED_NAMES        // ['__proto__', 'constructor', 'prototype']
```

### Validation

```typescript
import { validateId, isReservedName, isValidTheme, isValidLanguage } from '@soundblue/shared';

// Throws error if invalid
validateId('my-id', 'entryId');

// Type guards
isReservedName('__proto__');     // true
isValidTheme('dark');            // true
isValidLanguage('ko');           // true
```

### Search

```typescript
import { sanitizeSearchQuery, filterBySearch, createSearchHandler } from '@soundblue/shared';

// Sanitize user input
const query = sanitizeSearchQuery('  Hello World  ');  // 'hello world'

// Filter items by search query
const results = filterBySearch(items, query, ['name', 'description']);

// Create debounced search handler
const handleSearch = createSearchHandler(300);  // 300ms debounce
```

### i18n

```typescript
import {
  getLocaleFromPath,
  stripLocaleFromPath,
  buildLocalePath,
  languageNames,
  languageFlags
} from '@soundblue/shared';

getLocaleFromPath('/ko/about');      // 'ko'
getLocaleFromPath('/about');         // 'en'

stripLocaleFromPath('/ko/about');    // '/about'

buildLocalePath('/about', 'ko');     // '/ko/about'

languageNames.ko;  // '한국어'
languageFlags.ko;  // '🇰🇷'
```

### Database Helpers

```typescript
import {
  createFavoritesHelper,
  createSettingsHelper,
  createRecentViewsHelper
} from '@soundblue/shared';

// Create favorites helper for a Dexie table
const favorites = createFavoritesHelper(db.favorites, 'entryId');

await favorites.add('hello');
await favorites.remove('hello');
await favorites.toggle('hello');
await favorites.isFavorite('hello');  // boolean
await favorites.getAll();             // FavoriteEntry[]
await favorites.count();              // number

// Create settings helper
const settings = createSettingsHelper(db.settings, defaultSettings);

await settings.get();
await settings.update({ theme: 'dark' });

// Create recent views helper
const recentViews = createRecentViewsHelper(db.recentViews, 'conceptId');

await recentViews.add('algebra');
await recentViews.getRecent(10);
await recentViews.clear();
```

### Node.js Utilities

```typescript
// Only import in Node.js environment (build scripts)
import { loadJsonDirectory } from '@soundblue/shared/node';

const entries = await loadJsonDirectory('./data/entries');
```

---

## Types

```typescript
import type {
  Language,           // 'en' | 'ko'
  ReservedName,       // '__proto__' | 'constructor' | 'prototype'
  BaseFavorite,       // { id: number; createdAt: Date }
  BaseSettings,       // { id: number }
  BaseRecentView,     // { id: number; viewedAt: Date }
  FavoritesHelper,
  SettingsHelper,
  RecentViewsHelper,
} from '@soundblue/shared';
```

---

## Usage Notes

- **SSG Compatible**: All utilities work in both build-time and runtime
- **No External Dependencies**: Pure TypeScript utilities (except Dexie for db)
- **Tree-shakeable**: Import only what you need

---

## License

Apache License 2.0
