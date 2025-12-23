# Permissive

> **Free Web Dev Tools Collection (무료 웹개발 도구 모음)**
>
> Web Standard APIs and MIT licensed libraries at a glance. (웹표준 API와 MIT 라이센스 라이브러리를 한눈에.)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)

**[Live Site](https://permissive.soundbluemusic.com)**

---

## What is this? (이게 뭐예요?)

A comprehensive collection of free web development resources:

- **Libraries** - 100+ MIT/OSS licensed libraries (MIT/오픈소스 라이브러리)
- **Web API** - 58 browser built-in APIs (브라우저 내장 API)

No installation guides, no tutorials. Just a clean, well-organized list with advanced search & filtering.

---

## Architecture (아키텍처)

### 100% Static Site Generation (SSG)

This is intentionally a **fully static site**. No server-side rendering, no API calls at runtime.

```
Build time:  React Router v7 → Static HTML/CSS/JS
Runtime:     Pure static files served from CDN
```

**Why SSG?**
- **Fast** - Pre-rendered HTML, instant page loads
- **Cheap** - Host anywhere (Cloudflare Pages, GitHub Pages, etc.)
- **Simple** - No server to maintain, no database
- **Reliable** - No runtime errors, no downtime

---

## Site Structure (사이트 구조)

```
/              Home (홈)
/web-api       Web Standard APIs (웹표준 API)
/libraries     MIT Licensed Libraries (MIT 라이브러리)
```

That's it. 3 pages.

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

## License (라이선스)

Apache License 2.0

---

Created by **[soundbluemusic](https://soundbluemusic.com)**
