# Roots

> **Math Documentation for Learners (학습자를 위한 수학 문서)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)
[![SSG Routes](https://img.shields.io/badge/SSG_Routes-878-blue)](react-router.config.ts)

**[Live Site](https://roots.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A math documentation site designed for learners:

- **414 Math Concepts** - From elementary to graduate level
- **18 Math Fields** - Algebra, Calculus, Geometry, etc.
- **MathML Rendering** - Browser-native LaTeX formulas
- **Difficulty Levels** - Elementary → Graduate+
- **Bilingual** - Korean ↔ English

---

## Architecture (아키텍처)

### 100% SSG with Build-time Data Prerendering

```
react-router.config.ts
├── ssr: false
├── prerender() → 878 static routes generated
│   ├── concept-names.json → 414 concept routes
│   └── fields.ts → 18 field routes
└── loader() functions → .data files for each route

Build output (build/client/):
├── index.html, ko/index.html
├── concept/algebra.html, ko/concept/algebra.html (×414)
├── field/calculus.html, ko/field/calculus.html (×18)
└── *.data files (prerendered loader data)
```

### Math Rendering

```
LaTeX input → app/components/math/LaTeX.tsx → MathML output
```

Browser-native MathML (no KaTeX/MathJax bundle required).

---

## Routes (라우트 구조)

| Route | EN | KO | Dynamic | Description |
|:------|:--:|:--:|:-------:|:------------|
| `/` | ✓ | ✓ | - | Home |
| `/browse` | ✓ | ✓ | - | Browse all concepts |
| `/search` | ✓ | ✓ | - | Search with Fuse.js |
| `/concept/:conceptId` | ✓ | ✓ | 414 | Concept page |
| `/field/:fieldId` | ✓ | ✓ | 18 | Field page |
| `/constants` | ✓ | ✓ | - | Math constants |
| `/favorites` | ✓ | ✓ | - | Saved concepts |
| `/about` | ✓ | ✓ | - | About |

**Total:** 878 SSG routes (439 EN + 439 KO)

---

## Data Structure (데이터 구조)

```
app/data/
├── concepts/          # TypeScript files per concept
│   ├── algebra.ts
│   ├── calculus.ts
│   ├── geometry.ts
│   └── ... (414 concepts)
├── fields.ts          # 18 math fields
├── subfields.ts       # Subfields per field
├── types.ts           # TypeScript types
└── index.ts           # Unified export

public/
├── concept-names.json # Concept IDs for prerender()
└── search-index.json  # Fuse.js search index
```

### Concept Schema

```typescript
interface MathConcept {
  id: string;              // 'pythagorean-theorem'
  name: { ko: string; en: string };
  field: MathField;        // 'geometry'
  subfield: string;        // 'triangles'
  difficulty: DifficultyLevel;
  content: {
    ko: ConceptContent;
    en: ConceptContent;
  };
  latex?: string;          // '$a^2 + b^2 = c^2$'
  relations: ConceptRelations;
  tags: string[];
}
```

---

## Search Algorithm

```typescript
// Fuse.js-based offline search
// lib/search.ts
const fuse = new Fuse(concepts, {
  keys: [
    { name: 'name.ko', weight: 3.0 },
    { name: 'name.en', weight: 2.0 },
    { name: 'tags', weight: 1.0 },
  ],
  threshold: 0.3,
  minMatchCharLength: 2,
});

// Dynamic loading: search-index.json loaded on demand
```

---

## Development (개발)

```bash
# From monorepo root
pnpm dev:roots       # → http://localhost:3005

# Build (outputs to build/client)
pnpm build:roots
```

---

## Tech Stack (기술 스택)

| Role | Technology |
|:-----|:-----------|
| Framework | React Router v7 |
| UI | React |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Math Rendering | Browser-native MathML |
| Storage | localStorage / IndexedDB |
| Hosting | Cloudflare Pages |

---

## ⛔ Code Quality (코드 품질)

> **하드코딩 규칙: 우수한 설계 목적일 경우에만 허용**

```typescript
// ❌ NEVER - 테스트 통과/에러 회피용
const CONCEPT_COUNT = 414;  // Magic number
return concepts.length || 414;

// ✅ ALLOWED - 우수한 설계
export const DIFFICULTY_LEVELS = ['elementary', 'middle', 'high'] as const;
```

See [root README](../../README.md#-code-quality-rules-코드-품질-규칙) for full guidelines.

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
