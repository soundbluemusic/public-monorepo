---
title: Introduction
description: Overview of the SoundBlue Public Monorepo - Three apps for learners
---

# Introduction

Welcome to the **SoundBlue Public Monorepo** documentation. This monorepo contains three educational applications built with modern web technologies.

## What is this?

All apps are **100% Static Site Generation (SSG)**. They are served directly from CDN without any server. 

모든 앱은 100% 정적 사이트 생성(SSG) 방식입니다. 서버 없이 CDN에서 바로 서빙됩니다.

:::caution[SSG Mode Only]
⛔ **SSG 모드 변경 절대 금지** - Do not switch to SPA, SSR, ISR or any other rendering mode.
:::

## The Three Apps

### 📖 Context — Korean Dictionary

**학습자를 위한 한국어 사전** | 33,748 SSG pages

A context-based dictionary for Korean language learners. Provides word meanings, example sentences, and related expressions.

| Feature | Description |
|---------|-------------|
| Pages | 33,748 SSG pages |
| Languages | Korean, English |
| URL | [context.soundbluemusic.com](https://context.soundbluemusic.com) |

### 🔧 Permissive — Web Dev Resources

**무료 웹개발 자료 모음** | 8 SSG pages

A curated collection of web development libraries with permissive licenses (MIT, Apache, etc.) and Web API documentation.

| Feature | Description |
|---------|-------------|
| Pages | 8 SSG pages |
| Languages | Korean, English |
| URL | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |

### 📐 Roots — Math Documentation

**학습자를 위한 수학 문서** | 920 SSG pages

Systematically organized math documentation covering algebra, geometry, calculus, and various mathematical fields.

| Feature | Description |
|---------|-------------|
| Pages | 920 SSG pages |
| Languages | Korean, English |
| URL | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## Tech Stack Overview

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI Library |
| React Router | 7 | Routing + SSG |
| TypeScript | 5.8 | Type Safety |
| Tailwind CSS | 4 | Styling |

### Build & Deploy

| Tool | Purpose |
|------|---------|
| Turborepo | Monorepo management |
| pnpm | Package manager |
| Cloudflare Pages | Deployment |
| GitHub Actions | CI/CD |

## Key Principles

1. **SSG Only** - All pages are pre-rendered at build time
2. **No Hardcoding** - Use data files, not inline values
3. **No Quick Fixes** - Every fix must be a general solution
4. **Data Integrity** - Single source of truth for all data
5. **UI Verification** - All changes must be verified in actual UI

## Next Steps

- [Quick Start Guide](/public-monorepo/guides/quickstart/) - Get the project running locally
- [Architecture Overview](/public-monorepo/guides/architecture/) - Understand the SSG architecture
- [Context Documentation](/public-monorepo/apps/context/overview/) - Learn about the Korean dictionary app
