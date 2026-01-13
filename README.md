# 🎵 Public Monorepo

**Three apps for learners (학습자를 위한 세 개의 앱)**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green.svg)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.11.0-orange.svg)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![100% SSG](https://img.shields.io/badge/100%25-SSG-brightgreen)](https://en.wikipedia.org/wiki/Static_site_generator)

---

## 📖 What is this?

> 학습자를 위한 3개의 100% SSG 앱. 서버 없이 CDN에서 바로 서빙됩니다.
>
> 📚 **[Documentation →](https://soundbluemusic.github.io/public-monorepo)**

---

## 🚀 Apps

### 📖 Context — Korean Dictionary
> **학습자를 위한 한국어 사전** | 33,748 SSG pages

| | |
|---|---|
| **Live** | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| **Source** | [apps/context](apps/context) |
| **Features** | 16836 entries, 25 categories, 53 conversations |

### 🔧 Permissive — Web Dev Resources
> **무료 웹개발 자료 모음** | 8 SSG pages

| | |
|---|---|
| **Live** | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| **Source** | [apps/permissive](apps/permissive) |
| **Features** | 88 libraries, 56 Web APIs |

### 📐 Roots — Math Documentation
> **학습자를 위한 수학 문서** | 920 SSG pages

| | |
|---|---|
| **Live** | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |
| **Source** | [apps/roots](apps/roots) |
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

> **Prerequisites:** Node.js ≥ 20, pnpm 10.11.0

---

## 📁 Project Structure

```
public-monorepo/
├── apps/           # 3 applications (Context, Permissive, Roots)
├── packages/       # 10 shared packages (Layer 0-3)
├── data/           # JSON data (SSoT)
└── docs/           # Documentation site (Astro + Starlight)
```

> 📐 **Architecture details:** [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🛠 Tech Stack

| Category | Technology |
|:---------|:-----------|
| **Framework** | React 19 + React Router v7 |
| **Language** | TypeScript 5.x (strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Rendering** | 100% SSG (34,676 pages total) |
| **Hosting** | Cloudflare Pages |
| **Build** | Vite + Turborepo |

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
| `pnpm build` | Build all apps (Turborepo cached) |
| `pnpm build:context` | Build Context → `build/client` |
| `pnpm build:permissive` | Build Permissive → `build/client` |
| `pnpm build:roots` | Build Roots → `build/client` |

### Quality Checks

| Command | Description |
|:--------|:------------|
| `pnpm lint` | Check code with Biome |
| `pnpm format` | Format code with Biome |
| `pnpm typecheck` | TypeScript type check |
| `pnpm test` | Run Vitest unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |

</details>

---

## 📚 Documentation

| Resource | Description |
|:---------|:------------|
| [📖 Docs Site](https://soundbluemusic.github.io/public-monorepo) | Full documentation |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Package layer design |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [CLAUDE.md](CLAUDE.md) | AI assistant guidelines |

---

## 🌐 Other Projects

| Project | Description |
|:--------|:------------|
| [soundbluemusic.com](https://soundbluemusic.com) | Main site |
| [tools.soundbluemusic.com](https://tools.soundbluemusic.com) | Tool collection |
| [dialogue.soundbluemusic.com](https://dialogue.soundbluemusic.com) | Learning chatbot |

---

## 📄 License

**Apache License 2.0** — Free to use, modify, and distribute.

---

<p align="center">
  Made by <a href="https://soundbluemusic.com"><b>soundbluemusic</b></a>
  <br/><br/>
  <a href="https://www.youtube.com/@SoundBlueMusic"><img src="https://img.shields.io/badge/YouTube-FF0000?style=flat&logo=youtube&logoColor=white" alt="YouTube"></a>
  <a href="https://x.com/SoundBlueMusic"><img src="https://img.shields.io/badge/X-000000?style=flat&logo=x&logoColor=white" alt="X"></a>
  <a href="https://www.instagram.com/soundbluemusic/"><img src="https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white" alt="Instagram"></a>
  <a href="https://www.threads.com/@soundbluemusic"><img src="https://img.shields.io/badge/Threads-000000?style=flat&logo=threads&logoColor=white" alt="Threads"></a>
</p>
