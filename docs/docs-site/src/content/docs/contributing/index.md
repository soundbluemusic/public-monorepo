---
title: Contributing Guide
description: How to contribute to the SoundBlue Public Monorepo
sidebar:
  order: 1
---

# Contributing Guide

Thank you for your interest in contributing to the SoundBlue Public Monorepo! This guide will help you get started.

## Quick Start

```bash
# 1. Fork & Clone
git clone https://github.com/YOUR_USERNAME/public-monorepo.git
cd public-monorepo

# 2. Install dependencies
pnpm install

# 3. Run development server
pnpm dev:context     # → http://localhost:3003
pnpm dev:permissive  # → http://localhost:3004
pnpm dev:roots       # → http://localhost:3005
```

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | ≥ 20 |
| pnpm | 10.11.0 |
| Git | Any recent version |

## Critical Rules

:::danger[SPA Mode Prohibited]
This project uses **SSR and SSG modes only**. SPA mode is prohibited because it returns empty HTML, breaking SEO.

Each app has its own rendering mode:
- **Context**: SSR + Cloudflare D1
- **Permissive**: SSR
- **Roots**: SSG (920 pages)
:::

### 1. Respect Each App's Rendering Mode

```typescript
// Context app (SSR + D1)
export default { ssr: true, ... }

// Roots app (SSG)
export default { ssr: false, async prerender() { ... } }

// ❌ NEVER use SPA mode (no loader, client-only rendering)
```

### 2. No Hardcoding

| Prohibited | Allowed |
|------------|---------|
| Magic numbers to pass tests | Named constants with JSDoc |
| Mock data to bypass errors | Type-safe enums |
| Fallback values hiding bugs | CSS design tokens |

### 3. No Quick Fixes

Every fix must be a **general solution**, not a workaround for specific cases.

| Prohibited | Required |
|------------|----------|
| Conditions targeting specific test cases | General solutions for all similar cases |
| Branching on error message strings | Proper error type handling |
| Hiding symptoms with try-catch | Fixing root causes |

### 4. No Downgrade Policy

> **Never downgrade package versions** to fix issues.

| Situation | ❌ Don't | ✅ Do |
|-----------|----------|-------|
| Compatibility error | Downgrade to older version | Update code for new API |
| Dependency conflict | Lower all versions | Use `pnpm.overrides` to isolate |
| Build failure | Revert to "working version" | Analyze and fix root cause |

### 5. UI Verification Required

All changes must be verified in the actual UI:

- Run local dev server
- Check both English and Korean pages
- Test interactions (clicks, inputs, etc.)

## Package Layer Rules

```
L3 (apps, ui, features) → L2 (i18n, search, seo, pwa) → L1 (data, platform) → L0 (core, config)
```

- **Lower layers only** — Layer N can only import from Layer N-1 or below
- **No circular dependencies** — No mutual imports within the same layer

See [Architecture](/public-monorepo/guides/architecture/) for details.

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feat/your-feature
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feat/` — New feature
- `fix/` — Bug fix
- `docs/` — Documentation
- `refactor/` — Code refactoring
- `test/` — Adding tests

### 2. Make Changes

- Follow the [Code Style Guide](/public-monorepo/contributing/code-style/)
- Write tests if applicable
- Update documentation if needed

### 3. Run Quality Checks

```bash
pnpm lint       # Check code style (Biome)
pnpm typecheck  # TypeScript type check
pnpm test       # Run unit tests (Vitest)
pnpm build      # Build all apps
```

### 4. Commit Changes

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
git commit -m "feat: add new search feature"
git commit -m "fix: resolve hydration mismatch"
git commit -m "docs: update README"
```

### 5. Create Pull Request

See [Pull Request Guide](/public-monorepo/contributing/pull-requests/) for details.

## What Can You Contribute?

### Good First Issues

- Documentation improvements
- Bug fixes with clear reproduction steps
- Accessibility improvements
- Performance optimizations

### Data Contributions

- New dictionary entries (Context)
- Math concepts (Roots)
- Web API documentation (Permissive)

### Feature Ideas

Open an issue first to discuss:

1. Check existing issues
2. Describe the feature clearly
3. Explain the use case
4. Wait for maintainer feedback

## Questions?

- [GitHub Issues](https://github.com/soundbluemusic/public-monorepo/issues)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
