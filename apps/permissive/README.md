# Permissive

> **Open Web Dev Resources (오픈 웹개발 리소스)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-v1-FF4154?logo=react)](https://tanstack.com/start)
[![SSR](https://img.shields.io/badge/SSR-Cloudflare_Workers-F38020?logo=cloudflare)](https://developers.cloudflare.com/workers/)

**[Live Site](https://permissive.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A comprehensive collection of web standards and open-source web development resources:

- **120 Libraries** - open-source libraries with license details
- **56 Web APIs** - Browser built-in APIs
- **Search** - MiniSearch-based instant search

---

## Architecture (아키텍처)

### SSR with Cloudflare Workers

```
vite.config.ts (TanStack Start + Cloudflare)
├── tanstackStart() - SSR 프레임워크
├── cloudflare() - Workers 어댑터
└── loader() → 런타임 데이터 조회

Cloudflare Workers:
├── dist/server/ (Workers 핸들러)
└── dist/client/ (Workers Assets - 정적 파일)
```

### Data Architecture

```
app/data/                 # Runtime data (SSoT)
├── libraries.ts          # 120 libraries with license metadata
└── web-apis.ts           # 56 Web APIs

public/
└── search-index.json     # Generated search index
```

---

## Routes (라우트 구조)

| Route | EN | KO | Mode | Description |
|:------|:--:|:--:|:----:|:------------|
| `/` | ✓ | ✓ | SSR | Home with search |
| `/libraries` | ✓ | ✓ | SSR | Libraries list |
| `/library/:slug` | ✓ | ✓ | SSR | Library detail page (120) |
| `/sitemap` | ✓ | ✓ | SSR | Sitemap |

**Mode:** SSR (Cloudflare Workers)

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
| Mode | SSR + D1 | SSR | SSR |
| Search | ✓ MiniSearch | ✓ MiniSearch | ✓ MiniSearch |
| Favorites | ✓ | ✓ | ❌ |
| Detail pages | ✓ | ✓ | ✓ |

---

## Tech Stack (기술 스택)

| Role | Technology | License |
|------|------------|---------|
| Framework | [TanStack Start](https://tanstack.com/start) | MIT |
| UI | [React](https://react.dev) | MIT |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) | MIT |
| Language | [TypeScript](https://www.typescriptlang.org) | Apache 2.0 |
| Hosting | [Cloudflare Workers](https://developers.cloudflare.com/workers/) | - |

---

## Development (개발)

```bash
# From monorepo root
pnpm dev:permissive     # → http://localhost:3004

# Build (outputs to dist/client)
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
