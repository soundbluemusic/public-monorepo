# Context

> **Korean Dictionary for Learners (학습자를 위한 한국어 사전)**
>
> Learn Korean words with translations, examples, and pronunciation guides.
> (번역, 예문, 발음 가이드와 함께 한국어를 학습하세요.)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![SolidStart](https://img.shields.io/badge/SolidStart-2c4f7c?logo=solid&logoColor=white)](https://start.solidjs.com)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)

**[Live Site](https://context.soundbluemusic.com)**

---

## What is this? (이게 뭐예요?)

A Korean dictionary designed for language learners:

- **Bilingual Support** - Korean ↔ English translations (한국어 ↔ 영어 번역)
- **Romanization** - Pronunciation guides for non-Korean speakers (로마자 표기)
- **Categories** - Words organized by topic (주제별 분류)
- **Difficulty Levels** - Beginner → Advanced (초급 → 고급)
- **Examples** - Real usage examples (실제 예문)

---

## Architecture (아키텍처)

### 100% Static Site Generation (SSG)

This is a **fully static site**. No server-side rendering, no API calls at runtime.

```
Build time:  SolidStart + Vinxi → Static HTML/CSS/JS
Runtime:     Pure static files served from CDN
Storage:     localStorage / IndexedDB (favorites, study records)
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
/browse               Browse all entries (전체 검색)
/category/[id]        Category page (카테고리 페이지)
/entry/[id]           Word entry page (단어 페이지)
/about                About page (소개)
/sitemap              Sitemap (사이트맵)
```

Supports both Korean (`/ko/...`) and English (`/en/...`) URL prefixes.

---

## Data Structure (데이터 구조)

### MeaningEntry (단어 엔트리)

```ts
interface MeaningEntry {
  id: string;              // 고유 ID (예: 'hello-1')
  korean: string;          // 한국어 단어 (예: '안녕하세요')
  romanization: string;    // 로마자 표기 (예: 'annyeonghaseyo')
  pronunciation?: string;  // 발음 표기 (예: '[안녕하세요]')
  partOfSpeech: string;    // 품사 (noun, verb, adjective, etc.)
  categoryId: string;      // 카테고리 ID
  translations: {
    ko: Translation;       // 한국어 설명
    en: Translation;       // 영어 번역
  };
  tags: string[];          // 검색용 태그
  difficulty: string;      // 난이도 (beginner, intermediate, advanced)
  frequency?: string;      // 사용 빈도 (common, frequent, occasional, rare)
}
```

### Categories (카테고리)

| ID | Korean | English | Icon |
|:---|:-------|:--------|:----:|
| `greetings` | 인사 | Greetings | 👋 |
| `emotions` | 감정 | Emotions | 💭 |
| `daily-life` | 일상생활 | Daily Life | 🏠 |
| `food` | 음식 | Food | 🍜 |
| `travel` | 여행 | Travel | ✈️ |
| `work` | 직장 | Work | 💼 |
| `culture` | 문화 | Culture | 🎭 |
| `numbers` | 숫자/시간 | Numbers & Time | 🔢 |
| `music` | 음악 | Music | 🎸 |
| `art` | 예술 | Art | 🎨 |
| `sports` | 스포츠 | Sports | ⚽ |
| `space` | 우주 | Space | 🚀 |
| `physics` | 물리학 | Physics | ⚛️ |
| `math` | 수학 | Mathematics | 📐 |

---

## Adding New Entries (단어 추가하기)

Use the CLI tool from monorepo root:

```bash
# Add a new entry
pnpm add-data context entry

# Follow the prompts to enter:
# - Korean word
# - Romanization
# - Category
# - Translations
# - Difficulty level
```

Or manually add to `src/data/entries/[category].ts`:

```ts
export const greetingsEntries: MeaningEntry[] = [
  {
    id: "hello-1",
    korean: "안녕하세요",
    romanization: "annyeonghaseyo",
    partOfSpeech: "expression",
    categoryId: "greetings",
    translations: {
      ko: {
        word: "안녕하세요",
        explanation: "만날 때 하는 인사말",
        examples: ["안녕하세요, 반갑습니다."],
      },
      en: {
        word: "Hello",
        explanation: "A greeting when meeting someone",
        examples: ["Hello, nice to meet you."],
      },
    },
    tags: ["formal", "greeting", "polite"],
    difficulty: "beginner",
    frequency: "common",
  },
];
```

---

## Features (기능)

- **🔍 Search** - Full-text search across all entries
- **📱 PWA** - Install as mobile app, works offline
- **🌙 Dark Mode** - System preference detection
- **🌐 i18n** - Korean / English interface
- **💾 Favorites** - Save words to IndexedDB
- **📊 Study Records** - Track learning progress locally

---

## Development (개발)

```bash
# From monorepo root
pnpm dev:context     # → http://localhost:3003

# Build (outputs to .output/public)
pnpm build:context
```

---

## Tech Stack (기술 스택)

| Role | Technology |
|:-----|:-----------|
| Framework | SolidStart |
| UI | Solid.js |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Storage | localStorage / IndexedDB |
| Hosting | Cloudflare Pages |

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
