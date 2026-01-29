# @soundblue/data

[![npm](https://img.shields.io/npm/v/@soundblue/data)](https://www.npmjs.com/package/@soundblue/data)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)

Zod schemas, data loaders, and metadata for the [soundblue monorepo](https://github.com/soundbluemusic/public-monorepo).

Validates and loads structured learning data across three apps:

- **Context** — 16,394 Korean dictionary entries, 52 categories
- **Roots** — 438 math concepts, 18 fields
- **Permissive** — 110 open-source libraries, 56 Web APIs

## Part of soundblue

| App | Description | Live |
|:----|:------------|:-----|
| **Context** | Korean dictionary (16,394 entries) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Permissive** | Web dev resources (110 libraries) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Roots** | Math documentation (438 concepts) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Exports

```typescript
// Zod schemas
import { EntrySchema, ConceptSchema } from '@soundblue/data/schemas';
import { ContextEntrySchema } from '@soundblue/data/schemas/context';
import { RootsConceptSchema } from '@soundblue/data/schemas/roots';
import { PermissiveLibrarySchema } from '@soundblue/data/schemas/permissive';

// Data loaders
import { createDataLoader, loadJson, loadJsonDirectory } from '@soundblue/data/loaders';

// Metadata
import { metadata } from '@soundblue/data/metadata';
```

## Tech Stack

React 19 · TanStack Start · TypeScript · Zod · Cloudflare D1

## Links

- [GitHub](https://github.com/soundbluemusic/public-monorepo)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
- [All @soundblue packages](https://www.npmjs.com/org/soundblue)

## License

[Apache License 2.0](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)
