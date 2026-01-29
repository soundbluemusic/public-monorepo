# @soundblue/pwa

[![npm](https://img.shields.io/npm/v/@soundblue/pwa)](https://www.npmjs.com/package/@soundblue/pwa)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)

Progressive Web App utilities for the [soundblue monorepo](https://github.com/soundbluemusic/public-monorepo) — service worker generation, web manifest, and offline status React hooks.

## Part of soundblue

This package is part of a monorepo powering three learning apps:

| App | Description | Live |
|:----|:------------|:-----|
| **Context** | Korean dictionary (16,394 entries) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Permissive** | Web dev resources (110 libraries) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Roots** | Math documentation (438 concepts) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Exports

```typescript
// Web manifest generation
import { generateManifest } from '@soundblue/pwa/manifest';

// Service worker utilities
import { generateServiceWorker } from '@soundblue/pwa/service-worker';

// React hooks & components
import { OfflineIndicator, useOnlineStatus } from '@soundblue/pwa/react';
```

## Tech Stack

React 19 · TypeScript · Workbox · Service Workers

## Links

- [GitHub](https://github.com/soundbluemusic/public-monorepo)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
- [All @soundblue packages](https://www.npmjs.com/org/soundblue)

## License

[Apache License 2.0](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)
