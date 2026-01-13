---
title: Code Style Guide
description: Coding conventions and style guidelines for the monorepo
sidebar:
  order: 2
---

# Code Style Guide

This project uses **Biome** for linting and formatting. All code must pass lint checks before merging.

## Quick Commands

```bash
pnpm lint      # Check for issues
pnpm format    # Auto-fix formatting
pnpm typecheck # TypeScript validation
```

## General Principles

### 1. TypeScript Strict Mode

All code must be strictly typed. Avoid `any` unless absolutely necessary.

```typescript
// ✅ Good
function getEntry(id: string): Entry | undefined {
  return entries.find(e => e.id === id);
}

// ❌ Bad
function getEntry(id: any): any {
  return entries.find(e => e.id === id);
}
```

### 2. Functional Style

Prefer functional programming patterns.

```typescript
// ✅ Good
const filtered = entries.filter(e => e.category === 'greetings');
const mapped = entries.map(e => e.word);

// ❌ Bad
const filtered = [];
for (const e of entries) {
  if (e.category === 'greetings') {
    filtered.push(e);
  }
}
```

### 3. Immutability

Don't mutate data directly. Create new objects/arrays instead.

```typescript
// ✅ Good
const updated = { ...entry, word: 'new word' };
const newList = [...entries, newEntry];

// ❌ Bad
entry.word = 'new word';
entries.push(newEntry);
```

## Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `SearchBar.tsx` |
| Hooks | camelCase with `use` prefix | `useSearch.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types | camelCase or PascalCase | `types.ts`, `Entry.ts` |
| Constants | SCREAMING_SNAKE_CASE | `constants.ts` |

### Variables & Functions

```typescript
// Variables: camelCase
const searchQuery = 'hello';
const isLoading = false;

// Functions: camelCase, verb prefix
function getEntry(id: string) {}
function handleClick() {}
function formatDate(date: Date) {}

// Components: PascalCase
function SearchBar() {}
function EntryCard({ entry }: Props) {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_RESULTS = 50;
const API_BASE_URL = 'https://api.example.com';
```

### Types & Interfaces

```typescript
// Types: PascalCase
type Language = 'en' | 'ko';
type Theme = 'light' | 'dark' | 'system';

// Interfaces: PascalCase
interface Entry {
  id: string;
  word: string;
  translations: Translations;
}

// Props: ComponentName + Props
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}
```

## React Components

### Function Components

Use function declarations for components:

```typescript
// ✅ Preferred
function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  return <input placeholder={placeholder} />;
}

// ✅ Also acceptable
const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  return <input placeholder={placeholder} />;
};
```

### Props Destructuring

Destructure props in the function signature:

```typescript
// ✅ Good
function EntryCard({ entry, onFavorite }: EntryCardProps) {
  return <div>{entry.word}</div>;
}

// ❌ Bad
function EntryCard(props: EntryCardProps) {
  return <div>{props.entry.word}</div>;
}
```

### Event Handlers

Prefix with `handle`:

```typescript
function SearchBar() {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // ...
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // ...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
    </form>
  );
}
```

## Imports

### Order

1. External libraries
2. Internal packages (`@soundblue/*`)
3. Relative imports

```typescript
// 1. External
import { useState, useEffect } from 'react';
import { Link } from 'react-router';

// 2. Internal packages
import { cn } from '@soundblue/core/utils';
import { useSearch } from '@soundblue/search/react';

// 3. Relative
import { EntryCard } from './EntryCard';
import type { Entry } from '../types';
```

### Type Imports

Use `import type` for type-only imports:

```typescript
import type { Entry, Category } from '@soundblue/data/schemas';
import { EntrySchema } from '@soundblue/data/schemas';
```

## CSS & Styling

### Tailwind CSS v4

Use Tailwind utility classes:

```tsx
// ✅ Good
<div className="flex items-center gap-4 p-4 bg-(--bg-secondary)">

// ❌ Bad - inline styles
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
```

### Class Name Merging

Use `cn()` for conditional classes:

```typescript
import { cn } from '@soundblue/core/utils';

<button
  className={cn(
    'px-4 py-2 rounded-lg font-medium',
    variant === 'primary' && 'bg-blue-500 text-white',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
```

### CSS Variables

Use design tokens:

```tsx
// ✅ Good - uses design tokens
<div className="bg-(--bg-primary) text-(--text-primary)">

// ❌ Bad - hardcoded colors
<div className="bg-white text-gray-900">
```

## Comments

### When to Comment

- Complex algorithms
- Non-obvious workarounds
- TODO items (with issue links)

```typescript
// ✅ Good - explains non-obvious code
// React Router v7 SSG bug workaround - see #12893
setTimeout(() => removeOrphanDom(), 100);

// ❌ Bad - states the obvious
// Get the entry by ID
const entry = getEntry(id);
```

### JSDoc for Public APIs

```typescript
/**
 * Validates an entry ID.
 * @param id - The ID to validate
 * @returns True if the ID is valid
 * @example
 * validateId('hello-world'); // true
 * validateId('');            // false
 */
export function validateId(id: string): boolean {
  return id.length > 0 && id.length <= 200;
}
```

## Biome Configuration

The project uses a shared Biome config:

```json
// biome.json
{
  "extends": ["@soundblue/config/biome"]
}
```

Key rules:
- 2 space indentation
- No semicolons (optional based on config)
- Single quotes for strings
- Trailing commas in multiline
- Max line length: 100
