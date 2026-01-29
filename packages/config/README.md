# @soundblue/config

[![npm](https://img.shields.io/npm/v/@soundblue/config)](https://www.npmjs.com/package/@soundblue/config)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)

Shared Vite, Tailwind CSS v4, and Biome configurations for the [soundblue monorepo](https://github.com/soundbluemusic/public-monorepo).

## Part of soundblue

This package is part of a monorepo powering three learning apps:

| App | Description | Live |
|:----|:------------|:-----|
| **Context** | Korean dictionary (16,394 entries) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Permissive** | Web dev resources (110 libraries) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Roots** | Math documentation (438 concepts) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Exports

```typescript
// Vite config factory
import { createViteConfig } from '@soundblue/config/vite';

// Tailwind CSS v4 preset
import { tailwindPreset } from '@soundblue/config/tailwind';

// Biome config
import biomeConfig from '@soundblue/config/biome';

// Base styles
@import "@soundblue/config/styles/tailwind.css";
```

## Tech Stack

React 19 · TanStack Start · TypeScript · Tailwind CSS v4 · Cloudflare Workers · D1

## Links

- [GitHub](https://github.com/soundbluemusic/public-monorepo)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
- [All @soundblue packages](https://www.npmjs.com/org/soundblue)

## License

[Apache License 2.0](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)
