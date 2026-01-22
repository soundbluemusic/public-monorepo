---
title: Context概要
description: Context - 学習者のための韓国語辞書の完全なドキュメント
sidebar:
  order: 1
---

# Context — 韓国語辞書

**学習者のための韓国語辞書** | SSR + Cloudflare D1

Contextは、韓国語学習者のために特別に設計された文脈ベースの韓国語辞書です。単語の意味、例文、関連表現をユーザーフレンドリーなインターフェースで提供します。

> **レンダリングモード:** SSR + D1 — すべてのentryページは**Cloudflare Workers**を通じてD1データベースから動的に提供されます。

## ライブデモ

🌐 **[context.soundbluemusic.com](https://context.soundbluemusic.com)**

## 機能

### 📚 総合辞書

- **16,836エントリ** - 初級から上級まで語彙を提供
- 実際の使用例を含む文脈ベースの定義
- 関連表現とコロケーション
- バイリンガルサポート（韓国語/英語）

### 🔍 スマート検索

- 韓国語ローマ字表記対応の即時検索
- 入力時の自動サジェスト
- 韓国語、英語、ローマ字表記で検索

### 🌐 多言語インターフェース

- 英語と韓国語UIの完全サポート
- URLベースの言語切り替え（`/entry/...` vs `/ko/entry/...`）
- 適切なcanonicalとhreflangタグでSEO最適化

### 📱 PWAサポート

- Progressive Web Appとしてインストール可能
- サービスワーカーキャッシングでオフライン対応
- Stale-while-revalidateキャッシング戦略

## プロジェクト構造

```
apps/context/
├── app/
│   ├── components/      # Reactコンポーネント
│   ├── routes/          # React Routerルート
│   ├── data/            # エントリデータローダー
│   ├── hooks/           # カスタムReactフック
│   └── utils/           # ユーティリティ関数
├── public/              # 静的アセット
└── react-router.config.ts  # SSR設定
```

## 主要ルート

| ルート | 説明 |
|--------|------|
| `/` | 検索付きホームページ |
| `/entry/:entryId` | 個別エントリページ（英語） |
| `/ko/entry/:entryId` | 個別エントリページ（韓国語） |
| `/about` | 概要ページ |
| `/sitemap.xml` | XMLサイトマップ |

## 開発

### 開発サーバー起動

```bash
pnpm dev:context
# → http://localhost:3003
```

### プロダクションビルド

```bash
pnpm build:context
```
