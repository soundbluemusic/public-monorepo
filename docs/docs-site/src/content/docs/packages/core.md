---
title: "@soundblue/core"
description: Pure functions, types, and validation utilities - Layer 0 foundation package
sidebar:
  order: 2
---

# @soundblue/core

**Layer 0 (Foundation)** — Pure functions, types, and validation utilities with no external dependencies.

## Overview

The core package provides fundamental utilities used across all other packages. It has no React dependencies and can be used anywhere.

| Property | Value |
|----------|-------|
| Layer | 0 (Foundation) |
| Dependencies | clsx, tailwind-merge |
| React Required | No |

## Installation

```json
{
  "dependencies": {
    "@soundblue/core": "workspace:*"
  }
}
```

## Exports

### `/validation`

ID validation, input sanitization, and constants.

```typescript
import {
  LIMITS,
  validateId,
  sanitizeInput,
  isValidLanguage
} from '@soundblue/core/validation';

// Constants
LIMITS.MAX_SEARCH_LENGTH  // 100
LIMITS.MAX_ID_LENGTH      // 200

// Validation
validateId('hello-world');     // true
validateId('');                // false
validateId('a'.repeat(201));   // false

// Sanitization
sanitizeInput('<script>alert()</script>');  // 'scriptalert/script'

// Language check
isValidLanguage('ko');  // true
isValidLanguage('fr');  // false (only 'en', 'ko' supported)
```

### `/utils`

Array, object, and general utility functions.

```typescript
import {
  chunkArray,
  debounce,
  throttle,
  cn
} from '@soundblue/core/utils';

// Array chunking
chunkArray([1, 2, 3, 4, 5], 2);  // [[1, 2], [3, 4], [5]]

// Debounce
const debouncedSearch = debounce((query) => {
  console.log('Searching:', query);
}, 300);

// Throttle
const throttledScroll = throttle(() => {
  console.log('Scroll event');
}, 100);

// Class name merging (clsx + tailwind-merge)
cn('px-4 py-2', 'px-6');  // 'py-2 px-6' (px-6 wins)
cn('text-red-500', condition && 'text-blue-500');
```

### `/types`

Shared TypeScript type definitions.

```typescript
import type {
  Language,
  Theme,
  LocaleConfig
} from '@soundblue/core/types';

// Language type
type Language = 'en' | 'ko';

// Theme type
type Theme = 'light' | 'dark' | 'system';

// Locale configuration
interface LocaleConfig {
  defaultLocale: Language;
  locales: Language[];
  pathPrefix: boolean;
}
```

## Usage Examples

### Form Validation

```typescript
import { validateId, sanitizeInput, LIMITS } from '@soundblue/core/validation';

function validateSearchQuery(query: string): boolean {
  const sanitized = sanitizeInput(query);
  return sanitized.length > 0 && sanitized.length <= LIMITS.MAX_SEARCH_LENGTH;
}
```

### Conditional Class Names

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
      Click me
    </button>
  );
}
```

## Best Practices

1. **Use for shared logic** - Any utility needed by multiple packages should go here
2. **Keep it pure** - No side effects, no browser APIs, no React
3. **Validate at boundaries** - Use validation functions at data entry points
