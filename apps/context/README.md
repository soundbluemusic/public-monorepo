# Context

> **Korean Dictionary for Learners (학습자를 위한 한국어 사전)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)
[![SSG Routes](https://img.shields.io/badge/SSG_Routes-33746-blue)](react-router.config.ts)

**[Live Site](https://context.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A Korean dictionary designed for language learners:

- **16836 Word Entries** - Organized by category and difficulty
- **Bilingual Support** - Korean ↔ English translations
- **Romanization** - Pronunciation guides
- **Categories** - 21 topics + 7 conversation categories
- **Difficulty Levels** - Beginner → Advanced

---

## Architecture (아키텍처)

### 100% SSG with Build-time Data Prerendering

```
react-router.config.ts
├── ssr: false
├── prerender() → 33746 static routes generated
│   ├── entries → 16836 × 2 langs
│   ├── categories → 21 × 2 langs
│   └── conversations → 7 × 2 langs
└── loader() functions → .data files for each route

Build output (build/client/):
├── index.html, ko/index.html
├── entry/{id}.html, ko/entry/{id}.html (×16836)
├── category/{id}.html, ko/category/{id}.html (×21)
├── conversation/{id}.html, ko/conversation/{id}.html (×7)
└── *.data files (prerendered loader data)
```

### Data Architecture

```
data/context/             # Centralized JSON (SSoT)
├── entries/              # 22 category files
│   ├── greetings.json
│   ├── food.json
│   └── ... (16836 entries total)
└── conversations/        # 7 conversation files

app/data/
├── entries.ts            # TypeScript loader
├── categories.ts         # Category definitions
└── types.ts              # TypeScript types
```

### Data Flow

```
Build time:
  data/context/*.json → prerender() → loader() → .data files

Runtime:
  Static HTML + .data → useLoaderData() → React component
  IndexedDB → favorites, study records (client-only)
```

---

## Routes (라우트 구조)

| Route | EN | KO | Dynamic | Description |
|:------|:--:|:--:|:-------:|:------------|
| `/` | ✓ | ✓ | - | Home |
| `/browse` | ✓ | ✓ | - | Browse all entries |
| `/entry/:entryId` | ✓ | ✓ | 16836 | Word entry page |
| `/category/:categoryId` | ✓ | ✓ | 21 | Category page |
| `/conversation/:conversationId` | ✓ | ✓ | 7 | Conversation page |
| `/about` | ✓ | ✓ | - | About |
| `/my-learning` | ✓ | ✓ | - | Learning progress |
| `/built-with` | ✓ | ✓ | - | Tech stack |
| `/privacy` | ✓ | ✓ | - | Privacy policy |
| `/terms` | ✓ | ✓ | - | Terms of service |
| `/license` | ✓ | ✓ | - | License |

**Total:** 33746 SSG routes (16873 EN + 16873 KO)

---

## Features (기능)

| Feature | Implementation |
|:--------|:---------------|
| 🔍 Search | MiniSearch (useSearchWorker) |
| 📱 PWA | vite-plugin-pwa |
| 🌙 Dark Mode | localStorage + CSS variables |
| 🌐 i18n | URL-based (`/ko/*`) + Paraglide |
| 💾 Favorites | IndexedDB (Dexie) |
| 📊 Study Records | IndexedDB (Dexie) |

---

## Search Algorithm

```typescript
// MiniSearch-based fuzzy search with Web Worker
// Uses @soundblue/search package
import { useSearchWorker } from '@soundblue/search/react';

const { query, setQuery, results, isReady } = useSearchWorker({
  indexUrl: '/search-index.json',
  locale,
  debounceMs: 150,
});
```

---

## Development (개발)

```bash
# From monorepo root
pnpm dev:context     # → http://localhost:3003

# Build (outputs to build/client)
pnpm build:context
```

---

## Tech Stack (기술 스택)

| Role | Technology |
|:-----|:-----------|
| Framework | React Router v7 |
| UI | React |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Search | MiniSearch (via @soundblue/search) |
| Storage | localStorage / IndexedDB |
| Hosting | Cloudflare Pages |

---

## ⛔ Code Quality (코드 품질)

> **하드코딩 규칙: 우수한 설계 목적일 경우에만 허용**

```typescript
// ❌ NEVER - 테스트 통과/에러 회피용
const ENTRY_COUNT = 978;  // Magic number
return entries.length || 978;

// ✅ ALLOWED - 우수한 설계
export const LIMITS = { ID_LENGTH: 100 } as const;  // Named, documented
```

See [root README](../../README.md#-code-quality-rules-코드-품질-규칙) for full guidelines.

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
