# @soundblue/features

[![npm](https://img.shields.io/npm/v/@soundblue/features)](https://www.npmjs.com/package/@soundblue/features)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)

Shared business logic hooks for the [soundblue monorepo](https://github.com/soundbluemusic/public-monorepo) — settings store (Zustand), toast notifications, media queries, and TanStack Query utilities.

## Part of soundblue

This package is part of a monorepo powering three learning apps:

| App | Description | Live |
|:----|:------------|:-----|
| **Context** | Korean dictionary (16,394 entries) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Permissive** | Web dev resources (110 libraries) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Roots** | Math documentation (438 concepts) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Exports

```typescript
// Settings store (Zustand)
import { useSettingsStore } from '@soundblue/features/settings';

// Toast notifications
import { useToast, toast } from '@soundblue/features/toast';

// Media queries
import { useMediaQuery, useIsMobile } from '@soundblue/features/media';

// TanStack Query utilities
import { QueryClient, dehydrate, HydrationBoundary, queryKeys } from '@soundblue/features/query';
```

## Tech Stack

React 19 · TypeScript · Zustand · TanStack Query

## Links

- [GitHub](https://github.com/soundbluemusic/public-monorepo)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
- [All @soundblue packages](https://www.npmjs.com/org/soundblue)

## License

[Apache License 2.0](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)
