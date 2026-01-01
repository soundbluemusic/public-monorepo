# 🎵 Public Monorepo

**Three apps for learners (학습자를 위한 세 개의 앱)**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green.svg)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.11.0-orange.svg)](https://pnpm.io)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)

---

<br>

## 📖 What is this? (이게 뭔가요?)

<br>

> **All apps are 100% Static Site Generation (SSG)**
>
> 모든 앱은 100% 정적 사이트 생성(SSG) 방식입니다. 서버 없이 CDN에서 바로 서빙됩니다.
>
> ⛔ **SSG 모드 변경 절대 금지** - SPA, SSR, ISR 등 다른 렌더링 모드로 전환하지 마세요.

<br>

| App | Description (설명) | Link (링크) |
|:---:|:-------------------|:-----------:|
| **Context** | Korean dictionary for learners<br>(학습자를 위한 한국어 사전) | [Live](https://context.soundbluemusic.com) |
| **Permissive** | Free web dev resources<br>(무료 웹개발 자료 모음) | [Live](https://permissive.soundbluemusic.com) |
| **Roots** | Math documentation for learners<br>(학습자를 위한 수학 문서) | [Live](https://roots.soundbluemusic.com) |

<br>

---

<br>

## 🛠 Tech Stack (기술 스택)

<br>

| Category (분류) | Technology (기술) |
|:---------------:|:------------------|
| **Framework** | React + React Router v7 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Package Manager** | pnpm (workspaces) |
| **Linting** | Biome |
| **Build** | 100% Static (SSG) + Build-time Data Prerendering |
| **i18n** | Paraglide (compile-time) + URL-based routing (`/ko/*`) |
| **Storage** | localStorage / IndexedDB only (No external DB) |
| **API** | Web Standard APIs only (No vendor lock-in) |
| **Hosting** | Cloudflare Pages (CDN) |
| **Output** | `build/client` (HTML + JS + `.data` files) |

### SSG Build-time Data Prerendering (빌드타임 데이터 프리렌더링)

React Router v7의 `prerender()` + `loader()` 패턴으로 빌드 시 데이터를 미리 추출합니다:

| App | Dynamic Routes (동적 라우트) | SSG Pages | Data Source |
|:---:|:----------------------------|:---------:|:------------|
| **Context** | 978 entries + 21 categories + 7 conversations | 2012개 | JSON 배열 |
| **Roots** | 438 concepts + 50 fields | 976개 | TypeScript 모듈 |
| **Permissive** | 4 static routes | 8개 | 배열 리터럴 |

```typescript
// react-router.config.ts 패턴
export default {
  ssr: false,
  async prerender() {
    // 빌드 시 동적 라우트 목록 생성
    return ['/', '/ko', '/entry/hello', '/ko/entry/hello', ...];
  },
}

// routes/entry.$entryId.tsx 패턴
export async function loader({ params }) {
  // 빌드 시 실행 → .data 파일로 저장
  return { entry: getEntryById(params.entryId) };
}
```

<br>

---

<br>

## 📁 Project Structure (프로젝트 구조)

<br>

```
public-monorepo/
│
├── apps/
│   ├── context/       →  Korean dictionary (2012 SSG routes)
│   ├── permissive/    →  Web dev resources (8 SSG routes)
│   └── roots/         →  Math documentation (976 SSG routes)
│
├── packages/          →  10 modular packages (Layer 0-3)
│   ├── core/          →  [L0] Pure functions, validation, types
│   ├── config/        →  [L0] Vite, Tailwind configurations
│   ├── data/          →  [L1] Zod schemas, data loaders
│   ├── platform/      →  [L1] Browser APIs, environment detection
│   ├── i18n/          →  [L2] i18n routing, meta, Paraglide
│   ├── search/        →  [L2] MiniSearch wrapper, workers
│   ├── seo/           →  [L2] Meta factory, sitemap generator
│   ├── pwa/           →  [L2] Service worker, offline indicator
│   ├── features/      →  [L3] Business logic hooks (settings, toast)
│   └── ui/            →  [L3] React components, animations
│
├── data/              →  Centralized JSON data (SSoT)
│   ├── context/       →  978 Korean dictionary entries
│   ├── roots/         →  438 math concepts (50 fields)
│   └── permissive/    →  88 libraries, 56 Web APIs
│
└── package.json       →  Root config
```

> **Note:** All apps use `ssr: false` + `prerender()` + `loader()` in `react-router.config.ts`.
>
> **Architecture:** See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed package layer design.

### i18n Routing (다국어 라우팅)

URL 경로 기반 언어 감지 (쿼리 파라미터 아님):

```
/              → English (default)
/ko            → Korean
/entry/hello   → English entry page
/ko/entry/hello → Korean entry page
```

<br>

---

<br>

## 🚀 Quick Start (빠른 시작)

<br>

**Step 1** — Clone (클론)

```bash
git clone https://github.com/soundbluemusic/public-monorepo.git
cd public-monorepo
```

<br>

**Step 2** — Install (설치)

```bash
pnpm install
```

<br>

**Step 3** — Run (실행)

```bash
# Context app (한국어 사전)
pnpm dev:context        # → http://localhost:3003

# Permissive app (웹개발 자료)
pnpm dev:permissive     # → http://localhost:3004

# Roots app (수학 문서)
pnpm dev:roots          # → http://localhost:3005
```

<br>

---

<br>

## 📜 Commands (명령어)

<br>

### Development (개발)

| Command | Description |
|:--------|:------------|
| `pnpm dev:context` | Run Context → http://localhost:3003 |
| `pnpm dev:permissive` | Run Permissive → http://localhost:3004 |
| `pnpm dev:roots` | Run Roots → http://localhost:3005 |

### Build (빌드)

| Command | Description |
|:--------|:------------|
| `pnpm build:context` | Build Context → `build/client` |
| `pnpm build:permissive` | Build Permissive → `build/client` |
| `pnpm build:roots` | Build Roots → `build/client` |
| `pnpm build` | Build all apps |
| `pnpm build:test` | Build + typecheck + verify SSG |

### Quality (품질)

| Command | Description |
|:--------|:------------|
| `pnpm lint` | Check code with Biome |
| `pnpm format` | Format code with Biome |
| `pnpm typecheck` | TypeScript type check |
| `pnpm test` | Run Vitest tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm verify:ssg` | Verify SSG meta tags |
| `pnpm check:links` | Check for broken links |

<br>

---

<br>

## 📚 Documentation (문서)

<br>

| Document | Status | Description |
|:---------|:------:|:------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | ✅ v2.0 | Package layer design (10 packages) |

<br>

---

<br>

## ⛔ Critical Rules (절대 규칙)

<br>

### SSG Mode Only (SSG 모드 전용)

> **이 프로젝트는 100% SSG 전용입니다. 다른 렌더링 모드로 전환 절대 금지.**
>
> **This project is 100% SSG only. Never switch to other rendering modes.**

<br>

**❌ NEVER (절대 금지):**

| Mode | Description | Why Prohibited |
|:-----|:------------|:---------------|
| **SPA** | Client-side routing only | SEO 불가, 초기 로딩 느림 |
| **SSR** | Server-side rendering | 서버 비용, 복잡성 증가 |
| **ISR** | Incremental Static Regeneration | 서버 필요, Cloudflare 미지원 |
| **Edge/Serverless** | Edge Functions | 서버 비용, 벤더 종속 |

<br>

**✅ ONLY ALLOWED (유일하게 허용):**

```typescript
// react-router.config.ts - 필수 설정
export default {
  ssr: false,  // ← 절대 true로 변경 금지
  async prerender() {
    return ['/', '/ko', ...allRoutes];  // ← 모든 라우트 사전 생성
  },
}
```

<br>

---

<br>

## 📋 Code Quality Rules (코드 품질 규칙)

<br>

### Hardcoding Rules (하드코딩 규칙)

> **원칙:** 하드코딩은 금지. 단, 우수한 설계 목적일 경우에만 허용.
>
> **Principle:** Hardcoding is prohibited, except for excellent design purposes.

<br>

**❌ NEVER (절대 금지):**

```typescript
// ❌ Hardcoded values to pass tests
const EXPECTED_COUNT = 348;  // Magic number with no context
return items.length || 348;  // Fallback to hide error

// ❌ Mock data to bypass errors
const data = testMode ? MOCK_DATA : realData;
```

<br>

**✅ ALLOWED (허용 - 우수한 설계):**

```typescript
// ✅ Named constants with clear purpose
export const LIMITS = {
  ID_LENGTH: 100,      // Maximum characters for entity IDs
  SEARCH_LENGTH: 100,  // Maximum search query length
} as const;

// ✅ CSS design tokens
:root {
  --header-height: 56px;  /* Standard mobile app header */
}

// ✅ Type-safe enums
type Theme = 'light' | 'dark';
type Language = 'en' | 'ko';
```

<br>

**⚠️ 허용 조건 (Allowed Conditions):**

1. **Named clearly** - 서술적인 이름 사용
2. **Documented** - 왜 이 값인지 주석으로 설명
3. **Single source** - 한 곳에서만 정의
4. **Exported** - `@soundblue/shared`에서 재사용

<br>

---

<br>

## 📄 License (라이선스)

<br>

**Apache License 2.0**

Free to use, modify, and distribute.
(자유롭게 사용, 수정, 배포 가능합니다.)

<br>

---

<br>

<p align="center">
  Made by <a href="https://soundbluemusic.com"><b>soundbluemusic</b></a>
</p>
