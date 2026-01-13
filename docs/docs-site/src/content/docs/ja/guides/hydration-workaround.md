---
title: Hydrationバグ対応
description: React Router v7 + React 19 SSG hydrationバグ修正の理解とメンテナンス
---

このドキュメントは、React Router v7 + React 19 SSG環境での既知のバグに対する**重要な回避策**を説明します。

:::caution[削除禁止]
`entry.client.tsx`のorphan DOMクリーンアップコードは必須です。削除するとすべてのボタンクリックが動作しなくなります。
:::

## 問題

React Router v7 SSG (`ssr: false`) hydrationが失敗した場合：

1. React 19が新しいDOMツリーを作成
2. 元のサーバーレンダリングHTMLが**削除されない**
3. DOM重複が発生 → ユーザーが見るボタンにReactハンドラーがない → **クリック不可**

```
┌─────────────────────────────────────────┐
│  Hydration前 (SSG HTML)                 │
│  ┌─────────────────────────────────┐    │
│  │  <div> (サーバーレンダリング)     │    │
│  │    <button>クリック</button>     │ ← ユーザーが見る部分
│  │  </div>                         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Hydration後 (バグ)                     │
│  ┌─────────────────────────────────┐    │
│  │  <div> (orphan - ハンドラーなし) │ ← まだ表示！
│  │    <button>クリック</button>     │    │
│  │  </div>                         │    │
│  │  <div> (React - ハンドラーあり)  │ ← 後ろに隠れている
│  │    <button>クリック</button>     │    │
│  │  </div>                         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## 解決策

各アプリの`entry.client.tsx`でhydration後にorphan DOMを削除します：

```typescript
// apps/*/app/entry.client.tsx
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

startTransition(() => {
  hydrateRoot(document, <StrictMode><App /></StrictMode>);

  // Orphan DOMクリーンアップ (React Router v7 SSGバグ workaround)
  setTimeout(() => {
    const divs = [...document.body.children].filter(el => el.tagName === 'DIV');
    if (divs.length >= 2) {
      const firstDiv = divs[0] as HTMLElement;
      // divにReact内部プロパティがあるか確認
      if (!Object.keys(firstDiv).some(k => k.startsWith('__react'))) {
        firstDiv.remove();
      }
    }
  }, 100);
});
```

### 動作方法

1. React hydrationが完了するまで100ms待機
2. すべてのトップレベル`<div>`要素を検索
3. 2つ以上のdivがある場合、最初のものをチェック
4. React内部プロパティ(`__react*`)がない場合はorphan → 削除

## 保護されたファイル

| ファイル | 目的 | 保護理由 |
|------|---------|---------------|
| `apps/*/app/entry.client.tsx` | Hydration + orphanクリーンアップ | 削除するとすべてのクリック不可 |
| `apps/*/app/entry.server.tsx` | SSG HTML生成 | `prerender`関数必須 |

## 関連Issue

- [React Router #12893](https://github.com/remix-run/react-router/issues/12893)
- [React Router #12360](https://github.com/remix-run/react-router/discussions/12360)
- [React Router #13368](https://github.com/remix-run/react-router/issues/13368)

## 修正テスト

workaroundが動作しているか確認するには：

```bash
# 1. アプリをビルド
pnpm build:context

# 2. ビルドをプレビュー
pnpm preview:context

# 3. ブラウザで確認：
#    - ボタンがクリック可能か
#    - 重複コンテンツが表示されていないか
#    - コンソールにhydrationエラーがないか
```

## トラブルシューティング

### ボタンがまだクリックできない

1. `entry.client.tsx`が存在しクリーンアップコードがあるか確認
2. タイムアウト(100ms)が短すぎないか確認
3. hydration中のコンソールエラーを確認

### コンテンツがちらつく

1. 100msの遅延が遅い接続で見える可能性
2. 必要に応じてタイムアウトを増やすが、最小限に保つ

## 関連ドキュメント

- [SSG詳細解説](/public-monorepo/ja/guides/ssg-deep-dive/) — SSGアーキテクチャの理解
- [トラブルシューティング](/public-monorepo/ja/guides/troubleshooting/) — 一般的な問題と解決策
