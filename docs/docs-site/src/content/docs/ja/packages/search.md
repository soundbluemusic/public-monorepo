---
title: "@soundblue/search"
description: Web Workerサポート付きMiniSearchラッパーとReactフック - Layer 2 ドメインパッケージ
sidebar:
  order: 7
---

# @soundblue/search

**Layer 2 (ドメイン)** — Web WorkerサポートのMiniSearchベースフルテキスト検索エンジンラッパー。

## 概要

このパッケージは、ファジーマッチング、プレフィックス検索、韓国語ローマ字サポートを含むクライアントサイド検索エンジンを提供します。ノンブロッキング検索のためにWeb Workerを使用します。

| プロパティ | 値 |
|----------|-------|
| レイヤー | 2 (ドメイン) |
| 依存関係 | minisearch, @soundblue/core |
| React必須 | はい (フック用) |

## エクスポート

### `/core`

React依存なしのコア検索エンジン。

```typescript
import { SearchEngine, type SearchConfig } from '@soundblue/search/core';

// 検索エンジンを作成
const config: SearchConfig = {
  fields: ['word', 'romanization', 'translations.en'],
  storeFields: ['id', 'word', 'category'],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
    boost: { word: 2, romanization: 1.5 },
  },
};

const engine = new SearchEngine(config);

// ドキュメントをインデックス
await engine.addDocuments([
  { id: '1', word: '안녕', romanization: 'annyeong', translations: { en: 'hello' } },
  { id: '2', word: '감사', romanization: 'gamsa', translations: { en: 'thanks' } },
]);

// 検索
const results = engine.search('hello');
// [{ id: '1', word: '안녕', score: 1.5, ... }]

// 韓国語ローマ字で検索
const results2 = engine.search('annyeong');
// [{ id: '1', word: '안녕', score: 1.2, ... }]
```

### `/react`

検索機能用のReactフック。

```typescript
import { useSearch, useSearchWorker } from '@soundblue/search/react';

// シンプルな検索フック
function SearchComponent() {
  const { query, setQuery, results, isLoading } = useSearch({
    data: entries,
    fields: ['word', 'translations.en'],
    debounce: 200,
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="検索..."
      />
      {isLoading && <span>検索中...</span>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.word}</li>
        ))}
      </ul>
    </div>
  );
}

// Web Worker検索 (大規模データセット用)
function LargeSearchComponent() {
  const { query, setQuery, results, isReady } = useSearchWorker({
    workerUrl: '/search-worker.js',
    debounce: 150,
  });

  if (!isReady) return <span>検索インデックス読み込み中...</span>;

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

## 検索設定

```typescript
interface SearchConfig {
  // 検索用にインデックスするフィールド
  fields: string[];

  // 結果に保存するフィールド (ドキュメントのサブセット)
  storeFields?: string[];

  // 検索オプション
  searchOptions?: {
    // プレフィックスマッチングを有効化 ("hel"が"hello"にマッチ)
    prefix?: boolean;

    // ファジーマッチングしきい値 (0-1、高いほどファジー)
    fuzzy?: number;

    // フィールドブースト重み
    boost?: Record<string, number>;

    // 最大結果数
    maxResults?: number;
  };
}
```

## パフォーマンスのヒント

1. **10,000項目以上にはWeb Workerを使用**
2. **検索入力をデバウンス**して再レンダリングを減少
3. **検索結果に最小限のフィールドのみ保存**
4. **ビルド時にインデックスをプリビルド**して初期読み込み速度を向上
