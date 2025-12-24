# 🎵 Soundblue Monorepo

**Three apps for learners (학습자를 위한 세 개의 앱)**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green.svg)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.0.0-orange.svg)](https://pnpm.io)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)

---

<br>

## 📖 What is this? (이게 뭔가요?)

<br>

> **All apps are 100% Static Site Generation (SSG)**
>
> 모든 앱은 100% 정적 사이트 생성(SSG) 방식입니다. 서버 없이 CDN에서 바로 서빙됩니다.

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

| App | Dynamic Routes (동적 라우트) | `.data` Files | Data Source |
|:---:|:----------------------------|:-------------:|:------------|
| **Context** | 344 entries + 4 categories | 348개 | JSON 배열 |
| **Roots** | 52 concepts + 18 fields | 70개 | TypeScript 모듈 |
| **Permissive** | 7 static routes | 7개 | 배열 리터럴 |

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
soundblue-monorepo/
│
├── apps/
│   ├── context/       →  Korean dictionary (348 SSG routes)
│   ├── permissive/    →  Web dev resources (7 SSG routes)
│   └── roots/         →  Math documentation (70 SSG routes)
│
├── packages/
│   ├── shared/        →  Utilities: db, i18n, search, validation
│   └── shared-react/  →  Components, hooks, stores
│
└── package.json       →  Root config
```

> **Note:** All apps use `ssr: false` + `prerender()` + `loader()` in `react-router.config.ts`.

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
| [CODE_DUPLICATION_REPORT.md](CODE_DUPLICATION_REPORT.md) | 📋 2025-12-17 | Code duplication analysis (Phase 1 pending) |
| [OPTIMIZATION_PLAN.md](apps/roots/OPTIMIZATION_PLAN.md) | ⚠️ Legacy | Original KaTeX plan (now using MathML) |
| [BUTTON_TESTING_REPORT.md](BUTTON_TESTING_REPORT.md) | 🔴 2025-12-23 | E2E test results (50% pass rate) |

> **Note:** OPTIMIZATION_PLAN.md는 레거시 문서입니다. 현재 구현은 MathML 기반입니다.

<br>

---

<br>

## ⛔ Code Quality Rules (코드 품질 규칙)

<br>

### Hardcoding Prohibition (하드코딩 절대 금지)

> **CRITICAL:** Never use hardcoded values to pass tests or bypass errors.
>
> **절대 금지:** 테스트 통과나 에러 회피를 위한 하드코딩 금지

<br>

**❌ NEVER DO (절대 하지 말 것):**

```typescript
// ❌ Hardcoded values to pass tests
const EXPECTED_COUNT = 348;  // Magic number
return items.length || 348;  // Fallback to hide error

// ❌ Mock data to bypass errors
const data = testMode ? MOCK_DATA : realData;

// ❌ Disabling validation
// @ts-ignore
// biome-ignore lint: skip validation
```

<br>

**✅ ALWAYS DO (항상 할 것):**

```typescript
// ✅ Dynamic calculation
const count = items.length;
if (count === 0) throw new Error('No items found');

// ✅ Proper error handling
const data = await fetchData();
if (!data) throw new Error('Failed to fetch data');

// ✅ Type-safe validation
function validateId(id: string): asserts id is ValidId {
  if (!isValidId(id)) throw new Error(`Invalid ID: ${id}`);
}
```

<br>

### Required Process (필수 프로세스)

Before any fix (수정 전 반드시):

1. **Identify root cause** - Find WHY, not just WHAT (원인 파악)
2. **Verify fix doesn't break existing** - Run tests (기존 기능 유지 확인)
3. **No shortcuts** - Hardcoding is never acceptable (지름길 금지)

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
