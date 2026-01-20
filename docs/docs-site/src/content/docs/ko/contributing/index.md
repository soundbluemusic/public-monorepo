---
title: 기여 가이드
description: SoundBlue Public Monorepo에 기여하는 방법
sidebar:
  order: 1
---

# 기여 가이드

SoundBlue Public Monorepo에 관심을 가져주셔서 감사합니다! 이 가이드는 시작하는 데 도움이 됩니다.

## 빠른 시작

```bash
# 1. Fork & Clone
git clone https://github.com/YOUR_USERNAME/public-monorepo.git
cd public-monorepo

# 2. 의존성 설치
pnpm install

# 3. 개발 서버 실행
pnpm dev:context     # → http://localhost:3003
pnpm dev:permissive  # → http://localhost:3004
pnpm dev:roots       # → http://localhost:3005
```

## 필수 요건

| 요구사항 | 버전 |
|----------|------|
| Node.js | ≥ 20 |
| pnpm | 10.11.0 |
| Git | 최신 버전 |

## 핵심 규칙

:::danger[SPA 모드 금지]
이 프로젝트는 **SSR 모드만 사용**합니다. SPA 모드는 빈 HTML을 반환하여 SEO가 불가능하므로 금지됩니다.

각 앱의 렌더링 모드:

- **Context**: SSR + Cloudflare D1
- **Permissive**: SSR
- **Roots**: SSR
:::

### 1. 각 앱의 렌더링 모드 준수

```typescript
// Context 앱 (SSR + D1)
export default { ssr: true, ... }

// Roots 앱 (SSR)
export default { ssr: true, async prerender() { ... } }

// Permissive 앱 (SSR)
export default { ssr: true, async prerender() { ... } }

// ❌ SPA 모드 사용 금지 (loader 없이 클라이언트만 렌더링)
```

### 2. 하드코딩 금지

| 금지 | 허용 |
|------|------|
| 테스트 통과용 매직 넘버 | JSDoc이 있는 명명된 상수 |
| 오류 우회용 목업 데이터 | 타입 안전 열거형 |
| 버그 숨기는 폴백 값 | CSS 디자인 토큰 |

### 3. 임시방편 금지

모든 수정은 특정 케이스가 아닌 **일반적인 해결책**이어야 합니다.

| 금지 | 필수 |
|------|------|
| 특정 테스트 케이스만 겨냥한 조건 | 모든 유사 케이스에 대한 일반 해결책 |
| 오류 메시지 문자열로 분기 | 적절한 오류 타입 처리 |
| try-catch로 증상 숨기기 | 근본 원인 수정 |

### 4. 다운그레이드 금지 정책

> **문제 해결을 위해 패키지 버전을 다운그레이드하지 마세요.**

| 상황 | ❌ 하지 말 것 | ✅ 할 것 |
|------|-------------|---------|
| 호환성 오류 | 이전 버전으로 다운그레이드 | 새 API에 맞게 코드 업데이트 |
| 의존성 충돌 | 모든 버전 낮추기 | `pnpm.overrides`로 격리 |
| 빌드 실패 | "작동하던 버전"으로 복구 | 근본 원인 분석 후 수정 |

### 5. UI 검증 필수

모든 변경사항은 실제 UI에서 확인해야 합니다:

- 로컬 개발 서버 실행
- 영어와 한국어 페이지 모두 확인
- 인터랙션 테스트 (클릭, 입력 등)

## 패키지 레이어 규칙

```
L3 (apps, ui, features) → L2 (i18n, search, seo, pwa) → L1 (data, platform) → L0 (core, config)
```

- **하위 레이어만** — Layer N은 Layer N-1 이하만 import 가능
- **순환 의존 금지** — 같은 레이어 내 상호 import 금지

자세한 내용은 [아키텍처](/public-monorepo/ko/guides/architecture/)를 참조하세요.

## 개발 워크플로우

### 1. 브랜치 생성

```bash
git checkout -b feat/your-feature
# 또는
git checkout -b fix/your-bug-fix
```

### 2. 변경 수행

- [코드 스타일 가이드](/public-monorepo/ko/contributing/code-style/) 따르기
- 해당되는 경우 테스트 작성
- 필요시 문서 업데이트

### 3. 품질 검사 실행

```bash
pnpm lint       # 코드 스타일 검사 (Biome)
pnpm typecheck  # TypeScript 타입 검사
pnpm test       # 단위 테스트 실행 (Vitest)
pnpm build      # 모든 앱 빌드
```

### 4. 커밋

[Conventional Commits](https://www.conventionalcommits.org/) 형식 사용:

```bash
git commit -m "feat: 새 검색 기능 추가"
git commit -m "fix: hydration 불일치 해결"
git commit -m "docs: README 업데이트"
```

### 5. Pull Request 생성

자세한 내용은 [Pull Request 가이드](/public-monorepo/ko/contributing/pull-requests/)를 참조하세요.

## 문의

- [GitHub Issues](https://github.com/soundbluemusic/public-monorepo/issues)
- [문서](https://soundbluemusic.github.io/public-monorepo)
