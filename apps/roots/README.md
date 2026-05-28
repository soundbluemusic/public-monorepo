# Roots

> **Math Documentation for Learners (학습자를 위한 수학 문서)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-6-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![SSR](https://img.shields.io/badge/SSR-Cloudflare_Workers-F38020?logo=cloudflare)](https://developers.cloudflare.com/workers/)

**[Live Site](https://roots.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A math documentation site designed for learners:

- **438 Math Concepts** - From elementary to graduate level
- **18 Math Fields** - Algebra, Calculus, Geometry, etc.
- **KaTeX Rendering** - LaTeX formulas → HTML
- **Difficulty Levels** - Elementary → Graduate+
- **Bilingual** - Korean ↔ English

---

## Architecture (아키텍처)

### Astro 6 + Cloudflare Workers (SSR)

```
astro.config.mjs
├── @astrojs/cloudflare (adapter)
├── output: 'server'
└── i18n: en (default) + ko (prefix)

Deployment:
├── dist/_worker.js/   (Astro fetch handler)
└── dist/              (정적 자산)
```

### Data Architecture

```
data/roots/concepts/      # Centralized JSON (SSoT)
├── algebra.json
├── calculus.json
├── geometry.json
└── ... (18 field files, 438 concepts total)

app/data/
├── concepts.ts           # TypeScript loader
├── fields.ts             # Field definitions
└── types.ts              # TypeScript types
```

### Math Rendering

```
LaTeX input → katex.renderToString() → HTML
```

`src/components/pages/ConceptPage.astro:2` 에서 `katex` 패키지 사용. CSS는 `src/styles/global.css:3` 에서 `katex/dist/katex.min.css` 임포트.

---

## Routes (라우트 구조)

| Route | EN | KO | Description |
|:------|:--:|:--:|:------------|
| `/` | ✓ | ✓ | Home |
| `/browse` | ✓ | ✓ | Browse all concepts |
| `/search` | ✓ | ✓ | Search with MiniSearch |
| `/concept/[conceptId]` | ✓ | ✓ | Concept page (438) |
| `/field/[fieldId]` | ✓ | ✓ | Field page (18) |
| `/constants` | ✓ | ✓ | Math constants |
| `/favorites` | ✓ | ✓ | Saved concepts |
| `/about` | ✓ | ✓ | About |

**Mode:** Astro SSR via Cloudflare Workers

---

## Features (기능)

| Feature | Implementation |
|:--------|:---------------|
| 🔍 Search | MiniSearch via `@soundblue/search` |
| 🌙 Dark Mode | localStorage + CSS variables |
| 🌐 i18n | URL-based (`/ko/*`) via Astro `i18n` config |
| 💾 Favorites | IndexedDB (Dexie) |
| 📐 Math | KaTeX (`katex` package) |

---

## Astro Page Pattern

```astro
---
// src/pages/concept/[conceptId].astro
import { getConceptById } from '../../../app/data/concepts';
import BaseLayout from '../../layouts/BaseLayout.astro';

const { conceptId } = Astro.params;
const concept = getConceptById(conceptId!);
if (!concept) {
  return Astro.redirect('/404', 404);
}
---

<BaseLayout title={concept.name.en}>
  <h1>{concept.name.en}</h1>
</BaseLayout>
```

---

## Development (개발)

```bash
# From monorepo root
pnpm dev:roots       # → http://localhost:3005

# Build
pnpm build:roots
```

---

## Tech Stack (기술 스택)

| Role | Technology |
|:-----|:-----------|
| Framework | Astro 6 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Math Rendering | KaTeX (server-rendered) |
| Search | MiniSearch (via `@soundblue/search`) |
| Storage | localStorage / IndexedDB |
| Hosting | Cloudflare Workers |

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

See [root README](../../README.md) for full guidelines.

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
