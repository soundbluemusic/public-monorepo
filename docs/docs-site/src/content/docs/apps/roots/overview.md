---
title: Roots Overview
description: Complete documentation for Roots - Math Documentation for Learners (학습자를 위한 수학 문서)
sidebar:
  order: 1
---

# Roots — Math Documentation

**학습자를 위한 수학 문서** | SSR

Roots is a comprehensive math documentation site covering concepts from algebra to calculus, organized systematically for learners.

## Live Demo

🌐 **[roots.soundbluemusic.com](https://roots.soundbluemusic.com)**

## Features

### 📚 Comprehensive Coverage

- **438 concepts** across 18 mathematical fields
- Structured progression from basic to advanced
- Bilingual support (Korean/English)

### 🔍 Smart Search

- Search by concept name or keyword
- Filter by mathematical field
- Related concepts suggestions

### 📐 Fields Covered

- Algebra
- Geometry
- Trigonometry
- Calculus
- Linear Algebra
- Statistics
- And more...

## Project Structure

```
apps/roots/
├── app/
│   ├── components/      # React components
│   ├── routes/          # React Router routes
│   └── data/            # Math concept data
├── public/              # Static assets
└── react-router.config.ts  # SSR configuration
```

## Development

### Start Development Server

```bash
pnpm dev:roots
# → http://localhost:3005
```

### Build for Production

```bash
pnpm build:roots
```
