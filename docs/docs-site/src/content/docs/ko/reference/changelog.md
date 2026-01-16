---
title: 변경 로그
description: 버전 히스토리 및 주요 변경 사항
---

## v3.0.0 (2026-01-16)

### Breaking Changes

- **Context 앱: SSR + D1 전용** — SSG 빌드 모드 제거
- `BUILD_TARGET` 환경변수 폐기
- Entry 페이지 D1에서 실시간 조회로 전환

### 변경

- Context 렌더링: SSG → **SSR + Cloudflare D1**
- 사이트맵 생성: 정적 → **D1에서 동적 생성**
- 빌드 산출물: 16,836 HTML 파일 → **149 정적 페이지만**

### 삭제

- `apps/context/app/routes/($locale).entry.$entryId.ssg.tsx`
- `apps/context/app/routes/($locale).entry.$entryId.tsx` (SPA fallback)
- SSG 관련 환경변수 및 스크립트

### SSG vs SSR + D1 비교표

| 항목 | SSG (이전) | SSR + D1 (현재) |
|:-----|:-----------|:----------------|
| **SEO** | | |
| HTML 콘텐츠 | ✅ 완전한 HTML (빌드 시) | ✅ 완전한 HTML (런타임) |
| 메타 태그 | ✅ 정적 생성 | ✅ 동적 생성 (최신 데이터) |
| 사이트맵 | 빌드 시 정적 생성 | **D1에서 실시간 생성** |
| 크롤러 대응 | 빌드 시점 데이터 | **항상 최신 데이터** |
| **빌드** | | |
| 빌드 시간 | ~15분 (16,836 HTML) | **~10초** (149 정적 페이지) |
| 빌드 산출물 | 16,836 HTML + .data 파일 | 149 HTML + _worker.js |
| 메모리 사용 | 높음 (OOM 위험) | **낮음** |
| CI/CD 시간 | 길음 | **짧음** |
| **배포** | | |
| 배포 대상 | R2 (정적 파일) + Pages | **Pages Functions만** |
| 배포 크기 | ~1.7GB (34,000+ 파일) | **~50MB** |
| 배포 속도 | 느림 (rclone 동기화) | **빠름** |
| R2 비용 | Class A 요청 발생 | **없음** |
| **데이터** | | |
| 데이터 소스 | TypeScript (빌드 시 고정) | **D1 (런타임 실시간)** |
| 데이터 업데이트 | 재빌드 + 재배포 필요 | **D1만 업데이트** |
| 데이터 정합성 | 빌드 시점 스냅샷 | **항상 최신** |
| 데이터 크기 제한 | 빌드 메모리 한계 | **D1 용량만큼** |
| **확장성** | | |
| 엔트리 100만+ | 청크 빌드 필요 (복잡) | **쿼리만 추가** |
| OOM 위험 | 있음 | **없음** |
| 워크플로우 복잡도 | Matrix 빌드, rclone 동기화 | **단순 배포** |
| **운영** | | |
| 긴급 수정 | 재빌드 필요 (~15분) | **D1 즉시 반영** |
| A/B 테스트 | 어려움 | **D1 플래그로 가능** |
| 롤백 | 이전 빌드 재배포 | **D1 데이터 복원** |
| **비용** | | |
| R2 스토리지 | 1.7GB 사용 | **없음** |
| R2 요청 | Class A 다수 발생 | **없음** |
| D1 요청 | 없음 | 요청당 과금 (무료 티어 충분) |
| Pages Functions | 없음 | 요청당 과금 (무료 티어 충분) |
| **개발 경험** | | |
| 로컬 테스트 | 전체 빌드 필요 | **`pnpm dev` 즉시** |
| 데이터 추가 | 빌드 + 배포 | **D1 INSERT만** |
| 디버깅 | 빌드 로그 분석 | **런타임 로그** |

### 수정된 파일

- `.github/workflows/deploy-context.yml` — SSR 빌드 명령어
- `apps/context/package.json` — SSR 기본값
- `apps/context/app/routes.ts` — SSR 전용 라우팅
- `apps/context/react-router.config.ts` — `ssr: true` 고정
- `CLAUDE.md`, `ARCHITECTURE.md`, `apps/context/README.md`

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
