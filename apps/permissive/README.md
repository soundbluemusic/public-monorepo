# Permissive

> **Free Web Dev Tools Collection (무료 웹개발 도구 모음)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)
[![SSG Routes](https://img.shields.io/badge/SSG_Routes-7-blue)](react-router.config.ts)

**[Live Site](https://permissive.soundbluemusic.com)**

---

## What is this? (이게 뭔가요?)

A comprehensive collection of free web development resources:

- **100+ Libraries** - MIT/OSS licensed libraries
- **58 Web APIs** - Browser built-in APIs
- **No tutorials** - Just a clean, organized list

---

## Architecture (아키텍처)

### 100% SSG with Build-time Data Prerendering

```
react-router.config.ts
├── ssr: false
├── prerender() → 7 static routes (hardcoded)
└── loader() functions → .data files for each route

Build output (build/client/):
├── index.html, ko/index.html
├── web-api.html, ko/web-api.html
├── libraries.html, ko/libraries.html
└── *.data files
```

### Data Architecture (다른 앱과의 차이)

⚠️ **Note:** Unlike Context and Roots, Permissive embeds data directly in route files:

```
Context/Roots:    data/*.json → loader() → component
Permissive:       routes/web-api.tsx (data embedded, 31KB)
                  routes/libraries.tsx (data embedded, 47KB)
```

This is a known architectural inconsistency. See [CODE_DUPLICATION_REPORT.md](../../CODE_DUPLICATION_REPORT.md).

---

## Routes (라우트 구조)

| Route | EN | KO | Description |
|:------|:--:|:--:|:------------|
| `/` | ✓ | ✓ | Home |
| `/web-api` | ✓ | ✓ | Web Standard APIs (58 items) |
| `/libraries` | ✓ | ✓ | MIT Libraries (100+ items) |

**Total:** 7 SSG routes (including `/ko` variants)

---

## Data Structure (데이터 구조)

```
app/
├── routes/
│   ├── web-api.tsx    # 58 Web APIs (data embedded)
│   └── libraries.tsx  # 100+ libraries (data embedded)
└── lib/               # Empty (no separate lib folder)
```

### Embedded Data Schema

```typescript
// routes/web-api.tsx
const webApis: Record<string, WebApi> = {
  'fetch': {
    name: 'Fetch API',
    description: 'Modern HTTP requests',
    descriptionKo: '최신 HTTP 요청',
    category: 'Network',
    mdn: 'https://developer.mozilla.org/...',
  },
  // ... 58 APIs
};
```

---

## Comparison with Other Apps

| Feature | Context | Roots | Permissive |
|:--------|:-------:|:-----:|:----------:|
| SSG Routes | 348 | 70 | 7 |
| Search | ✓ useMemo | ✓ Fuse.js | ❌ |
| Favorites | ✓ | ✓ | ❌ |
| Back to Top | ✓ | ✓ | ❌ |
| Separate data folder | ✓ | ✓ | ❌ |
| lib/ folder | ✓ | ✓ | ❌ |

---

## Known Issues

1. **No search/filter** - Data is rendered as static list
2. **Data embedded in routes** - Not following monorepo patterns
3. **No lib/ folder** - Unlike other apps
4. **No Back to Top button** - See [BUTTON_TESTING_REPORT.md](../../BUTTON_TESTING_REPORT.md)

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

> **하드코딩 절대 금지 (NO HARDCODING)**

```typescript
// ❌ NEVER
const API_COUNT = 58;  // Magic number
return apis.length || 58;

// ✅ ALWAYS
const apis = getWebApis();
if (apis.length === 0) throw new Error('No APIs found');
```

See [root README](../../README.md#-code-quality-rules-코드-품질-규칙) for full guidelines.

---

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
