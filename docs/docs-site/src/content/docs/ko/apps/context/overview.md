---
title: Context 개요
description: Context - 학습자를 위한 한국어 사전 전체 문서
sidebar:
  order: 1
---

# Context — 한국어 사전

**학습자를 위한 한국어 사전** | 33,748 SSG 페이지

Context는 한국어 학습자를 위해 특별히 설계된 맥락 기반 한국어 사전입니다. 단어 의미, 예문, 관련 표현을 사용자 친화적인 인터페이스로 제공합니다.

## 라이브 데모

🌐 **[context.soundbluemusic.com](https://context.soundbluemusic.com)**

## 기능

### 📚 종합 사전

- **33,748개 항목** - 초급부터 고급까지 어휘 제공
- 실제 사용 예시가 포함된 맥락 기반 정의
- 관련 표현 및 연어
- 이중 언어 지원 (한국어/영어)

### 🔍 스마트 검색

- 한국어 로마자 표기 지원 즉시 검색
- 입력 시 자동 추천
- 한국어, 영어, 로마자 표기로 검색

### 🌐 다국어 인터페이스

- 영어 및 한국어 UI 완벽 지원
- URL 기반 언어 전환 (`/entry/...` vs `/ko/entry/...`)
- 적절한 canonical 및 hreflang 태그로 SEO 최적화

### 📱 PWA 지원

- Progressive Web App으로 설치 가능
- 서비스 워커 캐싱으로 오프라인 사용 가능
- Stale-while-revalidate 캐싱 전략

## 프로젝트 구조

```
apps/context/
├── app/
│   ├── components/      # React 컴포넌트
│   ├── routes/          # React Router 라우트
│   ├── data/            # 항목 데이터 로더
│   ├── hooks/           # 커스텀 React 훅
│   └── utils/           # 유틸리티 함수
├── public/              # 정적 자산
└── react-router.config.ts  # SSG 설정
```

## 주요 라우트

| 라우트 | 설명 |
|--------|------|
| `/` | 검색이 있는 홈페이지 |
| `/entry/:entryId` | 개별 항목 페이지 (영어) |
| `/ko/entry/:entryId` | 개별 항목 페이지 (한국어) |
| `/about` | 소개 페이지 |
| `/sitemap.xml` | XML 사이트맵 |

## SSG 설정

Context는 React Router v7의 prerender 패턴을 사용합니다:

```typescript
// react-router.config.ts
export default {
  ssr: false,  // SSG 모드
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const entryRoutes = generateI18nRoutes(entries, `/entry/`);
    return [...staticRoutes, ...entryRoutes];
  },
} satisfies Config;
```

## 개발

### 개발 서버 시작

```bash
pnpm dev:context
# → http://localhost:3003
```

### 프로덕션 빌드

```bash
pnpm build:context
```
