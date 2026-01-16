---
title: 아키텍처
description: 모노레포의 렌더링 모드와 패키지 레이어 시스템 이해하기
---

# 아키텍처 개요

이 문서는 SoundBlue Public Monorepo에서 사용하는 아키텍처 결정과 패턴을 설명합니다.

## 렌더링 모드

각 애플리케이션은 용도에 맞게 최적화된 렌더링 모드를 사용합니다:

| 앱 | 모드 | 데이터 소스 | 설명 |
|----|------|------------|------|
| **Context** | **SSR + D1** | Cloudflare D1 | 16,836개 항목을 동적 제공 |
| **Permissive** | SSR | In-memory | 웹 개발 자료 |
| **Roots** | SSG | TypeScript | 920개 수학 페이지 사전 렌더링 |

### SSR + D1 아키텍처 (Context)

```
┌─────────────────────────────────────────────────────────────────┐
│  런타임 (Cloudflare Pages Functions)                            │
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

### SSR 설정 패턴 (Context)

```typescript
// react-router.config.ts
export default {
  ssr: true,  // ← SSR 모드 - D1 쿼리를 런타임에 실행
  async prerender() {
    // 정적 페이지만 (홈, 소개, 카테고리)
    return [...staticRoutes, ...categoryRoutes];
  },
} satisfies Config;
```

### SSG 아키텍처 (Roots)

```
┌─────────────────────────────────────────────────────────────────┐
│  빌드 시점                                                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ prerender() │ → │  loader()   │ → │  HTML + .data │         │
│  │ (라우트 목록)│    │ (데이터 조회)│    │  (정적 파일)  │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  런타임 (CDN)                                                    │
│  정적 HTML 즉시 제공 — 서버 불필요                                │
└─────────────────────────────────────────────────────────────────┘
```

### SSG 설정 패턴 (Roots)

```typescript
// react-router.config.ts
export default {
  ssr: false,  // ← SSG 모드 - 모든 페이지 빌드 시 사전 렌더링
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const conceptRoutes = generateI18nRoutes(concepts, `/concept/`);
    return [...staticRoutes, ...conceptRoutes];
  },
} satisfies Config;
```

## 패키지 레이어 시스템

모노레포는 엄격한 레이어 아키텍처를 따릅니다:

```
Layer 3 (앱 + UI)
┌─────────────────────────────────────┐
│  apps/*  +  @soundblue/ui          │
│  @soundblue/features               │
└────────────────┬────────────────────┘
                 │
Layer 2 (도메인)
┌────────────────┴────────────────────┐
│  @soundblue/i18n   @soundblue/seo  │
│  @soundblue/search @soundblue/pwa  │
└────────────────┬────────────────────┘
                 │
Layer 1 (데이터)
┌────────────────┴────────────────────┐
│  @soundblue/data  @soundblue/platform │
└────────────────┬────────────────────┘
                 │
Layer 0 (기반)
┌────────────────┴────────────────────┐
│  @soundblue/core  @soundblue/config │
└─────────────────────────────────────┘
```

### 레이어 규칙

- **Layer N은 Layer N-1 이하만 import 가능**
- 앱 (Layer 3)은 모든 패키지에서 import 가능
- `@soundblue/i18n` (Layer 2)은 `@soundblue/ui` (Layer 3)에서 import 불가
- `@soundblue/core` (Layer 0)는 다른 패키지에서 import 불가

## 디렉토리 구조

```
public-monorepo/
├── apps/                    # 애플리케이션 (Layer 3)
│   ├── context/            # 한국어 사전
│   ├── permissive/         # 웹 개발 자료
│   └── roots/              # 수학 문서
│
├── packages/               # 공유 패키지 (10개)
│   ├── core/              # Layer 0: 검증, 유틸리티, 타입
│   ├── config/            # Layer 0: Vite, Tailwind 설정
│   ├── data/              # Layer 1: Zod 스키마, 로더
│   ├── platform/          # Layer 1: IndexedDB 스토리지
│   ├── i18n/              # Layer 2: URL 라우팅, Paraglide
│   ├── search/            # Layer 2: MiniSearch 래퍼
│   ├── seo/               # Layer 2: 메타 태그, 사이트맵
│   ├── pwa/               # Layer 2: 서비스 워커
│   ├── features/          # Layer 3: 설정, 토스트
│   └── ui/                # Layer 3: React 컴포넌트
│
├── data/                   # JSON 데이터 (단일 소스)
│   ├── context/           # 사전 항목
│   └── roots/             # 수학 콘텐츠
│
├── docs/                   # 문서
│   └── docs-site/         # Starlight 문서 사이트
│
└── tests/                  # E2E 테스트
```

## i18n 라우팅

URL 경로 기반 언어 감지 (쿼리 파라미터가 아님):

| URL | 언어 |
|-----|------|
| `/entry/hello` | 영어 (기본) |
| `/ko/entry/hello` | 한국어 |

모든 라우트는 빌드 시점에 각 언어로 복제됩니다.

## SEO 구현

### Canonical & Hreflang

```html
<!-- /entry/hello (영어 페이지) -->
<link rel="canonical" href="https://context.soundbluemusic.com/entry/hello" />
<link rel="alternate" hreflang="en" href="https://context.soundbluemusic.com/entry/hello" />
<link rel="alternate" hreflang="ko" href="https://context.soundbluemusic.com/ko/entry/hello" />
<link rel="alternate" hreflang="x-default" href="https://context.soundbluemusic.com/entry/hello" />
```

### Meta Factory 패턴

```typescript
// 정적 라우트
export const meta = metaFactory({
  ko: { title: '소개 - Context', description: '한국어 사전 소개' },
  en: { title: 'About - Context', description: 'About Korean Dictionary' },
}, 'https://context.soundbluemusic.com');

// 동적 라우트
export const meta = dynamicMetaFactory<typeof loader>({
  getTitle: (data) => `${data.entry.word} - Context`,
  getDescription: (data) => data.entry.translations.explanation,
  baseUrl: 'https://context.soundbluemusic.com',
});
```

## 핵심 규칙

### 1. 각 앱의 렌더링 모드 준수

```typescript
// Context (SSR + D1)
export default { ssr: true, ... }

// Roots (SSG)
export default { ssr: false, ... }

// ❌ SPA 모드 사용 금지 (loader 없이 클라이언트만 렌더링)
```

### 2. 하드코딩 금지

```typescript
// ✅ 데이터 파일 사용
const entries = await loadEntries();

// ❌ 하드코딩 금지
const entries = [{ id: 'hello', ... }];
```

### 3. Hydration 우회 코드

React Router v7 + React 19 SSG hydration 버그로 인해 우회 코드가 필요합니다:

```typescript
// apps/*/app/entry.client.tsx - 삭제 금지!
setTimeout(() => {
  const divs = [...document.body.children].filter(el => el.tagName === 'DIV');
  if (divs.length > 1 && Object.keys(divs[0]).some(k => k.startsWith('__react'))) {
    divs[0].remove();
  }
}, 100);
```

## 다음 단계

- [패키지 문서](/public-monorepo/ko/packages/) - 각 공유 패키지 알아보기
- [기여 가이드](/public-monorepo/ko/contributing/) - 이 프로젝트에 기여하는 방법
