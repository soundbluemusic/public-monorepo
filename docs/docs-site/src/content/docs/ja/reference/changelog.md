---
title: 変更履歴
description: バージョン履歴と主要な変更
---

## v2.1.0 (2026-01-02)

### 追加
- SSG Hydration Workaroundドキュメント化
- React Router v7 + React 19 hydrationバグ修正
- `entry.client.tsx` orphan DOMクリーンアップロジック

### ドキュメント
- Hydration Workaroundガイド追加
- 保護されたファイル関連のアーキテクチャドキュメント更新

---

## v2.0.0 (2025-12-31)

### Breaking Changes
- `@soundblue/shared`パッケージ削除
- `@soundblue/shared-react`パッケージ削除
- 新しいレイヤーシステム（L0-L3）がフラット構造を置換

### 追加
- `@soundblue/config` — Vite、Tailwind設定
- `@soundblue/platform` — IndexedDBストレージ
- `@soundblue/seo` — メタタグ、サイトマップ
- `@soundblue/pwa` — サービスワーカー、オフライン
- `@soundblue/features` — 設定、トースト、メディア
- `@soundblue/ui` — Reactコンポーネント

### 変更
- パッケージ数: 6 → 10（モジュール化）
- 4層依存関係システム導入
- レイヤー間の厳格なimportルール

### マイグレーションガイド

```typescript
// 以前 (v1.x)
import { cn, validateId } from '@soundblue/shared';
import { useToast, Button } from '@soundblue/shared-react';

// 以後 (v2.x)
import { validateId } from '@soundblue/core/validation';
import { cn } from '@soundblue/core/utils';
import { useToast } from '@soundblue/features/toast';
import { Button } from '@soundblue/ui/components';
```

---

## v1.0.0（初期リリース）

### 機能
- 3つのアプリ: Context、Permissive、Roots
- 6つのパッケージ: core、data、search、i18n、shared、shared-react
- SSGアーキテクチャ（後にContextはSSR + D1に移行）
- 多言語サポート（en、ko）

### パッケージ（v1.0）
| パッケージ | 説明 |
|---------|-------------|
| `@soundblue/core` | 純粋関数、型 |
| `@soundblue/data` | Zodスキーマ、ローダー |
| `@soundblue/search` | MiniSearchラッパー |
| `@soundblue/i18n` | 多言語ルーティング |
| `@soundblue/shared` | 共有ユーティリティ |
| `@soundblue/shared-react` | Reactコンポーネント |

---

## アップグレードガイド

### v1.x → v2.x

1. **importを更新** — 上記のマイグレーションガイドに従う
2. **レイヤールールを確認** — `/layer-check`を実行
3. **全体を再ビルド** — `pnpm build`
4. **hydrationをテスト** — ビルド後にボタンが動作するか確認

### 注意すべき主要な変更

| v1.x | v2.x | 備考 |
|------|------|-------|
| `shared/` | `core/`、`ui/` | 目的別に分離 |
| `shared-react/` | `ui/`、`features/` | 目的別に分離 |
| フラット構造 | レイヤーシステム | L0-L3ルール |
| — | `entry.client.tsx` | Hydration修正必須 |

## 関連ドキュメント

- [SSG詳細解説](/public-monorepo/ja/guides/ssg-deep-dive/) — SSGアーキテクチャ
- [レイヤーシステム](/public-monorepo/ja/ai-guidelines/layer-system/) — Importルール
- [Hydrationバグ対応](/public-monorepo/ja/guides/hydration-workaround/) — v2.1修正
