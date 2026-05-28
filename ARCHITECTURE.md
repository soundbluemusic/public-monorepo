# Architecture (아키텍처)

모노레포 패키지 구조 및 레이어 설계 문서입니다.

> **SEO 필수**: 검색 엔진은 JavaScript를 실행하지 않습니다.
> SPA는 빈 HTML(`<div id="root"></div>`)을 반환하여 **검색 노출이 불가능**합니다.
> 모든 페이지는 완전한 HTML로 빌드되어야 합니다.

---

## Deployment Modes (배포 모드)

| App | Framework | Mode | 데이터 소스 | 배포 대상 |
|:----|:----------|:-----|:-----------|:----------|
| **Context** | **Astro 6** | **SSR** | Cloudflare D1 | **Cloudflare Workers** |
| Permissive | Astro 6 | SSR | In-memory TypeScript | Cloudflare Workers |
| Roots | Astro 6 | SSR | TypeScript JSON | Cloudflare Workers |

> **모든 앱은 Astro 6 + Cloudflare Workers**로 배포됩니다 (`@astrojs/cloudflare` 어댑터).

---

## SSR Architecture - Context App

### How It Works

Astro 6의 SSR 모드(`output: 'server'`) + Cloudflare D1으로 **런타임에** 동적 페이지를 생성합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│  Runtime (Cloudflare Workers)                                    │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │ Request  │ →  │  Astro   │ →  │    D1     │                  │
│  │/entry/:id│    │  page    │    │ Database  │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│       ↑                               │                         │
│       └───────────────────────────────┘                         │
│              SSR HTML Response                                   │
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

```javascript
// apps/context/astro.config.mjs
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  adapter: cloudflare({ imageService: 'passthrough' }),
  output: 'server',
  srcDir: './src',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
    server: { port: 3003 },
  },
});
```

```toml
# apps/context/wrangler.toml
name = "context"
compatibility_date = "2026-01-22"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "context-db"
database_id = "..."

[[d1_databases]]
binding = "PRIVATE_DB"
database_name = "private"
database_id = "..."

[assets]
directory = "dist"
```

### D1 접근 패턴 (Astro 페이지에서)

```astro
---
// apps/context/src/pages/entry/[entryId].astro
const db = Astro.locals.runtime?.env?.DB;
if (!db) {
  return new Response('D1 not bound', { status: 500 });
}
const entry = await db.prepare('SELECT * FROM entries WHERE id = ?')
  .bind(Astro.params.entryId)
  .first();
if (!entry) {
  return Astro.redirect('/404', 404);
}
---
<html><head><title>{entry.korean}</title></head>
<body><h1>{entry.korean}</h1></body></html>
```

`Astro.locals.runtime.env`는 `@astrojs/cloudflare` 어댑터가 주입합니다. 어댑터 문서: https://docs.astro.build/en/guides/integrations-guide/cloudflare/#access-to-the-cloudflare-runtime

### Dynamic Sitemap Generation

SSR 모드에서 사이트맵은 D1에서 실시간 생성됩니다. 라우트 파일은 `apps/context/src/pages/sitemap*.xml.ts` (Astro의 `.xml.ts` API 라우트).

| Route | 데이터 소스 |
|:------|:-----------|
| `/sitemap.xml` | 인덱스 (모든 sitemap 링크) |
| `/sitemap-pages.xml` | `app/data/sitemap-static-pages.json` SSoT |
| `/sitemap-categories.xml` | D1 categories |
| `/sitemap-tags.xml` | D1 entries (JSON tags 파싱) |
| `/sitemap-entry-[categoryId].xml` | D1 entries |
| `/api/offline-db` | D1 전체 덤프 |

---

## SSR Architecture - Roots / Permissive

### How It Works

Astro 6의 SSR 모드 + Cloudflare Workers로 **런타임에** 동적 페이지를 생성합니다. D1 없이 TypeScript in-memory 데이터를 직접 사용합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│  Runtime (Cloudflare Workers)                                    │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │ Request  │ →  │  Astro   │ →  │ TS data  │                  │
│  │/concept/x│    │  page    │    │(bundled) │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│       ↑                               │                         │
│       └───────────────────────────────┘                         │
│              SSR HTML Response                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 앱별 데이터/렌더링 요약

| App | Dynamic Routes | Data Source |
|:----|:---------------|:------------|
| **Context** | 16,394 entries + 52 categories + 53 conversations | Cloudflare D1 |
| **Permissive** | 120 libraries + 56 Web APIs + 25 categories + 153 tags | TypeScript (`app/data/libraries.ts`, `web-apis.ts`) |
| **Roots** | 438 concepts + 18 fields | TypeScript (`app/data/concepts.ts`, `fields.ts`) |

### SSR Code Pattern (Astro)

```javascript
// apps/permissive/astro.config.mjs (roots도 동일 구조)
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  adapter: cloudflare({ imageService: 'passthrough' }),
  output: 'server',
  srcDir: './src',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
    server: { port: 3004 },
  },
});
```

```astro
---
// apps/roots/src/pages/concept/[conceptId].astro
import { getConceptById } from '../../../app/data/concepts';
import BaseLayout from '../../layouts/BaseLayout.astro';

const { conceptId } = Astro.params;
const concept = getConceptById(conceptId!);
if (!concept) {
  return Astro.redirect('/404', 404);
}
---

<BaseLayout title={concept.name.en}>
  <h1>{concept.name.en}</h1>
</BaseLayout>
```

### 다국어 동적 라우트 패턴

Astro 6의 `i18n` 설정과 폴더 기반 라우팅을 함께 사용합니다.

```
src/pages/
├── concept/[conceptId].astro        # 영어: /concept/:conceptId
└── ko/concept/[conceptId].astro     # 한국어: /ko/concept/:conceptId
```

각 라우트에서 `Astro.url.pathname`으로 locale을 판별합니다.

```astro
---
import { getLocaleFromPath } from '@soundblue/i18n';

const locale = getLocaleFromPath(Astro.url.pathname);
// '/ko/concept/...' → 'ko'
// '/concept/...'    → 'en'
---
```

### 빌드 후처리 (strip-bindings.mjs)

세 앱 모두 빌드 후 `scripts/strip-bindings.mjs`를 실행합니다 (`package.json:"build"` 스크립트 마지막 단계).

```json
"build": "astro build && node scripts/strip-bindings.mjs"
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
                        │  @soundblue/pwa                             │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 1 (Data + SEO)    ┌─────────────────────────────────────────────┐
                        │  @soundblue/data     @soundblue/platform    │
                        │  @soundblue/seo                             │
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
순수 함수, 타입, 검증 유틸리티. React/브라우저 의존 없음.

```typescript
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
Astro/Vite, Tailwind, TypeScript 설정.

---

### Layer 1: Data (데이터)

#### @soundblue/data
Zod 스키마, 데이터 로더, 타입 정의.

```typescript
import { EntrySchema, ConceptSchema } from '@soundblue/data/schemas';
import { createDataLoader, loadJson, loadJsonDirectory } from '@soundblue/data/loaders';
```

#### @soundblue/platform
브라우저 IndexedDB 스토리지 (Dexie.js 기반).

```typescript
import { storage } from '@soundblue/platform/storage';
import type { FavoriteItem, RecentViewItem, SettingsData } from '@soundblue/platform';
```

---

### Layer 2: Domain (도메인)

#### @soundblue/i18n
다국어 라우팅, locale 추출 유틸.

```typescript
import { getLocaleFromPath, stripLocaleFromPath } from '@soundblue/i18n';
```

#### @soundblue/search
MiniSearch 래퍼, 검색 워커.

| Export Path | Description |
|-------------|-------------|
| `/` | Core search engine (SearchEngine class) |
| `/react` | React hooks (useSearch, useSearchWorker) — Astro Islands에서 사용 |
| `/worker` | Web Worker 유틸리티 |

#### @soundblue/seo
메타 태그 팩토리, 사이트맵 생성기, structured data.

```typescript
import { generateBreadcrumbSchema, generateSoftwareApplicationSchema } from '@soundblue/seo/structured-data';
import { generateSitemaps } from '@soundblue/seo/sitemap';
```

#### @soundblue/pwa
서비스 워커, 오프라인 인디케이터 (Context 앱에서만 사용).

---

### Layer 3: UI & Features (UI 및 기능)

#### @soundblue/features
비즈니스 로직 훅 (설정, 토스트, 미디어 쿼리).

#### @soundblue/ui
React/Astro 호환 UI 컴포넌트, shell 설정 타입, CSS 유틸.

```typescript
import type { RootShellConfig } from '@soundblue/ui/shell';
import { PANEL_LEFT_CLOSE_SVG, PANEL_LEFT_OPEN_SVG } from '@soundblue/ui/utils';
```

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

## Astro 6 SSR (서버 사이드 렌더링)

> Astro 6는 `output: 'server'` + `@astrojs/cloudflare` 어댑터로 Cloudflare Workers와 완벽히 통합됩니다.

### 핵심 파일 (앱당)

| 파일 | 역할 |
|------|------|
| `astro.config.mjs` | Astro + Cloudflare adapter + i18n 설정 |
| `wrangler.toml` | Workers 바인딩(D1, KV 등) + 빌드 출력 경로 |
| `src/pages/` | Astro 파일 기반 라우트 (`.astro`/`.ts`/`.xml.ts`) |
| `src/layouts/BaseLayout.astro` | 공통 HTML 셸 (head, theme color, JSON-LD) |
| `src/components/` | Astro 컴포넌트 (Header, Sidebar, AppShell) |
| `app/data/` | 데이터 헬퍼 + `site.json` (도메인 SSoT) |
| `app/config.ts` | `APP_CONFIG` (baseUrl, name, description) |
| `app/shell.config.ts` | shellConfig (theme colors, navigation) |

### 관련 문서

- [Astro 6 Docs](https://docs.astro.build)
- [@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Astro i18n routing](https://docs.astro.build/en/guides/internationalization/)

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
│  │ Request  │    │ (Astro)  │    │ Database  │                  │
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
├── sitemap-entry-greetings.xml      ← 카테고리별 분리
├── sitemap-entry-food.xml
├── sitemap-entry-coding.xml
└── sitemap-entry-{categoryId}.xml
```

### 관련 파일

| 파일 | 역할 |
|:-----|:-----|
| `apps/context/astro.config.mjs` | Astro + Cloudflare adapter 설정 |
| `apps/context/wrangler.toml` | D1 바인딩 설정 |
| `apps/context/src/pages/` | 페이지 + API 라우트 (sitemap*.xml.ts 포함) |
| `apps/context/scripts/strip-bindings.mjs` | 빌드 후처리 (배포 산출물 정리) |

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
                           │
                           ▼
                      @soundblue/data
                      @soundblue/platform
                      @soundblue/seo
                           │
                           ▼
                      @soundblue/core
                      @soundblue/config
```

---

## Version History (변경 이력)

### v4.0.0 (2026-05-28) — TanStack → Astro 마이그레이션 후속 정리
- **마이그레이션 이전 잔재 제거**: 이미 완료된 TanStack Start → Astro 6 마이그레이션 이후 갱신되지 않았던 문서와 파일 정리
- 문서를 실제 사용 중인 Astro 6 + `@astrojs/cloudflare` 어댑터 구조로 재작성
- 세 앱 모두 동일한 Astro 6 SSR 구조임을 명시
- 마이그레이션 잔재 파일 삭제:
  - `apps/context/vite.config.ts` — TanStack Start 시절 빌드 설정 (Astro는 `astro.config.mjs` 사용)
  - `apps/permissive/vite.config.ts` — 동일
  - `apps/permissive/scripts/inject-polyfill.mjs` — TanStack Router의 `location.protocol` 접근 문제 해결용 폴리필. Astro는 불필요
  - `data/permissive/*.json` — TanStack 시절 외부 데이터. Astro 마이그레이션 시 `apps/permissive/app/data/*.ts`로 인라인화됨

### v3.0.0 (2026-01-16)
- Context 앱 SSR + D1 전용으로 전환
- Entry 페이지 D1 실시간 조회로 통합
- 사이트맵 D1 동적 생성

### v2.0.0 (2025-12-31)
- 패키지 6개 → 10개 모듈화
- 레이어 시스템 도입 (Layer 0-3)
- 새 패키지: config, platform, seo, pwa, features, ui

### v1.0.0 (Initial)
- 패키지 6개: core, data, search, i18n, shared, shared-react
