---
title: "@soundblue/platform"
description: Dexie.js使用のIndexedDBストレージ - Layer 1 データパッケージ
sidebar:
  order: 5
---

# @soundblue/platform

**Layer 1 (データ)** — Dexie.jsを使用したブラウザIndexedDBストレージ。

## 概要

このパッケージは、ブラウザベースのストレージ抽象化を提供します。IndexedDBをDexie.jsで使用し、お気に入り、最近表示した項目、設定などを保存します。

| プロパティ | 値 |
|----------|-------|
| レイヤー | 1 (データ) |
| 依存関係 | dexie |
| React必須 | いいえ |
| 環境 | クライアントのみ |

## インストール

```json
{
  "dependencies": {
    "@soundblue/platform": "workspace:*"
  }
}
```

## エクスポート

### `/storage`

メインストレージAPI。

```typescript
import { storage } from '@soundblue/platform/storage';

// お気に入り
await storage.favorites.add({ id: 'hello', type: 'entry', addedAt: Date.now() });
await storage.favorites.remove('hello');
const allFavorites = await storage.favorites.getAll();
const isFavorite = await storage.favorites.has('hello');

// 最近表示した項目
await storage.recentViews.add({ id: 'hello', viewedAt: Date.now() });
const recentItems = await storage.recentViews.getRecent(10);

// 設定
await storage.settings.set({ theme: 'dark', fontSize: 16 });
const settings = await storage.settings.get();
```

#### ストレージメソッド

| カテゴリ | メソッド | 説明 |
|----------|--------|------|
| `favorites` | `add(item)` | 新しいお気に入りを追加 |
| | `remove(id)` | お気に入りを削除 |
| | `getAll()` | すべてのお気に入りを取得 |
| | `has(id)` | 項目がお気に入りか確認 |
| `recentViews` | `add(item)` | 閲覧履歴を追加 |
| | `getRecent(n)` | 最近n件を取得 |
| | `clear()` | 履歴をクリア |
| `settings` | `get()` | 設定を取得 |
| | `set(data)` | 設定を更新 |

### 型定義

```typescript
import type {
  FavoriteItem,
  RecentViewItem,
  SettingsData
} from '@soundblue/platform';

interface FavoriteItem {
  id: string;
  type: 'entry' | 'concept' | 'category';
  addedAt: number;
}

interface RecentViewItem {
  id: string;
  viewedAt: number;
}

interface SettingsData {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  sidebarCollapsed: boolean;
}
```

## データベース構造

```typescript
// 内部Dexie.jsスキーマ
class AppDatabase extends Dexie {
  favorites!: Table<FavoriteItem>;
  recentViews!: Table<RecentViewItem>;
  settings!: Table<SettingsData>;

  constructor() {
    super('soundblue-storage');
    this.version(1).stores({
      favorites: 'id, type, addedAt',
      recentViews: 'id, viewedAt',
      settings: 'key',
    });
  }
}
```

## Reactでの使用例

```typescript
// hooks/useFavorites.ts
import { storage } from '@soundblue/platform/storage';
import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    storage.favorites.getAll().then(setFavorites);
  }, []);

  const toggleFavorite = async (id: string, type: FavoriteItem['type']) => {
    const isFav = await storage.favorites.has(id);
    if (isFav) {
      await storage.favorites.remove(id);
    } else {
      await storage.favorites.add({ id, type, addedAt: Date.now() });
    }
    setFavorites(await storage.favorites.getAll());
  };

  return { favorites, toggleFavorite };
}
```

```typescript
// components/FavoriteButton.tsx
function FavoriteButton({ entryId }: { entryId: string }) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some(f => f.id === entryId);

  return (
    <button onClick={() => toggleFavorite(entryId, 'entry')}>
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}
```

## SSG互換性

ストレージAPIはSSGセーフです。サーバーサイドビルドでは何もせず、クライアントでのみ動作します：

```typescript
// SSGビルド時 (Node.js環境)
storage.favorites.getAll()  // → 空の配列 []

// クライアントでのハイドレーション後
storage.favorites.getAll()  // → IndexedDBから実際のデータ
```

## ベストプラクティス

1. **ユーザー設定にストレージを使用** - テーマ、言語など
2. **ユーザーデータをサーバーと同期** - 重要なデータはサーバーにも保存
3. **エラーハンドリング** - IndexedDBはまれに失敗する可能性あり
4. **クォータ制限に注意** - 大量データ保存に注意
