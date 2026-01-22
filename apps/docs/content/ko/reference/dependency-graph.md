---
title: 의존성 그래프
description: 모노레포의 패키지 의존성 시각적 표현
---

이 페이지는 모노레포에서 패키지와 앱이 서로 어떻게 의존하는지 시각화합니다.

## 패키지 의존성

```
apps/context ─────────┬─── @soundblue/ui
apps/roots ───────────┤    @soundblue/features
apps/permissive ──────┘    @soundblue/pwa
                           │
                           ▼
                      @soundblue/i18n
                      @soundblue/search
                      @soundblue/seo
                           │
                           ▼
                      @soundblue/data
                      @soundblue/platform
                           │
                           ▼
                      @soundblue/core
                      @soundblue/config
```

## 상세 의존성

### Apps → Packages

| 앱 | 직접 의존성 |
|-----|---------------------|
| `apps/context` | ui, features, pwa, i18n, search, seo, data, core |
| `apps/roots` | ui, features, pwa, i18n, seo, data, core |
| `apps/permissive` | ui, features, i18n, seo, core |

### Layer 3 → Layer 2

| 패키지 | 의존성 |
|---------|--------------|
| `@soundblue/ui` | i18n, seo, core |
| `@soundblue/features` | i18n, data, platform, core |

### Layer 2 → Layer 1

| 패키지 | 의존성 |
|---------|--------------|
| `@soundblue/i18n` | data, core |
| `@soundblue/search` | data, core |
| `@soundblue/seo` | core |
| `@soundblue/pwa` | platform, core |

### Layer 1 → Layer 0

| 패키지 | 의존성 |
|---------|--------------|
| `@soundblue/data` | core |
| `@soundblue/platform` | core |

### Layer 0 (의존성 없음)

| 패키지 | 의존성 |
|---------|--------------|
| `@soundblue/core` | 없음 (기반) |
| `@soundblue/config` | 없음 (기반) |

## 외부 의존성

### 빌드 도구

```
Vite ────────────────────→ 모든 앱
Turborepo ───────────────→ 모노레포 오케스트레이션
TypeScript ──────────────→ 모든 패키지
Tailwind CSS v4 ─────────→ @soundblue/config, @soundblue/ui
```

### 런타임 라이브러리

```
React 19 ────────────────→ 모든 앱, @soundblue/ui
React Router v7 ─────────→ 모든 앱
Dexie.js ────────────────→ @soundblue/platform
MiniSearch ──────────────→ @soundblue/search
Zod ─────────────────────→ @soundblue/data
Paraglide ───────────────→ @soundblue/i18n
```

## 순환 의존성 방지

레이어 시스템은 순환 의존성을 방지합니다:

```
✅ L3 → L2 → L1 → L0   (허용: 하향만)
❌ L0 → L1             (금지: 상향)
❌ L2 → L2             (금지: 같은 레이어)
```

### 감지

커스텀 스킬로 확인:

```bash
/layer-check
```

다음과 같은 위반을 보고합니다:

```
ERROR: @soundblue/core imports from @soundblue/platform
       L0 cannot import from L1
```

## 관련 문서

- [레이어 시스템](/public-monorepo/ko/ai-guidelines/layer-system/) — Import 규칙
- [아키텍처](/public-monorepo/ko/guides/architecture/) — 전체 아키텍처 개요
- [패키지 개요](/public-monorepo/ko/packages/) — 패키지 문서
