---
title: "@soundblue/core"
description: 純粋関数、型、検証ユーティリティ - Layer 0 基盤パッケージ
sidebar:
  order: 2
---

# @soundblue/core

**Layer 0 (基盤)** — 外部依存なしの純粋関数、型、検証ユーティリティ。

## 概要

coreパッケージは、他のすべてのパッケージで使用される基本ユーティリティを提供します。Reactへの依存がなく、どこでも使用できます。

| プロパティ | 値 |
|----------|-------|
| レイヤー | 0 (基盤) |
| 依存関係 | clsx, tailwind-merge |
| React必須 | いいえ |

## インストール

```json
{
  "dependencies": {
    "@soundblue/core": "workspace:*"
  }
}
```

## エクスポート

### `/validation`

ID検証、入力サニタイズ、定数。

```typescript
import {
  LIMITS,
  validateId,
  sanitizeInput,
  isValidLanguage
} from '@soundblue/core/validation';

// 定数
LIMITS.MAX_SEARCH_LENGTH  // 100
LIMITS.MAX_ID_LENGTH      // 200

// 検証
validateId('hello-world');     // true
validateId('');                // false
validateId('a'.repeat(201));   // false

// サニタイズ
sanitizeInput('<script>alert()</script>');  // 'scriptalert/script'

// 言語チェック
isValidLanguage('ko');  // true
isValidLanguage('fr');  // false (サポートは'en', 'ko'のみ)
```

### `/utils`

配列、オブジェクト、一般ユーティリティ関数。

```typescript
import {
  chunkArray,
  debounce,
  throttle,
  cn
} from '@soundblue/core/utils';

// 配列分割
chunkArray([1, 2, 3, 4, 5], 2);  // [[1, 2], [3, 4], [5]]

// デバウンス
const debouncedSearch = debounce((query) => {
  console.log('検索中:', query);
}, 300);

// スロットル
const throttledScroll = throttle(() => {
  console.log('スクロールイベント');
}, 100);

// クラス名マージ (clsx + tailwind-merge)
cn('px-4 py-2', 'px-6');  // 'py-2 px-6' (px-6が優先)
cn('text-red-500', condition && 'text-blue-500');
```

### `/types`

共有TypeScript型定義。

```typescript
import type {
  Language,
  Theme,
  LocaleConfig
} from '@soundblue/core/types';

// Language型
type Language = 'en' | 'ko';

// Theme型
type Theme = 'light' | 'dark' | 'system';

// ロケール設定
interface LocaleConfig {
  defaultLocale: Language;
  locales: Language[];
  pathPrefix: boolean;
}
```

## 使用例

### フォーム検証

```typescript
import { validateId, sanitizeInput, LIMITS } from '@soundblue/core/validation';

function validateSearchQuery(query: string): boolean {
  const sanitized = sanitizeInput(query);
  return sanitized.length > 0 && sanitized.length <= LIMITS.MAX_SEARCH_LENGTH;
}
```

### 条件付きクラス名

```typescript
import { cn } from '@soundblue/core/utils';

function Button({ variant, disabled }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-800',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      クリック
    </button>
  );
}
```

## ベストプラクティス

1. **共有ロジックに使用** - 複数パッケージで必要なユーティリティはここに配置
2. **純粋に保つ** - 副作用なし、ブラウザAPIなし、Reactなし
3. **境界で検証** - データ入力ポイントで検証関数を使用
