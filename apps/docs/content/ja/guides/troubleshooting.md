---
title: トラブルシューティング
description: このモノレポで作業時に発生する可能性のある一般的な問題と解決策
---

よくある問題の解決策です。

## ビルドエラー

### "Cannot find module"エラー

```
Error: Cannot find module '@soundblue/core'
```

**解決:** ルートディレクトリからinstallを実行：

```bash
cd /path/to/public-monorepo
pnpm install
```

### パッケージ変更後のTypeScriptエラー

```
error TS2307: Cannot find module '@soundblue/ui/components'
```

**解決:** すべてのパッケージを再ビルド：

```bash
pnpm build
```

### Viteビルドメモリエラー

```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed
```

**解決:** Node.jsメモリ制限を増加：

```bash
NODE_OPTIONS="--max-old-space-size=8192" pnpm build
```

## ランタイム問題

### ロード後ボタンがクリックできない

React Router v7 + React 19 SSG hydrationバグです。

**確認:**
1. `entry.client.tsx`にorphan DOMクリーンアップコードがあるか
2. hydration中にコンソールエラーがないか

詳細は[Hydrationバグ対応](/public-monorepo/ja/guides/hydration-workaround/)を参照してください。

### 検索が動作しない

**確認:**
1. 検索インデックスがビルドされている：`pnpm build`が検索ファイルを生成するはず
2. ブラウザコンソールエラー
3. MiniSearchワーカーが正しくロードされているか

### スタイルが適用されない

**確認:**
1. Tailwind CSSが処理中：`tailwind.config.ts`を確認
2. CSSインポートが正しいか
3. `pnpm dev`を実行してホットリロードをトリガー

## 開発環境設定

### ポートが既に使用中

```
Error: Port 3003 is already in use
```

**解決:** プロセスを終了するか別のポートを使用：

```bash
# ポートを使用しているプロセスを検索
lsof -i :3003

# 終了
kill -9 <PID>

# または別のポートを使用
PORT=3010 pnpm dev:context
```

### pnpmバージョン不一致

```
ERR_PNPM_BAD_PM_VERSION
```

**解決:** 正しいpnpmバージョンをインストール：

```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
```

### Node.jsバージョンが低すぎる

```
error This package requires Node.js >= 20
```

**解決:** Node.jsをアップグレード：

```bash
# nvmを使用
nvm install 20
nvm use 20

# またはnodejs.orgからダウンロード
```

## レイヤー違反エラー

### Importレイヤールール違反

```
ERROR: @soundblue/core cannot import from @soundblue/platform
```

**ルール:**
- L0 (core, config) → 他のレイヤーからインポート不可
- L1 (data, platform) → L0のみインポート可能
- L2 (i18n, search, seo, pwa) → L0, L1インポート可能
- L3 (ui, features, apps) → すべてのレイヤーインポート可能

完全な図は[アーキテクチャ](/public-monorepo/ja/guides/architecture/)を参照してください。

## データ問題

### JSONスキーマ検証失敗

```
ZodError: Invalid entry data
```

**確認:**
1. JSONファイルがZodスキーマと一致しているか
2. すべての必須フィールドがあるか
3. データ型が正しいか

```bash
# データ検証
pnpm test:data
```

## ヘルプを得る

問題がここにない場合：

1. [GitHub Issues](https://github.com/soundbluemusic/public-monorepo/issues)を検索
2. 既知のupstreamの問題か確認（React Router、Viteなど）
3. 以下の情報で新しいissueを作成：
   - エラーメッセージ（完全なスタックトレース）
   - 再現手順
   - 環境（Node.jsバージョン、OSなど）
