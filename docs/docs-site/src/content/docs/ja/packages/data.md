---
title: "@soundblue/data"
description: Zodスキーマとデータローダー - Layer 1 データパッケージ
sidebar:
  order: 4
---

# @soundblue/data

**Layer 1 (データ)** — すべてのアプリ間で共有されるZodスキーマとデータローダーユーティリティ。

## 概要

このパッケージは、アプリデータの検証のためのZodスキーマと、JSONファイルを読み込むローダー関数を提供します。

| プロパティ | 値 |
|----------|-------|
| レイヤー | 1 (データ) |
| 依存関係 | zod |
| React必須 | いいえ |
| 環境 | ビルドのみ |

## インストール

```json
{
  "dependencies": {
    "@soundblue/data": "workspace:*"
  }
}
```

## エクスポート

### `/schemas`

各アプリのZodスキーマ。

```typescript
import {
  EntrySchema,
  CategorySchema,
  ConversationSchema,
  ConceptSchema
} from '@soundblue/data/schemas';

// Context（韓国語辞書）スキーマ
const entry = EntrySchema.parse({
  id: 'hello',
  word: '안녕',
  romanization: 'annyeong',
  translations: {
    en: 'hello',
    explanation: '친근한 인사'
  },
  category: 'greetings'
});

// Roots（数学）スキーマ
const concept = ConceptSchema.parse({
  id: 'pythagorean-theorem',
  name: { en: 'Pythagorean Theorem', ko: '피타고라스 정리' },
  field: 'geometry',
  prerequisites: ['right-triangle', 'square-root']
});
```

#### 主要スキーマ

| スキーマ | 用途 | アプリ |
|---------|------|------|
| `EntrySchema` | 辞書エントリ | Context |
| `CategorySchema` | エントリカテゴリ | Context |
| `ConversationSchema` | 例文会話 | Context |
| `ConceptSchema` | 数学概念 | Roots |
| `FieldSchema` | 数学分野 | Roots |
| `LibrarySchema` | Webライブラリ | Permissive |
| `WebAPISchema` | Web API情報 | Permissive |

### `/loaders`

データローディングユーティリティ。

```typescript
import {
  loadJson,
  loadJsonDirectory,
  createDataLoader
} from '@soundblue/data/loaders';

// 単一JSONファイルを読み込み
const categories = await loadJson<Category[]>('data/context/categories.json');

// ディレクトリ内のすべてのJSONファイルを読み込み
const entries = await loadJsonDirectory<Entry>('data/context/entries/');

// スキーマ検証付きのカスタムローダー作成
const loadEntries = createDataLoader(EntrySchema.array(), 'data/context/entries.json');
const validatedEntries = await loadEntries();
```

### `/types`

スキーマから推論された型。

```typescript
import type {
  Entry,
  Category,
  Conversation,
  Concept,
  Field
} from '@soundblue/data/types';

// 型はスキーマから推論されます
type Entry = z.infer<typeof EntrySchema>;

// 関数で使用
function getEntryById(entries: Entry[], id: string): Entry | undefined {
  return entries.find(e => e.id === id);
}
```

## スキーマ詳細

### EntrySchema (Context)

```typescript
const EntrySchema = z.object({
  id: z.string(),
  word: z.string(),
  romanization: z.string(),
  translations: z.object({
    en: z.string(),
    explanation: z.string().optional(),
  }),
  category: z.string(),
  examples: z.array(z.object({
    ko: z.string(),
    en: z.string(),
  })).optional(),
  related: z.array(z.string()).optional(),
});
```

### ConceptSchema (Roots)

```typescript
const ConceptSchema = z.object({
  id: z.string(),
  name: z.object({
    en: z.string(),
    ko: z.string(),
  }),
  field: z.string(),
  description: z.object({
    en: z.string(),
    ko: z.string(),
  }).optional(),
  prerequisites: z.array(z.string()).optional(),
  formula: z.string().optional(),
});
```

## 使用例

### ビルドスクリプトでの使用

```typescript
// scripts/validate-data.ts
import { EntrySchema, loadJsonDirectory } from '@soundblue/data';

async function validateAllData() {
  const entries = await loadJsonDirectory<unknown>('data/context/entries/');

  for (const entry of entries) {
    const result = EntrySchema.safeParse(entry);
    if (!result.success) {
      console.error('Invalid entry:', result.error);
    }
  }
}
```

### React Routerローダーでの使用

```typescript
// routes/entry.$entryId.tsx
import type { Entry } from '@soundblue/data/types';

export async function loader({ params }: LoaderArgs) {
  const entry = getEntryById(params.entryId);
  if (!entry) throw new Response('Not Found', { status: 404 });
  return { entry };
}
```

## ベストプラクティス

1. **常にスキーマで検証** - データ境界で`safeParse`を使用
2. **スキーマを単一の真実源に** - 外部データにzod型を使用
3. **型注釈に推論型を使用** - 重複を避けるため
