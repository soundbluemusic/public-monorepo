---
name: link-check
description: 프로덕션 URL 링크 무결성 검사. lychee로 깨진 링크, 리다이렉트 체인, 404 오류 검출
---

# Link Check 스킬

프로덕션 URL의 링크 무결성을 검사하는 스킬입니다. SEO에 중요한 깨진 링크를 자동으로 검출합니다.

## 사용법

```
/link-check
/link-check [앱 이름]
/link-check [URL]
```

## 실행 방법

**이 스킬을 실행하면 다음 명령어를 Bash로 실행하세요:**

```bash
# 전체 앱 검사
pnpm check:links:prod

# 개별 앱 검사
lychee --config .lychee.toml https://context.soundbluemusic.com
lychee --config .lychee.toml https://permissive.soundbluemusic.com
lychee --config .lychee.toml https://roots.soundbluemusic.com
```

## 프로덕션 URL

| 앱 | URL |
|---|-----|
| context | https://context.soundbluemusic.com |
| permissive | https://permissive.soundbluemusic.com |
| roots | https://roots.soundbluemusic.com |

## 검사 항목

| 항목 | 설명 |
|------|------|
| 깨진 링크 (404) | 존재하지 않는 페이지 링크 |
| 리다이렉트 체인 | 연속 리다이렉트 (301, 302, 307, 308) |
| 타임아웃 | 30초 이상 응답 없는 링크 |
| SSL 오류 | HTTPS 인증서 문제 |

## 반환 형식

```
🔗 프로덕션 링크 검사 결과

📦 context.soundbluemusic.com
   ✅ 1,234개 링크 검사 완료
   - OK: 1,200개
   - Redirects: 34개
   - Errors: 0개

📊 전체 결과: ✅ 모든 링크 정상
```

## SEO 영향

| 문제 | SEO 영향 |
|------|---------|
| 404 에러 | 크롤링 예산 낭비, 사용자 이탈 |
| 과도한 리다이렉트 | PageRank 감소 (약 15%/hop) |
| 느린 응답 | Core Web Vitals 저하 |

## 관련 파일

- `.lychee.toml` - lychee 설정
- `scripts/check-links-prod.sh` - 로컬 실행 스크립트
- `.github/workflows/check-links-prod.yml` - 주간 자동 검사
