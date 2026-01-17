---
title: Context Overview
description: Complete documentation for Context - Korean Dictionary for Learners (학습자를 위한 한국어 사전)
sidebar:
  order: 1
---

# Context — Korean Dictionary

**학습자를 위한 한국어 사전** | SSR + Cloudflare D1

Context is a context-based Korean dictionary designed specifically for language learners. It provides word meanings, example sentences, and related expressions in a user-friendly interface.

> **Rendering Mode:** SSR + D1 — All entry pages are served dynamically from Cloudflare D1 database via **Cloudflare Workers**.

## Live Demo

🌐 **[context.soundbluemusic.com](https://context.soundbluemusic.com)**

## Features

### 📚 Comprehensive Dictionary

- **16,836 entries** covering vocabulary from beginner to advanced
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
│   ├── services/        # D1 database queries
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── public/              # Static assets
├── wrangler.toml        # Workers + D1 binding configuration
└── react-router.config.ts  # SSR configuration
```

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with search |
| `/entry/:entryId` | Individual entry page (English) |
| `/ko/entry/:entryId` | Individual entry page (Korean) |
| `/about` | About page |
| `/sitemap.xml` | XML sitemap |

## SSR + D1 Configuration (Cloudflare Workers)

Context uses React Router v7's SSR mode with Cloudflare Workers + D1:

```typescript
// react-router.config.ts
export default {
  ssr: true,  // SSR mode - D1 queries at runtime
  async prerender() {
    // Only static pages (home, about, categories)
    // Entry pages served dynamically from D1
    return [...staticRoutes, ...categoryRoutes];
  },
} satisfies Config;
```

```typescript
// Loader pattern - D1 query
export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const entry = await db.prepare('SELECT * FROM entries WHERE id = ?')
    .bind(params.entryId).first();
  return { entry };
}
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
