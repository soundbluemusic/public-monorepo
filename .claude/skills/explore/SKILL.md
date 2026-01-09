---
name: explore
description: 코드베이스 탐색 및 구조 분석. Task tool (Explore)로 서브에이전트가 탐색하고 요약만 반환하여 토큰 90% 절약
---

# Explore 스킬

코드베이스 탐색 및 구조 분석을 위한 스킬입니다.

## 사용법

```
/explore [질문 또는 검색어]
```

## 예시

- `/explore i18n 라우팅 구조`
- `/explore SSG prerender 패턴`
- `/explore entry 데이터 흐름`

## 동작 방식

1. Task tool의 Explore 에이전트를 호출합니다
2. 서브에이전트가 별도 컨텍스트에서 탐색을 수행합니다
3. 메인 컨텍스트에는 요약된 결과만 반환됩니다

## 설정

- **context**: fork (메인 컨텍스트 오염 방지)
- **model**: sonnet (구조 분석에 적합)
- **thoroughness**: medium (기본), very thorough (복잡한 분석)

## 토큰 절약 효과

| 방식 | 예상 토큰 |
|------|----------|
| 직접 탐색 (Glob → Read 반복) | ~5,000 |
| Explore 스킬 사용 | ~500 |
| **절약률** | **90%** |

## 주의사항

- 단순 파일 검색은 `/find` 스킬 사용
- 파일 수정이 필요하면 직접 Read + Edit 사용
- 결과가 부족하면 추가 질문으로 상세 탐색 요청
