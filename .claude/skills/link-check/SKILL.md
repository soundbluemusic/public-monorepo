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

## 예시

- `/link-check` - 모든 프로덕션 앱 검사
- `/link-check context` - context 앱만 검사
- `/link-check permissive` - permissive 앱만 검사
- `/link-check roots` - roots 앱만 검사
- `/link-check https://example.com` - 특정 URL 검사

## 검사 항목

| 항목 | 설명 |
|------|------|
| 깨진 링크 (404) | 존재하지 않는 페이지 링크 |
| 리다이렉트 체인 | 연속 리다이렉트 (301, 302, 307, 308) |
| 타임아웃 | 30초 이상 응답 없는 링크 |
| SSL 오류 | HTTPS 인증서 문제 |

## 프로덕션 URL

| 앱 | URL |
|---|-----|
| context | https://context.soundbluemusic.com |
| permissive | https://permissive.soundbluemusic.com |
| roots | https://roots.soundbluemusic.com |

## 실행 방법

이 스킬은 lychee CLI를 사용합니다:

```bash
# 전체 검사
lychee --config .lychee.toml https://context.soundbluemusic.com

# 또는 스크립트 사용
pnpm check:links:prod
```

## 설정

- **설정 파일**: `.lychee.toml`
- **캐시**: 24시간 유지 (`.lycheecache`)
- **동시 요청**: 8개
- **타임아웃**: 30초

## 제외 패턴

다음 URL은 검사에서 제외됩니다:

- 소셜 미디어 (Twitter, Instagram, Threads) - rate limit 문제
- localhost, 127.0.0.1
- mailto:, tel:, javascript: 링크

## 반환 형식

```
🔗 프로덕션 링크 검사 결과

📦 context.soundbluemusic.com
   ✅ 1,234개 링크 검사 완료
   - OK: 1,200개
   - Redirects: 34개
   - Errors: 0개

📦 permissive.soundbluemusic.com
   ✅ 63개 링크 검사 완료
   - OK: 34개
   - Redirects: 29개
   - Errors: 0개

📦 roots.soundbluemusic.com
   ✅ 456개 링크 검사 완료
   - OK: 450개
   - Redirects: 6개
   - Errors: 0개

📊 전체 결과: ✅ 모든 링크 정상
```

## 오류 발생 시

깨진 링크가 발견되면:

```
❌ 깨진 링크 발견:

📦 context.soundbluemusic.com
   [404] /entry/missing-word (from /browse)
   [404] /category/unknown (from /ko)

조치 필요:
1. 해당 페이지가 삭제되었는지 확인
2. 링크를 수정하거나 리다이렉트 설정
3. sitemap.xml 업데이트
```

## 관련 파일

- `.lychee.toml` - lychee 설정
- `scripts/check-links-prod.sh` - 로컬 실행 스크립트
- `.github/workflows/check-links-prod.yml` - 주간 자동 검사
- `scripts/check-links.ts` - 로컬 빌드 링크 검사 (linkinator)

## SEO 영향

| 문제 | SEO 영향 |
|------|---------|
| 404 에러 | 크롤링 예산 낭비, 사용자 이탈 |
| 과도한 리다이렉트 | PageRank 감소 (약 15%/hop) |
| 느린 응답 | Core Web Vitals 저하 |

## 자동화

- **GitHub Actions**: 매주 일요일 자동 실행
- **수동 실행**: Actions 탭에서 workflow_dispatch
