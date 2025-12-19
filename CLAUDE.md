# Project Overview

## 절대 규칙 (CRITICAL RULES)

> **이 규칙들은 절대 위반하지 말 것. CMS, 외부 DB, 서버 로직 제안 금지.**

1. **100% SSG Only** - 모든 앱은 정적 사이트 생성만 사용. SSR/서버 로직 절대 금지.
2. **오픈소스 Only** - 모든 라이브러리/도구는 오픈소스만 사용.
3. **웹 표준 API Only** - 브라우저 표준 API만 사용. 벤더 종속 API 금지.
4. **로컬 스토리지 Only** - DB는 localStorage, IndexedDB만 사용. 외부 DB/CMS 절대 금지.

## Code Quality Rules (코드 품질 규칙)

### Absolute Prohibitions (절대 금지)
- Never delete/comment out code to hide errors (에러 숨기려고 코드 삭제/주석 처리 금지)
- Never hardcode values or mock data to pass tests (테스트 통과용 하드코딩/목 데이터 금지)
- Never disable tests, validation, or security checks (테스트/검증/보안 체크 비활성화 금지)
- Never use `// ... existing code ...` - always provide complete code (항상 완전한 코드 제공)

### Required Process (필수 프로세스)
Before any fix (수정 전 반드시):
1. Identify root cause (WHY, not just WHAT) - 근본 원인 파악
2. Explain why naive fixes (delete/hardcode/disable) are wrong - 단순 수정이 왜 잘못인지 설명
3. Verify existing functionality is preserved - 기존 기능 유지 확인

### Quality Standards (품질 기준)
- Structural solutions over superficial patches (표면적 패치보다 구조적 해결)
- Handle edge cases explicitly (엣지 케이스 명시적 처리)
- Follow project conventions (프로젝트 컨벤션 준수)
- Add comments explaining WHY (WHY를 설명하는 주석)

### When Uncertain (불확실할 때)
Ask before: removing code, changing core logic, breaking changes.
(다음 작업 전 질문: 코드 제거, 핵심 로직 변경, 브레이킹 체인지)

## 핵심 특성

1. **100% SSG (Static Site Generation)**
   - 모든 앱은 빌드 시점에 HTML 생성
   - SSR 없음, 서버 로직 없음
   - `ssr: false` + `prerender: true` 설정
   - 데이터가 1억개여도 빌드 시점에 정적 생성

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
