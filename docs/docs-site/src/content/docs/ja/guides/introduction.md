---
title: はじめに
description: SoundBlue Public Monorepoの概要 - 学習者のための3つのアプリ
---

# はじめに

**SoundBlue Public Monorepo**のドキュメントへようこそ。このモノレポには、最新のWeb技術で構築された3つの教育用アプリケーションが含まれています。

## これは何ですか？

各アプリはコンテンツタイプに**最適化されたレンダリングモード**を使用しています。すべてのモードはSEOのための完全なHTMLを提供します。

:::caution[SPAモード禁止]
⛔ **SPAモードは絶対禁止** - SPAは空のHTMLを返すためSEOが不可能です。常にSSRまたはSSGを使用してください。
:::

## 3つのアプリ

### 📖 Context — 韓国語辞書

**学習者のための韓国語辞書** | SSR + Cloudflare D1

韓国語学習者のための文脈ベースの辞書です。単語の意味、例文、関連表現を提供します。

| 特徴 | 説明 |
|------|------|
| モード | SSR + D1（動的） |
| エントリ | 16,836 |
| 言語 | 韓国語、英語 |
| URL | [context.soundbluemusic.com](https://context.soundbluemusic.com) |

### 🔧 Permissive — Web開発リソース

**無料Web開発リソース** | SSR

許容的ライセンス（MIT、Apacheなど）を持つWeb開発ライブラリとWeb APIドキュメントのコレクションです。

| 特徴 | 説明 |
|------|------|
| モード | SSR |
| 言語 | 韓国語、英語 |
| URL | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |

### 📐 Roots — 数学ドキュメント

**学習者のための数学ドキュメント** | 920 SSGページ

代数、幾何学、微積分など、様々な数学分野を体系的にまとめた学習ドキュメントです。

| 特徴 | 説明 |
|------|------|
| モード | SSG（920ページ） |
| 言語 | 韓国語、英語 |
| URL | [roots.soundbluemusic.com](https://roots.soundbluemusic.com) |

## 技術スタック概要

### コア技術

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 19 | UIライブラリ |
| React Router | 7 | ルーティング + SSG |
| TypeScript | 5.8 | 型安全性 |
| Tailwind CSS | 4 | スタイリング |

### ビルド＆デプロイ

| ツール | 用途 |
|--------|------|
| Turborepo | モノレポ管理 |
| pnpm | パッケージマネージャー |
| Cloudflare Pages | デプロイ |
| GitHub Actions | CI/CD |

## 主要原則

1. **SPAモード禁止** - すべてのページはSEOのための完全なHTMLが必要です
2. **適切なレンダリングモードを使用** - 大規模/動的コンテンツにはSSR、静的コンテンツにはSSG
3. **ハードコーディング禁止** - インライン値ではなくデータファイルを使用
4. **一時的な修正禁止** - すべての修正は一般的な解決策でなければなりません
5. **データ整合性** - すべてのデータに対する単一の真実の情報源
6. **UI検証必須** - すべての変更は実際のUIで確認する必要があります

## 次のステップ

- [クイックスタートガイド](/public-monorepo/ja/guides/quickstart/) - ローカルでプロジェクトを実行
- [アーキテクチャ概要](/public-monorepo/ja/guides/architecture/) - レンダリングモードとアーキテクチャを理解する
- [Contextドキュメント](/public-monorepo/ja/apps/context/overview/) - 韓国語辞書アプリについて
