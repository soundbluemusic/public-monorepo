---
title: SSG 詳細解説
description: React Router v7を使用した静的サイト生成アーキテクチャの理解
---

このプロジェクトは**100%静的サイト生成（SSG）**を使用しています — 34,676ページすべてがビルド時に事前レンダリングされ、CDNから直接配信されます。

:::caution[SSG専用]
このプロジェクトはSSG専用です。SPA、SSR、ISRモードは禁止されています。
:::

## 仕組み

React Router v7の`prerender()` + `loader()`パターンでビルド時に完全なHTMLを生成します。

```
┌─────────────────────────────────────────────────────────────────┐
│  ビルド時                                                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ prerender() │ → │  loader()   │ → │  HTML + .data │         │
│  │ (ルートリスト)│    │ (データ取得) │    │  (静的ファイル) │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ランタイム (CDN)                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  静的HTMLが即座に配信される — サーバー不要                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## アプリごとのSSGページ数

| アプリ | 動的ルート | SSGページ | データソース |
|:----|:---------------|:---------:|:------------|
| **Context** | 16,836エントリ + 25カテゴリ + 53会話 | 33,748 | JSON |
| **Roots** | 438概念 + 18分野 | 920 | TypeScript |
| **Permissive** | 4つの静的ルート | 8 | 配列リテラル |
| **合計** | — | **34,676** | — |

## コードパターン

### 設定 (`react-router.config.ts`)

```typescript
export default {
  ssr: false,  // SSGモード - 変更禁止
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const entryRoutes = generateI18nRoutes(entries, (e) => `/entry/${e.id}`);
    return [...staticRoutes, ...entryRoutes];
  },
} satisfies Config;
```

### ローダー付きルート (`routes/entry.$entryId.tsx`)

```typescript
export async function loader({ params }: Route.LoaderArgs) {
  const entry = getEntryById(params.entryId);
  if (!entry) throw new Response('Not Found', { status: 404 });
  return { entry };  // → ビルド時に.dataファイルとして保存
}

export default function EntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  return <EntryView entry={entry} />;
}
```

## なぜSSGか？

| メリット | 説明 |
|---------|-------------|
| **即時ロード** | CDNエッジロケーションから事前レンダリングされたHTMLを配信 |
| **コストゼロ** | 維持するサーバーインフラなし |
| **セキュア** | サーバーがなければサーバーの脆弱性もなし |
| **SEO最適化** | 検索エンジンが利用できる完全なHTMLコンテンツ |

## 禁止された変更

:::danger[変更禁止]
- 設定で`ssr: true`を設定
- `prerender()`関数の削除または空にする
- 空の`<div id="root"></div>`でSPAに変換
:::

## 関連ドキュメント

- [Hydrationバグ対応](/public-monorepo/ja/guides/hydration-workaround/) — React 19 SSGバグ修正
- [トラブルシューティング](/public-monorepo/ja/guides/troubleshooting/) — 一般的なビルドエラー
