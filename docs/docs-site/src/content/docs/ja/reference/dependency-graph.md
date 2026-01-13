---
title: 依存関係グラフ
description: モノレポのパッケージ依存関係の視覚的表現
---

このページはモノレポでパッケージとアプリがどのように依存しているかを視覚化します。

## パッケージ依存関係

```
apps/context ─────────┬─── @soundblue/ui
apps/roots ───────────┤    @soundblue/features
apps/permissive ──────┘    @soundblue/pwa
                           │
                           ▼
                      @soundblue/i18n
                      @soundblue/search
                      @soundblue/seo
                           │
                           ▼
                      @soundblue/data
                      @soundblue/platform
                           │
                           ▼
                      @soundblue/core
                      @soundblue/config
```

## 詳細依存関係

### Apps → Packages

| アプリ | 直接依存関係 |
|-----|---------------------|
| `apps/context` | ui, features, pwa, i18n, search, seo, data, core |
| `apps/roots` | ui, features, pwa, i18n, seo, data, core |
| `apps/permissive` | ui, features, i18n, seo, core |

### Layer 3 → Layer 2

| パッケージ | 依存関係 |
|---------|--------------|
| `@soundblue/ui` | i18n, seo, core |
| `@soundblue/features` | i18n, data, platform, core |

### Layer 2 → Layer 1

| パッケージ | 依存関係 |
|---------|--------------|
| `@soundblue/i18n` | data, core |
| `@soundblue/search` | data, core |
| `@soundblue/seo` | core |
| `@soundblue/pwa` | platform, core |

### Layer 1 → Layer 0

| パッケージ | 依存関係 |
|---------|--------------|
| `@soundblue/data` | core |
| `@soundblue/platform` | core |

### Layer 0（依存関係なし）

| パッケージ | 依存関係 |
|---------|--------------|
| `@soundblue/core` | なし（基盤） |
| `@soundblue/config` | なし（基盤） |

## 外部依存関係

### ビルドツール

```
Vite ────────────────────→ すべてのアプリ
Turborepo ───────────────→ モノレポオーケストレーション
TypeScript ──────────────→ すべてのパッケージ
Tailwind CSS v4 ─────────→ @soundblue/config, @soundblue/ui
```

### ランタイムライブラリ

```
React 19 ────────────────→ すべてのアプリ, @soundblue/ui
React Router v7 ─────────→ すべてのアプリ
Dexie.js ────────────────→ @soundblue/platform
MiniSearch ──────────────→ @soundblue/search
Zod ─────────────────────→ @soundblue/data
Paraglide ───────────────→ @soundblue/i18n
```

## 循環依存の防止

レイヤーシステムは循環依存を防止します：

```
✅ L3 → L2 → L1 → L0   （許可: 下方向のみ）
❌ L0 → L1             （禁止: 上方向）
❌ L2 → L2             （禁止: 同じレイヤー）
```

### 検出

カスタムスキルで確認：

```bash
/layer-check
```

次のような違反を報告します：

```
ERROR: @soundblue/core imports from @soundblue/platform
       L0 cannot import from L1
```

## 関連ドキュメント

- [レイヤーシステム](/public-monorepo/ja/ai-guidelines/layer-system/) — Importルール
- [アーキテクチャ](/public-monorepo/ja/guides/architecture/) — 全体アーキテクチャ概要
- [パッケージ概要](/public-monorepo/ja/packages/) — パッケージドキュメント
