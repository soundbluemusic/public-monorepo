# CLAUDE.md - AI Assistant Guidelines

> **프로젝트 정보**: @README.md | **아키텍처**: @ARCHITECTURE.md

---

## ⛔ 절대 금지 (DO NOT)

### 1. SPA 모드 전환 절대 금지 (SSG/SSR 허용)
> ⚠️ **SEO 필수**: 이 프로젝트의 모든 페이지는 검색 엔진이 완전한 HTML을 크롤링할 수 있어야 합니다.
> SPA는 빈 HTML을 반환하여 SEO가 불가능합니다. 절대 SPA로 전환하지 마세요.

**현재 배포 모드:**

| App | Mode | 데이터 소스 | 설정 파일 |
|:----|:-----|:-----------|:----------|
| Context | **SSR** | Cloudflare D1 | `wrangler.toml` |
| Permissive | SSR | In-memory | `wrangler.toml` |
| Roots | SSG | TypeScript | — |

**금지 사항:**
- SPA 모드 전환 금지 (클라이언트 사이드 렌더링만으로 콘텐츠 생성 금지)
- 빈 `<div id="root"></div>` HTML 금지
- `loader` 없는 동적 라우트 금지 (SEO 데이터 누락)
- D1 바인딩 없이 SSR 배포 금지

**SSR 모드 필수 패턴 (Context):**

```typescript
// ✅ SSR loader - D1에서 데이터 가져오기
export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context?.cloudflare?.env?.DB;
  if (!db) throw new Response('Database unavailable', { status: 503 });

  const entry = await db.prepare('SELECT * FROM entries WHERE id = ?')
    .bind(params.entryId).first();
  if (!entry) throw new Response('Not Found', { status: 404 });

  return { entry };
}
```

**SSG 모드 필수 패턴 (Roots):**

```typescript
// ✅ SSG loader + clientLoader
export async function loader({ params }) {
  return { data: await fetchData(params.id) };
}

export async function clientLoader({ params, serverLoader }) {
  try { return await serverLoader(); }
  catch { return { data: await fetchData(params.id) }; }
}
```

**검증 방법:**

```bash
# SSR: 라이브 사이트에서 HTML 확인
curl -s https://context.soundbluemusic.com/entry/annyeong | head -50
# ✅ 기대값: <title>안녕 | Context</title>, 본문 콘텐츠 포함

# SSG: 빌드된 HTML 확인
head -50 apps/roots/build/client/concept/hello/index.html
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

> ⚠️ **성능 문제**: Wrangler는 단일 스레드로 34,676개 SSG 파일 처리에 부적합

**금지 사항:**

- `wrangler r2 object` 명령어로 대량 파일 업로드/동기화 금지
- Wrangler 기반 R2 동기화 스크립트 작성 금지
- R2 관련 질문에 Wrangler 추천 금지

**필수 도구:** rclone + S3 API

```bash
# ✅ 현재 사용 중인 방식 (.github/workflows/deploy-context-r2.yml)
rclone sync build/client/entry r2:bucket/path \
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

### 9. Context App: SSR + D1 배포 규칙

> ⚠️ **Context는 SSR + D1으로 운영 중**. SSG + R2는 백업 모드로만 유지.

**현재 운영 구조:**

| 구성요소 | 설명 |
| -------- | ---- |
| 렌더링 모드 | SSR (Cloudflare Pages Functions) |
| 데이터베이스 | Cloudflare D1 (`context-db`) |
| 엔트리 수 | 16,836 entries + 25 categories |
| 사이트맵 | D1에서 동적 생성 |

**배포 명령어:**

```bash
# SSR 빌드 + 배포
cd apps/context
BUILD_MODE=ssr npx react-router build
npx wrangler pages deploy build/client --project-name=c0ntext
```

**D1 바인딩 (Cloudflare Dashboard에서 설정):**
- Variable name: `DB`
- D1 database: `context-db`

**사이트맵 구조 (D1에서 동적 생성):**

| Route | 설명 |
| ----- | ---- |
| `/sitemap.xml` | 인덱스 (25개 카테고리 사이트맵 링크) |
| `/sitemap-pages.xml` | 정적 페이지 |
| `/sitemap-categories.xml` | 카테고리 목록 |
| `/sitemap-entry-{categoryId}.xml` | 카테고리별 엔트리 (25개) |

**참고 파일:**

- `apps/context/wrangler.toml` - D1 바인딩 설정
- `apps/context/public/_routes.json` - Functions 라우팅
- `apps/context/app/routes/sitemap[.xml].tsx` - 동적 사이트맵 생성

---

## ✅ 필수 준수 (MUST DO)

### 응답 규칙
| 규칙 | 설명 |
|------|------|
| **한글 답변 및 문서 작성 필수** (Korean Required for Responses and Documents) | 모든 설명, 대답, 그리고 계획표(Plan) 등의 문서는 반드시 한글로 작성해야 합니다. (All explanations, answers, and documents like plans must be written in Korean.) |
| **확인 전 단정 금지** | 추측 말고 코드 확인 후 답변 |
| **환경 맥락 파악 필수** | 기능/도구 추천 전 현재 개발 환경(로컬/클라우드, CI/CD, 호스팅 등) 확인 후 해당 환경에 맞는 답변 제공 |
| **완전한 코드 제공** | `// ...` 사용 금지 |
| **출처 명시** | `파일:라인` 형식으로 근거 제시 |
| **UI 검증 필수** | 코드 수정 후 실제 UI에서 확인 |

### 수정 전 체크리스트
1. 근본 원인(WHY) 파악했는가?
2. 기존 기능 유지되는가?
3. 하드코딩 값 없는가?
4. 모든 유사 케이스에 작동하는가?

---

## 📦 Import 레이어 규칙

```
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
|------|----------|
| `packages/core/` | 순수 함수, 타입, 상수 (브라우저 API 금지) |
| `packages/data/schemas/` | Zod 스키마 |
| `packages/ui/components/` | React 컴포넌트 |
| `apps/*/routes/` | 라우트 컴포넌트 |
| `data/**/*.json` | 스키마 준수 데이터 |

### 금지
| 위치 | 금지 액션 |
|------|----------|
| `apps/roots/react-router.config.ts` | `ssr: true` (SSG 전용 앱) |
| `*.browser.ts` | SSR/SSG 빌드 시점 실행 코드 |
| `*.noop.ts` | 실제 로직 (빈 구현만) |
| `entry.client.tsx` | orphan DOM 정리 로직 삭제 |
| `wrangler.toml` (Context) | D1 바인딩 제거 |

---

## 🌐 i18n / SEO 규칙

### URL 라우팅
```
/entry/hello     → English
/ko/entry/hello  → Korean
```

### 동적 라우트에서 locale 추출 (중요!)

> **⛔ `params.locale` 사용 금지** - 항상 `undefined`입니다!

routes.ts에서 `route('ko/entry/:entryId', ...)`로 정의하면 `ko`는 **고정 문자열**입니다.
따라서 `params.locale`은 항상 `undefined`가 됩니다.

```typescript
import { getLocaleFromPath } from '@soundblue/i18n';

// ❌ 금지 (params.locale은 항상 undefined)
const locale = params.locale === 'ko' ? 'ko' : 'en';

// ✅ loader에서 (request.url 사용)
export async function loader({ params, request }) {
  const url = new URL(request.url);
  const locale = getLocaleFromPath(url.pathname);  // '/ko/entry/...' → 'ko'
}

// ✅ clientLoader에서 (window.location 사용)
export async function clientLoader({ params, serverLoader }) {
  const locale = getLocaleFromPath(window.location.pathname);
}
```

### Meta Factory 필수
```typescript
// 정적 라우트
export const meta = metaFactory({
  ko: { title: '제목', description: '설명' },
  en: { title: 'Title', description: 'Desc' },
}, 'https://app.soundbluemusic.com');

// 동적 라우트
export const meta = dynamicMetaFactory<typeof loader>({
  getTitle: (data) => data.entry.title,
  baseUrl: 'https://app.soundbluemusic.com',
});
```

---

## 🔧 품질 우선순위 (충돌 시)

```
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
|----------|------|------|
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
|------|------|
| `/cost-check` | R2 비용 최적화 규칙 검사. Turborepo Remote Cache 비활성화 상태 확인 |
| `/explore [질문]` | 코드베이스 구조 분석 (fork context) |
| `/find [검색어]` | 파일/함수 위치 검색 (haiku) |
| `/ssg-check` | SSG 규칙 위반 검사 (Roots 앱 전용) |
| `/layer-check` | import 레이어 규칙 검사 (fork context) |
| `/link-check` | 프로덕션 URL 링크 무결성 검사 (lychee) |
| `/quality-gate` | 병렬 품질 검사 통합 (SSG, Layer, Link, TypeCheck, Lint) |

**⚠️ 앱별 라우트 수정 검증:**

| 앱 | 수정 시 확인 사항 |
|----|------------------|
| Context (SSR) | D1 바인딩 존재, loader에서 DB 쿼리 |
| Permissive (SSR) | wrangler.toml 설정 |
| Roots (SSG) | `/ssg-check` 실행 |

### 모델 사용 기준

| 모델 | 사용 케이스 |
|------|------------|
| **Opus** | 복잡한 로직 작성, 아키텍처 결정, 버그 분석 |
| **Sonnet** | 일반 코드 수정, 구조 분석 |
| **Haiku** | 검색, 단순 검증, 파일 찾기 |

---

## 📚 공식 문서

| 기술 | 문서 |
|------|------|
| Tailwind CSS v4 | [tailwindcss.com](https://tailwindcss.com/docs) |
| React Router v7 | [reactrouter.com](https://reactrouter.com) |
| TypeScript | [typescriptlang.org](https://www.typescriptlang.org/docs) |
| Cloudflare D1 | [developers.cloudflare.com/d1](https://developers.cloudflare.com/d1/) |
| Cloudflare Pages | [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/) |
