# 수학 문서 앱 계획서 | Math Documentation App Plan

> 앱 이름: **Roots** (근본, 수학의 근본)
> 도메인: `roots.soundbluemusic.com`

---

## 1. 개요 Overview

기존 `context`(사전 앱)와 `permissive`(개발 리소스 앱)의 아키텍처를 그대로 활용하여
수학 문서화 앱을 구축합니다.

### 기존 앱과의 유사성

| 요소 | Context 앱 | Permissive 앱 | **Roots 앱** |
|------|-----------|---------------|----------------|
| 콘텐츠 | 한국어 단어 | Web API/라이브러리 | 수학 개념/정리 |
| 카테고리 | 품사/난이도 | API 종류/라이선스 | 수학 분야 (18개) |
| 상세 페이지 | 단어 설명 | API 스펙 | 수학 개념 문서 |
| 검색 | 단어 검색 | API/라이브러리 검색 | 개념/공식 검색 |
| 즐겨찾기 | ✅ | ✅ | ✅ |
| 학습 기록 | ✅ | - | ✅ (확장) |

---

## 2. 기술 스택 (기존과 동일)

> **중요: 100% SSG (Static Site Generation) 정적 사이트**
>
> - `app.config.ts`에서 `preset: "static"` 설정
> - 빌드 출력: `.output/public`
> - 서버 없음 (No SSR, No API)
> - Cloudflare Pages에서 CDN 호스팅

```
Framework:     Solid.js + SolidStart 1.x
Styling:       Tailwind CSS v4 + CSS Variables
Language:      TypeScript 5.x
Database:      Dexie (IndexedDB) - 클라이언트 전용
Build:         Vinxi + Vite → 100% SSG
PWA:           vite-plugin-pwa + Workbox
Shared:        @soundblue/shared 패키지
Output:        .output/public (정적 파일만)
```

### 추가 라이브러리

```
KaTeX:         ^0.16.x (LaTeX 수식 렌더링)
Fuse.js:       ^7.x (fuzzy 검색)
Chart.js:      ^4.x (그래프/시각화)
```

---

## 3. 데이터 구조 Types

### 3.1 핵심 타입

```typescript
// src/data/types.ts

// 언어
type Language = 'ko' | 'en' | 'ja';

// 난이도 (★ 표기)
type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
// 1: 초등, 2: 중등, 3: 고등, 4: 대학, 5: 대학원+

// 수학 분야 (18개 대분류)
type MathField =
  | 'foundations'      // 1. 기초 수학
  | 'algebra'          // 2. 대수학
  | 'geometry'         // 3. 기하학
  | 'trigonometry'     // 4. 삼각법
  | 'analysis'         // 5. 해석학
  | 'linear-algebra'   // 6. 선형대수
  | 'probability'      // 7. 확률/통계
  | 'discrete'         // 8. 이산수학
  | 'number-theory'    // 9. 수론
  | 'topology'         // 10. 위상수학
  | 'logic'            // 11. 수리논리
  | 'dynamics'         // 12. 동역학/카오스
  | 'optimization'     // 13. 최적화
  | 'numerical'        // 14. 수치해석
  | 'applied'          // 15. 응용수학
  | 'constants'        // 16. 수학 상수
  | 'symbols'          // 17. 수학 기호
  | 'theorems';        // 18. 유명 정리

// 수학 개념 문서 (핵심 타입)
interface MathConcept {
  id: string;                    // 예: "pythagorean-theorem"

  // 기본 정보
  name: {
    ko: string;                  // "피타고라스 정리"
    en: string;                  // "Pythagorean Theorem"
    ja?: string;                 // "ピタゴラスの定理"
  };

  // 분류
  field: MathField;              // 대분류
  subfield: string;              // 소분류 ID (예: "plane-geometry")
  difficulty: DifficultyLevel;   // 난이도 1-5

  // 내용 (각 언어별)
  content: {
    ko: ConceptContent;
    en: ConceptContent;
    ja?: ConceptContent;
  };

  // 연관 관계
  relations: ConceptRelations;

  // 메타데이터
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 개념 내용 상세
interface ConceptContent {
  // 1. 정의 (필수)
  definition: string;            // 한 문장 쉬운 설명

  // 2. 공식 (선택)
  formulas?: Formula[];

  // 3. 예제 (필수, 최소 2개)
  examples: Example[];

  // 4. 시각화 (선택)
  visualizations?: Visualization[];

  // 5. 역사 (선택)
  history?: {
    discoveredBy?: string;       // 발견자
    year?: string;               // 연도
    background?: string;         // 배경
  };

  // 6. 응용 분야 (선택)
  applications?: Application[];
}

// 수학 공식
interface Formula {
  latex: string;                 // LaTeX 문법
  description: string;           // 공식 설명
  variables?: Variable[];        // 변수 설명
}

interface Variable {
  symbol: string;                // "a"
  meaning: string;               // "직각삼각형의 밑변"
}

// 예제
interface Example {
  problem: string;               // 문제
  solution: string;              // 풀이
  latex?: string;                // 수식 (선택)
  difficulty?: DifficultyLevel;  // 예제별 난이도
}

// 시각화
interface Visualization {
  type: 'graph' | 'diagram' | 'animation' | 'interactive';
  description: string;
  data?: unknown;                // Chart.js 데이터 등
  externalUrl?: string;          // 외부 도구 링크
}

// 응용 분야
interface Application {
  field: string;                 // "건축", "물리", "금융" 등
  description: string;
  conceptLink?: string;          // 응용수학 섹션 링크
}

// 연관 관계
interface ConceptRelations {
  prerequisites: string[];       // → 선행: 먼저 봐야 할 문서 IDs
  nextTopics: string[];          // ← 후행: 다음에 볼 문서 IDs
  related: string[];             // ↔ 관련: 함께 참고할 문서 IDs
  applications: string[];        // ⚡ 응용: 실제 쓰이는 분야 IDs
}

// 소분류 (Subfield)
interface MathSubfield {
  id: string;                    // "plane-geometry"
  parentField: MathField;        // "geometry"
  name: {
    ko: string;                  // "평면기하"
    en: string;                  // "Plane Geometry"
    ja?: string;
  };
  description: {
    ko: string;
    en: string;
    ja?: string;
  };
  order: number;                 // 정렬 순서
  icon?: string;                 // 아이콘
}

// 대분류 (Field)
interface MathFieldInfo {
  id: MathField;
  name: {
    ko: string;                  // "기하학"
    en: string;                  // "Geometry"
    ja?: string;
  };
  description: {
    ko: string;
    en: string;
    ja?: string;
  };
  icon: string;                  // 이모지 또는 아이콘
  color: string;                 // Tailwind 색상
  order: number;                 // 1-18
}

// 수학 상수
interface MathConstant {
  id: string;                    // "pi", "e", "phi"
  symbol: string;                // "π", "e", "φ"
  name: {
    ko: string;
    en: string;
    ja?: string;
  };
  value: string;                 // "3.14159265358979..."
  latex: string;                 // LaTeX 표현
  description: {
    ko: string;
    en: string;
    ja?: string;
  };
  relatedConcepts: string[];
}

// 수학 기호
interface MathSymbol {
  id: string;
  symbol: string;                // "∫", "∑", "∞"
  category: 'operation' | 'set' | 'logic' | 'calculus' | 'greek';
  name: {
    ko: string;
    en: string;
    ja?: string;
  };
  latex: string;
  usage: string;                 // 사용 예시
  relatedConcepts: string[];
}

// 유명 정리
interface FamousTheorem {
  id: string;
  name: {
    ko: string;
    en: string;
    ja?: string;
  };
  statement: {
    ko: string;
    en: string;
    ja?: string;
  };
  latex?: string;
  field: MathField;
  prover?: string;               // 증명자
  year?: string;
  significance: string;          // 중요성
  relatedConcepts: string[];
}
```

### 3.2 데이터베이스 스키마 (Dexie)

```typescript
// src/lib/db.ts

interface RootsDB {
  // 즐겨찾기
  favorites: {
    id?: number;
    conceptId: string;
    addedAt: Date;
  };

  // 학습 기록 (확장됨)
  studyRecords: {
    id?: number;
    conceptId: string;
    studiedAt: Date;
    duration: number;            // 학습 시간 (초)
    completed: boolean;          // 문서 끝까지 봤는지
    quizScore?: number;          // 퀴즈 점수 (0-100)
  };

  // 학습 경로
  learningPaths: {
    id?: number;
    name: string;
    conceptIds: string[];        // 순서대로 학습할 개념들
    currentIndex: number;
    createdAt: Date;
    updatedAt: Date;
  };

  // 설정
  settings: {
    id: number;                  // singleton: 1
    theme: 'light' | 'dark' | 'system';
    language: Language;
    fontSize: 'small' | 'medium' | 'large';
    showLatex: boolean;          // LaTeX 표시 여부
    showDifficulty: boolean;     // 난이도 표시 여부
    updatedAt: Date;
  };

  // 최근 본 문서
  recentViews: {
    id?: number;
    conceptId: string;
    viewedAt: Date;
  };
}
```

---

## 4. 라우팅 구조

```
/                           → 홈페이지 (추천/인기 개념)
/[lang]                     → 홈페이지 (언어별)

/browse                     → 전체 분야 목록
/[lang]/browse

/field/[fieldId]            → 대분류 페이지 (예: /field/geometry)
/[lang]/field/[fieldId]

/field/[fieldId]/[subfieldId]   → 소분류 페이지
/[lang]/field/[fieldId]/[subfieldId]

/concept/[conceptId]        → 개념 상세 페이지
/[lang]/concept/[conceptId]

/constants                  → 수학 상수 목록
/[lang]/constants
/constants/[constantId]     → 상수 상세

/symbols                    → 수학 기호 목록
/[lang]/symbols

/theorems                   → 유명 정리 목록
/[lang]/theorems
/theorems/[theoremId]       → 정리 상세

/search                     → 검색 결과 페이지
/[lang]/search

/favorites                  → 즐겨찾기 목록
/[lang]/favorites

/study                      → 학습 대시보드
/[lang]/study
/study/path/[pathId]        → 학습 경로 상세

/about                      → 소개
/terms                      → 이용약관
/license                    → 라이선스
/privacy                    → 개인정보처리방침
/built-with                 → 기술 스택

/[...404]                   → 404 페이지
```

---

## 5. 컴포넌트 구조

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # 상단 네비게이션
│   │   ├── Sidebar.tsx          # 분야 네비게이션
│   │   ├── Footer.tsx           # 하단
│   │   ├── Layout.tsx           # 전체 레이아웃
│   │   └── BottomNav.tsx        # 모바일 하단 네비
│   │
│   ├── ui/
│   │   ├── ThemeToggle.tsx      # 테마 전환
│   │   ├── LanguageToggle.tsx   # 언어 전환
│   │   ├── Skeleton.tsx         # 로딩 스켈레톤
│   │   ├── DifficultyBadge.tsx  # 난이도 표시 (★★★☆☆)
│   │   ├── RelationLinks.tsx    # 연관 문서 링크
│   │   └── SearchInput.tsx      # 검색 입력
│   │
│   ├── math/
│   │   ├── LaTeX.tsx            # KaTeX 렌더러
│   │   ├── Formula.tsx          # 공식 카드
│   │   ├── Example.tsx          # 예제 컴포넌트
│   │   ├── Visualization.tsx    # 시각화 래퍼
│   │   ├── Graph.tsx            # Chart.js 그래프
│   │   ├── ConstantCard.tsx     # 상수 카드
│   │   └── SymbolGrid.tsx       # 기호 그리드
│   │
│   ├── concept/
│   │   ├── ConceptCard.tsx      # 개념 미리보기 카드
│   │   ├── ConceptDetail.tsx    # 개념 상세 뷰
│   │   ├── ConceptNav.tsx       # 이전/다음 네비게이션
│   │   └── RelatedConcepts.tsx  # 연관 개념 섹션
│   │
│   └── study/
│       ├── ProgressRing.tsx     # 학습 진행률
│       ├── StudyStats.tsx       # 학습 통계
│       └── LearningPath.tsx     # 학습 경로 뷰
│
├── pages/
│   ├── HomePage.tsx
│   ├── BrowsePage.tsx
│   ├── FieldPage.tsx
│   ├── SubfieldPage.tsx
│   ├── ConceptPage.tsx
│   ├── ConstantsPage.tsx
│   ├── SymbolsPage.tsx
│   ├── TheoremsPage.tsx
│   ├── SearchPage.tsx
│   ├── FavoritesPage.tsx
│   ├── StudyPage.tsx
│   ├── AboutPage.tsx
│   └── ...
│
├── data/
│   ├── types.ts                 # 타입 정의
│   ├── fields.ts                # 18개 대분류 정의
│   ├── subfields.ts             # 소분류 정의
│   ├── concepts/
│   │   ├── index.ts             # 전체 export
│   │   ├── foundations/         # 분야별 폴더
│   │   │   ├── arithmetic.ts
│   │   │   ├── fractions.ts
│   │   │   └── number-systems.ts
│   │   ├── algebra/
│   │   ├── geometry/
│   │   └── ...
│   ├── constants.ts             # 수학 상수
│   ├── symbols.ts               # 수학 기호
│   └── theorems.ts              # 유명 정리
│
├── i18n/
│   └── index.tsx                # i18n 설정 (기존과 동일)
│
├── lib/
│   ├── db.ts                    # Dexie 설정
│   ├── search.ts                # 검색 유틸리티
│   └── katex.ts                 # KaTeX 설정
│
└── routes/
    └── (파일 기반 라우팅)
```

---

## 6. 핵심 기능

### 6.1 수식 렌더링

```tsx
// components/math/LaTeX.tsx
import katex from 'katex';

interface LaTeXProps {
  math: string;
  display?: boolean;  // block vs inline
}

export function LaTeX(props: LaTeXProps) {
  const html = () => katex.renderToString(props.math, {
    displayMode: props.display ?? false,
    throwOnError: false,
  });

  return <span innerHTML={html()} />;
}

// 사용 예시
<LaTeX math="a^2 + b^2 = c^2" display />
```

### 6.2 검색 시스템

```typescript
// Fuse.js 설정
const fuseOptions = {
  keys: [
    { name: 'name.ko', weight: 2 },
    { name: 'name.en', weight: 2 },
    { name: 'content.ko.definition', weight: 1.5 },
    { name: 'content.en.definition', weight: 1.5 },
    { name: 'tags', weight: 1 },
    { name: 'content.ko.formulas.latex', weight: 0.5 },
  ],
  threshold: 0.3,
  includeScore: true,
};
```

### 6.3 연관 문서 네비게이션

```tsx
// 문서 내 표시
<RelationLinks concept={concept}>
  → 선행: 집합론, 함수
  ← 후행: 실해석학, 복소해석학
  ↔ 관련: 위상수학
  ⚡ 응용: 물리학, 공학
</RelationLinks>
```

### 6.4 학습 경로

- 사용자가 직접 학습 경로 생성 가능
- 연관 문서 기반 자동 추천 경로
- 진행률 추적 및 복습 알림

---

## 7. UI/UX 디자인

### 7.1 색상 팔레트 (기존 확장)

```css
:root {
  /* 기존 Morning Mist 테마 유지 */
  --accent-math: #3B82F6;        /* 수학 강조색 (파랑) */
  --accent-formula: #8B5CF6;     /* 공식 강조색 (보라) */

  /* 난이도별 색상 */
  --difficulty-1: #22C55E;       /* 초등 - 녹색 */
  --difficulty-2: #84CC16;       /* 중등 - 연두 */
  --difficulty-3: #EAB308;       /* 고등 - 노랑 */
  --difficulty-4: #F97316;       /* 대학 - 주황 */
  --difficulty-5: #EF4444;       /* 대학원 - 빨강 */

  /* 분야별 색상 (18가지) */
  --field-foundations: #6366F1;
  --field-algebra: #8B5CF6;
  --field-geometry: #EC4899;
  /* ... */
}
```

### 7.2 난이도 표시 컴포넌트

```tsx
function DifficultyBadge(props: { level: DifficultyLevel }) {
  const labels = {
    1: '초등',
    2: '중등',
    3: '고등',
    4: '대학',
    5: '대학원+',
  };

  return (
    <span class={`badge difficulty-${props.level}`}>
      {'★'.repeat(props.level)}{'☆'.repeat(5 - props.level)}
      <span class="ml-1">{labels[props.level]}</span>
    </span>
  );
}
```

---

## 8. 개발 순서

### Phase 1: 기반 구축 (스캐폴딩)

```
[ ] apps/roots 디렉토리 생성
[ ] package.json 설정 (의존성)
[ ] app.config.ts 설정
[ ] 기본 레이아웃 컴포넌트
[ ] i18n 설정
[ ] Dexie 데이터베이스 설정
[ ] 라우팅 구조 생성
```

### Phase 2: 데이터 레이어

```
[ ] types.ts 전체 타입 정의
[ ] fields.ts (18개 대분류)
[ ] subfields.ts (소분류)
[ ] 샘플 개념 데이터 (분야당 2-3개)
[ ] constants.ts (수학 상수)
[ ] symbols.ts (수학 기호)
```

### Phase 3: 핵심 컴포넌트

```
[ ] LaTeX 렌더러 (KaTeX)
[ ] DifficultyBadge
[ ] ConceptCard
[ ] Formula 컴포넌트
[ ] Example 컴포넌트
[ ] RelationLinks
```

### Phase 4: 페이지 구현

```
[ ] HomePage
[ ] BrowsePage
[ ] FieldPage
[ ] ConceptPage (가장 중요)
[ ] SearchPage
[ ] ConstantsPage
[ ] SymbolsPage
```

### Phase 5: 사용자 기능

```
[ ] 즐겨찾기 시스템
[ ] 최근 본 문서
[ ] 학습 기록
[ ] 검색 기능 (Fuse.js)
```

### Phase 6: PWA & 최적화

```
[ ] PWA 설정
[ ] SEO 메타 태그
[ ] 사이트맵 생성
[ ] 성능 최적화
```

### Phase 7: 콘텐츠 확장

```
[ ] 각 분야별 개념 데이터 추가
[ ] 예제 및 시각화 추가
[ ] 연관 관계 매핑
```

---

## 9. 파일 생성 목록

```
apps/roots/
├── package.json
├── app.config.ts
├── tsconfig.json
├── src/
│   ├── app.tsx
│   ├── app.css
│   ├── entry-client.tsx
│   ├── entry-server.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── BottomNav.tsx
│   │   ├── ui/
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── LanguageToggle.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── DifficultyBadge.tsx
│   │   │   └── SearchInput.tsx
│   │   └── math/
│   │       ├── LaTeX.tsx
│   │       ├── Formula.tsx
│   │       └── Example.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── BrowsePage.tsx
│   │   ├── FieldPage.tsx
│   │   ├── ConceptPage.tsx
│   │   └── ...
│   ├── data/
│   │   ├── types.ts
│   │   ├── fields.ts
│   │   ├── subfields.ts
│   │   └── concepts/
│   ├── i18n/
│   │   └── index.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   └── search.ts
│   └── routes/
│       ├── index.tsx
│       ├── [lang]/
│       ├── browse.tsx
│       ├── field/
│       ├── concept/
│       └── [...404].tsx
└── public/
    ├── manifest.json
    ├── icons/
    ├── favicon.ico
    └── robots.txt
```

---

## 10. 기존 코드 재사용

### @soundblue/shared 패키지에서

- `validateId()` - 개념 ID 검증
- `useOnlineStatus()` - 오프라인 감지
- `OfflineIndicator` - 오프라인 배너
- `LIMITS`, `BREAKPOINTS` - 상수들

### Context 앱에서 복사/수정

- `i18n/index.tsx` - UI 라벨만 수정
- `lib/db.ts` - 스키마 확장
- `Layout.tsx` - 구조 유지, 스타일 수정
- `app.css` - 색상 변수 추가

### Permissive 앱에서 복사/수정

- Chart.js 설정 (시각화용)
- Fuse.js 검색 설정
- DocsLayout 구조 참고

---

## 11. 예상 결과물

### 홈페이지 미리보기

```
┌─────────────────────────────────────┐
│  🔢 Roots    [검색...]  🌙 한/EN  │
├─────────────────────────────────────┤
│                                     │
│  📚 수학을 쉽게 배우세요            │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │기초 │ │대수 │ │기하 │ │해석 │   │
│  │수학 │ │학   │ │학   │ │학   │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│                                     │
│  🔥 인기 개념                       │
│  ┌─────────────────────────────┐   │
│  │ 피타고라스 정리  ★★★☆☆     │   │
│  │ 직각삼각형의 세 변의 관계    │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 개념 상세 페이지 미리보기

```
┌─────────────────────────────────────┐
│  기하학 > 평면기하 > 피타고라스 정리 │
├─────────────────────────────────────┤
│                                     │
│  피타고라스 정리                    │
│  Pythagorean Theorem    ★★★☆☆ 고등 │
│                                     │
│  ──────────────────────────────     │
│  📖 정의                            │
│  직각삼각형에서 빗변의 제곱은       │
│  다른 두 변의 제곱의 합과 같다.     │
│                                     │
│  ──────────────────────────────     │
│  📐 공식                            │
│       a² + b² = c²                  │
│  • a, b: 직각을 이루는 두 변        │
│  • c: 빗변 (가장 긴 변)             │
│                                     │
│  ──────────────────────────────     │
│  ✏️ 예제                            │
│  [예제 1] a=3, b=4일 때 c는?        │
│  풀이: c² = 9 + 16 = 25             │
│       c = 5                         │
│                                     │
│  ──────────────────────────────     │
│  🔗 연관 문서                       │
│  → 선행: 직각삼각형, 제곱근         │
│  ← 후행: 삼각함수, 유클리드 기하학  │
│  ↔ 관련: 코사인 법칙               │
│  ⚡ 응용: 건축, 측량, 컴퓨터 그래픽 │
│                                     │
└─────────────────────────────────────┘
```

---

## 12. 요약

| 항목 | 내용 |
|------|------|
| **앱 이름** | Roots |
| **기반** | Context + Permissive 앱 아키텍처 |
| **주요 기능** | 수학 개념 문서, 수식 렌더링, 학습 추적 |
| **데이터 구조** | 18개 대분류, 계층적 개념 문서 |
| **핵심 추가 기능** | KaTeX, 난이도 시스템, 연관 문서 |
| **재사용 코드** | i18n, DB, Layout, PWA 설정 |
| **예상 작업량** | 7 Phase로 단계별 구현 |

---

*작성일: 2025-12-17*
*작성: Claude (Opus 4.5)*
