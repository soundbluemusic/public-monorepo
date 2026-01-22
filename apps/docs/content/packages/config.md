---
title: "@soundblue/config"
description: Shared Vite, Tailwind, and Biome configurations - Layer 0 foundation package
sidebar:
  order: 3
---

# @soundblue/config

**Layer 0 (Foundation)** — Centralized build tool configurations for all applications.

## Overview

This package provides shared configurations for Vite, Tailwind CSS v4, and Biome. It ensures consistent build behavior across all apps.

| Property | Value |
|----------|-------|
| Layer | 0 (Foundation) |
| Build Required | Yes (pre-compiled) |
| React Required | Optional (for entry-client) |

## Installation

```json
{
  "dependencies": {
    "@soundblue/config": "workspace:*"
  }
}
```

## Exports

### `/vite`

Creates a pre-configured Vite config for React Router v7 SSG apps.

```typescript
// vite.config.ts
import { createViteConfig } from '@soundblue/config/vite';

export default createViteConfig({
  appName: 'context',
  port: 3003,
  pwa: {
    name: 'Context Dictionary',
    shortName: 'Context',
    themeColor: '#3b82f6',
  },
});
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `appName` | `string` | Application identifier |
| `port` | `number` | Development server port |
| `pwa` | `object` | PWA manifest options |
| `pwa.name` | `string` | Full app name |
| `pwa.shortName` | `string` | Short name for home screen |
| `pwa.themeColor` | `string` | Theme color (hex) |

### `/tailwind`

Tailwind CSS v4 preset with design tokens.

```css
/* app.css */
@import "tailwindcss";
@import "@soundblue/config/styles/tailwind.css";
```

#### Design Tokens

The preset includes CSS custom properties:

```css
:root {
  /* Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --accent-primary: #3b82f6;

  /* Spacing */
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 64px;
  --header-height: 64px;
}

[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
}
```

### `/biome`

Biome linter/formatter configuration.

```json
// biome.json
{
  "extends": ["@soundblue/config/biome"]
}
```

### `/entry-client`

Shared client entry with hydration workaround for React Router v7 SSG.

```typescript
// app/entry.client.tsx
import { hydrateWithCleanup } from '@soundblue/config/entry-client';

hydrateWithCleanup();
```

:::caution[Do Not Delete]
The entry-client includes a workaround for React Router v7 + React 19 SSG hydration bug.
See [Architecture](/public-monorepo/guides/architecture/#3-hydration-workaround) for details.
:::

## Example: Full Vite Config

```typescript
// apps/context/vite.config.ts
import { createViteConfig } from '@soundblue/config/vite';

export default createViteConfig({
  appName: 'context',
  port: 3003,
  pwa: {
    name: 'Context - Korean Dictionary',
    shortName: 'Context',
    themeColor: '#3b82f6',
    description: 'Korean dictionary for learners',
  },
});
```

## Build Output

The package is pre-compiled to JavaScript for faster builds:

```
packages/config/
├── dist/
│   ├── vite.js
│   ├── tailwind.js
│   ├── biome.js
│   └── entry-client.js
└── src/
    └── styles/
        └── tailwind.css
```

Run `pnpm build` in the config package to recompile after changes.
