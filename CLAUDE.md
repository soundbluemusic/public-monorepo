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

## 시작 전

1. `AGENTS.md`, `README.md`, `ARCHITECTURE.md`를 먼저 확인합니다.
2. 버전과 스크립트의 기준은 각 `package.json`과 잠금 파일입니다.
3. 관련 파일만 좁게 탐색하고 기존 패턴을 확인한 뒤 수정합니다.
4. 기능 변경은 검증 가능한 완료 조건을 먼저 정합니다.

## 절대 규칙

### SSR 전용

- 세 앱 모두 Astro의 `output: 'server'`와 Cloudflare adapter를 사용합니다.
- SPA 모드, 빈 `<div id="root"></div>`, 클라이언트 전용 페이지 전환은 금지합니다.
- 모든 페이지는 서버 응답 HTML에 실제 제목과 본문을 포함해야 합니다.
- SEO용 메타데이터, canonical, hreflang도 서버에서 완성해야 합니다.

| 앱 | 로컬 포트 | 데이터 | 배포 |
|:---|:---:|:---|:---|
| Context | 3003 | Cloudflare D1 | Workers |
| Permissive | 3004 | TypeScript 데이터 | Workers |
| Roots | 3005 | TypeScript 데이터 | Workers |

### Context D1

- Worker bindings는 `DB`와 `PRIVATE_DB`를 모두 유지합니다.
- 현재 `cloudflare:workers`의 `env` 접근 패턴을 따릅니다.
- 제거된 `Astro.locals.runtime` 패턴을 다시 도입하지 않습니다.
- D1 schema, migration, binding 변경은 로컬 타입 검사만으로 완료 처리하지 않습니다.

| 항목 | 현재 기준 |
|:---|:---|
| 엔트리 수 | 16,394 entries + 52 categories |
| 회화 수 | 53 conversations |

### 의존성과 인프라

- 패키지를 다운그레이드하지 않습니다. 업그레이드나 코드 수정으로 해결합니다.
- Turborepo Remote Cache를 활성화하지 않습니다. 로컬 캐시만 사용합니다.
- R2 대량 업로드는 `wrangler r2 object put` 반복문이 아니라 `rclone`을 사용합니다.
- `rclone sync`는 원본에 없는 대상 파일을 삭제하므로 source, target, account를 먼저 확인합니다.
- 비밀값, 토큰, 계정 정보를 코드나 로그에 남기지 않습니다.

### 코드 안전

- 하드코딩, 테스트 맞춤형 분기, 임시 우회로 문제를 숨기지 않습니다.
- `any`, 빈 `catch`, 설명 없는 `@ts-ignore`, 미완료 `TODO`를 추가하지 않습니다.
- 요청과 무관한 리팩터링, 이름 변경, 포맷 변경을 섞지 않습니다.
- 사용자 변경을 보존하고, 삭제나 대량 생성 전 정확한 대상을 확인합니다.

## 구조

### 패키지 레이어

의존성은 아래 방향만 허용하며 순환 참조를 만들지 않습니다.

```text
L3 apps, ui, features
  ↓
L2 i18n, search, seo, pwa
  ↓
L1 data, platform
  ↓
L0 core, config
```

### 페이지와 다국어

- 영어와 한국어 라우트 파일은 모두 유지합니다.
- 실제 페이지 콘텐츠는 가능한 한 `src/components/pages/`에 한 번만 둡니다.
- `src/pages/`와 `src/pages/ko/`는 locale을 전달하는 얇은 wrapper로 유지합니다.
- locale은 URL pathname에서 결정합니다. 브라우저 언어나 상태로 SSR 결과를 바꾸지 않습니다.
- 공통 메타데이터와 canonical은 `BaseLayout` 및 기존 SEO 유틸리티를 사용합니다.

### 주요 위치

| 목적 | 위치 |
|:---|:---|
| 앱 | `apps/context`, `apps/permissive`, `apps/roots` |
| 공유 패키지 | `packages/` |
| 데이터 원본 | `data/` |
| Astro 설정 | `apps/*/astro.config.mjs` |
| Worker 설정 | `apps/*/wrangler.toml` |
| CI | `.github/workflows/` |

## 작업 흐름

1. 현 상태와 실패를 재현하거나 기준값을 기록합니다.
2. 원인과 가장 작은 해결 범위를 정합니다.
3. 관련 파일만 수정합니다.
4. 위험에 비례해 검사합니다.
5. 변경, 검증 결과, 남은 위험을 보고합니다.

개발 중에는 전체 빌드 대신 대상 앱의 dev server와 필터 명령을 우선합니다.

| 목적 | 명령 |
|:---|:---|
| 설치 | `pnpm install` |
| Context 개발 | `pnpm dev:context` |
| Permissive 개발 | `pnpm dev:permissive` |
| Roots 개발 | `pnpm dev:roots` |
| 타입 검사 | `pnpm typecheck` |
| 린트 | `pnpm lint` |
| 단위 테스트 | `pnpm test` |
| 전체 품질 검사 | `pnpm quality` |
| E2E | `pnpm test:e2e` |

- 커밋 전 최소 검증은 `pnpm typecheck && pnpm lint && pnpm test`입니다.
- `pnpm check:size`는 명시적으로 요청받지 않으면 로컬에서 실행하지 않습니다.
- SSR 검증 시 빌드 성공만 보지 말고 응답 HTML의 실제 콘텐츠를 확인합니다.
- 배포가 범위에 포함되면 CI, Worker 배포 상태, 실제 도메인을 각각 확인합니다.
- UI 변경은 브라우저에서 데스크톱과 모바일 레이아웃 및 상호작용을 확인합니다.

## 품질 우선순위

1. 접근성
2. 보안
3. 기능 정확성
4. 성능
5. SEO
6. 코드 품질

## 보고 방식

- 사용자 응답과 저장소 문서는 한국어를 기본으로 합니다.
- 확인하지 않은 내용을 사실처럼 말하지 않습니다.
- 중요한 판단은 가능한 경우 `파일:줄` 근거를 제시합니다.
- 완료 보고는 아래처럼 간단히 정리합니다.

| 구분 | 내용 |
|:---|:---|
| 이전 | 문제 또는 기준 |
| 변경 | 수정한 내용 |
| 효과 | 확인된 결과 |

## 토큰 절약

- 넓은 디렉터리 전체 읽기보다 `rg`, 대상 파일, 심볼 검색을 우선합니다.
- 대규모 탐색은 `explore` 또는 `find` skill을 사용해 요약만 가져옵니다.
- 빌드 산출물, 캐시, 잠금 파일, 대형 데이터는 `.claudeignore`를 따릅니다.
- 긴 로그는 파일로 남기고 오류 요약과 마지막 관련 부분만 확인합니다.
- 이미 확인한 파일을 반복해서 전부 읽지 않습니다.
- 임시 문서를 추가하기보다 기존 문서 한 곳을 최신 상태로 유지합니다.

## 기술 기준

- 앱: Astro 7, React 19, Cloudflare Workers SSR
- 스타일: Tailwind CSS 4
- 앱 TypeScript: 6.0.3
- 공유 패키지 TypeScript: 7.0.2
- 패키지 관리자: pnpm 11
- Worker compatibility flags: `nodejs_compat`, `fetch_iterable_type_support`

버전이 바뀔 수 있는 판단은 기억에 의존하지 말고 현재 `package.json`, 잠금 파일,
Astro와 Cloudflare의 공식 문서를 확인합니다.

## 참고 문서

- `README.md`: 앱과 명령 개요
- `ARCHITECTURE.md`: 레이어와 SSR 구조
- `CONTRIBUTING.md`: 기여 절차
- `package.json`: 실제 명령과 도구 버전
- `.github/workflows/`: CI와 배포 기준

## 답변 형식

- 답변은 항상 가능한 한 짧게 핵심만. 장황한 설명 금지.
