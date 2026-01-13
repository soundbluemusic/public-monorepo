---
title: 규칙
description: AI 어시스턴트를 위한 중요 규칙 - 금지 사항과 필수 사항
---

## 금지 사항 (DO NOT)

### 1. SSG 모드 변경

:::danger[엄격히 금지]
- `ssr: true` 설정
- SPA, SSR, ISR 모드 전환
- `prerender()` 제거/비우기
- 빈 `<div id="root"></div>` HTML
:::

### 2. 하드코딩

- 테스트 통과용 하드코딩 값
- 매직 넘버 (명명된 상수 사용)
- 환경별 고정값

```typescript
// ❌ 금지
const MAX_ITEMS = 100;  // 매직 넘버
if (userId === "user123") { ... }  // 하드코딩

// ✅ 올바름
const MAX_ITEMS = LIMITS.MAX_SEARCH_RESULTS;
if (userId === targetUserId) { ... }
```

### 3. 에러 숨기기

- 빈 catch 블록
- 설명 없는 `@ts-ignore`
- 타입 체크 우회를 위한 `any` 타입
- 에러 숨기기 위한 코드 삭제/주석 처리

```typescript
// ❌ 금지
try { ... } catch {}  // 빈 catch
// @ts-ignore
const data: any = response;  // any 타입 우회

// ✅ 올바름
try { ... } catch (error) {
  console.error('Fetch 실패:', error);
  throw error;
}
// @ts-ignore - 서드파티 라이브러리 타입 누락 (issue #123)
```

### 4. 불완전한 코드

```typescript
// ❌ 금지
function processData() {
  // ... existing code ...
  // TODO: validation 구현
}

// ✅ 올바름 - 항상 완전한 구현 제공
function processData(data: Input): Output {
  const validated = validateInput(data);
  const processed = transform(validated);
  return processed;
}
```

### 5. 과적합 / 임시방편

- 특정 테스트 케이스만 통과하는 조건문
- 에러 메시지 문자열 매칭 기반 분기
- 증상만 숨기는 try-catch
- 근본 원인 이해 없이 수정

### 6. 다운그레이드 (다운그레이드 금지 정책)

:::danger[절대 다운그레이드 금지]
문제 해결을 위한 패키지 버전 다운그레이드는 **절대 금지**입니다.
:::

```typescript
// ❌ 금지: 다운그레이드
"react": "^17.0.0"  // 문제로 18에서 다운그레이드

// ✅ 허용: 업그레이드 + 코드 수정
"react": "^19.0.0"  // 최신 버전 + API 변경에 맞는 코드 수정

// ✅ 허용: 격리
"pnpm": { "overrides": { "zod": "^3.25.0" } }  // 충돌 격리
```

**왜?** 다운그레이드는 기술 부채를 누적합니다. 수학적 증명처럼 한번 검증된 것(빌드, 테스트)은 변경 불가해야 합니다.

---

## 필수 사항 (MUST DO)

### 응답 규칙

| 규칙 | 설명 |
|------|-------------|
| **한글 응답 필수** | 모든 설명과 문서는 한글로 |
| **추측 금지** | 답변 전 코드 확인 |
| **완전한 코드** | `// ...` 사용 금지 |
| **출처 명시** | `파일:라인` 형식으로 참조 |
| **UI 검증** | 코드 변경 후 실제 UI에서 확인 |

### 수정 전 체크리스트

변경하기 전:

1. ✅ 근본 원인(WHY)을 이해했는가?
2. ✅ 기존 기능이 유지되는가?
3. ✅ 하드코딩된 값이 있는가?
4. ✅ 모든 유사한 경우에 작동하는가?

---

## 파일별 규칙

### 허용

| 위치 | 허용 액션 |
|----------|----------------|
| `packages/core/` | 순수 함수, 타입, 상수 (브라우저 API 금지) |
| `packages/data/schemas/` | Zod 스키마 |
| `packages/ui/components/` | React 컴포넌트 |
| `apps/*/routes/` | 라우트 컴포넌트 |
| `data/**/*.json` | 스키마 준수 데이터 |

### 금지

| 위치 | 금지 액션 |
|----------|-------------------|
| `react-router.config.ts` | `ssr: true` |
| `*.browser.ts` | SSG 빌드 시점 실행 코드 |
| `*.noop.ts` | 실제 로직 (빈 구현만) |
| `entry.client.tsx` | orphan DOM 정리 로직 삭제 |

---

## i18n / SEO 규칙

### URL 라우팅

```
/entry/hello     → 영어
/ko/entry/hello  → 한국어
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

## 관련 문서

- [AI 가이드라인 개요](/public-monorepo/ko/ai-guidelines/) — 빠른 참조
- [레이어 시스템](/public-monorepo/ko/ai-guidelines/layer-system/) — Import 레이어 규칙
