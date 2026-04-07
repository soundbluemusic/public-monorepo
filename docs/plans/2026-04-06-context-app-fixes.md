# Context App 품질 개선 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Context 앱의 검증된 12건의 문제(높음 4, 중간 5, 낮음 3)를 단일 브랜치에서 심각도 순서대로 수정

**Architecture:** D1 서버 함수 에러 처리 체계화, ETag 해시 개선, 하드코딩 폴백 제거, 캐시 LRU 전환, 불필요 의존성 정리. 모든 수정은 SSR + D1 아키텍처 유지.

**Tech Stack:** TanStack Start 1.157.2, Zod 4.x, Cloudflare Workers, D1

**Branch:** `fix/context-improvements`

---

## 높음 (HIGH) - 4건

### Task 1: D1 서버 함수 입력값 검증 (Zod)

**Files:**
- Modify: `apps/context/app/services/d1-server.ts:46-50,59,115,129-137,146,163,177,186,204,210`

**현재 문제:** 6개 `inputValidator`가 입력을 그대로 반환 (검증 없음)
```typescript
// 현재 (d1-server.ts:59)
.inputValidator((data: FetchEntryInput) => data)
```

**Step 1: 입력 타입을 Zod 스키마로 교체**

`d1-server.ts` 상단에 Zod import 추가 및 타입 정의를 스키마로 변환:

```typescript
import { z } from 'zod';

// 기존 type → Zod 스키마
const FetchEntryInputSchema = z.object({
  entryId: z.string().min(1).max(200),
  locale: z.enum(['en', 'ko']),
});

const FetchEntryIdsByCategoryInputSchema = z.object({
  categoryId: z.string().min(1).max(100),
});

const FetchEntriesByCategoryInputSchema = z.object({
  categoryId: z.string().min(1).max(100),
  locale: z.enum(['en', 'ko']),
});

const FetchEntriesByCategoryPaginatedInputSchema = z.object({
  categoryId: z.string().min(1).max(100),
  locale: z.enum(['en', 'ko']),
  page: z.number().int().min(1).max(10000),
  pageSize: z.number().int().min(1).max(100),
});

const FetchHomonymsInputSchema = z.object({
  korean: z.string().min(1).max(200),
});

const FetchEntriesByTagInputSchema = z.object({
  tag: z.string().min(1).max(200),
  locale: z.enum(['en', 'ko']),
});
```

**Step 2: inputValidator에 Zod 스키마 적용**

각 서버 함수의 `.inputValidator()` 교체:

```typescript
// fetchEntryFromD1 (line 59)
.inputValidator(FetchEntryInputSchema)

// fetchEntryIdsByCategoryFromD1 (line 115)
.inputValidator(FetchEntryIdsByCategoryInputSchema)

// fetchEntriesByCategoryFromD1 (line 146)
.inputValidator(FetchEntriesByCategoryInputSchema)

// fetchEntriesByCategoryPaginated (line 163)
.inputValidator(FetchEntriesByCategoryPaginatedInputSchema)

// fetchHomonyms (line 186)
.inputValidator(FetchHomonymsInputSchema)

// fetchEntriesByTagFromD1 (line 210)
.inputValidator(FetchEntriesByTagInputSchema)
```

**Step 3: 기존 type alias 제거**

`FetchEntryInput`, `FetchEntryIdsByCategoryInput`, `FetchEntriesByCategoryInput`, `FetchEntriesByCategoryPaginatedInput`, `FetchHomonymsInput`, `FetchEntriesByTagInput` 타입 정의 6개 제거 (Zod에서 추론).

**Step 4: 빌드 확인**

Run: `cd apps/context && pnpm typecheck`
Expected: 에러 없음

**Step 5: 커밋**

```bash
git add apps/context/app/services/d1-server.ts
git commit -m "fix(context): add Zod input validation to D1 server functions"
```

---

### Task 2: D1 실패와 빈 결과 구분

**Files:**
- Modify: `apps/context/app/services/d1-server.ts:60-70,78-89,97-106,114-126,145-157,162-174,185-197,209-221,226-235`

**현재 문제:** DB 에러 시 `null`/빈 배열 반환 → 클라이언트가 "데이터 없음"과 구분 못함

**접근 방식:** D1 미사용 시 에러를 throw하여 호출자가 에러를 인지할 수 있게 함. 에러를 throw하면 TanStack Start의 errorComponent가 에러 UI를 보여주므로, 사용자에게 명확한 피드백 제공.

**Step 1: D1 접근 실패 시 throw로 변경**

`getD1Database()` 함수(line 34-44) 수정:

```typescript
class D1UnavailableError extends Error {
  constructor() {
    super('D1 database is not available');
    this.name = 'D1UnavailableError';
  }
}

function getD1Database(): D1Database {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { env } = require('cloudflare:workers') as { env: { DB?: D1Database } };
    if (!env.DB) throw new D1UnavailableError();
    return env.DB;
  } catch (error) {
    if (error instanceof D1UnavailableError) throw error;
    console.error('[D1Server] Failed to access Cloudflare env:', error);
    throw new D1UnavailableError();
  }
}
```

**Step 2: 각 handler에서 null 체크 제거**

DB를 사용하는 모든 handler에서 `if (!db)` 블록 제거. `getD1Database()`가 throw하므로 불필요:

```typescript
// 변경 전 (line 60-70)
.handler(async ({ data }): Promise<LocaleEntry | null> => {
    const { entryId, locale } = data;
    const db = getD1Database();
    if (!db) {
      console.error('[fetchEntryFromD1] D1 database not available');
      return null;
    }
    return await getEntryByIdFromD1(db, entryId, locale);
  });

// 변경 후
.handler(async ({ data }): Promise<LocaleEntry | null> => {
    const { entryId, locale } = data;
    const db = getD1Database();
    return await getEntryByIdFromD1(db, entryId, locale);
  });
```

같은 패턴을 나머지 8개 handler에도 적용 (lines 78-89, 97-106, 114-126, 145-157, 162-174, 185-197, 209-221, 226-235).

**Step 3: 빌드 확인**

Run: `cd apps/context && pnpm typecheck`
Expected: 에러 없음

**Step 4: 커밋**

```bash
git add apps/context/app/services/d1-server.ts
git commit -m "fix(context): throw on D1 unavailability instead of silent empty returns"
```

---

### Task 3: ETag 충돌 해결

**Files:**
- Modify: `apps/context/app/server.ts:461-465`

**현재 문제:** `pathname.length`만 사용 → 길이 같은 다른 경로 충돌
```typescript
// 현재 (server.ts:461-465)
function generateETag(pathname: string): string {
  const etag = `"${CONTENT_LAST_MODIFIED}-${pathname.length}"`;
  return etag;
}
```

**Step 1: pathname 해시 기반 ETag 생성**

```typescript
function generateETag(pathname: string): string {
  // FNV-1a 32-bit hash for fast, low-collision hashing
  let hash = 0x811c9dc5;
  for (let i = 0; i < pathname.length; i++) {
    hash ^= pathname.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hashHex = (hash >>> 0).toString(16);
  return `"${CONTENT_LAST_MODIFIED}-${hashHex}"`;
}
```

**Step 2: 빌드 확인**

Run: `cd apps/context && pnpm typecheck`
Expected: 에러 없음

**Step 3: 커밋**

```bash
git add apps/context/app/server.ts
git commit -m "fix(context): use FNV-1a hash for ETag generation to prevent collisions"
```

---

### Task 4: 하드코딩 폴백값 제거

**Files:**
- Modify: `apps/context/app/routes/index.tsx:50-56`
- Modify: `apps/context/app/routes/ko/index.tsx:49-55`

**현재 문제:** D1 실패 시 `totalEntries = 16394` 하드코딩

**접근 방식:** Task 2에서 D1 미사용 시 throw하도록 변경했으므로, loader에서 try-catch로 감싸되 에러 상태를 명시적으로 전달. 하드코딩 폴백 대신 0으로 표시하고 에러 여부를 UI에 전달.

**Step 1: index.tsx loader 수정 (line 28-62)**

```typescript
interface LoaderData {
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalEntries: number;
  dbError: boolean;
}

export const Route = createFileRoute('/')({
  loader: async (): Promise<LoaderData> => {
    const categoryCounts: Record<string, number> = {};
    let totalEntries = 0;
    let dbError = false;

    try {
      const countsMap = await fetchEntryCountsFromD1();
      for (const [categoryId, count] of countsMap) {
        categoryCounts[categoryId] = count;
        totalEntries += count;
      }
    } catch (error) {
      console.error('[HomePage] fetchEntryCountsFromD1 failed:', error);
      dbError = true;
    }

    return {
      categories: allCategories,
      categoryCounts,
      totalEntries,
      dbError,
    };
  },
  // ... head, component 유지
```

**Step 2: 컴포넌트에서 dbError 표시 (index.tsx)**

`HomePage` 함수 내 loaderData 디스트럭처링에 `dbError` 추가:

```typescript
function HomePage() {
  const { categories: cats, categoryCounts, totalEntries, dbError } = Route.useLoaderData();
  const { locale, t, localePath } = useI18n();

  // ... 기존 코드 유지

  return (
    <Layout>
      {/* ... 기존 코드 */}

      {dbError && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200" role="alert">
          {locale === 'ko'
            ? '데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
            : 'There was a problem loading data. Please try again later.'}
        </div>
      )}

      {/* ... 나머지 기존 코드 */}
```

**Step 3: ko/index.tsx에도 동일 적용 (line 27-62)**

영문 index.tsx와 동일한 패턴으로 수정:
- `LoaderData`에 `dbError` 추가
- loader에서 하드코딩 폴백 제거, `dbError = true` 설정
- 컴포넌트에서 에러 배너 표시

**Step 4: 빌드 확인**

Run: `cd apps/context && pnpm typecheck`
Expected: 에러 없음

**Step 5: 커밋**

```bash
git add apps/context/app/routes/index.tsx apps/context/app/routes/ko/index.tsx
git commit -m "fix(context): remove hardcoded 16394 fallback, show explicit DB error state"
```

---

## 중간 (MEDIUM) - 5건

### Task 5: dailyWord를 loader로 이동 (CLS 해결)

**Files:**
- Modify: `apps/context/app/routes/index.tsx:108-142`
- Modify: `apps/context/app/routes/ko/index.tsx:91-124`
- Modify: `apps/context/app/services/d1-server.ts` (새 서버 함수 추가)

**현재 문제:** dailyWord가 클라이언트 useEffect로만 로딩 → CLS 발생

**접근 방식:** dailyWord를 createServerFn으로 서버에서 계산하고, loader에서 호출하여 SSR에 포함.

**Step 1: D1에서 dailyWord를 가져오는 서버 함수 추가 (d1-server.ts 하단)**

```typescript
/**
 * 오늘의 단어를 D1에서 로드하는 서버 함수
 * dayOfYear를 시드로 사용하여 매일 다른 단어 선택
 */
export const fetchDailyWordFromD1 = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ locale: z.enum(['en', 'ko']) }))
  .handler(async ({ data }): Promise<LocaleEntry | null> => {
    const db = getD1Database();
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
    );

    try {
      const { results } = await db
        .prepare('SELECT COUNT(*) as count FROM entries')
        .all<{ count: number }>();
      const totalCount = results[0]?.count ?? 0;
      if (totalCount === 0) return null;

      const offset = dayOfYear % totalCount;
      const entry = await db
        .prepare('SELECT * FROM entries LIMIT 1 OFFSET ?')
        .bind(offset)
        .first();

      if (!entry) return null;

      // entry-converter를 사용하여 LocaleEntry로 변환
      const { rowToLocaleEntry } = await import('./entry-converter');
      return rowToLocaleEntry(entry, data.locale);
    } catch (error) {
      console.error('[fetchDailyWordFromD1] Failed:', error);
      return null;
    }
  });
```

**Step 2: index.tsx loader에서 dailyWord 로드**

loader를 수정하여 `fetchDailyWordFromD1` 호출:

```typescript
interface LoaderData {
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalEntries: number;
  dbError: boolean;
  dailyWord: LocaleEntry | null;
}

// loader 내부에 추가 (try 블록 뒤):
const dailyWord = await fetchDailyWordFromD1({ data: { locale: 'en' } }).catch(() => null);

return {
  categories: allCategories,
  categoryCounts,
  totalEntries,
  dbError,
  dailyWord,
};
```

**Step 3: 클라이언트 useEffect 제거**

index.tsx에서 다음 코드 제거:
- `useState<MeaningEntry | null>(null)` (line 109)
- `useEffect` 전체 (lines 112-142)
- `getEntryById`, `LightEntry` import

대신 loaderData에서 직접 사용:
```typescript
const { categories: cats, categoryCounts, totalEntries, dbError, dailyWord } = Route.useLoaderData();
```

**Step 4: ko/index.tsx에도 동일 적용**

- `isClient` state 제거 (line 92)
- `useEffect` 2개 제거 (lines 94-96, 98-124)
- loader에서 `fetchDailyWordFromD1({ data: { locale: 'ko' } })` 호출

**Step 5: 불필요한 import 정리**

양쪽 파일에서 사용하지 않게 된 import 제거:
- `getEntryById`, `LightEntry` from `@/data/entries`
- `MeaningEntry` from `@/data/types` (dailyWord가 LocaleEntry 타입이므로)

> 주의: dailyWord 컴포넌트 렌더링부도 LocaleEntry 타입에 맞게 프로퍼티 접근 수정 필요. `dailyWord.translations[locale].word` → `dailyWord.translation.word` 등.

**Step 6: 빌드 확인**

Run: `cd apps/context && pnpm typecheck`
Expected: 에러 없음

**Step 7: 커밋**

```bash
git add apps/context/app/services/d1-server.ts apps/context/app/routes/index.tsx apps/context/app/routes/ko/index.tsx
git commit -m "fix(context): move dailyWord to loader for SSR, eliminate CLS"
```

---

### Task 6: CONTENT_LAST_MODIFIED 자동화

**Files:**
- Modify: `apps/context/app/server.ts:17`

**현재 문제:** `'2026-01-25'` 수동 관리 필요

**접근 방식:** 빌드 타임스탬프를 Vite define으로 주입. D1의 최종 수정일은 런타임에 쿼리해야 하므로, 빌드 날짜를 기본값으로 사용.

**Step 1: vite.config.ts에 빌드 타임스탬프 define 추가**

`apps/context/vite.config.ts` 수정:

```typescript
export default defineConfig({
  server: { port: appPorts.context },
  preview: { port: appPorts.context },
  ...config,
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().split('T')[0]),
  },
  plugins: [
    // ... 기존 플러그인
  ],
});
```

**Step 2: server.ts에서 빌드 타임스탬프 사용**

```typescript
// 변경 전 (server.ts:17)
const CONTENT_LAST_MODIFIED = '2026-01-25';

// 변경 후
declare const __BUILD_DATE__: string;
const CONTENT_LAST_MODIFIED = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : new Date().toISOString().split('T')[0];
```

**Step 3: 빌드 확인**

Run: `cd apps/context && pnpm typecheck`
Expected: 에러 없음

**Step 4: 커밋**

```bash
git add apps/context/vite.config.ts apps/context/app/server.ts
git commit -m "fix(context): auto-generate CONTENT_LAST_MODIFIED from build timestamp"
```

---

### Task 7: 캐시 FIFO → LRU 전환

**Files:**
- Modify: `apps/context/app/services/cache.ts:11-14,34-45,50-65`

**현재 문제:** 가장 먼저 삽입된 항목 삭제 (FIFO) → 자주 접근되는 항목도 제거됨

**Step 1: CacheEntry에 lastAccessed 추가**

```typescript
interface CacheEntry<T> {
  value: T;
  expiry: number;
  lastAccessed: number;
}
```

**Step 2: getCached에서 lastAccessed 갱신**

```typescript
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  // LRU: 접근 시간 갱신
  entry.lastAccessed = Date.now();
  return entry.value as T;
}
```

**Step 3: setCached에서 LRU 제거로 변경**

```typescript
export function setCached<T>(key: string, value: T, ttlMs = CACHE_CONFIG.DEFAULT_TTL_MS): void {
  if (cache.size >= CACHE_CONFIG.MAX_ENTRIES) {
    cleanupExpired();
    // LRU: 가장 오래 접근되지 않은 항목 제거
    if (cache.size >= CACHE_CONFIG.MAX_ENTRIES) {
      let oldestKey: string | undefined;
      let oldestTime = Number.POSITIVE_INFINITY;
      for (const [key, entry] of cache.entries()) {
        if (entry.lastAccessed < oldestTime) {
          oldestTime = entry.lastAccessed;
          oldestKey = key;
        }
      }
      if (oldestKey) cache.delete(oldestKey);
    }
  }

  cache.set(key, {
    value,
    expiry: Date.now() + ttlMs,
    lastAccessed: Date.now(),
  });
}
```

**Step 4: 빌드 확인**

Run: `cd apps/context && pnpm typecheck`
Expected: 에러 없음

**Step 5: 커밋**

```bash
git add apps/context/app/services/cache.ts
git commit -m "fix(context): switch cache eviction from FIFO to LRU"
```

---

### Task 8: 사이트맵 JSON 파싱 에러 로깅

**Files:**
- Modify: `apps/context/app/server.ts:296-298`

**현재 문제:**
```typescript
} catch {
  // Skip invalid JSON
}
```

**Step 1: console.warn 추가**

```typescript
} catch (error) {
  console.warn(`[Sitemap] Invalid JSON in tags for entry: ${JSON.stringify(row.tags).slice(0, 100)}`, error);
}
```

**Step 2: 커밋**

```bash
git add apps/context/app/server.ts
git commit -m "fix(context): add warning log for invalid JSON in sitemap tag parsing"
```

---

### Task 9: ko/index.tsx isMounted 패턴 통일

**이 태스크는 Task 5에서 dailyWord를 loader로 이동하면 자동 해결됩니다.**
**Task 5 완료 후 별도 작업 불필요.**

---

## 낮음 (LOW) - 3건

### Task 10: 불필요한 의존성 제거

**Files:**
- Modify: `apps/context/package.json:49,55,56`
- Modify: `apps/context/vite.config.ts:9,27`

**Step 1: package.json에서 미사용 의존성 제거**

제거 대상:
- `"clsx": "^2.1.1"` (line 49) — `@soundblue/ui/utils`의 `cn` 사용 중
- `"vite-plugin-pwa": "^1.2.0"` (line 55) — PWA 비활성화 상태
- `"workbox-window": "^7.3.0"` (line 56) — PWA 비활성화 상태

**Step 2: vite.config.ts에서 VitePWA 플러그인 제거**

```typescript
// 제거할 import (line 9)
import { VitePWA } from 'vite-plugin-pwa';

// 제거할 plugin (line 27)
VitePWA({ disable: true }),
```

**Step 3: pnpm install로 lockfile 갱신**

Run: `cd /Volumes/X10\ Pro/monorepo-project/public-monorepo && pnpm install`

**Step 4: 빌드 확인**

Run: `cd apps/context && pnpm typecheck`
Expected: 에러 없음

**Step 5: 커밋**

```bash
git add apps/context/package.json apps/context/vite.config.ts pnpm-lock.yaml
git commit -m "chore(context): remove unused clsx, vite-plugin-pwa, workbox-window deps"
```

---

### Task 11: 페이지네이션 상한 검증

**Files:**
- Modify: `apps/context/app/routes/category/$categoryId.tsx:39,41-50`

**현재 문제:** `page=999999` 방어 없음

**Step 1: totalPages 계산 후 page 상한 적용**

loader 로직 수정:

```typescript
// 변경 전 (lines 38-51)
const searchParams = new URLSearchParams(location.search);
const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);

const { entries, totalCount } = await fetchEntriesByCategoryPaginated({
  data: { categoryId: params.categoryId, locale: 'en', page, pageSize: PAGE_SIZE },
});

return {
  category,
  entries,
  currentPage: page,
  totalCount,
  totalPages: Math.ceil(totalCount / PAGE_SIZE),
};

// 변경 후
const searchParams = new URLSearchParams(location.search);
const rawPage = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);

const { entries, totalCount } = await fetchEntriesByCategoryPaginated({
  data: { categoryId: params.categoryId, locale: 'en', page: rawPage, pageSize: PAGE_SIZE },
});

const totalPages = Math.ceil(totalCount / PAGE_SIZE);
const page = Math.min(rawPage, Math.max(1, totalPages));

return {
  category,
  entries,
  currentPage: page,
  totalCount,
  totalPages,
};
```

**Step 2: ko 버전 확인**

`apps/context/app/routes/ko/category/$categoryId.tsx`에도 동일 패턴이 있다면 같이 수정.

**Step 3: 빌드 확인**

Run: `cd apps/context && pnpm typecheck`
Expected: 에러 없음

**Step 4: 커밋**

```bash
git add apps/context/app/routes/category/\$categoryId.tsx apps/context/app/routes/ko/category/\$categoryId.tsx
git commit -m "fix(context): clamp pagination page to valid range"
```

---

### Task 12: 최종 빌드 검증 및 브랜치 정리

**Step 1: 전체 typecheck**

Run: `cd /Volumes/X10\ Pro/monorepo-project/public-monorepo && pnpm typecheck`
Expected: 에러 없음

**Step 2: lint 확인**

Run: `cd /Volumes/X10\ Pro/monorepo-project/public-monorepo && pnpm lint`
Expected: 에러 없음

**Step 3: Context 앱 빌드**

Run: `cd apps/context && pnpm build`
Expected: 빌드 성공

**Step 4: 변경 요약 표 작성**

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|------------|---------------|
| inputValidator | 입력 그대로 반환 | Zod 스키마 검증 | 잘못된 입력 차단 |
| D1 에러 처리 | 빈 데이터 반환 | throw D1UnavailableError | 에러/빈 결과 구분 |
| ETag | pathname.length 기반 | FNV-1a 해시 기반 | 충돌 방지 |
| 홈 폴백 | 16394 하드코딩 | dbError 상태 표시 | 하드코딩 제거 |
| dailyWord | 클라이언트 useEffect | loader SSR | CLS 제거 |
| CONTENT_LAST_MODIFIED | 수동 날짜 | 빌드 타임스탬프 | 자동화 |
| 캐시 제거 | FIFO | LRU | 효율 개선 |
| JSON 파싱 에러 | 무시 | console.warn | 데이터 품질 추적 |
| 불필요 의존성 | clsx, PWA 3개 | 제거 | 번들 최적화 |
| 페이지네이션 | 상한 없음 | Math.min 적용 | 비정상 요청 방어 |
