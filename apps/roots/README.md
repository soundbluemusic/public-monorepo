# Roots

> **Math Documentation for Learners (학습자를 위한 수학 문서)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-v1-FF4154?logo=react)](https://tanstack.com/start)
[![SSR](https://img.shields.io/badge/SSR-Cloudflare_Workers-F38020?logo=cloudflare)](https://developers.cloudflare.com/workers/)

**[Live Site](https://roots.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A math documentation site designed for learners:

- **438 Math Concepts** - From elementary to graduate level
- **18 Math Fields** - Algebra, Calculus, Geometry, etc.
- **MathML Rendering** - Browser-native LaTeX formulas
- **Difficulty Levels** - Elementary → Graduate+
- **Bilingual** - Korean ↔ English

---

## Architecture (아키텍처)

### SSR with Cloudflare Workers

```
vite.config.ts (TanStack Start + Cloudflare)
├── tanstackStart() - SSR 프레임워크
├── cloudflare() - Workers 어댑터
└── loader() → 서버 사이드 데이터 로딩

Deployment:
├── dist/server/ (Workers 핸들러)
└── dist/client/ (Workers Assets - 정적 파일)
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

**Total:** 920 routes (460 EN + 460 KO)

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

# Build (outputs to dist/client)
pnpm build:roots
```

---

## Tech Stack (기술 스택)

| Role | Technology |
|:-----|:-----------|
| Framework | TanStack Start |
| UI | React |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Math Rendering | Browser-native MathML |
| Search | MiniSearch (via @soundblue/search) |
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

See [root README](../../README.md#-code-quality-rules-코드-품질-규칙) for full guidelines.

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
