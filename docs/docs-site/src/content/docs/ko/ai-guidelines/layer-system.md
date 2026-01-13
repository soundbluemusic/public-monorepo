---
title: 레이어 시스템
description: 패키지 import 레이어 규칙 및 의존성 관리
---

모노레포는 의존성 관리와 순환 import 방지를 위해 4계층 시스템을 사용합니다.

## 레이어 다이어그램

```
Layer 3 (Apps + UI)     ┌─────────────────────────────────────────────┐
                        │  apps/context, apps/roots, apps/permissive  │
                        │  @soundblue/ui, @soundblue/features         │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 2 (Domain)        ┌─────────────────────────────────────────────┐
                        │  @soundblue/i18n     @soundblue/search      │
                        │  @soundblue/seo      @soundblue/pwa         │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 1 (Data)          ┌─────────────────────────────────────────────┐
                        │  @soundblue/data     @soundblue/platform    │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 0 (Foundation)    ┌─────────────────────────────────────────────┐
                        │  @soundblue/core     @soundblue/config      │
                        └─────────────────────────────────────────────┘
```

## Import 규칙

```
L3 (apps, ui, features) → L2 (i18n, search, seo, pwa) → L1 (data, platform) → L0 (core, config)
```

### 규칙 1: 하위 레이어만 Import

Layer N은 Layer N-1 이하에서만 import 가능합니다.

```typescript
// ✅ 올바름
// L3 컴포넌트에서
import { validateId } from '@soundblue/core/validation';  // L0
import { storage } from '@soundblue/platform/storage';    // L1
import { useSearch } from '@soundblue/search/react';      // L2

// ❌ 금지
// L0 (core)에서
import { storage } from '@soundblue/platform';  // L0 → L1 금지!

// L2 (i18n)에서
import { Button } from '@soundblue/ui';  // L2 → L3 금지!
```

### 규칙 2: 순환 의존 금지

같은 레이어의 패키지는 서로 import할 수 없습니다.

```typescript
// ❌ 금지 - 둘 다 L2
// @soundblue/i18n에서
import { SearchEngine } from '@soundblue/search';

// @soundblue/search에서
import { getLocale } from '@soundblue/i18n';
```

### 규칙 3: 앱 전용 코드는 앱에 유지

특정 앱에만 해당하는 코드는 공유 패키지에 있으면 안 됩니다.

```typescript
// ❌ 금지
// packages/ui/components/ContextEntryCard.tsx
// Context 앱 전용 컴포넌트!

// ✅ 올바름
// apps/context/app/components/EntryCard.tsx
// 앱 전용 컴포넌트는 앱에 유지
```

## 레이어별 패키지 상세

### Layer 0: Foundation

| 패키지 | 설명 | Export |
|---------|-------------|---------|
| `@soundblue/core` | 순수 함수, 타입, 검증 | `/validation`, `/utils`, `/types` |
| `@soundblue/config` | Vite, Tailwind, TS 설정 | `/vite`, `/tailwind` |

**L0에서는 브라우저 API 사용 금지.**

### Layer 1: Data

| 패키지 | 설명 | Export |
|---------|-------------|---------|
| `@soundblue/data` | Zod 스키마, 데이터 로더 | `/schemas`, `/loaders` |
| `@soundblue/platform` | IndexedDB 스토리지 (Dexie) | `/storage` |

### Layer 2: Domain

| 패키지 | 설명 | Export |
|---------|-------------|---------|
| `@soundblue/i18n` | 다국어 라우팅, Paraglide | `/`, `/react` |
| `@soundblue/search` | MiniSearch 래퍼 | `/`, `/react`, `/worker` |
| `@soundblue/seo` | 메타 태그, 사이트맵 | `/meta`, `/sitemap` |
| `@soundblue/pwa` | 서비스 워커, 오프라인 | `/react`, `/manifest` |

### Layer 3: UI & Features

| 패키지 | 설명 | Export |
|---------|-------------|---------|
| `@soundblue/features` | 설정, 토스트, 미디어 훅 | `/settings`, `/toast`, `/media` |
| `@soundblue/ui` | React 컴포넌트 | `/components`, `/patterns`, `/feedback`, `/primitives` |

## 레이어 위반 검사

커스텀 스킬로 위반 검사:

```bash
/layer-check
```

코드베이스를 스캔하고 레이어 규칙을 위반하는 import를 보고합니다.

## 관련 문서

- [AI 가이드라인 개요](/public-monorepo/ko/ai-guidelines/) — 빠른 참조
- [규칙](/public-monorepo/ko/ai-guidelines/rules/) — 금지/필수 액션
- [아키텍처](/public-monorepo/ko/guides/architecture/) — 전체 아키텍처 개요
