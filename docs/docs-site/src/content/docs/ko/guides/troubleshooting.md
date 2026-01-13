---
title: 문제 해결
description: 이 모노레포 작업 시 발생할 수 있는 일반적인 문제와 해결책
---

자주 발생하는 문제들에 대한 해결책입니다.

## 빌드 오류

### "Cannot find module" 오류

```
Error: Cannot find module '@soundblue/core'
```

**해결:** 루트 디렉토리에서 install 실행:

```bash
cd /path/to/public-monorepo
pnpm install
```

### 패키지 변경 후 TypeScript 오류

```
error TS2307: Cannot find module '@soundblue/ui/components'
```

**해결:** 모든 패키지 재빌드:

```bash
pnpm build
```

### Vite 빌드 메모리 오류

```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed
```

**해결:** Node.js 메모리 제한 증가:

```bash
NODE_OPTIONS="--max-old-space-size=8192" pnpm build
```

## 런타임 문제

### 로드 후 버튼 클릭 안 됨

React Router v7 + React 19 SSG hydration 버그입니다.

**확인:**
1. `entry.client.tsx`에 orphan DOM 정리 코드가 있는지
2. hydration 중 콘솔 오류가 없는지

자세한 내용은 [Hydration 버그 대응](/public-monorepo/ko/guides/hydration-workaround/)을 참조하세요.

### 검색이 작동하지 않음

**확인:**
1. 검색 인덱스가 빌드됨: `pnpm build`가 검색 파일을 생성해야 함
2. 브라우저 콘솔 오류
3. MiniSearch 워커가 올바르게 로딩되는지

### 스타일이 적용되지 않음

**확인:**
1. Tailwind CSS가 처리 중: `tailwind.config.ts` 확인
2. CSS import가 올바른지
3. `pnpm dev` 실행하여 핫 리로드 트리거

## 개발 환경 설정

### 포트가 이미 사용 중

```
Error: Port 3003 is already in use
```

**해결:** 프로세스를 종료하거나 다른 포트 사용:

```bash
# 포트를 사용하는 프로세스 찾기
lsof -i :3003

# 종료
kill -9 <PID>

# 또는 다른 포트 사용
PORT=3010 pnpm dev:context
```

### pnpm 버전 불일치

```
ERR_PNPM_BAD_PM_VERSION
```

**해결:** 올바른 pnpm 버전 설치:

```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
```

### Node.js 버전이 너무 낮음

```
error This package requires Node.js >= 20
```

**해결:** Node.js 업그레이드:

```bash
# nvm 사용
nvm install 20
nvm use 20

# 또는 nodejs.org에서 다운로드
```

## 레이어 위반 오류

### Import 레이어 규칙 위반

```
ERROR: @soundblue/core cannot import from @soundblue/platform
```

**규칙:**
- L0 (core, config) → 다른 레이어에서 import 불가
- L1 (data, platform) → L0만 import 가능
- L2 (i18n, search, seo, pwa) → L0, L1 import 가능
- L3 (ui, features, apps) → 모든 레이어 import 가능

전체 다이어그램은 [아키텍처](/public-monorepo/ko/guides/architecture/)를 참조하세요.

## 데이터 문제

### JSON 스키마 검증 실패

```
ZodError: Invalid entry data
```

**확인:**
1. JSON 파일이 Zod 스키마와 일치하는지
2. 모든 필수 필드가 있는지
3. 데이터 타입이 올바른지

```bash
# 데이터 검증
pnpm test:data
```

## 도움 받기

문제가 여기에 없다면:

1. [GitHub Issues](https://github.com/soundbluemusic/public-monorepo/issues) 검색
2. 알려진 upstream 이슈인지 확인 (React Router, Vite 등)
3. 다음 정보와 함께 새 이슈 생성:
   - 오류 메시지 (전체 스택 트레이스)
   - 재현 단계
   - 환경 (Node.js 버전, OS 등)
