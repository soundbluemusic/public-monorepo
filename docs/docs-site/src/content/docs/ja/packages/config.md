---
title: "@soundblue/config"
description: 共有Vite、Tailwind、TypeScript設定 - Layer 0 基盤パッケージ
sidebar:
  order: 3
---

# @soundblue/config

**Layer 0 (基盤)** — すべてのアプリで共有されるビルドツール設定。

## 概要

このパッケージは、Vite、Tailwind CSS、TypeScriptの共有設定を提供します。各アプリで重複を避け、一貫した設定を維持します。

| プロパティ | 値 |
|----------|-------|
| レイヤー | 0 (基盤) |
| 依存関係 | vite, tailwindcss |
| React必須 | いいえ |
| 環境 | ビルドのみ |

## インストール

```json
{
  "devDependencies": {
    "@soundblue/config": "workspace:*"
  }
}
```

## エクスポート

### `/vite`

Vite設定ファクトリー。

```typescript
// vite.config.ts
import { createViteConfig } from '@soundblue/config/vite';

export default createViteConfig({
  appName: 'context',
  port: 3003,
  // オプション
  pwa: {
    name: 'Context Dictionary',
    shortName: 'Context',
    themeColor: '#3b82f6',
  },
});
```

#### Vite設定オプション

```typescript
interface ViteConfigOptions {
  appName: string;       // アプリ識別子
  port: number;          // 開発サーバーポート
  pwa?: {
    name: string;        // PWA名
    shortName: string;   // PWA短縮名
    themeColor: string;  // テーマカラー
    description?: string;
  };
}
```

### `/tailwind`

Tailwind CSS v4プリセット。

```css
/* app/app.css */
@import "tailwindcss";
@import "@soundblue/config/tailwind";
```

#### 含まれる内容

- **カスタムカラー**: 明暗モード用のセマンティックカラー
- **タイポグラフィ**: 一貫したフォントスケール
- **スペーシング**: 拡張スペーシングスケール
- **アニメーション**: 共通のトランジション
- **ダークモード**: `prefers-color-scheme`のサポート

### `/typescript`

TypeScript設定のベース。

```json
// tsconfig.json
{
  "extends": "@soundblue/config/typescript/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"]
    }
  },
  "include": ["app/**/*"]
}
```

#### TypeScript基本設定

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true
  }
}
```

## 共通Viteプラグイン

`createViteConfig`に含まれるプラグイン：

| プラグイン | 目的 |
|---------|---------|
| `@vitejs/plugin-react` | React高速リフレッシュ |
| `vite-plugin-svgr` | SVGをReactコンポーネントとしてインポート |
| `vite-tsconfig-paths` | TypeScriptパス解決 |

## アプリでの使用例

```typescript
// apps/context/vite.config.ts
import { createViteConfig } from '@soundblue/config/vite';

export default createViteConfig({
  appName: 'context',
  port: 3003,
  pwa: {
    name: 'Context - 韓国語辞書',
    shortName: 'Context',
    themeColor: '#3b82f6',
  },
});
```

```css
/* apps/context/app/app.css */
@import "tailwindcss";
@import "@soundblue/config/tailwind";
@import "@soundblue/ui/styles/base.css";

/* アプリ固有のスタイル */
.entry-card {
  /* Tailwindユーティリティを使用 */
}
```

## ベストプラクティス

1. **アプリ間で一貫した設定を維持**
2. **アプリ固有の設定のみ各アプリに追加**
3. **共通の変更はこのパッケージを更新**
