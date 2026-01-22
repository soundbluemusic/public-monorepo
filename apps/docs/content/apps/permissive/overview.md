---
title: Permissive Overview
description: Complete documentation for Permissive - Free Web Development Resources (무료 웹개발 자료 모음)
head:
  - tag: meta
    attrs:
      name: keywords
      content: Permissive app, web dev resources, MIT license, Apache license, open source libraries, Web APIs, SSR, React
sidebar:
  order: 1
---

# Permissive — Web Dev Resources

**무료 웹개발 자료 모음** | SSR

Permissive is a curated collection of web development libraries with permissive licenses (MIT, Apache, etc.) and Web API documentation.

> **Rendering Mode:** SSR — Server-side rendering with in-memory data.

## Live Demo

🌐 **[permissive.soundbluemusic.com](https://permissive.soundbluemusic.com)**

## Features

### 📚 Library Collection

- **88 libraries** with permissive licenses
- Categorized by use case (UI, State, Animation, etc.)
- License information and GitHub links

### 🌐 Web API Documentation

- **56 Web APIs** documented
- Browser compatibility information
- Usage examples

## Project Structure

```
apps/permissive/
├── app/
│   ├── components/      # React components
│   ├── routes/          # React Router routes
│   └── data/            # Library and API data
├── public/              # Static assets
└── react-router.config.ts  # SSR configuration
```

## Development

### Start Development Server

```bash
pnpm dev:permissive
# → http://localhost:3004
```

### Build for Production

```bash
pnpm build:permissive
```
