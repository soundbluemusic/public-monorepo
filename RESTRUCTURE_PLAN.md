# Soundblue Monorepo 완벽 재설계 실행 계획

> **목표**: 현재 77MB 모노레포를 계층화된 아키텍처로 재구성하여 유지보수성, 확장성, 테스트 용이성 확보

---

## 현황 분석 요약

### 현재 구조
```
soundblue-monorepo/ (77.3 MB)
├── packages/
│   ├── shared/           (148 KB) - 유틸, DB, i18n, 검색
│   └── shared-react/     (212 KB) - 16개 컴포넌트, 7개 훅
├── apps/
│   ├── context/          (16 MB, 27 라우트, 1578 SSG 페이지)
│   ├── roots/            (54 MB, 19 라우트, 878 SSG 페이지)
│   └── permissive/       (7 MB, 9 라우트, 8 SSG 페이지)
```

### 주요 문제점
| 문제 | 현황 | 영향 |
|------|------|------|
| 라우트 이중화 | 55개 (영문 + 한국어 별도 파일) | 유지보수 부담 |
| TS 데이터 파일 | 53개 (Roots 51 + Permissive 2) | JSON으로 표준화 필요 |
| i18n 중복 | 4,800줄 x 3개 앱 | 거의 동일한 코드 |
| 패키지 책임 불명확 | 2개 패키지에 모든 것 | 계층 분리 필요 |

---

## 목표 구조

```
soundblue-monorepo/
│
├── 📁 packages/                    # 계층화된 패키지 (Layer 0-4)
│   ├── 📁 core/                    # Layer 0: 순수 함수
│   │   ├── utils/                  # cn(), debounce(), etc.
│   │   ├── validation/             # Zod 스키마
│   │   └── types/                  # 공유 타입
│   │
│   ├── 📁 data/                    # Layer 1: 데이터 레이어
│   │   ├── schemas/                # JSON Schema + Zod
│   │   ├── loaders/                # createDataLoader 패턴
│   │   └── transformers/           # 데이터 변환 파이프라인
│   │
│   ├── 📁 search/                  # Layer 2: 검색 엔진
│   │   ├── core/                   # MiniSearch 래퍼
│   │   ├── worker/                 # Web Worker
│   │   └── adapters/               # 앱별 어댑터
│   │
│   ├── 📁 i18n/                    # Layer 2: 국제화
│   │   ├── core/                   # Paraglide 설정
│   │   ├── messages/               # 공유 메시지
│   │   └── utils/                  # 언어 감지, 라우팅
│   │
│   ├── 📁 ui/                      # Layer 3: UI 컴포넌트
│   │   ├── primitives/             # Button, Input, etc.
│   │   ├── patterns/               # Card, List, etc.
│   │   └── layout/                 # AppShell, Header, etc.
│   │
│   └── 📁 features/                # Layer 4: 기능 모듈
│       ├── favorites/              # 즐겨찾기
│       ├── offline/                # 오프라인 지원
│       └── study-progress/         # 학습 진도
│
├── 📁 data/                        # 데이터 중앙화 (JSON only)
│   ├── 📁 context/                 # 사전 항목
│   ├── 📁 roots/                   # 수학 개념
│   └── 📁 permissive/              # 라이브러리/API
│
├── 📁 apps/                        # 앱은 조립만
│   ├── 📁 context/                 # 6개 라우트 (현재 27개)
│   ├── 📁 permissive/              # 4개 라우트 (현재 9개)
│   └── 📁 roots/                   # 6개 라우트 (현재 19개)
│
├── 📁 scripts/                     # 빌드/검증 도구
│   ├── prebuild/                   # 데이터 전처리
│   └── generators/                 # 타입/인덱스 생성
│
└── 📁 tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 실행 계획

### Phase 1: 데이터 분리 및 표준화

**목표**: 모든 데이터를 JSON으로 표준화하고 중앙 `data/` 폴더로 이동

#### 1.1 Zod 스키마 정의 (packages/data/schemas/)

```typescript
// packages/data/schemas/context.ts
import { z } from 'zod';

export const ExampleSchema = z.object({
  korean: z.string().min(1),
  english: z.string().min(1),
  romanization: z.string().optional(),
  audioUrl: z.string().url().optional(),
});

export const EntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  korean: z.string().min(1),
  english: z.string().min(1),
  category: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  examples: z.array(ExampleSchema).min(1),
  relatedEntries: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

// packages/data/schemas/roots.ts
export const ConceptSchema = z.object({
  id: z.string(),
  name: z.object({
    ko: z.string(),
    en: z.string(),
  }),
  field: z.string(),
  subfield: z.string().optional(),
  difficulty: z.enum(['basic', 'intermediate', 'advanced', 'research']),
  content: z.object({
    ko: z.object({
      definition: z.string(),
      formulas: z.array(z.string()).optional(),
      examples: z.array(z.string()).optional(),
    }),
    en: z.object({
      definition: z.string(),
      formulas: z.array(z.string()).optional(),
      examples: z.array(z.string()).optional(),
    }),
  }),
});

// packages/data/schemas/permissive.ts
export const LibrarySchema = z.object({
  name: z.string(),
  description: z.string(),
  descriptionKo: z.string(),
  category: z.string(),
  license: z.string(),
  github: z.string().url(),
  website: z.string().url().optional(),
  npm: z.string().optional(),
  stars: z.number().optional(),
  tags: z.array(z.string()).optional(),
});
```

#### 1.2 Roots 데이터 변환 (TS → JSON)

**대상**: `apps/roots/app/data/concepts/*.ts` (51개 파일, 26,968줄)

```bash
# 변환 스크립트
scripts/migrate/convert-roots-data.ts
```

```typescript
// scripts/migrate/convert-roots-data.ts
import { glob } from 'glob';
import { writeFile, mkdir } from 'fs/promises';
import { dirname, basename } from 'path';

async function convertRootsData() {
  const conceptFiles = await glob('apps/roots/app/data/concepts/*.ts');

  await mkdir('data/roots/concepts', { recursive: true });

  for (const file of conceptFiles) {
    const module = await import(file);
    const concepts = module.default || module[Object.keys(module)[0]];

    const outputPath = `data/roots/concepts/${basename(file, '.ts')}.json`;
    await writeFile(outputPath, JSON.stringify(concepts, null, 2));

    console.log(`✓ ${basename(file)} → ${outputPath}`);
  }
}
```

#### 1.3 데이터 폴더 구조

```
data/
├── context/
│   ├── entries/
│   │   ├── greetings.json
│   │   ├── food.json
│   │   └── ... (21개 파일, apps/context/app/data/entries/에서 이동)
│   ├── categories.json
│   └── conversations.json
│
├── roots/
│   ├── concepts/
│   │   ├── algebra.json
│   │   ├── analysis.json
│   │   └── ... (51개 파일, 변환됨)
│   ├── fields.json
│   └── subfields.json
│
└── permissive/
    ├── libraries.json
    └── web-apis.json
```

#### 1.4 타입 자동 생성

```typescript
// scripts/generators/generate-types.ts
import { zodToTs, printNode } from 'zod-to-ts';
import { EntrySchema, ConceptSchema, LibrarySchema } from '@soundblue/data/schemas';

// Zod → TypeScript 타입 자동 생성
const { node: EntryType } = zodToTs(EntrySchema, 'Entry');
const { node: ConceptType } = zodToTs(ConceptSchema, 'MathConcept');
const { node: LibraryType } = zodToTs(LibrarySchema, 'Library');

// generated/types.ts로 출력
```

**작업 목록**:
| 작업 | 파일 | 예상 변경 |
|------|------|----------|
| Zod 스키마 정의 | `packages/data/schemas/*.ts` | 신규 3개 |
| Roots TS → JSON | 51개 파일 | 26,968줄 변환 |
| Context JSON 이동 | 21개 파일 | 위치 변경 |
| Permissive TS → JSON | 2개 파일 | 변환 |
| 타입 생성기 | `scripts/generators/generate-types.ts` | 신규 |

---

### Phase 2: Core 패키지 분리

**목표**: `@soundblue/shared`를 계층별 패키지로 분리

#### 2.1 packages/core 생성

```
packages/core/
├── package.json
├── src/
│   ├── index.ts
│   ├── utils/
│   │   ├── cn.ts              (클래스 병합)
│   │   ├── debounce.ts
│   │   ├── throttle.ts
│   │   └── index.ts
│   ├── validation/
│   │   ├── limits.ts          (LIMITS 상수)
│   │   ├── reserved.ts        (RESERVED_NAMES)
│   │   └── index.ts
│   └── types/
│       ├── common.ts          (Language, Theme, etc.)
│       └── index.ts
```

#### 2.2 packages/data 생성

```
packages/data/
├── package.json
├── src/
│   ├── index.ts
│   ├── schemas/               (Phase 1에서 생성)
│   │   ├── context.ts
│   │   ├── roots.ts
│   │   └── permissive.ts
│   ├── loaders/
│   │   ├── createDataLoader.ts
│   │   ├── createStaticPaths.ts
│   │   └── index.ts
│   └── transformers/
│       ├── addSearchableText.ts
│       ├── generateSlug.ts
│       └── index.ts
```

#### 2.3 packages/search 분리

```
packages/search/
├── package.json
├── src/
│   ├── index.ts
│   ├── core/
│   │   ├── engine.ts          (SearchEngine 클래스)
│   │   └── types.ts
│   ├── worker/
│   │   └── search.worker.ts   (shared-react에서 이동)
│   ├── adapters/
│   │   ├── context.ts
│   │   ├── roots.ts
│   │   └── permissive.ts
│   └── react/
│       ├── useSearch.ts       (shared-react에서 이동)
│       └── SearchProvider.tsx
```

#### 2.4 packages/i18n 분리

```
packages/i18n/
├── package.json
├── src/
│   ├── index.ts
│   ├── core/
│   │   ├── config.ts          (SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE)
│   │   └── paraglide.ts
│   ├── utils/
│   │   ├── routing.ts         (extractLanguageFromPath, localizedPath)
│   │   ├── detection.ts       (언어 감지)
│   │   └── index.ts
│   ├── messages/
│   │   ├── shared.json        (공통 메시지)
│   │   └── index.ts
│   └── react/
│       ├── I18nProvider.tsx
│       ├── useI18n.ts
│       └── LanguageContext.tsx
```

#### 2.5 의존성 방향

```
Layer 4: features     → ui, search, i18n, data, core
Layer 3: ui           → i18n, core
Layer 2: search, i18n → data, core
Layer 1: data         → core
Layer 0: core         → (외부 라이브러리만)
```

**작업 목록**:
| 작업 | 현재 위치 | 신규 위치 |
|------|----------|----------|
| cn(), utils | `shared/src/` | `packages/core/utils/` |
| constants | `shared/src/constants.ts` | `packages/core/validation/` |
| search engine | `shared-react/workers/` | `packages/search/` |
| i18n utils | `shared/src/i18n/` | `packages/i18n/` |
| I18nProvider | 각 앱 `app/i18n/` | `packages/i18n/react/` |

---

### Phase 3: UI 패키지 재구성

**목표**: `@soundblue/shared-react` 컴포넌트를 계층화

#### 3.1 packages/ui 구조

```
packages/ui/
├── package.json
├── src/
│   ├── index.ts
│   ├── primitives/            # 기본 요소
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Skeleton.tsx
│   │   └── index.ts
│   │
│   ├── patterns/              # 조합 패턴
│   │   ├── Card.tsx
│   │   ├── List.tsx
│   │   ├── SearchBox.tsx
│   │   ├── EntryListItem.tsx
│   │   ├── Toast.tsx
│   │   └── index.ts
│   │
│   ├── layout/                # 레이아웃
│   │   ├── AppShell.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   └── index.ts
│   │
│   └── feedback/              # 피드백
│       ├── ErrorBoundary.tsx
│       ├── LazyLoad.tsx
│       ├── OfflineIndicator.tsx
│       └── index.ts
```

#### 3.2 컴포넌트 이동 매핑

| 현재 (shared-react) | 신규 (ui) |
|--------------------|-----------|
| `DarkModeToggle.tsx` | `primitives/DarkModeToggle.tsx` |
| `LanguageToggle.tsx` | `primitives/LanguageToggle.tsx` |
| `Skeleton.tsx` | `primitives/Skeleton.tsx` |
| `EntryListItem.tsx` | `patterns/EntryListItem.tsx` |
| `SearchDropdown.tsx` | `patterns/SearchDropdown.tsx` |
| `ShareButton.tsx` | `patterns/ShareButton.tsx` |
| `Toast.tsx` | `patterns/Toast.tsx` |
| `ErrorBoundary.tsx` | `feedback/ErrorBoundary.tsx` |
| `LazyLoad.tsx` | `feedback/LazyLoad.tsx` |
| `OfflineIndicator.tsx` | `feedback/OfflineIndicator.tsx` |
| `ViewTransitionLink.tsx` | `patterns/ViewTransitionLink.tsx` |

#### 3.3 packages/features 생성

```
packages/features/
├── package.json
├── src/
│   ├── index.ts
│   ├── favorites/
│   │   ├── store.ts           (Zustand)
│   │   ├── hooks.ts           (useFavorites)
│   │   ├── FavoriteButton.tsx
│   │   └── index.ts
│   │
│   ├── offline/
│   │   ├── store.ts
│   │   ├── hooks.ts           (useOnlineStatus 이동)
│   │   └── index.ts
│   │
│   └── study-progress/
│       ├── store.ts
│       ├── hooks.ts
│       └── index.ts
```

**작업 목록**:
| 작업 | 영향 파일 |
|------|----------|
| ui 패키지 생성 | 신규 |
| 컴포넌트 이동 | 16개 |
| features 패키지 생성 | 신규 |
| 훅 이동 | 7개 |
| import 경로 업데이트 | 모든 앱 |

---

### Phase 4: 라우트 통합

**목표**: `($lang)` 패턴으로 라우트 파일 50% 감소

#### 4.1 라우트 패턴 변경

**현재** (영문/한국어 별도):
```
app/routes/
├── _index.tsx
├── entry.$entryId.tsx
├── ko._index.tsx
├── ko.entry.$entryId.tsx
└── $.tsx
```

**변경 후** (`($lang)` 선택적 세그먼트):
```
app/routes/
├── ($lang)._index.tsx
├── ($lang).entry.$entryId.tsx
├── ($lang).category.$categoryId.tsx
├── ($lang).browse.tsx
├── ($lang).about.tsx
└── $.tsx
```

#### 4.2 라우트별 로더 패턴

```typescript
// packages/data/loaders/createDataLoader.ts
import type { LoaderFunction } from 'react-router';
import { redirect } from 'react-router';

interface LoaderConfig<T> {
  getData: (id: string, lang: string) => Promise<T | null>;
  notFoundRedirect?: string;
}

export function createDataLoader<T>(config: LoaderConfig<T>) {
  const loader: LoaderFunction = async ({ params }) => {
    const lang = params.lang || 'en';
    const id = params.id;

    if (!id) {
      throw new Response('Not Found', { status: 404 });
    }

    const data = await config.getData(id, lang);

    if (!data) {
      if (config.notFoundRedirect) {
        return redirect(config.notFoundRedirect);
      }
      throw new Response('Not Found', { status: 404 });
    }

    return { data, lang };
  };

  return { loader };
}
```

#### 4.3 앱별 라우트 수 변화

| 앱 | 현재 | 변경 후 | 감소율 |
|----|------|---------|--------|
| Context | 27개 | 6개 | 78% |
| Roots | 19개 | 6개 | 68% |
| Permissive | 9개 | 4개 | 56% |
| **합계** | **55개** | **16개** | **71%** |

#### 4.4 Context 앱 라우트 (변경 후)

```
apps/context/app/routes/
├── ($lang)._index.tsx          # 홈
├── ($lang).entry.$entryId.tsx  # 항목 상세
├── ($lang).category.$categoryId.tsx  # 카테고리
├── ($lang).conversations.tsx   # 대화
├── ($lang).browse.tsx          # 탐색
├── ($lang).about.tsx           # 소개
└── $.tsx                       # 404 catch-all
```

**작업 목록**:
| 작업 | 앱 | 파일 변경 |
|------|-----|----------|
| 라우트 병합 | Context | 27 → 6 |
| 라우트 병합 | Roots | 19 → 6 |
| 라우트 병합 | Permissive | 9 → 4 |
| createDataLoader 적용 | 모든 앱 | 로더 표준화 |
| prerender() 업데이트 | 모든 앱 | 경로 생성 로직 |

---

### Phase 5: 빌드 파이프라인 개선

**목표**: 데이터 검증 → 변환 → 최적화 → 출력 파이프라인

#### 5.1 Prebuild 파이프라인

```typescript
// scripts/prebuild/pipeline.ts
interface PipelineConfig {
  app: string;
  source: string;
  schema: z.ZodSchema;
  transforms: Transform[];
  outputs: OutputConfig[];
}

const contextPipeline: PipelineConfig = {
  app: 'context',
  source: 'data/context/entries/**/*.json',
  schema: EntrySchema,
  transforms: [
    addSearchableText,
    generateSlug,
    attachCategoryMetadata,
  ],
  outputs: [
    { type: 'chunked', strategy: 'byInitialConsonant', dir: 'public/data/chunks' },
    { type: 'index', format: 'trie', output: 'public/data/search-index.json' },
    { type: 'types', output: 'app/generated/types.ts' },
  ],
};

async function runPipeline(config: PipelineConfig) {
  console.log(`\n📦 Building ${config.app}...`);

  // 1. 로드
  const raw = await loadGlob(config.source);
  console.log(`  ✓ Loaded ${raw.length} items`);

  // 2. 검증
  const validated = config.schema.array().parse(raw);
  console.log(`  ✓ Validated all items`);

  // 3. 변환
  const transformed = config.transforms.reduce(
    (data, fn) => fn(data),
    validated
  );
  console.log(`  ✓ Applied ${config.transforms.length} transforms`);

  // 4. 출력
  for (const output of config.outputs) {
    await generateOutput(transformed, output);
    console.log(`  ✓ Generated ${output.type}`);
  }
}
```

#### 5.2 SSG 최적화

```typescript
// scripts/prebuild/ssg-optimizer.ts
interface SSGConfig {
  app: string;
  routes: RouteConfig[];
  chunkSize: number;
  parallel: number;
}

async function optimizedPrerender(config: SSGConfig) {
  const allPaths: string[] = [];

  for (const route of config.routes) {
    const paths = await route.getStaticPaths();
    allPaths.push(...paths);
  }

  // 병렬 청크 처리
  const chunks = chunkArray(allPaths, config.chunkSize);

  for (let i = 0; i < chunks.length; i += config.parallel) {
    const batch = chunks.slice(i, i + config.parallel);
    await Promise.all(batch.map(chunk => prerenderChunk(chunk)));

    const progress = ((i + config.parallel) / chunks.length) * 100;
    console.log(`  SSG: ${Math.min(100, progress).toFixed(1)}%`);
  }

  return allPaths;
}
```

#### 5.3 스크립트 구조

```
scripts/
├── prebuild/
│   ├── pipeline.ts           # 데이터 파이프라인
│   ├── ssg-optimizer.ts      # SSG 최적화
│   └── index.ts
│
├── generators/
│   ├── generate-types.ts     # Zod → TS 타입
│   ├── generate-sitemap.ts   # 사이트맵
│   └── generate-search-index.ts
│
├── migrate/
│   ├── convert-roots-data.ts # Roots TS → JSON
│   └── update-imports.ts     # import 경로 업데이트
│
└── postbuild/
    ├── verify-ssg.ts         # SSG 검증
    └── check-links.ts        # 링크 검증
```

**작업 목록**:
| 작업 | 설명 |
|------|------|
| 파이프라인 구축 | 검증 → 변환 → 출력 |
| SSG 최적화 | 병렬 처리 + 우선순위 |
| 타입 생성기 | Zod → TypeScript |
| 마이그레이션 스크립트 | import 경로 자동 업데이트 |

---

## 실행 일정

### Week 1: 데이터 분리

| 일 | 작업 | 완료 기준 |
|---|------|----------|
| Day 1-2 | Zod 스키마 정의 | 3개 스키마 (context, roots, permissive) |
| Day 3-4 | Roots TS → JSON 변환 | 51개 파일 JSON 변환 |
| Day 5-6 | 데이터 폴더 구조화 | `data/` 폴더 완성 |
| Day 7 | 타입 생성기 | 자동 타입 생성 동작 |

### Week 2: Core 패키지 분리

| 일 | 작업 | 완료 기준 |
|---|------|----------|
| Day 1-2 | packages/core 생성 | utils, validation, types 분리 |
| Day 3-4 | packages/data 생성 | schemas, loaders 분리 |
| Day 5-6 | packages/search 분리 | 검색 엔진 + worker 분리 |
| Day 7 | packages/i18n 분리 | i18n 통합 |

### Week 3: UI 및 Features

| 일 | 작업 | 완료 기준 |
|---|------|----------|
| Day 1-3 | packages/ui 재구성 | primitives, patterns, layout |
| Day 4-5 | packages/features 생성 | favorites, offline, study-progress |
| Day 6-7 | import 경로 업데이트 | 모든 앱 빌드 성공 |

### Week 4: 라우트 통합 및 최적화

| 일 | 작업 | 완료 기준 |
|---|------|----------|
| Day 1-2 | Context 라우트 병합 | 27 → 6개 |
| Day 3-4 | Roots/Permissive 병합 | 28 → 10개 |
| Day 5-6 | 빌드 파이프라인 | prebuild 자동화 |
| Day 7 | 테스트 및 검증 | 모든 CI 통과 |

---

## 마이그레이션 체크리스트

### Phase 1 완료 조건
- [ ] `packages/data/schemas/` 생성 및 Zod 스키마 정의
- [ ] `data/` 폴더 생성 및 모든 JSON 데이터 이동
- [ ] Roots 51개 TS 파일 → JSON 변환
- [ ] Permissive 2개 TS 파일 → JSON 변환
- [ ] 타입 자동 생성 스크립트 동작

### Phase 2 완료 조건
- [ ] `packages/core` 생성 (utils, validation, types)
- [ ] `packages/data` 생성 (schemas, loaders, transformers)
- [ ] `packages/search` 분리 (core, worker, adapters)
- [ ] `packages/i18n` 분리 (core, utils, react)
- [ ] 기존 `@soundblue/shared` deprecated 또는 제거

### Phase 3 완료 조건
- [ ] `packages/ui` 생성 (primitives, patterns, layout, feedback)
- [ ] `packages/features` 생성 (favorites, offline, study-progress)
- [ ] 기존 `@soundblue/shared-react` deprecated 또는 제거
- [ ] 모든 앱 import 경로 업데이트

### Phase 4 완료 조건
- [ ] `($lang)` 라우트 패턴 적용
- [ ] Context 27 → 6 라우트
- [ ] Roots 19 → 6 라우트
- [ ] Permissive 9 → 4 라우트
- [ ] SSG prerender() 업데이트

### Phase 5 완료 조건
- [ ] prebuild 파이프라인 자동화
- [ ] SSG 병렬 빌드 최적화
- [ ] 모든 CI 검증 통과
- [ ] 문서 업데이트 (CLAUDE.md, README.md)

---

## 예상 결과

| 항목 | 현재 | 변경 후 | 개선 |
|------|------|---------|------|
| 패키지 수 | 2개 | 6개 | 명확한 책임 분리 |
| 라우트 파일 | 55개 | 16개 | 71% 감소 |
| TS 데이터 파일 | 53개 | 0개 | JSON 표준화 |
| i18n 중복 | 14,400줄 | ~500줄 | 97% 감소 |
| 코드 재사용성 | 낮음 | 높음 | 계층별 import |
| 테스트 용이성 | 낮음 | 높음 | 독립적 단위 테스트 |
| 빌드 시간 | 100% | ~60% | 병렬 처리 |

---

## 위험 요소 및 대응

| 위험 | 영향 | 대응 |
|------|------|------|
| import 경로 대량 변경 | 빌드 실패 | 자동화 스크립트 + 점진적 적용 |
| 데이터 변환 오류 | 런타임 에러 | Zod 검증 + 타입 생성 |
| SSG 경로 누락 | 404 에러 | prerender() 검증 테스트 |
| 기존 기능 회귀 | 사용자 불편 | E2E 테스트 강화 |

---

## 다음 단계

이 계획을 승인하시면:

1. **Phase 1 시작**: Zod 스키마 정의 및 데이터 변환
2. **브랜치 전략**: `feature/restructure-phase-1` 생성
3. **점진적 마이그레이션**: 각 Phase 완료 후 main 병합

계획에 대한 피드백이나 우선순위 조정이 필요하시면 말씀해주세요.
