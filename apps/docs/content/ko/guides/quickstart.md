---
title: 빠른 시작
description: SoundBlue Public Monorepo를 몇 분 안에 시작하세요
---

# 빠른 시작 가이드

몇 분 안에 로컬에서 모노레포를 실행하세요.

## 사전 요구사항

시작하기 전에 다음이 설치되어 있는지 확인하세요:

| 도구 | 버전 | 설치 |
|------|------|------|
| Node.js | ≥22.0.0 | [nodejs.org](https://nodejs.org) |
| pnpm | 10.11.0 | `npm install -g pnpm@10.11.0` |
| Git | 최신 | [git-scm.com](https://git-scm.com) |

## 설치

### 1. 저장소 클론

```bash
git clone https://github.com/soundbluemusic/public-monorepo.git
cd public-monorepo
```

### 2. 의존성 설치

```bash
pnpm install
```

모노레포의 모든 앱과 패키지에 대한 의존성이 설치됩니다.

## 개발

### 개별 앱 실행

각 앱은 자체 개발 서버가 있습니다:

```bash
# Context - 한국어 사전
pnpm dev:context
# → http://localhost:3003

# Permissive - 웹개발 자료
pnpm dev:permissive
# → http://localhost:3004

# Roots - 수학 문서
pnpm dev:roots
# → http://localhost:3005
```

### 모든 앱 실행

```bash
pnpm dev
```

## 빌드

### 개별 앱 빌드

```bash
pnpm build:context    # Context 앱 빌드
pnpm build:permissive # Permissive 앱 빌드
pnpm build:roots      # Roots 앱 빌드
```

### 모든 앱 빌드

```bash
pnpm build
```

:::tip[Turborepo 캐싱]
Turborepo는 빌드 결과를 캐싱합니다. 동일한 입력에 대한 후속 빌드는 **97% 이상 빠릅니다**.
:::

## 품질 검사

### 린팅

```bash
pnpm lint        # Biome 린터 실행
pnpm lint:fix    # 린팅 문제 자동 수정
```

### 타입 검사

```bash
pnpm typecheck   # TypeScript 타입 검사
```

### 테스트

```bash
pnpm test        # Vitest 테스트 실행
pnpm test:e2e    # Playwright E2E 테스트 실행
```

### 모든 검사

```bash
pnpm check       # 모든 품질 검사 실행
```

## 프로젝트 명령어 참고

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 모든 개발 서버 시작 |
| `pnpm dev:context` | Context 개발 서버 시작 |
| `pnpm dev:permissive` | Permissive 개발 서버 시작 |
| `pnpm dev:roots` | Roots 개발 서버 시작 |
| `pnpm build` | 모든 앱 빌드 |
| `pnpm lint` | 린터 실행 |
| `pnpm typecheck` | TypeScript 검사 실행 |
| `pnpm test` | 단위 테스트 실행 |
| `pnpm test:e2e` | E2E 테스트 실행 |

## 다음 단계

프로젝트가 실행되면:

1. **코드베이스 탐색** - `apps/`에서 세 개의 애플리케이션 확인
2. **아키텍처 이해** - [아키텍처 가이드](/public-monorepo/ko/guides/architecture/) 읽기
3. **각 앱에 대해 알아보기** - 앱별 문서 방문
4. **기여하기** - [기여 가이드](/public-monorepo/ko/development/contributing/) 확인
