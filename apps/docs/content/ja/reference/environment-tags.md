---
title: 環境タグ
description: SSG互換性のためのモジュール実行環境アノテーション
---

各モジュールはJSDocタグを使用して実行環境を宣言します。これにより、ビルドおよびランタイム中に正しいコンテキストでコードが実行されます。

## タグタイプ

### `@environment build-only`

**Node.jsビルド時のみ**実行されるコード。クライアントバンドルから除外されます。

```typescript
/**
 * @environment build-only
 * ビルド時にサイトマップを生成。ブラウザでは使用不可。
 */
export function generateSitemap(routes: string[]): string {
  return routes.map(r => `<url><loc>${r}</loc></url>`).join('');
}
```

**ユースケース:**
- サイトマップ生成
- RSSフィード作成
- 静的データ処理
- ビルド時検証

### `@environment client-only`

**ブラウザでのみ**実行されるコード。SSR/SSG中は`undefined`またはnoopを返します。

```typescript
/**
 * @environment client-only
 * オンライン状態を返す。SSG時はundefined。
 */
export function useOnlineStatus(): boolean | undefined {
  if (typeof window === 'undefined') return undefined;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // ... ブラウザ専用ロジック
  return isOnline;
}
```

**ユースケース:**
- ブラウザAPI使用（localStorage、navigatorなど）
- イベントリスナー（resize、scrollなど）
- IndexedDB操作
- サービスワーカー登録

### `@environment universal`

**ビルドとランタイムの両方で**安全なコード。純粋関数のみ。

```typescript
/**
 * @environment universal
 * どこでも安全。副作用なし。
 */
export function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

**ユースケース:**
- 文字列/配列ユーティリティ
- データ変換
- タイプガード
- 定数と検証

## 環境検出

```typescript
// ブラウザで実行中かチェック
const isBrowser = typeof window !== 'undefined';

// Node.jsビルドで実行中かチェック
const isNode = typeof process !== 'undefined' && process.versions?.node;

// 安全なブラウザ専用コード
if (isBrowser) {
  localStorage.setItem('key', 'value');
}
```

## パッケージ環境マトリックス

| パッケージ | build-only | client-only | universal |
|---------|:----------:|:-----------:|:---------:|
| `@soundblue/core` | - | - | ✅ |
| `@soundblue/config` | ✅ | - | - |
| `@soundblue/data` | ✅ | - | ✅ |
| `@soundblue/platform` | - | ✅ | - |
| `@soundblue/i18n` | ✅ | ✅ | ✅ |
| `@soundblue/search` | - | ✅ | ✅ |
| `@soundblue/seo` | ✅ | - | ✅ |
| `@soundblue/pwa` | ✅ | ✅ | - |
| `@soundblue/features` | - | ✅ | - |
| `@soundblue/ui` | - | ✅ | ✅ |

## よくある間違い

### universalコードでブラウザAPIを使用

```typescript
// ❌ 間違い - SSGビルド中にクラッシュ
export function getStoredTheme() {
  return localStorage.getItem('theme');  // Node.jsではlocalStorageはundefined
}

// ✅ 正しい - ブラウザAPIをガード
export function getStoredTheme(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('theme');
}
```

### 同じファイルで環境を混合

```typescript
// ❌ 避けるべき - 混乱する環境混合
export function generateMeta() { /* build-only */ }
export function useTheme() { /* client-only */ }

// ✅ より良い - ファイル分離
// meta.server.ts (build-only)
// theme.browser.ts (client-only)
```

## 関連ドキュメント

- [SSG詳細解説](/public-monorepo/ja/guides/ssg-deep-dive/) — SSGビルドの仕組み
- [ファイル制限](/public-monorepo/ja/reference/file-restrictions/) — 保護されたファイル
