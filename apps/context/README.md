# Context

> **Korean Dictionary for Learners (학습자를 위한 한국어 사전)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
[![SSR + D1](https://img.shields.io/badge/SSR-D1_Database-F38020?logo=cloudflare)](https://developers.cloudflare.com/d1/)
[![Entries](https://img.shields.io/badge/Entries-16836-blue)](react-router.config.ts)

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

### SSR + D1 전용

> ⚠️ **SSG 빌드는 지원하지 않습니다.** 모든 entry 페이지는 D1에서 실시간 조회합니다.

| 항목 | 설명 |
|:-----|:-----|
| 렌더링 모드 | **SSR** (Cloudflare Pages Functions) |
| 데이터베이스 | Cloudflare D1 (`context-db`) |
| 배포 명령어 | `pnpm deploy` |

### 아키텍처 다이어그램

```
react-router.config.ts
├── ssr: true (고정)
├── Cloudflare Adapter (nodejs_compat)
└── loader() → D1 Database 실시간 쿼리

Cloudflare Pages:
├── Static Assets (build/client/)
├── functions/[[path]].ts (Pages Functions 핸들러)
│   ├── /__manifest → React Router Lazy Route Discovery
│   ├── /entry/:id → D1 쿼리
│   ├── /api/offline-db → D1 전체 덤프 (오프라인용)
│   └── /sitemap*.xml → D1에서 동적 생성
├── public/_routes.json (Functions 라우팅 규칙)
└── D1 Database (context-db)
    ├── entries (16836 rows)
    ├── categories (52 rows)
    └── conversations (53 rows)
```

### D1 Database Schema

```sql
-- entries 테이블
CREATE TABLE entries (
  id TEXT PRIMARY KEY,
  korean TEXT NOT NULL,
  english TEXT,
  romanization TEXT,
  category_id TEXT NOT NULL,
  difficulty TEXT,
  part_of_speech TEXT,
  audio_url TEXT,
  examples TEXT,  -- JSON array
  tags TEXT       -- JSON array
);

-- categories 테이블
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name_ko TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  entry_count INTEGER DEFAULT 0
);
```

### Data Flow

```
Request → Cloudflare Pages Function → D1 Query → React SSR → HTML Response
```

### Sitemap Generation

SSR 모드에서 사이트맵은 D1에서 **실시간 동적 생성**됩니다:

| Route | 설명 |
|:------|:-----|
| `/sitemap.xml` | 인덱스 (모든 사이트맵 링크) |
| `/sitemap-pages.xml` | 정적 페이지 |
| `/sitemap-categories.xml` | 카테고리 목록 |
| `/sitemap-entry-{categoryId}.xml` | 카테고리별 엔트리 (52개) |
| `/api/offline-db` | 오프라인 DB 덤프 (JSON) |

---

## Routes (라우트 구조)

| Route | EN | KO | Mode | Description |
|:------|:--:|:--:|:----:|:------------|
| `/` | ✓ | ✓ | Static | Home |
| `/browse` | ✓ | ✓ | Static | Browse all entries |
| `/entry/:entryId` | ✓ | ✓ | **SSR** | Word entry page (D1) |
| `/category/:categoryId` | ✓ | ✓ | Static | Category page |
| `/conversation/:conversationId` | ✓ | ✓ | Static | Conversation page |
| `/sitemap.xml` | ✓ | - | **SSR** | Sitemap index (D1) |
| `/sitemap-*.xml` | ✓ | - | **SSR** | Category sitemaps (D1) |
| `/api/offline-db` | ✓ | - | **SSR** | Offline DB dump (D1) |
| `/download` | ✓ | ✓ | Static | Offline download page |
| `/about` | ✓ | ✓ | Static | About |
| `/my-learning` | ✓ | ✓ | Static | Learning progress |
| `/built-with` | ✓ | ✓ | Static | Tech stack |
| `/privacy` | ✓ | ✓ | Static | Privacy policy |
| `/terms` | ✓ | ✓ | Static | Terms of service |
| `/license` | ✓ | ✓ | Static | License |

**Data:** 16836 entries + 25 categories (D1 Database)

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
| 📥 Offline Mode | D1 → IndexedDB 동기화 (`/api/offline-db`) |

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

# Build
pnpm build:context   # SSR 빌드 (기본)
```

---

## Deployment (배포)

```bash
cd apps/context
pnpm build   # SSR 빌드
pnpm deploy  # Cloudflare Pages 배포
```

**필수 설정 (Cloudflare Dashboard):**
- D1 Binding: `DB` → `context-db`

### Configuration Files

| File | Purpose |
|:-----|:--------|
| `wrangler.toml` | D1 바인딩, Pages 설정 |
| `functions/[[path]].ts` | Pages Functions 핸들러 (D1 바인딩 전달) |
| `public/_routes.json` | Functions 라우팅 규칙 (`/__manifest`, `/api/*` 등) |
| `react-router.config.ts` | SSR 설정 (`ssr: true` 고정) |
| `app/routes.ts` | 라우트 정의 (API 엔드포인트 포함) |

---

## Tech Stack (기술 스택)

| Role | Technology |
|:-----|:-----------|
| Framework | React Router v7 (SSR mode) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| **Database** | **Cloudflare D1** (SQLite) |
| Search | MiniSearch (via @soundblue/search) |
| Storage | localStorage / IndexedDB (client) |
| Hosting | Cloudflare Pages (Functions) |

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
