---
title: クイックスタート
description: SoundBlue Public Monorepoを数分で始めましょう
---

# クイックスタートガイド

数分でローカルでモノレポを実行しましょう。

## 前提条件

開始する前に、以下がインストールされていることを確認してください：

| ツール | バージョン | インストール |
|--------|-----------|--------------|
| Node.js | ≥22.0.0 | [nodejs.org](https://nodejs.org) |
| pnpm | 10.11.0 | `npm install -g pnpm@10.11.0` |
| Git | 最新 | [git-scm.com](https://git-scm.com) |

## インストール

### 1. リポジトリをクローン

```bash
git clone https://github.com/soundbluemusic/public-monorepo.git
cd public-monorepo
```

### 2. 依存関係をインストール

```bash
pnpm install
```

モノレポのすべてのアプリとパッケージの依存関係がインストールされます。

## 開発

### 個別アプリの実行

各アプリには独自の開発サーバーがあります：

```bash
# Context - 韓国語辞書
pnpm dev:context
# → http://localhost:3003

# Permissive - Web開発リソース
pnpm dev:permissive
# → http://localhost:3004

# Roots - 数学ドキュメント
pnpm dev:roots
# → http://localhost:3005
```

### すべてのアプリを実行

```bash
pnpm dev
```

## ビルド

### 個別アプリのビルド

```bash
pnpm build:context    # Contextアプリをビルド
pnpm build:permissive # Permissiveアプリをビルド
pnpm build:roots      # Rootsアプリをビルド
```

### すべてのアプリをビルド

```bash
pnpm build
```

:::tip[Turborepoキャッシング]
Turborepoはビルド結果をキャッシュします。同じ入力に対する後続のビルドは**97%以上高速**になります。
:::

## 品質チェック

### リンティング

```bash
pnpm lint        # Biomeリンターを実行
pnpm lint:fix    # リンティング問題を自動修正
```

### 型チェック

```bash
pnpm typecheck   # TypeScript型チェック
```

### テスト

```bash
pnpm test        # Vitestテストを実行
pnpm test:e2e    # Playwright E2Eテストを実行
```

### すべてのチェック

```bash
pnpm check       # すべての品質チェックを実行
```

## プロジェクトコマンドリファレンス

| コマンド | 説明 |
|----------|------|
| `pnpm dev` | すべての開発サーバーを起動 |
| `pnpm dev:context` | Context開発サーバーを起動 |
| `pnpm dev:permissive` | Permissive開発サーバーを起動 |
| `pnpm dev:roots` | Roots開発サーバーを起動 |
| `pnpm build` | すべてのアプリをビルド |
| `pnpm lint` | リンターを実行 |
| `pnpm typecheck` | TypeScriptチェックを実行 |
| `pnpm test` | ユニットテストを実行 |
| `pnpm test:e2e` | E2Eテストを実行 |

## 次のステップ

プロジェクトが実行されたら：

1. **コードベースを探索** - `apps/`で3つのアプリケーションを確認
2. **アーキテクチャを理解** - [アーキテクチャガイド](/public-monorepo/ja/guides/architecture/)を読む
3. **各アプリについて学ぶ** - アプリ固有のドキュメントを訪問
4. **貢献する** - [貢献ガイド](/public-monorepo/ja/development/contributing/)を確認
