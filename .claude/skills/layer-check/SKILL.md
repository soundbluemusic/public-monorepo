---
name: layer-check
description: 패키지 import 레이어 규칙 검사. L3→L2→L1→L0 방향만 허용, 순환 의존 금지
---

# Layer Check 스킬

패키지 import 레이어 규칙 위반을 검사하는 스킬입니다.

## 사용법

```text
/layer-check
/layer-check [패키지 이름]
```

## 실행 방법

**이 스킬을 실행하면 다음 명령어를 Bash로 실행하세요:**

```bash
pnpm check:circular
```

## 레이어 구조

```text
L3 (apps, ui, features) → L2 (i18n, search, seo, pwa) → L1 (data, platform) → L0 (core, config)
```

### 레이어별 패키지

| 레이어 | 패키지                 |
| ------ | ---------------------- |
| L0     | core, config           |
| L1     | data, platform         |
| L2     | i18n, search, seo, pwa |
| L3     | apps/*, ui, features   |

## 검사 규칙

| 규칙               | 설명                             |
| ------------------ | -------------------------------- |
| 하위 레이어만 import | L3 → L2 ✅, L2 → L3 ❌           |
| 순환 의존 금지     | 같은 레이어 간 상호 import ❌    |

### 금지 패턴

```typescript
// ❌ L0 → L1 (core에서 platform import)
import { storage } from '@soundblue/platform';

// ❌ L2 → L3 (i18n에서 features import)
import { useSettings } from '@soundblue/features';

// ❌ 순환 의존 (search ↔ seo)
// search/index.ts: import from '@soundblue/seo'
// seo/index.ts: import from '@soundblue/search'
```

## 반환 형식

```text
레이어 규칙 검사 결과:

✅ 통과:
- packages/core: L0 규칙 준수
- packages/data: L1 규칙 준수

❌ 위반:
- (순환 의존 없음)
```

## 관련 파일

- `packages/*/src/**/*.ts`
- `packages/*/package.json`
