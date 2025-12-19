# Roots

> **Math Documentation for Learners (학습자를 위한 수학 문서)**
>
> Explore mathematical concepts from elementary to graduate level with LaTeX formulas and examples.
> (초등부터 대학원 수준까지 LaTeX 공식과 예제로 수학 개념을 탐험하세요.)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![SolidStart](https://img.shields.io/badge/SolidStart-2c4f7c?logo=solid&logoColor=white)](https://start.solidjs.com)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)

**[Live Site](https://roots.soundbluemusic.com)**

---

## What is this? (이게 뭐예요?)

A math documentation site designed for learners:

- **18 Math Fields** - From foundations to advanced topics (기초부터 고급까지)
- **LaTeX Formulas** - Beautiful math rendering (수식 렌더링)
- **Difficulty Levels** - Elementary → Graduate+ (초등 → 대학원+)
- **Examples** - Step-by-step solutions (단계별 풀이)
- **Bilingual** - Korean ↔ English (한국어 ↔ 영어)

---

## Architecture (아키텍처)

### 100% Static Site Generation (SSG)

This is a **fully static site**. No server-side rendering, no API calls at runtime.

```
Build time:  SolidStart + Vinxi → Static HTML/CSS/JS
Runtime:     Pure static files served from CDN
Storage:     localStorage / IndexedDB (favorites)
Math:        KaTeX for LaTeX rendering
```

**Why SSG?**
- **Fast** - Pre-rendered HTML, instant page loads
- **Cheap** - Host anywhere (Cloudflare Pages, GitHub Pages, etc.)
- **Simple** - No server to maintain, no database
- **Offline** - PWA support for offline access

---

## Site Structure (사이트 구조)

```
/                     Home (홈)
/browse               Browse all concepts (전체 탐색)
/search               Search concepts (검색)
/field/[id]           Field page (분야 페이지)
/concept/[id]         Concept page (개념 페이지)
/constants            Math constants (수학 상수)
/favorites            Saved concepts (즐겨찾기)
/about                About page (소개)
```

Supports both Korean (`/ko/...`) and English (`/en/...`) URL prefixes.

---

## Data Structure (데이터 구조)

### MathConcept (수학 개념)

```ts
interface MathConcept {
  id: string;              // 고유 ID (예: 'pythagorean-theorem')
  name: {
    ko: string;            // 한국어명 (예: '피타고라스 정리')
    en: string;            // 영어명 (예: 'Pythagorean Theorem')
  };
  field: MathField;        // 대분류 (예: 'geometry')
  subfield: string;        // 소분류 (예: 'euclidean')
  difficulty: 1 | 2 | 3 | 4 | 5;  // 난이도 레벨
  content: {
    ko: ConceptContent;    // 한국어 내용
    en: ConceptContent;    // 영어 내용
  };
  relations: {
    prerequisites: string[];   // 선행 개념
    nextTopics: string[];      // 후행 개념
    related: string[];         // 관련 개념
    applications: string[];    // 응용 분야
  };
  tags: string[];          // 검색용 태그
}
```

### Difficulty Levels (난이도)

| Level | Korean | English |
|:-----:|:-------|:--------|
| 1 | 초등 | Elementary |
| 2 | 중등 | Middle School |
| 3 | 고등 | High School |
| 4 | 대학 | Undergraduate |
| 5 | 대학원+ | Graduate+ |

### Math Fields (18개 대분류)

| ID | Korean | English | Icon |
|:---|:-------|:--------|:----:|
| `foundations` | 기초 수학 | Foundations | 📐 |
| `algebra` | 대수학 | Algebra | 🔢 |
| `geometry` | 기하학 | Geometry | 📐 |
| `trigonometry` | 삼각법 | Trigonometry | 📊 |
| `analysis` | 해석학 | Analysis | ∫ |
| `linear-algebra` | 선형대수 | Linear Algebra | ⊗ |
| `probability` | 확률/통계 | Probability & Statistics | 🎲 |
| `discrete` | 이산수학 | Discrete Math | 🔗 |
| `number-theory` | 수론 | Number Theory | 🔢 |
| `topology` | 위상수학 | Topology | 🍩 |
| `logic` | 수리논리 | Mathematical Logic | ⊢ |
| `dynamics` | 동역학/카오스 | Dynamics & Chaos | 🌀 |
| `optimization` | 최적화 | Optimization | 📈 |
| `numerical` | 수치해석 | Numerical Analysis | 🖥️ |
| `applied` | 응용수학 | Applied Math | 🔬 |
| `constants` | 수학 상수 | Constants | π |
| `symbols` | 수학 기호 | Symbols | ∑ |
| `theorems` | 유명 정리 | Famous Theorems | 🏆 |

---

## Adding New Concepts (개념 추가하기)

Use the CLI tool from monorepo root:

```bash
# Add a new concept
pnpm add-data roots concept

# Follow the prompts to enter:
# - Concept name (KO/EN)
# - Field and subfield
# - Difficulty level
# - Definition, formulas, examples
```

Or manually add to `src/data/concepts/[field].ts`:

```ts
export const geometryConcepts: MathConcept[] = [
  {
    id: "pythagorean-theorem",
    name: {
      ko: "피타고라스 정리",
      en: "Pythagorean Theorem",
    },
    field: "geometry",
    subfield: "euclidean",
    difficulty: 2,
    content: {
      ko: {
        definition: "직각삼각형에서 빗변의 제곱은 다른 두 변의 제곱의 합과 같다.",
        formulas: [
          {
            latex: "a^2 + b^2 = c^2",
            description: "직각삼각형의 세 변 관계",
            variables: [
              { symbol: "a", meaning: "밑변" },
              { symbol: "b", meaning: "높이" },
              { symbol: "c", meaning: "빗변" },
            ],
          },
        ],
        examples: [
          {
            problem: "밑변 3, 높이 4인 직각삼각형의 빗변 구하기",
            solution: "c = √(3² + 4²) = √25 = 5",
            latex: "c = \\sqrt{3^2 + 4^2} = 5",
          },
        ],
      },
      en: {
        definition: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
        formulas: [/* ... */],
        examples: [/* ... */],
      },
    },
    relations: {
      prerequisites: ["triangle", "square-root"],
      nextTopics: ["distance-formula", "trigonometry-basics"],
      related: ["euclidean-distance"],
      applications: ["physics-vectors", "computer-graphics"],
    },
    tags: ["theorem", "triangle", "classic"],
  },
];
```

---

## Features (기능)

- **🔍 Search** - Full-text search with difficulty filtering
- **📐 LaTeX** - Beautiful math formula rendering with KaTeX
- **📱 PWA** - Install as mobile app, works offline
- **🌙 Dark Mode** - System preference detection
- **🌐 i18n** - Korean / English interface
- **💾 Favorites** - Save concepts to IndexedDB
- **🔗 Relations** - Navigate between related concepts

---

## Development (개발)

```bash
# From monorepo root
pnpm dev:roots       # → http://localhost:3005

# Build (outputs to .output/public)
pnpm build:roots
```

---

## Tech Stack (기술 스택)

| Role | Technology |
|:-----|:-----------|
| Framework | SolidStart |
| UI | Solid.js |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Math Rendering | KaTeX |
| Storage | localStorage / IndexedDB |
| Hosting | Cloudflare Pages |

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
