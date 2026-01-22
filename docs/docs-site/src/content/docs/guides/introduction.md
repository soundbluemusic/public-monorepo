---
title: Introduction
description: Overview of the SoundBlue Public Monorepo - Three apps for learners
head:
  - tag: meta
    attrs:
      name: keywords
      content: introduction, overview, Context app, Permissive app, Roots app, Korean dictionary, web dev resources, math documentation, SSR, SEO
---

# Introduction

Welcome to the **SoundBlue Public Monorepo** documentation. This monorepo contains three educational applications built with modern web technologies.

## What is this?

Each app uses an **optimized rendering mode** for its content type. All modes provide full HTML for SEO.

각 앱은 콘텐츠 유형에 최적화된 렌더링 모드를 사용합니다. 모든 모드는 SEO를 위한 완전한 HTML을 제공합니다.

:::danger[SPA Mode Blocked]
⛔ **SPA mode is BLOCKED** - SPA returns empty HTML (`<div id="root"></div>`), making SEO impossible. This project ONLY allows SSR or SSG.
:::

## The Three Apps

### 📖 Context — Korean Dictionary

**학습자를 위한 한국어 사전** | SSR + Cloudflare D1

A context-based dictionary for Korean language learners. Provides word meanings, example sentences, and related expressions.

| Feature | Description |
|---------|-------------|
| Mode | SSR + D1 (dynamic) |
| Entries | 16,836 |
| Languages | Korean, English |
| URL | [context.soundbluemusic.com](https://context.soundbluemusic.com) |

### 🔧 Permissive — Web Dev Resources

**무료 웹개발 자료 모음** | SSR

A curated collection of web development libraries with permissive licenses (MIT, Apache, etc.) and Web API documentation.

| Feature | Description |
|---------|-------------|
| Mode | SSR |
| Languages | Korean, English |
| URL | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |

### 📐 Roots — Math Documentation

**학습자를 위한 수학 문서** | SSR

Systematically organized math documentation covering algebra, geometry, calculus, and various mathematical fields.

| Feature | Description |
|---------|-------------|
| Mode | SSR |
| Languages | Korean, English |
| URL | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Tech Stack Overview

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI Library |
| React Router | 7 | Routing + SSR |
| TypeScript | 5.8 | Type Safety |
| Tailwind CSS | 4 | Styling |

### Build & Deploy

| Tool | Purpose |
|------|---------|
| Turborepo | Monorepo management |
| pnpm | Package manager |
| Cloudflare Workers | Deployment |
| GitHub Actions | CI/CD |

## Key Principles

1. **No SPA Mode** - All pages must have complete HTML for SEO
2. **Use Appropriate Rendering Mode** - SSR for large/dynamic content, SSG for static content
3. **No Hardcoding** - Use data files, not inline values
4. **No Quick Fixes** - Every fix must be a general solution
5. **Data Integrity** - Single source of truth for all data
6. **UI Verification** - All changes must be verified in actual UI

## Next Steps

- [Quick Start Guide](/public-monorepo/guides/quickstart/) - Get the project running locally
- [Architecture Overview](/public-monorepo/guides/architecture/) - Understand the rendering modes and architecture
- [Context Documentation](/public-monorepo/apps/context/overview/) - Learn about the Korean dictionary app
