# Roots

> **Math Documentation for Learners (학습자를 위한 수학 문서)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)
[![SSG Routes](https://img.shields.io/badge/SSG_Routes-976-blue)](react-router.config.ts)

**[Live Site](https://roots.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A math documentation site designed for learners:

- **438 Math Concepts** - From elementary to graduate level
- **50 Math Fields** - Algebra, Calculus, Geometry, etc.
- **MathML Rendering** - Browser-native LaTeX formulas
- **Difficulty Levels** - Elementary → Graduate+
- **Bilingual** - Korean ↔ English

---

## Architecture (아키텍처)

### 100% SSG with Build-time Data Prerendering

```
react-router.config.ts
├── ssr: false
├── prerender() → 976 static routes generated
│   ├── concept-names.json → 438 concept routes × 2 langs
│   └── fields.ts → 50 field routes × 2 langs
└── loader() functions → .data files for each route

Build output (build/client/):
├── index.html, ko/index.html
├── concept/{id}.html, ko/concept/{id}.html (×438)
├── field/{id}.html, ko/field/{id}.html (×50)
└── *.data files (prerendered loader data)
```

### Data Architecture

```
data/roots/concepts/      # Centralized JSON (SSoT)
├── algebra.json
├── calculus.json
├── geometry.json
└── ... (50 field files, 438 concepts total)

app/data/
├── concepts.ts           # TypeScript loader
├── fields.ts             # Field definitions
└── types.ts              # TypeScript types
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
| `/search` | ✓ | ✓ | - | Search with MiniSearch |
| `/concept/:conceptId` | ✓ | ✓ | 438 | Concept page |
| `/field/:fieldId` | ✓ | ✓ | 50 | Field page |
| `/constants` | ✓ | ✓ | - | Math constants |
| `/favorites` | ✓ | ✓ | - | Saved concepts |
| `/about` | ✓ | ✓ | - | About |

**Total:** 976 SSG routes (488 EN + 488 KO)

---

## Features (기능)

| Feature | Implementation |
|:--------|:---------------|
| 🔍 Search | MiniSearch (useSearchWorker) |
| 📱 PWA | vite-plugin-pwa |
| 🌙 Dark Mode | localStorage + CSS variables |
| 🌐 i18n | URL-based (`/ko/*`) + Paraglide |
| 💾 Favorites | IndexedDB (Dexie) |

---

## Search Algorithm

```typescript
// MiniSearch-based offline search
// Uses @soundblue/search package
import { useSearchWorker } from '@soundblue/search/react';

// search-index.json loaded via Web Worker
const { results, isLoading } = useSearchWorker(query);
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
| Search | MiniSearch (via @soundblue/search) |
| Storage | localStorage / IndexedDB |
| Hosting | Cloudflare Pages |

---

## ⛔ Code Quality (코드 품질)

> **하드코딩 규칙: 우수한 설계 목적일 경우에만 허용**

```typescript
// ❌ NEVER - 테스트 통과/에러 회피용
const CONCEPT_COUNT = 438;  // Magic number
return concepts.length || 438;

// ✅ ALLOWED - 우수한 설계
export const DIFFICULTY_LEVELS = ['elementary', 'middle', 'high'] as const;
```

See [root README](../../README.md#-code-quality-rules-코드-품질-규칙) for full guidelines.

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
