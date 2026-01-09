---
name: find
description: 빠른 파일/함수 위치 검색. haiku 모델로 Glob/Grep 실행하여 경로와 라인만 반환, 토큰 80% 절약
---

# Find 스킬

빠른 파일/함수 위치 검색을 위한 스킬입니다.

## 사용법

```
/find [검색어]
```

## 예시

- `/find validateId`
- `/find metaFactory`
- `/find entry.client.tsx`
- `/find prerender 함수`

## 동작 방식

1. Task tool을 haiku 모델로 호출합니다
2. 서브에이전트가 Glob/Grep으로 빠르게 검색합니다
3. 파일 경로와 라인 번호만 반환됩니다

## 설정

- **context**: fork (메인 컨텍스트 오염 방지)
- **model**: haiku (저비용, 빠른 검색)

## 토큰 절약 효과

| 방식 | 예상 토큰 |
|------|----------|
| 직접 검색 | ~1,000 |
| Find 스킬 사용 | ~200 |
| **절약률** | **80%** |

## 반환 형식

```
검색 결과:
- packages/core/src/validation.ts:15 (validateId 함수)
- packages/core/src/validation.ts:42 (validateId 호출)
```

## 주의사항

- 구조 분석이 필요하면 `/explore` 스킬 사용
- 검색 결과 확인 후 상세 내용은 직접 Read
- 여러 검색어는 각각 `/find` 호출
