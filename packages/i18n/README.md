# @soundblue/i18n

[![npm](https://img.shields.io/npm/v/@soundblue/i18n)](https://www.npmjs.com/package/@soundblue/i18n)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)

Internationalization for the [soundblue monorepo](https://github.com/soundbluemusic/public-monorepo) — URL-based locale routing (`/ko/entry/...`), React hooks, and Paraglide integration.

## Part of soundblue

This package is part of a monorepo powering three learning apps:

| App | Description | Live |
|:----|:------------|:-----|
| **Context** | Korean dictionary (16,394 entries) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Permissive** | Web dev resources (110 libraries) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Roots** | Math documentation (438 concepts) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Exports

```typescript
// Locale utilities
import { getLocaleFromPath, stripLocaleFromPath } from '@soundblue/i18n';

// React hooks
import { useI18n, useLocale } from '@soundblue/i18n/react';

// Meta factory
import { metaFactory } from '@soundblue/i18n/meta';

// Route generation
import { generateI18nRoutes, extractStaticRoutes } from '@soundblue/i18n/utils';
```

## Tech Stack

React 19 · TanStack Start · TypeScript · Paraglide

## Links

- [GitHub](https://github.com/soundbluemusic/public-monorepo)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
- [All @soundblue packages](https://www.npmjs.com/org/soundblue)

## License

[Apache License 2.0](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)
