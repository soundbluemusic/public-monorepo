---
title: Roots 개요
description: Roots - 학습자를 위한 수학 문서 전체 문서
sidebar:
  order: 1
---

# Roots — 수학 문서

**학습자를 위한 수학 문서** | SSR

Roots는 대수학, 기하학, 미적분 등 다양한 수학 분야를 체계적으로 정리한 수학 문서 사이트입니다.

## 라이브 데모

🌐 **[roots.soundbluemusic.com](https://roots.soundbluemusic.com)**

## 기능

### 📐 체계적인 수학 개념

- **438개 개념** - 기초부터 고급까지
- **18개 분야** - 대수학, 기하학, 미적분 등
- 선수 학습 개념 연결
- 수식 및 증명

### 🔗 개념 간 연결

- 선수 학습 개념 표시
- 관련 개념 링크
- 학습 경로 제안

### 🌐 다국어 지원

- 영어 및 한국어 UI
- 수학 용어 이중 언어 표시

## 프로젝트 구조

```
apps/roots/
├── app/
│   ├── components/      # React 컴포넌트
│   ├── routes/          # React Router 라우트
│   ├── data/            # 수학 개념 데이터
│   └── utils/           # 유틸리티 함수
├── public/              # 정적 자산
└── react-router.config.ts  # SSR 설정
```

## 주요 라우트

| 라우트 | 설명 |
|--------|------|
| `/` | 홈페이지 |
| `/concept/:conceptId` | 개별 개념 페이지 (영어) |
| `/ko/concept/:conceptId` | 개별 개념 페이지 (한국어) |
| `/field/:fieldId` | 분야별 개념 목록 |
| `/about` | 소개 페이지 |

## 수학 분야

| 분야 | 개념 수 | 설명 |
|------|---------|------|
| 대수학 | 85 | 방정식, 부등식, 함수 |
| 기하학 | 72 | 도형, 좌표, 변환 |
| 미적분 | 64 | 극한, 미분, 적분 |
| 선형대수 | 48 | 벡터, 행렬, 선형변환 |
| 확률통계 | 56 | 확률, 분포, 추정 |
| 기타 | 113 | 논리, 집합, 수론 등 |

## 데이터 구조

### 개념

```typescript
interface Concept {
  id: string;
  title: string;
  titleKo?: string;
  field: string;
  prerequisites: string[];
  description: string;
  descriptionKo?: string;
  formula?: string;
  examples?: string[];
  relatedConcepts?: string[];
}
```

### 분야

```typescript
interface Field {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  conceptCount: number;
}
```

## 개발

### 개발 서버 시작

```bash
pnpm dev:roots
# → http://localhost:3005
```

### 프로덕션 빌드

```bash
pnpm build:roots
```

## 수식 렌더링

수식은 LaTeX 문법을 사용하여 작성합니다:

```latex
# 인라인 수식
$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$

# 블록 수식
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

## 기여하기

새로운 수학 개념을 추가하려면:

1. `data/roots/concepts/` 폴더에 JSON 파일 추가
2. 스키마 검증 통과 확인
3. 선수 학습 개념 연결 확인
4. Pull Request 생성
