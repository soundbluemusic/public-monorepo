---
title: Pull Requestガイド
description: Pull Requestの作成と提出方法
sidebar:
  order: 3
---

# Pull Requestガイド

このガイドでは、モノレポへの効果的なPull Requestの作成方法を説明します。

## 始める前に

1. **既存のissueを確認** — 変更がすでに進行中かもしれません
2. **新機能や大きな変更はまずissueを開く**
3. 外部貢献者の場合は**リポジトリをFork**

## Pull Requestの作成

### 1. フィーチャーブランチを作成

```bash
# mainブランチを更新
git checkout main
git pull origin main

# フィーチャーブランチを作成
git checkout -b feat/your-feature
```

### 2. 変更を行う

- [コードスタイルガイド](/public-monorepo/ja/contributing/code-style/)に従う
- コミットは集中的でアトミックに
- 明確なコミットメッセージを書く

### 3. 品質チェックを実行

提出前にすべてのチェックに合格する必要があります：

```bash
# リントチェック
pnpm lint

# 型チェック
pnpm typecheck

# ユニットテスト
pnpm test

# すべてのアプリをビルド
pnpm build
```

### 4. Pushしてプルリクエストを作成

```bash
git push origin feat/your-feature
```

その後、GitHubでPull Requestを開きます。

## PRタイトル形式

[Conventional Commits](https://www.conventionalcommits.org/)形式を使用：

```
<type>(<scope>): <description>
```

### タイプ

| タイプ | 説明 |
|--------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみ |
| `style` | フォーマット、コード変更なし |
| `refactor` | コード変更、機能/修正なし |
| `perf` | パフォーマンス改善 |
| `test` | テスト追加 |
| `chore` | ビルド、依存関係など |

### 例

```
feat(context): ローマ字表記検索サポートを追加
fix(search): 特殊文字の空結果を解決
docs(readme): インストール手順を更新
refactor(ui): Buttonコンポーネントを抽出
perf(search): インデックス読み込みを最適化
test(i18n): ロケールルーティングテストを追加
chore(deps): react-routerをv7.12に更新
```

## PR説明テンプレート

```markdown
## 概要
<!-- 変更の簡単な説明 -->

## 変更内容
<!-- 具体的な変更リスト -->
- X機能を追加
- Yバグを修正
- Zコンポーネントを更新

## テスト
<!-- どのようにテストしましたか？ -->
- [ ] ユニットテスト合格
- [ ] ブラウザで手動テスト
- [ ] ENとKOの両方でテスト

## スクリーンショット（UI変更の場合）
<!-- スクリーンショットまたはGIFを追加 -->

## 関連Issue
<!-- 関連するissueをリンク -->
Fixes #123
Closes #456
```

## マージ要件

PRは以下の条件を満たすとマージ可能：

- [ ] すべてのCIチェックに合格
- [ ] メンテナーから最低1つの承認
- [ ] 未解決の会話なし
- [ ] mainと最新状態

## マージ後

1. フィーチャーブランチを削除
2. 更新されたmainブランチをpull
3. 貢献を祝いましょう！🎉
