---
title: 소개
description: SoundBlue Public Monorepo 개요 - 학습자를 위한 세 개의 앱
---

# 소개

**SoundBlue Public Monorepo** 문서에 오신 것을 환영합니다. 이 모노레포에는 최신 웹 기술로 구축된 세 개의 교육용 애플리케이션이 포함되어 있습니다.

## 이게 뭔가요?

각 앱은 콘텐츠 유형에 **최적화된 렌더링 모드**를 사용합니다. 모든 모드는 SEO를 위한 완전한 HTML을 제공합니다.

:::danger[SPA 모드 차단]
⛔ **SPA 모드 차단됨** - SPA는 빈 HTML(`<div id="root"></div>`)을 반환하여 SEO가 불가능합니다. 이 프로젝트는 **SSR 또는 SSG만 허용**합니다.
:::

## 세 개의 앱

### 📖 Context — 한국어 사전

**학습자를 위한 한국어 사전** | SSR + Cloudflare D1

한국어 학습자를 위한 맥락 기반 사전입니다. 단어 의미, 예문, 관련 표현을 제공합니다.

| 특징 | 설명 |
|------|------|
| 모드 | SSR + D1 (동적) |
| 항목 | 16,836 |
| 언어 | 한국어, 영어 |
| URL | [context.soundbluemusic.com](https://context.soundbluemusic.com) |

### 🔧 Permissive — 웹개발 자료

**무료 웹개발 자료 모음** | SSR

허용적 라이선스(MIT, Apache 등)를 가진 웹 개발 라이브러리와 Web API 문서 모음입니다.

| 특징 | 설명 |
|------|------|
| 모드 | SSR |
| 언어 | 한국어, 영어 |
| URL | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |

### 📐 Roots — 수학 문서

**학습자를 위한 수학 문서** | SSG

대수학, 기하학, 미적분 등 다양한 수학 분야를 체계적으로 정리한 학습 문서입니다.

| 특징 | 설명 |
|------|------|
| 모드 | SSG |
| 언어 | 한국어, 영어 |
| URL | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## 기술 스택 개요

### 핵심 기술

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19 | UI 라이브러리 |
| React Router | 7 | 라우팅 + SSG |
| TypeScript | 5.8 | 타입 안전성 |
| Tailwind CSS | 4 | 스타일링 |

### 빌드 및 배포

| 도구 | 용도 |
|------|------|
| Turborepo | 모노레포 관리 |
| pnpm | 패키지 매니저 |
| Cloudflare Pages | 배포 |
| GitHub Actions | CI/CD |

## 핵심 원칙

1. **SPA 모드 금지** - 모든 페이지는 SEO를 위한 완전한 HTML이 있어야 합니다
2. **적절한 렌더링 모드 사용** - 대용량/동적 콘텐츠는 SSR, 정적 콘텐츠는 SSG
3. **하드코딩 금지** - 인라인 값이 아닌 데이터 파일 사용
4. **임시방편 금지** - 모든 수정은 일반적인 해결책이어야 합니다
5. **데이터 무결성** - 모든 데이터에 대한 단일 진실 공급원
6. **UI 검증 필수** - 모든 변경사항은 실제 UI에서 확인되어야 합니다

## 다음 단계

- [빠른 시작 가이드](/public-monorepo/ko/guides/quickstart/) - 로컬에서 프로젝트 실행하기
- [아키텍처 개요](/public-monorepo/ko/guides/architecture/) - 렌더링 모드와 아키텍처 이해하기
- [Context 문서](/public-monorepo/ko/apps/context/overview/) - 한국어 사전 앱에 대해 알아보기
