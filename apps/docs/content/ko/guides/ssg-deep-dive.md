---
title: 렌더링 모드
description: React Router v7과 Cloudflare Workers를 활용한 SSR 아키텍처 이해
---

이 프로젝트는 모든 앱에서 **SSR (Server-Side Rendering)**을 사용하며, **Cloudflare Workers**에 배포됩니다.

## 앱별 렌더링 모드

| 앱 | 모드 | 데이터 소스 | 용도 |
|:---|:-----|:-----------|:-----|
| **Context** | **SSR + D1** | Cloudflare D1 | 16,836 엔트리 (100만+까지 확장 가능) |
| **Roots** | SSR | TypeScript | 438 개념 |
| **Permissive** | SSR | In-memory | 88 라이브러리, 56 Web APIs |

:::note[모드 선택 가이드]

- **SSR + D1**: 대규모/자주 업데이트되는 콘텐츠 (1,000개 이상)
- **SSR + In-memory**: 소규모/정적 콘텐츠
- **SPA**: 절대 금지 (SEO 불가능)

:::

---

## SSR + D1 아키텍처 (Context 앱)

Context 앱은 무제한 확장성을 위해 **SSR + Cloudflare D1**을 사용합니다.

```text
┌─────────────────────────────────────────────────────────────────┐
│  런타임 (Cloudflare Workers)                                     │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  클라이언트 │ → │ Workers  │ → │    D1     │                  │
│  │  요청     │    │  (SSR)   │    │ 데이터베이스│                  │
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

### SSR Loader 패턴 (D1)

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

## SSR 아키텍처 (Roots/Permissive 앱)

Roots와 Permissive 앱은 **SSR + Cloudflare Workers**를 사용하며 인메모리 데이터를 사용합니다.

```text
┌─────────────────────────────────────────────────────────────────┐
│  빌드 시점                                                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ prerender() │ → │  loader()   │ → │  Static HTML  │         │
│  │ (정적 페이지)│    │ (정적 데이터)│    │  (CDN 캐시)   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              +
┌─────────────────────────────────────────────────────────────────┐
│  런타임 (Cloudflare Workers)                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Request    │ → │  Workers    │ → │  SSR HTML     │         │
│  │ /concept/:id│    │  loader()   │    │  (dynamic)   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### SSR 설정

```typescript
// apps/roots/react-router.config.ts
export default {
  ssr: true,  // SSR 모드
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const conceptRoutes = generateI18nRoutes(concepts, (c) => `/concept/${c.id}`);
    return [...staticRoutes, ...conceptRoutes];
  },
} satisfies Config;
```

### SSR Loader 패턴 (In-memory)

```typescript
// apps/roots/app/routes/($locale).concept.$conceptId.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const concept = getConceptById(params.conceptId);
  if (!concept) throw new Response('Not Found', { status: 404 });
  return { concept };
}
```

---

## 왜 모든 앱에 SSR을 사용하나요?

| 요소 | SSR + Workers |
|:----|:-------------|
| **배포** | 통합된 Cloudflare Workers |
| **확장성** | 무제한 |
| **데이터 최신성** | 실시간 |
| **빌드 시간** | 빠름 (~30초) |
| **SEO** | 첫 요청에 완전한 HTML |

---

## 금지된 모드

:::danger[절대 사용 금지]

- **SPA 모드** — 빈 `<div id="root"></div>`는 SEO를 망침
- **ISR 모드** — Cloudflare Workers에서 지원하지 않음

:::

---

## 관련 문서

- [SSR 마이그레이션 가이드](/public-monorepo/ko/guides/ssr-migration/) — SSR로 마이그레이션한 이유
- [Hydration 버그 대응](/public-monorepo/ko/guides/hydration-workaround/) — React 19 hydration 버그 수정
- [문제 해결](/public-monorepo/ko/guides/troubleshooting/) — 일반적인 빌드 오류
