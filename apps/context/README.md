# Context

> **Korean Dictionary for Learners (학습자를 위한 한국어 사전)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)
[![SSG Routes](https://img.shields.io/badge/SSG_Routes-348-blue)](react-router.config.ts)

**[Live Site](https://context.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A Korean dictionary designed for language learners:

- **344 Word Entries** - Organized by category and difficulty
- **Bilingual Support** - Korean ↔ English translations
- **Romanization** - Pronunciation guides
- **Categories** - 17 topics (greetings, food, emotions, etc.)
- **Difficulty Levels** - Beginner → Advanced

---

## Architecture (아키텍처)

### 100% SSG with Build-time Data Prerendering

```
react-router.config.ts
├── ssr: false
├── prerender() → 348 static routes generated
└── loader() functions → .data files for each route

Build output (build/client/):
├── index.html, ko/index.html
├── entry/hello.html, ko/entry/hello.html (×344)
├── category/greetings.html (×17 categories)
└── *.data files (prerendered loader data)
```

### Data Flow

```
Build time:
  data/entries/*.json → prerender() → loader() → .data files

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
| `/entry/:entryId` | ✓ | ✓ | 344 | Word entry page |
| `/category/:categoryId` | ✓ | ✓ | 17 | Category page |
| `/about` | ✓ | ✓ | - | About |
| `/my-learning` | ✓ | ✓ | - | Learning progress |
| `/built-with` | ✓ | ✓ | - | Tech stack |
| `/privacy` | ✓ | ✓ | - | Privacy policy |
| `/terms` | ✓ | ✓ | - | Terms of service |
| `/license` | ✓ | ✓ | - | License |

**Total:** 348 SSG routes (174 EN + 174 KO)

---

## Data Structure (데이터 구조)

```
app/data/
├── entries/           # JSON files by category
│   ├── greetings.json
│   ├── food.json
│   ├── emotions.json
│   └── ... (17 categories)
├── categories.ts      # Category definitions
├── types.ts           # TypeScript types
└── entries.legacy.ts  # Legacy data (migration pending)
```

### Entry Schema

```typescript
interface MeaningEntry {
  id: string;              // 'hello'
  korean: string;          // '안녕하세요'
  romanization: string;    // 'an-nyeong-ha-se-yo'
  partOfSpeech: string;    // 'noun' | 'verb' | ...
  categoryId: string;      // 'greetings'
  difficulty: string;      // 'beginner' | 'intermediate' | 'advanced'
  tags: string[];
  translations: {
    ko: { word: string; explanation: string };
    en: { word: string; explanation: string };
  };
}
```

---

## Features (기능)

| Feature | Implementation |
|:--------|:---------------|
| 🔍 Search | In-memory filter with `useMemo` |
| 📱 PWA | vite-plugin-pwa |
| 🌙 Dark Mode | localStorage + CSS variables |
| 🌐 i18n | URL-based (`/ko/*`) + Paraglide |
| 💾 Favorites | IndexedDB (Dexie) |
| 📊 Study Records | IndexedDB (Dexie) |

---

## Search Algorithm

```typescript
// Layout.tsx - Real-time search (no debounce)
const searchResults = useMemo(() => {
  const q = searchQuery.toLowerCase().trim().slice(0, 100);
  if (!q) return [];

  return meaningEntries
    .filter(entry =>
      entry.korean.includes(q) ||
      entry.romanization.toLowerCase().includes(q) ||
      entry.translations[locale].word.toLowerCase().includes(q)
    )
    .slice(0, 8);
}, [searchQuery, locale]);
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
| Storage | localStorage / IndexedDB |
| Hosting | Cloudflare Pages |

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
