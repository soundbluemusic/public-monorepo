# CLAUDE.md - AI Assistant Guidelines

> **프로젝트 정보**: @README.md | **아키텍처**: @ARCHITECTURE.md

---

## ⛔ 절대 금지 (DO NOT)

### 1. SSG 모드 변경 금지
- `ssr: true` 설정 금지
- SPA, SSR, ISR 모드 전환 금지
- `prerender()` 제거/빈 배열 반환 금지
- 빈 `<div id="root"></div>` HTML 금지

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
| `react-router.config.ts` | `ssr: true` |
| `*.browser.ts` | SSG 빌드 시점 실행 코드 |
| `*.noop.ts` | 실제 로직 (빈 구현만) |
| `entry.client.tsx` | orphan DOM 정리 로직 삭제 |

---

## 🌐 i18n / SEO 규칙

### URL 라우팅
```
/entry/hello     → English
/ko/entry/hello  → Korean
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
| `/explore [질문]` | 코드베이스 구조 분석 (fork context) |
| `/find [검색어]` | 파일/함수 위치 검색 (haiku) |
| `/ssg-check` | SSG 규칙 위반 검사 (fork context) |
| `/layer-check` | import 레이어 규칙 검사 (fork context) |
| `/link-check` | 프로덕션 URL 링크 무결성 검사 (lychee) |

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
