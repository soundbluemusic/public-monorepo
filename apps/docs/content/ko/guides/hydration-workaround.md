---
title: Hydration 버그 대응
description: React Router v7 + React 19 SSG hydration 버그 수정 이해 및 유지보수
---

이 문서는 React Router v7 + React 19 SSG 환경에서 알려진 버그에 대한 **중요한 해결책**을 설명합니다.

:::caution[삭제 금지]
`entry.client.tsx`의 orphan DOM 정리 코드는 필수입니다. 삭제하면 모든 버튼 클릭이 작동하지 않습니다.
:::

## 문제

React Router v7 SSG (`ssr: false`) hydration이 실패할 때:

1. React 19가 새로운 DOM 트리를 생성
2. 기존 서버 렌더링 HTML이 **삭제되지 않음**
3. DOM 중복 발생 → 사용자가 보는 버튼에 React 핸들러 없음 → **클릭 불가**

```
┌─────────────────────────────────────────┐
│  Hydration 전 (SSG HTML)                │
│  ┌─────────────────────────────────┐    │
│  │  <div> (서버 렌더링)             │    │
│  │    <button>클릭하세요</button>   │ ← 사용자가 보는 부분
│  │  </div>                         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Hydration 후 (버그)                    │
│  ┌─────────────────────────────────┐    │
│  │  <div> (orphan - 핸들러 없음)    │ ← 여전히 보임!
│  │    <button>클릭하세요</button>   │    │
│  │  </div>                         │    │
│  │  <div> (React - 핸들러 있음)     │ ← 뒤에 숨겨짐
│  │    <button>클릭하세요</button>   │    │
│  │  </div>                         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## 해결책

각 앱의 `entry.client.tsx`에서 hydration 후 orphan DOM을 제거합니다:

```typescript
// apps/*/app/entry.client.tsx
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

startTransition(() => {
  hydrateRoot(document, <StrictMode><App /></StrictMode>);

  // Orphan DOM 정리 (React Router v7 SSG 버그 workaround)
  setTimeout(() => {
    const divs = [...document.body.children].filter(el => el.tagName === 'DIV');
    if (divs.length >= 2) {
      const firstDiv = divs[0] as HTMLElement;
      // div에 React 내부 속성이 있는지 확인
      if (!Object.keys(firstDiv).some(k => k.startsWith('__react'))) {
        firstDiv.remove();
      }
    }
  }, 100);
});
```

### 작동 방식

1. React hydration이 완료될 때까지 100ms 대기
2. 모든 최상위 `<div>` 요소 찾기
3. 2개 이상의 div가 있으면 첫 번째 확인
4. React 내부 속성(`__react*`)이 없으면 orphan → 제거

## 보호된 파일

| 파일 | 목적 | 보호 이유 |
|------|---------|---------------|
| `apps/*/app/entry.client.tsx` | Hydration + orphan 정리 | 삭제 시 모든 클릭 불가 |
| `apps/*/app/entry.server.tsx` | SSG HTML 생성 | `prerender` 함수 필수 |

## 관련 이슈

- [React Router #12893](https://github.com/remix-run/react-router/issues/12893)
- [React Router #12360](https://github.com/remix-run/react-router/discussions/12360)
- [React Router #13368](https://github.com/remix-run/react-router/issues/13368)

## 수정 테스트

workaround가 작동하는지 확인하려면:

```bash
# 1. 앱 빌드
pnpm build:context

# 2. 빌드 미리보기
pnpm preview:context

# 3. 브라우저에서 확인:
#    - 버튼이 클릭 가능한지
#    - 중복 콘텐츠가 보이지 않는지
#    - 콘솔에 hydration 오류가 없는지
```

## 문제 해결

### 버튼이 여전히 클릭 안 됨

1. `entry.client.tsx`가 존재하고 정리 코드가 있는지 확인
2. 타임아웃(100ms)이 너무 짧지 않은지 확인
3. hydration 중 콘솔 오류 확인

### 콘텐츠가 깜빡임

1. 100ms 지연이 느린 연결에서 보일 수 있음
2. 필요하면 타임아웃을 늘리되, 최소한으로 유지

## 관련 문서

- [SSG 심층 분석](/public-monorepo/ko/guides/ssg-deep-dive/) — SSG 아키텍처 이해
- [문제 해결](/public-monorepo/ko/guides/troubleshooting/) — 일반적인 문제와 해결책
