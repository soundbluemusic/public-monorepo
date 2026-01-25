# Architecture (아키텍처)

모노레포 패키지 구조 및 레이어 설계 문서입니다.

> **SEO 필수**: 검색 엔진은 JavaScript를 실행하지 않습니다.
> SPA는 빈 HTML(`<div id="root"></div>`)을 반환하여 **검색 노출이 불가능**합니다.
> 모든 페이지는 완전한 HTML로 빌드되어야 합니다.

---

## Deployment Modes (배포 모드)

| App | Mode | 데이터 소스 | 배포 대상 |
|:----|:-----|:-----------|:----------|
| **Context** | **SSR** | Cloudflare D1 | **Cloudflare Workers** |
| Permissive | SSR | In-memory | Cloudflare Workers |
| Roots | SSR | TypeScript | Cloudflare Workers |

> **모든 앱은 SSR + Cloudflare Workers**로 배포됩니다.

---

## SSR Architecture (SSR 아키텍처) - Context App

### How It Works

TanStack Start의 SSR 모드 + Cloudflare D1으로 **런타임에** 동적 페이지를 생성합니다.

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
│  Runtime (Cloudflare Workers)                                    │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Request    │ → │  Workers    │ → │  SSR HTML     │         │
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
// vite.config.ts (TanStack Start)
import { cloudflare } from '@cloudflare/vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({ srcDirectory: 'app' }),
  ],
});

// app.config.ts (TanStack Start 설정)
import { defineConfig } from '@tanstack/react-start/config';
export default defineConfig({});

// wrangler.toml (Workers 설정)
name = "context"
main = "build/server/index.js"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "context-db"
database_id = "55c25518-db3d-4547-8ad8-e36fc66493c8"

[assets]
directory = "build/client"
```

### Dynamic Sitemap Generation

SSR 모드에서 사이트맵은 D1에서 실시간 생성됩니다:

| Route | 설명 | 데이터 소스 |
|:------|:-----|:-----------|
| `/sitemap.xml` | 인덱스 | D1 categories 테이블 |
| `/sitemap-pages.xml` | 정적 페이지 | 하드코딩 |
| `/sitemap-categories.xml` | 카테고리 목록 | D1 categories |
| `/sitemap-entry-{categoryId}.xml` | 카테고리별 엔트리 | D1 entries |
| `/api/offline-db` | 오프라인 DB 덤프 | D1 전체 테이블 |

---

## SSR Architecture (SSR 아키텍처) - Roots/Permissive 앱

### How It Works

TanStack Start의 SSR 모드 + Cloudflare Workers로 **런타임에** 동적 페이지를 생성합니다.

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
│  Runtime (Cloudflare Workers)                                    │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Request    │ → │  Workers    │ → │  SSR HTML     │         │
│  │ /concept/:id│    │  loader()   │    │  (dynamic)   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### 앱별 렌더링 모드

| App | Mode | Dynamic Routes | Data Source |
|:----|:-----|:---------------|:------------|
| **Context** | **SSR** | 16394 entries | Cloudflare D1 |
| **Roots** | SSR | 438 concepts + 18 fields | TypeScript |
| **Permissive** | SSR | 88 libraries + 56 Web APIs | In-memory |

> **모든 앱은 SSR + Cloudflare Workers**로 배포됩니다.

### SSR Code Pattern (TanStack Start)

```typescript
// vite.config.ts
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({ srcDirectory: 'app' }),
  ],
});

// routes/concept/$conceptId.tsx (파일 기반 라우팅)
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/concept/$conceptId')({
  loader: async ({ params }) => {
    const concept = getConceptById(params.conceptId);
    if (!concept) throw notFound();
    return { concept };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData.concept.name.en }],
  }),
  component: ConceptPage,
});
```

### 다국어 동적 라우트 패턴 (중요!)

> **⛔ `params.locale` 사용 금지** - 항상 `undefined`입니다!

#### 원인

TanStack Start 파일 기반 라우팅에서 다국어 라우트 구조:

```
routes/
├── concept/$conceptId.tsx        # 영어: /concept/:conceptId
└── ko/concept/$conceptId.tsx     # 한국어: /ko/concept/:conceptId
```

`ko`는 **폴더명(고정 문자열)**입니다. 따라서 `params.locale`은 항상 `undefined`가 됩니다.

#### 올바른 패턴

```typescript
import { getLocaleFromPath } from '@soundblue/i18n';
import { createFileRoute, notFound } from '@tanstack/react-router';

// ✅ TanStack Start loader에서 (location.pathname 사용)
export const Route = createFileRoute('/entry/$entryId')({
  loader: async ({ params, location }) => {
    const locale = getLocaleFromPath(location.pathname);  // '/ko/entry/...' → 'ko'
    const entry = await getEntry(params.entryId, locale);
    if (!entry) throw notFound();
    return { entry, locale };
  },
  component: EntryPage,
});

// ✅ 컴포넌트에서 (useLocation 사용)
function EntryPage() {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname);
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

## TanStack Start SSR (서버 사이드 렌더링)

> TanStack Start는 Vinxi 기반으로 SSR을 처리하며, Cloudflare Workers와 완벽히 통합됩니다.

### 핵심 파일

| 파일 | 역할 |
|------|------|
| `app/routes/__root.tsx` | 루트 레이아웃 + HeadContent, Scripts |
| `app/router.tsx` | Router 인스턴스 생성 |
| `app/client.tsx` | 클라이언트 진입점 (hydration) |
| `app/ssr.tsx` | 서버 진입점 (SSR 핸들러) |

### Server Functions (createServerFn)

D1 데이터베이스 접근은 `createServerFn`을 통해 서버에서만 실행됩니다:

```typescript
// app/services/d1-server.ts
import { createServerFn } from '@tanstack/react-start';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const getEntry = createServerFn({ method: 'GET' })
  .validator((entryId: string) => entryId)
  .handler(async ({ data: entryId }) => {
    const { env } = getCloudflareContext();
    const db = env.DB;
    return await db.prepare('SELECT * FROM entries WHERE id = ?')
      .bind(entryId).first();
  });
```

### 관련 문서

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [TanStack Router Docs](https://tanstack.com/router/latest)

---

## Scaling Strategy (확장 전략)

### Context App: SSR + D1 아키텍처

Context 앱은 SSR + Cloudflare D1으로 **무제한 확장**이 가능합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│  SSR + D1 Architecture (Cloudflare Workers)                      │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  Client  │ → │ Workers  │ → │    D1     │                  │
│  │ Request  │    │  (SSR)   │    │ Database  │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│       ↑                               │                         │
│       └───────────────────────────────┘                         │
│              SSR HTML Response                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 장점

| 항목 | SSR + Workers (현재) |
|:-----|:--------------------|
| 빌드 시간 | **일정** (~30초) |
| 배포 크기 | **정적 페이지만** |
| 확장성 | **무제한** |
| 데이터 갱신 | **즉시 반영** |

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
| `apps/context/vite.config.ts` | TanStack Start + Cloudflare 플러그인 설정 |
| `apps/context/app.config.ts` | TanStack Start 설정 |
| `apps/context/wrangler.toml` | D1 바인딩 설정 |
| `apps/context/app/services/d1-server.ts` | createServerFn 기반 D1 쿼리 |
| `apps/context/app/routes/sitemap.xml.tsx` | 동적 사이트맵 생성 |

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

### v3.3.0 (2026-01-25)
- **문서 정확성 개선: React Router → TanStack Start 반영**
- 모든 문서에서 실제 사용 프레임워크(TanStack Start) 명시
- 불필요한 react-router 의존성 제거
- TanStack 패키지 버전 업데이트

### v3.2.0 (2026-01-18)
- **Permissive, Roots 앱 Cloudflare Workers로 마이그레이션**
- 모든 앱 SSR + Cloudflare Workers로 통합
- Pages 프로젝트 삭제 (ro0ts, permissive)

### v3.1.0 (2026-01-17)
- **Context 앱 Pages Functions → Cloudflare Workers로 마이그레이션**
- Workers 기반 SSR + D1 바인딩으로 전환
- 정적 자산은 Workers Assets로 서빙

### v3.0.0 (2026-01-16)
- **Context 앱 SSR + D1 전용으로 전환**
- Entry 페이지 D1 실시간 조회로 통합
- 사이트맵 D1 동적 생성

### v2.1.0 (2026-01-02)
- TanStack Start로 프레임워크 마이그레이션
- React Router v7 → TanStack Router/Start 전환
- `createServerFn` 기반 서버 함수 도입

### v2.0.0 (2025-12-31)
- 패키지 6개 → 10개 모듈화
- 레이어 시스템 도입 (Layer 0-3)
- shared, shared-react 삭제 완료
- 새 패키지: config, platform, seo, pwa, features, ui

### v1.0.0 (Initial)
- 패키지 6개: core, data, search, i18n, shared, shared-react
