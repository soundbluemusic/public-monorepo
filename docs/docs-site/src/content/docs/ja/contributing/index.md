---
title: コントリビューションガイド
description: SoundBlue Public Monorepoへの貢献方法
sidebar:
  order: 1
---

# コントリビューションガイド

SoundBlue Public Monorepoに興味を持っていただきありがとうございます！このガイドは始め方を説明します。

## クイックスタート

```bash
# 1. Fork & Clone
git clone https://github.com/YOUR_USERNAME/public-monorepo.git
cd public-monorepo

# 2. 依存関係インストール
pnpm install

# 3. 開発サーバー起動
pnpm dev:context     # → http://localhost:3003
pnpm dev:permissive  # → http://localhost:3004
pnpm dev:roots       # → http://localhost:3005
```

## 必須要件

| 要件 | バージョン |
|------|-----------|
| Node.js | ≥ 20 |
| pnpm | 10.11.0 |
| Git | 最新バージョン |

## 重要なルール

:::danger[SPAモード禁止]
このプロジェクトは**SSRモードのみ使用**します。SPAモードは空のHTMLを返すためSEOが不可能なので禁止です。

各アプリのレンダリングモード：

- **Context**: SSR + Cloudflare D1
- **Permissive**: SSR
- **Roots**: SSR
:::

### 1. 各アプリのレンダリングモードを遵守

```typescript
// Contextアプリ (SSR + D1)
export default { ssr: true, ... }

// Rootsアプリ (SSR)
export default { ssr: true, async prerender() { ... } }

// Permissiveアプリ (SSR)
export default { ssr: true, async prerender() { ... } }

// ❌ SPAモード使用禁止（loaderなし、クライアントのみレンダリング）
```

### 2. ハードコーディング禁止

| 禁止 | 許可 |
|------|------|
| テスト通過用のマジックナンバー | JSDoc付きの名前付き定数 |
| エラー回避用のモックデータ | 型安全な列挙型 |
| バグを隠すフォールバック値 | CSSデザイントークン |

### 3. クイックフィックス禁止

すべての修正は特定のケースではなく**一般的な解決策**でなければなりません。

| 禁止 | 必須 |
|------|------|
| 特定のテストケースのみを対象とした条件 | すべての類似ケースに対する一般的な解決策 |
| エラーメッセージ文字列での分岐 | 適切なエラータイプ処理 |
| try-catchで症状を隠す | 根本原因の修正 |

### 4. ダウングレード禁止ポリシー

> **問題解決のためにパッケージバージョンをダウングレードしないでください。**

| 状況 | ❌ やってはいけない | ✅ やるべきこと |
|------|---------------------|----------------|
| 互換性エラー | 古いバージョンにダウングレード | 新しいAPIに合わせてコード更新 |
| 依存関係の競合 | すべてのバージョンを下げる | `pnpm.overrides`で分離 |
| ビルド失敗 | 「動いていたバージョン」に戻す | 根本原因を分析して修正 |

### 5. UI検証必須

すべての変更は実際のUIで確認する必要があります：

- ローカル開発サーバーを実行
- 英語と韓国語の両方のページを確認
- インタラクションをテスト（クリック、入力など）

## 開発ワークフロー

### 1. ブランチ作成

```bash
git checkout -b feat/your-feature
# または
git checkout -b fix/your-bug-fix
```

### 2. 変更を行う

- [コードスタイルガイド](/public-monorepo/ja/contributing/code-style/)に従う
- 該当する場合はテストを書く
- 必要に応じてドキュメントを更新

### 3. 品質チェック実行

```bash
pnpm lint       # コードスタイルチェック（Biome）
pnpm typecheck  # TypeScript型チェック
pnpm test       # ユニットテスト実行（Vitest）
pnpm build      # すべてのアプリをビルド
```

### 4. コミット

[Conventional Commits](https://www.conventionalcommits.org/)形式を使用：

```bash
git commit -m "feat: 新しい検索機能を追加"
git commit -m "fix: hydrationの不一致を解決"
git commit -m "docs: READMEを更新"
```

### 5. Pull Request作成

詳細は[Pull Requestガイド](/public-monorepo/ja/contributing/pull-requests/)を参照してください。

## お問い合わせ

- [GitHub Issues](https://github.com/soundbluemusic/public-monorepo/issues)
- [ドキュメント](https://soundbluemusic.github.io/public-monorepo)
