# @soundblue/core

[![npm](https://img.shields.io/npm/v/@soundblue/core)](https://www.npmjs.com/package/@soundblue/core)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)

Validation, utility functions, and shared TypeScript types for the [soundblue monorepo](https://github.com/soundbluemusic/public-monorepo).

## Part of soundblue

This package is part of a monorepo powering three learning apps:

| App | Description | Live |
|:----|:------------|:-----|
| **Context** | Korean dictionary (16,394 entries) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Permissive** | Web dev resources (110 libraries) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Roots** | Math documentation (438 concepts) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Exports

```typescript
// Validation utilities
import { LIMITS, validateId, isValidLanguage } from '@soundblue/core/validation';

// General utilities
import { chunkArray, debounce, throttle, cn } from '@soundblue/core/utils';

// Shared types
import type { Language, Theme } from '@soundblue/core/types';
```

## Tech Stack

React 19 · TanStack Start · TypeScript · Tailwind CSS v4 · Cloudflare Workers · D1

## Links

- [GitHub](https://github.com/soundbluemusic/public-monorepo)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
- [All @soundblue packages](https://www.npmjs.com/org/soundblue)

## License

[Apache License 2.0](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)
