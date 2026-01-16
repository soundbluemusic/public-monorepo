# Permissive

> **Free Web Dev Tools Collection (무료 웹개발 도구 모음)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
[![SSR](https://img.shields.io/badge/SSR-Cloudflare_Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com)

**[Live Site](https://permissive.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A comprehensive collection of free web development resources:

- **88 Libraries** - MIT/OSS licensed libraries with detail pages
- **56 Web APIs** - Browser built-in APIs
- **Search** - MiniSearch-based instant search

---

## Architecture (아키텍처)

### SSR with Cloudflare Pages Functions

```
react-router.config.ts
├── ssr: true (SSR 모드)
├── Cloudflare Adapter (nodejs_compat)
└── loader() → 런타임 데이터 조회

Cloudflare Pages:
├── Static Assets (build/client/)
└── Functions (_worker.js)
    └── 모든 라우트 SSR 처리
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

| Route | EN | KO | Mode | Description |
|:------|:--:|:--:|:----:|:------------|
| `/` | ✓ | ✓ | SSR | Home with search |
| `/libraries` | ✓ | ✓ | SSR | Libraries list |
| `/library/:slug` | ✓ | ✓ | SSR | Library detail page (88) |
| `/sitemap` | ✓ | ✓ | SSR | Sitemap |

**Mode:** SSR (Cloudflare Pages Functions)

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
| Mode | SSR + D1 | SSG | SSR |
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
