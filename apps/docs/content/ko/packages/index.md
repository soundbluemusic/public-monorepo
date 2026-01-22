---
title: 패키지 개요
description: 모노레포의 10개 공유 패키지와 레이어 아키텍처 개요
sidebar:
  order: 1
---

# 패키지 개요

모노레포는 엄격한 레이어 시스템으로 구성된 **10개의 공유 패키지**를 포함합니다. 각 패키지는 특정 역할을 가지며, 하위 레이어의 패키지만 import할 수 있습니다.

## 레이어 아키텍처

```
Layer 3 (앱 + UI)       @soundblue/ui, @soundblue/features
        ↓
Layer 2 (도메인)        @soundblue/i18n, @soundblue/search, @soundblue/seo, @soundblue/pwa
        ↓
Layer 1 (데이터)        @soundblue/data, @soundblue/platform
        ↓
Layer 0 (기반)          @soundblue/core, @soundblue/config
```

## 레이어 규칙

- **Layer N은 Layer N-1 이하만 import 가능**
- 같은 레이어 내 패키지 간 순환 의존 금지
- 앱 (Layer 3)은 모든 패키지에서 import 가능

## 패키지 요약

### Layer 0: 기반

| 패키지 | 설명 |
|--------|------|
| [@soundblue/core](/public-monorepo/ko/packages/core/) | 순수 함수, 타입, 검증 유틸리티 |
| [@soundblue/config](/public-monorepo/ko/packages/config/) | Vite, Tailwind, Biome 설정 |

### Layer 1: 데이터

| 패키지 | 설명 |
|--------|------|
| [@soundblue/data](/public-monorepo/ko/packages/data/) | Zod 스키마와 데이터 로더 |
| [@soundblue/platform](/public-monorepo/ko/packages/platform/) | IndexedDB 스토리지 (Dexie.js) |

### Layer 2: 도메인

| 패키지 | 설명 |
|--------|------|
| [@soundblue/i18n](/public-monorepo/ko/packages/i18n/) | URL 기반 i18n 라우팅, Paraglide 통합 |
| [@soundblue/search](/public-monorepo/ko/packages/search/) | MiniSearch 래퍼와 React 훅 |
| [@soundblue/seo](/public-monorepo/ko/packages/seo/) | 메타 태그, 사이트맵, 구조화 데이터 |
| [@soundblue/pwa](/public-monorepo/ko/packages/pwa/) | 서비스 워커, manifest 생성 |

### Layer 3: UI 및 기능

| 패키지 | 설명 |
|--------|------|
| [@soundblue/features](/public-monorepo/ko/packages/features/) | 설정 스토어, 토스트, 미디어 쿼리 |
| [@soundblue/ui](/public-monorepo/ko/packages/ui/) | React 컴포넌트, 애니메이션, UI 프리미티브 |

## 설치

모든 패키지는 내부 워크스페이스 패키지입니다. pnpm 워크스페이스를 사용하여 연결됩니다:

```json
{
  "dependencies": {
    "@soundblue/core": "workspace:*",
    "@soundblue/ui": "workspace:*"
  }
}
```

## 환경 태그

각 모듈은 실행 환경이 태그됩니다:

| 태그 | 설명 |
|------|------|
| `@environment build-only` | 빌드 시점에만 실행 (Node.js) |
| `@environment client-only` | 브라우저에서만 실행 |
| `@environment universal` | 빌드와 런타임 모두 안전 |

```typescript
/**
 * @environment build-only
 * 빌드 시점에만 사이트맵 생성.
 */
export function generateSitemap() {}

/**
 * @environment client-only
 * SSG 빌드 중에는 undefined 반환.
 */
export function useOnlineStatus() {}

/**
 * @environment universal
 * 순수 함수, 어디서든 안전.
 */
export function cn(...classes: string[]) {}
```
