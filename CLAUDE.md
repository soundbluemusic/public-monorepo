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

---

## ✅ 필수 준수 (MUST DO)

### 응답 규칙
| 규칙 | 설명 |
|------|------|
| **한글 답변 필수** | 모든 설명과 대답은 반드시 한글로 작성 |
| **확인 전 단정 금지** | 추측 말고 코드 확인 후 답변 |
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

- **20턴마다 `/compact`** - 자동(95%)보다 선제적으로
- **파일 직접 지정** - `@src/file.ts` (전체 탐색 방지)
- **작업 완료 후 새 세션** - 컨텍스트 축적 방지
- **`.claudeignore`** - 불필요한 파일 자동 제외

---

## 📚 공식 문서

| 기술 | 문서 |
|------|------|
| Tailwind CSS v4 | [tailwindcss.com](https://tailwindcss.com/docs) |
| React Router v7 | [reactrouter.com](https://reactrouter.com) |
| TypeScript | [typescriptlang.org](https://www.typescriptlang.org/docs) |
