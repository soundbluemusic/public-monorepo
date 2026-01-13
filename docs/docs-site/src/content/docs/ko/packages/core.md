---
title: "@soundblue/core"
description: 순수 함수, 타입, 검증 유틸리티 - Layer 0 기반 패키지
sidebar:
  order: 2
---

# @soundblue/core

**Layer 0 (기반)** — 외부 의존성 없는 순수 함수, 타입, 검증 유틸리티.

## 개요

core 패키지는 모든 다른 패키지에서 사용되는 기본 유틸리티를 제공합니다. React 의존성이 없어 어디서든 사용 가능합니다.

| 속성 | 값 |
|------|-----|
| 레이어 | 0 (기반) |
| 의존성 | clsx, tailwind-merge |
| React 필요 | 아니오 |

## 내보내기

### `/validation`

ID 검증, 입력 정제, 상수.

```typescript
import {
  LIMITS,
  validateId,
  sanitizeInput,
  isValidLanguage
} from '@soundblue/core/validation';

// 상수
LIMITS.MAX_SEARCH_LENGTH  // 100
LIMITS.MAX_ID_LENGTH      // 200

// 검증
validateId('hello-world');     // true
validateId('');                // false
validateId('a'.repeat(201));   // false

// 정제
sanitizeInput('<script>alert()</script>');  // 'scriptalert/script'

// 언어 확인
isValidLanguage('ko');  // true
isValidLanguage('fr');  // false (only 'en', 'ko' 지원)
```

### `/utils`

배열, 객체, 일반 유틸리티 함수.

```typescript
import {
  chunkArray,
  debounce,
  throttle,
  cn
} from '@soundblue/core/utils';

// 배열 분할
chunkArray([1, 2, 3, 4, 5], 2);  // [[1, 2], [3, 4], [5]]

// 디바운스
const debouncedSearch = debounce((query) => {
  console.log('검색:', query);
}, 300);

// 쓰로틀
const throttledScroll = throttle(() => {
  console.log('스크롤 이벤트');
}, 100);

// 클래스명 병합 (clsx + tailwind-merge)
cn('px-4 py-2', 'px-6');  // 'py-2 px-6' (px-6 승리)
cn('text-red-500', condition && 'text-blue-500');
```

### `/types`

공유 TypeScript 타입 정의.

```typescript
import type {
  Language,
  Theme,
  LocaleConfig
} from '@soundblue/core/types';

// 언어 타입
type Language = 'en' | 'ko';

// 테마 타입
type Theme = 'light' | 'dark' | 'system';

// 로케일 설정
interface LocaleConfig {
  defaultLocale: Language;
  locales: Language[];
  pathPrefix: boolean;
}
```

## 모범 사례

1. **공유 로직에 사용** - 여러 패키지에서 필요한 유틸리티는 여기에
2. **순수하게 유지** - 부작용 없음, 브라우저 API 없음, React 없음
3. **경계에서 검증** - 데이터 입력 지점에서 검증 함수 사용
