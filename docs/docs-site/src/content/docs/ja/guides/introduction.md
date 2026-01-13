---
title: はじめに
description: SoundBlue Public Monorepoの概要 - 学習者のための3つのアプリ
---

# はじめに

**SoundBlue Public Monorepo**のドキュメントへようこそ。このモノレポには、最新のWeb技術で構築された3つの教育用アプリケーションが含まれています。

## これは何ですか？

すべてのアプリは**100%静的サイト生成（SSG）**方式です。サーバー不要でCDNから直接配信されます。

:::caution[SSGモードのみ]
⛔ **SSGモードの変更は絶対禁止** - SPA、SSR、ISRなど他のレンダリングモードへの切り替えはしないでください。
:::

## 3つのアプリ

### 📖 Context — 韓国語辞書

**学習者のための韓国語辞書** | 33,748 SSGページ

韓国語学習者のための文脈ベースの辞書です。単語の意味、例文、関連表現を提供します。

| 特徴 | 説明 |
|------|------|
| ページ | 33,748 SSGページ |
| 言語 | 韓国語、英語 |
| URL | [context.soundbluemusic.com](https://context.soundbluemusic.com) |

### 🔧 Permissive — Web開発リソース

**無料Web開発リソース** | 8 SSGページ

許容的ライセンス（MIT、Apacheなど）を持つWeb開発ライブラリとWeb APIドキュメントのコレクションです。

| 特徴 | 説明 |
|------|------|
| ページ | 8 SSGページ |
| 言語 | 韓国語、英語 |
| URL | [permissive.soundbluemusic.com](https://permissive.soundbluemusic.com) |

### 📐 Roots — 数学ドキュメント

**学習者のための数学ドキュメント** | 920 SSGページ

代数、幾何学、微積分など、様々な数学分野を体系的にまとめた学習ドキュメントです。

| 特徴 | 説明 |
|------|------|
| ページ | 920 SSGページ |
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

1. **SSGのみ** - すべてのページはビルド時に事前レンダリングされます
2. **ハードコーディング禁止** - インライン値ではなくデータファイルを使用
3. **一時的な修正禁止** - すべての修正は一般的な解決策でなければなりません
4. **データ整合性** - すべてのデータに対する単一の真実の情報源
5. **UI検証必須** - すべての変更は実際のUIで確認する必要があります

## 次のステップ

- [クイックスタートガイド](/public-monorepo/ja/guides/quickstart/) - ローカルでプロジェクトを実行
- [アーキテクチャ概要](/public-monorepo/ja/guides/architecture/) - SSGアーキテクチャを理解する
- [Contextドキュメント](/public-monorepo/ja/apps/context/overview/) - 韓国語辞書アプリについて
