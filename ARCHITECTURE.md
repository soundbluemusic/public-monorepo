# Architecture (아키텍처)

모노레포 패키지 구조 및 레이어 설계 문서입니다.

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
import { LIMITS, validateId, sanitizeInput } from '@soundblue/core/validation';
import { chunk, groupBy, unique } from '@soundblue/core/utils';
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
import { loadEntries, loadConcepts } from '@soundblue/data/loaders';
```

#### @soundblue/platform
브라우저 API 래퍼, 환경 감지.

```typescript
// Exports
import { isBrowser, isServer } from '@soundblue/platform/env';
import { storage, indexedDB } from '@soundblue/platform/storage';
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
import { createSearchEngine, SearchResult } from '@soundblue/search';

// React hooks
import { useSearchWorker, type SearchResult } from '@soundblue/search/react';
```

| Export Path | Description |
|-------------|-------------|
| `/` | Core search engine (non-React) |
| `/react` | React hooks & components |
| `/adapters` | MiniSearch adapter |

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
import { Toast, ErrorBoundary } from '@soundblue/ui/feedback';
import { Skeleton, ProgressBar } from '@soundblue/ui/primitives';

// Hooks
import { useAutoAnimate } from '@soundblue/ui/hooks';

// Animation
import { FadeIn, SlideIn } from '@soundblue/ui/animation';

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

### Legacy Packages (레거시 패키지)

#### @soundblue/shared (Deprecated)
`@soundblue/core`, `@soundblue/i18n`, `@soundblue/seo`로 마이그레이션 중.

현재 역할:
- 빌드 스크립트용 paraglide-generator
- 사이트맵 생성 유틸리티
- Tailwind CSS 설정

#### @soundblue/shared-react (Deprecated)
`@soundblue/ui`, `@soundblue/features`, `@soundblue/pwa`로 마이그레이션 중.

---

## Migration Guide (마이그레이션 가이드)

### Before → After

```typescript
// ❌ Old imports (deprecated)
import { cn, useAutoAnimate } from '@soundblue/shared-react';
import { metaFactory, LIMITS } from '@soundblue/shared';

// ✅ New imports
import { cn } from '@soundblue/ui/utils';
import { useAutoAnimate } from '@soundblue/ui/hooks';
import { metaFactory } from '@soundblue/seo/meta';
import { LIMITS } from '@soundblue/core/validation';
```

### Module Migration Table

| Old Import | New Import |
|------------|------------|
| `@soundblue/shared-react` → `cn` | `@soundblue/ui/utils` |
| `@soundblue/shared-react` → `useAutoAnimate` | `@soundblue/ui/hooks` |
| `@soundblue/shared-react` → `useSearchWorker` | `@soundblue/search/react` |
| `@soundblue/shared-react` → `DarkModeToggle` | `@soundblue/ui/components` |
| `@soundblue/shared-react` → `LanguageToggle` | `@soundblue/ui/components` |
| `@soundblue/shared-react` → `Toast` | `@soundblue/ui/feedback` |
| `@soundblue/shared-react` → `OfflineIndicator` | `@soundblue/pwa/react` |
| `@soundblue/shared-react` → `useSettingsStore` | `@soundblue/features/settings` |
| `@soundblue/shared` → `LIMITS` | `@soundblue/core/validation` |
| `@soundblue/shared` → `metaFactory` | `@soundblue/seo/meta` |
| `@soundblue/shared` → `stripLocaleFromPath` | `@soundblue/i18n` |
| `@soundblue/shared` → `extractStaticRoutes` | `@soundblue/i18n` |
| `@soundblue/shared-react/styles/base.css` | `@soundblue/ui/styles/base.css` |

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

### v2.0.0 (2024-12-30)
- 패키지 6개 → 12개 모듈화
- 레이어 시스템 도입 (Layer 0-3)
- shared, shared-react 레거시로 전환
- 새 패키지: config, platform, seo, pwa, features, ui

### v1.0.0 (Initial)
- 패키지 6개: core, data, search, i18n, shared, shared-react
