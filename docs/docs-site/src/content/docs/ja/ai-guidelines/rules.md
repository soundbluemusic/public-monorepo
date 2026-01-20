---
title: ルール
description: AIアシスタント向け重要ルール - 禁止事項と必須事項
---

## 禁止事項 (DO NOT)

### 1. レンダリングモード違反

:::danger[厳格に禁止]
- すべてのアプリでSPAモード（SEO不可）
- 動的ルートから`loader()`削除
- 空の`<div id="root"></div>` HTML

**Contextアプリ（SSR + D1）：**

- react-router.config.tsで`ssr: false`設定
- D1なしでentryデータロード

**Rootsアプリ（SSR）：**

- react-router.config.tsで`ssr: false`設定
- `prerender()`の削除/空にする
:::

### 2. ハードコーディング

- テスト通過用ハードコード値
- マジックナンバー（名前付き定数を使用）
- 環境固有の固定値

```typescript
// ❌ 禁止
const MAX_ITEMS = 100;  // マジックナンバー
if (userId === "user123") { ... }  // ハードコード

// ✅ 正しい
const MAX_ITEMS = LIMITS.MAX_SEARCH_RESULTS;
if (userId === targetUserId) { ... }
```

### 3. エラー隠蔽

- 空のcatchブロック
- 説明なしの`@ts-ignore`
- 型チェック回避のための`any`型
- エラー隠蔽のためのコード削除/コメントアウト

```typescript
// ❌ 禁止
try { ... } catch {}  // 空のcatch
// @ts-ignore
const data: any = response;  // any型回避

// ✅ 正しい
try { ... } catch (error) {
  console.error('Fetch失敗:', error);
  throw error;
}
// @ts-ignore - サードパーティライブラリの型欠落 (issue #123)
```

### 4. 不完全なコード

```typescript
// ❌ 禁止
function processData() {
  // ... existing code ...
  // TODO: validation実装
}

// ✅ 正しい - 常に完全な実装を提供
function processData(data: Input): Output {
  const validated = validateInput(data);
  const processed = transform(validated);
  return processed;
}
```

### 5. 過学習 / 一時しのぎ

- 特定のテストケースのみ通過する条件文
- エラーメッセージ文字列マッチング基づく分岐
- 症状のみ隠すtry-catch
- 根本原因理解なしの修正

### 6. ダウングレード（ダウングレード禁止ポリシー）

:::danger[絶対にダウングレード禁止]
問題解決のためのパッケージバージョンダウングレードは**絶対禁止**です。
:::

```typescript
// ❌ 禁止: ダウングレード
"react": "^17.0.0"  // 問題で18からダウングレード

// ✅ 許可: アップグレード + コード修正
"react": "^19.0.0"  // 最新バージョン + API変更に合わせたコード修正

// ✅ 許可: 分離
"pnpm": { "overrides": { "zod": "^3.25.0" } }  // 競合分離
```

**なぜ？** ダウングレードは技術的負債を蓄積します。数学的証明のように、一度検証されたもの（ビルド、テスト）は変更不可であるべきです。

---

## 必須事項 (MUST DO)

### レスポンスルール

| ルール | 説明 |
|------|-------------|
| **韓国語レスポンス必須** | すべての説明とドキュメントは韓国語で |
| **推測禁止** | 回答前にコード確認 |
| **完全なコード** | `// ...`使用禁止 |
| **出典明示** | `ファイル:行`形式で参照 |
| **UI検証** | コード変更後は実際のUIで確認 |

### 修正前チェックリスト

変更前に：

1. ✅ 根本原因（WHY）を理解したか？
2. ✅ 既存機能が維持されるか？
3. ✅ ハードコードされた値があるか？
4. ✅ すべての類似ケースで動作するか？

---

## ファイル別ルール

### 許可

| 場所 | 許可アクション |
|----------|----------------|
| `packages/core/` | 純粋関数、型、定数（ブラウザAPI禁止） |
| `packages/data/schemas/` | Zodスキーマ |
| `packages/ui/components/` | Reactコンポーネント |
| `apps/*/routes/` | ルートコンポーネント |
| `data/**/*.json` | スキーマ準拠データ |

### 禁止

| 場所 | 禁止アクション |
|----------|-------------------|
| `apps/context/react-router.config.ts` | `ssr: false`（ContextはSSR + D1） |
| `apps/permissive/react-router.config.ts` | `ssr: false`（PermissiveはSSR） |
| `apps/roots/react-router.config.ts` | `ssr: false`（RootsはSSR、`ssr: true`維持） |
| `*.browser.ts` | ビルド時実行コード |
| `*.noop.ts` | 実際のロジック（空の実装のみ） |
| `entry.client.tsx` | orphan DOMクリーンアップロジック削除 |

---

## i18n / SEOルール

### URLルーティング

```
/entry/hello     → 英語
/ko/entry/hello  → 韓国語
```

### Meta Factory必須

```typescript
// 静的ルート
export const meta = metaFactory({
  ko: { title: '제목', description: '설명' },
  en: { title: 'Title', description: 'Desc' },
}, 'https://app.soundbluemusic.com');

// 動的ルート
export const meta = dynamicMetaFactory<typeof loader>({
  getTitle: (data) => data.entry.title,
  baseUrl: 'https://app.soundbluemusic.com',
});
```

## 関連ドキュメント

- [AIガイドライン概要](/public-monorepo/ja/ai-guidelines/) — クイックリファレンス
- [レイヤーシステム](/public-monorepo/ja/ai-guidelines/layer-system/) — Importレイヤールール
