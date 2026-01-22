---
title: Quick Start
description: Get up and running with the SoundBlue Public Monorepo in minutes
head:
  - tag: meta
    attrs:
      name: keywords
      content: quick start, installation, pnpm, Node.js, development server, Turborepo, build, monorepo setup
---

# Quick Start Guide

Get the monorepo running locally in just a few minutes.

## Prerequisites

Before you begin, ensure you have:

| Tool | Version | Installation |
|------|---------|--------------|
| Node.js | ≥22.0.0 | [nodejs.org](https://nodejs.org) |
| pnpm | 10.11.0 | `npm install -g pnpm@10.11.0` |
| Git | Latest | [git-scm.com](https://git-scm.com) |

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/soundbluemusic/public-monorepo.git
cd public-monorepo
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the monorepo, including all apps and packages.

## Development

### Run Individual Apps

Each app has its own development server:

```bash
# Context - Korean Dictionary
pnpm dev:context
# → http://localhost:3003

# Permissive - Web Dev Resources
pnpm dev:permissive
# → http://localhost:3004

# Roots - Math Documentation
pnpm dev:roots
# → http://localhost:3005
```

### Run All Apps

```bash
pnpm dev
```

## Building

### Build Individual Apps

```bash
pnpm build:context    # Build Context app
pnpm build:permissive # Build Permissive app
pnpm build:roots      # Build Roots app
```

### Build All Apps

```bash
pnpm build
```

:::tip[Turborepo Caching]
Turborepo caches build results. Subsequent builds with the same input are **97%+ faster**.
:::

## Quality Checks

### Linting

```bash
pnpm lint        # Run Biome linter
pnpm lint:fix    # Auto-fix linting issues
```

### Type Checking

```bash
pnpm typecheck   # TypeScript type checking
```

### Testing

```bash
pnpm test        # Run Vitest tests
pnpm test:e2e    # Run Playwright E2E tests
```

### All Checks

```bash
pnpm check       # Run all quality checks
```

## Project Commands Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers |
| `pnpm dev:context` | Start Context dev server |
| `pnpm dev:permissive` | Start Permissive dev server |
| `pnpm dev:roots` | Start Roots dev server |
| `pnpm build` | Build all apps |
| `pnpm lint` | Run linter |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |

## Next Steps

Now that you have the project running:

1. **Explore the codebase** - Check out `apps/` for the three applications
2. 2. **Understand the architecture** - Read the [Architecture Guide](/public-monorepo/guides/architecture/)
   3. 3. **Learn about each app** - Visit the app-specific documentation
      4. 4. **Contribute** - See the [Contributing Guide](/public-monorepo/development/contributing/)
