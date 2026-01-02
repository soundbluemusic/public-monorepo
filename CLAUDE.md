# Project Overview

프로젝트 개요, 기술 스택, 구조, 명령어: @README.md
상세 아키텍처 문서: @ARCHITECTURE.md

## Package Architecture (패키지 아키텍처)

### Layer Diagram (레이어 다이어그램)

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 3: Apps + UI                                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ apps/context    apps/roots    apps/permissive             │  │
│  │ @soundblue/ui   @soundblue/features                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  Layer 2: Domain                                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ @soundblue/i18n   @soundblue/search                       │  │
│  │ @soundblue/seo    @soundblue/pwa                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  Layer 1: Data                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ @soundblue/data   @soundblue/platform                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  Layer 0: Foundation                                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ @soundblue/core   @soundblue/config                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Rules (레이어 규칙)

| Rule | Description |
|------|-------------|
| **하위만 의존** | Layer N → Layer N-1 이하만 import 가능 |
| **순환 금지** | 같은 레이어 간 상호 의존 금지 |
| **앱 코드 분리** | 앱 특화 코드는 apps/ 내부에만 |

### Package Categories (패키지 분류)

| Layer | Packages | Rules |
|-------|----------|-------|
| `L0: Foundation` | core, config | 브라우저 API 금지, 순수 TypeScript |
| `L1: Data` | data, platform | Zod 스키마, 이중 구현 필수 |
| `L2: Domain` | i18n, search, seo, pwa | 도메인 로직, React 선택적 |
| `L3: Apps + UI` | apps/*, ui, features | React 컴포넌트, 훅 |

### Import Rules (Import 규칙)

```typescript
// ✅ 올바른 import (하위 레이어 → 상위 레이어)
import { LIMITS, validateId } from '@soundblue/core/validation';        // L0
import { cn, debounce } from '@soundblue/core/utils';                   // L0
import { storage } from '@soundblue/platform/storage';                  // L1
import { EntrySchema } from '@soundblue/data/schemas';                  // L1
import { getLocaleFromPath } from '@soundblue/i18n';                    // L2
import { useSearch } from '@soundblue/search/react';                    // L2
import { DarkModeToggle } from '@soundblue/ui/components';              // L3
import { useSettingsStore } from '@soundblue/features/settings';        // L3

// ❌ 금지된 import (레이어 역방향)
// core/에서 platform/ import 금지 (L0 → L1)
// platform/에서 ui/ import 금지 (L1 → L3)
// i18n/에서 features/ import 금지 (L2 → L3)

// ❌ 금지된 import (순환 의존)
// @soundblue/data에서 @soundblue/platform import 금지 (같은 L1)
```

### Dual Implementation Pattern (이중 구현 패턴)

`platform/` 패키지는 SSG 호환을 위해 반드시 이중 구현 필요:

```typescript
// package.json exports 설정
{
  "exports": {
    "./storage": {
      "browser": "./src/storage/index.browser.ts",  // 브라우저 런타임
      "default": "./src/storage/index.noop.ts"      // SSG 빌드 시
    }
  }
}
```

| File | Purpose | Environment |
|------|---------|-------------|
| `*.browser.ts` | 실제 구현 (IndexedDB, DOM API) | 브라우저 런타임 |
| `*.noop.ts` | 빈 구현 (undefined/[] 반환) | SSG 빌드 시 |

```typescript
// ✅ index.browser.ts - 실제 구현
export const storage: StorageFactory = {
  createFavoritesStorage: (dbName) => new FavoritesDB(dbName),
  // ... IndexedDB 사용
};

// ✅ index.noop.ts - SSG용 빈 구현
export const storage: StorageFactory = {
  createFavoritesStorage: () => ({
    get: async () => undefined,
    set: async () => {},
    getAll: async () => [],
  }),
};
```

## 📚 Official References (공식 참고 문서)

> **항상 최신 공식 문서를 참고하여 코드 품질을 유지하고 향상시킬 것.**

| Technology | Official Docs | GitHub Repository |
|------------|---------------|-------------------|
| **Tailwind CSS v4** | [React Router Guide](https://tailwindcss.com/docs/installation/framework-guides/react-router) | [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) |
| **React Router v7** | [Official Docs](https://reactrouter.com/start/framework/deploying) | [remix-run/react-router](https://github.com/remix-run/react-router) |
| **TypeScript** | [Official Docs](https://www.typescriptlang.org/docs/) | [microsoft/TypeScript](https://github.com/microsoft/TypeScript) |

### 참조 우선순위
1. **공식 문서 > Stack Overflow > 블로그** - 항상 공식 문서 먼저
2. **GitHub Issues/Discussions** - 최신 이슈 및 해결책 확인
3. **Breaking changes** - 반드시 공식 마이그레이션 가이드 참조
4. **버전 호환성** - package.json 버전과 문서 버전 일치 확인

## 절대 규칙 (CRITICAL RULES)

> **이 규칙들은 절대 위반하지 말 것. CMS, 외부 DB, 서버 로직 제안 금지.**

1. **100% SSG Only** - 모든 앱은 정적 사이트 생성만 사용. SSR/서버 로직 절대 금지.
   - `ssr: false` + `prerender()` + `loader()` in `react-router.config.ts`
   - 빌드 출력: `build/client` (HTML + JS + .data 파일)
   - 런타임 서버 없음, CDN에서 직접 서빙
   - 각 앱 SSG 라우트: Context 2012개, Roots 976개, Permissive 8개
2. **오픈소스 Only** - 모든 라이브러리/도구는 오픈소스만 사용.
3. **웹 표준 API Only** - 브라우저 표준 API만 사용. 벤더 종속 API 금지.
4. **로컬 스토리지 Only** - DB는 localStorage, IndexedDB만 사용. 외부 DB/CMS 절대 금지.

### ⛔ SSG 모드 변경 절대 금지 (NEVER CHANGE SSG MODE)

> **이 프로젝트는 100% SSG 전용입니다. 다른 렌더링 모드로 전환 절대 금지.**

```
❌ 절대 금지 (NEVER ALLOWED):
- SPA 모드 활성화 (클라이언트 사이드 라우팅만 사용)
- SSR 모드 활성화 (서버 사이드 렌더링)
- ISR 모드 활성화 (증분 정적 재생성)
- Edge Functions / Serverless Functions 사용
- react-router.config.ts에서 ssr: true 설정
- prerender() 함수 제거 또는 빈 배열 반환
- 런타임 서버 의존 코드 추가
- 빈 HTML 서빙 (SEO 불가능)

✅ 유일하게 허용되는 모드:
- SSG (Static Site Generation) - 빌드 시 모든 페이지 사전 생성
- ssr: false + prerender() + loader() 패턴 필수
- 모든 HTML은 완전한 콘텐츠를 포함해야 함 (SEO 필수)
```

**SEO 원칙:**
- 모든 페이지는 빌드 시 완전한 HTML로 생성되어야 함
- 빈 `<div id="root"></div>`만 있는 HTML 금지
- 검색 엔진이 JavaScript 없이도 콘텐츠를 읽을 수 있어야 함

**왜 SSG만 사용하는가:**
1. **서버 비용 제로** - CDN에서 정적 파일만 서빙
2. **무한 확장성** - 트래픽 증가에도 서버 부하 없음
3. **최고의 성능** - 사전 생성된 HTML 즉시 전달
4. **보안** - 서버 로직 없음 = 서버 취약점 없음
5. **단순성** - 배포가 파일 업로드만으로 완료

### SSG Build Pattern (SSG 빌드 패턴)

```typescript
// react-router.config.ts - 필수 패턴
import type { Config } from '@react-router/dev/config';
import { extractStaticRoutes, generateI18nRoutes } from '@soundblue/i18n';

export default {
  ssr: false,  // ← 필수: SSR 비활성화
  async prerender() {
    // 정적 라우트: routes.ts에서 자동 추출
    const staticRoutes = extractStaticRoutes(routes);

    // 동적 라우트: 데이터 기반 생성
    const { entries } = await import('./app/data/entries/index.js');
    const entryRoutes = generateI18nRoutes(entries, (e) => `/entry/${e.id}`);

    return [...staticRoutes, ...entryRoutes];
  },
} satisfies Config;

// routes/entry.$entryId.tsx - loader 패턴
export async function loader({ params }: Route.LoaderArgs) {
  // 빌드 시 실행 → .data 파일로 저장
  const entry = getEntryById(params.entryId);
  if (!entry) throw new Response('Not Found', { status: 404 });
  return { entry };
}
```

### ⚠️ SSG Hydration Workaround (React Router v7 버그 대응)

> **React Router v7 + React 19 SSG 환경에서 hydration 실패 시 버튼 클릭이 작동하지 않는 버그가 있습니다.**
> **이 workaround는 공식 수정이 나올 때까지 필수입니다.**

#### 문제 원인

React Router v7 SSG에서 hydration 실패 시, React 19가 **새 DOM을 생성**하지만 **기존 서버 HTML을 삭제하지 않음**:

```
문제 상태 (DOM 중복):
<body>
  <div>서버 렌더링 버튼들</div>  ← 사용자에게 보임, React 핸들러 없음
  <div>React가 만든 버튼들</div> ← 숨겨짐, React 핸들러 있음
</body>
→ 사용자가 클릭하는 버튼은 React가 관리하지 않아 작동 안 함
```

#### 해결책 (자체 구현)

`apps/*/app/entry.client.tsx`에서 hydration 후 orphan DOM 제거:

```typescript
// entry.client.tsx - 삭제 금지!
startTransition(() => {
  hydrateRoot(document, <StrictMode><App /></StrictMode>);

  // React Router v7 SSG hydration 버그 workaround
  // hydration 실패 시 생성되는 orphan DOM 제거
  setTimeout(() => {
    const divs = Array.from(document.body.children).filter(
      (el) => el.tagName === 'DIV'
    );
    if (divs.length >= 2) {
      const firstDiv = divs[0] as HTMLElement;
      const hasReact = Object.keys(firstDiv).some((k) =>
        k.startsWith('__react')
      );
      if (!hasReact) {
        firstDiv.remove(); // React가 관리 안 하는 orphan DOM 제거
      }
    }
  }, 100);
});
```

#### 동적 라우트 필수 패턴

모든 동적 라우트에 `clientLoader` + `HydrateFallback` 필수:

```typescript
// routes/entry.$entryId.tsx
export async function loader({ params }) { /* 빌드 시 실행 */ }

export async function clientLoader({ serverLoader }) {
  // hydration 시 서버 데이터 가져오기
  return await serverLoader();
}

export function HydrateFallback() {
  return null; // 서버 HTML 그대로 표시
}
```

#### 수정 금지 파일

| 파일 | 이유 |
|------|------|
| `apps/*/app/entry.client.tsx` | orphan DOM 정리 로직 삭제 시 모든 버튼 클릭 불가 |
| `apps/*/app/entry.server.tsx` | `prerender` 함수 사용 필수 (`renderToString` 금지) |

#### 빌드 후 필수 테스트

```bash
# E2E 테스트로 인터랙티브 기능 확인
pnpm test:e2e --grep "interactive"
```

수동 확인:
- [ ] 북마크 버튼 클릭 → localStorage 저장 확인
- [ ] 다운로드 버튼 클릭 → 모달/다운로드 작동
- [ ] DevTools → Elements → body 아래 div 중복 없음

#### 관련 이슈

- [React Router #12893](https://github.com/remix-run/react-router/issues/12893) - HydrateFallback + clientLoader 필요
- [React Router #12360](https://github.com/remix-run/react-router/discussions/12360) - ssr:false 버그 논의
- [React Router #13368](https://github.com/remix-run/react-router/issues/13368) - Full Static SSG 요청

> **공식 팀 상태**: "ssr:false 관련 버그를 아직 수정 중" (2024년부터 진행 중)

## Code Quality Rules (코드 품질 규칙)

### Absolute Prohibitions (절대 금지) ⛔

> **이 규칙들을 위반하면 즉시 중단하고 근본 원인을 파악할 것**

#### 1. 하드코딩 규칙 (HARDCODING RULES)

> **기본 원칙: 하드코딩은 금지. 단, 우수한 설계 목적일 경우에만 예외 허용.**

```
❌ 절대 금지 (NEVER ALLOWED):
- 테스트 통과를 위한 하드코딩된 값
- 빌드 에러 회피를 위한 임시 상수
- "일단 동작하게" 하려는 매직 넘버
- 특정 환경에서만 작동하는 고정값
- 에러 메시지를 숨기기 위한 기본값

✅ 허용되는 하드코딩 (ALLOWED - 우수한 설계 목적):
- 명확한 이름의 상수 정의 (LIMITS.ID_LENGTH = 100)
- 타입 안전성을 위한 enum/literal 값
- 수학/물리 상수 (Math.PI, Euler's number)
- CSS 변수로 노출된 디자인 토큰 (--header-height: 56px)
- 프로토콜/표준 명세 기반 값 (HTTP status codes)

⚠️ 허용 조건 (Required for Allowed Hardcoding):
1. 명확하고 서술적인 이름 사용
2. 왜 이 값인지 주석으로 설명
3. 단일 출처(Single Source of Truth)에서 정의
4. @soundblue/core에서 export하여 재사용
```

**하드코딩 검토 질문:**
1. "이것이 우수한 설계의 일부인가, 아니면 지름길인가?"
2. "이 값이 변경되면 한 곳에서만 수정하면 되는가?"
3. "이 값의 의미가 이름과 주석으로 명확한가?"

#### 2. 에러 숨기기 절대 금지 (NO ERROR HIDING)
- Never delete/comment out code to hide errors (에러 숨기려고 코드 삭제/주석 처리 금지)
- Never use empty catch blocks (빈 catch 블록 금지)
- Never ignore TypeScript errors with `@ts-ignore` without explanation
- Never use `any` type to bypass type checking

#### 3. 테스트/검증 비활성화 절대 금지 (NO DISABLING)
- Never disable tests, validation, or security checks (테스트/검증/보안 체크 비활성화 금지)
- Never skip pre-commit hooks
- Never use `--no-verify` flags

#### 4. 불완전한 코드 절대 금지 (NO INCOMPLETE CODE)
- Never use `// ... existing code ...` - always provide complete code (항상 완전한 코드 제공)
- Never leave TODO comments without creating a tracking issue
- Never commit placeholder implementations

### Problem Resolution Guide (문제 해결 가이드)

> **금지만 있고 대안이 없으면 막다른 길. 아래 해결책을 사용할 것.**

#### any 타입을 써야 할 것 같을 때
```typescript
// ❌ 금지
function process(data: any) { ... }

// ✅ 대안 1: unknown + 타입 가드
function process(data: unknown) {
  if (isValidData(data)) { ... }
}

// ✅ 대안 2: 제네릭
function process<T extends BaseType>(data: T) { ... }

// ✅ 대안 3: Zod 스키마 추론
const DataSchema = z.object({ ... });
type Data = z.infer<typeof DataSchema>;
```

#### @ts-ignore를 써야 할 것 같을 때
```typescript
// ❌ 금지
// @ts-ignore
const value = obj.unknownProp;

// ✅ 대안 1: 타입 단언 (근거 있을 때)
const value = (obj as KnownType).prop;

// ✅ 대안 2: 옵셔널 체이닝
const value = obj?.prop ?? defaultValue;

// ✅ 대안 3: in 연산자 타입 가드
if ('prop' in obj) { const value = obj.prop; }
```

#### 복잡한 외부 라이브러리 타입
```typescript
// ❌ 금지
const result: any = externalLib.doSomething();

// ✅ 대안 1: ReturnType 추론
type Result = ReturnType<typeof externalLib.doSomething>;

// ✅ 대안 2: 래퍼 함수 + 명시적 타입
function wrappedDoSomething(): ExpectedType {
  return externalLib.doSomething() as ExpectedType;
}

// ✅ 대안 3: 타입 선언 파일 작성 (.d.ts)
declare module 'external-lib' {
  export function doSomething(): ExpectedType;
}
```

#### 빈 catch 블록이 필요할 것 같을 때
```typescript
// ❌ 금지
try { risky(); } catch {}

// ✅ 대안 1: 에러 로깅
try { risky(); } catch (e) {
  console.error('Operation failed:', e);
}

// ✅ 대안 2: 조용한 실패가 의도적일 때 명시
try { risky(); } catch {
  // 의도적 무시: 이 작업은 실패해도 UX에 영향 없음
}

// ✅ 대안 3: Result 패턴
const result = safeRisky(); // { ok: true, value } | { ok: false, error }
if (!result.ok) { /* 처리 */ }
```

### Required Process (필수 프로세스)

Before any fix (수정 전 반드시):
1. **Identify root cause (WHY, not just WHAT)** - 근본 원인 파악
2. **Explain why naive fixes are wrong** - 단순 수정(삭제/하드코딩/비활성화)이 왜 잘못인지 설명
3. **Verify existing functionality is preserved** - 기존 기능 유지 확인
4. **Check for hardcoded values** - 하드코딩된 값이 있는지 확인

### Quality Standards (품질 기준)
- Structural solutions over superficial patches (표면적 패치보다 구조적 해결)
- Handle edge cases explicitly (엣지 케이스 명시적 처리)
- Follow project conventions (프로젝트 컨벤션 준수)
- Add comments explaining WHY (WHY를 설명하는 주석)
- **Single Source of Truth** - 모든 데이터는 하나의 출처에서만 정의

### When Uncertain (불확실할 때)
Ask before: removing code, changing core logic, breaking changes, adding hardcoded values.
(다음 작업 전 질문: 코드 제거, 핵심 로직 변경, 브레이킹 체인지, 하드코딩 추가)

## Response Rules (응답 규칙)

> **AI 응답 시 반드시 준수할 규칙**

| Rule | Description |
|------|-------------|
| **확인 전 단정 금지** | Don't assert before verifying - 추측하지 말고 코드를 확인 |
| **추측 명시** | Mark assumptions as assumptions - "~인 것 같습니다" 대신 확인 |
| **출처 명시** | Cite sources - 파일 경로, 라인 번호 포함 |
| **완전한 코드** | Always provide complete code - `// ...` 금지 |

```typescript
// ❌ 나쁜 응답
"이 함수는 아마 에러를 던질 것 같습니다."

// ✅ 좋은 응답
"packages/core/src/validation.ts:42 확인 결과,
validateId()는 빈 문자열에 대해 ValidationError를 던집니다."
```

## File-Specific Rules (파일별 규칙)

### Allowed Actions (허용)

| File/Directory | Allowed Actions |
|----------------|-----------------|
| `packages/core/src/` | 순수 함수, 타입 정의, 상수 정의 |
| `packages/data/src/schemas/` | Zod 스키마 정의 및 수정 |
| `packages/ui/src/components/` | React 컴포넌트 추가/수정 |
| `data/**/*.json` | 데이터 추가 (스키마 준수) |
| `apps/*/app/routes/` | 라우트 컴포넌트 추가/수정 |
| `apps/*/app/components/` | 앱 전용 컴포넌트 |

### Prohibited Actions (금지)

| File/Directory | Prohibited Actions |
|----------------|-------------------|
| `packages/core/` | 브라우저 API 사용 (window, document, DOM) |
| `packages/*/package.json` | 버전 직접 수정 (syncpack 사용) |
| `react-router.config.ts` | `ssr: true` 설정 |
| `data/**/*.json` | 스키마 미준수 데이터 추가 |
| `*.browser.ts` | SSG 빌드 시점에 실행되는 코드 |
| `*.noop.ts` | 실제 로직 구현 (빈 구현만) |

### Data Directory Rules (데이터 디렉토리 규칙)

```
data/
├── context/           # Context 앱 데이터
│   └── entries/       # 978개 한국어 단어 (JSON)
│       ├── greetings.json
│       ├── food.json
│       └── ...
├── roots/             # Roots 앱 데이터
│   └── concepts/      # 438개 수학 개념 (JSON)
│       ├── algebra.json
│       ├── geometry.json
│       └── ...
└── permissive/        # Permissive 앱 데이터
    ├── libraries.json # 88개 라이브러리
    └── web-apis.json  # 56개 Web API
```

| Rule | Description |
|------|-------------|
| **SSoT** | 각 도메인 데이터는 data/ 디렉토리에서만 정의 |
| **스키마 검증** | 모든 JSON은 @soundblue/data의 Zod 스키마 준수 |
| **ID 규칙** | kebab-case, 100자 이내, 영문+숫자+하이픈만 |
| **i18n** | 다국어 필드는 `{ en: string, ko: string }` 형태 |

## i18n Rules (다국어 규칙)

### URL-based Routing (URL 기반 라우팅)

```
/              → English (default)
/ko            → Korean
/entry/hello   → English entry page
/ko/entry/hello → Korean entry page
```

### Route File Convention (라우트 파일 규칙)

```
apps/context/app/routes/
├── _index.tsx           # / (English)
├── ko._index.tsx        # /ko (Korean)
├── entry.$entryId.tsx   # /entry/:id (English)
├── ko.entry.$entryId.tsx # /ko/entry/:id (Korean)
└── ...
```

| Rule | Description |
|------|-------------|
| **ko. 접두어** | 한국어 라우트는 `ko.` 접두어 필수 |
| **동일 컴포넌트** | 영어/한국어 라우트는 같은 컴포넌트 재사용 |
| **loader 공유** | 데이터 로딩 로직은 공유 함수로 분리 |

### i18n in Components (컴포넌트 내 다국어)

```typescript
// ✅ 올바른 패턴 - Paraglide 사용
import * as m from '@/paraglide/messages';

function WelcomeMessage() {
  return <h1>{m.welcome()}</h1>;  // 컴파일 타임 번역
}

// ✅ 올바른 패턴 - 데이터 기반
function EntryTitle({ entry }: { entry: Entry }) {
  const locale = useLocale();
  return <h1>{entry.title[locale]}</h1>;  // { en: 'Hello', ko: '안녕' }
}

// ❌ 금지 - 하드코딩된 번역
function BadExample() {
  const locale = useLocale();
  return <h1>{locale === 'ko' ? '안녕하세요' : 'Hello'}</h1>;
}
```

## Component Writing Rules (컴포넌트 작성 규칙)

### Location Rules (위치 규칙)

| Component Type | Location | Example |
|----------------|----------|---------|
| **공통 UI** | `packages/ui/src/components/` | Button, Modal, Card |
| **공통 패턴** | `packages/ui/src/patterns/` | SearchDropdown, VirtualList |
| **앱 전용** | `apps/*/app/components/` | EntryCard, ConceptGraph |
| **라우트 전용** | `apps/*/app/routes/*.tsx` | 페이지 컴포넌트 |

### Component Structure (컴포넌트 구조)

```typescript
/**
 * @description 컴포넌트 설명
 * @example
 * <MyComponent title="Hello" onClick={handleClick} />
 */
interface MyComponentProps {
  /** 제목 텍스트 */
  title: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 추가 클래스 */
  className?: string;
}

export function MyComponent({ title, onClick, className }: MyComponentProps) {
  return (
    <div className={cn('base-styles', className)} onClick={onClick}>
      {title}
    </div>
  );
}
```

### Component Rules (컴포넌트 규칙)

| Rule | Description |
|------|-------------|
| **Props 타입** | interface로 정의, JSDoc 주석 필수 |
| **cn() 사용** | className 병합은 항상 cn() 사용 |
| **forwardRef** | DOM 접근 필요 시 forwardRef 사용 |
| **에러 경계** | 데이터 의존 컴포넌트는 ErrorBoundary로 감싸기 |

## Performance Optimization Rules (성능 최적화 규칙)

### Bundle Size (번들 크기)

```typescript
// ✅ 트리 쉐이킹 가능한 import
import { debounce } from '@soundblue/core/utils';

// ❌ 전체 패키지 import 금지
import * as utils from '@soundblue/core/utils';
```

### Lazy Loading (지연 로딩)

```typescript
// ✅ 큰 컴포넌트는 lazy import
const ConceptGraph = lazy(() => import('./components/ConceptGraph'));

// ✅ 조건부 렌더링과 함께
{showGraph && (
  <Suspense fallback={<Skeleton />}>
    <ConceptGraph data={data} />
  </Suspense>
)}
```

### Image Optimization (이미지 최적화)

| Rule | Description |
|------|-------------|
| **WebP/AVIF** | 이미지는 WebP 또는 AVIF 포맷 사용 |
| **Lazy loading** | `loading="lazy"` 속성 필수 |
| **width/height** | CLS 방지를 위해 크기 명시 |
| **srcset** | 반응형 이미지는 srcset 사용 |

### Virtualization (가상화)

```typescript
// ✅ 긴 리스트는 가상화 필수
import { VirtualList } from '@soundblue/ui/patterns';

function LongList({ items }: { items: Item[] }) {
  return (
    <VirtualList
      items={items}
      itemHeight={64}
      renderItem={(item) => <ListItem item={item} />}
    />
  );
}
```

## Quality Metrics (The Perfect Dodecagon)

> **12가지 품질 지표. 코드 작성 시 이 지표들이 저해되면 경고하고 대안 제시.**

### I. Stability & Maintainability
| # | 지표 | 도구 | 검증 시점 |
|---|------|------|----------|
| 1 | Test Coverage | Vitest + coverage-v8 (≥80%) | CI |
| 2 | Visual Coverage | Playwright + pixelmatch | CI |
| 3 | Code Health | size-limit, TypeScript strict | CI |
| 4 | Monorepo Integrity | skott, syncpack | CI |

### II. Performance & Reach
| # | 지표 | 도구 | 검증 시점 |
|---|------|------|----------|
| 5 | Lighthouse Score | @lhci/cli (≥90) | CI |
| 6 | SEO Health | verify-ssg.ts (메타태그 검증) | Build |
| 7 | Static Integrity | broken-link-checker | Build 후 |

### III. User Experience & Adaptation
| # | 지표 | 도구 | 검증 시점 |
|---|------|------|----------|
| 8 | PWA Readiness | vite-plugin-pwa | Build |
| 9 | Mobile Optimality | Playwright (터치 타겟 ≥44px) | CI |
| 10 | Responsive | Playwright (320px~4K) | CI |
| 11 | Accessibility | axe-core + Playwright | CI |

### IV. Security & Privacy
| # | 지표 | 도구 | 검증 시점 |
|---|------|------|----------|
| 12 | Client Security | CSP 헤더 (public/_headers) | 배포 |

### 검증 분리
- **pre-commit**: Biome + tsc --noEmit
- **CI 병렬 실행**:
  - Job 1: Vitest, skott, syncpack
  - Job 2: Playwright (visual, a11y, mobile, responsive)
  - Job 3: Lighthouse CI
  - Job 4: broken-link-checker, size-limit

### CI 구현 현황 (2025-12-24 기준)

| # | 지표 | CI 구현 | 비고 |
|---|------|:-------:|------|
| 1 | Test Coverage | ✅ | `pnpm test:coverage` |
| 2 | Visual Coverage | ✅ | Playwright + pixelmatch |
| 3 | Code Health | ✅ | `pnpm check:size`, `pnpm typecheck` |
| 4 | Monorepo Integrity | ✅ | `pnpm check:circular`, `pnpm check:versions` |
| 5 | Lighthouse Score | ✅ | `pnpm lhci autorun` |
| 6 | SEO Health | ✅ | `pnpm verify:ssg` (Job 4) |
| 7 | Static Integrity | ✅ | `pnpm check:links` |
| 8 | PWA Readiness | ✅ | Job 6: pwa-security |
| 9 | Mobile Optimality | ✅ | Job 5: ux-quality |
| 10 | Responsive | ✅ | Job 5: ux-quality |
| 11 | Accessibility | ✅ | Job 5: ux-quality |
| 12 | Client Security | ✅ | Job 6: pwa-security |

> **모든 12가지 품질 지표 CI 구현 완료** (2025-12-24)

### Action Rule (행동 규칙)

When writing code, if any of the 12 metrics is compromised (코드 작성 시 12가지 지표 중 하나라도 저해되면):
1. **Warn immediately** (즉시 경고)
2. **Suggest alternatives** (대안 제시)
3. **Do not proceed without user confirmation** (사용자 확인 없이 진행 금지)

### Priority Resolution (지표 충돌 시 우선순위)

> **12가지 지표가 충돌할 때 아래 순서로 판단**

```
┌─────────────────────────────────────────────────────────────────┐
│  1️⃣ Accessibility (접근성)           ← 최우선, 법적 요구사항      │
│  2️⃣ Security (보안)                  ← 데이터 보호 필수          │
│  3️⃣ Functionality (기능 정확성)       ← 올바르게 작동해야 함       │
│  4️⃣ Performance (성능)               ← 사용자 경험 직결          │
│  5️⃣ SEO / Static Integrity           ← 검색 노출 영향           │
│  6️⃣ Code Health / Test Coverage      ← 유지보수성               │
└─────────────────────────────────────────────────────────────────┘
```

#### 충돌 시나리오 및 판단

| 충돌 상황 | 우선 | 판단 근거 |
|----------|------|----------|
| 성능 vs 접근성 | 접근성 | 법적 요구사항, 100ms 차이보다 접근성 |
| 번들 크기 vs 코드 가독성 | 가독성 | 50KB 미만 차이면 가독성 우선 |
| 테스트 커버리지 vs 배포 속도 | 커버리지 | 커버리지 80% 미만이면 배포 보류 |
| Lighthouse vs 기능 | 기능 | 기능이 깨지면 점수 무의미 |
| SEO vs 보안 | 보안 | 민감 정보 노출 방지 우선 |

#### 예외: 사용자 명시적 요청

사용자가 명시적으로 우선순위를 지정하면 그에 따름:
```
"성능 최우선으로 해줘" → 성능 > 접근성 (이 경우만)
"일단 빠르게 배포해야 해" → 기능 > 테스트 (이 경우만)
```

단, 보안 저해는 사용자 요청이 있어도 경고 필수.
