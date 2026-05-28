# 🎵 Public Monorepo

**Three apps for learners (학습자를 위한 세 개의 앱)**

🌐 **English** | [한국어](https://soundbluemusic.github.io/public-monorepo/ko/) | [日本語](https://soundbluemusic.github.io/public-monorepo/ja/)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green.svg)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.11.0-orange.svg)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![SSR + D1](https://img.shields.io/badge/SSR-D1_Database-F38020?logo=cloudflare)](https://developers.cloudflare.com/d1/)

---

## 📖 What is this?

> 학습자를 위한 3개의 앱. Cloudflare Workers에서 호스팅됩니다.
>
> 📚 **[Documentation →](https://soundbluemusic.github.io/public-monorepo)**

⚠️ **No SPA Mode** — This project uses SSR only. SPA returns empty HTML, breaking SEO.

---

## 🚀 Apps

### 📖 Context — Korean Dictionary
> **학습자를 위한 한국어 사전** | SSR + Cloudflare D1

| | |
|---|---|
| **Live** | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Source** | [apps/context/](apps/context) · [README](apps/context/README.md) · [config](apps/context/vite.config.ts) |
| **Database** | Cloudflare D1 (`context-db`) |
| **Features** | 16394 entries, 52 categories, 53 conversations |

### 🔧 Permissive — Web Dev Resources
> **오픈 웹개발 리소스** | SSR

| | |
|---|---|
| **Live** | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Source** | [apps/permissive/](apps/permissive) · [README](apps/permissive/README.md) · [config](apps/permissive/vite.config.ts) |
| **Data** | [apps/permissive/app/data/](apps/permissive/app/data) |
| **Features** | 120 libraries, 56 Web APIs |

### 📐 Roots — Math Documentation
> **학습자를 위한 수학 문서** | SSR

| | |
|---|---|
| **Live** | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |
| **Source** | [apps/roots/](apps/roots) · [README](apps/roots/README.md) · [config](apps/roots/vite.config.ts) |
| **Data** | [data/roots/](data/roots) |
| **Features** | 438 concepts, 18 fields |

---

## ⚡ Quick Start

```bash
# Clone & Install
git clone https://github.com/soundbluemusic/public-monorepo.git
cd public-monorepo && pnpm install

# Run any app
pnpm dev:context     # → http://localhost:3003
pnpm dev:permissive  # → http://localhost:3004
pnpm dev:roots       # → http://localhost:3005
```

> **Prerequisites:** Node.js ≥ 20, pnpm 10.11.0 · [package.json](package.json)

---

## 📁 Project Structure

```
public-monorepo/
├── apps/                → 3 applications
│   ├── context/         → Korean dictionary (SSR + D1)
│   ├── permissive/      → Web dev resources (SSR)
│   └── roots/           → Math documentation (SSR)
├── packages/            → 10 shared packages
│   ├── core/            → [L0] validation, utils, types
│   ├── config/          → [L0] Vite, Tailwind configs
│   ├── data/            → [L1] Zod schemas, loaders
│   ├── platform/        → [L1] IndexedDB storage
│   ├── i18n/            → [L2] URL routing, Paraglide
│   ├── search/          → [L2] MiniSearch wrapper
│   ├── seo/             → [L2] Meta tags, sitemap
│   ├── pwa/             → [L2] Service worker
│   ├── features/        → [L3] Settings, toast
│   └── ui/              → [L3] React components
├── data/                → JSON data (SSoT)
└── docs/                → Documentation site
```

> 📐 **Layer system:** [ARCHITECTURE.md](ARCHITECTURE.md) · **Package details:** [packages/](packages/)

---

## 🛠 Tech Stack

| Category | Technology | Source |
|:---------|:-----------|:-------|
| **Framework** | Astro 6 (SSR) | [apps/*/src/pages/](apps/context/src/pages) |
| **Language** | TypeScript 5.x | [tsconfig.json](tsconfig.json) |
| **Styling** | Tailwind CSS v4 | [packages/config/](packages/config) |
| **Database** | Cloudflare D1 (Context only) | [apps/context/wrangler.toml](apps/context/wrangler.toml) |
| **Search** | MiniSearch | [packages/search/](packages/search) |
| **i18n** | Astro built-in `i18n` config (`/ko/*`) | [astro.config.mjs](apps/context/astro.config.mjs) |
| **SEO** | Meta Factory | [packages/seo/](packages/seo) |
| **Storage** | IndexedDB (Dexie) | [packages/platform/](packages/platform) |
| **PWA** | Service Worker (Context only) | [packages/pwa/](packages/pwa) |
| **UI** | Components | [packages/ui/](packages/ui) |
| **Hosting** | Cloudflare Workers | — |
| **Build** | Astro + Turborepo | [turbo.json](turbo.json) |

---

<details>
<summary>📜 Commands</summary>

### Development

| Command | Description |
|:--------|:------------|
| `pnpm dev:context` | Run Context → http://localhost:3003 |
| `pnpm dev:permissive` | Run Permissive → http://localhost:3004 |
| `pnpm dev:roots` | Run Roots → http://localhost:3005 |

### Build

| Command | Description |
|:--------|:------------|
| `pnpm build` | Build all apps ([Turborepo](turbo.json) cached) |
| `pnpm build:context` | Build Context → `dist/client` |
| `pnpm build:permissive` | Build Permissive → `dist/client` |
| `pnpm build:roots` | Build Roots → `dist/client` |

### Quality Checks

| Command | Description |
|:--------|:------------|
| `pnpm lint` | Check code with [Biome](biome.json) |
| `pnpm format` | Format code with [Biome](biome.json) |
| `pnpm typecheck` | TypeScript type check |
| `pnpm test` | Run [Vitest](vitest.config.ts) unit tests |
| `pnpm test:e2e` | Run [Playwright](playwright.config.ts) E2E tests |

</details>

---

## 📚 Documentation

| Resource | Description |
|:---------|:------------|
| [📖 Docs Site](https://soundbluemusic.github.io/public-monorepo) | Full documentation |
| [ARCHITECTURE.md](ARCHITECTURE.md) | SSR architecture, package layers |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Critical rules, contribution guide |
| [CLAUDE.md](CLAUDE.md) | AI assistant guidelines |
| [LICENSE](LICENSE) | Apache License 2.0 |

---

## 🌐 Other Projects

| Project | Description |
|:--------|:------------|
| [soundbluemusic.com](https://soundbluemusic.com) | Main site |
| [tools.soundbluemusic.com](https://tools.soundbluemusic.com) | Tool collection |
| [dialogue.soundbluemusic.com](https://dialogue.soundbluemusic.com) | Learning chatbot |
| [offline.observer](https://offline.observer) | Sound production |

---

## 📄 License

**[Apache License 2.0](LICENSE)** — Free to use, modify, and distribute.

---

<p align="center">
  Made by <a href="https://soundbluemusic.com"><b>soundbluemusic</b></a>
  <br/><br/>
  <a href="https://www.youtube.com/@SoundBlueMusic"><img src="https://img.shields.io/badge/YouTube-FF0000?style=flat&logo=youtube&logoColor=white" alt="YouTube"></a>
  <a href="https://x.com/SoundBlueMusic"><img src="https://img.shields.io/badge/X-000000?style=flat&logo=x&logoColor=white" alt="X"></a>
  <a href="https://www.instagram.com/soundbluemusic/"><img src="https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white" alt="Instagram"></a>
  <a href="https://www.threads.com/@soundbluemusic"><img src="https://img.shields.io/badge/Threads-000000?style=flat&logo=threads&logoColor=white" alt="Threads"></a>
</p>
