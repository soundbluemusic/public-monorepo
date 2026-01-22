# TanStack Start SSR 마이그레이션 계획 (최종)

> **목표**: React Router v7 SSR → TanStack Start SSR 전환
> **범위**: 3개 앱 + 관련 패키지
> **TanStack Start 버전**: v1.x (1.0 RC)

---

## 마이그레이션 순서

```
1️⃣ Permissive (가장 단순)
    ↓
2️⃣ Roots (중간 복잡도)
    ↓
3️⃣ Context (D1 + 동적 사이트맵)
```

| 앱 | 라우트 | 데이터 소스 | 특수 기능 |
|----|--------|-------------|-----------|
| Permissive | 10개 | 메모리 | - |
| Roots | 11개 | TypeScript | prerender 438개 |
| Context | 22개 | D1 | 동적 사이트맵, API |

---

## Phase 0: 사전 준비

### 0.1 패키지 의존성 추가 (루트)

```bash
# TanStack 패키지 추가
pnpm add @tanstack/react-start @tanstack/react-router -w
pnpm add -D @tanstack/router-plugin -w

# Cloudflare Vite 플러그인
pnpm add -D @cloudflare/vite-plugin -w
```

### 0.2 @soundblue/seo 패키지 업데이트

**새 함수 추가:** `headFactory`, `dynamicHeadFactory`

```typescript
// packages/seo/src/meta/head-factory.ts
import type { HeadConfig } from '@tanstack/react-router';

export function headFactory(
  localizedMeta: LocalizedMeta,
  baseUrl: string
): (ctx: { location: { pathname: string } }) => HeadConfig;

export function dynamicHeadFactory<T>(
  getMetaFn: (data: T) => LocalizedMeta,
  baseUrl: string
): (ctx: { loaderData: T; location: { pathname: string } }) => HeadConfig;
```

---

## Phase 1: Permissive 앱 마이그레이션

### 1.1 설정 파일 생성

**apps/permissive/app.config.ts**
```typescript
import { defineConfig } from '@tanstack/react-start/config';

export default defineConfig({
  server: {
    preset: 'cloudflare-workers',
  },
});
```

**apps/permissive/vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tanstackStart(),
    tailwindcss(),
  ],
});
```

### 1.2 라우트 파일 변환

| 현재 | 변환 후 |
|------|---------|
| `routes/($locale)._index.tsx` | `routes/_index.tsx` + `routes/ko/_index.tsx` |
| `routes/($locale).libraries.tsx` | `routes/libraries.tsx` + `routes/ko/libraries.tsx` |
| `routes/($locale).web-api.tsx` | `routes/web-api.tsx` + `routes/ko/web-api.tsx` |
| `routes/($locale).library.$slug.tsx` | `routes/library/$slug.tsx` + `routes/ko/library/$slug.tsx` |
| `routes/($locale).web-api.$slug.tsx` | `routes/web-api/$slug.tsx` + `routes/ko/web-api/$slug.tsx` |
| `routes/($locale).built-with.tsx` | `routes/built-with.tsx` + `routes/ko/built-with.tsx` |
| `routes/($locale).sitemap.tsx` | `routes/sitemap.tsx` + `routes/ko/sitemap.tsx` |
| `routes/category.$categoryId.tsx` | `routes/category/$categoryId.tsx` |
| `routes/ko.category.$categoryId.tsx` | `routes/ko/category/$categoryId.tsx` |
| `routes/$.tsx` | `routes/$.tsx` |

### 1.3 루트 레이아웃 생성

**routes/__root.tsx**
```typescript
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
```

### 1.4 라우트 컴포넌트 변환 예시

**현재: routes/($locale).library.$slug.tsx**
```typescript
import { useLoaderData } from 'react-router';
import { dynamicMetaFactory } from '@soundblue/i18n';

export async function loader({ params }) {
  const library = getLibraryBySlug(params.slug);
  if (!library) throw new Response('Not Found', { status: 404 });
  return { library };
}

export const meta = dynamicMetaFactory((data) => ({
  ko: { title: `${data.library.name} | Permissive`, description: data.library.description },
  en: { title: `${data.library.name} | Permissive`, description: data.library.description },
}), 'https://permissive.soundbluemusic.com');

export default function LibraryPage() {
  const { library } = useLoaderData<typeof loader>();
  return <LibraryDetail library={library} />;
}
```

**변환 후: routes/library/$slug.tsx**
```typescript
import { createFileRoute } from '@tanstack/react-router';
import { dynamicHeadFactory } from '@soundblue/seo/meta';

export const Route = createFileRoute('/library/$slug')({
  loader: async ({ params }) => {
    const library = getLibraryBySlug(params.slug);
    if (!library) throw new Response('Not Found', { status: 404 });
    return { library };
  },
  head: dynamicHeadFactory((data) => ({
    ko: { title: `${data.library.name} | Permissive`, description: data.library.description },
    en: { title: `${data.library.name} | Permissive`, description: data.library.description },
  }), 'https://permissive.soundbluemusic.com'),
  component: LibraryPage,
});

function LibraryPage() {
  const { library } = Route.useLoaderData();
  return <LibraryDetail library={library} />;
}
```

### 1.5 wrangler.toml 업데이트

```toml
name = "permissive"
compatibility_date = "2026-01-22"
compatibility_flags = ["nodejs_compat"]

[observability]
enabled = true
```

### 1.6 삭제할 파일

- `apps/permissive/react-router.config.ts`
- `apps/permissive/app/routes.ts`
- `apps/permissive/app/entry.client.tsx`
- `apps/permissive/app/entry.server.tsx`

### 1.7 검증

```bash
# 로컬 테스트
cd apps/permissive
pnpm dev

# SSR HTML 확인
curl -s http://localhost:3004/library/react | grep -i "<title>"
# ✅ React | Permissive

curl -s http://localhost:3004/ko/library/react | grep -i "<title>"
# ✅ React | Permissive (한글 페이지)

# 배포
pnpm deploy
```

---

## Phase 2: Roots 앱 마이그레이션

### 2.1 설정 파일 생성

**apps/roots/app.config.ts**
```typescript
import { defineConfig } from '@tanstack/react-start/config';

export default defineConfig({
  server: {
    preset: 'cloudflare-workers',
  },
});
```

### 2.2 라우트 파일 변환

| 현재 | 변환 후 |
|------|---------|
| `routes/($locale)._index.tsx` | `routes/_index.tsx` + `routes/ko/_index.tsx` |
| `routes/($locale).browse.tsx` | `routes/browse.tsx` + `routes/ko/browse.tsx` |
| `routes/($locale).search.tsx` | `routes/search.tsx` + `routes/ko/search.tsx` |
| `routes/($locale).favorites.tsx` | `routes/favorites.tsx` + `routes/ko/favorites.tsx` |
| `routes/($locale).constants.tsx` | `routes/constants.tsx` + `routes/ko/constants.tsx` |
| `routes/($locale).about.tsx` | `routes/about.tsx` + `routes/ko/about.tsx` |
| `routes/($locale).built-with.tsx` | `routes/built-with.tsx` + `routes/ko/built-with.tsx` |
| `routes/($locale).sitemap.tsx` | `routes/sitemap.tsx` + `routes/ko/sitemap.tsx` |
| `routes/($locale).field.$fieldId.tsx` | `routes/field/$fieldId.tsx` + `routes/ko/field/$fieldId.tsx` |
| `routes/($locale).concept.$conceptId.tsx` | `routes/concept/$conceptId.tsx` + `routes/ko/concept/$conceptId.tsx` |
| `routes/$.tsx` | `routes/$.tsx` |

### 2.3 Structured Data 유지

```typescript
// routes/concept/$conceptId.tsx
import { createFileRoute } from '@tanstack/react-router';
import { dynamicHeadFactory } from '@soundblue/seo/meta';
import { generateArticleSchema, generateBreadcrumbSchema } from '@soundblue/seo/structured-data';

export const Route = createFileRoute('/concept/$conceptId')({
  loader: async ({ params }) => {
    const concept = getConceptByIdStatic(params.conceptId);
    if (!concept) throw new Response('Not Found', { status: 404 });
    return { concept };
  },
  head: dynamicHeadFactory((data) => ({
    ko: {
      title: `${data.concept.name.ko} | Roots`,
      description: data.concept.content.ko.definition,
    },
    en: {
      title: `${data.concept.name.en} | Roots`,
      description: data.concept.content.en.definition,
    },
  }), 'https://roots.soundbluemusic.com'),
  component: ConceptPage,
});

function ConceptPage() {
  const { concept } = Route.useLoaderData();

  // JSON-LD 유지
  const breadcrumbSchema = generateBreadcrumbSchema([...]);
  const articleSchema = generateArticleSchema({...});

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ConceptContent concept={concept} />
    </>
  );
}
```

### 2.4 삭제할 파일

- `apps/roots/react-router.config.ts`
- `apps/roots/app/routes.ts`
- `apps/roots/app/entry.client.tsx`
- `apps/roots/app/entry.server.tsx`

### 2.5 검증

```bash
# SSR HTML 확인
curl -s https://roots.soundbluemusic.com/concept/addition | head -50
# ✅ <title>Addition | Roots</title>
# ✅ JSON-LD 스크립트 존재
```

---

## Phase 3: Context 앱 마이그레이션

### 3.1 설정 파일 생성

**apps/context/app.config.ts**
```typescript
import { defineConfig } from '@tanstack/react-start/config';

export default defineConfig({
  server: {
    preset: 'cloudflare-workers',
  },
});
```

### 3.2 라우트 파일 변환

| 현재 | 변환 후 |
|------|---------|
| `routes/_index.tsx` | `routes/_index.tsx` |
| `routes/ko._index.tsx` | `routes/ko/_index.tsx` |
| `routes/($locale).browse.tsx` | `routes/browse.tsx` + `routes/ko/browse.tsx` |
| `routes/($locale).entry.$entryId.tsx` | `routes/entry/$entryId.tsx` + `routes/ko/entry/$entryId.tsx` |
| `routes/($locale).category.$categoryId.tsx` | `routes/category/$categoryId.tsx` + `routes/ko/category/$categoryId.tsx` |
| `routes/($locale).conversations._index.tsx` | `routes/conversations/_index.tsx` + `routes/ko/conversations/_index.tsx` |
| `routes/($locale).conversations.$categoryId.tsx` | `routes/conversations/$categoryId.tsx` + `routes/ko/conversations/$categoryId.tsx` |
| `routes/sitemap.xml.tsx` | `routes/api/sitemap.xml.tsx` |
| `routes/sitemap-pages.xml.tsx` | `routes/api/sitemap-pages.xml.tsx` |
| `routes/sitemap-categories.xml.tsx` | `routes/api/sitemap-categories.xml.tsx` |
| `routes/sitemap-entry-$categoryId.tsx` | `routes/api/sitemap-entry.$categoryId.xml.tsx` |
| `routes/api.offline-db.tsx` | `routes/api/offline-db.tsx` |

### 3.3 D1 바인딩 접근 방식

**현재:**
```typescript
export async function loader({ params, request, context }) {
  const db = context.cloudflare.env.DB;
  const entry = await getEntryByIdFromD1(db, params.entryId);
  return { entry };
}
```

**변환 후:**
```typescript
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getCloudflareContext } from '@opennextjs/cloudflare';

const getEntry = createServerFn({ method: 'GET' })
  .validator((data: { entryId: string }) => data)
  .handler(async ({ data }) => {
    const { env } = await getCloudflareContext();
    const db = env.DB;
    const entry = await getEntryByIdFromD1(db, data.entryId);
    if (!entry) throw new Response('Not Found', { status: 404 });
    return entry;
  });

export const Route = createFileRoute('/entry/$entryId')({
  loader: async ({ params }) => {
    const entry = await getEntry({ data: { entryId: params.entryId } });
    return { entry };
  },
  head: dynamicHeadFactory((data) => ({
    ko: { title: `${data.entry.korean} | Context` },
    en: { title: `${data.entry.korean} | Context` },
  }), 'https://context.soundbluemusic.com'),
  component: EntryPage,
});
```

### 3.4 동적 사이트맵 변환

**routes/api/sitemap.xml.tsx**
```typescript
import { createAPIFileRoute } from '@tanstack/react-start/api';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const APIRoute = createAPIFileRoute('/api/sitemap.xml')({
  GET: async () => {
    const { env } = await getCloudflareContext();
    const db = env.DB;
    const categories = await getCategoriesFromD1(db);

    const xml = generateSitemapIndex(categories);

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
});
```

### 3.5 wrangler.toml 업데이트

```toml
name = "context"
compatibility_date = "2026-01-22"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "context-db"
database_id = "55c25518-db3d-4547-8ad8-e36fc66493c8"

[observability]
enabled = true
```

### 3.6 삭제할 파일

- `apps/context/react-router.config.ts`
- `apps/context/app/routes.ts`
- `apps/context/app/entry.client.tsx`
- `apps/context/app/entry.server.tsx`

### 3.7 검증

```bash
# Entry 페이지 SSR 확인
curl -s https://context.soundbluemusic.com/entry/annyeong | grep -i "<title>"
# ✅ 안녕 - Hello | Context

# 동적 사이트맵 확인
curl -s https://context.soundbluemusic.com/api/sitemap.xml | head -20
# ✅ 모든 카테고리 사이트맵 링크 존재

# D1 데이터 확인
curl -s https://context.soundbluemusic.com/api/offline-db | head -10
# ✅ JSON 데이터 반환
```

---

## Phase 4: 패키지 정리

### 4.1 제거할 의존성

```bash
pnpm remove react-router react-router-dom @react-router/dev @react-router/cloudflare @react-router/node @react-router/serve -r
```

### 4.2 @soundblue/i18n 정리

**제거할 함수:**
- `extractStaticRoutes()` - 파일 기반 라우팅으로 불필요
- `generateI18nRoutes()` - prerender 설정 방식 변경

**유지할 함수:**
- `getLocaleFromPath()`
- `stripLocaleFromPath()`

### 4.3 @soundblue/seo 업데이트

**추가:**
- `headFactory()` - 정적 페이지용
- `dynamicHeadFactory()` - 동적 페이지용

**Deprecated (하위 호환성 유지):**
- `metaFactory()` → `headFactory()` 권장
- `dynamicMetaFactory()` → `dynamicHeadFactory()` 권장

---

## 최종 파일 구조

### Permissive
```
apps/permissive/
├── app.config.ts
├── vite.config.ts
├── wrangler.toml
├── package.json
└── app/
    └── routes/
        ├── __root.tsx
        ├── _index.tsx
        ├── libraries.tsx
        ├── web-api.tsx
        ├── built-with.tsx
        ├── sitemap.tsx
        ├── library/
        │   └── $slug.tsx
        ├── web-api/
        │   └── $slug.tsx
        ├── category/
        │   └── $categoryId.tsx
        ├── ko/
        │   ├── _index.tsx
        │   ├── libraries.tsx
        │   ├── web-api.tsx
        │   ├── built-with.tsx
        │   ├── sitemap.tsx
        │   ├── library/
        │   │   └── $slug.tsx
        │   ├── web-api/
        │   │   └── $slug.tsx
        │   └── category/
        │       └── $categoryId.tsx
        └── $.tsx
```

### Roots
```
apps/roots/
├── app.config.ts
├── vite.config.ts
├── wrangler.toml
├── package.json
└── app/
    └── routes/
        ├── __root.tsx
        ├── _index.tsx
        ├── browse.tsx
        ├── search.tsx
        ├── favorites.tsx
        ├── constants.tsx
        ├── about.tsx
        ├── built-with.tsx
        ├── sitemap.tsx
        ├── concept/
        │   └── $conceptId.tsx
        ├── field/
        │   └── $fieldId.tsx
        ├── ko/
        │   ├── _index.tsx
        │   ├── browse.tsx
        │   ├── search.tsx
        │   ├── favorites.tsx
        │   ├── constants.tsx
        │   ├── about.tsx
        │   ├── built-with.tsx
        │   ├── sitemap.tsx
        │   ├── concept/
        │   │   └── $conceptId.tsx
        │   └── field/
        │       └── $fieldId.tsx
        └── $.tsx
```

### Context
```
apps/context/
├── app.config.ts
├── vite.config.ts
├── wrangler.toml
├── package.json
└── app/
    └── routes/
        ├── __root.tsx
        ├── _index.tsx
        ├── browse.tsx
        ├── my-learning.tsx
        ├── bookmarks.tsx
        ├── about.tsx
        ├── sitemap.tsx
        ├── privacy.tsx
        ├── terms.tsx
        ├── license.tsx
        ├── built-with.tsx
        ├── download.tsx
        ├── entry/
        │   └── $entryId.tsx
        ├── category/
        │   └── $categoryId.tsx
        ├── conversations/
        │   ├── _index.tsx
        │   └── $categoryId.tsx
        ├── ko/
        │   ├── _index.tsx
        │   ├── browse.tsx
        │   ├── my-learning.tsx
        │   ├── bookmarks.tsx
        │   ├── about.tsx
        │   ├── sitemap.tsx
        │   ├── privacy.tsx
        │   ├── terms.tsx
        │   ├── license.tsx
        │   ├── built-with.tsx
        │   ├── download.tsx
        │   ├── entry/
        │   │   └── $entryId.tsx
        │   ├── category/
        │   │   └── $categoryId.tsx
        │   └── conversations/
        │       ├── _index.tsx
        │       └── $categoryId.tsx
        ├── api/
        │   ├── sitemap.xml.tsx
        │   ├── sitemap-pages.xml.tsx
        │   ├── sitemap-categories.xml.tsx
        │   ├── sitemap-entry.$categoryId.xml.tsx
        │   └── offline-db.tsx
        └── $.tsx
```

---

## 체크리스트

### Phase 0: 사전 준비
- [ ] TanStack 패키지 설치
- [ ] @soundblue/seo에 headFactory 추가

### Phase 1: Permissive
- [ ] app.config.ts 생성
- [ ] vite.config.ts 업데이트
- [ ] __root.tsx 생성
- [ ] 10개 라우트 파일 변환 (영어 + 한글 = 20개)
- [ ] 로컬 테스트
- [ ] 배포 및 검증

### Phase 2: Roots
- [ ] app.config.ts 생성
- [ ] vite.config.ts 업데이트
- [ ] __root.tsx 생성
- [ ] 11개 라우트 파일 변환 (영어 + 한글 = 22개)
- [ ] JSON-LD 구조화 데이터 유지 확인
- [ ] 로컬 테스트
- [ ] 배포 및 검증

### Phase 3: Context
- [ ] app.config.ts 생성
- [ ] vite.config.ts 업데이트
- [ ] __root.tsx 생성
- [ ] 22개 라우트 파일 변환
- [ ] D1 바인딩 접근 방식 변환 (createServerFn)
- [ ] 동적 사이트맵 API 라우트 변환
- [ ] 로컬 테스트 (D1 로컬 바인딩)
- [ ] 배포 및 검증

### Phase 4: 정리
- [ ] React Router 의존성 제거
- [ ] @soundblue/i18n 불필요 함수 제거
- [ ] 문서 업데이트 (CLAUDE.md, ARCHITECTURE.md)

---

## 롤백 계획

각 앱별로 이전 Workers 버전을 30일간 유지합니다.

```bash
# 문제 발생 시 롤백
wrangler rollback --env production
```

---

## 예상 수정 파일 수

| Phase | 파일 수 |
|-------|---------|
| Phase 0 | ~5개 |
| Phase 1 (Permissive) | ~25개 |
| Phase 2 (Roots) | ~30개 |
| Phase 3 (Context) | ~50개 |
| Phase 4 (정리) | ~10개 |
| **총계** | **~120개** |
