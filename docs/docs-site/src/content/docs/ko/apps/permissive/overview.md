---
title: Permissive 개요
description: Permissive - 무료 웹개발 자료 모음 전체 문서
sidebar:
  order: 1
---

# Permissive — 웹 개발 자료

**무료 웹개발 자료 모음** | 8 SSG 페이지

Permissive는 허용적 라이선스(MIT, Apache 등)를 가진 웹 개발 라이브러리와 Web API 문서를 모아놓은 큐레이션 컬렉션입니다.

## 라이브 데모

🌐 **[permissive.soundbluemusic.com](https://permissive.soundbluemusic.com)**

## 기능

### 📚 라이브러리 카탈로그

- **88개 라이브러리** - 허용적 라이선스만 포함
- 카테고리별 분류 (프레임워크, 유틸리티, UI 등)
- 라이선스 정보 및 GitHub 링크
- 설명 및 사용 사례

### 🔧 Web API 문서

- **56개 Web API** - 브라우저 내장 API
- MDN 문서 링크
- 브라우저 호환성 정보
- 사용 예시

### 🌐 다국어 지원

- 영어 및 한국어 UI
- URL 기반 언어 전환

## 프로젝트 구조

```
apps/permissive/
├── app/
│   ├── components/      # React 컴포넌트
│   ├── routes/          # React Router 라우트
│   ├── data/            # 라이브러리 및 API 데이터
│   └── utils/           # 유틸리티 함수
├── public/              # 정적 자산
└── react-router.config.ts  # SSG 설정
```

## 주요 라우트

| 라우트 | 설명 |
|--------|------|
| `/` | 홈페이지 |
| `/libraries` | 라이브러리 목록 |
| `/web-apis` | Web API 목록 |
| `/about` | 소개 페이지 |

## 데이터 구조

### 라이브러리

```typescript
interface Library {
  name: string;
  license: 'MIT' | 'Apache-2.0' | 'BSD-3-Clause' | 'ISC';
  category: string;
  description: string;
  url: string;
  github?: string;
}
```

### Web API

```typescript
interface WebApi {
  name: string;
  category: string;
  description: string;
  mdn: string;
  support: {
    chrome: number;
    firefox: number;
    safari: number;
    edge: number;
  };
}
```

## 개발

### 개발 서버 시작

```bash
pnpm dev:permissive
# → http://localhost:3004
```

### 프로덕션 빌드

```bash
pnpm build:permissive
```

## 기여하기

새로운 라이브러리나 Web API를 추가하려면:

1. `data/permissive/` 폴더의 JSON 파일 수정
2. 스키마 검증 통과 확인
3. Pull Request 생성

라이브러리 추가 조건:
- 허용적 라이선스 (MIT, Apache 2.0, BSD, ISC)
- 활발히 유지보수됨
- 웹 개발에 유용함
