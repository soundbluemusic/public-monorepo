# Permissive

> **Free Web Dev Tools Collection (무료 웹개발 도구 모음)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)
[![SSG Routes](https://img.shields.io/badge/SSG_Routes-8-blue)](react-router.config.ts)

**[Live Site](https://permissive.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A comprehensive collection of free web development resources:

- **88 Libraries** - MIT/OSS licensed libraries with detail pages
- **56 Web APIs** - Browser built-in APIs
- **Search** - MiniSearch-based instant search

---

## Architecture (아키텍처)

### 100% SSG with Build-time Data Prerendering

```
react-router.config.ts
├── ssr: false
├── prerender() → 8 static routes generated
│   ├── Static routes from routes.ts (extractStaticRoutes)
│   └── Library detail routes from data (88 × 2 langs)
└── loader() functions → .data files for each route

Build output (build/client/):
├── index.html, ko/index.html
├── libraries/index.html, ko/libraries/index.html
├── library/{slug}/index.html (88 libraries × 2 langs)
└── *.data files
```

### Data Architecture

```
data/permissive/          # Centralized JSON (SSoT)
├── libraries.json        # 88 libraries
└── web-apis.json         # 56 Web APIs

app/data/
├── libraries.ts          # TypeScript wrapper with types
└── web-apis.ts           # TypeScript wrapper with types
```

---

## Routes (라우트 구조)

| Route | EN | KO | Dynamic | Description |
|:------|:--:|:--:|:-------:|:------------|
| `/` | ✓ | ✓ | - | Home with search |
| `/libraries` | ✓ | ✓ | - | Libraries list |
| `/library/:slug` | ✓ | ✓ | 88 | Library detail page |
| `/sitemap` | ✓ | ✓ | - | Sitemap |

**Total:** 8 SSG routes (4 EN + 4 KO)

---

## Features (기능)

| Feature | Implementation |
|:--------|:---------------|
| 🔍 Search | MiniSearch (useSearchWorker) |
| 📱 PWA | vite-plugin-pwa |
| 🌙 Dark Mode | localStorage + CSS variables |
| 🌐 i18n | URL-based (`/ko/*`) + Paraglide |

---

## Comparison with Other Apps

| Feature | Context | Roots | Permissive |
|:--------|:-------:|:-----:|:----------:|
| SSG Routes | 33746 | 920 | 8 |
| Search | ✓ MiniSearch | ✓ MiniSearch | ✓ MiniSearch |
| Favorites | ✓ | ✓ | ❌ |
| Detail pages | ✓ | ✓ | ✓ |

---

## Tech Stack (기술 스택)

| Role | Technology | License |
|------|------------|---------|
| Framework | [React Router v7](https://reactrouter.com) | MIT |
| UI | [React](https://react.dev) | MIT |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) | MIT |
| Language | [TypeScript](https://www.typescriptlang.org) | Apache 2.0 |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) | - |

---

## Development (개발)

```bash
# From monorepo root
pnpm dev:permissive     # → http://localhost:3004

# Build (outputs to build/client)
pnpm build:permissive
```

---

## ⛔ Code Quality (코드 품질)

> **하드코딩 규칙: 우수한 설계 목적일 경우에만 허용**

```typescript
// ❌ NEVER - 테스트 통과/에러 회피용
const API_COUNT = 56;  // Magic number
return apis.length || 56;

// ✅ ALLOWED - 우수한 설계
export const LICENSE_TYPES = ['MIT', 'Apache-2.0', 'BSD'] as const;
```

See [root README](../../README.md#-code-quality-rules-코드-품질-규칙) for full guidelines.

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
