---
title: コードスタイルガイド
description: モノレポのコーディング規約とスタイルガイドライン
sidebar:
  order: 2
---

# コードスタイルガイド

このプロジェクトは、リンティングとフォーマッティングに**Biome**を使用しています。すべてのコードはマージ前にリントチェックに合格する必要があります。

## クイックコマンド

```bash
pnpm lint      # 問題をチェック
pnpm format    # フォーマッティングを自動修正
pnpm typecheck # TypeScript検証
```

## 一般原則

### 1. TypeScript Strictモード

すべてのコードは厳密に型付けされる必要があります。絶対に必要な場合を除き`any`を避けてください。

```typescript
// ✅ 良い
function getEntry(id: string): Entry | undefined {
  return entries.find(e => e.id === id);
}

// ❌ 悪い
function getEntry(id: any): any {
  return entries.find(e => e.id === id);
}
```

### 2. 関数型スタイル

関数型プログラミングパターンを好みます。

```typescript
// ✅ 良い
const filtered = entries.filter(e => e.category === 'greetings');
const mapped = entries.map(e => e.word);

// ❌ 悪い
const filtered = [];
for (const e of entries) {
  if (e.category === 'greetings') {
    filtered.push(e);
  }
}
```

### 3. イミュータビリティ

データを直接変更しないでください。新しいオブジェクト/配列を作成してください。

```typescript
// ✅ 良い
const updated = { ...entry, word: '新しい単語' };
const newList = [...entries, newEntry];

// ❌ 悪い
entry.word = '新しい単語';
entries.push(newEntry);
```

## 命名規則

### ファイル

| タイプ | 規則 | 例 |
|--------|------|-----|
| コンポーネント | PascalCase | `SearchBar.tsx` |
| フック | camelCase + `use`接頭辞 | `useSearch.ts` |
| ユーティリティ | camelCase | `formatDate.ts` |
| 型 | camelCaseまたはPascalCase | `types.ts`, `Entry.ts` |
| 定数 | SCREAMING_SNAKE_CASE | `constants.ts` |

### 変数 & 関数

```typescript
// 変数: camelCase
const searchQuery = 'こんにちは';
const isLoading = false;

// 関数: camelCase, 動詞接頭辞
function getEntry(id: string) {}
function handleClick() {}
function formatDate(date: Date) {}

// コンポーネント: PascalCase
function SearchBar() {}
function EntryCard({ entry }: Props) {}

// 定数: SCREAMING_SNAKE_CASE
const MAX_RESULTS = 50;
const API_BASE_URL = 'https://api.example.com';
```

## CSS & スタイリング

### Tailwind CSS v4

Tailwindユーティリティクラスを使用してください：

```tsx
// ✅ 良い
<div className="flex items-center gap-4 p-4 bg-(--bg-secondary)">

// ❌ 悪い - インラインスタイル
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
```

### クラス名のマージ

条件付きクラスには`cn()`を使用してください：

```typescript
import { cn } from '@soundblue/core/utils';

<button
  className={cn(
    'px-4 py-2 rounded-lg font-medium',
    variant === 'primary' && 'bg-blue-500 text-white',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
```
