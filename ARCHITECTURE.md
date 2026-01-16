# Architecture (아키텍처)

모노레포 패키지 구조 및 레이어 설계 문서입니다.

> **SEO 필수**: 검색 엔진은 JavaScript를 실행하지 않습니다.
> SPA는 빈 HTML(`<div id="root"></div>`)을 반환하여 **검색 노출이 불가능**합니다.
> 모든 페이지는 완전한 HTML로 빌드되어야 합니다.

---

## Deployment Modes (배포 모드)

| App | Mode | 데이터 소스 | 배포 대상 |
|:----|:-----|:-----------|:----------|
| **Context** | **SSR** | Cloudflare D1 | Cloudflare Pages (Functions) |
| Permissive | SSR | In-memory | Cloudflare Pages (Functions) |
| Roots | SSG | TypeScript | Cloudflare Pages (Static) |

> **Context App**: SSR + D1 전용. SSG 빌드는 지원하지 않습니다.

---

## SSR Architecture (SSR 아키텍처) - Context App

### How It Works

React Router v7의 SSR 모드 + Cloudflare D1으로 **런타임에** 동적 페이지를 생성합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│  Build Time                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ prerender() │ → │  loader()   │ → │  Static HTML  │         │
│  │ (정적 페이지)│    │ (정적 데이터)│    │  (CDN 캐시)   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              +
┌─────────────────────────────────────────────────────────────────┐
│  Runtime (Cloudflare Pages Functions)                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Request    │ → │  loader()   │ → │  SSR HTML     │         │
│  │ /entry/:id  │    │  D1 Query   │    │  (dynamic)   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### D1 Database Schema

```sql
-- context-db (Cloudflare D1)
CREATE TABLE entries (
  id TEXT PRIMARY KEY,
  korean TEXT NOT NULL,
  english TEXT,
  romanization TEXT,
  category_id TEXT NOT NULL,
  difficulty TEXT,
  part_of_speech TEXT,
  audio_url TEXT,
  examples TEXT,  -- JSON array
  tags TEXT       -- JSON array
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name_ko TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  entry_count INTEGER DEFAULT 0
);
```

### SSR Configuration

```typescript
// react-router.config.ts (BUILD_MODE=ssr)
export default {
  ssr: true,  // SSR 활성화
  async prerender() {
    // 정적 페이지만 prerender (entry 페이지 제외)
    return [...staticRoutes, ...categoryRoutes];
  },
} satisfies Config;

// wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "context-db"
database_id = "55c25518-db3d-4547-8ad8-e36fc66493c8"

// public/_routes.json
{
  "include": ["/entry/*", "/ko/entry/*", "/sitemap*.xml"],
  "exclude": []
}
```

### Dynamic Sitemap Generation

SSR 모드에서 사이트맵은 D1에서 실시간 생성됩니다:

| Route | 설명 | 데이터 소스 |
|:------|:-----|:-----------|
| `/sitemap.xml` | 인덱스 | D1 categories 테이블 |
| `/sitemap-pages.xml` | 정적 페이지 | 하드코딩 |
| `/sitemap-categories.xml` | 카테고리 목록 | D1 categories |
| `/sitemap-entry-{categoryId}.xml` | 카테고리별 엔트리 | D1 entries |

---

## SSG Architecture (SSG 아키텍처) - Roots 앱 전용

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

### 앱별 렌더링 모드

| App | Mode | Dynamic Routes | Pages | Data Source |
|:----|:-----|:---------------|:-----:|:------------|
| **Context** | **SSR** | 16836 entries (D1) | 동적 | Cloudflare D1 |
| **Roots** | SSG | 438 concepts + 18 fields | 920 | TypeScript |
| **Permissive** | SSR | 4 static routes | 8 | In-memory |

> **Context는 SSR + D1 전용**. 모든 entry 페이지는 D1에서 실시간 조회합니다.

### SSG Code Pattern (Roots 앱)

```typescript
// react-router.config.ts
export default {
  ssr: false,  // SSG mode
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const conceptRoutes = generateI18nRoutes(concepts, (c) => `/concept/${c.id}`);
    return [...staticRoutes, ...conceptRoutes];
  },
} satisfies Config;

// routes/concept.$conceptId.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const concept = getConceptById(params.conceptId);
  if (!concept) throw new Response('Not Found', { status: 404 });
  return { concept };  // → saved as .data file at build time
}
```

### 다국어 동적 라우트 패턴 (중요!)

> **⛔ `params.locale` 사용 금지** - 항상 `undefined`입니다!

#### 원인

routes.ts에서 다국어 라우트를 정의할 때:

```typescript
// routes.ts
route('concept/:conceptId', conceptFile, { id: 'concept-en' }),      // 영어
route('ko/concept/:conceptId', conceptFile, { id: 'concept-ko' }),   // 한국어
```

`ko`는 **파라미터가 아닌 고정 문자열**입니다. 따라서 `params.locale`은 항상 `undefined`가 됩니다.

#### 올바른 패턴

```typescript
import { getLocaleFromPath } from '@soundblue/i18n';

// ✅ SSR loader에서 (Context 앱)
export async function loader({ params, request, context }) {
  const db = context.cloudflare.env.DB;
  const url = new URL(request.url);
  const locale = getLocaleFromPath(url.pathname);  // '/ko/entry/...' → 'ko'
  const entry = await getEntryByIdFromD1(db, params.entryId, locale);
  return { entry };
}

// ✅ SSG loader에서 (Roots 앱)
export async function loader({ params, request }) {
  const url = new URL(request.url);
  const locale = getLocaleFromPath(url.pathname);
  const concept = getConceptByIdForLocale(params.conceptId, locale);
  return { concept };
}
```

---

## Package Layer System (패키지 레이어 시스템)

```
Layer 3 (Apps + UI)     ┌─────────────────────────────────────────────┐
                        │  apps/context, apps/roots, apps/permissive  │
                        │  @soundblue/ui, @soundblue/features         │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 2 (Domain)        ┌─────────────────────────────────────────────┐
                        │  @soundblue/i18n     @soundblue/search      │
                        │  @soundblue/seo      @soundblue/pwa         │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 1 (Data)          ┌─────────────────────────────────────────────┐
                        │  @soundblue/data     @soundblue/platform    │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 0 (Foundation)    ┌─────────────────────────────────────────────┐
                        │  @soundblue/core     @soundblue/config      │
                        └─────────────────────────────────────────────┘
```

### Layer Rules (레이어 규칙)

1. **하위 레이어만 의존** - Layer N은 Layer N-1 이하만 import 가능
2. **순환 의존 금지** - 같은 레이어 간 상호 의존 금지
3. **앱 전용 코드 분리** - 앱 특화 코드는 apps/ 내부에 유지

---

## Package Details (패키지 상세)

### Layer 0: Foundation (기반)

#### @soundblue/core
순수 함수, 타입, 검증 유틸리티. React 의존 없음.

```typescript
// Exports
import { LIMITS, validateId, isValidLanguage } from '@soundblue/core/validation';
import { chunkArray, debounce, throttle, cn } from '@soundblue/core/utils';
import type { Language, Theme } from '@soundblue/core/types';
```

| Export Path | Description |
|-------------|-------------|
| `/validation` | ID 검증, 입력 정제, 상수 |
| `/utils` | 배열/객체 유틸리티 |
| `/types` | 공통 타입 정의 |

#### @soundblue/config
Vite, Tailwind, TypeScript 설정.

```typescript
// Exports
import { createViteConfig } from '@soundblue/config/vite';
import { tailwindPreset } from '@soundblue/config/tailwind';
```

---

### Layer 1: Data (데이터)

#### @soundblue/data
Zod 스키마, 데이터 로더, 타입 정의.

```typescript
// Exports
import { EntrySchema, ConceptSchema } from '@soundblue/data/schemas';
import { createDataLoader, loadJson, loadJsonDirectory } from '@soundblue/data/loaders';
```

#### @soundblue/platform
브라우저 IndexedDB 스토리지 (Dexie.js 기반).

```typescript
// Exports
import { storage } from '@soundblue/platform/storage';
import type { FavoriteItem, RecentViewItem, SettingsData } from '@soundblue/platform';
```

---

### Layer 2: Domain (도메인)

#### @soundblue/i18n
다국어 라우팅, 메타 팩토리, Paraglide 통합.

```typescript
// Exports
import {
  stripLocaleFromPath,
  getLocaleFromPath,
  generateI18nRoutes,
  extractStaticRoutes
} from '@soundblue/i18n';
import { metaFactory } from '@soundblue/i18n';
```

#### @soundblue/search
MiniSearch 래퍼, 검색 워커.

```typescript
// Core (non-React)
import { SearchEngine, type SearchResult, type SearchConfig } from '@soundblue/search';

// React hooks
import { useSearch, useSearchWorker } from '@soundblue/search/react';
```

| Export Path | Description |
|-------------|-------------|
| `/` | Core search engine (SearchEngine class) |
| `/react` | React hooks (useSearch, useSearchWorker) |
| `/worker` | Web Worker 유틸리티 |

#### @soundblue/seo
메타 태그 팩토리, 사이트맵 생성기.

```typescript
// Exports
import { metaFactory, dynamicMetaFactory } from '@soundblue/seo/meta';
import { generateSitemap } from '@soundblue/seo/sitemap';
```

#### @soundblue/pwa
서비스 워커, 오프라인 인디케이터.

```typescript
// React components
import { OfflineIndicator, useOnlineStatus } from '@soundblue/pwa/react';

// Build-time
import { generateManifest } from '@soundblue/pwa/manifest';
```

---

### Layer 3: UI & Features (UI 및 기능)

#### @soundblue/features
비즈니스 로직 훅 (설정, 토스트, 미디어 쿼리).

```typescript
// Exports
import { useSettingsStore } from '@soundblue/features/settings';
import { useToast, toast } from '@soundblue/features/toast';
import { useMediaQuery, useIsMobile } from '@soundblue/features/media';
```

#### @soundblue/ui
React UI 컴포넌트, 애니메이션, 유틸리티.

```typescript
// Components
import { DarkModeToggle, LanguageToggle } from '@soundblue/ui/components';
import { SearchDropdown, VirtualList } from '@soundblue/ui/patterns';
import { ToastContainer, ErrorBoundary } from '@soundblue/ui/feedback';
import { Skeleton, ProgressBar } from '@soundblue/ui/primitives';

// Hooks
import { useAutoAnimate } from '@soundblue/ui/hooks';

// Animation
import { FadeIn, SlideUp, ScaleIn } from '@soundblue/ui/animation';

// Utils
import { cn, preloadImage } from '@soundblue/ui/utils';

// Styles
@import "@soundblue/ui/styles/base.css";
```

| Export Path | Description |
|-------------|-------------|
| `/components` | 앱 공통 컴포넌트 |
| `/patterns` | 복합 UI 패턴 |
| `/feedback` | 토스트, 에러 경계 |
| `/primitives` | 기본 UI 요소 |
| `/hooks` | React 훅 |
| `/animation` | Framer Motion 래퍼 |
| `/utils` | cn(), preload 등 |
| `/styles/base.css` | 공통 CSS 스타일 |

---

## Environment Tags (환경 태그)

각 모듈은 실행 환경을 명시합니다:

```typescript
/**
 * @environment build-only
 * Node.js 빌드 시점에만 실행. 클라이언트 번들 제외.
 */
export function generateSitemap() {}

/**
 * @environment client-only
 * 브라우저에서만 실행. SSR 시 undefined/noop 반환.
 */
export function useOnlineStatus() {}

/**
 * @environment universal
 * 빌드 + 런타임 모두 안전. 순수 함수.
 */
export function cn(...classes: string[]) {}
```

---

## SSG Hydration Workaround (SSG Hydration 버그 대응)

> ⚠️ **React Router v7 + React 19 SSG 환경의 알려진 버그에 대한 workaround입니다.**

### 문제

React Router v7 SSG(`ssr: false`)에서 hydration 실패 시:
1. React 19가 새로운 DOM 트리를 생성
2. 기존 서버 렌더링 HTML이 삭제되지 않음
3. DOM 중복 → 사용자가 보는 버튼에 React 핸들러 없음 → 클릭 불가

### 해결책 (자체 구현)

각 앱의 `entry.client.tsx`에서 hydration 후 orphan DOM 제거:

```typescript
// apps/*/app/entry.client.tsx
startTransition(() => {
  hydrateRoot(document, <StrictMode><App /></StrictMode>);

  // Orphan DOM 정리 (React Router v7 SSG 버그 workaround)
  setTimeout(() => {
    const divs = [...document.body.children].filter(el => el.tagName === 'DIV');
    if (divs.length >= 2) {
      const firstDiv = divs[0] as HTMLElement;
      if (!Object.keys(firstDiv).some(k => k.startsWith('__react'))) {
        firstDiv.remove();
      }
    }
  }, 100);
});
```

### 수정 금지 파일

| 파일 | 역할 | 수정 금지 이유 |
|------|------|---------------|
| `apps/*/app/entry.client.tsx` | Hydration + orphan DOM 정리 | 삭제 시 모든 버튼 클릭 불가 |
| `apps/*/app/entry.server.tsx` | SSG HTML 생성 | `prerender` 함수 필수 |

### 관련 이슈

- [React Router #12893](https://github.com/remix-run/react-router/issues/12893)
- [React Router #12360](https://github.com/remix-run/react-router/discussions/12360)
- [React Router #13368](https://github.com/remix-run/react-router/issues/13368)

---

## Scaling Strategy (확장 전략)

### Context App: SSR + D1 아키텍처

Context 앱은 SSR + Cloudflare D1으로 **무제한 확장**이 가능합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│  SSR + D1 Architecture                                          │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  Client  │ → │  Pages   │ → │    D1     │                  │
│  │ Request  │    │ Function │    │ Database  │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│       ↑                               │                         │
│       └───────────────────────────────┘                         │
│              SSR HTML Response                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 장점

| 항목 | SSG (레거시) | SSR + D1 (현재) |
|:-----|:-------------|:----------------|
| 빌드 시간 | 엔트리 수에 비례 | **일정** (~30초) |
| 배포 크기 | 34,000+ HTML 파일 | **정적 페이지만** |
| 확장성 | OOM 위험 | **무제한** |
| 데이터 갱신 | 재빌드 필요 | **즉시 반영** |

### 사이트맵 (D1에서 동적 생성)

Google 제한 (50,000 URL/파일) 대응:

```
sitemap.xml (index)
├── sitemap-pages.xml
├── sitemap-categories.xml
├── sitemap-entry-greetings.xml    ← 카테고리별 분리
├── sitemap-entry-food.xml
├── sitemap-entry-coding.xml
└── sitemap-entry-{categoryId}.xml
```

### 관련 파일

| 파일 | 역할 |
|:-----|:-----|
| `apps/context/react-router.config.ts` | SSR 설정 (`ssr: true`) |
| `apps/context/wrangler.toml` | D1 바인딩 설정 |
| `apps/context/app/services/d1.ts` | D1 쿼리 함수 |
| `apps/context/app/routes/sitemap[.xml].tsx` | 동적 사이트맵 생성 |

---

## Dependency Graph (의존성 그래프)

```
apps/context ─────────┬─── @soundblue/ui
apps/roots ───────────┤    @soundblue/features
apps/permissive ──────┘    @soundblue/pwa
                           │
                           ▼
                      @soundblue/i18n
                      @soundblue/search
                      @soundblue/seo
                           │
                           ▼
                      @soundblue/data
                      @soundblue/platform
                           │
                           ▼
                      @soundblue/core
                      @soundblue/config
```

---

## Version History (변경 이력)

### v3.0.0 (2026-01-16)
- **Context 앱 SSR + D1 전용으로 전환**
- SSG 빌드 모드 제거 (BUILD_TARGET 환경변수 폐기)
- Entry 페이지 D1 실시간 조회로 통합
- 사이트맵 D1 동적 생성

### v2.1.0 (2026-01-02)
- SSG Hydration Workaround 문서화
- React Router v7 + React 19 hydration 버그 대응 코드 추가
- `entry.client.tsx` orphan DOM 정리 로직 구현

### v2.0.0 (2025-12-31)
- 패키지 6개 → 10개 모듈화
- 레이어 시스템 도입 (Layer 0-3)
- shared, shared-react 삭제 완료
- 새 패키지: config, platform, seo, pwa, features, ui

### v1.0.0 (Initial)
- 패키지 6개: core, data, search, i18n, shared, shared-react
