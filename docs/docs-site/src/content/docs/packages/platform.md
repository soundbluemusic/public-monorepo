---
title: "@soundblue/platform"
description: IndexedDB storage with Dexie.js for client-side persistence - Layer 1 data package
sidebar:
  order: 5
---

# @soundblue/platform

**Layer 1 (Data)** — Client-side IndexedDB storage using Dexie.js.

## Overview

This package provides a unified storage API for persisting user data (bookmarks, study progress, settings) in the browser's IndexedDB.

| Property | Value |
|----------|-------|
| Layer | 1 (Data) |
| Dependencies | dexie, @soundblue/core |
| React Required | No |
| Environment | Client-only |

## Installation

```json
{
  "dependencies": {
    "@soundblue/platform": "workspace:*"
  }
}
```

## Exports

### `/storage`

Main storage API with conditional exports:

```typescript
// Browser environment
import { storage } from '@soundblue/platform/storage';

// Build/SSG environment (returns no-op)
import { storage } from '@soundblue/platform/storage';  // Safe, returns undefined/noop
```

The package uses conditional exports:
- **Browser**: `./src/storage/index.browser.ts` - Full IndexedDB implementation
- **Default**: `./src/storage/index.noop.ts` - No-op stubs for SSG build

### `/db`

Direct Dexie database access for advanced use cases.

```typescript
import { db } from '@soundblue/platform/db';

// Direct table access
const favorites = await db.favorites.toArray();
```

## Storage API

### Favorites

```typescript
import { storage } from '@soundblue/platform/storage';

// Add favorite
await storage.favorites.add({
  id: 'entry-hello',
  type: 'entry',
  addedAt: Date.now(),
});

// Get all favorites
const favorites = await storage.favorites.getAll();

// Remove favorite
await storage.favorites.remove('entry-hello');

// Check if favorited
const isFavorited = await storage.favorites.has('entry-hello');
```

### Study Progress

```typescript
// Mark as studied
await storage.studyProgress.markStudied('entry-hello');

// Get study status
const isStudied = await storage.studyProgress.isStudied('entry-hello');

// Get all studied entries
const studiedIds = await storage.studyProgress.getAllStudied();

// Get study count by date
const todayCount = await storage.studyProgress.getCountByDate(new Date());
```

### Recent Views

```typescript
// Add to recent views
await storage.recentViews.add({
  id: 'entry-hello',
  type: 'entry',
  viewedAt: Date.now(),
});

// Get recent views (last 50)
const recent = await storage.recentViews.getRecent(50);

// Clear all recent views
await storage.recentViews.clear();
```

### Settings

```typescript
// Get setting
const theme = await storage.settings.get('theme');  // 'light' | 'dark' | 'system'

// Set setting
await storage.settings.set('theme', 'dark');

// Get all settings
const allSettings = await storage.settings.getAll();
```

## Database Schema

```typescript
// Dexie database definition
class AppDatabase extends Dexie {
  favorites!: Table<FavoriteItem>;
  studyProgress!: Table<StudyProgressItem>;
  recentViews!: Table<RecentViewItem>;
  settings!: Table<SettingsItem>;

  constructor() {
    super('soundblue-app');
    this.version(1).stores({
      favorites: 'id, type, addedAt',
      studyProgress: 'id, studiedAt',
      recentViews: 'id, type, viewedAt',
      settings: 'key',
    });
  }
}
```

## Type Definitions

```typescript
interface FavoriteItem {
  id: string;
  type: 'entry' | 'concept' | 'conversation';
  addedAt: number;
}

interface StudyProgressItem {
  id: string;
  studiedAt: number;
}

interface RecentViewItem {
  id: string;
  type: 'entry' | 'concept';
  viewedAt: number;
}

interface SettingsItem {
  key: string;
  value: unknown;
}
```

## SSG Compatibility

The storage API is designed to be SSG-safe:

```typescript
// During SSG build, this returns a no-op implementation
import { storage } from '@soundblue/platform/storage';

// All methods return safe defaults
await storage.favorites.getAll();  // Returns [] during SSG
await storage.settings.get('theme');  // Returns undefined during SSG
```

## React Integration

Use with React hooks from `@soundblue/features`:

```typescript
import { useFavorites, useStudyProgress } from '@soundblue/features/settings';

function EntryCard({ entry }) {
  const { isFavorite, toggle } = useFavorites(entry.id);
  const { isStudied, markStudied } = useStudyProgress(entry.id);

  return (
    <div>
      <button onClick={toggle}>
        {isFavorite ? '★' : '☆'}
      </button>
      <button onClick={markStudied}>
        {isStudied ? 'Studied ✓' : 'Mark as Studied'}
      </button>
    </div>
  );
}
```

## Best Practices

1. **Use storage API** - Don't access Dexie directly unless needed
2. **Handle SSG** - The API handles SSG builds automatically
3. **Async/await** - All storage operations are asynchronous
