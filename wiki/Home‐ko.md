🌐 [English](Home) | 한국어 | [日本語](Home‐ja)

# 🎵 Public Monorepo - 딥링크

소스 코드와 라이브 사이트로 빠르게 이동하세요.

---

## 🚀 앱

| 앱 | 설명 | 코드 | 라이브 사이트 |
|-----|------|------|-------------|
| **Context** | 한국어 사전 (SSR + D1) | [/apps/context/](https://github.com/soundbluemusic/public-monorepo/tree/main/apps/context) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Permissive** | 웹개발 자료 (SSR) | [/apps/permissive/](https://github.com/soundbluemusic/public-monorepo/tree/main/apps/permissive) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Roots** | 수학 문서 (SSR) | [/apps/roots/](https://github.com/soundbluemusic/public-monorepo/tree/main/apps/roots) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |
| **Docs** | 문서 사이트 | [/apps/docs/](https://github.com/soundbluemusic/public-monorepo/tree/main/apps/docs) | [soundbluemusic.github.io/public-monorepo](https://soundbluemusic.github.io/public-monorepo) |

## 📦 패키지

| 레이어 | 패키지 | 용도 | 코드 |
|--------|--------|------|------|
| L0 | core | 검증, 유틸, 타입 | [/packages/core/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/core) |
| L0 | config | Vite, Tailwind 설정 | [/packages/config/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/config) |
| L1 | data | Zod 스키마, 로더 | [/packages/data/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/data) |
| L1 | platform | IndexedDB 스토리지 | [/packages/platform/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/platform) |
| L2 | i18n | URL 라우팅, Paraglide | [/packages/i18n/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/i18n) |
| L2 | search | MiniSearch 래퍼 | [/packages/search/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/search) |
| L2 | seo | 메타 태그, 사이트맵 | [/packages/seo/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/seo) |
| L2 | pwa | 서비스 워커 | [/packages/pwa/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/pwa) |
| L3 | features | 설정, 토스트, 미디어 | [/packages/features/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/features) |
| L3 | ui | React 컴포넌트 | [/packages/ui/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/ui) |

## ⚙️ 설정 파일

| 파일 | 용도 |
|------|------|
| [turbo.json](https://github.com/soundbluemusic/public-monorepo/blob/main/turbo.json) | Turborepo 설정 |
| [biome.json](https://github.com/soundbluemusic/public-monorepo/blob/main/biome.json) | 린터 & 포매터 |
| [tsconfig.json](https://github.com/soundbluemusic/public-monorepo/blob/main/tsconfig.json) | TypeScript |
| [playwright.config.ts](https://github.com/soundbluemusic/public-monorepo/blob/main/playwright.config.ts) | E2E 테스트 |
| [vitest.config.ts](https://github.com/soundbluemusic/public-monorepo/blob/main/vitest.config.ts) | 유닛 테스트 |

## 🔧 CI/CD & 자동화

| 경로 | 용도 |
|------|------|
| [.github/workflows/](https://github.com/soundbluemusic/public-monorepo/tree/main/.github/workflows) | GitHub Actions |
| [.husky/](https://github.com/soundbluemusic/public-monorepo/tree/main/.husky) | Git Hooks |
| [scripts/](https://github.com/soundbluemusic/public-monorepo/tree/main/scripts) | 빌드 스크립트 |

## 📚 문서

| 문서 | 용도 | 코드 | 라이브 |
|------|------|------|--------|
| GitHub Pages | 기술 문서 | [/docs/](https://github.com/soundbluemusic/public-monorepo/tree/main/docs) | [soundbluemusic.github.io/public-monorepo](https://soundbluemusic.github.io/public-monorepo) |
| ARCHITECTURE.md | 아키텍처 가이드 | [보기](https://github.com/soundbluemusic/public-monorepo/blob/main/ARCHITECTURE.md) | |
| CONTRIBUTING.md | 기여 가이드 | [보기](https://github.com/soundbluemusic/public-monorepo/blob/main/CONTRIBUTING.md) | |

## 📊 데이터 & 테스트

| 경로 | 용도 |
|------|------|
| [data/](https://github.com/soundbluemusic/public-monorepo/tree/main/data) | 데이터 파일 |
| [tests/](https://github.com/soundbluemusic/public-monorepo/tree/main/tests) | E2E 테스트 |

## 🌐 기타 프로젝트

| 프로젝트 | 설명 | 라이브 사이트 |
|----------|------|--------------|
| Tools | 개발자 도구 | [tools.soundbluemusic.com](https://tools.soundbluemusic.com) |
| Dialogue | 대화 앱 | [dialogue.soundbluemusic.com](https://dialogue.soundbluemusic.com) |