---
title: Context Overview
description: Complete documentation for Context - Korean Dictionary for Learners (학습자를 위한 한국어 사전)
sidebar:
  order: 1
---

# Context — Korean Dictionary

**학습자를 위한 한국어 사전** | 33,748 SSG pages

Context is a context-based Korean dictionary designed specifically for language learners. It provides word meanings, example sentences, and related expressions in a user-friendly interface.

## Live Demo

🌐 **[context.soundbluemusic.com](https://context.soundbluemusic.com)**

## Features

### 📚 Comprehensive Dictionary

- **33,748 entries** covering vocabulary from beginner to advanced
- Context-based definitions with real-world usage examples
- Related expressions and collocations
- Bilingual support (Korean/English)

### 🔍 Smart Search

- Instant search with Korean Romanization support
- Auto-suggestions as you type
- Search by Korean, English, or Romanization

### 🌐 Multilingual Interface

- Full support for English and Korean UI
- URL-based language switching (`/entry/...` vs `/ko/entry/...`)
- SEO-optimized with proper canonical and hreflang tags

### 📱 PWA Support

- Installable as a Progressive Web App
- Offline-capable with service worker caching
- Stale-while-revalidate caching strategy

## Project Structure

```
apps/context/
├── app/
│   ├── components/      # React components
│   ├── routes/          # React Router routes
│   ├── data/            # Entry data loaders
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── public/              # Static assets
└── react-router.config.ts  # SSG configuration
```

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with search |
| `/entry/:entryId` | Individual entry page (English) |
| `/ko/entry/:entryId` | Individual entry page (Korean) |
| `/about` | About page |
| `/sitemap.xml` | XML sitemap |

## SSG Configuration

Context uses React Router v7's prerender pattern:

```typescript
// react-router.config.ts
export default {
  ssr: false,  // SSG mode
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const entryRoutes = generateI18nRoutes(entries, `/entry/`);
    return [...staticRoutes, ...entryRoutes];
  },
} satisfies Config;
```

## Development

### Start Development Server

```bash
pnpm dev:context
# → http://localhost:3003
```

### Build for Production

```bash
pnpm build:context
```
