---
title: ファイル制限
description: 変更してはいけないファイルとその理由
---

このコードベースの特定のファイルは保護されており、その重要な役割を理解せずに変更してはいけません。

## 保護されたファイル

### `entry.client.tsx`

**場所:** `apps/*/app/entry.client.tsx`

**目的:** クライアント側hydration + orphan DOMクリーンアップ

:::danger[クリーンアップコード削除禁止]
orphan DOMクリーンアップコードはReact Router v7 + React 19 SSGバグの回避策です。削除するとすべてのボタンクリックが動作しなくなります。
:::

```typescript
// このコードは必ず維持
setTimeout(() => {
  const divs = [...document.body.children].filter(el => el.tagName === 'DIV');
  if (divs.length >= 2) {
    const firstDiv = divs[0] as HTMLElement;
    if (!Object.keys(firstDiv).some(k => k.startsWith('__react'))) {
      firstDiv.remove();
    }
  }
}, 100);
```

詳細は[Hydrationバグ対応](/public-monorepo/ja/guides/hydration-workaround/)を参照してください。

### `entry.server.tsx`

**場所:** `apps/*/app/entry.server.tsx`

**目的:** SSG HTML生成

:::caution[prerender削除禁止]
`prerender`エクスポートはSSGが動作するために必須です。削除するとビルドが失敗します。
:::

### `react-router.config.ts`

**場所:** `apps/*/react-router.config.ts`

**目的:** React Router設定

:::danger[ssr: false維持]
`ssr: true`に設定するとSSGアーキテクチャが壊れます。このプロジェクトは100% SSG専用です。
:::

```typescript
// これは必ず維持
export default {
  ssr: false,  // 変更禁止
  async prerender() { /* ... */ }
} satisfies Config;
```

## ファイル命名規則

### `*.browser.ts`

`.browser.ts`で終わるファイルは**ブラウザでのみ**実行されます：
- ブラウザAPI使用（localStorage、IndexedDBなど）
- SSGビルド時コードからのインポート禁止
- 必要に応じてSSG用の`.noop.ts`ファイル必要

### `*.noop.ts`

`.noop.ts`で終わるファイルはSSG互換性のための**無操作スタブ**です：
- 空/デフォルト実装を提供
- ブラウザコードにビルド時フォールバックが必要な場合に使用
- 実際のロジック含有禁止

```typescript
// storage.noop.ts - SSGフォールバック
export const storage = {
  get: () => null,
  set: () => {},
  clear: () => {},
};
```

### `*.server.ts`

`.server.ts`で終わるファイルは**ビルド中のみ**実行されます：
- 静的コンテンツ生成
- データ処理
- クライアントバンドルに含まれない

## ディレクトリ制限

### `packages/core/`

**許可:** 純粋関数、型、定数
**禁止:** ブラウザAPI、Reactコンポーネント、副作用

### `packages/data/schemas/`

**許可:** Zodスキーマのみ
**禁止:** データ取得、変換

### `data/**/*.json`

**許可:** Zodスキーマに一致するJSONファイル
**禁止:** スキーマに準拠しないデータ

## 変更チェックリスト

保護されたファイルを変更する前に：

1. ✅ このコードがなぜ存在するか理解したか？
2. ✅ 関連ドキュメントを読んだか？
3. ✅ 変更がSSGを壊すか？
4. ✅ 変更がhydrationを壊すか？
5. ✅ プロダクションビルドでテストしたか？

## 関連ドキュメント

- [Hydrationバグ対応](/public-monorepo/ja/guides/hydration-workaround/) — entry.client.tsxが保護される理由
- [SSG詳細解説](/public-monorepo/ja/guides/ssg-deep-dive/) — SSGアーキテクチャの理解
- [環境タグ](/public-monorepo/ja/reference/environment-tags/) — ファイル環境アノテーション
