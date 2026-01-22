---
title: 환경 태그
description: SSG 호환성을 위한 모듈 실행 환경 주석
---

각 모듈은 JSDoc 태그를 사용하여 실행 환경을 선언합니다. 이를 통해 빌드 및 런타임 중 올바른 컨텍스트에서 코드가 실행됩니다.

## 태그 유형

### `@environment build-only`

**Node.js 빌드 시점에서만** 실행되는 코드. 클라이언트 번들에서 제외됩니다.

```typescript
/**
 * @environment build-only
 * 빌드 시 사이트맵 생성. 브라우저에서 사용 불가.
 */
export function generateSitemap(routes: string[]): string {
  return routes.map(r => `<url><loc>${r}</loc></url>`).join('');
}
```

**사용 사례:**
- 사이트맵 생성
- RSS 피드 생성
- 정적 데이터 처리
- 빌드 시점 검증

### `@environment client-only`

**브라우저에서만** 실행되는 코드. SSR/SSG 중에는 `undefined` 또는 noop 반환.

```typescript
/**
 * @environment client-only
 * 온라인 상태 반환. SSG 시 undefined.
 */
export function useOnlineStatus(): boolean | undefined {
  if (typeof window === 'undefined') return undefined;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // ... 브라우저 전용 로직
  return isOnline;
}
```

**사용 사례:**
- 브라우저 API 사용 (localStorage, navigator 등)
- 이벤트 리스너 (resize, scroll 등)
- IndexedDB 작업
- 서비스 워커 등록

### `@environment universal`

**빌드와 런타임 모두에서** 안전한 코드. 순수 함수만.

```typescript
/**
 * @environment universal
 * 어디서나 안전. 부작용 없음.
 */
export function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

**사용 사례:**
- 문자열/배열 유틸리티
- 데이터 변환
- 타입 가드
- 상수 및 검증

## 환경 감지

```typescript
// 브라우저에서 실행 중인지 확인
const isBrowser = typeof window !== 'undefined';

// Node.js 빌드에서 실행 중인지 확인
const isNode = typeof process !== 'undefined' && process.versions?.node;

// 안전한 브라우저 전용 코드
if (isBrowser) {
  localStorage.setItem('key', 'value');
}
```

## 패키지 환경 매트릭스

| 패키지 | build-only | client-only | universal |
|---------|:----------:|:-----------:|:---------:|
| `@soundblue/core` | - | - | ✅ |
| `@soundblue/config` | ✅ | - | - |
| `@soundblue/data` | ✅ | - | ✅ |
| `@soundblue/platform` | - | ✅ | - |
| `@soundblue/i18n` | ✅ | ✅ | ✅ |
| `@soundblue/search` | - | ✅ | ✅ |
| `@soundblue/seo` | ✅ | - | ✅ |
| `@soundblue/pwa` | ✅ | ✅ | - |
| `@soundblue/features` | - | ✅ | - |
| `@soundblue/ui` | - | ✅ | ✅ |

## 일반적인 실수

### universal 코드에서 브라우저 API 사용

```typescript
// ❌ 잘못됨 - SSG 빌드 중 크래시 발생
export function getStoredTheme() {
  return localStorage.getItem('theme');  // Node.js에서 localStorage는 undefined
}

// ✅ 올바름 - 브라우저 API 가드
export function getStoredTheme(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('theme');
}
```

### 같은 파일에서 환경 혼합

```typescript
// ❌ 피해야 함 - 혼란스러운 환경 혼합
export function generateMeta() { /* build-only */ }
export function useTheme() { /* client-only */ }

// ✅ 더 나음 - 파일 분리
// meta.server.ts (build-only)
// theme.browser.ts (client-only)
```

## 관련 문서

- [SSG 심층 분석](/public-monorepo/ko/guides/ssg-deep-dive/) — SSG 빌드 작동 방식
- [파일 제한](/public-monorepo/ko/reference/file-restrictions/) — 보호된 파일
