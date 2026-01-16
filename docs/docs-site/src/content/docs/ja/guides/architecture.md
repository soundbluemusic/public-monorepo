---
title: アーキテクチャ
description: モノレポのレンダリングモードとパッケージレイヤーシステムの理解
---

# アーキテクチャ概要

このドキュメントでは、SoundBlue Public Monorepoで使用されているアーキテクチャの決定とパターンについて説明します。

## レンダリングモード

各アプリケーションは用途に最適化されたレンダリングモードを使用しています：

| アプリ | モード | データソース | 説明 |
|--------|--------|-------------|------|
| **Context** | **SSR + D1** | Cloudflare D1 | 16,836エントリを動的に提供 |
| **Permissive** | SSR | In-memory | Web開発リソース |
| **Roots** | SSG | TypeScript | 920ページを事前レンダリング |

### SSR + D1アーキテクチャ (Context)

```
┌─────────────────────────────────────────────────────────────────┐
│  ランタイム (Cloudflare Pages Functions)                         │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │ クライアント│ → │  Pages   │ → │    D1     │                  │
│  │  リクエスト │    │ Function │    │ データベース│                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│       ↑                               │                         │
│       └───────────────────────────────┘                         │
│              SSR HTMLレスポンス                                   │
└─────────────────────────────────────────────────────────────────┘
```

### SSR設定パターン (Context)

```typescript
// react-router.config.ts
export default {
  ssr: true,  // ← SSRモード - D1クエリをランタイムで実行
  async prerender() {
    // 静的ページのみ (ホーム、概要、カテゴリ)
    return [...staticRoutes, ...categoryRoutes];
  },
} satisfies Config;
```

### SSGアーキテクチャ (Roots)

```
┌─────────────────────────────────────────────────────────────────┐
│  ビルド時                                                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ prerender() │ → │  loader()   │ → │  HTML + .data │         │
│  │ (ルートリスト)│    │ (データ取得) │    │  (静的ファイル)│         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ランタイム (CDN)                                                │
│  静的HTMLを即座に提供 — サーバー不要                              │
└─────────────────────────────────────────────────────────────────┘
```

### SSG設定パターン (Roots)

```typescript
// react-router.config.ts
export default {
  ssr: false,  // ← SSGモード (Rootsのみ) - すべてのページをビルド時に事前レンダリング
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const conceptRoutes = generateI18nRoutes(concepts, `/concept/`);
    return [...staticRoutes, ...conceptRoutes];
  },
} satisfies Config;
```

## パッケージレイヤーシステム

モノレポは厳格なレイヤーアーキテクチャに従います：

```
Layer 3 (アプリ + UI)
┌─────────────────────────────────────┐
│  apps/*  +  @soundblue/ui          │
│  @soundblue/features               │
└────────────────┬────────────────────┘
                 │
Layer 2 (ドメイン)
┌────────────────┴────────────────────┐
│  @soundblue/i18n   @soundblue/seo  │
│  @soundblue/search @soundblue/pwa  │
└────────────────┬────────────────────┘
                 │
Layer 1 (データ)
┌────────────────┴────────────────────┐
│  @soundblue/data  @soundblue/platform │
└────────────────┬────────────────────┘
                 │
Layer 0 (基盤)
┌────────────────┴────────────────────┐
│  @soundblue/core  @soundblue/config │
└─────────────────────────────────────┘
```

### レイヤールール

- **Layer NはLayer N-1以下のみインポート可能**
- アプリ（Layer 3）はすべてのパッケージからインポート可能
- `@soundblue/i18n`（Layer 2）は`@soundblue/ui`（Layer 3）からインポート不可
- `@soundblue/core`（Layer 0）は他のパッケージからインポート不可

## ディレクトリ構造

```
public-monorepo/
├── apps/                    # アプリケーション（Layer 3）
│   ├── context/            # 韓国語辞書
│   ├── permissive/         # Web開発リソース
│   └── roots/              # 数学ドキュメント
│
├── packages/               # 共有パッケージ（10個）
│   ├── core/              # Layer 0: 検証、ユーティリティ、型
│   ├── config/            # Layer 0: Vite、Tailwind設定
│   ├── data/              # Layer 1: Zodスキーマ、ローダー
│   ├── platform/          # Layer 1: IndexedDBストレージ
│   ├── i18n/              # Layer 2: URLルーティング、Paraglide
│   ├── search/            # Layer 2: MiniSearchラッパー
│   ├── seo/               # Layer 2: メタタグ、サイトマップ
│   ├── pwa/               # Layer 2: サービスワーカー
│   ├── features/          # Layer 3: 設定、トースト
│   └── ui/                # Layer 3: Reactコンポーネント
│
├── data/                   # JSONデータ（単一ソース）
│   ├── context/           # 辞書エントリ
│   └── roots/             # 数学コンテンツ
│
├── docs/                   # ドキュメント
│   └── docs-site/         # Starlightドキュメントサイト
│
└── tests/                  # E2Eテスト
```

## i18nルーティング

URLパスベースの言語検出（クエリパラメータではない）：

| URL | 言語 |
|-----|------|
| `/entry/hello` | 英語（デフォルト） |
| `/ko/entry/hello` | 韓国語 |

すべてのルートはビルド時に各言語で複製されます。

## 次のステップ

- [パッケージドキュメント](/public-monorepo/ja/packages/) - 各共有パッケージについて学ぶ
- [コントリビューションガイド](/public-monorepo/ja/contributing/) - このプロジェクトへの貢献方法
