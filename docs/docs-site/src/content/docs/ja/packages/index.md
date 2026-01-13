---
title: パッケージ概要
description: モノレポの10個の共有パッケージとレイヤーアーキテクチャの概要
sidebar:
  order: 1
---

# パッケージ概要

モノレポには、厳格なレイヤーシステムで構成された**10個の共有パッケージ**が含まれています。各パッケージには特定の役割があり、下位レイヤーのパッケージのみインポートできます。

## レイヤーアーキテクチャ

```
Layer 3 (アプリ + UI)    @soundblue/ui, @soundblue/features
        ↓
Layer 2 (ドメイン)       @soundblue/i18n, @soundblue/search, @soundblue/seo, @soundblue/pwa
        ↓
Layer 1 (データ)         @soundblue/data, @soundblue/platform
        ↓
Layer 0 (基盤)           @soundblue/core, @soundblue/config
```

## レイヤールール

- **Layer NはLayer N-1以下のみインポート可能**
- 同じレイヤー内のパッケージ間で循環依存禁止
- アプリ（Layer 3）はすべてのパッケージからインポート可能

## パッケージサマリー

### Layer 0: 基盤

| パッケージ | 説明 |
|------------|------|
| @soundblue/core | 純粋関数、型、検証ユーティリティ |
| @soundblue/config | Vite、Tailwind、Biome設定 |

### Layer 1: データ

| パッケージ | 説明 |
|------------|------|
| @soundblue/data | Zodスキーマとデータローダー |
| @soundblue/platform | IndexedDBストレージ（Dexie.js） |

### Layer 2: ドメイン

| パッケージ | 説明 |
|------------|------|
| @soundblue/i18n | URLベースi18nルーティング、Paraglide統合 |
| @soundblue/search | MiniSearchラッパーとReactフック |
| @soundblue/seo | メタタグ、サイトマップ、構造化データ |
| @soundblue/pwa | サービスワーカー、manifest生成 |

### Layer 3: UI & 機能

| パッケージ | 説明 |
|------------|------|
| @soundblue/features | 設定ストア、トースト、メディアクエリ |
| @soundblue/ui | Reactコンポーネント、アニメーション、UIプリミティブ |

## インストール

すべてのパッケージは内部ワークスペースパッケージです。pnpmワークスペースを使用してリンクされます：

```json
{
  "dependencies": {
    "@soundblue/core": "workspace:*",
    "@soundblue/ui": "workspace:*"
  }
}
```

## 環境タグ

各モジュールは実行環境がタグ付けされています：

| タグ | 説明 |
|------|------|
| `@environment build-only` | ビルド時のみ実行（Node.js） |
| `@environment client-only` | ブラウザでのみ実行 |
| `@environment universal` | ビルドとランタイムの両方で安全 |
