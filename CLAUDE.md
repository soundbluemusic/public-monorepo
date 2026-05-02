<!--
================================================================================
[EXTERNAL SOURCE - DO NOT MODIFY BY HAND]
Source: https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md
Raw:    https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md
Policy: 원문 그대로 유지 (verbatim). 어떤 수정도 금지.
        BEGIN/END 마커 사이는 scripts/sync-external-claude.sh가 자동 교체.
        업스트림 변경은 .github/workflows/sync-external-claude.yml이 매일 PR 생성.
================================================================================
-->
<!-- BEGIN-EXTERNAL-CLAUDE-MD -->
# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
<!-- END-EXTERNAL-CLAUDE-MD -->

---

# CLAUDE.md - AI Assistant Guidelines

> **프로젝트 정보**: @README.md | **아키텍처**: @ARCHITECTURE.md

---

## ⛔ 절대 금지 (DO NOT)

### 1. SPA 모드 전환 절대 금지 (SSR 전용)

> ⚠️ **SEO 필수**: 이 프로젝트의 모든 페이지는 검색 엔진이 완전한 HTML을 크롤링할 수 있어야 합니다.
> SPA는 빈 HTML을 반환하여 SEO가 불가능합니다. 절대 SPA로 전환하지 마세요.

**현재 배포 모드:**

| App | Mode | 데이터 소스 | D1 바인딩 | 설정 파일 |
| :-- | :--- | :---------- | :-------- | :-------- |
| Context | **SSR** | Cloudflare D1 | `DB` (context-db), `PRIVATE_DB` (private) | `wrangler.toml` |
| Permissive | SSR | Cloudflare D1 | `KNOWLEDGE_DB` (knowledge), `PRIVATE_DB` (private) | `wrangler.toml` |
| Roots | SSR | Cloudflare D1 | `KNOWLEDGE_DB` (knowledge), `PRIVATE_DB` (private) | `wrangler.toml` |

**금지 사항:**

- SPA 모드 전환 금지 (클라이언트 사이드 렌더링만으로 콘텐츠 생성 금지)
- 빈 `<div id="root"></div>` HTML 금지
- `loader` 없는 동적 라우트 금지 (SEO 데이터 누락)
- Context 앱: D1 바인딩 없이 SSR 배포 금지

**SSR 모드 필수 패턴 (TanStack Start + D1):**

```typescript
// ✅ TanStack Start - createFileRoute + createServerFn
import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getD1Database } from '../services/d1';

// Server Function (D1 접근)
const fetchEntry = createServerFn({ method: 'POST' })
  .inputValidator((data: { entryId: string; locale: string }) => data)
  .handler(async ({ data }) => {
    const db = getD1Database();
    if (!db) {
      console.error('[fetchEntry] D1 database not available');
      return null;
    }
    const entry = await db.prepare('SELECT * FROM entries WHERE id = ?')
      .bind(data.entryId).first();
    return entry;
  });

// Route 정의
export const Route = createFileRoute('/entry/$entryId')({
  loader: async ({ params }) => {
    const entry = await fetchEntry({ data: { entryId: params.entryId, locale: 'en' } });
    if (!entry) throw notFound();
    return { entry };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData.entry.korean }],
  }),
  component: EntryPage,
});
```

**SSR 모드 필수 패턴 (Roots/Permissive - 정적 데이터):**

```typescript
// ✅ TanStack Start - loader에서 직접 데이터 로딩
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

**검증 방법:**

```bash
# SSR: 라이브 사이트에서 HTML 확인
curl -s https://context.soundbluemusic.com/entry/annyeong | head -50
# ✅ 기대값: <title>안녕 | Context</title>, 본문 콘텐츠 포함

curl -s https://roots.soundbluemusic.com/concept/addition | head -50
# ✅ 기대값: <title>Addition | Roots</title>, 본문 콘텐츠 포함
```

### 2. 하드코딩 금지

- 테스트 통과용 하드코딩 값 금지
- 매직 넘버 금지 (명명된 상수 사용)
- 특정 환경에서만 작동하는 고정값 금지

### 3. 에러 숨기기 금지

- 빈 catch 블록 금지
- `@ts-ignore` 설명 없이 사용 금지
- `any` 타입으로 타입 체크 우회 금지
- 에러 숨기려고 코드 삭제/주석 처리 금지

### 4. 불완전한 코드 금지

- `// ... existing code ...` 금지 → 항상 완전한 코드 제공
- TODO 주석만 남기고 구현 안 함 금지

### 5. 과적합/임시방편 금지

- 특정 테스트 케이스만 통과시키는 조건문 금지
- 에러 메시지 문자열 매칭으로 분기 금지
- 증상만 숨기는 try-catch 금지
- 근본 원인 파악 없이 수정 금지

### 6. 다운그레이드 금지 (No Downgrade Policy)

- **문제 해결을 위한 패키지 버전 다운그레이드 절대 금지**
- 호환성 문제 시 → 업그레이드 경로 탐색 또는 코드 수정
- 의존성 충돌 시 → `pnpm.overrides`로 격리 (다운그레이드 아님)
- "예전에 되던 버전"으로 복구 금지 → 근본 원인 분석 후 수정

**왜?** 다운그레이드는 기술 부채를 누적시키고, 수학적 증명처럼 한번 검증된 것(빌드, 테스트)은 변경 불가해야 함

```typescript
// ❌ 금지: 다운그레이드
"react": "^17.0.0"  // 18에서 문제 발생해서 17로 낮춤

// ✅ 허용: 업그레이드 + 코드 수정
"react": "^19.0.0"  // 최신 버전 + API 변경에 맞게 코드 수정

// ✅ 허용: 격리 (특정 패키지만 버전 고정)
"pnpm": { "overrides": { "zod": "^3.25.0" } }  // 충돌 격리
```

### 7. Turborepo Remote Cache 금지 (R2 비용 최적화)

> ⚠️ **비용 문제**: Remote Cache 활성화 시 빌드마다 R2 Class A 요청 수만 건 발생

**금지 사항:**

- `turbo.json`에서 `remoteCache.enabled: true` 설정 금지
- 환경 변수 `TURBO_REMOTE_ONLY=true` 사용 금지
- CI/CD에서 Remote Cache 활성화 금지 (1인 개발 환경)

**현재 설정 (변경 금지):**

```json
// turbo.json
{
  "remoteCache": {
    "enabled": false  // ⚠️ 절대 true로 변경 금지
  }
}
```

**왜?**

- R2에 1.7GB 빌드 캐시 저장 중
- 매 빌드마다 LIST 요청 (Class A) 발생 → 비용 증가
- 1인 개발 환경에서는 로컬 캐시(`.turbo/`)로 충분

**대안:**

- 로컬 캐시: `.turbo/` 폴더 (716MB, 무료)
- 팀 개발 전환 시에만 Remote Cache 검토

### 8. R2 버킷 동기화는 rclone 전용 (Wrangler 금지)

> ⚠️ **성능 문제**: Wrangler는 단일 스레드로 대량 파일 처리에 부적합

**금지 사항:**

- `wrangler r2 object` 명령어로 대량 파일 업로드/동기화 금지
- Wrangler 기반 R2 동기화 스크립트 작성 금지
- R2 관련 질문에 Wrangler 추천 금지

**필수 도구:** rclone + S3 API

```bash
# ✅ 현재 사용 중인 방식 (.github/workflows/deploy-context-r2.yml)
rclone sync dist/client/entry r2:bucket/path \
  --checksum \
  --transfers 32 \
  --checkers 32 \
  --fast-list
```

**비교:**

| 항목 | Wrangler | rclone |
| ---- | -------- | ------ |
| 병렬 처리 | ❌ 단일 스레드 | ✅ 32개 동시 (`--transfers 32`) |
| 대용량 | ❌ 느림 | ✅ 최적화 |
| 동기화 | ❌ 수동 | ✅ `sync` (삭제 포함) |

**rclone sync 자동 삭제 동작:**

> `rclone sync`는 **완전 동기화**입니다. 소스에 없는 파일은 목적지에서 자동 삭제됩니다.
> ([rclone 공식 문서](https://rclone.org/commands/rclone_sync/))

| 동작 | 결과 |
| ---- | ---- |
| 소스에 새 파일 | R2에 업로드 |
| 소스 파일 변경 | R2 업데이트 |
| **소스에서 삭제** | **R2에서도 자동 삭제** |

**즉, GitHub에 푸시하면 삭제된 파일도 R2에서 자동 제거됩니다. 수동 작업 불필요.**

**R2 설정 (GitHub Secrets 사용):**

```ini
# rclone.conf
[r2]
type = s3
provider = Cloudflare
access_key_id = ${{ secrets.R2_ACCESS_KEY_ID }}
secret_access_key = ${{ secrets.R2_SECRET_ACCESS_KEY }}
endpoint = https://${{ secrets.CLOUDFLARE_ACCOUNT_ID }}.r2.cloudflarestorage.com
```

**참고 파일:** `.github/workflows/deploy-context-r2.yml`

### 9. Context App: SSR + D1 전용

> ⚠️ **Context는 SSR + D1 전용**입니다.

**금지 사항:**

- `app.config.ts`에서 SSR 비활성화 금지
- Entry 페이지에 `loader` 없이 클라이언트에서만 데이터 로딩 금지
- D1 없이 entry 데이터 로딩 시도 금지
- `createServerFn` 없이 서버 데이터 접근 금지

**현재 운영 구조:**

| 구성요소 | 설명 |
| -------- | ---- |
| 렌더링 모드 | **SSR 전용** (Cloudflare Workers) |
| 데이터베이스 | Cloudflare D1 (`context-db`) |
| 엔트리 수 | 16,394 entries + 52 categories |
| 사이트맵 | D1에서 동적 생성 |

**배포 명령어:**

```bash
# SSR 빌드 + 배포 (기본)
cd apps/context
pnpm build  # BUILD_MODE=ssr가 기본값
pnpm deploy
```

**D1 바인딩 (wrangler.toml에서 설정):**

| 바인딩 | 데이터베이스 | 용도 |
| :----- | :----------- | :--- |
| `DB` | context-db | 한국어 사전 엔트리 (16,394개) |
| `PRIVATE_DB` | private | 저작권 자료 (공개 레포에 넣을 수 없는 콘텐츠) |

**사이트맵 구조 (D1에서 동적 생성):**

| Route | 설명 |
| ----- | ---- |
| `/sitemap.xml` | 인덱스 (52개 카테고리 사이트맵 링크) |
| `/sitemap-pages.xml` | 정적 페이지 |
| `/sitemap-categories.xml` | 카테고리 목록 |
| `/sitemaps/entries/{categoryId}.xml` | 카테고리별 엔트리 |

**참고 파일:**

- `apps/context/wrangler.toml` - Workers + D1 바인딩 설정
- `apps/context/app/server.ts` - 동적 사이트맵 생성

---

## ✅ 필수 준수 (MUST DO)

### 응답 규칙

| 규칙 | 설명 |
| ---- | ---- |
| **한글 답변 및 문서 작성 필수** (Korean Required for Responses and Documents) | 모든 설명, 대답, 그리고 계획표(Plan) 등의 문서는 반드시 한글로 작성해야 합니다. (All explanations, answers, and documents like plans must be written in Korean.) |
| **확인 전 단정 금지** | 추측 말고 코드 확인 후 답변 |
| **환경 맥락 파악 필수** | 기능/도구 추천 전 현재 개발 환경(로컬/클라우드, CI/CD, 호스팅 등) 확인 후 해당 환경에 맞는 답변 제공 |
| **완전한 코드 제공** | `// ...` 사용 금지 |
| **출처 명시** | `파일:라인` 형식으로 근거 제시 |
| **UI 검증 필수** | 코드 수정 후 실제 UI에서 확인 |
| **작업 완료 시 변경 요약 표 필수** | 작업 완료 후 반드시 **전(Before) / 후(After) / 효과(Effect)** 표로 정리 |

**변경 요약 표 예시:**

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
| ---- | ----------- | ---------- | ------------- |
| PWA | `disable: true` | workbox-build로 SW 생성 | 오프라인 지원 활성화 |
| main.js | 1.0MB 단일 번들 | 513B (진입점) | 초기 로딩 개선 |
| vendor 청크 | 없음 | vendor-react (1.4MB) | 캐싱 효율 증가 |

### 수정 전 체크리스트

1. 근본 원인(WHY) 파악했는가?
2. 기존 기능 유지되는가?
3. 하드코딩 값 없는가?
4. 모든 유사 케이스에 작동하는가?

### en/ko 라우트 쌍 공통화 규칙 (중요)

TanStack Start 파일 기반 라우팅 때문에 `routes/xxx.tsx` + `routes/ko/xxx.tsx` 쌍은 **파일 구조상 필수**입니다.
하지만 **내용은 단일 소스**여야 합니다. 새 동적/정적 라우트 추가 시 아래 패턴을 따르세요:

**정적 라우트 (head 콘텐츠가 data에 의존하지 않음):**

- 메타는 페이지 컴포넌트 파일에 `xxxMeta` 로 export
  - Roots: `apps/roots/app/components/pages/*.tsx` 의 `export const xxxMeta = { ko, en }`
  - Context: `apps/context/app/components/pages/*Content.tsx` 동일
  - Permissive: `apps/permissive/app/routes-meta.ts` 단일 파일
- 라우트 파일은 `headFactoryEn/Ko(xxxMeta, APP_CONFIG.baseUrl)` 만 호출

**동적 라우트 (loader + dynamicHeadFactoryEn/Ko):**

- 페이지 컴포넌트 파일에 4가지 export:
  - `xxxRouteLoader` — 쌍이 공유하는 loader. `location.pathname.startsWith('/ko')`로 locale 감지
  - `buildXxxRouteHead` — `dynamicHeadFactoryEn/Ko`에 전달할 head builder
  - `xxxCanonicalPath` — **locale prefix 없이** `/xxx/{id}` 만 반환 (`dynamicHeadFactoryKo`가 `/ko` 자동 prefix)
  - `type XxxLoaderData` — loader 반환 타입
- 라우트 파일은 15줄 이내 boilerplate만 유지

**canonical path 주의:**

- `dynamicHeadFactoryKo`는 `getPathname` 반환값에 `/ko` 를 **자동 prefix** 합니다 ([packages/seo/src/meta/head-factory.ts:338](packages/seo/src/meta/head-factory.ts#L338)).
- ko 라우트 파일에서 canonical에 `/ko/xxx` 를 반환하면 `/ko/ko/xxx` 이중 prefix 버그.
- 공유 canonical 함수는 반드시 locale-agnostic (`/xxx/{id}` 만).

---

## 📦 Import 레이어 규칙

```text
L3 (apps, ui, features) → L2 (i18n, search, seo, pwa) → L1 (data, platform) → L0 (core, config)
```

- **하위 레이어만 import 가능** (L3 → L2 OK, L2 → L3 금지)
- **순환 의존 금지** (같은 레이어 간 상호 import 금지)

```typescript
// ✅ OK
import { validateId } from '@soundblue/core/validation';  // L0
import { storage } from '@soundblue/platform/storage';    // L1
import { useSearch } from '@soundblue/search/react';      // L2

// ❌ 금지
// core/에서 platform/ import (L0 → L1)
// i18n/에서 features/ import (L2 → L3)
```

---

## 📁 파일별 규칙

### 허용

| 위치 | 허용 액션 |
| ---- | --------- |
| `packages/core/` | 순수 함수, 타입, 상수 (브라우저 API 금지) |
| `packages/data/schemas/` | Zod 스키마 |
| `packages/ui/components/` | React 컴포넌트 |
| `apps/*/routes/` | 라우트 컴포넌트 |
| `data/**/*.json` | 스키마 준수 데이터 |

### 금지

| 위치 | 금지 액션 |
| ---- | --------- |
| `apps/*/app.config.ts` | SSR 비활성화 설정 (모든 앱 SSR) |
| `apps/*/vite.config.ts` | `tanstackStart` 플러그인 제거 |
| `*.browser.ts` | SSR 빌드 시점 실행 코드 |
| `*.noop.ts` | 실제 로직 (빈 구현만) |
| `wrangler.toml` (Context) | D1 바인딩 제거 |

---

## 🌐 i18n / SEO 규칙

### URL 라우팅

```text
/entry/hello     → English
/ko/entry/hello  → Korean
```

### 동적 라우트에서 locale 추출 (중요!)

> **⛔ `params.locale` 사용 금지** - 항상 `undefined`입니다!

TanStack Start 파일 기반 라우팅에서 `ko/entry/$entryId.tsx`로 정의하면 `ko`는 **폴더명(고정 문자열)**입니다.
따라서 `params.locale`은 항상 `undefined`가 됩니다.

```typescript
import { getLocaleFromPath } from '@soundblue/i18n';

// ❌ 금지 (params.locale은 항상 undefined)
const locale = params.locale === 'ko' ? 'ko' : 'en';

// ✅ TanStack Start loader에서 (location.pathname 사용)
export const Route = createFileRoute('/entry/$entryId')({
  loader: async ({ params, location }) => {
    const locale = getLocaleFromPath(location.pathname);  // '/ko/entry/...' → 'ko'
    return { entry, locale };
  },
});

// ✅ 컴포넌트에서 (useLocation 사용)
function EntryPage() {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname);
}
```

### Head Factory 필수 (TanStack Start)

```typescript
// ✅ TanStack Start - head 옵션 사용
export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About | Context' },
      { name: 'description', content: 'About this app' },
    ],
    links: [{ rel: 'canonical', href: 'https://app.soundbluemusic.com/about' }],
  }),
  component: AboutPage,
});

// ✅ 동적 라우트 - loaderData 활용
export const Route = createFileRoute('/entry/$entryId')({
  loader: async ({ params }) => getEntry(params.entryId),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.entry.korean} | Context` },
      { name: 'description', content: loaderData.entry.english },
    ],
  }),
  component: EntryPage,
});
```

---

## 🔧 품질 우선순위 (충돌 시)

```text
1. 접근성 > 2. 보안 > 3. 기능 > 4. 성능 > 5. SEO > 6. 코드 품질
```

---

## 🔋 토큰 절약

### 기본 규칙

- **15턴마다 `/compact`** - 자동(95%)보다 선제적으로
- **파일 직접 지정** - `@src/file.ts` (전체 탐색 방지)
- **작업 완료 후 새 세션** - 컨텍스트 축적 방지
- **`.claudeignore`** - 불필요한 파일 자동 제외

### 작업 유형별 최적 방법 (필수)

| 작업 유형 | 방법 | 이유 |
| --------- | ---- | ---- |
| 코드베이스 탐색/분석 | Task tool (Explore) | 서브에이전트가 탐색, 요약만 반환 |
| 단순 파일/함수 검색 | Task tool + haiku 모델 | 저비용 모델로 빠른 검색 |
| 파일 수정 | 직접 Read + Edit | 정확한 파일만 처리 |
| 빌드/테스트 로그 | `head -50` 요약 | 전체 로그 출력 방지 |

### 금지 사항

- Glob → Read 반복으로 전체 탐색 ❌
- 빌드 로그 전체 출력 ❌
- 동일 파일 중복 읽기 ❌

### 커스텀 스킬 활용

| 스킬 | 용도 |
| ---- | ---- |
| `/cost-check` | R2 비용 최적화 규칙 검사. Turborepo Remote Cache 비활성화 상태 확인 |
| `/explore [질문]` | 코드베이스 구조 분석 (fork context) |
| `/find [검색어]` | 파일/함수 위치 검색 (haiku) |
| `/rendering-check` | SSR 규칙 위반 검사 (Roots 앱 전용) |
| `/layer-check` | import 레이어 규칙 검사 (fork context) |
| `/link-check` | 프로덕션 URL 링크 무결성 검사 (lychee) |
| `/quality-gate` | 병렬 품질 검사 통합 (SSR, Layer, Link, TypeCheck, Lint) |
| `/latest-check` | 기술 스택 최신 정보 검색 (GitHub API로 정확한 릴리스 날짜 확인) |
| `/edge-test` | 엣지 케이스 테스트 자동 생성. 함수 분석 → 경계값/예외 상황 식별 → 테스트 코드 자동 작성 |

**⚠️ 앱별 라우트 수정 검증:**

| 앱 | 수정 시 확인 사항 |
| -- | ----------------- |
| Context (SSR) | D1 바인딩 존재, loader에서 DB 쿼리 |
| Permissive (SSR) | wrangler.toml 설정 |
| Roots (SSR) | wrangler.toml 설정 |

### 모델 사용 기준

| 모델 | 사용 케이스 |
| ---- | ----------- |
| **Opus** | 복잡한 로직 작성, 아키텍처 결정, 버그 분석 |
| **Sonnet** | 일반 코드 수정, 구조 분석 |
| **Haiku** | 검색, 단순 검증, 파일 찾기 |

---

## 🔍 최신 정보 확인 필수 (공식 문서 우선)

> ⚠️ **내 지식 컷오프(2025년 5월) 이후 변경 가능성이 높은 주제**.
> 아래 주제 답변 전 **반드시 공식 문서 확인**.

| 주제 | 공식 문서 URL | 이유 |
| ---- | ------------- | ---- |
| Cloudflare Workers | developers.cloudflare.com/workers/platform/changelog | Pages/Workers 통합 진행 중 |
| Cloudflare D1 | developers.cloudflare.com/d1/platform/release-notes | GA 이후 변경사항 |
| TanStack Start | tanstack.com/start/latest/docs/overview | 빠른 릴리스 주기, SSR 프레임워크 |
| TanStack Router | tanstack.com/router/latest/docs/overview | 파일 기반 라우팅 |
| Tailwind CSS v4 | tailwindcss.com/docs/upgrade-guide | v3 → v4 대규모 변경 |
| TypeScript 5.x | typescriptlang.org/docs/handbook/release-notes | 분기별 릴리스 |

**규칙**:

1. 위 주제 관련 질문 시 → **WebFetch로 공식 문서 직접 확인**
2. **GitHub API로 정확한 릴리스 날짜 확인** (HTML 페이지의 상대 시간 표시는 부정확)
   - TypeScript: `https://api.github.com/repos/microsoft/TypeScript/releases?per_page=5`
   - Tailwind CSS: `https://api.github.com/repos/tailwindlabs/tailwindcss/releases?per_page=5`
   - TanStack Start: `https://api.github.com/repos/TanStack/router/releases?per_page=5`
3. 공식 문서에서 정보 부족 시에만 WebSearch 사용 (공식 도메인 필터 적용)
4. 출처 우선순위: **GitHub API > 공식 문서 > GitHub 릴리스 > 공식 블로그 > 기타**
5. Medium, dev.to, 개인 블로그, 커뮤니티 포럼은 **지양**

---

## 📚 공식 문서

| 기술 | 문서 |
| ---- | ---- |
| TanStack Start | [tanstack.com/start](https://tanstack.com/start/latest) |
| TanStack Router | [tanstack.com/router](https://tanstack.com/router/latest) |
| Tailwind CSS v4 | [tailwindcss.com](https://tailwindcss.com/docs) |
| TypeScript | [typescriptlang.org](https://www.typescriptlang.org/docs) |
| Cloudflare D1 | [developers.cloudflare.com/d1](https://developers.cloudflare.com/d1/) |
| Cloudflare Workers | [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers/) |
| Cloudflare Pages | [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/) |

---

## 🛠 기술 스택 버전 (2026-04-24 기준)

> ⚠️ **AI 어시스턴트 참고용**: 이 버전들은 실제 사용 중인 버전입니다. 코드 작성 시 참고하세요.

| 기술 | 버전 | 비고 |
| ---- | ---- | ---- |
| **React** | ^19.2.5 | React 19 Stable |
| **TanStack Start** | ^1.167.43 | SSR 프레임워크 |
| **TanStack Router** | ^1.168.23 | 파일 기반 라우팅 |
| **Vite** | ^8.0.10 | Rolldown 번들러 (7x 빠른 빌드), Stable |
| **TypeScript** | ^5.9.3 | 타입 체크 |
| **Tailwind CSS** | ^4.2.4 | v4 사용 중 |
| **Zod** | ^4.3.6 (Context), ^3.25.76 (root, astro 호환) | 스키마 검증 |
| **Zustand** | ^5.0.12 | 상태 관리 |
| **Cloudflare Wrangler** | ^4.84.1 | Workers 배포 |
| **@cloudflare/vite-plugin** | ^1.33.1 | Vite 통합 |
| **@inlang/paraglide-js** | ^2.16.0 | i18n 컴파일러 |
| **Node.js** | >=20 | 런타임 |
| **pnpm** | 10.11.0 | 패키지 매니저 |

---

## 📂 빌드 출력 구조 (Vite 8 + Cloudflare)

> **Vite 8**부터 빌드 출력 경로가 `build/` → `dist/`로 변경되었습니다.

```text
apps/context/dist/
├── server/
│   └── index.js          # Workers 진입점 (all-in-one 번들)
└── client/
    ├── assets/           # 정적 자산 (CSS, JS, 이미지)
    └── [prerendered]/    # 사전 렌더링된 페이지
```

**wrangler.toml 설정 (모든 앱 공통):**

```toml
main = "@tanstack/react-start/server-entry"
compatibility_date = "2026-01-22"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = "dist/client"
```

---

## 📊 앱별 D1 바인딩 요약

| 앱 | 바인딩 | 데이터베이스 | 용도 |
| :- | :----- | :----------- | :--- |
| **Context** | `DB` | context-db | 한국어 사전 (16,394 entries) |
| **Context** | `PRIVATE_DB` | private | 저작권 자료 |
| **Permissive** | `KNOWLEDGE_DB` | knowledge | 웹개발 자료 (88 libraries, 56 APIs) |
| **Permissive** | `PRIVATE_DB` | private | 저작권 자료 |
| **Roots** | `KNOWLEDGE_DB` | knowledge | 수학 개념 (438 concepts, 18 fields) |
| **Roots** | `PRIVATE_DB` | private | 저작권 자료 |
