---
name: rendering-check
description: SSR 규칙 위반 검사. 모든 앱이 SSR 모드로 동작하는지 확인
---

# Rendering Check 스킬

렌더링 모드 규칙 위반을 검사하는 스킬입니다.

## ⛔ SPA 모드 차단 (BLOCKED)

> **SPA 모드는 이 프로젝트에서 차단/거부됩니다.**
> SEO가 불가능하므로 **SSR만 허용**합니다.
>
> **SPA 전환 요청 시 거부하세요.** 대안으로 SSR을 제안하세요.

## SPA 차단 이유

| 모드 | HTML 출력 | SEO |
|:-----|:----------|:----|
| **SPA** | `<div id="root"></div>` (빈 HTML) | ❌ 불가능 |
| **SSR** | 완전한 HTML (서버 렌더링) | ✅ 가능 |

검색 엔진은 JavaScript를 실행하지 않습니다. SPA는 빈 HTML을 반환하므로 **검색 노출이 불가능**합니다.

## 앱별 렌더링 모드

| App | Mode | 배포 대상 | 데이터 소스 |
|:----|:-----|:----------|:-----------|
| **Context** | SSR + D1 | Cloudflare Workers | Cloudflare D1 |
| **Permissive** | SSR | Cloudflare Workers | Cloudflare D1 |
| **Roots** | SSR | Cloudflare Workers | Cloudflare D1 |

**모든 앱은 SSR + Cloudflare Workers로 배포됩니다.**

## 자동 실행 지시

**이 스킬이 호출되면 즉시 다음을 수행하세요:**

1. Bash tool로 `pnpm verify:ssr` 실행
2. 동적 라우트 loader 검사 (아래 참조)
3. 결과 분석 후 요약 출력
4. 오류 발견 시 해당 파일 확인 및 수정 제안

```bash
pnpm verify:ssr
```

## 검사 항목

### 모든 앱 (SSR)

| 항목 | 기준 | SEO 영향 |
|:-----|:-----|:---------|
| TanStack Start 플러그인 | vite.config.ts에서 `tanstackStart` 사용 | SSR 모드 필수 |
| Cloudflare 플러그인 | vite.config.ts에서 `cloudflare` 사용 | Workers 배포 필수 |
| HTML 출력 | 빈 `<div id="root">` 없음 | 콘텐츠 포함 필수 |
| **동적 라우트 loader** | `$param` 라우트에 loader 필수 | **SEO 데이터 필수** |
| D1 바인딩 | wrangler.toml에 DB 바인딩 | 데이터 접근 필수 |

## SSR 패턴 (TanStack Start)

```typescript
// ✅ TanStack Start - createFileRoute + loader
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/entry/$entryId')({
  loader: async ({ params }) => {
    const entry = await fetchEntry(params.entryId);
    if (!entry) throw notFound();
    return { entry };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData.entry.korean }],
  }),
  component: EntryPage,
});
```

## params.locale 사용 금지 (중요!)

> **⛔ `params.locale`은 파일 기반 라우팅에서 항상 `undefined`입니다!**

### 원인

TanStack Start 파일 기반 라우팅에서 `routes/ko/entry/$entryId.tsx`로 정의하면 `ko`는 **폴더명(고정 문자열)**입니다.
따라서 `params.locale`은 항상 `undefined`가 됩니다.

### 금지 패턴

```typescript
// ❌ 모든 요청에서 'en'을 반환 (params.locale이 항상 undefined이므로)
const locale = params.locale === 'ko' ? 'ko' : 'en';
const locale = params.locale || 'en';
```

### 올바른 패턴

```typescript
import { getLocaleFromPath } from '@soundblue/i18n';

// ✅ loader에서 (location.pathname 사용)
export const Route = createFileRoute('/entry/$entryId')({
  loader: async ({ params, location }) => {
    const locale = getLocaleFromPath(location.pathname);  // '/ko/entry/...' → 'ko'
    const entry = await fetchEntry(params.entryId, locale);
    if (!entry) throw notFound();
    return { entry, locale };
  },
});

// ✅ 컴포넌트에서 (useLocation 사용)
function EntryPage() {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname);
}
```

### 검사 방법

```bash
# params.locale 사용 검색
grep -r "params\.locale" apps/*/app/routes/
```

## 관련 파일

| 파일 | 역할 |
|:-----|:-----|
| `apps/*/vite.config.ts` | TanStack Start + Cloudflare 설정 |
| `apps/*/wrangler.toml` | Workers + D1 바인딩 설정 |
| `scripts/verify-html.ts` | HTML 검증 스크립트 |

## 검증 명령어 요약

```bash
# SSR 빌드 검증
pnpm verify:ssr

# params.locale 사용 검색 (금지됨)
grep -r "params\.locale" apps/*/app/routes/

# Context SSR HTML 검증
curl -s https://context.soundbluemusic.com/entry/annyeong | head -50
# 기대값: <title>안녕 | Context</title>, 본문 콘텐츠 포함
```
