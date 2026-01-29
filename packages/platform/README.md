# @soundblue/platform

[![npm](https://img.shields.io/npm/v/@soundblue/platform)](https://www.npmjs.com/package/@soundblue/platform)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)

Browser storage layer (IndexedDB via Dexie.js) for the [soundblue monorepo](https://github.com/soundbluemusic/public-monorepo). Manages favorites, recent views, study progress, and user settings.

## Part of soundblue

This package is part of a monorepo powering three learning apps:

| App | Description | Live |
|:----|:------------|:-----|
| **Context** | Korean dictionary (16,394 entries) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Permissive** | Web dev resources (110 libraries) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Roots** | Math documentation (438 concepts) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Exports

```typescript
// IndexedDB storage
import { storage } from '@soundblue/platform/storage';

// Types
import type { FavoriteItem, RecentViewItem, SettingsData } from '@soundblue/platform';
```

## Tech Stack

React 19 · TanStack Start · TypeScript · Dexie.js · IndexedDB

## Links

- [GitHub](https://github.com/soundbluemusic/public-monorepo)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
- [All @soundblue packages](https://www.npmjs.com/org/soundblue)

## License

[Apache License 2.0](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)
