---
title: "@soundblue/search"
description: MiniSearch wrapper with Web Worker support and React hooks - Layer 2 domain package
sidebar:
  order: 7
---

# @soundblue/search

**Layer 2 (Domain)** — Full-text search engine wrapper using MiniSearch with Web Worker support.

## Overview

This package provides a client-side search engine with fuzzy matching, prefix search, and Korean romanization support. It uses Web Workers for non-blocking search operations.

| Property | Value |
|----------|-------|
| Layer | 2 (Domain) |
| Dependencies | minisearch, @soundblue/core |
| React Required | Yes (for hooks) |

## Installation

```json
{
  "dependencies": {
    "@soundblue/search": "workspace:*"
  }
}
```

## Exports

### `/core`

Core search engine without React dependencies.

```typescript
import { SearchEngine, type SearchConfig } from '@soundblue/search/core';

// Create search engine
const config: SearchConfig = {
  fields: ['word', 'romanization', 'translations.en'],
  storeFields: ['id', 'word', 'category'],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
    boost: { word: 2, romanization: 1.5 },
  },
};

const engine = new SearchEngine(config);

// Index documents
await engine.addDocuments([
  { id: '1', word: '안녕', romanization: 'annyeong', translations: { en: 'hello' } },
  { id: '2', word: '감사', romanization: 'gamsa', translations: { en: 'thanks' } },
]);

// Search
const results = engine.search('hello');
// [{ id: '1', word: '안녕', score: 1.5, ... }]

// Search with Korean romanization
const results2 = engine.search('annyeong');
// [{ id: '1', word: '안녕', score: 1.2, ... }]
```

### `/react`

React hooks for search functionality.

```typescript
import { useSearch, useSearchWorker } from '@soundblue/search/react';

// Simple search hook
function SearchComponent() {
  const { query, setQuery, results, isLoading } = useSearch({
    data: entries,
    fields: ['word', 'translations.en'],
    debounce: 200,
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isLoading && <span>Searching...</span>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.word}</li>
        ))}
      </ul>
    </div>
  );
}

// Web Worker search (for large datasets)
function LargeSearchComponent() {
  const { query, setQuery, results, isReady } = useSearchWorker({
    workerUrl: '/search-worker.js',
    debounce: 150,
  });

  if (!isReady) return <span>Loading search index...</span>;

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

### `/worker`

Web Worker utilities for off-main-thread search.

```typescript
// search-worker.js
import { createSearchWorker } from '@soundblue/search/worker';

const worker = createSearchWorker({
  indexUrl: '/search-index.json',
  fields: ['word', 'romanization', 'translations.en'],
});

// Worker handles messages automatically
```

### `/adapters`

Data adapters for different search backends.

```typescript
import { MiniSearchAdapter, TrieAdapter } from '@soundblue/search/adapters';

// MiniSearch adapter (default)
const miniAdapter = new MiniSearchAdapter(config);

// Trie adapter (for prefix-only search, smaller memory)
const trieAdapter = new TrieAdapter();
```

## Search Configuration

```typescript
interface SearchConfig {
  // Fields to index for search
  fields: string[];

  // Fields to store in results (subset of document)
  storeFields?: string[];

  // Search options
  searchOptions?: {
    // Enable prefix matching ("hel" matches "hello")
    prefix?: boolean;

    // Fuzzy matching threshold (0-1, higher = more fuzzy)
    fuzzy?: number;

    // Field boost weights
    boost?: Record<string, number>;

    // Maximum results to return
    maxResults?: number;
  };
}
```

## React Hook Options

### `useSearch`

```typescript
interface UseSearchOptions<T> {
  // Data to search
  data: T[];

  // Fields to search
  fields: string[];

  // Debounce delay in ms (default: 200)
  debounce?: number;

  // Maximum results (default: 50)
  maxResults?: number;

  // Enable fuzzy matching (default: true)
  fuzzy?: boolean;

  // Filter function (run after search)
  filter?: (item: T) => boolean;
}
```

### `useSearchWorker`

```typescript
interface UseSearchWorkerOptions {
  // URL to search worker script
  workerUrl: string;

  // Debounce delay in ms (default: 150)
  debounce?: number;

  // Called when worker is ready
  onReady?: () => void;

  // Called on search error
  onError?: (error: Error) => void;
}
```

## Performance Tips

1. **Use Web Worker** for datasets > 10,000 items
2. **Debounce** search input to reduce re-renders
3. **Store minimal fields** in search results
4. **Pre-build index** at build time for faster initial load

## Pre-building Search Index

```typescript
// scripts/build-search-index.ts
import { SearchEngine } from '@soundblue/search/core';
import { writeFileSync } from 'fs';

const engine = new SearchEngine(config);
await engine.addDocuments(allEntries);

const index = engine.export();
writeFileSync('public/search-index.json', JSON.stringify(index));
```

Then load the pre-built index:

```typescript
const engine = new SearchEngine(config);
const index = await fetch('/search-index.json').then(r => r.json());
engine.import(index);
```
