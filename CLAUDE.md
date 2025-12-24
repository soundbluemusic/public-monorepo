# Project Overview

프로젝트 개요, 기술 스택, 구조, 명령어: @README.md

## 절대 규칙 (CRITICAL RULES)

> **이 규칙들은 절대 위반하지 말 것. CMS, 외부 DB, 서버 로직 제안 금지.**

1. **100% SSG Only** - 모든 앱은 정적 사이트 생성만 사용. SSR/서버 로직 절대 금지.
   - `ssr: false` + `prerender()` + `loader()` in `react-router.config.ts` = 빌드 시 정적 HTML + 데이터 생성
   - React Router v7 권장 패턴: `loader()` 함수로 빌드타임 데이터 프리렌더링 → `.data` 파일 생성
   - 빌드 출력: `build/client` (HTML + JS + .data 파일), 런타임 서버 없음, CDN에서 직접 서빙
   - 각 앱 SSG 라우트: Context 348개, Roots 70개, Permissive 7개
2. **오픈소스 Only** - 모든 라이브러리/도구는 오픈소스만 사용.
3. **웹 표준 API Only** - 브라우저 표준 API만 사용. 벤더 종속 API 금지.
4. **로컬 스토리지 Only** - DB는 localStorage, IndexedDB만 사용. 외부 DB/CMS 절대 금지.

## Code Quality Rules (코드 품질 규칙)

### Absolute Prohibitions (절대 금지) ⛔

> **이 규칙들을 위반하면 즉시 중단하고 근본 원인을 파악할 것**

#### 1. 하드코딩 절대 금지 (NO HARDCODING)
```
❌ NEVER DO THIS:
- 테스트 통과를 위한 하드코딩된 값
- 빌드 에러 회피를 위한 임시 상수
- "일단 동작하게" 하려는 매직 넘버
- 특정 환경에서만 작동하는 고정값
- 에러 메시지를 숨기기 위한 기본값

✅ ALWAYS DO THIS:
- 동적으로 계산/조회
- 환경 변수 또는 설정 파일 사용
- 타입 시스템으로 강제
- 런타임 검증 추가
```

**하드코딩 감지 시 즉시 질문:**
1. "왜 이 값이 고정되어야 하는가?"
2. "이 값이 변경되면 어디가 깨지는가?"
3. "이 값의 출처(source of truth)는 어디인가?"

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
