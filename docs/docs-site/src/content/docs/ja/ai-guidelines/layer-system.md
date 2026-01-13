---
title: レイヤーシステム
description: パッケージimportレイヤールールと依存関係管理
---

モノレポは依存関係管理と循環import防止のために4層システムを使用しています。

## レイヤーダイアグラム

```
Layer 3 (Apps + UI)     ┌─────────────────────────────────────────────┐
                        │  apps/context, apps/roots, apps/permissive  │
                        │  @soundblue/ui, @soundblue/features         │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 2 (Domain)        ┌─────────────────────────────────────────────┐
                        │  @soundblue/i18n     @soundblue/search      │
                        │  @soundblue/seo      @soundblue/pwa         │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 1 (Data)          ┌─────────────────────────────────────────────┐
                        │  @soundblue/data     @soundblue/platform    │
                        └─────────────────────────────────────────────┘
                                            │
                                            ▼
Layer 0 (Foundation)    ┌─────────────────────────────────────────────┐
                        │  @soundblue/core     @soundblue/config      │
                        └─────────────────────────────────────────────┘
```

## Importルール

```
L3 (apps, ui, features) → L2 (i18n, search, seo, pwa) → L1 (data, platform) → L0 (core, config)
```

### ルール1: 下位レイヤーのみImport

Layer NはLayer N-1以下からのみimport可能です。

```typescript
// ✅ 正しい
// L3コンポーネントから
import { validateId } from '@soundblue/core/validation';  // L0
import { storage } from '@soundblue/platform/storage';    // L1
import { useSearch } from '@soundblue/search/react';      // L2

// ❌ 禁止
// L0 (core)から
import { storage } from '@soundblue/platform';  // L0 → L1 禁止！

// L2 (i18n)から
import { Button } from '@soundblue/ui';  // L2 → L3 禁止！
```

### ルール2: 循環依存禁止

同じレイヤーのパッケージは互いにimportできません。

```typescript
// ❌ 禁止 - 両方ともL2
// @soundblue/i18nで
import { SearchEngine } from '@soundblue/search';

// @soundblue/searchで
import { getLocale } from '@soundblue/i18n';
```

### ルール3: アプリ専用コードはアプリに維持

特定のアプリのみに関係するコードは共有パッケージにあるべきではありません。

```typescript
// ❌ 禁止
// packages/ui/components/ContextEntryCard.tsx
// Contextアプリ専用コンポーネント！

// ✅ 正しい
// apps/context/app/components/EntryCard.tsx
// アプリ専用コンポーネントはアプリに維持
```

## レイヤー別パッケージ詳細

### Layer 0: Foundation

| パッケージ | 説明 | Export |
|---------|-------------|---------|
| `@soundblue/core` | 純粋関数、型、検証 | `/validation`, `/utils`, `/types` |
| `@soundblue/config` | Vite、Tailwind、TS設定 | `/vite`, `/tailwind` |

**L0ではブラウザAPI使用禁止。**

### Layer 1: Data

| パッケージ | 説明 | Export |
|---------|-------------|---------|
| `@soundblue/data` | Zodスキーマ、データローダー | `/schemas`, `/loaders` |
| `@soundblue/platform` | IndexedDBストレージ (Dexie) | `/storage` |

### Layer 2: Domain

| パッケージ | 説明 | Export |
|---------|-------------|---------|
| `@soundblue/i18n` | 多言語ルーティング、Paraglide | `/`, `/react` |
| `@soundblue/search` | MiniSearchラッパー | `/`, `/react`, `/worker` |
| `@soundblue/seo` | メタタグ、サイトマップ | `/meta`, `/sitemap` |
| `@soundblue/pwa` | サービスワーカー、オフライン | `/react`, `/manifest` |

### Layer 3: UI & Features

| パッケージ | 説明 | Export |
|---------|-------------|---------|
| `@soundblue/features` | 設定、トースト、メディアフック | `/settings`, `/toast`, `/media` |
| `@soundblue/ui` | Reactコンポーネント | `/components`, `/patterns`, `/feedback`, `/primitives` |

## レイヤー違反チェック

カスタムスキルで違反チェック：

```bash
/layer-check
```

コードベースをスキャンし、レイヤールールに違反するimportを報告します。

## 関連ドキュメント

- [AIガイドライン概要](/public-monorepo/ja/ai-guidelines/) — クイックリファレンス
- [ルール](/public-monorepo/ja/ai-guidelines/rules/) — 禁止/必須アクション
- [アーキテクチャ](/public-monorepo/ja/guides/architecture/) — 全体アーキテクチャ概要
