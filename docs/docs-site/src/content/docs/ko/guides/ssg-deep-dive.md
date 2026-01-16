---
title: 렌더링 모드
description: React Router v7을 활용한 SSG와 SSR 아키텍처 이해
---

이 프로젝트는 최적의 성능과 확장성을 위해 앱별로 다른 렌더링 모드를 사용합니다.

## 앱별 렌더링 모드

| 앱 | 모드 | 데이터 소스 | 페이지 | 용도 |
|:---|:-----|:-----------|:------:|:-----|
| **Context** | **SSR + D1** | Cloudflare D1 | 동적 | 16,836 엔트리 (100만+까지 확장 가능) |
| **Roots** | SSG | TypeScript | 920 | 438 개념 (정적 콘텐츠) |
| **Permissive** | SSR | In-memory | 8 | 소규모 정적 데이터 |

:::note[모드 선택 가이드]

- **SSR + D1**: 대규모/자주 업데이트되는 콘텐츠 (1,000개 이상)
- **SSG**: 소규모/거의 업데이트되지 않는 콘텐츠 (1,000페이지 미만)
- **SPA**: ❌ 절대 금지 (SEO 불가능)

:::

---

## SSR + D1 아키텍처 (Context 앱)

Context 앱은 무제한 확장성을 위해 **SSR + Cloudflare D1**을 사용합니다.

```text
┌─────────────────────────────────────────────────────────────────┐
│  런타임 (Cloudflare Pages Functions)                             │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  클라이언트 │ → │  Pages   │ → │    D1     │                  │
│  │  요청     │    │ Function │    │ 데이터베이스│                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│       ↑                               │                         │
│       └───────────────────────────────┘                         │
│              SSR HTML 응답                                       │
└─────────────────────────────────────────────────────────────────┘
```

### SSR 설정

```typescript
// apps/context/react-router.config.ts
export default {
  ssr: true,  // SSR 모드 - 런타임에 D1 쿼리
  async prerender() {
    // 정적 페이지만 (홈, about, 카테고리)
    // Entry 페이지는 D1에서 동적으로 제공
    return [...staticRoutes, ...categoryRoutes];
  },
} satisfies Config;
```

### SSR Loader 패턴

```typescript
// apps/context/app/routes/($locale).entry.$entryId.tsx
export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  if (!db) throw new Response('Database unavailable', { status: 503 });

  const entry = await db.prepare('SELECT * FROM entries WHERE id = ?')
    .bind(params.entryId).first();

  if (!entry) throw new Response('Not Found', { status: 404 });
  return { entry };
}
```

---

## SSG 아키텍처 (Roots 앱)

Roots 앱은 정적 수학 문서를 위해 **SSG**를 사용합니다.

```text
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

### SSG 설정

```typescript
// apps/roots/react-router.config.ts
export default {
  ssr: false,  // SSG 모드 - 빌드 시 모든 페이지 사전 렌더링
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const conceptRoutes = generateI18nRoutes(concepts, (c) => `/concept/${c.id}`);
    return [...staticRoutes, ...conceptRoutes];
  },
} satisfies Config;
```

### SSG Loader 패턴

```typescript
// apps/roots/app/routes/($locale).concept.$conceptId.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const concept = getConceptById(params.conceptId);
  if (!concept) throw new Response('Not Found', { status: 404 });
  return { concept };  // → 빌드 시 .data 파일로 저장됨
}
```

---

## 왜 다른 모드를 사용하나요?

| 요소 | SSG (Roots) | SSR + D1 (Context) |
|:----|:------------|:-------------------|
| **콘텐츠 크기** | 438 개념 | 16,836 엔트리 |
| **업데이트 빈도** | 드물게 | 자주 |
| **빌드 시간** | ~2분 | 해당 없음 (동적) |
| **확장성** | 빌드에 제한됨 | 무제한 |
| **데이터 최신성** | 빌드 시점 스냅샷 | 실시간 |

---

## 금지된 모드

:::danger[절대 사용 금지]

- **SPA 모드** — 빈 `<div id="root"></div>`는 SEO를 망침
- **ISR 모드** — Cloudflare Pages에서 지원하지 않음
- **대규모 콘텐츠에 SSG** — 규모에서 빌드 실패

:::

---

## 관련 문서

- [SSR 마이그레이션 가이드](/public-monorepo/ko/guides/ssr-migration/) — Context를 SSR로 마이그레이션한 이유
- [Hydration 버그 대응](/public-monorepo/ko/guides/hydration-workaround/) — React 19 SSG 버그 수정
- [문제 해결](/public-monorepo/ko/guides/troubleshooting/) — 일반적인 빌드 오류
