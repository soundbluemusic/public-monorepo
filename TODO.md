# TODO

프로젝트 개선 사항 목록입니다.

---

## Context App

### Romanization 개선 (우선순위: 낮음)

**문제**: 현재 entry ID에 한글 음절이 혼합되어 있음

예시:
- `w-블rogeu` (블로그 → blog)
- `w-빅deiteo` (빅데이터 → big data)
- `d-med-면yeok` (면역 → immunity)

**개선 방향**:
- 모든 ID를 ASCII-only로 생성
- 완전한 romanization 또는 영어 번역 사용
- SEO 및 URL 가독성 향상

**영향 범위**:
- `data/context/entries/*.json` 내 ID 필드
- 기존 URL과의 호환성 (redirect 필요할 수 있음)
- sitemap 재생성

**참고**: 기능에는 영향 없음. SEO/URL 미관 개선 목적.

---

## 완료된 항목

- [x] Cloudflare Pages 20,000 파일 제한 우회 (R2 하이브리드 아키텍처)
- [x] rclone을 이용한 빠른 R2 업로드 (32 병렬 전송)
- [x] loader → clientLoader 변환 (ssr:false 호환)
