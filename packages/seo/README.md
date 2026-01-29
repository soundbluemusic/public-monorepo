# @soundblue/seo

[![npm](https://img.shields.io/npm/v/@soundblue/seo)](https://www.npmjs.com/package/@soundblue/seo)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)

SEO utilities for the [soundblue monorepo](https://github.com/soundbluemusic/public-monorepo) — meta tag factories, sitemap generation, robots.txt, and Schema.org structured data.

## Part of soundblue

This package is part of a monorepo powering three learning apps:

| App | Description | Live |
|:----|:------------|:-----|
| **Context** | Korean dictionary (16,394 entries) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Permissive** | Web dev resources (110 libraries) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Roots** | Math documentation (438 concepts) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Exports

```typescript
// Meta tag factories (TanStack Start head)
import { headFactory, dynamicHeadFactoryEn, dynamicHeadFactoryKo } from '@soundblue/seo/meta';

// Sitemap generation
import { generateSitemap } from '@soundblue/seo/sitemap';

// Robots.txt
import { generateRobots } from '@soundblue/seo/robots';

// Schema.org structured data
import { generateBreadcrumbSchema } from '@soundblue/seo/structured-data';
```

## Tech Stack

React 19 · TanStack Start · TypeScript · SSR · Cloudflare Workers

## Links

- [GitHub](https://github.com/soundbluemusic/public-monorepo)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
- [All @soundblue packages](https://www.npmjs.com/org/soundblue)

## License

[Apache License 2.0](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)
