---
title: "@soundblue/data"
description: Zod schemas and data loaders for type-safe data handling - Layer 1 data package
sidebar:
  order: 4
---

# @soundblue/data

**Layer 1 (Data)** — Zod schemas and data loaders for type-safe JSON data handling.

## Overview

This package defines schemas for all data types used in the applications and provides loaders for reading JSON files at build time.

| Property | Value |
|----------|-------|
| Layer | 1 (Data) |
| Dependencies | zod |
| React Required | No |

## Installation

```json
{
  "dependencies": {
    "@soundblue/data": "workspace:*"
  }
}
```

## Exports

### `/schemas`

Zod schemas for data validation.

```typescript
import { EntrySchema, CategorySchema } from '@soundblue/data/schemas';
import { ConceptSchema, FieldSchema } from '@soundblue/data/schemas/roots';
import { LibrarySchema, WebApiSchema } from '@soundblue/data/schemas/permissive';
```

### `/schemas/context`

Schemas for Context (Korean Dictionary) app.

```typescript
import {
  EntrySchema,
  CategorySchema,
  ConversationSchema,
  type Entry,
  type Category,
  type Conversation
} from '@soundblue/data/schemas/context';

// Entry schema (dictionary entry)
const entry = EntrySchema.parse({
  id: 'hello',
  word: '안녕',
  romanization: 'annyeong',
  translations: {
    en: 'hello',
    explanation: 'A common greeting'
  },
  category: 'greetings',
  difficulty: 'beginner'
});

// TypeScript type inference
type Entry = z.infer<typeof EntrySchema>;
```

### `/schemas/roots`

Schemas for Roots (Math) app.

```typescript
import {
  ConceptSchema,
  FieldSchema,
  type Concept,
  type Field
} from '@soundblue/data/schemas/roots';

// Mathematical concept
const concept = ConceptSchema.parse({
  id: 'quadratic-formula',
  title: 'Quadratic Formula',
  field: 'algebra',
  prerequisites: ['polynomials'],
  formula: 'x = (-b ± √(b²-4ac)) / 2a'
});
```

### `/schemas/permissive`

Schemas for Permissive (Web Dev Resources) app.

```typescript
import {
  LibrarySchema,
  WebApiSchema,
  type Library,
  type WebApi
} from '@soundblue/data/schemas/permissive';

// Library entry
const library = LibrarySchema.parse({
  name: 'React',
  license: 'MIT',
  category: 'framework',
  url: 'https://react.dev'
});
```

### `/loaders`

Data loading utilities for build time.

```typescript
import {
  loadJson,
  loadJsonDirectory,
  createDataLoader
} from '@soundblue/data/loaders';

// Load single JSON file
const config = await loadJson<Config>('data/config.json');

// Load all JSON files in directory
const entries = await loadJsonDirectory<Entry>('data/context/entries');

// Create typed loader with schema validation
const loadEntries = createDataLoader(EntrySchema, 'data/context/entries');
const validatedEntries = await loadEntries();
```

## Schema Examples

### Entry Schema (Context)

```typescript
const EntrySchema = z.object({
  id: z.string().min(1).max(200),
  word: z.string().min(1),
  romanization: z.string().optional(),
  translations: z.object({
    en: z.string(),
    explanation: z.string().optional(),
  }),
  category: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'master']),
  examples: z.array(z.object({
    korean: z.string(),
    english: z.string(),
  })).optional(),
  relatedWords: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});
```

### Concept Schema (Roots)

```typescript
const ConceptSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  titleKo: z.string().optional(),
  field: z.string(),
  prerequisites: z.array(z.string()).default([]),
  formula: z.string().optional(),
  description: z.string().optional(),
  examples: z.array(z.string()).optional(),
});
```

## Usage in SSR

Data is loaded at build time in `prerender()` and at runtime in `loader()` functions:

```typescript
// react-router.config.ts
import { loadJsonDirectory } from '@soundblue/data/loaders';
import { EntrySchema } from '@soundblue/data/schemas/context';

export default {
  ssr: true,  // All apps use SSR mode
  async prerender() {
    const entries = await loadJsonDirectory('data/context/entries');
    return entries.map(e => `/entry/${e.id}`);
  },
} satisfies Config;

// routes/entry.$entryId.tsx
export async function loader({ params }) {
  const entry = await loadEntry(params.entryId);
  return { entry: EntrySchema.parse(entry) };
}
```

## Best Practices

1. **Always validate** - Use Zod schemas to validate data at load time
2. **Single source of truth** - All data lives in the `data/` directory
3. **Type inference** - Use `z.infer<typeof Schema>` for TypeScript types
