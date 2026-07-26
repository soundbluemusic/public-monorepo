# Permissive

> **Open Web Dev Resources (오픈 웹개발 리소스)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-6-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![SSR](https://img.shields.io/badge/SSR-Cloudflare_Workers-F38020?logo=cloudflare)](https://developers.cloudflare.com/workers/)

**[Live Site](https://permissive.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A comprehensive collection of web standards and open-source web development resources:

- **120 Libraries** - open-source libraries with license metadata (`app/data/libraries.ts`)
- **56 Web APIs** - Browser built-in APIs (`app/data/web-apis.ts`)
- **25 Categories** + **153 Tags** for browsing

---

## Architecture (아키텍처)

### Astro 7 + Cloudflare Workers (SSR)

```
astro.config.mjs (실제 빌드 설정)
├── @astrojs/cloudflare (adapter)
├── output: 'server' (SSR 모드)
├── i18n: en (default) + ko (prefix)
└── @tailwindcss/vite (Tailwind v4)

빌드 산출물:
├── dist/_worker.js/   (Workers 핸들러)
└── dist/              (정적 자산)
```

### Data Source

```
app/data/                 # Runtime data (Single Source of Truth)
├── libraries.ts          # 120 libraries (TypeScript in-memory)
├── web-apis.ts           # 56 Web APIs
└── site.json             # Domain/baseUrl SSoT

public/
└── search-index.json     # 빌드 시 생성 (현재 미사용, Phase 3에서 활용 예정)
```

> ⚠️ **D1 바인딩 없음.** Permissive는 in-memory TypeScript 데이터만 사용.

---

## Routes (라우트 구조)

| Route | EN | KO | Description |
|:------|:--:|:--:|:------------|
| `/` | ✓ | ✓ | Home with Cmd+K search + 6 goal cards |
| `/build` | ✓ | ✓ | 6 build guides (goal-based entry) |
| `/build/:goal` | ✓ | ✓ | Goal detail (website/webapp/interactive/dataviz/ai-app/commerce) |
| `/libraries` | ✓ | ✓ | Libraries list (`src/pages/libraries.astro`) |
| `/library/:slug` | ✓ | ✓ | Library detail (120) — with FavoriteButton |
| `/category/:categoryId` | ✓ | ✓ | Category page (10 — Phase 2 consolidation) |
| `/tag/:tagId` | ✓ | ✓ | Tag page (153) |
| `/tags` | ✓ | ✓ | All tags |
| `/favorites` | ✓ | ✓ | Saved libraries (localStorage) |
| `/web-api` | ✓ | ✓ | Web APIs list |
| `/web-api/:slug` | ✓ | ✓ | Web API detail (56) |
| `/built-with` | ✓ | ✓ | Open source used here |
| `/sitemap.xml` | ✓ | - | Generated sitemap |

**Mode:** Astro SSR via Cloudflare Workers

---

## Features (기능)

| Feature | Implementation | Status |
|:--------|:---------------|:-------|
| 🔍 Instant Search | `@soundblue/search` (MiniSearch) via React Island, Cmd+K | ✅ |
| 🎯 Goal-based entry | `/build/[goal]` 6개 큐레이션 스택 (website/webapp/interactive/dataviz/ai-app/commerce) | ✅ |
| 💾 Favorites | localStorage 기반 즐겨찾기 + `/favorites` 페이지 | ✅ |
| 🌙 Dark Mode | localStorage + CSS variables | ✅ |
| 🌐 i18n | URL-based (`/ko/*`) via Astro `i18n` config | ✅ |
| 📱 PWA | _없음_ | ❌ (Phase 후속에서 검토) |

---

## Comparison with Other Apps

| Feature | Context | Roots | Permissive |
|:--------|:-------:|:-----:|:----------:|
| Framework | Astro 7 | Astro 7 | Astro 7 |
| Mode | SSR | SSR | SSR |
| Database | Cloudflare D1 | _없음_ | _없음_ |
| Search | MiniSearch | MiniSearch | Form GET (개선 예정) |
| Favorites | ✓ | ✓ | ❌ |

---

## Astro Page Pattern

```astro
---
// src/pages/library/[slug].astro
import { getLibraryBySlug } from '../../../app/data/libraries';
import BaseLayout from '../../layouts/BaseLayout.astro';

const { slug } = Astro.params;
const lib = getLibraryBySlug(slug!);
if (!lib) {
  return Astro.redirect('/404', 404);
}
---

<BaseLayout title={`${lib.name} - Permissive`}>
  <h1>{lib.name}</h1>
  <p>{lib.description}</p>
</BaseLayout>
```

---

## Tech Stack (기술 스택)

| Role | Technology | License |
|------|------------|---------|
| Framework | [Astro 7](https://astro.build) | MIT |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) | MIT |
| Language | [TypeScript](https://www.typescriptlang.org) | Apache 2.0 |
| State (client) | [nanostores](https://github.com/nanostores/nanostores) | MIT |
| Adapter | [@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) | MIT |
| Hosting | [Cloudflare Workers](https://developers.cloudflare.com/workers/) | - |

---

## Development (개발)

```bash
# From monorepo root
pnpm dev:permissive     # → http://localhost:3004

# Build (outputs to dist/)
pnpm build:permissive

# Deploy
cd apps/permissive
pnpm deploy
```

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
