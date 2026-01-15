# Architecture (아키텍처)

모노레포 패키지 구조 및 레이어 설계 문서입니다.

> ⛔ **100% SSG Only** - 이 프로젝트는 정적 사이트 생성(SSG) 전용입니다.
> SPA, SSR, ISR 등 다른 렌더링 모드로 전환 절대 금지.
>
> **SEO 필수**: 검색 엔진은 JavaScript를 실행하지 않습니다.
> SPA는 빈 HTML(`<div id="root"></div>`)을 반환하여 **검색 노출이 불가능**합니다.
> 모든 페이지는 완전한 HTML로 빌드되어야 합니다.

---

## SSG Architecture (SSG 아키텍처)

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
| **Context** | 16836 entries + 25 categories + 53 conversations | 33,748 | JSON |
| **Roots** | 438 concepts + 18 fields | 920 | TypeScript |
| **Permissive** | 4 static routes | 8 | Array literals |
| **Total** | — | **34,676** | — |

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
