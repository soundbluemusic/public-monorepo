---
title: 파일 제한
description: 수정하면 안 되는 파일과 그 이유
---

이 코드베이스의 특정 파일들은 보호되어 있으며, 그 중요한 역할을 이해하지 않고는 수정해서는 안 됩니다.

## 보호된 파일

### `entry.client.tsx`

**위치:** `apps/*/app/entry.client.tsx`

**목적:** 클라이언트 측 hydration + orphan DOM 정리

:::danger[정리 코드 삭제 금지]
orphan DOM 정리 코드는 React Router v7 + React 19 SSR 버그에 대한 해결책입니다. 삭제하면 모든 버튼 클릭이 작동하지 않습니다.
:::

```typescript
// 이 코드는 반드시 유지
setTimeout(() => {
  const divs = [...document.body.children].filter(el => el.tagName === 'DIV');
  if (divs.length >= 2) {
    const firstDiv = divs[0] as HTMLElement;
    if (!Object.keys(firstDiv).some(k => k.startsWith('__react'))) {
      firstDiv.remove();
    }
  }
}, 100);
```

자세한 내용은 [Hydration 버그 대응](/public-monorepo/ko/guides/hydration-workaround/)을 참조하세요.

### `entry.server.tsx`

**위치:** `apps/*/app/entry.server.tsx`

**목적:** SSR HTML 생성

:::caution[prerender 제거 금지]
`prerender` export는 SSR 사전 렌더링이 작동하는 데 필수입니다. 제거하면 빌드가 실패합니다.
:::

### `react-router.config.ts`

**위치:** `apps/*/react-router.config.ts`

**목적:** React Router 설정

:::danger[각 앱의 렌더링 모드 준수]
각 앱은 고유한 렌더링 모드가 있습니다. 아키텍처를 이해하지 않고 변경하지 마세요.
:::

```typescript
// Context 앱 - SSR + D1 (ssr: false로 변경 금지)
export default { ssr: true, ... }

// Roots 앱 - SSR (ssr: false로 변경 금지)
export default { ssr: true, async prerender() { ... } }

// Permissive 앱 - SSR (ssr: false로 변경 금지)
export default { ssr: true, async prerender() { ... } }
```

## 파일 명명 규칙

### `*.browser.ts`

`.browser.ts`로 끝나는 파일은 **브라우저에서만** 실행됩니다:
- 브라우저 API 사용 (localStorage, IndexedDB 등)
- SSR 빌드 시점 코드에서 import 금지
- 필요시 SSR용 `.noop.ts` 파일 필요

### `*.noop.ts`

`.noop.ts`로 끝나는 파일은 SSR 호환성을 위한 **무작업 스텁**입니다:
- 빈/기본 구현 제공
- 브라우저 코드에 빌드 시점 fallback이 필요할 때 사용
- 실제 로직 포함 금지

```typescript
// storage.noop.ts - SSR fallback
export const storage = {
  get: () => null,
  set: () => {},
  clear: () => {},
};
```

### `*.server.ts`

`.server.ts`로 끝나는 파일은 **빌드 중에만** 실행됩니다:
- 정적 콘텐츠 생성
- 데이터 처리
- 클라이언트 번들에 포함되지 않음

## 디렉토리 제한

### `packages/core/`

**허용:** 순수 함수, 타입, 상수
**금지:** 브라우저 API, React 컴포넌트, 부작용

### `packages/data/schemas/`

**허용:** Zod 스키마만
**금지:** 데이터 가져오기, 변환

### `data/**/*.json`

**허용:** Zod 스키마와 일치하는 JSON 파일
**금지:** 스키마를 따르지 않는 데이터

## 수정 체크리스트

보호된 파일을 수정하기 전:

1. ✅ 이 코드가 왜 존재하는지 이해했는가?
2. ✅ 관련 문서를 읽었는가?
3. ✅ 내 변경이 렌더링 모드(SSR/SSG)를 깨뜨리는가?
4. ✅ 내 변경이 hydration을 깨뜨리는가?
5. ✅ 프로덕션 빌드에서 테스트했는가?

## 관련 문서

- [Hydration 버그 대응](/public-monorepo/ko/guides/hydration-workaround/) — entry.client.tsx가 보호되는 이유
- [SSG 심층 분석](/public-monorepo/ko/guides/ssg-deep-dive/) — SSG 아키텍처 이해
- [환경 태그](/public-monorepo/ko/reference/environment-tags/) — 파일 환경 주석
