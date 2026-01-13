---
title: アーキテクチャ
description: モノレポのSSGアーキテクチャとパッケージレイヤーシステムの理解
---

# アーキテクチャ概要

このドキュメントでは、SoundBlue Public Monorepoで使用されているアーキテクチャの決定とパターンについて説明します。

## SSGアーキテクチャ

すべてのアプリケーションは、React Router v7の`prerender()`パターンを使用した**静的サイト生成（SSG）**を採用しています。

### 動作の仕組み

```
┌─────────────────────────────────────────────────────────────────┐
│                        ビルド時                                 │
│                                                                 │
│   prerender()  →  loader()  →  HTMLファイル  →  CDN            │
│                                                                 │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│   │ ルート   │ → │ データ   │ → │ HTML     │ → │ 静的     │   │
│   │ 生成     │   │ 取得     │   │ レンダリング│  │ デプロイ  │   │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                              ↓

┌─────────────────────────────────────────────────────────────────┐
│                       ランタイム（CDN）                         │
│                                                                 │
│   静的HTML  →  Hydration  →  インタラクティブReactアプリ       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SSG設定パターン

```typescript
// react-router.config.ts
export default {
  ssr: false,  // ← SSGモード（絶対にtrueに変更禁止）
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const dynamicRoutes = generateI18nRoutes(entries, `/entry/`);
    return [...staticRoutes, ...dynamicRoutes];
  },
} satisfies Config;
```

### 生成されるページ数

| アプリ | SSGページ | 説明 |
|--------|-----------|------|
| Context | 33,748 | 全辞書エントリ × 2言語 |
| Permissive | 8 | ライブラリ + Web APIページ |
| Roots | 920 | 数学トピック × 2言語 |

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
