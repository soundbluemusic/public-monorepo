# Roots

> **Math Documentation for Learners (학습자를 위한 수학 문서)**
>
> Explore mathematical concepts from elementary to graduate level with LaTeX formulas and examples.
> (초등부터 대학원 수준까지 LaTeX 공식과 예제로 수학 개념을 탐험하세요.)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)

**[Live Site](https://roots.soundbluemusic.com)**

---

## What is this? (이게 뭐예요?)

A math documentation site designed for learners:

- **18 Math Fields** - From foundations to advanced topics (기초부터 고급까지)
- **LaTeX Formulas** - Beautiful math rendering (수식 렌더링)
- **Difficulty Levels** - Elementary → Graduate+ (초등 → 대학원+)
- **Examples** - Step-by-step solutions (단계별 풀이)
- **Bilingual** - Korean ↔ English (한국어 ↔ 영어)

---

## Architecture (아키텍처)

### 100% Static Site Generation (SSG)

This is a **fully static site**. No server-side rendering, no API calls at runtime.

```
Build time:  React Router v7 → Static HTML/CSS/JS
Runtime:     Pure static files served from CDN
Storage:     localStorage / IndexedDB (favorites)
Math:        Browser-native MathML for LaTeX rendering
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
/browse               Browse all concepts (전체 탐색)
/search               Search concepts (검색)
/field/[id]           Field page (분야 페이지)
/concept/[id]         Concept page (개념 페이지)
/constants            Math constants (수학 상수)
/favorites            Saved concepts (즐겨찾기)
/about                About page (소개)
```

Supports both Korean (`/ko/...`) and English (`/en/...`) URL prefixes.

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

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
