# Project Overview

## 핵심 특성

1. **100% SSG (Static Site Generation)**
   - 모든 앱은 빌드 시점에 HTML 생성
   - SSR 없음, 서버 로직 없음
   - `ssr: false` + `prerender: true` 설정

2. **완벽한 SEO**
   - 정적 HTML로 모든 페이지 사전 렌더링
   - 메타 태그, Open Graph, 구조화된 데이터 포함
   - sitemap.xml 자동 생성

3. **완벽한 PWA**
   - Service Worker로 오프라인 지원
   - 설치 가능한 웹앱
   - vite-plugin-pwa 사용

4. **완벽한 다국어 (한국어/영어)**
   - `/ko/`, `/en/` 경로 기반 라우팅
   - 모든 페이지 두 언어로 정적 생성
   - i18n 컨텍스트로 번역 관리

## 기술 스택

- SolidJS + SolidStart
- pnpm 모노레포
- Biome (린팅/포맷팅)
- TypeScript strict mode

## 앱 구조

- `apps/context` - 용어 사전 사이트
- `apps/roots` - 수학 개념 사이트
- `apps/permissive` - 완전 오픈소스 프로젝트 모음 사이트
- `packages/shared` - 공통 유틸리티, 컴포넌트, 훅

## 개발 명령어

```bash
pnpm dev:context    # context 앱 개발 서버
pnpm dev:roots      # roots 앱 개발 서버
pnpm dev:permissive # permissive 앱 개발 서버
pnpm build          # 전체 빌드
pnpm lint           # 린트 검사
```
