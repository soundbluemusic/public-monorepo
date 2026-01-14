---
name: link-check
description: 프로덕션 URL 링크 무결성 검사. lychee로 깨진 링크, 리다이렉트 체인, 404 오류 검출
---

# Link Check 스킬

프로덕션 URL의 링크 무결성을 검사하는 스킬입니다.

## 자동 실행 지시

**이 스킬이 호출되면 즉시 다음을 수행하세요:**

1. Bash tool로 lychee 실행
2. 결과 분석 후 요약 출력
3. 깨진 링크 발견 시 해당 페이지 소스 확인 및 수정 제안

```bash
# 전체 앱 검사
lychee --config .lychee.toml https://context.soundbluemusic.com https://permissive.soundbluemusic.com https://roots.soundbluemusic.com

# 개별 앱 검사 (인자로 앱 이름 전달 시)
lychee --config .lychee.toml https://context.soundbluemusic.com
```

## 프로덕션 URL

| 앱         | URL                                   |
| ---------- | ------------------------------------- |
| context    | https://context.soundbluemusic.com    |
| permissive | https://permissive.soundbluemusic.com |
| roots      | https://roots.soundbluemusic.com      |

## 오류 발견 시 자동 처리

1. 깨진 링크 URL과 상태 코드 파싱
2. 해당 링크가 있는 소스 파일 검색 (Grep)
3. 올바른 URL로 수정 제안
4. 사용자 승인 후 Edit로 수정

## SEO 영향

| 문제               | SEO 영향                       |
| ------------------ | ------------------------------ |
| 404 에러           | 크롤링 예산 낭비, 사용자 이탈  |
| 과도한 리다이렉트  | PageRank 감소 (약 15%/hop)     |
| 느린 응답          | Core Web Vitals 저하           |

## 관련 파일

- `.lychee.toml` - lychee 설정
- `scripts/check-links-prod.sh` - 로컬 실행 스크립트
