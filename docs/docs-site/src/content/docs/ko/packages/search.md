---
title: "@soundblue/search"
description: Web Worker 지원과 React 훅이 포함된 MiniSearch 래퍼 - Layer 2 도메인 패키지
sidebar:
  order: 7
---

# @soundblue/search

**Layer 2 (도메인)** — Web Worker 지원이 포함된 MiniSearch 기반 전문 검색 엔진 래퍼.

## 개요

이 패키지는 퍼지 매칭, 접두사 검색, 한국어 로마자 표기 지원이 포함된 클라이언트 측 검색 엔진을 제공합니다. 논블로킹 검색 작업을 위해 Web Worker를 사용합니다.

| 속성 | 값 |
|------|-----|
| 레이어 | 2 (도메인) |
| 의존성 | minisearch, @soundblue/core |
| React 필요 | 예 (훅용) |

## 내보내기

### `/core`

React 의존성 없는 핵심 검색 엔진.

```typescript
import { SearchEngine, type SearchConfig } from '@soundblue/search/core';

// 검색 엔진 생성
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

// 문서 인덱싱
await engine.addDocuments([
  { id: '1', word: '안녕', romanization: 'annyeong', translations: { en: 'hello' } },
  { id: '2', word: '감사', romanization: 'gamsa', translations: { en: 'thanks' } },
]);

// 검색
const results = engine.search('hello');
// [{ id: '1', word: '안녕', score: 1.5, ... }]

// 한국어 로마자 표기로 검색
const results2 = engine.search('annyeong');
// [{ id: '1', word: '안녕', score: 1.2, ... }]
```

### `/react`

검색 기능을 위한 React 훅.

```typescript
import { useSearch, useSearchWorker } from '@soundblue/search/react';

// 간단한 검색 훅
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
        placeholder="검색..."
      />
      {isLoading && <span>검색 중...</span>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.word}</li>
        ))}
      </ul>
    </div>
  );
}

// Web Worker 검색 (대용량 데이터셋용)
function LargeSearchComponent() {
  const { query, setQuery, results, isReady } = useSearchWorker({
    workerUrl: '/search-worker.js',
    debounce: 150,
  });

  if (!isReady) return <span>검색 인덱스 로딩 중...</span>;

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

## 검색 설정

```typescript
interface SearchConfig {
  // 검색을 위해 인덱싱할 필드
  fields: string[];

  // 결과에 저장할 필드 (문서의 부분집합)
  storeFields?: string[];

  // 검색 옵션
  searchOptions?: {
    // 접두사 매칭 활성화 ("hel"이 "hello" 매칭)
    prefix?: boolean;

    // 퍼지 매칭 임계값 (0-1, 높을수록 더 퍼지)
    fuzzy?: number;

    // 필드 부스트 가중치
    boost?: Record<string, number>;

    // 최대 결과 수
    maxResults?: number;
  };
}
```

## 성능 팁

1. **10,000개 이상 항목에는 Web Worker 사용**
2. **검색 입력 디바운스**로 리렌더링 감소
3. **검색 결과에 최소 필드만 저장**
4. **빌드 시점에 인덱스 사전 빌드**로 초기 로드 속도 향상
