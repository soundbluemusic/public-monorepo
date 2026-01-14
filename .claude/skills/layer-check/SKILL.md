---
name: layer-check
description: 패키지 import 레이어 규칙 검사. L3→L2→L1→L0 방향만 허용, 순환 의존 금지
---

# Layer Check 스킬

패키지 import 레이어 규칙 위반을 검사하는 스킬입니다.

## 자동 실행 지시

**이 스킬이 호출되면 즉시 다음을 수행하세요:**

1. Bash tool로 `pnpm check:circular` 실행
2. 결과 분석 후 요약 출력
3. 순환 의존 발견 시 해당 import 경로 분석 및 수정 제안

```bash
pnpm check:circular
```

## 레이어 구조

```text
L3 (apps, ui, features) → L2 (i18n, search, seo, pwa) → L1 (data, platform) → L0 (core, config)
```

| 레이어 | 패키지                 |
| ------ | ---------------------- |
| L0     | core, config           |
| L1     | data, platform         |
| L2     | i18n, search, seo, pwa |
| L3     | apps/*, ui, features   |

## 오류 발견 시 자동 처리

1. 순환 의존 경로 파싱 (A → B → C → A)
2. 각 import 문 위치 확인
3. 의존성 방향 수정 방법 제안
4. 사용자 승인 후 리팩토링

## 관련 파일

- `packages/*/src/**/*.ts`
- `packages/*/package.json`
