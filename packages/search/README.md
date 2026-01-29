# @soundblue/search

[![npm](https://img.shields.io/npm/v/@soundblue/search)](https://www.npmjs.com/package/@soundblue/search)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)

Client-side search engine (MiniSearch wrapper) with Web Worker support and React hooks for the [soundblue monorepo](https://github.com/soundbluemusic/public-monorepo).

## Part of soundblue

This package is part of a monorepo powering three learning apps:

| App | Description | Live |
|:----|:------------|:-----|
| **Context** | Korean dictionary (16,394 entries) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Permissive** | Web dev resources (110 libraries) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Roots** | Math documentation (438 concepts) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Exports

```typescript
// Core search engine
import { SearchEngine, type SearchResult, type SearchConfig } from '@soundblue/search';

// React hooks
import { useSearch, useSearchWorker } from '@soundblue/search/react';

// Web Worker utilities
import { createSearchWorker } from '@soundblue/search/worker';

// App-specific adapters
import { contextAdapter, rootsAdapter } from '@soundblue/search/adapters';
```

## Tech Stack

React 19 · TypeScript · MiniSearch · Web Workers

## Links

- [GitHub](https://github.com/soundbluemusic/public-monorepo)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
- [All @soundblue packages](https://www.npmjs.com/org/soundblue)

## License

[Apache License 2.0](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)
