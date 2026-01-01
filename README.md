# 🎵 Public Monorepo

**Three apps for learners (학습자를 위한 세 개의 앱)**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green.svg)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.11.0-orange.svg)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)
[![Turborepo](https://img.shields.io/badge/Turborepo-enabled-blueviolet.svg)](https://turbo.build/)

---

## 📖 What is this?

> **All apps are 100% Static Site Generation (SSG)**
>
> 모든 앱은 100% 정적 사이트 생성(SSG) 방식입니다. 서버 없이 CDN에서 바로 서빙됩니다.
>
> ⛔ **SSG 모드 변경 절대 금지** - SPA, SSR, ISR 등 다른 렌더링 모드로 전환하지 마세요.

---

## 🚀 Apps

### 📖 Context — Korean Dictionary
> **학습자를 위한 한국어 사전** | 2,012 SSG pages
>
> 한국어 학습자를 위한 맥락 기반 사전. 단어의 의미, 예문, 관련 표현을 제공합니다.

| | |
|---|---|
| **Live** | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Source** | [apps/context](apps/context) |
| **Features** | 978 entries, 21 categories, 7 conversations |

### 🔧 Permissive — Web Dev Resources
> **무료 웹개발 자료 모음** | 8 SSG pages
>
> 허용적 라이선스(MIT, Apache 등)를 가진 웹 개발 라이브러리와 Web API 문서.

| | |
|---|---|
| **Live** | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Source** | [apps/permissive](apps/permissive) |
| **Features** | 88 libraries, 56 Web APIs |

### 📐 Roots — Math Documentation
> **학습자를 위한 수학 문서** | 976 SSG pages
>
> 수학 개념을 체계적으로 정리한 학습 문서. 대수학, 기하학, 미적분 등 다양한 분야를 다룹니다.

| | |
|---|---|
| **Live** | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |
| **Source** | [apps/roots](apps/roots) |
| **Features** | 438 concepts, 50 fields |

---

## 🛠 Tech Stack

### Core

| Category | Technology |
|:---------|:-----------|
| **Framework** | React 19 + React Router v7 |
| **Language** | TypeScript 5.x (strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Build Tool** | Vite + Turborepo |

### Build & Deploy

| Category | Technology |
|:---------|:-----------|
| **Rendering** | 100% Static Site Generation (SSG) |
| **Output** | `build/client` (HTML + JS + `.data` files) |
| **Hosting** | Cloudflare Pages (CDN) |
| **Cache** | Turborepo remote caching |

### Quality

| Category | Technology |
|:---------|:-----------|
| **Linting** | Biome (lint + format) |
| **Testing** | Vitest + Playwright |
| **CI/CD** | GitHub Actions |

### i18n & Storage

| Category | Technology |
|:---------|:-----------|
| **i18n** | Paraglide (compile-time) + URL routing (`/ko/*`) |
| **Storage** | localStorage / IndexedDB only |
| **API** | Web Standard APIs only (no vendor lock-in) |

---

## ⚡ SSG Architecture

### How It Works

React Router v7의 `prerender()` + `loader()` 패턴으로 **빌드 시** 모든 페이지를 완전한 HTML로 생성합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│  Build Time                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ prerender() │ → │  loader()   │ → │  HTML + .data │         │
│  │ (route list)│    │ (fetch data)│    │  (static)    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Runtime (CDN)                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Static HTML served instantly — No server required       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### SSG Pages per App

| App | Dynamic Routes | SSG Pages | Data Source |
|:----|:---------------|:---------:|:------------|
| **Context** | 978 entries + 21 categories + 7 conversations | 2,012 | JSON |
| **Roots** | 438 concepts + 50 fields | 976 | TypeScript |
| **Permissive** | 4 static routes | 8 | Array literals |
| **Total** | — | **2,996** | — |

### Code Pattern

```typescript
// react-router.config.ts
export default {
  ssr: false,  // SSG mode
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const entryRoutes = generateI18nRoutes(entries, (e) => `/entry/${e.id}`);
    return [...staticRoutes, ...entryRoutes];
  },
} satisfies Config;

// routes/entry.$entryId.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const entry = getEntryById(params.entryId);
  if (!entry) throw new Response('Not Found', { status: 404 });
  return { entry };  // → saved as .data file at build time
}
```

---

## 📁 Project Structure

```
public-monorepo/
│
├── apps/                    # 3 applications
│   ├── context/             # Korean dictionary (2,012 SSG pages)
│   ├── permissive/          # Web dev resources (8 SSG pages)
│   └── roots/               # Math documentation (976 SSG pages)
│
├── packages/                # 10 shared packages (Layer 0-3)
│   ├── core/                # [L0] Pure functions, validation, types
│   ├── config/              # [L0] Vite, Tailwind configurations
│   ├── data/                # [L1] Zod schemas, data loaders
│   ├── platform/            # [L1] Browser APIs (IndexedDB)
│   ├── i18n/                # [L2] i18n routing, Paraglide
│   ├── search/              # [L2] MiniSearch wrapper
│   ├── seo/                 # [L2] Meta tags, sitemap
│   ├── pwa/                 # [L2] Service worker, offline
│   ├── features/            # [L3] Settings, toast hooks
│   └── ui/                  # [L3] React components
│
├── data/                    # Centralized JSON data (SSoT)
│   ├── context/             # 978 Korean entries
│   ├── roots/               # 438 math concepts
│   └── permissive/          # 88 libraries, 56 Web APIs
│
└── package.json
```

### Package Layer System

```
Layer 3 (Apps + UI)     ┌─────────────────────────────────────┐
                        │  apps/*  +  ui  +  features         │
                        └─────────────────────────────────────┘
                                        │
Layer 2 (Domain)        ┌─────────────────────────────────────┐
                        │  i18n  search  seo  pwa             │
                        └─────────────────────────────────────┘
                                        │
Layer 1 (Data)          ┌─────────────────────────────────────┐
                        │  data  +  platform                  │
                        └─────────────────────────────────────┘
                                        │
Layer 0 (Foundation)    ┌─────────────────────────────────────┐
                        │  core  +  config                    │
                        └─────────────────────────────────────┘
```

> **Layer Rule:** Layer N can only import from Layer N-1 or below.
>
> See [ARCHITECTURE.md](ARCHITECTURE.md) for details.

---

## 🌐 i18n Routing

URL 경로 기반 언어 감지 (쿼리 파라미터 아님):

| URL | Language | Description |
|:----|:---------|:------------|
| `/` | English | Default language |
| `/ko` | Korean | Korean version |
| `/entry/hello` | English | Entry page (EN) |
| `/ko/entry/hello` | Korean | Entry page (KO) |

All routes are duplicated for each language at build time (SSG).

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|:------------|:--------|
| Node.js | ≥ 20 |
| pnpm | 10.11.0 |

```bash
# Install pnpm if not installed
npm install -g pnpm@10.11.0
```

### Installation

```bash
# 1. Clone
git clone https://github.com/soundbluemusic/public-monorepo.git
cd public-monorepo

# 2. Install dependencies
pnpm install
```

### Development

```bash
# Run any app
pnpm dev:context        # → http://localhost:3003 (Korean dictionary)
pnpm dev:permissive     # → http://localhost:3004 (Web dev resources)
pnpm dev:roots          # → http://localhost:3005 (Math documentation)
```

### Build

```bash
# Build single app
pnpm build:context
pnpm build:permissive
pnpm build:roots

# Build all apps (with Turborepo caching)
pnpm build
```

> **Turborepo:** 동일 입력에 대해 빌드 결과를 캐싱하여 재빌드 시 97%+ 시간 단축.

---

## 📜 Commands

### Development

| Command | Description |
|:--------|:------------|
| `pnpm dev:context` | Run Context → http://localhost:3003 |
| `pnpm dev:permissive` | Run Permissive → http://localhost:3004 |
| `pnpm dev:roots` | Run Roots → http://localhost:3005 |

### Build

| Command | Description |
|:--------|:------------|
| `pnpm build` | Build all apps (Turborepo cached) |
| `pnpm build:context` | Build Context → `build/client` |
| `pnpm build:permissive` | Build Permissive → `build/client` |
| `pnpm build:roots` | Build Roots → `build/client` |
| `pnpm build:test` | Build + typecheck + verify SSG |

### Quality Checks

| Command | Description |
|:--------|:------------|
| `pnpm lint` | Check code with Biome |
| `pnpm format` | Format code with Biome |
| `pnpm typecheck` | TypeScript type check (Turborepo cached) |
| `pnpm test` | Run Vitest unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm verify:ssg` | Verify SSG meta tags |
| `pnpm check:links` | Check for broken links |
| `pnpm check:circular` | Detect circular dependencies |
| `pnpm check:versions` | Check package version consistency |

---

## 📚 Documentation

| Document | Description |
|:---------|:------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Package layer design (10 packages) |
| [CLAUDE.md](CLAUDE.md) | AI assistant guidelines |

---

## ⛔ Critical Rules

### 1. SSG Mode Only

> **이 프로젝트는 100% SSG 전용입니다. 다른 렌더링 모드로 전환 절대 금지.**

| ❌ Prohibited | Why |
|:--------------|:----|
| SPA (Client-side only) | SEO 불가, 빈 HTML |
| SSR (Server-side rendering) | 서버 비용, 복잡성 |
| ISR (Incremental Static) | 서버 필요 |
| Edge/Serverless Functions | 벤더 종속 |
| Empty `<div id="root">` | 검색엔진 크롤링 실패 |

```typescript
// ✅ Required pattern in react-router.config.ts
export default {
  ssr: false,  // ← Never change to true
  async prerender() {
    return ['/', '/ko', ...allRoutes];  // ← All routes pre-rendered
  },
}
```

### 2. No Hardcoding (for wrong reasons)

| ❌ Prohibited | ✅ Allowed |
|:--------------|:-----------|
| Magic numbers to pass tests | Named constants with JSDoc |
| Mock data to bypass errors | Type-safe enums |
| Fallback values hiding bugs | CSS design tokens |

### 3. Data Principles

| Principle | Description |
|:----------|:------------|
| **Single Source of Truth** | All data defined in `data/` directory only |
| **No External DB** | localStorage / IndexedDB only |
| **Open Source Only** | All dependencies must be open source |
| **Web Standards Only** | No vendor-specific APIs |

---

## 📄 License

**Apache License 2.0** — Free to use, modify, and distribute.

---

<p align="center">
  Made by <a href="https://soundbluemusic.com"><b>soundbluemusic</b></a>
</p>
