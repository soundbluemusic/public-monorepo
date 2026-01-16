---
title: SSG 詳細解説
description: React Router v7を使用した静的サイト生成アーキテクチャの理解
---

**Roots**アプリは静的サイト生成（SSG）を使用しています — 920ページすべてがビルド時に事前レンダリングされ、CDNから直接配信されます。

:::caution[アプリ別レンダリングモード]
- **Context**: SSR + D1（動的レンダリング）
- **Permissive**: SSR（動的レンダリング）
- **Roots**: SSG（このページで説明）
- SPAモードは禁止されています
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

## アプリごとのレンダリングモード

| アプリ | モード | データソース | 説明 |
|:----|:-------|:------------|:-----|
| **Context** | SSR + D1 | Cloudflare D1 | 16,836エントリを動的に提供 |
| **Permissive** | SSR | In-memory | 動的レンダリング |
| **Roots** | SSG | TypeScript | 920ページを事前レンダリング |

## コードパターン (Roots)

### 設定 (`apps/roots/react-router.config.ts`)

```typescript
// Roots app - SSG mode
export default {
  ssr: false,  // SSGモード - Rootsのみ
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const conceptRoutes = generateI18nRoutes(concepts, (c) => `/concept/${c.id}`);
    return [...staticRoutes, ...conceptRoutes];
  },
} satisfies Config;
```

### ローダー付きルート (`routes/concept.$conceptId.tsx`)

```typescript
export async function loader({ params }: Route.LoaderArgs) {
  const concept = getConceptById(params.conceptId);
  if (!concept) throw new Response('Not Found', { status: 404 });
  return { concept };  // → ビルド時に.dataファイルとして保存
}

export default function ConceptPage() {
  const { concept } = useLoaderData<typeof loader>();
  return <ConceptView concept={concept} />;
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
