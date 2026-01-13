---
title: 변경 로그
description: 버전 히스토리 및 주요 변경 사항
---

## v2.1.0 (2026-01-02)

### 추가
- SSG Hydration Workaround 문서화
- React Router v7 + React 19 hydration 버그 수정
- `entry.client.tsx` orphan DOM 정리 로직

### 문서
- Hydration Workaround 가이드 추가
- 보호된 파일 관련 아키텍처 문서 업데이트

---

## v2.0.0 (2025-12-31)

### Breaking Changes
- `@soundblue/shared` 패키지 제거
- `@soundblue/shared-react` 패키지 제거
- 새로운 레이어 시스템 (L0-L3)이 평면 구조 대체

### 추가
- `@soundblue/config` — Vite, Tailwind 설정
- `@soundblue/platform` — IndexedDB 스토리지
- `@soundblue/seo` — 메타 태그, 사이트맵
- `@soundblue/pwa` — 서비스 워커, 오프라인
- `@soundblue/features` — 설정, 토스트, 미디어
- `@soundblue/ui` — React 컴포넌트

### 변경
- 패키지 수: 6개 → 10개 (모듈화)
- 4계층 의존성 시스템 도입
- 레이어 간 엄격한 import 규칙

### 마이그레이션 가이드

```typescript
// 이전 (v1.x)
import { cn, validateId } from '@soundblue/shared';
import { useToast, Button } from '@soundblue/shared-react';

// 이후 (v2.x)
import { validateId } from '@soundblue/core/validation';
import { cn } from '@soundblue/core/utils';
import { useToast } from '@soundblue/features/toast';
import { Button } from '@soundblue/ui/components';
```

---

## v1.0.0 (초기 릴리스)

### 기능
- 3개 앱: Context, Permissive, Roots
- 6개 패키지: core, data, search, i18n, shared, shared-react
- 100% SSG 아키텍처
- 다국어 지원 (en, ko)

### 패키지 (v1.0)
| 패키지 | 설명 |
|---------|-------------|
| `@soundblue/core` | 순수 함수, 타입 |
| `@soundblue/data` | Zod 스키마, 로더 |
| `@soundblue/search` | MiniSearch 래퍼 |
| `@soundblue/i18n` | 다국어 라우팅 |
| `@soundblue/shared` | 공유 유틸리티 |
| `@soundblue/shared-react` | React 컴포넌트 |

---

## 업그레이드 가이드

### v1.x → v2.x

1. **import 업데이트** — 위의 마이그레이션 가이드 따르기
2. **레이어 규칙 확인** — `/layer-check` 실행
3. **전체 재빌드** — `pnpm build`
4. **hydration 테스트** — 빌드 후 버튼 작동 확인

### 주의해야 할 주요 변경 사항

| v1.x | v2.x | 참고 |
|------|------|-------|
| `shared/` | `core/`, `ui/` | 목적별 분리 |
| `shared-react/` | `ui/`, `features/` | 목적별 분리 |
| 평면 구조 | 레이어 시스템 | L0-L3 규칙 |
| — | `entry.client.tsx` | Hydration 수정 필수 |

## 관련 문서

- [SSG 심층 분석](/public-monorepo/ko/guides/ssg-deep-dive/) — SSG 아키텍처
- [레이어 시스템](/public-monorepo/ko/ai-guidelines/layer-system/) — Import 규칙
- [Hydration 버그 대응](/public-monorepo/ko/guides/hydration-workaround/) — v2.1 수정
