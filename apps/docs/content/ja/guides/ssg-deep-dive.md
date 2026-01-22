---
title: SSG 詳細解説
description: React Router v7を使用した静的サイト生成アーキテクチャの理解
---

このページでは静的サイト生成（SSG）アーキテクチャについて説明します。現在、すべてのアプリはSSRモードを使用していますが、`prerender()`関数でビルド時に静的ページを事前生成しています。

:::caution[アプリ別レンダリングモード]
- **Context**: SSR + D1（動的レンダリング）
- **Permissive**: SSR（動的レンダリング）
- **Roots**: SSR（動的レンダリング + prerender）
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
| **Roots** | SSR | TypeScript | 数学文書を動的に提供 |

## コードパターン (Roots)

### 設定 (`apps/roots/react-router.config.ts`)

```typescript
// Roots app - SSR mode with prerender
export default {
  ssr: true,  // SSRモード - すべてのアプリで使用
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

## なぜSSR + prerenderか？

| メリット | 説明 |
|---------|-------------|
| **即時ロード** | prerenderされたページはCDNエッジから配信 |
| **動的対応** | 新しいページもSSRで即座に対応可能 |
| **SEO最適化** | 検索エンジンが利用できる完全なHTMLコンテンツ |
| **柔軟性** | 静的ページと動的ページの両方に対応 |

## 禁止された変更

:::danger[変更禁止]
- 設定で`ssr: false`を設定
- `prerender()`関数の削除または空にする
- 空の`<div id="root"></div>`でSPAに変換
:::

## 関連ドキュメント

- [Hydrationバグ対応](/public-monorepo/ja/guides/hydration-workaround/) — React 19 SSRバグ修正
- [トラブルシューティング](/public-monorepo/ja/guides/troubleshooting/) — 一般的なビルドエラー
