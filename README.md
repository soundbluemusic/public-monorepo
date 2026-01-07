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
> **학습자를 위한 한국어 사전** | 46,364 SSG pages
>
> 한국어 학습자를 위한 맥락 기반 사전. 단어의 의미, 예문, 관련 표현을 제공합니다.

| | |
|---|---|
| **Live** | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Source** | [apps/context](apps/context) |
| **Features** | 23145 entries, 24 categories, 53 conversations |

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
> **학습자를 위한 수학 문서** | 920 SSG pages
>
> 수학 개념을 체계적으로 정리한 학습 문서. 대수학, 기하학, 미적분 등 다양한 분야를 다룹니다.

| | |
|---|---|
| **Live** | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |
| **Source** | [apps/roots](apps/roots) |
| **Features** | 438 concepts, 18 fields |

---

## 🌐 Other Projects

| Project | Description |
|:--------|:------------|
| [soundbluemusic.com](https://soundbluemusic.com) | Main site |
| [tools.soundbluemusic.com](https://tools.soundbluemusic.com) | Tool collection |
| [dialogue.soundbluemusic.com](https://dialogue.soundbluemusic.com) | Learning chatbot |

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
| **Context** | 23145 entries + 24 categories + 53 conversations | 46,364 | JSON |
| **Roots** | 438 concepts + 18 fields | 920 | TypeScript |
| **Permissive** | 4 static routes | 8 | Array literals |
| **Total** | — | **47,292** | — |

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

### ⚠️ SSG Hydration Workaround

> **React Router v7 + React 19 SSG 환경에서 알려진 hydration 버그가 있습니다.**
> 자세한 내용은 [CLAUDE.md](CLAUDE.md#-ssg-hydration-workaround-react-router-v7-버그-대응) 참조.

**증상:** 빌드 후 버튼 클릭(북마크, 다운로드 등)이 작동하지 않음

**원인:** Hydration 실패 시 React가 새 DOM을 생성하지만 기존 서버 HTML을 삭제하지 않아 DOM 중복 발생

**해결:** `entry.client.tsx`에서 orphan DOM 제거 (자체 구현 workaround)

```typescript
// apps/*/app/entry.client.tsx - 삭제 금지!
// React Router v7 SSG hydration 버그 workaround
setTimeout(() => {
  const divs = [...document.body.children].filter(el => el.tagName === 'DIV');
  if (divs.length >= 2 && !Object.keys(divs[0]).some(k => k.startsWith('__react'))) {
    divs[0].remove();
  }
}, 100);
```

**관련 이슈:**
- [React Router #12893](https://github.com/remix-run/react-router/issues/12893)
- [React Router #12360](https://github.com/remix-run/react-router/discussions/12360)

---

## 📁 Project Structure

```
public-monorepo/
│
├── apps/                    # 3 applications
│   ├── context/             # Korean dictionary (46,364 SSG pages)
│   ├── permissive/          # Web dev resources (8 SSG pages)
│   └── roots/               # Math documentation (920 SSG pages)
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
│   ├── context/             # 23145 Korean entries
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

## 🔍 SEO

### Features

| Feature | Implementation |
|:--------|:---------------|
| **Pre-rendered HTML** | 모든 페이지 빌드 시 완전한 HTML 생성 |
| **Meta Tags** | 동적 title, description, og:image |
| **Canonical URLs** | 모든 페이지에 자기 참조 canonical 태그 |
| **Hreflang Tags** | 영어/한국어 페이지 상호 연결 |
| **Sitemap** | 자동 생성 (`/sitemap.xml`, `/sitemap-*.xml`) |
| **Robots.txt** | 검색 엔진 크롤링 허용 |

### Canonical & Hreflang Implementation

> **Google Search Console 색인 오류 해결을 위해 2026-01-05에 구현됨**

다국어 사이트에서 검색 엔진이 각 언어 버전을 올바르게 인식하도록 canonical과 hreflang 태그를 모든 페이지에 자동 생성합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│  /entry/hello (영어 페이지)                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ <link rel="canonical" href=".../entry/hello" />         │   │
│  │ <link rel="alternate" hreflang="en" href=".../entry/hello" />│
│  │ <link rel="alternate" hreflang="ko" href=".../ko/entry/hello"/>│
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ 상호 연결
┌─────────────────────────────────────────────────────────────────┐
│  /ko/entry/hello (한국어 페이지)                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ <link rel="canonical" href=".../ko/entry/hello" />      │   │
│  │ <link rel="alternate" hreflang="en" href=".../entry/hello" />│
│  │ <link rel="alternate" hreflang="ko" href=".../ko/entry/hello"/>│
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Meta Factory Pattern

정적 라우트와 동적 라우트 모두 SEO 태그를 자동 생성합니다.

```typescript
// 정적 라우트: metaFactory 사용
import { metaFactory } from '@soundblue/i18n';

export const meta = metaFactory({
  ko: { title: '소개 - Context', description: '한국어 사전 소개' },
  en: { title: 'About - Context', description: 'About Korean Dictionary' },
}, 'https://context.soundbluemusic.com');
// → canonical, hreflang 태그 자동 생성

// 동적 라우트: dynamicMetaFactory 사용
import { dynamicMetaFactory } from '@soundblue/seo/meta';

export const meta = dynamicMetaFactory<typeof loader>({
  getTitle: (data) => `${data.entry.korean} - Context`,
  getDescription: (data) => data.entry.translations.en.explanation,
  baseUrl: 'https://context.soundbluemusic.com',
});
```

### Verification

```bash
pnpm verify:ssg    # 모든 페이지 meta tag 검증
pnpm check:links   # 깨진 링크 검사
```

### Troubleshooting: Google Search Console

| 오류 | 원인 | 해결 |
|:-----|:-----|:-----|
| "페이지가 색인되지 않음" | canonical/hreflang 누락 | metaFactory 사용 |
| "중복 페이지" | canonical 미설정 | 자기 참조 canonical 추가 |
| "대체 페이지 선택됨" | hreflang 미설정 | 양방향 hreflang 추가 |

---

## 📱 PWA

### Features

| Feature | Description |
|:--------|:------------|
| **Installable** | 홈 화면에 앱 추가 가능 |
| **Offline Support** | Service Worker로 오프라인 접근 |
| **App Manifest** | 앱 이름, 아이콘, 테마 색상 정의 |
| **Offline Indicator** | 오프라인 상태 UI 표시 |

### Service Worker Strategy

```
┌─────────────────────────────────────────────────────┐
│  Cache Strategy: Stale-While-Revalidate            │
│                                                     │
│  1. 캐시에서 즉시 응답 (빠른 로딩)                   │
│  2. 백그라운드에서 네트워크 요청                     │
│  3. 새 버전 있으면 캐시 업데이트                     │
└─────────────────────────────────────────────────────┘
```

### Manifest

```json
{
  "name": "Context - Korean Dictionary",
  "short_name": "Context",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3b82f6"
}
```

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

### 3. No Overfitting / No Quick Fixes

> **모든 수정은 일반적인 해결책이어야 함. 특정 케이스만 해결하는 코드 금지.**

| ❌ Prohibited | ✅ Required |
|:--------------|:------------|
| Conditions targeting specific test cases only | General solutions for all similar cases |
| Branching on error message strings | Proper error type handling |
| Exception handling for specific IDs/values | Uniform validation logic |
| Hiding symptoms with try-catch | Fixing root causes |
| Workarounds at call sites instead of source | Fixing the actual problem location |

**Checklist before any fix:**
1. Does this fix work for all similar inputs?
2. Can I explain WHY this problem occurred?
3. Will this code still work if new tests are added?
4. Will another developer understand this in 6 months?

### 4. Data Principles

| Principle | Description |
|:----------|:------------|
| **Single Source of Truth** | All data defined in `data/` directory only |
| **No External DB** | localStorage / IndexedDB only |
| **Open Source Only** | All dependencies must be open source |
| **Web Standards Only** | No vendor-specific APIs |

### 5. UI Verification Required (UI 검증 필수)

> **모든 변경사항은 실제 UI에서 확인되어야 완료입니다.**

| ❌ Prohibited | ✅ Required |
|:--------------|:------------|
| 코드만 수정하고 "완료" 주장 | 로컬 서버에서 실제 페이지 확인 |
| 빌드 성공만으로 기능 작동 가정 | 영어/한국어 페이지 모두 확인 |
| UI 불일치 무시 | 인터랙션 테스트 (클릭, 입력 등) |

**왜 필요한가:** SSG 빌드 성공 ≠ 실제 UI 정상 작동. Hydration 문제, 데이터 불일치 등 코드만으로는 발견되지 않는 문제가 있습니다.

---

## 📄 License

**Apache License 2.0** — Free to use, modify, and distribute.

---

<p align="center">
  Made by <a href="https://soundbluemusic.com"><b>soundbluemusic</b></a>
  <br/><br/>
  <a href="https://www.youtube.com/@SoundBlueMusic"><img src="https://img.shields.io/badge/YouTube-FF0000?style=flat&logo=youtube&logoColor=white" alt="YouTube"></a>
  <a href="https://x.com/SoundBlueMusic"><img src="https://img.shields.io/badge/X-000000?style=flat&logo=x&logoColor=white" alt="X"></a>
  <a href="https://www.instagram.com/soundbluemusic/"><img src="https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white" alt="Instagram"></a>
  <a href="https://www.threads.com/@soundbluemusic"><img src="https://img.shields.io/badge/Threads-000000?style=flat&logo=threads&logoColor=white" alt="Threads"></a>
</p>
