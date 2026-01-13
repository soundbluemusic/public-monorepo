---
title: Permissive概要
description: Permissive - 無料Web開発リソースの完全なドキュメント
sidebar:
  order: 1
---

# Permissive — Web開発リソース

**無料Web開発リソース** | 8 SSGページ

Permissiveは、許容的ライセンス（MIT、Apacheなど）を持つWeb開発ライブラリとWeb APIドキュメントのキュレーションコレクションです。

## ライブデモ

🌐 **[permissive.soundbluemusic.com](https://permissive.soundbluemusic.com)**

## 機能

### 📚 ライブラリカタログ

- **88ライブラリ** - 許容的ライセンスのみ
- カテゴリ別分類（フレームワーク、ユーティリティ、UIなど）
- ライセンス情報とGitHubリンク
- 説明と使用例

### 🔧 Web APIドキュメント

- **56 Web API** - ブラウザ組み込みAPI
- MDNドキュメントリンク
- ブラウザ互換性情報
- 使用例

### 🌐 多言語サポート

- 英語と韓国語UI
- URLベースの言語切り替え

## プロジェクト構造

```
apps/permissive/
├── app/
│   ├── components/      # Reactコンポーネント
│   ├── routes/          # React Routerルート
│   ├── data/            # ライブラリとAPIデータ
│   └── utils/           # ユーティリティ関数
├── public/              # 静的アセット
└── react-router.config.ts  # SSG設定
```

## 主要ルート

| ルート | 説明 |
|--------|------|
| `/` | ホームページ |
| `/libraries` | ライブラリ一覧 |
| `/web-apis` | Web API一覧 |
| `/about` | 概要ページ |

## 開発

### 開発サーバー起動

```bash
pnpm dev:permissive
# → http://localhost:3004
```

### プロダクションビルド

```bash
pnpm build:permissive
```
