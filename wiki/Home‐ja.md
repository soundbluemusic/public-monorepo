🌐 [English](Home) | [한국어](Home‐ko) | 日本語

## 🎵 Public Monorepo - ディープリンク

ソースコードとライブサイトへのクイックナビゲーション。

## 🚀 アプリ

| アプリ | 説明 | コード | ライブサイト |
|--------|------|--------|--------------|
| Context | 韓国語辞書 (SSR + D1) | [/apps/context/](https://github.com/soundbluemusic/public-monorepo/tree/main/apps/context) | [context.soundbluemusic.com](https://context.soundbluemusic.com) |
| Permissive | Web開発リソース (SSR) | [/apps/permissive/](https://github.com/soundbluemusic/public-monorepo/tree/main/apps/permissive) | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |
| Roots | 数学ドキュメント (SSR) | [/apps/roots/](https://github.com/soundbluemusic/public-monorepo/tree/main/apps/roots) | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |
| Docs | ドキュメントサイト | [/apps/docs/](https://github.com/soundbluemusic/public-monorepo/tree/main/apps/docs) | [soundbluemusic.github.io/public-monorepo](https://soundbluemusic.github.io/public-monorepo) |

## 🔗 クイックリンク

**Context** — [ブラウズ](https://context.soundbluemusic.com) · [会話](https://context.soundbluemusic.com/conversations) · [学習記録](https://context.soundbluemusic.com/my-learning) · [ダウンロード](https://context.soundbluemusic.com/download)

**Roots** — [ブラウズ](https://roots.soundbluemusic.com/browse) · [定数](https://roots.soundbluemusic.com/constants) · [お気に入り](https://roots.soundbluemusic.com/favorites) · [検索](https://roots.soundbluemusic.com/search)

**Permissive** — [ライブラリ](https://permissive.soundbluemusic.com/libraries) · [Web API](https://permissive.soundbluemusic.com/web-api)

## 📦 パッケージ

| レイヤー | パッケージ | 用途 | コード |
|----------|------------|------|--------|
| L0 | core | 検証、ユーティリティ、型 | [/packages/core/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/core) |
| L0 | config | Vite、Tailwind設定 | [/packages/config/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/config) |
| L1 | data | Zodスキーマ、ローダー | [/packages/data/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/data) |
| L1 | platform | IndexedDBストレージ | [/packages/platform/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/platform) |
| L2 | i18n | URLルーティング、Paraglide | [/packages/i18n/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/i18n) |
| L2 | search | MiniSearchラッパー | [/packages/search/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/search) |
| L2 | seo | メタタグ、サイトマップ | [/packages/seo/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/seo) |
| L2 | pwa | サービスワーカー | [/packages/pwa/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/pwa) |
| L3 | features | 設定、トースト、メディア | [/packages/features/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/features) |
| L3 | ui | Reactコンポーネント | [/packages/ui/](https://github.com/soundbluemusic/public-monorepo/tree/main/packages/ui) |

## ⚙️ 設定ファイル

| ファイル | 用途 |
|----------|------|
| [turbo.json](https://github.com/soundbluemusic/public-monorepo/blob/main/turbo.json) | Turborepo設定 |
| [biome.json](https://github.com/soundbluemusic/public-monorepo/blob/main/biome.json) | リンター＆フォーマッター |
| [tsconfig.json](https://github.com/soundbluemusic/public-monorepo/blob/main/tsconfig.json) | TypeScript |
| [playwright.config.ts](https://github.com/soundbluemusic/public-monorepo/blob/main/playwright.config.ts) | E2Eテスト |
| [vitest.config.ts](https://github.com/soundbluemusic/public-monorepo/blob/main/vitest.config.ts) | ユニットテスト |

## 🔧 CI/CD & 自動化

| パス | 用途 |
|------|------|
| [.github/workflows/](https://github.com/soundbluemusic/public-monorepo/tree/main/.github/workflows) | GitHub Actions |
| [.husky/](https://github.com/soundbluemusic/public-monorepo/tree/main/.husky) | Gitフック |
| [scripts/](https://github.com/soundbluemusic/public-monorepo/tree/main/scripts) | ビルドスクリプト |

## 📚 ドキュメント

| ドキュメント | 用途 | コード | ライブ |
|--------------|------|--------|--------|
| GitHub Pages | 技術ドキュメント | [/docs/](https://github.com/soundbluemusic/public-monorepo/tree/main/docs) | [soundbluemusic.github.io/public-monorepo](https://soundbluemusic.github.io/public-monorepo) |
| ARCHITECTURE.md | アーキテクチャガイド | [表示](https://github.com/soundbluemusic/public-monorepo/blob/main/ARCHITECTURE.md) | |
| CONTRIBUTING.md | コントリビューションガイド | [表示](https://github.com/soundbluemusic/public-monorepo/blob/main/CONTRIBUTING.md) | |

## 📊 データ & テスト

| パス | 用途 |
|------|------|
| [data/](https://github.com/soundbluemusic/public-monorepo/tree/main/data) | データファイル |
| [tests/](https://github.com/soundbluemusic/public-monorepo/tree/main/tests) | E2Eテスト |

## 🌐 その他のプロジェクト

| プロジェクト | 説明 | ライブサイト |
|--------------|------|--------------|
| Tools | 開発者ツール | [tools.soundbluemusic.com](https://tools.soundbluemusic.com) |
| Dialogue | 会話アプリ | [dialogue.soundbluemusic.com](https://dialogue.soundbluemusic.com) |