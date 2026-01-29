# @soundblue/ui

[![npm](https://img.shields.io/npm/v/@soundblue/ui)](https://www.npmjs.com/package/@soundblue/ui)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)

React UI component library for the [soundblue monorepo](https://github.com/soundbluemusic/public-monorepo) — primitives, patterns, animations, and feedback components styled with Tailwind CSS v4.

## Part of soundblue

This package is part of a monorepo powering three learning apps:

| App | Description | Live |
|:----|:------------|:-----|
| **Context** | Korean dictionary (16,394 entries) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Permissive** | Web dev resources (110 libraries) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Roots** | Math documentation (438 concepts) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Exports

```typescript
// Shared components
import { DarkModeToggle, LanguageToggle } from '@soundblue/ui/components';

// Complex UI patterns
import { SearchDropdown, VirtualList, Pagination } from '@soundblue/ui/patterns';

// Feedback
import { ToastContainer, ErrorBoundary } from '@soundblue/ui/feedback';

// Primitives
import { Skeleton, ProgressBar } from '@soundblue/ui/primitives';

// Animation (Framer Motion)
import { FadeIn, SlideUp, ScaleIn } from '@soundblue/ui/animation';

// Hooks
import { useAutoAnimate } from '@soundblue/ui/hooks';

// Table
import { DataTable } from '@soundblue/ui/table';

// Utilities
import { cn, preloadImage } from '@soundblue/ui/utils';

// Base styles
@import "@soundblue/ui/styles/base.css";
```

## Tech Stack

React 19 · TypeScript · Tailwind CSS v4 · Framer Motion

## Links

- [GitHub](https://github.com/soundbluemusic/public-monorepo)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
- [All @soundblue packages](https://www.npmjs.com/org/soundblue)

## License

[Apache License 2.0](https://github.com/soundbluemusic/public-monorepo/blob/main/LICENSE)
