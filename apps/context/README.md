# Context

> **Korean Dictionary for Learners (학습자를 위한 한국어 사전)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-6-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![SSR + D1](https://img.shields.io/badge/SSR-D1_Database-F38020?logo=cloudflare)](https://developers.cloudflare.com/d1/)

**[Live Site](https://context.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A Korean dictionary designed for language learners:

- **16,394 Word Entries** - Organized by category and difficulty (D1)
- **Bilingual Support** - Korean ↔ English translations
- **Romanization** - Pronunciation guides
- **Categories** - 52 topics + 53 conversation categories
- **Difficulty Levels** - Beginner → Advanced

---

## Architecture (아키텍처)

### SSR + D1 전용 (Astro 7 + Cloudflare Workers)

> ⚠️ **SSG 빌드는 지원하지 않습니다.** 모든 entry 페이지는 D1에서 실시간 조회합니다.

| 항목 | 설명 |
|:-----|:-----|
| 빌드 도구 | **Astro 7** (`astro build`) |
| 렌더링 모드 | **SSR** (`output: 'server'`) |
| 어댑터 | `@astrojs/cloudflare` |
| 데이터베이스 | Cloudflare D1 (`context-db`) |
| 배포 명령어 | `pnpm deploy` |

### 아키텍처 다이어그램

```
astro.config.mjs (Astro 7 + Cloudflare adapter)
├── @astrojs/cloudflare (adapter)
├── output: 'server' (SSR)
└── i18n: en (default) + ko (prefix)

Cloudflare Workers:
├── dist/_worker.js/ (Astro fetch handler)
│   ├── /entry/[entryId].astro → D1 쿼리
│   ├── /api/offline-db.ts → D1 전체 덤프 (오프라인용)
│   └── /sitemap*.xml.ts → D1에서 동적 생성
├── dist/ (정적 자산)
└── D1 Database (context-db)
    ├── entries (16,394 rows)
    ├── categories (52 rows)
    └── conversations (53 rows)
```

### D1 Database Schema

> 📁 **스키마 정의**: [migrations/0001_initial.sql](migrations/0001_initial.sql)

```sql
-- categories 테이블
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name_ko TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ko TEXT,
  description_en TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0
);

-- entries 테이블
CREATE TABLE entries (
  id TEXT PRIMARY KEY,
  korean TEXT NOT NULL,
  romanization TEXT,
  part_of_speech TEXT,
  category_id TEXT NOT NULL,  -- FK 없음 (아래 참고)
  difficulty TEXT,
  frequency TEXT,
  tags TEXT,           -- JSON array: ["casual", "informal"]
  translations TEXT,   -- JSON object: { ko: {...}, en: {...} }
  created_at INTEGER DEFAULT (unixepoch())
);

-- conversations 테이블
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  category_id TEXT,
  title_ko TEXT NOT NULL,
  title_en TEXT NOT NULL,
  dialogue TEXT NOT NULL,  -- JSON array of dialogue objects
  created_at INTEGER DEFAULT (unixepoch())
);
```

#### Foreign Key 제약조건 미사용 이유

> ⚠️ `entries.category_id`에 **Foreign Key 제약조건이 없습니다**.

**배경**: 카테고리 ID 변경의 유연성을 위해 FK를 사용하지 않습니다.

```sql
-- 예: 카테고리 이름 변경 시 (daily-life → daily-misc)
-- FK가 있으면 entries 테이블을 먼저 수정해야 하지만,
-- FK가 없으면 categories만 수정하면 됨

DELETE FROM categories WHERE id = 'daily-life';
INSERT INTO categories (...) VALUES ('daily-misc', '일상생활', ...);
```

| FK 있음                    | FK 없음 (현재)           |
|----------------------------|--------------------------|
| ❌ 카테고리 삭제 시 에러   | ✅ 유연한 마이그레이션   |
| ❌ entries 먼저 수정 필요  | ✅ 바로 삭제 가능        |

### Data Flow

```
Request → Cloudflare Workers → Astro page (D1 access via Astro.locals.runtime.env.DB) → HTML Response
```

### Sitemap Generation

SSR 모드에서 사이트맵은 D1에서 **실시간 동적 생성**됩니다:

| Route | 설명 |
|:------|:-----|
| `/sitemap.xml` | 인덱스 (모든 사이트맵 링크) |
| `/sitemap-pages.xml.ts` | 정적 페이지 |
| `/sitemap-categories.xml.ts` | 카테고리 목록 |
| `/sitemap-entry-[categoryId].xml.ts` | 카테고리별 엔트리 (52개) |
| `/api/offline-db.ts` | 오프라인 DB 덤프 (JSON) |

---

## Routes (라우트 구조)

| Route | EN | KO | Mode | Description |
|:------|:--:|:--:|:----:|:------------|
| `/` | ✓ | ✓ | SSR | Home |
| `/browse` | ✓ | ✓ | SSR | Browse all entries |
| `/entry/[entryId]` | ✓ | ✓ | **SSR** | Word entry page (D1) |
| `/category/[categoryId]` | ✓ | ✓ | SSR | Category page |
| `/conversation/[conversationId]` | ✓ | ✓ | SSR | Conversation page |
| `/sitemap.xml` | ✓ | - | **SSR** | Sitemap index (D1) |
| `/api/offline-db` | ✓ | - | **SSR** | Offline DB dump (D1) |
| `/download` | ✓ | ✓ | SSR | Offline download page |
| `/about` | ✓ | ✓ | SSR | About |
| `/my-learning` | ✓ | ✓ | SSR | Learning progress |
| `/built-with` | ✓ | ✓ | SSR | Tech stack |
| `/privacy` | ✓ | ✓ | SSR | Privacy policy |
| `/terms` | ✓ | ✓ | SSR | Terms of service |
| `/license` | ✓ | ✓ | SSR | License |

**Data:** 16,394 entries + 52 categories + 53 conversations (D1 Database)

---

## Features (기능)

| Feature | Implementation |
|:--------|:---------------|
| 🔍 Search | MiniSearch via `@soundblue/search` |
| 📱 PWA | Service Worker (`@soundblue/pwa`) |
| 🌙 Dark Mode | localStorage + CSS variables |
| 🌐 i18n | URL-based (`/ko/*`) via Astro `i18n` config |
| 💾 Favorites | IndexedDB (Dexie via `@soundblue/platform`) |
| 📊 Study Records | IndexedDB (Dexie) |
| 📥 Offline Mode | D1 → IndexedDB 동기화 (`/api/offline-db`) |

> ⚠️ React 의존성(`@astrojs/react`, `react`, `react-dom`)이 `package.json`에 있으나 현재 `src/`에 `.tsx` 컴포넌트나 `client:` 디렉티브는 0건. 미래의 Astro Islands용 placeholder.

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

## Astro Page + D1 Pattern

```astro
---
// src/pages/entry/[entryId].astro
import BaseLayout from '../../layouts/BaseLayout.astro';

const { entryId } = Astro.params;
const db = Astro.locals.runtime?.env?.DB;
if (!db) {
  return new Response('D1 not bound', { status: 500 });
}
const entry = await db.prepare('SELECT * FROM entries WHERE id = ?')
  .bind(entryId).first();
if (!entry) {
  return Astro.redirect('/404', 404);
}
---

<BaseLayout title={`${entry.korean} | Context`}>
  <h1>{entry.korean}</h1>
</BaseLayout>
```

---

## Development (개발)

```bash
# From monorepo root
pnpm dev:context     # → http://localhost:3003

# Build
pnpm build:context   # Astro SSR 빌드
```

---

## Deployment (배포)

```bash
cd apps/context
pnpm build   # Astro SSR 빌드
pnpm deploy  # Cloudflare Workers 배포
```

**필수 설정 (Cloudflare Dashboard):**
- D1 Binding: `DB` → `context-db`
- D1 Binding: `PRIVATE_DB` → `private` (저작권 자료)

### Configuration Files

| File | Purpose |
|:-----|:--------|
| `astro.config.mjs` | Astro + Cloudflare adapter 설정 |
| `wrangler.toml` | D1 바인딩, Workers 설정 |
| `src/pages/` | Astro 파일 기반 라우트 |
| `app/data/` | 데이터 헬퍼 + SSoT (`site.json`) |

---

## Tech Stack (기술 스택)

| Role | Technology |
|:-----|:-----------|
| Framework | Astro 7 (SSR mode) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| **Database** | **Cloudflare D1** (SQLite) |
| Search | MiniSearch (via `@soundblue/search`) |
| Storage | localStorage / IndexedDB (client) |
| Hosting | Cloudflare Workers |

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

See [root README](../../README.md) for full guidelines.

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
