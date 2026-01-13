---
title: SSG 심층 분석
description: React Router v7을 활용한 정적 사이트 생성 아키텍처 이해
---

이 프로젝트는 **100% 정적 사이트 생성(SSG)**을 사용합니다 — 34,676개의 모든 페이지가 빌드 시점에 사전 렌더링되어 CDN에서 직접 제공됩니다.

:::caution[SSG 전용]
이 프로젝트는 SSG 전용입니다. SPA, SSR, ISR 모드는 금지됩니다.
:::

## 작동 원리

React Router v7의 `prerender()` + `loader()` 패턴으로 빌드 시 완전한 HTML을 생성합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│  빌드 시점                                                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ prerender() │ → │  loader()   │ → │  HTML + .data │         │
│  │ (라우트 목록)│    │ (데이터 가져오기)│   │  (정적 파일)  │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  런타임 (CDN)                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  정적 HTML이 즉시 제공됨 — 서버 필요 없음                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 앱별 SSG 페이지 수

| 앱 | 동적 라우트 | SSG 페이지 | 데이터 소스 |
|:----|:---------------|:---------:|:------------|
| **Context** | 16,836 엔트리 + 25 카테고리 + 53 대화 | 33,748 | JSON |
| **Roots** | 438 개념 + 18 분야 | 920 | TypeScript |
| **Permissive** | 4개 정적 라우트 | 8 | 배열 리터럴 |
| **총계** | — | **34,676** | — |

## 코드 패턴

### 설정 (`react-router.config.ts`)

```typescript
export default {
  ssr: false,  // SSG 모드 - 변경 금지
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const entryRoutes = generateI18nRoutes(entries, (e) => `/entry/${e.id}`);
    return [...staticRoutes, ...entryRoutes];
  },
} satisfies Config;
```

### 로더가 있는 라우트 (`routes/entry.$entryId.tsx`)

```typescript
export async function loader({ params }: Route.LoaderArgs) {
  const entry = getEntryById(params.entryId);
  if (!entry) throw new Response('Not Found', { status: 404 });
  return { entry };  // → 빌드 시 .data 파일로 저장됨
}

export default function EntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  return <EntryView entry={entry} />;
}
```

## 왜 SSG인가?

| 장점 | 설명 |
|---------|-------------|
| **즉시 로딩** | CDN 엣지 로케이션에서 사전 렌더링된 HTML 제공 |
| **비용 제로** | 유지할 서버 인프라 없음 |
| **보안** | 서버가 없으면 서버 취약점도 없음 |
| **SEO 최적화** | 검색 엔진이 사용할 수 있는 완전한 HTML 콘텐츠 |

## 금지된 변경 사항

:::danger[수정 금지]
- 설정에서 `ssr: true` 설정
- `prerender()` 함수 제거 또는 비우기
- 빈 `<div id="root"></div>`로 SPA 전환
:::

## 관련 문서

- [Hydration 버그 대응](/public-monorepo/ko/guides/hydration-workaround/) — React 19 SSG 버그 수정
- [문제 해결](/public-monorepo/ko/guides/troubleshooting/) — 일반적인 빌드 오류
