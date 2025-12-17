# 🎵 Soundblue Monorepo

**Two apps for learners (학습자를 위한 두 개의 앱)**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green.svg)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.0.0-orange.svg)](https://pnpm.io)

---

<br>

## 📖 What is this? (이게 뭔가요?)

<br>

| App | Description (설명) | Link (링크) |
|:---:|:-------------------|:-----------:|
| **Context** | Korean dictionary for learners<br>(학습자를 위한 한국어 사전) | [Live](https://context.soundbluemusic.com) |
| **Permissive** | Free web dev resources<br>(무료 웹개발 자료 모음) | [Live](https://permissive.soundbluemusic.com) |

<br>

---

<br>

## 🛠 Tech Stack (기술 스택)

<br>

| Category (분류) | Technology (기술) |
|:---------------:|:------------------|
| **Framework** | Solid.js + SolidStart |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Package Manager** | pnpm (workspaces) |
| **Linting** | Biome |
| **Build** | 100% Static (SSG) |

<br>

---

<br>

## 📁 Project Structure (프로젝트 구조)

<br>

```
soundblue-monorepo/
│
├── apps/
│   ├── context/       →  Korean dictionary app (한국어 사전 앱)
│   └── permissive/    →  Web dev resources app (웹개발 자료 앱)
│
├── packages/
│   └── shared/        →  Shared utilities (공용 유틸리티)
│
└── package.json       →  Root config (루트 설정)
```

<br>

---

<br>

## 🚀 Quick Start (빠른 시작)

<br>

**Step 1** — Clone (클론)

```bash
git clone https://github.com/soundbluemusic/public-monorepo.git
cd public-monorepo
```

<br>

**Step 2** — Install (설치)

```bash
pnpm install
```

<br>

**Step 3** — Run (실행)

```bash
# Context app (한국어 사전)
pnpm dev:context        # → http://localhost:3003

# Permissive app (웹개발 자료)
pnpm dev:permissive     # → http://localhost:3004
```

<br>

---

<br>

## 📜 Commands (명령어)

<br>

| Command (명령어) | Description (설명) |
|:-----------------|:-------------------|
| `pnpm dev:context` | Run Context app (Context 앱 실행) |
| `pnpm dev:permissive` | Run Permissive app (Permissive 앱 실행) |
| `pnpm build:context` | Build Context app (Context 앱 빌드) |
| `pnpm build:permissive` | Build Permissive app (Permissive 앱 빌드) |
| `pnpm lint` | Check code (코드 검사) |
| `pnpm format` | Format code (코드 정리) |

<br>

---

<br>

## 📄 License (라이선스)

<br>

**Apache License 2.0**

Free to use, modify, and distribute.
(자유롭게 사용, 수정, 배포 가능합니다.)

<br>

---

<br>

<p align="center">
  Made by <a href="https://soundbluemusic.com"><b>soundbluemusic</b></a>
</p>
