# Context

> **Korean Dictionary for Learners (학습자를 위한 한국어 사전)**
>
> Learn Korean words with translations, examples, and pronunciation guides.
> (번역, 예문, 발음 가이드와 함께 한국어를 학습하세요.)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
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
Build time:  React Router v7 → Static HTML/CSS/JS
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
